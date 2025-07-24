---
title: Migrate Tomcat Applications to Azure Container Apps
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 08/05/2022
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
recommendations: false
---

# Migrate Tomcat applications to Azure Container Apps

This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure Container Apps (ACA).

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources.md)]

[!INCLUDE [inventory-secrets](includes/inventory-secrets.md)]

[!INCLUDE [determine-whether-and-how-the-file-system-is-used](includes/determine-whether-and-how-the-file-system-is-used.md)]

### Identify session persistence mechanism

To identify the session persistence manager in use, inspect the **context.xml** files in your application and Tomcat configuration. Look for the `<Manager>` element, and then note the value of the `className` attribute.

Tomcat's built-in [PersistentManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html) implementations, such as [StandardManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Standard_Implementation) or [FileStore](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Nested_Components) aren't designed for use with a distributed, scaled platform such as ACA. ACA may load balance among several instances and transparently restart any instance at any time, so persisting mutable state to a file system isn't recommended.

If session persistence is required, you'll need to use an alternate `PersistentManager` implementation that will write to an external data store, such as VMware Tanzu Session Manager with Redis Cache.

### Special cases

Certain production scenarios may require more changes or impose more limitations. While such scenarios can be infrequent, it's important to ensure that they're either inapplicable to your application or correctly resolved.

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with containerized Tomcat deployments. If your application is scaled out, one scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server.

#### Determine whether your application contains OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code-no-title](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

#### Determine whether MemoryRealm is used

[MemoryRealm](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/realm/MemoryRealm.html) requires a persisted XML file. On ACA, you'll need to add this file to the container image or upload it to shared storage that is made available to containers. (For more information, see the [Identify session persistence mechanism](#identify-session-persistence-mechanism) section.) The `pathName` parameter will have to be modified accordingly.

To determine whether `MemoryRealm` is currently used, inspect your **server.xml** and **context.xml** files and search for `<Realm>` elements where the `className` attribute is set to `org.apache.catalina.realm.MemoryRealm`.

### In-place testing

Before you create container images, migrate your application to the JDK and Tomcat that you intend to use on ACA. Test your application thoroughly to ensure compatibility and performance.

### Parameterize the configuration

In the pre-migration, you'll likely have identified secrets and external dependencies, such as datasources, in **server.xml** and **context.xml** files. For each item thus identified, replace any username, password, connection string, or URL with an environment variable.

[!INCLUDE [security-note](../includes/security-note.md)]

For example, suppose the **context.xml** file contains the following element:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="jdbc:postgresql://postgresdb.contoso.com/wickedsecret?ssl=true"
    driverClassName="org.postgresql.Driver"
    username="postgres"
    password="{password}"
/>
```

In this case, you could change it as shown in the following example:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="${postgresdb.connectionString}"
    driverClassName="org.postgresql.Driver"
    username="${postgresdb.username}"
    password="${postgresdb.password}"
/>
```

## Migration

> [!NOTE]
> Some Tomcat deployments may have multiple applications running on a single Tomcat server. If this is the case in your deployment, we strongly recommend running each application in a separate pod. This enables you to optimize resource utilization for each application while minimizing complexity and coupling.

### Prepare the deployment artifacts

Clone the [Tomcat on Containers Quickstart](https://github.com/Azure/tomcat-container-quickstart) GitHub repository. This repository contains a Dockerfile and Tomcat configuration files with many recommended optimizations. In the steps below, we outline modifications you'll likely need to make to these files before building the container image and deploying to ACA.

#### Add JNDI resources

Edit **server.xml** to add the resources you prepared in the pre-migration steps, such as Data Sources, as shown in the following example:

[!INCLUDE [security-note](../includes/security-note.md)]

```xml
<!-- Global JNDI resources
      Documentation at /docs/jndi-resources-howto.html
-->
<GlobalNamingResources>
    <!-- Editable user database that can also be used by
         UserDatabaseRealm to authenticate users
    -->
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml"
               />

    <!-- Migrated datasources here: -->
    <Resource
        name="jdbc/dbconnection"
        type="javax.sql.DataSource"
        url="${postgresdb.connectionString}"
        driverClassName="org.postgresql.Driver"
        username="${postgresdb.username}"
        password="${postgresdb.password}"
    />
    <!-- End of migrated datasources -->
</GlobalNamingResources>
```

[!INCLUDE[Tomcat datasource additional instructions](includes/tomcat-datasource-additional-instructions.md)]

### Build and push the image

The simplest way to build and upload the image to Azure Container Registry (ACR) for use by ACA is to use the `az acr build` command. This command doesn't require Docker to be installed on your computer. For example, if you have the Dockerfile from the [tomcat-container-quickstart](https://github.com/Azure/tomcat-container-quickstart) repo and the application package **petclinic.war** in the current directory, you can build the container image in ACR with the following command:

```azurecli
az acr build \
    --registry $acrName \
    --image "${acrName}.azurecr.io/petclinic:{{.Run.ID}}" 
    --build-arg APP_FILE=petclinic.war \
    --build-arg SERVER_XML=prod.server.xml .
```

You can omit the `--build-arg APP_FILE...` parameter if your WAR file is named **ROOT.war**. You can omit the `--build-arg SERVER_XML...` parameter if your server XML file is named **server.xml**. Both files must be in the same directory as **Dockerfile**.

Alternatively, you can use Docker CLI to build the image locally by using the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires Docker CLI to be installed and Docker daemon to be running.

```azurecli
# Build the image locally.
sudo docker build . --build-arg APP_FILE=petclinic.war -t "${acrName}.azurecr.io/petclinic:1"

# Run the image locally.
sudo docker run -d -p 8080:8080 "${acrName}.azurecr.io/petclinic:1"

# You can now access your application with a browser at http://localhost:8080.

# Sign in to ACR.
sudo az acr login --name $acrName

# Push the image to ACR.
sudo docker push "${acrName}.azurecr.io/petclinic:1"
```

For more information, see [Build and store container images with Azure Container Registry](/training/modules/build-and-store-container-images/).

### Deploy to Azure Container Apps

The following command shows an example deployment:

```azurecli
az containerapp create \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --environment <ENVIRONMENT_NAME> \
    --image <IMAGE_NAME> \
    --target-port 8080 \
    --ingress 'external' \
    --registry-server <REGISTRY_SERVER> \
    --min-replicas 1
```

For a more in-depth quickstart, see [Quickstart: Deploy your first container app](/azure/container-apps/get-started?tabs=bash).

## Post-migration

Now that you've migrated your application to ACA, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more Cloud native.

### Recommendations

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a multi-region deployment architecture. For more information, see [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](/azure/aks/operator-best-practices-multi-region).

* Evaluate the items in the **logging.properties** file. Consider eliminating or reducing some of the logging output to improve performance.

* Consider monitoring the code cache size and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance. For more information, see [Codecache Tuning](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) in the Oracle documentation.

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions.

* Consider replicating the Azure Container Apps deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

* If geo-replication isn't necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.

---
title: Migrate Tomcat Applications to containers on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run in an Azure Kubernetes Service container.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 1/20/2020
---

# Migrate Tomcat applications to containers on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing Tomcat application to run on Azure Kubernetes Service (AKS).

## Pre-migration steps

* [Inventory JNDI Resources](#inventory-jndi-resources)
* [Inventory Secrets](#inventory-secrets)
* [Inventory Persistence Usage](#inventory-persistence-usage)
* [Special Cases](#special-cases)
* [In-Place Testing](#in-place-testing)

### Inventory JNDI resources

Inventory all JNDI resources. Some, such as JMS message brokers, may require migration or reconfiguration.

#### Inside your application

Inspect the *META-INF/context.xml* file. Look for `<Resource>` elements inside the `<Context>` element.

#### On the application server(s)

Inspect the *$CATALINA_BASE/conf/context.xml* and *$CATALINA_BASE/conf/server.xml* files and the *.xml* files found in *$CATALINA_BASE/conf/[engine-name]/[host-name]* directories.

In *context.xml* files, JNDI resources will be described by the `<Resource>` elements inside the top level `<Context>` element.

In *server.xml* files, JNDI resources will be described by the `<Resource>` elements inside the `<GlobalNamingResources>` element.

#### Datasources

Datasources are JNDI resources with the `type` attribute set to `javax.sql.DataSource`. For each datasource, document the following information:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

#### All other JNDI resources

It isn't feasible to document every possible external dependency in this guide. It's your team's responsibility to verify that every external dependency of your application can be satisfied after the migration.

### Inventory Secrets

#### Passwords and secure strings

Check all properties and configuration files on the production server(s) for any secret strings and passwords. Be sure to check *server.xml* and *context.xml* in *$CATALINA_BASE/conf*. Configuration files containing passwords or credentials may also be found inside your application. These files may include *META-INF/context.xml*, and, for Spring Boot applications, *application.properties* or *application.yml* files.

#### Certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

### Inventory Persistence Usage

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by Tomcat modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content (for example, via an Apache integration), an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Storage shares can be [mounted as persistent volumes](/azure/aks/azure-files-dynamic-pv).

### Identify session persistence mechanism

To identify the session persistence manager in use, inspect the *context.xml* files in your application and Tomcat configuration. Look for the `<Manager>` element, and then note the value of the `className` attribute.

Tomcat's built-in [PersistentManager](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html) implementations, such as [StandardManager](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html#Standard_Implementation) or [FileBasedStore](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html#Nested_Components) aren't designed for use with a distributed, scaled platform such as Kubernetes. AKS may load balance among several pods and transparently restart any pod at any time, persisting mutable state to a file system isn't recommended.

If session persistence is required, you'll need to use an alternate `PersistentManager` implementation that will write to an external data store, such as the [Pivotal Session Manager with Redis Cache](/azure/app-service/containers/configure-language-java#use-redis-as-a-session-cache-with-tomcat).

### Special Cases

#### Determine whether application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, can't be used with containerized Tomcat deployments. If your application is scaled out, one scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server.

#### Determine whether your application contains OS-specific code

If your application contains any code that is accommodating the OS your application is running on, then your application needs to be refactored to NOT rely on the underlying OS. For instance, any uses of `/` or `\` in file system paths may need to be replaced with [`File.Separator`](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#separator) or [`Path.get`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Paths.html#get-java.lang.String-java.lang.String...-).

#### Determine whether MemoryRealm is used

[MemoryRealm](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/realm/MemoryRealm.html) requires a persisted XML file. On Kubernetes, this file will need to be added to the container image or uploaded to [shared storage that is made available to containers](#identify-session-persistence-mechanism). The `pathName` parameter will have to be modified accordingly.

To determine whether `MemoryRealm` is currently used, inspect your *server.xml* and *context.xml* files and search for `<Realm>` elements where the `className` attribute is set to `org.apache.catalina.realm.MemoryRealm`.

#### Determine whether SSL session tracking is used

In containerized deployments, SSL sessions are typically offloaded outside the application container, usually by the ingress controller. If your application requires [SSL session tracking](https://tomcat.apache.org/tomcat-9.0-doc/servletapi/javax/servlet/SessionTrackingMode.html#SSL), ensure the SSL traffic gets passed through to the application container directly.

#### Determine whether AccessLogValve is used

If [AccessLogValve](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/valves/AccessLogValve.html) is used, the `directory` parameter should be set to a [mounted Azure Files share](/azure/aks/azure-files-dynamic-pv) or one of its subdirectories.

### In-Place Testing

Before you create container images, migrate your application to the JDK and Tomcat that you intend to use on AKS. Test your application thoroughly to ensure compatibility and performance.

### Parametrize the Configuration

In the pre-migration, you'll likely have identified secrets and external dependencies, such as datasources, in *server.xml* and *context.xml* files. For each item thus identified, replace any username, password, connection string, or URL with an environment variable.

For example, suppose the *context.xml* file contains the following element:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="jdbc:postgresql://postgresdb.contoso.com/wickedsecret?ssl=true"
    driverClassName="org.postgresql.Driver"
    username="postgres"
    password="t00secure2gue$$"
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

With the exception of the first step ("Provision Container Registry and AKS"), we recommend that you follow the steps below individually for each application (WAR file) you wish to migrate.

> [!NOTE]
> Some Tomcat deployments may have multiple applications running on a single Tomcat server. If this is the case in your deployment, we strongly recommend running each application in a separate pod. This enables you to optimize resource utilization for each application while minimizing complexity and coupling.

### Provision Container Registry and AKS

Create a container registry and an Azure Kubernetes cluster whose Service Principal has the Reader role on the registry. Be sure to [choose the appropriate network model](/azure/aks/operator-best-practices-network#choose-the-appropriate-network-model) for your cluster's networking requirements.

```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az aks create -g $resourceGroup -n $aksName --attach-acr $acrName --network-plugin azure
```

### Prepare the deployment artifacts

Clone Azure's [Tomcat On Containers GitHub repository](https://github.com/Azure/tomcat-container-quickstart). It contains a Dockerfile and Tomcat configuration files with a number of recommended optimizations. In the steps below, we outline modifications you'll likely need to make to these files before building the container image and deploying to AKS.

#### Open ports for clustering, if needed

If you intend to use [Tomcat Clustering](https://tomcat.apache.org/tomcat-9.0-doc/cluster-howto.html) on AKS, ensure that the necessary port ranges are exposed in the Dockerfile. In order to specify the server IP address in `server.xml`, be sure to use a value from a variable that is initialized at container startup to the pod's IP address.

Alternatively, session state can be [persisted to an alternate location](#identify-session-persistence-mechanism) to be available across replicas.

To determine whether your application uses clustering, look for the `<Cluster>` element inside the `<Host>` or `<Engine>` elements in the *server.xml* file.

#### Add JNDI resources

Edit *server.xml* to add the resources you prepared in the pre-migration steps, such as Data Sources.

For example:

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

### Build and Push the Image

The simplest way to build and upload the image to Azure Container Registry (ACR) for use by AKS is to use the `az acr build` command. This command doesn't require Docker to be installed on your computer. For example, if you have the Dockerfile above and the application package *petclinic.war* in the current directory, you can build the container image in ACR with one step:

```bash
az acr build -t "${acrName}.azurecr.io/petclinic:{{.Run.ID}}" -r $acrName --build-arg APP_FILE=petclinic.war --build-arg=prod.server.xml .
```

You can omit the `--build-arg APP_FILE...` parameter if your WAR file is named *ROOT.war*. You can omit the `--build-arg SERVER_XML...` parameter if your server XML file is named *server.xml*. Both files must be in the same directory as *Dockerfile*.

Alternatively, you can use Docker CLI to build the image locally. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires Docker CLI to be installed and Docker daemon to be running.

```bash
# Build the image locally
sudo docker build . --build-arg APP_FILE=petclinic.war -t "${acrName}.azurecr.io/petclinic:1"

# Run the image locally
sudo docker run -d -p 8080:8080 "${acrName}.azurecr.io/petclinic:1"

# Your application can now be accessed with a browser at http://localhost:8080.

# Log into ACR
sudo az acr login -n $acrName

# Push the image to ACR
sudo docker push "${acrName}.azurecr.io/petclinic:1"
```

For more in-depth information on building and storing container images in Azure, see the respective [Microsoft Learn course](/learn/modules/build-and-store-container-images/).

### Provision a Public IP Address

If your application is to be accessible from outside your internal or virtual network(s), a public static IP address will be required. This IP address should be provisioned inside cluster's node resource group.

```bash
nodeResourceGroup=$(az aks show -g $resourceGroup -n $aksName --query 'nodeResourceGroup' -o tsv)
publicIp=$(az network public-ip create -g $nodeResourceGroup -n applicationIp --sku Standard --allocation-method Static --query 'publicIp.ipAddress' -o tsv)
echo "Your public IP address is ${publicIp}."
```

### Deploy to AKS

[Create and apply your Kubernetes YAML file(s)](/azure/aks/kubernetes-walkthrough#run-the-application). If you're creating an external load balancer (whether to your application or to an ingress controller), be sure to provide the IP address provisioned in the previous section as the `LoadBalancerIP`.

Include [externalized parameters as environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Don't include secrets (such as passwords, API keys, and JDBC connection strings). Secrets are covered in the [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume) section.

### Configure Persistent Storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

You might want to [create a Persistent Volume using Azure Files](/azure/aks/azure-files-dynamic-pv) mounted to the Tomcat logs directory (*/tomcat_logs*) to retain logs centrally.

### Configure KeyVault FlexVolume

[Create an Azure KeyVault](/azure/key-vault/quick-create-cli) and populate all the necessary secrets. Then, configure a KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You'll need to modify the startup script (*startup.sh* in the [Tomcat on Containers](https://github.com/Azure/tomcat-container-quickstart) GitHub repository) to import the certificates into the local keystore on the container.

### Migrate scheduled jobs

To execute scheduled jobs on your AKS cluster, define [Cron Jobs](https://kubernetes.io/docs/tasks/job/automated-tasks-with-cron-jobs/) as needed.

## Post-migration steps

Now that you've migrated your application to AKS, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more Cloud native.

1. Consider [adding a DNS name](/azure/aks/ingress-static-ip#configure-a-dns-name) to the IP address allocated to your ingress controller or application load balancer.

1. Consider [adding HELM charts for your application](https://helm.sh/docs/topics/charts/). A helm chart allows you to parametrize your application deployment for use and customization by a more diverse set of customers.

1. Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

1. Enable [Azure Monitoring for the cluster](/azure/azure-monitor/insights/container-insights-enable-existing-clusters) to allow the collection of container logs, track utilization, and so on.

1. Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure [Prometheus Metrics scraping in Azure Monitor](/azure/azure-monitor/insights/container-insights-prometheus-integration) instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).

1. Evaluate the items in the *logging.properties* file. Consider eliminating or reducing some of the logging output to improve performance.

1. Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance.

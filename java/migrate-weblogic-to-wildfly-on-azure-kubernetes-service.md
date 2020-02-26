---
title: Migrate WebLogic applications to WildFly on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 2/12/2020
---

# Migrate WebLogic applications to WildFly on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.

## Before you start

If any of the pre-migration requirements can't be met, see the companion migration guides:

* [Migrate WebLogic applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)

## Pre-migration

<!-- shared content -->
### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production server(s) as well as the average and peak request counts and resource utilization. You'll need this information regardless of the migration path you choose. It is useful, for example, to help guide selection of the size of the VMs in your node pool, the amount of memory to be used by the container, and how many CPU shares the container would need.
<!-- end shared content -->

[!INCLUDE [inventory-all-secrets](includes/migration/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/migration/inventory-all-certificates.md)]

[!INCLUDE [inventory-jndi-resources](includes/migration/inventory-jndi-resources.md)]

[!INCLUDE [determine-whether-session-replication-is-used](includes/migration/determine-whether-session-replication-is-used.md)]

[!INCLUDE [document-datasources](includes/migration/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/migration/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/migration/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/migration/determine-whether-jms-queues-or-topics-are-in-use.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/migration/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/migration/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/migration/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/migration/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/migration/determine-whether-your-application-is-composed-of-multiple-wars.md)]

<!-- shared content -->
### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* and *weblogic-application.xml* files and capture their configurations.

Note if you want to be able to scale each of your web applications independently for better use of your AKS resources you should break up the EAR into separate web applications.
<!-- shared content -->

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/migration/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Validate that the supported Java version works correctly

Using WildFly on Azure Kubernetes Service requires a specific version of Java. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run

```bash
java -version
```

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, should NOT be used with Azure Kubernetes Service. Azure Kubernetes Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. Instead, the function can invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether WLST is used

If you currently use WebLogic Scripting Tool (WLST) to perform the deployment, you will need to assess what it is doing. If WLST is changing any (runtime) parameters of your application as part of the deployment, you will need to make sure those parameters conform to one of the following options:

1. They are externalized as app settings.
2. They are embedded in your application.
3. They are using the JBoss CLI during deployment.

If WLST is doing more than what is mentioned above, you will have some additional work to do during migration.

### Determine whether your application uses WebLogic specific APIs

If your application uses WebLogic-specific APIs, you will need to refactor your application to NOT use them. For example, if you have used a class mentioned in the [Java API Reference for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlapi/index.html?overview-summary.html), you have used a WebLogic-specific API in your application.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, it is recommended you refactor your application to NOT use them.

### Determine whether the Java EE Application Client feature is used

If you have client applications that connect to your (server) application using the Java EE Application Client feature, you will need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether a deployment plan was used

If a deployment plan was used to perform the deployment, you'll need to assess what the deployment plan is doing. If the deployment plan is a straight deploy, then you'll be able to deploy your web application without any changes. If the deployment plan is more elaborate, you'll need to determine whether you can use the JBoss CLI to properly configure your application as part of the deployment. If it isn't possible to use the JBoss CLI, you'll need to refactor your application in such a way that a deployment plan is no longer needed.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the Azure Kubernetes Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Validate if and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebLogic shared modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Files can be [mounted into the Azure Kubernetes Service pod](/azure/aks/concepts-storage).

### Determine whether JCA connectors are used

If your application uses JCA connectors you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebLogic, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the Docker image and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is used

If your application is using JAAS, then you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. Azure Kubernetes Service is capable of scaling, but if you've used the WebLogic Cluster API, you'll need to refactor your code to eliminate the use of that API.

<!-- shared content -->
### In-Place Testing

Prior to creation of container images, migrate your application to the JDK and WildFly that you intend to use on AKS. Test the application thoroughly to ensure compatibility and performance.
<!-- end shared content -->

## Migration

<!-- shared content -->
### Provision Azure Container Registry and Azure Kubernetes Service

Create a container registry and an Azure Kubernetes cluster whose Service Principal has the Reader role on the registry. Be sure to [choose the appropriate network model](/azure/aks/operator-best-practices-network#choose-the-appropriate-network-model) for your cluster's networking requirements.

```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az aks create -g $resourceGroup -n $aksName --attach-acr $acrName --network-plugin azure
```
<!-- end shared content -->

### Create a Docker image for WildFly

You will need to create a Dockerfile with the following:

1. A supported JDK
1. An install of WildFly
1. JVM runtime options
1. A way to pass in environment variables (if applicable)
1. [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume) (if applicable)
1. [Setup Data Sources](#setup-data-sources) (if applicable)
1. [Setup JNDI resources](#setup-jndi-resources) (if applicable)
1. [Review WildFly configuration](#review-wildfly-configuration)

> For your convenience we have created a quickstart in the [WildFly Container Quickstart GitHub repository](https://github.com/Azure/wildfly-container-quickstart) which you can use as a starting point for your Dockerfile and web application.

<!-- shared content -->
### Configure KeyVault FlexVolume

[Create an Azure KeyVault](/azure/key-vault/quick-create-cli) and populate all the necessary secrets. Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will need to make sure the startup script used to bootstrap WildFly imports the certificates into the keystore used by WildFly before starting the server.
<!-- end shared content -->

<!-- shared content -->
#### Setup Data Sources

To configure WildFly to access a data source you will need to add the JDBC driver JAR to your Docker image and execute the appropriate JBoss CLI commands to setup the data source when building your Docker image.

The steps to do so are outlined below for PostgreSQL, MySQL and SQL Server.

1. Download the JDBC driver for [PostgreSQL](https://jdbc.postgresql.org/download.html), [MySQL](https://dev.mysql.com/downloads/connector/j/), or [SQL Server](https://docs.microsoft.com/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

    Unpack the downloaded archive to get the driver .jar file.

1. Create a file with a name like `module.xml` and add the following markup. Replace the `<module name>` placeholder (including the angle brackets) with `org.postgres` for PostgreSQL, `com.mysql` for MySQL, or `com.microsoft` for SQL Server. Replace `<JDBC .jar file path>` with the name of the .jar file from the previous step, including the full path to the location you will place the file in your Docker image, for example in `/opt/database`.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="<module name>">
        <resources>
           <resource-root path="<JDBC .jar file path>" />
        </resources>
        <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
        </dependencies>
    </module>
    ```

1. Create a file with a name like `datasource-commands.cli` and add the following code. Replace `<JDBC .jar file path>` with the value you used in the previous step. Replace `<module file path>` with the file name and path from the previous step, for example `/opt/database/module.xml`.

    **PostgreSQL**

    ```console
    batch

    module add --name=org.postgres --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=postgres:add(driver-name=postgres,driver-module-name=org.postgres,driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)

    data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=$DATABASE_CONNECTION_URL --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker

    reload

    run batch

    shutdown

    ```

    **MySQL**

    ```console
    batch

    module add --name=com.mysql --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=mysql:add(driver-name=mysql,driver-module-name=com.mysql,driver-class-name=com.mysql.cj.jdbc.Driver)

    data-source add --name=mysqlDS --jndi-name=java:jboss/datasources/mysqlDS --connection-url=$DATABASE_CONNECTION_URL --driver-name=mysql --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=com.mysql.cj.jdbc.Driver --jta=true --use-java-context=true --exception-sorter-class-name=com.mysql.cj.jdbc.integration.jboss.ExtendedMysqlExceptionSorter

    reload

    run batch

    shutdown
    ```

    **SQL Server**

    ```console
    batch

    module add --name=com.microsoft --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=sqlserver:add(driver-name=sqlserver,driver-module-name=com.microsoft,driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver,driver-datasource-class-name=com.microsoft.sqlserver.jdbc.SQLServerDataSource)

    data-source add --name=sqlDS --jndi-name=java:jboss/datasources/sqlDS --driver-name=sqlserver --connection-url=$DATABASE_CONNECTION_URL --validate-on-match=true --background-validation=false --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLValidConnectionChecker --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLExceptionSorter

    reload

    run batch

    shutdown
    ```

1. Update the the JTA datasource configuration for your application:

    Open the `src/main/resources/META-INF/persistence.xml` file for your app and find the `<jta-data-source>` element. Replace its contents as shown here:

    **PostgreSQL**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

    **MySQL**

    ```xml
    <jta-data-source>java:jboss/datasources/mysqlDS</jta-data-source>
    ```

    **SQL Server**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

1. Add the following to your `Dockerfile` so the data source is created when you build your Docker image

    ```console
    RUN /bin/bash -c '<WILDFLY_INSTALL_PATH>/bin/standalone.sh --start-mode admin-only &' && \
    sleep 30 && \
    <WILDFLY_INSTALL_PATH>/bin/jboss-cli.sh -c --file=/opt/database/datasource-commands.cli && \
    sleep 30
    ```

1. Determine the `DATABASE_CONNECTION_URL` to use as they are different for each database server, and different than the values on the Azure portal. The URL formats shown here (and in the snippets above) are required for use by WildFly:

    **PostgreSQL**

    ```console
    jdbc:postgresql://<database server name>:5432/<database name>?ssl=true
    ```

    **MySQL**

    ```console
    jdbc:mysql://<database server name>:3306/<database name>?ssl=true\&useLegacyDatetimeCode=false\&serverTimezone=GMT
    ```

    **SQL Server**

    ```console
    jdbc:sqlserver://<database server name>:1433;database=<database name>;user=<admin name>;password=<admin password>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
    ```

1. When creating your deployment YAML at a later stage you will need to pass the following environment variables, `DATABASE_CONNECTION_URL`, `DATABASE_SERVER_ADMIN_FULL_NAME` and `DATABASE_SERVER_ADMIN_PASSWORD` with the appropriate values.

For more info on configuring database connectivity with WildFly, see [PostgreSQL](https://developer.jboss.org/blogs/amartin-blog/2012/02/08/how-to-set-up-a-postgresql-jdbc-driver-on-jboss-7), [MySQL](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#Using_other_Databases-Using_MySQL_as_the_Default_DataSource), or [SQL Server](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#d0e3898).
<!-- end shared content -->

<!-- shared content -->
#### Setup JNDI Resources

Each JNDI resource you need to configure on WildFly will generally follow the following recipe:

1. Download the necessary JAR files and copy them into the Docker image.
2. Create a WildFly module.xml referencing those JAR files.
3. Create any configuration needed by the specific JNDI resource.
4. Create JBoss CLI script to be used during Docker build to register the JNDI resource.
5. Add everything to Dockerfile.
6. Pass the appropriate environment variables in your deployment YAML.

The example below illustrates the steps needed to create the JNDI resource for JMS connectivity to Azure Service Bus.

1. Download the [Apache Qpid JMS provider](https://qpid.apache.org/components/jms/index.html)

    Unpack the downloaded archive to get the .jar files.

1. Create a file with a name like `module.xml` and add the following markup in `/opt/servicebus`. Make sure the version numbers of the JAR files align with the names of the JAR files of the previous step.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="org.jboss.genericjms.provider">
     <resources>
      <resource-root path="proton-j-0.31.0.jar"/>
      <resource-root path="qpid-jms-client-0.40.0.jar"/>
      <resource-root path="slf4j-log4j12-1.7.25.jar"/>
      <resource-root path="slf4j-api-1.7.25.jar"/>
      <resource-root path="log4j-1.2.17.jar"/>
      <resource-root path="netty-buffer-4.1.32.Final.jar" />
      <resource-root path="netty-codec-4.1.32.Final.jar" />
      <resource-root path="netty-codec-http-4.1.32.Final.jar" />
      <resource-root path="netty-common-4.1.32.Final.jar" />
      <resource-root path="netty-handler-4.1.32.Final.jar" />
      <resource-root path="netty-resolver-4.1.32.Final.jar" />
      <resource-root path="netty-transport-4.1.32.Final.jar" />
      <resource-root path="netty-transport-native-epoll-4.1.32.Final-linux-x86_64.jar" />
      <resource-root path="netty-transport-native-kqueue-4.1.32.Final-osx-x86_64.jar" />
      <resource-root path="netty-transport-native-unix-common-4.1.32.Final.jar" />
      <resource-root path="qpid-jms-discovery-0.40.0.jar" />
     </resources>
     <dependencies>
      <module name="javax.api"/>
      <module name="javax.jms.api"/>
     </dependencies>
    </module>
    ```

1. Create a `jndi.properties` file in `/opt/servicebus`.

    ```console
    connectionfactory.${MDB_CONNECTION_FACTORY}=amqps://${DEFAULT_SBNAMESPACE}.servicebus.windows.net?amqp.idleTimeout=120000&jms.username=${SB_SAS_POLICY}&jms.password=${SB_SAS_KEY}
    queue.${MDB_QUEUE}=${SB_QUEUE}
    topic.${MDB_TOPIC}=${SB_TOPIC}
    ```

1. Create a file with a name like `servicebus-commands.cli` and add the following code.

    ```console
    batch

    /subsystem=ee:write-attribute(name=annotation-property-replacement,value=true)
    /system-property=property.mymdb.queue:add(value=myqueue)
    /system-property=property.connection.factory:add(value=java:global/remoteJMS/SBF)
    /subsystem=ee:list-add(name=global-modules, value={"name" => "org.jboss.genericjms.provider", "slot" =>"main"}
    /subsystem=naming/binding="java:global/remoteJMS":add(binding-type=external-context,module=org.jboss.genericjms.provider,class=javax.naming.InitialContext,environment=[java.naming.factory.initial=org.apache.qpid.jms.jndi.JmsInitialContextFactory,org.jboss.as.naming.lookup.by.string=true,java.naming.provider.url=/opt/servicebus/jndi.properties])
    /subsystem=resource-adapters/resource-adapter=generic-ra:add(module=org.jboss.genericjms,transaction-support=XATransaction)
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd:add(class-name=org.jboss.resource.adapter.jms.JmsManagedConnectionFactory, jndi-name=java:/jms/${MDB_CONNECTION_FACTORY})
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd/config-properties=ConnectionFactory:add(value=${MDB_CONNECTION_FACTORY})
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd/config-properties=JndiParameters:add(value="java.naming.factory.initial=org.apache.qpid.jms.jndi.JmsInitialContextFactory;java.naming.provider.url=/opt/servicebus/jndi.properties")
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd:write-attribute(name=security-application,value=true)
    /subsystem=ejb3:write-attribute(name=default-resource-adapter-name, value=generic-ra)

    run-batch

    reload

    shutdown

    ```

1. Add the following to your `Dockerfile` so the JNDI resource is created when you build your Docker image

    ```console
    RUN /bin/bash -c '<WILDFLY_INSTALL_PATH>/bin/standalone.sh --start-mode admin-only &' && \
    sleep 30 && \
    <WILDFLY_INSTALL_PATH>/bin/jboss-cli.sh -c --file=/opt/servicebus/servicebus-commands.cli && \
    sleep 30
    ```

1. When creating your deployment YAML at a later stage you will need to pass the following environment variables, `MDB_CONNECTION_FACTORY`, `DEFAULT_SBNAMESPACE` and `SB_SAS_POLICY`, `SB_SAS_KEY`, `MDB_QUEUE`, `SB_QUEUE`, `MDB_TOPIC` and `SB_TOPIC` with the appropriate values.
<!-- end shared content -->

<!-- shared content -->
### Review WildFly configuration

Please review the [WildFly Admin Guide](https://docs.wildfly.org/18/Admin_Guide.html) to make sure eveyrthing you have discovered in the pre-migration step and has not be covered by any of the previous migration steps is taken care of as part of your migration.
<!-- end shared content -->

<!-- shared content -->
### Build and push the Docker image to Azure Container Registry

Once you have created the Dockerfile you will need to build the Docker image and publish it to your Azure Container Registry.

If you used our [WildFly Container Quickstart GitHub repository](https://github.com/Azure/wildfly-container-quickstart) the process of building and pushing your image to your Azure Container Registry would be the equivalent of invoking the following 3 command lines below.

Build the WAR file:

```shell
mvn package
```

Log into your Azure Container Registry:

```shell
az acr login -n ${MY_ACR}
```

Build and push he image:

```shell
az acr build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME} -f src/main/docker/Dockerfile .
```

Where `MY_ACR` is the name of your Azure Container Registry and `MY_APP_NAME` is the name of the web application you want to use on your Azure Container Registry.

Or alternatively, you can use Docker CLI to first build and test the image locally. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires Docker CLI to be installed and Docker daemon to be running.

Build the image:

```shell
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally:

```shell
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Your application can now be accessed with a browser at http://localhost:8080.

Log into your Azure Container Registry:

```shell
az acr login -n ${MY_ACR}
```

Push the image to your Azure Container Registry:

```shell
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Where `MY_ACR` is the name of your Azure Container Registry and `MY_APP_NAME` is the name of the web application you want to use on your Azure Container Registry.

For more in-depth information on building and storing container images in Azure, see the respective [Microsoft Learn course](https://docs.microsoft.com/en-us/learn/modules/build-and-store-container-images/).
<!-- end shared content -->

<!-- shared content -->
### Provision a Public IP Address

If your application is to be accessible from outside your internal or virtual network(s), a public static IP address will be required. This IP address should be provisioned inside cluster's node resource group.

```bash
nodeResourceGroup=$(az aks show -g $resourceGroup -n $aksName --query 'nodeResourceGroup' -o tsv)
publicIp=$(az network public-ip create -g $nodeResourceGroup -n applicationIp --sku Standard --allocation-method Static --query 'publicIp.ipAddress' -o tsv)
echo "Your public IP address is ${publicIp}."
```
<!-- end shared content -->

<!-- shared content -->
### Deploy to AKS

[Create and apply your Kubernetes YAML file(s)](/azure/aks/kubernetes-walkthrough#run-the-application). If creating an external load balancer (whether to your application or to an ingress controller), be sure to provide the IP Address provisioned in the previous section as the `LoadBalancerIP`.

Include [externalized parameters as environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Don't include secrets (such as passwords, API keys, and JDBC connection strings). These are covered in the following section.

Be sure to include memory and CPU settings when creating your deployment YAML so your containers are properly sized.
<!-- end shared content -->

### Configure Persistent Storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

<!-- shared content -->
### Migrate scheduled jobs

To execute scheduled jobs on your AKS cluster, define [Cron Jobs](https://kubernetes.io/docs/tasks/job/automated-tasks-with-cron-jobs/) as needed.
<!-- end shared content -->

## Post-migration

Now that you have your application migrated to Azure Kubernetes Service you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more cloud-native.

### Recommendations

 <!-- shared content -->
1. Consider [adding a DNS name](/azure/aks/ingress-static-ip#configure-a-dns-name) to your the IP address allocated to your ingress controller or application load balancer.

1. Consider [adding HELM charts for your application](https://helm.sh/docs/topics/charts/). A helm chart allows you to parametrize your application deployment for use and customization by a more diverse set of customers.

1. Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

1. Enable [Azure Monitoring for the cluster](/azure/azure-monitor/insights/container-insights-enable-existing-clusters). This allows Azure monitor to collect container logs, track utilization, etc.

1. Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure [Prometheus Metrics scraping in Azure Monitor](/azure/azure-monitor/insights/container-insights-prometheus-integration) instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).

1. Make sure your deployment file specifies how rolling updates are done. See [Rolling Update Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) for more information.

1. Setup auto scaling to deal with peek time loads. See [Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)](/azure/aks/cluster-autoscaler)

1. Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the JVM parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` in the Dockerfile to further optimize performance.
<!-- end shared content -->
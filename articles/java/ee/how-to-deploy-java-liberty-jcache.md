---
title: Using Azure Redis as session cache for WebSphere Liberty or Open Liberty
description: Using Azure Redis as session cache for WebSphere Liberty or Open Liberty.
author: KarlErickson
ms.author: karler
ms.reviewer: jiangma
ms.topic: how-to
ms.date: 02/14/2025
ms.custom: template-how-to, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, devx-track-azurecli, devx-track-extended-java
#Customer intent: As a Java developer, I want to build an application that uses Azure Redis as the HTTP session cache for WebSphere Liberty or Open Liberty.
---

# Using Azure Redis as session cache for WebSphere Liberty or Open Liberty

This article describes how to use Azure Redis as the HTTP session cache for WebSphere Liberty or Open Liberty.

In this guide, you'll:

* Create an Azure Managed Redis instance as session cache.
* Prepare a sample application that enables persistence of HTTP sessions.
* Run the sample application locally.

This article is intended to help you quickly get to deployment. Before going to production, you should 
explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WebSphere on 
Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your 
contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

* An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Prepare a local machine with Unix-like operating system installed - for example, Ubuntu, macOS, or Windows Subsystem for Linux.
* Install a Java Standard Edition (SE) implementation version 17 or later - for example, [Microsoft build of OpenJDK](/java/openjdk).
* Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
* Ensure that [Git](https://git-scm.com) is installed.

## Create an Azure Managed Redis instance

[Azure Managed Redis](/azure/azure-cache-for-redis/managed-redis/managed-redis-overview) provides an in-memory data store based on 
the [Redis Enterprise](https://redis.io/about/redis-enterprise/) software. Follow the steps in this section to create an Azure Managed Redis 
instance and note down its connection information. You use this information later to configure the sample application.

1. Follow the steps in [Quickstart: Create an Azure Managed Redis Instance](/azure/azure-cache-for-redis/quickstart-create-managed-redis) to 
create an Azure Managed Redis instance. Please carefully note the following:

   1. At step 4 of the section [Create a Redis instance](/azure/azure-cache-for-redis/quickstart-create-managed-redis#create-a-redis-instance), 
      select **Public Endpoint** for the **Connectivity** option in this guide for simplicity. For production, you should consider 
      using **Private Endpoint** for better security.

   1. At step 5 of the section [Create a Redis instance](/azure/azure-cache-for-redis/quickstart-create-managed-redis#create-a-redis-instance),
      enable **Access Keys Authentication** for the **Authentication** in this guide for simplicity. For optimal security, you're 
      recommended to use Microsoft Entra ID with managed identities to authorize requests against your cache, if possible. 
      Authorization by using Microsoft Entra ID and managed identities provides superior security and ease of use over shared access 
      key authorization. For more information about using managed identities with your cache, 
      see [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication).

1. After the deployment completes, select **Go to resource** if you're on the **Deployment** page. Otherwise, navigate to the Azure portal, find and select your Azure Managed Redis instance.

1. On the **Overview** page, note down the **Endpoint** value. You use this value as the `REDIS_CACHE_ENDPOINT` environment variable later.

1. Select **Settings** > **Authentication**. Select **Access keys** and note down the **Primary** value. You use this value as the `REDIS_CACHE_KEY` environment variable later.

1. Run the following command to export the environment variables `REDIS_CACHE_ENDPOINT` and `REDIS_CACHE_KEY`:

   ```bash
   export REDIS_CACHE_ENDPOINT=<your-redis-cache-endpoint>
   export REDIS_CACHE_KEY=<your-primary-access-key>
   ```

## Prepare the sample application

WebSphere Liberty or Open Liberty provides a session cache feature that enables you to store HTTP session data in a cache. In this guide, you use the [JCache Session Persistence](https://openliberty.io/docs/latest/reference/feature/sessionCache-1.0.html) feature to store the session data in the Azure Managed Redis instance.

Use the following commands to clone the sample code for this guide. The sample is in the [open-liberty-on-aks](https://github.com/Azure-Samples/open-liberty-on-aks) repository on GitHub. There are a few samples in the repository. This article uses *java-app-jcache*.

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
git checkout 20250212
cd java-app-jcache
```

If you see a message about being in `detached HEAD` state, this message is safe to ignore. It just means you checked out a tag.

The application has the following file structure:

```text
java-app-jcache/
├── pom.xml
├── pom-redisson.xml
└── src
    └── main
        ├── docker
        │   ├── Dockerfile
        │   └── Dockerfile-wlp
        ├── java
        ├── liberty
        │   └── config
        │       └── server.xml
        ├── redisson
        │   └── redisson-config.yaml
        ├── resources
        └── webapp
```

The **pom.xml** file is the Maven project file that contains the dependencies and plugins for the sample application. 

The **pom-redisson.xml** file contains the dependencies for the Redisson client library, and is used to copy dependencies to the shared resources directory of the Liberty server later.

The **java**, **resources**, and **webapp** directories contain the source code of the sample application.

In the **liberty/config** directory, the **server.xml** file is used to configure HTTP session cache for the Open Liberty and WebSphere Liberty.

In the **redisson** directory, the **redisson-config.yaml** file is used to configure the connection of the Azure Managed Redis instance.

The **docker** directory contains two Dockerfiles. **Dockerfile** is used to build an image with Open Liberty and **Dockerfile-wlp** is used to build an image with WebSphere Liberty.

## Run the sample application locally

Use the following steps to build and run your sample application locally. These steps use Maven and `liberty-maven-plugin`. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

1. Verify the current working directory is **java-app-jcache** in your local clone.
1. Run the Maven command `mvn clean package` and package the application.
1. Run `mvn -Predisson validate` to copy the Redisson configuration file to the specified location. This step also inserts the values of the environment variables `REDIS_CACHE_ENDPOINT` and `REDIS_CACHE_KEY` into the **redisson-config.yaml** file, which is referenced by the **server.xml** file.
1. Run `mvn dependency:copy-dependencies -f pom-redisson.xml -DoutputDirectory=target/liberty/wlp/usr/shared/resources` to copy the Redisson client library and its dependencies to the shared resources directory of the Liberty server.
1. Run the Maven command `mvn liberty:dev` and start the application. If the application is successfully started, you should see `The defaultServer server is ready to run a smarter planet.` in the command output.
   You should see output similar to the following if the Redis connection is successful.

   ```output
   [INFO] [err] [Default Executor-thread-3] INFO org.redisson.Version - Redisson 3.23.4
   [INFO] [err] [redisson-netty-2-7] INFO org.redisson.connection.pool.MasterPubSubConnectionPool - 1 connections initialized for redacted.<region>.redis.azure.net/<ip_address>:10000
   [INFO] [err] [redisson-netty-2-20] INFO org.redisson.connection.pool.MasterConnectionPool - 24 connections initialized for redacted.<region>.redis.azure.net/<ip_address>:10000
   ```

### Test the application

Open a web browser to `http://localhost:9080/` and you should see the application home page.

:::image type="content" source="media/how-to-deploy-java-liberty-jcache/run-succeeded-locally.png" alt-text="Screenshot of Java liberty application running successfully.":::

In the form **New coffee in session**, set values for fields **Name** and **Price**, and then select **Submit**. After a few seconds,  you'll see **Submit count: 1** displayed at the left bottom of the page.

:::image type="content" source="media/how-to-deploy-java-liberty-jcache/new-coffee-in-session.png" alt-text="Screenshot of sample application showing new coffee created and persisted in the session of the application.":::

To demonstrate that the session cache is persisted and can be retrieved in the same session, use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the application and restart it with `mvn liberty:dev` command. 

Then, refresh the application home page. You should see the same data displayed in the section **New coffee in session**. Stop the application when you're done testing.

Optionally, you can use the [redis-cli command-line tool](https://redis.io/docs/connect/cli/) to demonstrate that the session data is persisted in the Azure Managed Redis instance. In this guide, you use [Azure Cloud Shell](/azure/cloud-shell/overview) where the `redis-cli` tool is preinstalled. If you want to use the `redis-cli` tool on your local machine, you can install it by following the instructions in the document [Use the Redis command-line tool with Azure Managed Redis](/azure/azure-cache-for-redis/managed-redis/managed-redis-how-to-redis-cli-tool).

1. Launch the Azure Cloud Shell from the Azure portal. For more information, see [Get started with Azure Cloud Shell](/azure/cloud-shell/get-started/classic?tabs=azurecli). 
   * Select **Bash** as the shell environment.
   * Set your subscription that is used to create the Azure Managed Redis instance.

1. Run the similar command in Cloud Shell console with the values of the Redis endpoint and the primary access key you noted down earlier:

   ```bash
   export REDIS_CACHE_ENDPOINT=<your-redis-cache-endpoint>
   export REDIS_CACHE_KEY=<your-primary-access-key>
   ```

1. Run the following command to retrieve the hostname and port of the Azure Managed Redis instance:

   ```bash
   REDIS_CACHE_HOSTNAME=$(echo $REDIS_CACHE_ENDPOINT | cut -d':' -f1)
   REDIS_CACHE_PORT=$(echo $REDIS_CACHE_ENDPOINT | cut -d':' -f2)
   ```

1. Run the following command to connect to the Azure Managed Redis instance:

   ```bash
   redis-cli -p ${REDIS_CACHE_PORT} -h ${REDIS_CACHE_HOSTNAME} -a ${REDIS_CACHE_KEY} --tls
   ```

1. Once the connection is established, you can issue commands to your Azure Managed Redis instance. Run the following steps to check the session data:

   1. The session data is stored in the key `com.ibm.ws.session.attr.default_host%2F`. Run the following command to check if the key exists:

      ```redis-cli
      keys "com.ibm.ws.session.attr.default_host%2F"
      ```

      You should see `1) "com.ibm.ws.session.attr.default_host%2F"` in the output.

   1. Run the following command to view the session data:

      ```redis-cli
      hgetall "com.ibm.ws.session.attr.default_host%2F"
      ```

      You should see a few entries listed in the output, and one of them contains the value `**cafe.model.entity.Coffee[id=1, name=Coffee 3, price=30.0]**`, which is the coffee you created and persisted in the Azure Managed Redis instance.

### Containerize the application

Optionally, you can containerize the application and run it in a container. The sample application provides two Dockerfiles for Open Liberty and WebSphere Liberty. This guide uses Docker and the Dockerfile for Open Liberty to containerize the application, but you can use the Dockerfile for WebSphere Liberty by following the similar steps.

1. Install Docker for your OS. For more information, see [Get Docker](https://docs.docker.com/get-docker/).

1. Run the following command to build the Docker image:

   ```bash
   docker build -t javaee-cafe-jcache:v1 -f src/main/docker/Dockerfile .
   ```

1. Run the following command to start the Docker container:

   ```bash
   docker run -it --rm \
      -p 9080:9080 \
      --mount type=bind,source=$(pwd)/target/liberty/wlp/usr/servers/defaultServer/redisson-config.yaml,target=/config/redisson-config.yaml \
      javaee-cafe-jcache:v1
   ```

   Once the container is started, you can test it with similar steps as running the application locally.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the Azure Managed Redis instance is no longer needed, find its resource group name and delete it from the Azure portal.

For more information, see [Delete resource groups](/azure/azure-resource-manager/management/manage-resource-groups-portal#delete-resource-groups).

## Next steps

You can learn more from references used in this guide:

* [Configuring Liberty session persistence with JCache](https://www.ibm.com/docs/en/was-liberty/base?topic=manually-configuring-liberty-session-persistence-jcache)
* [JCache support of Redisson](https://redisson.org/glossary/jcache.html)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)

If you want to deploy the sample application to Azure, reference the following articles:

* [Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-liberty-app)
* [Deploy WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-liberty-app)
* [Deploy a Java application with Open Liberty or WebSphere Liberty on Azure Container Apps](deploy-java-liberty-app-aca.md)

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)
g

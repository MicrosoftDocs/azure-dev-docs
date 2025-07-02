---
title: Use Spring Data with Azure Cosmos DB for Apache Cassandra API
description: This article will walk you through the process of building, configuring, deploying, troubleshooting, and scaling Java Web apps in Azure App Service on Linux.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, spring-cloud-azure, devx-track-extended-java, linux-related-content
---

# Use Spring Data with Azure Cosmos DB for Apache Cassandra API

This article will walk you through the process of building, configuring, deploying, troubleshooting, and scaling Java Web apps in Azure App Service on Linux.

It will demonstrate the usage of the following components:

- [Spring Boot Starter with Azure Cosmos DB for NoSQL](configure-spring-boot-starter-java-app-with-cosmos-db.md)
- [Azure Cosmos DB](/azure/cosmos-db/sql-api-introduction)
- [App Service Linux](/azure/app-service/containers/app-service-linux-intro)

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

- In order to deploy a Java Web app to cloud, you need an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
- [Azure CLI 2.0](/cli/azure/install-azure-cli)
- [Java 8 JDK](../fundamentals/java-jdk-install.md)
- [Maven 3](http://maven.apache.org/)

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Clone the Sample Java Web App Repository

For this exercise you'll be using the Spring Todo app, which is a Java application built using [Spring Boot](https://spring.io/projects/spring-boot), [Spring Data for Azure Cosmos DB](./configure-spring-boot-starter-java-app-with-cosmos-db.md) and [Azure Cosmos DB](/azure/cosmos-db/sql-api-introduction).

1. Clone the Spring Todo app and copy the contents of the **.prep** folder to initialize the project:

   For bash:

   ```bash
   git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2.git
   yes | cp -rf .prep/* .
   ```

   For Windows:

   ```cmd
   git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2.git
   cd e2e-java-experience-in-app-service-linux-part-2
   xcopy .prep /f /s /e /y
   ```

1. Change the directory to the following folder in the cloned repo:

   ```bash
   cd initial\spring-todo-app
   ```

## Create an Azure Cosmos DB from Azure CLI

The following procedure creates Azure Cosmos DB database using CLI.

1. Sign in to your Azure CLI, and set your subscription ID.

   ```azurecli
   az login
   ```

1. Set the subscription ID if needed.

   ```azurecli
   az account set -s <your-subscription-id>
   ```

1. Create an Azure resource group, and save aside the resource group name for later use.

   ```azurecli
   az group create \
       --name <your-azure-group-name> \
       --location <your-resource-group-region>
   ```

1. Create the Azure Cosmos DB and specify the type as GlobalDocumentDB.
The name of the Azure Cosmos DB must use only lower case letters. Make sure to note the `documentEndpoint` field in the response. You need this value later.

   ```azurecli
   az cosmosdb create \
       --resource-group <your-resource-group-name> \
       --name <your-azure-COSMOS-DB-name-in-lower-case-letters> \
       --kind GlobalDocumentDB
   ```

1. Get your Azure Cosmos DB keys, record the `primaryMasterKey` value for later use.

   ```azurecli
   az cosmosdb keys list \
       --resource-group <your-azure-group-name> \
       --name <your-azure-COSMOSDB-name>
   ```

## Build and Run the App Locally

The following procedure runs the application on the development computer.

1. Within your console of choice, configure the environment variables shown in the following code sections with the Azure and Azure Cosmos DB connection information you gathered previously in this article. You need to provide a unique name for **WEBAPP_NAME** and value for the **REGION** variables.

   For Linux (Bash):

   ```bash
   export COSMOS_URI=<put-your-COSMOS-DB-documentEndpoint-URI-here>
   export COSMOS_KEY=<put-your-COSMOS-DB-primaryMasterKey-here>
   export COSMOS_DATABASE=<put-your-COSMOS-DATABASE-name-here>
   export RESOURCEGROUP_NAME=<put-your-resource-group-name-here>
   export WEBAPP_NAME=<put-your-Webapp-name-here>
   export REGION=<put-your-REGION-here>
   export SUBSCRIPTION_ID=<put-your-SUBSCRIPTION_ID-here>
   ```

   For Windows (Command Prompt):

   ```cmd
   set COSMOS_URI=<put-your-COSMOS-DB-documentEndpoint-URI-here>
   set COSMOS_KEY=<put-your-COSMOS-DB-primaryMasterKey-here>
   set COSMOS_DATABASE=<put-your-COSMOS-DATABASE-name-here>
   set RESOURCEGROUP_NAME=<put-your-resource-group-name-here>
   set WEBAPP_NAME=<put-your-Webapp-name-here>
   set REGION=<put-your-REGION-here>
   set SUBSCRIPTION_ID=<put-your-SUBSCRIPTION_ID-here>
   ```

   > [!NOTE]
   > If you'd like to provision these variables with a script, there is a template for Bash in the .prep directory that you can copy and use as a starting point.

1. Change the directory by using the following command:

   ```bash
   cd initial/spring-todo-app
   ```

1. Run the Spring Todo app locally with the following command:

   ```bash
   mvn package spring-boot:run
   ```

1. Once the application has started, you can validate the deployment by accessing the Spring Todo app here: `http://localhost:8080/`.

   ![Spring app running locally][SCDB01]

## Deploy to App Service Linux

The following procedure deploys the application to Linux on Azure.

1. Open the **pom.xml** file that you previously copied to the **initial/spring-todo-app** directory of the repository. Ensure that the [Maven Plugin for Azure App Service](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) is included as seen in the following **pom.xml** file. If the version isn't set to **1.14.0**, then update the value.

   ```xml
   <plugins> 
   
       <!--*************************************************-->
       <!-- Deploy to Java SE in App Service Linux           -->
       <!--*************************************************-->
          
       <plugin>
           <groupId>com.microsoft.azure</groupId>
           <artifactId>azure-webapp-maven-plugin</artifactId>
           <version>1.14.0</version>
           <configuration>
               <schemaVersion>v2</schemaVersion>
               <subscriptionId>${SUBSCRIPTION_ID}</subscriptionId>
               <!-- Web App information -->
               <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
               <appName>${WEBAPP_NAME}</appName>
               <region>${REGION}</region>
               <pricingTier>P1v2</pricingTier>
               <!-- Java Runtime Stack for Web App on Linux-->
               <runtime>
                   <os>Linux</os>
                   <javaVersion>Java 8</javaVersion>
                   <webContainer>Java SE</webContainer>
               </runtime>
               <deployment>
                   <resources>
                       <resource>
                           <directory>${project.basedir}/target</directory>
                           <includes>
                               <include>*.jar</include>
                           </includes>
                       </resource>
                   </resources>
               </deployment>
               <appSettings>
                   <property>
                       <name>COSMOS_URI</name>
                       <value>${COSMOS_URI}</value>
                   </property>
                   <property>
                       <name>COSMOS_KEY</name>
                       <value>${COSMOS_KEY}</value>
                   </property>
                   <property>
                       <name>COSMOS_DATABASE</name>
                       <value>${COSMOS_DATABASE}</value>
                   </property>
                   <property>
                       <name>JAVA_OPTS</name>
                       <value>-Dserver.port=80</value>
                   </property>
               </appSettings>
               
           </configuration>
       </plugin>            
       ...
   </plugins>
   ```

1. Deploy to Java SE in App Service Linux

   ```bash
   mvn azure-webapp:deploy
   ```

   ```bash
   // Deploy
   bash-3.2$ mvn azure-webapp:deploy
   [INFO] Scanning for projects...
   [INFO]
   [INFO] -------< com.azure.spring.samples:spring-todo-app >--------
   [INFO] Building spring-todo-app 2.0-SNAPSHOT
   [INFO] --------------------------------[ jar ]---------------------------------
   [INFO]
   [INFO] --- azure-webapp-maven-plugin:1.14.0:deploy (default-cli) @ spring-todo-app ---
   Auth type: AZURE_CLI
   Default subscription: Consoto Subscription(subscription-id-xxx)
   Username: user@contoso.com
   [INFO] Subscription: Consoto Subscription(subscription-id-xxx)
   [INFO] Creating app service plan...
   [INFO] Successfully created app service plan asp-spring-todo-app.
   [INFO] Creating web app spring-todo-app...
   [INFO] Successfully created Web App spring-todo-app.
   [INFO] Trying to deploy artifact to spring-todo-app...
   [INFO] Successfully deployed the artifact to https://spring-todo-app.azurewebsites.net
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  02:05 min
   [INFO] Finished at: 2021-05-28T09:43:19+08:00
   [INFO] ------------------------------------------------------------------------
   ```

1. Browse to your web app running on Java SE in App Service Linux:

   ```bash
   https://<WEBAPP_NAME>.azurewebsites.net
   ```

![Spring app running in App Service on Linux][SCDB02]

## Troubleshoot Spring Todo App on Azure by Viewing Logs

The following procedure opens log files on Azure.

1. Configure logs for the deployed Java Web app in Azure App Service in Linux:

   ```azurecli
   az webapp log config \
       --name ${WEBAPP_NAME} \
       --resource-group ${RESOURCEGROUP_NAME} \
       --web-server-logging filesystem
   ```

1. Open Java Web app remote log stream from a local machine:

   ```azurecli
   az webapp log tail \
       --name ${WEBAPP_NAME} \
       --resource-group ${RESOURCEGROUP_NAME}
   ```

   ```bash
   bash-3.2$ az webapp log tail --name ${WEBAPP_NAME}  --resource-group ${RESOURCEGROUP_NAME}
   2021-05-28T01:46:08.000655632Z   _____                               
   2021-05-28T01:46:08.000701432Z   /  _  \ __________ _________   ____  
   2021-05-28T01:46:08.000708133Z  /  /_\  \___   /  |  \_  __ \_/ __ \ 
   2021-05-28T01:46:08.000711733Z /    |    \/    /|  |  /|  | \/\  ___/ 
   2021-05-28T01:46:08.000714933Z \____|__  /_____ \____/ |__|    \___  >
   2021-05-28T01:46:08.000718233Z         \/      \/                  \/ 
   2021-05-28T01:46:08.000721333Z A P P   S E R V I C E   O N   L I N U X
   2021-05-28T01:46:08.000724233Z Documentation: http://aka.ms/webapp-linux
   ...
   ...
   2021-05-28T01:46:18.925044188Z   .   ____          _            __ _ _
   2021-05-28T01:46:18.925481392Z  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
   2021-05-28T01:46:18.926004297Z ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
   2021-05-28T01:46:18.926587603Z  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
   2021-05-28T01:46:18.926599403Z   '  |____| .__|_| |_|_| |_\__, | / / / /
   2021-05-28T01:46:18.926841806Z  =========|_|==============|___/=/_/_/_/
   2021-05-28T01:46:18.931157849Z  :: Spring Boot ::                (v2.4.5)
   ...
   ...
   2021-05-28T01:46:29.842553633Z 2021-05-28 01:46:29.842  INFO 124 --- [           main] c.azure.spring.   samples.TodoApplication   : Started TodoApplication in 12.635 seconds (JVM running for 17.664)
   2021-05-28T01:46:30.477951594Z 2021-05-28 01:46:30.477  INFO 124 --- [p-nio-80-exec-1] o.a.c.c.C.   [Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
   2021-05-28T01:46:30.483316162Z 2021-05-28 01:46:30.483  INFO 124 --- [p-nio-80-exec-1] o.s.web.   servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
   2021-05-28T01:46:30.485411088Z 2021-05-28 01:46:30.484  INFO 124 --- [p-nio-80-exec-1] o.s.web.   servlet.DispatcherServlet        : Completed initialization in 0 ms
   2021-05-28T01:47:19.683003828Z 2021-05-28 01:47:19.682  INFO 124 --- [p-nio-80-exec-9] c.a.s.s.   controller.TodoListController    : GET request access '/api/todolist' path.
   2021-05-28T01:47:26.069984388Z 2021-05-28 01:47:26.069  INFO 124 --- [-nio-80-exec-10] c.a.s.s.   controller.TodoListController    : POST request access '/api/todolist' path with item: Milk
   2021-05-28T01:47:26.649080678Z 2021-05-28 01:47:26.648  INFO 124 --- [p-nio-80-exec-1] c.a.s.s.   controller.TodoListController    : GET request access '/api/todolist' path.
   ```

## Scale out the Spring Todo App

Use the following procedure to scale the application.

1. Scale out Java Web app using Azure CLI:

   ```azurecli
   az appservice plan update \
       --number-of-workers 2 \
       --name ${WEBAPP_PLAN_NAME} \
       --resource-group ${RESOURCEGROUP_NAME}
   ```

## Next steps

- [Java in App Service Linux dev guide](/azure/app-service/containers/app-service-linux-java)
- [Azure for Java Developers](../index.yml)
To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### See also

For more information about using Spring Boot applications on Azure, see the following articles:

- [Deploy a Spring Boot application to Linux on Azure App Service](deploy-spring-boot-java-app-on-linux.md)

- [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Azure Cosmos DB Documentation]: /azure/cosmos-db/
[Azure for Java Developers]: ../index.yml
[Build a SQL API app with Java]: /azure/cosmos-db/create-sql-api-java 
[Spring Data for Azure Cosmos DB]: https://azure.microsoft.com/blog/spring-data-azure-cosmos-db-nosql-data-access-on-azure/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: https://azure.microsoft.com/services/devops/java/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: https://spring.io/projects/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[SCDB01]: media/configure-spring-app-with-cosmos-db-on-app-service-linux/SCDB01.png
[SCDB02]: media/configure-spring-app-with-cosmos-db-on-app-service-linux/SCDB02.png

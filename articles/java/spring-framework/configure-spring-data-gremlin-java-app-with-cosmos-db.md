---
title: How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API
description: Learn how to configure an application created with the Spring Boot Initializer with the Azure Cosmos DB SQL API.
services: cosmos-db
documentationcenter: java
ms.date: 01/10/2020
ms.service: cosmos-db
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: data-services
ms.custom: devx-track-java
---

# How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API

## Overview

The Spring Data Gremlin Starter provides Spring Data support for the Gremlin query language from Apache, which developers can use with any Gremlin-compatible data store.

This article demonstrates creating an Azure Cosmos DB by using the Azure portal for use with Gremlin API, then using the **[Spring Initializr]** to create a custom java application, and then add the Spring Data Gremlin Starter functionality to your custom application to store data in and retrieve data from your Azure Cosmos DB by using Gremlin.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.


## Create Resource

### Create Azure Cosmos DB

1. Browse to the Azure portal at <https://portal.azure.com/> and click `+Create a resource`.

   >[!div class="mx-imgBorder"]
   >![create-a-resource][create-a-resource-01]

1. Click `Databases`, and then click `Azure Cosmos DB`.

   >[!div class="mx-imgBorder"]
   >![create-azure-cosmos-db][create-a-resource-02]

1. On the `Azure Cosmos DB` page, enter the following information:

   * Choose the `Subscription` that you want to use for your database.
   * Specify whether to create a new `Resource Group` for your database, or choose an existing resource group.
   * Enter a unique `Account Name` to use as part of the Gremlin URI for your database. For example: if you entered `account-sample` for the `Account Name`, the Gremlin URI would be `account-samplewingtiptoysdata.gremlin.cosmosdb.azure.com`.
   * Choose `Gremlin (Graph)` for the API.
   * Specify the `Location` for your database.
   
1. When you have specified these options, click `Review + create`.

   >[!div class="mx-imgBorder"]
   >![create-azure-cosmos-db-account][create-a-resource-03]

1. Review the specification and click `Create` to create your database.

### Add a graph to your Azure Cosmos Database

1. On the Cosmos DB page, click `Data Explorer`, and then click `New Graph`.

   >[!div class="mx-imgBorder"]
   >![new-graph][create-a-graph-01]

1. When the `Add Graph` is displayed, enter the following information:

   * Specify a unique `Database id` for your database.
   * You can choose to specify your `Storage capacity`, or you can accept the default.
   * Specify a unique `Graph id` for your graph.
   * Specify a `Partition key`. For more information see [graph partition].
Click `OK`.
   
   When you have specified these options, click `OK` to create your graph.

   >[!div class="mx-imgBorder"]
   >![add-graph][create-a-graph-02]

1. After your graph has been created, you can use the `Data Explorer` to view it.

   >[!div class="mx-imgBorder"]
   >![graph-detail][create-a-graph-03]
   
   

## Create simple Spring Boot application with the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Fill project metadata then click `GENERATE`:

   >[!div class="mx-imgBorder"]
   >![spring-initializr][spring-initializr-01]

1. Unzip the file then import to your IDE.


## Update code according to the sample project

Modify the project like the sample project: [azure-spring-data-sample-gremlin].

1. Add dependency of `azure-spring-data-gremlin`

1. Delete all contents in `src/test/`

1. Add all java files in `src/main/java`, just like this sample does.

1. Update config in `src/main/resorces/application.properties`, where:

   | Field              | Description                                                                                                                                                                                                             |
   |--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `endpoint`         | Specifies the Gremlin URI for your database, which is derived from the unique **ID** that you specified when you created your Azure Cosmos DB earlier in this tutorial.                                                 |
   | `port`             | Specifies the TCP/IP port, which should be **443** for HTTPS.                                                                                                                                                           |
   | `username`         | Specifies the unique **Database id** and **Graph id** that you used when you added your graph earlier in this tutorial; this must be entered using the following syntax: "/dbs/**{Database id}**/colls/**{Graph id}**". |
   | `password`         | Specifies either the primary or secondary **Access key** that you copied earlier in this tutorial.                                                                                                                      |
   | `sslEnabled`       | Specifies whether to enable SSL.                                                                                                                                                                                           |
   | `telemetryAllowed` | Specify **true** if you want to enable telemetry; otherwise, **false**.
   | `maxContentLength` | Specifies max content length.                                                                                                                                                                                           |

1. About how to get password:

   >[!div class="mx-imgBorder"]
   >![get-password][get-password-01]

## Build and run the project

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. If your app start successfully, you can check the graph in Azure portal:

   >[!div class="mx-imgBorder"]
   >![execute-result][execute-result-01]


## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/developer/java/spring-framework)

### Additional Resources

For more information about Azure support for Gremlin and Graph API, see the following articles:

* [Introduction to Azure Cosmos DB: Graph API](/azure/cosmos-db/graph-introduction)

* [Azure Cosmos DB Gremlin graph support](/azure/cosmos-db/gremlin-support)

* [Azure Cosmos DB: Create a graph database using Java and the Azure portal](/azure/cosmos-db/create-graph-java)

* [Tutorial: Query Azure Cosmos DB Graph API by using Gremlin](/azure/cosmos-db/tutorial-query-graph)

* [Spring Data Gremlin Starter]

For more information about using Azure Cosmos DB and Java, see the following articles:

* [Azure Cosmos DB Documentation].

* [Azure Cosmos DB: Create a document database using Java and the Azure portal][Build a SQL API app with Java]

* [Spring Data for Azure Cosmos DB SQL API]

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-app-from-container-registry-using-maven-plugin.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Azure Cosmos DB Documentation]: /azure/cosmos-db/
[Azure for Java Developers]: /azure/developer/java/
[Build a SQL API app with Java]: /azure/cosmos-db/create-sql-api-java 
[Spring Data for Azure Cosmos DB SQL API]: https://azure.microsoft.com/blog/spring-data-azure-cosmos-db-nosql-data-access-on-azure/
[Spring Data Gremlin Starter]: https://github.com/Microsoft/spring-data-gremlin
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[graph partition]: https://docs.microsoft.com/azure/cosmos-db/graph-partitioning
[azure-spring-data-sample-gremlin]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-data-sample-gremlin

<!-- IMG List -->

[create-a-resource-01]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-resource-01.png
[create-a-resource-02]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-resource-02.png
[create-a-resource-03]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-resource-03.png

[create-a-graph-01]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-graph-01.png
[create-a-graph-02]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-graph-02.png
[create-a-graph-03]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/create-a-graph-03.png

[spring-initializr-01]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/spring-initializr-01.png

[get-password-01]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/get-password-01.png

[execute-result-01]: media/configure-spring-data-gremlin-java-app-with-cosmos-db/execute-result-01.png

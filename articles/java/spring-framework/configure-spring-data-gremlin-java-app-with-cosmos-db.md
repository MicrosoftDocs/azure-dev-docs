---
title: How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API
description: Learn how to configure an application created with the Spring Boot Initializr with the Azure Cosmos DB SQL API.
services: cosmos-db
documentationcenter: java
ms.date: 10/14/2020
ms.service: cosmos-db
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: data-services
ms.custom: devx-track-java
---

# How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API

This article shows how to use the Azure portal to create an Azure Cosmos DB resource for use with the Gremlin API. It then shows how to use [Spring Initializr] to create a custom Java application, and then add the Spring Data Gremlin Starter functionality to access your data using Gremlin.

The Spring Data Gremlin Starter provides Spring Data support for the Gremlin query language from Apache, which developers can use with any Gremlin-compatible data store.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.


## Create an Azure Cosmos DB account

### Create a Cosmos DB account using the Azure portal

1. Browse to the Azure portal at <https://portal.azure.com/> and select `+Create a resource`.

   >[!div class="mx-imgBorder"]
   >![create-a-resource][create-a-resource-01]

1. Select `Databases`, and then select `Azure Cosmos DB`.

   >[!div class="mx-imgBorder"]
   >![create-azure-cosmos-db][create-a-resource-02]

1. On the `Azure Cosmos DB` page, enter the following information:

   * Choose the `Subscription` that you want to use for your database.
   * Specify whether to create a new `Resource Group` for your database, or choose an existing resource group.
   * Enter a unique `Account Name` to use as part of the Gremlin URI for your database. For example: if you entered `account-sample` for the `Account Name`, the Gremlin URI would be `account-samplewingtiptoysdata.gremlin.cosmosdb.azure.com`.
   * Choose `Gremlin (Graph)` for the API.
   * Specify the `Location` for your database.
   
1. When you have specified these options, select `Review + create`.

   >[!div class="mx-imgBorder"]
   >![create-azure-cosmos-db-account][create-a-resource-03]

1. Review the specification and select `Create` to create your database.

1. When your database has been created, select **Go to resource**. It's also listed on your Azure **Dashboard**, as well as under the **All Resources** and **Azure Cosmos DB** pages. You can select your database on any of those locations to open the properties page for your cache.

1. When the properties page for your database is displayed, select **Keys** and copy your URI and access keys for your database; you will use these values in your Spring Boot application.

### Add a graph to your Azure Cosmos Database

1. On the Cosmos DB page, select `Data Explorer`, and then select `New Graph`.

   >[!div class="mx-imgBorder"]
   >![new-graph][create-a-graph-01]

1. When the `Add Graph` is displayed, enter the following information:

   * Specify a unique `Database id` for your database.
   * You can choose to specify your `Storage capacity`, or you can accept the default.
   * Specify a unique `Graph id` for your graph.
   * Specify a `Partition key`. For more information see [graph partition]. Select `OK`.
   
   When you have specified these options, select `OK` to create your graph.

   >[!div class="mx-imgBorder"]
   >![add-graph][create-a-graph-02]

1. After your graph has been created, you can use the `Data Explorer` to view it.

   >[!div class="mx-imgBorder"]
   >![graph-detail][create-a-graph-03]
   
   

## Create a simple Spring Boot application with the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application, specify your **Spring Boot** version with version 2.3.4, and then select **GENERATE**.

   >[!div class="mx-imgBorder"]
   >![spring-initializr][spring-initializr-01]
   
   > [!NOTE]
   > 1. The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: `com.example.wintiptoysdata`.
   > 2. Spring Initializr uses Java 11 as the default version. To use the Spring Boot Starters described in this topic, you must select Java 8 instead.

1. When prompted, download the project to a path on your local computer.

1. After you've extracted the files on your local system, import it to your IDE.


## Configure your Spring Boot app to use the Spring Data Gremlin Starter

We'll be replicating the configurations of the existing [Azure Spring Data Gremlin sample](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-data-sample-gremlin). Browse to the sample and follow the steps in this section to configure your Spring Boot app.

1. Locate the *pom.xml* file in the directory of your app; for example:

   *C:\SpringBoot\wingtiptoysdata\pom.xml*

   -or-

   */users/example/home/wingtiptoysdata/pom.xml*

1. Open the *pom.xml* file, and add the Spring Data Gremlin Starter to list of `<dependencies>`:

   ```xml
   <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-spring-data-gremlin</artifactId>
      <version>2.3.1-beta.1</version> <!-- {x-version-update;com.azure:azure-spring-data-gremlin;current} -->
    </dependency>
   ```

1. Save and close the *pom.xml* file.

1. Navigate to the *src/test/* folder, and delete all contents.

1. Navigate to the *src/main/java* folder in the sample app, and copy and overwrite this same directory to your local Spring Boot app.

1. On the *src/main/resources/application.properties* file, update the configurations to include:

   | Field              | Description                                                                                                                                                                                                             |
   |--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `endpoint`         | Specifies the Gremlin URI for your database, which is derived from the unique **ID** that you specified when you created your Azure Cosmos DB earlier in this quickstart.                                                 |
   | `port`             | Specifies the TCP/IP port, which should be **443** for HTTPS.                                                                                                                                                           |
   | `username`         | Specifies the unique **Database ID** and **Graph ID** that you used when you added your graph earlier in this quickstart; this must be entered using the following syntax: "/dbs/**{Database ID}**/colls/**{Graph ID}**". |
   | `password`         | Specifies either the primary or secondary **Access key** that you copied earlier in this quickstart.                                                                                                                      |
   | `sslEnabled`       | Specifies whether to enable SSL.                                                                                                                                                                                           |
   | `telemetryAllowed` | Specify **true** if you want to enable telemetry; otherwise, **false**.
   | `maxContentLength` | Specifies max content length.                                                                                                                                                                                           |

## Build and run the project

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. If your app starts successfully, you can check the graph in Azure portal:

   >[!div class="mx-imgBorder"]
   >![execute-result][execute-result-01]


## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring on Azure, continue to the Spring on Azure documentation.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

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

* [Deploy a Spring Boot application to Linux on Azure App Service](deploy-spring-boot-java-app-on-linux.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Azure Cosmos DB Documentation]: /azure/cosmos-db/
[Azure for Java Developers]: ../index.yml
[Build a SQL API app with Java]: /azure/cosmos-db/create-sql-api-java 
[Spring Data for Azure Cosmos DB SQL API]: https://azure.microsoft.com/blog/spring-data-azure-cosmos-db-nosql-data-access-on-azure/
[Spring Data Gremlin Starter]: https://github.com/Microsoft/spring-data-gremlin
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[graph partition]: /azure/cosmos-db/graph-partitioning
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

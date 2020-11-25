---
title: How to use Spring Data Apache Cassandra API with Azure Cosmos DB
description: Learn how to use Spring Data Apache Cassandra API with Azure Cosmos DB.
services: cosmos-db
documentationcenter: java
ms.date: 10/13/2020
ms.service: cosmos-db
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
---

# How to use Spring Data Apache Cassandra API with Azure Cosmos DB

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information using the [Azure Cosmos DB Cassandra API](/azure/cosmos-db/cassandra-introduction).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* [Curl](https://curl.haxx.se/) or similar HTTP utility to test functionality.
* A [Git](https://git-scm.com/downloads) client.

## Create an Azure Cosmos DB account

The following procedure creates and configures a Cosmos account in the Azure portal.

### Create a Cosmos DB account using the Azure portal

> [!NOTE]
> 
> You can read more detailed information about creating Azure Cosmos DB accounts in [Azure Cosmos DB Documentation](/azure/cosmos-db/).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **Create a resource**, then **Get started**, and then select **Azure Cosmos DB**.
    
   >[!div class="mx-imgBorder"]
   >![Create an Azure Cosmos DB account][COSMOSDB01]

1. Specify the following information:

   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Account name**: Choose a unique name for your Cosmos DB account; this will be used to create a fully-qualified domain name like *wingtiptoyscassandra.documents.azure.com*.
   - **API**: Specify *Cassandra* for this tutorial.
   - **Location**: Specify the closest geographic region for your database.
   
   >[!div class="mx-imgBorder"]
   >![Specify your Cosmos DB account settings][COSMOSDB02]
   
1. When you have entered all of the above information, click **Review + create**.

1. If everything looks correct on the review page, click **Create**.
   
   >[!div class="mx-imgBorder"]
   >![Review your Cosmos DB account settings][COSMOSDB03]

It will take a few minutes to deploy the database.

### Add a keyspace to your Azure Cosmos DB account

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **All Resources**, then select the Azure Cosmos DB account you just created.

1. Select **Data Explorer**, select down arrow and select **New Keyspace**. Enter a unique identifier for your **Keyspace id**, then select **OK**.
    
   >[!div class="mx-imgBorder"]
   >![Select New keyspace][COSMOSDB05]
   
   >[!div class="mx-imgBorder"]
   >![Create a Cosmos DB keyspace][COSMOSDB05-1]

### Retrieve the connection settings for your Azure Cosmos DB account

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **All Resources**, then select the Azure Cosmos DB account you just created.

1. Select **Connection strings**, and copy the values for the **Contact Point**, **Port**, **Username**, and **Primary Password** fields; you will use those values to configure your application later.
   
   >[!div class="mx-imgBorder"]
   >![Retrieve your Cosmos DB connection settings][COSMOSDB06]

## Configure the sample application

The following procedure configures the test application.

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-cassandra-on-azure.git
   ```

1. Locate the *application.properties* file in the *resources* directory of the sample project, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add or configure the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.data.cassandra.contact-points=wingtiptoyscassandra.cassandra.cosmos.azure.com
   spring.data.cassandra.port=10350
   spring.data.cassandra.username=wingtiptoyscassandra
   spring.data.cassandra.password=********
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `spring.data.cassandra.contact-points` | Specifies the **Contact Point** from earlier in this article. |
   | `spring.data.cassandra.port` | Specifies the **Port** from earlier in this article. |
   | `spring.data.cassandra.username` | Specifies your **Username** from earlier in this article. |
   | `spring.data.cassandra.password` | Specifies your **Primary Password** from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

Browse to the directory that contains the .pom file to build and test the application.

1. Build the sample application with Maven; for example:

   ```shell
   mvn clean package
   ```

1. Start the sample application; for example:

   ```shell
   java -jar target/spring-data-cassandra-on-azure-0.1.0-SNAPSHOT.jar
   ```

1. Create new records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s -d "{\"name\":\"dog\",\"species\":\"canine\"}" -H "Content-Type: application/json" -X POST http://localhost:8080/pets

   curl -s -d "{\"name\":\"cat\",\"species\":\"feline\"}" -H "Content-Type: application/json" -X POST http://localhost:8080/pets
   ```

   Your application should return values like the following:

   ```shell
   Added Pet{id=60fa8cb0-0423-11e9-9a70-39311962166b, name='dog', species='canine'}.

   Added Pet{id=72c1c9e0-0423-11e9-9a70-39311962166b, name='cat', species='feline'}.
   ```

1. Retrieve all of the existing records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s http://localhost:8080/pets
   ```

   Your application should return values like the following:

   ```json
   [{"id":"60fa8cb0-0423-11e9-9a70-39311962166b","name":"dog","species":"canine"},{"id":"72c1c9e0-0423-11e9-9a70-39311962166b","name":"cat","species":"feline"}]
   ```

## Summary

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information using the Azure Cosmos DB Cassandra API.

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Data]: https://spring.io/projects/spring-data
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[COSMOSDB01]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-01.png
[COSMOSDB02]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-02.png
[COSMOSDB03]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-03.png
[COSMOSDB05]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-05.png
[COSMOSDB05-1]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-05-1.png
[COSMOSDB06]: media/configure-spring-data-apache-cassandra-with-cosmos-db/create-cosmos-db-06.png
---
title: Use Spring Data with Azure Cosmos DB for MongoDB API
description: Learn how to use Spring Data MongoDB API with Azure Cosmos DB.
ms.date: 08/28/2024
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Data with Azure Cosmos DB for MongoDB API

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information using [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb-introduction).

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- A [Git](https://git-scm.com/downloads) client.

## Create an Azure Cosmos DB account

### Create an Azure Cosmos DB account using the Azure portal

> [!NOTE]
> You can read more detailed information about creating accounts in the [Azure Cosmos DB documentation](/azure/cosmos-db/).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **Create a resource**, then **Databases**, then **Azure Cosmos DB**.

1. On the **Select API option** screen, select **Azure Cosmos DB for MongoDB**.

   ![Azure portal, create a resource, select API option, Azure Cosmos DB for MongoDB selected.][COSMOSDB02]

1. Specify the following information:

   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Account name**: Choose a unique name for your Azure Cosmos DB account; this will be used to create a fully-qualified domain name like **wingtiptoysmongodb.documents.azure.com**.
   - **API**: Specify `Azure Cosmos DB for MongoDB API` for this tutorial.
   - **Location**: Specify the closest geographic region for your database.

1. When you've entered all of the above information, click **Review + create**.

1. If everything looks correct on the review page, click **Create**.

   ![Review your Azure Cosmos DB account settings.][COSMOSDB03]

### Retrieve the connection string for your Azure Cosmos DB account

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the Azure Cosmos DB account you just created.

1. Click **Connection strings**, and copy the value for the **Primary Connection String** field; you'll use that value to configure your application later.

   ![Retrieve your Azure Cosmos DB connection string.][COSMOSDB06]

## Configure the sample application

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/spring-guides/gs-accessing-data-mongodb.git
   ```

1. Create a **resources** directory in the **&lt;project root&gt;/complete/src/main** directory of the sample project, and create an **application.properties** file in the **resources** directory.

1. Open the **application.properties** file in a text editor, and add the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.data.mongodb.database=wingtiptoysmongodb
   spring.data.mongodb.uri=mongodb://wingtiptoysmongodb:AbCdEfGhIjKlMnOpQrStUvWxYz==@wingtiptoysmongodb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `spring.data.mongodb.database` | Specifies the name of your Azure Cosmos DB account from earlier in this article. |
   | `spring.data.mongodb.uri` | Specifies the **Primary Connection String** from earlier in this article. |

1. Save and close the **application.properties** file.

## Package and test the sample application

To build the application, browse to the directory **/gs-accessing-data-mongodb/complete**, which contains the **pom.xml** file.

1. Build the sample application with Maven, and configure Maven to skip tests; for example:

   ```shell
   mvn clean package -DskipTests
   ```

1. Start the sample application; for example:

   ```shell
   
   java -jar target/accessing-data-mongodb-complete-0.0.1-SNAPSHOT.jar
   ```

   Your application should return values like the following:

   ```
   Customers found with findAll():
   -------------------------------
   Customer[id=5c1b4ae4d0b5080ac105cc13, firstName='Alice', lastName='Smith']
   Customer[id=5c1b4ae4d0b5080ac105cc14, firstName='Bob', lastName='Smith']
   
   Customer found with findByFirstName('Alice'):
   --------------------------------
   Customer[id=5c1b4ae4d0b5080ac105cc13, firstName='Alice', lastName='Smith']
   Customers found with findByLastName('Smith'):
   --------------------------------
   Customer[id=5c1b4ae4d0b5080ac105cc13, firstName='Alice', lastName='Smith']
   Customer[id=5c1b4ae4d0b5080ac105cc14, firstName='Bob', lastName='Smith']
   ```

## Summary

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information using Azure Cosmos DB for MongoDB.

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### See also

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Data]: https://spring.io/projects/spring-data
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[COSMOSDB02]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-02.png
[COSMOSDB03]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-03.png
[COSMOSDB04]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-04.png
[COSMOSDB06]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-06.png

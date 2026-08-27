---
title: Use Spring Data with Azure Cosmos DB for MongoDB API
description: Learn how to use Spring Data with Azure Cosmos DB for MongoDB API to store and retrieve data in a sample Java app. Get started now.
ms.date: 08/19/2025
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Data with Azure Cosmos DB for MongoDB API

This article shows how to create a sample application that uses [Spring Data] to store and retrieve information by using [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb-introduction).

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- A [Git](https://git-scm.com/downloads) client.

## Create an Azure Cosmos DB account

### Create an Azure Cosmos DB account by using the Azure portal

> [!NOTE]
> For more information about creating accounts, see the [Azure Cosmos DB documentation](/azure/cosmos-db/).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **Create a resource**, select **Databases**, and then select **Azure Cosmos DB**.

1. On the **Select API option** screen, select **Azure Cosmos DB for MongoDB**.

   :::image type="content" source="media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-02.png" alt-text="Screenshot of the Azure portal Select API option screen with Azure Cosmos DB for MongoDB selected.":::

1. Specify the following information:

   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group or choose an existing resource group.
   - **Account name**: Choose a unique name for your Azure Cosmos DB account. This name is used to create a fully qualified domain name like `wingtiptoysmongodb.documents.azure.com`.
   - **API**: Specify `Azure Cosmos DB for MongoDB API` for this tutorial.
   - **Location**: Specify the closest geographic region for your database.

1. When you enter all of the preceding information, select **Review + create**.

1. If everything looks correct on the review page, select **Create**.

   :::image type="content" source="media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-03.png" alt-text="Screenshot of the review page showing the Azure Cosmos DB account settings before creation.":::

### Retrieve the connection string for your Azure Cosmos DB account

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, and then select the Azure Cosmos DB account you created.

1. Click **Connection strings**, and copy the value for the **Primary Connection String** field. Use this value to configure your application later.

   :::image type="content" source="media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-06.png" alt-text="Screenshot of the Connection strings page showing the Primary Connection String for the Azure Cosmos DB account.":::

## Configure the sample application

1. Open a command shell and clone the sample project by using a git command. For example:

   ```shell
   git clone https://github.com/spring-guides/gs-accessing-data-mongodb.git
   ```

1. Create a **resources** directory in the **&lt;project root&gt;/complete/src/main** directory of the sample project. Then, create an **application.properties** file in the **resources** directory.

1. Open the **application.properties** file in a text editor. Add the following lines to the file, and replace the sample values with the appropriate values from earlier:

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

To build the application, go to the directory **/gs-accessing-data-mongodb/complete**, which contains the **pom.xml** file.

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

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information by using Azure Cosmos DB for MongoDB.

## Clean up resources

When you no longer need the resources, use the [Azure portal](https://portal.azure.com/) to delete them. Deleting the resources helps you avoid unexpected charges.

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

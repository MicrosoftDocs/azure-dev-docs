---
title: How to use Spring Data MongoDB API with Azure Cosmos DB
description: Learn how to use Spring Data MongoDB API with Azure Cosmos DB.
services: cosmos-db
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: cosmos-db
ms.tgt_pltfrm: multiple
ms.topic: article
---

# How to use Spring Data MongoDB API with Azure Cosmos DB

## Overview

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information using the [Azure Cosmos DB MongoDB API](/azure/cosmos-db/mongodb-introduction).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* A [Git](https://git-scm.com/downloads) client.

## Create an Azure Cosmos DB account

### Create a Cosmos DB account using the Azure Portal

> [!NOTE]
> 
> You can read more detailed information about creating Azure Cosmos DB accounts in [Azure Cosmos DB Documentation](/azure/cosmos-db/).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Databases**, and then click **Azure Cosmos DB**.

   ![Create an Azure Cosmos DB account][COSMOSDB01]

1. Specify the following information:

   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Account name**: Choose a unique name for your Cosmos DB account; this will be used to create a fully-qualified domain name like *wingtiptoysmongodb.documents.azure.com*.
   - **API**: Specify `Azure Cosmos DB for MongoDB API` for this tutorial.
   - **Location**: Specify the closest geographic region for your database.

   ![Specify your Cosmos DB account settings][COSMOSDB02]
   
1. When you have entered all of the above information, click **Review + create**.

1. If everything looks correct on the review page, click **Create**.

   ![Review your Cosmos DB account settings][COSMOSDB03]

### Retrieve the connection string for your Azure Cosmos DB account

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the Azure Cosmos DB account you just created.

   ![Select your Azure Cosmos DB account][COSMOSDB04]

1. Click **Connection strings**, and copy the value for the **Primary Connection String** field; you will use that value to configure your application later.

   ![Retrieve your Cosmos DB connection string][COSMOSDB06]

## Configure the sample application

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/spring-guides/gs-accessing-data-mongodb.git
   ```

1. Create a *resources* directory in the *&lt;project root&gt;/complete/src/main* directory of the sample project, and create an *application.properties* file in the *resources* directory.

1. Open the *application.properties* file in a text editor, and add the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.data.mongodb.database=wingtiptoysmongodb
   spring.data.mongodb.uri=mongodb://wingtiptoysmongodb:AbCdEfGhIjKlMnOpQrStUvWxYz==@wingtiptoysmongodb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `spring.data.mongodb.database` | Specifies the name of your Cosmos DB account from earlier in this article. |
   | `spring.data.mongodb.uri` | Specifies the **Primary Connection String** from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

1. Build the sample application with Maven, and configure Maven to skip tests; for example:

   ```shell
   mvn clean package -DskipTests
   ```

1. Start the sample application; for example:

   ```shell
   java -jar target/gs-accessing-data-mongodb-0.1.0.jar
   ```
    
   Your application should return values like the following:

   ```json
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

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information using the Azure Cosmos DB MongoDB API.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure for Java Developers]: /java/azure/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Data]: https://spring.io/projects/spring-data
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[COSMOSDB01]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-01.png
[COSMOSDB02]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-02.png
[COSMOSDB03]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-03.png
[COSMOSDB04]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-04.png
[COSMOSDB06]: media/configure-spring-data-mongodb-with-cosmos-db/create-cosmos-db-06.png

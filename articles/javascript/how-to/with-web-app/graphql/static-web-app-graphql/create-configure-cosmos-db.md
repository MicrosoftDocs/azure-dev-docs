---
title: Create and configure Cosmos DB resource
description: Learn how to create and configure your Cosmos DB resource to support this GraphQL app.
ms.topic: how-to
ms.date: 07/14/2021
ms.custom: devx-track-js
---

# 4. Create and configure Cosmos DB resource

In this article, learn how to create and configure your Cosmos DB resource to support this GraphQL app.

## Create the CosmosDB resource for Core (SQL)

Use the VS Code extension, Azure Databases, to create the Cosmos DB. 

1. In VS Code, select the Azure icon to open the Azure explorer.
1. From the Azure explorer, select **+** in the Azure Databases section.
1. Follow the prompts using the following table to understand how to create your **Azure CosmosDB** resource.

    |Prompt|Value|
    |--|--|
    |Select an Azure Database Server|Core (SQL)|
    |Account name|Enter an account name, which will become part of the connection string, such as `cosmosdb-sql-YOUR-ALIAS`, replacing `YOUR-ALIAS` with your email or company alias. |
    |Select a capacity model.|For this simple, low-use tutorial, select [**Serverless** throughput](/azure/cosmos-db/throughput-serverless)|
    |Select a resource group for new resources.|Create a new resource group. Remember this resource group name, you'll use it again when you create the Azure Static Web App.|
    |Enter the name of the new resource group.|Accept the default value, which is the same as the account name you entered.| 
    |Select a location for new resources.|Select a location in your geographical area.|

## Secure database by limiting firewall access

1. In the Azure explorer, right-click the new database resource, and select **Open in portal**.
1. From the **Settings** section, select the **Firewall and virtual networks** menu item.
1. Select **Selected networks**, then select **+ Add my current IP**.
1. Select **Accept connections from within public Azure datacenters**. This will allow the Static web app, when it is created, to access your database.
1. Select **Save**. Your database is now only accessible to your workstation. 

    You can leave the browser open to the database resource. When you add data to your database, use the **Data Explorer** to see that data. 

## Create a database and container for your trivia game

1. In the web browser, within the Azure portal for your new Cosmos DB resource, select **Data Explorer**.
1. Select **New Container**.
1. In the side-panel, enter the following settings:

    |Setting|Value|
    |--|--|
    |Database ID|`trivia`|
    |Container ID|`game`|
    |Partition key|`modelType`|

    Accept defaults for all other values.

1. Select **OK** to finish the local database creation process. 

## Load JSON file into remote Cosmos DB container

Load the 100 trivia questions into the container. 

1. Select the `trivia` database, then the `game`container, then **Items**. 
1. Select **Upload item**, then select the folder icon in the side-panel, then select the location for the `./api/trivia.json` file, then select **Upload**. 
1. Refresh the container to see the 100 items with the modelType of `Question`.

    An example of one of the questions in the container is:

    ```json
    {
        "id": "0",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What does CPU stand for?",
        "correct_answer": "Central Processing Unit",
        "incorrect_answers": [
            "Central Process Unit",
            "Computer Personal Unit",
            "Central Processor Unit"
        ],
        "modelType": "Question",
        "_rid": "t1EcAJE92MQBAAAAAAAAAA==",
        "_self": "dbs/t1EcAA==/colls/t1EcAJE92MQ=/docs/t1EcAJE92MQBAAAAAAAAAA==/",
        "_etag": "\"00000000-0000-0000-7e5b-22dca8c401d7\"",
        "_attachments": "attachments/",
        "_ts": 1626890792
    }
    ```

## Copy and keep your connection string 

In VS Code, for the Azure explorer, right-click your Cosmos DB resource, then select **Copy Connection String**. You'll need this to connection your Static Web App to your Cosmos DB resource.

## Information you need moving forward

You should have the following information before continuing:

* Azure resource group name used to create your Cosmos DB resource. You'll use the same group name for your Azure Static Web App
* Cosmos DB connection string - you'll set an application setting for your Static Web App, for the Function API to use. 

## Next steps

* [Deploy the app, both client and API, as a single Static web app](remote-deployment.md)

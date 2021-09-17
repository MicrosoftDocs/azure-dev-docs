---
title: Create and configure an Azure Cosmos DB resource
description: Learn how to create and configure your Azure Cosmos DB resource to support this GraphQL app.
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-js
---

# 4. Create and configure your Azure Cosmos DB resource

In this article, learn how to create and configure your Azure Cosmos DB resource to support this GraphQL app.

## Create the resource for Core (SQL)

Use the Visual Studio Code extension, Azure Databases, to create the resource. 

1. In Visual Studio Code, select the **Azure** icon to open the Azure explorer.
1. From the Azure explorer, in the **Azure Databases** section, select **+**.
1. Follow the prompts by using the following table to create your Azure Cosmos DB resource.

    |Prompt|Value|
    |--|--|
    |*Select an Azure Database Server*|Core (SQL)|
    |*Account name*|Enter an account name, which will become part of the connection string, such as `cosmosdb-sql-YOUR-ALIAS`. Replace `YOUR-ALIAS` with your email or company alias. |
    |*Select a capacity model*|For this simple, low-use tutorial, select **Serverless** throughput.|
    |*Select a resource group for new resources*|Create a new resource group. Remember this resource group name, because you'll use it again when you create the app in Static Web App.|
    |*Enter the name of the new resource group*|Accept the default value, which is the same as the account name you entered.| 
    |*Select a location for new resources*|Select a location in your geographical area.|

## Secure database by limiting firewall access

Here's how:

1. In the Azure explorer, right-click the new database resource, and select **Open in portal**.
1. From the **Settings** section, select **Firewall and virtual networks**.
1. Select **Selected networks** > **+ Add my current IP**.
1. Select **Accept connections from within public Azure datacenters**. This allows the static web app, when it's created, to access your database.
1. Select **Save**. Your database is now only accessible to your workstation. 

    You can leave the browser open to the database resource. When you add data to your database, use **Data Explorer** to see that data. 

## Create a database and container for your trivia game

Here's how:

1. In the web browser, within the Azure portal for your new Azure Cosmos DB resource, select **Data Explorer**.
1. Select **New Container**.
1. In the side panel, enter the following settings:

    |Setting|Value|
    |--|--|
    |Database ID|`trivia`|
    |Container ID|`game`|
    |Partition key|`modelType`|

    Accept the defaults for all other values.

1. Select **OK** to finish the local database creation process. 

## Load the JSON file into the remote container

Load the 100 trivia questions into the container created with Azure Cosmos DB. 

1. Select the `trivia` database, then the `game`container, and then **Items**. 
1. Select **Upload item**, then select the folder icon in the side panel, and then select the location for the `./api/trivia.json` file. Then select **Upload**. 
1. Refresh the container to see the 100 items with the `modelType` of `Question`.

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

In Visual Studio Code, for the Azure explorer, right-click your Azure Cosmos DB resource. Then select **Copy Connection String**. You'll need this to connect your static web app to your resource.

## Note this information

You should have the following information before continuing:

* The Azure resource group name you used to create your Azure Cosmos DB resource. You'll use the same group name for your static web app.
* The Azure Cosmos DB connection string. You'll set an application setting for your static web app, for the Azure Functions API to use. 

## Next steps

* [Deploy the app, both client and API, as a single static web app](remote-deployment.md)

---
ms.custom:
ms.topic: include
ms.date: 09/06/2022
---


## Create Azure Database with Visual Studio Code

Use this procedure for the following types of resources for Azure Cosmos DB:

* Azure Cosmos DB databases with support for:
  * MongoDB
  * Graph (Apache Gremlin)
  * NoSQL (previously known as DocumentDB)
  * PostgreSQL

## Create an Azure Cosmos DB resource

1. Install the [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) extension for Visual Studio Code.
1. Open the Azure explorer. Select the Azure icon in the primary side bar or use the keyboard shortcut (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>).
1. Select the subscription where you want to create the database resource.
1. Right-click **Azure Cosmos DB** and select **Create server**.

    :::image type="content" source="../media/with-database/visual-studio-code-create-cosmos-db-resource.png" alt-text="Screenshot of Visual Studio Code's Azure explorer with the first step of the creation process for a Azure Cosmos DB resource shown.":::

1. Following a procedure below based on your database server.

## Create a MongoDB server for Azure Cosmos DB

1. Select **Azure Cosmos DB for MongoDB API** from the list of database server options.
1. Use the following table to answer the questions to create the **CosmosDB for MongoDB API** resource.

    |Prompt|Answer|
    |--|--|
    |Account name|Provide a unique name for the resource.|
    |Capacity model|Select **Provisioned Throughput** for constant usage. Select **Serverless** for less-frequent usage.|
    |Resource group|Select an existing resource group or create a new resource group. This is a logical unit of all resources associated with a certain product, feature, or website.|
    |Location|Select a location close to you.|

1. The Azure activity log displays the status.

<a name="create-a-postgresql-server-for-cosmos-db"></a>

## Create a PostgreSQL server for Azure Cosmos DB

1. Select one of the **PostgreSQL** options from the list.
1. Use the following table to answer the questions to create the resource.

    |Prompt|Answer|
    |--|--|
    |PostgreSQL server|Enter a name for your PostgreSQL server. This name is used as part of the connection string.|
    |SKU|Select the pricing and options SKU.|
    |Administrator user name|Enter an Administrator user name.|
    |Administrator password|Enter an Administrator password, then enter it a second time in the next screen to confirm.|
    |Resource group|Select an existing resource group or create a new resource group. This is a logical unit of all resources associated with a certain product, feature, or website.|
    |Location|Select a location close to you.|
    |||

1. The Azure activity log displays the status.

    :::image type="content" source="../media/visual-studio-code-database/azure-activity-log.png" alt-text="Partial screenshot showing the Azure activity log while resource creation is in progress.":::

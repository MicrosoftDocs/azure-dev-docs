---
ms.custom: devx-track-js
ms.topic: include
ms.date: 05/24/2022
---


## Create Azure Database with Visual Studio Code

Use this procedure for the following types of resources:

* PostgreSQL
* Cosmos DB databases with support for 
    * MongoDB
    * Graph (Gremlin)
    * Core (_SQL_) (previously known as DocumentDB)

### Create a PostgreSQL database in Azure explorer

1. Install the [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) extension for Visual Studio Code.
1. In Visual Studio Code, select **Azure** from the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), then select the subscription where you want to crete the database resource.
1. Right-click **Cosmos DB** and select **Create server**. 

    :::image type="content" source="../media/visual-studio-code-database/create-cosmos-db-server.png" alt-text="Partial screenshot showing the Azure explorer with the Cosmos D B node selected with a popup menu showing the `Create Server` option.":::

## Create a MongoDB server

1. Select **Azure Cosmos DB for MongoDB API** from the list.

    :::image type="content" source="../media/howto-visual-studio-code/create-azure-database-server.png" alt-text="Select `PostgreSQL` from the list.":::

1. Use the following table to answer the questions to create the resource.

    |Prompt|Answer|
    |--|--|
    |Account name|Provide a unique name for the resource.|
    |Capacity model|Select **Provisioned Throughput** for constant usage. Select **Serverless** for less-frequent usage.|
    |Resource group|Select an existing resource group or create a new resource group. This is a logical unit of all resources associated with a certain product, feature, or website.|
    |Location|Select a location close to you.|

1. The Azure activity log displays the status. 
    

## Create a PostgreSQL server in Azure explorer

1. Select **PostgreSQL** from the list. 

    :::image type="content" source="../media/howto-visual-studio-code/create-azure-database-server.png" alt-text="Select `PostgreSQL` from the list.":::

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
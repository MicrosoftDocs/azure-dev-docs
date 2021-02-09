---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/08/2021
---


## Create Azure Database with Visual Studio Code extension

Use this procedure for the following types of resources:

* Azure Cosmos DB for MongoDB API
* SQL
* Azure Table
* Gremlin
* PostgreSQL 

1. Install the [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) extension for Visual Studio Code.
1. In Visual Studio Code, select **Azure** from the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), then select **Databases** from the [sidebar](https://code.visualstudio.com/docs/getstarted/userinterface).
1. Right-click the subscription name, then select **Create server**.
1. Select **PostgreSQL** from the list. 

    :::image type="content" source="../media/howto-visual-studio-code/create-azure-database-server.png" alt-text="Select `PostgreSQL` from the list.":::

1. Enter a name for your PostgreSQL server. This name is used as part of the connection string. 
1. Enter an Administrator user name. 
1. Enter an Administrator password, then enter it a second time in the next screen to confirm. 
1. Select your current IP address to add as the firewall rule. 
1. Select a resource group name or create a new one. 
1. Select an Azure region for your server. 
1. The notification window displays the status. 

    :::image type="content" source="../media/howto-visual-studio-code/create-azure-database-server-status.png" alt-text="The notification window displays the status.":::
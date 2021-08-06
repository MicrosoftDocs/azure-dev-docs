---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 08/06/2021
---


## Create and use database with VS Code extension

Create a Cosmos resource first because this will take several minutes. 

1. In Visual Studio Code, select the **Azure** icon in the left-most menu, then select the **Databases** section. 

    If the **Databases** section isn't visible, make sure you have checked the section in the top Azure **...** menu. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-azure-extension-select-database-section.png" alt-text="Partial screenshot of Visual Studio Code's remote container icon"::: 

1. In the **Databases** section of the Azure explorer, select your subscription with a right-click, then select **Create Server**.
1. In the **Create new Azure Database Server** Command Palette, select **Azure Cosmos DB for MongoDB API**. 
1. Follow the prompts using the following table to understand how your values are used. The database may take up to 15 minutes to create.

    |Property|Value|
    |--|--|
    |Enter a globally unique **Account name** name for the new resource.| Enter a value such as `cosmos-mongodb-YOUR-NAME`, for your resource. Replace `YOUR-NAME` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select or create a resource group.|Create a new resource group named `js-demo-mongodb-web-app-resource-group-YOUR-NAME-HERE`.|
    |Location|The location of the resource. For this tutorial, select a regional location close to you.|

    Creating the resource may take up to 15 minutes. You can move skip the next section if you are time-restricted but remember to back to finish this next section in a few minutes.

## Add firewall rule for your client IP address 

You need to use the [Azure CLI](/cli/azure/install-azure-cli) or the [Azure portal](https://portal.azure.com) to configure a firewall rule.

## Get the MongoDB connection string for your resource 

1. Select the **Azure explorer** from the Activity bar.
2. Select the Cosmos DB from the Side bar.
3. Right-click on the database and select **Copy connection string**.
  
  :::image type="content" source="../media/howto-database/get-connection-string-from-vscode-extension-cosmos-db.png" alt-text="Partial screenshot of VSCode displaying Azure Cosmos DB database in Azure explorer. ":::

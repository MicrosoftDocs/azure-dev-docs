In this section of the tutorial, create a cloud-based database and connect the remote app to use that cloud database. 

## Create a Cosmos database

Create a Cosmos resource to host a cloud-based MongoDB database. 

1. In Visual Studio Code, select the **Azure** icon in the left-most menu, then select the **Databases** section. 

    If the **Databases** section isn't visible, make sure you have checked the section in the top Azure **...** menu. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-azure-extension-select-database-section.png" alt-text="Partial screenshot of Visual Studio Code's remote container icon"::: 

1. In the **Databases** section of the Azure explorer, select your subscription with a right-click, then select **Create Server**.
1. In the **Create new Azure Database Server** Command Palette, select **Azure Cosmos DB for MongoDB API**. 
1. Follow the prompts using the following table to understand how your values are used. The database may take up to 15 minutes to create.

    |Property|Value|
    |--|--|
    |Enter a globally unique **Account name** name for the new resource.| Enter a value such as `cosmos-mongodb-YOUR-NAME`, for your resource. Replace `YOUR-NAME` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select or create a resource group.|If you need to create a resource group, use a naming convention that identifies the owner, purpose, and region such as `westus-cosmostutorial-joesmith`.|
    |Location|The location of the resource. For this tutorial, select a regional location close to you.|

    > [!CAUTION]
    > Creating the resource may take up to 15 minutes.     

1. View the newly created Cosmos resource in the explore. It doesn't have any databases yet. 
1. While still in the Azure Databases explorer, right-click the resource name, the select **Copy Connection String** to copy the connection string. You will need this later in the tutorial.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-databases-extenion-copy-connection-string.png" alt-text="Express.js web app form and data results from local MongoDB.":::

## Optional: Use new cloud database in local environment

In order to use the new cloud database, the local application needs to change to use the new connection string. 

1. In Visual Studio Code, open the `.env` file and add the **DATABASE_URL** value to new connection string. 
1. Add `&retrywrites=false` to the end of the connection string so that the database can be created the first time the web app runs. 
1. Run the web app locally, without using the development container, to make sure the app connects to the cloud database. 

## Use new cloud database in remote web app

The connection to the database is set with an environment variable named `DATABASE_URL`. In order to configure the remote web app to use that environment variable, you need to create that variable on the remote web app. 

1. In Visual Studio Code, in the Azure app service explorer, select and expand the web app service node.
1.  Right-click on the **Application Settings** node to add the `DATABASE_URL` property with the connection string for your Azure Cosmos DB for MongoDB. Add `&retrywrites=false` to the end of the connection string so that the database can be created the first time the web app runs. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-remote-web-app-application-settings.png" alt-text="Partial screenshot of Visual Studio Code's remote web app application settings"::: 

1. Open the remote web site in a browser, and use the form to add and delete data. 

## Want to know more? 

### MongoDB connection strings
Creating the database the first time the code runs may require retries so the connection string must have the `&retrywrites=false` setting. If you want to investigate more of this issue, start with this [public issue #1296](https://github.com/microsoft/vscode-cosmosdb/issues/1296) on GitHub. 
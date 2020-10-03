
## Create web app resource

Use the Visual Studio Code extension to create an App service resource and deploy the web app to the resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create new web app...`.

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/create-web-app-with-extension.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts, use the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `web-app-with-mongodb-<YOUR-NAME>`, for your App service resource. Replace `<YOUR-NAME>` with your name or unique id. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select a runtime for the Linux app.|Select `Node 12 LTS`.|

    When the app creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with a choice of `Deploy` or  `View output`. Select `Deploy`.

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/vscode-app-extension-create-web-app-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

1.  If the status message is no longer visible, you can deploy by selecting the Azure explorer, then right-click on the resource name, then select

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/vscode-app-extension-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app.":::

## Create JavaScript file to connect to mongoDB

Create a JavaScript code file which uses the Mongo API to insert and read data from a MongoDB database.

1. In the 
containing client creation with endpoint and key, create db and container if it doesn’t exist, insert method, getall method.

## Create ExpressJS routes to pass request to database

Create insert and getall routes that return DB response to browser and logging stream

## Verify app on local computer

## Redeploy to App service and verify cloud app works

## Troubleshooting tasks in tutorial

Use the following table to resolve issues with the tutorial. If you still are unable to resolve the issues, after trying the remedies, use the `Report issue` link in the related section.

|Step|Remedies|Report issue|
|--|--|--|
|Install the Azure Extension||[Report issue](https://www.research.net/r/PWZWZ52?tutorial=tutorial-azure-web-app-with-cosmosdb&step=install-vscode-extension-for-azure)|

## Next steps
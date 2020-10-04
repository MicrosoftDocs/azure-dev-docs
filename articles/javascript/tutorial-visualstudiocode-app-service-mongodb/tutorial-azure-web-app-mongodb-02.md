
## Create web app resource

Use the Visual Studio Code extension to create an App service resource and deploy the web app to the resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create new web app...`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/create-web-app-with-extension.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts, use the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `web-app-with-mongodb-<YOUR-NAME>`, for your App service resource. Replace `<YOUR-NAME>` with your name or unique id. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select a runtime for the Linux app.|Select `Node 12 LTS`.|

1. When the app creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with a choice of `Deploy` or  `View output`. Select `Deploy`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-extension-create-web-app-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

    If the status message is no longer visible, you can deploy by selecting the Azure explorer, then right-click on the resource name, then select **Deploy to Web App...**.

1. During the deployment process, a notification allows you to select to see the **output window**.  This displays the rolling status of the deployment. 

1. When the deployment is complete, a notification appears. Select **Stream logs** to see the rolling logs. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-service-deployed.png" alt-text="When the deployment is complete, a notification appears allowing you to select `Stream logs`.":::

1. Open the website in a browser, replace the text `YOUR-RESOURCE_NAME` with your own resource name: `https://YOUR-RESOURCE_NAME.azurewebsites.net`.

    TBD - add screenshot

    The website is now able to run locally and remotely, but still doesn't connect to the database. Let's fix in the next step.  

## Want to know more?

The initial web service is configured to run on port 8080 and is publicly available. These type of web site settings are configurable.
* [App settings](/app-service/configure-common)
* [Authentication](/app-service/configure-authentication-provider-microsoft)
* [Restrict access by network](/azure/app-service/app-service-ip-restrictions)
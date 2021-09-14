---
title: Deploy Azure Function app
description: Learn how to deploy an Azure Function app in Visual Studio Code to manage Azure resource groups.
ms.topic: how-to
ms.date: 09/13/2021
ms.custom: devx-track-js
---

# 3. Deploy resource manager function ap

In this article of the series, you deploy an Azure Function app in Visual Studio Code to manage Azure resource groups. 

## Use Visual Studio Code extension to deploy to hosting environment

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the blue up arrow to deploy your app:

    ![Deploy to Azure Functions command](../../../media/azure-function-resource-group-management/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>, entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Use the following table to complete the prompt to create a new Azure Function resource.

    |Prompt|Value|
    |--|--|
    |Selection Function App in Azure|Create new Function App in Azure ...Advanced|
    |Enter a globally unique name for the new function app|Use your normal naming conventions for the resource. For example, use the name of the local directory, then postpend your email alias or name, such as `typescript-function-resource-group-api-johnsmith`.|
    |Select a runtime stack.|Node.js X LTS - select one of the LTS versions of Node.js.|
    |Select an OS|Linux|
    |Select a resource group for new resources|Use your normal naming conventions for the resource group. For example, use the name of the local directory, then postpend your email alias or name, such as `resource-group-johnsmith`.|
    |Select a location for new resources|Select a location geographically close to you, for example `West US 2`.|
    |Select a hosting plan|Consumption|
    |Select a storage account|Create a new storage account|
    |Enter the name of the new storage account|Accept the default name|
    |Select an Application Insights resource|Create a new Application Insights resource.|
    |Enter the name of the new Application Insights resource.|Accept the default name|

    The Application Insights resource is optional but very important. This will help you to monitor your function app.

1. The VS Code **Output** panel for **Azure Functions** shows progress.  When deploying, the entire Functions application is deployed, so changes to all individual functions are deployed at once.

## Configure your Azure app settings

You need to configure your Azure app settings to connect to the Azure Function app. Locally, these settings are in your `local.settings.json` file. This process adds those values to your cloud app.

1. In Visual Studio Code, in the Azure explorer, select your function app, the right-click on **Application Settings** and select **Add New Setting**.
1. Add the four values from your `local.settings.json` with the exact same name and values.

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.
   * `AZURE_SUBSCRIPTION`: Your default subscription containing your resource groups. 

:::image type="content" source="../../../media/azure-function-resource-group-management/visual-studio-code-function-app-settings.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing the remote/cloud function's app settings.":::

## Verify Functions app is available with browser

1. While still in Visual Studio Code, use the **Azure Functions** explorer, expand the node for your Azure subscription, expand the node for your Functions app, then expand **Functions (read only)**. Right-click the function name and select **Copy Function Url**:

    :::image type="content" source="../../../media/azure-function-resource-group-management/copy-function-url-command.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing the where to copy the Function's URL.":::

1. Paste the URL into a browser and press Enter to request the resource group list from the cloud API. 

## Next steps

* [Add new APIs and redeploy your function app](deploy-azure-function-with-visual-studio-code.md)
---
title: Create Azure Function app
description: Learn how to create an Azure Function app in Visual Studio Code to manage Azure resource groups.
ms.topic: how-to
ms.date: 09/13/2021
ms.custom: devx-track-js
---

# 2. Create local Azure Function app in Visual Studio Code

In this article of the series, you create an Azure Function app in Visual Studio Code to manage Azure resource groups. 

## Create function app 

Use Visual Studio Code to create a local Function app.

1. In a bash terminal, create and change into a new directory:

    ```bash
    mkdir typescript-function-resource-group-api && cd typescript-function-resource-group-api
    ```

1. In a bash terminal, open Visual Studio Code:

    ```bash
    code .
    ```

1. Open the Visual Studio Code command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>.

1. Enter `Azure Functions: create new project`. Use the following table to finish the prompts:

    |Prompt|Value|
    |--|--|
    |Create new project|Accept the default name, `typescript-function-resource-group-api`.|
    |Select a language| Select **TypeScript**.|
    |Select a template for your project's first function|Select **HTTP trigger**.|
    |Create new HTTP trigger|Enter the API name of `resource-groups`. |
    |Authorization level|Select **anonymous**. If you continue with this project after this article series, change the authorization level to the function. Learn more about [Function-level authorization](/azure/azure-functions/security-concepts#function-access-keys).|

    The project boilerplate is created.

1. In a Visual Studio Code **integrated bash terminal**, install the project dependencies:

    ```bash
    npm install
    ```

## Add service principal settings to local.settings.json file

1. Open the `local.settings.json` file in the project root directory. 
1. Refer to your temporary copy of settings from the previous article to edit the _required_ environment variables. These environment variables are **REQUIRED for the context to use DefaultAzureCredential**. 

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.

1. You also need to set the subscription ID. It isn't required for the DefaultAzureCredential context but it is required to use the Azure SDK for resource management. 

   * `AZURE_SUBSCRIPTION`: Your default subscription containing your resource groups. 

This `local.settings.json` file is ignored on purpose so you don't accidentally commit it to your source code. 

## Install npm dependencies for Azure Identity and Resource management

In a Visual Studio Code **integrated bash terminal**, install the Azure SDK dependencies for Azure Identity and Resource management.

```bash
npm install @azure/identity @azure/arm-resources
```

## List all resource groups in subscription with JavaScript

1. Open the `./resource-groups/index.ts` file and replace the contents with the following: 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-groups/index.ts" highlight="7":::

    This file responds to API requests. 

1. Create a directory named `lib` and create a new file in that directory named `azure-resource-groups.ts`.
1. Copy the following code into the `azure-resource-groups.ts` file:

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/lib/azure-resource-groups.ts" range="1-17" highlight="6,9,12,15-17":::

    This file completes the following:
    * Gets the subscription ID
    * Creates the DefaultAzureCredential context
    * Creates the ResourceManagementClient required to use the Resource management SDK.
    * Gets all the resource groups in the subscription.

1. Create a new file in that directory named `environment-vars.ts` and copy the following code into that file. 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/lib/environment-vars.ts" highlight="1,16":::

    This file checks the environment variables before returning the subscription ID.

## Test local functions

1. Run the local project:

    ```bash
    npm start
    ```

1. Use the following cURL command to use the API:

    ```bash
    curl http://localhost:7071/api/resource-groups
    ```

## Troubleshooting

If you didn't get any results, check the following table for issues. If your issue isn't listed in the table, open an issue on this documentation page.

|Issue|Fix|
|--|--|
|The app didn't start.|Review the errors. Make sure you installed the required dependencies.|
|The app started but you can't get a 200 response.|Make sure your curl command is requesting from the correct local route.|
|The API returned a 200 response but returned no results.|Use the Visual Studio Code extension for Azure Resources to verify that your subscription has any resource groups. If you don't see any resource groups, don't worry. This article series adds an API to create and delete resource groups in your subscription. This API is added after the first deployment of the source code to Azure, so that you learn how to redeploy your code.|

## Next steps

* [Deploy your Azure Function app]()
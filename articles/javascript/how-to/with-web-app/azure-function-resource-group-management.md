---
title: JavaScript Resource group management API
description: Learn how to build a TypeScript Azure Function API to manage Azure resource groups.
ms.topic: how-to
ms.date: 03/24/2023
ms.custom: devx-track-ts
---

# Manage Azure resource groups with TypeScript Function API

In this article series, you'll create a local TypeScript Azure Function app with APIs to manage Azure resource groups and deploy the app to Azure.

Features and functionality of this article series:

* Create local TypeScript Azure Function app project in Visual Studio Code
* Create function APIs boilerplate code in Visual Studio Code
* Deploy to Azure Functions from Visual Studio Code
* Create service principal with Azure CLI
* Configure local and remote application settings with Visual Studio Code
* Use DefaultAzureCredential in both local and remote environments for passwordless connections
* Use Azure Identity and Azure Resource Management SDKs to manage Azure resources
* Use your local and cloud APIs to create, delete, and list resource groups in your subscription

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download) installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
    - [Azure Function](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to deploy a Function app to Azure.
- [Azure CLI](/cli/azure/install-azure-cli) installed to your local machine.

While the source code is written with TypeScript, the source code is simple. If you are comfortable with modern JavaScript, the code in this article series will be familiar to you.

## Application architecture

The app provides the following API endpoints.

|Method|URL|Description|
|--|--|--|
|POST,DELETE|http://localhost:7071/api/resource-group|Add, delete a resource group.|
|GET| http://localhost:7071/api/resource-groups |List all resource groups in subscription.|
|GET| http://localhost:7071/api/resources | List all resources in a subscription or resource group.|

While these endpoints are public in this article series, you _should_ secure your API endpoints with authentication and authorization before deploying to your live environment. 

This app is limited to a subscription because that is what the DefaultAzureCredential specifies. 

## 1. Preparing your environment

You must prepare your local and cloud environments to use the Azure Identity SDK.

#### Create an Azure service principal

An Azure service principal provides access to Azure without having to use your personal user credentials. The service principal can be used both in your local and cloud environments. 

1. In a bash terminal, [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli):

    ```azurecli
    az login
    ```
1. Determine a service principal name format so you can easily find your service principal later. For example, several format ideas are:

    * Your project and owner: `resource-management-john-smith`.
    * Your department and date: `IT-2021-September`
    * A unique identifier: `1e8966d7-ba85-424b-9db4-c39e1ae9d0ca`

1. In a bash terminal, create your service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac). Replace `<SUBSCRIPTION-ID>` with your subscription ID. 

    ```azurecli
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME --role Contributor --scopes /subscriptions/<SUBSCRIPTION-ID>
    ```

1. Copy the entire output results to a temporary file. You will need these settings later.

    ```json
    {
      "appId": "YOUR-SERVICE-PRINCIPAL-ID",
      "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
      "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
      "password": "..omitted...",
      "tenant": "YOUR-TENANT-ID"
    }
    ```

#### Get your Azure subscription ID

1. In a bash terminal, get your subscriptions and find the subscription ID you want to use for this article series.

    ```azurecli
    az account list --output table
    ```

1. Copy the subscription ID to the previous temporary file. You will need this setting later. 


## 2. Create local Azure Function app in Visual Studio Code

In this article of the series, you create an Azure Function app in Visual Studio Code to manage Azure resource groups. 

#### Create function app 

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

1. In a Visual Studio Code **integrated bash terminal**, opened with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd>, install the project dependencies:

    ```bash
    npm install
    ```

#### Add service principal settings to local.settings.json file

1. Open the `local.settings.json` file in the project root directory and edit your **VALUES** section with the four following environment variables. 

    :::code language="JSON" source="~/../js-e2e-azure-resource-management-functions/local.settings.json" highlight="6-9":::
 
1. Refer to your temporary copy of settings from the previous article to edit the _required_ environment variables. These environment variables are **REQUIRED for the context to use DefaultAzureCredential**. 

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.

1. You also need to set the subscription ID. It is required to use the Azure SDK for resource management. 

   * `AZURE_SUBSCRIPTION`: Your default subscription containing your resource groups. 

This `local.settings.json` file is ignored by your local **git** on purpose so you don't accidentally commit it to your source code. 

#### Install npm dependencies for Azure Identity and Resource management

In a Visual Studio Code **integrated bash terminal**, install the Azure SDK dependencies for Azure Identity and Resource management.

```bash
npm install @azure/identity @azure/arm-resources
```

#### List all resource groups in subscription with JavaScript

1. Open the `./resource-groups/index.ts` file and replace the contents with the following: 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-groups/index.ts" highlight="14":::

    This file responds to API requests. 

1. Create a root-level directory named `lib` and create a new file in that directory named `azure-resource-groups.ts`.
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

#### Test local functions

1. In the Visual Studio Code integrated terminal, run the local project:

    ```bash
    npm start
    ```

1. Wait until the integrated bash terminal displays the running function's URL.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-terminal-running-function.png" alt-text="Partial screenshot of Visual Studio Code's integrated bash terminal when the Azure Function is running locally and displaying the local URL for the APIs in the Function app.":::

1. Open a second integrated bash terminal in Visual Studio Code, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd>, and use the following cURL command to use the API:

    ```bash
    curl http://localhost:7071/api/resource-groups
    ```

    If you have many resource groups in your subscription, you may want to pipe the output to a file for easier review.

    ```bash
    curl http://localhost:7071/api/resource-groups > resource-groups.json
    ```

    The response includes `status` and a `list` of all resource groups in your subscription.

#### Troubleshooting

If you couldn't complete this article, check the following table for issues. If your issue isn't listed in the table, open an issue on this documentation page.

|Issue|Fix|
|--|--|
|The app didn't start.|Review the errors. Make sure you installed the required dependencies.|
|The app started but you can't get a 200 response.|Make sure your curl command is requesting from the correct local route.|
|The API returned a 200 response but returned no results.|Use the Visual Studio Code extension for Azure Resources to verify that your subscription has any resource groups. If you don't see any resource groups, don't worry. This article series adds an API to create and delete resource groups in your subscription. This API is added after the first deployment of the source code to Azure, so that you learn how to redeploy your code.|


## 3. Deploy resource manager function app

In this article of the series, you deploy an Azure Function app in Visual Studio Code to manage Azure resource groups. 

#### Use Visual Studio Code extension to deploy to hosting environment

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the blue up arrow to deploy your app:

    ![Deploy to Azure Functions command](../../media/azure-function-resource-group-management/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>, entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Use the following table to complete the prompt to create a new Azure Function resource.

    |Prompt|Value|
    |--|--|
    |Selection Function App in Azure|Create new Function App in Azure ...Advanced|
    |Enter a globally unique name for the new function app|Use your normal naming conventions for the resource. For example, use the name of the local directory, then postpend your email alias or name, such as `typescript-function-resource-group-api-johnsmith`.|
    |Select a runtime stack.|Node.js - select one of the LTS versions of Node.js.|
    |Select an OS|Linux|
    |Select a resource group for new resources|Use your normal naming conventions for the resource group. For example, use the name of the local directory, then postpend your email alias or name, such as `resource-group-johnsmith`.|
    |Select a location for new resources|Select a location geographically close to you, for example `West US 2`.|
    |Select a hosting plan|Consumption|
    |Select a storage account|Create a new storage account|
    |Enter the name of the new storage account|Accept the default name|
    |Select an Application Insights resource|Create a new Application Insights resource.|
    |Enter the name of the new Application Insights resource.|Accept the default name|

    The Application Insights resource is optional but important. This will help you to monitor your function app.

1. The VS Code **Output** panel for **Azure Functions** shows progress.  When deploying, the entire Functions application is deployed, so changes to all individual functions are deployed at once.

#### Configure your Azure app settings

You need to configure your Azure app settings to connect to the Azure Function app. Locally, these settings are in your `local.settings.json` file. This process adds those values to your cloud app.

1. In Visual Studio Code, in the Azure explorer, select your function app, the right-click on **Application Settings** and select **Add New Setting**.
1. Add the four values from your `local.settings.json` with the exact same name and values.

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.
   * `AZURE_SUBSCRIPTION`: Your default subscription containing your resource groups. 

:::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-function-app-settings.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing the remote/cloud function's app settings.":::

#### Verify Functions app is available with browser

1. While still in Visual Studio Code, use the **Azure Functions** explorer, expand the node for your Azure subscription, expand the node for your Functions app, then expand **Functions (read only)**. Right-click the function name and select **Copy Function Url**:

    :::image type="content" source="../../media/azure-function-resource-group-management/copy-function-url-command.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing where to copy the Function's URL.":::

1. Paste the URL into a browser and press Enter to request the resource group list from the cloud API. 

## 4. Add APIs to function app and redeploy to Azure

In this article of the series, you add APIs to add and delete resource groups, then redeploy your Azure Function app in Visual Studio Code. 

At this point in the article series, you created a local function app with one API to list your subscription's resource groups and you deployed that app to Azure. As an Azure developer, you may want to create or delete resource groups as part of your process automation pipeline. 

#### Create resource-group API for your function app

Use the Visual Studio Code extension for Azure Functions to add the APIs files to your function app. 

1. Open the Visual Studio Code command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>.
1. Enter `Azure Functions: Create Function` then press enter to begin the process.
1. Use the following table to create the **/api/resource-group** API:

    |Prompt|Value|
    |--|--|
    |Select a template for your function|HTTP trigger|
    |Provide a function name|`resource-group`|
    |Authorization level|Select **anonymous**. If you continue with this project after this article series, change the authorization level to the function. Learn more about [Function-level authorization](/azure/azure-functions/security-concepts#function-access-keys).|
1. To limit the function to adding and deleting resource groups, open the `./resource-group/function.json` and edit the methods to `POST` and `DELETE`.

    :::code language="JSON" source="~/../js-e2e-azure-resource-management-functions/resource-group/function.json" highlight="9":::

#### Add TypeScript code to add and delete resource groups

1. Open the `./resource-group/index.ts` file and replace the contents with the following: 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-group/index.ts" highlight="32,43,52,63":::

    This file depends on new functionality in the `./lib` directory.

1. Copy the following code into the bottom of the `azure-resource-groups.ts` file:

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/lib/azure-resource-groups.ts" range="18-32" highlight="25-28,31":::

#### Start your local function app and test the new API

1. In the Visual Studio Code integrated terminal, run the local project:

    ```bash
    npm start
    ```

1. Wait until the integrated bash terminal displays the running function's URL.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-terminal-running-function-post-delete.png" alt-text="Partial screenshot of Visual Studio Code's integrated bash terminal when the Azure Function is running locally and displaying the local URLs for the APIs in the Function app.":::

1. Use the following curl command in a different integrated bash terminal, to call your API, to add a resource group to your subscription. Change the name of the resource group to use your own naming conventions.

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-group/index.ts" range="11-13":::

1. Use the following curl command to see the new resource group listed in your subscription.

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-groups/index.ts" range="8":::

1. Use the following curl command to delete the resource group you just added. 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/resource-group/index.ts" range="15-17":::

#### Redeploy your function app with new APIs to Azure

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the blue up arrow to deploy your app:

    ![Deploy to Azure Functions command](../../media/azure-function-resource-group-management/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>, entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Select your function app from the list of apps.
1. Select **Deploy** from the pop-up window.
1. Wait until the deployment completes.

#### Verify Function APIs with browser

In the following cURL commands, replace `YOUR-RESOURCE-NAME` with your Azure Function resource name and `REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME` with your resource group name.

1. Use the following curl command in an integrated bash terminal, to call to add a resource group to your subscription. Change the name of the resource and resource group to use your own naming conventions.

    :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/README.md" range="59-61":::

1. Use the following curl command to see the new resource group listed in your subscription.

    :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/README.md" range="75":::

1. Use the following curl command to delete the resource group you just added. 

    :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/README.md" range="67-69":::

    Deleting a resource group will delete all resources within the group and may take a minute to complete.


## 5. View and query your Function app logs

In this article of the series, you view and query Azure Function app logs in the Azure portal.

#### Query your Azure Function logs

Use the Azure portal to view and query your function logs. 

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../media/azure-function-resource-group-management/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select **Application Insights** from the Settings, then select **View Application Insights data**.":::

    This link takes you to your separate metrics resource created for you when you created your Azure Function with VS Code.

1. Select **Logs** in the Monitoring section. If a **Queries** pop-up window appears, select the **X** in the top-right corner of the pop-up to close it. 
1. In the **Schema and Filter** pane, on the **Tables** tab, double-click the **traces** table. 

    This enters the [Kusto query](/azure/data-explorer/kusto/query/), `traces` into the query window. 
1. Edit the query to search for API calls:

    ```kusto
    traces 
    | where message startswith "Executing "
    ```

1. Select **Run**.

    If the log doesn't display any results, it may be because there is a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png":::

    Because you added an Application Insights resource when you created the Azure Function app, you didn't need to do anything extra to get this logging information:

    * The Function app added Application Insights _for you_.
    * The Query tool is included in the Azure portal.
    * You can click on `traces` instead of having to learn to write a [Kusto query](/azure/data-explorer/kusto/concepts/) to get even the minimum information from your logs.

## 6. Clean up Azure resources

In this article of the series, you remove all Azure resources.

#### Delete the resource group

The quickest and most complete way to clean up your Azure resources is to delete the resource group containing the resources. 
# [Visual Studio Code](#tab/vscode-remove-resource-group)

In VS Code, find the Azure Explorer's Functions section, right-click on the Function app and select **Delete Function App**. In the pop-up window, **Are you sure...**, select **Delete** again. 

# [Azure CLI](#tab/azcli-remove-resource-group)

In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article series, use the following Azure CLI command, [az group delete](/cli/azure/group#az-group-delete), to delete your resource group:

```azurecli
az group delete --name YOUR-RESOURCE-GROUP-NAME --no-wait --yes
```

---

## Sample code

* [GitHub](https://github.com/Azure-Samples/js-e2e-azure-resource-management-functions)


## Next steps

* [Deploy a GraphQL API as an Azure Function](./graphql/azure-function-hello-world.md)

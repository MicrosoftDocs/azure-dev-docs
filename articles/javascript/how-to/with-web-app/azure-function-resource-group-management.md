---
title: JavaScript Resource group management API
description: Learn how to build a TypeScript Azure Function API to manage Azure resource groups.
ms.topic: how-to
ms.date: 03/29/2023
ms.custom: devx-track-ts, engagement-fy23, devx-track-js, insecure-sample-warning
---

# Manage Azure resource groups with TypeScript Function API

In this tutorial, you'll create a local TypeScript Azure Function app with APIs to manage Azure resource groups and deploy the app to Azure.

Features and functionality:

* Create local TypeScript Azure Function app project in Visual Studio Code
* Create function API boilerplate code in Visual Studio Code
* Deploy to Azure Functions from Visual Studio Code
* Create service principal with Azure CLI
* Configure local and remote application settings with Visual Studio Code
* Use DefaultAzureCredential in both local and remote environments for passwordless connections
* Use Azure Identity and Azure Resource Management SDKs to manage Azure resources
* Use your local and cloud APIs to create, delete, and list resource groups in your subscription

> [!WARNING]
> This tutorial is meant for quick adoption and as such it doesn't follow secure-by-default requirements. To understand more about this scenario with a secure-by-default goal, go to [Security considerations](#security-considerations).

While the source code is written with TypeScript, the source code is simple. If you're comfortable with modern JavaScript using async/await, the code will be familiar to you.

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js LTS 18+ and npm](https://nodejs.org/en/download) installed to your local machine. Your local development environment version of Node.js should match one of the available Azure Function cloud runtime versions.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
    - [Azure Function](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extension v1.10.4 or above.
- [Azure Functions Core Tools](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) v4.0.5095 or above
- Azure Cloud Shell or [Azure CLI](/cli/azure/install-azure-cli) installed to your local machine.

## Application architecture

The app provides the following API endpoints.

|Method|URL|Description|
|--|--|--|
|POST,DELETE|http://localhost:7071/api/resourcegroup|Add or delete a resource group. While adding, include tags (key/value pairs) to identify the purpose of the group later.|
|GET| http://localhost:7071/api/resourcegroups |List all resource groups in subscription.|
|GET| http://localhost:7071/api/resources | List all resources in a subscription or resource group.|

While these endpoints are public, you _should_ secure your API endpoints with authentication and authorization before deploying to your live environment. 

This app is limited to a subscription because that is the scope specified when creating the service principal. 

## 1. Preparing your environment

You must prepare your local and cloud environments to use the Azure Identity SDK.

#### Sign in to Azure CLI

In a bash terminal, sign in to the Azure CLI with the following command:

```azurecli-interactive
az login
```

#### Get your Azure subscription ID

1. In a bash terminal, get your subscriptions and find the subscription ID you want to use. The following query returns the subscription ID, subscription name, and tenant ID sorted by subscription name.

    ```azurecli-interactive
    az account list --query "sort_by([].{Name:name, SubscriptionId:id, TenantId:tenantId}, &Name)" --output table
    ```

1. Copy the subscription ID to the previous temporary file. You'll need this setting later. 


#### Create an Azure service principal

An Azure service principal provides access to Azure without having to use your personal user credentials. For this tutorial, the service principal can be used both in your local and cloud environments. In an enterprise environment, you would want separate service principals for each environment.


1. Determine a service principal name format so you can easily find your service principal later. For example, several format ideas are:

    * Your project and owner: `resource-management-john-smith`.
    * Your department and date: `IT-2021-September`
    * A unique identifier: `00000000-0000-0000-0000-000000000000`

1. In a bash terminal, create your service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac). Replace `<SUBSCRIPTION-ID>` with your subscription ID. 

    ```azurecli-interactive
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME --role Contributor --scopes /subscriptions/<SUBSCRIPTION-ID>
    ```

1. Copy the entire output results to a temporary file. You'll need these settings later.

    ```json
    {
      "appId": "YOUR-SERVICE-PRINCIPAL-ID",
      "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
      "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
      "password": "YOUR-SERVICE-PRINCIPAL-PASSWORD",
      "tenant": "YOUR-TENANT-ID"
    }
    ```



## 2. Create local Azure Function app in Visual Studio Code

Create an Azure Function app in Visual Studio Code to manage Azure resource groups. 

#### Create function app 

Use Visual Studio Code to create a local Function app.

1. In a bash terminal, create and change into a new directory:

    ```bash
    mkdir my-function-app && cd my-function-app
    ```

1. In a bash terminal, open Visual Studio Code:

    ```bash
    code .
    ```

1. Open the Visual Studio Code command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>.

1. Enter `Azure Functions: create new project`. Use the following table to finish the prompts:

    |Prompt|Value|
    |--|--|
    |Select the folder that will contain your function project|Select the default (current) directory|
    |Select a language| Select **TypeScript**.|
    |Select a TypeScript programming model|Select **Model V4 (Preview)**|
    |Select a template for your project's first function|Select **HTTP trigger**.|
    |Create new HTTP trigger|Enter the API name of `resourcegroups`. |
    |Authorization level|Select **anonymous**. If you continue with this project after this article, change the authorization level to the function. Learn more about [Function-level authorization](/azure/azure-functions/security-concepts#function-access-keys).|


    The project boilerplate is created and the dependencies are installed.

#### Add service principal settings to local.settings.json file

1. Open the `./local.settings.json` file in the project root directory and add your **VALUES** section with the five following environment variables. 

    :::code language="JSON" source="~/../js-e2e-azure-resource-management-functions/local.settings.json" highlight="7-11":::
 
1. Refer to your settings from the previous section to add the values. These environment variables are **REQUIRED for the context to use DefaultAzureCredential**. 

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.

1. You also need to set the subscription ID. It's required to use the Azure SDK for resource management. 

   * `AZURE_SUBSCRIPTION_ID`: Your default subscription containing your resource groups. 

This `local.settings.json` file is ignored by your local **git** on purpose so you don't accidentally commit it to your source code. 

#### Install npm dependencies for Azure Identity and Resource management

In a Visual Studio Code **integrated bash terminal**, install the Azure SDK dependencies for Azure Identity and Resource management.

```bash
npm install @azure/identity @azure/arm-resources
```

#### List all resource groups in subscription with JavaScript

1. Open the `./src/functions/resourcegroups.ts` file and replace the contents with the following: 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/functions/resourcegroup.ts" id="snippet_resourcegroup":::

    This file responds to API requests to `/api/resourcegroups` and returns a list of all resource groups in the subscription.

1. Create a subdirectory in `src` named `lib` and create a new file in that directory named `azure-resource-groups.ts`.
1. Copy the following code into the `./src/lib/azure-resource-groups.ts` file:

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/lib/azure-resource-groups.ts":::

    This file completes the following:
    * Gets the subscription ID
    * Creates the DefaultAzureCredential context
    * Creates the ResourceManagementClient required to use the Resource management SDK.
    * Gets all the resource groups in the subscription.

1. Create a new file in the `./src/lib` directory named `environment-vars.ts` and copy the following code into that file. 

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/lib/environment-vars.ts":::

    This file checks the environment variables before returning the subscription ID.

1. Create a new file in the `./src/lib` directory named `error.ts` and copy the following code into that file.   

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/lib/error.ts":::

    This file returns a 500 error with the error message. The stack is returned if the `NODE_ENV` variable isn't set to `production`.

#### Test local functions

1. In the Visual Studio Code integrated terminal, run the local project:

    ```bash
    npm start
    ```

1. Wait until the integrated bash terminal displays the running function's URL.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-terminal-running-function.png" alt-text="Partial screenshot of Visual Studio Code's integrated bash terminal when the Azure Function is running locally and displaying the local URL for the APIs in the Function app.":::

1. Open a second integrated bash terminal in Visual Studio Code, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd>, and use the following **GET** cURL command to use the API:

    ```bash
    curl http://localhost:7071/api/resourcegroups
    ```

    If you have many resource groups in your subscription, you may want to pipe the output to a file for easier review.

    ```bash
    curl http://localhost:7071/api/resourcegroups > resourcegroups.json
    ```

1. The response includes `subscriptionId` and a `list` of all resource groups in that subscription.

    ```json
    {
      "subscriptionId": "ABC123",
      "list": [
            {
              "id": "/subscriptions/ABC123/resourceGroups/vmagelo-cloudshell",
              "name": "jsmith-cloudshell",
              "type": "Microsoft.Resources/resourceGroups",
              "properties": {
                "provisioningState": "Succeeded"
              },
              "location": "westeurope"
            },
            ... REMOVED FOR BREVITY ...
        ]
    }
    ```

#### Troubleshooting

If you couldn't complete this article, check the following table for issues. If your issue isn't listed in the table, open an issue on this documentation page.

|Issue|Fix|
|--|--|
|The app didn't start.|Review the errors. Make sure you installed the required dependencies.|
|The app started but you can't get a 200 response.|Make sure your curl command is requesting from the correct local route.|
|The API returned a 200 response but returned no results.|Use the Visual Studio Code extension for Azure Resources to verify that your subscription has any resource groups. If you don't see any resource groups, don't worry. This tutorial adds an API to create and delete resource groups in your subscription. This API is added after the first deployment of the source code to Azure, so that you learn how to redeploy your code.|

## 3. Create cloud-based Azure Function app

1. In Visual Studio Code, select the Azure icon to open the **Azure Explorer**.    

1. Select the **+** icon to create a new Azure Function app in the Azure cloud.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-create-function-app-icon.png" alt-text="Screenshot of Visual Studio Code's Azure Explorer with the Azure Function app icon highlighted.":::

1. Select **Create Function App in Azure**.
1. Enter a **globally unique name** for the new function app. The name must be unique across all Azure functions. For example, `jsmith-rg-management`.
1. Select the same **Node.js 18+ LTS runtime** you selected when you created your local function app. 
1. Select a geographical **location** close to you such as **West US 3**. 
1. Wait until the resource is created. You can watch the **Azure: Activity Log** for details.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-function-creation-activity-log.png" alt-text="Screenshot of Visual Studio Code's Azure activity log showing the resource creation status.":::

## 4. Configure cloud-based Azure Function app

You need to configure your Azure app settings to connect to the Azure Function app. Locally, these settings are in your `local.settings.json` file. This process adds those values to your cloud app.

1. In Visual Studio Code, in the Azure explorer, in the **Resources** section, expand **Function App** then select your function app.
1. Right-click on **Application Settings** and select **Add New Setting**.
1. Add the four values from your `local.settings.json` with the exact same name and values.

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.
   * `AZURE_SUBSCRIPTION_ID`: Your default subscription containing your resource groups. 
    * `AzureWebJobsFeatureFlags`:`EnableWorkerIndexing`

:::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-function-app-settings.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing the remote/cloud function's app settings.":::

## 5. Deploy Resource Manager function app

Deploy an Azure Function app in Visual Studio Code to manage Azure resource groups. 

#### Use Visual Studio Code extension to deploy to hosting environment

1. In VS Code, open the `local.settings.json` file so it is visible. This will make the next steps of copying those names and values easier.
1. Select the Azure logo to open the **Azure Explorer**, then under **Functions**, select the cloud icon to deploy your app.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-deploy-app.png" alt-text="Screenshot of Visual Studio Code's local Workspace area with the cloud deployment icon highlighted.":::    

    Alternately, you can deploy by opening the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>, entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Select **Deploy to Function app**.

1. Select the Function App name your created in the previous section.
1. When asked if you're sure you want to deploy, select **Deploy**.

1. The VS Code **Output** panel for **Azure Functions** shows progress.  When deploying, the entire Functions application is deployed, so changes to all individual functions are deployed at once.

#### Verify Functions app is available with browser

1. While still in Visual Studio Code, use the **Azure Functions** explorer, expand the node for your Azure subscription, expand the node for your Functions app, then expand **Functions (read only)**. Right-click the function name and select **Copy Function Url**:

    :::image type="content" source="../../media/azure-function-resource-group-management/copy-function-url-command.png" alt-text="Partial screenshot of Visual Studio Code's Azure explorer showing where to copy the Function's URL.":::

1. Paste the URL into a browser and press **Enter** to request the resource group list from the cloud API. 

## 6. Add APIs to function app and redeploy to Azure

Add the following APIs then redeploy your Azure Function app in Visual Studio Code:

* Add and delete resource groups
* List resources in resource group or subscription. 

At this point in the tutorial, you created a local function app with one API to list your subscription's resource groups and you deployed that app to Azure. As an Azure developer, you may want to create or delete resource groups as part of your process automation pipeline. 

#### Create resourcegroup API for your function app

Use the Visual Studio Code extension for Azure Functions to add the TypeScript files to your function app to create and delete resource groups. 

1. Open the Visual Studio Code command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>.
1. Enter `Azure Functions: Create Function` then press enter to begin the process.
1. Use the following table to create the **/api/resourcegroup** API:

    |Prompt|Value|
    |--|--|
    |Select a template for your function|HTTP trigger|
    |Provide a function name|`resourcegroup`|
    |Authorization level|Select **anonymous**. If you continue with this project, change the authorization level to the function. Learn more about [Function-level authorization](/azure/azure-functions/security-concepts#function-access-keys).|
1. Open the `./src/functions/resourcegroup.ts` and replace the entire file with the following source code.

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/functions/resourcegroup.ts" id="snippet_resourcegroup":::

1. The `./src/lib/azure-resource-groups.ts` file already contains the code to add and delete resource groups.

#### Create resources API for your function app

Use the Visual Studio Code extension for Azure Functions to add the TypeScript files to your function app to list resources in a resource group. 

1. Open the Visual Studio Code command palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>.
1. Enter `Azure Functions: Create Function` then press enter to begin the process.
1. Use the following table to create the **/api/resources** API:

    |Prompt|Value|
    |--|--|
    |Select a template for your function|HTTP trigger|
    |Provide a function name|`resources`|
    |Authorization level|Select **anonymous**. If you continue with this project, change the authorization level to the function. Learn more about [Function-level authorization](/azure/azure-functions/security-concepts#function-access-keys).|
1. Open the `./src/functions/resources.ts` and replace the entire file with the following source code.

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/functions/resources.ts" id="snippet_resources":::

1. Create the `./src/lib/azure-resource.ts` file and copy the following code into it to list the resources in a resource group.

    :::code language="TypeScript" source="~/../js-e2e-azure-resource-management-functions/src/lib/azure-resource.ts":::

#### Start your local function app and test the new API

1. In the Visual Studio Code integrated terminal, run the local project:

    ```bash
    npm start
    ```

1. Wait until the integrated bash terminal displays the running function's URL.

    :::image type="content" source="../../media/azure-function-resource-group-management/visual-studio-code-terminal-running-function-post-delete.png" alt-text="Partial screenshot of Visual Studio Code's integrated bash terminal when the Azure Function is running locally and displaying the local URLs for the APIs in the Function app.":::

1. Use the following curl commands in a different integrated bash terminal, to call your API, to add a resource group to your subscription. Change the name of the resource group to use your own naming conventions.

   :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/src/functions/resourcegroup.ts" range="5-9":::

1. Use the following curl command to see the new resource group listed in your subscription.

    :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/src/functions/resourcegroups.ts" range="4":::

1. Use the following curl command to delete the resource group you just added. 

    :::code language="bash" source="~/../js-e2e-azure-resource-management-functions/src/functions/resourcegroup.ts" range="14-15":::

#### Redeploy your function app with new APIs to Azure

1. In VS Code, deploy by opening the **Command Palette** with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>p</kbd>, entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Select your function app from the list of apps.
1. Select **Deploy** from the pop-up window.
1. Wait until the deployment completes.

#### Verify Function APIs with browser

Use the previous cURL commands, replacing the localhost address, `http://localhost:7071` with your Azure Function resource name such as `https://myfunction.azurewebsites.net`.

## 7. View and query your Function app logs

View and query Azure Function app logs in the Azure portal.

#### Query your Azure Function logs

Use the Azure portal to view and query your function logs. 

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../media/azure-function-resource-group-management/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select Application Insights from the Settings, then select View Application Insights data.":::

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

    If the log doesn't display any results, it may be because there's a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png":::

    Because an Application Insights resource was added for you when you created the Azure Function app, you didn't need to do anything extra to get this logging information:

    * The Function app added Application Insights _for you_.
    * The Query tool is included in the Azure portal.
    * You can select `traces` instead of having to learn to write a [Kusto query](/azure/data-explorer/kusto/concepts/) to get even the minimum information from your logs.

## 8. Clean up Azure resources

#### Delete the resource group

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.This opens the Azure portal to your Azure Function.

1. In the **Overview** section, find and select the resource group name. This action takes you to the resource group in the Azure portal. 

1. The resource group page lists all resources associated with this tutorial. 
1. In the top menu, select **Delete resource group**.
1. In the side menu, enter the name of the resource group then select **Delete**.

#### Delete the service principal

To delete the service principal, run the following command. Replace `<YOUR-SERVICE-PRINCIPAL-NAME>` with the name of your service principal.

```azurecli-interactive
az ad sp delete --id <YOUR-SERVICE-PRINCIPAL-NAME>
```

## Sample code

* [GitHub: Azure-Samples/azure-typescript-e2e-apps](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/api-functions-v4-azure-resource-management)

## Security considerations

This solution, as a beginner tutorial, doesn't demonstrate secure-by-default practices. This is intentional to allow you to be successful in deploying the solution. The next step after that successful deployment is to secure the resources. This solution uses three Azure services, each has its own security features and considerations for secure-by-default configuration:

* Azure Functions - [Securing Azure Functions](/azure/azure-functions/security-concepts)
* Azure Storage - [Security recommendations for Blob storage](/azure/storage/blobs/security-recommendations)

## Next steps

* [Convert text to speech in Express.js app](../../tutorial/convert-text-to-speech-cognitive-services.md)

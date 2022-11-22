---
title: "Tutorial: Deploy Python ETL Solution to Azure"
description: In this article, Deploy Python ETL Solution to Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
---

# Tutorial: Deploy Python ETL Solution to Azure

In this last article of the series, you deploy the Azure Functions application to Azure.

## 1. Create Azure Function resource

:::row:::
    :::column:::
        **Step 1.** Create the Azure Function.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Enter `Function App` in the search box then select **Function App** under **Services** in the search results.
        1. On the Function App page, select **+ Create**.
        1. Enter the following information in the portal dialogue:
        1. **Subscription**: Select **your active subscription**.
        1. **Resource group**: Select **msdocs-python-cloud-etl-rg**, if this resource group doesn't exist, select **Create new** then select it.
        1. **Function App Name**: For your function app, enter `msdocs-etl` (*Names may contain alphanumeric characters and dashes (-) only*).
        1. **Publish**: Select **Code**.
        1. **Version**: Select **3.9**.
        1. **Region**: Select the default value.
        1. **Operating system**: Select **Linux**.
        1. **Plan type**: Choose **Consumption** for serverless, where you're only charged when your functions run.
        1. Select **Review + create**. 
        1. **Create** to start the creation process.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create.png" alt-text="Screenshot showing how to create Azure Function in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** When the deployment process completes, select **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-go-to-resource.png" alt-text="Screenshot showing how to go to your new Azure Function in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-go-to-resource.png":::
    :::column-end:::
:::row-end:::

## 2. Configure Azure Functions app settings in Azure portal

Configure the following environment variables to allow your function app to connect to Azure Key Vault, Azure Blob Storage, and Azure Data Lake. 

|Environment variable|Value|
|--|--|
|BLOB_STORAGE_RESOURCE_NAME|`msdocspythoncloudetlabs`|
|BLOB_STORAGE_CONTAINER_NAME|`msdocs-python-cloud-etl-news-source`|
|KEY_VAULT_RESOURCE_NAME|`msdocs-python-etl-kv`|
|KEY_VAULT_SECRET_NAME|`bing-search-resource-key1`|
|DATALAKE_GEN_2_RESOURCE_NAME|`msdocspythoncloudetladls`|
|DATALAKE_GEN_2_CONTAINER_NAME|`msdocs-python-cloud-etl-processed`|
|DATALAKE_GEN_2_DIRECTORY_NAME|`news-data`|
|BING_SEARCH_URL|`https://api.bing.microsoft.com/v7.0/`|

* If you used different values when you created or configured resources, use your own values instead of the values listed in the preceding table.

:::row:::
    :::column:::
        **Step 1.** Navigate to your Azure Function App.
        1. Choose **Configuration** icon in the **Settings**.
        1. In the **Application settings** area, select **+ New application setting**.
        1. Select **msdocs-etl**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting.png" alt-text="Screenshot showing how to begin to create application setting for Azure function in Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Complete this section for each name/value pair.
        1. Right-click **Application Settings**, select **New application setting**. 
        1. Add the first name/value pair from the table at the beginning of this section and select **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting-create-button.png" alt-text="Screenshot showing how to create each application setting for Azure function in the portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting-create-button.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Save the new settings.
        1. Select **Save** 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting-save.png" alt-text="Screenshot showing how to save application setting for Azure function in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-application-setting-save.png":::
    :::column-end:::
:::row-end:::

## 3. Configure Azure Function Apps resources to use passwordless credentials

Enable System Assigned Identity for the function app and give it the **Contributor** role for the resource group.

:::row:::
    :::column:::
        **Step 1.** Turn on system assigned identity for your Azure Functions app.
        1. Open a browser window and navigate to the **[Azure portal](https://portal.azure.com)**.
        1. Find your Azure Functions app.
        1. Select **Identity**.
        1. Select **Status** to turn on the System assigned identity.
        1. Select **Save** then answer **Yes** if you are asked to confirm.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-configure-system-assigned-identity.png" alt-text="Screenshot showing how to turn on System assigned identity in Azure Function in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-configure-system-assigned-identity.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Add roles for Azure Functions app to access other Azure resources.
        1. While still on the **Identity** page, select **Azure role assignments**.
        1. To add a Key Vault role, select **Add role assignment**. 
            * Select a scope of Key Vault.
            * Select your subscription.
            * Select your Key Vault resource, **msdocs-python-etl-kv**.
            * Select the role of **Key Vault Secrets User**.
            * Select **Save**.
        1. To add a Blob Storage role, select **Add role assignment**. 
            * Select a scope of Storage.
            * Select your subscription.
            * Select your Blob Storage resource, **msdocspythoncloudetlabs**.
            * Select the role of **Storage Blob Data Contributor**.
            * Select **Save**.
        1. To add a Data Lake role, select **Add role assignment**. 
            * Select a scope of Storage.
            * Select your subscription.
            * Select your Blob Storage resource, **msdocspythoncloudetladls**.
            * Select the role of **Storage Blob Data Contributor**.
            * Select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-configure-system-assigned-identity.png" alt-text="Screenshot showing how to turn on System assigned identity in Azure Function in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-configure-system-assigned-identity.png":::
    :::column-end:::
:::row-end:::

## 3. Deploy local Function project to Azure from Visual Studio Code

The following steps publish your local Python Azure Function project to the Azure Function App. 

:::row:::
    :::column:::
        **Step 1.** 
        1. Choose the **Azure** icon in the **Activity** bar.
        1. In the **Resources** area, expand **Function App**.
        1. Select and right-click **msdocs-etl**.
        1. Select **Deploy to Function App**.
        1. When asked **Are you sure you want to deploy...**, select **Deploy**.
        1. Navigate to the **Output** panel to view the deployment results.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-deploy-function.png" alt-text="Screenshot showing how to create host key for Azure function." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-deploy-function.png":::
    :::column-end:::
:::row-end:::

## 4. Configure auto-archive rule for source data

Once the processed data is loaded into the data lake, the source file should be achieved to a separate Azure Blob Storage Container. Data archiving is when data is identified as no longer active, but requires retention.

There are several ways archive data using Python and Azure, however for this tutorial we'll use lifecycle management policies to archive blobs.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Create the rule and specify the blob type.
        1. Navigate to your **blob storage account** in the portal named `msdocspythoncloudetlabs`. Don't select your data lake resource. 
        1. Under **Data management**, locate the **Lifecycle management settings**.
        1. On the **List View** tab, select **Enable access tracking**.
        1. Select the **Add a rule** button.
        1. On the **Details tab**, specify a name for your rule `move-block-blobs-to-cool`.
        1. Select the rule scope: **Limit blobs with filters**.
        1. Select **Block blobs** as blob type.
        1. Select **Base blobs** as blob subtype.
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png" alt-text="A screenshot navigating configuring storage lifecycle management details tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Add rule conditions.
        1. On the **Base blobs tab**, set the conditions for your rule.
        1. For **Base blobs were**, select **Last accessed**.
        1. For **More than (days ago)**: enter **30**.
        1. For **Then**: select **Move to cool storage**.
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png" alt-text="A screenshot navigating configuring storage lifecycle management Base blob tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Apply rule filters on blobs whose name begins with *search_results* in a container called *msdocs-python-cloud-etl-news-source*.
        1. **Blob prefix**: Enter **msdocs-python-cloud-etl-news-source/search_results**.
        1. Select the **Add** button to add the new policy.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png" alt-text="A screenshot navigating configuring storage lifecycle management Filter set tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png":::
    :::column-end:::
:::row-end:::


### [Visual Studio Code](#tab/vscode)

Complete the step using either the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)

**Step 1.** Write the lifecycle management policy to a JSON file names *policy.json*. The policy will move a block blob whose name begins with 'search_result' to the cool tier if it has been more than 30 days since the blob was modified.

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "move-block-blobs-to-cool",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            }
          }
        },
        "filters": {
          "blobTypes": [
            "blockBlob"
          ],
          "prefixMatch": [
            "msdocs-python-cloud-etl-news-source/search_results"
          ]
        }
      }
    }
  ]
}
```

**Step 2.** Call the [`az storage account management-policy create`](/cli/azure/storage/account/management-policy#az-storage-account-management-policy-create) command to create the policy.

```azurecli
az storage account management-policy create \
    --resource-group msdocs-python-cloud-etl-rg \
    --account-name msdocspythoncloudetlabs \
    --policy @policy.json 
```

---

## 5. Create host key for client access to function

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step** Create new client key and copy it. The key is used by the client application to authenticate to the function. The key is sent in the querystring **code** parameter: `?code=123`.
        1. Select **Functions** in the left pane.
        1. Select **App Keys**.
        1. Select the **New host key**.
        1. Enter the name **ClientAppKey** and leave the value empty for an auto-generated key. Select **Ok**
        1. After the key is created, select the key to show its value.
        1. Copy the key to your clipboard. This key will be used in a later step to use the HTTPTrigger function, `/api/search`. 

            If you intend to continue on this application after this tutorial series, store this key in your Key Vault as a secret. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-host-key.png" alt-text="Screenshot showing how to create host key for Azure function." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-create-host-key.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)

Complete the step using either the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)

1. Run [az functionapp keys set](/cli/azure/functionapp/keys?#az-functionapp-keys-set) to create a new host key for the Functions app.

    ```azurecli
    # Create new host key
    az functionapp keys set \
        --resource-group msdocs-python-cloud-etl-rg \
        --name msdocs-etl \
        --key-type functionKeys 
        --key-name ClientAppKey
    ```

1. From the returned JSON, copy the **Properties** value to your clipboard. This key will be used in a later step to use the HTTPTrigger function, `/api/search`. 

---


## 6. Find the Azure Function API endpoint

To call the solution, you need to use an HTTP tool for your deployed Azure Function's HTTP trigger URL. 

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Get your API endpoint.
        1. Navigate to your **function app account** in the portal named `msdoc-etl`. 
        1. On **Functions**, select the **api_search** function.
        1. Select **Get Function URL**.
        1. In the selection box, choose the **ClientAppKey** key.
        1. Select the copy icon to copy the URL with the key.
        1. The URL format looks _like_ `https://msdocs-etl.azurewebsites.net/api/search?code=1234&clientId=ClientAppKey`. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-get_function_url.png" alt-text="A screenshot showing how to get the function's URL with the host key in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-get_function_url.png":::
    :::column-end:::
:::row-end:::

### [Visual Studio Code](#tab/vscode)


:::row:::
    :::column:::
        **Step 1.** Navigate to your Azure Function App.
        1. Choose the **Azure** icon in the **Activity** bar.
        1. In the **Resources** area, expand **Function App**.
        1. Select **msdocs-etl**.
        1. Right-click on the **api_search** function and select **Copy Function Url**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-copy-function-url.png" alt-text="Screenshot showing how to get function URL in Visual Studio Code." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-vscode-copy-function-url.png":::
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Call the [`az functionapp function show`](/cli/azure/functionapp/function#az-functionapp-function-show) command to create the policy.

```azurecli
az functionapp function show \
    --resource-group msdocs-python-cloud-etl-rg 
    --name msdocs-etl 
    --function-name api_search 
    --query "invokeUrlTemplate"
```

---

## 7. Call the Azure Function API endpoint

The Function endpoint URL needs to be in the format of: `https://msdocs-etl.azurewebsites.net/api/search?code=1234&clientId=ClientAppKey&search_term=azure&count=5`.

The four querystring properties need to be in the URL.

|Querystring property|Value|
|--|--|
|code|The host key value created to secure the function app.|
|clientId|The name of the host key, `ClientAppKey`.|
|search_term|The value used to search Bing News, such as `azure`. |
|count|Optional, default is 10. The number of news items to return from Bing News.|

### [Azure CLI](#tab/azure-cli)

Replace the following values with your own before using this command:

|Property|Value|
|--|--|
|`<YOUR-FUNCTION-APP-RESOURCE-NAME>`|Replace with your Azure Functions resource name, such as `msdocs-etl`.|
|`<YOUR-CODE>`|Replace with the value of your host key.|

```bash
curl --location --request GET 'http://<YOUR-FUNCTION-APP-RESOURCE-NAME>.azurewebsites.net/api/search?code=<YOUR-CODE>&clientId=ClientAppKey&search_term=azure&count=5'
```

### [Visual Studio Code](#tab/vscode)

1. Choose the **Azure icon** in the **Activity bar**. 
1. In the **Workspace area**, expand **Local Project > Functions**. 
1. Right-click (Windows) or Ctrl + Select (macOS) the **msdocs-cloud-python-etl-HttpTrigger** function.
1. Choose **Execute Function Now**.
1. Enter the request message body value `{ "search_term": "Azure", "count": 5}` and press Enter.


### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

---

## 8. Delete the resource group for your project

Delete the resource group named `msdocs-python-cloud-etl-rg`.

[!INCLUDE [delete resource group 3-tab](../includes/delete-resource-group.md)]

## Troubleshooting

If the cloud-based Azure Functions app didn't place a process file in the Data Lake, use the following steps to troubleshoot the app.

* Turn on Information logging and view logs
    * On your local app, change the `host.json` file's value for `logging.logLevel.default` to `Information` and execute the request against the search endpoint again. 
    * In the Azure portal, on your Functions App, select the `api_search` function.
    * On the **Monitor** page, view the **Invocation Traces**. 
    * The logs of a request may take a few minutes to be visible on the trace list. 
* Functions app system-assigned identity was created with a name similar to your function resource. Make sure the identity was added with **Storage Blob Data Contributor** role to:
    * Blob Storage where the initial search files are stored as well 
    * Data Lake where the processed files are stored. 
* Key Vault role-based access: 
    * Your own user identity should have the role of **Key Vault Secrets Officer** to create and manage secrets
    * Your function's system assigned identity should have the role of **Key Vault Secrets User** to read secrets.



## Next step

* Azure Functions: [Machine learning with TensorFlow](/azure/azure-functions/functions-machine-learning-tensorflow?tabs=bash) 
* Azure Storage and Data Lake: [Use with Databricks and Spark](/azure/storage/blobs/data-lake-storage-use-databricks-spark)
* Azure Key Vault: [Secrets rotation](/azure/key-vault/secrets/tutorial-rotation)
* Bing Search: [News search result answer](/bing/search-apis/bing-web-search/search-responses#news-answer)
---
title: "Tutorial: Deploy Python ETL Solution to Azure"
description: In this article, Deploy Python ETL Solution to Azure
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: tutorial
ms.date: 10/15/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Tutorial: Deploy Python ETL Solution to Azure

In this last article of the series, you deploy the Azure Functions application to Azure.

## 1. Create Azure Function resource

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
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
        **Step 3.** When the deployment process completes, select **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-go-to-resource.png" alt-text="Screenshot showing how to go to your new Azure Function in the Azure portal." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-function-go-to-resource.png":::
    :::column-end:::
:::row-end:::



### [Visual Studio Code](#tab/vscode)


:::row:::
    :::column:::
        **Step 1.** In the command pallet, enter **Azure Functions: Create function app in Azure...(Advanced)**.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Provide the following information in the prompts.
        1. **Unique name for the function app**: Enter **msdocs-etl**.
        1. **Runtime stack**: Choose **Python**.
        1. **OS**: Choose **Linux**. (*Python apps must run on Linux.*)
        1. **Resource group**: Choose **msdocs-python-cloud-etl-rg**.
        1. **Location**: Choose default value.
        1. **Hosting plan**: Choose **Consumption** for serverless, where you're only charged when your functions run.
        1. **Storage account**: Select the default.
        1. **Application Insights**: Select **Skip for now**.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure successful resource creation.
        1. In the **Activity Log** panel, the status of individual resources as they're being created in Azure.
        1. Once completed and all resources are created, a **notification** is displayed in Visual Studio Code, and the **deployment package** is applied.
        1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.
    :::column-end:::
:::row-end:::


### [Azure CLI](#tab/azure-cli)

Azure Function CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. Run [az storage account create](/cli/azure/storage/account#az-storage-account-create) to create the _required_ dependency storage account.

    ```azurecli
    # Create storage account used by Functions app
    az storage account create \
        --name msdocsfnstor123 \
        --sku Standard_LRS
    ```

1. Run [az functionapp create](/cli/azure/functionapp#az-functionapp-create) to create the Azure Functions app.

    ```azurecli
    # Create Functions app
    az functionapp create \
        --storage-account msdocsfnstor123
        --name msdocs-etl 
        --consumption-plan-location westus 
        --runtime python 
        --runtime-version 3.9 
        --functions-version 4 
        --os-type linux 
    ```
---

## Create host key for client access to function

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step** Create new client key and copy it. The key is used by the client application to authenticate to the function. The key is sent in the querystring **code** parameter: `?code=123`.
        1. Select **Functions** in the left pane.
        1. Select **App Keys**.
        1. Select the **New host key**.
        1. Enter the name **ETL client** and leave the value empty for an auto-generated key. Select **Ok**
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

## 1. Deploy local Function project to Azure

The following steps publish your local Python Azure Function project to the new Azure Function App:

### [Azure portal](#tab/azure-portal)

Complete the steps using either the Visual Studio Code or the Azure CLI.

### [Visual Studio Code](#tab/vscode)

Deploy project files.

1. Choose the **Azure** icon in the **Activity** bar.
1. In the **Resources** area, expand **Function App**.
1. Select and right-click **msdocs-cloud-python-etl-func-app**.
1. Select **Deploy to Function App**.
1. Navigate to the **Output** panel to view the deployment results.

### [Azure CLI](#tab/azure-cli)

Azure Function CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. Run [az storage account create](/cli/azure/storage/account#az-storage-account-create) to create the _required_ dependency storage account.

    ```azurecli
    # Create storage account used by Functions app
    az storage account create \
        --name msdocsfnstor123 \
        --sku Standard_LRS
    ```

1. Run [az functionapp create](/cli/azure/functionapp#az-functionapp-create) to create the Azure Functions app.

    ```azurecli
    # Create Functions app
    az functionapp create \
        --storage-account msdocsfnstor123
        --name msdocs-etl 
        --consumption-plan-location westus 
        --runtime python 
        --runtime-version 3.9 
        --functions-version 4 
        --os-type linux 
    ```

1. Run []() to create a new host key for the Functions app.

    ```azurecli
    # Create new host key
    az functionapp keys set --resource-group msdocs-python-cloud-etl-rg-diberry --name msdocs-etl --key-type functionKeys --key-name ClientApp 
    ```

1. Copy the key to your clipboard. This key will be used in a later step to use the HTTPTrigger function, `/api/search`. 

---



## 2. Configure App Settings in Azure

### [Azure portal](#tab/azure-portal)



### [Visual Studio Code](#tab/vscode)

:::row:::
    :::column:::
        **Step 1.** Navigate to your Azure Function App.
    :::column-end:::
    :::column:::
        {content}
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Create new Application settings for the Azure Function App.
        1. Under **Settings** in the left pane, select **Configuration**.
        1. In the **Application settings** section, select **New application setting**.
    :::column-end:::
    :::column:::
        {content}
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Add all App Settings Name-Value information:
        1. **Name**: Enter **ABS_ACCOUNT_NAME**, **Value**: Enter **msdocspythoncloudetlabs**.
        1. **Name**: Enter **ABS_SRC_CONTAINER**, **Value**: Enter **msdocs-python-cloud-etl-news-source**.
        1. **Name**: Enter **KEY_VAULT_NAME**, **Value**: Enter **msdocs-python-etl-kv**.
        1. **Name**: Enter **BING_SEARCH_RESOURCE_KEY**, **Value**: Enter **bing-search-resource-key**.
        1. **Name**: Enter **ADLS_ACCOUNT**, **Value**: Enter **msdocspythoncloudetladls**.
        1. **Name**: Enter **ADLS_CONTAINER**, **Value**: Enter **news-data**.
        1. **Name**: Enter **ADLS_DIR**, **Value**: Enter **msdocs-python-cloud-etl-processed**.
        1. Select the **Save** button.
    :::column-end:::
    :::column:::
        {content}
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)



---

## 3. Configure Azure resources to use passwordless credentials

1. Enable System Assigned Identity for func app and save
1. Add role assignments (Preview)
    1. Key Contributor - msdocs-python-etl-kv
    1. Storage Blob Data Contributor - msdocspythoncloudetlabs
    1. Storage Blob Data Contributor - msdocspythoncloudetladls

### [Azure portal](#tab/azure-portal)

### [Visual Studio Code](#tab/vscode)

### [Azure CLI](#tab/azure-cli)

---

## 5. Configure auto-archive rule for source data

Once the processed data is loaded into the data lake, the source file should be achieved to a separate Azure Blob Storage Container. Data archiving is when data is identified as no longer active, but requires retention.

There are several ways archive data using Python and Azure, however for this tutorial we'll use lifecycle management policies to archive blobs.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column:::
        **Step 1.** Create the rule and specify the blob type.
        1. Navigate to your **storage account** in the portal.
        1. Under **Data management**, locate the **Lifecycle management settings**.
        1. Select the **List View** tab.
        1. Select the **Add a rule** button.
        1. On the **Details tab**, specify a name for your rule.
        1. Specify the rule scope: Apply rule to all blobs in your storage account
        1. Select the types of blobs for which the rule is to be applied, and specify whether to include blob snapshots or versions.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png" alt-text="A screenshot navigating configuring storage lifecycle management details tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Add rule conditions.
        1. On the **Base blobs tab**, set the conditions for your rule.
        1. Select Base blobs were **Last accessed**.
        1. **More than (days ago)**: Enter **30**.
        1. **Then**: Select **Move to cool storage**.
        1. Select **Next**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png" alt-text="A screenshot navigating configuring storage lifecycle management Base blob tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Apply rule filters on blobs whose name begins with *search_results* in a container called *msdocs-python-cloud-etl-news-source*.
        1. If you selected Limit blobs with filters on the Details page, select Filter set to add an optional filter.
        1. **Blob prefix**: Enter **msdocs-python-cloud-etl-news-source/search_results**.
        1. Leave the **Blob index match** section empty.
        1. Select the **Add** button to add the new policy.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png" alt-text="A screenshot navigating configuring storage lifecycle management Filter set tab." lightbox="./media/tutorial-deploy-azure-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png":::
    :::column-end:::
:::row-end:::


### [Visual Studio Code](#tab/vscode)

### [Azure CLI](#tab/azure-cli)

**Step 1.** Write the lifecycle management policy to a JSON file names *policy.json*. The policy will move a block blob whose name begins with 'search_result' to the cool tier if it has been more than 30 days since the blob was modified.

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "move-to-cool",
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
            "smsdocs-python-cloud-etl-news-source/search_results"
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
    --account-name <storage-account> \
    --policy @policy.json \
    --resource-group <resource-group>
```

---

## 3. Find the Azure Function API endpoint

To call the solution, you need to use an HTTP tool for your deployed Azure Function's HTTP trigger URL. 

## 4. Call the Azure Function API endpoint


## 5. Delete the resource group for your project

Delete the resource group named `msdocs-python-cloud-etl-rg`.

[!INCLUDE [delete resource group 3-tab](../includes/delete-resource-group.md)]

## Next step

* Azure Functions: [Machine learning with TensorFlow](/azure/azure-functions/functions-machine-learning-tensorflow?tabs=bash) 
* Azure Storage and Data Lake: [Use with Databricks and Spark](/azure/storage/blobs/data-lake-storage-use-databricks-spark)
* Azure Key Vault: [Secrets rotation](/azure/key-vault/secrets/tutorial-rotation)
* Bing Search: [News search result answer](/bing/search-apis/bing-web-search/search-responses#news-answer)
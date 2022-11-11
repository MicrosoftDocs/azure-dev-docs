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

## 1. Deploy local Function project to Azure

The following steps publish your local Python Azure Function project to the new Azure Function App created with advanced create options:

### [Azure portal](#tab/azure-portal)



### [Visual Studio Code](#tab/vscode)

:::row:::
    :::column:::
        **Step 1.** In the command pallet, enter **Azure Functions: Create function app in Azure...(Advanced)**.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 2.** Provide the following information in the prompts.
        1. **Unique name for the function app**: Enter **msdocs-cloud-python-etl-func-app**.
        1. **Runtime stack**: Choose **Python**.
        1. **OS**: Choose **Linux**. (*Python apps must run on Linux.*)
        1. **Resource group**: 
        1. **Location**: Choose **East US**.
        1. **Hosting plan**: Choose **Consumption** for serverless, where you're only charged when your functions run.
        1. **Storage account**: Select **msdocspythoncloudetlabs**.
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
:::row:::
    :::column:::
        **Step 4.** Deploy project files.
        1. Choose the **Azure** icon in the **Activity** bar.
        1. In the **Resources** area, expand **Function App**.
        1. Select and right-click **msdocs-cloud-python-etl-func-app**.
        1. Select **Deploy to Function App**.
        1. Navigate to the **Output** panel to view the deployment results.
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)



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
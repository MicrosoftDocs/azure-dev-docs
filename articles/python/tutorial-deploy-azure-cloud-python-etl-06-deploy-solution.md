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

This tutorial,

:::image type="content" source="./media/tutorial-deploy-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg":::

## 1. Deploy local Function project to Azure

The following steps publish your local Python Azure Function project to the new Azure Function App created with advanced create options:

:::row:::
    :::column:::
        **Step 1.** In the command pallet, enter **Azure Functions: Create function app in Azure...(Advanced)**.
    :::column-end:::
    :::column:::
        {content}
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
    :::column:::
        {content}
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        **Step 3.** Configure successful resource creation.
        1. In the **Activity Log** panel, the status of individual resources as they're being created in Azure.
        1. Once completed and all resources are created, a **notification** is displayed in Visual Studio Code, and the **deployment package** is applied.
        1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.
    :::column-end:::
    :::column:::
        {content}
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
    :::column:::
        {content}
    :::column-end:::
:::row-end:::

## 2. Configure App Settings in Azure

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
        1. **Name**: Enter **BING_SEARCH_SUB_KEY_SECRET**, **Value**: Enter **bing-search-sub-key1**.
        1. **Name**: Enter **ADLS_ACCOUNT**, **Value**: Enter **msdocspythoncloudetladls**.
        1. **Name**: Enter **ADLS_CONTAINER**, **Value**: Enter **news-data**.
        1. **Name**: Enter **ADLS_DIR**, **Value**: Enter **msdocs-python-cloud-etl-processed**.
        1. Select the **Save** button.
    :::column-end:::
    :::column:::
        {content}
    :::column-end:::
:::row-end:::

## 3. Configure Azure resources to use passwordless credentials

1. Enable System Assigned Identity for func app and save
1. Add role assignments (Preview)
    1. Key Contributor - msdocs-python-etl-kv
    1. Storage Blob Data Contributor - msdocspythoncloudetlabs
    1. Storage Blob Data Contributor - msdocspythoncloudetladls

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
        :::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png" alt-text="A screenshot navigating configuring storage lifecycle management details tab." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-details.png":::
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
        :::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png" alt-text="A screenshot navigating configuring storage lifecycle management Base blob tab." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-base-blobs.png":::
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
        :::image type="content" source="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png" alt-text="A screenshot navigating configuring storage lifecycle management Filter set tab." lightbox="./media/tutorial-deploy-cloud-python-etl/azure-cloud-python-etl-portal-lifecycle-mgmt-filter-set.png":::
    :::column-end:::
:::row-end:::

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

## 3. Run solution in Azure

## 4. Clean up resources

**Step 1.** Archive solution resources
Save ARM template

1. go to resource group
1. Under Automation select Export template
1. Download button to save locally or Add to Library.
1. Resource visualizer then Export PNG to keep diagram for reference

**Step 2.** Remove resources from subscription

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

### [Azure portal](#tab/azure-portal)

### [Azure CLI](#tab/azure-cli)

Run [az group delete](/cli/azure/group) to delete the Azure Resource Group.

```azurecli
az group delete --name 'rg-cloudetl-demo'
```

---

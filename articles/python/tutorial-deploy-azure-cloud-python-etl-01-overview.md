---
title: "Tutorial: Deploy a Python Cloud ETL Solution on Azure"
description: This series will guide you through creating and deploying a serverless, cloud Extract, Transform, and Load (ETL) Python solution to Azure.
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli, engagement-fy23, py-fresh-zinc
ms.devlang: python
ms.topic: conceptual
ms.date: 01/03/2023
---

# Overview: Deploy a serverless Python cloud ETL solution on Azure

This procedure guides you through creating and deploying a serverless, cloud *Extract, Transform, and Load* (ETL) Python solution to Azure.

* [GitHub: Sample application](https://github.com/Azure-Samples/msdocs-python-etl-serverless)

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/deploy-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" border="false":::

## What the sample solution does

When deployed, the sample solution flow includes:

1. *Get Data*: Use an [Azure HTTPTrigger Function](/azure/azure-functions/functions-bindings-http-webhook?tabs=in-process%2Cfunctionsv2&pivots=programming-language-python) to search with [Bing News Search API](/bing/search-apis/bing-news-search/overview)
1. *Store Data*: Store the search results as a JSON file in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview) container.
1. *Process Data*: Use an [Azure BlobTrigger Function](/azure/azure-functions/functions-bindings-storage-blob?tabs=in-process%2Cextensionv5%2Cextensionv3&pivots=programming-language-python), which activates when the JSON file is uploaded to Blob Storage:
    * Retrieve JSON file
    * Request each news article content
    * Transform article content
1. *Store Data*: Store processed data in [Azure Data Lake Storage Gen 2](/azure/storage/blobs/data-lake-storage-introduction):

## Prerequisites for the tutorial

If you haven't already, follow all the instructions on [Configure your local Python dev environment for Azure](./configure-local-development-environment.md).

To complete this tutorial, you'll need:

* An Azure account with an active subscription, if you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/)
* [Python 3.9 or later](https://www.python.org/downloads/) is installed locally
* [Azure Functions Core Tools](/azure/azure-functions/functions-run-local)
* [Azure CLI](/cli/azure/install-azure-cli)
* [Visual Studio Code](https://code.visualstudio.com/download)
    * [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
    * [Azure Blob Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)

## Get the sample solution

A sample Python solution is optionally available to help you follow along with this tutorial so you don't have to create the app or paste in the code. Download or clone the sample codebase to your local workstation. 

In subsequent steps that ask you to create the app or apply code to the app, that work is already completed in the sample app. 

> [!CAUTION]
> If you download and open this sample, you don't need to copy any code, but you need to edit the settings for Azure resources in the **local.settings.json** for local development.

1. Clone the sample solution:

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-python-etl-serverless
    ```

1. Navigate to the application folder:

    ```bash
    cd msdocs-python-etl-serverless
    ```

1. Create the virtual environment:

    ### [Windows](#tab/cmd)

    ```bash
    # py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
    py -3 -m venv .venv
    ```

    ### [macOS/Linux](#tab/bash)

    ```bash
    python3 -m venv .venv
    ```

    ---

1. Create a [**requirements.txt**](https://github.com/Azure-Samples/msdocs-python-etl-serverless/blob/main/requirements.txt) file at the root and copy the following into it. 

    :::code language="python" source="~/../msdocs-python-etl-serverless/requirements.txt" :::

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

    The following Azure SDKs for Python are installed.

    |SDK docs   |Install | Python package index |
    |---------------------|--------|----------------------|
    | [Azure Storage Blobs](/python/api/overview/azure/storage-blob-readme) | `pip install azure-storage-blob`| [azure-storage-blob](https://pypi.org/project/azure-storage-blob/) |
    | [Azure Storage File Data Lake](/python/api/overview/azure/storage-file-datalake-readme) | `pip install azure-storage-file-datalake` | [azure-storage-file-datalake](https://pypi.org/project/azure-storage-file-datalake/) |
    | [Bing News Search API](/bing/search-apis/bing-news-search/reference/endpoints) | `pip install microsoft-bing-newssearch`| [microsoft-bing-newssearch](https://pypi.org/project/microsoft-bing-newssearch/) |
    | [Azure Identity](/python/api/overview/azure/identity-readme) | `pip install azure-identity` | [azure-identity](https://pypi.org/project/azure-identity/) |
    | [Azure Key Vault Secrets](/python/api/overview/azure/keyvault-secrets-readme) | `pip install azure-keyvault-secrets` | [azure-keyvault-secrets](https://pypi.org/project/azure-keyvault-secrets/) |
    | [Azure Core](/python/api/overview/azure/core-readme) | `pip install azure-core` | [azure-core](https://pypi.org/project/azure-core/) |
    | [Azure Function](/python/api/azure-functions/azure.functions) | `pip install azure-functions` | [azure-functions](https://pypi.org/project/azure-functions/) |

## Create a resource group for your project

Create a resource group named `msdocs-python-cloud-etl-rg` in a region near you. A resource group allows you to control security and billing limited to the resource group. 

[!INCLUDE [create resource group 3-tab](../includes/create-resource-group.md)]

## Give your account permission as Contributor to resources

Use this Azure CLI command to give your Azure user account the **Contributor** role in role-based access control (RBAC). This expedites some of the security a developer needs for local development to Azure. Additional security is applied as needed throughout this tutorial series.

```azurecli
# Assign user to the resource group as a contributor

# Email you use to sign into Azure 
user="youremail@domain.com"

# Resource group created in previous step
resourcegroup="msdocs-python-cloud-etl-rg"

# Assign Contributor role
az role assignment create \
    --role Contributor \
    --assignee $user \
    --resource-group  $resourcegroupname
```

## Sign in to Azure for local developer authentication

To authenticate your local development environment to Azure, sign in with Azure CLI. 

If you didn't log in in the terminal in the previous step, do that now. In a terminal or command prompt, use the Azure CLI, with [az login](/cli/azure/reference-index#az-login) to sign in to Azure on your local computer. To finish the authentication process, follow the steps displayed in your terminal.

```azurecli
az login
```

## Next step

> [!div class="nextstepaction"]
> [Get data and store >>](tutorial-deploy-azure-cloud-python-etl-02-get-data.md)
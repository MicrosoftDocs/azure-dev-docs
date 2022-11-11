---
title: "Tutorial: Deploy a Python Cloud ETL Solution on Azure"
description: This series will guide you through creating and deploying a serverless, cloud Extract, Transform, and Load (ETL) Python solution to Azure.
services: python, azure-functions, azure-storage-accounts
ms.custom: devx-track-python, devx-track-azurecli
ms.devlang: python
ms.topic: conceptual
ms.date: 10/04/2022
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Overview: Deploy a serverless Python cloud ETL solution on Azure

This procedure guides you through creating and deploying a serverless, cloud *Extract, Transform, and Load* (ETL) Python solution to Azure.

* [GitHub: Sample application](https://github.com/Azure-Samples/msdocs-python-etl-serverless)

:::image type="content" source="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" alt-text="Deploy Serverless, Azure Cloud Python ETL Solution Architecture Diagram" lightbox="./media/tutorial-deploy-azure-cloud-python-etl/deploy-azure-cloud-python-etl-architecture.svg" border="false":::

## What the sample solution does

When deployed, the sample solution flow includes:

1. *Get Data*: Use an Azure HTTPTrigger Function to search with [Bing News Search API](/bing/search-apis/bing-news-search/overview)
1. *Store Data*: Store the search results as a JSON file in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview) container.
1. *Process Data*: Use an Azure BlobTrigger Function, which activates when the JSON file is uploaded to Blob Storage:
    * Retrieve JSON file
    * Request each news article content
    * Transform article content
1. *Store Data*: Store processed data in [Azure Data Lake Storage Gen 2](/azure/storage/blobs/data-lake-storage-introduction):

## Prerequisites for the tutorial

If you haven't already, follow all the instructions on [Configure your local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment).

To complete this tutorial, you'll need:

* An Azure account with an active subscription, if you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/)
* [Python 3.9 or later](https://www.python.org/downloads/) is installed locally
* Node.js LTS and the following npm packages
    * [Azure Functions Core Tools](/azure/azure-functions/functions-run-local)
* [Azure CLI](/cli/azure/install-azure-cli)


## Get the sample solution

A sample Python solution is available to help you follow along with this tutorial. Download or clone the sample codebase to your local workstation. 

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

1. Create a virtual environment for the solution:

    [!INCLUDE [proxy-note](./includes/create-virtual-environment-tab.md)]

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

    The following Azure SDKs for Python are installed.

    |SDK docs   |Install | Python package index |
    |---------------------|--------|----------------------|
    |[Azure Storage Blobs](/python/api/overview/azure/storage-blob-readme) | `pip install azure-storage-blob`| [azure-storage-blob](https://pypi.org/project/azure-storage-blob/) |
    | [Azure Storage File Data Lake](/python/api/overview/azure/storage-file-datalake-readme) | `pip install azure-storage-file-datalake` | [azure-storage-file-datalake](https://pypi.org/project/azure-storage-file-datalake/) |
    | [Bing News Search API](/bing/search-apis/bing-news-search/reference/endpoints) | `pip install microsoft-bing-newssearch`| [microsoft-bing-newssearch](https://pypi.org/project/microsoft-bing-newssearch/) |
    | [Azure Identity](/python/api/overview/azure/identity-readme) | `pip install azure-identity` | [azure-identity](https://pypi.org/project/azure-identity/) |
    | [Azure Key Vault Secrets](/python/api/overview/azure/keyvault-secrets-readme) | `pip install azure-keyvault-secrets` | [azure-keyvault-secrets](https://pypi.org/project/azure-keyvault-secrets/) |
    | [Azure Core](/python/api/overview/azure/core-readme) | `pip install azure-core` | [azure-core](https://pypi.org/project/azure-core/) |
    | [Azure Function](/python/api/azure-functions/azure.functions) | `pip install azure-functions` | [azure-functions](https://pypi.org/project/azure-functions/) |

> [!NOTE]
> If you are following this tutorial with your own solution, look at the [requirements.txt](https://github.com/Azure-Samples/msdocs-python-etl-serverless/blob/main/requirements.txt) to see what packages you'll need.

## Create a resource group for your project

Create a resource group named `msdocs-python-cloud-etl-rg` in a region near you.

[!INCLUDE [create resource group 3-tab](../includes/create-resource-group.md)]

## Sign in to Azure for local developer authentication

To authenticate your local development environment to Azure, sign in with Azure CLI. 

1. Open a terminal or command line.
1. Use the Azure CLI, with [az login](/cli/azure/reference-index#az-login) to sign in to Azure on your local computer. To finish the authentication process, follow the steps displayed in your terminal.

    ```azurecli
    az login
    ```

## Next step

> [!div class="nextstepaction"]
> [Get Started >>](tutorial-deploy-azure-cloud-python-etl-02-get-data.md)

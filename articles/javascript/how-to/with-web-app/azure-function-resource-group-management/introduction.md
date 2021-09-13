---
title: Resource group management API
description: Learn how to build an Azure Function API to manage Azure resource groups.
ms.topic: how-to
ms.date: 09/13/2021
ms.custom: devx-track-js
---

# 1. Manage Azure resource groups with Function API

In this article series, you'll create a Azure Function app with APIs to manage Azure resource groups.

* [Sample code](https://github.com/Azure-Samples/js-e2e-azure-resource-management-functions)

[!INCLUDE [Create or use existing Azure Subscription ](../../../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download) installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
    - [Azure Function](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to deploy a Function app to Azure.
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) to view Azure resource groups.
- [Azure CLI](/cli/azure/install-azure-cli) installed to your local machine.

While the source code is written with TypeScript, the source code is very simple. If you are comfortable with modern JavaScript, the code in this article series will be familiar to you.

## Application architecture

The app provides the following API endpoints.

|Method|URL|Description|
|--|--|--|
|POST,DELETE|http://localhost:7071/api/resource-group|Add, delete a resource group.|
|GET| http://localhost:7071/api/resource-groups |List all resource groups in subscription.|
|GET| http://localhost:7071/api/resources | List all resources in a subscription or resource group.|

While these endpoints are public in this article series, you _should_ secure your API endpoints with authentication and authorization before deploying to your live environment. 

This app is limited to a subscription because that is what the DefaultAzureCredential specifies. 

## Preparing your environment

You must prepare your local and cloud environments to use the Azure Identity SDK.

### Create an Azure service principal

An Azure service principal provides access to Azure without having to use your personal user credentials. The service principal can be used both in your local and cloud environments. 

1. In a bash terminal, [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli):

    ```bash
    az login
    ```
1. Determine a service principal name format so you can easily find your service principal later. For example, several format ideas are:

    * Your project and owner: `resource-management-john-smith`.
    * Your department and date: `IT-2021-September`
    * A unique identifier: `1e8966d7-ba85-424b-9db4-c39e1ae9d0ca`

1. In a bash terminal, create your service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az_ad_sp_create_for_rbac): 

    ```bash
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME
    ```
1. Copy the entire output results to a temporary file. You will need these settings later.

    ```json
    {
      "appId": "YOUR-SERVICE-PRINCIPAL-ID",
      "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
      "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
      "password": "!@#$%",
      "tenant": "YOUR-TENANT-ID"
    }
    ```

## Get your Azure subscription ID

1. In a bash terminal, get your subscriptions and find the subscription ID you want to use for this article series.

```bash
az account list --output table
```

1. Copy the subscription ID to the previous temporary file. You will need this setting later. 

## Next steps

* [Create your local Azure Function app](create-function-app-for-resource-groups.md)

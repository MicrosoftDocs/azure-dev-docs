---
title: Some cool title here
description: Enter description here
ms.topic: tutorial
ms.date: 10/27/2021
ms.service: app-service
ms.role: developer
ms.devlang: javascript
ms.azure.dev-framework: 
ms.azure.devx-azure-tooling: ['azure-portal', 'vscode-azure-tools', 'azure-cli']
ms.custom: 
ROBOTS: NOINDEX
---

# Deploy an ASP.NET Core Web App with a SQL Database to Azure

In this tutorial, you'll deploy a sample **ASP.NET Core App** app using a **SQL** database to Azure.  The ASP.NET Core app will be hosted in Azure App Service which supports both Linux and Windows server environments. 

:::image type="content" source="media/app-diagram.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

This article assumes you are already familiar with [Node.js development](/learn/paths/build-javascript-applications-nodejs/) and have Node and MongoDB installed locally. You'll also need an Azure account with an active subscription.  If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/nodejs/).

## 1 Setup the Sample Application

To follow along with this tutorial, clone or download the sample application from the repository [https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app).

[Download Sample Project](https://portal.azure.com/)

```bash
git clone https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app.git
```

## 2 - Create the First Azure Service

Let's get this app started!

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal create service 1](<./includes/azure-portal-1.md>)] | :::image type="content" source="./media/azure-portal-1-240px.png" alt-text="Be sure to include alt text." lightbox="./media/create-service/azure-portal-1.png"::: |
| [!INCLUDE [Azure portal create service 2](<./includes/azure-portal-2.md>)] | :::image type="content" source="./media/azure-portal-2-240px.png" alt-text="Be sure to include alt text." lightbox="./media/create-service/azure-portal-2.png"::: |
| [!INCLUDE [Azure portal create service 3](<./includes/azure-portal-3.md>)] | :::image type="content" source="./media/azure-portal-3-240px.png" alt-text="Be sure to include alt text." lightbox="./media/azure-portal-3.png"::: |

### [VS Code](#tab/vscode)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Witness the awesomeness of VS Code!

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

```azurecli
az group list
```

### [Azure PowerShell](#tab/azure-powershell)

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-az-ps).


```azurepowershell

```

----

## 6 - Stream Diagnostic Logs

Oh it is cool!

## 6 - Maybe even look deeper

So cool I'll look at it even deeper!

## Clean up resources

### [Azure portal](#tab/azure-portal)

### [VS Code](#tab/vscode)

### [Azure CLI](#tab/azure-cli)

### [Azure PowerShell](#tab/azure-powershell)

----

## Next Steps

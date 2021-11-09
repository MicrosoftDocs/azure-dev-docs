---
title: Some cool title here
description: Enter description here
ms.topic: tutorial
ms.date: 10/27/2021
ms.service: database
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
| [!INCLUDE [Create app service step 1](<./includes/create-sql-database/azure-portal-1.md>)] | :::image type="content" source="./media/azportal-create-database-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-database-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/create-sql-database/azure-portal-2.md>)] | :::image type="content" source="./media/azportal-create-database-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-database-2.png"::: |
| [!INCLUDE [Create app service step 3](<./includes/create-sql-database/azure-portal-3.md>)] | :::image type="content" source="./media/azportal-create-database-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-database-3.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-sql-database/azure-portal-4.md>)] | :::image type="content" source="./media/azportal-create-database-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-create-database-4.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-sql-database/azure-portal-5.md>)] | :::image type="content" source="./media/azportal-create-database-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-create-database-5.png"::: |

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


## 2 - Create the Database
Let's get this app started!

### [Azure portal](#tab/azure-portal-database)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create database step 1](<./includes/create-sql-database/azure-portal-sqldb-create-01.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-database-1.png"::: |
| [!INCLUDE [Create database step 2](<./includes/create-sql-database/azure-portal-sqldb-create-02.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-database-2.png"::: |
| [!INCLUDE [Create database step 3](<./includes/create-sql-database/azure-portal-sqldb-create-03.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-database-3.png"::: |
| [!INCLUDE [Create database step 4](<./includes/create-sql-database/azure-portal-sqldb-create-04.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-create-database-4.png"::: |
| [!INCLUDE [Create database step 4](<./includes/create-sql-database/azure-portal-sqldb-create-05.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-create-database-5.png"::: |

### [VS Code](#tab/vscode-database)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Witness the awesomeness of VS Code!

### [Azure CLI](#tab/azure-cli-database)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

```azurecli
az group list
```

### [Azure PowerShell](#tab/azure-powershell-database)

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

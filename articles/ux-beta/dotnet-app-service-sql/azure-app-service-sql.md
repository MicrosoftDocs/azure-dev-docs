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

Azure App Service provides a highly scalable, self-patching web hosting service that you can use to easily deploy apps on Windows or Linux. In this tutorial, you'll learn how to deploy an ASP.NET Core app to Azure App Service and connect it to an Azure SQL Database.

:::image type="content" source="media/azure-app-in-browser.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

This article assumes general familiarity with [.NET]("https://dotnet.microsoft.com/download/dotnet/6.0") and assumes you have it installed locally. You'll also need an Azure account with an active subscription.  If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/nodejs/).

## 1 - Setup the Sample Application

To follow along with this tutorial, clone or download the sample application from the repository [https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial).

[Download Sample Project](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial/archive/refs/heads/master.zip)

```bash
git clone https://github.com/azure-samples/dotnetcore-sqldb-tutorial
cd dotnetcore-sqldb-tutorial
```

## 2 - Create the App Service

First let's create the Azure App Service that will host our deployed Web App. There are several different ways of creating an App Service depending on your desired workflow.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/create-app-service/azure-portal-1.md>)] | :::image type="content" source="./media/azportal-create-app-service-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-app-service-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/create-app-service/azure-portal-2.md>)] | :::image type="content" source="./media/azportal-create-app-service-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-database-2.png"::: |
| [!INCLUDE [Create app service step 3](<./includes/create-app-service/azure-portal-3.md>)] | :::image type="content" source="./media/azportal-create-app-service-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-database-3.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-app-service/azure-portal-4.md>)] | :::image type="content" source="./media/azportal-create-app-service-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-create-database-4.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/create-app-service/azure-portal-5.md>)] | :::image type="content" source="./media/azportal-create-app-service-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-create-database-5.png"::: |

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

## 3 - Create the Database
Next let's create the Azure SQL that will manage the data in our app.

### [Azure portal](#tab/azure-portal-database)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create database step 1](<./includes/create-sql-database/azure-portal-sqldb-create-01.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-database-1.png"::: |
| [!INCLUDE [Create database step 2](<./includes/create-sql-database/azure-portal-sqldb-create-02.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-database-2.png"::: |
| [!INCLUDE [Create database step 3](<./includes/create-sql-database/azure-portal-sqldb-create-03.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-database-3.png"::: |

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


## 4 - Deploy to the App Service

We are now ready to deploy our .NET app to the App Service.

### [VS Code](#tab/vscode-deploy)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy app service step 1](<./includes/deploy-app-service/vscode-deploy-app-service-01.md>)] | :::image type="content" source="./media/azportal-create-app-service-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-app-service-1.png"::: |
| [!INCLUDE [Deploy app service step 2](<./includes/deploy-app-service/vscode-deploy-app-service-02.md>)] | :::image type="content" source="./media/azportal-create-app-service-2-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/azportal-create-app-service-2.png"::: |

### [Visual Studio](#tab/visualstudio-deploy)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Witness the awesomeness of VS Code!

### [Azure CLI](#tab/azure-cli-deploy)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

```azurecli
az group list
```

### [Azure PowerShell](#tab/azure-powershell-deploy)

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-az-ps).


```azurepowershell

```

----

## 5 - Connect the App to the Database
Next we must connect the App hosted in our App Service to our database using a Connection String.

### [Azure portal](#tab/azure-portal-connect)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connect Service step 1](<./includes/connect-app-database/azure-portal-connect-database-01.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-connect-service-1.png"::: |
| [!INCLUDE [Connect Service step 2](<./includes/connect-app-database/azure-portal-connect-database-02.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-connect-service-2.png"::: |

### [Azure CLI](#tab/azure-cli-connect)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

```azurecli
az group list
```

### [Azure PowerShell](#tab/azure-powershell-connect)

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-az-ps).


```azurepowershell

```

----

## 6 - Generate the Database Schema
We need to allow our local computer to connect to Azure to finish setting up our database. For this step you'll need to know your local computer's IP Address.  You can discover that typing `ipconfig` into a command window.  Copy this IP Address for later use.  If you are on a corporate VPN, make sure to pick the IP Address for the VPN adpater.

### [Azure portal](#tab/azure-portal-schema)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connect Service step 1](<./includes/generate-database-schema/azure-portal-generate-schema-01.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-connect-service-1.png"::: |
| [!INCLUDE [Connect Service step 2](<./includes/generate-database-schema/azure-portal-generate-schema-02.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-connect-service-2.png"::: |
| [!INCLUDE [Connect Service step 3](<./includes/generate-database-schema/azure-portal-generate-schema-03.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-connect-service-3.png"::: |
| [!INCLUDE [Connect Service step 4](<./includes/generate-database-schema/azure-portal-generate-schema-04.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-connect-service-4.png"::: |
| [!INCLUDE [Connect Service step 5](<./includes/generate-database-schema/azure-portal-generate-schema-05.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-connect-service-5.png"::: |

### [Azure CLI](#tab/azure-cli-schema)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

```azurecli
az group list
```

### [Azure PowerShell](#tab/azure-powershell-schema)

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-az-ps).


```azurepowershell

```

----

## 7 - Browse with kudu

Azure App Service provides a web-based diagnostics console named Kudu that allows you to examine the server hosting environment for your web app. Using Kudu, you can view the files deployed to Azure, review the deployment history of the application, and even open an SSH session into the hosting environment.

To access Kudu, navigate to one of the following URLs. You will need to sign into the Kudu site with your Azure credentials.

- For apps deployed in Free, Shared, Basic, Standard, and Premium App Service plans - `https:/?<app-name>.scm.azurewebsites.net`
- For apps deployed in Isolated service plans - `https://<app-name>.scm.<ase-name>.p.azurewebsites.net`
From the main page in Kudu, you can access information about the application hosting environment, app settings, deployments, and browse the files in the wwwroot directory.

## 8 - Stream logs

## Stream diagnostic logs

While the ASP.NET Core app runs in Azure App Service, you can get the console logs piped to the Cloud Shell. That way, you can get the same diagnostic messages to help you debug application errors.

The sample project already follows the guidance for the [Azure App Service logging provider](/dotnet/core/extensions/logging-providers#azure-app-service) with two configuration changes:

- Includes a reference to `Microsoft.Extensions.Logging.AzureAppServices` in *DotNetCoreSqlDb.csproj*.
- Calls `loggerFactory.AddAzureWebAppDiagnostics()` in *Program.cs*.

1. To set the ASP.NET Core [log level](/dotnet/core/extensions/logging#log-level) in App Service to `Information` from the default level `Error`, use the [`az webapp log config`](/cli/azure/webapp/log#az_webapp_log_config) command in the Cloud Shell.

    ```azurecli-interactive
    az webapp log config --name <app-name> --resource-group myResourceGroup --application-logging filesystem --level information
    ```

    > [!NOTE]
    > The project's log level is already set to `Information` in *appsettings.json*.

1. To start log streaming, use the [`az webapp log tail`](/cli/azure/webapp/log#az_webapp_log_tail) command in the Cloud Shell.

    ```azurecli-interactive
    az webapp log tail --name <app-name> --resource-group myResourceGroup
    ```

1. Once log streaming has started, refresh the Azure app in the browser to get some web traffic. You can now see console logs piped to the terminal. If you don't see console logs immediately, check again in 30 seconds.

1. To stop log streaming at any time, type `Ctrl`+`C`.

For more information on customizing the ASP.NET Core logs, see [Logging in .NET](/dotnet/core/extensions/logging).


## 8 - Clean up resources

### [Azure portal](#tab/azure-portal)

### [VS Code](#tab/vscode)

### [Azure CLI](#tab/azure-cli)

### [Azure PowerShell](#tab/azure-powershell)

----

## Next Steps

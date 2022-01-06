---
title: Deploy ASP.NET Core SQL App to Azure
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

In this tutorial, you'll learn how to deploy an ASP.NET Core app to Azure App Service and connect to an Azure SQL Database. Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux.  Although this tutorial uses an ASP.NET Core 6.0 app, the process is the same for other versions of ASP.NET Core and ASP.NET Framework.

This article assumes you're familiar with [.NET]("https://dotnet.microsoft.com/download/dotnet/6.0") and have it installed locally. You'll also need an Azure account with an active subscription.  If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free).

## 1 - Set up the Sample Application

To follow along with this tutorial, [Download the Sample Project](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial/archive/refs/heads/master.zip) from the repository [https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial](https://github.com/Azure-Samples/dotnetcore-sqldb-tutorial) or clone it using the Git command below.

```bash
git clone https://github.com/azure-samples/dotnetcore-sqldb-tutorial
cd dotnetcore-sqldb-tutorial
```

:::image type="content" source="media/azure-app-in-browser.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

## 2 - Create the App Service

Let's first create the Azure App Service that will host our deployed Web App. There are several different ways to create an App Service depending on your ideal workflow.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/create-app-service/azure-portal-1.md>)] | :::image type="content" source="./media/azportal-create-app-service-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-app-service-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/create-app-service/azure-portal-2.md>)] | :::image type="content" source="./media/azportal-create-app-service-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-app-service-2.png"::: |
| [!INCLUDE [Create app service step 3](<./includes/create-app-service/azure-portal-3.md>)] | :::image type="content" source="./media/azportal-create-app-service-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-app-service-3.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-app-service/azure-portal-4.md>)] | :::image type="content" source="./media/azportal-create-app-service-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-create-app-service-4.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/create-app-service/azure-portal-5.md>)] | :::image type="content" source="./media/azportal-create-app-service-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-create-app-service-5.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, create a resource group using the [az group create](/cli/azure/group?view=azure-cli-latest#az_group_create) command. The resource group will act as a container for all of the Azure resources related to this application.

```azurecli-interactive
# Use 'az account list-locations --output table' to list available locations close to you
# Create a resource group
az group create --location eastus --name msdocs-core-sql
```

Next, create an App Service plan using the [az appservice plan create](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az_appservice_plan_create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the F1 (Free) service plan.  For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) page.

```azurecli-interactive

 # Change 123 to any three characters to form a unique name across Azure
az appservice plan create
    --name msdocs-core-sql-plan-123 
    --resource-group msdocs-core-sql
    --sku F1
```

Finally, create the App Service web app using the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command.  

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of .NET your app is running. This example uses .NET 6.0 LTS. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table` for Linux and `az webapp list-runtimes --output table` for Windows.

```azurecli-interactive

az webapp create
    --name <your-app-service-name>
    --runtime "DOTNET|6.0"
    --plan <your-app-service-plan-name>  
    --resource-group msdocs-core-sql
```

----

## 3 - Create the Database
Next let's create the Azure SQL Database that will manage the data in our app.

### [Azure portal](#tab/azure-portal-database)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create database step 1](<./includes/create-sql-database/azure-portal-sqldb-create-01.md>)] | :::image type="content" source="./media/azportal-create-sql-01-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-sql-01.png"::: |
| [!INCLUDE [Create database step 2](<./includes/create-sql-database/azure-portal-sqldb-create-02.md>)] | :::image type="content" source="./media/azportal-create-sql-02-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-sql-02.png"::: |
| [!INCLUDE [Create database step 3](<./includes/create-sql-database/azure-portal-sqldb-create-03.md>)] | :::image type="content" source="./media/azportal-create-sql-03-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-sql-03.png"::: |
| [!INCLUDE [Create database step 4](<./includes/create-sql-database/azure-portal-sqldb-create-04.md>)] | :::image type="content" source="./media/azportal-create-sql-04-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-sql-04.png"::: |
| [!INCLUDE [Create database step 5](<./includes/create-sql-database/azure-portal-sqldb-create-05.md>)] | :::image type="content" source="./media/azportal-create-sql-05-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-sql-05.png"::: |
| [!INCLUDE [Create database step 6](<./includes/create-sql-database/azure-portal-sqldb-create-06.md>)] | :::image type="content" source="./media/azportal-create-sql-06-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-sql-06.png"::: |
| [!INCLUDE [Create database step 7](<./includes/create-sql-database/azure-portal-sqldb-create-07.md>)] | :::image type="content" source="./media/azportal-create-sql-07-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-sql-07.png"::: |

### [Azure CLI](#tab/azure-cli-database)

To create an Azure SQL database, we first must create a SQL Server to host it. A new Azure SQL Server is created by using the [az sql server create ](/cli/azure/sql/server?view=azure-cli-latest#az_sql_server_create) command.

Replace the <server-name> placeholder with a unique SQL Database name. This name is used as the part of the globally unique SQL Database endpoint, <server-name>.database.windows.net. Also, replace <db-username> and <db-username> with a username and password of your choice.

```azurecli-interactive
az sql server create 
    --location eastus
    --resource-group msdocs-core-sql
    --server <server-name>
    --admin-user <db-username>
    --admin-password <db-password>
```

Provisioning a SQL Server may take a few minutes.  Once the resource is available, we can create a database with the [az sql db create](/cli/azure/sql/db?view=azure-cli-latest#az_sql_db_create) command.

```azurecli-interactive
az sql db create 
    --resource-group msdocs-core-sql
    --server <server-name>
    --name coreDb
```

We also need to add the following firewall rule to our database server to allow other Azure resources to access it.

```azurecli-interactive
az sql server firewall-rule create 
    --resource-group msdocs-core-sql
    --server <server-name> 
    --name AzureAccess
    --start-ip-address 0.0.0.0 
    --end-ip-address 0.0.0.0
```

----

## 4 - Deploy to the App Service

We're now ready to deploy our .NET app to the App Service.


### [Deploy using Visual Studio](#tab/visualstudio-deploy)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy app service step 1](<./includes/deploy-app-service/vstudio-deploy-app-service-01.md>)] | :::image type="content" source="./media/vstudio-deployapp-service-01-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/vstudio-deployapp-service-01.png"::: |
| [!INCLUDE [Deploy app service step 2](<./includes/deploy-app-service/vstudio-deploy-app-service-02.md>)] | :::image type="content" source="./media/vstudio-deployapp-service-02-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/vstudio-deployapp-service-02.png"::: |
| [!INCLUDE [Deploy app service step 3](<./includes/deploy-app-service/vstudio-deploy-app-service-03.md>)] | :::image type="content" source="./media/vstudio-deployapp-service-03-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/vstudio-deployapp-service-03.png"::: |
| [!INCLUDE [Deploy app service step 4](<./includes/deploy-app-service/vstudio-deploy-app-service-04.md>)] | :::image type="content" source="./media/vstudio-deployapp-service-04-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/vstudio-deployapp-service-04.png"::: |
| [!INCLUDE [Deploy app service step 5](<./includes/deploy-app-service/vstudio-deploy-app-service-05.md>)] | :::image type="content" source="./media/vstudio-deployapp-service-05-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/vstudio-deployapp-service-05.png"::: |

### [Deploy using VS Code](#tab/vscode-deploy)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy app service step 1](<./includes/deploy-app-service/vscode-deploy-app-service-01.md>)] | :::image type="content" source="./media/vscode-deploy-01-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/vscode-deploy-01.png"::: |
| [!INCLUDE [Deploy app service step 2](<./includes/deploy-app-service/vscode-deploy-app-service-02.md>)] | :::image type="content" source="./media/vscode-deploy-02-240px.png" alt-text="A screenshot showing the deploy button on the App Services page used to deploy a new web app." lightbox="./media/vscode-deploy-02.png"::: |

### [Deploy using Local Git](#tab/azure-cli-deploy)

[!INCLUDE [Deploy using Local Git](<./includes/deploy-app-service/deploy-local-git.md>)]

---

## 5 - Connect the App to the Database
Next we must connect the App hosted in our App Service to our database using a Connection String.

### [Azure portal](#tab/azure-portal-connect)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connect Service step 1](<./includes/connect-app-database/azure-portal-connect-database-01.md>)] | :::image type="content" source="./media/azportal-connect-sqldb-01-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-connect-sqldb-01.png"::: |
| [!INCLUDE [Connect Service step 2](<./includes/connect-app-database/azure-portal-connect-database-02.md>)] | :::image type="content" source="./media/azportal-connect-sqldb-02-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-connect-sqldb-02.png"::: |
| [!INCLUDE [Connect Service step 3](<./includes/connect-app-database/azure-portal-connect-database-03.md>)] | :::image type="content" source="./media/azportal-connect-sqldb-03-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-connect-sqldb-03.png"::: |
| [!INCLUDE [Connect Service step 4](<./includes/connect-app-database/azure-portal-connect-database-04.md>)] | :::image type="content" source="./media/azportal-connect-sqldb-04-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-connect-sqldb-04.png"::: |

### [Azure CLI](#tab/azure-cli-connect)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

We can retrieve the Connection String for our database using the [az sql db show-connection-string](/cli/azure/sql/db?view=azure-cli-latest#az_sql_db_show_connection_string) command.  This command allows us to add the Connection String to our App Service configuration settings. Copy this Connection String value for later use.

```azurecli-interactive
az sql db show-connection-string 
    --client ado.net 
    --name coreDb 
    --server <your-server-name>
```

Next, let's assign the Connection String to our App Service using the command below. `MyDbConnection` is the name of the Connection String in our appsettings.json file, which means it will be loaded by our app during startup.

Make sure to replace the username and password in the connection string with your own before running the command.

```azurecli-interactive
az webapp config connection-string set 
    -g msdocs-core-sql
    -n <your-app-name> 
    -t SQLServer 
    --settings MyDbConnection=<your-connection-string>

```

----

## 6 - Generate the Database Schema
To generate our database schema, we need to configure a firewall rule on our Database Server.  This rule will allow our local computer to connect to Azure. For this step you'll need to know your local computer's IP Address, which you can discover [by clicking here](https://whatismyipaddress.com/)  

### [Azure portal](#tab/azure-portal-schema)

In the Azure portal:

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Generate schema step 1](<./includes/generate-database-schema/azure-portal-generate-schema-01.md>)] | :::image type="content" source="./media/azportal-generate-schema-01-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-connect-service-1.png"::: |
| [!INCLUDE [Generate schema step 2](<./includes/generate-database-schema/azure-portal-generate-schema-02.md>)] | :::image type="content" source="./media/azportal-generate-schema-02-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-connect-service-2.png"::: |


### [Azure CLI](#tab/azure-cli-schema)

Run the [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule?view=azure-cli-latest#az_sql_server_firewall_rule_create) command to add a firewall rule to your SQL Server instance.

```azurecli-interactive
az sql server firewall-rule create -resource-group msdocs-core-sql --server <yoursqlserver> --name LocalAccess --start-ip-address <your-ip> --end-ip-address <your-ip>
```

----

Next, run the commands below to install the necessary CLI tools for Entity Framework Core, create an initial database migration file, and apply those changes to update the database.

```dotnetcli
dotnet tool install -g dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

After the migration completes, your Azure SQL database will have the correct schema.

Note: If you receive an error stating `Client with IP address xxx.xxx.xxx.xxx is not allowed to access the server`, that means the IP address you entered into your Azure firewall rule is incorrect. To fix this issue, update the Azure firewall rule with the IP address provided in the error message.




## 7 - Browse the Deployed Application and File Directory

Navigate back to your web app in the browser. You can always get back to your site by clicking the **Browse** link at the top of the App Service overview page. If you refresh the page, you can now Create Todos and see them displayed on the home page. Congratulations!

:::image type="content" source="../../media/app-success.png" alt-text="A screenshot showing the app successfully deployed to Azure." :::

Next, let's take a closer look at the deployed files of our app using a tool called Kudu.

Azure App Service provides a web-based diagnostics console named Kudu. Kudu allows you to examine the server-hosting environment for your web app. You can view the files deployed to Azure, review the deployment history, and even open an SSH session into the hosting environment.

To access Kudu, navigate to one of the following URLs. You'll need to sign into the Kudu site with your Azure credentials.

- For apps deployed in Free, Shared, Basic, Standard, and Premium App Service plans - `https:/<app-name>.scm.azurewebsites.net`
- For apps deployed in Isolated service plans - `https://<app-name>.scm.<ase-name>.p.azurewebsites.net`
From the main page in Kudu, you can access information about the application-hosting environment, app settings, deployments, and browse the files in the wwwroot directory.

## 8 - Stream diagnostic logs

## 6 - Configure and view application logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability. The contents of the App Service diagnostic logs can be reviewed in the Azure portal, VS Code, or using the Azure CLI.

### [Azure portal](#tab/azure-portal-stream)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from Azure portal 1](<./includes/stream-logs/azure-portal-01.md>)] | :::image type="content" source="./media/azportal-stream-logs-1-240px.png" alt-text="A screenshot showing the location of the Azure Tool icon in Visual Studio Code." lightbox="./media/azportal-stream-logs-1.png"::: |
| [!INCLUDE [Stream logs from Azure portal 2](<./includes/stream-logs/azure-portal-02.md>)] | :::image type="content" source="./media/azportal-stream-logs-2-240px.png" alt-text="A screenshot showing how you deploy an application to Azure by right-clicking on a web app in VS Code and selecting deploy from the context menu." lightbox="./media/azportal-stream-logs-2.png"::: |

### [VS Code](#tab/vscode-aztools-stream)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from VS Code 1](<./includes/stream-logs/vscode-stream-logs-01.md>)] | :::image type="content" source="./media/vscode-stream-logs-1-240px.png" alt-text="A screenshot showing the location of the Azure Tool icon in Visual Studio Code." lightbox="./media/vscode-stream-logs-1.png"::: |
| [!INCLUDE [Stream logs from VS Code 2](<./includes/stream-logs/vscode-stream-logs-02.md>)] | :::image type="content" source="./media/vscode-stream-logs-2-240px.png" alt-text="A screenshot showing how you deploy an application to Azure by right-clicking on a web app in VS Code and selecting deploy from the context menu." lightbox="./media/vscode-stream-logs-2.png"::: |

### [Azure CLI](#tab/azure-cli-stream)

You can configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az_webapp_log_config) command.

```azurecli
az webapp log config \
    --web-server-logging 'filesystem' \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

You can also stream logs directly to the console using the [az webapp log tail](/cli/azure/webapp/log#az_webapp_log_tail) command.

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

Refresh the home page in the app or attempt other requests to generate some log messages. The output should look similar to the following.

```Console
2022-01-06T22:37:11  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours. Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
2022-01-06 22:37:16.195 +00:00 [Information] Microsoft.AspNetCore.Hosting.Diagnostics: Request starting HTTP/1.1 GET https://coresql456.azurewebsites.net/ - -
2022-01-06 22:37:16.195 +00:00 [Trace] Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware: All hosts are allowed.
2022-01-06 22:37:16.195 +00:00 [Debug] Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware: The request path / does not match a supported file type
2022-01-06 22:37:16.195 +00:00 [Debug] Microsoft.AspNetCore.Routing.Matching.DfaMatcher: 1 candidate(s) found for the request path '/'
2022-01-06 22:37:16.195 +00:00 [Debug] Microsoft.AspNetCore.Routing.Matching.DfaMatcher: Endpoint 'DotNetCoreSqlDb.Controllers.TodosController.Index (DotNetCoreSqlDb)' with route pattern '{controller=Todos}/{action=Index}/{id?}' is valid for the request path '/'
```

---

## Clean up resources

TBD


## Next Steps

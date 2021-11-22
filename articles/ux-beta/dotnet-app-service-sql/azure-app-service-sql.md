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

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli). You can view or the [complete Azure CLI script for creating Azure resources](https://github.dev/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/blob/main/scripts/create-nodejs-mongodb-resources.sh) in the GitHub repository for this tutorial.

First, create a resource group to act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'                          # Use 'az account list-locations --output table' to list locations
RESOURCE_GROUP_NAME='msdocs-core-sql-tutorial'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

Next, create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the F1 (Free) service plan.  For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) page.
* The `--is-linux` flag selects the Linux as the host operating system.  To use Windows, remove this flag from the command.

```azurecli

 # Change 123 to any three characters to form a unique name across Azure
APP_SERVICE_PLAN_NAME='msdocs-core-sql-tutorial-plan-123'    

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

Finally, create the App Service web app using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.  

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of .Net your app is running. This example uses .NET 6.0 LTS. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table` for Linux and `az webapp list-runtimes --output table` for Windows.

```azurecli

# Change 123 to any three characters to form a unique name across Azure
APP_SERVICE_NAME='msdocs-core-sql-tutorial-123'     

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'DOTNET|6.0'
    --plan $APP_SERVICE_PLAN_NAME
    --resource-group $RESOURCE_GROUP_NAME 
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

To create an Azure SQL database, we first must create a SQL Server to host it.

A new Azure SQL Server is created by using the [az sql server create](/cli/azure/cosmosdbaz_cosmosdb_create) command.

```azurecli
az sql server create 
    -l $LOCATION
    -g $RESOURCE_GROUP_NAME
    -n <yourServerName>
    -u <yourUsername> 
    -p <yourPassword>
```

A new Azure SQL database is created by using the [az sql db create](/cli/azure/cosmosdbaz_cosmosdb_create) command.

```azurecli
az sql db create 
    -g $RESOURCE_GROUP_NAME 
    -s <yourSQLServerName> 
    -n coreDb 
    --service-objective S0
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

This approach assumes you have cloned the sample project using Git.

To enable git deployments via the CLI, configure a local git deployment source on your App Service using the `az webapp deployment` command.

This command will return a Git deployment URL for your App Service.  Copy this URL for later use.

```azurecli
    az webapp deployment source config-local-git --name <yourappname> --resource-group $RESOURCE_GROUP_NAME
```

Next, let's add an Azure origin to our local Git repo using the App Service Git deployment URL.

```azurecli
    git remote add azure https://<yourusername>@<yourappName>.scm.azurewebsites.net/<yourappname>.git
```

Finally, push your code using the correct origin and branch name.

```azurecli
    git push azure master
```

This command may take a moment to run, but should deploy your app code successfully.

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

We can retrieve the Connection String for our database using the command below.  This will allow us to add it to our App Service configuration settings. Copy this Connectiong String value for later use.

```azurecli
az sql db show-connection-string --client ado.net --name coreDb --server coredbserver001
```

Next, let's assign the Connection String to our App Service using the command below. `MyDbConnection` is the name of the Connection String in our appsettings.json file, which means it will be loaded by our app during startup.

```azurecli
az webapp config connection-string set -g $RESOURCE_GROUP_NAME -n <yourappname> -t SQLServer--settings MyDbConnection=<yourconnectionstring>

```

----

## 6 - Generate the Database Schema
We need to allow our local computer to connect to Azure to finish setting up our database. For this step you'll need to know your local computer's IP Address.  You can discover that typing `ipconfig` into a command window.  Copy the IP4 Address for later use.  

### [Azure portal](#tab/azure-portal-schema)

In the Azure portal:

   1. In the top search bar, search for the "coredbserverXYZ" server you created earlier and select it from the results.
   1. On the left navigation, select *Firewalls and virtual networks*.
   1. In the Firewall Rules section, enter a *Rule name* of MyLocalAccess.  In the *Start IP* and *End IP* fields, paste the IP Address you copied from your terminal earlier.
   1. Click Save at the top of the screen to persist your changes.

### [Azure CLI](#tab/azure-cli-schema)

Run the following command to add a firewall rule to your SQL Server instance.

```
    az sql server firewall-rule create -resource-group $RESOURCE_GROUP_NAME -server <yoursqlserver> -name "LocalAccess" --start-ip-address <yourip> --end-ip-address <yourip>
```

----

Inside of your local code editor, we need to temporarily update the connection string of our local app to point to the Azure SQL Database.  This will allow us to run Entity Framework Core migrations and generate the correct schema for our database.
1. Open the appsettings.json file in your project.
1. Inside of this file, paste the connection string you copied earlier into the value of the *MyDbConnection* key. Make sure to replace the password with the value you chose when setting up your database.
1.  Your *ConnectionStrings* settings should now look like the code below.
 
---
      "ConnectionStrings": {
        "MyDbConnection": "Server=tcp:MyDbServer.database.windows.net,1433;
                            Initial Catalog=mySqlDb;Persist Security Info=False;
                            User ID=<username>;Password=<password>;
                            MultipleActiveResultSets=False;
                            Encrypt=True;TrustServerCertificate=False;
                            Connection Timeout=30;"
      }
---

Nxt, run the commands below to install the necessary CLI tools for Entity Framework Core, create an intial database migration file, and apply those changes to update the database.

        dotnet tool install -g dotnet-ef
        dotnet ef migrations add InitialCreate
        dotnet ef database update

The migration should complete successfully, and your database is now setup on Azure with the correct schema.

After running these commands, switch your appsettings.json configuration back to the original MyDbConnection value.  This will ensure that the next time you deploy your code to Azure, it will pull the correct Connection String from your App Service configuration by name.  

---
      "ConnectionStrings": {
        "MyDbConnection": "MyDbConnection"
      }
---

Navigate back to your web app in the browser.  If you refresh the page, you should now be able to Create Todos and see them displayed on the home page.


## 7 - Browse with kudu

Azure App Service provides a web-based diagnostics console named Kudu that allows you to examine the server hosting environment for your web app. Using Kudu, you can view the files deployed to Azure, review the deployment history of the application, and even open an SSH session into the hosting environment.

To access Kudu, navigate to one of the following URLs. You will need to sign into the Kudu site with your Azure credentials.

- For apps deployed in Free, Shared, Basic, Standard, and Premium App Service plans - `https:/<app-name>.scm.azurewebsites.net`
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

----

## Next Steps

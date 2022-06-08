---
ms.topic: include
ms.date: 06/03/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

To deploy the backend service, we will:

* Use Azure Resource Manager and the Azure CLI to deploy an Azure App Service and Azure SQL Database to Azure.
* Use Visual Studio 2022 for Mac to publish the service code to the newly created Azure App Service.

### Create resources on Azure

1. Open a terminal and change directory to the folder containing the `TodoApp.sln` file. This directory also contains `azuredeploy.json`.
2. Ensure you've [signed in and selected a subscription](/cli/azure/authenticate-azure-cli) using the Azure CLI.
3. Create a new resource group:

    ``` azurecli
    az group create -l westus -g quickstart
    ```

    This command will create the `quickstart` resource group in the West US region.  You can select any region that you wish, providing you can create resources there.  Ensure you use the same name and region wherever they're mentioned in this tutorial.

4. Create the resources using a group deployment:

    ``` azurecli
    az deployment group create -g quickstart --template-file azuredeploy.json --parameters sqlPassword=MyPassword1234
    ```

    Pick a strong password for your SQL Administrator password.  You'll need it later on when accessing the database.

5. Once the deployment is complete, get the output variables as these hold important information you'll need later on:

    ``` azurecli
    az deployment group show -g quickstart -n azuredeploy --query properties.outputs
    ```

    An example output will be:

    ![Screenshot of command line results.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/deploy-back-end-outputs.png)

6. Make a note of each of the values in the outputs for later use.

### Publish the service code

Open the `TodoApp.sln` in Visual Studio 2022 for Mac. 

1. In the right-hand pane, select the **Solutions Explorer**.
2. Right-click the `TodoApp` solution, then select **Restore NuGet Packages**.
3. Wait for the NuGet package restoration to complete.
4. Right-click the `TodoAppService.NET6` project, then **Publish** > **Publish to Azure...**.
5. Select the service you created above (in the `quickstart` resource group), then select **Publish**.

    ![Screenshot of the target selection window.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/publish-back-end-target.png)

6. Once the backend service is published, a browser will be opened. Add `/tables/todoitem?ZUMO-API-VERSION=3.0.0` to the URL:

    ![Screenshot showing the browser output after the service is published.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/publish-back-end-success.png)

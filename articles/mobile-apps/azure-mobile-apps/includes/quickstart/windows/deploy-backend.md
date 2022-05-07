---
ms.topic: include
ms.date: 05/06/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

To deploy the backend service, we will:

* Use Azure Resource Manager and the Azure CLI to deploy an Azure App Service and Azure SQL Database to Azure.
* Use Visual Studio to publish the service code to the newly created Azure App Service.

### Create resources on Azure.

1. Open a terminal and change directory to the folder containing the `TodoApp.sln` file. This directory also contains `azuredeploy.json`.
1. Ensure you've [signed in and selected a subscription](/cli/azure/authenticate-azure-cli) using the Azure CLI.
1. Create a new resource group:

    ``` azurecli
    az group create -l westus -g quickstart
    ```

    This command will create the `quickstart` resource group in the West US region.  You can select any region that you wish, providing you can create resources there.  Ensure you use the same name and region wherever they're mentioned in this tutorial.

1. Create the resources using a group deployment:

    ``` azurecli
    az deployment group create -g quickstart --template-file azuredeploy.json --parameters sqlPassword=MyPassword1234
    ```

    Pick a strong password for your SQL Administrator password.  You'll need it later on when accessing the database.

2. Once the deployment is complete, get the output variables as these hold important information you'll need later on:

    ``` azurecli
    az deployment group show -g quickstart -n azuredeploy --query properties.outputs
    ```

    An example output will be:

    ![Output of az deployment group show](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/deploy-backend-outputs.png)

3. Make a note of each of the values in the outputs for later use.

### Publish the service code.

Open the `TodoApp.sln` in Visual Studio.

1. In the right-hand pane, select the **Solutions Explorer**.
1. Right-click the `TodoAppService.NET6` project, then select **Set as Startup Project**.
1. On the top menu, select **Build** > **Build TodoAppService.NET6** (or press Ctrl+B).
1. On the top menu, select **Build** > **Publish TodoAppService.NET6**.
1. In the **Publish** window, select Target: **Azure**, then press **Next**.

    ![Target: Azure](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-target.png)

1. Select Specific target: **Azure App Service (Windows)**, then press **Next**.

    ![Specific target: Azure App Service (Windows)](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-appservice.png)

1. If necessary, sign in and select an appropriate **Subscription name**.
1. Ensure **View** is set to **Resource group**.
1. Expand the `quickstart` resource group, then select the App Service that was created earlier, followed by **Finish**.

    ![Select App Service](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-selection.png)

2. Once the Publish tab is opened, locate the **Service Dependencies** and select **Configure** next to the SQL Server Database.

    ![Configure SQL Server Database dependency](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-service-dependency.png)

3. Select **Azure SQL Database**, then select **Next**.
4. Select the **quickstart** database, then select **Next**.

    ![Select database](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-select-db.png)

5. Fill in the form using the SQL username and password that were in the outputs of the deployment, then select **Next**.

    ![Configure the quickstart database](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-configure-db.png)

6. Select **Finish**.
7. Select **Close** when complete.
8. Select **Publish** to publish your app to the Azure App Service you created earlier.

    ![Publish to App Service](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-to-appservice.png)

9. Once the backend service is published, a browser will be opened. Add `/tables/todoitem?ZUMO-API-VERSION=3.0.0` to the URL:

    ![Successful publish](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-success.png)

    This indicates that the service is working properly.
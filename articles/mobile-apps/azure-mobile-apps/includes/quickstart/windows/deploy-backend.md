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

    ![Screenshot of az deployment group show results.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/deploy-backend-outputs.png)

6. Make a note of each of the values in the outputs for later use.

### Publish the service code.

Open the `TodoApp.sln` in Visual Studio.

1. In the right-hand pane, select the **Solutions Explorer**.
2. Right-click the `TodoAppService.NET6` project, then select **Set as Startup Project**.
3. On the top menu, select **Build** > **Build TodoAppService.NET6** (or press Ctrl+B).
4. On the top menu, select **Build** > **Publish TodoAppService.NET6**.
5. In the **Publish** window, select Target: **Azure**, then press **Next**.

    ![Screenshot of the target selection window.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-target.png)

6. Select Specific target: **Azure App Service (Windows)**, then press **Next**.

    ![Screenshot of the specific target selection window.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-appservice.png)

7. If necessary, sign in and select an appropriate **Subscription name**.
8. Ensure **View** is set to **Resource group**.
9. Expand the `quickstart` resource group, then select the App Service that was created earlier, followed by **Finish**.

    ![Screenshot of the app service selection window.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-selection.png)

10. Once the Publish tab is opened, locate the **Service Dependencies** and select **Configure** next to the SQL Server Database.

    ![Screenshot showing the SQL server configuration selection.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-service-dependency.png)

11. Select **Azure SQL Database**, then select **Next**.
12. Select the **quickstart** database, then select **Next**.

    ![Screenshot of the database selection window.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-select-db.png)

13. Fill in the form using the SQL username and password that were in the outputs of the deployment, then select **Next**.

    ![Screenshot of the database settings window.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-configure-db.png)

14. Select **Finish**.
15. Select **Close** when complete.
16. Select **Publish** to publish your app to the Azure App Service you created earlier.

    ![Screenshot showing the publish button.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-to-appservice.png)

17. Once the backend service is published, a browser will be opened. Add `/tables/todoitem?ZUMO-API-VERSION=3.0.0` to the URL:

    ![Screenshot showing the browser output after the service is published.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/publish-backend-success.png)

    This indicates that the service is working properly.
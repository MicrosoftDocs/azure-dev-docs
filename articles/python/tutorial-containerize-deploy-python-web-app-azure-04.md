---
title: Deploy a Python web app container to Azure App Service
description: How to deploy a Python web app container (Django or Flask) to App Service using managed identity authentication with Azure Container Registry.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/01/2025
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Deploy a containerized Python app to App Service

In this part of the tutorial series, you learn how to deploy a containerized Python web application to Azure App Service using the [App Service Web App for Containers](/azure.microsoft.com/services/app-service/containers/). This service lets you focus on building and managing your containers without the complexity of maintaining a container orchestrator. With App Service, you can run containerized web apps and streamline deployment using continuous integration/continuous deployment (CI/CD) with Docker Hub, Azure Container Registry, and Visual Studio Team Services. This article is part 4 of a 5-part tutorial series.

By the end of this article, you'll have a fully deployed App Service website running on a Docker container image. App Service uses managed identity to authenticate with Azure Container Registry and retrieve the initial image.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with deployment path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" :::

## Create the web app

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. Get the resource ID of the group containing Azure Container Registry with the [az group show](/cli/azure/group#az-group-show) command.

    ```azurecli-interactive
    #!/bin/bash
    # RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    
    RESOURCE_ID=$(az group show \
      --resource-group $RESOURCE_GROUP_NAME \
      --query id \
      --output tsv)
    echo $RESOURCE_ID
    ```

    ```azurecli-interactive
    # PowerShell syntax
    $RESOURCE_GROUP_NAME='msdocs-web-app-rg'

    RESOURCE_ID=$(az group show `
      --resource-group $RESOURCE_GROUP_NAME `
      --query id `
      --output tsv)
    echo $RESOURCE_ID
    ```

    RESOURCE_GROUP_NAME should still be set in your environment to the resource group name you used in parts 2 and 3 of this tutorial series. Build container in Azure of this tutorial. If it isn't, uncomment the first line and set it to the name you used.

1. Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

    ```azurecli-interactive
    #!/bin/bash
    APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'
    
    az appservice plan create \
        --name $APP_SERVICE_PLAN_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --sku B1 \
        --is-linux
    ```

    ```azurecli-interactive
    # PowerShell syntax
    $APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'
    
    
    ```az appservice plan create `
        --name $APP_SERVICE_PLAN_NAME `
        --resource-group $RESOURCE_GROUP_NAME `
        --sku B1 `
        --is-linux

1. Create a web app with the [az webapp create](/cli/azure/webapp#az-webapp-create) command.

    The following command also enables the [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) for the web app and assigns it the [`AcrPull` role](/azure/container-registry/container-registry-roles?tabs=azure-cli) on the specified resource--in this case, the resource group that contains the Azure Container Registry. This grants the system-assigned managed identity pull privileges on any Azure Container Registry in the resource group.

    ```azurecli-interactive
    #!/bin/bash
    APP_SERVICE_NAME='<website-name>'
    # REGISTRY_NAME='<your Azure Container Registry name>'
    CONTAINER_NAME=$REGISTRY_NAME'.azurecr.io/msdocspythoncontainerwebapp:latest'
    
    az webapp create \
      --resource-group $RESOURCE_GROUP_NAME \
      --plan $APP_SERVICE_PLAN_NAME \
      --name $APP_SERVICE_NAME \
      --assign-identity '[system]' \
      --scope $RESOURCE_ID \
      --role acrpull \
      --deployment-container-image-name $CONTAINER_NAME 
    ```

    ```azurecli-interactive
    $APP_SERVICE_NAME='<website-name>'
    # REGISTRY_NAME='<your Azure Container Registry name>'
    $CONTAINER_NAME=$REGISTRY_NAME'.azurecr.io/msdocspythoncontainerwebapp:latest'
    
    az webapp create `
      --resource-group $RESOURCE_GROUP_NAME `
      --plan $APP_SERVICE_PLAN_NAME `
      --name $APP_SERVICE_NAME `
      --assign-identity '[system]' `
      --scope $RESOURCE_ID `
      --role acrpull `
      --deployment-container-image-name $CONTAINER_NAME 
    ```

    Where:

    * APP_SERVICE_NAME must be globally unique as it becomes the website name in the URL `https://<website-name>.azurewebsites.net`.
    * CONTAINER_NAME is of the form "yourregistryname.azurecr.io/repo_name:tag".
    * REGISTRY_NAME should still be set in your environment to the registry name you used in part **3. Build container in Azure** of this tutorial. If necessary, uncomment the line where it's set in the code snippet and set it to the name you used.

    > [!NOTE]
    > You may see an error similar to the following output when running the previous command:
    >
    >    ```output
    >    No credential was provided to access Azure Container Registry. Trying to look up...
    >    Retrieving credentials failed with an exception:'No resource or more than one were found with name ...'
    >    ```
    >
    > This error arises from the web app's default attempt to use Azure Container Registry admin credentials, which are disabled. It's safe to disregard this error, as the subsequent command configures the web app to use system-assigned managed identity for authentication.

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

1. Refresh the Azure Container Registry in the Docker extension.

    Confirm that the container you built appears under the **REGISTRIES** section of the Docker extension. If it doesn't, right-click the registry name and select **Refresh**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" alt-text="A screenshot showing how to fresh registries in the Docker extension for Visual Studio Code." :::

1. Select **F1** or **CTRL+SHIFT+P** to open the command palette, type "Docker Registries", and select the **Docker Registries: Deploy Image to Azure App Service...** task.

1. Enter the following values as prompted to deploy the image:

    * Select registry provider: "Azure"
    * Select registry: Enter the name of the registry you created earlier in this tutorial.
    * Select repository: Enter the repository name "msdocspythoncontainerwebapp". If you don't see this repo, refresh the Docker extension **REGISTRIES** section.
    * Select tag: "latest"
    * Enter a globally unique name for the web app: Enter a name that is globally unique to Azure App Service. For example, if you use "msdocs-python-container-web-app", the web app URL would be `http://msdocs-python-container-web-app.azurewebsites.net`.
    * Select a resource group: Use the resource group that contains the Azure Container Registry you created earlier.
    * Select a location: Use the same location as the resource group.
    * Select a Linux App Service plan: Use an existing or create a new one.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts.gif" alt-text="A screenshot showing how to specify the information to deploy Docker image to App Service in Visual Studio Code." :::

1. View the **OUTPUT** window for details of the deployment. One of the output lines is "Granting permission for App Service to pull image from ACR...", which the App Service accesses the registry using managed identity.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" alt-text="A screenshot showing prompt when Docker image is deployed App Service in Visual Studio Code." :::

    The final site `https://<app-name>.azurewebsites.net` isn't ready yet because you need to specify MongoDB info.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create the web app.

1. Search for "App Services" and select **App Services** under **Services** in the search results. Then select **++ Create** at the top of the page to start the create process.

1. On the basic settings of the App Service, specify:

    * **Resource Group**: Use the same resource group that the Azure Container Registry is in.
    * **Name**: Use **msdocs-app-service.
    * **Publish**: Use **Docker container** so that the registry image you build is used.
    * **Operating System**: **Linux**
    * **Region**: Use the same region as the resource group and Azure Container Registry.
    * **Linux Plan**: Select an existing Linux plan or use a new one.
    * **Sku and size**: Select **Basic B1**. Select the **Change size** link to access more options.
    * **Zone redundancy**: Select **Disabled** if this option is available for the SKU selected.

    Select **Next: Docker** to continue.

    :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-basics.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-basics.png" alt-text="A screenshot showing how to fill out the basic deployment information about a web app in the Azure portal." :::

1. Specify Docker information of the App Service, including:

    * **Options**: Select **Single Container**.
    * **Image Source**: Select **Azure Container Registry**.
    * **Registry**: The registry you created for this tutorial.
    * **Image**: An image in the registry.
    * **Tag**: "latest"

    :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-docker.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-docker.png" alt-text="A screenshot showing how to fill out the Docker deployment information about a web app in the Azure portal." :::

    The registry [admin account](/azure/container-registry/container-registry-authentication#admin-account) is needed when you use the Azure portal to deploy a container image. If the admin account isn't enabled, you see an error when specifying the **Image**. After the App Service is created, managed identity is used to pull images from the registry, and the admin account can be disabled.

1. Select **Review + Create**. When validation completes, select **Create**.

---

## Configure managed identity and webhook

### [Azure CLI](#tab/azure-cli)

1. Configure the web app to use managed identities to pull from the Azure Container Registry with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

    ```azurecli-interactive
    #!/bin/bash
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    ```

    ```azurecli-interactive
    # PowerShell syntax
    az webapp config set `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    ```

    Because you enabled the system-assigned managed identity when you created the web app, the managed identity is used to pull from the Azure Container Registry.

1. Get the application scope credential with the [az webapp deployment list-publishing-credentials](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command.

    ```azurecli-interactive
    #!/bin/bash
    CREDENTIAL=$(az webapp deployment list-publishing-credentials \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --query publishingPassword \
      --output tsv)
    echo $CREDENTIAL 
    ```

    ```azurecli-interactive
    # PowerShell syntax
    CREDENTIAL=$(az webapp deployment list-publishing-credentials `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --query publishingPassword `
      --output tsv)
    echo $CREDENTIAL 
    ```

1. Use the application scope credential to create a webhook with the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command.

    ```azurecli-interactive
    #!/bin/bash
    SERVICE_URI='https://$'$APP_SERVICE_NAME':'$CREDENTIAL'@'$APP_SERVICE_NAME'.scm.azurewebsites.net/api/registry/webhook'
    
    az acr webhook create \
      --name webhookforwebapp \
      --registry $REGISTRY_NAME \
      --scope msdocspythoncontainerwebapp:* \
      --uri $SERVICE_URI \
      --actions push 
    ```

    ```azurecli-interactive
    # PowerShell syntax
    CREDENTIAL=$(az webapp deployment list-publishing-credentials `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --query publishingPassword `
      --output tsv)
    echo $CREDENTIAL 
    ```

    By default, this command creates the webhook in the same resource group and location as the specified Azure Container registry. If desired, you can use the `--resource-group` and `--location` parameters to override this behavior.

### [VS Code](#tab/vscode-aztools)

1. When you deploy with Visual Studio Code, managed identity is already set for the App Service to pull images from the registry. You can confirm managed identity is enabled by viewing logs in the **OUTPUT** window and looking for the message "Granting permission for App Service to pull image from ACR...".

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-create-app-output.png" lightbox="./media/tutorial-container-web-app/visual-studio-create-app-output.png" alt-text="A screenshot showing how to confirm managed identity was set for an App Service in the Visual Studio Code output window." :::

1. During the deploy with VS Code, a webhook is created that enables the web app to pull new images from the Azure Container Registry.

    > [!IMPORTANT]
    > Review the webhooks configuration in the Azure Portal to confirm the **Service URI** ends with "/api/registry/webhook". To review the service URI, open the Docker extension in VS Code and find the registry you created. Right-click the registry and select **Open in Portal**. The registry opens in the Azure portal. Select **Webhooks** on the **service menu** of the registry.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-create-app-webhook.png" lightbox="./media/tutorial-container-web-app/visual-studio-create-app-webhook.png" alt-text="A screenshot showing how to check a webhook configuration." :::

### [Azure portal](#tab/azure-portal)

Go to the [Azure portal](https://portal.azure.com/) to follow these steps.

1. Go to your App service. For example, you can search for the name of your app service and select it under **Resources** in the results.

1. Enable managed identity.

    1. Under **Settings** on the **service menu**, select **Identity**.
    1. On the **System assigned** tab, set **Status** to **On**.
    1. Select **Save** and then select **Yes** in the prompt to continue.

    :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-enable.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-enable.png" alt-text="A screenshot showing how to enable managed identity for an App Service in Azure portal." :::

1. On the **System assigned** tab on the **Identity** page, select **Azure role assignments**.

    :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-role-assignments-button.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-role-assignments-button.png" alt-text="A screenshot showing how to add an Azure role assignment for an App Service in Azure portal." :::

1. Add the "AcrPull" role for the system-assigned managed identity. The AcrPull role allows the App Service to pull images from the Azure Container Registry.

    In "Azure role assignments", select **+ Add role assignment** and follow the prompts to add:

    * **Scope**: "Resource group"
    * **Subscription**: Your subscription.
    * **Resource group**: The group with the Azure Container Registry and App Service.
    * **Role**: "AcrPull"

    Select **Save** to save the role assignment.

    :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-add-role.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-add-role.png" alt-text="A screenshot showing an AcrPull role assignment for an App Service in Azure portal." :::

    For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

1. Configure App Service deployment to use managed identity.

    1. Under **Deployment** on the **service menu**, select **Deployment Center**.
    1. On the **Settings** tab, set **Authentication** to **Managed Identity**.
    1. Select **Save** to save the changes.

    :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-in-deployment.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-in-deployment.png" alt-text="A screenshot showing how to enable managed identity and container deployment for an App Service in Azure portal." :::

1. Get the application scope credential. You use this credential in the next step.

    1. Under **Deployment** on the **service menu**, select **Deployment Center**.
    1. In the **FTPS credentials** tab, get the **Password** value under **Application Scope**.

1. Create a webhook that triggers updates to App Service when new images are pushed to the Azure Container Registry.

    1. Go to the Azure Container Registry that you're using in this tutorial. On the **service menu**, select **Webhooks**.
    1. On the **Webhooks** page, select **+ Add**.
    1. On the **Create webhook** page, specify the fields as follows:

       * **Webhook name**: Enter "webhookforwebapp".
       * **Location**: Use the location of the registry.
       * **Service URI**: A string that is a combination of the App Service name and the credential copied in the previous step.

            The service URI is formatted as "https://$" + APP_SERVICE_NAME + ":" + CREDENTIAL + "@" + APP_SERVICE_NAME + ".scm.azurewebsites.net/api/registry/webhook". For example: "https://$msdocs-python-container-web-app:credential@msdocs-python-container-web-app.scm.azurewebsites.net/api/registry/webhook".

       * **Actions**: Select **push**.
       * **Status**: Select **On**.
       * **Scope**: Enter "msdocspythoncontainerwebapp:*".

        :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-registry-webhook.png" lightbox="./media/tutorial-container-web-app/portal-web-app-registry-webhook.png" alt-text="A screenshot showing how to create a webhook for Azure Container Registry in Azure portal." :::

---

## Configure connection to MongoDB

In this step, you specify environment variables needed to connect to MongoDB.

If you need to create an Azure Cosmos DB for MongoDB, we recommend you follow the steps to [set up Cosmos DB for MangoDB](tutorial-containerize-deploy-python-web-app-azure-02.md?tabs=mongodb-azure#tabpanel_3_mongodb-azure) in part **2. Build and test container locally** of this tutorial. When you're finished, you should have an Azure Cosmos DB for MongoDB connection string of the form `mongodb://<server-name>:<password>@<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&<other-parameters>`.

You need the MongoDB connection string for the next steps.

### [Azure CLI](#tab/azure-cli)

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

```azurecli-interactive
#!/bin/bash
MONGO_CONNECTION_STRING='your Mongo DB connection string in single quotes'
MONGO_DB_NAME=restaurants_reviews
MONGO_COLLECTION_NAME=restaurants_reviews

az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings CONNECTION_STRING=$MONGO_CONNECTION_STRING \
              DB_NAME=$MONGO_DB_NAME  \
              COLLECTION_NAME=$MONGO_COLLECTION_NAME 
```

```azurecli-interactive
# PowerShell syntax
$MONGO_CONNECTION_STRING='your Mongo DB connection string in single quotes'
$MONGO_DB_NAME=restaurants_reviews
$MONGO_COLLECTION_NAME=restaurants_reviews

az webapp config appsettings set `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $APP_SERVICE_NAME `
   --settings CONNECTION_STRING=$MONGO_CONNECTION_STRING `
              DB_NAME=$MONGO_DB_NAME  `
              COLLECTION_NAME=$MONGO_COLLECTION_NAME 
```

* CONNECTION_STRING: A connection string that starts with "mongodb://".
* DB_NAME: Use "restaurants_reviews".
* COLLECTION_NAME: Use "restaurants_reviews".

### [VS Code](#tab/vscode-aztools)

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

1. In the Azure Tools extension for Visual Studio Code:

    1. Expand **RESOURCES** and find **App Services** under your subscription. (Make sure you viewing resources by **Group by Resource Type**.)

    1. Expand **App Services** and find the web app you created.

    1. Expand your web app and right-click on **Application Settings**.

    1. Select **Add new setting...**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-create-app-settings.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-create-app-settings.png" alt-text="A screenshot showing how to add a setting to the App Service in VS Code." :::

1. Each time you add a new setting, a dialog box appears at the top of the VS Code window where you can add the setting name followed by its value. Add the following settings:

    * CONNECTION_STRING: A connection string that starts with "mongodb://".
    * DB_NAME: Use "restaurants_reviews".
    * COLLECTION_NAME: Use "restaurants_reviews".
    * WEBSITES_PORT: Use "8000" for Django and "5000" for Flask. This environment variable specifies the port on which the container is listening.

### [Azure portal](#tab/azure-portal)

1. On the App Service in Azure portal, select **Configuration** under **Settings** on the **service menu**. Then select **Application settings** on the top menu.

    :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-app-settings-panel.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-app-settings-panel.png" alt-text="A screenshot showing how to add a setting to the App Service in Azure portal." :::

1. Create application settings.

    1. Select **+ New application setting** to create settings for each of the following values:

        * CONNECTION_STRING: A connection string that starts with "mongodb://".
        * DB_NAME: Use "restaurants_reviews".
        * COLLECTION_NAME: Use "restaurants_reviews".

    1. Confirm you have three settings with the correct values.

        :::image type="content" source="./media/tutorial-container-web-app/azure-portal-app-settings-confirm.png" lightbox="./media/tutorial-container-web-app/azure-portal-app-settings-confirm.png" alt-text="A screenshot showing how to confirm settings of the App Service in Azure portal." :::

    1. Select **Save** to apply the settings.

---

## Browse the site

To verify the site is running, go to `https://<website-name>.azurewebsites.net`; where website name is your app service name. If successful, you should see the restaurant review sample app. It can take a few moments for the site to start the first time. When the site appears, add a restaurant and a review for that restaurant to confirm the sample app is functioning.

### [Azure CLI](#tab/azure-cli)

If you're running the Azure CLI locally, you can use the [az webapp browse](/cli/azure/webapp#az-webapp-browse) command to browse to the web site. If you're using Cloud Shell, open a browser window and navigate to the website URL.

```azurecli
az webapp browse --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP_NAME 
```

> [!NOTE]
> The `az webapp browse` command isn't supported in Cloud Shell. Open a browser window and navigate to the website URL instead.

### [VS Code](#tab/vscode-aztools)

In the Azure Tools extension for Visual Studio Code:

1. Expand **RESOURCES** and find **App Services** under your subscription. (Make sure you viewing resources by **Group by Resource Type**.)

1. Right-click the App Service and select **Browse Website**.

    :::image type="content" source="./media/tutorial-container-web-app/app-service-vs-code-browse.png" lightbox="./media/tutorial-container-web-app/app-service-vs-code-browse.png" alt-text="A screenshot showing how to browse an App Service in VS Code." :::

### [Azure portal](#tab/azure-portal)

On the App service in the portal, select **Overview** on the **service menu**. Then select **Browse**.

:::image type="content" source="./media/tutorial-container-web-app/app-service-portal-browse.png" lightbox="./media/tutorial-container-web-app/app-service-portal-browse.png" alt-text="A screenshot showing how to browse an App Service in Azure portal." :::

---

## Troubleshoot deployment

If you don't see the sample app, try the following steps.

* With container deployment and App Service, always check the **Deployment Center** / **Logs** page in the Azure portal. Confirm that the container was pulled and is running. The initial pull and running of the container can take a few moments.
* Try to restart the App Service and see if that resolves your issue.
* If there are programming errors, those errors show up in the application logs. On the Azure portal page for the App Service, select **Diagnose and solve problems**/**Application logs**. 
* The sample app relies on a connection to MongoDB. Confirm that the App Service has application settings with the correct connection info.
* Confirm that managed identity is enabled for the App Service and is used in the Deployment Center. On the Azure portal page for the App Service, go to the App Service **Deployment Center** resource and confirm that **Authentication** is set to **Managed Identity**.
* Check that the webhook is defined in the Azure Container Registry. The webhook enables the App Service to pull the container image. In particular, check that Service URI ends with "/api/registry/webhook".
* [Different Azure Container Registry skus](/azure/container-registry/container-registry-skus) have different features, including number of webhooks. If you're reusing an existing registry, you could see the message: "Quota exceeded for resource type webhooks for the registry SKU Basic. Learn more about different SKU quotas and upgrade process: https://aka.ms/acr/tiers". If you see this message, use a new registry, or reduce the number of [registry webhooks](/azure/container-registry/container-registry-webhook) in use.

## Next step

> [!div class="nextstepaction"]
> [Clean up resources](tutorial-containerize-deploy-python-web-app-azure-05.md)

---
title: Deploy a Python web app container to Azure App Service
description: How to deploy a Python web app container (Django or Flask) to App Service using managed identity authentication with Azure Container Registry.
ms.devlang: python
ms.topic: tutorial
ms.date: 10/09/2023
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Deploy a containerized Python app to App Service

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services.

In this part of the tutorial, you learn how to deploy the containerized Python web app to App Service using the [App Service Web App for Containers](https://azure.microsoft.com/services/app-service/containers/). Web App for Containers allows you to focus on composing your containers without worrying about managing and maintaining an underlying container orchestrator.

Following the steps in this article, you'll end up with an App Service website using a Docker container image. The App Service pulls the initial image from Azure Container Registry using managed identity for authentication.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with deployment path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" :::

## Create the web app

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. Get the resource ID of the group containing Azure Container Registry with the [az group show](/cli/azure/group#az-group-show) command.

    ```azurecli
    # RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    
    RESOURCE_ID=$(az group show \
      --resource-group $RESOURCE_GROUP_NAME \
      --query id \
      --output tsv)
    echo $RESOURCE_ID
    ```

    RESOURCE_GROUP_NAME should still be set in your environment to the resource group name you used in part **3. Build container in Azure** of this tutorial. If it isn't, uncomment the first line and make sure it's set to the name you used.

1. Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

    ```azurecli
    APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'
    
    az appservice plan create \
        --name $APP_SERVICE_PLAN_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --sku B1 \
        --is-linux
    ```

1. Create a web app with the [az webapp create](/cli/azure/webapp#az-webapp-create) command.

    The following command also enables the [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) for the web app and assigns it the [`AcrPull` role](/azure/container-registry/container-registry-roles?tabs=azure-cli) on the specified resource--in this case, the resource group that contains the Azure Container Registry. This grants the system-assigned managed identity pull privileges on any Azure Container Registry in the resource group.

    ```azurecli
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

    Where:

    * APP_SERVICE_NAME must be globally unique as it becomes the website name in the URL `https://<website-name>.azurewebsites.net`.
    * CONTAINER_NAME is of the form "yourregistryname.azurecr.io/repo_name:tag".
    * REGISTRY_NAME should still be set in your environment to the registry name you used in part **3. Build container in Azure** of this tutorial. If it isn't, uncomment the line where it's set above and make sure it's set to the name you used.

    > [!NOTE]
    > You may see an error similar to the following when running the command:
    >
    >    ```output
    >    No credential was provided to access Azure Container Registry. Trying to look up...
    >    Retrieving credentials failed with an exception:'No resource or more than one were found with name ...'
    >    ```
    >
    > This error occurs because the web app defaults to using the Azure Container Registry's admin credentials to authenticate with the registry and admin credentials haven't been enabled on the registry. You can safely ignore this error because you will set the web app to use the system-assigned managed identity for authentication in the next command.

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how refresh registries in Docker extension in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-refresh-registries-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" alt-text="A screenshot showing how to fresh registries in the Docker extension for Visual Studio Code." ::: |
| [!INCLUDE [Include showing how call up deploy image command in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-2.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-registries-build-command-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-registries-build-command.png" alt-text="A screenshot showing how to find the deploy Docker image to App Service task in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to specify the deployment in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-3.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts-240px.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts.gif" alt-text="A screenshot showing how to specify the information to deploy Docker image to App Service in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to verify the deployment in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-4.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-site-deployed-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" alt-text="A screenshot showing prompt when Docker image is deployed App Service in Visual Studio Code." ::: |

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create the web app.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to start create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-start-create-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-start-create.png" alt-text="A screenshot showing how to start the creation of a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to specify basics of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-basics-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-basics.png" alt-text="A screenshot showing how to fill out the basic deployment information about a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to specify Docker container of app service info in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-docker-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-docker.png" alt-text="A screenshot showing how to fill out the Docker deployment information about a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to finish the create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-4.md>)] |  |

---

## Configure managed identity and webhook

### [Azure CLI](#tab/azure-cli)

1. Configure the web app to use managed identities to pull from the Azure Container Registry with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

    ```azurecli
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    ```

    Because you enabled the system-assigned managed identity when you created the web app, it will be the managed identity used to pull from the Azure Container Registry.

1. Get the application scope credential with the [az webapp deployment list-publishing-credentials](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command.

    ```azurecli
    CREDENTIAL=$(az webapp deployment list-publishing-credentials \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --query publishingPassword \
      --output tsv)
    echo $CREDENTIAL 
    ```

1. Use the application scope credential to create a webhook with the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command.

    ```azurecli
    SERVICE_URI='https://$'$APP_SERVICE_NAME':'$CREDENTIAL'@'$APP_SERVICE_NAME'.scm.azurewebsites.net/api/registry/webhook'
    
    az acr webhook create \
      --name webhookforwebapp \
      --registry $REGISTRY_NAME \
      --scope msdocspythoncontainerwebapp:* \
      --uri $SERVICE_URI \
      --actions push 
    ```

    By default, this command creates the webhook in the same resource group and location as the specified Azure Container registry. If desired, you can use the `--resource-group` and `--location` parameters to override this behavior.

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to confirm managed identity for an App Service in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-5.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-create-app-output-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-create-app-output.png" alt-text="A screenshot showing how to confirm managed identity was set for an App Service in the Visual Studio Code output window." ::: |
| [!INCLUDE [Include showing how to check webhook configuration in Azure portal](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-6.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-create-app-webhook-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-create-app-webhook.png" alt-text="A screenshot showing how to check a webhook configuration." ::: |

### [Azure portal](#tab/azure-portal)

Go to the [Azure portal](https://portal.azure.com/) to follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to enable managed identity for an App Service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-5.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-enable-240px.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-enable.png" alt-text="A screenshot showing how to enable managed identity for an App Service in Azure portal." ::: |
| [!INCLUDE [Include showing how to add an Azure role assignment for an app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-6.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-role-assignments-button-240px.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-role-assignments-button.png" alt-text="A screenshot showing how to add an Azure role assignment for an App Service in Azure portal." ::: |
| [!INCLUDE [Include showing how to add an Azure role assignment for an app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-7.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-add-role-240px.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-add-role.png" alt-text="A screenshot showing an AcrPull role assignment for an App Service in Azure portal." ::: |
| [!INCLUDE [Include showing how to specify Docker container deployment with managed identity of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-8.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-managed-identity-in-deployment-240px.png" lightbox="./media/tutorial-container-web-app/portal-web-app-managed-identity-in-deployment.png" alt-text="A screenshot showing how to enable managed identity and container deployment for an App Service in Azure portal." :::  |
| [!INCLUDE [Include showing how to specify an Azure Container Registry webhook in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-9.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-web-app-registry-webhook-240px.png" lightbox="./media/tutorial-container-web-app/portal-web-app-registry-webhook.png" alt-text="A screenshot showing how to create a webhook for Azure Container Registry in Azure portal." ::: |

---

## 3. Configure connection to MongoDB

In this step, you specify environment variables needed to connect to MongoDB.

If you need to create an Azure Cosmos DB for MongoDB, we recommend you follow the steps to [set up Cosmos DB for MangoDB](tutorial-containerize-deploy-python-web-app-azure-02.md?tabs=mongodb-azure#tabpanel_3_mongodb-azure) in part **2. Build and test container locally** of this tutorial. When you're finished, you should have an Azure Cosmos DB for MongoDB connection string of the form `mongodb://<server-name>:<password>@<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&<other-parameters>`.

You need the MongoDB connection string info to follow the steps below.

### [Azure CLI](#tab/azure-cli)

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

```azurecli
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

* CONNECTION_STRING: A connection string that starts with "mongodb://".
* DB_NAME: Use "restaurants_reviews".
* COLLECTION_NAME: Use "restaurants_reviews".

### [VS Code](#tab/vscode-aztools)

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app settings in VS Code 1](<./includes/tutorial-container-web-app/connect-mongodb-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-create-app-settings-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-create-app-settings.png" alt-text="A screenshot showing how to add a setting to the App Service in VS Code." ::: |
| [!INCLUDE [Create app settings in VS Code 2](<./includes/tutorial-container-web-app/connect-mongodb-visual-studio-code-2.md>)] |  |

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app settings in Azure portal 1](<./includes/tutorial-container-web-app/connect-mongodb-portal-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-app-settings-panel-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-app-settings-panel.png" alt-text="A screenshot showing how to add a setting to the App Service in Azure portal." ::: |
| [!INCLUDE [Create app settings in Azure portal 2](<./includes/tutorial-container-web-app/connect-mongodb-portal-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-app-settings-confirm-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-app-settings-confirm.png" alt-text="A screenshot showing how to confirm settings of the App Service in Azure portal." ::: |

---

## 4. Browse the site

To verify the site is running, go to `https://<website-name>.azurewebsites.net`; where website name is your app service name. If successful, you should see the restaurant review sample app. It can take a few moments for the site to start the first time. When the site appears, add a restaurant and a review for that restaurant to confirm the sample app is functioning.

### [Azure CLI](#tab/azure-cli)

If you're running the Azure CLI locally, you can use the [az webapp browse](/cli/azure/webapp#az-webapp-browse) command to browse to the web site. If you're using Cloud Shell, open a browser window and navigate to the website URL.

```azurecli
az webapp browse  --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP_NAME 
```

> [!NOTE]
> The `az webapp browse` command isn't supported in Cloud Shell. Open a browser window and navigate to the website URL instead.

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Browse website in VS Code](<./includes/tutorial-container-web-app/app-service-browse-vs-code.md>)] | :::image type="content" source="./media/tutorial-container-web-app/app-service-vs-code-browse-240px.png" lightbox="./media/tutorial-container-web-app/app-service-vs-code-browse.png" alt-text="A screenshot showing how to browse an App Service in VS Code." ::: |

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Browse website in Azure portal](<./includes/tutorial-container-web-app/app-service-browse-portal.md>)] | :::image type="content" source="./media/tutorial-container-web-app/app-service-portal-browse-240px.png" lightbox="./media/tutorial-container-web-app/app-service-portal-browse.png" alt-text="A screenshot showing how to browse an App Service in Azure portal." ::: |

---

## 5. Troubleshoot deployment

If you don't see the sample app, try the following steps.

* With container deployment and App Service, always check the **Deployment Center** / **Logs** page in the Azure portal. Confirm that the container was pulled and is running. The initial pull and running of the container can take a few moments.
* Try to restart the App Service and see if that resolves your issue.
* If there are programming errors, those errors will show up in the application logs. On the Azure portal page for the App Service, select **Diagnose and solve problems**/**Application logs**. 
* The sample app relies on a connection to MongoDB. Confirm that the App Service has application settings with the correct connection info.
* Confirm that managed identity is enabled for the App Service and is used in the Deployment Center. On the Azure portal page for the App Service, go to the App Service **Deployment Center** resource and confirm that **Authentication** is set to **Managed Identity**.
* Check that the webhook is defined in the Azure Container Registry. The webhook enables the App Service to pull the container image. In particular, check that Service URI ends with "/api/registry/webhook".
* [Different Azure Container Registry skus](/azure/container-registry/container-registry-skus) have different features, including number of webhooks. If you're reusing an existing registry, you could see the message: "Quota exceeded for resource type webhooks for the registry SKU Basic. Learn more about different SKU quotas and upgrade process: https://aka.ms/acr/tiers". If you see this message, use a new registry, or reduce the number of [registry webhooks](/azure/container-registry/container-registry-webhook) in use.

## Next step

> [!div class="nextstepaction"]
> [Clean up resources](tutorial-containerize-deploy-python-web-app-azure-05.md)

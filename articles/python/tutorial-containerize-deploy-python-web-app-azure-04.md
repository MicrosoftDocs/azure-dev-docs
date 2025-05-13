---
title: Deploy a Python web app container to Azure App Service
description: How to deploy a Python web app container (Django or Flask) to App Service using managed identity authentication with Azure Container Registry.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/10/2025
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Deploy a containerized Python app to App Service

In this part of the tutorial series, you learn how to deploy a containerized Python web application to Azure App Service using the [App Service Web App for Containers](/azure/app-service/containers/). This service lets you focus on building and managing your containers without the complexity of maintaining a container orchestrator. With App Service, you can run containerized web apps and streamline deployment using continuous integration/continuous deployment (CI/CD) with Docker Hub, Azure Container Registry, and Visual Studio Team Services. This article is part 4 of a 5-part tutorial series.

By the end of this article, you'll have a fully deployed App Service web site running on a Docker container image. App Service uses managed identity to authenticate with Azure Container Registry and retrieve the initial image. App Service uses managed identity to retrieve connection string information for CosmosDB for MongdoDB and the secret key for the Django web app from Azure Key Vault.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with deployment path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" :::

### [Azure CLI](#tab/azure-cli)

## Create the app service plan and web app

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

>[!IMPORTANT]
> We recommend using Cloud Shell for all CLI based operations in this tutorial because:
>
> * Cloud Shell comes pre-authenticated with Azure, eliminating potential login issues
> * All required Azure CLI extensions are pre-installed
> * It provides consistent behavior regardless of local environment differences
> * There's no need to worry about Docker Desktop or local networking issues
> * Cloud Shell has direct connectivity to Azure services, which can help avoid firewall or network configuration problems

1. Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'
    
    az appservice plan create \
        --name $APP_SERVICE_PLAN_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --sku B1 \
        --is-linux
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    $APP_SERVICE_PLAN_NAME='msdocs-web-app-plan'
    
    az appservice plan create `
        --name $APP_SERVICE_PLAN_NAME `
        --resource-group $RESOURCE_GROUP_NAME `
        --sku B1 `
        --is-linux
    ```

    ---

1. Create a web app with the [az webapp create](/cli/azure/webapp#az-webapp-create) command using the following variables:

    * APP_SERVICE_NAME must be globally unique as it becomes the website name in the URL `https://<website-name>.azurewebsites.net`.
    * CONTAINER_NAME is of the form "yourregistryname.azurecr.io/repo_name:tag".
    * REGISTRY_NAME is the registry name you used in part **3. Build container in Azure** of this tutorial.

    This command also enables the [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) for the web app and assigns it the [`AcrPull` role](/azure/container-registry/container-registry-roles?tabs=azure-cli) on the resource group that contains the Azure Container Registry. This grants the system-assigned managed identity pull privileges on any Azure Container Registry in the resource group.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    APP_SERVICE_NAME='msdocs-website-name'
    # Use the same rregistry name as in part 2 of this tutorial series.
    REGISTRY_NAME='msdocscontainerregistryname'
    CONTAINER_NAME=$REGISTRY_NAME'.azurecr.io/msdocspythoncontainerwebapp:latest'
    
    az webapp create \
      --resource-group $RESOURCE_GROUP_NAME \
      --plan $APP_SERVICE_PLAN_NAME \
      --name $APP_SERVICE_NAME \
      --assign-identity '[system]' \
      --deployment-container-image-name $CONTAINER_NAME 
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # Powershell syntax
    $APP_SERVICE_NAME='msdocs-website-name'
    # Use the same rregistry name as in part 2 of this tutorial series.
    $REGISTRY_NAME='msdocscontainerregistryname'
    $CONTAINER_NAME = "$REGISTRY_NAME.azurecr.io/msdocspythoncontainerwebapp:latest"
    
    az webapp create `
      --resource-group $RESOURCE_GROUP_NAME `
      --plan $APP_SERVICE_PLAN_NAME `
      --name $APP_SERVICE_NAME `
      --assign-identity '[system]' `
      --deployment-container-image-name $CONTAINER_NAME 
    ```

    ---

    > [!NOTE]
    > You may see an error similar to the following output when running the previous command:
    >
    >    ```output
    >    No credential was provided to access Azure Container Registry. Trying to look up...
    >    Retrieving credentials failed with an exception:'Failed to retrieve container registry credentials. Please either provide the credentials or run 'az acr update -n msdocscontainerregistryname --admin-enabled true' to enable admin first.'
    >    ```
    >
    > This error arises from the web app's default attempt to use Azure Container Registry admin credentials, which are disabled. It's safe to disregard this error, as the subsequent command configures the web app to use system-assigned managed identity for authentication.

## Enable managed identity ACR access and configure webhook

In this step, you configure the web app to use managed identity to pull images from Azure Container Registry. You also create a webhook that allows the web app to pull new images from the registry when they are pushed.

1. Configure the web app to use managed identities to pull from the Azure Container Registry with the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command. Enables the web app to authenticate to ACR using its system-assigned managed identity instead of username/password credentials. This command activates the system-assigned managed identity for ACR access, aligning with Azure’s best practices for secure, credential-less authentication.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    az webapp config set `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --generic-configurations '{ "acrUseManagedIdentityCreds": true }'

    ---

1. Get the unique identifier (principal ID) of the web app’s system-assigned managed identity with the [az webapp identity show](/cli/azure/webapp/identity#az-webapp-identity-show) command. The principal ID is needed to assign permissions to access ACR.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    PRINCIPAL_ID=$(az webapp identity show \
      --name "$APP_SERVICE_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --query principalId \
      -o tsv)
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $PRINCIPAL_ID=$(az webapp identity show `
      --name "$APP_SERVICE_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --query principalId `
      -o tsv)
    ```

    ---

1. Grant the managed identity permission to pull images from ACR with the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. This command completes the managed identity setup by granting the necessary permissions. The AcrPull role ensures the web app can access the container image.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    az role assignment create \
      --role "AcrPull" \
      --assignee "$PRINCIPAL_ID" \
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ContainerRegistry/registries/$REGISTRY_NAME"
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    az role assignment create `
      --role "AcrPull" `
      --assignee "$PRINCIPAL_ID" `
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ContainerRegistry/registries/$REGISTRY_NAME"
    ```

    ---

1. Retrieve continuous deployment continuous deployment (CD) URL for the web app’s SCM (Source Control Management) endpoint (used for webhook notifications) with the [az webapp deployment container show-cd-url](/cli/azure/webapp/deployment/container#az-webapp-deployment-container-show-cd-url) command. This URL is needed to configure the ACR webhook, telling ACR where to send notifications when a new image is pushed.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    CD_URL=$(az webapp deployment container show-cd-url \
      --name "$APP_SERVICE_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --query CI_CD_URL \
      --output tsv)
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $CD_URL=$(az webapp deployment container show-cd-url `
      --name "$APP_SERVICE_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --query CI_CD_URL `
      --output tsv)        
    ```

    ---

1. Construct webhook endpoint URL by appending the webhook path to the CD URL. The webhook endpoint is where ACR will send HTTP POST requests to notify the web app of new images. This path is standard for container-based web apps in Azure App Service.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    SERVICE_URI="$CD_URL/api/registry/webhook"

    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $SERVICE_URI="$CD_URL/api/registry/webhook"
    ```

    ---

1. Create the ACR webhook. The webhook is a notification mechanism that triggers the web app to pull the latest image from ACR when a new image is pushed. The webhook uses the web app’s SCM endpoint as the target URL. The webhook is created with the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command. This webhook links ACR to the web app, enabling continuous deployment. When a new image is pushed to msdocspythoncontainerwebapp, ACR sends a POST request to SERVICE_URI, and the web app pulls and deploys the new image.

    > [!NOTE]
    > The webhook URI must end with `/api/registry/webhook` to work correctly with App Service. If you see an error about the URI not being valid, check that it ends with `/api/registry/webhook`.
    > If you see an error about the URI not being valid, check that it ends with `/api/registry/webhook`. The webhook URI must be in the format `https://<app-name>.scm.azurewebsites.net/api/registry/webhook`.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    az acr webhook create \
      --name webhookforwebapp \
      --registry "$REGISTRY_NAME" \
      --scope "msdocspythoncontainerwebapp:*" \
      --uri "$SERVICE_URI" \
      --actions push
      ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    az acr webhook create `
      --name webhookforwebapp `
      --registry "$REGISTRY_NAME" `
      --scope "msdocspythoncontainerwebapp:*" `
      --uri "$SERVICE_URI" `
      --actions push
    ```

    ---

## Enable Continuous Deployment from ACR

In this step, you enable continuous deployment from ACR to the web app. This allows the web app to automatically pull new images from ACR when they are pushed.
The webhook you created in the previous step is used to trigger this process. Enabling continuous deployment activates the web app’s ability to listen for webhook requests at the SCM endpoint. The web app is now part of a push-based continuous deployment pipeline.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    az webapp deployment container config \
      --name "$APP_SERVICE_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --enable-cd true
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    az webapp deployment container config `
      --name "$APP_SERVICE_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --enable-cd true
    ```

    ---

## Create Key Vault with RBAC Authorization

In this step, you create an Azure Key Vault configured with Role-Based Access Control (RBAC) authorization using the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command. The Key Vault stores the connection string for MongoDB and the secret key for the Django web app. RBAC enables fine-grained access control for users and services. The web app uses managed identity to access the Key Vault.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    az keyvault create \
      --name "$KEYVAULT_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --location "$LOCATION" \
      --enable-rbac-authorization true
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    az keyvault create `
      --name "$KEYVAULT_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --location "$LOCATION" `
      --enable-rbac-authorization true
    ```

    ---

## Grant Secrets Officer Role to Logged-In User

In this step, you grant the logged-in user the **Key Vault Secrets Officer** role on the Key Vault using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. This role allows the user to create and manage secrets in the Key Vault. This step ensures the script has the necessary access without requiring hard-coded credentials, relying on RBAC and identity-based access, which is more secure and auditable. This command is the first of two role assignments (the next step assigns a role to the web app), ensuring both the user and the web app can interact with the Key Vault appropriately.

  ### [Bash](#tab/bash)

  ```azurecli-interactive
  #!/bin/bash
  CALLER_ID=$(az ad signed-in-user show --query id -o tsv)

  az role assignment create \
    --role "Key Vault Secrets Officer" \
    --assignee "$CALLER_ID" \
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"

  ```

  ### [PowerShell](#tab/powershell)

  ```powershell-interactive
  # PowerShell syntax
  $CALLER_ID=$(az ad signed-in-user show --query id -o tsv)
  az role assignment create `
    --role "Key Vault Secrets Officer" `
    --assignee "$CALLER_ID" `
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
  ```

  ---

## Grant Key Vault Access to Web App

In this step, you grant the web app access to the Key Vault using the **KEY VAULT SECRETS USER** role using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. This role allows the web app to retrieve secrets from the Key Vault using its managed identity.

  ### [Bash](#tab/bash)

  ```azurecli-interactive
  #!/bin/bash
  az role assignment create \
    --role "Key Vault Secrets User" \
    --assignee "$PRINCIPAL_ID" \
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
  ```

  ### [PowerShell](#tab/powershell)

  ```powershell-interactive
  # PowerShell syntax
  az role assignment create `
    --role "Key Vault Secrets User" `
    --assignee "$PRINCIPAL_ID" `  
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
  ```

  ---

## Store Secrets in Key Vault

In this step, you store the connection string for MongoDB and the secret key for the Django web app in the Key Vault using the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command. The web app uses managed identity to access these secrets.

  ### [Bash](#tab/bash)

  ```azurecli-interactive
  #!/bin/bash
  MONGO_CONNECTION_STRING=$(az cosmosdb keys list \
    --name "$ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --type connection-strings \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" -o tsv)

  SECRET_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9')

  az keyvault secret set \
    --vault-name "$KEYVAULT_NAME" \
    --name "MONGO_CONNECTION_STRING" \
    --value "$MONGO_CONNECTION_STRING"

  az keyvault secret set \
    --vault-name "$KEYVAULT_NAME" \
    --name "SECRET_KEY" \
    --value "supersecretkeythatispassedtopythonapp"
  ```

  ### [PowerShell](#tab/powershell)

  ```powershell-interactive
  # PowerShell syntax

  MONGO_CONNECTION_STRING=$(az cosmosdb keys list `
    --name "$ACCOUNT_NAME" `
    --resource-group "$RESOURCE_GROUP_NAME" `
    --type connection-strings `
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" -o tsv)

    $SECRET_KEY = [System.Convert]::ToBase64String((New-Object byte[] 32 | ForEach-Object { Get-Random -Maximum 256 }))

  az keyvault secret set `
    --vault-name "$KEYVAULT_NAME" `
    --name "MONGO_CONNECTION_STRING" `
    --value "$MONGO_CONNECTION_STRING"

  az keyvault secret set `
    --vault-name "$KEYVAULT_NAME" `
    --name "SECRET_KEY" `
    --value "supersecretkeythatispassedtopythonapp"
  ```

  ---

## Configure connection to MongoDB

In this step, you configure the Azure App Service web app to reference the secrets stored in the Azure Key Vault using Key Vault references with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command. Specifically, it sets the **MongoConnectionString** and **MongoSecretKey** application settings to point to the Cosmos DB connection string and secret key stored in the Key Vault. This enables the web app to securely access these secrets during runtime without hardcoding sensitive data.

  ### [Bash](#tab/bash)

  ```azurecli-interactive
  #!/bin/bash
  MONGODB_NAME='restaurants_reviews'
  MONGODB_COLLECTION_NAME='restaurants_reviews'
  
  az webapp config appsettings set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --settings \
        CONNECTION_STRING=$MONGO_CONNECTION_STRING \
        DB_NAME=$MONGODB_NAME  \
        COLLECTION_NAME=$MONGODB_COLLECTION_NAME \
        SECRET_KEY=$SECRET_KEY
  ```

  ### [PowerShell](#tab/powershell)

  ```powershell-interactive
  # PowerShell syntax
  $MONGO_DB_NAME="restaurants_reviews"
  $MONGO_COLLECTION_NAME="restaurants_reviews"

  az webapp config appsettings set `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --settings CONNECTION_STRING=$MONGO_CONNECTION_STRING `
          DB_NAME=$MONGODB_NAME  `
          COLLECTION_NAME=$MONGODB_COLLECTION_NAME `
          SECRET_KEY=$SECRET_KEY        
  ```

  ---

## Browse the site

To verify the site is running, go to `https://<website-name>.azurewebsites.net`; where website name is your app service name. If successful, you should see the restaurant review sample app. It can take a few moments for the site to start the first time. When the site appears, add a restaurant and a review for that restaurant to confirm the sample app is functioning.

If you're running the Azure CLI locally, you can use the [az webapp browse](/cli/azure/webapp#az-webapp-browse) command to browse to the web site. If you're using Cloud Shell, open a browser window and navigate to the website URL.

```azurecli
az webapp browse --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP_NAME 
```

> [!NOTE]
> The `az webapp browse` command isn't supported in Cloud Shell. Open a browser window and navigate to the website URL instead.

### [VS Code](#tab/vscode-aztools)

## Create the web app

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

1. Refresh the Azure Container Registry in the Docker extension.

    Confirm that the container you built appears under the **REGISTRIES** section of the Docker extension. If it doesn't, right-click the registry name and select **Refresh**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" alt-text="A screenshot showing how to fresh registries in the Docker extension for Visual Studio Code." :::

1. Select **F1** or **CTRL+SHIFT+P** to open the command palette, type "Docker Registries", and select the **Docker Registries: Deploy Image to Azure App Service...** task.

1. Enter the following values as prompted to deploy the image:

    * Select registry provider: **Azure**
    * Subscription: Select the subscription that contains the Azure Container Registry you created earlier.
    * Select registry: Enter the name of the registry you created earlier in this tutorial.
    * Select repository: Enter the repository name **msdocspythoncontainerwebapp**. If you don't see this repo, refresh the Docker extension **REGISTRIES** section.
    * Select tag: **latest** for the image tag.
    * Enter a globally unique name for the web app: Enter a name that is globally unique to Azure App Service. For example, if you use **msdocs-python-container-web-app**, the web app URL would be `http://msdocs-python-container-web-app.azurewebsites.net`.
    * Select a resource group: Use the resource group that contains the Azure Container Registry you created earlier.
    * Select a Linux App Service plan: Use an existing or create a new one.

1. View the **OUTPUT** window for details of the deployment. One of the output lines is "Granting permission for App Service to pull image from ACR...", which the App Service accesses the registry using managed identity.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" alt-text="A screenshot showing prompt when Docker image is deployed App Service in Visual Studio Code." :::

    The final site `https://<app-name>.azurewebsites.net` isn't ready yet because you need to specify MongoDB info.

    When you deploy with Visual Studio Code, managed identity is already set for the App Service to pull images from the registry. You can confirm managed identity is enabled by viewing logs in the **OUTPUT** window and looking for the message "Granting permission for App Service to pull image from ACR...".

## Configure managed identity and webhook

During the deploy with VS Code, a webhook is created that enables the web app to pull new images from the Azure Container Registry.

> [!IMPORTANT]
> Review the webhooks configuration in the Azure portal to confirm the **Service URI** ends with "/api/registry/webhook". To review the service URI, open the Docker extension in VS Code and find the registry you created. Right-click the registry and select **Open in Portal**. The container registry opens in the Azure portal. Click **Services** and then click **Webhooks**. Open the context menu and click **Configure**.

:::image type="content" source="./media/tutorial-container-web-app/visual-studio-create-app-webhook.png" lightbox="./media/tutorial-container-web-app/visual-studio-create-app-webhook.png" alt-text="A screenshot showing how to check a webhook configuration." :::

## Configure connection to MongoDB

In this step, you specify environment variables needed to connect to MongoDB.

You need the MongoDB connection string for the next steps.

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

1. In the Azure view in VS Code (from the Azure Tools extension):

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
    * SECRET_KEY: Use "supersecretkeythatispassedtopythonapp".

## Browse the site

In the Azure view in VS Code (from the Azure Tools extension):

1. Expand **RESOURCES** and find **App Services** under your subscription. (Make sure you viewing resources by **Group by Resource Type**.)

1. Right-click your web app and select **Browse Website**.

---

## Troubleshoot deployment

If you don't see the sample app, try the following steps.

* With container deployment and App Service, always check the **Deployment Center** / **Logs** page in the Azure portal. Confirm that the container was pulled and is running. The initial pull and running of the container can take a few moments.
* Try to restart the App Service and see if that resolves your issue.
* If there are programming errors, those errors show up in the application logs. On the Azure portal page for the App Service, select **Diagnose and solve problems**/**Application logs**.
* The sample app relies on a connection to Azure Cosmos DB for MongoDB. Confirm that the App Service has application settings with the correct connection info.
* Confirm that managed identity is enabled for the App Service and is used in the Deployment Center. On the Azure portal page for the App Service, go to the App Service **Deployment Center** resource and confirm that **Authentication** is set to **Managed Identity**.
* Check that the webhook is defined in the Azure Container Registry. The webhook enables the App Service to pull the container image. In particular, check that Service URI ends with "/api/registry/webhook". If not, add it.
* [Different Azure Container Registry skus](/azure/container-registry/container-registry-skus) have different features, including number of webhooks. If you're reusing an existing registry, you could see the message: "Quota exceeded for resource type webhooks for the registry SKU Basic. Learn more about different SKU quotas and upgrade process: https://aka.ms/acr/tiers". If you see this message, use a new registry, or reduce the number of [registry webhooks](/azure/container-registry/container-registry-webhook) in use.

## Next step

> [!div class="nextstepaction"]
> [Clean up resources](tutorial-containerize-deploy-python-web-app-azure-05.md)

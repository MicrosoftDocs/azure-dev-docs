---
title: Deploy a Python web app container to Azure App Service
description: How to deploy a Python web app container (Django or Flask) to App Service using managed identity authentication with Azure Container Registry.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/10/2025
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Deploy a containerized Python app to App Service

In this part of the tutorial series, you learn how to deploy a containerized Python web application to Azure App Service using the [App Service Web App for Containers](/azure/app-service/containers/). This service lets you focus on building and managing your containers without the complexity of maintaining a container orchestrator. With App Service, you can run containerized web apps and streamline deployment using continuous integration/continuous deployment (CI/CD) with Docker Hub, Azure Container Registry, Azure Key Vault, and Visual Studio Team Services. This article is part 4 of a 5-part tutorial series.

By the end of this article, you have a fully deployed and secure App Service web site running on a Docker container image. App Service uses managed identity to authenticate with Azure Container Registry and retrieve the initial image. The Cosmos DB for MongdoDB connection string and the web app secret key are securely stored in Azure Key Vault. App Service uses managed identity to retrieve this connection string and secret key for the web app from Azure Key Vault.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with deployment path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" :::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

> [!IMPORTANT]
> We recommend using Cloud Shell for all CLI based operations in this tutorial because:
>
> * Cloud Shell comes pre-authenticated with Azure, eliminating potential login issues
> * All required Azure CLI extensions are pre-installed
> * It provides consistent behavior regardless of local environment differences
> * There's no need to worry about Docker Desktop or local networking issues
> * Cloud Shell has direct connectivity to Azure services, which can help avoid firewall or network configuration problems
> * You can use the Azure CLI in Cloud Shell without needing to install it locally, which is especially useful for users who may not have administrative privileges to install software on their machines.
> * Cloud Shell is available in the Azure portal, making it easy to access and use without needing to switch between different tools or interfaces.

## Create Key Vault with RBAC Authorization

Azure Key Vault is a secure cloud service for storing sensitive information such as secrets, API keys, connection strings, and certificates. In this script, it is used to store the MongoDB connection string and the web app's `SECRET_KEY`.

This Key Vault is configured with **RBAC (role-based access control)** to manage who or what can access its secrets. The web app accesses Key Vault using its **system-assigned managed identity**.

> [!NOTE]
> Creating the Key Vault early allows access roles to be assigned before any services (like the web app) try to retrieve secrets. It also helps avoid propagation delays in role assignments. Key Vault does not depend on the App Service, so provisioning it early improves overall reliability.

1. In this step, you create an Azure Key Vault configured with Role-Based Access Control (RBAC) authorization using the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    RESOURCE_GROUP_NAME="msdocs-web-app-rg"
    LOCATION="westus"
    KEYVAULT_NAME="${RESOURCE_GROUP_NAME}-kv"

    az keyvault create \
      --name "$KEYVAULT_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --location "$LOCATION" \
      --enable-rbac-authorization true
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $RESOURCE_GROUP_NAME="msdocs-web-app-rg"
    $LOCATION="westus"
    $KEYVAULT_NAME="${RESOURCE_GROUP_NAME}-kv"

    az keyvault create `
      --name "$KEYVAULT_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --location "$LOCATION" `
      --enable-rbac-authorization true
    ```

    ---

## Create the app service plan and web app

The **App Service Plan** defines the pricing tier, compute resources, and region for your web app. The **web app** is where the containerized application runs and is provisioned with a **system-assigned managed identity**. This identity is used to securely authenticate to **Azure Container Registry (ACR)** and **Azure Key Vault** without hard-coded credentials.

In this step, you also configure the web app with its container image and enable it for **continuous deployment from ACR**.

> [!NOTE]
> The web app must be created before assigning access to ACR or Key Vault, because its managed identity is only generated at creation time.
> Assigning the container image during creation ensures the app is deployed and configured correctly from the start.

1. In this step, you App Service Plan using [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create), and then deploy the web app with [az webapp create](/cli/azure/webapp#az-webapp-create).

    ### [Bash](#tab/bash)
  
    ```azurecli-interactive
    #!/bin/bash
    APP_SERVICE_PLAN_NAME="msdocs-web-app-plan"
    
    az appservice plan create \
        --name "$APP_SERVICE_PLAN_NAME" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --sku B1 \
        --is-linux
    ```
  
    ### [PowerShell](#tab/powershell)
  
    ```powershell-interactive
    # PowerShell syntax
    $APP_SERVICE_PLAN_NAME="msdocs-web-app-plan"
    
    az appservice plan create `
        --name "$APP_SERVICE_PLAN_NAME" `
        --resource-group "$RESOURCE_GROUP_NAME" `
        --sku B1 `
        --is-linux
    ```
  
    ---

1. In this step, you create the web app using the [az webapp create](/cli/azure/webapp#az-webapp-create) command. This command also enables a [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) for the app, which is used to authenticate to Azure services.

    ### [Bash](#tab/bash)
  
    ```azurecli-interactive
    #!/bin/bash
    APP_SERVICE_NAME="msdocs-website-name" #APP_SERVICE_NAME must be globally unique as it becomes the website name in the URL `https://<website-name>.azurewebsites.net`.
    # Use the same registry name as in part 2 of this tutorial series.
    REGISTRY_NAME="msdocscontainerregistryname" #REGISTRY_NAME is the registry name you used in part 2 of this tutorial.
    CONTAINER_NAME="$REGISTRY_NAME.azurecr.io/msdocspythoncontainerwebapp:latest" #CONTAINER_NAME is of the form "yourregistryname.azurecr.io/repo_name:tag".
    
    az webapp create \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --plan "$APP_SERVICE_PLAN_NAME" \
      --name "$APP_SERVICE_NAME" \
      --assign-identity '[system]' \
      --deployment-container-image-name "$CONTAINER_NAME" 
    ```
  
    ### [PowerShell](#tab/powershell)
  
    ```powershell-interactive
    # Powershell syntax
    $APP_SERVICE_NAME="msdocs-website-name"
    # Use the same rregistry name as in part 2 of this tutorial series.
    $REGISTRY_NAME="msdocscontainerregistryname"
    $CONTAINER_NAME = "$REGISTRY_NAME.azurecr.io/msdocspythoncontainerwebapp:latest"
    
    az webapp create `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --plan "$APP_SERVICE_PLAN_NAME" `
      --name "$APP_SERVICE_NAME" `
      --assign-identity '[system]' `
      --deployment-container-image-name "$CONTAINER_NAME" 
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
  
## Grant Secrets Officer Role to logged-In user

The **Key Vault Secrets Officer** role allows a user to create and manage secrets within Azure Key Vault. In this step, the script assigns that role to the currently logged-in user so they can securely store application secrets like the MongoDB connection string and web app's `SECRET_KEY`.

This role assignment is the first of two role assignments related to Key Vault access. The second, later in the script, assigns access to the web app’s managed identity.

Using RBAC eliminates the need for hard-coded credentials and provides secure, auditable access control based on identity.

> [!NOTE]
> The user running this script must be assigned the **Key Vault Secrets Officer** role before running any `az keyvault secret set` commands.
>
> This step uses the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign the role at the Key Vault scope.

1. In this step, you use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign the role at the Key Vault scope.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    CALLER_ID=$(az ad signed-in-user show --query id -o tsv)
    echo $CALLER_ID # Verify this value retrieved successfully. In production, poll to verify this value is retrieved successfully.
    
    az role assignment create \
      --role "Key Vault Secrets Officer" \
      --assignee "$CALLER_ID" \
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
    
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $CALLER_ID=$(az ad signed-in-user show --query id -o tsv)
    echo $CALLER_ID # Verify this value retrieved successfully. In production, poll to verify this value is retrieved successfully.

    az role assignment create `
      --role "Key Vault Secrets Officer" `
      --assignee "$CALLER_ID" `
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
    ```

    ---

## Grant web access to ACR using managed identity

The web app needs permission to pull container images from Azure Container Registry (ACR) using its **system-assigned managed identity**. This step enables the web app to authenticate using its identity and assigns it the required role to access ACR without storing credentials.

This involves two actions:

* Enabling the use of managed identity for pulling images.
* Assigning the **AcrPull** role to the identity on the target ACR.

1. In this step, you retrieve the **principal ID** (unique object ID) of the web app’s managed identity using the [az webapp identity show](/cli/azure/webapp/identity#az-webapp-identity-show) command. You then configure the web app to use its managed identity when authenticating to ACR by setting the `acrUseManagedIdentityCreds` property to `true` using the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command. You then assign the **AcrPull** role to the web app’s managed identity on the ACR using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. This grants the web app permission to pull images from the registry.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    PRINCIPAL_ID=$(az webapp identity show \
      --name "$APP_SERVICE_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --query principalId \
      -o tsv)
    echo $PRINCIPAL_ID # Verify this value retrieved successfully. In production, poll for successful 'AcrPull' role assignment using `az role assignment list`.    

    az webapp config set \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --name "$APP_SERVICE_NAME" \
      --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    
    az role assignment create \
    --role "AcrPull" \
    --assignee "$PRINCIPAL_ID" \
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ContainerRegistry/registries/$REGISTRY_NAME"
    
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $PRINCIPAL_ID=$(az webapp identity show `
      --name "$APP_SERVICE_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --query principalId `
      -o tsv)
    echo $PRINCIPAL_ID # Verify this value retrieved successfully. In production, poll for successful AcrPull role assignment using `az role assignment list`.    

    az webapp config set `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --name "$APP_SERVICE_NAME" `
      --generic-configurations '{ "acrUseManagedIdentityCreds": true }'
    
    az role assignment create `
      --role "AcrPull" `
      --assignee "$PRINCIPAL_ID" `
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ContainerRegistry/registries/$REGISTRY_NAME"
    ```

    ---

## Grant key vault access to the web app's managed identity

To securely access secrets such as the MongoDB connection string and the Django `SECRET_KEY`, the web app must be granted access to Azure Key Vault using its **system-assigned managed identity**.

1. In this step, you use the unique identifier (principal ID) of the web app’s system-assigned managed identity to grant the web app access to the Key Vault with the **Key Vault Secrets User** role using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

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
      --assignee "$APP_SERVICE_NAME" `
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
    
    ```

    ---

## Store Secrets in Key Vault

To securely manage sensitive values, this step stores the **MongoDB connection string** and the web app’s **secret key** in Azure Key Vault. This allows the app to access these values securely using its managed identity, without hardcoding secrets in the application code.

> [!NOTE]
> While this example stores only the connection string and secret key in Key Vault, you could also store values like the database name and collection name in the Key Vault.

1. In this step, you store the connection string for MongoDB and a secret key for the web app in the Key Vault using the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command. The connection string is retrieved from the Azure Cosmos DB account using the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    ACCOUNT_NAME="msdocs-cosmos-db-account-name"

    MONGO_CONNECTION_STRING=$(az cosmosdb keys list \
      --name "$ACCOUNT_NAME" \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --type connection-strings \
      --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" -o tsv)
    
    SECRET_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9')
    # This is cryptographically secure, using OpenSSL’s strong random number generator.
    
    az keyvault secret set \
      --vault-name "$KEYVAULT_NAME" \
      --name "MongoConnectionString" \
      --value "$MONGO_CONNECTION_STRING"
    
    az keyvault secret set \
      --vault-name "$KEYVAULT_NAME" \
      --name "MongoSecretKey" \
      --value "$SECRET_KEY"
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $ACCOUNT_NAME="msdocs-cosmos-db-account-name"

    MONGO_CONNECTION_STRING=$(az cosmosdb keys list `
      --name "$ACCOUNT_NAME" `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --type connection-strings `
      --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" -o tsv)
    
    # Generate a 32-byte cryptographically secure random value
    $bytes = New-Object 'Byte[]' 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    
    # Encode as base64 and strip non-alphanumeric characters
    $SECRET_KEY = ([Convert]::ToBase64String($bytes) -replace '[^a-zA-Z0-9]', '')    # This is cryptographically secure, PowerShell’s cryptographically secure random generator
     
    az keyvault secret set `
      --vault-name "$KEYVAULT_NAME" `
      --name "MongoConnectionString" `
      --value "$MONGO_CONNECTION_STRING"
    
    az keyvault secret set `
      --vault-name "$KEYVAULT_NAME" `
      --name "MongoSecretKey" `
      --value "$SECRET_KEY"
    ```

    ---

## Configure web app to use Kay Vault secrets

To access secrets securely at runtime, the web app must be configured to reference the secrets stored in Azure Key Vault. These secrets are injected into the app using Key Vault references, and accessed through the web app’s managed identity. This setup allows the app to **retrieve secrets securely at runtime** without storing them in code or environment variables.

1. In this step, you use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command to add application settings that reference the Key Vault secrets. Specifically, this sets the `MongoConnectionString` and `MongoSecretKey` app settings to reference the corresponding secrets stored in Key Vault.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    MONGODB_NAME="restaurants_reviews"
    MONGODB_COLLECTION_NAME="restaurants_reviews"
    
    az webapp config appsettings set \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --name "$APP_SERVICE_NAME" \
      --settings \
          CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=https://$KEYVAULT_NAME.vault.azure.net/secrets/MongoConnectionString)" \
          SECRET_KEY="@Microsoft.KeyVault(SecretUri=https://$KEYVAULT_NAME.vault.azure.net/secrets/MongoSecretKey)" \
          DB_NAME="$MONGODB_NAME" \
          COLLECTION_NAME="$MONGODB_COLLECTION_NAME"
      ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $MONGO_DB_NAME="restaurants_reviews"
    $MONGO_COLLECTION_NAME="restaurants_reviews"
    
    az webapp config appsettings set `
      --resource-group $RESOURCE_GROUP_NAME `
      --name $APP_SERVICE_NAME `
      --settings `
        CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=https://$KEYVAULT_NAME.vault.azure.net/secrets/MongoConnectionString)" `
        SECRET_KEY="@Microsoft.KeyVault(SecretUri=https://$KEYVAULT_NAME.vault.azure.net/secrets/MongoSecretKey)" `
        DB_NAME=$MONGODB_NAME `
        COLLECTION_NAME=$MONGODB_COLLECTION_NAME
    ```

    ---

## Enable continuous deployment from ACR

Enabling continuous deployment allows the web app to automatically update whenever a new container image is pushed to Azure Container Registry (ACR). This step simplifies the deployment workflow and ensures the app always runs the latest image.

> [!NOTE]
> In the next step, a webhook is registered in ACR to notify the web app when a new image is pushed.

1. In this step, you use the [az webapp deployment container config](/cli/azure/webapp/deployment/container#az-webapp-deployment-container-config) command to enable continuous deployment from ACR to the web app.

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

## Register an ACR Webhook to trigger Web App on push of new image

To automate deployment, a webhook is registered on Azure Container Registry (ACR) that notifies the web app whenever a new container image is pushed. This allows the web app to automatically pull and deploy the latest version of the image.

The webhook sends a POST request to the web app’s SCM endpoint (`SERVICE_URI`) each time a new image is pushed to `msdocspythoncontainerwebapp`. This connects ACR and the web app to support continuous deployment.

> [!NOTE]  
> The webhook URI must end with `/api/registry/webhook` and follow the format:  
> `https://<app-name>.scm.azurewebsites.net/api/registry/webhook`  
>  
> If you receive an error about an invalid URI, double-check that the path ends with `/api/registry/webhook`.

1. In this step, use the [az acr webhook create](/cli/azure/acr/webhook#az-acr-webhook-create) command to register the webhook and configure it to trigger on `push` events.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    CREDENTIAL=$(az webapp deployment list-publishing-credentials \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --name "$APP_SERVICE_NAME" \
        --query publishingPassword --output tsv)
    # Web app publishing credentials may not be available immediately. In production, poll until non-empty.   
    
    SERVICE_URI="https://$APP_SERVICE_NAME:$CREDENTIAL@$APP_SERVICE_NAME.scm.azurewebsites.net/api/registry/webhook"
    
    az acr webhook create \
      --name webhookforwebapp \
      --registry "$REGISTRY_NAME" \
      --scope msdocspythoncontainerwebapp:* \
      --uri "$SERVICE_URI" \
      --actions push
    
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    $CREDENTIAL=$(az webapp deployment list-publishing-credentials `
      --resource-group "$RESOURCE_GROUP_NAME" `
      --name "$APP_SERVICE_NAME" `
      --query publishingPassword --output tsv)
    
    # Web app publishing credentials may not be available immediately. In production, poll until non-empty.   
        
    $SERVICE_URI="https://$APP_SERVICE_NAME:$CREDENTIAL@$APP_SERVICE_NAME.scm.azurewebsites.net/api/registry/webhook"
    
    az acr webhook create `
      --name webhookforwebapp `
      --registry "$REGISTRY_NAME" `
      --scope msdocspythoncontainerwebapp:* `
      --uri "$SERVICE_URI" `
      --actions push
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

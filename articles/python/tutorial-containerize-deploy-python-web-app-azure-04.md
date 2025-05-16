---
title: Deploy a Python web app container to Azure App Service
description: How to deploy a Python web app container (Django or Flask) to App Service using managed identity authentication with Azure Container Registry.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/10/2025
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Deploy a containerized Python app to App Service

In this part of the tutorial series, you learn how to deploy a containerized Python web application to [Azure App Service Web App for Containers](/azure/app-service/containers/). This fully managed service lets you run containerized apps without having to maintain your own container orchestrator.

App Service simplifies deployment through continuous integration/continuous deployment (CI/CD) pipelines that work with Docker Hub, Azure Container Registry, Azure Key Vault, and other DevOps tools. This is part 4 of a 5-part tutorial series.

At the end of this article, you have a secure, production-ready App Service web app running from a Docker container image. The app uses a **system-assigned managed identity** to pull the image from Azure Container Registry and retrieve secrets from Azure Key Vault.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with deployment path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-deploy.png" :::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a local machine with the [Azure CLI installed](/cli/azure/install-azure-cli).

> [!IMPORTANT]
> We recommend using **Azure Cloud Shell** for all CLI-based steps in this tutorial because it:
>
> * Comes pre-authenticated with your Azure account, avoiding login issues
> * Includes all required Azure CLI extensions out of the box
> * Ensures consistent behavior regardless of your local OS or environment
> * Requires no local installation, ideal for users without admin rights
> * Provides direct access to Azure services from the portal—no local Docker or network setup required
> * Avoids local firewall or network configuration issues

## Create Key Vault with RBAC Authorization

Azure Key Vault is a secure service for storing secrets, API keys, connection strings, and certificates. In this script, it stores the **MongoDB connection string** and the web app’s **`SECRET_KEY`**.

The Key Vault is configured to use **role-based access control (RBAC)** to manages access through Azure roles instead of traditional access policies. The web app uses its **system-assigned managed identity** to retrieve secrets securely at runtime.

> [!NOTE]
> Creating the Key Vault early ensures that roles can be assigned before any attempt to access secrets. It also helps avoid propagation delays in role assignments. Since Key Vault doesn’t depend on the App Service, provisioning it early improves reliability and sequencing.

1. In this step, you use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command to create an Azure Key Vault with RBAC enabled.

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

The App Service Plan defines the compute resources, pricing tier, and region for your web app. The web app runs your containerized application and is provisioned with a system-assigned managed identity that is used to securely authenticate to Azure Container Registry (ACR) and Azure Key Vault.

In this step, you perform the following tasks:

* Create an App Service Plan
* Create the web app with its managed identity
* Configure the web app to deploy using a specific container image
* Prepare for continuous deployment via ACR

> [!NOTE]
> The web app must be created before assigning access to ACR or Key Vault because the **managed identity is only created at deployment time**.
> Also, assigning the container image during creation ensures the app starts up correctly with the intended configuration.

1. In this step, you use the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) command to provision the compute environment for your app.

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

1. In this step, you use the [az webapp create](/cli/azure/webapp#az-webapp-create) command to create the web app. This command also enables a [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) and sets the container image that the app will run.

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
      > When running this command, you may see the following error:
      >
      >    ```output
      >    No credential was provided to access Azure Container Registry. Trying to look up...
      >    Retrieving credentials failed with an exception:'Failed to retrieve container registry credentials. Please either provide the credentials or run 'az acr update -n msdocscontainerregistryname --admin-enabled true' to enable admin first.'
      >    ```
      >
      > This error occurs because the web app tries to use admin credentials to access ACR, which are disabled by default. It's safe to ignore this message: the next step configures the web app to use its managed identity to authenticate with ACR.

## Grant Secrets Officer Role to logged-In user

To store secrets in Azure Key Vault, the user running the script must have the **Key Vault Secrets Officer** role. This role allows creating and managing secrets within the vault. 

In this step, the script assigns that role to the currently logged-in user. This enables them to securely store application secrets, such as the MongoDB connection string and the app’s `SECRET_KEY`. 

This is the first of two Key Vault–related role assignments. Later, the web app’s system-assigned managed identity is granted access to retrieve secrets from the vault. 

Using **Azure RBAC** ensures secure, auditable access based on identity, eliminating the need for hard-coded credentials.

> [!NOTE]
> The user must be assigned the **Key Vault Secrets Officer** role **before** running any `az keyvault secret set` commands.
> This assignment is done using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command scoped to the Key Vault.

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

To pull images from Azure Container Registry (ACR) securely, the web app must be configured to use its **system-assigned managed identity**. This avoids the need for admin credentials and supports secure, credential-free deployment.

This process involves two key actions:

* Enabling the web app to use its managed identity when accessing ACR
* Assigning the **AcrPull** role to that identity on the target ACR


1. In this step, you retrieve the **principal ID** (unique object ID) of the web app’s managed identity using the [az webapp identity show](/cli/azure/webapp/identity#az-webapp-identity-show) command. Next, you enable the use of the managed identity for ACR authentication by setting the `acrUseManagedIdentityCreds` property to `true` using [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set). You then assign the **AcrPull** role to the web app’s managed identity using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. This grants the web app permission to pull images from the registry.

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

The web app needs permission to access secrets like the MongoDB connection string and the `SECRET_KEY`. To enable this, you must assign the **Key Vault Secrets User** role to the web app’s **system-assigned managed identity**.

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

To avoid hardcoding secrets in your application, this step stores the **MongoDB connection string** and the web app’s **secret key** in Azure Key Vault. These values can then be securely accessed by the web app at runtime using its managed identity.

> [!NOTE]
> While this tutorial stores only the connection string and secret key, you can optionally store other application settings such as the MongoDB database name or collection name in Key Vault as well.

1. In this step, you use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command to retrieve the MongoDB connection string. You then use the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to store both the connection string and a randomly generated secret key in Key Vault.

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
    
    # Convert to base64 and filter to alphanumeric characters only
    $base64 = [Convert]::ToBase64String($bytes)
    $alphanumeric = $base64 -replace '[^a-zA-Z0-9]', ''
    
    # Truncate to 50 characters
    $SECRET_KEY = $alphanumeric.Substring(0, [Math]::Min(50, $alphanumeric.Length))
     
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

To access secrets securely at runtime, the web app must be configured to reference the secrets stored in Azure Key Vault. This is done using **Key Vault references**, which inject the secret values into the app’s environment through its **system-assigned managed identity**.

This approach avoids hardcoding secrets and allows the app to securely retrieve sensitive values like the MongoDB connection string and secret key during execution.

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

Enabling continuous deployment allows the web app to automatically pull and run the latest container image whenever one is pushed to Azure Container Registry (ACR). This reduces manual deployment steps and helps ensure your app stays up to date.

> [!NOTE]
> In the next step, you'll register a webhook in ACR to notify the web app when a new image is pushed.

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

## Register an ACR Webhook for continuous deployment

To automate deployments, register a webhook in Azure Container Registry (ACR) that notifies the web app whenever a new container image is pushed. This allows the app to automatically pull and run the latest version.

The webhook sends a POST request to the web app’s SCM endpoint (`SERVICE_URI`) every time an updated image is pushed to `msdocspythoncontainerwebapp`. This completes the continuous deployment pipeline between ACR and App Service.

> [!NOTE]
> The webhook URI must follow this format:  
> `https://<app-name>.scm.azurewebsites.net/api/registry/webhook`  
> 
> It **must end** with `/api/registry/webhook`. If you receive a URI error, confirm that the path is correct.

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

## Browse the Site

To verify that the web app is running, open `https://<website-name>.azurewebsites.net`, replacing `<website-name>` with the name of your App Service. You should see the restaurant review sample app. It may take a few moments to load the first time.

Once the site appears, try adding a restaurant and submitting a review to confirm that the app is functioning correctly.

> [!NOTE]
> The `az webapp browse` command isn't supported in Cloud Shell. If you're using Cloud Shell, manually open a browser and navigate to the site URL.

If you're using the Azure CLI locally, you can use the [az webapp browse](/cli/azure/webapp#az-webapp-browse) command to open the site in your default browser:

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

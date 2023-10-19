---
title: Use Azure Key Vault secrets in Express.js app
description: With Azure CLI, store secrets in Azure Key Vault, then pull in those secrets programmatically from Key Vault to the Express.js app. 
ms.topic: how-to
ms.date: 06/09/2022
ms.custom: seo-javascript-september2019, devx-track-js, devx-track-azurecli
#intent: Show a customer how to create a key vault resource, add a key, secret, and certificate, then use those in an Express.js app. 
---

# Use Azure Key Vault secrets in Express.js app

With Azure CLI, store secrets in Azure Key Vault, then use those secrets programmatically from Key Vault in your Express.js app. 

## Prepare your development environment

Complete the [Express.js with Azure Cosmos DB tutorial](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli) but **do not delete the resources** at the end of the procedure. 

When you complete the previous tutorial, you should have an Express.js app using an Azure Cosmos DB database deployed to an Azure web app. 

## Sign in to Azure CLI

In the Visual Studio Code integrated terminal, sign in to the Azure CLI. This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription.

Use the [az Login](/cli/azure/reference-index#az-login) command to sign in. 

```azurecli
az login
```

## Create a Key Vault resource with Azure CLI

Use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command to create a Key Vault resource in the resource group.

```azurecli
az keyvault create \
    --subscription REPLACE_WITH_YOUR_SUBSCRIPTION_NAME_OR_ID \
    --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME \
    --name REPLACE_WITH_YOUR_KEY_VAULT_NAME
```

Your Azure account is the only one authorized to perform any operations on this new vault. Make note of the output values: 
* **Vault Name**: The name you provided to the `--name` parameter above.
* **Vault URI**: The URL format is `https://<YOUR_KEY_VAULT_NAME>.vault.azure.net/`. 

## Create a service principal with Azure CLI

The [service principal](/azure/active-directory/develop/app-objects-and-service-principals) allows you to create and use resources without having to use or expose your personal user account. The service principal is stored as an App Registration in Microsoft Entra ID. 

This sample uses the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), which requires authentication setup. One example of setting up the credential is to create and use a service principal.

1. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a service principal with a scope for your resource group. 

    ```azurecli
    az ad sp create-for-rbac \
        --name SERVICE-PRINCIPAL-NAME \
        --role Contributor \
        --scopes "/subscriptions/SUBSCRIPTION_NAME_OR_ID/resourceGroups/RESOURCE-GROUP-NAME"
    ```

    |Term|Replace with|
    |--|--|
    |SERVICE-PRINCIPAL-NAME|An example **SERVICE-PRINCIPAL-NAME** is `demo-keyvault-service-principal-YOUR-NAME`, where `YOUR-NAME` is postpended to the string.|
    |SUBSCRIPTION_NAME_OR_ID|Your subscription ID is preferred. You can find this on the resource group's **Overview** page in the Azure portal.|
    |RESOURCE-GROUP-NAME|Your resource group name - the service principal authorization is scoped to just this resource group.|

    *Troubleshooting*: If you receive an error on this step, review the following [Azure CLI issue 16317](https://github.com/Azure/azure-cli/issues/16317). Try executing the command from a different terminal or command line. 
    

1. Capture and save the service principal output results of the command to use later.
 
    ```json
    {
        "appId": "YOUR-APP-ID-VALUE",
        "displayName": "YOUR-SERVICE-PRINCIPAL-DISPLAY-NAME",
        "name": "YOUR-SERVICE-PRINCIPAL-NAME",
        "password": "!@#$%",
        "tenant": "YOUR-TENANT-ID"
    }
    ```

    Notice that the value of the `appId` property has the same value as the `name` property.  

## Give your service principal access to your key vault

Use the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command to give your service principal access to your Key Vault with Azure CLI command. The value for `YOUR-SERVICE-PRINCIPAL-NAME` is your service principal output's `name` value. Do not use the `displayName` value.  

```azurecli
az keyvault set-policy \
    --subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
    --resource-group RESOURCE-GROUP-NAME \
    --name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
    --spn YOUR-SERVICE-PRINCIPAL-NAME \
    --secret-permissions get list
```

This service principal will only be able to list all secrets or get a specific secret. You can see this service principal in the Azure portal for your Key Vault 

## Store your secret environment variable in Key Vault resource

Use the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to add your MongoDB connection string, created in the [prior tutorial](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli), as a secret named `DATABASE-URL` to your key vault on the **Settings -> Access policies** page.

```azurecli
az keyvault secret set \
    --subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
    --vault-name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
    --name "DATABASE-URL" \
    --value "YOUR-COSMOS-DB-MONGODB-CONNECTION-STRING"
```

> [!NOTE]
> `DATABASE-URL`, as a secret name, is not a keyword. You could choose any name to identify the secret. Just use that name consistently in the remaining instructions. 

## Optional: Configure Express.js required environment variables to use Azure Identity

Complete this step if you can't use the Visual Studio Code credential, Azure CLI credential, or the Azure PowerShell credential. Learn more about [local development credentials](../../sdk/authentication/overview.md#sequence-of-selecting-authentication-methods-when-using-defaultazurecredential). 

Set these environment variables in the `.env` file of the sample project to create the **REQUIRED context to use DefaultAzureCredential**.

* `AZURE_TENANT_ID`: The `tenant` from the service principal output above.
* `AZURE_CLIENT_ID`: The `appId` from the service principal output above.
* `AZURE_CLIENT_SECRET`: The `password` from the service principal output above.

When you deploy the application to Azure app service, you'll also need to add these settings to your web app. 

> [!NOTE]
> These variables names are keywords and must be used as-is, without changes, in order for Azure Identity to work successfully.

## Configure Express.js required environment variables to use Azure Key Vault

Set these environment variables in the `.env` file of the sample project to programmatically determine which Key Vault resource and secret to use.

* `KEY_VAULT_NAME`: Same value as `REPLACE-WITH-YOUR-KEY-VAULT-NAME` used in previous commands.
* `KEY_VAULT_SECRET_NAME_DATABASE_URL`: The secret name, `DATABASE-URL`. Notice the name uses a dash, `-`, instead of an underscore, `_` used in the previous tutorial.

When you deploy the application to Azure app service, you'll also need to add these settings to your web app. 

> [!NOTE]
> These variable names are specific to this sample. You can change them but make sure to change them in the environment file, the source code file, and your deployed web app settings. 

## Run the local program 

1. Run the Express.js app with the following command:

    ```bash
    npm start
    ```

1. Open the Express.js app in the browser: `http://localhost:3000`.
1. Interact with the app, adding and deleting tasks. 

## Update the App Service app settings for Key vault

Add the Key vault and DefaultAzureCredential to the Azure App Service's app settings.

1. Use the following Azure CLI command to add the **KEY_VAULT_NAME** app setting. The value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings KEY_VAULT_NAME=msdocs-key-vault-123
    ```


    |Property|Value|
    |--|--|
    |KEY_VAULT_NAME|msdocs-key-vault-123|

1. Use the following Azure CLI command to add the **KEY_VAULT_SECRET_NAME_DATABASE_URL** app setting. The value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings KEY_VAULT_SECRET_NAME_DATABASE_URL=DATABASE-URL
    ```

    |Property|Value|
    |--|--|
    |KEY_VAULT_SECRET_NAME_DATABASE_URL|DATABASE-URL|

## Update the App Service app settings for service principal

To use the service principal to authorize access from the hosting platform to Key vault [in source code](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app/blob/main/config/keyvault.js#L10), the App Service environment needs to those specifically-named settings for the DefaultAzureCredential.

1. Use the following Azure CLI command to add the **AZURE_TENANT_ID** app setting.  The value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings AZURE_TENANT_ID=
    ```

    |Property|Value|
    |--|--|
    |AZURE_TENANT_ID|This is the `tenant` property from the service principal object. |

1. Use the following Azure CLI command to add the **AZURE_CLIENT_ID** app setting. The value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings AZURE_CLIENT_ID=
    ```

    |Property|Value|
    |--|--|
    |AZURE_CLIENT_ID|This is the `appId` property from the service principal object.|

1. Use the following Azure CLI command to add the **AZURE_CLIENT_SECRET** app setting. The value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings AZURE_CLIENT_SECRET=
    ```

    |Property|Value|
    |--|--|
    |AZURE_CLIENT_SECRET|This is the `password` property from the service principal object.|


## Clean up resources - remove resource group

[!INCLUDE [delete resource group 3-tab](../../../includes/delete-resource-group.md)]

This command may take a few minutes. 

## Clean up resources - remove service principal

Delete your service principal with the 
[az ad sp delete](/cli/azure/ad/sp#az-ad-sp-delete) command. 

```azurecli
az ad sp delete \
--id YOUR-SERVICE-PRINCIPAL-NAME
```

## Next steps

* [Configure your Azure Web app](../configure-web-app-settings.md)

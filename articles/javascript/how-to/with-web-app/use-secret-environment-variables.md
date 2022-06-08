---
title: Use Azure Key Vault secrets in Express.js app
description: Store secrets in Azure Key Vault, then pull in those secrets programmatically from Key Vault to the Express.js app. 
ms.topic: how-to
ms.date: 06/07/2022
ms.custom: seo-javascript-september2019, devx-track-js, devx-track-azurecli
#intent: Show a customer how to create a key vault resource, add a key, secret, and certificate, then use those in an Express.js app. 
---

# Use Azure Key Vault secrets in Express.js app

Store secrets in Azure Key Vault, then use those secrets programmatically from Key Vault in your Express.js app. 

## Prepare your development environment

1. Complete the [Express.js with Cosmos DB tutorial](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli) but **do not delete the resources** at the end of the procedure. 

    When you complete the previous tutorial, you should have an Express.js app using a Cosmos DB database deployed to an Azure web app. 

## Log in to Azure CLI

In the Visual Studio Code integrated terminal, log in to the Azure CLI. This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription.

Use the [az Login](/cli/azure/reference-index#az-login) command to login. 

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

The [service principal](/azure/active-directory/develop/app-objects-and-service-principals) allows you to create and use resources without having to use or expose your personal user account. The service principal is stored as an App Registration in Azure Active Directory. 

This sample uses the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), which requires authentication setup. One example of setting up the credential is to create and use a service principal.

1. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a service principal with a scope for your resource group. 

    ```azurecli
    az ad sp create-for-rbac \
    --name SERVICE-PRINCIPAL-NAME \
    --role Contributor \
    --scopes /subscriptions/SUBSCRIPTION_NAME_OR_ID/resourceGroups/RESOURCE-GROUP-NAME
    ```

    |Term|Replace with|
    |--|--|
    |SERVICE-PRINCIPAL-NAME|An example **SERVICE-PRINCIPAL-NAME** is `demo-keyvault-service-principal-YOUR-NAME`, where `YOUR-NAME` is postpended to the string.|
    |SUBSCRIPTION_NAME_OR_ID|Your subscription Id is preferred. You can find this on the resource group's **Overview** page in the Azure portal.|
    |RESOURCE-GROUP-NAME|Your resource group name.|

    

1. Capture and save the service principal output results of the command to use later.
 
    ```json
    {
        "appId": "YOUR-SERVICE-PRINCIPAL-ID",
        "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
        "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
        "password": "!@#$%",
        "tenant": "YOUR-TENANT-ID"
    }
    ```

## Give your service principal access to your key vault

Use the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command to give your service principal access to your Key Vault with Azure CLI command. The value for `YOUR-SERVICE-PRINCIPAL-ID` is your service principal output's `appId` value. 

```azurecli
az keyvault set-policy \
--subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
--name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
--spn YOUR-SERVICE-PRINCIPAL-ID \
--secret-permissions get list
```

This service principal will only be able to list all secrets or get a specific secret.

## Store your secret environment variable in Key Vault resource

Use the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to add your MongoDB connection string, created in the [prior tutorial](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli), as a secret named `DATABASE-URL` to your key vault.

```azurecli
az keyvault secret set \
--subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
--vault-name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
--name "DATABASE-URL" \
--value "YOUR-COSMOS-DB-MONGODB-CONNECTION-STRING"
```

> [!NOTE]
> `DATABASE-URL`, as a secret name, is not a keyword. You could choose any name to identify the secret. Just use that name consistently in the remaining instructions. 

## Configure Express.js required environment variables to use Azure Identity

Set these environment variables in the `.env` file of the sample project to create the **REQUIRED context to use DefaultAzureCredential**.

* `AZURE_TENANT_ID`: The `tenant` from the service principal output above.
* `AZURE_CLIENT_ID`: The `appId` from the service principal output above.
* `AZURE_CLIENT_SECRET`: The `password` from the service principal output above.

When you deploy the application to Azure app service, you will also need to add these settings to your web app. 

> [!NOTE]
> These variables names are keywords and must be used as-is, without changes, in order for Azure Identity to work successfully.

## Configure Express.js required environment variables to use Azure Key Vault

Set these environment variables in the `.env` file of the sample project to programmatically determine which Key Vault resource and secret to use.

* `KEY_VAULT_NAME`: Same value as `REPLACE-WITH-YOUR-KEY-VAULT-NAME` used in previous commands.
* `KEY_VAULT_SECRET_NAME_DATABASE_URL`: The secret name, `DATABASE_URL`.

When you deploy the application to Azure app service, you will also need to add these settings to your web app. 

> [!NOTE]
> These variable names are specific to this sample. You can change them but make sure to change them in the environment file, the source code file, and your deployed web app settings. 

## Run the local program 

1. Run the Express.js app with the following command:

    ```bash
    npm start
    ```

1. Open the Express.js app in the browser: `http://localhost:3000`.
1. Interact with the app, adding and deleting tasks. 

## Update the app settings

Add the Key vault and DefaultAzureCredential to the Azure App Service's app settings.

1. Use the following Azure CLI command to add the **KEY_VAULT_NAME** app setting. If you've following this procedure, the value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings KEY_VAULT_NAME=msdocs-key-vault-123
    ```


    |Property|Value|
    |--|--|
    |KEY_VAULT_NAME|msdocs-key-vault-123|

1. Use the following Azure CLI command to add the **KEY_VAULT_SECRET_NAME_DATABASE_URL** app setting. If you've following this procedure, the value is in the `.env` file. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings KEY_VAULT_SECRET_NAME_DATABASE_URL=DATABASE-URL
    ```

    |Property|Value|
    |--|--|
    |KEY_VAULT_SECRET_NAME_DATABASE_URL|DATABASE-URL|


1. Use the following Azure CLI command to add the **AZURE_TENANT_ID** app setting. If you've following this procedure, the value for `AZURE_TENANT_ID` is in the `.env` file, add that after the `=`. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings AZURE_TENANT_ID=
    ```

    |Property|Value|
    |--|--|
    |AZURE_TENANT_ID|This is the `tenant` property from the service principal object. |

1. Use the following Azure CLI command to add the **AZURE_CLIENT_ID** app setting. If you've following this procedure, the value for `AZURE_CLIENT_ID` is in the `.env` file, add that after the `=`. 

    ```azurecli
    az webapp config appsettings set \
        --name YOUR-APP-SERVICE-NAME \
        --resource-group REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
        --settings AZURE_CLIENT_ID=
    ```

    |Property|Value|
    |--|--|
    |AZURE_CLIENT_ID|This is the `tenant` property from the service principal object.|

1. Use the following Azure CLI command to add the **AZURE_CLIENT_SECRET** app setting. If you've following this procedure, the value for `AZURE_CLIENT_SECRET` is in the `.env` file, add that after the `=`. 

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

Once you have completed this tutorial, you need to remove the resource group with the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli
az group delete \
--name REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME  -y
```

This command may take a few minutes. 

## Clean up resources - remove service principal

Delete your service principal with the 
[az ad sp delete](/cli/azure/ad/sp#az-ad-sp-delete) command. 

```azurecli
az ad sp delete \
--id YOUR-SERVICE-PRINCIPAL-ID
```

## Next steps

* [Configure your Azure Web app](../configure-web-app-settings.md)
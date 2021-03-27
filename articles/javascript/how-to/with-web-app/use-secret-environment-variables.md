---
title: Use Azure Key Vault secrets in Express.js app
description: Store secrets in Azure Key Vault, then pull in those secrets programmatically from Key Vault to the Express.js app. 
ms.topic: how-to
ms.date: 03/28/2021
ms.custom: seo-javascript-september2019, devx-track-js
#intent: Show a customer how to create a key vault resource, add a key, secret, and certificate, then use those in an Express.js app. 
---

# Use Azure Key Vault secrets in Express.js app

Store secrets in Azure Key Vault, then use those secrets programmatically from Key Vault in your Express.js app. 

* [Sample code](https://github.com/Azure-Samples/js-e2e-express-mongodb/tree/keyvault)

## Prepare your development environment

1. Complete the [Express.js with Cosmos DB tutorial](../../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md). 
1. Keep your MongoDB connection string from that tutorial. This article shows you how to store and use it with Azure Key Vault. 
1. Make sure the following are installed on your local developer workstation:

    - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
    - Cosmos DB resource - created in 
    - [Node.js 10.1+ and npm](https://nodejs.org/en/download) - installed to your local machine.
    - [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash. If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## Log in to Azure CLI

In the Visual Studio Code integrated terminal, log in to the Azure CLI. This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription.

* [az Login](/cli/azure/reference-index#az_login)

```azurecli
az login
```

## Create an Azure resource group with Azure CLI
 
Create a resource group for your resources to add a Key Vault secret to your Express.js app.

* [az group create](/cli/azure/group#az_group_create)

```azurecli
az group create \
    --subscription REPLACE_WITH_YOUR_SUBSCRIPTION_NAME_OR_ID \
    --location eastus \
    --name REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
```

## Create a Key Vault resource with Azure CLI

Create a Key Vault resource in the resource group, such as `joansmith-demo-secrets-app-resource-group`.

* [az keyvault create](/cli/azure/keyvault#az_keyvault_create)

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

The service principal allows you to create and use resources without having to use or expose your personal user account. The service principal is stored as an App Registration in Azure Active Directory. This sample uses the DefaultAzureCredential, which requires authentication setup. One example of setting up the credential is to create and use a service principal.

* [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac)

1. Create a service principal. 

    ```azurecli
    az ad sp create-for-rbac \
    --name REPLACE-WITH-YOUR-NEW-APP-LOGICAL-NAME
    --skip-assignment 
    ```

    An example app logical name is `demo-keyvault-service-principal-YOUR-NAME`, where `YOUR-NAME` is postpended to the string. When you look for this resource in the Azure portal, it will be part of your subscription's Active Directory app registrations. 

1. Capture and save the service principal output results of the command to use later.
 
    ```json
    {
        "appId": "YOUR-SERVICE-PRINCIPAL-APP-ID",
        "displayName": "YOUR-NEW-APP-LOGICAL-NAME",
        "name": "http://YOUR-NEW-APP-LOGICAL-NAME",
        "password": "!@#$%",
        "tenant": "YOUR-TENANT-ID"
    }
    ```

## Give your service principal access to your key vault

Give your service principal access to your Key Vault with Azure CLI command. The value for `YOUR-SERVICE-PRINCIPAL-APP-ID` is your service principal output's `appId` value. 

* [az keyvault set-policy](/cli/azure/keyvault#az_keyvault_set_policy)

```azurecli
az keyvault set-policy \
--subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
--name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
--spn REPLACE-WITH-YOUR-SERVICE-PRINCIPAL-APP-ID \
--secret-permissions get list
```

This service principal will only be able to list all secrets or get a specific secret.

## Store your secret environment variable in Key Vault resource

Add your MongoDB connection string, created in the [prior tutorial](../../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md), as a secret named `DATABASEURL` to your key vault.

```azurecli
az keyvault secret set \
--subscription REPLACE-WITH-YOUR-SUBSCRIPTION-NAME-OR-ID \
--vault-name "REPLACE-WITH-YOUR-KEY-VAULT-NAME" \
--name "DATABASEURL" \
--value YOUR-COSMOS-DB-MONGODB-CONNECTION-STRING
```

> [!NOTE]
> `DATABASEURL`, as a secret name, is not a keyword. You could choose any name to identify the secret. Just use that name consistently in the remaining instructions. 

## Download sample Express.js mongoDB repo 

Using git, clone the Express.js sample repo branch `keyvault` to your local computer, then install dependencies and open the project in Visual Studio Code. 

```bash
git clone -b keyvault https://github.com/Azure-Samples/js-e2e-express-mongodb.git && \
cd js-e2e-express-mongodb && \
npm install && \
code .
```

## Configure Express.js required environment variables to use Azure Identity

Set these environment variables in the `.env` file of the sample project to create the REQUIRED context to use DefaultAzureCredential.

* `AZURE_TENANT_ID`: The `tenant` from the service principal output above.
* `AZURE_CLIENT_ID`: The `appId` from the service principal output above.
* `AZURE_CLIENT_SECRET`: The `password` from the service principal output above.

When you deploy the application to Azure app service, you will also need to add these settings to your web app. 

> [!NOTE]
> These variables names are keywords and must be uses as-is, without changes, in order for Azure Identity to work successfully.

## Configure Express.js required environment variables to use Azure Key Vault

Set these environment variables in the `.env` file of the sample project to programmatically determine which Key Vault resource and secret to use.

* `KEY_VAULT_NAME`: Same value as `REPLACE-WITH-YOUR-KEY-VAULT-NAME` used in previous commands.
* `KEY_VAULT_SECRET_NAME_DATABASEURL`: The `appId` from the service principal output above.
* `AZURE_CLIENT_SECRET`: The `password` from the service principal output above.

When you deploy the application to Azure app service, you will also need to add these settings to your web app. 

> [!NOTE]
> These variable names are sample-specific. You can change them but make sure to change them in the environment file, the source code file, and your deployed web app settings. 

## Run the program 

1. Run the Express.js app with the following command:

    ```bash
    npm start
    ```

1. Open the Express.js app in the browser: `http://localhost:8080`.
1. You may have names and jobs from the previous tutorial. Interact with the app, adding names and jobs, deleting individual names and jobs, or deleting all names and jobs. 

    :::image type="content" source="../../media/key-vault/use-expressjs-with-key-vault-to-use-cosmos-db-connection.png" alt-text="Run and view Express.js app accessing your Key Vault resource to get the Cosmos DB connection string, then use the connection string to access the MongoDB database.":::

## Understand the sample application Key Vault code

The sample code uses the following Azure SDKs:

* [@azure/identity](https://www.npmjs.com/package/@azure/identity) - uses DefaultAzureCredential and your service principal to access resources on Azure.
* [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets) - used to manage Key Vault secrets.

### Get secret from Key Vault with JavaScript

After you ensure your DefaultAzureCredential is correctly configured, as shown in this article, you can use the DefaultAzureCredential to access your Key Vault secrets with JavaScript. 

1. The following `azure-keyvault.js` file gets the secret from your key vault.

    :::code language="javascript" source="~/../js-e2e-express-mongodb-keyvault/src/azure/azure-keyvault.js" range="76-113" highlight="91,98,101":::

1. The following `data.js` file code pulls in the dependency for the key vault secret function, `getSecret`, and initializes the configuration object.

    :::code language="javascript" source="~/../js-e2e-express-mongodb-keyvault/src/data.js" range="7-8":::

1. The following `data.js` file code shows the `getConnection` function to get environment variables and call `getSecret` from `azure-keyvault.js`.

    :::code language="javascript" source="~/../js-e2e-express-mongodb-keyvault/src/data.js" range="15-43" highlight="25":::

1. The following `data.js` file code calls the `getConnection` function, then returns the function to the Express.js `server.js` file. 
    
    :::code language="javascript" source="~/../js-e2e-express-mongodb-keyvault/src/data.js" range="96-112" highlight="99":::

## Clean up resources - remove resource group

Once you have completed this tutorial, you need to remove the resource group. 

* [az group delete](/cli/azure/group#az_group_delete)

```azurecli
az group delete \
--name REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME  -y
```

This command may take a few minutes. 

## Clean up resources - remove service principal

Delete your service principal. 

* [az group delete](/cli/azure/ad/sp#az_ad_sp_delete)

```azurecli
az ad sp delete \
--id REPLACE-WITH-YOUR-SERVICE-PRINCIPAL-APP-ID
```

## Next steps

* [Configure your Azure Web app](../how-to/configure-web-app-settings.md)
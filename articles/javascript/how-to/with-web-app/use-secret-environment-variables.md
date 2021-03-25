---
title: Use Azure Key Vault secrets in Express.js app
description: Store secrets in Azure Key Vault, then pull in those secrets programmatically from Key Vault to the Express.js app. 
ms.topic: how-to
ms.date: 03/24/2021
ms.custom: seo-javascript-september2019, devx-track-js
#intent: Show a customer how to create a key vault resource, add a key, secret, and certificate, then use those in an Express.js app. 
---

# Use Azure Key Vault secrets in Express.js app

Store secrets in Azure Key Vault, then pull in those secrets programmatically from Key Vault to the Express.js app. 

## Prepare your development environment

Make sure the following are installed on your local developer workstation:
* - [Node.js 10.1+ and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code (installed from within VS Code).
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash 
   [![Embed launch](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png "Launch Azure Cloud Shell")](https://shell.azure.com)   
- If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## Download sample Express.js repo 

Using git, clone the Express.js sample repo to your local computer. 

```bash
git clone https://github.com/Azure-Samples/js-e2e-express-server && \
    cd js-e2e-express-server && \
    npm install && \
    code .
```

## Create a Key Vault resource

Create the Key Vault resource with Azure CLI commands.


1. In the Visual Studio Code integrated terminal, log in to the Azure CLI. This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription.

    ```azurecli
    az login
    ```
 
1. Create a resource group for your resources. 

    ```azurecli
    az group create \
        --subscription REPLACE_WITH_YOUR_SUBSCRIPTION_NAME_OR_ID \
        --location eastus \
        --name REPLACE_WITH_YOUR_RESOURCE_GROUP_NAME
    ```

1. Create a Key Vault resource in the resource group.

    ```azurecli
    az keyvault create \
        --subscription REPLACE_WITH_YOUR_SUBSCRIPTION_NAME_OR_ID \
        --resource-group joansmith-demo-secrets-app-resource-group \
        --name REPLACE_WITH_YOUR_KEY_VAULT_NAME
    ```

    Your Azure account is the only one authorized to perform any operations on this new vault.. Make note of the output contains values for: 
    * Vault Name: The name you provided to the --name parameter above.
    * Vault URI: In the example, this is    `https://<your-unique-keyvault-name>.vault.azure.net/`. 



1. Use the command to get the key values for the new Speech resource. 

    ```azurecli
    az cognitiveservices account keys list \
        --name tutorial-speech \
        --resource-group tutorial-resource-group-eastus \
        --output table
    ```

1. Copy one of the keys. 

    You use the key in the web form to authenticate to the Azure Speech service.

## Store secret environment variable in Key Vault resource

## Grant access to Key Vault

## Add programmatic access to Key Vault from Express.js app

## Clean up resources

## Next steps
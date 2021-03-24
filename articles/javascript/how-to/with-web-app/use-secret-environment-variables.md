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

1. Using git, clone the Express.js sample repo to your local computer. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-server
    ```

1. Change to the new directory for the sample.

    ```bash
    cd js-e2e-express-server
    ```

1. Open the project in Visual Studio Code.

    ```bash
    code .
    ```

1. Open a new terminal in Visual Studio Code and install the project dependencies.

    ```bash
    npm install
    ```

## Create a Azure Resource group



## Create a Key Vault resource

Create the Speech resource with Azure CLI commands in an Azure Cloud Shell.


1. Log in to the [Azure Cloud Shell](https://shell.azure.com). This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription. 
1. Create a resource group for your Speech resource. 

    ```azurecli
    az group create \
        --location eastus \
        --name tutorial-resource-group-eastus
    ```

1. Create a Speech resource in the resource group.

    ```azurecli
    az cognitiveservices account create \
        --kind SpeechServices \
        --location eastus \
        --name tutorial-speech \
        --resource-group tutorial-resource-group-eastus \
        --sku F0
    ```

    This command will fail if your only free Speech resource has already been created. 

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
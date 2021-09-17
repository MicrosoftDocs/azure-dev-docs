---
title: Create the Azure App Service from the Azure CLI to host the app
description: Tutorial part 3, Azure CLI create the App Service
ms.topic: tutorial
ms.date: 08/16/2021
ms.custom: devx-track-js, devx-track-azurecli
# Verified full run: diberry 08/16/2021
---

# 3. Create the App Service

In this step, you use the Azure CLI to create the Azure App Service to host your app code.

<a name="create-resource-group"></a>

## Set your default subscription

In this optional step, if you have more than one subscription, you should set the default subscription, which will be used for the remaining Azure CLI commands. 

```azurecli
az account set --subscription XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

## Create a resource group and set as default value

1. At a terminal or command prompt, use the following command to create a **resource group** for the App Service. A resource group is a named collection of an app's resources such as a website, a database, and file storage.

    ```azurecli
    az group create --name my-ResourceGroup --location westus
    ```

    The Azure CLI command, [`az group create`](/cli/azure/group#az_group_create) above creates a resource group called `myResourceGroup` in the `westus` data center. You can change these values as desired.

    Once the command runs successfully, it displays JSON output with the details of the resource group.

1. Run the following Azure CLI command, [`az config`](/cli/azure/config), to set the default resource group and region for subsequent commands. Doing so avoids the need to specify these values each time. (This command has no output on success.)

    ```azurecli
    az config set defaults.group=myResourceGroup defaults.location=westus
    ```

## Create and deploy web app service with Azure CLI command

Run the following Azure CLI command,  [`az webapp up`](/cli/azure/webapp#az_webapp_up), to create and deploy the App Service app. Replace `<your_app_name>` with a unique name that becomes the URL, `http://<your_app_name>.azurewebsites.net`. 

```azurecli
az webapp up --name <your_app_name> --logs --launch-browser
```

This command may take a few minutes to complete. The `--logs` command displays the log stream immediately after launching the webapp. The `--launch-browser` command opens the default browser to the new app. You can use the same command to redeploy the entire app again. 

## Troubleshooting

* If you received an error about a missing but required parameter, `--resource-group`, return to the top of the article and set the defaults or provide the parameter and value. 

## Next steps

* [Deploy with Git push](tutorial-vscode-azure-cli-node-04.md) 

Learn more commands for your webapp with either the Azure [webapp](/cli/azure/webapp) command group or the Azure [App service](/cli/azure/appservice) command group. 

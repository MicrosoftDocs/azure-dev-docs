---
title: Web app automation tasks with Azure CLI
description: Automating Azure tasks is a common requirement for continuous deployment to hosting environments. Azure CLI is the recommended choice for JavaScript developers managing tasks and deploying from any location.
ms.topic: how-to
ms.date: 12/08/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# Automate tasks with Azure CLI

Automating Azure tasks is a common requirement for continuous deployment to hosting environments. [Azure CLI](/cli/azure/) is the recommended choice for JavaScript developers managing tasks and deploying from any location.

Learn common task commands for JavaScript developers. 

## Automation with Azure CLI

To automate the Azure CLI, the CLI must be installed in the environment. Common methods are: 

* [Installing Azure CLI locally](/cli/azure/install-azure-cli)
* [Running commands from Docker container](/cli/azure/run-azure-cli-docker)

## Using the example commands 

1. Replace variables in brackets, `<...>`, with your own values. 
1. Your GitHub repository value for `<MY_GITHUB_DEFAULT_BRANCH_NAME>` is specific to the repo used. Currently, the typical values are `main`, or `default`. Older repositories may use `master`. 

<a name="log-in-for-automated-tasks-with-azure-cli"></a>

## Authentication with managed identity for automated tasks with Azure CLI

For automation, authentication with [az login](/cli/azure/reference-index#az_login) to the Azure CLI with [managed identity](/cli/azure/authenticate-azure-cli#sign-in-with-a-managed-identity).

```azurecli
az login --identity
```

## Authentication with service principal for automated tasks with Azure CLI

After [the Service Principal is created](../core/nodejs-sdk-azure-authenticate.md), [login with a user's Service Principal](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal).

```bash
read -sp "Azure password: " AZ_PASS && echo && \ 
    az login --service-principal \
    -u <MY-SP-APP-URL> \
    -p $AZ_PASS \
    --tenant <MY-TENANT>
```
## Authentication with user credentials for automated tasks with Azure CLI

Use the following command to authenticate [with User credentials](/cli/azure/authenticate-azure-cli#sign-in-with-credentials-on-the-command-line).

```azurecli
az login -u <MY_AZURE_USERNAME> -p <MY_AZURE_PASSWORD>
```    

## Create resource group for resources

A resource group is a logical collection of your Azure resources. The logical grouping is based on services you need in a specific region for a project. Learn about [naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming). Use the [az group create](/cli/azure/group#az_group_create) command to create your resource group before you create Azure service resources. 

```azurecli
az group create \
    --name <MY-AZURE-RESOURCE_GROUP_NAME> \
    --location <AZURE_REGION_LOCATION>
```

## Create Azure Static web app 

Use the [az staticwebapp create](/cli/azure/staticwebapp#az_staticwebapp_create) command to create a new [static web app](/azure/static-web-apps/overview).

```azurecli
az staticwebapp create \
    --name <MY_AZURE_WEB_APP_NAME> \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
    --source https://github.com/<MY_GITHUB_ACCOUNT_NAME>/<MY_AZURE_WEB_APP_NAME> \
    --location <AZURE_REGION_LOCATION> \
    --branch <MY_GITHUB_DEFAULT_BRANCH_NAME> \
    --app-artifact-location "<MY_WEB_APP_BUILD_DIRECTORY_NAME>" \
    --token <MY_GITHUB_PERSONAL_ACCESS_TOKEN>
```

## Deploy Azure Static web app 

To deploy your app, push to the remote GitHub branch set during resource creation in the previous set. 

```bash
git push <REMOTE_NAME> <MY_GITHUB_DEFAULT_BRANCH_NAME>
```

An example of this command is:

```bash
git push origin main
```

### Delete static web app 

Use the [az staticwebapp delete](/cli/azure/staticwebapp#az_staticwebapp_delete) command to delete your static web app.

```azurecli
az staticwebapp delete && \
    --name <MY_AZURE_WEB_APP_NAME> && \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME>
```

## Create Azure Function app

A consumption-based function app needs both the function app and a storage resource. 

1. Create the storage resource with [az storage account create](/cli/azure/storage/account#az_storage_account_create):

    ```azurecli
    az storage account create \
      --name <MY-AZURE-STORAGE> \
      --location <AZURE_REGION_LOCATION> \
      --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
      --sku Standard_LRS    
    ```

1. Create the function app resource with [az functionapp create](/cli/azure/functionapp#az_functionapp_create): 

    ```azurecli
    az functionapp create \
      --name <MY-AZURE-FUNCTION> \
      --storage-account <MY-AZURE-STORAGE> \
      --consumption-plan-location <AZURE_REGION_LOCATION> \
      --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
      --functions-version 2
    ```

## Create Azure Function API endpoint

There isn't an Azure CLI command to create an Azure Function API endpoint for your **local** development project. The [Visual Studio Code Azure Function extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) is the recommended way to create a local Azure Function project and add API endpoints to the project. 

## Create Azure Function deployment slot 

Creating a deployment slot then swapping allows you to quickly revert a deployment. Create a deployment slow with the [az functionapp deployment slot create](/cli/azure/functionapp/deployment/slot?view=azure-cli-latest#az_functionapp_deployment_slot_create) command.

```azurecli
az functionapp deployment slot create \
    --name <MY-AZURE-FUNCTION> \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
    --slot <MY-SLOT-NAME> \
    --configuration-source <MY-PRODUCTION-SLOT> 
```

## Deploy Azure Function from git

Manage deployment from git or Mercurial repositories with [az functionapp deployment source config](/cli/azure/functionapp/deployment/source#az_functionapp_deployment_source_config). Select one repository type for the `--repository-type` setting from the choices: externalgit, git, github, localgit, mercurial.

```azurecli
az functionapp deployment source config --repo-url \
    --branch <MY-REPO-BRANCH> \
    --git-token <MY-GIT-TOKEN> \
    --name <MY-AZURE-FUNCTION> \
    --repository-type <MY-REPO-TYPE> \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
    --slot <MY-SLOT-NAME> \
```

## Swap Azure Function slots

Use the [az functionapp deployment slot swap](/cli/azure/functionapp/deployment/slot#az_functionapp_deployment_slot_swap) command to swap slots. Slot action choices are: preview, reset, swap

```azurecli
az functionapp deployment slot swap \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
    --name <MY-AZURE-FUNCTION> \
    --slot <MY-SLOT-NAME> \
    --action <YOUR-ACTION> \
    --target-slot <MY-OTHER-SLOT-NAME>
```

## Delete Azure Function

Use the [az functionapp delete] command to delete your function app. 

```azurecli
az functionapp delete \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME> \
    --name <MY-AZURE-FUNCTION> 
```

## Next steps

* [Tutorial: Build and deploy a Static Web app to Azure](../tutorial/static-web-app/introduction.md)

---
title: Web app automation tasks with Azure CLI
description: Automating Azure tasks is a common requirement for continuous deployment to hosting environments. Azure CLI is the recommended choice for JavaScript developers managing tasks and deploying from any location.
ms.topic: conceptual
ms.date: 12/16/2020
ms.custom: devx-track-js
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

## Log in for automated tasks with Azure CLI

Once the Azure CLI is installed, you must log in to continue running Azure CLI commands. For automation, you can authentication to the Azure CLI.

Reference documentation: [az login command](/cli/azure/reference-index?view=azure-cli-latest#az-login)

[Managed identity](/cli/azure/authenticate-azure-cli#sign-in-with-a-managed-identity) is the recommended choice for authentication.

```azurecli
az login --identity
```

[Login with a user's Service Principal](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal), after [the Service Principal is created](../core/node-sdk-azure-authenticate-principal#create-a-service-principal-using-the-azure-cli-20). 

```dotnetcli
read -sp "Azure password: " AZ_PASS && echo && \ 
    az login --service-principal \
    -u <MY-SP-APP-URL> \
    -p $AZ_PASS \
    --tenant <MY-TENANT>
```


* [With User credentials: username and password](/cli/azure/authenticate-azure-cli#sign-in-with-credentials-on-the-command-line)

## Create resource group for resources

A resource group is a logical collection of your Azure resources. The logical grouping is based on services you need in a specific region for a project. Learn about [naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming).

```azurecli
az group create \
    --name <MY-AZURE-RESOURCE_GROUP_NAME> \
    --location <AZURE_REGION_LOCATION>
```

## Static web apps with Azure CLI

A static web app contains code for:

* a Front-end application contained in a GitHub repository
* optionally, an existing Azure Functions API in the `/API` directory [learn more](/azure/static-web-apps/add-api#create-the-api)

The app can use Azure functions for serverless APIs, but that isn't a requirement for static web apps. 

Reference documentation: [az staticwebapp](/cli/azure/staticwebapp?view=azure-cli-latest)

### Create Azure Static web app 

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

### Deploy Azure Static web app 

To deploy your app, push to the remote and branch set during resource creation in the previous set, with Git. 

```bash
git push <REMOTE_NAME> <MY_GITHUB_DEFAULT_BRANCH_NAME>
```

An example of this command is:

```bash
git push origin main
```

### Delete static web app 

```azurecli
az staticwebapp delete && \
    --name <MY_AZURE_WEB_APP_NAME> && \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME>
```

## Next steps

* [Tutorial: Build and deploy a Static Web app to Azure](../tutorial/static-web-app/introduction.md)

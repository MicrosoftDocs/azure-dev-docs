---
title: Automate tasks with Azure CLI
description: 
ms.topic: conceptual
ms.date: 12/16/2020
ms.custom: devx-track-js
---

# Automate tasks with Azure CLI

Automating Azure tasks is a common requirement for continuous deployment to hosting environments. [Azure CLI](/cli/azure/) is the recommended choice for JavaScript developers managing tasks and deploying from any location.

Learn common task commands for JavaScript developers. 

## Automation with Azure CLi

To automate the Azure CLI, the CLI must be installed in the environment. Common methods are: 

* [Installing Azure CLI locally](/cli/azure/install-azure-cli)
* [Running commands from Docker container](/cli/azure/run-azure-cli-docker)

## Using the example commands 

1. Replace variables in brackes, `<...>`, with your own values. 
1. Your GitHub repository value for `<MY_GITHUB_DEFAULT_BRANCH_NAME>` is specific to the repo used. Currently, the typical values are `main`, or `default`. Older repositories may use `master`. 

## Login for automated tasks with Azure CLI

Once the Azure CLI is installed, you must login to continue running Azure CLI commands. For automation, you can authentication to the Azure CLI.

Reference documentation: [az login command](/cli/azure/reference-index?view=azure-cli-latest#az-login)

[Managed identity](/cli/azure/authenticate-azure-cli#sign-in-with-a-managed-identity) is the recommended choice for authenication.

```azurecli
az login --identity
```

[Login with a user's Service Principal](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal), after [the Service Principal is created](../core/node-sdk-azure-authenticate-principal#create-a-service-principal-using-the-azure-cli-20). 

```dotnetcli
read -sp "Azure password: " AZ_PASS && echo && \ 
    az login --service-principal && \
    -u <MY-SP-APP-URL> && \
    -p $AZ_PASS && \
    --tenant <MY-TENANT>
```


* [With User credentials: username and password](/cli/azure/authenticate-azure-cli#sign-in-with-credentials-on-the-command-line)

## Static web apps with Azure CLI

A static web app contains a front-end application contained in a GitHub repository. The app can use Azure functions for serverless APIs, but that isn't a requirement for static web apps. 

Reference documentation: [az staticwebapp](/cli/azure/staticwebapp?view=azure-cli-latest)

### Create static web app - front-end only

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

### Delete static web app - front-end only

```azurecli
az staticwebapp delete && \
    --name <MY_AZURE_WEB_APP_NAME> && \
    --resource-group <MY-AZURE-RESOURCE_GROUP_NAME>
```

## Function apps

## Web apps

## Virtual machines

## Next steps


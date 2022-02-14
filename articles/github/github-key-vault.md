---
title: Quickstart -  Use Azure Key Vault secrets in GitHub Actions workflows
description: Use Key Vault secrets in GitHub Actions to automate your software development workflows
author: juliakm
ms.custom: github-actions-azure, mode-portal, contperf-fy22q3
ms.author: jukullam
ms.date: 02/03/2022
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
---

# Use Key Vault secrets in GitHub Actions workflows

Use Key Vault secrets in your [GitHub Actions](https://help.github.com/en/articles/about-github-actions) and securely store passwords and other secrets in an Azure Key Vault. Learn more about [Key Vault](/azure/key-vault/general/overview).

Key Vault secrets differ from GitHub secrets:

- Key Vault lets you centralize storage of application secrets in Azure. GitHub secrets are stored in GitHub
- Key Vault can be used as a key and certificate management solutions, in addition to a tool for secrets management
- Key Vault uses [Azure role-based access control (Azure RBAC)](/azure/key-vault/general/rbac-guide) for access

When you combine Key Vault and GitHub Actions, you have the benefits of a centralized secrets management tool and all the advantages of GitHub Actions. 

## Prerequisites 
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure App connected to a GitHub repository. This example uses [Deploy containers to Azure App Service](../javascript/tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md). 
- A Key Vault.  You can create a Key Vault using the [Azure portal](/azure/key-vault/secrets/quick-create-portal), [Azure CLI](/azure/key-vault/secrets/quick-create-cli), or [Azure PowerShell](/azure/key-vault/secrets/quick-create-powershell).

## Workflow file overview

The YAML workflow file includes two sections: 

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. <br /> 3. Add a role assignment. |
|**Key Vault** | 1. Add the key vault action. <br /> 2. Reference the key vault secret. |

Learn more about the [components of GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

## Define a service principal

You can create a [service principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
   az ad sp create-for-rbac --name {myApp} --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{MyResourceGroup} --sdk-auth
```

In the example above, replace the placeholders with your subscription ID and resource group name. Replace the placeholder `myApp` with the name of your application. The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to below. Copy this JSON object for later. You can shorten the JSON object to only include the lines with the `clientId`, `clientSecret`, `subscriptionId`, and `tenantId` values.

```output 
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

## Create a GitHub secret

Create secrets for your Azure credentials, resource group, and subscriptions. 

1. In [GitHub](https://github.com/), browse your repository.

1. Select **Settings > Secrets > New secret**.

1. Paste the JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`.

1. Copy the value of `clientId` to use later. 

## Add a role assignment 
 
Grant access to the Azure service principal so that you can access your key vault for `get` and `list` operations. If you don't do this, then you will not be able to use the service principal.

Replace `keyVaultName` with the name of your key vault and `clientIdGUID` with the value of your `clientId`. 

```azurecli-interactive
    az keyvault set-policy -n {keyVaultName} --secret-permissions get list --spn {clientIdGUID}
```

## Add the key vault action

With the [Azure Key Vault action](https://github.com/marketplace/actions/azure-key-vault-get-secrets), you can fetch one or more secrets from a key vault instance and consume it in your GitHub Action workflows.

Secrets fetched are set as outputs and also as environment variables. Variables are automatically masked when they are printed to the console or to logs.

```yaml
    - uses: Azure/get-keyvault-secrets@v1
      with:
        keyvault: "my Vault" # name of key vault in Azure portal
        secrets: 'mySecret'  # comma separated list of secret keys to fetch from key vault 
      id: myGetSecretAction # ID for secrets that you will reference
```

## Reference the key vault secret

To use a key vault in your workflow, you need both the key vault action and to reference that action. 

In this example, the key vault is named `containervault`. Two key vault secrets are added to the environment with the key vault action - `containerPassword` and `containerUsername`. 

The key vault values are later referenced in the docker login task with the prefix `steps.myGetSecretAction.outputs`. For example, the username value is referenced as `${{ steps.myGetSecretAction.outputs.containerUsername }}`. 

The syntax for referencing GitHub secret is different. In the checkout action, the `AZURE_CREDENTIALS` secret is referenced with `${{ secrets.AZURE_CREDENTIALS }}`.

```yaml
name: Example key vault flow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - uses: actions/checkout@v2
    - uses: Azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - uses: Azure/get-keyvault-secrets@v1
      with: 
        keyvault: "containervault"
        secrets: 'containerPassword, containerUsername'
      id: myGetSecretAction
    - uses: azure/docker-login@v1
      with:
        login-server: myregistry.azurecr.io
        username: ${{ steps.myGetSecretAction.outputs.containerUsername }}
        password: ${{ steps.myGetSecretAction.outputs.containerPassword }}
    - run: |
        docker build . -t myregistry.azurecr.io/myapp:${{ github.sha }}
        docker push myregistry.azurecr.io/myapp:${{ github.sha }}     
    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'myapp'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        images: 'myregistry.azurecr.io/myapp:${{ github.sha }}'
```

## Clean up resources

When your Azure app, GitHub repository, and key vault are no longer needed, clean up the resources you deployed by deleting the resource group for the app, GitHub repository, and key vault.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Key Vault](/azure/key-vault/general/overview)

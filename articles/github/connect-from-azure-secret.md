--- 
title: Authenticate to Azure from GitHub Actions by a secret
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login action with a client secret.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure Login action with a client secret

Learn how to create a service principal with a client secret and securely authenticate to Azure services from GitHub Actions workflows using [Azure Login action](https://github.com/marketplace/actions/azure-login). 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a GitHub secret for the service principal
> * Set up Azure Login for service principal secret in GitHub Actions workflows

> [!WARNING]
> Treat your client secrets with care to prevent leaks. Unauthorized disclosure can compromise security. Store secrets securely and share only with authorized ones.

## Prerequisites 

- Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
- Create a client secret for your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-2?branch=main#create-a-service-principal-containing-a-password), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?#password-based-authentication).
- Copy the values for **Client ID**, **Client Secret**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
- Assign an appropriate role to your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-5#create-or-remove-a-role-assignment), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#manage-service-principal-roles).

## Create a GitHub secret for the service principal

1. Open your GitHub repository and go to **Settings**.
    :::image type="content" source="media/github-repo-settings.png" alt-text="Select settings tab in GitHub repository.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
    :::image type="content" source="media/github-repo-secrets.png" alt-text="Select Security > Secrets and variables > Actions.":::

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create a GitHub Actions secret `AZURE_CREDENTIALS` in the following format. Copy these values from your service principal.

    ```json
      {
          "clientId": "<Client ID>",
          "clientSecret": "<Client Secret>",
          "subscriptionId": "<Subscription ID>",
          "tenantId": "<Tenant ID>"
      }
    ```

    |GitHub secret  |Service principal  |
    |---------|---------|
    |clientId |    Client ID    |
    |clientSecret    |    Client Secret   |
    |subscriptionId    |    Subscription ID     |
    |tenantId   |    Directory (tenant) ID  |

## Set up Azure Login action with the Service Principal secret in GitHub Actions workflows

To authenticate to Azure in GitHub Actions workflows using the service principal secret, you need to use the [Azure Login action](https://github.com/Azure/login).

### Use the Azure Login action with both Azure CLI action and Azure PowerShell action

In this workflow, you authenticate using the Azure Login action with the service principal details stored in `secrets.AZURE_CREDENTIALS`. For more information about referencing GitHub secrets in a workflow file, see [Using secrets in a workflow](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions#using-secrets-in-a-workflow) in GitHub Docs.

```yaml
name: Run Azure Login with the Service Principal secret
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Azure Login action
      uses: azure/login@v2
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
        enable-AzPSSession: true
    
    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
          az group show --name "<YOUR RESOURCE GROUP>"
          # You can write your Azure CLI inline scripts here.

    - name: Azure PowerShell action
      uses: azure/powershell@v2
      with:
        azPSVersion: latest
        inlineScript: |
          Get-AzResourceGroup -Name "<YOUR RESOURCE GROUP>"
          # You can write your Azure PowerShell inline scripts here.
```
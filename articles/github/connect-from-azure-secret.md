--- 
title: Authenticate to Azure from GitHub Action by Client Secret
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login Action with a client secret.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure Login Action with a client secret

Learn how to create a service principal with a client secret and securely authenticate to Azure services from GitHub Actions workflows using [Azure Login Action](https://github.com/marketplace/actions/azure-login). 

In this tutorial, you:

> [!div class="checklist"]
> * Create a GitHub secret for the service principal
> * Set up Azure Login for service principal secret in GitHub Action workflows

> [!WARNING]
> Treat your client secrets with care to prevent leaks. Unauthorized disclosure can compromise security. Store secrets securely and share only with authorized ones.

## Prerequisites 

- Create a Microsoft Entra application with a service principal assigned an appropriate role by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
- Create a client secret for your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-2?branch=main#create-a-service-principal-containing-a-password), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?#password-based-authentication).

## Create a GitHub secret for the service principal

1. Open your GitHub repository and go to **Settings**.
    :::image type="content" source="media/github-repo-settings.png" alt-text="Select settings tab in GitHub repository.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
    :::image type="content" source="media/github-repo-secrets.png" alt-text="Select Security > Secrets and variables > Actions.":::

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create a GitHub Action secret `AZURE_CREDENTIALS` in the following format. Copy these values from your service principal.

    ```json
      {
          "clientId": "<GUID>",
          "clientSecret": "<secret>",
          "subscriptionId": "<GUID>",
          "tenantId": "<GUID>",
          (...)
      }
    ```

    |GitHub secret  |Service principal  |
    |---------|---------|
    |clientId |    Client ID    |
    |clientSecret    |    Client Secret   |
    |subscriptionId    |    Subscription ID     |
    |tenantId   |    Directory (tenant) ID  |

## Set up Azure Login in GitHub Action workflows

To authenticate to Azure in GitHub Action workflows using the service principal secret, you need to use the [Azure Login Action](https://github.com/Azure/login).

### Use the Azure Login Action with both Azure CLI Action and Azure PowerShell Action

In this workflow, you authenticate using the Azure Login Action with the service principal details stored in `secrets.AZURE_CREDENTIALS`. For more information about referencing GitHub secrets in a workflow file, see [Using secrets in a workflow](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions#using-secrets-in-a-workflow) in GitHub Docs.

```yaml
name: AzureLoginSample
on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Azure Login Action
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

      - name: Azure PowerShell Action
        uses: azure/powershell@v2
        with:
          azPSVersion: latest
          inlineScript: |
            Get-AzResourceGroup -Name "<YOUR RESOURCE GROUP>"
            # You can write your Azure PowerShell inline scripts here.
```
--- 
title: Authenticate to Azure from GitHub Action by OpenID Connect
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login Action with OpenID Connect (OIDC).
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with OpenID Connect

This article teaches you how to securely authenticate to Azure services from GitHub Actions workflows using [Azure Login Action](https://github.com/marketplace/actions/azure-login) with [OpenID Connect (OIDC)](https://www.microsoft.com/security/business/security-101/what-is-openid-connect-oidc). 

In this tutorial, you:

> [!div class="checklist"]
> * Create GitHub secrets for the credentials of a Microsoft Entra application/user-assigned managed identity
> * Set up Azure Login with OpenID Connect authentication in GitHub Action workflows

## Prerequisites

To use [Azure Login Action](https://github.com/marketplace/actions/azure-login) with OIDC, you need to configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity.

**Option 1: Microsoft Entra Application**

* Create a Microsoft Entra application with a service principal assigned an appropriate role by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1), or [Azure PowerShell](/entra/identity-platform/howto-authenticate-service-principal-powershell).
* [Configure a federated identity credential on a Microsoft Entra application](/entra/workload-id/workload-identity-federation-create-trust) to trust tokens issued by GitHub Actions to your GitHub repository. 

**Option 2: User-assigned managed identity**

* [Create a user-assigned managed identity assigned an appropriate role](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).
* [Configure a federated identity credential on a user-assigned managed identity](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) to trust tokens issued by GitHub Actions to your GitHub repository. 

## Create GitHub secrets

1. Open your GitHub repository and go to **Settings**.
::image type="content" source="media/github-repo-settings.png" alt-text="Select settings in GitHub repo.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
::image type="content" source="media/github-repo-secrets.png" alt-text="Select Secrets.":::

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Microsoft Entra application or User-Assigned Managed Identity for your GitHub secrets:

|GitHub secret  |Microsoft Entra application or User-assigned managed identity  |
|---------|---------|
|AZURE_CLIENT_ID    |    Client ID    |
|AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
|AZURE_TENANT_ID    |    Directory (tenant) ID  |

## Set up Azure Login with OpenID Connect authentication

Your GitHub Actions workflow uses OpenID Connect to authenticate with Azure.
To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).

In this example, you use OpenID Connect Azure CLI to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the login action.

The Azure login action includes an optional `audience` input parameter that defaults to `api://AzureADTokenExchange`. You can update this parameter for custom audience values.

### The workflow sample to only run Azure CLI

This workflow authenticates with OpenID Connect and uses Azure CLI to get the details of the connected subscription.

```yaml
name: Run Azure CLI Login with OpenID Connect
on: [push]

permissions:
  id-token: write
  contents: read
      
jobs: 
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: Production
    steps:
    - name: Azure CLI login
      uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
  
    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
          az account show
```

### The workflow sample to run both Azure CLI and Azure PowerShell

This workflow authenticates with OpenID Connect and uses both Azure CLI and Azure PowerShell to get the details of the connected subscription.

```yaml
name: Run Azure PowerShell Login with OpenID Connect
on: [push]

permissions:
  id-token: write
  contents: read
      
jobs: 
  Windows-latest:
    runs-on: windows-latest
    environment: Production
    steps:
      - name: Azure Login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }} 
          enable-AzPSSession: true
      
      - name: Azure CLI script
        uses: azure/cli@v2
        with:
          azcliversion: latest
          inlineScript: |
            az account show

      - name: Azure PowerShell script
        uses: azure/powershell@v2
        with:
          azPSVersion: latest
          inlineScript: |
            Get-AzContext     
```
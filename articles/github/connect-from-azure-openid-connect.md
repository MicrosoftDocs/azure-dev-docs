--- 
title: Authenticate to Azure from GitHub Actions by OpenID Connect
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login action with OpenID Connect (OIDC).
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure Login action with OpenID Connect

Learn how to securely authenticate to Azure services from GitHub Actions workflows using [Azure Login action](https://github.com/marketplace/actions/azure-login) with [OpenID Connect (OIDC)](https://www.microsoft.com/security/business/security-101/what-is-openid-connect-oidc). 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create GitHub secrets for the credentials of a Microsoft Entra application/user-assigned managed identity
> * Set up Azure Login with OpenID Connect authentication in GitHub Actions workflows

## Prerequisites

To use [Azure Login action](https://github.com/marketplace/actions/azure-login) with OIDC, you need to configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity.

**Option 1: Microsoft Entra application**

* Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
*  Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
* Assign an appropriate role to your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-5#create-or-remove-a-role-assignment), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#manage-service-principal-roles).
* [Configure a federated identity credential on a Microsoft Entra application](/entra/workload-id/workload-identity-federation-create-trust) to trust tokens issued by GitHub Actions to your GitHub repository. 

**Option 2: User-assigned managed identity**

* [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).
*  Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
* [Assign an appropriate role to your user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#manage-access-to-user-assigned-managed-identities).
* [Configure a federated identity credential on a user-assigned managed identity](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) to trust tokens issued by GitHub Actions to your GitHub repository. 

## Create GitHub secrets

1. Open your GitHub repository and go to **Settings**.
    :::image type="content" source="media/github-repo-settings.png" alt-text="Select settings tab in GitHub repository.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
    :::image type="content" source="media/github-repo-secrets.png" alt-text="Select Security > Secrets and variables > Actions.":::

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Copy these values from your Microsoft Entra application or user-assigned managed identity for your GitHub secrets:

    |GitHub secret  |Microsoft Entra application or user-assigned managed identity  |
    |---------|---------|
    |AZURE_CLIENT_ID    |    Client ID    |
    |AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
    |AZURE_TENANT_ID    |    Directory (tenant) ID  |

    > [!NOTE]
    > For security reasons, we recommend using GitHub Secrets rather than passing values directly to the workflow.

## Set up Azure Login action with OpenID Connect in GitHub Actions workflows

Your GitHub Actions workflow uses OpenID Connect to authenticate with Azure. Once you have a working Azure Login step, you can use the [Azure PowerShell action](https://github.com/Azure/PowerShell) or [Azure CLI action](https://github.com/Azure/CLI). You can also use other Azure actions, like [Azure webapp deploy](https://github.com/Azure/webapps-deploy) and [Azure functions](https://github.com/Azure/functions-action).

To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).

In this example, you use OpenID Connect to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets stored before for the `client-id`, `tenant-id`, and `subscription-id` values. 

The Azure Login action includes an optional `audience` input parameter that defaults to `api://AzureADTokenExchange`, available for public clouds. For non-public clouds, update this parameter with the appropriate values. You can also customize this parameter for specific audience values.

### The workflow sample to only run Azure CLI

This workflow authenticates with OpenID Connect and uses Azure CLI to get the details of the connected subscription.

```yaml
name: Run Azure CLI Login with OpenID Connect
on: [push]

permissions:
  id-token: write # Require write permission to Fetch an OIDC token.
  contents: read  # This is required for actions/checkout
      
jobs: 
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Azure CLI Login
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
          # You can write your Azure CLI inline scripts here.
```

### The workflow sample to run both Azure CLI and Azure PowerShell

This workflow authenticates with OpenID Connect and uses both Azure CLI and Azure PowerShell to get the details of the connected subscription.

```yaml
name: Run Azure Login with OpenID Connect
on: [push]

permissions:
  id-token: write # Require write permission to Fetch an OIDC token.
      
jobs: 
  test:
    runs-on: ubuntu-latest
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
          # You can write your Azure CLI inline scripts here.

    - name: Azure PowerShell script
      uses: azure/powershell@v2
      with:
        azPSVersion: latest
        inlineScript: |
          Get-AzContext  
          # You can write your Azure PowerShell inline scripts here.
```


### Connect to Azure Government clouds and Azure Stack Hub clouds

To log in to one of the Azure Government clouds or Azure Stack, set the parameter `environment` to one of the following supported values: `AzureUSGovernment`, `AzureChinaCloud`, `AzureGermanCloud`, or `AzureStack`. If this parameter isn't specified, it takes the default value `AzureCloud` and connects to the Azure Public Cloud.

```yaml  
jobs: 
  test:
    permissions:
      id-token: write # Require write permission to Fetch an OIDC token.
    runs-on: ubuntu-latest
    steps:
    - name: Login to Azure US Gov Cloud with both Azure CLI and Azure Powershell
      uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          environment: 'AzureUSGovernment'
          audience: api://AzureADTokenExchangeUSGov
          enable-AzPSSession: true
```

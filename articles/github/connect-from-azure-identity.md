--- 
title:  Authenticate to Azure from GitHub by a managed identity
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login action with a managed identity configured on a virtual machine.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure Login action with a managed identity

On a virtual machine configured with [managed identities](/entra/identity/managed-identities-azure-resources/overview) in Azure, you can sign in [Azure Login action](https://github.com/marketplace/actions/azure-login) using the managed identity. You don't need to manage credentials, as they aren't accessible to you. There are two types of managed identities for you to choose: [**system-assigned managed identities**](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#system-assigned-managed-identity) or [**user-assigned managed identities**](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#user-assigned-managed-identity).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create GitHub secrets for system/user-assigned managed identity
> * Set up Azure Login for system/user-assigned managed identity in GitHub Actions workflows

> [!NOTE]
>
> Login with managed identity is only supported for self-hosted runners on Azure virtual machines. For other users, please refer to [Sign in with OpenID Connect](connect-from-azure-oidc.md) or [Sign in with a service principal and secret](connect-from-azure-secret.md). 

## Prerequisites

- Create an Azure virtual machine
  - [Create a Windows virtual machine](/azure/virtual-machines/windows/quick-create-portal)
  - [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)
- [Configure managed identity on the Azure virtual machine](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm)
- Install required software on the Azure virtual machine
  - [Install Azure CLI](/cli/azure/install-azure-cli)
  - [install Docker](https://docs.docker.com/engine/install/)
  - [Install PowerShell](/powershell/scripting/install/installing-powershell)
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Configure the Azure virtual machine as a GitHub self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners)


## Use the Azure Login action with system-assigned managed identity

Learn how to securely authenticate to Azure services from GitHub Actions workflows using [Azure Login action](https://github.com/marketplace/actions/azure-login) with [system-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#system-assigned-managed-identity) that configured on a virtual machine. 

### Create GitHub secrets for system-assigned managed identity

1. Open your GitHub repository and go to **Settings**.
    :::image type="content" source="media/github-repo-settings.png" alt-text="Select settings tab in GitHub repository.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
    :::image type="content" source="media/github-repo-secrets.png" alt-text="Select Security > Secrets and variables > Actions.":::

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create secrets for `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Copy these values from your user-assigned managed identity for your GitHub secrets:

    |GitHub secret  |System-assigned managed identity  |
    |---------|---------|
    |AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
    |AZURE_TENANT_ID    |    Directory (tenant) ID  |

    > [!NOTE]
    > For security reasons, we recommend using GitHub Secrets rather than passing values directly to the workflow.

### Set up Azure Login action with system-assigned managed identity in GitHub Actions workflows

In this example, you use the system-assigned managed identity to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `subscription-id`, and `tenant-id` values. The self-hosted runner has been labeled `self-hosted` on GitHub.


```yaml
name: Run Azure Login with system-assigned managed identity
on: [push]

jobs:
  test:
    runs-on: [self-hosted] # Specify the label of your self-hosted runner here
    steps:
    - name: Azure login
      uses: azure/login@v2
      with:
        auth-type: IDENTITY
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
        enable-AzPSSession: true

    # Azure CLI action only supports linux self-hosted runners for now.
    # If you want to execute the Azure CLI script on a windows self-hosted runner, you can execute it directly in `run`.
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

## Use the Azure Login action with user-assigned managed identity

Learn how to securely authenticate to Azure services from GitHub Actions workflows using [Azure Login action](https://github.com/marketplace/actions/azure-login) with [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#user-assigned-managed-identity) that configured on a virtual machine. 

### Create GitHub secrets for user-assigned managed identity

1. Open your GitHub repository and go to **Settings**.
    :::image type="content" source="media/github-repo-settings.png" alt-text="Select settings tab in GitHub repository.":::


1. Select **Security > Secrets and variables > Actions > New repository secret**.
    :::image type="content" source="media/github-repo-secrets.png" alt-text="Select Security > Secrets and variables > Actions.":::

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Copy these values from your user-assigned managed identity for your GitHub secrets:

    |GitHub secret  |User-assigned managed identity  |
    |---------|---------|
    |AZURE_CLIENT_ID     |    Client ID     |
    |AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
    |AZURE_TENANT_ID    |    Directory (tenant) ID   |

    > [!NOTE]
    > For security reasons, we recommend using GitHub Secrets rather than passing values directly to the workflow.

### Set up Azure Login action with user-assigned managed identity in GitHub Actions workflows

In this example, you use the user-assigned managed identity to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `client-id`, `subscription-id`, and `tenant-id` values. The self-hosted runner has been labeled `self-hosted` on GitHub.

```yaml
name: Run Azure Login with user-assigned managed identity
on: [push]

jobs:
  test:
    runs-on: [self-hosted] # Specify the label of your self-hosted runner here
    steps:
    - name: Azure login
      uses: azure/login@v2
      with:
        auth-type: IDENTITY
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
        enable-AzPSSession: true

    # Azure CLI action only supports linux self-hosted runners for now.
    # If you want to execute the Azure CLI script on a windows self-hosted runner, you can execute it directly in `run`.
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
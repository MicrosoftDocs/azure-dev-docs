--- 
title:  Authenticate to Azure from GitHub by Managed Identity
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login Action with a Managed Identity configured on a virtual machine.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with Managed Identity

On a virtual machine configured for [managed identities](/entra/identity/managed-identities-azure-resources/overview) in Azure, you can sign in [Azure login](https://github.com/marketplace/actions/azure-login) using the managed identity. There's no need to manage credentials, as they aren't accessible to you. You can use two types of managed identities: [**System-assigned**](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#system-assigned-managed-identity) or [**User-assigned**](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities#user-assigned-managed-identity).

In this tutorial, you:

> [!div class="checklist"]
> * Create GitHub secrets for System/User-Assigned Managed Identity
> * Set up Azure Login for System/User-Assigned Managed Identity in GitHub Action workflows

> [!NOTE]
>
> "Login With Managed Identity" is only supported on GitHub self-hosted runners and the self-hosted runners need to be hosted by Azure virtual machines.

## Prerequisites

- Create an Azure virtual machine
  - [Create a Windows virtual machine](/azure/virtual-machines/windows/quick-create-portal)
  - [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)
- [Configure managed identity on the Azure virtual machine](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm)
- Install required software on the Azure virtual machine
  - [Install Azure CLI](/cli/azure/install-azure-cli)
    - To run the [Azure CLI Action](https://github.com/Azure/CLI), you don't need to preinstall the Azure CLI. However, you must [install Docker](https://docs.docker.com/engine/install/).
  - [Install PowerShell](/powershell/scripting/install/installing-powershell)
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Configure the Azure virtual machine as a GitHub self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners)


## Create GitHub secrets for System-Assigned Managed Identity

1. Open your GitHub repository and go to **Settings**.
::image type="content" source="media/github-repo-settings.png" alt-text="Select settings in GitHub repo.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
::image type="content" source="media/github-repo-secrets.png" alt-text="Select Secrets.":::

1. Create secrets for `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your User-Assigned Managed Identity for your GitHub secrets:

|GitHub secret  |System-assigned managed identity  |
|---------|---------|
|AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
|AZURE_TENANT_ID    |    Tenant ID   |

## Set up Azure Login with System-Assigned Managed Identity

In this example, you use the system-assigned managed identity to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `subscription-id` and `tenant-id` values. 


```yaml
name: Run Azure Login with System-assigned Managed Identity
on: [push]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - name: Azure login
        uses: azure/login@v2
        with:
          auth-type: IDENTITY
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          enable-AzPSSession: true

      # Azure CLI Action only supports linux self-hosted runners for now.
      # If you want to execute the Azure CLI script on a windows self-hosted runner, you can execute it directly in `run`.
      - name: Azure CLI script
        uses: azure/cli@v2
        with:
          azcliversion: latest
          inlineScript: |
            az account show

      - name: Azure PowerShell script
        uses: azure/powershell@v2
        with:
          azPSVersion: "latest"
          inlineScript: |
            Get-AzContext
            Get-AzResourceGroup
```

## Create GitHub secrets for User-Assigned Managed Identity

1. Open your GitHub repository and go to **Settings**.
::image type="content" source="media/github-repo-settings.png" alt-text="Select settings in GitHub repo.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
::image type="content" source="media/github-repo-secrets.png" alt-text="Select Secrets.":::

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your User-Assigned Managed Identity for your GitHub secrets:

|GitHub secret  |User-assigned managed identity  |
|---------|---------|
|AZURE_CLIENT_ID     |    Client ID     |
|AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
|AZURE_TENANT_ID    |    Tenant ID   |

## Set up Azure Login with User-Assigned Managed Identity

In this example, you use the user-assigned managed identity to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `client-id`, `subscription-id` and `tenant-id` values. 

```yaml

name: Run Azure Login with User-assigned Managed Identity
on: [push]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - name: Azure login
        uses: azure/login@v2
        with:
          auth-type: IDENTITY
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          enable-AzPSSession: true

      # Azure CLI Action only supports linux self-hosted runners for now.
      # If you want to execute the Azure CLI script on a windows self-hosted runner, you can execute it directly in `run`.
      - name: Azure CLI script
        uses: azure/cli@v2
        with:
          azcliversion: latest
          inlineScript: |
            az account show

      - name: Azure PowerShell script
        uses: azure/powershell@v2
        with:
          azPSVersion: "latest"
          inlineScript: |
            Get-AzContext
```
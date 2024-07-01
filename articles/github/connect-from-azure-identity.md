--- 
title:  Authenticate to Azure from GitHub Action workflows by Managed Identity
description: Connect to GitHub from Azure with a Managed Identity
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with Managed Identity
On resources configured for [managed identities](/entra/identity/managed-identities-azure-resources/overview) in Azure, you can sign in [Azure login](https://github.com/marketplace/actions/azure-login) using the managed identity. There's no need to manage credentials, as they are not accessible to you. You can use two types of managed identities: **System-assigned** or **User-assigned**.

## Use the Azure login action with System-Assigned Managed Identity

> [!NOTE]
>
> "Login With System-assigned Managed Identity" is only supported on GitHub self-hosted runners and the self-hosted runners need to be hosted by Azure virtual machines.

Before your login with system-assigned managed identity, you need to create an Azure virtual machine to host the GitHub self-hosted runner.

- Create an Azure virtual machine
  - [Create a Windows virtual machine](/azure/virtual-machines/windows/quick-create-portal)
  - [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)
- [Configure system-assigned managed identity on the Azure virtual machine](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity)
- Install required software on the Azure virtual machine
  - [Install Azure CLI](/cli/azure/install-azure-cli)
    - To run the [Azure CLI Action](https://github.com/Azure/CLI), you don't need to pre-install the Azure CLI. However, you must [install Docker](https://docs.docker.com/engine/install/).
  - [Install PowerShell](/powershell/scripting/install/installing-powershell)
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Configure the Azure virtual machine as a GitHub self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners)

### Create GitHub secrets
1. Open your GitHub repository and go to **Settings**.

1. Select **Security > Secrets and variables > Actions > New repository secret**.

1. Create secrets for `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your User-Assigned Managed Identity for your GitHub secrets:

|GitHub secret  |System-assigned managed identity  |
|---------|---------|
|AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
|AZURE_TENANT_ID    |    Tenant ID   |

### Set up Azure Login with System-Assigned Managed Identity

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

## Use the Azure login action with User-Assigned Managed Identity

> [!NOTE]
>
> "Login With User-assigned Managed Identity" is only supported on GitHub self-hosted runners and the self-hosted runners need to be hosted by Azure virtual machines.

Before your login with User-assigned managed identity, you need to create an Azure virtual machine to host the GitHub self-hosted runner.

- Create an Azure virtual machine
  - [Create a Windows virtual machine](/azure/virtual-machines/windows/quick-create-portal)
  - [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)
- [Create a user-assigned managed identity and assign a role to it](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity)
- [Configure user-assigned managed identity on the Azure virtual machine](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity)
- Install required software on the Azure virtual machine
  - [Install Azure CLI](/cli/azure/install-azure-cli) or [Using Azure CLI action](https://github.com/Azure/CLI)
    - To run the [Azure CLI Action](https://github.com/Azure/CLI), you don't need to pre-install the Azure CLI. However, you must [install Docker](https://docs.docker.com/engine/install/).
  - [Install PowerShell](/powershell/scripting/install/installing-powershell)
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Configure the Azure virtual machine as a GitHub self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners)

### Create GitHub secrets

1. Open your GitHub repository and go to **Settings**.

1. Select **Security > Secrets and variables > Actions > New repository secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your User-Assigned Managed Identity for your GitHub secrets:

|GitHub secret  |User-assigned managed identity  |
|---------|---------|
|AZURE_CLIENT_ID     |    Client ID     |
|AZURE_SUBSCRIPTION_ID     |    Subscription ID     |
|AZURE_TENANT_ID    |    Tenant ID   |

### Set up Azure Login with User-Assigned Managed Identity

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
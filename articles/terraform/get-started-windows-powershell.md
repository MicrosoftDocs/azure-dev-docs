---
title: Install Terraform on Windows with Azure PowerShell
description: Learn how to configure Terraform on Windows with Azure PowerShell
keywords: terraform azure cli devops powershell install configure windows interactive login rbac service principal automated script
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform, mode-api, devx-track-azurecli, devx-track-azurepowershell
adobe-target: true
# Customer intent: As a Windows user new to Terraform and Azure, I want install Terraform on Windows using Azure PowerShell.
---

# Install Terraform on Windows with Azure PowerShell

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article describes how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html) using PowerShell.

In this article, you learn how to:

> [!div class="checklist"]
> * Install the latest version of PowerShell
> * Install the new PowerShell Az Module
> * Install the Azure CLI
> * Install Terraform
> * Understand common Terraform and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 2. Install Azure PowerShell

1. The latest PowerShell module that allows interaction with Azure resources is called the [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). When using the Azure PowerShell Az module, PowerShell 7 (or later) is the recommended version on all platforms. If you have PowerShell installed, you can verify the version by entering the following command at a PowerShell prompt.

    ```powershell
    $PSVersionTable.PSVersion
    ```

1. [Install PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows). This demo was tested using PowerShell 7.2.1 (x64) on Windows 10.

## 3. Install the Azure CLI

For [Terraform to authenticate to Azure](https://www.terraform.io/docs/providers/azurerm/guides/azure_cli.html), you need to [install the Azure CLI](/cli/azure/install-azure-cli-windows). This demo was tested using Azure CLI version 2.32.0.

## 4. Install Terraform for Windows

[!INCLUDE [install-terraform-on-windows.md](includes/install-terraform-on-windows.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Authenticate Terraform to Azure](authenticate-to-azure.md)

---
title: Quickstart - Getting started with Terraform using Azure Cloud Shell
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script cli powershell
ms.topic: quickstart
ms.date: 06/09/2020
# Customer intent: As someone new to Terraform and Azure, I want learn the basics of deploying Azure resources using Terraform from Cloud Shell.
---

# Quickstart: Getting started with Terraform using Azure Cloud Shell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

## Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- [Install the latest version of PowerShell for Windows](https://docs.microsoft.com/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?view=azure-cli-latest)

## Specify Azure subscription

1. Open a PowerShell instance as Administrator.

1. Connect to Azure.

    ```powershell
    Connect-AzAccount
    ```
    
1. To view the Azure subscriptions associated with the Microsoft account used to connect to Azure, run the [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/Get-AzSubscription?view=azps-4.1.0) cmdlet:

    ```powershell
    Get-AzSubscription
    ```

1. To use a specific Azure subscription for the current PowerShell session, use one of the two following examples of [Set-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext?view=azps-4.1.0).

    Replace the `<subscription_id>` placeholder with the ID of the subscription you want to use:

    ```powershell
    Set-AzContext -SubscriptionId "<subscription_id"
    ```

    Replace the `<subscription_name>` placeholder with the name of the subscription you want to use:

    ```powershell
    Set-AzContext -SubscriptionId "<subscription_name"
    ```

1. To verify the current Azure subscription, use the [Get-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/get-azcontext?view=azps-4.1.0) cmdlet.

    ```powershell
    Get-AzContext
    ```

## Install Terraform

1. [Download Terraform](https://www.terraform.io/downloads.html).

1. From the download, extract the executable to a directory of your choosing.

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Verify the global path configuration with the `terraform` command. If the Terraform executable is found, a list of available Terraform options displays:

    ```powershell
    terraform
    ```

    If the Terraform executable is found, it will list the syntax and available commands:

    ```output
    Usage: terraform [-version] [-help] <command> [args]

    The available commands for execution are listed below.
    The most common, useful commands are shown first, followed by
    less common or more advanced commands. If you're just getting
    started with Terraform, stick with the common commands. For the
    other commands, please read the help and docs before usage.
    ...
    ```









https://www.terraform.io/docs/providers/azurerm/guides/service_principal_client_secret.html













## Create and run a sample script

1. Create a file `test.tf` in an empty directory and paste in the following script.

    ```hcl
    provider "azurerm" {
      # The "feature" block is required for AzureRM provider 2.x.
      # If you are using version 1.x, the "features" block is not allowed.
      version = "~>2.0"
      features {}
    }
    resource "azurerm_resource_group" "rg" {
            name = "QuickstartTerraformTest-rg"
            location = "eastus"
    }
    ```

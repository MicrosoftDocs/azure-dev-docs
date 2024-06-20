---
title: Install Terraform on Windows with Bash
description: Learn how to install Terraform on Windows with Bash
keywords: terraform azure cli devops install configure windows interactive login rbac service principal automated script
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform, mode-api, devx-track-azurecli 
adobe-target: true
# Customer intent: As a Windows user new to Terraform and Azure, I want install Terraform on Windows using the Bash environment.
---

# Install Terraform on Windows with Bash
 
[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:

> [!div class="checklist"]
> * Install the Git Bash terminal emulator
> * Install Azure CLI
> * Install Terraform
> * Configure your environment to run Terraform on Windows
> * Understand common Terraform and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 2. Install a terminal emulator

There are many options on Windows to run bash commands, including Git Bash and Windows Terminal. This article has been tested using Git Bash. Download and install [Git Bash](https://git-scm.com/download/win).

## 3. Install the Azure CLI

[Install the Azure CLI](/cli/azure/install-azure-cli-windows). This article was tested using Azure CLI version 2.26.1.

## 4. Install Terraform for Windows

[!INCLUDE [install-terraform-on-windows.md](includes/install-terraform-on-windows.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Authenticate Terraform to Azure](authenticate-to-azure.md)

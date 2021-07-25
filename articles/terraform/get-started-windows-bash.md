---
title: Quickstart - Configure Terraform in Windows with Bash
description: In this quickstart, you learn how to configure Terraform in Windows with Bash
keywords: terraform azure cli devops install configure windows interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 07/22/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As a Windows user new to Terraform and Azure, I want configure Terraform in Windows using the Bash environment.
---

# Quickstart: Configure Terraform in Windows with Bash
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:
> [!div class="checklist"]
> * Install the Git Bash terminal emulator
> * Install Azure CLI
> * Install Terraform
> * Configure your environment to run Terraform on Windows
> * Use various methods to authenticate to Azure

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Install a terminal emulator

There are many options on Windows to run bash commands, including Git Bash and Windows Terminal. This article has been tested using Git Bash. Download and install [Git Bash](https://git-scm.com/download/win).

## 2. Install the Azure CLI

[Install the Azure CLI](/cli/azure/install-azure-cli-windows). This article was tested using Azure CLI version 2.26.1.

## 3. Install Terraform for Windows

[!INCLUDE [install-terraform-on-windows.md](includes/install-terraform-on-windows.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Authenticate Terraform to Azure](authenticate-to-azure.md)
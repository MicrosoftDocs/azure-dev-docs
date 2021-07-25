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

1. [Download Terraform](https://www.terraform.io/downloads.html). This article was tested using Terraform version 1.0.3.

1. From the download, extract the executable to a directory of your choosing (for example, `c:\terraform`).

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Open a terminal window.

1. Verify the global path configuration with the `terraform` command.

    ```powershell
    terraform -version
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Authenticate Terraform to Azure](authenticate-to-azure.md)
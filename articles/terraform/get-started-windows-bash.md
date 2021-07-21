---
title: Quickstart - Configure Terraform in Windows with Bash
description: In this quickstart, you learn how to configure Terraform in Windows with Bash
keywords: terraform azure cli devops install configure windows interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 07/20/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As a Windows user new to Terraform and Azure, I want configure Terraform in Windows using the Bash environment.
---

# Quickstart: Configure Terraform in Windows with Bash
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:
> [!div class="checklist"]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Configure your environment

1. Download and install a terminal emulator for Windows - such as [GitBash](https://git-scm.com/download/win).

1. [Install the Azure CLI](/cli/azure/install-azure-cli-windows). This demo was tested using Azure CLI version 2.19.1.

1. [Download Terraform](https://www.terraform.io/downloads.html). This demo was tested using Terraform version 0.14.7.

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
> [Create an Azure resource group using Terraform](create-resource-group.md)
---
title: Configure Terraform in Azure Cloud Shell with Bash
description: Learn how to configure Terraform in Azure Cloud Shell with Bash
keywords: azure devops terraform cloud shell cli install configure portal interactive login rbac service principal automated script
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform, mode-api
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the Bash environment.
---

# Configure Terraform in Azure Cloud Shell with Bash
 
[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:

> [!div class="checklist"]
> * Configure Cloud Shell
> * Display current Azure account
> * Understand common Terraform and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 2. Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## 3. Install latest version of Terraform in Azure Cloud Shell

[!INCLUDE [install-latest-version.md](includes/install-latest-version.md)]

## 4. Verify the default Azure subscription

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Authenticate Terraform to Azure](authenticate-to-azure.md)

---
title: Get Started - Configure Terraform in Azure Cloud Shell with PowerShell
description: In this article, you learn how to configure Terraform in Azure Cloud Shell with PowerShell
keywords: terraform azure cli devops install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 08/01/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the PowerShell environment.
---

# Get Started: Configure Terraform in Azure Cloud Shell with PowerShell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article shows how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html) using Cloud Shell and PowerShell.

In this article, you learn how to:
> [!div class="checklist"]

> * Configure Cloud Shell
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

## 5. Authenticate Terraform to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create Azure resource group](create-resource-group.md)
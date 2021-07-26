---
title: Quickstart - Configure Terraform in Azure Cloud Shell with Bash
description: In this quickstart, you learn how to configure Terraform in Azure Cloud Shell with Bash
keywords: azure devops terraform cloud shell cli install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 07/22/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the Bash environment.
---

# Quickstart: Configure Terraform in Azure Cloud Shell with Bash
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

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

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## 2. Confirm the default Azure subscription

When you log in to the Azure portal with a Microsoft account, the default Azure subscription for that account is used.

Terraform automatically authenticates using information from the default Azure subscription.

Run [az account show](/cli/azure/account?#az_account_show) to verify the current Microsoft account and Azure subscription.

```azurecli
az account show
```

Any changes you make via Terraform will be against the displayed Azure subscription. If that's what you want, skip the rest of this article.

If you want to authenticate using either a different Microsoft account or Azure subscription, go to the [Next steps](#next-steps) section.

## 3. Authenticate Terraform to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create Azure resource group](create-resource-group.md)
---
title: Quickstart - Configure Terraform in Azure Cloud Shell with Bash
description: In this quickstart, you learn how to configure Terraform in Azure Cloud Shell with Bash
keywords: terraform azure cli devops install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 05/11/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the Bash environment.
---

# Quickstart: Configure Terraform in Azure Cloud Shell with Bash
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:
> [!div class="checklist"]
> * Display current Azure account
> * Link to options for authenticating to Azure

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## Authenticate to Azure

When you log in to the Azure portal with a Microsoft account, you automatically use the default Azure subscription for that account.

Terraform automatically uses information from the default Azure subscription.

Run [az account show](/cli/azure/account?#az_account_show) to verify the current Microsoft account and Azure subscription.

```azurecli
az account show
```

If want to use the displayed default subscription, you can skip the rest of this section.

If you want to authenticate using either a different Microsoft account or Azure subscription, the following options can be used:

- [Option #1: Authenticate interactively using a Microsoft account](authenticate-interactive.md)
- [Option #2: Authenticate from script using a service principal](authenticate-script.md)

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create-resource-group.md)
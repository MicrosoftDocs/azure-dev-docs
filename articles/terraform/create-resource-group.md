---
title: Quickstart - Create an Azure resource group using Terraform
description: Learn how to create an Azure resource group using Terraform
keywords: azure devops terraform azure resource group
ms.topic: quickstart
ms.date: 03/18/2023
ms.custom: devx-track-terraform, mode-portal
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want to do something simple to confirm my Terraform installation.
---

# Quickstart: Create an Azure resource group using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article shows how to create an Azure resource group using Terraform.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure resource group to hold other Azure resources
> * Verify (using Azure CLI and Azure PowerShell) the resource group was created
> * Delete the resource group when finished using it

> [!NOTE]
> The example code in this article is located in the [Microsoft Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-resource-group).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

To see the resource group name, run the following command:

```console
echo "$(terraform output resource_group_name)"
```

#### [Azure CLI](#tab/azure-cli)

Run [az group show](/cli/azure/group#az-group-show) to display the resource group.

```azurecli
az group show --name <resource_group_name>
```

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

```azurepowershell
Get-AzResourceGroup -Name <resource_group_name>
```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)

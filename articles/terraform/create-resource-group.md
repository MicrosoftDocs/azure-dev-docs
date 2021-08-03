---
title: Get Started - Create an Azure resource group using Terraform
description: In this article, you learn how to create an Azure resource group using Terraform
keywords: azure devops terraform azure resource group
ms.topic: quickstart
ms.date: 08/01/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want to do something simple to confirm my Terraform installation.
---

# Get Started: Create an Azure resource group using Terraform

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:
> [!div class="checklist"]

> * Create an Azure resource group to hold other Azure resources
> * Verify (using Azure CLI and Azure PowerShell) the resource group was created
> * Delete the resource group when finished using it

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

#### [Azure CLI](#tab/azure-cli)

Run [az group show](/cli/azure/group#az_group_show) to display the resource group.

```azurecli
az group show --name <resource_group>
```

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

```azurepowershell
Get-AzResourceGroup -Name <resource_group>
```
---

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
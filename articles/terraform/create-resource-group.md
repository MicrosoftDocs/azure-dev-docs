---
title: Get Started - Create an Azure resource group using Terraform
description: Learn how to create an Azure resource group using Terraform
keywords: azure devops terraform azure resource group
ms.topic: quickstart
ms.date: 01/28/2022
ms.custom: devx-track-terraform, mode-portal
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want to do something simple to confirm my Terraform installation.
---

# Get Started: Create an Azure resource group using Terraform

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article shows how to create an Azure resource group using Terraform.

In this article, you learn how to:
> [!div class="checklist"]

> * Create an Azure resource group to hold other Azure resources
> * Verify (using Azure CLI and Azure PowerShell) the resource group was created
> * Delete the resource group when finished using it

> [!NOTE]
> The example code in this article is located in the [Microsoft Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-resource-group).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

1. Create a file named `output.tf` to display the randomly generated resource group name and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/output.tf)]

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
az group show --name <resource_group_name>
```

**Key points:**

- The resource group name is displayed in the `terraform apply` output.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

```azurepowershell
Get-AzResourceGroup -Name <resource_group_name>
```

**Key points:**

- The resource group name is displayed in the `terraform apply` output.

---

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)

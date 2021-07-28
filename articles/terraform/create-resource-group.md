---
title: Quickstart - Create an Azure resource group using Terraform
description: In this quickstart, you learn how to create an Azure resource group using Terraform
keywords: azure devops terraform azure resource group
ms.topic: quickstart
ms.date: 07/27/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want to do something simple to confirm my Terraform installation.
---

# Quickstart: Create an Azure resource group using Terraform

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

1. Create a directory in which to test and run the sample Terraform code.

1. Create your main Terraform configuration file. By convention, the name of this file is `main.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the main Terraform configuration file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a variables file that will contain the values for Terraform. By convention, the name of this file is `variables.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the variables file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

    **Key points:**
    
    - The values used in the `variables.tf` file are arbitrary and can be changed as appropriate for your environment.
    
## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-create-plan.md](includes/terraform-create-plan.md)]

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

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
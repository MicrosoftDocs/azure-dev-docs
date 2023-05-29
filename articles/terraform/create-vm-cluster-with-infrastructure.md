---
title: 'Quickstart: Create an Azure Linux VM cluster with Terraform'
description: Learn how to Create an Azure Linux VM cluster with Terraform.
keywords: azure devops terraform vm virtual machine cluster
ms.topic: quickstart
ms.date: 05/29/2023
ms.custom: devx-track-terraform, ai-gen-docs
---

# Quickstart: Create an Azure Linux VM cluster with Terraform

This article shows how to create a small Linux VM cluster in Azure using Terraform.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a virtual network using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create a subnet using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Create a public IP using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip)
> * Create a load balancer using [azurerm_lb](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/lb)
> * Create a load balancer address pool using [azurerm_lb_backend_address_pool](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/lb_backend_address_pool)
> * Create a network interface using [azurerm_network_interface](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface)
> * Create a managed disk using [azurerm_managed_disk](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/managed_disk)
> * Create a availability set using [azurerm_availability_set](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/availability_set)
> * Create a random password using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password)
> * Create a Linux virtual machine using [azurerm_linux_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine)

[!INCLUDE [AI attribution](~/../azure-docs-pr/includes/ai-generated-attribution.md)]

## Prerequisites

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-cluster-linux). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-cluster-linux/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-vm-cluster-linux/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-vm-cluster-linux/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-vm-cluster-linux/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-vm-cluster-linux/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [az vm list](/cli/azure/vm#az-vm-list) with a [JMESPath](/cli/azure/query-azure-cli) query to display the names of the virtual machines created in the resource group.

    ```azurecli
    az vm list \
      --resource-group $resource_group_name \
      --query "[].{\"VM Name\":name}" -o table
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [Get-AzVm](/powershell/module/az.compute/get-azvm)  to display the names of all the virtual machines in the resource group.

    ```azurepowershell
    Get-AzVm -ResourceGroupName $resource_group_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Create an Azure virtual machine scale set using Terraform](create-vm-scaleset-network-disks-hcl.md)
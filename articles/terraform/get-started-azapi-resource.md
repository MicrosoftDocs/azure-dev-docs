---
title: Quickstart - Deploy your first Azure resource with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to manage an Azure Container Registry resource
keywords: azure devops terraform acr azapi resource
ms.topic: quickstart
ms.date: 01/30/2025
ms.custom: devx-track-terraform
---

# Quickstart: Deploy your first Azure resource with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

The [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) manages Azure resources directly through the Azure Resource Manager API. It's particularly useful for resources, properties, or API versions not yet supported by [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). In this example, you use `azapi_resource` to create an [Azure Container Registry](/azure/container-registry/).

> [!div class="checklist"]
> * Create a resource group and container registry with AzAPI
> * Register the Microsoft.ContainerRegistry provider

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azapi-lab-services). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azapi-lab-services/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-lab-services/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-lab-services/variables.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-lab-services/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-lab-services/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

1. Get the resource group name.

    ```bash
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the container registry name.

    ```bash
    azure_container_registry_name=$(terraform output -raw azure_container_registry_name)
    ```

1. Run [az acr show](/cli/azure/acr#az-acr-show) to view the container registry.

    ```azurecli
    az acr show --name $azure_container_registry_name --resource-group $resource_group_name
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the resource group name.

    ```powershell
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the container registry name.

    ```powershell
    $azure_container_registry_name=$(terraform output -raw azure_container_registry_name)
    ```

1. Run [Get-AzContainerRegistry](/powershell/module/az.containerregistry/get-azcontainerregistry) to view the container registry.

    ```azurepowershell
    Get-AzContainerRegistry -ResourceGroupName $resource_group_name -Name $azure_container_registry_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the AzAPI provider](./overview-azapi-provider.md)

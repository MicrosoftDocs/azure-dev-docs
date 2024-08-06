---
title: Quickstart - Deploy your first Azure resource-action with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to shut down a VM
keywords: azure devops terraform virtual machine azapi resource_action
ms.topic: quickstart
ms.date: 12/05/2023
ms.custom: devx-track-terraform
author: stema
ms.author: stema
---

# Quickstart: Deploy your first Azure resource_action resource with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you learn how to use the [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) to perform a `POST` action on a resource that isn't supported by the [AzureRM provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). The `azapi_resource_action` will be used to shut down a [Virtual Machine](/azure/virtual-machine/).

> [!div class="checklist"]
> * Define and configure the AzureRM and AzAPI providers
> * Generate a random name for the Event Hubs namespace
> * Use the AzureRM provider to create an Azure resource group and the required networking and Event Hubs resources
> * Use the AzAPI provider to add a network rule set to the `azurerm_eventhub_namespace` resources

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azapi-eventhub-network-rules).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/main.tf)]

1. Create a file named `main-generic.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/main-generic.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

Run [az vm show](https://learn.microsoft.com/en-us/cli/azure/azure-cli-vm-tutorial-4) to display the Event Hubs Namespace network rules.

```azurecli
az vm show --name $vmName --resource-group $resourceGroup
```

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzVM](https://learn.microsoft.com/en-us/powershell/module/az.compute/get-azvm) to display the Event Hubs Namespace network rules.

```azurepowershell
Get-AzEventHubNetworkRuleSet -ResourceGroupName <resource_group_name> -Namespace <namespace_name>
```

**Key points:**

- The resource group name and Event Hubs namespace name are displayed in the `terraform apply` output.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)

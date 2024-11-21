---
title: Quickstart - Deploy your first Azure update-resource with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to manage network rules on an Azure Event Hubs namespace
keywords: azure devops terraform event hubs azapi update_resource
ms.topic: quickstart
ms.date: 11/21/2024
ms.custom: devx-track-terraform
author: grayzu
ms.author: markgray
---

# Quickstart: Deploy your first Azure update resource with the AzAPI Terraform provider

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.8](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.0.2](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [AzAPI Provider v.0.1.0](https://registry.terraform.io/providers/azure/azapi/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you learn how to use the [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) to manage a new feature of an Azure service that isn't currently supported by the [AzureRM provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). The `azapi_update_resource` will be used to manage an [Azure EventHub](/azure/event-hubs/) network rule set.

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

Run [az eventhubs namespace network-rule-set show](/cli/azure/eventhubs/namespace/network-rule-set#az-eventhubs-namespace-network-rule-set-show) to display the Event Hubs Namespace network rules.

```azurecli
az eventhubs namespace network-rule show --resource-group <resource_group_name> --namespace-name <namespace_name>
```

**Key points:**

- The resource group name and Event Hubs namespace name are displayed in the `terraform apply` output.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzEventHubNetworkRuleSet](/powershell/module/az.eventhub/Get-AzEventHubNetworkRuleSet) to display the Event Hubs Namespace network rules.

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

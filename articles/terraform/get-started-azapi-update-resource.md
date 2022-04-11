---
title: Deploy your first Azure update-resource with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to manage network rules on an Azure Event Hub namespace
keywords: azure devops terraform event hub azapi update_resource
ms.topic: how-to
ms.date: 04/11/2022
ms.custom: devx-track-terraform
author: grayzu
ms.author: markgray
---

# Deploy your first Azure update resource with the AzAPI Terraform provider

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.8](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.0.2](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [AzAPI Provider v.0.1.0](https://registry.terraform.io/providers/azure/azapi/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

In this article, you learn how to use the [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) to manage a new feature of an Azure service that is not currently supported by the [AzureRM provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). The `azapi_update_resource` will be used to manage an [Azure EventHub](/azure/event-hubs/) network rule set.

> [!div class="checklist"]

> * Define and configure the AzureRM and AzAPI providers
> * Generate a random name for the Event Hub namespace
> * Use the AzureRM provider to create an Azure resource group and the required networking and Event Hub resources
> * Use the AzAPI provider to add a network rule set to the `azurerm_eventhub_namespace` resources

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azapi-eventhub-network-rules).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/main.tf)]


1. Create a file named `main-generic.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-azapi-eventhub-network-rules/main-generic.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

#### [Azure CLI](#tab/azure-cli)

Run [az eventhubs namespace network-rule list](/cli/azure/eventhubs/namespace#az_eventhubs_namespace_network-rule_list) to display the Event Hub Namespace network rules.

```azurecli
az eventhubs namespace network-rule list --name <resource_group_name> --namespace-name <namespace_name>
```

**Key points:**

- The resource group name and Event Hub namespace name are displayed in the `terraform apply` output.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzEventHubNetworkRuleSet](/powershell/module/az.eventhub/Get-AzEventHubNetworkRuleSet) to display the Event Hub Namespace network rules.

```azurepowershell
Get-AzEventHubNetworkRuleSet -ResourceGroupName <resource_group_name> -Namespace <namespace_name>
```

**Key points:**

- The resource group name and Event Hub namespace name are displayed in the `terraform apply` output.

---

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)

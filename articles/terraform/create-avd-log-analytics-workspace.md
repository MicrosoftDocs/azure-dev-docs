---
title: Configure Log Analytics Workspace using Terraform - Azure
description: Learn how to use Terraform to configure Azure Log Analytics Workspace
keywords: azure devops terraform log analytics
service: azure
ms.service: azure
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Create an Azure Log Analytics Workspace using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Azure offers multiple storage solutions that you can use to store your FSLogix profiles container. This article covers configuring Azure Files storage solutions for Azure Virtual Desktop FSLogix user profile containers using Terraform. This article shows you how to create a Log Analytics workspace using Terraform.

In this article, you learn how to:

> [!div class="checklist"]
> * Use Terraform to configure Azure Log Analytics Workspace

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/loganalytics.tf)]

1. Create a file named `variables.tf` and insert the following code:

```
variable "deploy_location" {
  type        = string
  default     = "eastus"
  description = "The Azure Region in which all resources in this example should be created."
}

variable "rg_shared_name" {
  type        = string
  default     = "rg-shared-resources"
  description = "Name of the Resource group in which to deploy shared resources"
}
```

1. Create a file named `output.tf` and insert the following code:

```
output "location" {
  description = "The Azure region"
  value       = azurerm_resource_group.log.location
}

output "log_analytics" {
  description = "Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.law.name
}
```

## 4. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 5. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 6. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)

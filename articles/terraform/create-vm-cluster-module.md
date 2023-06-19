---
title: 'Quickstart: Create a Windows VM cluster in Azure using Terraform'
description: In this article, you learn how to create a Windows VM cluster in Azure using Terraform
ms.topic: quickstart
ms.date: 06/19/2023
ms.custom: devx-track-terraform, ai-gen-docs
#Customer intent: As a developer or cluster operator, I want to learn how to quickly create a Windows VM cluster.
---

# Quickstart: Create a Windows VM cluster in Azure using Terraform

This article shows you how to create a Windows VM cluster (containing three Windows VM instances) in Azure using Terraform.

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create an random value for the Windows VM host name [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string).
> * Create a random password for the Windows VMs using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password).
> * Create a Windows VM using the [compute module](https://registry.terraform.io/modules/Azure/compute/azurerm).
> * Create a virtual network along with subnet using the [network module](https://registry.terraform.io/modules/Azure/network/azurerm).

[!INCLUDE [AI attribution](~/../azure-docs-pr/includes/ai-generated-attribution.md)]

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/UserStory89540/quickstart/101-vm-cluster-windows). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/UserStory89540/quickstart/101-vm-cluster-windows/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[UserStory89540](~/../terraform_samples/quickstart/101-vm-cluster-linux/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[UserStory89540](~/../terraform_samples/quickstart/101-vm-cluster-linux/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[UserStory89540](~/../terraform_samples/quickstart/101-vm-cluster-linux/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[UserStory89540](~/../terraform_samples/quickstart/101-vm-cluster-linux/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about managing virtual machines in Azure using Terraform](/azure/virtual-machines)

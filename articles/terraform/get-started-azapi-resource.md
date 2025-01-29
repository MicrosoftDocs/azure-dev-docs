---
title: Quickstart - Deploy your first Azure resource with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to manage an Azure Container Registry resource
keywords: azure devops terraform acr azapi resource
ms.topic: quickstart
ms.date: 01/29/2025
ms.custom: devx-track-terraform
---

# Quickstart: Deploy your first Azure resource with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you learn how to use the [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) to manage an Azure service that is not currently supported by the [AzureRM provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). In the example code, the `azapi_resource` is used to manage an [Azure Container Registry](/azure/container-registry/) resource.

> [!div class="checklist"]

> * Define and configure the AzureRM and AzAPI providers
> * Use the AzureRM provider to create an Azure resource group with a unique name
> * Use the AzureRM provider to register the "Microsoft.ContainerRegistry" provider in your subscription
> * Use the AzAPI provider to create the Azure Container Registry resource

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/101-azapi-lab-services/quickstart/101-azapi-lab-services).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[101-azapi-lab-services](../../terraform_samples/quickstart/101-azapi-lab-services/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[101-azapi-lab-services](../../terraform_samples/quickstart/101-azapi-lab-services/variables.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[101-azapi-lab-services](../../terraform_samples/quickstart/101-azapi-lab-services/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[101-azapi-lab-services](../../terraform_samples/quickstart/101-azapi-lab-services/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

Verify your keys have been listed as a result of the `terraform apply` command.

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the AzAPI provider](./overview-azapi-provider.md)

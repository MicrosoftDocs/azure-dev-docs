---
title: Quickstart - Create an Azure resource group using Terraform
description: In this quickstart, you learn how to create an Azure resource group using Terraform
keywords: azure devops terraform azure resource group
ms.topic: quickstart
ms.date: 07/19/2021
ms.custom: devx-track-terraform, devx-track-azurecli, devx-track-powershell
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want to do something simple to confirm my Terraform installation.
---

# Quickstart: Create an Azure resource group using Terraform

[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article presents you with the options to authenticate to Azure for use with Terraform.

In this article, you learn how to:
> [!div class="checklist"]
> * Write Terraform code to create an Azure resource group
> * Initialize Terraform
> * Create a Terraform execution plan
> * Apply a Terraform execution plan
> * Destroy (undo) a Terraform execution plan

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Configure your environment

[!INCLUDE [terraform-configuration-options.md](includes/terraform-configuration-options.md)]

## 2. Create an Azure resource group

1. Create a Terraform configuration file. The filename can be any valid name for your environment. In the remaining steps of this article, substitute the filename you choose here for the placeholder `<terraform_plan>`.

1. Insert the following code.

    [!code-terraform[master](../../terraform_samples/quickstart/101-create-resource-group/main.tf)]




## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-create-plan.md](includes/terraform-create-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Destroy a Terraform execution plan

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## 7. Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
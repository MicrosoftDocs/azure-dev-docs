---
title: Quickstart - Deploy your first resource action with the AzAPI Terraform provider
description: Learn how to use the AzAPI Terraform provider to list keys
keywords: azure devops terraform virtual machine azapi resource_action
ms.topic: quickstart
ms.date: 12/05/2023
ms.custom: devx-track-terraform
author: stema
ms.author: stema
---

# Quickstart: Deploy your first Azure resource_action resource with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Use the [AzAPI Terraform provider](https://registry.terraform.io/providers/azure/azapi/latest/docs) to perform read-only operations on Azure resources as a data source. In this example, you list [Azure Key Vault Keys](/azure/key-vault/) without managing their lifecycle.

> [!div class="checklist"]
> * Create a Key Vault and key with AzureRM
> * Use `azapi_resource_action` to list the keys

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```
    terraform {
      required_providers {
        azapi = {
          source = "Azure/azapi"
        }
      }
    }

    provider "azapi" {}

    provider "azurerm" {
      features {}
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-key-vault-key/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-key-vault-key/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-key-vault-key/outputs.tf)]

1. Create a file named `main-generic.tf` and insert the following code:

    ```
    data "azapi_resource_action" "example" {
      type                   = "Microsoft.KeyVault/vaults@2023-07-01"
      resource_id            = azurerm_key_vault.vault.id
      action                 = "listKeys"
    }
    ```    

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

**Key points:**

- The list of keys are displayed in the `terraform apply` output.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the AzAPI provider](./overview-azapi-provider.md)

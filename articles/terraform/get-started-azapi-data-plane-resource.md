---
title: Quickstart - Manage Azure Key Vault certificate contacts with the AzAPI Terraform provider
description: Learn how to use the azapi_data_plane_resource to manage Azure Key Vault certificate contacts.
keywords: azure devops terraform key vault azapi data_plane_resource
ms.topic: quickstart
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Quickstart: Manage Azure Key Vault certificate contacts with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Use [`azapi_data_plane_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource) to manage Azure data plane resources in Terraform. In this example, you configure certificate contacts for an Azure Key Vault.

For foundational concepts about how the data plane framework works and `parent_id` patterns, see [Understand the AzAPI data plane framework](concept-azapi-data-plane-framework.md).

> [!div class="checklist"]
> * Create a Key Vault with the AzureRM provider
> * Use `azapi_data_plane_resource` to configure certificate contacts

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```terraform
    terraform {
      required_providers {
        azapi = {
          source  = "Azure/azapi"
          version = "~> 2.0"
        }
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~> 4.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~> 3.0"
        }
      }
    }
    
    provider "azurerm" {
      features {
        key_vault {
          purge_soft_delete_on_destroy    = true
          recover_soft_deleted_key_vaults = true
        }
      }
    }
    
    provider "azapi" {}
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```terraform
    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }
    
    variable "resource_group_name_prefix" {
      type        = string
      default     = "rg"
      description = "Prefix of the resource group name that's combined with a random value to create a unique name."
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```terraform
    resource "random_pet" "rg_name" {
      prefix = var.resource_group_name_prefix
    }
    
    resource "random_string" "kv_suffix" {
      length  = 6
      upper   = false
      special = false
    }
    
    resource "azurerm_resource_group" "example" {
      location = var.resource_group_location
      name     = random_pet.rg_name.id
    }
    
    data "azurerm_client_config" "current" {}
    
    resource "azurerm_key_vault" "example" {
      name                = "kv-${random_string.kv_suffix.result}"
      location            = azurerm_resource_group.example.location
      resource_group_name = azurerm_resource_group.example.name
      tenant_id           = data.azurerm_client_config.current.tenant_id
      sku_name            = "standard"
    
      access_policy {
        tenant_id = data.azurerm_client_config.current.tenant_id
        object_id = data.azurerm_client_config.current.object_id
    
        certificate_permissions = [
          "ManageContacts",
        ]
      }
    }
    
    resource "azapi_data_plane_resource" "certificate_contacts" {
      type      = "Microsoft.KeyVault/vaults/certificates/contacts@7.3"
      parent_id = trimsuffix(trimprefix(azurerm_key_vault.example.vault_uri, "https://"), "/")
      name      = "default"
    
      body = {
        contacts = [
          {
            emailAddress = "admin@contoso.com"
            name         = "Admin Contact"
            phone        = "555-555-0100"
          },
          {
            emailAddress = "ops@contoso.com"
            name         = "Operations"
          }
        ]
      }
    }
    ```

    Key points about `azapi_data_plane_resource`:

    - The `type` field uses the format `<resource-type>@<api-version>` for the data plane API.
    - The `parent_id` is the data plane endpoint hostname (without the `https://` prefix), not an ARM resource ID.
    - The `name` field identifies the specific resource within the parent. For Key Vault certificate contacts, the value is always `default`.

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "resource_group_name" {
      value = azurerm_resource_group.example.name
    }
    
    output "key_vault_name" {
      value = azurerm_key_vault.example.name
    }
    
    output "certificate_contacts" {
      value = azapi_data_plane_resource.certificate_contacts.output
    }
    ```

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

Run [az keyvault certificate contact list](/cli/azure/keyvault/certificate/contact#az-keyvault-certificate-contact-list) to retrieve the certificate contacts.

    ```azurecli
    az keyvault certificate contact list --vault-name <key_vault_name>
    ```

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzKeyVaultCertificateContact](/powershell/module/az.keyvault/get-azkeyvaultcertificatecontact) to retrieve the certificate contacts.

    ```powershell
    Get-AzKeyVaultCertificateContact -VaultName <key_vault_name>
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Learn how to use the AzAPI resource](get-started-azapi-resource.md)

## Additional reading

- [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)
- [Understand the AzAPI data plane framework](concept-azapi-data-plane-framework.md)

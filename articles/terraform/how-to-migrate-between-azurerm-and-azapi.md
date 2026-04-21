---
title: Migrate Terraform resources between AzureRM and AzAPI
description: Learn how to use the aztfmigrate tool to migrate existing Terraform resources from the AzAPI provider to the AzureRM provider.
ms.topic: how-to
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Migrate Terraform resources between AzureRM and AzAPI

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article describes how to use the [`aztfmigrate`](https://github.com/Azure/aztfmigrate) tool to migrate Azure resources managed by the AzAPI Terraform provider to the AzureRM Terraform provider. Teams typically perform this migration after a resource managed with `azapi_resource` becomes available in AzureRM — for example, after a preview service reaches general availability and AzureRM adds first-class support for it.

`aztfmigrate` migrates both the HCL configuration and the Terraform state file, ensuring your infrastructure remains fully managed without re-creating resources.

> [!NOTE]
> `aztfmigrate` migrates resources from **AzAPI to AzureRM**, not the reverse. To move from AzureRM to AzAPI, use [Azure Export for Terraform (`aztfexport`)](./azure-export-for-terraform/export-terraform-overview.md) and select the AzAPI provider output option.
>
> VS Code–based provider migration (swapping AzureRM ↔ AzAPI) is not reliable and isn't a supported migration path. Use `aztfmigrate` for AzAPI → AzureRM migrations.

For guidance on choosing a primary provider and when to keep resources in AzAPI vs. migrate them to AzureRM, see [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- An existing Terraform configuration that uses `azapi_resource` resources you want to migrate to AzureRM.
- The `aztfmigrate` binary installed and available in your PATH. Download the latest release from the [aztfmigrate releases page](https://github.com/Azure/aztfmigrate/releases).

## How `aztfmigrate` works

`aztfmigrate` runs in two modes:

1. **Plan**: Scans your Terraform configuration and state to identify `azapi_resource` resources that have equivalent support in AzureRM. Produces a migration plan without making changes.

1. **Migrate**: Executes the migration plan. Updates the HCL configuration to use AzureRM resource blocks and updates the Terraform state file to match, preserving the existing Azure resources without re-creating them.

After migration, run `terraform plan` to confirm that no changes are pending, which indicates that the configuration and state are aligned with the deployed Azure infrastructure.

## Plan the migration

1. Navigate to the directory containing your Terraform configuration.

1. Authenticate to Azure using the Azure CLI:

    ```azurecli
    az login
    az account set --subscription <subscription_id>
    ```

1. Run `aztfmigrate` in plan mode to identify which resources can be migrated:

    ```console
    aztfmigrate plan
    ```

    The output lists each `azapi_resource` block in your configuration, indicating whether it can be migrated to AzureRM and which AzureRM resource type it maps to.

    > [!NOTE]
    > Resources that use preview API versions or resource types not yet supported in AzureRM are listed as not migratable. These resources remain as `azapi_resource` blocks.

1. Review the plan output and confirm the identified mappings are correct before proceeding.

## Perform the migration

1. Run `aztfmigrate` in migrate mode to apply the changes:

    ```console
    aztfmigrate migrate
    ```

    `aztfmigrate` performs the following operations:

    - Replaces `azapi_resource` blocks in your `.tf` files with the equivalent `azurerm_*` resource blocks.
    - Updates the Terraform state file (`.tfstate`) to reflect the new resource addresses and schema.

1. After the migration completes, initialize Terraform to download the required AzureRM provider version if it changed:

    [!INCLUDE [terraform-init.md](includes/terraform-init.md)]

1. Run `terraform plan` to validate that the configuration and state are aligned with the deployed infrastructure:

    ```console
    terraform plan
    ```

    The plan output should show no changes. If changes are shown, review the diff and adjust the migrated configuration as needed before applying.

## Post-migration cleanup

After confirming a clean plan, consider the following cleanup steps:

- Remove the `azapi` provider from `required_providers` in `providers.tf` if no `azapi_resource`, `azapi_update_resource`, `azapi_resource_action`, or `azapi_data_plane_resource` blocks remain in your configuration.
- Update any output values or `locals` that reference attributes specific to the AzAPI resource schema.
- Run `terraform apply` to apply any legitimate plan differences, such as updated default values or normalized property names introduced by the AzureRM provider.

## When not to migrate

Keep resources in AzAPI rather than migrating to AzureRM when:

- The resource is in preview or uses a preview API version not yet supported in AzureRM.
- Your team has chosen AzAPI as its primary provider, and you intentionally manage resources with AzAPI for full API version control.
- The AzureRM resource representation introduces unwanted drift from your current configuration (for example, normalized defaults that differ from your deployed state).

## Next steps

> [!div class="nextstepaction"]
> [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)

> [!div class="nextstepaction"]
> [Azure Export for Terraform overview](./azure-export-for-terraform/export-terraform-overview.md)

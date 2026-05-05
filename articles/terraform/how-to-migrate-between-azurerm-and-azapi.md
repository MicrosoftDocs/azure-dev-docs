---
title: Migration paths between Azure, AzureRM, and AzAPI Terraform providers
description: Learn all the migration paths for Terraform on Azure — bringing existing Azure resources under Terraform management, authoring AzAPI resources from ARM JSON, and moving configurations between the AzureRM and AzAPI providers.
ms.topic: how-to
ms.date: 04/21/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Migration paths between Azure, AzureRM, and AzAPI Terraform providers

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Several tools and workflows exist for moving between Azure infrastructure and Terraform, or between the AzureRM and AzAPI Terraform providers. The right path depends on your starting point and goal.

Key tools include `aztfexport` (exports existing Azure resources into Terraform configuration and state) and `aztfmigrate` (converts Terraform configurations between the AzureRM and AzAPI providers).

Use the following table to identify which section applies to your scenario:

| Starting point | Goal | Recommended path |
|---|---|---|
| Existing Azure resources (not yet in Terraform) | Bring under Terraform management | [Export with `aztfexport`](#export-existing-azure-resources-to-terraform) |
| ARM template or Azure portal resource JSON | Author new AzAPI Terraform resources | [Paste as AzAPI in VS Code](how-to-use-terraform-vscode-extension.md#paste-arm-json-as-azapi-configuration) |
| Existing Terraform config using AzAPI | Migrate to AzureRM provider | [Migrate with `aztfmigrate`](#migrate-azapi-resources-to-azurerm-with-aztfmigrate) |
| Existing Terraform config using AzureRM | Migrate to AzAPI provider | [Migrate with `aztfmigrate` or the VS Code extension](#migrate-azurerm-resources-to-azapi) |

For guidance on which provider should be primary for new projects, see [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md).

## Export existing Azure resources to Terraform

[Azure Export for Terraform (`aztfexport`)](./azure-export-for-terraform/export-terraform-overview.md) brings existing Azure resources under Terraform management by generating HCL configuration and Terraform state. It supports both AzureRM and AzAPI as output targets.

**Use this path when**: You have existing Azure resources that aren't yet managed by Terraform and want to import them.

### Export methods

Choose the export method that best fits your workflow:

- **CLI**: Use the `aztfexport` binary directly. See [Azure Export for Terraform overview](./azure-export-for-terraform/export-terraform-overview.md) for installation and CLI command reference.
- **VS Code extension**: Use the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md#export-existing-azure-resources-as-terraform) for a guided export experience with resource filtering and provider selection.
- **Azure portal**: Export resources directly from the Azure portal without local tools. See [Export resources in the Azure portal](#export-resources-in-the-azure-portal).

For detailed quickstarts and advanced scenarios, see:
- [Export your first resources](./azure-export-for-terraform/export-first-resources.md)
- [Export resources to HCL code](./azure-export-for-terraform/export-resources-hcl.md)
- [Advanced export scenarios](./azure-export-for-terraform/export-advanced-scenarios.md)

### Export resources in the Azure portal

The Azure portal integration allows you to export resources without installing additional tools:

1. Navigate to the resource in the Azure portal.
1. Locate the **Export to Terraform** option (exact location depends on resource type).
1. Follow the prompts to select output provider (AzureRM or AzAPI) and export scope.
1. Download the generated Terraform configuration and state file.
1. Review the output and run `terraform plan` to confirm no drift.

For step-by-step guidance, see [Export a resource in the Azure portal](./azure-export-for-terraform/get-started-export-resources-portal.md).

## Author AzAPI resources from ARM JSON

If you have an ARM template, Azure portal resource definition, or raw REST API response and want to generate a corresponding `azapi_resource` block, the Microsoft Terraform VS Code extension can convert it automatically.

**Use this path when**: You're authoring new AzAPI resources and have an existing JSON definition (ARM template, portal export, API response) as a starting point.

The extension converts the JSON properties to the `body` attribute format and infers the `type` and `api-version`. For detailed steps and examples, see [Paste ARM JSON as AzAPI configuration](how-to-use-terraform-vscode-extension.md#paste-arm-json-as-azapi-configuration) in the VS Code extension guide.

> [!NOTE]
> This feature works best for single resource objects. Full ARM templates with multiple resources, parameters, and variables might require manual cleanup after conversion.

## Migrate AzAPI resources to AzureRM with `aztfmigrate`

[`aztfmigrate`](https://github.com/Azure/aztfmigrate) migrates existing `azapi_resource` blocks in a Terraform configuration to their equivalent `azurerm_*` resource types. It updates both the HCL (HashiCorp Configuration Language) files and the Terraform state file without re-creating the underlying Azure resources.

**Use this path when**: Your team manages resources with AzAPI and a resource you're using has since been added to the AzureRM provider with full support, and you want to consolidate onto AzureRM.

### Prerequisites

- An existing Terraform configuration with `azapi_resource` blocks you want to migrate.
- The `aztfmigrate` binary installed and in your PATH. Download from the [aztfmigrate releases page](https://github.com/Azure/aztfmigrate/releases).

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

### Plan the migration

1. Navigate to the directory containing your Terraform configuration.

1. Authenticate to Azure:

    ```azurecli
    az login
    az account set --subscription <subscription_id>
    ```

1. Run `aztfmigrate plan` to identify which resources can be migrated to AzureRM:

    ```console
    aztfmigrate plan
    ```

    The output lists each `azapi_resource` block, indicating whether it maps to a supported AzureRM resource type. Resources using preview API versions or resource types not yet in AzureRM are listed as not migratable and remain as `azapi_resource` blocks.

1. Review the plan output and confirm the mappings are correct before proceeding.

### Perform the migration

1. Run `aztfmigrate migrate` to apply the changes:

    ```console
    aztfmigrate migrate
    ```

    `aztfmigrate`:

    - Replaces `azapi_resource` blocks in your `.tf` files with the equivalent `azurerm_*` blocks.
    - Updates the state file to reflect the new resource addresses and schema.

1. Initialize Terraform to download any updated provider versions:

    [!INCLUDE [terraform-init.md](includes/terraform-init.md)]

1. Run `terraform plan` to validate that configuration and state align with the deployed infrastructure:

    ```console
    terraform plan
    ```

    The plan should show no changes. If differences appear, review the diff and adjust the migrated configuration before applying.

### Post-migration cleanup

After confirming a clean plan:

- Remove the `azapi` provider from `required_providers` if no AzAPI resource blocks remain.
- Update any `output` or `locals` blocks that reference AzAPI-specific attributes.
- Run `terraform apply` to apply any legitimate drift, such as normalized defaults introduced by AzureRM.

## Migrate AzureRM resources to AzAPI

To convert an existing AzureRM configuration to use AzAPI, use the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md), which includes tooling to generate AzAPI equivalents for `azurerm_*` resource blocks.

**Use this path when**: You're converting a Terraform module or configuration from AzureRM to AzAPI and want editor assistance with the conversion.

For step-by-step instructions, code actions, and state migration guidance, see [the VS Code extension guide](how-to-use-terraform-vscode-extension.md).

> [!IMPORTANT]
> The VS Code extension assists with HCL authoring only—it does not update the Terraform state file. Replacing `azurerm_*` blocks with `azapi_resource` blocks without updating state causes Terraform to treat the resources as deleted and re-create them.
>
> After converting HCL, use `terraform state mv` for each resource or re-import using the `import` block. Run `terraform plan` after each state change to confirm no unintended re-creation occurs.

## When not to migrate

Consider keeping resources where they are when:

- The resource is in preview or uses a preview API version not yet in AzureRM—keep it in AzAPI.
- Your team uses AzAPI as its primary provider—add new AzureRM-only resources with AzAPI rather than introducing a second primary provider.
- The AzureRM representation introduces unwanted plan drift from normalized defaults—evaluate the impact before migrating.
- State migration complexity is high—for large configurations, assess whether the operational risk of state manipulation outweighs the benefit of switching providers.

## Next steps

> [!div class="nextstepaction"]
> [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)

> [!div class="nextstepaction"]
> [Azure Export for Terraform overview](./azure-export-for-terraform/export-terraform-overview.md)

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

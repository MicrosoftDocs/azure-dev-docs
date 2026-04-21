---
title: Use the Microsoft Terraform Visual Studio Code extension
description: Learn how to use the Microsoft Terraform VS Code extension to author AzAPI resources, convert ARM JSON to Terraform, export Azure resources, and run preflight validation.
ms.topic: how-to
ms.date: 04/21/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Use the Microsoft Terraform Visual Studio Code extension

The [Microsoft Terraform Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureterraform) provides authoring, validation, and migration tooling for Terraform configurations on Azure. It includes language intelligence for both the AzureRM and AzAPI providers, integration with [Azure Export for Terraform (`aztfexport`)](./azure-export-for-terraform/export-terraform-overview.md), and preflight validation support.

This article covers the features most relevant to AzAPI authoring and provider migration. For a guide to installing the extension and running basic Terraform commands, see [Install the Microsoft Terraform Visual Studio Code extension](configure-vs-code-extension-for-terraform.md).

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- The [Microsoft Terraform extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureterraform) installed
- [Terraform](https://developer.hashicorp.com/terraform/downloads) installed and available in your PATH
- The [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated (`az login`)

## AzAPI provider language features

The extension provides rich language intelligence for the AzAPI provider in `.tf` files, backed by the [AzAPI Language Server](https://github.com/Azure/azapi-lsp).

### Resource type and API version completion

When you type `type = "` inside an `azapi_resource`, `azapi_update_resource`, or `azapi_data_plane_resource` block, the extension shows a list of all available Azure resource types and API versions:

:::image type="content" source="media/configure-vs-code-extension-for-terraform/list-all-available-resource-types.png" alt-text="Screenshot showing autocomplete for available AzAPI resource types and API versions.":::

### Property name and value completion

Inside the `body` attribute, the extension suggests allowed property names and valid values based on the selected resource type and API version:

:::image type="content" source="media/configure-vs-code-extension-for-terraform/list-allowed-properties.png" alt-text="Screenshot showing autocomplete for allowed property names and values in an azapi_resource body.":::

For properties that use discriminated objects (such as `kind`-based type hierarchies), the extension populates required sub-properties automatically.

### Hover documentation

Hovering over a resource type, property name, or property value shows inline documentation sourced from the Azure resource schema:

:::image type="content" source="media/configure-vs-code-extension-for-terraform/show-hint-when-hovering.png" alt-text="Screenshot showing hover documentation for an AzAPI property.":::

### Schema validation

The extension underlines schema errors as you type — for example, unrecognized property names, incorrect value types, or missing required properties:

:::image type="content" source="media/configure-vs-code-extension-for-terraform/syntax-validation.png" alt-text="Screenshot showing inline schema error highlighting in an azapi_resource body.":::

## Paste ARM JSON as AzAPI configuration

If you have an Azure portal resource definition, an ARM template resource object, or a raw REST API response, you can paste it directly into a `.tf` file and the extension converts it to an `azapi_resource` block.

**Use this when**: You're authoring a new AzAPI resource and have an existing JSON definition to start from.

1. Copy the resource JSON or ARM template to the clipboard.
1. Open a `.tf` file and place your cursor at the insertion point.
1. Paste (`Ctrl`+`V` on Windows/Linux, `Cmd`+`V` on macOS). The extension detects the JSON format and converts it to `azapi_resource` HCL.

:::image type="content" source="media/configure-vs-code-extension-for-terraform/paste-json-as-config.png" alt-text="Screenshot showing a portal resource JSON being pasted and converted to an azapi_resource block.":::

For ARM templates that contain multiple resources, parameters, and variables, manual cleanup is usually required after conversion. Review the generated `type`, `body`, and `parent_id` before applying.

## Export existing Azure resources as Terraform

The extension integrates with `aztfexport` to export existing Azure resources to Terraform configuration and state, with a choice of AzureRM or AzAPI as the output provider.

**Use this when**: You have existing Azure resources that aren't managed by Terraform and want to bring them under Terraform management.

1. Open the Command Palette (`Ctrl`+`Shift`+`P` on Windows/Linux, `Cmd`+`Shift`+`P` on macOS).
1. Search for and select **Microsoft Terraform: Export Azure Resource as Terraform**.
1. Follow the prompts to select your subscription, resource group, and individual resources.
1. Select **azurerm** or **azapi** as the output provider.
1. The extension generates the Terraform configuration and opens it in a new editor tab.

You can also export resources directly from the Azure portal without installing any tools. See [Export a resource in the Azure portal](./azure-export-for-terraform/get-started-export-resources-portal.md). For full CLI usage of `aztfexport`, see the [Azure Export for Terraform overview](./azure-export-for-terraform/export-terraform-overview.md).

## Migrate AzureRM resources to AzAPI

The extension can generate AzAPI equivalents for `azurerm_*` resource blocks within a Terraform module, using guidance from the [azapi-lsp migration guide](https://github.com/Azure/azapi-lsp/blob/main/docs/migrate_to_azapi_in_module_guide.md).

**Use this when**: You're converting a module from AzureRM to AzAPI and want tooling assistance to author the equivalent `azapi_resource` blocks.

1. Open the `.tf` file containing the `azurerm_*` resource blocks.
1. Open the Command Palette and search for the migrate to AzAPI command, or use the in-editor code action when hovering over an `azurerm_*` resource block.
1. Review the generated output. Validate the `type`, `api-version`, and `body` structure against the [AzAPI provider registry documentation](https://registry.terraform.io/providers/Azure/azapi/latest/docs) before replacing the original blocks.

> [!IMPORTANT]
> This feature assists with HCL authoring only — it doesn't update the Terraform state file. If you replace `azurerm_*` blocks with `azapi_resource` blocks without updating state, Terraform treats the AzureRM resources as deleted and the AzAPI resources as new, causing re-creation of the underlying Azure resources.
>
> To migrate state alongside configuration, use `terraform state mv` for each resource after conversion, or add `import` blocks. Run `terraform plan` after each state change to confirm no unintended re-creation occurs.

For a complete guide covering all migration directions (including `aztfmigrate` for AzAPI → AzureRM), see [Migration paths between Azure, AzureRM, and AzAPI Terraform providers](how-to-migrate-between-azurerm-and-azapi.md).

## Preflight validation

The extension integrates with the `aztfpreflight` tool to validate your Terraform plan against Azure resource constraints before deployment.

**Use this when**: You want to catch configuration errors at plan time without deploying resources.

1. Ensure you're authenticated with `az login`.
1. Open the Command Palette and select **Microsoft Terraform: Preflight Validation**.
1. Select an existing plan file, or let the extension generate a new one.
1. The extension runs `aztfpreflight` against the plan and displays results in the terminal.

Preflight catches errors such as invalid property values, quota violations, and policy compliance failures before any resources are created or modified. For details on enabling preflight directly in the AzAPI provider configuration, see [Enable preflight validation in the AzAPI Terraform provider](how-to-use-azapi-preflight-validation.md).

## Generate required permissions

For `azurerm_*` resource blocks, the extension can generate the minimum IAM role assignments needed to deploy the resources.

1. Select one or more `azurerm_*` resource blocks in a `.tf` file.
1. Click the lightbulb icon that appears, and select the option to generate required permissions.
1. The extension generates the permission definitions and opens them in a new editor tab.

Ensure you're authenticated with `az login` before using this feature.

## Terraform command palette

All standard Terraform commands are available from the Command Palette and run in the integrated terminal:

| Command | Description |
|---|---|
| **Microsoft Terraform: init** | Initializes the Terraform working directory and downloads provider plugins. |
| **Microsoft Terraform: plan** | Creates a Terraform execution plan. |
| **Microsoft Terraform: apply** | Applies the Terraform execution plan. |
| **Microsoft Terraform: validate** | Validates the configuration files. |
| **Microsoft Terraform: refresh** | Updates the state file with the real-world state of resources. |
| **Microsoft Terraform: destroy** | Destroys all resources managed by the configuration. |
| **Microsoft Terraform: visualize** | Generates a graph visualization of the module and saves it as `graph.png`. |
| **Microsoft Terraform: Export Azure Resource as Terraform** | Exports existing Azure resources as Terraform configuration using `aztfexport`. |
| **Microsoft Terraform: Preflight Validation** | Runs preflight validation against a Terraform plan using `aztfpreflight`. |

## Next steps

> [!div class="nextstepaction"]
> [Migration paths between Azure, AzureRM, and AzAPI Terraform providers](how-to-migrate-between-azurerm-and-azapi.md)

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

## Additional reading

- [Install the Microsoft Terraform Visual Studio Code extension](configure-vs-code-extension-for-terraform.md)
- [Enable preflight validation in the AzAPI Terraform provider](how-to-use-azapi-preflight-validation.md)
- [Azure Export for Terraform overview](./azure-export-for-terraform/export-terraform-overview.md)

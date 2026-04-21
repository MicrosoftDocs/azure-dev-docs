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

Use the following table to identify which section applies to your scenario:

| Starting point | Goal | Recommended path |
|---|---|---|
| Existing Azure resources (not yet in Terraform) | Bring under Terraform management | [Export with `aztfexport`](#export-existing-azure-resources-to-terraform-with-aztfexport) |
| ARM template or Azure portal resource JSON | Author new AzAPI Terraform resources | [Paste as AzAPI in VS Code](#author-azapi-resources-from-arm-json-paste-as-azapi) |
| Existing Terraform config using AzAPI | Migrate to AzureRM provider | [Migrate with `aztfmigrate`](#migrate-azapi-resources-to-azurerm-with-aztfmigrate) |
| Existing Terraform config using AzureRM | Migrate to AzAPI provider | [VS Code AzureRM → AzAPI migration](#migrate-azurerm-resources-to-azapi-in-vs-code) |

For guidance on which provider should be primary for new projects, see [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md).

## Export existing Azure resources to Terraform with `aztfexport`

[Azure Export for Terraform (`aztfexport`)](./azure-export-for-terraform/export-terraform-overview.md) brings existing Azure resources—ones not currently managed by Terraform—under Terraform management. It generates both the HashiCorp Configuration Language (HCL) configuration and the Terraform state file so that `terraform plan` shows no diff after export.

`aztfexport` supports both the AzureRM and AzAPI providers as output targets. Choose the provider that matches your team's primary provider.

### Install `aztfexport`

Install `aztfexport` using one of the following methods:

#### [Windows](#tab/windows)

```console
winget install aztfexport
```

#### [macOS](#tab/macos)

```console
brew install aztfexport
```

#### [Linux (apt)](#tab/linux-apt)

```bash
curl -sSL https://packages.microsoft.com/keys/microsoft.asc > /etc/apt/trusted.gpg.d/microsoft.asc
apt-add-repository https://packages.microsoft.com/ubuntu/22.04/prod
apt-get install aztfexport
```

#### [Go toolchain](#tab/go)

```console
go install github.com/Azure/aztfexport@latest
```

---

### Export with the CLI

1. Authenticate to Azure:

    ```azurecli
    az login
    az account set --subscription <subscription_id>
    ```

1. Export a resource group to AzureRM (default) or AzAPI:

    ```console
    # Export as AzureRM (default)
    aztfexport resource-group <resource_group_name>

    # Export as AzAPI
    aztfexport resource-group --provider-name=azapi <resource_group_name>
    ```

    For a single resource, use `aztfexport resource <resource_id>`. For an Azure Resource Graph query, use `aztfexport query <ARG_where_predicate>`.

1. Review the generated `.tf` files and state, then run `terraform plan` to confirm no diff.

### Export with the VS Code extension

The [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md) provides a guided export experience backed by `aztfexport`:

1. Open the Command Palette (`Ctrl`+`Shift`+`P` on Windows/Linux, `Cmd`+`Shift`+`P` on macOS).
1. Search for and select **Microsoft Terraform: Export Azure Resource as Terraform**.
1. Follow the prompts to select your subscription, resource group, and individual resources.
1. Select **azurerm** or **azapi** as the output provider.
1. The extension generates the Terraform configuration and opens it in a new editor tab.

You can also export resources directly from the Azure portal without installing any tools. See [Export a resource in the Azure portal](./azure-export-for-terraform/get-started-export-resources-portal.md).

## Author AzAPI resources from ARM JSON (Paste as AzAPI)

If you have an Azure portal resource definition, an ARM template, or raw resource JSON and want to create a corresponding `azapi_resource` block, the Microsoft Terraform VS Code extension can convert it directly.

**Use this path when**: You're authoring net-new AzAPI resources and have an existing JSON definition to start from, such as a portal export, an ARM template, or a REST API response.

1. Install the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md).
1. Open a `.tf` file.
1. Copy the resource JSON or ARM template to the clipboard.
1. Place your cursor at the location in the file where you want to insert the block.
1. Paste (`Ctrl`+`V` / `Cmd`+`V`). The extension detects the JSON format and prompts to convert it to an `azapi_resource` block.

The extension converts properties to the `body` attribute format used by `azapi_resource` and attempts to infer the correct `type` and `api-version`. Review and adjust the generated block before applying.

> [!NOTE]
> This feature works best when pasting a single resource object. Full ARM templates with multiple resources, parameters, and variables may require manual cleanup after conversion.

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

## Migrate AzureRM resources to AzAPI in VS Code

The Microsoft Terraform VS Code extension includes a feature to generate AzAPI equivalents for existing AzureRM resource blocks within a module. This is useful when you're converting a module or configuration to use AzAPI as the primary provider.

**Use this path when**: You're converting a Terraform module from AzureRM to AzAPI and want tooling assistance to generate the equivalent `azapi_resource` blocks.

1. Install the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md).
1. Open the `.tf` file containing the `azurerm_*` resource blocks you want to convert.
1. Open the Command Palette and search for the migrate to AzAPI command, or use the in-editor code action.
1. Follow the prompts. The extension generates AzAPI equivalents and opens them for review.
1. Review the output carefully—validate the `type`, `api-version`, and `body` structure against the [AzAPI provider documentation](https://registry.terraform.io/providers/Azure/azapi/latest/docs) before replacing the original blocks.

> [!IMPORTANT]
> This feature assists with authoring—it doesn't update the Terraform state file. If you replace `azurerm_*` blocks with `azapi_resource` blocks in an existing configuration without updating state, Terraform treats the AzureRM resources as deleted and the AzAPI resources as new, which causes re-creation of the underlying Azure resources.
>
> To migrate state alongside configuration, manually use `terraform state mv` for each resource after converting the HCL, or re-import using the `import` block. Run `terraform plan` after each state change to confirm no unintended re-creation occurs.

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

---
title: Overview of Azure Export for Terraform
description: Learn the benefits and uses of Azure Export for Terraform
ms.topic: overview
ms.date: 05/10/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---

# Overview of Azure Export for Terraform

Azure Export for Terraform is a tool designed to help reduce friction in translation between Azure and Terraform concepts.

## Benefits

Azure Export for Terraform enables you to:

- **Simplify migration to Terraform on Azure**. Azure Export for Terraform allows you to migrate Azure resources to Terraform  using a single command.
- **Export user-specified sets of resources to Terraform HCL code and state with a single command**. Azure Export for Terraform enables you to specify a predetermined scope to export. The scope can be as granular as a single resource. You can also export a resource group and its nested resources. Finally, you can export an entire subscription.
- **Inspect preexisting infrastructure with all exposed properties.** Whether learning a newly released resource or investigating an issue in production, Azure Export for Terraform supports a read-only export with the option to expose all configurable resource properties.
- **Follow plan/apply workflow to integrate non-Terraform infrastructure into Terraform.** Export HCL code, inspect non-Terraform resources and easily integrate them into your production infrastructure and remote backends.

## Installation

The [Azure Export for Terraform GitHub page](https://github.com/Azure/aztfexport/releases) lists releases of the tool with links to installation for various platforms (Windows MSIs, Homebrew, and Linux installations) and the source code.

## Usage

At its most abstract, Azure Export is called as follows:

```console
aztfexport [command] [option] <scope>
```

The scope changes depending on the command being run, as do the available set of option flags. There are three commands that should be used based on what you are trying to export:

| Task | Description | Example |
|-|-|-|
| Export a single resource. | To export a single resource, specify the Azure resourceID associated with the resource. | aztfexport resource [option] &lt;resource id> |
| Export a resource group. | To export a resource group (and its nested resources), specify the resource group name; not the ID. | aztfexport resource-group [option] &lt;resource group name> |
| Export using a query. | The tool supports exporting with an Azure Resource Graph query. | aztfexport query [option] &lt;ARG where predicate> |

### Providers
While Azure Export defaults to the `azurerm` provider, you can also export the [`AzAPI `provider](../overview-azapi-provider.md):
```console
aztfexport [command] --provider-name=azapi [further options] <scope>
```

## Data-collection disclosure

By default, Azure Export for Terraform collects telemetry data. However, you can easily disable this process.

Microsoft aggregates collected data to identify patterns of usage to identify common issues and to improve the experience of Azure Export for Terraform. For example, the usage data helps identify issues such as commands with low success and helps prioritize our work. Azure Export for Terraform doesn't collect any private or personal data.

If you do want to disable data collection, run the following command after installing the tool:

```console
aztfexport config set telemetry_enabled false
```

## Next steps

**Concepts:**

[Azure Export for Terraform concepts](export-terraform-concepts.md): Learn the workflows of Azure Export for Terraform and its best practices and current design limitations.  

**Quickstart articles:**

- [Export your first resources using Azure Export for Terraform](export-first-resources.md)
- [Export Azure resources to HCL code using Azure Export for Terraform](export-resources-hcl.md)

**How-to articles:**

How-to articles explain more complex scenarios along with explanations and options:

- [Exploring customized resource selection and naming using Azure Export for Terraform](select-custom-resources.md)
- [Using Azure Export for Terraform in advanced scenarios](export-advanced-scenarios.md)

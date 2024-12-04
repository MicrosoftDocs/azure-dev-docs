---
title: 'Quickstart: Export Azure resources to HCL code using Azure Export for Terraform'
description: Learn how to use the Azure Export for Terraform tool to export Azure resources to HCL code.
author: stemamsft
ms.topic: quickstart
ms.date: 05/10/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---

# Quickstart: Export Azure resources into HCL code using Azure Export for Terraform

In the article, [Export your first resources using Azure Export for Terraform](export-first-resources.md), you learn how to export Azure resources into local state files using [Azure Export for Terraform](export-terraform-overview.md). In this article, you learn how to generate the Terraform configuration files from your Azure resources.

> [!div class="checklist"]
> * Create a test Azure resource group using Azure CLI or Azure PowerShell.
> * Create a test Linux virtual machine using Azure CLI or Azure PowerShell.
> * Export the resource group and virtual machine from Azure to HCL files.
> * Test that the local state matches the state of the resources in Azure.

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)
- [Install Azure Export for Terraform](https://github.com/azure/aztfexport)

## Create the test Azure resources

[!INCLUDE [Create sample VM](../includes/create-vm.md)]

## Understand the hcl-only flag

Azure Export for Terraform supports a flag - `--hcl-only` - that causes the generation of the following files from the exported resource(s):

- Generated `.tf` HCL files.
- Mapping file `aztfexportResourceMapping.json`.
- Skipped resources are listed in `aztfexportSkippedResources.txt`.

The `--hcl-only` flag is supported for all primary export commands used for exporting:

- resource
- resource-group
- query
- mapping-file

To view the available Azure Export for Terraform commands, run the following command:

```console
aztfexport --help
```

The `--hcl-only` flag is useful in scenarios where you don't need the state or aren't sure if you need to generate the state. To export all the generated configuration to state, run `aztfexport mapping-file`.

> [!TIP]
> When using the `--hcl-only` flag, target an empty directory to avoid making unwanted changes to any current state during the export stage.

## Export an Azure resource

You can run the `aztfexport` tool in one of two modes: interactive and non-interactive. For this demo, you use the non-interactive mode.

1. Create a directory in which to test.

1. Open a command prompt and navigate to the new directory.

1. Run `aztfexport resource-group` to export the resource group named `myResourceGroup`.

    ```console
    aztfexport resource-group --non-interactive --hcl-only myResourceGroup
    ```

> [!NOTE]
> Running Azure Export for Terraform can take several minutes to complete.

## Verify the results

After the tool has finished exporting your Azure resources, verify the following files in the directory where you ran Azure Export for Terraform:

- `main.tf` contains the HCL code that defines the exported resources.
- `aztfexportResourceMapping.json` contains the Azure/Terraform mappings. The mapping file includes the following information for each exported Azure resource: Azure resource ID, Terraform resource type, and Terraform resource name. The contents of the mapping file mirror what Azure Export for Terraform displays during the export process.
- `aztfexportSkippedResources.txt` contains the list of skipped resources. You shouldn't see this file for this example.

## Clean up resources

When you no longer need the resources created in this article, do the following steps:

1. Navigate to the directory containing your Terraform files for this article.

1. Run [terraform destroy](https://www.terraform.io/docs/commands/destroy.html).

    ```console
    terraform destroy
    ```

## Next steps

> [!div class="nextstepaction"]
> [How Azure Export for Terraform works](./export-terraform-concepts.md)

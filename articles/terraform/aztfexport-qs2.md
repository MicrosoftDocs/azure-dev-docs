---
title: Export Resources into HCL Code
description: Export resources into HCL code.
keywords: azure export terraform hcl resource
ms.topic: quickstart
ms.date: 04/05/2023
ms.author: stema
ms.custom: devx-track-terraform
---
# Quickstart: Export Resources into HCL Code Using Azure Export for Terraform
This quickstart walks you through how to use the `--hcl-only` flag to export HCL files using Azure Export for Terraform.

## Understanding `--hcl-only`
For any of Azure Export's primary commands (`resource`, `resource-group`, `query`, `mapping-file`), users can add the `--hcl-only` flag:
```terminal
aztfexport [command] --hcl-only [other options] <scope>
```
Though `aztfexport` will by default export a state file, using the `--hcl-only` flag results in only the following being generated:
- Any generated `.tf` HCL files
- The mapping file `aztfexportResourceMapping.json`
- Any skipped resources in a `aztfexportSkippedResources.txt`

Running `--hcl-only` does **not** modify the user workflow (e.g. press <kbd>w</kbd> to import within the UI), only the final output.
## When to Use `--hcl-only`
`--hcl-only` helps for scenarios where you may not need the state or are not sure you want to generate the state. If you then wish to export all of the generated configuration to state, you can rerun the tool and utilize `aztfexport mapping-file` to do so.  
> 💡 `--hcl-only` must target an empty directory to avoid making unwanted changes to preexisting state during the export stage (thus it will not work with `--append`, but will work with `--overwrite`). Use the `-o` flag to specify an empty directory (if the directory does not exist, it will be created).

## Usage
To export HCL only for a resource group non-interactively:
```console
aztfexport rg -n --hcl-only myResourceGroup
```
To then export the resource group to an existing set of resources (i.e. production environment), follow [this tutorial](aztfexport-ht2.md/#export-azure-resources-to-an-existing-terraform-environment).

## Summary
In this tutorial, you learned how to export resources using the `--hcl-only` flag, as well as when you should use the flag.
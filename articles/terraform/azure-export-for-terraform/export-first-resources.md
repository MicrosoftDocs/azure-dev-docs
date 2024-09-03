---
title: 'Quickstart: Export your first resources using Azure Export for Terraform'
description: Export your first resources using Azure Export for Terraform on a resource group, both interactively and non-interactively. 
author: stemamsft
ms.topic: quickstart
ms.date: 05/10/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---

# Quickstart: Export your first resources using Azure Export for Terraform

This article shows how to export Azure resources into local state files using [Azure Export for Terraform](./export-terraform-overview.md).

> [!div class="checklist"]
> * Create a test Azure resource group using Azure CLI or Azure PowerShell.
> * Create a test Linux virtual machine using Azure CLI or Azure PowerShell.
> * Export the state for the resource group and virtual machine from Azure to the local state file.
> * Test that the local state matches the state of the resources in Azure.

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)
- [Install Azure Export for Terraform](https://github.com/azure/aztfexport)

## Create the test Azure resources

[!INCLUDE [Create sample VM](../includes/create-vm.md)]

## Export an Azure resource

You can run the `aztfexport` tool in one of two modes: interactive and non-interactive. For this demo, you use the interactive mode.

1. Create a directory in which to test.

1. Open a command prompt and navigate to the new directory.

1. Run `aztfexport resource-group` to export the resource group named `myResourceGroup`.

    ```console
    aztfexport resource-group myResourceGroup
    ```

1. After the tool initializes, a list of the resources to be exported is displayed. Each line has an Azure resourceID matched to the corresponding AzureRM resource type. The list of available commands displays at the bottom of the display. Using one of the commands, scroll to the bottom and verify that the expected Azure resources are properly mapped to their respective Terraform resource types.

1. Press `w` to run the export.

    **Key points:**
    - For a non-interactive resource, add the `--non-interactive` flag: `aztfexport rg --non-interactive myResourceGroup`.

> [!NOTE]
> Running Azure Export for Terraform can take several minutes to complete.

## Verify the results

After the tool has finished exporting your Azure resources, run the following commands in the same directory that contains the generated files.

1. Run [terraform init](https://developer.hashicorp.com/terraform/cli/commands/init).

    ```console
    terraform init --upgrade
    ```

1. Run [terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan).

    ```console
    terraform plan
    ```

If the terminal outputs **No changes needed**, then congratulations!

Your infrastructure and its corresponding state have been successfully exported to Terraform.

## Clean up resources

When you no longer need the resources created in this article, do the following steps:

1. Navigate to the directory containing your Terraform files for this article.

1. Run [terraform destroy](https://www.terraform.io/docs/commands/destroy.html).

    ```console
    terraform destroy
    ```

## Next steps

> [!div class="nextstepaction"]
> [Export resources into HCL code using Azure Export for Terraform](./export-resources-hcl.md)

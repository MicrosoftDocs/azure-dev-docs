---
title: Using Azure Export for Terraform in advanced scenarios
description: Learn how to append resources and use remote backends 
ms.topic: how-to
ms.date: 05/10/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---

# Using Azure Export for Terraform in advanced scenarios

This article explains how to do some of the more advanced tasks with Azure Export for Terraform.

> [!div class="checklist"]
> * Append resources to existing Terraform environments.
> * Export resources into an existing Terraform environment with a remote backend state

## Appending to existing resources

By default, Azure Export for Terraform ensures the output directory is empty to avoid any conflicts with existing user files. If you need to import resources to an existing state file, add the `--append` flag.

```console
aztfexport [command] --append <scope>
```

When the `--append` flag is specified, Azure Export for Terraform verifies if there's a pre-existing `provider` or `terraform` block in any of the files in the current directory. If not, the tool creates a file for each block and then proceeds with exporting. If the output directory has a state file, any exported resources are imported into the state file.

Additionally, the file generated has a `.aztfexport` suffix before the extension - such as `main.aztfexport.tf` - to avoid potential file name conflicts.

If you run `aztfexport --append` multiple times, a single `main.aztfexport.tf` is created with the export results appended to the file each time the command is run.

## Bring your own Terraform configuration

By default, Azure Export for Terraform uses a local backend to store the state file. However, it's also possible to use a remote backend. Azure Export for Terraform enables you to define your own `terraform` or `provider` blocks to pass. 

Define these blocks in a `.tf` file within your target directory, export with the `--append` flag, and your config exports to the specified backend and provider version (if it's provided). 

> [!IMPORTANT]
> If the specified version of AzureRM doesn't match your installed version when exporting, the command fails.

### Azure Storage example

This example is based on the article, [Store Terraform state in Azure Storage](../store-state-in-azure-storage.md).

```console
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
    backend "azurerm" {
        resource_group_name  = "tfstate"
        storage_account_name = "storageacc"
        container_name       = "tfstate"
        key                  = "terraform.tfstate"
    }

}

provider "azurerm" {
  features {}
}
```

### Terraform Cloud example

```terraform
terraform {
  cloud {
    organization = "aztfexport-test"
    workspaces {
      name = "aztfexport-playground"
    }
  }
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}
provider "azurerm" {
  features {
  }
}
```

### Inline experience

To export to a backend inline, use the `--backend-type` and `--backend-config` options. For more information about configuring a Terraform backend, see [Terraform backend configuration](https://developer.hashicorp.com/terraform/language/backend).

Using our Azure storage account example, you need the following as defined in [the AzureRM backend documentation](https://www.terraform.io/language/settings/backends/azurerm#azurerm). 

- Resource group name
- Storage account name
- Storage container name

Pass these parameters into the command along with your backend type:

```console
aztfexport [subcommand] --backend-type=azurerm \
                        --backend-config=resource_group_name=<resource group name> \
                        --backend-config=storage_account_name=<account name> \
                        --backend-config=container_name=<container name> \
                        --backend-config=key=terraform.tfstate 
```

**Key points:**

- In the previous example, I'm using the Unix line continuation character so that the code displays well in the browser. You might need to change these characters to match your command-line environment - such as PowerShell - or combine the command onto one line.
- If the backend state already exists, Azure Export for Terraform merges the new resources with the existing state automatically. You don't need to specify the `--append` option inline.

## Export Azure resources to an existing Terraform environment

Now, let's put it all together! Imagine new resources have been created outside of Terraform that need to be moved into Terraform management. To complete the section, make sure you have a backend configured. This tutorial uses the same configuration that is specified in the [Azure storage remote state tutorial](../store-state-in-azure-storage.md).

1. In the parent directory of where you want the temporary directory created, run the following command:

    ```console
    aztfexport resource -o tempdir --hcl-only <resource_id>
    ```
    
    **Key points:**
    
    - The  `-o` flag specifies to create the directory if it doesn't exist.
    - The `--hcl-only` flag specifies to export the configured resources to HCL
    
1. After inspecting that the resource can be appended, utilize the generated mapping file and the `--append` flag to ensure Azure Export respects the pre-existing remote state and provider versions within our existing environment:

    ```console
    aztfexport map --append `./tempdir/aztfexportResourceMapping.json`
    ```
    
1. Run [terraform init](https://developer.hashicorp.com/terraform/cli/commands/init).

    ```console
    terraform init --upgrade
    ```

1. Run [terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan).

1. Azure Export for Terraform should display **No changes needed**.

Congratulations! Your infrastructure and its corresponding state have been successfully appended to your Terraform environment.

If your plan runs into issues, see [Azure Export for Terraform concepts](./export-terraform-concepts.md#limitations) to understand limitations regarding deploying code generated by `--hcl-only`. If that article doesn't help you, open a [GitHub issue](https://github.com/Azure/aztfexport/issues).

## Next steps

> [!div class="nextstepaction"]
> [Azure Export for Terraform concepts](./export-terraform-concepts.md)

---
title: Azure Export for Terraform concepts
description: Learn how Azure Export for Terraform works, best practices, and limitations around the tool.
ms.topic: concept-article
ms.date: 05/10/2023
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
---

# How Azure Export for Terraform Works

This article introduces you to the [Azure Export for Terraform](./export-terraform-overview.md) workflows. In this article, you learn about the tool's best practice guidance, current limitations, and how to mitigate those limitations.

## Interactive mode

By default, Azure Export for Terraform runs in interactive mode. When you run in interactive mode, the available keyboard shortcuts are listed at the bottom of the display.

| Task                                                                                                    | Keyboard shortcut(s)                                     |
|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| **Navigation**                                                                                          |                                                          |
| Select previous item in the resource list.                                                              | <kbd>↑</kbd> -or- <kbd>k</kbd>                           |
| Select next item in the resource list.                                                                  | <kbd>↓</kbd> -or- <kbd>j</kbd>                           |
| Move to previous page in the resource list.                                                             | <kbd>←</kbd> -or- <kbd>h</kbd> -or- <kbd>Page Up</kbd>   |
| Move to next page in the resource list.                                                                 | <kbd>→</kbd> -or- <kbd>l</kbd> -or- <kbd>Page Down</kbd> |
| Jump to the start of the resource list.                                                                 | <kbd>g</kbd> -or- <kbd>Home</kbd>                        |
| Jump to the end of the resource list.                                                                   | <kbd>G</kbd> -or- <kbd>End</kbd>                         |
| **Selecting resources to skip**                                                                         |                                                          |
| Skip resource (or unskip if marked as "Skip")                                                           | <kbd>Delete</kbd>                                        |
| **Filter operations**                                                                                   |                                                          |
| Define a filter by text on the resource list.                                                           | <kbd>/</kbd>                                             |
| Clear any current filter                                                                                | <kbd>Esc</kbd>                                           |
| **Save operations**                                                                                     |                                                          |
| Save a mapping file of the resource list. The output file is affected by skipping (but not filtering).  | <kbd>s</kbd>                                             |
| Export resources to state (if `--hcl-only` isn't specified) and generates the config.                   | <kbd>w</kbd>                                             |
| **User experience**                                                                                     |                                                          |
| Display recommendations for current resource.                                                           | <kbd>r</kbd>                                             |
| Show resource export errors (if any).                                                                   | <kbd>e</kbd>                                             |
| Display help.                                                                                           | <kbd>?</kbd>                                             |
| **Quit**                                                                                                |                                                          |
| Quit interactive mode.                                                                                  | <kbd>q</kbd>                                             |

For each resource, Azure Export for Terraform tries to recognize the corresponding Terraform resource type. If it finds a match, the line is marked with the following indicator: 💡.

If the resource can't be resolved, you need to input the Terraform resource address in the following form: `<resource type>.<resource name>`. For example, `azurerm_linux_virtual_machine.test` refers to a Terraform resource type of [azurerm_linux_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine) while the `test` refers to the name for the virtual machine used in the configuration files.

To see the available resource type(s) for the selected resource, press <kbd>r</kbd>.

In some cases, there are Azure resources that have no corresponding Terraform resources, such as if the resource lacks Terraform support. Some resources might also be created as a side effect of provisioning another resource - such as the OS Disk resource that is created when provisioning a virtual machine. In these cases, you can skip the resources without assigning anything.

After going through all the resources to be imported, press <kbd>w</kbd> to begin generating the Terraform configuration and (if `--hcl-only` isn't selected) importing to Terraform state.

### Non-interactive mode

By default, Azure Export for Terraform runs in interactive mode. To specify that the tool should run in non-interactive mode, specify the `--non-interactive` flag.

```console
aztfexport [command] --non-interactive <scope>
```

> [!IMPORTANT]
> If the directory in which you're running Azure Export for Terraform isn't empty, you must add the `--overwrite` flag to use the `--hcl-only` flag.

## Best practices on core workflows

On a fundamental level, any user of Azure Export faces a decision between two options:

- [Export existing resources into state](export-first-resources.md)
- [Export existing resources into HCL](export-resources-hcl.md)

The following subsections provide guidance as to which option to take based on the scenario.

### Managing infrastructure

You may not need to export to state if you haven't verified the configured resources behave within your environment in the desired manner.

If you're sure you wish to manage the set of resources in Terraform with `terraform init plan apply` workflows, exporting to state is essential.

If you aren't sure you want to manage the resources yet, passing the `--hcl-only` flag is recommended.

### Existing infrastructure

In scenarios where you're exporting to existing Terraform environments, it may be helpful to think of `--hcl-only` as a [terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan) equivalent, especially before appending to existing environments.

The [`terraform apply`](https://developer.hashicorp.com/terraform/cli/commands/apply) command equates to exporting resources - during which their config ties into the pre-existing state. In this scenario, using a mapping file saves run time to list and map resources.

### Discovering infrastructure

If you aren't sure what resources exist within an environment, you can verify by specifying the `--generate-mapping-file` flag. For more information about this subject, see [Exploring customized resource selection and naming using Azure Export for Terraform](select-custom-resources.md).

## Limitations

Azure Export for Terraform is a complex tool that attempts to convert Azure infrastructure into Terraform code and state. Its current known limitations are explained in the following subsections.

### Cross-property constraints

The [AzureRM provider](https://github.com/hashicorp/terraform-provider-azurerm) can set two properties that conflict with each other. When Azure Export for Terraform reads conflicting properties, it may set both properties to the same value despite the user only configuring one. Further complications emerge when multiple cross-property constraints exist within the same generated configuration. You must know where cross-property conflicts exist within your configuration in order to mitigate this issue.

### Infrastructure outside resource scope

When you're using Azure Export for Terraform to target resource scopes, resources required for the config might exist outside of the scope specified. One example is a role assignment. The user needs to identify resources that are outside of scope.

### Write-only properties

Azure Export can't generate write-only properties (such as passwords) within its config. You need to know about the write-only properties and define them in a configuration to create new sets of resources.

## Modifying code to match coding standards

There are a few necessary operations if the user wishes to modify their code to abide by coding standards. These steps would only be necessary if the user plans to use the code in nonsandbox environments.

### Property-defined resources

Certain resources in Azure can be defined as either a property in a parent Terraform resource or an individual Terraform resource. One example is a subnet. Azure Export for Terraform defines the resource as an individual resource, but it's best practice to match your existing coding configuration.

### Explicit dependencies

Azure Export for Terraform is currently able to declare only explicit dependencies. You must know the mapping of the relationships between resources to refactor the code to include any needed implicit dependencies.

### Hardcoded values

Azure Export for Terraform currently generates hard-coded strings. As a best practice, you should refactor these values to variables. Also, when you use the `--full-properties` flag to expose all properties, some sensitive information (such as secrets) can be seen in the generated config. Use recommended practices to protect the visibility of this code.

## Next steps

> [!div class="nextstepaction"]
> [Export your first resources using Azure Export for Terraform](export-first-resources.md)

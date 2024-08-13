---
title: Customized resource selection and naming using Azure Export for Terraform
description: Understand how to customize resource selection and filtering with Azure Export for Terraform.
ms.topic: how-to
ms.author: stema
ms.custom: devx-track-terraform,devx-track-export-terraform
ms.date: 05/10/2023
---

# Customized resource selection and naming using Azure Export for Terraform

Azure Export for Terraform provides various options to customize which resources you export.

In this article, you learn pros and cons for each option.

> [!div class="checklist"]
> * Using the UI
> * Using Query Mode
> * Using a Mapping File

## Using the user interface

When you run Azure Export for Terraform in interactive mode, the specified resources (via the parameters you specify when running) display. By default, all of the resources are exported.

The <kbd>Delete</kbd> acts as a toggle in skipping or including resources. To remove resources from being exported, use the arrow keys to select the desired resource and press <kbd>Delete</kbd>. The resource is updated to display "Skip".

To undo the skip action, verify the skipped resource is selected, and press <kbd>Delete</kbd> again.

**Pros:**

- Requires the use of a single toggle key.
- Don’t need to know the resources you want before running the command.

**Cons:**

- Action can be time consuming if you have many resources to scroll through and skip.

## Using query mode

Applying a filter using [Azure Resource Graph query syntax](/azure/governance/resource-graph/samples/starter) is a powerful technique when you know exactly what filters you need.

```console
aztfexport query [option] <ARG_where_predicate>
```

As an example, let's say you have a resource group named `myResourceGroup` that has many resources including a network resource. If you want to export only the network resource, you could use the following syntax:

```console
aztfexport query -n "resourceGroup =~ 'myResourceGroup' and type contains 'Microsoft.Network'"
```

Pros:

- Single command with no manual editing required.
- Supports an unlimited number of filters.
- Handles large amount of resources efficiently.

Cons:

- Easy to exclude resources you need to export.
- Requires knowledge of Azure Resource Graph syntax.

## Using a mapping file

The following syntax shows the basics to export a set of resources that is defined in a resource mapping file:

```console
aztfexport mapping-file [option] <resource_mapping_file>
```

You can use a mapping file in either interactive or non-interactive modes:

- **Interactive mode:** Press <kbd>s</kbd> when running interactively in the resource list view.
- **Non-interactive mode:** You can generate the mapping file in all export commands (`resource`, `resource-group`, `query`, `mapping file`) by adding the `--generate-mapping-file` flag.

If your use cases require pre-export modifications, you can manually construct or edit the mapping file. Here are some examples of when you would want to manually edit your own mapping file:

| Use-case | Steps |
|-|-|
| You have many resources in a resource group but only need to export a select few. | Delete the JSON objects from your editor of choice and save the file before exporting. |
| You want to rename all your resources in a consistent manner. | Change the `resource-name` property to whatever name matches your company compliance standards. |
| You need to refactor a set of resources by their resource type - such as networking or compute. | Use your editor to find all `Microsoft.Network` or `Microsoft.Compute` resources. |

For example, let's say you run the following command for a resource group that contains a virtual machine:

```console
aztfexport rg --generate-mapping-file --non-interactive myResourceGroup
```

The results are similar to the following JSON file:

```JSON
{
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup/extensions/OmsAgentForLinux": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup/extensions/OmsAgentForLinux",
		"resource_type": "azurerm_virtual_machine_extension",
		"resource_name": "res-0"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup",
		"resource_type": "azurerm_resource_group",
		"resource_name": "res-1"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/sshPublicKeys/vm-MyResourceGroup_key": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/sshPublicKeys/vm-MyResourceGroup_key",
		"resource_type": "azurerm_ssh_public_key",
		"resource_name": "res-2"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup",
		"resource_type": "azurerm_linux_virtual_machine",
		"resource_name": "res-3"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146",
		"resource_type": "azurerm_network_interface",
		"resource_name": "res-4"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146/networkSecurityGroups/L3N1YnNjcmlwdGlvbnMvZGJmM2I2Y2ItYzFkMC00ZDA0LTk0YjktNTE1MDliOGQzM2ZkL3Jlc291cmNlR3JvdXBzL2hhc2hpY29uZi12bS1kZW1vL3Byb3ZpZGVycy9NaWNyb3NvZnQuTmV0d29yay9uZXR3b3JrU2VjdXJpdHlHcm91cHMvdm0taGFzaGljb25mLXZtLWRlbW8tbnNn": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146|/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg",
		"resource_type": "azurerm_network_interface_security_group_association",
		"resource_name": "res-5"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg",
		"resource_type": "azurerm_network_security_group",
		"resource_name": "res-6"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/vm-MyResourceGroup-ip": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/vm-MyResourceGroup-ip",
		"resource_type": "azurerm_public_ip",
		"resource_name": "res-7"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet",
		"resource_type": "azurerm_virtual_network",
		"resource_name": "res-8"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet/subnets/default": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet/subnets/default",
		"resource_type": "azurerm_subnet",
		"resource_name": "res-9"
	}
}
```

Only the object value in the mapping file has significance. The key (defaults to the Azure `resource_id`) is just an identifier in this mode.

Now, let's say we want to keep the resource group and any compute-related resources, and modify the `resource_name` value.

We could update the mapping file as follows:

```JSON
{
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup",
		"resource_type": "azurerm_resource_group",
		"resource_name": "myResourceGroup"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
		"resource_type": "azurerm_linux_virtual_machine",
		"resource_name": "myVM"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/sshPublicKeys/myKey": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/sshPublicKeys/myKey",
		"resource_type": "azurerm_ssh_public_key",
		"resource_name": "myKey"
	},
	"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-myResourceGroup/extensions/OmsAgentForLinux": {
		"resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-myResourceGroup/extensions/OmsAgentForLinux",
		"resource_type": "azurerm_virtual_machine_extension",
		"resource_name": "myVMExtension"
	}
}
```

Once you edit the mapping file, you export the mapping file using the following command:

```console
aztfexport map -n "aztfexportResourceMapping.json"
```

**Pros:**

- Since you're editing a file, you can use an editor to find and replace what you need to remove or edit.
- JSON output enables unique functionality - such as scripting to filter.
- Can rename resources to match your naming standards.
- Can refactor JSON into multiple mapping files.
- Handles large amounts of resources well.

**Cons:**

- For simple scenarios, this technique might be overkill.
- Requires manual modifications.

## Using Terraform `import` Blocks

When running `aztfexport` `v0.13` or greater alongside Terraform `v1.5` or greater, the `--generate-mapping-file` or `-g` command generates a mapping file alongside a `import.tf` file. The `import.tf` file includes import blocks for each of the resources `aztfexport` was able to map. From this point on the behavior of the configuration is identical to [the preexisting import block workflow](https://developer.hashicorp.com/terraform/language/import). To finish, run `terraform plan`.

To then delete or filter resources from the resulting export, you can delete the block containing the resource's ID and other information.

### Comparing Import Blocks and Azure Export

A common question is the difference between using Azure Export for Terraform and import blocks. The benefits between the two tools we've noticed include:
- Azure Export for Terraform aids in resource discovery. There are various methods available to help discover and export the resources you want.
- Azure Export for Terraform provides resource filtering, also through manual and automated means.
- Azure Export for Terraform auto-generates import blocks with its outputs, saving time and effort on the authoring process.
- Terraform import blocks are natively supported in Terraform, which makes them easy to use.
Combined together, we believe that the use of both provides tremendous benefit to you.

**Pros:**

- Native Terraform supported workflow. No JSON needed.
- Since you're editing a file, you can use an editor to find and replace what you need to remove or edit.
- Can rename resources to match your naming standards.
- Handles large amounts of resources well.

**Cons:**

- For simple scenarios, this technique might be overkill.
- Requires manual modifications to filter.
- Does not work with older versions of Terraform.

## Summary

In this article, you learned about the various options to filter resources when exporting with Azure Export for Terraform.

## Next steps

> [!div class="nextstepaction"]
> [Using Azure Export for Terraform in advanced scenarios](./export-advanced-scenarios.md)

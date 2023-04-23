---
title: Customized resource selection and naming using Azure Export for Terraform
description: Understand how to customize resource selection and filtering, as well as when to use various methods with Azure Export for Terraform.
keywords: azure export terraform filtering selection resource naming
ms.topic: how-to
ms.date: 04/05/2023
ms.author: stema
ms.custom: devx-track-terraform
---
# Customized resource selection and naming using Azure Export for Terraform

Azure Export for Terraform provides various options to customize which resources you export:

- Using the UI
- Using Query Mode
- Using a Mapping File

This guide provides quickstarts along with pros and cons for each option.

## Using the user interface

Simply use the arrow keys while in the UI to navigate to a resource, then press delete to skip the resource. Then, you can import as normal. To undo, press delete again.

Pros:
-	Easy and simple; one Delete button is all you need
-	Don’t need to know the resources you want before running the command

Cons:
-	Time consuming for lots of resources

## Using query mode

Automate filtering by exporting with an Azure Resource Graph query. You'd want to do this when you know exactly what filters to apply on the set of resources.

```console
aztfexport query [option] <ARG where predicate>
```

For example, to only export networking resources in a resource group:
```console
aztfexport query -n "resourceGroup =~ 'myResourceGroup' and type contains 'Microsoft.Network'"
```

Pros:
-	Single command with no manual editing required
-	Supports however many filters you wish to apply
-	Handles large amount of resources well

Cons:
-	Could filter out resources you wish to export
-	Requires knowledge of Azure Resource Graph

## Using a mapping file

`aztfexport mapping-file [option] <resource mapping file>` exports a set of resources that is defined in the resource mapping file. You can generate the mapping file in all other modes (i.e. `resource`, `resource-group`, `query`) by specifying the `--generate-mapping-file` option when running non-interactively, or press <kbd>s</kbd> when running interactively in the resource list view. Also, each run of `aztfexport` will generate the resource mapping file for you, to record what resources have been imported.

If your use cases require pre-export modifications, you are not only welcome but also encouraged to manually construct or edit the mapping file. You could want to modify the mapping file if you:
- Have many resources in a resource group but only wish to export a select few. Simply delete the JSON objects from your editor of choice and save the file before exporting.
- Wish to rename all your resources in a compliant manner. Change the `resource-name` property to whatever name matches your company compliance standards.
- Want to refactor a set of resources by their given resource type, such as networking or compute. Use your editor to find all `Microsoft.Network` or `Microsoft.Compute` resources, respectively.
- Other workflows you might discover

For example, the following output is from a `-g` run on a VM resource group:
```JSON
{
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup/extensions/OmsAgentForLinux": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup/extensions/OmsAgentForLinux",
		"resource_type": "azurerm_virtual_machine_extension",
		"resource_name": "res-0"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup",
		"resource_type": "azurerm_resource_group",
		"resource_name": "res-1"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/sshPublicKeys/vm-MyResourceGroup_key": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/sshPublicKeys/vm-MyResourceGroup_key",
		"resource_type": "azurerm_ssh_public_key",
		"resource_name": "res-2"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-MyResourceGroup",
		"resource_type": "azurerm_linux_virtual_machine",
		"resource_name": "res-3"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146",
		"resource_type": "azurerm_network_interface",
		"resource_name": "res-4"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146/networkSecurityGroups/L3N1YnNjcmlwdGlvbnMvZGJmM2I2Y2ItYzFkMC00ZDA0LTk0YjktNTE1MDliOGQzM2ZkL3Jlc291cmNlR3JvdXBzL2hhc2hpY29uZi12bS1kZW1vL3Byb3ZpZGVycy9NaWNyb3NvZnQuTmV0d29yay9uZXR3b3JrU2VjdXJpdHlHcm91cHMvdm0taGFzaGljb25mLXZtLWRlbW8tbnNn": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/vm-myResourceGroup-vm-d146|/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg",
		"resource_type": "azurerm_network_interface_security_group_association",
		"resource_name": "res-5"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/networkSecurityGroups/vm-MyResourceGroup-nsg",
		"resource_type": "azurerm_network_security_group",
		"resource_name": "res-6"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/vm-MyResourceGroup-ip": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/vm-MyResourceGroup-ip",
		"resource_type": "azurerm_public_ip",
		"resource_name": "res-7"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet",
		"resource_type": "azurerm_virtual_network",
		"resource_name": "res-8"
	},
	"/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet/subnets/default": {
		"resource_id": "/subscriptions/0000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyResourceGroup-vnet/subnets/default",
		"resource_type": "azurerm_subnet",
		"resource_name": "res-9"
	}
}
```
Note that only the object value in the mapping file matters, while the key (defaults to the Azure `resource_id`) just plays as an identifier in this mode.

We can choose to keep the resource group and any compute related resources and modify the `resource_name`. This results in the following:
```JSON
{
	"/subscriptions/0000/resourceGroups/myResourceGroup": {
		"resource_id": "/subscriptions/0000/resourceGroups/myResourceGroup",
		"resource_type": "azurerm_resource_group",
		"resource_name": "myResourceGroup"
	},
	"/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM": {
		"resource_id": "/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
		"resource_type": "azurerm_linux_virtual_machine",
		"resource_name": "myVM"
	},
	"/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/sshPublicKeys/myKey": {
		"resource_id": "/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/sshPublicKeys/myKey",
		"resource_type": "azurerm_ssh_public_key",
		"resource_name": "myKey"
	},
	"/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-myResourceGroup/extensions/OmsAgentForLinux": {
		"resource_id": "/subscriptions/0000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/vm-myResourceGroup/extensions/OmsAgentForLinux",
		"resource_type": "azurerm_virtual_machine_extension",
		"resource_name": "myVMExtension"
	}
}
```
To then export this mapping file, the user can run:
```console
aztfexport map -n "aztfexportResourceMapping.json"
```
Note that you can also change the name of the JSON and pass in that new name instead.

Pros:
-	JSON output enables certain functionality (i.e. scripting to filter)
-	Can rename resources to compliant standards
-	Code-editor compatible, can use find and replace commands
-	Can refactor JSON into multiple mapping files
-	Handles large amounts of resources well

Cons:
-	Can overcomplicate if the filtering process is simpler or on less resources
-	Requires manual modifications

## Summary

In this how-to you learned about the three different options to filter resources when exporting with Azure Export for Terraform, along with their pros and cons.

| Method | Pros | Cons |
|--------|------|------|
| User Interface|- Easy and simple; one <kbd>Delete</kbd> button is all you need <br>- Don’t need to know the resources you want before running the command| - Time consuming for lots of resources|
| Query Mode|-	Single command with no manual editing required <br> - Supports however many filters you wish to apply <br> - Handles lots of resources well |- Could filter out resources you wish to export <br> - Requires knowledge of Azure Resource Graph|
|Mapping file|-	JSON output enables certain functionality (i.e. scripting to filter) <br> - Can rename resources to compliant standards <br> - Code-editor compatible, can use find and replace commands <br> - Can be refactored into multiple mapping files <br> - Handles large amounts of resources well | -	Can overcomplicate if the filtering process is simpler or on less resources <br> - Requires manual modifications

---
title: How Azure Export for Terraform Works
description: Learn how Azure Export for Terraform works, best practices, and limitations around the tool.
keywords: azure export terraform limitation
ms.topic: overview
ms.date: 04/05/2023
ms.author: stema
ms.custom: devx-track-terraform
---
# How Azure Export for Terraform Works
This article introduces to the user the workflows of Azure Export for Terraform. It gives best practice guidance and documents limitations of the tool.
## Workflows
The are three options that specify the scope of resources to be exported:

- Use `resource` to export singular Azure resources.
- Use `resource-group` to export an entire Azure resource group's resources
- Use `query` to export at an Azure subscription level with filters

For each of these commands, use the `--help` command to show all available options.
### Export a single resource
To export a single resource, simply specify the Azure resourceID associated with the resource:
```console
aztfexport res [option] <resource id>
```
### Export a resource group
To export a resource group, specify the resource group name, not ID:
```console
aztfexport rg [option] <resource group name>
```
### Export using a query
The tool supports exporting with an Azure Resource Graph query: 
```console
aztfexport query [option] <ARG where predicate>
```
Visit [this tutorial] to see how to use the query mode to export resources with automated filtering.
## Interactive and Non-Interactive
### Interactive Mode
By default `aztfexport` runs in interactive mode, which lists all the resources residing in the specified resource group or customized set.  
Here's a list of possible commands in interactive mode. All keystrokes that perform the same action are listed together.  

- <kbd>&#8593;</kbd><kbd>k</kbd> navigate up in the resource list
- <kbd>&#8595;</kbd><kbd>j</kbd> navigate down in the resource list
- <kbd>&#8592;</kbd><kbd>h</kbd><kbd>PgUp</kbd> goes to previous page in the resource list
- <kbd>&#8594;</kbd><kbd>l</kbd><kbd>PgDn</kbd>  goes to next page in the resource list
- <kbd>g</kbd><kbd>Home</kbd> jumps to the start of the resource list
- <kbd>G</kbd><kbd>End</kbd> jumps to the end of the resource list
- <kbd>/</kbd> allows you to define/apply a filter by text on the resource list
- <kbd>Esc</kbd> clears any current filter
- <kbd>Delete</kbd> skips the currently highlighted item. The resource gets skipped when <kbd>w</kbd> is pressed. If you skip a resource on accident, press <kbd>Delete</kbd> again to recover it.
- <kbd>s</kbd> saves a mapping file of the resource list. This file's generated list isn't affected by filtering, but is affected by skipping.
- <kbd>w</kbd> exports resources to state (if `--hcl-only` isn't selected) and generates the config
- <kbd>r</kbd> shows possible recommendations for a resource
- <kbd>e</kbd> shows errors (if any) on exporting a resource
- <kbd>q</kbd> quits out of interactive mode
- <kbd>?</kbd> opens help

For each resource, `aztfexport` tries to recognize the corresponding Terraform resource type. If it finds one, it marks the line with 💡 as an indicator. Otherwise, user is expected to input the Terraform resource address in form of `<resource type>.<resource name>` (such as `azurerm_linux_virtual_machine.test`). Users can press <kbd>r</kbd> to see the possible resource type(s) for the selected resource.

In some cases, there are Azure resources that have no corresponding Terraform resources, such as if the resource lacks Terraform support. Some resources might also be created as a side effect of provisioning another resource, like the OS Disk resource when provisioning a VM. In these cases, you can skip the resources without assigning anything.

After going through all the resources to be imported, press <kbd>w</kbd> to begin generating the Terraform configuration and (if `--hcl-only` isn't selected) importing to Terraform state.

### Non-interactive mode
Use the `--non-interactive` or `-n` command to use the tool functionality in scripts or to avoid opening the UI.
```console
aztfexport [command] -n <scope>
```
This command must be used in combination with the `-f` or `--overwrite` flag if the existing directory isn't empty, or the command fails.

## Best Practices on Core Workflows
On a fundamental level, any user of Azure Export faces a decision between two choices:  
- [Export existing resources into HCL and state](aztfexport-qs1.md) (default workflow)
- [Export existing resources into HCL](aztfexport-qs2.md) (using `--hcl-only`)

This section gives some general guidance on when a user might want to choose one workflow over the other.

### Managing Infrastructure
You may not need to export to state if you have not verified the configured resources behave within your environment in the way you want them to. If you aren't sure you want to manage the resources yet, `--hcl-only` is recommended. But if you're sure you wish to manage the set of resources in Terraform with `terraform init plan apply` workflows, exporting to state is essential.

### Existing Infrastructure
In scenarios where you're exporting to existing Terraform environments, it may be helpful to think of `--hcl-only` as a `terraform plan` equivalent, especially before appending to existing environments. `terraform apply` equates to exporting resources, during which their config ties into the preexisting state. We recommend using the mapping file to function as the `terraform apply` equivalent in this scenario, as it saves runtime to list and map resources. A detailed example is found in [this quickstart].

### Discovering Infrastructure
If you aren't sure what resources exist within an environment, and wish to verify, use the `--generate-mapping-file` or `-g` command to discover the mapping of resources within your specified scope. Follow [this tutorial](aztfexport-ht1.md#using-a-mapping-file) for an example.

## Limitations
Azure Export for Terraform is a best effort to accurately convert of Azure infrastructure into Terraform code and state. Its known limitations are documented below, especially when related to deploying its generated infrastructure in a different environment:

### Write Only Properties
Certain properties within AzureRM are write-only, thereby not included in the generated code that Azure Export for Terraform creates. The user will need to resolve the issue by defining the property after exporting into HCL code to get a successful `terraform apply`.

### Cross Property Constraints
The AzureRM provider can set two properties that conflict with each other. When Azure Export for Terraform reads conflicting properties, it may set both properties to the same value despite the user only configuring one. Further complications emerge when multiple cross property constraints exist within the same generated config. The user must know where cross property conflicts exist within their configuration in order to mitigate the issue.

### Infrastructure Outside Resource Scope
When exporting using Azure Export for Terraform and targeting resource scopes, resources may exist outside of the scope but be necessary for the config to work on its own. One example is a role assignment. The user would need to identify outside of scope resources and know to bring them into their new set of resources.

### Write-Only Properties
Azure Export cannot generate write-only properties within its config such as passwords. The user would have to know that the write-only properties and define them in their config to create new sets of resources.

## Modifying Code to Match Coding Standards
There are a few necessary operations if the user wishes to modify their code to abide by coding standards. These steps would only be necessary if the user plans to use the code in non-sandbox environments.

### Property Defined Resources
Certain resources in Azure can be be defined as either a property in a parent Terraform resource or an individual Terraform resource in AzureRM. One well-known example is a subnet. Azure Export for Terraform defines the resource as an individual resource, but it is best practice to match your existing coding configuration.

### Explicit Dependencies
Azure Export for Terraform is currently only able to declare explicit dependencies. The user must know the mapping of relationships between resources to refactor the code to include implicit dependencies.

### Hard Coded Values
Azure Export for Terraform generates hard-coded strings; users should expect to refactor the configuration into variables to match best practices and coding standards.

Furthermore, when using the `--full-properties` flag to expose all properties, some sensitive information, such as secrets, can be seen in the generated config. Use recommended practices to move this code behind proper secured environments.

## Summary
In this tutorial, you learned:
- The three resource scopes of Azure Export for Terraform
- How to run the tool interactively or non-interactively
- Best practices on when to use `--hcl-only` or default workflow
- Limitations of the tool
- How to modify the generated code to match coding standards.

## Further Reading
Now that you've understood how the tool works, get started with the following tutorials:
- Export your first resource group
- Export resources into HCL code

For using the tool in more complex scenarios:
- Exploring customized resource filters and names
- Remote backends and appending to preexisting environments
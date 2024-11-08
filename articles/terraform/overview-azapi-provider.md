---
title: Overview of the Terraform AzAPI provider
description: Get an overview of the AzAPI provider and when to use it.
ms.topic: overview
ms.date: 04/05/2022
ms.custom: devx-track-terraform
adobe-target: trues
---

# Overview of the Terraform AzAPI provider

The AzAPI provider is a thin layer on top of the [Azure ARM REST APIs](/rest/api/resources/). It enables you to manage any Azure resource type using any API version, enabling you to utilize the latest functionality within Azure. AzAPI is a first-class provider designed to be used on its own or in tandem with the AzureRM provider.

## Benefits of using the AzAPI provider

The AzAPI provider features the following benefits:

- Supports all Azure control plane services:
  - Preview services and features
  - All API versions
- Full Terraform state file fidelity
  - Properties and values are saved to state
- No dependency on Swagger
- Common and consistent Azure authentication
- Built-in preflight validation
- Granular control over infrastructure development
- [Robust VS Code Extension](https://marketplace.visualstudio.com/items?itemName=azapi-vscode.azapi)

## Resources

To allow you to manage all Azure resources and features without requiring updates, the AzAPI provider includes the following generic resources:

| Resource Name | Description |
| ------------- | ----------- |
| [`azapi_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/resource) | Used to fully manage any Azure (control plane) resource (API) with full CRUD. <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New preview service <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New feature added to existing service <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Existing feature / service not currently covered |
| [`azapi_update_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/update_resource) | Used to manage resources or parts of resources that don't have full CRUD <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update new properties on an existing service <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update pre-created child resource - such as DNS SOA record. |
| [`azapi_resource_action`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/resource_action) | Used to perform a single operation on a resource without managing the lifecycle of it <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shut down a Virtual Machine <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add a secret to a Key Vault|
| [`azapi_data_plane_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource) | Used to manage a [specific subset](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource#available-resources) of Azure data plane resources <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KeyVault Certificate Contacts<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Synapse Workspace Libraries| 

### Usage hierarchy

Overall, usage should follow these steps:
1. It's always recommended to start with performing as many operations as possible within `azapi_resource`. 
2. If the resource type doesn't exist within `azapi_resource` but does fall under one of the types supported by `azapi_data_plane_resource`, use that instead.
3. If the resource already exists in AzureRM or has a property that can't be accessed within `azapi_resource`, use `azapi_update_resource` to access these specific properties. Resources that `azapi_resource` or `azapi_data_plane_resource` don't support can't be updated through this resource.
4. If you're trying to perform an action that isn't based on an Azure CRUD-friendly resource, `azapi_resource_action` is less straightforward than `azapi_update_resource` but more flexible.

## Resource configuration examples

The following code snippet configures a resource that doesn't currently exist in the AzureRM provider:

```terraform
resource "azapi_resource" "publicip" {
  type      = "Microsoft.Network/Customipprefixes@2021-03-01"
  name      = "exfullrange"
  parent_id = azurerm_resource_group.example.id
  location  = "westus2"

  body = {
    properties = {
      cidr          = "10.0.0.0/24"
      signedMessage = "Sample Message for WAN"
    }
  }
}
```

The following code snippet configures a preview property for an existing resource from AzureRM:

```terraform
resource "azapi_update_resource" "test" {
  type        = "Microsoft.ContainerRegistry/registries@2020-11-01-preview"
  resource_id = azurerm_container_registry.acr.id

  body = {
    properties = {
      anonymousPullEnabled = var.bool_anonymous_pull
    }
  }
}
```

The following code snippet configures a resource action on an existing AzureRM resource:

```terraform
resource "azapi_resource_action" "vm_shutdown" {
  type = "Microsoft.Compute/virtualMachines@2023-07-01"
  resource_id = azurerm_linux_virtual_machine.example.id
  action = "powerOff”
}
```

The following code snippet configures a resource that doesn't currently exist in the AzureRM provider due to being provisioned on the data plane:

```terraform
resource "azapi_data_plane_resource" "dataset" {
  type      = "Microsoft.Synapse/workspaces/datasets@2020-12-01"
  parent_id = trimprefix(data.azurerm_synapse_workspace.example.connectivity_endpoints.dev, "https://")
  name      = "example-dataset"
  body = {
    properties = {
      type = "AzureBlob",
      typeProperties = {
        folderPath = {
          value = "@dataset().MyFolderPath"
          type  = "Expression"
        }
        fileName = {
          value = "@dataset().MyFileName"
          type  = "Expression"
        }
        format = {
          type = "TextFormat"
        }
      }
      parameters = {
        MyFolderPath = {
          type = "String"
        }
        MyFileName = {
          type = "String"
        }
      }
    }
  }
}
```

### Preflight usage example

The following code snippet errors during `terraform plan` due to AzAPI's built-in preflight validation:

```terraform
provider "azapi" {
  enable_preflight = true
}
resource "azapi_resource" "vnet" {
  type      = "Microsoft.Network/virtualNetworks@2024-01-01"
  parent_id = azapi_resource.resourceGroup.id
  name      = "example-vnet"
  location  = "westus"
  body = {
    properties = {
      addressSpace = {
        addressPrefixes = [
          "10.0.0.0/160", # preflight will throw an error here
        ]
      }
    }
  }
}
```

Preflight is hidden behind a provider flag but will help throw errors in `plan` stage.

## Data Sources

The AzAPI provider supports a variety of useful data sources:

| Resource Name | Description |
| ------------- | ----------- |
| [`azapi_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/resource) | Used to read information from any Azure (control plane) resource (API). <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New preview service <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New feature added to existing service <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Existing feature / service not currently covered |
| [`azapi_client_config`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/client_config) | Access client information such as subscription ID and tenant ID. |
| [`azapi_resource_action`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/resource_action) | Used to perform a single read operation on a resource without managing the lifecycle of it <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List Keys <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Read status of VM|
| [`azapi_data_plane_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/data_plane_resource) | Used to access a [specific subset](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource#available-resources) of Azure data plane resources <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KeyVault Certificate Contacts<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Synapse Workspace Libraries| 
| [`azapi_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/resource_id) | Access a resource's resource ID, with the ability to output information such as subscription ID, parent ID, resource group name, and resource name. |
| [`azapi_resource_list`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/resource_list) | List all resources under a given parent resource ID. <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Resources under a subscription / resource group <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subnets under a virtual network|

## Authentication using the AzAPI provider

The AzAPI provider enables the same authentication methods as the AzureRM provider. For more information on authentication options, see [Authenticate Terraform to Azure](./authenticate-to-azure.md?tabs=bash).


## Experience and lifecycle of the AzAPI provider

This section describes some tools to help you use the AzAPI provider.

### VS Code extension and Language Server

The [AzAPI VS Code extension](https://marketplace.visualstudio.com/items?itemName=azapi-vscode.azapi) provides a rich authoring experience with the following benefits:

- List all available resource types and API versions.
![List all available resource types](media/overview-azapi-provider/list-all-available-resource-types.png)
- Auto-completion of the allowed properties and values for any resource.
![List allowed properties](media/overview-azapi-provider/list-allowed-properties.png)
- Show hints when hovering over a property.
![Show hint when hovering over a property](media/overview-azapi-provider/show-hint-when-hovering.png)
- Syntax validation
![Syntax validation](media/overview-azapi-provider/syntax-validation.png)
- Auto-completion with code samples.
![Auto-completion with code samples](media/overview-azapi-provider/auto-completion-with-code-samples.png)

### `aztfmigrate` migration tool

The [`aztfmigrate` tool](https://github.com/Azure/aztfmigrate/releases) is designed to help migrate existing resources between the AzAPI and AzureRM providers.

`aztfmigrate` has two modes: plan and migrate:

- Plan displays the AzAPI resources that can be migrated.
- Migrate migrates the AzAPI resources to AzureRM resources in both the HCL files and the state.

`aztfmigrate` ensures after migration that your Terraform configuration and state are aligned with your actual state. You can validate the update to state by running `terraform plan` after completing the migration to see that nothing has changed.

## Granular controls over infrastructure

One major benefit of AzAPI is through its ability to fine-tune your configuration to match the right design patterns. There are several ways in which you can do this:

### Provider functions

AzAPI (v2.0 and newer) has a slew of [provider functions](https://developer.hashicorp.com/terraform/plugin/framework/functions/concepts?product_intent=terraform):

| Resource Name | Description |
| ------------- | ----------- |
| [`build_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/build_resource_id) | Constructs an Azure resource ID given the parent ID, resource type, and resource name. It is useful for creating resource IDs for top-level and nested resources within a specific scope. |
| [`extension_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/extension_resource_id) | Constructs an Azure extension resource ID given the base resource ID, resource type, and additional resource names. |
| [`management_group_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/management_group_resource_id) | Constructs an Azure management group scope resource ID given the management group name, resource type, and resource names.|
| [`parse_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/parse_resource_id) |This function takes an Azure resource ID and a resource type and parses the ID into its individual components such as subscription ID, resource group name, provider namespace, and other parts.|
| [`resource_group_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/resource_group_resource_id) | Constructs an Azure resource group scope resource ID given the subscription ID, resource group name, resource type, and resource names. |
| [`subscription_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/subscription_resource_id) | Constructs an Azure subscription scope resource ID given the subscription ID, resource type, and resource names.|
| [`tenant_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/tenant_resource_id) |Constructs an Azure tenant scope resource ID given the resource type and resource names.|

### User-defined retriable errors with the `retry` block
The `AzAPI` provider can digest errors when expected through the `retry` block. For example, if a resource may run into a create timeout issue, the following block of code may help:
```terraform
resource "azapi_resource" "example" {
    # usual properties
    retry {
        interval_seconds     = 5
        randomization_factor = 0.5 # adds randomization to retry pattern
        multiplier           = 2 # if try fails, multiplies time between next try by this much
        error_message_regex  = ["ResourceNotFound"]
    }
    timeouts {
        create = "10m"
}
```

### Triggers for resource replacement

The `AzAPI` provider allows you to configure parameters for resource replacement:

#### `replace_triggers_external_values`

Replaces the resource if a value changes. For example, if the SKU or zones variables were to be modified, this resource would be re-created:
```terraform
resource "azapi_resource" "example" {
  name      = var.name
  type      = "Microsoft.Network/publicIPAddresses@2023-11-01"
  parent_id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example"
  body      = properties = {
    sku   = var.sku
    zones = var.zones
  }
  replace_triggers_external_values = [
    var.sku,
    var.zones,
  ]
}
```
This can work across a broad set of resources, i.e. a policy assignment when properties of the definition changes.

#### `replace_triggers_refs`

Replaces the resource if the referenced value changes. For example, if the SKU name or tier was modified, this resource would be re-created:
```terraform
resource "azapi_resource" "example" {
  type      = "Microsoft.Relay/namespaces@2021-11-01"
  parent_id = azurerm_resource_group.example.id
  name      = "xxx"
  location  = "westus"
  body = {
    properties = {
    }
    sku = {
      name = "Standard"
      tier = "Standard"
    }
  }

  replace_triggers_refs = ["sku"]
}
```
This would not trigger a replace if a different resource's SKU were to change.

## Next steps

- [Deploy your first resource with the AzAPI provider](get-started-azapi-resource.md)
- [Deploy your first Update Resource with the AzAPI provider](get-started-azapi-update-resource.md)
- [Deploy your first resource action with the AzAPI provider](get-started-azapi-resource-action.md)
- [Visit the provider registry](https://registry.terraform.io/providers/Azure/azapi/latest/docs)

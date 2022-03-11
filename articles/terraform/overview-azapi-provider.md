---
title: Terraform AzAPI (generic) provider
description: Understand what the AzAPI provider is and when to use it.
ms.topic: overview
ms.date: 03/08/2022
ms.custom: devx-track-terraform
adobe-target: true
---

# Overview

The AzAPI provider is a very thin layer on top of the Azure ARM REST APIs. This means that you can use it to manage any Azure resource type using any API version. With this provider you can use Terraform to manage Azure resources and new service features as soon as they are released, even in private preview.

In order to allow you to manage all Azure resources and features with this provider without requiring updates, this provider includes the following generic resources:

## Resources

| Resource Name | Description |
| ------------- | ----------- |
| azapi_resource | Used to fully manage any Azure (control plane) resource (API) with full CRUD. <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New preview service <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New feature added to existing service <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Existing feature / service not currently covered |
| azapi_update_resource | Used to manage resources or parts of resources that do not have full CRUD <br> &nbsp;&nbsp;&nbsp;Example Use Cases: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update new properties on an existing service <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update pre-created child resource  (eg. DNS SOA record) |

### Examples
Configure a resource that does not currently exist in the AzureRM provider. 
```terraform
resource "azapi_resource" "publicip" {
  type      = "Microsoft.Network/Customipprefixes@2021-03-01"
  name      = "exfullrange"
  parent_id = azurerm_resource_group.example.id
  location  = "westus2"

  body = jsonencode({
    properties = {
      cidr          = "10.0.0.0/24"
      signedMessage = "Sample Message for WAN"
    }
  })
}
```

Configure a preview property for an existing resource from AzureRM.
```terraform
resource "azapi_update_resource" "test" {
  type        = "Microsoft.ContainerRegistry/registries@2020-11-01-preview"
  resource_id = azurerm_container_registry.acr.id

  body = jsonencode({
    properties = {
      anonymousPullEnabled = var.bool_anonymous_pull
    }
  })
}
``` 

## Authentication

This provider enables the same authentication methods as the AzureRM provider. See [Authenticate Terraform to Azure](https://docs.microsoft.com/en-us/azure/developer/terraform/authenticate-to-azure?tabs=bash) for more details.


## Benefits

The AzAPI provider features the following benefits:

- Support all Azure services on day zero:
  - Private preview services and features
  - Public preview services and features
  - All API versions
- Full Terraform state file fidelity
  - Properties and values are saved to state 
- No dependency on Swagger
- Common and consistant Azure authentication

## Experience and lifecycle

To ensure your experience using the AzAPI provider is as easy and streamlined as possible from authoring your configuration to migrating to the AzureRM provider, we have created the following tools to assist.

### VS Code extension and Language Server

The [AzAPI VS Code extension]() provides a rich authoring experience complete with intellisense, code completion, hints, syntax validation, quick info and more. 

![Vs Code extension](/media/generic-provider/vs-code-extension.mp4)

## Migration Tool

The AzureRM provider provides the best and most integrated Terraform experience for managing Azure resources. Although the AzAPI provider may be used while a service or feature is in preview, we expect customers to move to the AzureRM provider once the service is officially released.

To streamline this migration from the AzAPI provider to the AzureRM provider, we have created the [AzAPI2AzureRM tool](https://github.com/Azure/azapi2azurerm/releases). This is an open source tool that will automate the process of converting AzAPI resources to AzureRM resources. The tool has two modes: plan and migrate. Plan will give you visibility into the AzAPI resources that can be migrated. Migrate will migrate the AzAPI resources to AzureRM resources in both the HCL files as well as the state. This will ensure that after migration that your Terraform configuration and state are aligned with your actual state. You can validate this by running Terraform plan after completing the migration and will see that nothing has changed.

 ![Migration tool](/media/generic-provider/migration-tool.mp4)

# Get Started

1. Install [VS Code extension]() <!-- TODO: ADD link to visual studio market place -->
1. Add the AzAPI provider to your Terraform configuration.
    ```terraform
    terraform {
      required_providers {
        azapi = {
          source  = "Azure/azapi"
        }
      }
    }

    provider "azapi" {
      # More information on the authentication methods supported by
      # the AzureRM Provider can be found here:
      # https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs

      # subscription_id = "..."
      # client_id       = "..."
      # client_secret   = "..."
      # tenant_id       = "..."
    }
    ```
1. Start using the AzAPI resources
    ```terraform
    resource "azapi_resource" "example" {
      name = "example"
      parent_id = data.azurerm_machine_learning_workspace.existing.id
      type = "Microsoft.MachineLearningServices/workspaces/computes@2021-07-01"
      
      location = "eastus"
      body = jsondecode({
        properties = {
          computeType      = "ComputeInstance"
          disableLocalAuth = true
          properties = {
            vmSize = "STANDARD_NC6"
          }
        }
      })
    }

    ```

# Next Steps

azapi_resource Quickstart
azapi_update_resource Quickstart
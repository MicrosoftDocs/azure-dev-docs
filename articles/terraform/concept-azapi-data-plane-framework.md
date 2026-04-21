---
title: Understand the AzAPI data plane framework
description: Learn how the AzAPI Terraform provider targets Azure data plane APIs, why only a curated set of resource types is supported, and how to derive the parent_id for each service.
ms.topic: concept-article
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Understand the AzAPI data plane framework

Most Azure resources are managed through the Azure Resource Manager (ARM) control plane — a single, unified API surface at `management.azure.com`. The `azapi_resource`, `azapi_update_resource`, and `azapi_resource_action` resource types all target this control plane.

Some Azure services expose a separate **data plane API** — a service-specific HTTPS endpoint where you interact directly with the service rather than through ARM. Examples include the Key Vault secrets API at `{vaultName}.vault.azure.net`, the Azure AI Search index API at `{searchServiceName}.search.windows.net`, and the Synapse workspace pipeline API at `{workspaceName}.dev.azuresynapse.net`.

`azapi_data_plane_resource` bridges this gap by enabling Terraform to manage resources on these data plane endpoints using the same AzAPI provider authentication and lifecycle model.

## Why only a curated set of resource types is supported

Unlike `azapi_resource`, which can target any ARM resource type, `azapi_data_plane_resource` only works with a [specific list of registered resource types](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource#available-resources).

This constraint exists because data plane extensibility requires explicit registration in the AzAPI provider's data plane framework. The framework must know:

- The base endpoint pattern for a service (for example, `{vaultName}.vault.azure.net`)
- The REST path for each supported resource type (for example, `/secrets/{secret-name}`)
- How to authenticate to this endpoint (some services require service-specific token audiences rather than the default ARM audience at `https://management.azure.com`)

Each registered resource type adds this mapping to the framework. Unregistered resource types can't be targeted through `azapi_data_plane_resource`, because the provider has no way to determine the correct endpoint or authentication scope.

> [!TIP]
> If a data plane resource type you need isn't supported, you can open an issue or contribute a registration in the [terraform-provider-azapi GitHub repository](https://github.com/Azure/terraform-provider-azapi).

## How `parent_id` works for data plane resources

For control plane resources (`azapi_resource`), `parent_id` is always an ARM resource ID — a path in the form `/subscriptions/{sub}/resourceGroups/{rg}/providers/{namespace}/{type}/{name}`.

For data plane resources, `parent_id` is the **service's data plane hostname**, stripped of the `https://` scheme and any trailing slash. This is typically a property exposed on the ARM control plane resource after creation.

The pattern varies by service:

| Service | ARM output property | `parent_id` pattern |
|---|---|---|
| Key Vault | `properties.vaultUri` | `{vaultName}.vault.azure.net` |
| Azure App Configuration | `properties.endpoint` | `{storeName}.azconfig.io` |
| Azure AI Search | (constructed from name) | `{searchServiceName}.search.windows.net` |
| Synapse workspace | `connectivityEndpoints.dev` | `{workspaceName}.dev.azuresynapse.net` |
| IoT Central app | `properties.subdomain` | `{appSubdomain}.azureiotcentral.com` |
| Microsoft Purview | (constructed from name) | `{accountName}.purview.azure.com` |

### Extracting `parent_id` from ARM output

Use `response_export_values` on the parent ARM resource to extract the data plane endpoint, then strip the scheme with `trimprefix` or `replace`:

```terraform
resource "azurerm_key_vault" "example" {
  # ... configuration
}

resource "azapi_data_plane_resource" "secret" {
  type      = "Microsoft.KeyVault/vaults/secrets@7.4"
  # Strip "https://" and the trailing "/" from the vault URI
  parent_id = trimsuffix(trimprefix(azurerm_key_vault.example.vault_uri, "https://"), "/")
  name      = "my-secret"
  body = {
    value      = var.secret_value
    attributes = { enabled = true }
  }
}
```

When using `azapi_resource` to create the parent instead of AzureRM, use `response_export_values` to capture the endpoint:

```terraform
resource "azapi_resource" "app_config" {
  type      = "Microsoft.AppConfiguration/configurationStores@2023-03-01"
  name      = "my-store"
  parent_id = azapi_resource.resource_group.id
  location  = "eastus"
  body      = { sku = { name = "standard" } }

  response_export_values = {
    endpoint = "properties.endpoint"
  }
}

resource "azapi_data_plane_resource" "key_value" {
  type      = "Microsoft.AppConfiguration/configurationStores/keyValues@1.0"
  parent_id = replace(azapi_resource.app_config.output.endpoint, "https://", "")
  name      = "mykey"
  body      = { value = "myvalue", content_type = "" }
}
```

For services where the endpoint is derived from the resource name rather than a URI property, construct it directly:

```terraform
resource "azurerm_search_service" "example" {
  name                = "my-search"
  # ... configuration
}

resource "azapi_data_plane_resource" "index" {
  type      = "Microsoft.Search/searchServices/indexes@2024-07-01"
  parent_id = "${azurerm_search_service.example.name}.search.windows.net"
  name      = "my-index"
  body      = { fields = [ /* ... */ ] }
}
```

## Authentication to data plane endpoints

The AzAPI provider handles authentication transparently. It uses the same credentials you configure on the `provider "azapi"` block (Azure CLI, service principal, managed identity, or OIDC), but automatically requests tokens scoped to each service's data plane audience rather than the ARM audience.

For example, Key Vault data plane operations require a token audience of `https://vault.azure.net`, not `https://management.azure.com`. The AzAPI provider selects the correct audience based on the registered endpoint for each resource type.

As a practitioner, you don't need to configure anything differently. The standard RBAC permissions for the service apply — for example, `Key Vault Secrets Officer` to manage Key Vault secrets, or `App Configuration Data Owner` to manage App Configuration key-values.

> [!NOTE]
> For some services (such as Azure App Configuration and Azure AI Search), the caller must have the appropriate data plane role assignment, not just the control plane owner role. Ensure the identity running Terraform has the correct data plane RBAC assignment before applying configurations that use `azapi_data_plane_resource`.

## Resource ID format for import

Data plane resource IDs use a different format than ARM resource IDs. When importing an existing data plane resource, use the format `{parent_id}/{path}|{resource-type}@{api-version}`:

```terraform
import {
  to = azapi_data_plane_resource.example
  id = "exampleappconf.azconfig.io/kv/mykey|Microsoft.AppConfiguration/configurationStores/keyValues@1.0"
}
```

Or with `terraform import`:

```console
terraform import azapi_data_plane_resource.example 'exampleappconf.azconfig.io/kv/mykey|Microsoft.AppConfiguration/configurationStores/keyValues@1.0'
```

## Supported data plane services

The AzAPI provider currently supports `azapi_data_plane_resource` for resource types across these services:

- **Azure App Configuration** — key-values
- **Azure AI Foundry** — agents
- **Azure Device Update** — groups, deployments
- **Azure Digital Twins** — digital twins, relationships, event routes, import jobs
- **Azure IoT Central** — organizations, users, scheduled jobs, API tokens, dashboards, device groups, device templates, devices, enrollment groups, data exports, deployment manifests
- **Azure Key Vault** — certificates contacts, certificate issuers, keys, secrets, storage accounts, SAS definitions
- **Microsoft Purview** — collections, resource set rule configs, key vaults, classification rules, credentials, data sources, scans, scan triggers, integration runtimes, managed private endpoints, workflows
- **Azure AI Search** — data sources, indexers, indexes, skillsets, synonym maps
- **Azure Synapse Analytics** — databases, dataflows, datasets, KQL scripts, libraries, link connections, linked services, managed private endpoints, notebooks, pipelines, role assignments, Spark job definitions, Spark configurations, SQL scripts, triggers

For the complete list with API versions and endpoint patterns, see the [available resources reference](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/data_plane_resource#available-resources) in the Terraform Registry.

## Next steps

> [!div class="nextstepaction"]
> [Manage Azure data plane resources with AzAPI (quickstart)](get-started-azapi-data-plane-resource.md)

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

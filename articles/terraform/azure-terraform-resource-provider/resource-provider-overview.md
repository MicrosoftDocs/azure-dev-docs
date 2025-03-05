---
title: Overview of the Azure Terraform Resource Provider
description: Learn the benefits and uses of the Azure Terraform resource provider
ms.topic: overview
ms.date: 10/04/2024
ms.author: stema
ms.custom: devx-track-terraform
---

# Overview of the Azure Terraform Resource Provider

The Azure Terraform Resource Provider (Public Preview) enables Azure Terraform workflows across various Azure workflows. Currently, only an export workflow is supported, but planned additions to the resource provider accelerate deployment workflows in Terraform on Azure.

## Registration
### az provider register
Register the provider with `az provider register -n Microsoft.AzureTerraform`. 

### Portal
Register the provider using the [Azure Resource Manager guide](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal). Search for `Microsoft.AzureTerraform` in step 5.

## Export
Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### Portal
The Portal experience is coming soon and this section will be updated once it is available.

### Azure CLI
Follow the [Azure CLI guide](https://learn.microsoft.com/en-us/cli/azure/service-page/azureterraform?view=azure-cli-latest)

### Azure PowerShell
Follow the [Azure PowerShell guide](https://learn.microsoft.com/en-us/powershell/module/az.terraform/?view=azps-13.2.0)

### REST
Follow the [REST API reference](https://learn.microsoft.com/en-us/rest/api/terraform/terraform/export-terraform?view=rest-terraform-2023-07-01-preview&tabs=HTTP)

### Go SDK
Follow the [Go SDK reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/terraform/armterraform)

### Export Limitations
As the export experience is based on [Azure Export for Terraform](../azure-export-for-terraform/export-terraform-overview.md), its limitations are nearly identical to the binary. Please refer to the [limitations section of the binary documentation](../azure-export-for-terraform/export-terraform-concepts.md).

## Next steps

**Quickstart articles:**

- [Export your first resources using the Azure portal](./get-started-export-resources-portal.md)

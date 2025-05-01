---
title: Overview of the Azure Terraform Resource Provider
description: Learn the benefits and uses of the Azure Terraform resource provider
ms.topic: overview
ms.date: 10/04/2024
ms.author: stema
ms.custom: devx-track-terraform
---

# Overview of the Azure Terraform Resource Provider

The Azure Terraform Resource Provider (Public Preview) enables Azure Terraform workflows like exporting in the Auzre Portal. Currently, only an export workflow is supported, but planned additions to the resource provider accelerate deployment workflows in Terraform on Azure.

## Registration

### Terraform

Utilize the `azurerm_provider_registration` resource:

```hcl
resource "azurerm_resource_provider_registration" "azureterraform" {
  name = "Microsoft.AzureTerraform"
}
```

You will need to have your `azurerm` provider configured as well for the run to succeed.

### Terminal

Register the provider with `az provider register -n Microsoft.AzureTerraform`. 

### Portal

Register the provider using the [Azure Resource Manager guide](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal). Search for `Microsoft.AzureTerraform` in step 5.

## Export

Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### Portal

Follow the [quickstart article to export resources to Terraform using Azure portal](./get-started-export-resources-portal.md)

### Azure CLI

Follow the [Azure CLI guide](/cli/azure/terraform).

### Azure PowerShell

Follow the [Azure PowerShell guide](/powershell/module/az.terraform/).

### REST

Follow the [REST API reference](/rest/api/terraform/terraform/).

### Go SDK

Follow the [Go SDK reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/terraform/armterraform).

### Export Limitations

As the export experience is based on [Azure Export for Terraform `aztfexport`](../azure-export-for-terraform/export-terraform-overview.md), its limitations are nearly identical to the binary. Refer to the [limitations section of the binary documentation](../azure-export-for-terraform/export-terraform-concepts.md).

However, there are also specific resources not supported by the resource provider. These resources aren't supported to ensure security from a usage standpoint. Two types of roles aren't supported:

- POST roles. They're mostly used for listing credentials.
- Data plane roles. These roles are used to access user content.

We're planning to keep these limitations in place to ensure security for users. If customers wish to export these types of resources, it's recommended to use the [`aztfexport`](https://github.com/Azure/aztfexport) tool instead.

## Next steps

> [!div class="nextstepaction"] 
> [Export your first resources using the Azure portal](./get-started-export-resources-portal.md)
> [Learn more about using Terraform in Azure](/azure/terraform)

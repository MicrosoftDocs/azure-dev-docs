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

[!NOTE]
You do not need to register to this resource provider to deploy Azure resources in Terraform.**

## Registration
### Terminal
Register the provider with `az provider register -n Microsoft.AzureTerraform`. 

### Portal
Register the provider using the [Azure Resource Manager guide](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal). Search for `Microsoft.AzureTerraform` in step 5.

## Export
Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### Portal
The Portal experience is coming soon.

### Azure CLI
Follow the [Azure CLI guide](/cli/azure/terraform)

### Azure PowerShell
Follow the [Azure PowerShell guide](/powershell/module/az.terraform/)

### REST
Follow the [REST API reference](/rest/api/terraform/terraform/)

### Go SDK
Follow the [Go SDK reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/terraform/armterraform)

### Export Limitations
As the export experience is based on [Azure Export for Terraform](../azure-export-for-terraform/export-terraform-overview.md), its limitations are nearly identical to the binary. Refer to the [limitations section of the binary documentation](../azure-export-for-terraform/export-terraform-concepts.md).

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)

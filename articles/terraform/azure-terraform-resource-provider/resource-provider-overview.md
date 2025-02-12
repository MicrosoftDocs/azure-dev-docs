---
title: Overview of the Azure Terraform Resource Provider
description: Learn the benefits and uses of the Azure Terraform resource provider
ms.topic: overview
ms.date: 10/04/2024
ms.author: stema
ms.custom: devx-track-terraform
---

# Overview of the Azure Terraform Resource Provider

The Azure Terraform Resource Provider (Public Preview) enables Azure Terraform workflows across various Azure workflows. Currently, only an export workflow is supported, but planned additions to the resource provider accelerate deployment workflows in Terraform on Azure. **Please note that you do not need to register to this resource provider to deploy Azure resources in Terraform.**

## Registration
Register the provider with `az provider register -n Microsoft.AzureTerraform`. 

## Public preview feature registration
The experience is currently in public preview. Register the feature flag with `az feature register --namespace Microsoft.AzureTerraform`.

### Check status
Check the status of the registration with `az feature show --namespace Microsoft.AzureTerraform`

## Export
Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### REST
Follow the [REST API reference](/rest/api/)

### Export Limitations
As the export experience is based on [Azure Export for Terraform](../azure-export-for-terraform/export-terraform-overview.md), its limitations are nearly identical to the binary. Please refer to the [limitations section of the binary documentation](../azure-export-for-terraform/export-terraform-concepts.md).

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)

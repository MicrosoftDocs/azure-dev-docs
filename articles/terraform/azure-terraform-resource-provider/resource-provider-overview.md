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
Register the provider with `az provider register -n Microsoft.AzureTerraform`. 

## Private preview feature registration
The experience is currently in private preview. Register the feature flag with `az feature register --namespace Microsoft.AzureTerraform -n private`. Approvals are done manually and may face delays.

### Check status
Check the status of the registration with `az feature show --namespace Microsoft.AzureTerraform --name private`

## Export
Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### Portal
Follow the [quickstart article to export resources to Terraform using Azure portal](./get-started-export-resources-portal.md)

### REST
Follow the [REST API reference](/rest/api/)

## Next steps

**Quickstart articles:**

- [Export your first resources using the Azure portal](./get-started-export-resources-portal.md)

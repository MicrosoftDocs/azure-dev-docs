---
title: Overview of the Azure Terraform Resource Provider
description: Learn the benefits and uses of the Azure Terraform RP
ms.topic: overview
ms.date: 10/04/2024
ms.author: stema
ms.custom: devx-track-terraform
---

# Overview of the Azure Terraform Resource Provider

The Azure Terraform Resource Provider (Public Preview) enables Azure Terraform workflows across a variety of Azure workflows. Currently, only an export workflow is supported, but future additions to the RP will help accelerate deployment workflows in Terraform on Azure.

## Export
Export functionality is based on the preexisting [Azure Export for Terraform tool](../azure-export-for-terraform/export-terraform-overview.md). These capabilities are exposed through the resource provider. To export resources, choose your tool of choice:

### Portal
Follow the [quickstart article to export resources to Terraform using Azure Portal](./get-started-export-resources-portal.md)

### Terraform
Follow the [quickstart article to export resources using the AzAPI provider's `azapi_resource_action`](./get-started-export-resources-portal.md)

### REST
Follow the [REST API reference](https://learn.microsoft.com/en-us/rest/api/)

## Next steps

**Quickstart articles:**

- [Export your first resources using the Azure Portal](./get-started-export-resources-portal.md)
- [Export your first resources using the Azure Portal](./get-started-export-resources-terraform.md)

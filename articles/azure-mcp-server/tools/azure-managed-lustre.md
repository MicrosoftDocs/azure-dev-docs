---
title: Azure Managed Lustre Tools for Azure MCP Server
description: Learn how to use Azure MCP Server tools with Azure Managed Lustre to manage and analyze scalable Lustre file systems. 
keywords: azure mcp server, azmcp, azure managed lustre, lustre file systems
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/7/2025
---

# Azure Managed Lustre tools for Azure MCP Server

Azure MCP Server enables you to manage Azure resources, including Azure Managed Lustre, by using natural language prompts, streamlining infrastructure operations for AI training and HPC environments. Learn how to optimize AI and HPC workloads with scalable Lustre file systems.

[Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview) is a high-performance, scalable file system built on the open-source Lustre technology and optimized for AI and HPC workloads on Azure. It provides the throughput, parallelism, and low-latency access required for large-scale simulation, model training and fine-tuning.‌

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## File system: List file systems

Get an inventory of Azure Managed Lustre file systems and check their properties.

Example prompts include:

- **List all file systems**: "List all Azure Managed Lustre file systems."
- **Show file system details**: "Get details for my file system 'my-lustre-fs'."
- **Check file system status**: "What is the status of my file system 'my-lustre-fs'?"
- **Filter by resource group**: "List Azure Managed Lustre file systems in resource group 'bigdata-rg'."
- **Filter by size**: "Show file systems larger than 100 TiB."

## File system: Calculate required subnet size

Calculates the required subnet size for an Azure Managed Lustre file system, given a SKU and size. Use this calculation to plan network deployment for AMLFS.

Example prompts include:

- **Get required subnet size**: "What is the required subnet size for my file system 'my-lustre-fs' with SKU 'AMLFS-Durable-Premium-125' and size 100 TiB?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size (TiB). |

## Filesystem: Get SKU

<!-- `azmcp azuremanagedlustre filesystem sku get` -->

Retrieves the available Azure Managed Lustre SKU, including increments, bandwidth, scale targets, and zonal support. 

Example prompts include: 

* **List available SKUs**: "Show me the available Azure Managed Lustre SKUs."
* **Get SKUs by region**: "Display the available Azure Managed Lustre SKUs in West Europe."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Optional | Azure region. Examples: `uaenorth`, `swedencentral`, `eastus`. |

---
title: Azure Managed Lustre - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Managed Lustre to create, run, and analyze Lustre file systems for your applications.
keywords: azure mcp server, azmcp, azure managed lustre, lustre file systems
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 08/26/2025
---

# Azure Managed Lustre tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure Managed Lustre services, by using natural language prompts. 

[Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview) is a managed file system that offers scalable, powerful, cost-effective storage for high-performance computing (HPC) workloads. It's built on the popular open-source Lustre file system and is optimized for performance, scalability, and ease of use in Azure.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## File system: List

Get an inventory of Azure Managed Lustre file systems and check their properties.

Example prompts include:

- **List all file systems**: "List all Azure Managed Lustre file systems."
- **Show file system details**: "Get details for my file system 'my-lustre-fs'."
- **Check file system status**: "What is the status of my file system 'my-lustre-fs'?"
- **Filter by resource group**: "List Azure Managed Lustre file systems in resource group 'bigdata-rg'."
- **Filter by size**: "Show file systems larger than 100 TiB."

## File system: Get required subnet size

Calculates the required subnet size for an Azure Managed Lustre file system, given a SKU and size. Use this calculation to plan network deployment for AMLFS.

Example prompts include:

- **Get required subnet size**: "What is the required subnet size for my file system 'my-lustre-fs' with SKU 'AMLFS-Durable-Premium-125' and size 100 TiB?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Allowed values: AMLFS-Durable-Premium-40, AMLFS-Durable-Premium-125, AMLFS-Durable-Premium-250, AMLFS-Durable-Premium-500. |
| **Size** |  Required | The AMLFS size (TiB). |

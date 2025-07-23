---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 07/23/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
## Tool parameters

The Azure MCP Server tools define parameters for data they need to complete tasks. For example, these parameters may include the subscription ID, an account name, or a resource group.

The data used for these parameters may be included in the prompt you use to call a tool, or it may be established in the previous conversation context. If the data is available from the conversation context, the Azure MCP Server can use that information without requiring you to repeat it in every prompt. This context creates a more natural conversational experience while still ensuring all necessary data is available for the tools.

The parameters specific to each tool are documented in the tools reference articles. All of the tools also share the following global parameters.

| Parameter       | Description       |
|-----------------|-------------------|
| **Subscription** | [Azure subscription](/azure/cloud-adoption-framework/ready/azure-best-practices/initial-subscriptions) ID for target resources. Required. |
| **Tenant Id** | [Azure tenant](/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-ad-define) ID for authentication.  |
| **Authentication method** | [Authentication method](/entra/identity/authentication/concept-authentication-methods)     ('credential', 'key', 'connectionString'). Default is 'credential'. |
| **Maximum retries** | Maximum retry attempts for failed operations. Default is 3. |
| **Retry delay** | Delay between retry attempts (seconds). Default is 2. |
| **Retry delay maximum** | Maximum delay between retries (seconds). Default is 10. |
| **Retry mode** | Retry strategy ('fixed' or 'exponential'). Default is 'exponential'. |
| **Retry network timeout** | Network operation timeout (seconds). Default is 100. |

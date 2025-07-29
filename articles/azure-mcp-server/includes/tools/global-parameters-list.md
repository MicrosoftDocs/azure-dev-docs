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

The Azure MCP Server tools define parameters for the data they need to complete tasks. For example, these parameters might include the subscription ID, an account name, or a resource group.

You might include the data for these parameters in the prompt you use to call a tool, or the previous conversation context might establish the data. If the conversation context provides the data, the Azure MCP Server can use that information without requiring you to repeat it in every prompt. This context creates a more natural conversational experience while still ensuring all necessary data is available for the tools.

The tools reference articles document the parameters specific to each tool. All of the tools also share the following global parameters.

| Parameter       | Description       |
|-----------------|-------------------|
| **Subscription** | [Azure subscription](/azure/cloud-adoption-framework/ready/azure-best-practices/initial-subscriptions) ID or name for target resources. This parameter identifies which Azure subscription contains the resources you want to manage. You can use either the subscription GUID or the display name. Required for most operations. |
| **Tenant Id** | [Azure tenant](/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-ad-define) ID for authentication. This parameter specifies the Microsoft Entra ID tenant to authenticate against. Can be either the GUID identifier or the display name of your Entra ID tenant. Optional - uses default tenant if not specified. |
| **Authentication method** | [Authentication method](/entra/identity/authentication/concept-authentication-methods) to use for Azure operations. Options include 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'. Default is 'credential' which uses Azure CLI authentication or managed identity. |
| **Maximum retries** | Maximum number of retry attempts for failed operations before giving up. Controls how many times the system attempts to retry a failed request. Default is 3 retries. |
| **Retry delay** | Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base delay that gets multiplied on each retry. Default is 2 seconds. |
| **Retry delay maximum** | Maximum delay in seconds between retries, regardless of the retry strategy. This parameter caps the delay time to prevent excessively long waits. Default is 10 seconds. |
| **Retry mode** | Retry strategy to use when operations fail. 'fixed' uses consistent delays between retries, while 'exponential' increases the delay between each attempt. Default is 'exponential' for better handling of temporary issues. |
| **Retry network timeout** | Network operation timeout in seconds. Operations taking longer than this are canceled and might be retried if retries are enabled. Default is 100 seconds. |

Example prompts include:

- **Set subscription**: "Use subscription 'my-subscription-id' for all operations"
- **Use tenant ID**: "Authenticate using tenant ID 'my-tenant-id'"
- **Set authentication method**: "Use 'credential' authentication for this session"
- **Configure retries**: "Set maximum retries to 5 with a 3-second delay
- **Set retry mode**: "Use 'fixed' retry mode with a maximum delay of 5 seconds"
- **Set network timeout**: "Set network timeout to 120 seconds for all operations"
- **Configure retry parameters**: "Use exponential retry mode with a maximum of 4 retries and a delay of 2 seconds"
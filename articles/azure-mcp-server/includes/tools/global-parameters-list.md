---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
## Global parameters

All tools share the following global parameters: 

* **Subscription**: Azure subscription ID for target resources. Required.
* **Tenant Id**: Azure tenant ID for authentication.
* **Authentication method**: Authentication method ('credential', 'key', 'connectionString'). Default is credential.
* **Maximum retries**: Maximum retry attempts for failed operations. Default is 3. 
* **Retry delay**: Delay between retry attempts (seconds). Default is 2.
* **Retry delay maximum**: Maximum delay between retries (seconds). Default is 10.
* **Retry mode**: Retry strategy ('fixed' or 'exponential'). Default is exponential.
* **Retry network timeout**:Network operation timeout (seconds). Default is 100.
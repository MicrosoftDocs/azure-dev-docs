---
title: App Configuration Operations 
description: Learn how to use the Azure MCP Server with App Configuration.
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 04/28/2025
ms.topic: how-to
ms.custom: build-2025
---
<!-- This is the proposed command article template for the Azure MCP Server documentation -->
<!-- H1 will be <SERVICE-NAME> operations -->
# App Configuration operations

The Azure MCP Server allows you to manage Azure resources, including App Configuration stores.

<!-- Brief description of the service with link to the official documentation. -->

<!--  
In this article...
Manage navigation by auto H2 links
-->

<!-- Each command is organized by intent - as an H2 that we can use for navigation -->
## List stores 

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.

<!-- the next subsection is for example prompts that would give the LLM a hint fort  -->
### Example prompts

Example prompts for using the Azure MCP Server with App Configuration.

<!-- create several examples for the reader that capture the intent -->
- **List stores**: "List all App Configuration stores in my subscription."

<!-- The command reference is for the tool command that will run by the MCP Server -->
### Command reference

The Azure MCP Server has commands to manage App Configuration resources. Advanced users and automation tools use these commands.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig account list | List App Configuration stores in a subscription.|

```azuremcp
azmcp appconfig account list --subscription <SUBSCRIPTION_ID>
```

#### Examples

```azuremcp
azmcp appconfig account list --subscription "my-subscription-id"
```

#### Required parameters

- `--subscription`: The ID of the subscription to list App Configuration stores from. This parameter is required.
 
#### Optional parameters


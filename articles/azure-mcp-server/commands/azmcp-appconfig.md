---
title: App Configuration Operations 
description: Learn how to use the Azure MCP Server with App Configuration.
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 04/22/2025
ms.topic: how-to
ms.custom: build-2025
---

# App Configuration Operations

The Azure MCP Server provides a set of commands to manage App Configuration resources. 

| Name            | Description               |
|-----------------|--------------------------|
| [azmcp appconfig account list](#azmcp-appconfig-account-list) | List App Configuration stores in a subscription.|

## azmcp appconfig account list

```azuremcp
azmcp appconfig account list --subscription <SUBSCRIPTION_ID>
```

### Examples

```azuremcp
azmcp appconfig account list --subscription "my-subscription-id"
```

### Required parameters

- `--subscription`: The ID of the subscription to list App Configuration stores from. This parameter is required.
 
### Optional parameters


---
title: Work with Azure Developer CLI metadata for bicep input parameters
description: Learn how to improve the experience for deploying bicep by adding specific azd `metadata` into input parameters.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/16/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Work with Azure Developer CLI metadata for Bicep input parameters

The Azure Developer CLI (`azd`) provides enhanced support for Bicep templates through the `@metadata` decorator. By adding specific metadata to your Bicep input parameters, you can improve the deployment experience with intelligent defaults, automatic value generation, and better parameter prompting.

## Supported metadata

The following table describes the supported `azd` metadata configuration fields:

| Field | Description |
|-------|-------------|
| `type` | Defines how `azd` should prompt for this parameter. | `location`
| `config` | Describes the settings for some of the types, like `generate`. |
| `default` | Defines a value for `azd` to highlight initially during a select prompt. |
| `usageName` | Controls quota-check for ai-model location select |

## Adding metadata

To add `azd` metadata to your Bicep parameters, use the `@metadata` decorator with an `azd` object containing configuration properties. The general syntax for `azd` metadata follows this pattern:

```bicep
@metadata({
  azd: {
    property1: 'value1'
    property2: 'value2'
    // Additional properties...
  }
})
param parameterName dataType
```

For example, to configure location metadata with a default value:

```bicep
@metadata({
  azd: {
    type: 'location'
    default: 'eastus'
  }
})
param location string
```

## Next steps

- [Learn about Azure Developer CLI environment variables](manage-environment-variables.md)
- [Explore Azure Developer CLI extensibility](azd-extensibility.md)
- [Review Bicep best practices](../azure-resource-manager/bicep/best-practices.md)

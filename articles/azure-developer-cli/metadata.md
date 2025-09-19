---
title: Work with Azure Developer CLI metadata for Bicep input parameters
description: Learn how to improve the deployment experience by adding specific `azd` metadata to Bicep input parameters.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/16/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Work with Azure Developer CLI metadata for Bicep input parameters

The Azure Developer CLI (`azd`) provides enhanced support for Bicep templates through the `@metadata` decorator. By adding specific metadata to your Bicep input parameters, you can improve the deployment experience with intelligent defaults, automatic value generation, and better parameter prompting.

## Adding metadata

Input parameters in Bicep support [@metadata](https://learn.microsoft.com/azure/azure-resource-manager/bicep/parameters#metadata) as a schema-free object. You can include `azd` metadata by adding the `azd` field to the parameter metadata:

```bicep
@metadata({
  azd: {}
})
param someInput <param-type>
```

Azure Developer CLI metadata doesn't depend on the parameter's type and can be added to any parameter.

## Supported metadata

The supported configuration fields for `azd` metadata are:

  | Field | Description |
  |-------|-------------|
  | `type` | Defines how `azd` should prompt for this parameter. Example: `location`. |
  | `config` | Describes the settings for some of the metadata types, such as `generate`. |
  | `default` | Defines a value for `azd` to highlight initially during a select prompt. |
  | `usageName` | Controls quota-check for AI model location selection. |

Each of these is explored in more detail in the following sections.

### Type

This configuration defines a unique way for `azd` to prompt for an input parameter. The supported types are the following:

- **location**

    Use the `location` type to signal `azd` about an input parameter that handles an Azure location. When `azd` finds the `location` type in the metadata, it prompts the user for a value using the location selection list. Example:

    ```bicep
    @metadata({
      azd: {
        type: 'location'
      }
    })
    param someInput string
    ```

    Prompting flow:

    :::image type="content" source="media/metadata/prompt-with-location-metadata.png" alt-text="A screenshot showing a prompt for location with metadata.":::

    The `location` type can be combined with the `default` field to control which location should be initially highlighted during the prompt flow. For example:

    ```bicep
    @metadata({
      azd: {
        type: 'location'
        default: 'westus'
      }
    })
    param someInput string
    ```

    Prompting flow:

    :::image type="content" source="media/metadata/prompt-with-location-default-metadata.png" alt-text="A screenshot showing a prompt for location with metadata that includes a default value.":::

    Note how the highlighted default option matches the `default` field from the metadata. This is convenient for template authors to recommend a location while letting users confirm or change it. This differs from setting a default value for the input parameter in Bicep because that makes `azd` skip the prompt flow and directly use the default value without user confirmation.

- **generate**

    Use the `generate` type to request `azd` to automatically produce the value for the input parameter. This is typically used to auto-generate passwords or unique identifiers:

    ```bicep
    @metadata({
      azd: {
        type: 'generate'
        config: {
          length: 10
        }
      }
    })
    param someInput string
    ```

    > [!NOTE]
    > The `config` field is required when using `type: 'generate'`.

    When `azd` runs, it automatically generates a 10-character value for the input parameter without prompting the user to input a value. See the [config](#config) section to learn more about the options for configuring auto-generation values.

- **resourceGroup**

    Use the `resourceGroup` type to signal `azd` that for prompting for this input, it should pick a resource group:

    ```bicep
    @metadata({
      azd: {
        type: 'resourceGroup'
      }
    })
    param someInput string
    ```

    Prompt flow:

    :::image type="content" source="media/metadata/prompt-with-rg.png" alt-text="A screenshot showing a prompt with the resource group type.":::

### Config

The `config` object is required when using `generate` type. It controls the auto-generation options. The following table describes the generate configuration options:

| Field Name | Type | Description | Default |
|------------|------|-------------|---------|
| length | int | Total length of the generated password | 0 |
| noLower | bool | If true, excludes lowercase letters | false |
| noUpper | bool | If true, excludes uppercase letters | false |
| noNumeric | bool | If true, excludes numbers | false |
| noSpecial | bool | If true, excludes special characters | false |
| minLower | int | Minimum number of lowercase letters required | 0 |
| minUpper | int | Minimum number of uppercase letters required | 0 |
| minNumeric | int | Minimum number of numbers required | 0 |
| minSpecial | int | Minimum number of special characters required | 0 |

> [!IMPORTANT]
> The sum of all minimum requirements (MinLower + MinUpper + MinNumeric + MinSpecial) must not exceed the total Length. If any "No-" flag is set to true, the corresponding "Min-" value should be 0.

Example: Generate a value with length 10 with no special characters and with no numbers:

```bicep
@metadata({
  azd: {
    type: 'generate'
    config: {
      length: 10
      noNumeric: true
      noSpecial: true
    }
  }
})
param someInput string
```

### Default

Defines the initial value from a list to highlight. It can be combined with the `location` type or applied directly to an input with a defined list of options:

```bicep
@allowed(['foo', 'bar', 'baz'])
@metadata({
  azd: {
    default: 'baz'
  }
})
param someInput string
```

This example uses the `@allowed()` annotation from Bicep to define a list of supported values for the input parameter. When `azd` prompts for this input, it uses the list of allowed values. The `default` field from the metadata controls which option to set as the initial selection:

:::image type="content" source="media/metadata/prompt-with-default.png" alt-text="A screenshot showing default during prompt from allowed values.":::

### UsageName

The `usageName` field defines a filter to scope the location list to only those locations where a given AI SKU and capacity are available:

```bicep
@metadata({
  azd: {
    type: 'location'
    usageName: [
      'OpenAI.GlobalStandard.gpt-5-mini,10'
    ]
  }
})
param someInput string
```

This example makes `azd` reduce the list of Azure locations to only those where the AI model `gpt-5-mini` has enough quota (capacity of at least 10).

Prompt flow:

:::image type="content" source="media/metadata/prompt-with-usage-name.png" alt-text="A screenshot showing setting usageName to prompt for AI location.":::

> [!NOTE]
> `azd` returns an error if there isn't at least one location with enough quota.
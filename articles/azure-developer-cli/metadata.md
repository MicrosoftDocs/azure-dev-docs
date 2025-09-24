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

Azure Developer CLI (`azd`) supports Bicep templates with the `@metadata` decorator. Add metadata to Bicep input parameters to improve deployment with intelligent defaults, automatic value generation, and better parameter prompting.

## Adding metadata

Input parameters in Bicep support [@metadata](/azure/azure-resource-manager/bicep/parameters#metadata) as a schema-free object. Add `azd` metadata by including the `azd` field in the parameter metadata:

```bicep
@metadata({
  azd: {}
})
param someInput <param-type>
```

Azure Developer CLI metadata doesn't depend on the parameter's type, and you can add it to any parameter.

## Supported metadata

The supported configuration fields for `azd` metadata are:

  | Field | Description |
  |-------|-------------|
  | `type` | Defines how `azd` prompts for this parameter. For example, `location`. |
  | `config` | Describes settings for some metadata types, like `generate`. |
  | `default` | Defines a value for `azd` to highlight first during a select prompt. |
  | `usageName` | Controls quota check for AI model location selection. |

Each field is described in more detail in the following sections.

### Type

This configuration defines how `azd` prompts for an input parameter. Supported types include:

- **location**

    Use the `location` type to tell `azd` that an input parameter handles an Azure location. When `azd` finds the `location` type in the metadata, it prompts for a value using the location selection list. For example:

    ```bicep
    @metadata({
      azd: {
        type: 'location'
      }
    })
    param someInput string
    ```

    Prompt flow:

    :::image type="content" source="media/metadata/prompt-with-location-metadata.png" alt-text="A screenshot showing a prompt for location with metadata.":::

    Combine the `location` type with the `default` field to control which location is highlighted first during the prompt flow. For example:

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

    The highlighted default option matches the `default` field from the metadata. This approach lets template authors recommend a location while users can confirm or change it. Setting a default value for the input parameter in Bicep skips the prompt flow and uses the default value without user confirmation.

- **generate**

    Use the `generate` type to tell `azd` to automatically create the value for the input parameter. This type is often used to generate passwords or unique identifiers:

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
    > The `config` field is required with `type: 'generate'`.

    When `azd` runs, it generates a 10-character value for the input parameter without prompting for input. See the [config](#config) section for options to configure auto-generation values.

- **resourceGroup**

    Use the `resourceGroup` type to tell `azd` to prompt for a resource group for this input:

    ```bicep
    @metadata({
      azd: {
        type: 'resourceGroup'
      }
    })
    param someInput string
    ```

    Prompt flow:

    :::image type="content" source="media/metadata/prompt-with-resource-group.png" alt-text="A screenshot showing a prompt with the resource group type.":::

### Config

The `config` object is required with the `generate` type. It controls auto-generation options. The following table describes the generate configuration options:

| Field Name | Type | Description | Default |
|------------|------|-------------|---------|
| length | int | Total length of the generated value | 0 |
| noLower | bool | If true, excludes lowercase letters. | false |
| noUpper | bool | If true, excludes uppercase letters. | false |
| noNumeric | bool | If true, excludes numbers. | false |
| noSpecial | bool | If true, excludes special characters. | false |
| minLower | int | Minimum number of lowercase letters required. | 0 |
| minUpper | int | Minimum number of uppercase letters required. | 0 |
| minNumeric | int | Minimum number of numbers required. | 0 |
| minSpecial | int | Minimum number of special characters required. | 0 |

> [!IMPORTANT]
> The sum of all minimum requirements (MinLower + MinUpper + MinNumeric + MinSpecial) can't exceed the total Length. If any "No-" flag is true, set the corresponding "Min-" value to 0.

For example, generate a value with length 10, no special characters, and no numbers:

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

Defines the initial value from a list to highlight. Combine it with the `location` type or apply it directly to an input with a defined list of options:

```bicep
@allowed(['foo', 'bar', 'baz'])
@metadata({
  azd: {
    default: 'baz'
  }
})
param someInput string
```

This example uses the `@allowed()` annotation from Bicep to define a list of supported values for the input parameter. When `azd` prompts for this input, it uses the list of allowed values. The `default` field in the metadata controls which option is set as the initial selection:

:::image type="content" source="media/metadata/prompt-with-default.png" alt-text="A screenshot showing default during prompt from allowed values.":::

### UsageName

The `usageName` field filters the location list to only locations where a given AI SKU and capacity are available:

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

This example makes `azd` show only Azure locations where the AI model `gpt-5-mini` has enough quota (capacity of at least 10).

Prompt flow:

:::image type="content" source="media/metadata/prompt-with-usage-name.png" alt-text="A screenshot showing setting usageName to prompt for AI location.":::

> [!NOTE]
> `azd` returns an error if there isn't a location with enough quota.
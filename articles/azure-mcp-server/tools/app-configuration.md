---
title: Azure App Configuration Tools 
description: "Learn how to use Azure MCP Server tools to manage Azure App Configuration stores, key-value settings, and feature flags with natural language prompts."
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Azure App Configuration tools for the Azure MCP Server overview

The Azure MCP Server allows you to manage Azure resources, including App Configuration stores using natural language prompts. This allows you to quickly manage configuration settings and feature flags without remembering complex syntax.

[Azure App Configuration](/azure/azure-app-configuration/overview) provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their access in one place.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: List stores

<!-- appconfig account list -->

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.

Example prompts include:

- **List stores**: "List all App Configuration stores in my subscription."
- **Show stores**: "What App Configuration stores do I have?"
- **Find stores**: "I need to see my App Configuration resources"
- **Query stores**: "Can you show me all my App Config stores?"
- **Check stores**: "App Configuration stores in subscription abc123"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appconfig account list](../includes/tools/annotations/azure-app-configuration-account-list-annotations.md)]

## Key-value: Delete setting

<!-- appconfig kv delete -->

The Azure MCP Server can delete a [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store.

Example prompts include:

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my 'myappconfigstore' App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test'"
- **Remove configuration**: "Delete the old database connection string from my 'contoso-appconfig'"
- **Clean up settings**: "Delete all test settings with label 'deprecated'"
- **Purge config**: "Delete the temporary API key 'TempAuth' from app-config-dev"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example, my-appconfig). |
| **Key** |  Required | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Content type** |  Optional | The content type of the configuration value. This is used to indicate how the value should be interpreted or parsed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appconfig kv delete](../includes/tools/annotations/azure-app-configuration-key-value-delete-annotations.md)]

## Key-value: Get key-values

<!-- appconfig kv get -->

Gets key-values in an App Configuration store. This command can provide one of the following actions:

- Retrieve a specific key-value by its key and optional label
- List key-values if no key is provided. 

Listing key-values can optionally be filtered by a key filter and label filter. Each key-value includes its key, value, label, content type, ETag, last modified time, and lock status.

Example prompts include:

- **List all key-value settings**: "List all key-value settings in App Configuration store 'myappconfigstore'"
- **Show key-value settings**: "Show me the key-value settings in App Configuration store 'contoso-appconfig'"
- **Filter by key prefix**: "List all key-value settings with key name starting with 'prod-' in App Configuration store 'production-config'"
- **Get specific key content**: "Show the content for the key 'AppName:ConnectionString' in App Configuration store 'eastus-config'"
- **Environment-specific settings**: "List all key-value settings with key name starting with 'dev-' in App Configuration store 'development-config'"
- **Get labeled configuration**: "Show me the key-value settings with label 'staging' in App Configuration store 'app-config-staging'"
- **API configuration**: "Show the content for the key 'ApiSettings:Endpoint' in App Configuration store 'api-config'"
- **Database settings**: "List all key-value settings with key name starting with 'Database' in App Configuration store 'backend-config'"
- **Feature flags**: "Show me the key-value settings with label 'features' in App Configuration store 'feature-config'"
- **Application secrets**: "Show the content for the key 'Secrets:ApiKey' in App Configuration store 'secure-config'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example, `my-appconfig`). |
| **Key** |  Optional | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Key filter** |  Optional | Specifies the key filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of `foo` would get all key-values with a key of `foo`, or the filter can include a `*` character at the end of the string for wildcard searches (for example, `App*`). If omitted all keys is retrieved. |
| **Label filter** |  Optional | Specifies the label filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of `foo` would get all key-values with a label of `foo`, or the filter can include a `*` character at the end of the string for wildcard searches (for example, `Prod*`). This filter is case-sensitive. If omitted, all labels is retrieved. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appconfig kv get](../includes/tools/annotations/azure-app-configuration-key-value-get-annotations.md)]

## Key-value: Set lock on key-value

<!-- appconfig kv lock set -->

Sets the lock state of a key-value in an App Configuration store. This command can lock and unlock key-values.

Example prompts include:

- **Lock a setting**: "Lock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Lock a labeled setting**: "Lock the key 'AppName:ApiKey' with label 'production' in App Configuration store 'contoso-appconfig'."
- **Unlock a setting**: "Unlock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Unlock a labeled setting**: "Unlock the key 'AppName:ApiKey' with label 'production' in App Configuration store 'contoso-appconfig'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example,`my-appconfig`). |
| **Key** |  Required | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Content type** |  Optional | The content type of the configuration value. This is used to indicate how the value should be interpreted or parsed. |
| **Lock** |  Optional | Whether a key-value is locked (set to `read-only`) or unlocked (`read-only` removed). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appconfig kv lock set](../includes/tools/annotations/azure-app-configuration-key-value-lock-set-annotations.md)]

## Key-value: Set key-value setting

<!-- appconfig kv set -->

Set or update a [key-value setting](/azure/azure-app-configuration/concept-key-value) in an App Configuration store. 

Example prompts include:

- **Create a setting**: "Create a new key 'AppName:ApiUrl' with value 'https://api.example.com' in my 'myappconfigstore' App Configuration store."
- **Update a setting**: "Update the 'AppName:MaxRetries' setting to '5'"
- **Create a labeled setting**: "Set 'AppName:LogLevel' with value 'Debug' and label 'dev' in my 'contoso-appconfig' App Configuration store."
- **Add new config**: "Add a new setting called 'ApiEndpoint' with URL value 'https://api.contoso.com' to my 'eastus-config'"
- **Change existing value**: "Change MaxThreads to 10 in appconfig-prod"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Value**        | Required | The value to set for the key.                                               |
| **Label**        | Optional | The label of the setting to set.                                            |
| **Tags** | Optional | The tags to associate with the configuration key. Tags should be in the format `key=value`. You can specify multiple tags. |
| **Content type** | Optional | The content type of the configuration value. This value indicates how the value should be interpreted or parsed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appconfig kv set](../includes/tools/annotations/azure-app-configuration-key-value-set-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure App Configuration](/azure/azure-app-configuration/overview)
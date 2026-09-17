---
title: Azure App Configuration Tools
description: Learn how to use Azure MCP Server tools to manage Azure App Configuration stores, key-value settings, and feature flags with natural language prompts.
tool_count: 5
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
author: diberry
ms.author: diberry
ms.reviewer: conniey, joncarde
ms.date: 09/16/2026
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---
# Azure App Configuration tools for the Azure MCP Server overview

The Azure MCP Server enables you to manage Azure resources, including App Configuration stores, by using natural language prompts. You can quickly manage configuration settings and feature flags without needing to remember complex syntax.

[Azure App Configuration](/azure/azure-app-configuration/overview) provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their access in one place.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: List stores

<!-- appconfig account list -->

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- **List stores**: "List all App Configuration stores in my subscription."
- **Show stores**: "What App Configuration stores do I have?"
- **Find stores**: "I need to see my App Configuration resources"
- **Query stores**: "Can you show me all my App Config stores?"
- **Check stores**: "App Configuration stores in subscription abc123"

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp appconfig account list
```

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Key-value: Delete setting

<!-- appconfig kv delete -->

Delete a [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store. If you specify a label, the tool deletes only that labeled version. If you omit a label, the tool deletes the key-value with the default label. The result identifies the key and label, indicates whether the setting existed, and includes a status message.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my 'myappconfigstore' App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test' from App Configuration store 'myappconfigstore'"
- **Remove configuration**: "Delete the key 'ProductionEndpointUrl' from App Configuration store 'contoso-appconfig'"
- **Clean up settings**: "Delete the key 'TestSettings' with label 'deprecated' from App Configuration store 'myappconfigstore'"
- **Purge config**: "Delete the temporary setting 'TempConfig' from app-config-dev"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example, my-appconfig). |
| **Key** |  Required | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |


#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp appconfig kv delete \
  --account <account> \
  --key <key> \
  [--label <label>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account` | string | Yes | The name of the App Configuration store (for example, `my-appconfig`). |
| `key` | string | Yes | The name of the key to access within the App Configuration store. |
| `label` | string | No | The label to apply to the configuration key. Labels group and organize settings. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |


## Key-value: Get key-values

<!-- appconfig kv get -->

Gets key-values in an App Configuration store. This command can provide one of the following actions:

- Retrieve a specific key-value by its key and optional label
- List key-values if no key is provided. 

You can optionally filter the list of key-values by using a key filter and label filter. You can't use `Key` with `Key filter`, and you can't use `Label` with `Label filter`. Each key-value includes its key, value, label, content type, ETag, last modified time, and lock status.

#### [MCP Server](#tab/mcp-server)

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
- **Service endpoint**: "Show the content for the key 'Endpoints:ApiBaseUrl' in App Configuration store 'service-config'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example, `my-appconfig`). |
| **Key** |  Optional | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Key filter** |  Optional | Specifies the key filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of `foo` would get all key-values with a key of `foo`, or the filter can include a `*` character at the end of the string for wildcard searches (for example, `App*`). If omitted all keys is retrieved. |
| **Label filter** |  Optional | Specifies the label filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of `foo` would get all key-values with a label of `foo`, or the filter can include a `*` character at the end of the string for wildcard searches (for example, `Prod*`). This filter is case-sensitive. If omitted, all labels is retrieved. |



#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp appconfig kv get \
  --account <account> \
  [--key <key>] \
  [--label <label>] \
  [--key-filter <key-filter>] \
  [--label-filter <label-filter>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account` | string | Yes | The name of the App Configuration store (for example, `my-appconfig`). |
| `key` | string | No | The name of the key to access within the App Configuration store. |
| `label` | string | No | The label to apply to the configuration key. Labels group and organize settings. |
| `key-filter` | string | No | Specifies the key filter to use when retrieving key-values. The filter can be an exact match, such as `foo` to get all key-values with a key of `foo`, or it can include a `*` character at the end of the string for wildcard searches, such as `App*`. If you omit this parameter, the command retrieves all keys. |
| `label-filter` | string | No | Specifies the label filter to use when retrieving key-values. The filter can be an exact match, such as `foo` to get all key-values with a label of `foo`, or it can include a `*` character at the end of the string for wildcard searches, such as `Prod*`. This filter is case-sensitive. If you omit this parameter, the command retrieves all labels. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Key-value: Set lock on key-value

<!-- appconfig kv lock set -->

Sets the lock state of a key-value in an App Configuration store. This command can lock and unlock key-values.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- **Lock a setting**: "Lock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Lock a labeled setting**: "Lock the key 'AppName:ApiEndpoint' with label 'production' in App Configuration store 'contoso-appconfig'."
- **Unlock a setting**: "Unlock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Unlock a labeled setting**: "Unlock the key 'AppName:ApiEndpoint' with label 'production' in App Configuration store 'contoso-appconfig'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account** |  Required | The name of the App Configuration store (for example,`my-appconfig`). |
| **Key** |  Required | The name of the key to access within the App Configuration store. |
| **Label** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Lock** |  Optional | Whether a key-value is locked (set to `read-only`) or unlocked (`read-only` removed). |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp appconfig kv lock set \
  --account <account> \
  --key <key> \
  [--lock <lock>] \
  [--label <label>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account` | string | Yes | The name of the App Configuration store (for example, `my-appconfig`). |
| `key` | string | Yes | The name of the key to access within the App Configuration store. |
| `lock` | string | No | Whether a key-value is locked (set to read-only) or unlocked (read-only removed). |
| `label` | string | No | The label to apply to the configuration key. Labels group and organize settings. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Key-value: Set key-value setting

<!-- appconfig kv set -->

Set or update a [key-value setting](/azure/azure-app-configuration/concept-key-value) in an App Configuration store. 

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- **Create a setting**: "Create a new key 'AppName:ApiUrl' with value 'https://api.example.com' in my 'myappconfigstore' App Configuration store."
- **Update a setting**: "Update the key 'AppName:MaxRetries' to value '5' in App Configuration store 'myappconfigstore'"
- **Create a labeled setting**: "Set 'AppName:LogLevel' with value 'Debug' and label 'dev' in my 'contoso-appconfig' App Configuration store."
- **Add new config**: "Add a new setting called 'ApiEndpoint' with URL value 'https://api.contoso.com' to my 'eastus-config'"
- **Change existing value**: "Set key 'MaxThreads' to value '10' in App Configuration store 'appconfig-prod'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Value**        | Required | The value to set for the key.                                               |
| **Label**        | Optional | The label of the setting to set.                                            |
| **Tags** | Optional | The tags to associate with the configuration key. Tags should be in the format `key=value`. You can specify multiple tags. |
| **Content type** | Optional | The content type of the configuration value. This value indicates how the value should be interpreted or parsed. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp appconfig kv set \
  --account <account> \
  --key <key> \
  --value <value> \
  [--label <label>] \
  [--content-type <content-type>] \
  [--tags <tags>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account` | string | Yes | The name of the App Configuration store (for example, `my-appconfig`). |
| `key` | string | Yes | The name of the key to access within the App Configuration store. |
| `value` | string | Yes | The value to set for the configuration key. |
| `label` | string | No | The label to apply to the configuration key. Labels group and organize settings. |
| `content-type` | string | No | The content type of the configuration value. This value indicates how the value should be interpreted or parsed. |
| `tags` | string | No | The tags to associate with the configuration key. Tags should be in the format `key=value`. You can specify multiple tags. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure App Configuration](/azure/azure-app-configuration/overview)

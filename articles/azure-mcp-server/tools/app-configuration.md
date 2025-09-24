---
title: Azure App Configuration Tools 
description: Learn how to use the Azure MCP Server with Azure App Configuration.
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 09/23/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure App Configuration tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including App Configuration stores using natural language prompts. This allows you to quickly manage configuration settings and feature flags without remembering complex syntax.

[Azure App Configuration](/azure/azure-app-configuration/overview) provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: List stores

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.

Example prompts include:

- **List stores**: "List all App Configuration stores in my subscription."
- **Show stores**: "What App Configuration stores do I have?"
- **Find stores**: "I need to see my App Configuration resources"
- **Query stores**: "Can you show me all my App Config stores?"
- **Check stores**: "App Configuration stores in subscription abc123"


## Key-value: Delete setting

The Azure MCP Server can delete a [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store.

Example prompts include:

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my 'myappconfigstore' App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test'"
- **Remove configuration**: "Delete the old database connection string from my 'contoso-appconfig'"
- **Clean up settings**: "Delete all test settings with label 'deprecated'"
- **Purge config**: "Delete the temporary API key 'TempAuth' from app-config-dev"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to delete.                                      |
| **Label**        | Optional | The label of the setting to delete.                                         |

## Key-value: List all key-values

The Azure MCP Server can list all [key-value settings](/azure/azure-app-configuration/concept-key-value) in an App Configuration store. This allows you to view your application settings and their values in one place.

Example prompts include:

- **List all settings**: "Show me all the key-value settings in my 'myappconfigstore' App Configuration store."
- **List filtered settings**: "List all settings starting with 'AppName' in my configuration store"
- **Get multiple settings**: "What keys and values do I have in my 'app-config-dev' store?"
- **View configuration**: "List all configuration entries from contoso-appconfig"
- **Find settings with label**: "Show me settings with label 'dev'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Optional | The key filter to list settings (supports wildcards).                       |
| **Label**        | Optional | The label filter to list settings (supports wildcards).                     |



## Key-value: Set lock on key-value

Sets the lock state of a key-value in an App Configuration store. This command can lock and unlock key-values.

Example prompts include:

- **Lock a setting**: "Lock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Lock a labeled setting**: "Lock the key 'AppName:ApiKey' with label 'production' in App Configuration store 'contoso-appconfig'."
- **Unlock a setting**: "Unlock the key 'AppName:ConnectionString' in App Configuration store 'myappconfigstore'."
- **Unlock a labeled setting**: "Unlock the key 'AppName:ApiKey' with label 'production' in App Configuration store 'contoso-appconfig'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account.** |  Required | The name of the App Configuration store (for example, my-appconfig). |
| **Key.** |  Required | The name of the key to access within the App Configuration store. |
| **Label.** |  Optional | The label to apply to the configuration key. Labels are used to group and organize settings. |
| **Content. type.** |  Optional | The content type of the configuration value. This is used to indicate how the value should be interpreted or parsed. |
| **Lock.** |  Optional | Whether a key-value will be locked (set to read-only) or unlocked (read-only removed). |
                      |

## Key-value: Set key-value setting

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
| **Tags** | Optional | The tags to associate with the configuration key. Tags should be in the format 'key=value'. You can specify multiple tags. |
| **Content type** | Optional | The content type of the configuration value. This value indicates how the value should be interpreted or parsed. |

## Key-value: Show specific key-value setting

The Azure MCP Server can retrieve a specific [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store. This is useful for checking the current value of a particular setting.

Example prompts include:

- **Show a setting**: "What is the value of the 'AppName:ConnectionString' key in my 'myappconfigstore' App Configuration store?"
- **Get one setting**: "Show me the 'AppName:Theme' setting with label 'production'"
- **Query specific setting**: "I need to check the value of 'ServiceTimeout' in my 'contoso-appconfig' configuration"
- **Find single key**: "What's the current value for AppSettings:LogLevel?"
- **Retrieve specific config**: "Get the database connection string from eastus-config"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Label**        | Optional | The label of the setting to set.                                            |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)

---
title: Azure App Configuration Tools 
description: Learn how to use the Azure MCP Server with Azure App Configuration.
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 05/14/2025
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

## Delete key-value setting

The Azure MCP Server can delete a [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store.

Example prompts include:

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my 'myappconfigstore' App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test'"
- **Remove configuration**: "Delete the old database connection string from my 'contoso-appconfig'"
- **Clean up settings**: "Delete all test settings with label 'deprecated'"
- **Purge config**: "Delete the temporary API key 'TempAuth' from app-config-dev"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to delete.                                      |
| **Label**        | Optional | The label of the setting to delete.                                         |

## List key-value settings

The Azure MCP Server can list all [key-value settings](/azure/azure-app-configuration/concept-key-value) in an App Configuration store. This allows you to view your application settings and their values in one place.

Example prompts include:

- **List all settings**: "Show me all the key-value settings in my 'myappconfigstore' App Configuration store."
- **List filtered settings**: "List all settings starting with 'AppName' in my configuration store"
- **Get multiple settings**: "What keys and values do I have in my 'app-config-dev' store?"
- **View configuration**: "List all configuration entries from contoso-appconfig"
- **Find settings with label**: "Show me settings with label 'dev'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Optional | The key filter to list settings (supports wildcards).                       |
| **Label**        | Optional | The label filter to list settings (supports wildcards).                     |

## List stores

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.

Example prompts include:

- **List stores**: "List all App Configuration stores in my subscription."
- **Show stores**: "What App Configuration stores do I have?"
- **Find stores**: "I need to see my App Configuration resources"
- **Query stores**: "Can you show me all my App Config stores?"
- **Check stores**: "App Configuration stores in subscription abc123"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |

## Lock key-value setting

The Azure MCP Server can lock a [key-value setting](/azure/azure-app-configuration/concept-key-value) in an App Configuration store, making it read-only.

Example prompts include:

- **Lock a setting**: "Make the 'AppName:ConnectionString' key read-only in my 'myappconfigstore' App Configuration store."
- **Lock a labeled setting**: "Lock the 'AppName:ApiKey' setting with label 'production'"
- **Protect configuration**: "Lock my database connection string in 'contoso-appconfig' so it can't be changed"
- **Secure setting**: "Make ApiSecrets read-only"
- **Prevent edits**: "Set the production endpoint URL in app-config-central to read-only mode"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to lock.                                        |
| **Label**        | Optional | The label of the setting to lock.                                           |

## Set key-value setting

The Azure MCP Server can create or update a [key-value setting](/azure/azure-app-configuration/concept-key-value) in an App Configuration store.

Example prompts include:

- **Create a setting**: "Create a new key 'AppName:ApiUrl' with value 'https://api.example.com' in my 'myappconfigstore' App Configuration store."
- **Update a setting**: "Update the 'AppName:MaxRetries' setting to '5'"
- **Create a labeled setting**: "Set 'AppName:LogLevel' with value 'Debug' and label 'dev' in my 'contoso-appconfig' App Configuration store."
- **Add new config**: "Add a new setting called 'ApiEndpoint' with URL value 'https://api.contoso.com' to my 'eastus-config'"
- **Change existing value**: "Change MaxThreads to 10 in appconfig-prod"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Value**        | Required | The value to set for the key.                                               |
| **Label**        | Optional | The label of the setting to set.                                            |

## Show key-value setting

The Azure MCP Server can retrieve a specific [key-value setting](/azure/azure-app-configuration/concept-key-value) from an App Configuration store. This is useful for checking the current value of a particular setting.

Example prompts include:

- **Show a setting**: "What is the value of the 'AppName:ConnectionString' key in my 'myappconfigstore' App Configuration store?"
- **Get one setting**: "Show me the 'AppName:Theme' setting with label 'production'"
- **Query specific setting**: "I need to check the value of 'ServiceTimeout' in my 'contoso-appconfig' configuration"
- **Find single key**: "What's the current value for AppSettings:LogLevel?"
- **Retrieve specific config**: "Get the database connection string from eastus-config"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Label**        | Optional | The label of the setting to set.                                            |

## Unlock key-value setting

The Azure MCP Server can unlock a previously locked [key-value setting](/azure/azure-app-configuration/concept-key-value) in an App Configuration store, making it editable again.

Example prompts include:

- **Unlock a setting**: "Make the 'AppName:ConnectionString' key editable in my 'myappconfigstore' App Configuration store."
- **Unlock a labeled setting**: "Unlock the 'AppName:ApiKey' setting with label 'production'"
- **Allow edits**: "Remove the read-only lock from 'DatabaseSettings' in contoso-appconfig"
- **Enable changes**: "Unlock the config values for TestEndpoint"
- **Remove lock**: "Make the MaxConnections setting in 'app-config-central' writable again"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The ID of the subscription containing the App Configuration store.          |
| **Account name** | Required | The name of the App Configuration store.                                    |
| **Key**          | Required | The key name of the setting to set.                                         |
| **Label**        | Optional | The label of the setting to set.                                            |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
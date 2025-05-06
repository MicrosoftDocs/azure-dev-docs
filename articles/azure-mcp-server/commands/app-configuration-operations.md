---
title: App Configuration Operations 
description: Learn how to use the Azure MCP Server with App Configuration.
keywords: azure mcp server, azmcp, app configuration
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
# App Configuration operations

The Azure MCP Server allows you to manage Azure resources, including App Configuration stores.

[Azure App Configuration](/azure/azure-app-configuration/overview) provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.


[!INCLUDE [tip-about-params](../includes/commands/parameter-consideration.md)]

## List stores 

The Azure MCP Server can list App Configuration stores in a subscription. This is useful for quickly checking the status of your App Configuration resources.


### Example prompts

Example prompts for using the Azure MCP Server with App Configuration.

- **List stores**: "List all App Configuration stores in my subscription."
- **Show stores**: "What App Configuration stores do I have?"
- **Find stores**: "I need to see my App Configuration resources"
- **Query stores**: "Can you show me all my App Config stores?"
- **Check stores**: "App Configuration stores in subscription abc123"

### Command reference

The Azure MCP Server has commands to manage App Configuration resources. Advanced users and automation tools use these commands.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig account list | List App Configuration stores in a subscription.|

```console
azmcp appconfig account list \
    --subscription <SUBSCRIPTION_ID>
```

#### Required parameters

- `--subscription`: The ID of the subscription to list App Configuration stores from. This parameter is required.
 
#### Optional parameters

None

#### Examples

List all App Configuration stores in the specified subscription.

```console
azmcp appconfig account list \
    --subscription "my-subscription-id"
```

## List key-value settings

The Azure MCP Server can list all key-value settings in an App Configuration store. This allows you to view your application settings and their values in one place.

### Example prompts

- **List all settings**: "Show me all the key-value settings in my 'myappconfigstore' App Configuration store."
- **List filtered settings**: "List all settings starting with 'AppName' in my configuration store"
- **Get multiple settings**: "What keys and values do I have in my 'app-config-dev' store?"
- **View configuration**: "List all configuration entries from contoso-appconfig"
- **Find settings with label**: "Show me settings with label 'dev'"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv list | List key-value settings in an App Configuration store.|

```console
azmcp appconfig kv list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    [--key <KEY>] \
    [--label <LABEL>]
```


#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.

#### Optional parameters

- `--key`: Filter results to only show settings with keys matching the specified pattern.
- `--label`: Filter results to only show settings with the specified label.


#### Examples

List all key-value settings in the specified App Configuration store.

```console
azmcp appconfig kv list \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore"
```

List only key-value settings with keys that begin with app name, "AppName:*".

```console
azmcp appconfig kv list \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:*"
```
List only key-value settings that have the "dev" label.

```console
azmcp appconfig kv list \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --label "dev"
```

## Show key-value setting

The Azure MCP Server can retrieve a specific key-value setting from an App Configuration store. This is useful for checking the current value of a particular setting.

### Example prompts

- **Show a setting**: "What is the value of the 'AppName:ConnectionString' key in my 'myappconfigstore' App Configuration store?"
- **Get one setting**: "Show me the 'AppName:Theme' setting with label 'production'"
- **Query specific setting**: "I need to check the value of 'ServiceTimeout' in my 'contoso-appconfig' configuration"
- **Find single key**: "What's the current value for AppSettings:LogLevel?"
- **Retrieve specific config**: "Get the database connection string from eastus-config"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv show | Show a specific key-value setting in an App Configuration store.|

```console
azmcp appconfig kv show \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --key <KEY> \
    [--label <LABEL>]
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to retrieve.

#### Optional parameters

- `--label`: The label of the setting to retrieve.

#### Examples

Retrieve a key-value setting without a label from the App Configuration store.

```console
azmcp appconfig kv show \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ConnectionString"
```

Retrieve a key-value setting with a specific label from the App Configuration store.

```console
azmcp appconfig kv show \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:Theme" \
    --label "production"
```

## Set key-value setting

The Azure MCP Server can create or update a key-value setting in an App Configuration store.

### Example prompts

- **Create a setting**: "Create a new key 'AppName:ApiUrl' with value 'https://api.example.com' in my 'myappconfigstore' App Configuration store."
- **Update a setting**: "Update the 'AppName:MaxRetries' setting to '5'"
- **Create a labeled setting**: "Set 'AppName:LogLevel' with value 'Debug' and label 'dev' in my 'contoso-appconfig' App Configuration store."
- **Add new config**: "Add a new setting called 'ApiEndpoint' with URL value 'https://api.contoso.com' to my 'eastus-config'"
- **Change existing value**: "Change MaxThreads to 10 in appconfig-prod"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv set | Create or update a key-value setting in an App Configuration store.|

```console
azmcp appconfig kv set \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --key <KEY> \
    --value <VALUE> \
    [--label <LABEL>]
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to create or update.
- `--value`: The value to set for the key.

#### Optional parameters

- `--label`: The label to apply to the setting.

#### Examples

Create a new key-value setting without a label in an App Configuration store.

```console
azmcp appconfig kv set \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ApiUrl" \
    --value "https://api.example.com"
```

Create a new key-value setting with a specific label for environment-specific configuration.

```console
azmcp appconfig kv set \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:LogLevel" \
    --value "Debug" \
    --label "dev"
```


## Lock key-value setting

The Azure MCP Server can lock a key-value setting in an App Configuration store, making it read-only.

### Example prompts

- **Lock a setting**: "Make the 'AppName:ConnectionString' key read-only in my 'myappconfigstore' App Configuration store."
- **Lock a labeled setting**: "Lock the 'AppName:ApiKey' setting with label 'production'"
- **Protect configuration**: "Lock my database connection string in 'contoso-appconfig' so it can't be changed"
- **Secure setting**: "Make ApiSecrets read-only"
- **Prevent edits**: "Set the production endpoint URL in app-config-central to read-only mode"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv lock | Lock a key-value setting in an App Configuration store.|

```console
azmcp appconfig kv lock \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --key <KEY> \
    [--label <LABEL>]
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to lock.

#### Optional parameters

- `--label`: The label of the setting to lock.

#### Examples

Lock a key without a label to make it read-only in the App Configuration store.

```console
azmcp appconfig kv lock \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ConnectionString"
```

Lock a key with a specific label to protect environment-specific configuration from changes.

```console
azmcp appconfig kv lock \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ApiKey" \
    --label "production"
```

## Unlock key-value setting

The Azure MCP Server can unlock a previously locked key-value setting in an App Configuration store, making it editable again.

### Example prompts

- **Unlock a setting**: "Make the 'AppName:ConnectionString' key editable in my 'myappconfigstore' App Configuration store."
- **Unlock a labeled setting**: "Unlock the 'AppName:ApiKey' setting with label 'production'"
- **Allow edits**: "Remove the read-only lock from 'DatabaseSettings' in contoso-appconfig"
- **Enable changes**: "Unlock the config values for TestEndpoint"
- **Remove lock**: "Make the MaxConnections setting in 'app-config-central' writable again"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv unlock | Unlock a key-value setting in an App Configuration store.|

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to unlock.

#### Optional parameters

- `--label`: The label of the setting to unlock.

#### Examples

Unlock a key without a label to make it editable in the specified App Configuration store.

```console
azmcp appconfig kv unlock \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ConnectionString"
```

Unlock a key with a specific label, allowing edits to the production version only.

```console
azmcp appconfig kv unlock \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:ApiKey" \
    --label "production"
```

## Delete key-value setting

The Azure MCP Server can delete a key-value setting from an App Configuration store.

### Example prompts

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my 'myappconfigstore' App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test'"
- **Remove configuration**: "Delete the old database connection string from my 'contoso-appconfig'"
- **Clean up settings**: "Delete all test settings with label 'deprecated'"
- **Purge config**: "Delete the temporary API key 'TempAuth' from app-config-dev"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv delete | Delete a key-value setting from an App Configuration store.|

```console
azmcp appconfig kv delete \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --key <KEY> \
    [--label <LABEL>]
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to delete.

#### Optional parameters

- `--label`: The label of the setting to delete.

#### Examples

Delete a key-value setting without a label from the App Configuration store.

```console
azmcp appconfig kv delete \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:TemporaryConfig"
```

Delete a key-value setting with a specific label, useful for removing test configurations.

```console
azmcp appconfig kv delete \
    --subscription "my-subscription-id" \
    --account-name "myappconfigstore" \
    --key "AppName:FeatureFlag" \
    --label "test"
```



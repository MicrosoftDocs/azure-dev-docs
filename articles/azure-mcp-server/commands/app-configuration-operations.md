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

[Azure App Configuration](/azure/azure-app-configuration/overview) provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.

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

## List key-value settings

The Azure MCP Server can list all key-value settings in an App Configuration store. This allows you to view your application settings and their values in one place.

### Example prompts

- **List all settings**: "Show me all the key-value settings in my App Configuration store."
- **List filtered settings**: "List all settings that start with 'AppName' in my configuration store."
- **List settings with label**: "Show me all key-value pairs with the 'dev' label in my App Configuration store."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv list | List key-value settings in an App Configuration store.|

```azuremcp
azmcp appconfig kv list --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> [--key <KEY>] [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv list --subscription "my-subscription-id" --account-name "myappconfigstore"
```

```azuremcp
azmcp appconfig kv list --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:*"
```

```azuremcp
azmcp appconfig kv list --subscription "my-subscription-id" --account-name "myappconfigstore" --label "dev"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.

#### Optional parameters

- `--key`: Filter results to only show settings with keys matching the specified pattern.
- `--label`: Filter results to only show settings with the specified label.

## Show key-value setting

The Azure MCP Server can retrieve a specific key-value setting from an App Configuration store. This is useful for checking the current value of a particular setting.

### Example prompts

- **Show a setting**: "What is the value of the 'AppName:ConnectionString' key in my App Configuration store?"
- **Show a labeled setting**: "Show me the 'AppName:Theme' key with the 'production' label."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv show | Show a specific key-value setting in an App Configuration store.|

```azuremcp
azmcp appconfig kv show --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> --key <KEY> [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv show --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ConnectionString"
```

```azuremcp
azmcp appconfig kv show --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:Theme" --label "production"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to retrieve.

#### Optional parameters

- `--label`: The label of the setting to retrieve.

## Set key-value setting

The Azure MCP Server can create or update a key-value setting in an App Configuration store.

### Example prompts

- **Create a setting**: "Create a new key 'AppName:ApiUrl' with value 'https://api.example.com' in my App Configuration store."
- **Update a setting**: "Update the 'AppName:MaxRetries' setting to '5' in my configuration store."
- **Create a labeled setting**: "Add a setting 'AppName:LogLevel' with value 'Debug' and label 'dev' to my App Configuration store."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv set | Create or update a key-value setting in an App Configuration store.|

```azuremcp
azmcp appconfig kv set --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> --key <KEY> --value <VALUE> [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv set --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ApiUrl" --value "https://api.example.com"
```

```azuremcp
azmcp appconfig kv set --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:LogLevel" --value "Debug" --label "dev"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to create or update.
- `--value`: The value to set for the key.

#### Optional parameters

- `--label`: The label to apply to the setting.

## Lock key-value setting

The Azure MCP Server can lock a key-value setting in an App Configuration store, making it read-only.

### Example prompts

- **Lock a setting**: "Make the 'AppName:ConnectionString' key read-only in my App Configuration store."
- **Lock a labeled setting**: "Lock the 'AppName:ApiKey' setting with label 'production'."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv lock | Lock a key-value setting in an App Configuration store.|

```azuremcp
azmcp appconfig kv lock --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> --key <KEY> [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv lock --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ConnectionString"
```

```azuremcp
azmcp appconfig kv lock --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ApiKey" --label "production"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to lock.

#### Optional parameters

- `--label`: The label of the setting to lock.

## Unlock key-value setting

The Azure MCP Server can unlock a previously locked key-value setting in an App Configuration store, making it editable again.

### Example prompts

- **Unlock a setting**: "Make the 'AppName:ConnectionString' key editable in my App Configuration store."
- **Unlock a labeled setting**: "Unlock the 'AppName:ApiKey' setting with label 'production'."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv unlock | Unlock a key-value setting in an App Configuration store.|

```azuremcp
azmcp appconfig kv unlock --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> --key <KEY> [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv unlock --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ConnectionString"
```

```azuremcp
azmcp appconfig kv unlock --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:ApiKey" --label "production"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to unlock.

#### Optional parameters

- `--label`: The label of the setting to unlock.

## Delete key-value setting

The Azure MCP Server can delete a key-value setting from an App Configuration store.

### Example prompts

- **Delete a setting**: "Remove the 'AppName:TemporaryConfig' key from my App Configuration store."
- **Delete a labeled setting**: "Delete the 'AppName:FeatureFlag' setting with label 'test' from my configuration store."

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp appconfig kv delete | Delete a key-value setting from an App Configuration store.|

```azuremcp
azmcp appconfig kv delete --subscription <SUBSCRIPTION_ID> --account-name <ACCOUNT_NAME> --key <KEY> [--label <LABEL>]
```

#### Examples

```azuremcp
azmcp appconfig kv delete --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:TemporaryConfig"
```

```azuremcp
azmcp appconfig kv delete --subscription "my-subscription-id" --account-name "myappconfigstore" --key "AppName:FeatureFlag" --label "test"
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the App Configuration store.
- `--account-name`: The name of the App Configuration store.
- `--key`: The key name of the setting to delete.

#### Optional parameters

- `--label`: The label of the setting to delete.


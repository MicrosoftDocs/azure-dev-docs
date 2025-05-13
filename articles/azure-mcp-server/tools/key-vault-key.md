---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Key Vault tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Key Vault resources, including keys, secrets, and certificates.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing MCP server for Key Vault

This section describes how to interact with Azure Key Vault services using natural language prompts with the Azure MCP Server. You can manage cryptographic keys, secrets, and certificates securely without remembering specialized command syntax.

### Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This allows you to add cryptographic keys for your applications.

**Example prompts** include:

- **Create key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up key**: "Create an encryption key for my application in Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

### Get key

The Azure MCP Server can retrieve details of a specific key from an Azure Key Vault. This allows you to view key properties and metadata.

**Example prompts** include:

- **Get key**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **Retrieve key**: "Get properties of the 'data-key' in my Key Vault"
- **Check key**: "Show me the details of the encryption key in my vault"
- **Find key**: "Get the properties of 'jwt-signing' key in 'api-vault'"

### List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This helps you manage your cryptographic keys.

**Example prompts** include:

- **List keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"




## Develop new MCP server for Key Vault

This section provides guidance for implementing Azure Key Vault capabilities in your MCP server. The APIs described below enable secure management of cryptographic keys and other Key Vault resources through structured commands.

### Create key

The Azure MCP Server can create a new key in an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key create | Create a key in a Key Vault.|

```console
azmcp keyvault key create \
    --subscription <SUBSCRIPTION_ID> \
    --vault <VAULT_NAME> \
    --key <KEY_NAME> \
    --key-type <KEY_TYPE>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault`: The name of the Key Vault.<br>
`--key`: The name of the key to create.<br>
`--key-type`: The type of key to create. Valid values are RSA, RSA-HSM, EC, EC-HSM.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Create an RSA key with default 2048-bit size.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault "mykeyvault" \
    --key "app-encryption-key" \
    --key-type "RSA"
```

Create an EC key with P-256 curve.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault "mykeyvault" \
    --key "signing-key" \
    --key-type "EC"
```

### Get key

The Azure MCP Server can retrieve details of a specific key from an Azure Key Vault. This allows you to view key properties and metadata.


#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key get | Get details of a key from a Key Vault.|


```console
azmcp keyvault key get \
    --subscription <SUBSCRIPTION_ID> \
    --vault <VAULT_NAME> \
    --key <KEY_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

--subscription: The ID of the subscription containing the Key Vault.<br> 
--vault: The name of the Key Vault.<br> 
--key: The name of the key to retrieve.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get the latest version of a key from the specified Key Vault.

```console
azmcp keyvault key get \
    --subscription "my-subscription-id" \
    --vault "mykeyvault" \
    --key "app-encryption-key"
```

Get a specific version of a key.

```console
azmcp keyvault key get \
    --subscription "my-subscription-id" \
    --vault "mykeyvault" \
    --key "app-encryption-key"
```

### List keys

The Azure MCP Server can list all keys in an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key list | List keys in a Key Vault.|

```console
azmcp keyvault key list \
    --subscription <SUBSCRIPTION_ID> \
    --vault <VAULT_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault`: The name of the Key Vault.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all keys in the specified Key Vault.

```console
azmcp keyvault key list \
    --subscription "my-subscription-id" \
    --vault "mykeyvault"
```

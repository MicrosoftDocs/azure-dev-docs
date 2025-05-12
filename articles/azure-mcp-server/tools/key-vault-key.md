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


### Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This allows you to add cryptographic keys for your applications.

**Example prompts** include:

- **Create key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up key**: "Create an encryption key for my application in Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

### Get key

### List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This helps you manage your cryptographic keys.

**Example prompts** include:

- **List keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"




## Develop new MCP server for Key Vault

### Create key

The Azure MCP Server can create a new key in an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key create | Create a key in a Key Vault.|

```console
azmcp keyvault key create \
    --subscription <SUBSCRIPTION_ID> \
    --vault-name <VAULT_NAME> \
    --name <KEY_NAME> \
    --kty <KEY_TYPE> \
    [--size <KEY_SIZE>] \
    [--curve-name <CURVE_NAME>]
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.<br>
`--name`: The name of the key to create.<br>
`--kty`: The type of key to create. Valid values are RSA, RSA-HSM, EC, EC-HSM.

##### Optional parameters

`--size`: The key size in bits. For RSA keys, the supported values are 2048, 3072, and 4096.<br>
`--curve-name`: The curve name for EC keys. Valid values are P-256, P-384, P-521, and P-256K.

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Create an RSA key with default 2048-bit size.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "app-encryption-key" \
    --kty "RSA"
```

Create an EC key with P-256 curve.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "signing-key" \
    --kty "EC" \
    --curve-name "P-256"
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

--subscription: The ID of the subscription containing the Key Vault.<br> --vault-name: The name of the Key Vault.<br> --name: The name of the key to retrieve.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get the latest version of a key from the specified Key Vault.

```console
azmcp keyvault key get \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "app-encryption-key"
```

Get a specific version of a key.

```console
azmcp keyvault key get \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "app-encryption-key" \
    --version "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
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
    --vault-name <VAULT_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all keys in the specified Key Vault.

```console
azmcp keyvault key list \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault"
```

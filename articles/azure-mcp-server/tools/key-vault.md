---
title: Azure Key Vault Tools
description: Learn how to use the Azure MCP Server with Azure Key Vault.
keywords:  azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---

# Azure Key Vault tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Key Vault keys, secrets, and certificates.

[Azure Key Vault](/azure/key-vault/keys/) provides two types of resources to store and manage cryptographic [keys](/azure/key-vault/keys/about-keys-details). Vaults support software-protected and HSM-protected (Hardware Security Module) keys. Managed HSMs only support HSM-protected keys.

[!INCLUDE [tip-about-params](../includes/toolsparameter-consideration.md)]

## List keys in a vault

The Azure MCP Server can list all keys in an Azure Key Vault. This functionality is useful for auditing and managing the cryptographic keys used by your applications.

### Example prompts

Example prompts for using the Azure MCP Server with Key Vault keys.

- **List keys**: "List all keys in my 'contoso-vault' Key Vault."
- **Show keys**: "What keys do I have in my Key Vault?"
- **Find keys**: "I need to see all cryptographic keys in vault-prod"
- **Query keys**: "Can you show me all my keys in 'security-vault'?"
- **Check keys**: "Key Vault keys in my vault"

### Reference

The Azure MCP Server has tools to manage Key Vault keys. Advanced users and automation tools use these tools.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key list | List keys in a Key Vault.|

```console
azmcp keyvault key list \
    --subscription <SUBSCRIPTION_ID> \
    --vault <VAULT_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault`: The name of the Key Vault to list keys from.
 
#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

List all keys in the specified Key Vault.

```console
azmcp keyvault key list \
    --subscription "my-subscription-id" \
    --vault "contoso-vault"
```

## Get a key from a vault

The Azure MCP Server can retrieve a specific [keys](/azure/key-vault/keys/about-keys-details) from an Azure Key Vault. This functionality allows you to view the properties of a cryptographic key used by your applications.

### Example prompts

- **Get key properties**: "Show me the details of the 'encryption-key' in my 'contoso-vault' Key Vault."
- **Show key information**: "What are the properties of my 'signing-key'?"
- **Find key details**: "Get information about the 'data-protection-key' in security-vault"
- **View key attributes**: "What algorithm is used for 'api-encryption-key'?"
- **Check key status**: "Is my 'database-key' enabled?"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key get | Get a key from a Key Vault.|

```console
azmcp keyvault key get \
    --subscription <SUBSCRIPTION_ID> \
    --vault <VAULT_NAME> \
    --key <KEY_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault`: The name of the Key Vault containing the key.<br>
`--key`: The name of the key to retrieve.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

Get a specific key from the specified Key Vault.

```console
azmcp keyvault key get \
    --subscription "my-subscription-id" \
    --vault "contoso-vault" \
    --key "encryption-key"
```

## Create a key in a vault

The Azure MCP Server can create a new [key](/azure/key-vault/keys/about-keys-details) in an Azure Key Vault. This functionality is useful for generating cryptographic keys for your applications.

### Example prompts

- **Create a key**: "Create a new RSA key named 'api-key' in my 'contoso-vault' Key Vault."
- **Generate a key**: "I need a new EC key called 'signing-key' in security-vault"
- **Add a key**: "Create an encryption key for my application in vault-prod"
- **Make a new key**: "Generate a 2048-bit RSA key named 'database-key'"
- **Set up a key**: "Create a new key for JWT signing in my Key Vault"

### Reference

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

#### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault`: The name of the Key Vault to create the key in.<br>
`--key`: The name to give the new key.<br>
`--key-type`: The type of key to create such as RSA and EC.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

#### JSON response

[!INCLUDE [JSON response](../includes/response-format.md)]

#### Examples

Create a new RSA key in the specified Key Vault.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault "contoso-vault" \
    --key "api-encryption-key" \
    --key-type "RSA"
```

Create a new Elliptic Curve key in the specified Key Vault.

```console
azmcp keyvault key create \
    --subscription "my-subscription-id" \
    --vault "contoso-vault" \
    --key "signing-key" \
    --key-type "EC"


---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Key Vault.
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

## Use existing server

### List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This helps you manage your cryptographic keys.

**Example prompts** include:

- **List keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"

### Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This allows you to add cryptographic keys for your applications.

**Example prompts** include:

- **Create key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up key**: "Create an encryption key for my application in Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

### Delete key

The Azure MCP Server can delete a key from an Azure Key Vault.

**Example prompts** include:

- **Delete key**: "Delete the key named 'old-encryption-key' from my 'mykeyvault' Key Vault."
- **Remove key**: "Remove the 'deprecated-key' from Key Vault 'security-kv'"
- **Purge key**: "Permanently delete the 'test-key' from my Key Vault"
- **Eliminate key**: "Delete the unused encryption key from my vault"
- **Discard key**: "Remove the outdated signing key from my Key Vault"

### List secrets

The Azure MCP Server can list all secrets in an Azure Key Vault. This helps you manage your sensitive information.

**Example prompts** include:

- **List secrets**: "Show me all secrets in my 'mykeyvault' Key Vault."
- **View secrets**: "What secrets do I have in Key Vault 'security-kv'?"
- **Find secrets**: "List secrets in my Key Vault 'central-secrets'"
- **Query secrets**: "Show all secrets in my Key Vault"
- **Check secrets**: "What secrets are available in my 'api-vault'?"

### Set secret

The Azure MCP Server can create or update a secret in an Azure Key Vault. This allows you to securely store sensitive information.

**Example prompts** include:

- **Create secret**: "Create a new secret named 'db-connection-string' with value 'Server=myserver;Database=mydb;' in my 'mykeyvault' Key Vault."
- **Update secret**: "Update the 'api-key' secret to 'new-api-key-value' in Key Vault 'security-kv'"
- **Add secret**: "Add a new secret called 'smtp-password' with value 'P@ssw0rd' to my Key Vault"
- **Set up secret**: "Store my application's OAuth client secret in Key Vault"
- **Save secret**: "Store the database connection string in my 'app-vault' as 'connection-string'"

### Delete secret

The Azure MCP Server can delete a secret from an Azure Key Vault.

**Example prompts** include:

- **Delete secret**: "Delete the secret named 'old-api-key' from my 'mykeyvault' Key Vault."
- **Remove secret**: "Remove the 'deprecated-password' from Key Vault 'security-kv'"
- **Purge secret**: "Permanently delete the 'test-connection-string' from my Key Vault"
- **Eliminate secret**: "Delete the unused OAuth client secret from my vault"
- **Discard secret**: "Remove the outdated SMTP password from my Key Vault"

## Develop new server

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

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

List all keys in the specified Key Vault.

```console
azmcp keyvault key list \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault"
```

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

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.<br>
`--name`: The name of the key to create.<br>
`--kty`: The type of key to create. Valid values are RSA, RSA-HSM, EC, EC-HSM.

##### Optional parameters

`--size`: The key size in bits. For RSA keys, the supported values are 2048, 3072, and 4096.<br>
`--curve-name`: The curve name for EC keys. Valid values are P-256, P-384, P-521, and P-256K.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

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

### Delete key

The Azure MCP Server can delete a key from an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault key delete | Delete a key from a Key Vault.|

```console
azmcp keyvault key delete \
    --subscription <SUBSCRIPTION_ID> \
    --vault-name <VAULT_NAME> \
    --name <KEY_NAME>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.<br>
`--name`: The name of the key to delete.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Delete a key from the specified Key Vault.

```console
azmcp keyvault key delete \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "old-encryption-key"
```

### List secrets

The Azure MCP Server can list all secrets in an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault secret list | List secrets in a Key Vault.|

```console
azmcp keyvault secret list \
    --subscription <SUBSCRIPTION_ID> \
    --vault-name <VAULT_NAME>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

List all secrets in the specified Key Vault.

```console
azmcp keyvault secret list \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault"
```

### Set secret

The Azure MCP Server can create or update a secret in an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault secret set | Create or update a secret in a Key Vault.|

```console
azmcp keyvault secret set \
    --subscription <SUBSCRIPTION_ID> \
    --vault-name <VAULT_NAME> \
    --name <SECRET_NAME> \
    --value <SECRET_VALUE>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.<br>
`--name`: The name of the secret to create or update.<br>
`--value`: The value of the secret.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Create a new secret in the specified Key Vault.

```console
azmcp keyvault secret set \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "db-connection-string" \
    --value "Server=myserver;Database=mydb;User Id=admin;Password=password;"
```

### Delete secret

The Azure MCP Server can delete a secret from an Azure Key Vault.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp keyvault secret delete | Delete a secret from a Key Vault.|

```console
azmcp keyvault secret delete \
    --subscription <SUBSCRIPTION_ID> \
    --vault-name <VAULT_NAME> \
    --name <SECRET_NAME>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Key Vault.<br>
`--vault-name`: The name of the Key Vault.<br>
`--name`: The name of the secret to delete.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Delete a secret from the specified Key Vault.

```console
azmcp keyvault secret delete \
    --subscription "my-subscription-id" \
    --vault-name "mykeyvault" \
    --name "old-api-key"
```

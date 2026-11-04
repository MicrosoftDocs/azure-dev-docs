---
title: Azure Key Vault Tools
description: Learn how to use the Azure MCP Server with Azure Key Vault keys, secrets, and certificates.
author: sandeep-sen
ms.author: sandeepsen
ms.reviewer: mbaldwin
ms.date: 11/03/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 8
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---
# Azure MCP Server tools for Azure Key Vault

The Azure MCP Server lets you manage Azure Key Vault resources, including keys, secrets, and certificates with natural language prompts. You don't need to remember specialized command syntax to manage these resources.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets, keys, and certificates. A secret is anything that you want to tightly control access to, such as API keys, passwords, or connection strings.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Administration: Get all managed HSM settings

<!-- keyvault admin settings get -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault admin settings get \
  --vault <vault>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the Key Vault. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault admin settings get -->

Example prompts include:

- **Get account settings**:
  - "Get the account settings for my managed HSM 'myhsm'"
  - "Show me the account settings for managed HSM 'contoso-hsm'"
- **Query a specific setting**: "What's the value of the 'purgeProtection' setting in my managed HSM with name 'myhsm'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Vault** |  Required | The name of the Key Vault. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Keys: Create key

<!-- keyvault key create -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault key create \
  --key <key> \
  --key-type <key-type> \
  --vault <vault>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | Yes | The name of the key. |
| `key-type` | string | Yes | The type of key to create. Valid values: RSA, RSA-HSM, EC, EC-HSM. Note: RSA-HSM and EC-HSM require a premium SKU vault. |
| `vault` | string | Yes | The name of the Key Vault. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault key create -->

Example prompts include:

- **Create RSA key**: "Create a new RSA key named 'app-encryption-key' in my key vault 'mykeyvault'"
- **Generate EC key**: "Generate a new EC key called 'signing-key' in key vault 'security-kv'"
- **Add encryption key**: "Add a new 2048-bit RSA key named 'data-key' to key vault 'mykeyvault'"
- **Set up signing key**: "Create an EC key named 'signing-key' for JWT signing in key vault 'mykeyvault'"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my key vault 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Key name** | Required | The name of the key to create. |
| **Key type** | Required | The type of key to create. Valid values: `RSA`, `EC`, `RSA-HSM`, `EC-HSM`. Note: `RSA-HSM` and `EC-HSM` require a premium SKU vault. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Keys: Get or list keys

<!-- keyvault key get -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault key get \
  --vault <vault> \
  [--key <key>] \
  [--include-managed <include-managed>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the Key Vault. |
| `key` | string | No | The name of the key. |
| `include-managed` | string | No | Whether to include managed keys in results. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault key get -->

Example prompts include:

- **Get key details**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key info**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **List all keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Query keys**: "Show all keys including managed keys in my Key Vault 'mykeyvault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Key name** | Optional | The name of the key to retrieve. Omit to list all keys. |
| **Include managed** | Optional | Whether or not to include managed keys when listing. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Secrets: Create secret

<!-- keyvault secret create -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault secret create \
  --secret <secret> \
  --value <value> \
  --vault <vault>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `secret` | string | Yes | The name of the secret. |
| `value` | string | Yes | The value to set for the secret. |
| `vault` | string | Yes | The name of the Key Vault. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault secret create -->

Example prompts include:

- **Create API secret**: "Create a secret named 'api-key' with value 'xyz123' in my key vault named 'production-vault'."
- **Store password**: "Add a secret called 'database-password' with value 'myP@ssw0rd' to key vault 'security-kv'"
- **Save connection string**: "Create a secret 'db-connection' with value 'Server=myserver;Database=mydb' in key vault 'mykeyvault'"
- **Add credentials**: "Store secret 'sp-secret' with value 'abc123def456' in key vault 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Secret name** | Required | The name of the secret to create. |
| **Value** | Required | The value of the secret to store. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

## Secrets: Get or list secrets

<!-- keyvault secret get -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault secret get \
  --vault <vault> \
  [--secret <secret>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the Key Vault. |
| `secret` | string | No | The name of the secret. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault secret get -->

Example prompts include:

- **Get specific secret**: "Retrieve the 'database-connection-string' secret from my 'production-vault' Key Vault."
- **Access API key**: "Get the 'third-party-api-key' secret from the 'api-secrets' vault"
- **List all secrets**: "Show me all secrets in my 'production-vault' Key Vault."
- **View secrets**: "What secrets do I have in Key Vault 'api-secrets'?"
- **Find secrets**: "List secrets in my Key Vault 'configuration-kv'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Secret name** | Optional | The name of the secret to retrieve. Omit to list all secrets. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |

## Certificates: Create certificate

<!-- keyvault certificate create -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault certificate create \
  --certificate <certificate> \
  --vault <vault>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `certificate` | string | Yes | The name of the certificate. |
| `vault` | string | Yes | The name of the Key Vault. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault certificate create -->

Example prompts include:

- **Create SSL certificate**: "Create a certificate named 'web-ssl-cert' in my key vault 'production-vault'."
- **Generate certificate**: "Create a new certificate called 'api-tls-cert' in key vault 'security-kv'"
- **Add certificate**: "Generate a certificate 'webapp-cert' for my web application in key vault 'mykeyvault'"
- **Set up TLS cert**: "Create a certificate named 'app-certificate' in key vault 'mykeyvault'"
- **Make new cert**: "Create a certificate called 'service-cert' in key vault 'certificates-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Certificate name** | Required | The name of the certificate to create. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Certificates: Get or list certificates

<!-- keyvault certificate get -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault certificate get \
  --vault <vault> \
  [--certificate <certificate>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the Key Vault. |
| `certificate` | string | No | The name of the certificate. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault certificate get -->

Example prompts include:

- **Get certificate details**: "Show me details of the 'web-ssl-cert' certificate in my 'production-vault' Key Vault."
- **View certificate info**: "Get information about the 'api-tls-cert' certificate in Key Vault 'security-kv'"
- **List all certificates**: "Show me all certificates in my 'production-vault' Key Vault."
- **View certificates**: "What certificates do I have in Key Vault 'security-kv'?"
- **Check certificates**: "What certificates are available in my 'ssl-vault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Certificate name** | Optional | The name of the certificate to retrieve. Omit to list all certificates. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Certificates: Import certificates

<!-- keyvault certificate import -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp keyvault certificate import \
  --certificate <certificate> \
  --certificate-data <certificate-data> \
  --vault <vault> \
  [--password <password>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `certificate` | string | Yes | The name of the certificate. |
| `certificate-data` | string | Yes | The certificate content: path to a PFX or PEM file, a base64 encoded PFX, or raw PEM text beginning with -----BEGIN. |
| `vault` | string | Yes | The name of the Key Vault. |
| `password` | string | No | Optional password for a protected PFX being imported. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli keyvault certificate import -->

Example prompts include:

- **Import certificate from file**: "Import the certificate in file '/path/to/cert.pfx' into the key vault 'mykeyvault' as 'web-ssl-cert'."
- **Import certificate with name**: "Import a certificate from '/path/to/cert.pfx' into the key vault 'security-kv' using the name 'web-ssl-cert'."
- **Add PFX certificate**: "Import a PFX certificate from 'C:\\certs\\api.pfx' into key vault 'api-vault' as 'api-cert'."
- **Import PEM certificate**: "Import a PEM certificate from '/path/to/cert.pem' into my key vault 'prod-vault' named 'prod-cert'."
- **Import password-protected certificate**: "Import the certificate 'secure.pfx' into key vault 'ssl-vault' as 'secure-cert' with password 'mypassword'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Vault** |  Required | The name of the Key Vault. |
| **Certificate name** | Required | The name of the certificate as it appears in Key Vault. |
| **Certificate data or path** | Required | Either the path to a PFX or PEM file, a base64 encoded PFX, or raw PEM text beginning with `-----BEGIN`. |
| **Password** |  Optional | Password for a protected PFX being imported. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Manage Azure Key Vault with Azure MCP Server](../azure-services/azure-mcp-server-for-key-vault.md)
- [Azure Key Vault documentation](/azure/key-vault/general/overview)

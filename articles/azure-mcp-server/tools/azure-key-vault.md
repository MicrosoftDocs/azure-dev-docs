---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys, secrets, and certificates.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.reviewer: mbaldwin
ms.date: 02/13/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
mcp-cli.version: 2.0.0-beta.19+526b8facdd707f352913f84af0195268a22dea6f
--- 
# Azure Key Vault tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure Key Vault resources, including keys, secrets, and certificates with natural language prompts. You don't need to remember specialized command syntax to manage these resources.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets, keys, and certificates. A secret is anything that you want to tightly control access to, such as API keys, passwords, or connection strings.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Administration: Get all managed HSM settings

<!-- keyvault admin settings get -->

Retrieves all Key Vault Managed HSM account settings for a given vault. This includes settings such as purge protection and soft-delete retention days. This tool ONLY applies to Managed HSM vaults.

Example prompts include:

- **Get account settings**:
  - "Get the account settings for my managed HSM 'myhsm'"
  - "Show me the account settings for managed HSM 'contoso-hsm'"
- **Query a specific setting**: "What's the value of the 'purgeProtection' setting in my managed HSM with name 'myhsm'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Vault** |  Required | The name of the Key Vault. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault admin settings get](../includes/tools/annotations/azure-key-vault-admin-settings-get-annotations.md)]

## Keys: Create key

<!-- keyvault key create -->

The Azure MCP Server can create a new key in an Azure Key Vault. This operation lets you add cryptographic keys for your applications.

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
| **Key type** | Required | The type of key to create. Supported types: `RSA`, `RSA-HSM`, `EC`, `EC-HSM`, `oct`, `oct-HSM`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault key create](../includes/tools/annotations/azure-key-vault-key-create-annotations.md)]

## Keys: Get or list keys

<!-- keyvault key get -->

The Azure MCP Server can retrieve details of a specific key or list all keys in an Azure Key Vault. When you provide a key name, it returns details for that specific key. When you omit the key name, it lists all keys in the vault.

Example prompts include:

- **Get key details**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key info**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **List all keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Query keys**: "Show all keys including managed keys in my Key Vault"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Key name** | Optional | The name of the key to retrieve. Omit to list all keys. |
| **Include managed** | Optional | Whether or not to include managed keys when listing. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault key get](../includes/tools/annotations/azure-key-vault-key-get-annotations.md)]

## Secrets: Create secret

<!-- keyvault secret create -->

The Azure MCP Server can create a new secret in an Azure Key Vault. This operation lets you securely store sensitive information like passwords, API keys, and connection strings. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data).

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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault secret create](../includes/tools/annotations/azure-key-vault-secret-create-annotations.md)]

## Secrets: Get or list secrets

<!-- keyvault secret get -->

The Azure MCP Server can retrieve a specific secret or list all secrets in a Key Vault. When you provide a secret name, it returns that specific secret value. When you omit the secret name, it lists all secrets in the vault. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data) when retrieving a specific secret value.

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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ✅ (when retrieving specific secret) | Local Required: ❌

## Certificates: Create certificate

<!-- keyvault certificate create -->

The Azure MCP Server can create a new certificate in an Azure Key Vault by using the default policy. With this operation, you can generate SSL/TLS certificates for your applications.

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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault certificate create](../includes/tools/annotations/azure-key-vault-certificate-create-annotations.md)]

## Certificates: Get or list certificates

<!-- keyvault certificate get -->

The Azure MCP Server can retrieve details of a specific certificate or list all certificates in an Azure Key Vault. When you provide a certificate name, it returns details for that specific certificate. When you omit the certificate name, it lists all certificates in the vault.

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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault certificate get](../includes/tools/annotations/azure-key-vault-certificate-get-annotations.md)]

## Certificates: Import certificates

<!-- keyvault certificate import -->

Imports an existing certificate (PFX or PEM with private key) into an Azure Key Vault without generating
a new certificate or key material. If the certificate is a password-protected PFX, provide a password.

Example prompts include:

- **Import certificate from file**: "Import the certificate in file '/path/to/cert.pfx' into the key vault 'mykeyvault'."
- **Import certificate with name**: "Import a certificate into the key vault 'security-kv' using the name 'web-ssl-cert'."
- **Add PFX certificate**: "Import a PFX certificate from 'C:\\certs\\api.pfx' into key vault 'api-vault' as 'api-cert'."
- **Import PEM certificate**: "Import a PEM certificate into my key vault 'prod-vault' named 'prod-cert'."
- **Import password-protected certificate**: "Import the certificate 'secure.pfx' into key vault 'ssl-vault' with password 'mypassword'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Vault** |  Required | The name of the Key Vault. |
| **Certificate name** | Required | The name of the certificate as it appears in Key Vault. |
| **Certificate data or path** | Required | Either the path to a PFX or PEM file, a base64 encoded PFX, or raw PEM text beginning with `-----BEGIN`. |
| **Password** |  Optional | Password for a protected PFX being imported. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [keyvault certificate import](../includes/tools/annotations/azure-key-vault-certificate-import-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Manage Azure Key Vault with Azure MCP Server](../services/azure-mcp-server-for-key-vault.md)
- [Azure Key Vault documentation](/azure/key-vault/general/overview)
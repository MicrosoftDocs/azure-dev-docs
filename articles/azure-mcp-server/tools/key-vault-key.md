---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys, secrets, and certificates.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 09/24/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Key Vault tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure Key Vault resources, including keys, secrets, and certificates with natural language prompts. You don't need to remember specialized command syntax to manage these resources.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Keys: Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This operation lets you add cryptographic keys for your applications.

Example prompts include:

- **Create RSA key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate EC key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add encryption key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up signing key**: "Create an EC key for JWT signing in my Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Key** | Required | The name of the key to create. |
| **Key type** | Required | The type of key to create (RSA, EC). |


## Keys: Get key

The Azure MCP Server can retrieve details of a specific key from an Azure Key Vault. This allows you to view key properties and metadata.

Example prompts include:

- **Get key details**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key info**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **Retrieve key**: "Get properties of the 'data-key' in my Key Vault"
- **Check key**: "Show me the details of the encryption key in my vault"
- **Find key**: "Get the properties of 'jwt-signing' key in 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Key** | Required | The name of the key to retrieve. |

## Keys: List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This operation helps you manage your cryptographic keys and view your key inventory.

Example prompts include:

- **List all keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys including managed keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Include managed** | Required | Whether or not to include managed keys in results. |

## Secrets: Create secret

The Azure MCP Server can create a new secret in an Azure Key Vault. This operation lets you securely store sensitive information like passwords, API keys, and connection strings. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data).

Example prompts include:

- **Create API secret**: "Create a secret named 'api-key' with value 'xyz123' in my 'production-vault' Key Vault."
- **Store password**: "Add a secret called 'database-password' to Key Vault 'security-kv'"
- **Save connection string**: "Create a secret for my database connection string in Key Vault"
- **Add credentials**: "Store my service principal secret in Key Vault 'api-vault'"
- **Set configuration**: "Create a secret named 'app-config' in my Key Vault"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the secret to create. |
| **Value** | Required | The value of the secret to store. |

## Secrets: Get secret

The Azure MCP Server can retrieve a specific secret from a Key Vault. This is useful for accessing sensitive configuration values, API keys, connection strings, and other secrets stored securely in Azure Key Vault.

Example prompts include:

- **Get specific secret**: "Retrieve the 'database-connection-string' secret from my 'production-vault' Key Vault."
- **Access API key**: "Get the 'third-party-api-key' secret from the 'api-secrets' vault"
- **Check secret value**: "What is the value of the 'ssl-certificate-password' secret in my Key Vault?"
- **Retrieve configuration**: "Get the 'app-config-secret' from vault 'eastus-keyvault'"
- **Access credentials**: "Show me the 'service-principal-secret' from my production Key Vault"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the secret to retrieve. |

## Secrets: List secrets

The Azure MCP Server can list all secrets in an Azure Key Vault. This operation helps you manage your stored secrets and view your secret inventory. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data).

Example prompts include:

- **List all secrets**: "Show me all secrets in my 'production-vault' Key Vault."
- **View secrets**: "What secrets do I have in Key Vault 'api-secrets'?"
- **Find secrets**: "List secrets in my Key Vault 'configuration-kv'"
- **Query secrets**: "Show all secrets in my Key Vault"
- **Check secrets**: "What secrets are stored in my 'eastus-keyvault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |

## Certificates: Create certificate

The Azure MCP Server can create a new certificate in an Azure Key Vault by using the default policy. With this operation, you can generate SSL/TLS certificates for your applications.

Example prompts include:

- **Create SSL certificate**: "Create a certificate named 'web-ssl-cert' in my 'production-vault' Key Vault."
- **Generate certificate**: "Create a new certificate called 'api-tls-cert' in Key Vault 'security-kv'"
- **Add certificate**: "Generate a certificate for my web application in Key Vault"
- **Set up TLS cert**: "Create a certificate named 'app-certificate' in my Key Vault"
- **Make new cert**: "Create a certificate called 'service-cert' in 'certificates-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the certificate to create. |

## Certificates: Get certificate

The Azure MCP Server retrieves details of a specific certificate from an Azure Key Vault. With this information, you can view certificate properties, expiration dates, and metadata.

Example prompts include:

- **Get certificate details**: "Show me details of the 'web-ssl-cert' certificate in my 'production-vault' Key Vault."
- **View certificate info**: "Get information about the 'api-tls-cert' certificate in Key Vault 'security-kv'"
- **Retrieve certificate**: "Get properties of the 'app-certificate' in my Key Vault"
- **Check certificate**: "Show me the details of the SSL certificate in my vault"
- **Find certificate**: "Get the properties of 'service-cert' certificate in 'certificates-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the certificate to retrieve. |

## Certificates: Import certificates

Imports an existing certificate (PFX or PEM with private key) into an Azure Key Vault without generating
a new certificate or key material. If the certificate is a password-protected PFX, provide a password.

Example prompts include:

- **Import certificate from file**: "Import the certificate in file '/path/to/cert.pfx' into the key vault 'mykeyvault'."
- **Import certificate with name**: "Import a certificate into the key vault 'security-kv' using the name 'web-ssl-cert'."
- **Add PFX certificate**: "Import a PFX certificate from 'C:\\certs\\api.pfx' into Key Vault 'api-vault' as 'api-cert'."
- **Import PEM certificate**: "Import a PEM certificate into my Key Vault 'prod-vault' named 'prod-cert'."
- **Import password-protected certificate**: "Import the certificate 'secure.pfx' into Key Vault 'ssl-vault' with password 'mypassword'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Vault** |  Required | The name of the Key Vault. |
| **Certificate** | Required | The name of the certificate as it appears in Key Vault. |
| **Certificate data or path** | Required | Either the path to a PFX or PEM file, a base64 encoded PFX, or raw PEM text beginning with `-----BEGIN`. |
| **Password** |  Optional | Password for a protected PFX being imported. |

## Certificates: List certificates

The Azure MCP Server lists all certificates in an Azure Key Vault. This operation helps you manage your certificates and track expiration dates.

Example prompts include:

- **List all certificates**: "Show me all certificates in my 'production-vault' Key Vault."
- **View certificates**: "What certificates do I have in Key Vault 'security-kv'?"
- **Find certificates**: "List certificates in my Key Vault 'certificates-kv'"
- **Query certificates**: "Show all certificates in my Key Vault"
- **Check certificates**: "What certificates are available in my 'ssl-vault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Vault** | Required | The name of the Key Vault. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Key Vault documentation](/azure/key-vault/)
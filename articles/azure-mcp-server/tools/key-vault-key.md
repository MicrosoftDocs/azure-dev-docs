---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys, secrets, and certificates.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 08/04/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Key Vault tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Key Vault resources, including keys, secrets, and certificates with natural language prompts. You can manage these resources without remembering specialized command syntax.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Keys

### Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This allows you to add cryptographic keys for your applications.

Example prompts include:

- **Create RSA key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate EC key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add encryption key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up signing key**: "Create an EC key for JWT signing in my Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Key** | Required | The name of the key to create. |
| **Key type** | Required | The type of key to create (RSA, EC). |
<!--
### Get key

The Azure MCP Server can retrieve details of a specific key from an Azure Key Vault. This allows you to view key properties and metadata.

Example prompts include:

- **Get key details**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key info**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **Retrieve key**: "Get properties of the 'data-key' in my Key Vault"
- **Check key**: "Show me the details of the encryption key in my vault"
- **Find key**: "Get the properties of 'jwt-signing' key in 'api-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Key** | Required | The name of the key to retrieve. |
-->
### List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This helps you manage your cryptographic keys and view your key inventory.

Example prompts include:

- **List all keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys including managed keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Include managed** | Required | Whether or not to include managed keys in results. |

## Secrets

### Create secret

The Azure MCP Server can create a new secret in an Azure Key Vault. This allows you to securely store sensitive information like passwords, API keys, and connection strings.

Example prompts include:

- **Create API secret**: "Create a secret named 'api-key' with value 'xyz123' in my 'production-vault' Key Vault."
- **Store password**: "Add a secret called 'database-password' to Key Vault 'security-kv'"
- **Save connection string**: "Create a secret for my database connection string in Key Vault"
- **Add credentials**: "Store my service principal secret in Key Vault 'api-vault'"
- **Set configuration**: "Create a secret named 'app-config' in my Key Vault"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the secret to create. |
| **Value** | Required | The value of the secret to store. |
<!--
### Get secret

The Azure MCP Server can retrieve a specific secret from a Key Vault. This is useful for accessing sensitive configuration values, API keys, connection strings, and other secrets stored securely in Azure Key Vault.

Example prompts include:

- **Get specific secret**: "Retrieve the 'database-connection-string' secret from my 'production-vault' Key Vault."
- **Access API key**: "Get the 'third-party-api-key' secret from the 'api-secrets' vault"
- **Check secret value**: "What is the value of the 'ssl-certificate-password' secret in my Key Vault?"
- **Retrieve configuration**: "Get the 'app-config-secret' from vault 'eastus-keyvault'"
- **Access credentials**: "Show me the 'service-principal-secret' from my production Key Vault"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the secret to retrieve. |
-->
### List secrets

The Azure MCP Server can list all secrets in an Azure Key Vault. This helps you manage your stored secrets and view your secret inventory.

Example prompts include:

- **List all secrets**: "Show me all secrets in my 'production-vault' Key Vault."
- **View secrets**: "What secrets do I have in Key Vault 'api-secrets'?"
- **Find secrets**: "List secrets in my Key Vault 'configuration-kv'"
- **Query secrets**: "Show all secrets in my Key Vault"
- **Check secrets**: "What secrets are stored in my 'eastus-keyvault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |

## Certificates

### Create certificate

The Azure MCP Server can create a new certificate in an Azure Key Vault using the default policy. This allows you to generate SSL/TLS certificates for your applications.

Example prompts include:

- **Create SSL certificate**: "Create a certificate named 'web-ssl-cert' in my 'production-vault' Key Vault."
- **Generate certificate**: "Create a new certificate called 'api-tls-cert' in Key Vault 'security-kv'"
- **Add certificate**: "Generate a certificate for my web application in Key Vault"
- **Set up TLS cert**: "Create a certificate named 'app-certificate' in my Key Vault"
- **Make new cert**: "Create a certificate called 'service-cert' in 'certificates-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the certificate to create. |

### Get certificate

The Azure MCP Server can retrieve details of a specific certificate from an Azure Key Vault. This allows you to view certificate properties, expiration dates, and metadata.

Example prompts include:

- **Get certificate details**: "Show me details of the 'web-ssl-cert' certificate in my 'production-vault' Key Vault."
- **View certificate info**: "Get information about the 'api-tls-cert' certificate in Key Vault 'security-kv'"
- **Retrieve certificate**: "Get properties of the 'app-certificate' in my Key Vault"
- **Check certificate**: "Show me the details of the SSL certificate in my vault"
- **Find certificate**: "Get the properties of 'service-cert' certificate in 'certificates-vault'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |
| **Name** | Required | The name of the certificate to retrieve. |

### List certificates

The Azure MCP Server can list all certificates in an Azure Key Vault. This helps you manage your certificates and track expiration dates.

Example prompts include:

- **List all certificates**: "Show me all certificates in my 'production-vault' Key Vault."
- **View certificates**: "What certificates do I have in Key Vault 'security-kv'?"
- **Find certificates**: "List certificates in my Key Vault 'certificates-kv'"
- **Query certificates**: "Show all certificates in my Key Vault"
- **Check certificates**: "What certificates are available in my 'ssl-vault'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Vault** | Required | The name of the Key Vault. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../overview.md)
- [Azure Key Vault documentation](/azure/key-vault/)
---
title: Azure Key Vault Tools 
description: Learn how to use the Azure MCP Server with Azure Key Vault keys.
keywords: azure mcp server, azmcp, key vault
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Key Vault tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Key Vault resources, including keys, secrets, and certificates with natural language prompts. You can manage keys without remembering specialized command syntax.


[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Create key

The Azure MCP Server can create a new key in an Azure Key Vault. This allows you to add cryptographic keys for your applications.

**Example prompts** include:

- **Create key**: "Create a new RSA key named 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **Generate key**: "Generate a new EC key called 'signing-key' in Key Vault 'security-kv'"
- **Add key**: "Add a new 2048-bit RSA key named 'data-key' to my Key Vault"
- **Set up key**: "Create an encryption key for my application in Key Vault"
- **Make new key**: "Create a P-256 EC key called 'jwt-signing' in my 'api-vault'"

## Get key

The Azure MCP Server can retrieve details of a specific key from an Azure Key Vault. This allows you to view key properties and metadata.

**Example prompts** include:

- **Get key**: "Show me details of the 'app-encryption-key' in my 'mykeyvault' Key Vault."
- **View key**: "Get information about the 'signing-key' in Key Vault 'security-kv'"
- **Retrieve key**: "Get properties of the 'data-key' in my Key Vault"
- **Check key**: "Show me the details of the encryption key in my vault"
- **Find key**: "Get the properties of 'jwt-signing' key in 'api-vault'"

## List keys

The Azure MCP Server can list all keys in an Azure Key Vault. This helps you manage your cryptographic keys.

**Example prompts** include:

- **List keys**: "Show me all keys in my 'mykeyvault' Key Vault."
- **View keys**: "What keys do I have in Key Vault 'security-kv'?"
- **Find keys**: "List keys in my Key Vault 'central-keys'"
- **Query keys**: "Show all keys in my Key Vault"
- **Check keys**: "What keys are available in my 'encryption-vault'?"


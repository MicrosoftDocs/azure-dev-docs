---
title: Manage Azure Key Vault with Azure MCP Server
description: Learn how to use the Azure MCP Server to manage key vaults, access secrets and keys, and troubleshoot configurations through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.reviewer: mbaldwin
ms.service: azure-mcp-server
ms.topic: how-to
ms.date: 02/13/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025
mcp-cli.version: 2.0.0-beta.19+526b8facdd707f352913f84af0195268a22dea6f

#customer intent: As an Azure Key Vault administrator, I want to manage secrets, keys, and vault configurations using natural language conversations so that I can quickly verify access and troubleshoot issues without navigating portals.

---

# Manage Azure Key Vault with Azure MCP Server

Manage keys, secrets, and certificates using natural language conversations with AI assistants through the Azure MCP Server.

[Azure Key Vault](/azure/key-vault/general/overview) is a cloud service for securely storing and accessing secrets, keys, and certificates. It helps solve problems related to [secrets management, key management, and certificate management](/azure/key-vault/general/about-keys-secrets-certificates). While the Azure portal, Azure CLI, and Azure PowerShell are powerful, the Azure MCP Server provides a more intuitive way to interact with your key vaults through conversational AI.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure Key Vault administrators and developers, this means you can:

- Create, retrieve, and list keys, secrets, and certificates without navigating the portal
- Review cryptographic key properties and certificate expiration dates
- Import certificates into your vaults
- Query Managed HSM settings for high-security deployments

## Prerequisites

To use the Azure MCP Server with Azure Key Vault, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure Key Vault resources**: At least one key vault in your subscription. You can create a key vault using the [Azure CLI](/azure/key-vault/general/quick-create-cli), [Azure PowerShell](/azure/key-vault/general/quick-create-powershell), or the [Azure portal](/azure/key-vault/general/quick-create-portal).
- **Azure permissions**: Appropriate [Azure RBAC roles](/azure/key-vault/general/rbac-guide#azure-built-in-roles-for-key-vault-data-plane-operations) like Key Vault Administrator, Key Vault Secrets Officer, Key Vault Certificates Officer, or Key Vault Crypto Officer to perform the operations you want. See [Provide access to Key Vault keys, certificates, and secrets with Azure role-based access control](/azure/key-vault/general/rbac-guide).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Key Vault

The Azure MCP Server provides multiple tools for Azure Key Vault operations, enabling you to manage keys, secrets, and certificates through natural language conversations.

### Manage keys

Create and retrieve [cryptographic keys](/azure/key-vault/keys/about-keys) stored in your vault. Supported key types include RSA, RSA-HSM, EC, EC-HSM, oct, and oct-HSM.

**Common scenarios**:

- Create new RSA or EC keys for encryption or signing operations
- Retrieve key properties and metadata
- List all keys in a vault to audit key inventory

### Manage secrets

Create, retrieve, and list [sensitive information](/azure/key-vault/secrets/about-secrets) like API keys, passwords, and connection strings.

**Common scenarios**:

- Securely store API keys and database passwords
- Retrieve connection strings for application configuration
- Audit secret inventory to identify unused credentials

### Manage certificates

Create, import, retrieve, and list [SSL/TLS certificates](/azure/key-vault/certificates/about-certificates) and other certificate-based credentials.

**Common scenarios**:

- Generate or import SSL/TLS certificates for web applications
- Track certificate expiration dates to plan for [renewal](/azure/key-vault/certificates/overview-renew-certificate)
- Retrieve certificate properties for compliance verification

### Manage Managed HSM settings

Retrieve [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) account settings for high-security deployments that require FIPS 140-3 Level 3 validated HSMs. This tool only applies to Managed HSM vaults, not standard Key Vault vaults.

**Common scenarios**:

- Review purge protection and soft-delete retention settings for Managed HSM
- Query HSM-specific configurations

For detailed information about each tool, including parameters and examples, see [Azure Key Vault tools for Azure MCP Server](../tools/azure-key-vault.md).

## Get started

Ready to use Azure MCP Server with your Azure Key Vault resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

2. **Start exploring**: Ask your AI assistant questions about your key vaults or request operations. Try prompts like:
   - "List all secrets in my key vault 'my-vault'"
   - "Get the certificate 'web-ssl-cert' from key vault 'prod-vault'"
   - "Create a new RSA key named 'app-key' in key vault 'crypto-vault'"

3. **Learn more**: Review the [Azure Key Vault tools reference](../tools/azure-key-vault.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure Key Vault:

- **Specify vault name clearly**: Always include the exact key vault name when querying to avoid ambiguity, especially in subscriptions with many vaults.
- **Check certificate expiration**: Ask about certificate properties regularly to identify expiring certificates before they cause issues.
- **Audit your inventory**: Use list operations to review your keys, secrets, and certificates inventory for compliance and security audits.
- **Combine with other tools**: Use Azure MCP Server for quick queries and inventory checks. Use Azure CLI or PowerShell for vault configuration changes, access control management, and sensitive operations like [secret rotation](/azure/key-vault/secrets/tutorial-rotation).

For general Azure Key Vault security guidance beyond the Azure MCP Server, see [Secure your Azure Key Vault](/azure/key-vault/general/secure-key-vault).

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure Key Vault tools reference](../tools/azure-key-vault.md)
* [Azure Key Vault documentation](/azure/key-vault/general/overview)
* [Azure RBAC for Key Vault](/azure/key-vault/general/rbac-guide)
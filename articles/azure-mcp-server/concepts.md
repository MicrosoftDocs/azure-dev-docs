---
title: Azure MCP Server concepts
description: Learn key concepts for working with Azure MCP Server, including multi-service workflows, error handling, optimization, and common use cases.
ms.date: 01/26/2026
ms.topic: concept-article
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025
---

# Azure MCP Server concepts

This article explains essential concepts for effectively using the Azure MCP Server, including how to work with multiple Azure services, handle errors, optimize performance, and apply common patterns for real-world scenarios.

## Multi-service workflows

The Azure MCP Server can orchestrate operations across multiple Azure services in a single conversation or workflow. This capability enables you to chain operations across services like Azure Storage, Azure Cosmos DB, and Azure Key Vault without switching contexts.

### Server modes for multi-service operations

The Azure MCP Server supports different modes that affect how tools are exposed and how you interact with multiple services:

#### Namespace mode (default)

Namespace mode groups tools by Azure service, exposing one tool per service namespace. This mode provides a balanced approach for multi-service workflows.

```json
{
  "mcpServers": {
    "Azure MCP Server": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

With namespace mode, you can make requests like:
- "List my storage accounts and then show me the containers in the first account"
- "Get secrets from my key vault and use them to connect to my Cosmos DB database"

#### Consolidated mode (recommended for AI agents)

Consolidated mode groups related operations into curated tools optimized for AI agents. This mode provides the best balance between functionality and usability.

```json
{
  "mcpServers": {
    "Azure MCP Server": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start", "--mode", "consolidated"]
    }
  }
}
```

Consolidated tools are named after user intents, for example `get_azure_databases_details`, making them more intuitive for natural language interactions.

#### All mode

The `all` mode exposes 800+ individual tools separately. This mode is useful when you need granular control but can exceed tool limits in some clients.

```json
{
  "mcpServers": {
    "Azure MCP Server": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start", "--mode", "all"]
    }
  }
}
```

### Chaining operations across services

You can chain operations across multiple Azure services in a single conversation. For example, you can:

1. Query Azure Key Vault for database credentials
1. Use those credentials to connect to Azure Cosmos DB
1. Query data from Cosmos DB
1. Store results in Azure Storage

Example prompts that chain operations across services include:
- "Get the database connection string from key vault 'my-vault', connect to the database, and list the collections"
- "List all storage accounts in my subscription, then for each account show me the containers"
- "Create a new storage container and upload the contents of my key vault secret to a blob"

### Filtering tools by service

You can configure the Azure MCP Server to expose only specific services using the `--namespace` option. This approach is useful for focused workflows or when working with multiple MCP server instances.

```json
{
  "mcpServers": {
    "Azure Storage": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start", "--namespace", "storage"]
    },
    "Azure KeyVault": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start", "--namespace", "keyvault"]
    }
  }
}
```

This configuration creates separate MCP server instances for Storage and Key Vault, allowing you to organize tools by domain or project requirements.

## Error handling and retry logic

The Azure MCP Server handles various error scenarios that can occur when interacting with Azure services. Understanding these patterns helps you troubleshoot issues and build resilient workflows.

### Authentication errors

Authentication is a common source of errors when working with Azure resources.

#### 401 Unauthorized errors

A 401 error indicates that the access token is invalid or missing. This error can occur when:

- Local authorization (access keys) is disabled on the resource
- The authentication token has expired
- No valid credentials are available

**Resolution approaches:**
- Verify that you're authenticated to Azure using `az login` or your preferred authentication method
- Check that the resource allows the authentication method you're using
- For resources with access keys disabled, ensure you have appropriate Role-Based Access Control (RBAC) permissions

#### 403 Forbidden errors

A 403 error indicates that the authenticated user doesn't have sufficient permissions to access the requested resource.

**Common causes:**
- Missing RBAC permissions at the resource group or subscription level
- Wrong subscription or tenant context
- Using an unintended account when multiple accounts are signed in

**Resolution approaches:**
- Verify RBAC permissions are assigned at the correct scope
- Specify the subscription and tenant explicitly in your prompts: "List all my storage accounts in subscription `subscription-name`, located in tenant `tenant-name`"
- Set the `AZURE_MCP_ONLY_USE_BROKER_CREDENTIAL` environment variable to `true` to prompt for account selection

### Network and firewall restrictions

Enterprise environments often have network controls that can affect Azure MCP Server connectivity.

**Required endpoints for authentication:**
- `login.microsoftonline.com:443`
- `login.windows.net:443`
- `management.azure.com:443`
- `graph.microsoft.com:443`

**Resource-specific endpoints** depend on the Azure services you're using, for example:
- Azure Storage: `*.blob.core.windows.net:443`
- Azure Key Vault: `*.vault.azure.net:443`
- Azure Cosmos DB: `*.documents.azure.com:443`

If you're behind a corporate proxy, configure proxy settings using environment variables:

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1
```

### Transient failures

The Azure MCP Server relies on Azure SDKs, which have built-in retry logic for transient failures. These SDKs automatically handle:

- Network connectivity issues
- Service throttling and rate limits
- Temporary service unavailability

The retry policies use exponential backoff to avoid overwhelming services during high load or incident scenarios.

### Error messages and diagnostics

When errors occur, the Azure MCP Server provides detailed error messages to help you understand and resolve issues. For comprehensive troubleshooting guidance, see the [troubleshooting guide](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/TROUBLESHOOTING.md).

## Optimization tips

Optimizing your Azure MCP Server configuration improves performance, reduces token usage, and enhances the user experience.

### Managing tool counts

Some MCP clients have limits on the number of tools they can handle. For example, Visual Studio Code Copilot has a 128-tool limit per request.

#### Use consolidated mode

Consolidated mode provides full functionality while staying well under client tool limits:

```json
{
  "mcpServers": {
    "Azure MCP": {
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start", "--mode", "consolidated"]
    }
  }
}
```

This configuration exposes curated tools that group related operations, optimizing for both functionality and AI agent effectiveness.

#### Use selective tool loading

Load only the tools you need for your specific workflow:

```json
{
  "mcpServers": {
    "Azure Essentials": {
      "command": "npx",
      "args": [
        "-y",
        "@azure/mcp@latest",
        "server",
        "start",
        "--tool",
        "azmcp_subscription_list",
        "--tool",
        "azmcp_group_list",
        "--tool",
        "azmcp_storage_account_get"
      ]
    }
  }
}
```

#### Use custom chat modes

Visual Studio Code supports [custom chat modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes#_custom-chat-modes) that let you configure different tool sets for different scenarios. This approach allows you to switch between tool configurations based on your current task while staying within client limits.

### Token management

Effective token management improves response times and reduces costs when using language models.

#### Use specific prompts

Specific prompts reduce the number of tool calls and the amount of context needed:

**Less effective:**
- "Tell me about my Azure resources"

**More effective:**
- "List storage accounts in subscription 'my-subscription' in resource group 'my-rg'"
- "Show me the connection string for storage account 'mystorageaccount'"

#### Scope operations appropriately

When possible, scope operations to specific resources or resource groups rather than querying entire subscriptions:

**Less efficient:**
- "List all resources in my subscription and filter for storage accounts"

**More efficient:**
- "List storage accounts in resource group 'production-rg'"

### Batch operations

The Azure MCP Server supports batch operations for certain scenarios. When working with multiple resources:

**Sequential operations:**
```
List storage accounts, then for each one show the containers
```

**Parallel operations when appropriate:**
```
Get details for storage accounts 'account1', 'account2', and 'account3'
```

The Azure MCP Server and underlying Azure SDKs handle batching automatically when appropriate, optimizing network calls and reducing latency.

### Caching and reuse

The Azure MCP Server maintains connection state during a session. To optimize performance:

- Keep MCP server instances running rather than starting and stopping frequently
- Reuse subscription and resource group information in subsequent queries
- Cache resource details in your workflow when you need to reference them multiple times

## Common use cases

The Azure MCP Server supports a wide range of real-world scenarios. This section provides examples of common patterns and workflows.

### Deploying a new service

When deploying a new Azure service, you can use the Azure MCP Server to automate infrastructure setup and configuration:

1. **Create resource group and resources:**
   ```
   Create a resource group called 'webapp-prod' in East US, 
   then create a storage account called 'webappdata' in that resource group
   ```

1. **Configure resources:**
   ```
   Get the storage account connection string and store it as a secret 
   in key vault 'webapp-kv' with name 'StorageConnectionString'
   ```

1. **Verify deployment:**
   ```
   List all resources in resource group 'webapp-prod' 
   and verify that the storage account and key vault exist
   ```

### Debugging a live site issue

The Azure MCP Server can help you diagnose and troubleshoot production issues:

1. **Check resource health:**
   ```
   Check the health status of App Service 'my-webapp' 
   and list any recent service health incidents
   ```

1. **Query logs:**
   ```
   Query Application Insights for exceptions in the last hour 
   from application 'my-webapp'
   ```

1. **Inspect configuration:**
   ```
   Get the application settings for App Service 'my-webapp' 
   and check if the database connection string is configured correctly
   ```

1. **Check dependencies:**
   ```
   List the databases in SQL server 'my-sql-server' 
   and verify connectivity to database 'my-database'
   ```

### Managing secrets and configuration

A common pattern involves managing secrets and configuration across environments:

1. **Audit secrets:**
   ```
   List all secrets in key vault 'production-kv' 
   and show me which ones are expiring in the next 30 days
   ```

1. **Rotate secrets:**
   ```
   Generate a new connection string for storage account 'mystore', 
   update the secret 'StorageConnection' in key vault 'production-kv', 
   and restart App Service 'my-webapp'
   ```

1. **Sync configuration:**
   ```
   Get all key-value pairs from App Configuration 'my-appconfig' 
   with label 'production' and compare them to the staging environment
   ```

### Data operations across services

The Azure MCP Server excels at coordinating data operations across multiple services:

1. **Extract, Transform, Load (ETL):**
   ```
   Get data from Cosmos DB container 'raw-data', 
   transform it using the provided logic, 
   and upload the results to blob container 'processed-data' 
   in storage account 'analytics'
   ```

1. **Backup and archival:**
   ```
   Export all documents from Cosmos DB container 'transactions' 
   and create a snapshot in blob storage with timestamp
   ```

1. **Cross-service queries:**
   ```
   Query Azure Data Explorer for events where error count is greater than 100, 
   then lookup the associated user data from Cosmos DB
   ```

### Infrastructure audit and compliance

Use the Azure MCP Server to audit infrastructure and verify compliance:

1. **Security audit:**
   ```
   List all storage accounts in my subscription 
   and check which ones don't have firewall rules configured
   ```

1. **Cost analysis:**
   ```
   List all SQL databases in my subscription, 
   show their pricing tiers, 
   and identify candidates for downgrading
   ```

1. **Resource tagging:**
   ```
   List all resources in subscription 'production-sub' 
   without an 'Environment' tag and show their resource groups
   ```

### Development and testing workflows

Developers can use the Azure MCP Server to streamline development workflows:

1. **Environment setup:**
   ```
   Create a development environment with a storage account, 
   key vault, and App Service in resource group 'dev-environment'
   ```

1. **Test data management:**
   ```
   Copy data from production storage container 'data' 
   to development storage container 'test-data', 
   anonymizing sensitive fields
   ```

1. **Configuration management:**
   ```
   Compare App Service settings between 'staging-webapp' 
   and 'production-webapp' and highlight differences
   ```

## Related content

- [Get started using the Azure MCP Server](get-started.md)
- [Azure MCP Server tools](./tools/index.md)
- [Authentication guidance](https://github.com/microsoft/mcp/blob/main/docs/Authentication.md)
- [Troubleshooting guide](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/TROUBLESHOOTING.md)
- [Azure MCP Server repository](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server)

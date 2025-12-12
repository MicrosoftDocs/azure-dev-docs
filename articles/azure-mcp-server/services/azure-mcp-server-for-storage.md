---
title: Manage Azure Storage with Azure MCP Server
description: Learn how to use the Azure MCP Server to manage storage accounts, containers, and blobs through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.service: azure-storage
ms.topic: how-to
ms.date: 12/12/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025

#customer intent: As an Azure Storage customer, I want to manage storage accounts and blobs using natural language conversations so that I can work more efficiently without navigating portals or remembering complex commands.

---

# Manage Azure Storage with Azure MCP Server

Manage Azure Storage accounts, containers, and blobs using natural language conversations with AI assistants through the Azure MCP Server. Create storage accounts, query containers, configure access policies, and upload files without navigating the Azure portal or remembering CLI commands.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure Storage customers, this means you can:

- Create and configure storage accounts without navigating the Azure portal
- Query blob containers and analyze storage usage patterns through conversation
- Set up access policies and permissions using plain language descriptions
- Troubleshoot storage issues by asking questions about account configurations
- Upload and manage files through natural language commands
- Review storage account SKUs and optimize costs conversationally

## Prerequisites

To use the Azure MCP Server with Azure Storage, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure Storage resources**: At least one storage account in your subscription, or permissions to create them.
- **Azure permissions**: Appropriate roles like Storage Account Contributor, Storage Blob Data Contributor, or Storage Table Data Contributor to perform the operations you want. See [Azure Storage security documentation](/azure/storage/common/authorize-data-access).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Storage

The Azure MCP Server provides six tools specifically designed for Azure Storage operations. These tools enable you to perform common storage management tasks through natural language conversations.

### Account management

Manage storage account lifecycle and configuration, including creation and retrieval of account details.

**Common scenarios**:
- Quickly audit storage accounts across multiple subscriptions
- Set up new storage accounts for development teams with specific SKUs
- Review and optimize storage costs by checking account configurations
- Verify storage account settings for compliance requirements

### Container operations

Create, list, and manage blob containers within your storage accounts.

**Common scenarios**:
- Organize data by creating containers for different projects or departments
- Review container access levels and security settings
- Find specific data by searching across containers
- Manage container metadata and properties

### Blob operations

Upload, download, list, and inspect blobs within containers.

**Common scenarios**:
- Upload application logs or data files for analysis
- Retrieve specific blobs based on naming patterns or metadata
- Review blob properties and metadata without downloading files
- Validate data structure and contents before processing

For detailed information about each tool, including parameters and examples, see [Azure Storage tools for Azure MCP Server](../tools/azure-storage.md).

## Example scenarios for Azure Storage customers

Here are practical ways Azure Storage customers use the Azure MCP Server:

### Set up storage for a new project

**Challenge**: Your team needs a new storage account with specific security and redundancy requirements, but navigating the portal's many options is time-consuming.

**How Azure MCP Server helps**: Describe your requirements in plain language, and the AI assistant creates the storage account with the correct SKU, access tier, and security settings.

**Example conversation**:

> **You**: "Create a storage account called 'projectdata2025' in eastus with locally redundant storage and hot access tier"
> 
> **AI Assistant**: "I'll create the storage account with Standard_LRS SKU and hot access tier in the eastus region. The account will be created in your current resource group with secure defaults enabled."

### Investigate unexpected storage costs

**Challenge**: Your monthly storage bill increased significantly, but you're not sure which accounts or containers are responsible for the increase.

**How Azure MCP Server helps**: Query your storage accounts to compare configurations, analyze blob counts, and identify accounts with expensive SKUs or access tiers without manually checking each one in the portal.

**Example conversation**:

> **You**: "Show me all storage accounts in my subscription and their SKUs"
> 
> **AI Assistant**: "You have 5 storage accounts. I notice 'archivedata' is using Premium_LRS which is significantly more expensive than Standard_LRS. The account contains 12 containers. Would you like to review its usage patterns?"

### Troubleshoot container access issues

**Challenge**: A team member reports they can't access blobs in a container, but you're not sure if it's a permission issue or configuration problem.

**How Azure MCP Server helps**: Quickly check container properties, access levels, and blob listings to diagnose the issue without switching between multiple portal pages or running multiple CLI commands.

**Example conversation**:

> **You**: "What's the access level of the 'reports' container in the 'companydata' storage account?"
> 
> **AI Assistant**: "The 'reports' container has private access level, which requires authentication. The team member needs either Storage Blob Data Reader role or you can change the container to blob-level public access if appropriate for your security requirements."

### Organize and upload project files

**Challenge**: You need to upload multiple files to blob storage and organize them in a specific container structure, but the portal upload interface is cumbersome for bulk operations.

**How Azure MCP Server helps**: Create containers and upload files using natural language commands, allowing you to organize your storage structure conversationally without repetitive portal clicks.

**Example conversation**:

> **You**: "Create a container called 'deployment-logs' in my 'prodlogs' storage account and upload the file './logs/app.log' to it"
> 
> **AI Assistant**: "I've created the 'deployment-logs' container with private access and uploaded 'app.log' successfully. The blob is now available at the path 'deployment-logs/app.log'."

## Get started

Ready to use Azure MCP Server with your Azure Storage resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. See [Get started with Azure MCP Server](../get-started.md) for setup instructions.

2. **Connect to Azure**: Sign in to your Azure account through the MCP client. If you're prompted to authenticate, follow the authentication steps for your IDE:
   * [Cline](../get-started/tools/cline.md#use-prompts-to-test-the-azure-mcp-server)
   * [Cursor](../get-started/tools/cursor.md#use-prompts-to-test-the-azure-mcp-server)
   * [Eclipse](../get-started/tools/eclipse.md#use-prompts-to-test-the-azure-mcp-server)
   * [IntelliJ](../get-started/tools/jet-brains.md#use-prompts-to-test-the-azure-mcp-server)
   * [Visual Studio](../get-started/tools/visual-studio.md#use-prompts-to-test-the-azure-mcp-server)
   * [Visual Studio Code](../get-started/tools/visual-studio-code.md#use-prompts-to-test-the-azure-mcp-server)
   * [Windsurf](../get-started/tools/windsurf.md#use-prompts-to-test-the-azure-mcp-server)

3. **Start exploring**: Ask your AI assistant questions about your storage accounts or request operations. Try prompts like:
   - "List all my storage accounts in the current subscription"
   - "Show me the containers in storage account 'mydata'"
   - "What blobs are in the 'logs' container in 'proddata' storage account?"

4. **Learn more**: Review the [Azure Storage tools reference](../tools/azure-storage.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure Storage:

- **Use clear resource naming**: Specify storage account and container names explicitly in prompts to avoid ambiguity when you have multiple resources with similar names.
- **Verify permissions first**: Check that you have appropriate RBAC roles before attempting operations. Use read-only queries to explore resources before making changes.
- **Review SKU costs**: When creating storage accounts through conversation, confirm the SKU matches your cost and performance requirements. Premium storage is significantly more expensive than standard storage.
- **Consider security implications**: Be explicit about container access levels and avoid public access unless specifically required for your scenario. Default to private access for sensitive data.
- **Monitor large operations**: When uploading or downloading multiple blobs, ask for summaries and confirmations before proceeding with bulk operations to avoid unexpected costs or data transfers.
- **Use blob paths consistently**: When working with blobs in nested folder structures, use consistent path formats (for example, `folder/subfolder/file.txt`) to avoid confusion.

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure Storage tools reference](../tools/azure-storage.md)
* [Azure Storage documentation](/azure/storage/)
* [Azure Storage security best practices](/azure/storage/blobs/security-recommendations)

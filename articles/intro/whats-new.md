---
title: "Azure developer documentation: What's new"
description: "What's new in the Azure developer documentation."
ms.date: 12/01/2025
author: KarlErickson
ms.author: karler
ms.topic: article
---

# Azure developer documentation: What's new

Welcome to what's new in the [Azure developer documentation](../index.yml) for the last three months. This article lists some of the major changes to docs during this period.

## What's new for November 2025

### AI apps using Azure services

Updated articles:

- [Get started with multimodal vision chat apps using Azure OpenAI](../ai/get-started-app-chat-vision.md) - code changes

### Azure Developer CLI (azd)

New articles:

- [Deploy an agent to Microsoft Foundry with the Azure Developer CLI AI agent extension](../azure-developer-cli/extensions/azure-ai-foundry-extension.md)

Updated articles:

- [Deploy to Azure Container Apps using the Azure Developer CLI](../azure-developer-cli/container-apps-workflows.md) - rewrite docs to reference new revision-based deployment

### Azure for Go

New articles:

- [Authenticate Azure-hosted Go apps to Azure resources using a system-assigned managed identity](../go/sdk/authentication/system-assigned-managed-identity.md)
- [Authenticate Azure-hosted Go apps to Azure resources using a user-assigned managed identity](../go/sdk/authentication/user-assigned-managed-identity.md)

Updated articles:

- [Deploy a Go web app to Azure Container Apps](../go/deploy-container-apps.md) - Simplify steps by using environment variables

### Azure for Java

New articles:

- [Integrate portfolio assessment with GitHub Copilot app modernization](../java/migration/github-copilot-app-modernization-for-java-portfolio-assessment-integration.md)
- [Migrate from Oracle to PostgreSQL by using GitHub Copilot app modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-oracle-to-postgresql.md)
- [Modernize Java apps by using GitHub Copilot app modernization in coding agent](../java/migration/github-copilot-app-modernization-for-java-coding-agent.md)
- [Modernize Java apps by using GitHub Copilot app modernization in the Copilot CLI](../java/migration/github-copilot-app-modernization-for-java-copilot-cli.md)
- [Working with assessment: Comprehensive guide to application assessment with GitHub Copilot App Modernization for Java](../java/migration/migrate-github-copilot-app-modernization-for-java-working-with-assessment.md)

Updated articles:

- [Quickstart: create and apply your own tasks for GitHub Copilot app modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md) - updates for Ignite

### Azure for JavaScript

New articles:

- [Authenticate JavaScript apps to Azure services during local development using brokered authentication](../javascript/sdk/authentication/local-development-broker.md)

### Azure for Rust

New articles:

- [Use the `azure-core` crate for advanced scenarios in Rust applications](../rust/sdk/azure-core-types.md)

### Azure MCP Server

New articles:

- [Azure AI best practices tools for the Azure MCP Server](../azure-mcp-server/tools/azure-ai-best-practices.md)
- [Deploy a self-hosted remote Azure MCP Server and connect to it using Copilot Studio](../azure-mcp-server/how-to/deploy-remote-mcp-server-copilot-studio.md)
- [Deploy a self-hosted remote Azure MCP Server and connect to it using Microsoft Foundry](../azure-mcp-server/how-to/deploy-remote-mcp-server-microsoft-foundry.md)
- [Get started with the Azure MCP Server in Eclipse](../azure-mcp-server/get-started/tools/eclipse.md)

Updated articles:

- [Azure AI Foundry tools for the Azure MCP Server](../azure-mcp-server/tools/azure-foundry.md) - MCP update Foundry tools
- [Azure Database for MySQL tools for Azure MCP Server](../azure-mcp-server/tools/azure-mysql.md) - MCP - mysql - required resource name parameter
- [Azure Database for PostgreSQL tools for the Azure MCP Server](../azure-mcp-server/tools/azure-database-postgresql.md) - MCP -postgres - required params in example prompts
- [Azure SQL tools for the Azure MCP Server](../azure-mcp-server/tools/azure-sql.md) - MCP - azure SQL - required resource group param

### GitHub Copilot App Modernization

New articles:

- [Languages and frameworks supported by GitHub Copilot app modernization](../github-copilot-app-modernization/languages.md)

### GitHub Copilot for Azure

Updated articles:

- [Example prompts for deploying your application with GitHub Copilot for Azure](../github-copilot-azure/deploy-examples.md) - Remove ask mode from all GHCPA articles
- [Example prompts for learning about Azure and your application with GitHub Copilot for Azure](../github-copilot-azure/learn-examples.md) - Remove ask mode from all GHCPA articles

## What's new for October 2025

### AI apps using Azure services

New articles:

- [How to switch between OpenAI and Azure OpenAI endpoints](../ai/how-to/switching-endpoints.md)

Updated articles:

- [Get started with multimodal vision chat apps using Azure OpenAI](../ai/get-started-app-chat-vision.md) - Update "Get started with multimodal vision chat apps using Azure OpenAI" with code changes
- [How to switch between OpenAI and Azure OpenAI endpoints](../ai/how-to/switching-endpoints.md)
  - Add JS, Java, and Go to "How to switch between OpenAI and Azure OpenAI endpoints"
  - Add "How to switch between endpoints" for OpenAI dev days support

### Azure Developer CLI (azd)

New articles:

- [Connect GitHub Copilot coding agent with Azure MCP Server using azd extensions](../azure-developer-cli/extensions/copilot-coding-agent-extension.md)

Updated articles:

- [Azure Developer CLI reference](../azure-developer-cli/reference.md) - Update reference documents for Azure CLI @ 1.20.0

### Azure MCP Server

New articles to help you get started using Azure MCP Server tools:

- [Cline](../azure-mcp-server/get-started/tools/cline.md)
- [IntelliJ](../azure-mcp-server/get-started/tools/jet-brains.md)
- [Windsurf](../azure-mcp-server/get-started/tools/windsurf.md)
- [Connect GitHub Copilot coding agent to the Azure MCP Server](../azure-mcp-server/how-to/github-copilot-coding-agent.md)

Update articles to help you get started using Azure MCP server tools: 

- [Get started with the Azure MCP Server using Visual Studio](../azure-mcp-server/get-started/tools/visual-studio.md) - Add NuGet option

Services with new, updated, or removed tools

- [Azure AI Best practices](../azure-mcp-server/tools/azure-best-practices.md)
- [Azure AI Search](../azure-mcp-server/tools/azure-ai-search.md)
- [Azure AI Speech](../azure-mcp-server/tools/ai-services-speech.md)
- [Azure App Configuration](../azure-mcp-server/tools/app-configuration.md)
- [Azure App Lens](../azure-mcp-server/tools/azure-app-lens.md)
- [Azure App Service](../azure-mcp-server/tools/azure-app-service.md)
- [Azure CLI](../azure-mcp-server/tools/azure-cli.md)
- [Azure Communication Services](../azure-mcp-server/tools/azure-communication.md)
- [Azure Confidential Ledger](../azure-mcp-server/tools/azure-confidential-ledger.md)
- [Azure Event Grid](../azure-mcp-server/tools/azure-event-grid.md)
- [Azure Event Hubs](../azure-mcp-server/tools/azure-event-hubs.md)
- [Azure Foundry](../azure-mcp-server/tools/azure-foundry.md)
- [Azure Functions](../azure-mcp-server/tools/azure-functions.md)
- [Azure Key Vault](../azure-mcp-server/tools/azure-key-vault.md)
- [Azure Managed Lustre](../azure-mcp-server/tools/azure-managed-lustre.md)
- [Marketplace](../azure-mcp-server/tools/azure-marketplace.md)
- [Azure Monitor](../azure-mcp-server/tools/azure-monitor.md)
- [Azure Managed Redis](../azure-mcp-server/tools/azure-redis.md)
- [Azure Resource Health](../azure-mcp-server/tools/azure-health-resource.md)
- [Azure SQL](../azure-mcp-server/tools/azure-sql.md)
- [Azure Storage](../azure-mcp-server/tools/azure-storage.md)
- [App Insights](../azure-mcp-server/tools/application-insights.md)

### GitHub Copilot for Azure

Updated articles:

- Rewrite of [almost every article](../github-copilot-azure/index.yml) to remove `https://github.com/Azure` and focus on "agent mode".
- [What is GitHub Copilot for Azure?](../github-copilot-azure/introduction.md) - Add tools to GHCPA Introduction

### Azure for Go

New articles:

- [Authenticate Azure-hosted Go apps to Azure resources using a system-assigned managed identity](../go/sdk/authentication/system-assigned-managed-identity.md)
- [Authenticate Azure-hosted Go apps to Azure resources using a user-assigned managed identity](../go/sdk/authentication/user-assigned-managed-identity.md)

Updated articles:

- [Authenticate Go apps to Azure services during local development using developer accounts](../go/sdk/authentication/local-development-dev-accounts.md) - Update Go SDK authentication guidance
- [Authenticate Go apps to Azure services using the Azure Identity library](../go/sdk/authentication/authentication-overview.md) - Update Go SDK authentication guidance

### Azure for Java

New articles:

- [What is Azure Toolkit for IntelliJ?](../java/toolkit-for-intellij/overview.md)

### Azure for JavaScript

Updated articles:

- [Credential chains in the Azure Identity library for JavaScript](../javascript/sdk/authentication/credential-chains.md) 

### Azure for Rust

New articles:

- [Azure SDK for Rust crates](../rust/azure-sdk-library-package-index.md)
- [OpenTelemetry in Azure SDK for Rust crates](../rust/sdk/logging.md)

## What's new for September 2025

### AI apps using Azure services

New articles:

- [Build a .NET OpenAI Agent using an MCP server on Azure Container Apps](../ai/build-openai-mcp-server-dotnet.md)

### Azure Developer CLI (azd)

New articles:

- [Work with Azure Developer CLI metadata for Bicep input parameters](../azure-developer-cli/metadata.md)

Updated articles:

- [Azure Developer CLI reference](../azure-developer-cli/reference.md) - Update reference documents for Azure CLI @ 1.19.0

### Azure MCP Server

New articles:

- [Get started with the Azure MCP Server in Cline](../azure-mcp-server/get-started/tools/cline.md)
- [Azure App Lens tools for the Azure MCP Server](../azure-mcp-server/tools/azure-app-lens.md)
- [Azure App Service tools for Azure MCP Server](../azure-mcp-server/tools/azure-app-service.md)
- [Azure Event Grid tools for the Azure MCP Server](../azure-mcp-server/tools/azure-event-grid.md)

Updated articles:

- [Get started with the Azure MCP Server in Cursor](../azure-mcp-server/get-started/tools/cursor.md)
- [Get started with the Azure MCP Server in IntelliJ](../azure-mcp-server/get-started/tools/jet-brains.md)
- [Get started with the Azure MCP Server in Windsurf](../azure-mcp-server/get-started/tools/windsurf.md)
- [Get started with the Azure MCP Server using Visual Studio](../azure-mcp-server/get-started/tools/visual-studio.md)
- [Get started with the Azure MCP Server using Visual Studio Code](../azure-mcp-server/get-started/tools/visual-studio-code.md)
- [Azure App Configuration tools for the Azure MCP Server](../azure-mcp-server/tools/app-configuration.md)
- [Azure AI Foundry tools for the Azure MCP Server](../azure-mcp-server/tools/azure-foundry.md)
- [Azure AI Search tools for the Azure MCP Server](../azure-mcp-server/tools/ai-search.md)
- [Azure Functions tools for the Azure MCP Server](../azure-mcp-server/tools/azure-functions.md)
- [Azure Health Resource tools for the Azure MCP Server](../azure-mcp-server/tools/azure-health-resource.md)
- [Azure Load Testing tools for the Azure MCP Server](../azure-mcp-server/tools/azure-load-testing.md)
- [Azure Key Vault tools for the Azure MCP Server](../azure-mcp-server/tools/azure-key-vault.md)
- [Azure Kubernetes Service tools for the Azure MCP Server](../azure-mcp-server/tools/azure-aks.md)
- [Azure Managed Lustre tools for the Azure MCP Server](../azure-mcp-server/tools/azure-managed-lustre.md)
- [Azure Monitor tools for the Azure MCP Server](../azure-mcp-server/tools/monitor.md)
- [Azure MCP Tool tools for the Azure MCP Server](../azure-mcp-server/tools/azure-mcp-tool.md)
- [Azure SQL tools for the Azure MCP Server](../azure-mcp-server/tools/azure-sql.md)
- [Azure Storage tools for the Azure MCP Server](../azure-mcp-server/tools/storage.md)

### Azure for Java

Updated articles:

- Updates for Spring Cloud Azure 6.0.0:
  - [Spring Boot Starter for Microsoft Entra developer's guide](../java/spring-framework/spring-boot-starter-for-entra-developer-guide.md)
  - [Spring Cloud Azure Redis support](../java/spring-framework/redis-support.md)
  - [Spring Cloud Azure support for Spring Cloud Stream](../java/spring-framework/spring-cloud-stream-support.md)
  - [Spring Cloud Azure support for Spring Security](../java/spring-framework/spring-security-support.md)

### Azure for JavaScript

Updated articles:

- [Authenticate Azure-hosted JavaScript apps to Azure resources using a system-assigned managed identity](../javascript/sdk/authentication/system-assigned-managed-identity.md)
- [Authenticate Azure-hosted JavaScript apps to Azure resources using a user-assigned managed identity](../javascript/sdk/authentication/user-assigned-managed-identity.md)
- [Authenticate Node.js apps to Azure services during local development using developer accounts](../javascript/sdk/authentication/local-development-environment-developer-account.md)

### Azure for .NET

New articles:

- [Quickstart: Vector search with .NET in Azure Cosmos DB for MongoDB (vCore)](/azure/documentdb/quickstart-dotnet-vector-search)

### Azure for Rust

New articles:

- [OpenTelemetry in Azure SDK for Rust crates](../rust/sdk/logging.md)

Updated articles:

- [Authenticate Rust apps to Azure services](../rust/sdk/authentication/overview.md)
- [Configure your Rust development environment for Azure](../rust/developer-environment.md)
- [Use Azure SDK for Rust crates to access Azure services](../rust/sdk/use-crates.md)
- [What are Azure SDK for Rust crates?](../rust/sdk/overview.md)

### GitHub Copilot for Azure

Updated articles:

- [What is GitHub Copilot for Azure?](../github-copilot-azure/introduction.md) - Added table for supported development environments

### GitHub Copilot app modernization

New articles:

- [Quickstart: containerize your Java project using GitHub Copilot app modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-containerization.md)
- [Quickstart: deploy your Java project to Azure by using GitHub Copilot app modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure.md)

Updated articles:

- GA release updates:
  - [GitHub Copilot app modernization](../github-copilot-app-modernization/overview.md)
  - [GitHub Copilot app modernization FAQ](../java/migration/migrate-github-copilot-app-modernization-for-java-faq.yml)
  - [Quickstart: assess and migrate a Java project using GitHub Copilot app modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md)

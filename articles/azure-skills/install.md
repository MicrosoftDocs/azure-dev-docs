---
title: Install and configure Azure Skills
description: "Install, authenticate, and configure Azure Skills to manage Azure resources from your AI assistant."
ms.topic: how-to
ms.date: 03/16/2026
author: diberry
ms.author: diberry
ms.reviewer: alexwolf
ms.service: azure-mcp-server
---

# Install and configure Azure Skills

This article shows you how to install Azure Skills, authenticate to your Azure account, and verify the installation. After setup, you can manage Azure resources from your chat interface.

## Prerequisites

Make sure you have:

- **Node.js Long Term Support (LTS)**: [Download from nodejs.org](https://nodejs.org) or use a version manager like [nvm](https://github.com/nvm-sh/nvm).
- **Azure account**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **An AI assistant**: [GitHub Copilot CLI](../github-copilot-azure/introduction.md), Claude Code, or another compatible platform.
- **Azure CLI** (recommended for local development): Simplifies authentication. [Install Azure CLI](/cli/azure/install-azure-cli). Environment variables or managed identity can be used as alternatives in CI/CD pipelines.

> [!NOTE]
> Azure Skills uses the same authentication as [Azure MCP Server](../azure-mcp-server/overview.md). If you already authenticated for Azure MCP Server, Azure Skills uses those credentials.

## Authenticate to Azure

Azure Skills needs credentials to access your Azure resources. Choose the method that fits your use case.

### [Azure CLI (recommended)](#tab/azure-cli)

This method is the easiest for local development and testing.

1. **Install Azure CLI:**
   - Visit the [Azure CLI installation guide](/cli/azure/install-azure-cli).
   - Or use a package manager: `brew install azure-cli` (macOS), `apt-get install azure-cli` (Linux).

1. **Sign in to Azure:**

   ```bash
   az login
   ```

   A browser window opens. Sign in by using your Azure account credentials.

1. **Verify authentication:**

   ```bash
   az account show
   ```

   You see your subscription details in the terminal. Azure Skills detects this authentication.

### [Environment variables](#tab/environment-variables)

Use environment variables for scripts or pipelines where the Azure CLI isn't available. Create a [service principal](/cli/azure/create-an-azure-service-principal-azure-cli) first.

**Bash or Zsh:**

```bash
export AZURE_TENANT_ID="your-tenant-id"
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
```

**PowerShell:**

```powershell
$env:AZURE_TENANT_ID = "your-tenant-id"
$env:AZURE_CLIENT_ID = "your-client-id"
$env:AZURE_CLIENT_SECRET = "your-client-secret"
```

**Windows Command Prompt:**

```cmd
set AZURE_TENANT_ID=your-tenant-id
set AZURE_CLIENT_ID=your-client-id
set AZURE_CLIENT_SECRET=your-client-secret
```

Azure Skills detects these environment variables automatically.

### [Managed identity](#tab/managed-identity)

If you run Azure Skills on an Azure resource (virtual machine, Container Apps, or Azure Functions), managed identity handles authentication with no manual setup.

For more information, see [Azure managed identities](/entra/identity/managed-identities-azure-resources/overview).

---

## Install Azure Skills

Choose the installation method for your AI assistant.

### [GitHub Copilot CLI](#tab/copilot-cli)

Add the marketplace (first time only):

```
/plugin marketplace add microsoft/azure-skills
```

Install the plugin:

```
/plugin install azure@azure-skills
```

Update the plugin:

```
/plugin update azure@azure-skills
```

### [Visual Studio Code](#tab/vscode)

Install the **Azure MCP** extension from the Visual Studio Marketplace:

👉 [Azure MCP Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server)

The Azure MCP extension installs a companion extension that brings Azure Skills into Visual Studio Code. Together they configure the Azure MCP Server and the full skills layer.

> [!NOTE]
> The skills extension requires **Git CLI** to be installed on your machine.

### [Claude Code](#tab/claude-code)

Add the marketplace (first time only):

```bash
/plugin marketplace add microsoft/azure-skills
```

Install the plugin:

```bash
/plugin install azure@azure-skills
```

Update:

```bash
/plugin marketplace update azure-skills
```

---

For the full list of supported hosts and installation options, see the [Azure Skills repository](https://github.com/microsoft/azure-skills).

## Verify installation

After installation, confirm Azure Skills is ready to use.

1. List installed plugins:

   ```bash
   /plugin list
   ```

   The output includes `azure@azure-skills` and available skills.

1. Test with a quick command:

   ```bash
   /ask List my Azure subscriptions
   ```

   Your AI assistant queries your Azure account and displays your subscriptions.

## Try Azure Skills

Now that you installed and verified Azure Skills, try these prompts in your AI assistant's chat window:

**Prepare a deployment plan for your project:**

```prompt
Analyze my project structure and prepare a deployment plan for deploying to Azure. What infrastructure do I need and how should I set it up?
```

Expected response: The assistant analyzes your codebase and generates infrastructure-as-code templates. It creates a deployment plan at `.azure/plan.md` and asks for your approval.

**Diagnose an Azure resource health issue:**

```prompt
I'm getting errors from my Azure App Service. What's wrong and how do I fix it?
```

Expected response: The assistant inspects your app service, checks logs, and reviews recent deployments. It identifies issues and provides remediation steps.

**Set up monitoring and observability:**

```prompt
Configure monitoring and alerting for my application. Which Application Insights features should I enable? What metrics should I track?
```

Expected response: The assistant proposes a monitoring strategy and generates instrumentation code. It configures Azure Alerts for critical metrics tailored to your app stack.

## Supported AI assistants

You can use Azure Skills across these platforms:

- **[GitHub Copilot CLI](../github-copilot-azure/introduction.md)**: Full integration with GitHub Copilot tools
- **Claude Code**: Through the Model Context Protocol (MCP)
- **Other MCP-compatible AI assistants**: Any tool that supports MCP

For a complete list of tools that support Azure integration, see [Azure MCP Server supported tools](../azure-mcp-server/get-started.md#connect-to-azure-mcp-server).

## Configuration options

### Telemetry

By default, Azure Skills collect usage telemetry to improve the service.

**To disable telemetry:**

```bash
export AZURE_MCP_COLLECT_TELEMETRY=false
```

## Troubleshooting

### "Authentication failed" error

**Problem:** Your AI assistant can't authenticate to Azure.

**Solutions:**

- **Azure CLI:** Run `az login` again and ensure you're authenticated.
- **Environment variables:** Verify `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` are set correctly.
- **Managed identity:** Confirm your Azure resource has an assigned managed identity.

### "Plugin not found" error

**Problem:** The Azure Skills plugin isn't installed or recognized.

**Solutions:**

- To register the marketplace, run `/plugin marketplace add microsoft/azure-skills` .
- To install the plugin, run `/plugin install azure@azure-skills`.
- Restart your AI assistant.
- Verify Node.js is installed.

### "Insufficient permissions" error

**Problem:** Your Azure account doesn't have the required permissions.

**Solutions:**

- Check your [Azure role-based access control (RBAC) role assignments](/azure/role-based-access-control/role-assignments-list-portal).
- Request more roles from your Azure administrator.
- Use a different subscription where you have higher permissions.

### "Invalid subscription" error

**Problem:** Azure Skills can't find or access your specified subscription.

**Solutions:**

- To see available subscriptions, run `az account list`. 
- Verify the subscription ID or name is correct.
- Check that your credentials have access to the subscription.

## Related content

- [Get started with Azure Skills](quickstart.md)
- [Overview of Azure Skills](overview.md)
- [GitHub Copilot for Azure](/azure/copilot/overview)
- [Azure MCP Server get started guide](../azure-mcp-server/get-started.md)

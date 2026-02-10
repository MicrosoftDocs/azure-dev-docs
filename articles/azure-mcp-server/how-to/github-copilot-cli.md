---
title: "Quickstart: Integrate Azure MCP Server with GitHub Copilot CLI"
description: Learn how to configure the Azure MCP Server for use with the GitHub Copilot CLI using the /mcp command.
ms.topic: quickstart
ms.date: 02/10/2026
ai-usage: ai-generated
---

# Quickstart: Integrate Azure MCP Server with GitHub Copilot CLI

In this quickstart, you learn how to connect the Azure Model Context Protocol (MCP) Server to the GitHub Copilot CLI. This integration allows GitHub Copilot to interact with your Azure resources directly from your terminal.

## Prerequisites

- [GitHub Copilot CLI](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/) installed.
- [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated (`az login`).
- [Node.js](https://nodejs.org/) installed (for running the server via `npx`).

[!INCLUDE [sign-in-local-development](../includes/sign-in-local-development.md)]

## Add Azure MCP Server

The GitHub Copilot CLI supports MCP servers through the `/mcp` command family.

1. Open your terminal.

1. Start the GitHub Copilot CLI in interactive mode:

   ```bash
   copilot
   ```

1. In the interactive session, run the following command to open the MCP server configuration form:

   ```bash
   /mcp add
   ```

1. Fill in the configuration fields with the following values:

   | Field | Value |
   |-------|-------|
   | **Server Name** | `azure-mcp` |
   | **Server Type** | `1` (Local) |
   | **Command** | `npx -y @azure/mcp@latest server start` |
   | **Environment Variables** | *(leave blank - utilizes Azure CLI authentication)* |
   | **Tools** | `*` |

   > [!NOTE]
   > If you prefer using .NET, set the **Command** to `dotnet dnx -p Azure.Mcp server start`.

1. Press **Ctrl+S** (or **Cmd+S** on macOS) to save the server configuration.
1. When you've finished, press `esc` to close the server configuration.

## Verify the connection

Confirm that you configured the Azure MCP Server correctly and that the GitHub Copilot CLI recognizes it:

1. In your Copilot CLI session, run:

   ```bash
   /mcp show
   ```

1. Review the output. You should see `azure-mcp` listed in the configuration:

   ```output
   ● MCP Server Configuration:
     • azure-mcp (local): Command: npx
   
   Total servers: 1
   Config file: ~/.copilot/mcp-config.json
   ```

## Use Azure MCP Server

Once connected, you can use natural language to interact with your Azure resources.

1. In the GitHub Copilot CLI session, type a prompt that requires Azure context. For example:

   ```text
   > List my Azure resource groups.
   ```

1. GitHub Copilot identifies the intent and uses the `azure-mcp` tools to fetch the information. It prints a response listing your Azure resource groups, similar to:

   ```output
   I found the following resource groups in your subscription:
   
   - **my-resource-group-1** (East US)
   - **dev-environment** (West Europe)
   - **production-app** (Central US)
   ```

## Manage MCP servers

Manage your configured MCP servers using the following commands:

- **List servers:** `/mcp show`
- **Remove a server:** `/mcp remove azure-mcp`
- **Get help:** `/mcp help`

## Next steps

- Learn more about [GitHub Copilot CLI](https://docs.github.com/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli).
- Explore [Azure MCP Server capabilities](../overview.md).

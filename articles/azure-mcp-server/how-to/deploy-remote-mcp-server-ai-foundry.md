---
title: Deploy the Azure MCP Server as a remote MCP server and connect using Microsoft Foundry
description: Learn how to deploy the Azure MCP Server as a remote MCP server and connect using Microsoft Foundry
keywords: azure mcp server, azmcp
author: alexwolfmsft
ms.author: alexwolft
ms.date: 11/14/2025
ms.topic: how-to
ai-usage: ai-generated
---

## Deploy a remote Azure MCP Server and connect to it using Azure AI Foundry

Deploy the [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a remote MCP server over HTTPS. This setup lets AI agents in [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) securely invoke MCP tool calls to perform Azure operations for you.

## Prerequisites

- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd)
- Identify Azure MCP Server tool areas (namespaces) to enable (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). These steps use the `storage` namespace.
- An [Azure Storage account](/azure/storage/common/storage-account-create).
- [Microsoft Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)

## Azure MCP Server template

This article uses the [Azure MCP Server - ACA with Managed Identity](https://github.com/Azure-Samples/azmcp-foundry-aca-mi) `azd` template to deploy the server to Azure Container Apps with storage tools enabled and managed identity for secure access to Azure Storage. The Azure Developer CLI (`azd`) is an open source tool that speeds up setting up and deploying app resources on Azure. `azd` offers concise commands that align with key stages in your development workflow.

## Deploy the Azure MCP server

Deploy the Azure MCP server to Azure Container Apps:

1. Clone and initialize the `azmcp-copilot-studio-aca-mi` template using the `azd init` command:

    ```bash
    azd init -t azmcp-foundry-aca-mi
    ```

    When prompted, provide an environment name for the template.

1. Run the template with the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following:

    - **Subscription**: Select the subscription to provision resources to (created resources are listed below).
    - **AI Foundry Project Resource ID**: The Azure resource ID of the AI Foundry project used for agent integration.
    - **Storage Account Resource ID**: The Azure resource ID of the storage account the MCP server accesses.

`azd` provisions and applies the following resources and configurations:

- **Azure Container App** - Runs Azure MCP server and provides the storage namespace.
- **Microsoft Entra ID role assignments** - Grant the Azure Container App managed identity roles for outbound authentication to the storage account specified by the storage resource ID input:
  - Reader: Read-only access to storage account properties.
  - Storage Blob Data Reader: Read-only access to blob data.
- **Entra app registration** - Provides incoming OAuth 2.0 authentication for clients (for example, agents) with the `Mcp.Tools.ReadWrite.All` role. This role is assigned to the managed identity of the AI Foundry project specified by the AI Foundry resource ID input.
- **Application Insights** - Provides telemetry and monitoring.

### Deployment output

1. After deployment finishes, retrieve the environment variables for the `azd` project using the `azd env get-values` command:

    ```bash
    azd env get-values
    ```

    Example output:

    ```text
    CONTAINER_APP_URL="https://azure-mcp-storage-server.<your-app-name>.eastus2.azurecontainerapps.io"
    ENTRA_APP_CLIENT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ENTRA_APP_IDENTIFIER_URI="api://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ENTRA_APP_OBJECT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ENTRA_APP_ROLE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ENTRA_APP_SERVICE_PRINCIPAL_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```

1. Copy the `CONTAINER_APP_URL` and `ENTRA_APP_CLIENT_ID` values for use in the next section, or leave the terminal open for reference.

## Use the Azure MCP server from AI Foundry agent

Once deployed, connect your AI Foundry agent to the Azure MCP Server running on Azure Container Apps. The agent authenticates using its managed identity to gain access to the configured Azure Storage tools.

1. Navigate to your Foundry project: https://aka.ms/nextgen-canary.
1. Select **Build → Create agent**.
1. Select the **+ Add** button in the tools section.
1. Choose the **Custom** tab.
1. Choose **Model Context Protocol** as the tool and select **Create**.

    :::image type="content" source="../media/azure-create-foundry-agent-mcp-tool.png" alt-text="A screenshot showing how to create an MCP connection.":::

1. Configure the MCP connection

    :::image type="content" source="../media/azure-add-azure-foundry-mcp-connection.png" alt-text="A screenshot showing how to configure an MCP connection.":::

    - Enter the `CONTAINER_APP_URL` value as the **Remote MCP Server** endpoint.
    - Select **Microsoft Entra → Project Managed Identity** as the **Authentication** method.
    - Enter your `ENTRA_APP_CLIENT_ID` as the **Audience**.
    - Click **Connect** to associate this connection to the agent.

The agent is now ready to assist you with tasks. It can answer questions and leverage tools from the Azure MCP Server to perform Azure operations on your behalf.

## Clean up

Run the `azd down` command to delete the Azure resources:

```bash
azd down
```

## Explore the Bicep modules

The `azd` template consists of the following Bicep modules:

- **`main.bicep`** - Orchestrates deployment of all resources.
- **`aca-infrastructure.bicep`** - Deploys the Container App that hosts the Azure MCP Server.
- **`aca-role-assignment-resource-storage.bicep`** - Assigns Azure Storage RBAC roles to the Container App's managed identity on the storage account specified by the input storage resource ID.
- **`entra-app.bicep`** - Creates an Entra app registration with a custom app role for OAuth 2.0 authentication.
- **`aif-role-assignment-entraapp.bicep`** - Assigns the Entra app role to the managed identity of the AI Foundry project (specified by the input AI Foundry resource ID) for Azure MCP Server access.
- **`application-insights.bicep`** - Deploys Application Insights for telemetry and monitoring (conditional).

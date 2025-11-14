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

## Deploy a remote Azure MCP Server and connect to it using Copilot Studio

Deploy the [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a remote MCP server over HTTPS. This setup lets AI agents in [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) securely invoke MCP tool calls to perform Azure operations for you.

## Prerequisites

- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd)
- Identify Azure MCP Server tool areas (namespaces) to enable (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). These steps use the `storage` namespace.
- An [Azure Storage account](/azure/storage/common/storage-account-create).
- [Microsoft Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)

## Azure MCP Server template

Use the [Azure Developer CLI template](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server/azd-templates/aca-aifoundry-managed-identity) to deploy the server to Azure Container Apps with storage tools enabled and managed identity for secure access to Azure Storage. The Azure Developer CLI (`azd`) is an open source tool that speeds up setting up and deploying app resources on Azure. `azd` offers concise commands that align with key stages in your development workflow.

## Deploy the Azure MCP server

Deploy the Azure MCP server to Azure Container Apps:

1. Clone the [Microsoft MCP](https://github.com/microsoft/mcp) repository from GitHub.

    ```bash
    git clone https://github.com/microsoft/mcp
    ```

1. Go to the directory that contains the `azd` template.

    ```bash
    cd "mcp/servers/Azure.Mcp.Server/azd-templates/aca-aifoundry-managed-identity/"
    ```

1. Run the template with the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following:

    - **Storage Account Resource ID** - The Azure resource ID of the storage account the MCP server accesses.
    - **AI Foundry Project Resource ID** - The Azure resource ID of the AI Foundry project used for agent integration.

    `azd` provisions and applies the following resources and configurations:

- **Azure Container App** - Runs Azure MCP server and provides the storage namespace.
- **Microsoft Entra ID role assignments** - Grant the Azure Container App managed identity roles for outbound authentication to the storage account specified by the storage resource ID input:
  - Reader: Read-only access to storage account properties.
  - Storage Blob Data Reader: Read-only access to blob data.
- **Entra app registration** - Provides incoming OAuth 2.0 authentication for clients (for example, agents) with the `Mcp.Tools.ReadWrite.All` role. This role is assigned to the managed identity of the AI Foundry project specified by the AI Foundry resource ID input.
- **Application Insights** - Provides telemetry and monitoring.

### Deployment output

After deployment finishes, retrieve `azd` environment variables with the `azd env get-values` command:

```bash
azd env get-values
```

Example output:

```text
CONTAINER_APP_URL="https://azure-mcp-storage-server.wonderfulazmcp-a9561afd.eastus2.azurecontainerapps.io"
ENTRA_APP_CLIENT_ID="c3248eaf-3bdd-4ca7-9483-4fcf213e4d4d"
ENTRA_APP_IDENTIFIER_URI="api://c3248eaf-3bdd-4ca7-9483-4fcf213e4d4d"
ENTRA_APP_OBJECT_ID="a89055df-ccfc-4aef-a7c6-9561bc4c5386"
ENTRA_APP_ROLE_ID="3e60879b-a1bd-5faf-bb8c-cb55e3bfeeb8"
ENTRA_APP_SERVICE_PRINCIPAL_ID="31b42369-583b-40b7-a535-ad343f75e463"
```

## Use the Azure MCP server from AI Foundry agent

// TODO

1. Get the Container App URL from the `azd` output and replace `<CONTAINER_APP_URL>` with your value.
2. Get Entra App Client ID from `azd` output: `ENTRA_APP_CLIENT_ID`
3. <TODO: Add one liner AI Foundry integration step later (reference to AIF documentation)>

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

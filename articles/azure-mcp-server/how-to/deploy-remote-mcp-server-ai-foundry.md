---
title: Connect GitHub Copilot coding agent to the Azure MCP Server
description: Learn how to use the Azure MCP Server with the GitHub Copilot coding agent.
keywords: azure mcp server, azmcp
author: rotabor
ms.author: rotabor
ms.date: 10/27/2025
ms.topic: how-to
---

# Deploy the Azure MCP Server remotely to Azure Container Apps and connect to it using Microsoft Foundry

This article shows you how to deploy the [Azure MCP Server(https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a remote MCP server accessible over HTTPS. This enables AI agents from [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) to securely invoke MCP tool calls that perform Azure operations on your behalf.

## Prerequisites

- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
- The list of Azure MCP Server tool areas (namespaces) you wish to enable (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). The steps ahead use the `storage` namespace.
- An [Azure Storage account](/azure/storage/common/storage-account-create)
- A [Microsoft Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)

## Explore the Azure MCP Server template

This article uses an [Azure Developer CLI template](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server/azd-templates/aca-aifoundry-managed-identity) to automate deployment of the server on Azure Container Apps with storage tools enabled, using managed identity authentication for secure access to Azure Storage. The [Azure Developer CLI](`azd`)]() is an open-source tool that accelerates provisioning and deploying app resources on Azure. `azd` provides best practice, developer-friendly commands that map to key stages in your development workflow.

## Deploy the Azure MCP Server

Complete the following steps to deploy the Azure MCP Server to Azure Container Apps:

1. Clone the [Microsoft MCP](https://github.com/microsoft/mcp) repo from GitHub:

    ```bash
    git clone https://github.com/microsoft/mcp
    ```

1. Navigate to the directory that contains the `azd` template:

    ```bash
    cd "mcp/servers/Azure.Mcp.Server/azd-templates/aca-aifoundry-managed-identity/"
    ```

1. Run the `azd auth login` command to sign-in using your Azure account:

    ```bash
    azd auth login
    ```

1. Run the template using the `azd up` command:

    ```bash
    azd up
    ```

1. When prompted, provide values for the following:

    - **Environment Name**: A user friendly name for managing azd deployments.
    - **Azure Subscription**: The Azure subscription in which to create the resources.
    - **Resource Group**: The resource group in which to create the resources. You can create a new resource group on demand during this step.

1. To configure the remote Azure MCP Server connections, `azd` prompts you for the following:

    - **Storage Account Resource ID** - The Azure resource ID of the storage account the MCP server will access
    - **AI Foundry Project Resource ID** - The Azure resource ID of the AI Foundry project for agent integration

    `azd` provisions and applies the following resources and configurations:

    - **Azure Container App** - Runs Azure MCP Server with storage namespace.
    - **Microsoft Entra ID Role Assignments** - Grants the Azure Container App managed identity roles for outbound authentication to the storage account specified by the input storage resource ID:
      - Reader: Read-only access to storage account properties
      - Storage Blob Data Reader: Read-only access to blob data
    - **Entra App Registration**: Created for incoming OAuth 2.0 authentication from clients (agents) with `Mcp.Tools.ReadWrite.All` role. This role is assigned to the managed identity of the AI Foundry project specified by the input AI Foundry resource ID.
    - **Application Insights** - Telemetry and monitoring

### Deployment outputs

After the deployment finishes, you can retrieve `azd` environment variables using the `azd env get-values` command:

```bash
azd env get-values
```

Example output:

```
CONTAINER_APP_URL="https://azure-mcp-storage-server.wonderfulazmcp-a9561afd.eastus2.azurecontainerapps.io"
ENTRA_APP_CLIENT_ID="c3248eaf-3bdd-4ca7-9483-4fcf213e4d4d"
ENTRA_APP_IDENTIFIER_URI="api://c3248eaf-3bdd-4ca7-9483-4fcf213e4d4d"
ENTRA_APP_OBJECT_ID="a89055df-ccfc-4aef-a7c6-9561bc4c5386"
ENTRA_APP_ROLE_ID="3e60879b-a1bd-5faf-bb8c-cb55e3bfeeb8"
ENTRA_APP_SERVICE_PRINCIPAL_ID="31b42369-583b-40b7-a535-ad343f75e463"
```

## Use the Azure MCP Server from AI Foundry Agent

// TODO

1. Get your Container App URL from `azd` output: `CONTAINER_APP_URL`
2. Get Entra App Client ID from `azd` output: `ENTRA_APP_CLIENT_ID`
3. <TODO: Add one liner AI Foundry integration step later (reference to AIF documentation)>

## Clean Up

```bash
azd down
```

## Explore the Bicep modules

The `azd` template consists of the following Bicep modules:

- **`main.bicep`** - Orchestrates the deployment of all resources
- **`aca-infrastructure.bicep`** - Deploys Container App hosting the Azure MCP Server
- **`aca-role-assignment-resource-storage.bicep`** - Assigns Azure storage RBAC roles to the Container App managed identity on the storage account specified by the input storage resource ID
- **`entra-app.bicep`** - Creates Entra App registration with custom app role for OAuth 2.0 authentication
- **`aif-role-assignment-entraapp.bicep`** - Assigns Entra App role to the managed identity of the AI Foundry project specified by the input AI Foundry resource ID for the Azure MCP Server access
- **`application-insights.bicep`** - Deploys Application Insights for telemetry and monitoring (conditional deployment)

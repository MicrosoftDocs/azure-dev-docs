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

Deploy the [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a remote server over HTTPS. Agents in [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) can securely call MCP tools to run Azure operations.

## Prerequisites

- Azure subscription with **Owner** or **User Access Administrator** access
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd)
- Enable required Azure MCP Server tool areas (namespaces) (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). This article uses the `storage` namespace.
- [Azure Storage account](/azure/storage/common/storage-account-create)
- [Microsoft Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)

## Azure MCP Server template

Use the [Azure MCP Server - ACA with Managed Identity](https://github.com/Azure-Samples/azmcp-foundry-aca-mi) `azd` template to deploy Azure MCP Server to Azure Container Apps with storage tools and a managed identity for secure access to Azure Storage. The Azure Developer CLI (`azd`) is an open source tool that simplifies provisioning and deploying Azure resources and offers concise commands for key stages in your development workflow.

## Deploy the Azure MCP server

Deploy the Azure MCP server to Azure Container Apps:

1. Clone and initialize the `azmcp-foundry-aca-mi` template with the `azd init` command.

    ```bash
    azd init -t azmcp-foundry-aca-mi
    ```

    When prompted, enter an environment name.

1. Run the template with the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following:

    - **Subscription**: Select the subscription for the resources listed below.
    - **AI Foundry Project Resource ID**: The Azure resource ID of the AI Foundry project used for agent integration.
    - **Storage Account Resource ID**: The Azure resource ID of the storage account the MCP server accesses.

`azd` provisions and applies the following resources and configurations:

- **Azure Container App**: Runs the Azure MCP server and provides the storage namespace.
- **Microsoft Entra ID role assignments**: Assign roles to the Azure Container Apps managed identity for outbound authentication to the storage account you specify with the storage resource ID:
  - Reader: Read-only access to storage account properties.
  - Storage Blob Data Reader: Read-only access to blob data.
- **Entra app registration**: Provides OAuth 2.0 authentication for clients like agents that have the `Mcp.Tools.ReadWrite.All` role. The template assigns this role to the managed identity of the AI Foundry project you specify.
- **Application Insights**: Provides telemetry and monitoring.

### Deployment output

1. After deployment finishes, retrieve the environment variables for the `azd` project using the `azd env get-values` command.

    ```bash
    azd env get-values
    ```

    Example output:

    ```text
    CONTAINER_APP_URL="https://azure-mcp-storage-server.<your-container-app-name>.eastus2.azurecontainerapps.io"
    ENTRA_APP_CLIENT_ID="<your-app-client-id>"
    ENTRA_APP_IDENTIFIER_URI="api://<your-app-client-id>"
    ENTRA_APP_OBJECT_ID="<your-app-object-id>"
    ENTRA_APP_ROLE_ID="<your-app-role-id>"
    ENTRA_APP_SERVICE_PRINCIPAL_ID="<your-app-service-principal-id>"
    ```

1. Copy the `CONTAINER_APP_URL` and `ENTRA_APP_CLIENT_ID` values to use in the next section, or leave the terminal open for reference.

## Use the Azure MCP server from AI Foundry agent

After deployment, connect your AI Foundry agent to the Azure MCP Server running on Azure Container Apps. The agent authenticates using its managed identity to gain access to the configured Azure Storage tools.

1. Go to your Foundry project at https://aka.ms/nextgen-canary.
1. Select **Build → Create agent**.
1. Select **+ Add** in the tools section.
1. Select the **Custom** tab.
1. Select **Model Context Protocol**, then select **Create**.

    :::image type="content" source="../media/azure-create-foundry-agent-mcp-tool.png" alt-text="Screenshot of the Create agent page with Model Context Protocol selected to create an MCP connection.":::

1. Configure the MCP connection.

    :::image type="content" source="../media/azure-add-azure-foundry-mcp-connection.png" alt-text="Screenshot of the connection form with fields for Remote MCP Server endpoint, authentication, audience, and Connect button to configure an MCP connection.":::

    - Enter the `CONTAINER_APP_URL` value for the **Remote MCP Server** endpoint.
    - Select **Microsoft Entra → Project Managed Identity** for **Authentication**.
    - Enter `ENTRA_APP_CLIENT_ID` as the **Audience**.
    - Select **Connect** to associate the connection with the agent.

The agent is ready to assist you. It answers questions and uses tools from the Azure MCP Server to perform Azure operations for you.

## Clean up resources

- Run `azd down` to delete Azure resources.

```bash
azd down
```

## Explore the Bicep modules

The `azd` template includes the following Bicep modules:

- *main.bicep* orchestrates deployment of all resources.
- *aca-infrastructure.bicep* deploys the container app hosting Azure MCP Server.
- *aca-role-assignment-resource-storage.bicep* assigns Azure Storage RBAC roles to the container app's managed identity on the storage account specified by the input storage account resource ID.
- *entra-app.bicep* creates an Entra app registration and a custom app role for OAuth 2.0 authentication.
- *aif-role-assignment-entraapp.bicep* assigns the Entra app role to the AI Foundry project's managed identity (specified by the input AI Foundry resource ID) for Azure MCP Server access.
- *application-insights.bicep* deploys Application Insights for telemetry and monitoring when enabled.

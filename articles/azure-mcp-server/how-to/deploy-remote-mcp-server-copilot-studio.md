---
title: Deploy the Azure MCP Server as a remote MCP server and connect using Copilot Studio
description: Learn how to deploy the Azure MCP Server as a remote MCP server and connect using Copilot Studio
keywords: azure mcp server, azmcp
author: alexwolfmsft
ms.author: alexwolft
ms.date: 11/14/2025
ms.topic: how-to
ai-usage: ai-generated
---

## Deploy a remote Azure MCP Server and connect to it using Copilot Studio

Deploy the [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) over HTTPS as a remote server. This setup lets AI agents in [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) securely call MCP tools to perform Azure operations for you.

## Prerequisites

- Power Platform license that includes:
  - Copilot Studio
  - Power Apps
- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd)
- Identify Azure MCP Server tool areas (namespaces) to enable (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). Use the `storage` namespace for these steps.
- An [Azure Storage account](/azure/storage/common/storage-account-create).
- A [Microsoft Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry).

## Azure MCP Server template

This article uses the [Azure MCP Server - ACA with Copilot Studio agent](https://github.com/Azure-Samples/azmcp-copilot-studio-aca-mi) `azd` template to deploy the server to Azure Container Apps. The template enables storage tools and a managed identity for secure access to Azure Storage. Azure Developer CLI (`azd`) simplifies provisioning and deploying Azure resources and offers concise commands for key development stages.

## Deploy the Azure MCP server

Deploy the Azure MCP server to Azure Container Apps:

1. Clone and initialize the `azmcp-copilot-studio-aca-mi` template using `azd`.

    ```bash
    azd init -t azmcp-copilot-studio-aca-mi
    ```

1. Run the template with the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following:

      - **Storage Account Resource ID**: Azure resource ID of the storage account the MCP server accesses.
      - **AI Foundry Project Resource ID**: Azure resource ID of the AI Foundry project used for agent integration.

    `azd` provisions the following resources and configurations:

- **Azure Container App**: Runs the Azure MCP Server and provides the storage namespace.
- **Microsoft Entra ID role assignments**: Grant the Azure Container App managed identity roles for outbound authentication to the storage account specified by the storage resource ID input:
  - Reader: Read-only access to storage account properties.
  - Storage Blob Data Reader: Read-only access to blob data.
- **Entra app registration**: Provides OAuth 2.0 authentication for clients, like agents, with the `Mcp.Tools.ReadWrite.All` role. This role is assigned to the managed identity of the AI Foundry project specified by the AI Foundry resource ID input.
- **Application Insights** - Provides telemetry and monitoring.

### Deployment output

After deployment completes, retrieve `azd` environment variables with the `azd env get-values` command.

```bash
azd env get-values
```

Example output:

```text
AZURE_RESOURCE_GROUP="<your-resource-group-name>"
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
AZURE_TENANT_ID="<your-tenant-id>"
CONTAINER_APP_NAME="<your-container-app-name>"
CONTAINER_APP_URL="https://azure-mcp-storage-server.<your-container-app-name>.westus3.azurecontainerapps.io"
ENTRA_APP_CLIENT_CLIENT_ID="<your-client-app-registration-client-id>"
ENTRA_APP_SERVER_CLIENT_ID="<your-server-app-registration-client-id>"
```

## Calling tools from Copilot Studio agent

The Copilot Studio agent connects to MCP servers by using a custom connector.

### Configure a custom connector

Sign in to [Power Apps](https://make.powerapps.com) and select the environment to host the custom connector. Create a custom connector following the steps in the UI. Select **Create from blank**. To learn more about custom connector configuration, see [create custom connector from scratch](/connectors/custom-connectors/define-blank).

#### General

- Provide a descriptive name and description for the custom connector.
- Set `Scheme` to `HTTPS`.
- Set `Host` to the container app URL from the `CONTAINER_APP_URL` output value.

![Screenshot of the custom connector General tab showing name, description, scheme set to HTTPS, and host field populated with a container app URL.](../media/custom-connector-general.png)

#### Swagger editor

Skip the Security step for now and select **Swagger editor** to enter the editor view. In the editor view:

- Expose a POST method at the root path with a custom `x-ms-agentic-protocol: mcp-streamable-1.0` property. This property is required for the custom connector to interact with the API by using the MCP protocol. See the [custom connector swagger example](https://github.com/JasonYeMSFT/mcp/blob/0db606283e45c29008e9b7a3777008526caea96e/servers/Azure.Mcp.Server/azd-templates/aca-copilot-studio-managed-identity/custom-connector-swagger-example.yaml) for reference.

![Screenshot of Swagger editor with POST root method selected and custom x-ms-agentic-protocol property set to mcp-streamable-1.0 for MCP interaction.](../media/custom-connector-swagger-editor.png)

#### Security

Go to the Security step.

- Select **OAuth 2.0** as the authentication type.
- Select **Azure Active Directory** as the identity provider.
- Set **Client ID** to the client app registration client ID (from `ENTRA_APP_CLIENT_CLIENT_ID`).
- Choose **Use client secret** or **Use managed identity** as the secret option.
  - If you choose a client secret, create a client secret under the client app registration in the Azure portal. Copy the secret value and paste it into the client secret field.
  - If you choose managed identity, proceed with the remaining steps until the custom connector is created.
- Keep **Authorization URL** as `https://login.microsoftonline.com`.
- Set **Tenant ID** to the tenant ID of the client app registration (from `AZURE_TENANT_ID`).
- Set **Resource URL** to the server app registration client ID (from `ENTRA_APP_SERVER_CLIENT_ID`).
- Enable **On-behalf-of login**.
- Set **Scope** to `<server app registration client ID>/.default`.

![Screenshot of Security step showing OAuth 2.0 with Azure Active Directory, client ID, secret option, tenant ID, resource URL, scope, and on-behalf-of login enabled.](../media/custom-connector-security.png)

#### Create the connector

- Select **Create connector** and wait for completion. After creation, the UI shows a redirect URL and, if selected, a managed identity.
- In the Azure portal, add a redirect URI under the Web platform in the client app registration.
- If you chose managed identity, create a federated credential in the client app registration. Select **Other issuer** as the scenario. Copy the `issuer` and `subject` values from the custom connector into the credential fields. Provide a descriptive name and description, then select **Add**.

![Screenshot of Azure portal app registration showing Web platform redirect URI entry being added for the custom connector authentication flow.](../media/client-app-redirect-uri.png)
![Screenshot of federated credential creation form showing issuer and subject values pasted from the custom connector plus name and description fields.](../media/client-app-client-credential.png)

#### Test connection

- Open the custom connector, select **Edit**, and go to the **Test** step.
- Select any operation and choose **New connection**.
- Sign in with the user account you plan to use to access the MCP tools. You might see a dialog requesting consent or an admin approval prompt. If you are unsure, see [Known issues](#known-issues).

If sign-in succeeds, the UI shows the connection is created successfully. If you encounter an error during sign-in, see [Known issues](#known-issues) and troubleshoot with your tenant admin.

![Screenshot of Test tab in custom connector showing successful connection status after user signs in with intended account.](../media/custom-connector-created-connection.png)

### Call an Azure MCP tool in Copilot Studio test playground

- Sign in to [Copilot Studio](https://copilotstudio.microsoft.com) and select the environment to host the Copilot Studio agent. Create a new agent or use an existing one.
- Open the agent details and select the **Tools** tab.
- Select **Add a tool**.
- Search for your custom connector name and add it.
- After you add the custom connector, the Copilot Studio Agent attempts to list the tools from the MCP server. If successful, you see the available tool list under the connector.
- Select **Test** to start a test playground session.
- Prompt the agent to call an MCP tool, for example to list storage accounts in the subscription.

![Screenshot of Copilot Studio agent Tools tab listing added custom connector and retrieved MCP tool list beneath it.](../media/copilot-studio-tools-tab.png)
![Screenshot of Copilot Studio test playground session where agent returns results after invoking a listed MCP tool.](../media/copilot-studio-call-tools.png)

## Clean up resources

Run the following command to delete the Azure resources this template created when you don't need them.

```bash
azd down
```

Delete the Copilot Studio agent, Power Apps custom connector, and connection to clean up Power Platform resources.

## Template structure

The `azd` template includes these Bicep modules:

- **`main.bicep`** - Orchestrates deployment of all resources.
- **`aca-storage-managed-identity.bicep`** - Creates a user-assigned managed identity.
- **`aca-storage-subscription-role.bicep`** - Assigns an Azure RBAC role to the user-assigned managed identity. It defaults to the Subscription Reader role.
- **`aca-infrastructure.bicep`** - Deploys the Container App hosting the Azure MCP Server.
- **`entra-app.bicep`** - Creates Entra app registrations.
- **`application-insights.bicep`** - Deploys Application Insights for telemetry and monitoring when enabled.

## Known issues

- The Power Apps custom connector doesn't support authenticating users from multiple tenants, so set the client app registration to accept only users from its tenant.
- During authentication, the user or a tenant admin grants the client app access to their data. Learn more in [application consent experience](/entra/identity-platform/application-consent-experience). You can give consent in several ways.
  - A user can give consent during sign-in just for that user. Tenant security policy might block this.
  - A tenant admin can give consent for all users in the tenant in the client app registration under the **API permissions** blade in Azure portal.
  - Add the client app registration as a preauthorized client app in the server app registration under the **Expose an API** blade in Azure portal.
- If the client app registration and server app registration are in different tenants, you might see the following error when you try to create the connection:
  - "The app is trying to access a service 'server_app_registration_client_id'(server_app_registration_display_name) that your organization 'client_app_registration_tenant' lacks a service principal for." A tenant admin of the client app registration provisions a service principal for the server app registration in that tenant by running the Azure CLI command `az ad sp create --id <server_app_registration_client_id>`. After provisioning, create the connection again. The consent flow triggers.
- If the Power Apps environment has a tenant isolation policy, it blocks data flow when the client or server app registrations are in different tenants. Learn how to add exception rules to allow this data flow in [cross tenant restrictions](/power-platform/admin/cross-tenant-restrictions).

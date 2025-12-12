---
title: Deploy the Azure MCP Server as a remote MCP server and connect using Copilot Studio
description: Learn how to deploy the Azure MCP Server as a remote MCP server and connect using Copilot Studio
keywords: azure mcp server, azmcp
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/11/2025
ms.topic: how-to
ai-usage: ai-generated
---

# Deploy a self-hosted remote Azure MCP Server and connect to it using Copilot Studio

Deploy the [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) over HTTPS as a self-hosted remote server. This setup lets AI agents in [Microsoft Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) can securely connect to and call MCP tools using the deployed Azure MCP Server to run Azure operations. This article focuses on the Copilot Studio connection scenario.

## Prerequisites

- Power Platform license that includes:
  - Copilot Studio
  - Power Apps
- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd)
- The list of Azure MCP Server tool areas (namespaces) you wish to enable (see [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md)). The reference template in this article uses the `storage` namespace.

## Azure MCP Server template

This article uses the [Azure MCP Server - ACA with Copilot Studio agent](https://github.com/Azure-Samples/azmcp-copilot-studio-aca-mi) `azd` template to deploy the server to Azure Container Apps. The template enables storage tools and a managed identity for secure access to Azure Storage. The Azure Developer CLI (`azd`) is an open source tool that simplifies provisioning and deploying Azure resources and offers concise commands (`azd deploy`, `azd provision`) that map to key stages in your development workflow.

## Deploy the Azure MCP server

Deploy the Azure MCP server to Azure Container Apps:

1. Clone and initialize the `azmcp-copilot-studio-aca-mi` template using `azd`.

    ```bash
    azd init -t azmcp-copilot-studio-aca-mi
    ```

    When prompted, enter an environment name.

1. Run the template with the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following:

    - **Subscription**: Select the subscription for the provisioned resources (listed below).
    - **Resource Group**: The resource group in which to create the resources. You can create a new resource group on demand during this step.

`azd` uses the template files to provision the following resources and configurations:

- **Azure Container App**: Runs the Azure MCP Server and provides the storage namespace.
- **User-assigned managed identity**: A managed identity with the **Subscription Reader** role assigned to the container app and used by the Azure MCP server to make tool calls.
- **Entra app registration (Azure MCP Server)**: Provides OAuth 2.0 authentication for clients, like agents, with the `Mcp.Tools.ReadWrite.All` role. This role is assigned to the managed identity of the AI Foundry project specified by the AI Foundry resource ID input.
- **Entra App Registration (Client)**: For the Power Apps custom connector to connect to the remote Azure MCP Server.
- **Application Insights**: Provides telemetry and monitoring.

### Deployment output and configuration

1. After deployment completes, retrieve `azd` environment variables with the `azd env get-values` command.

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

1. You also need to add the created API scope as one of the permissions of the client app registration. Go to Azure Portal and search for the client app registration using the `ENTRA_APP_CLIENT_CLIENT_ID` output value.
1. Go to the API permissions blade and select **Add a permission**.
1. In the My APIs tab, select the **Server app registration** and add the `Mcp.Tools.ReadWrite` scope.

## Call tools from Copilot Studio agent

The Copilot Studio agent connects to MCP servers by using a custom connector.

### Configure a custom connector

1. Sign in to [Power Apps](https://make.powerapps.com) and select the environment to host the custom connector.
1. Create a new custom connector using the **Create from blank** option. To learn more about custom connector configuration, see [create custom connector from scratch](/connectors/custom-connectors/define-blank).
1. Complete the following sections for each step of the connector creation workflow.

#### General

On the **General** step:

- Provide a descriptive **Name** and **Description** for the custom connector.
- Set **Scheme** to `HTTPS`.
- Set **Host** to the `CONTAINER_APP_URL` value from the `azd` output.

![Screenshot of the custom connector General tab showing name, description, scheme set to HTTPS, and host field populated with a container app URL.](../media/custom-connector-general.png)

#### Security

Skip the Security step for now and proceed to the **Definition** step.

#### Definition

1. Toggle **Swagger editor** to enter the editor view.
1. In the editor view:

    - Expose a POST method at the root path with a custom `x-ms-agentic-protocol: mcp-streamable-1.0` property. This property is required for the custom connector to interact with the API by using the MCP protocol.

      > [!NOTE]
      > See the [custom connector swagger example](https://github.com/Azure-Samples/azmcp-copilot-studio-aca-mi/blob/main/custom-connector-swagger-example.yaml) for a reference template.

![Screenshot of Swagger editor with POST root method selected and custom x-ms-agentic-protocol property set to mcp-streamable-1.0 for MCP interaction.](../media/custom-connector-swagger-editor.png)

#### Custom connector: Security (OAuth 2.0)

Return to the **Security** step, configure OAuth 2.0 authentication:

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Authentication type** | OAuth 2.0 | Required |
| **Identity provider** | Azure Active Directory | Required |
| **Client ID** | `ENTRA_APP_CLIENT_CLIENT_ID` from azd output | Client app registration ID |
| **Secret option** | Use client secret OR Use managed identity | See below for setup |
| **Authorization URL** | `https://login.microsoftonline.com` | Default value |
| **Tenant ID** | `AZURE_TENANT_ID` from azd output | Your Azure tenant ID |
| **Resource URL** | `ENTRA_APP_SERVER_CLIENT_ID` from azd output | Server app registration client ID (not a URL) |
| **On-behalf-of login** | Enabled | Required |
| **Scope** | `<ENTRA_APP_SERVER_CLIENT_ID>/.default` | Format: `{server_client_id}/.default` |

**Secret option setup**:
- **If using client secret**: Create a client secret in the client app registration (Azure portal). Copy the secret value and paste it into the client secret field.
- **If using managed identity**: Proceed with remaining steps until the custom connector is created.

**Same-tenant requirement**: The client and server app registrations must be in the same tenant for simplified authentication. For cross-tenant scenarios, see [Known issues](#known-issues).

Select **Create connector** and wait for completion. After creation, the UI shows a redirect URL and, if selected, a managed identity.

![Screenshot of Security step showing OAuth 2.0 with Azure Active Directory, client ID, secret option, tenant ID, resource URL, scope, and on-behalf-of login enabled.](../media/custom-connector-security.png)

### App registration: Configure redirect URI and credentials

1. In the Azure portal, add a redirect URI under the Web platform in the client app registration.

    ![Screenshot of Azure portal app registration showing Web platform redirect URI entry being added for the custom connector authentication flow.](../media/client-app-redirect-uri.png)

1. If you chose **Use managed identity** on the **Security** step, create a federated credential in the client app registration.
    - Select **Other issuer** as the scenario.
    - Copy the `issuer` and `subject` values from the custom connector into the credential fields.
    - Provide a descriptive **Name** and **Description**, then select **Add**.

    ![Screenshot of federated credential creation form showing issuer and subject values pasted from the custom connector plus name and description fields.](../media/client-app-client-credential.png)

#### Test connection

1. Open the custom connector, select **Edit**, and go to the **Test** step.
1. Select any operation and choose **New connection**.
1. Sign in with the user account you plan to use to access the MCP tools. You might see a dialog requesting consent or an admin approval prompt. If you are unsure, see [Known issues](#known-issues).

    If sign-in succeeds, the UI shows the connection is created successfully. If you encounter an error during sign-in, see [Known issues](#known-issues) and troubleshoot with your tenant admin.

    ![Screenshot of Test tab in custom connector showing successful connection status after user signs in with intended account.](../media/custom-connector-created-connection.png)

### Call an Azure MCP tool in Copilot Studio test playground

1. Sign in to [Copilot Studio](https://copilotstudio.microsoft.com) and select the environment to host the Copilot Studio agent. Create a new agent or use an existing one.
1. Open the agent details and select the **Tools** tab.
1. Select **Add a tool**.
1. Search for your custom connector name and add it.
1. After you add the custom connector, the Copilot Studio Agent attempts to list the tools from the MCP server. If successful, you see the available tool list under the connector.
1. Select **Test** to start a test playground session.
1. Prompt the agent to call an MCP tool, for example to list storage accounts in the subscription.

    ![Screenshot of Copilot Studio agent Tools tab listing added custom connector and retrieved MCP tool list beneath it.](../media/copilot-studio-tools-tab.png)
    ![Screenshot of Copilot Studio test playground session where agent returns results after invoking a listed MCP tool.](../media/copilot-studio-call-tools.png)

## Clean up resources

Run the following command to delete the Azure resources this template created when you don't need them.

```bash
azd down
```

> [!NOTE]
> `azd` cannot delete the Entra app registrations created by this template. Delete the Entra app registrations by searching for the `ENTRA_APP_CLIENT_CLIENT_ID` and the `ENTRA_APP_SERVER_CLIENT_ID` values in the Azure Portal and then delete the corresponding app registrations.

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

- **Single-tenant requirement**: The Power Apps custom connector doesn't support authenticating users from multiple tenants, so set the client app registration to accept only users from its tenant.
- **Consent options**: During authentication, the user or a tenant admin grants the client app access to their data. Learn more in [application consent experience](/entra/identity-platform/application-consent-experience). You can give consent in several ways:
  - A user can give consent during sign-in just for that user. Tenant security policy might block this.
  - A tenant admin can give consent for all users in the tenant in the client app registration under the **API permissions** blade in Azure portal.
  - Add the client app registration as a preauthorized client app in the server app registration under the **Expose an API** blade in Azure portal.
- **Cross-tenant scenario**: If the client app registration and server app registration are in different tenants, you might see the following error when you try to create the connection:
  - "The app is trying to access a service 'server_app_registration_client_id'(server_app_registration_display_name) that your organization 'client_app_registration_tenant' lacks a service principal for." 
  - **Resolution**: A tenant admin of the client app registration must provision a service principal for the server app registration in that tenant:
    ```bash
    az ad sp create --id <server_app_registration_client_id>
    ```
  - After provisioning, create the connection again. The consent flow triggers.
- If the Power Apps environment has a tenant isolation policy, it blocks data flow when the client or server app registrations are in different tenants. Learn how to add exception rules to allow this data flow in [cross tenant restrictions](/power-platform/admin/cross-tenant-restrictions).

## Related content

- [Deploy a remote Azure MCP Server and connect to it using Microsoft Foundry](deploy-remote-mcp-server-microsoft-foundry.md)

---
title: Deploy the Azure MCP Server with on-behalf-of authentication
description: Learn how to deploy the Azure MCP Server as a remote MCP server that uses the on-behalf-of flow to call Azure services on behalf of a signed-in user.
author: alexwolfmsft
ms.author: alexwolf
ms.reviewer: alexwolf
ms.date: 03/27/2026
ms.topic: how-to
ai-usage: ai-generated
---

# Deploy Azure MCP Server with on-behalf-of authentication

Deploy [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a self-hosted remote server over HTTPS on Azure Container Apps. This article uses the on-behalf-of (OBO) authentication model, which lets the server call Azure services by using the identity of the signed-in user rather than the server's own managed identity. Agents in [Microsoft Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) can connect to the deployed server and invoke Azure MCP tools that operate with the user's own permissions and access.

## How the OBO flow works

The on-behalf-of flow is distinct from the managed identity approach used in other Azure MCP Server templates:

- **Managed identity approach**: The server authenticates to downstream Azure services by using its own managed identity. All users share the permissions granted to that identity. For a Microsoft Foundry example that uses this model, see [Deploy a remote Azure MCP Server and connect using Microsoft Foundry](deploy-remote-mcp-server-microsoft-foundry.md).
- **OBO approach**: When a user authenticates with the server, the server exchanges the user's token for a new token scoped to a downstream Azure service. The server calls Azure services *on behalf of* the user, so each user's own Azure permissions determine what they can do.

The template provisions two [Microsoft Entra](/entra/fundamentals/whatis) app registrations to enable this flow:

- **Server app registration**: Exposed to clients as the OAuth 2.0 resource. When a user's token arrives, the server uses a federated identity credential (backed by a managed identity) to perform the OBO token exchange to access downstream APIs like Azure Resource Manager and Azure Storage.
- **Client app registration**: Used by external clients (Foundry agents, Copilot Studio custom connectors) to authenticate against the server. The client app is pre-authorized on the server app so users don't need to consent separately.

## Prerequisites

- Azure subscription with **Owner** or **User Access Administrator** permissions
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd) installed
- [Azure CLI](/cli/azure/install-azure-cli) installed
- The list of Azure MCP Server tool namespaces you want to enable. See [azmcp-commands.md](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md). The template in this article enables the `storage` namespace by default.

## Deploy the Azure MCP Server

This article shows how to use the [`azmcp-obo-aca`](https://github.com/Azure-Samples/azmcp-obo-template/) `azd` template to deploy the Azure MCP Server to Azure Container Apps with OBO authentication. Deploy the server:

1. Initialize the `azmcp-obo-template` template by using the `azd init` command.

    ```bash
    azd init -t azmcp-obo-template
    ```

    When prompted, enter an environment name.

1. Run the template by using the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following values:

    - **Subscription**: Select the subscription for the provisioned resources.
    - **Resource group**: Create or select a resource group to hold the resources.

`azd` uses the template files to provision the following resources and configurations:

- **Azure Container App**: Runs the Azure MCP Server with the `storage` namespace enabled.
- **User-assigned managed identity**: Provides a client credential for the server app registration through a [federated identity credential](/entra/workload-id/workload-identity-federation). The server uses this identity to perform the OBO token exchange.
- **Entra app registration (server)**: The OAuth 2.0 resource exposed to clients. Has the `Mcp.Tools.ReadWrite` scope, and carries Azure Resource Manager and Azure Storage API permissions for the OBO exchange.
- **Entra app registration (client)**: Used by clients such as Foundry agents and Power Apps custom connectors to authenticate with the server. Pre-authorized on the server app to eliminate the need for user consent.
- **Application Insights**: Provides telemetry and monitoring.

### Retrieve deployment outputs

After the deployment finishes, use the `azd env get-values` command to get the `azd` environment variables.

```bash
azd env get-values
```

Example output:

```text
AZURE_RESOURCE_GROUP="<your-resource-group-name>"
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
AZURE_TENANT_ID="<your-tenant-id>"
CONTAINER_APP_NAME="<your-container-app-name>"
CONTAINER_APP_URL="https://<your-container-app-name>.<region>.azurecontainerapps.io"
ENTRA_APP_CLIENT_CLIENT_ID="<client-app-registration-id>"
ENTRA_APP_SERVER_CLIENT_ID="<server-app-registration-id>"
```

Keep this output available. You need these values in the sections that follow.

### Grant admin consent and add the API scope

After deployment, complete two required configuration steps before clients can connect.

#### Add the API scope to the client app registration

The client app registration needs permission to call the server app's `Mcp.Tools.ReadWrite` scope.

1. In the Azure portal, search for the client app registration by using the `ENTRA_APP_CLIENT_CLIENT_ID` value.
1. Go to **API permissions** → **Add a permission** → **My APIs** tab.
1. Select the server app registration and add the `Mcp.Tools.ReadWrite` scope.
1. Select **Grant admin consent** to apply the permission to all users.

> [!NOTE]
> If the server app registration doesn't appear under **My APIs**, the app might still be propagating. Wait a few minutes and refresh, or see the [Troubleshooting](#troubleshooting) section.

#### Grant admin consent for downstream API permissions

The server app registration has Azure Resource Manager and Azure Storage API permissions configured, but these permissions require admin consent before the OBO token exchange can succeed.

1. In the [Azure portal](https://portal.azure.com), search for the server app registration by using the `ENTRA_APP_SERVER_CLIENT_ID` value.
1. Go to **API permissions**.
1. Select **Grant admin consent for \<your tenant\>** and confirm.

> [!NOTE]
> If the **Grant admin consent** button is unavailable, your account lacks sufficient permissions. This template requires an Azure subscription with **Owner** or **User Access Administrator** access.

Alternatively, use the Azure CLI:

```bash
az ad app permission admin-consent --id <ENTRA_APP_SERVER_CLIENT_ID>
```

## Connect to the server

After deploying and completing the post-deployment configuration, you can connect clients to the server. Select the option that fits your scenario.

### [C# client app](#tab/csharp)

The template includes a .NET console app in the `client/` folder that you can use to verify the deployment locally. The app authenticates interactively through the browser by using the client app registration, connects to the MCP server, lists the available tools, and optionally calls the `storage_account_get` tool.

**Prerequisites**: [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

1. In the `client/` folder, open `appsettings.json` and set the following values by using the `azd env get-values` output:

    ```json
    {
      "McpServer": {
        "Url": "<CONTAINER_APP_URL>"
      },
      "EntraClientClientId": "<ENTRA_APP_CLIENT_CLIENT_ID>",
      "SubscriptionId": "<AZURE_SUBSCRIPTION_ID>"
    }
    ```

    > [!TIP]
    > You can also create an `appsettings.Development.json` file with your local values and set the `DOTNET_ENVIRONMENT` environment variable to `Development` to load it without modifying the committed file.

1. From the `client/` folder, run the app:

    ```bash
    dotnet run
    ```

    The app opens a browser window for you to sign in. After sign-in, it connects to the MCP server and prints the list of available tools.

1. To also call the `storage_account_get` tool and list storage accounts in your subscription, pass the `--list-accounts` flag:

    ```bash
    dotnet run -- --list-accounts true
    ```

If you encounter authentication errors such as `MsalUiRequiredException`, see the [Troubleshooting](#troubleshooting) section.

### [Microsoft Foundry](#tab/foundry)

A Foundry agent connects to the Azure MCP Server by using [OAuth identity passthrough](/azure/foundry/agents/how-to/mcp-authentication#oauth-identity-passthrough). In this mode, the signed-in user's identity flows through all the way to the Azure service calls via the OBO exchange.

1. Go to your Foundry project at https://ai.azure.com/nextgen.
1. Select **Build** > **Create agent**.
1. Select **+ Add** in the tools section, and then select the **Custom** tab.
1. Select **Model Context Protocol (MCP)**, and then select **Create**.
1. Configure the MCP connection:

    | Field | Value |
    |-------|-------|
    | **Remote MCP Server endpoint** | `CONTAINER_APP_URL` from `azd` output |
    | **Authentication** | OAuth Identity Passthrough |
    | **Client ID** | `ENTRA_APP_CLIENT_CLIENT_ID` from `azd` output |
    | **Client secret** | A secret you create on the client app registration (see next step) |
    | **Token URL** | `https://login.microsoftonline.com/<AZURE_TENANT_ID>/oauth2/v2.0/token` |
    | **Auth URL** | `https://login.microsoftonline.com/<AZURE_TENANT_ID>/oauth2/v2.0/authorize` |
    | **Scope** | `<ENTRA_APP_SERVER_CLIENT_ID>/Mcp.Tools.ReadWrite` |

1. Create a client secret on the client app registration:
    - In the Azure portal, open the client app registration.
    - Go to **Manage** > **Certificates & secrets** > **New client secret**.
    - Copy the secret value and paste it into the **Client secret** field in Foundry.

1. Select **Connect**.

1. After Foundry creates the connection, copy the **Redirect URL** that appears.
1. In the Azure portal, go to the client app registration > **Manage** > **Authentication**.
1. Under **Web**, add the redirect URL as a new entry.

After you complete these steps, prompt the Foundry Agent to load the MCP tools and call them.

### [Copilot Studio](#tab/copilot-studio)

Connecting a Copilot Studio agent to this server follows the same custom connector steps as the standard Copilot Studio deployment. For the full walkthrough, see [Deploy a remote Azure MCP Server and connect to it using Copilot Studio](deploy-remote-mcp-server-copilot-studio.md).

When you follow that guide, use the output values from this template (`CONTAINER_APP_URL`, `ENTRA_APP_CLIENT_CLIENT_ID`, `ENTRA_APP_SERVER_CLIENT_ID`, `AZURE_TENANT_ID`) wherever the guide references `azd` output values. The key difference is that in the **Security** step of the custom connector, you must set **Enable on-behalf-of login** to `true` and set **Resource URL** to the `ENTRA_APP_SERVER_CLIENT_ID` value. This setting activates the OBO flow so the connector authenticates on behalf of the signed-in user.

---

## Add more Azure tools

The template enables the `storage` namespace by default. To enable additional tool namespaces:

1. Identify the API permissions required for the tools you want. See the [API permissions reference](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/azd-templates/api-permissions.md).

1. Add the permissions to the server app registration by using the Azure CLI:

    ```bash
    az ad app permission add \
      --id <ENTRA_APP_SERVER_CLIENT_ID> \
      --api <downstream-api-id> \
      --api-permissions <permission-id>=Scope
    ```

1. Grant admin consent for the new permissions:

    ```bash
    az ad app permission admin-consent --id <ENTRA_APP_SERVER_CLIENT_ID>
    ```

1. Update the Container App environment variables to pass the additional namespace flags to the server startup command.

## Clean up resources

Run `azd down` to delete the Azure resources created by this template.

```bash
azd down
```

> [!NOTE]
> `azd down` doesn't delete the Entra app registrations. After running `azd down`, manually delete them in the Azure portal by searching for the `ENTRA_APP_CLIENT_CLIENT_ID` and `ENTRA_APP_SERVER_CLIENT_ID` values.
## Troubleshooting

The following sections provide details on common errors you might encounter and how to resolve them.

**IDW10502: MsalUiRequiredException**

```text
{"status":500,"message":"IDW10502: An MsalUiRequiredException was thrown due to a challenge for the user..."}
```

The server's OBO token exchange failed because admin consent isn't granted for the downstream API permissions on the server app registration. In the Azure portal, find the server app registration (using `ENTRA_APP_SERVER_CLIENT_ID`) → **API permissions** → **Grant admin consent**.

**OBO token exchange failures**

Check the Entra sign-in logs for details. In the Azure portal, go to **Microsoft Entra ID** → **Monitoring** → **Sign-in logs** → **User sign-ins (non-interactive)**. Look for entries where the application matches your server app registration and the resource matches the downstream Azure API.

**Container App errors**

Open the Azure portal, go to your Container App → **Monitoring** → **Log stream** to view real-time application logs. Application Insights telemetry is available under **Investigate → Search** or via Log Analytics queries on the `requests` and `traces` tables.

**ServiceManagementReference error on redeploy**

```text
{"error":{"code":"BadRequest","message":"ServiceManagementReference field is required for Update..."}}
```

This error occurs when running `azd up` on an existing deployment that was originally created without a `serviceManagementReference` value. Add the parameter to `infra/main.parameters.json`:

```json
{
  "parameters": {
    "serviceManagementReference": {
      "value": "<your-guid>"
    }
  }
}
```

> [!NOTE]
> For a list of other known issues, see [KnownIssues.md](https://github.com/Azure-Samples/azmcp-obo-template/blob/main/KnownIssues.md) in the template repository.

## Related content

- [Deploy a remote Azure MCP Server and connect to it using Microsoft Foundry](deploy-remote-mcp-server-microsoft-foundry.md)
- [Deploy a remote Azure MCP Server and connect to it using Copilot Studio](deploy-remote-mcp-server-copilot-studio.md)

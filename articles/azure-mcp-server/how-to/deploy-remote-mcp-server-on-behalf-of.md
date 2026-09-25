---
title: Deploy Azure MCP Server with on-behalf-of authentication
description: Learn how to deploy Azure MCP Server to Azure Container Apps with on-behalf-of authentication so users retain their Azure permissions.
author: alexwolfmsft
ms.author: alexwolf
ms.reviewer: alexwolf
ms.date: 09/22/2026
ms.topic: how-to
ai-usage: ai-generated
---

# Deploy Azure MCP Server with on-behalf-of authentication

Deploy [Azure MCP Server](https://mcr.microsoft.com/product/azure-sdk/azure-mcp) as a self-hosted remote server over HTTPS on Azure Container Apps. This article uses the on-behalf-of (OBO) authentication model, which lets the server call Azure services by using the identity of the signed-in user rather than the server's managed identity. Agents in [Microsoft Foundry](https://azure.microsoft.com/products/ai-foundry) and [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) can connect to the deployed server and invoke read-only Azure Storage tools with the user's permissions.

## How the OBO flow works

The on-behalf-of flow is distinct from the managed identity approach used in other Azure MCP Server templates:

- **Managed identity approach**: The server authenticates to downstream Azure services by using its own managed identity. All users share the permissions granted to that identity. For a Microsoft Foundry example that uses this model, see [Deploy a remote Azure MCP Server and connect using Microsoft Foundry](deploy-remote-mcp-server-microsoft-foundry.md).
- **OBO approach**: When a user authenticates with the server, the server exchanges the user's token for a new token scoped to a downstream Azure service. The server calls Azure services *on behalf of* the user, so each user's own Azure permissions determine what they can do.

The template provisions two [Microsoft Entra](/entra/fundamentals/what-is-entra) app registrations to enable this flow:

- **Server app registration**: Exposed to clients as the OAuth 2.0 resource. When a user's token arrives, the server uses a federated identity credential backed by a managed identity as its own credential during the OBO token exchange. The resulting downstream token remains delegated to the signed-in user.
- **Client app registration**: Used by external clients, such as Foundry agents and Copilot Studio custom connectors, to authenticate against the server. The client app is preauthorized on the server app.

The OBO flow uses delegated permissions. It doesn't grant a user access that they don't already have through Azure role-based access control (RBAC) or the downstream service.

## Prerequisites

- An Azure subscription. Your account must have permission to create resources in the target resource group, such as the **Contributor** or **Owner** role.
- Permission to create app registrations in the Microsoft Entra tenant. To grant tenant-wide admin consent, you or an administrator must have at least the **Cloud Application Administrator** Microsoft Entra role. Azure subscription roles such as **Owner** don't grant this Microsoft Entra permission.
- [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd) installed.
- [Azure CLI](/cli/azure/install-azure-cli) installed.
- The list of Azure MCP Server tool namespaces you want to enable. See the [Azure MCP Server command reference](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md). The template enables the `storage` namespace in read-only mode by default.

## Deploy the Azure MCP Server

This article uses the [`azmcp-obo-template`](https://github.com/Azure-Samples/azmcp-obo-template) `azd` template to deploy Azure MCP Server to Azure Container Apps with OBO authentication.

1. Sign in to Azure with `azd` and Azure CLI. Use the tenant that hosts the app registrations.

    ```bash
    azd auth login
    az login --tenant <AZURE_TENANT_ID>
    ```

1. Initialize the template.

    ```bash
    azd init -t azmcp-obo-template
    ```

    When prompted, enter a unique environment name.

1. Run the template by using the `azd up` command.

    ```bash
    azd up
    ```

    `azd` prompts you for the following values:

    - **Subscription**: Select the subscription for the provisioned resources.
    - **Location**: Select an Azure region for the deployment.
    - **Resource group**: Create or select a resource group to hold the resources.

`azd` uses the template files to provision the following resources and configurations:

- **Azure Container App**: Runs Azure MCP Server with the `storage` namespace and the `--read-only` flag enabled. The container app has external HTTPS ingress, while Azure Container Apps terminates TLS before forwarding traffic to the container.
- **User-assigned managed identity**: Provides a credential for the server app registration through a [federated identity credential](/entra/workload-id/workload-identity-federation). This identity authenticates the server during the OBO token exchange. It doesn't replace the signed-in user's identity or permissions.
- **Microsoft Entra app registration (server)**: Exposes the `Mcp.Tools.ReadWrite` delegated scope to clients and requests delegated Azure Resource Manager and Azure Storage permissions for downstream OBO exchanges.
- **Microsoft Entra app registration (client)**: Authenticates clients such as Foundry agents and Power Apps custom connectors. The server app preauthorizes this client.
- **Application Insights**: Provides telemetry and monitoring.

### Retrieve deployment outputs

After the deployment finishes, use the `azd env get-values` command to get the `azd` environment variables.

```bash
azd env get-values
```

Example output:

```text
AZURE_RESOURCE_GROUP="<your-resource-group-name>"
AZURE_LOCATION="<your-azure-region>"
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
AZURE_TENANT_ID="<your-tenant-id>"
CONTAINER_APP_NAME="<your-container-app-name>"
CONTAINER_APP_URL="https://<your-container-app-name>.<region>.azurecontainerapps.io"
ENTRA_APP_CLIENT_CLIENT_ID="<client-app-registration-id>"
ENTRA_APP_SERVER_CLIENT_ID="<server-app-registration-id>"
CONTAINER_APP_MANAGED_IDENTITY_CLIENT_ID="<managed-identity-client-id>"
```

Keep this output available. You need these values in the sections that follow.

### Configure permissions and consent

After deployment, complete two required configuration steps before clients can connect.

#### Add the API scope to the client app registration

The client app registration needs delegated permission to call the server app's `Mcp.Tools.ReadWrite` scope.

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), go to **Entra ID** > **App registrations** > **All applications**, and search for the client app registration by using the `ENTRA_APP_CLIENT_CLIENT_ID` value.
1. Go to **API permissions** > **Add a permission** > **My APIs**.
1. Select the server app registration and add the `Mcp.Tools.ReadWrite` scope.
1. If your tenant's consent policies require it, select **Grant admin consent for \<tenant-name\>**.

> [!NOTE]
> If the server app registration doesn't appear under **My APIs**, the app might still be propagating. Wait a few minutes and refresh, or see the [Troubleshooting](#troubleshooting) section.

#### Grant admin consent for downstream API permissions

The server app registration requests delegated Azure Resource Manager and Azure Storage permissions. Grant tenant-wide admin consent before using the tools.

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for the server app registration by using the `ENTRA_APP_SERVER_CLIENT_ID` value.
1. Go to **API permissions**.
1. Select **Grant admin consent for \<your tenant\>** and confirm.

> [!IMPORTANT]
> Review every requested permission before granting consent. If the **Grant admin consent** button is unavailable, ask a Microsoft Entra administrator with at least the **Cloud Application Administrator** role to complete this step.

Alternatively, use the Azure CLI:

```bash
az ad app permission admin-consent --id <ENTRA_APP_SERVER_CLIENT_ID>
```

## Connect to the server

After deploying and completing the post-deployment configuration, you can connect clients to the server. Select the option that fits your scenario.

### [C# client app](#tab/csharp)

The template includes a .NET console app in the `client/` folder that you can use to verify the deployment locally. The app reads the server's OAuth-protected resource metadata, authenticates interactively through the browser by using the client app registration, connects over Streamable HTTP, lists the available tools, and optionally calls the `storage_account_get` tool.

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
    > You can instead add your local values to the existing `appsettings.Development.json` file and set the `DOTNET_ENVIRONMENT` environment variable to `Development`. Don't commit configuration files that contain sensitive values.

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

A Foundry agent connects to Azure MCP Server by using [OAuth identity passthrough](/azure/foundry/agents/how-to/mcp-authentication#oauth-identity-passthrough). In this mode, the signed-in user's identity flows to Azure service calls through the OBO exchange. The user's tenant must match the Foundry project tenant because cross-tenant token exchange isn't supported.

1. Go to your project in the [Foundry portal](https://ai.azure.com/build/tools).
1. Connect a tool, select **Custom**, and then select **MCP**.
1. Configure the MCP connection:

    | Field | Value |
    |-------|-------|
    | **Remote MCP Server endpoint** | `CONTAINER_APP_URL` from `azd` output |
    | **Authentication** | OAuth Identity Passthrough |
    | **Client ID** | `ENTRA_APP_CLIENT_CLIENT_ID` from `azd` output |
    | **Client secret** | A secret you create on the client app registration (see next step) |
    | **Token URL** | `https://login.microsoftonline.com/<AZURE_TENANT_ID>/oauth2/v2.0/token` |
    | **Auth URL** | `https://login.microsoftonline.com/<AZURE_TENANT_ID>/oauth2/v2.0/authorize` |
    | **Refresh URL** | `https://login.microsoftonline.com/<AZURE_TENANT_ID>/oauth2/v2.0/token` |
    | **Scopes** | `<ENTRA_APP_SERVER_CLIENT_ID>/Mcp.Tools.ReadWrite offline_access` |

1. Create a client secret on the client app registration:
    - In the Microsoft Entra admin center, open the client app registration.
    - Go to **Manage** > **Certificates & secrets** > **New client secret**.
    - Set the shortest practical expiration period, copy the secret value, and paste it into the **Client secret** field in Foundry. Store and rotate the secret according to your organization's security policy.

1. Select **Connect**.

1. After Foundry creates the connection, copy the **Redirect URL** that appears.
1. In the Microsoft Entra admin center, go to the client app registration > **Manage** > **Authentication**.
1. Under **Web**, add the redirect URL as a new entry.

After you complete these steps, prompt the Foundry Agent to load the MCP tools and call them.

### [Copilot Studio](#tab/copilot-studio)

Connecting a Copilot Studio agent to this server follows the same custom connector steps as the standard Copilot Studio deployment. For the full walkthrough, see [Deploy a remote Azure MCP Server and connect to it using Copilot Studio](deploy-remote-mcp-server-copilot-studio.md).

When you follow that guide, use the output values from this template (`CONTAINER_APP_URL`, `ENTRA_APP_CLIENT_CLIENT_ID`, `ENTRA_APP_SERVER_CLIENT_ID`, and `AZURE_TENANT_ID`) wherever the guide references `azd` output values. In the **Security** step of the custom connector:

- Set **Enable on-behalf-of login** to `true`.
- Set **Resource URL** to the `ENTRA_APP_SERVER_CLIENT_ID` value.
- Set **Scope** to `<ENTRA_APP_SERVER_CLIENT_ID>/.default`.

These settings activate the OBO flow so the connector authenticates on behalf of the signed-in user.

---

## Add more Azure tools

The template enables the `storage` namespace in read-only mode by default. To enable additional tool namespaces:

1. Confirm that the namespace supports OBO authentication, and identify its delegated API permissions in the [API permissions reference](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/azd-templates/api-permissions.md). You can't call APIs listed under **APIs without exposed API permissions** from this self-hosted OBO server.

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

1. In the downloaded template, update the `namespaces` array passed to the `acaInfrastructure` module in `infra/main.bicep`. The template supports one to three namespaces.

1. Run `azd up` again to deploy the updated configuration.

The template keeps the `--read-only` flag enabled. Remove this restriction only after you evaluate the additional risk and limit access to trusted users and agents.

## Clean up resources

Run `azd down` to delete the Azure resources created by this template.

```bash
azd down
```

> [!NOTE]
> `azd down` doesn't delete the Microsoft Entra app registrations. After running `azd down`, manually delete them in the Microsoft Entra admin center by searching for the `ENTRA_APP_CLIENT_CLIENT_ID` and `ENTRA_APP_SERVER_CLIENT_ID` values. Also remove any Foundry connection, client secret, Copilot Studio agent, custom connector, and Power Platform connection that you created.

## Troubleshooting

The following sections provide details on common errors you might encounter and how to resolve them.

### IDW10502: MsalUiRequiredException

```text
{"status":500,"message":"IDW10502: An MsalUiRequiredException was thrown due to a challenge for the user..."}
```

The server's OBO token exchange failed because consent isn't granted for the downstream API permissions on the server app registration. In the Microsoft Entra admin center, find the server app registration by using `ENTRA_APP_SERVER_CLIENT_ID`. Then select **API permissions** > **Grant admin consent**.

### OBO token exchange failures

Check the Microsoft Entra sign-in logs for details. In the Microsoft Entra admin center, go to **Entra ID** > **Monitoring & health** > **Sign-in logs** > **User sign-ins (non-interactive)**. Look for entries where the application matches your server app registration and the resource matches the downstream Azure API.

### Container app errors

In the Azure portal, go to your container app > **Monitoring** > **Log stream** to view real-time application logs. Application Insights telemetry is available under **Investigate** > **Search** or through Log Analytics queries on the `requests` and `traces` tables.

### ServiceManagementReference error on redeploy

```text
{"error":{"code":"BadRequest","message":"ServiceManagementReference field is required for Update..."}}
```

This error occurs when you run `azd up` on an existing deployment that you created without a `serviceManagementReference` value. Add a valid GUID to `infra/main.parameters.json`:

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

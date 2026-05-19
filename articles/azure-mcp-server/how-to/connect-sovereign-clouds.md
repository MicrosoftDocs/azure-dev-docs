---
title: Connect Azure MCP Server to sovereign clouds
description: Learn how to configure Azure MCP Server for Azure operated by 21Vianet Cloud and Azure US Government.
ms.topic: how-to
ms.date: 03/24/2026
ai-usage: ai-generated
---

# Connect Azure MCP Server to sovereign clouds

This article shows you how to configure Azure MCP Server to authenticate against a sovereign cloud instead of the Azure public cloud. For example, use these steps when your subscription is in Azure US Government or Azure operated by 21Vianet Cloud (Azure in China), or when you need to provide a custom authority host. For more background about Azure sovereign cloud offerings, see [What are sovereign clouds?](/industry/sovereign-cloud/).

## Prerequisites

- Access to an Azure subscription in Azure US Government or Azure in China.
- A client or local setup that can start Azure MCP Server. For setup options, see [Get started with the Azure MCP Server](../get-started.md).
- At least one supported local authentication tool, such as [Azure CLI](/cli/azure/install-azure-cli), [Azure PowerShell](/powershell/azure/install-az-ps), or [Azure Developer CLI](../../azure-developer-cli/install-azd.md).

## Supported sovereign clouds

Azure MCP Server recognizes the following cloud names and maps them to the correct Microsoft Entra authority host.

| Cloud | Authority host | Supported aliases |
| --- | --- | --- |
| Azure Public Cloud | `https://login.microsoftonline.com` | `AzureCloud`, `AzurePublicCloud`, `Public`, `AzurePublic` |
| Azure US Government | `https://login.microsoftonline.us` | `AzureUSGovernment`, `USGov`, `AzureUSGovernmentCloud`, `USGovernment` |
| Azure in China | `https://login.chinacloudapi.cn` | `AzureChinaCloud`, `China`, `AzureChina` |

Aliases are case-insensitive.

## Configure the cloud for Azure MCP Server

You can set the cloud either in the server arguments or through configuration. If you specify the cloud in more than one place, Azure MCP Server resolves the value in this order.

| Priority | Source | Setting |
| --- | --- | --- |
| 1 | Command line | `--cloud` |
| 2 | .NET configuration providers | `AZURE_CLOUD`, `azure_cloud`, `cloud`, `Cloud` |
| 3 | Environment variable fallback | `AZURE_CLOUD` |
| Default | Fallback | `AzurePublicCloud` |

### Configure using a server argument

If your MCP client starts Azure MCP Server for you, add `--cloud` to the server arguments.

```json
{
  "servers": {
    "Azure MCP Server": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure/mcp@latest",
        "server",
        "start",
        "--cloud",
        "AzureUSGovernment"
      ]
    }
  }
}
```

Replace `AzureUSGovernment` with `AzureChinaCloud` when you connect to the Azure in China.

### Configure using environment variables

If you start Azure MCP Server from a shell, or if your MCP client supports environment variables, set `AZURE_CLOUD` with the appropriate value before starting the server.

#### [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLOUD = "AzureUSGovernment"
azmcp server start
```

#### [Bash](#tab/bash)

```bash
export AZURE_CLOUD=AzureUSGovernment
azmcp server start
```

#### [Windows Command Prompt](#tab/cmd)

```cmd
set AZURE_CLOUD=AzureUSGovernment
azmcp server start
```

---

## Authenticate your local tools to the same cloud

Before you start Azure MCP Server, sign in to the same sovereign cloud in the local tools that Azure MCP Server can use for authentication.

### [Azure CLI](#tab/azure-cli)

Use Azure CLI when your workflow relies on `az login` or the Azure CLI credential.

```bash
az cloud set --name AzureUSGovernment
az login
```

For Azure in China, replace `AzureUSGovernment` with `AzureChinaCloud`.

### [Azure PowerShell](#tab/azure-powershell)

Use Azure PowerShell when your workflow relies on the Azure PowerShell credential.

```powershell
Connect-AzAccount -Environment AzureUSGovernment
```

For Azure in China, replace `AzureUSGovernment` with `AzureChinaCloud`.

### [Azure Developer CLI](#tab/azure-developer-cli)

Use Azure Developer CLI when your workflow relies on `azd auth login` or Azure Developer CLI credentials.

```bash
azd config set cloud.name AzureUSGovernment
azd auth login
```

For Azure in China, replace `AzureUSGovernment` with `AzureChinaCloud`.

---

## Configure a self-hosted remote server

If you deploy Azure MCP Server as a remote MCP server, make sure the host environment is configured for the target sovereign cloud before you publish the endpoint.

Set these environment variables on the host or container:

- `AZURE_CLOUD`.
- `AzureAd__ClientCredentials__0__TokenExchangeUrl`.

If you use one of the Microsoft-provided Azure Container Apps templates, this value is set for you. The template derives the correct value from the target cloud before it publishes the remote endpoint. For examples, see the [Foundry managed identity template](https://github.com/Azure-Samples/azmcp-foundry-aca-mi), the [Copilot Studio managed identity template](https://github.com/Azure-Samples/azmcp-copilot-studio-aca-mi), and the [on-behalf-of template](https://github.com/Azure-Samples/azmcp-obo-template).

If you configure the remote server manually, set `AzureAd__ClientCredentials__0__TokenExchangeUrl` to the token exchange audience for your cloud:

| Cloud | Value |
| --- | --- |
| Azure Public Cloud | `api://AzureADTokenExchange` |
| Azure US Government | `api://AzureADTokenExchangeUSGov` |
| Azure in China | `api://AzureADTokenExchangeChina` |

For template-based deployments, review the upstream [Azure MCP Server azd templates](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server/azd-templates) if you want to confirm the generated host or container settings before you publish the remote endpoint.

## Verify the connection

1. Restart your MCP client after you change the cloud configuration.

1. Run a simple prompt that requires Azure context, such as `List my resource groups`.

1. If the request fails, verify that your local tools are authenticated to the same sovereign cloud and tenant as the Azure subscription you want to use.

## Troubleshoot sovereign cloud configuration

If authentication or discovery fails, start with these checks.

1. Verify the cloud configuration. Confirm that the cloud name or authority host is correct.

1. Check local authentication. Make sure you authenticated the local toolchain to the correct cloud.

1. Verify the tenant. Confirm that the tenant belongs to the sovereign cloud subscription you want to use. For example, run `az account show --query tenantId -o tsv`.

1. Check network connectivity. Confirm that you can reach the correct authority host for your cloud.

   - Azure US Government: `https://login.microsoftonline.us`
   - Azure in China: `https://login.chinacloudapi.cn`

1. For remote deployments, confirm that both `AZURE_CLOUD` and `AzureAd__ClientCredentials__0__TokenExchangeUrl` are set correctly.

### Common error messages

Use the following table to map common failures to likely causes.

| Error | Likely cause | Resolution |
| --- | --- | --- |
| `Authentication failed` | Your local tool is still signed in to the wrong cloud, or not signed in at all. | Reauthenticate with the correct cloud by using `az login`, `Connect-AzAccount`, or `azd auth login`. |
| `Cannot connect to authority host` | The cloud value or custom authority host URL is invalid, or the endpoint is unreachable. | Verify the cloud name, custom authority host, and network connectivity. |
| `Invalid tenant` | The tenant doesn't match the sovereign cloud subscription. | Confirm the tenant ID and sign in again with the correct tenant and cloud. |
| `The primary access token is from the wrong issuer` | The token was issued for a different tenant than the subscription expects. | Check the active tenant, then restart the client and Azure MCP Server after switching to the correct tenant. |

### Verify the effective configuration

If the problem persists, start the server with debug logging and confirm that Azure MCP Server is using the expected authority host.

```bash
azmcp server start --cloud AzureUSGovernment --log-level Debug
```

The debug output should show the authority host being used for authentication.

### Additional checks for enterprise environments

If you work behind enterprise network controls, also verify the following items.

- Firewall or proxy rules are not blocking outbound traffic to the sovereign cloud authority host and Azure Resource Manager endpoint.
- The correct account is being selected when multiple credentials are available.
- Private endpoint resources are reachable through VPN, ExpressRoute, or another approved network path.

If you still have problems, see the Azure MCP Server [troubleshooting guide](https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/TROUBLESHOOTING.md#sovereign-cloud-support).

## Related content

- [Get started with the Azure MCP Server](../get-started.md)
- [Azure MCP Server overview](../overview.md)
- [Deploy a self-hosted remote Azure MCP Server and connect to it using Copilot Studio](deploy-remote-mcp-server-copilot-studio.md)
- [Deploy a self-hosted remote Azure MCP Server and connect to it using Microsoft Foundry](deploy-remote-mcp-server-microsoft-foundry.md)

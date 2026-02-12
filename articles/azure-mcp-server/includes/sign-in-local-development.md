---
ms.topic: include
ms.date: 02/12/2026
---
## Sign in to Azure MCP Server for local development

Azure MCP Server authenticates to [Microsoft Entra ID](/entra/identity/) using the [Azure Identity library for .NET](/dotnet/azure/sdk/authentication/). The server supports two authentication modes:

- **Broker mode**: Uses your operating system's native authentication (like Windows Web Account Manager) with `InteractiveBrowserCredential`.
- **Credential chain mode**: Tries multiple authentication methods in sequence: environment variables, Visual Studio Code, Visual Studio, Azure CLI, Azure PowerShell, Azure Developer CLI, and interactive browser authentication.

Sign in using any of these methods:

### [Visual Studio Code](#tab/visual-studio-code)
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
1. Run **Azure: Sign In** and follow the prompts.

### [Visual Studio](#tab/visual-studio)

1. Go to **File > Account Settings**.
1. Select **Add an account** and follow the prompts.

### [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

### [Azure Developer CLI](#tab/azure-developer-cli)

```azdeveloper
azd auth login
```

---

After signing in, Azure MCP Server can authenticate and run operations on Azure services based on your permissions.

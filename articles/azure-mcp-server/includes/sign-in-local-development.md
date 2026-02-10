---
ms.topic: include
ms.date: 02/10/2026
---
## Sign in for local development

Azure MCP Server provides a seamless authentication experience by using token-based authentication through [Microsoft Entra ID](/entra/identity/). Internally, Azure MCP Server uses [`DefaultAzureCredential`](/azure/developer/intro/passwordless-overview#introducing-defaultazurecredential) from [Azure Identity](/azure/developer/intro/passwordless-overview) to authenticate users.

To work with Azure MCP Server, you need to sign in locally to one of the tools supported by `DefaultAzureCredential` by using your Azure account. Sign in by using a terminal window, such as the Visual Studio Code terminal:

## [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

## [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

## [Azure Developer CLI](#tab/azure-developer-cli)

```azdeveloper
azd auth login
```

---

After you sign in successfully to one of the preceding tools, Azure MCP Server can automatically discover your credentials and use them to authenticate and perform operations on Azure services.

> [!NOTE]
> You can also sign in to Azure through Visual Studio.
> Azure MCP Server can only run operations that the signed-in user has permission to perform.

## Sign-in for local development

The Azure MCP Server provides a seamless authentication experience using token-based authentication via Microsoft Entra ID. Internally, Azure MCP Server uses [`DefaultAzureCredential`](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac) from the [Azure Identity library](/dotnet/api/overview/azure/identity-readme?view=azure-dotnet&preserve-view=true) to authenticate users.

You'll need to sign-in to one of the tools supported by `DefaultAzureCredential` locally with your Azure account to work with Azure MCP Server. Sign-in using a terminal window, such as the Visual Studio Code terminal:

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

Once you have signed-in successfully to one of the preceding tools, Azure MCP Server can automatically discover your credentials and use them to authenticate and perform operations on Azure services.

> [!NOTE]
> You can also sign-in to Azure through Visual Studio.
> Azure MCP Server is only able to run operations that the signed-in user has permissions to perform.

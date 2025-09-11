---
author: alexwolfmsft
ms.service: azure
ms.topic: include
ms.author: alexwolf
ms.date: 08/11/2025
---

## Authenticate to Azure

Azure MCP Server provides a seamless authentication experience using Azure accounts and Microsoft Entra ID. To use Azure MCP Server, you must first authenticate to Azure using local development tools such as the Azure CLI, Azure Developer CLI, Visual Studio, or Visual Studio Code. Azure MCP Server automatically discovers your credentials from these tools and uses them to authenticate to Azure services.

1. For example, to sign in using the Azure CLI:

    ```azurecli
    az login
    ```

2. Verify your authentication status by running the following command to see which account and subscription you're currently signed in with:

    ```azurecli
    az account show
    ```

3. Ensure your user account has the appropriate role assignments for the Azure services you want to interact with. The Azure resources you intend to access with Azure MCP Server must already exist within your Azure subscription. For example, common role assignments include:

    - **Blob Storage Data Contributor** - Read and write blob data in storage accounts.
    - **Storage Account Contributor** - Manage storage account configurations.
    - **Contributor** - General resource management across your subscription.
    - **Reader** - Read-only access to Azure resources.

    For more information about role assignments and local development authentication, see [Authenticate .NET apps to Azure services during local development](/dotnet/azure/sdk/authentication/local-development-dev-accounts).

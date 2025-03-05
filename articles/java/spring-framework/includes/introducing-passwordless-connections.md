---
ms.date: 11/16/2022
author: KarlErickson
ms.author: karler
ms.reviewer: seal
---

### Introducing passwordless connections

With a passwordless connection, you can connect to Azure services without storing any credentials in the application code, its configuration files, or in environment variables.

Many Azure services support passwordless connections, for example via Azure Managed Identity. These techniques provide robust security features that you can implement using [DefaultAzureCredential](/java/api/overview/azure/Identity-readme#defaultazurecredential) from the Azure Identity client libraries. In this tutorial, you'll learn how to update an existing application to use `DefaultAzureCredential` instead of alternatives such as connection strings.

`DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` searches for credentials can be found in the [Azure Identity library overview](/java/api/overview/azure/Identity-readme#defaultazurecredential). For example, when working locally, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign in to Visual Studio. When the app is deployed to Azure, `DefaultAzureCredential` will automatically switch to use a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview). No code changes are required for this transition.

To ensure that connections are passwordless, you must take into consideration both local development and the production environment. If a connection string is required in either place, then the application isn't passwordless.

In your local development environment, you can authenticate with Azure CLI, Azure PowerShell, Visual Studio, or Azure plugins for Visual Studio Code or IntelliJ. In this case, you can use that credential in your application instead of configuring properties.

When you deploy applications to an Azure hosting environment, such as a virtual machine, you can assign managed identity in that environment. Then, you won't need to provide credentials to connect to Azure services.

> [!NOTE]
> A managed identity provides a security identity to represent an app or service. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. You can read more about managed identities in the [overview](/azure/active-directory/managed-identities-azure-resources/overview) documentation.

---
title: Passwordless connections for Azure services
description: Describes the security challenges with passwords and introduces passwordless connections for Azure services.
ms.topic: overview
ms.date: 04/25/2025
ms.author: alexwolf
author: alexwolfmsft
ms.service: azure
ms.custom: devx-track-java, devx-track-javaee, passwordless-dotnet, passwordless-go, passwordless-java, passwordless-js, passwordless-python
---

# Passwordless connections for Azure services

> [!NOTE]
> Passwordless connections is a language-agnostic feature spanning multiple Azure services. Although the current documentation focuses on a few languages and services, we're currently in the process of producing additional documentation for other languages and services.

This article describes the security challenges with passwords and introduces passwordless connections for Azure services.

## Security challenges with passwords and secrets

Passwords and secret keys should be used with caution, and developers must never place them in an unsecure location. Many apps connect to backend database, cache, messaging, and eventing services using usernames, passwords, and access keys. If exposed, these credentials could be used to gain unauthorized access to sensitive information such as a sales catalog that you built for an upcoming campaign, or customer data that must be private.

Embedding passwords in an application itself presents a huge security risk for many reasons, including discovery through a code repository. Many developers externalize such passwords using environment variables so that applications can load them from different environments. However, this only shifts the risk from the code itself to an execution environment. Anyone who gains access to the environment can steal passwords, which in turn, increases your data exfiltration risk.

The following code example demonstrates how to connect to Azure Storage using a storage account key. Many developers gravitate towards this solution because it feels familiar to options they've worked with in the past, even though it isn't an ideal solution. If your application currently uses access keys, consider migrating to passwordless connections.

```csharp
// Connection using secret access keys
BlobServiceClient blobServiceClient = new(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

Developers must be diligent to never expose these types of keys or secrets in an unsecure location. Many companies have strict security requirements to connect to Azure services without exposing passwords to developers, operators, or anyone else. They often use a vault to store and load passwords into applications, and further reduce the risk by adding password-rotation requirements and procedures. This approach, in turn, increases the operational complexity and, at times, leads to application connection outages.

## Passwordless connections and Zero Trust

You can now use passwordless connections in your apps to connect to Azure-based services without any need to rotate passwords. In some cases, all you need is configuration&mdash;no new code is required. Zero Trust uses the principle of "never trust, always verify, and credential-free". This means securing all communications by trusting machines or users only after verifying identity and prior to granting them access to backend services.

The recommended authentication option for secure, passwordless connections is to use managed identities and Azure role-based access control (RBAC) in combination. With this approach, you don't have to manually track and manage many different secrets for managed identities because these tasks are securely handled internally by Azure.

You can configure passwordless connections to Azure services using Service Connector or you can configure them manually. Service Connector enables managed identities in app hosting services like Azure Spring Apps, Azure App Service, and Azure Container Apps. Service Connector also configures backend services with passwordless connections using managed identities and Azure RBAC, and hydrates applications with necessary connection information.

If you inspect the running environment of an application configured for passwordless connections, you can see the full connection string. The connection string carries, for example, a database server address, a database name, and an instruction to delegate authentication to an Azure authentication plugin, but it doesn't contain any passwords or secrets.

The following video illustrates passwordless connections from apps to Azure services, using Java applications as an example. Similar coverage for other languages is forthcoming.

<br>

> [!VIDEO https://www.youtube.com/embed/X6nR3AjIwJw]

## Introducing DefaultAzureCredential

Passwordless connections to Azure services through Microsoft Entra ID and Role Based Access control (RBAC) can be implemented using `DefaultAzureCredential` from the Azure Identity client libraries.

> [!IMPORTANT]
> Some languages must implement `DefaultAzureCredential` explicitly in their code, while others utilize `DefaultAzureCredential` internally through underlying plugins or drivers.

`DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` searches for credentials varies between languages:

- [.NET](/dotnet/api/overview/azure/Identity-readme?view=azure-dotnet&preserve-view=true#defaultazurecredential)
- [C++](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity#defaultazurecredential)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-defaultazurecredential)
- [Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#defaultazurecredential)
- [JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true#defaultazurecredential)
- [Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#defaultazurecredential)

For example, when working locally with .NET, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio, Azure CLI, or Azure PowerShell. When the app is deployed to Azure, `DefaultAzureCredential` will automatically discover and use the [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) of the associated hosting service, such as Azure App Service. No code changes are required for this transition.

> [!NOTE]
> A managed identity provides a security identity to represent an app or service. The identity is managed by the Azure platform and doesn't require you to provision or rotate secrets. You can read more about managed identities in the [overview](/azure/active-directory/managed-identities-azure-resources/overview) documentation.

The following code example demonstrates how to connect to Service Bus using passwordless connections. Other documentation describes how to migrate to this setup for a specific service in more detail. A .NET app can pass an instance of `DefaultAzureCredential` into the constructor of a service client class. `DefaultAzureCredential` will automatically discover the credentials that are available in that environment.

```csharp
ServiceBusClient serviceBusClient = new(
    new Uri("https://<your-service-bus-namespace>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

## See also

For a more detailed explanation of passwordless connections, see the developer guide [Configure passwordless connections between multiple Azure apps and services](/azure/storage/common/multiple-identity-scenarios?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json).

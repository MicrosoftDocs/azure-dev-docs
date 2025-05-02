---
title: 'Overview: Authenticate C++ apps to Azure using the Azure SDK'
description: This article provides an overview of how to authenticate applications to Azure services when you use the Azure SDK for C++ in both server environments and in local development.
author: ronniegeraghty
ms.author: rgeraghty
ms.topic: overview
ms.date: 3/11/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.
---

# Authenticate C++ apps to Azure services by using the Azure SDK for C++

When an app needs to access an Azure resource like Azure Storage, Azure Key Vault, or Azure Messaging services, the app must be authenticated to Azure. This requirement is true for all apps, whether they're deployed to Azure, deployed on-premises, or under development on a local developer workstation. This article describes the recommended approaches to authenticate an app to Azure when you use the Azure SDK for C++.

## Recommended app authentication approach

Use token-based authentication rather than connection strings for your apps when they authenticate to Azure resources. The [Azure Identity client library for C++](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) provides classes that support token-based authentication. These classes allow apps to seamlessly authenticate to Azure resources whether the app is in local development, deployed to Azure, or deployed to an on-premises server.

The specific type of token-based authentication an app uses to authenticate to Azure resources depends on where the app is being run. The types of token-based authentication are shown in the following diagram.

:::image type="content" source="../media/cpp-sdk-auth-strategy.png" alt-text="A diagram that shows the recommended token-based authentication strategies for an app depending on where it's running." :::

- **When a developer is running an app during local development:** The app authenticates to Azure by using either an application service principal for local development or the developer's Azure credentials. These options are discussed in the section [Authentication during local development](#authentication-during-local-development).
- **When an app is hosted on Azure:** The app authenticates to Azure resources by using a managed identity. This option is discussed in the section [Authentication in server environments](#authentication-in-server-environments).
- **When an app is hosted and deployed on-premises:** The app authenticates to Azure resources by using an application service principal. This option is discussed in the section [Authentication in server environments](#authentication-in-server-environments).

### DefaultAzureCredential

The [DefaultAzureCredential](#use-defaultazurecredential-in-an-application) class provided by the Azure Identity client library allows apps to use different authentication methods depending on the environment in which they're run. In this way, apps can be promoted from local development to test environments to production without code changes.

You configure the appropriate authentication method for each environment, and `DefaultAzureCredential` automatically detects and uses that authentication method. The use of `DefaultAzureCredential` is preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

Details about using the `DefaultAzureCredential` class are discussed in the section [Use DefaultAzureCredential in an application](#use-defaultazurecredential-in-an-application).

### Advantages of token-based authentication

Use token-based authentication instead of using connection strings when you build apps for Azure. Token-based authentication offers the following advantages over authenticating with connection strings:

- The token-based authentication methods described in this article allow you to establish the specific permissions needed by the app on the Azure resource. This practice follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- Anyone or any app with a connection string can connect to an Azure resource, but token-based authentication methods scope access to the resource to only the apps intended to access the resource.
- With a managed identity, there's no application secret to store. The app is more secure because there's no connection string or application secret that can be compromised.
- The [azure-identity](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package acquires and manages Microsoft Entra tokens for you, making using token-based authentication as easy to use as a connection string.

Limit the use of connection strings to initial proof-of-concept apps or development prototypes that don't access production or sensitive data. Otherwise, the token-based authentication classes available in the Azure Identity client library are always preferred when they're authenticating to Azure resources.

## Authentication in server environments

When you're hosting in a server environment, each app is assigned a unique *application identity* per environment where the app runs. In Azure, an application identity is represented by a *service principal*. This special type of security principal identifies and authenticates apps to Azure. The type of service principal to use for your app depends on where your app is running:

| Authentication method | Description |
|-----------------------|-------------|
| Apps hosted in Azure  | [!INCLUDE [sdk-auth-overview-managed-identity](../includes/sdk-auth-overview-managed-identity.md)]            |
| Apps hosted outside of Azure<br>(for example, on-premises apps) | [!INCLUDE [sdk-auth-overview-service-principal](../includes/sdk-auth-overview-service-principal.md)] |

## Authentication during local development

When an app runs on a developer's workstation during local development, it still must authenticate to any Azure services used by the app. There are two main strategies for authenticating apps to Azure during local development:

| Authentication method | Description |
|-----------------------|-------------|
| Create dedicated application service principal objects to be used during local development. | [!INCLUDE [sdk-auth-overview-dev-service-principals](../includes/sdk-auth-overview-dev-service-principals.md)] |
| Authenticate the app to Azure by using the developer's credentials during local development. | [!INCLUDE [sdk-auth-overview-dev-accounts](../includes/sdk-auth-overview-dev-accounts.md)] |

## Use DefaultAzureCredential in an application

[DefaultAzureCredential](./credential-chains.md#defaultazurecredential-overview) is an opinionated, ordered sequence of mechanisms for authenticating to Microsoft Entra ID. Each authentication mechanism is a class that implements the [TokenCredential](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_credentials_1_1_token_credential.html) protocol and is known as a *credential*. At runtime, `DefaultAzureCredential` attempts to authenticate using the first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. In this way, your app can use different credentials in different environments without writing environment-specific code.

To use `DefaultAzureCredential` in a C++ app, add the [azure-identity](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

```bash
vcpkg add port azure-identity-cpp
```

Then, add the following in your CMake file:

```cmake
find_package(azure-identity-cpp CONFIG REQUIRED)
target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. The following code example shows how to instantiate a `DefaultAzureCredential` object and use it with an Azure SDK client class. In this case, it's a `SecretClient` object used to access Azure KeyVault Secrets.

```cpp
#include <azure/identity.hpp>
#include <azure/keyvault/secrets.hpp>

int main(){
  
  auto const keyVaultUrl = std::getenv("AZURE_KEYVAULT_URL");
  auto credential = std::make_shared<Azure::Identity::DefaultAzureCredential>();

  
  Azure::Security::KeyVault::Secrets::SecretClient secretClient(keyVaultUrl, credential);
}
```

When the preceding code runs on your local development workstation, it looks in the environment variables for an application service principal or at locally installed developer tools, such as the Azure CLI, for a set of developer credentials. Either approach can be used to authenticate the app to Azure resources during local development.

When deployed to Azure, this same code can also authenticate your app to Azure resources. `DefaultAzureCredential` can retrieve environment settings and managed identity configurations to authenticate to Azure services automatically.

## Related content

- [Azure Identity client library for C++ README on GitHub](https://github.com/Azure/azure-sdk-for-cpp/blob/main/sdk/identity/azure-identity/README.md)
---
title: Authenticate C++ Apps to Azure Using the Azure SDK
description: This article provides an overview of how to authenticate applications to Azure services when you use the Azure SDK for C++ in both server environments and in local development.
ms.topic: overview
ms.date: 11/06/2025
ms.custom: devx-track-cpp
ai-usage: ai-assisted

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.
---

# Authenticate C++ apps to Azure services using the Azure Identity library

Apps can use the Azure Identity library to authenticate to Microsoft Entra ID, which allows the apps to access Azure services and resources. This authentication requirement applies whether the app is deployed to Azure, hosted on-premises, or running locally on a developer workstation. The sections ahead describe the recommended approaches to authenticate an app to Microsoft Entra ID across different environments when using the Azure SDK client libraries.

## Recommended approach for app authentication

Token-based authentication via Microsoft Entra ID is the recommended approach for authenticating apps to Azure, instead of using connection strings or key-based options. The [Azure Identity client library for C++](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) provides token-based authentication and allows apps to authenticate to Azure resources whether the app runs locally, on Azure, or on an on-premises server.

### Advantages of token-based authentication

Token-based authentication offers the following advantages over connection strings:

- Token-based authentication ensures only the specific apps intended to access the Azure resource are able to do so, whereas anyone or any app with a connection string can connect to an Azure resource.
- Token-based authentication allows you to further limit Azure resource access to only the specific permissions needed by the app. This follows the [principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- When using a [managed identity](/entra/identity/managed-identities-azure-resources/overview) for token-based authentication, Azure handles administrative functions for you, so you don't have to worry about tasks like securing or rotating secrets. This makes the app more secure because there's no connection string or application secret that can be compromised.
- The Azure Identity library acquires and manages Microsoft Entra tokens for you.

Use of connection strings should be limited to scenarios where token-based authentication isn't an option, initial proof-of-concept apps, or development prototypes that don't access production or sensitive data. When possible, use the credential types in the Azure Identity library to authenticate to Azure resources.

## Authentication across different environments

The specific type of token-based authentication an app should use to authenticate to Azure resources depends on where the app runs. The following diagram provides guidance for different scenarios and environments:

:::image type="content" source="../media/authentication-environments.svg" alt-text="A diagram that shows the recommended token-based authentication strategies for an app depending on where it's running." :::

When an app is:

- **Hosted on Azure**: The app should authenticate to Azure resources using a managed identity. This option is discussed in more detail at [authentication for Azure-hosted apps](#authentication-for-azure-hosted-apps).
- **Running locally during development**: The app can authenticate to Azure using either an application service principal for local development or by using the developer's Azure credentials. Each option is discussed in more detail at [authentication during local development](#authentication-during-local-development).
- **Hosted on-premises**: The app should authenticate to Azure resources using an application service principal, or a managed identity in the case of Azure Arc. On-premises workflows are discussed in more detail at [authentication for apps hosted on-premises](#authentication-for-apps-hosted-on-premises).

## Authentication for Azure-hosted apps

When your app is hosted on Azure, it can use managed identities to authenticate to Azure resources without needing to manage any credentials. There are two types of managed identities: user-assigned and system-assigned.

#### Use a user-assigned managed identity

A user-assigned managed identity is created as a standalone Azure resource. It can be assigned to one or more Azure resources, allowing those resources to share the same identity and permissions. To authenticate using a user-assigned managed identity, create the identity, assign it to your Azure resource, and then configure your app to use this identity for authentication by specifying its client ID, resource ID, or object ID.

> [!div class="nextstepaction"]
> [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)

#### Use a system-assigned managed identity

A system-assigned managed identity is enabled directly on an Azure resource. The identity is tied to the lifecycle of that resource and is automatically deleted when the resource is deleted. To authenticate using a system-assigned managed identity, enable the identity on your Azure resource and then configure your app to use this identity for authentication.

> [!div class="nextstepaction"]
> [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)

## Authentication during local development

During local development, you can authenticate to Azure resources using your developer credentials or a service principal. This allows you to test your app's authentication logic without deploying it to Azure.

#### Use developer credentials

You can use your own Azure credentials to authenticate to Azure resources during local development. This is typically done using a development tool, such as Azure CLI, which can provide your app with the necessary tokens to access Azure services. This method is convenient but should only be used for development purposes.

> [!div class="nextstepaction"]
> [Authenticate locally using developer credentials](local-development-dev-accounts.md)

#### Use a service principal

A service principal is created in a Microsoft Entra tenant to represent an app and be used to authenticate to Azure resources. You can configure your app to use service principal credentials during local development. This method is more secure than using developer credentials and is closer to how your app authenticates in production. However, it's still less ideal than using a managed identity due to the need for secrets.

> [!div class="nextstepaction"]
> [Authenticate locally using a service principal](local-development-service-principal.md)

## Authentication for apps hosted on-premises

For apps hosted on-premises, you can use a service principal to authenticate to Azure resources. This involves creating a service principal in Microsoft Entra ID, assigning it the necessary permissions, and configuring your app to use its credentials. This method allows your on-premises app to securely access Azure services.

> [!div class="nextstepaction"]
> [Authenticate your on-prem app using a service principal](local-development-service-principal.md)

### DefaultAzureCredential

The [DefaultAzureCredential](./credential-chains.md#defaultazurecredential-overview) class provided by the Azure Identity client library allows apps to use different authentication methods depending on the environment in which they're run. In this way, apps can be promoted from local development to test environments to production without code changes.

You configure the appropriate authentication method for each environment, and `DefaultAzureCredential` automatically detects and uses that authentication method. The use of `DefaultAzureCredential` is preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

`DefaultAzureCredential` is an opinionated, ordered sequence of mechanisms for authenticating to Microsoft Entra ID. Each authentication mechanism is a class that implements the [TokenCredential](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_credentials_1_1_token_credential.html) protocol and is known as a *credential*. At runtime, `DefaultAzureCredential` attempts to authenticate using the first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained.

To use `DefaultAzureCredential` in a C++ app, add the [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

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
- [Azure Identity client library reference on GitHub](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-identity/latest/)
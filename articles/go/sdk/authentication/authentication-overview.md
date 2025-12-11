---
title: Authenticate Go apps to Azure using the Azure Identity library
description: This article provides an overview of how to authenticate applications to Azure services when you use the Azure SDK for Go in both server environments and in local development.
ms.date: 12/04/2025
ms.topic: overview
ms.custom: devx-track-go
---

# Authenticate Go apps to Azure services by using the Azure Identity library

Apps can use the Azure Identity library to authenticate to Microsoft Entra ID, which grants access to Azure services and resources. This authentication requirement applies whether the app is deployed to Azure, hosted on-premises, or running locally on a developer workstation. The following sections describe the recommended approaches to authenticate an app to Microsoft Entra ID across different environments when using the Azure SDK client libraries.

## Recommended approach for app authentication

Token-based authentication through Microsoft Entra ID is the recommended approach for authenticating apps to Azure, instead of using connection strings or key-based options. The [Azure Identity client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) provides token-based authentication and enables apps to authenticate to Azure resources whether the app runs locally, on Azure, or on an on-premises server.

### Advantages of token-based authentication

Token-based authentication offers the following advantages over connection strings:

- Token-based authentication ensures only the specific apps intended to access the Azure resource can do so, whereas anyone or any app with a connection string can connect to an Azure resource.
- Token-based authentication allows you to further limit Azure resource access to only the specific permissions needed by the app. This approach follows the [principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- When using a [managed identity](/entra/identity/managed-identities-azure-resources/overview) for token-based authentication, Azure handles administrative functions for you, so you don't have to worry about tasks like securing or rotating secrets. This feature makes the app more secure because there's no connection string or application secret that can be compromised.
- Connection strings are functionally equivalent to credentials and require special handling to prevent accidental leakage. You must store them securely (for example, in Azure Key Vault) and never hardcode them in your application or commit them to source control. The [Microsoft Secure Future Initiative (SFI)](https://www.microsoft.com/microsoft-cloud/resources/secure-future-initiative) prohibits the use of connection strings and similar long-lived secrets because they can be used to compromise your application if not carefully managed.
- The Azure Identity library acquires and manages Microsoft Entra tokens for you.

Limit the use of connection strings to scenarios where token-based authentication isn't an option, initial proof-of-concept apps, or development prototypes that don't access production or sensitive data. When possible, use the credential types in the Azure Identity library to authenticate to Azure resources.

## Authentication across different environments

The type of token-based authentication an app uses to authenticate to Azure resources depends on where the app runs. The following diagram provides guidance for different scenarios and environments:

:::image type="content" source="../media/authentication-environments.svg" alt-text="A diagram that shows the recommended token-based authentication strategies for an app depending on where it's running." :::

When an app is:

- **Hosted on Azure**: The app should authenticate to Azure resources by using a managed identity. For more information, see [authentication in server environments](#authentication-for-azure-hosted-apps).
- **Running locally during development**: The app can authenticate to Azure by using either an application service principal for local development or the developer's Azure credentials. For more information, see [authentication during local development](#authentication-during-local-development).
- **Hosted on-premises**: The app should authenticate to Azure resources by using an application service principal or, in the case of Azure Arc, a managed identity. For more information, see [authentication in server environments](#authentication-for-apps-hosted-on-premises).

## Authentication for Azure-hosted apps

When you host your app on Azure, it can use managed identities to authenticate to Azure resources without needing to manage any credentials. There are two types of managed identities: user-assigned and system-assigned.

#### Use a user-assigned managed identity

You create a user-assigned managed identity as a standalone Azure resource. You can assign it to one or more Azure resources, allowing those resources to share the same identity and permissions. To authenticate by using a user-assigned managed identity, create the identity, assign it to your Azure resource, and then configure your app to use this identity for authentication by specifying its client ID, resource ID, or object ID.

> [!div class="nextstepaction"]
> [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)

#### Use a system-assigned managed identity

You enable a system-assigned managed identity directly on an Azure resource. The identity is tied to the lifecycle of that resource and is automatically deleted when the resource is deleted. To authenticate by using a system-assigned managed identity, enable the identity on your Azure resource and then configure your app to use this identity for authentication.

> [!div class="nextstepaction"]
> [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)

## Authentication during local development

During local development, you can authenticate to Azure resources by using your developer credentials or a service principal. This authentication method lets you test your app's authentication logic without deploying it to Azure.

#### Use developer credentials

You can use your own Azure credentials to authenticate to Azure resources during local development. Typically, you use a development tool, such as Azure CLI, which can provide your app with the necessary tokens to access Azure services. This method is convenient but should only be used for development purposes.

> [!div class="nextstepaction"]
> [Authenticate locally using developer credentials](local-development-dev-accounts.md)

#### Use a service principal

You create a service principal in a Microsoft Entra tenant to represent an app and use it to authenticate to Azure resources. You can configure your app to use service principal credentials during local development. This method is more secure than using developer credentials and is closer to how your app authenticates in production. However, it's still less ideal than using a managed identity because of the need for secrets.

> [!div class="nextstepaction"]
> [Authenticate locally using a service principal](local-development-service-principal.md)

## Authentication for apps hosted on-premises

For apps hosted on-premises, you can use a service principal to authenticate to Azure resources. This method involves creating a service principal in Microsoft Entra ID, assigning it the necessary permissions, and configuring your app to use its credentials. With this method, your on-premises app can securely access Azure services.

> [!div class="nextstepaction"]
> [Authenticate your on-prem app using a service principal](local-development-service-principal.md)

## Related content

- [Azure Identity client library for Go README on GitHub](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azidentity/README.md)
- [Azure Identity client library reference on pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity)

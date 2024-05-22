---
title: 'Overview: Authenticate Python apps to Azure using the Azure SDK'
description: This article provides an overview of how to authenticate applications to Azure services when you use the Azure SDK for Python in both server environments and in local development.
ms.date: 05/22/2024
ms.topic: overview
ms.custom: devx-track-python
---

# Authenticate Python apps to Azure services by using the Azure SDK for Python

When an application needs to access an Azure resource like Azure Storage, Azure Key Vault, or Azure AI services, the application must be authenticated to Azure. This requirement is true for all applications, whether they're deployed to Azure, deployed on-premises, or under development on a local developer workstation. This article describes the recommended approaches to authenticate an app to Azure when you use the Azure SDK for Python.

## Recommended app authentication approach

Use token-based authentication rather than connection strings for your apps when they authenticate to Azure resources. The Azure SDK for Python provides classes that support token-based authentication. Apps can seamlessly authenticate to Azure resources whether the app is in local development, deployed to Azure, or deployed to an on-premises server.

The specific type of token-based authentication an app uses to authenticate to Azure resources depends on where the app is being run. The types of token-based authentication are shown in the following diagram.

:::image type="content" source="./media/python-sdk-auth-strategy.png" alt-text="A diagram that shows the recommended token-based authentication strategies for an app depending on where it's running." :::

- **When a developer is running an app during local development:** The app authenticates to Azure by using either an application service principal for local development or the developer's Azure credentials. These options are discussed in the section [Authentication during local development](#authentication-during-local-development).
- **When an app is hosted on Azure:** The app authenticates to Azure resources by using a managed identity. This option is discussed in the section [Authentication in server environments](#authentication-in-server-environments).
- **When an app is hosted and deployed on-premises:** The app authenticates to Azure resources by using an application service principal. This option is discussed in the section [Authentication in server environments](#authentication-in-server-environments).

### DefaultAzureCredential

The [DefaultAzureCredential](#use-defaultazurecredential-in-an-application) class provided by the Azure SDK allows apps to use different authentication methods depending on the environment in which they're run. In this way, apps can be promoted from local development to test environments to production without code changes.

You configure the appropriate authentication method for each environment, and `DefaultAzureCredential` automatically detects and uses that authentication method. The use of `DefaultAzureCredential` is preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

Details about using the `DefaultAzureCredential` class are discussed in the section [Use DefaultAzureCredential in an application](#use-defaultazurecredential-in-an-application).

### Advantages of token-based authentication

Use token-based authentication instead of using connection strings when you build apps for Azure. Token-based authentication offers the following advantages over authenticating with connection strings:

- The token-based authentication methods described in this article allow you to establish the specific permissions needed by the app on the Azure resource. This practice follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- Anyone or any app with a connection string can connect to an Azure resource, but token-based authentication methods scope access to the resource to only the apps intended to access the resource.
- With a managed identity, there's no application secret to store. The app is more secure because there's no connection string or application secret that can be compromised.
- The [azure.identity](https://pypi.org/project/azure-identity/) package in the Azure SDK manages tokens for you behind the scenes. Managed tokens make using token-based authentication as easy to use as a connection string.

Limit the use of connection strings to initial proof-of-concept apps or development prototypes that don't access production or sensitive data. Otherwise, the token-based authentication classes available in the Azure SDK are always preferred when they're authenticating to Azure resources.

## Authentication in server environments

When you're hosting in a server environment, each application is assigned a unique *application identity* per environment where the application runs. In Azure, an app identity is represented by a *service principal*. This special type of security principal identifies and authenticates apps to Azure. The type of service principal to use for your app depends on where your app is running:

| Authentication method | Description |
|-----------------------|-------------|
| Apps hosted in Azure  | [!INCLUDE [sdk-auth-overview-managed-identity](./includes/sdk-auth-overview-managed-identity.md)]            |
| Apps hosted outside of Azure<br>(for example, on-premises apps) | [!INCLUDE [sdk-auth-overview-service-principal](./includes/sdk-auth-overview-service-principal.md)] |

## Authentication during local development

When an application runs on a developer's workstation during local development, it still must authenticate to any Azure services used by the app. There are two main strategies for authenticating apps to Azure during local development:

| Authentication method | Description |
|-----------------------|-------------|
| Create dedicated application service principal objects to be used during local development. | [!INCLUDE [sdk-auth-overview-dev-service-principals](./includes/sdk-auth-overview-dev-service-principals.md)] |
| Authenticate the app to Azure by using the developer's credentials during local development. | [!INCLUDE [sdk-auth-overview-dev-accounts](./includes/sdk-auth-overview-dev-accounts.md)] |

## Use DefaultAzureCredential in an application

To use [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) in a Python app, add the [azure.identity](https://pypi.org/project/azure-identity/) package to your application.

```terminal
pip install azure-identity
```

The following code example shows how to instantiate a `DefaultAzureCredential` object and use it with an Azure SDK client class. In this case, it's a `BlobServiceClient` object used to access Azure Blob Storage.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Acquire a credential object
credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
        account_url="https://<my_account_name>.blob.core.windows.net",
        credential=credential)
```

The `DefaultAzureCredential` object automatically detects the authentication mechanism configured for the app and obtains the necessary tokens to authenticate the app to Azure. If an application makes use of more than one SDK client, you can use the same credential object with each SDK client object.

### Sequence of authentication methods when you use DefaultAzureCredential

Internally, `DefaultAzureCredential` implements a chain of credential providers for authenticating applications to Azure resources. Each credential provider can detect if credentials of that type are configured for the app. The `DefaultAzureCredential` object sequentially checks each provider in order and uses the credentials from the first provider that has credentials configured.

The order in which `DefaultAzureCredential` looks for credentials is shown in the following diagram and table:

:::image type="content" source="./media/default-azure-credential-auth-flow.svg" alt-text="A diagram that shows the sequence in which DefaultAzureCredential checks to see what authentication source is configured for an application." lightbox="./media/default-azure-credential-auth-flow-big.png":::

| Credential type               | Description |
|-------------------------------|-------------|
| Environment | The `DefaultAzureCredential` object reads a set of environment variables to determine if an application service principal (application user) was set for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure.<br><br>This method is most often used in server environments, but you can also use it when you develop locally.             |
| Workload identity              | In Azure Kubernetes Service (AKS), a workload identity represents a trust relationship between a managed identity and a Kubernetes service account. If an application deployed to AKS is configured with a Kubernetes service account in such a relationship, `DefaultAzureCredential` authenticates the app to Azure by using the managed identity. Authentication by using a workload identity is discussed in [Use Microsoft Entra Workload ID with Azure Kubernetes Service](/azure/aks/workload-identity-overview?tabs=python).|
| Managed identity              | If the application is deployed to an Azure host with managed identity enabled, `DefaultAzureCredential` authenticates the app to Azure by using that managed identity. Authentication by using a managed identity is discussed in the section [Authentication in server environments](#authentication-in-server-environments).<br><br>This method is only available when an application is hosted in Azure by using a service like Azure App Service, Azure Functions, or Azure Virtual Machines. |
| Azure CLI                     | If you've authenticated to Azure by using the `az login` command in the Azure CLI, `DefaultAzureCredential` authenticates the app to Azure by using that same account. |
| Azure PowerShell              | If you've authenticated to Azure by using the `Connect-AzAccount` cmdlet from Azure PowerShell, `DefaultAzureCredential` authenticates the app to Azure by using that same account.            |
| Azure Developer CLI              | If you've authenticated to Azure by using the `azd auth login` command in the Azure Developer CLI, `DefaultAzureCredential` authenticates the app to Azure by using that same account.            |
| Interactive                   | If enabled, `DefaultAzureCredential` interactively authenticates you via the current system's default browser. By default, this option is disabled. |

> [!NOTE]
> Due to a [known issue](https://github.com/Azure/azure-sdk-for-python/issues/23249), `VisualStudioCodeCredential` has been removed from the `DefaultAzureCredential` token chain. When the issue is resolved in a future release, this change will be reverted. For more information, see [Azure Identity client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity).

## Related content

- [Azure Identity client library for Python README on GitHub](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/identity/azure-identity/README.md)

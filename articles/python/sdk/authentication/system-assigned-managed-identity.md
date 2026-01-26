---
title: Authenticate Azure-hosted Python apps to Azure resources using a system-assigned managed identity
description: Learn how to authenticate Azure-hosted Python apps to other Azure services using a system-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli
ms.date: 01/26/2026
---

# Authenticate Azure-hosted Python apps to Azure resources using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a system-assigned managed identity for your app
- How to assign roles to the system-assigned managed identity
- How to authenticate using the system-assigned managed identity from your app code

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The sections ahead describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, visit the [user-assigned managed identities](user-assigned-managed-identity.md) article for more information.

[!INCLUDE [system-assigned-managed-identity](../../../includes/authentication/system-assigned-managed-identity.md)]

## Authenticate to Azure services from your app

The [Azure Identity library](/python/api/azure-identity) provides various *credentials*&mdash;implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. Since managed identity is unavailable when running locally, the steps ahead demonstrate which credential to use in which scenario:

- **Local dev environment**: During **local development only**, use a class called [DefaultAzureCredential](/azure/developer/python/sdk/authentication/credential-chains#defaultazurecredential-overview) for an opinionated, preconfigured chain of credentials. `DefaultAzureCredential` discovers user credentials from your local tooling or IDE, such as the Azure CLI or Visual Studio Code. It also provides flexibility and convenience for retries, wait times for responses, and support for multiple authentication options. Visit the [Authenticate to Azure services during local development](local-development-dev-accounts.md) article to learn more.
- **Azure-hosted apps**: When your app is running in Azure, use [ManagedIdentityCredential](/python/api/azure-identity/azure.identity.managedidentitycredential?view=azure-python&preserve-view=true) to safely discover the managed identity configured for your app. Specifying this exact type of credential prevents other available credentials from being picked up unexpectedly.

### Implement the code

Add the [azure-identity](https://pypi.org/project/azure-identity/) package to your application:

### [terminal](#tab/command-line)

In a terminal of your choice, navigate to the application project directory and run the following command:

```terminal
pip install azure-identity
```

### [requirements.txt](#tab/requirements-txt)

Add the following line to your `requirements.txt` file:

```plaintext
azure-identity
```

---

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. The following code example demonstrates how to create a credential instance and use it with an Azure SDK service client. In your application code, complete the following steps to authenticate using a managed identity:

1. Import the `ManagedIdentityCredential` class from the `azure.identity` module.
1. Create a `ManagedIdentityCredential` object.
1. Pass the `ManagedIdentityCredential` object to the Azure SDK client constructor.

The following example demonstrates authenticating a `BlobServiceClient` using a system-assigned managed identity:

```python
from azure.identity import ManagedIdentityCredential
from azure.storage.blob import BlobServiceClient

# Authenticate using system-assigned managed identity
credential = ManagedIdentityCredential()

blob_service_client = BlobServiceClient(
    account_url="https://<account-name>.blob.core.windows.net",
    credential=credential
)
```

When developing locally, you can use `DefaultAzureCredential` which discovers credentials from local developer tools. When deployed to Azure, switch to `ManagedIdentityCredential` for production scenarios:

```python
import os
from azure.identity import DefaultAzureCredential, ManagedIdentityCredential
from azure.storage.blob import BlobServiceClient

# Use ManagedIdentityCredential in Azure, DefaultAzureCredential locally
if os.getenv("WEBSITE_HOSTNAME"):
    credential = ManagedIdentityCredential()
else:
    credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
    account_url="https://<account-name>.blob.core.windows.net",
    credential=credential
)
```

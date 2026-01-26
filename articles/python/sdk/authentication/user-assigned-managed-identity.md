---
title: Authenticate Azure-hosted Python apps to Azure resources using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted Python apps to other Azure services using a user-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli
ms.date: 01/26/2026
---

# Authenticate Azure-hosted Python apps to Azure resources using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate using the user-assigned managed identity from your app code

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The sections ahead describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, visit the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [user-assigned-managed-identity](../../../includes/authentication/user-assigned-managed-identity.md)]

## Authenticate to Azure services from your app

The [Azure Identity library](/python/api/azure-identity) provides various *credentials*&mdash;implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. Since managed identity is unavailable when running locally, the steps ahead demonstrate which credential to use in which scenario:

- **Local dev environment**: During **local development only**, use a class called [DefaultAzureCredential](/azure/developer/python/sdk/authentication/credential-chains#defaultazurecredential-overview) for an opinionated, preconfigured chain of credentials. `DefaultAzureCredential` discovers user credentials from your local tooling or IDE, such as the Azure CLI or Visual Studio Code. It also provides flexibility and convenience for retries, wait times for responses, and support for multiple authentication options. Visit the [Authenticate to Azure services during local development](local-development-dev-accounts.md) article to learn more.
- **Azure-hosted apps**: When your app is running in Azure, use [ManagedIdentityCredential](/python/api/azure-identity/azure.identity.managedidentitycredential?view=azure-python&preserve-view=true) to safely discover the managed identity configured for your app. Specifying this exact type of credential prevents other available credentials from being picked up unexpectedly.

### Implement the code

Add the [azure-identity](https://pypi.org/project/azure-identity/) package to your application by navigating to the application project directory and running the following command:

```terminal
pip install azure-identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. The following code example demonstrates how to create a credential instance and use it with an Azure SDK service client. In your application code, complete the following steps to authenticate using a managed identity:

1. Import the `ManagedIdentityCredential` class from the `azure.identity` module.
1. Create a `ManagedIdentityCredential` object and configure either the client ID, resource ID, or object ID.
1. Pass the `ManagedIdentityCredential` object to the Azure SDK client constructor.

## [Client ID](#tab/client-id)

The client ID is used to identify a managed identity when configuring applications or services that need to authenticate using that identity.

1. Retrieve the client ID assigned to a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'clientId'
    ```

1. Configure `ManagedIdentityCredential` with the client ID:

    ```python
    from azure.identity import ManagedIdentityCredential
    from azure.storage.blob import BlobServiceClient

    credential = ManagedIdentityCredential(
        client_id="<client-id>"
    )

    blob_service_client = BlobServiceClient(
        account_url="https://<account-name>.blob.core.windows.net",
        credential=credential
    )
    ```

## [Resource ID](#tab/resource-id)

The resource ID uniquely identifies the managed identity resource within your Azure subscription using the following structure:

`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}`

Resource IDs can be built by convention, which makes them more convenient when working with a large number of user-assigned managed identities in your environment.

1. Retrieve the resource ID for a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'id'
    ```

1. Configure `ManagedIdentityCredential` with the resource ID:

    ```python
    from azure.identity import ManagedIdentityCredential
    from azure.storage.blob import BlobServiceClient

    credential = ManagedIdentityCredential(
        identity_config={"resource_id": "<resource-id>"}
    )

    blob_service_client = BlobServiceClient(
        account_url="https://<account-name>.blob.core.windows.net",
        credential=credential
    )
    ```

## [Object ID](#tab/object-id)

A principal ID is another name for an object ID.

1. Retrieve the object ID for a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'principalId'
    ```

1. Configure `ManagedIdentityCredential` with the object ID:

    ```python
    from azure.identity import ManagedIdentityCredential
    from azure.storage.blob import BlobServiceClient

    credential = ManagedIdentityCredential(
        identity_config={"object_id": "<object-id>"}
    )

    blob_service_client = BlobServiceClient(
        account_url="https://<account-name>.blob.core.windows.net",
        credential=credential
    )
    ```

---

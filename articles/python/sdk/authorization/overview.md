---
title: Authorization in the Azure SDK libraries for Python
description: Learn how to implement and troubleshoot authorization when using the Azure SDK for Python.
ms.date: 7/10/2025
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Authorization in the Azure SDK libraries for Python

Authorization in Azure determines what actions authenticated users or services can perform on resources. This article explores how to implement authorization using the [Azure SDK for Python](/azure/developer/python/sdk/azure-sdk-overview), covering models, implementation, troubleshooting, and best practices. For detailed authentication setup, refer to [Authenticate Python apps to Azure](/azure/developer/python/sdk/authentication/overview).

## Introduction

**Authentication (AuthN)** verifies the identity of a user or service, while **authorization (AuthZ)** defines what they can do. In Azure, authorization ensures secure access to resources, critical for protecting applications and data. Developers can implement robust authorization with the Azure SDK for Python in order to control access in various workflows, from managing resources to accessing service-specific data.

## Azure authorization models

Azure provides multiple authorization mechanisms to manage access. Understanding these models is essential for effective access control.

### Azure Role-Based Access Control

[Azure Role-Based Access Control](/azure/role-based-access-control/) (RBAC) assigns roles to identities at scopes like subscriptions or resource groups. Built-in roles include Owner, Contributor, and Reader, while custom roles allow tailored permissions. When you assign a role at a specific scope, the identity (like a user or service) gets permissions for all resources within that scope and its child scopes. For example, assigning the Contributor role at the subscription level allows management of all resources in that subscription. See [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

### Service-specific mechanisms

Some Azure services offer unique authorization methods:

- **Azure Storage**: Uses Shared Access Signatures (SAS) and Access Control Lists (ACLs) for data access. See **Service-Specific Authorization Notes** for [Azure Storage](#azure-storage).
- **Azure Key Vault**: Recommends RBAC over legacy access policies. See **Service-Specific Authorization Notes** for [Azure Key Vault](#azure-key-vault).
- **Microsoft Graph**: Employs OAuth2 scopes and application permissions. See **Service-Specific Authorization Notes** for [Microsoft Graph](#microsoft-graph).

## Use authorization in Azure SDK for Python

The Azure SDK for Python uses the `TokenCredential` class from the `azure-identity` package to handle authentication and authorization. The `DefaultAzureCredential` class supports various authentication mechanisms, such as managed identities and service principals, adapting to different environments.

### Example: List resource groups

This example shows how the Azure SDK for Python uses a credential (via `DefaultAzureCredential`) to authenticate, and how authorization determines whether the identity can successfully list resource groups. If the identity lacks the Reader or higher role on the subscription or resource group scope, this call returns a 403 Forbidden error.

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

credential = DefaultAzureCredential()
client = ResourceManagementClient(credential, "<subscription-id>")
resource_groups = client.resource_groups.list()
for rg in resource_groups:
    print(rg.name)
```

Replace `<subscription-id>` with your Azure subscription ID, which is usually in the form of `00000000-0000-0000-0000-000000000000`.

### Microsoft Graph with scopes

To access Microsoft Graph, use the official [Microsoft Graph SDK for Python](https://github.com/microsoftgraph/msgraph-sdk-python), which supports both delegated and application permissions.

This example demonstrates how the SDK uses a credential to request an access token with the required authorization scope `https://graph.microsoft.com/.default` and access Microsoft Graph resources. The identity must be authorized in Microsoft Entra ID with appropriate application permissions (such as `User.Read.All`) to retrieve user data; otherwise, the request fails with a 403 Forbidden.

> [!Important]
> Ensure your app or identity has the `User.Read.All` or other required permissions granted in Microsoft Entra ID.

```python
from azure.identity import DefaultAzureCredential
from msgraph.core import GraphClient

credential = DefaultAzureCredential()
client = GraphClient(credential=credential, scopes=["https://graph.microsoft.com/.default"])

response = client.get("/users")
users = response.json().get("value", [])
for user in users:
    print(user["displayName"])
```

Learn more about this SDK in the official [Build Python apps with Microsoft Graph](/graph/tutorials/python) tutorial.


## Diagnose authorization errors

Authorization issues often result in HTTP 403 Forbidden errors, indicating insufficient permissions. To diagnose:

- **Check Error Messages**: Review the response for details on missing permissions.
- **Enable Logging**: Use Python logging to inspect requests and responses:

  ```python
  import logging
  logging.basicConfig(level=logging.DEBUG)
  ```
- **Verify Access**: Use [Azure CLI](/cli/azure/) or the Azure portal to check role assignments:

  ```azurecli
  az role assignment list --assignee <principal-id> --scope <scope>
  ```

  Replace `<principal-id>` with the object ID of your user, service principal, or managed identity. Replace `<scope>` with an Azure resource scope, such as a subscription ID, a resource group name, or a resource. See [Work with scopes](#work-with-scopes).

## Work with scopes

  Often you'll need to provide a scope, like in the example:

  ```azurecli
  az role assignment list --assignee <principal-id> --scope <scope>
  ```  

  Here are some common scope formats:

  | Scope Level        | Example Value                                                                                                                          |
  | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
  | **Subscription**   | `/subscriptions/<subscription-id>`                                                                                                     |
  | **Resource Group** | `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>`                                                                |
  | **Resource Name**       | `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/<provider-namespace>/<resource-type>/<resource-name>` |

  For example, to list all role assignments for a managed identity at the resource group level:

  ```azurecli
  az role assignment list \
    --assignee 12345678-90ab-cdef-1234-567890abcdef \
    --scope /subscriptions/<subscription-id>/resourceGroups/my-resource-group
  ```
  
  Or at the subscription level:

  ```azurecli
  az role assignment list \
    --assignee 12345678-90ab-cdef-1234-567890abcdef \
    --scope /subscriptions/<subscription-id>
  ```

  You can retrieve the object ID (`<principal-id>`) of a user or managed identity using:

  ```azurecli
  az ad user show --id <user-email> --query objectId
  az identity show --name <identity-name> --resource-group <rg-name> --query principalId
  ```

## Manage access

Manage access through role assignments using:

- **Azure Portal**: Add roles via the "Access control (IAM)" service menu
- **Azure CLI**:
  ```azurecli
  az role assignment create --assignee <principal-id> --role <role-name> --scope <scope>
  ```

  Replace `<principal-id>` with the object ID of your user, service principal, or managed identity. Replace `<scope>` with an Azure resource scope, such as a subscription ID, a resource group name, or a resource name. See [Work with scopes](#working-with-scopes).

- **ARM Templates**: For declarative management.

For managed identities, assign roles to the identity associated with resources like virtual machines. Use the Azure portal's "Check access" feature or the Azure CLI to verify effective permissions.

## Service-specific authorization notes

In the section [Service-specific mechanisms](#service-specific-mechanisms), it was noted that some Azure services offer unique authorization methods. This section provides more detail for each of the three Azure services mentioned.

### Azure Storage

- **RBAC**: Manages control plane operations.
- **SAS and ACLs**: Control data plane access, with Microsoft Entra authentication also supported.

### Example: Access blobs with Microsoft Entra ID

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

credential = DefaultAzureCredential()
client = BlobServiceClient(account_url="https://<account-name>.blob.core.windows.net", credential=credential)
containers = client.list_containers()
for container in containers:
    print(container.name)
```

Replace `<account-name>` with your Azure Storage account name.


### Azure Key Vault

RBAC is recommended over legacy access policies for consistency. Access policies are still supported but not preferred.

### Example: Retrieve a secret

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://<vault-name>.vault.azure.net", credential=credential)
secret = client.get_secret("my-secret")
print(secret.value)
```

Replace `<vault-name>` with your Key Vault resource name.


### Microsoft Graph

Uses OAuth 2.0 scopes for delegated permissions and application permissions for daemon apps. Specify scopes as shown in the earlier example.

## Best practices

- **Least privilege**: Assign only necessary permissions (for example, Reader instead of Contributor).
- **Prefer RBAC**: Especially for Key Vault, for unified access control.
- **Use Managed Identities**: Avoid managing credentials in code.
- **Limit Graph permissions**: Request specific scopes to minimize risks.

## Next steps

- [Azure Role-Based Access Control (RBAC)](/azure/role-based-access-control/)
- [Azure CLI Reference](/cli/azure/)
- [Azure SDK for Python Overview](/azure/developer/python/sdk/azure-sdk-overview)
- [Azure Key Vault RBAC Guide](/azure/key-vault/general/rbac-guide)
- [Microsoft Graph Permissions Reference](/graph/permissions-reference)
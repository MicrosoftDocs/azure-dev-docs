---
title: How to authenticate Python applications hosted on Azure
description: How to acquire the necessary credential objects to authenticate a Python application running on Azure.
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Authenticate Azure-hosted applications with DefaultAzureCredential

This article describes the recommended method (`DefaultAzureCredential`) for authenticating applications running on Azure with other Azure services.

If you haven't already, review the [Authentication Overview](azure-sdk-authenticate.md#how-to-assign-an-app-identity) for important details that apply to all authentication methods, namely assigning application identity, granting permissions to an identity, and when authentication and authorization occur when using Azure libraries.

## How to use DefaultAzureCredential when accessing resources

For most applications, the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential) class from the [`azure.identity`](/python/api/azure-identity/azure.identity) library provides the simplest and recommended means of authentication.

`DefaultAzureCredential` automatically uses a variety of underlying authentication methods, such as the app's managed identity (sometimes referred to as MSI) in the cloud or a local service principal from environment variables when running locally (as described on [Configure your local Python dev environment for Azure - Configure authentication](configure-local-development-environment.md#configure-authentication)). For more information, see the [`DefaultAzureCredential` class reference](/python/api/azure-identity/azure.identity.defaultazurecredential).

:::code language="python" source="~/../python-sdk-docs-examples/auth/key_vault_example_short.py":::

The preceding code uses a `DefaultAzureCredential` object when accessing Azure Key Vault, where the URL of the Key Vault is available in an environment variable named `KEY_VAULT_URL`. The code clearly implements the typical library usage pattern described earlier: acquire a credential object, create an appropriate client object for the Azure resource, then attempt to perform an operation on that resource using that client object. Again, authentication and authorization don't happen until this final step.

When code is deployed to and running on Azure, `DefaultAzureCredential` automatically uses the system-assigned managed identity that you can enable for the application within whatever service is hosting it. Permissions for specific resources, such as Azure Storage or Azure Key Vault, are assigned to that identity using the Azure portal or the Azure CLI. In these cases, this Azure-managed identity maximizes security because you don't ever deal with an explicit service principal in your code.

When you run your code locally, `DefaultAzureCredential` automatically uses the service principal described by the environment variables named `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`. The client object then includes these values (securely) in the HTTP request header when calling the API endpoint. No code changes are necessary when running locally or in the cloud. For details on creating the service principal and setting up the environment variables, see [Configure your local Python dev environment for Azure - Configure authentication](configure-local-development-environment.md#configure-authentication).

In both cases, the identity involved must be assigned permissions for the appropriate resource. The general process is described on [How to assign role permissions](/azure/role-based-access-control/role-assignments-steps); specifics can be found in the documentation for the individual services. For details on Key Vault permissions, for example, as would be needed for the previous code, see [Provide Key Vault authentication with an access control policy](/azure/key-vault/general/group-permissions-for-applications).

## How to use DefaultAzureCredential with SDK management libraries

`DefaultAzureCredential` works with newer versions of the Azure SDK management libraries&mdash;those "Resource Management" libraries with "mgmt" in their names that also appear on the [Libraries using azure.core](azure-sdk-library-package-index.md#libraries-using-azurecore) list. Also, the pypi page for an updated library usually includes the line, "Credential system has been completely revamped" to indicate the change.

For example, you can use `DefaultAzureCredential` with version 15.0.0 or higher of `azure-mgmt-resource`:

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_default.py":::

Most management client objects (other than `SubscriptionClient`) also require an Azure subscription ID to manage resources on that subscription. You can set the subscription ID using the `AZURE_SUBSCRIPTION_ID` environment variable. See [Configure your local Python dev environment for Azure - Configure authentication](configure-local-development-environment.md#configure-authentication).

If the library has not been updated, code using `DefaultAzureCredential` results in the "object has no attribute 'signed-session'" error as described in the next section.

## Credential "object has no attribute 'signed_session'"

If you attempt to use `DefaultAzureCredential` (or `AzureCliCredential` and other credential objects from `azure.identity`) with a library that hasn't been updated to use `azure.core`, calls through a client object fail with the rather vague error, "'DefaultAzureCredential' object has no attribute 'signed_session'". You'd encounter such a failure, for example, if you use the code in the preceding section with an `azure-mgmt-resource` library below version 15.

This error happens because non-azure.core versions of SDK management libraries assume that the credential object contains a `signed_session` property, which isn't present on `DefaultAzureCredential` and other credential objects from `azure.identity`.

If the management library you want to use hasn't yet been updated, then you can use the following alternate methods:

- Use one of the other authentication methods describe in subsequent sections of this article, which can work well for code that uses *only* SDK management libraries and that won't be deployed to the cloud, in which case you can rely on local service principals only.

- Instead of `DefaultAzureCredential`, use the [CredentialWrapper class (cred_wrapper.py)](https://gist.github.com/lmazuel/cc683d82ea1d7b40208de7c9fc8de59d) that's provided by a member of the Azure SDK engineering team. Once the desired management library is available, switch back to `DefaultAzureCredential`. This method has the advantage that you can use the same credential with both client and management SDK libraries, and it works both locally and in the cloud.

    Assuming that you've downloaded a copy of *cred_wrapper.py* into your project folder, the previous code would appear as follows:

    :::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_cred_wrapper.py":::

    Again, once updated management libraries are available, you can use `DefaultAzureCredential` directly as shown in the [original code example](#how-to-use-defaultazurecredential-with-sdk-management-libraries).

## See also

- [Authentication overview](azure-sdk-authenticate.md)
- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [How to assign role permissions](/azure/role-based-access-control/role-assignments-steps)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision and use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

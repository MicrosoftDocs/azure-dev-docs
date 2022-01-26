---
title: How to authenticate Python applications with Azure services
description: How to acquire the necessary credential objects to authenticate a Python application with Azure services by using the Azure libraries
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# How to authenticate and authorize Python applications on Azure

Most cloud applications deployed to Azure need to access other Azure resources such as storage, databases, stored secrets, and so on. To access those resources, the application must be both authenticated and authorized:

- **Authentication** verifies the app's identity with Azure Active Directory.

- **Authorization** determines which operations the authenticated app can perform on any given resource. The authorized operations are defined by the **roles** assigned to the app identity for that resource. In a few cases, such as Azure Key Vault, authorization is also determined by additional **access policies** that are assigned to the app identity.

This article explains the details of authentication and authorization:

- How to assign an app identity.
- How to grant permissions to an identity.
- How and when authentication and authorization occur.

Secondary articles then describe specific authentication methods:

- [Authentication in development environments](azure-sdk-authenticate-development-environments.md), using `AzureCliCredential` or the Azure Extension for Visual Studio Code.
- [Authentication for Azure-hosted applications](azure-sdk-authenticate-hosted-applications.md), using Managed Identity and `DefaultAzureCredential`.
- [Authentication with service principals](azure-sdk-authenticate-service-principals.md)
- [Authentication with user credentials](azure-sdk-authenticate-user-credentials.md)

## How to assign an app identity

On Azure, an app identity is defined by a **service principal**. (A service principal is a specific type of "security principal" that's used to identify an app or service, which is to say, a piece of code, as opposed to a human user or group of users.)

The service principal involved depends on where the app is running, as described in the following sections.

### Identity when running the app on Azure

When running in the cloud (for example, in production), an app most commonly uses a **system-assigned managed identity** (formerly referred to as "MSI"). With a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview), you use the app's name when assigning roles and permissions for resources. Azure automatically manages the underlying service principal and automatically authenticates the app with those other Azure resources. As a result, you don't need to handle the service principal directly. Furthermore, your app code never needs to handle access tokens, secrets, or connection strings for Azure resources, which reduces the risk that any such information might be leaked or otherwise compromised.

Configuring managed identity depends on the service you use to host your app. Refer to the article, [Services that support managed identity](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities) for links to instructions for each service. For web apps deployed to Azure App Service, for example, you enable managed identity through the **Identity** > **System assigned** option in the Azure portal, or by using the `az webapp identity assign` command in the Azure CLI.

If you can't use managed identity, you instead manually register the application with Azure Active Directory. Registration assigns a service principal to the app, which you use when assigning roles and permissions. For more information, see [Register an application](/azure/active-directory/develop/quickstart-register-app).

### Identity when running the app locally

During development, you often want to run and debug your app code on a developer workstation while still having that code access Azure resources in the cloud. In this case, you create a separate service principal through Azure Active Directory specifically for local development. You again assign roles and permissions to this service principal for the resources in question. Typically, you authorize this development identity to access only non-production resources.

For details on creating the local service principal and making it available to the Azure libraries, see [Configure your local development environment](configure-local-development-environment.md). Once you've completed this one-time configuration, you can run the same app code locally and in the cloud without any environment-specific modifications.

Each developer should have his or her own service principal that's secured within their user account on their workstation and never stored in a source control repository. If any one service principal is ever stolen or compromised, you can easily delete it to revoke all of its permissions, and then recreate the service principal for that developer. For more information, see [How to manage service principals](how-to-manage-service-principals.md).

> [!NOTE]
> Although it's possible to run an app using your own Azure user credential, doing so doesn't help you establish the specific resource permissions that your app needs when deployed to the cloud. It's much better to set up a service principal for development and assign it the necessary roles and permissions, which you can then replicate using with the deployed app's managed identity or service principal.

## Assign roles and permissions to an identity

Once you know the identities for the app both on Azure and when running locally, you use role-based access control (RBAC) to grant permissions through the Azure portal or the Azure CLI. For full details, see [How to assign role permissions to an app identity or service principal](/azure/role-based-access-control/role-assignments-steps).

## When does authentication and authorization occur?

When writing app code using the Azure libraries (SDK) for Python, you use the following pattern to access Azure resources:

1. Acquire a **credential** using a class in the [Azure Identity library](/python/api/azure-identity/azure.identity). A credential describes the app identity and contains or can obtain the data needed to authenticate requests.

1. Use the credential to acquire a **client object** for the resource of interest. (Each type of resource has its own client object in the Azure libraries, to which you provide the resource's URL.)

1. Attempt to access or modify the **resource** through the client object, which generates an HTTP request to the resource's REST API. The API call is the point at which Azure then both authenticates the app identity and checks authorization.

The following code describes and demonstrates these steps by attempting to access Azure Key Vault.

:::code language="python" source="~/../python-sdk-docs-examples/auth/key_vault_example.py":::

Again, no authentication or authorization takes place until your code makes a specific request to the Azure REST API through a client object. The statement to create the `DefaultAzureCredential` [see the next section) only creates a client-side object in memory, but performs no other checks.

Creating the SDK [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient) object also involves no communication with the resource in question. The `SecretClient` object is just a wrapper around the underlying Azure REST API and exists only in the app's runtime memory. 

It's only when the code calls the [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient#azure-keyvault-secrets-secretclient-get-secret) method that the client object generates the appropriate REST API call to Azure. Azure's endpoint for `get_secret` then authenticates the caller's identity and checks authorization.

## See also

- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [How to assign role permissions](/azure/role-based-access-control/role-assignments-steps)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision and use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

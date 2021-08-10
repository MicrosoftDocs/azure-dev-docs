---
title: How to authenticate Python applications with Azure services using service principals
description: Using service principals to authenticate a Python application with Azure services by using the Azure libraries
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Authenticate Python applications on Azure using service principals

This article describes methods for authenticating applications with Azure services using explicit service principals.

If you haven't already, review the [Authentication Overview](azure-sdk-authenticate.md#how-to-assign-an-app-identity) for important details that apply to all authentication methods, namely assigning application identity, granting permissions to an identity, and when authentication and authorization occur when using Azure libraries.

When using explicit service principals, you aren't able to take advantage of managed identity for code that's deployed to the cloud. When used with production code, then, you must manage and maintain distinct service principals for your cloud applications.

Service principals for applications deployed to the cloud are managed in your subscriptions Active Directory. For more information, see [How to manage service principals](how-to-manage-service-principals.md).

In all cases, the appropriate service principal or user must have appropriate permissions for the resources and operation in question.

## Authenticate using environment variables

The [`EnvironmentCredential`](/python/api/azure-identity/azure.identity.environmentcredential) class authenticates a service principal using either a client secret or certificate as provided through environment variables.

:::code language="python" source="~/../python-sdk-examples/show_subscription/use_environment_variables.py":::

## Authenticate with token credentials

You can authenticate with the Azure libraries using explicit subscription, tenant, and client identifiers along with a client secret.

When using newer SDK libraries based on azure.core, use the [`ClientSecretCredential` object from the azure.identity library](#using-clientsecretcredential-azureidentity). When using older SDK libraries, use [`ServicePrincipalCredentials` from the azure.common library](#using-serviceprincipalcredentials-azurecommon).

To migrate existing code that uses `ServicePrincipalCredentials` to a newer library version, replace uses of this class with `ClientSecretCredential` as illustrated in the following sections. Note the slight changes in the parameter names between the two constructors: `tenant` becomes `tenant_id` and `secret` becomes `client_secret`.

### ClientSecretCredential (azure.identity)

:::code language="python" source="~/../python-sdk-examples/show_subscription/use_client_secret.py":::

In this method, which is again used with newer libraries based on azure.core, you create a [`ClientSecretCredential`](/python/api/azure-identity/azure.identity.clientsecretcredential) object using credentials obtained from secure storage such as Azure Key Vault or environment variables. The previous code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development).

### ServicePrincipalCredentials (azure.common)

:::code language="python" source="~/../python-sdk-examples/show_subscription/use_service_principal.py":::

In this method, which is again used with older libraries not based on azure.core, you create a [`ServicePrincipalCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.serviceprincipalcredentials) object using credentials obtained from secure storage such as Azure Key Vault or environment variables. The previous code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development).

## See also

- [Authentication overview](azure-sdk-authenticate.md)
- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [How to authenticate and authorize Python applications on Azure](azure-sdk-authenticate.md)
- [How to assign role permissions](/azure/role-based-access-control/role-assignments-steps)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision and use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

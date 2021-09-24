---
title: How to use user credentials to authenticate Python applications with Azure services 
description: Authenticate a Python application with Azure services by using the Azure libraries and user credentials
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Authenticate with user credentials for Python applications on Azure

This article describes methods involving user credentials for authenticating applications with Azure services.

If you haven't already, review the [Authentication Overview](azure-sdk-authenticate.md#how-to-assign-an-app-identity) for important details that apply to all authentication methods, namely assigning application identity, granting permissions to an identity, and when authentication and authorization occur when using Azure libraries.

## Interactive browser authentication

This method uses `InteractiveBrowserCredential`, which is described in [Azure Authentication in Python development environments](azure-sdk-authenticate-development-environments.md#interactive-browser-authentication).

## Device code authentication

This method uses `DeviceCodeCredential`, which is described in [Azure Authentication in Python development environments](azure-sdk-authenticate-development-environments.md#device-code-authentication).

## Authentication with a username and password

This method authenticates an application using previous-collected credentials and the [`UsernamePasswordCredential`](/python/api/azure-identity/azure.identity.usernamepasswordcredential) object.

We discourage using this method of authentication because it's less secure than other flows. Also, this method is not interactive and is therefore **not compatible with any form of multi-factor authentication or consent prompting.** The application must already have consent from the user or a directory administrator.

Furthermore, this method authenticates only work and school accounts; Microsoft accounts are not supported. For more information, see [Sign up your organization to use Azure Active Directory](/azure/active-directory/fundamentals/sign-up-organization).

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_username_password.py":::

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

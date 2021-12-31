---
title: How to authenticate Python applications with Azure services (alternate methods)
description: Alternate methods to authenticate a Python application with Azure services by using the Azure libraries
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Azure authentication in Python development environments

This article describes methods for authenticating applications with Azure services within development environments so that you can run those applications locally:

- [CLI-based authentication](#cli-based-authentication) using `AzureCliCredential`.
- [Interactive browser authentication](#interactive-browser-authentication) using `InteractiveBrowserCredential`.
- [Device code authentication](#device-code-authentication) using `DeviceCodeCredential`.
- [Authentication through Visual Studio Code](#authentication-through-visual-studio-code) using `VisualStudioCodeCredential`.

The authentication methods described here are convenient for development work because they don't require explicit role assignments. For this reason, however, they cannot be used with production code.

In all cases, the user or service principal involved must have appropriate permissions for the resources and operation in question.

If you haven't already, review the [Authentication Overview](azure-sdk-authenticate.md#how-to-assign-an-app-identity) for important details that apply to all authentication methods, namely assigning application identity, granting permissions to an identity, and when authentication and authorization occur when using Azure libraries.

## CLI-based authentication

In this method, you create a client object using the credentials of the user signed in with the Azure CLI command `az login`. CLI-based authentication works only for development purposes because it cannot be used in production environments.

The Azure libraries use the default subscription ID, or you can set the subscription prior to running the code using [`az account`](/cli/azure/manage-azure-subscriptions-azure-cli).

### Precautions

When using CLI-based authentication, the application is authorized for any and all operations allowed by the CLI login credentials. As a result, if you are the owner or administrator of your subscription, your code has inherent access to most resources in that subscription without having to assign any specific permissions. This behavior is convenient for experimentation. However, we highly recommend that you use [Azure managed identities](/azure/active-directory/managed-identities-azure-resources/overview) and assign specific permissions when writing production code because you learn how to assign exact permissions to different identities and can accurately validate those permissions in test environments before deploying to production. You can also use specific service principals in a similar manner, but doing so required handling secrets in your application code, which is not needed with managed identities.

### CLI-based authentication with azure.core libraries

When using [Azure libraries that are updated for azure.core](./azure-sdk-library-package-index.md#libraries-using-azurecore), use the [`AzureCliCredential`](/python/api/azure-identity/azure.identity.azureclicredential) object from the azure-identity library (version 1.4.0+). For example, the following code can be used with azure-mgmt-resource versions 15.0.0+:

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_azure_cli.py":::

### CLI-based authentication with older (non azure.core) libraries

When using older Azure libraries that have not been updated for `azure.core`, you can use the [`get_client_from_cli_profile`](/python/api/azure-common/azure.common.client_factory#get-client-from-cli-profile-client-class----kwargs-) method from the `azure-cli-core` library. For example, the following code can be used with versions of `azure-mgmt-resource` below 15.0.0:

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_cli_profile.py":::

## Interactive browser authentication

This method interactively authenticates an application through [`InteractiveBrowserCredential`](/python/api/azure-identity/azure.identity.interactivebrowsercredential) by collecting user credentials in the default system.

Interactive browser authentication enables the same broad permissions as [CLI-based authentication](#cli-based-authentication) and should be used with the same [precautions](#precautions).

### Enable applications for interactive browser authentication

Perform the following steps to enable the application to authenticate through the interactive browser flow. These steps also work for [device code authentication](#device-code-authentication) described later. Following this process is necessary only if using `InteractiveBrowserCredential` in your code.

1. On the [Azure portal](https://portal.azure.com), navigate to Azure Active Directory and select **App registrations** on the left-hand menu.
1. Select the registration for your app, then select **Authentication**.
1. Under **Advanced settings**, select **Yes** for **Allow public client flows**.
1. Select **Save** to apply the changes.
1. To authorize the application for specific resources, navigate to the resource in question, select **API Permissions**, and enable **Microsoft Graph** and other resources you want to access. Microsoft Graph is usually enabled by default.
    1. You must also be the admin of your tenant to grant consent to your application when you log in for the first time.

If you can't configure the device code flow option on your Active Directory, your application may need to be multi-tenant. To make this change, navigate to the **Authentication** panel, select **Accounts in any organizational directory** (under **Supported account types**), and then select **Yes** for **Allow public client flows**.

### Example using InteractiveBrowserCredential

The following example demonstrates using an [`InteractiveBrowserCredential`](/python/api/azure-identity/azure.identity.interactivebrowsercredential) to authenticate with the [`SubscriptionClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.subscriptions.v2019_06_01.subscriptionclient):

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_interactive_browser.py":::

For more exact control, such as setting redirect URIs, you can supply specific arguments to `InteractiveBrowserCredential` such as `redirect_uri`.

## Device code authentication

This method interactively authenticates a user on devices with limited UI (typically devices without a keyboard):

1. When the application attempts to authenticate, the credential prompts the user with a URL and an authentication code.
1. The user visits the URL on a separate browser-enabled device (a computer, smartphone, etc.) and enters the code.
1. The user follows a normal authentication process in the browser.
1. Upon successful authentication, the application is authenticated on the device.

For more information, see [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](/azure/active-directory/develop/v2-oauth2-device-code).

Device code authentication in a development environment enables the same broad permissions as [CLI-based authentication](#cli-based-authentication) and should be used with the same [precautions](#precautions). However, you can use this method with a specific client ID, rather than the default, for which you can assign specific permissions.

### Enable applications for device code authentication

To enable applications for device code authentication, follow the steps under [Enable applications for interactive browser authentication](#enable-applications-for-interactive-browser-authentication).

### Example using DeviceCodeCredential

The following example demonstrates using a [`DeviceCodeCredential`](/python/api/azure-identity/azure.identity.devicecodecredential) to authenticate with the [`SubscriptionClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.subscriptions.v2019_06_01.subscriptionclient):

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_device_code.py":::

## Authentication through Visual Studio Code

The ['VisualStudioCodeCredential](/python/api/azure-identity/azure.identity.visualstudiocodecredential) authenticates using the credentials with which the user signs in to the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account). The user must first sign in using the **Azure: Sign In** command in the Visual Studio Code command palette, which opens a browser to initiate a sign-in flow. Once sign-in is completed, any other independent application (such as other development tools) can use this credential to authenticate with Azure. Applications need not be running in Visual Studio Code, and Visual Studio Code itself doesn't need to be running.

### Example using VisualStudioCodeCredential

The following example demonstrates using a ['VisualStudioCodeCredential`](/python/api/azure-identity/azure.identity.visualstudiocodecredential) to authenticate with the [`SubscriptionClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.subscriptions.v2019_06_01.subscriptionclient):

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_vscode.py":::

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

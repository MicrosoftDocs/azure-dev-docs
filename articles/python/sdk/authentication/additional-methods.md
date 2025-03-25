---
title: Additional methods to authenticate to Azure resources from Python apps
description: This article describes additional, less common methods you can use to authenticate your Python app to Azure resources. 
ms.date: 03/25/2025
ms.topic: how-to
ms.custom: devx-track-python, passwordless-python
---

# Additional methods to authenticate to Azure resources from Python apps

This article lists additional methods that apps can use to authenticate to Azure resources. The methods in this article are less commonly used; when possible, we encourage you to use one of the methods outlined in [authenticating Python apps to Azure using the Azure SDK overview](./overview.md).

## Interactive browser authentication

This method interactively authenticates an application through [`InteractiveBrowserCredential`](/python/api/azure-identity/azure.identity.interactivebrowsercredential) by collecting user credentials in the default system.

Interactive browser authentication enables the application for all operations allowed by the interactive login credentials. As a result, if you're the owner or administrator of your subscription, your code has inherent access to most resources in that subscription without having to assign any specific permissions. For this reason, the use of interactive browser authentication is discouraged for anything but experimentation.

### Enable applications for interactive browser authentication

Perform the following steps to enable the application to authenticate through the interactive browser flow. These steps also work for [device code authentication](#device-code-authentication) described later. Following this process is necessary only if using `InteractiveBrowserCredential` in your code.

1. On the [Azure portal](https://portal.azure.com), navigate to Microsoft Entra ID and select **App registrations** on the left-hand menu.
1. Select the registration for your app, then select **Authentication**.
1. Under **Advanced settings**, select **Yes** for **Allow public client flows**.
1. Select **Save** to apply the changes.
1. To authorize the application for specific resources, navigate to the resource in question, select **API Permissions**, and enable **Microsoft Graph** and other resources you want to access. Microsoft Graph is usually enabled by default.

    > [!IMPORTANT]
    > You must also be the admin of your tenant to grant consent to your application when you sign in for the first time.

If you can't configure the device code flow option on your Active Directory, your application might need to be multitenant. To make this change, navigate to the **Authentication** panel, select **Accounts in any organizational directory** (under **Supported account types**), and then select **Yes** for **Allow public client flows**.

### Example using InteractiveBrowserCredential

The following example demonstrates using an [`InteractiveBrowserCredential`](/python/api/azure-identity/azure.identity.interactivebrowsercredential) to authenticate with the [`SubscriptionClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.subscriptions.v2019_06_01.subscriptionclient):

:::code language="python" source="~/../python-sdk-docs-examples/show_subscription/use_interactive_browser.py":::

For more exact control, such as setting redirect URIs, you can supply specific arguments to `InteractiveBrowserCredential` such as `redirect_uri`.

## Interactive brokered authentication

This method interactively authenticates an application through [`InteractiveBrowserBrokerCredential`](/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential) by collecting user credentials using the system authentication broker. This credential type is provided in the Azure Identity Broker plugin, [azure-identity-broker](https://pypi.org/project/azure-identity-broker/).

A system authentication broker is an app running on a user’s machine that manages the authentication handshakes and token maintenance for all connected accounts. Currently, only the Windows authentication broker, Web Account Manager (WAM), is supported. Users on macOS and Linux will be authenticated through a browser.

Personal Microsoft accounts and work or school accounts are supported. If a supported version of Windows is used, the default browser-based UI is replaced with a smoother authentication experience, similar to Windows built-in apps.

Interactive brokered authentication enables the application for all operations allowed by the interactive login credentials. As a result, if you're the owner or administrator of your subscription, your code has inherent access to most resources in that subscription without having to assign any specific permissions.

### Enable applications for interactive brokered authentication

Perform the following steps to enable the application to authenticate through the interactive broker flow.

1. On the [Azure portal](https://portal.azure.com), navigate to Microsoft Entra ID and select **App registrations** on the left-hand menu.
1. Select the registration for your app, then select **Authentication**.
1. Add the WAM redirect URI to your app registration via a platform configuration:
    1. Under **Platform configurations**, select **+ Add a platform**.
    1. Under **Configure platforms**, select the tile for your application type (platform) to configure its settings; For example, **mobile and desktop applications**.
    1. In **Custom redirect URIs**, enter the WAM redirect URI:

        ```text
        ms-appx-web://microsoft.aad.brokerplugin/{client_id}
        ```

         The `{client_id}` placeholder must be replaced with the Application (client) ID listed on the Overview pane of the app registration.

    1. Select **Configure**.

    To learn more, see [Add a redirect URI to an app registration](/entra/identity-platform/quickstart-register-app#add-a-redirect-uri).

1. Back on the **Authentication** pane, under **Advanced settings**, select **Yes** for **Allow public client flows**.
1. Select **Save** to apply the changes.
1. To authorize the application for specific resources, navigate to the resource in question, select **API Permissions**, and enable **Microsoft Graph** and other resources you want to access. Microsoft Graph is usually enabled by default.

    > [!IMPORTANT]
    > You must also be the admin of your tenant to grant consent to your application when you sign in for the first time.

### Example using InteractiveBrowserBrokerCredential

The following example demonstrates using an [`InteractiveBrowserBrokerCredential`](/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential) to authenticate with the [`BlobServiceClient`](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient):

```python
import win32gui
from azure.identity.broker import InteractiveBrowserBrokerCredential
from azure.storage.blob import BlobServiceClient

# Get the handle of the current window
current_window_handle = win32gui.GetForegroundWindow()

# To authenticate and authorize with an app, use the following line to get a credential and
# substitute the <app_id> and <tenant_id> placeholders with the values for your app and tenant.
# credential = InteractiveBrowserBrokerCredential(parent_window_handle=current_window_handle, client_id=<app_id>, tenant_id=<tenant_id>)
credential = InteractiveBrowserBrokerCredential(parent_window_handle=current_window_handle)
client = BlobServiceClient("https://<storage-account-name>.blob.core.windows.net/", credential=credential)

# Prompt for credentials appears on first use of the client
for container in client.list_containers():
    print(container.name)
```

For more exact control, such as setting a timeout, you can supply specific arguments to `InteractiveBrowserBrokerCredential` such as `timeout`.

For the code to run successfully, your user account must be assigned an Azure role on the storage account that allows access to blob containers like "Storage Account Data Contributor". If an app is specified, it must have API permissions set for **user_impersonation Access Azure Storage** (step 6 in the previous section). This API permission allows the app to access Azure storage on behalf of the signed-in user after consent is granted during sign-in.

The following screenshot shows the user sign-in experience:

:::image type="content" source="../media/web-account-manager-sign-in-account-picker.png" alt-text="A screenshot that shows the sign-in experience when using the interactive browser broker credential to authenticate a user." :::

### Authenticate the default system account via WAM

Many people always sign in to Windows with the same user account and, therefore, only ever want to authenticate using that account. Forcing such individuals to repeatedly select their sole account from an account picker can be aggravating. Fortunately, `InteractiveBrowserBrokerCredential` offers a way for you to enable such individuals to sign in silently with the default system account, which, on Windows, is the signed-in user.

To enable sign-in with the default system account:

1. Make sure you use `azure-identity-broker` version 1.1.0 or greater.

2. Set the `use_default_broker_account` argument to `True` when you create an instance of `InteractiveBrowserBrokerCredential`.  

The following example shows how to enable sign-in with the default system account:

```python
import win32gui
from azure.identity.broker import InteractiveBrowserBrokerCredential

# code omitted for brevity

window_handle = win32gui.GetForegroundWindow()

credential = InteractiveBrowserBrokerCredential(
    parent_window_handle=window_handle,
    use_default_broker_account=True
)
```

Once you opt into this behavior, the credential type attempts to sign in by asking the underlying Microsoft Authentication Library (MSAL) to perform the sign-in for the default system account. If the sign-in fails, the credential type falls back to displaying the account picker dialog, from which the user can select the appropriate account.

## Device code authentication

This method interactively authenticates a user on devices with limited UI (typically devices without a keyboard):

1. When the application attempts to authenticate, the credential prompts the user with a URL and an authentication code.
1. The user visits the URL on a separate browser-enabled device (a computer, smartphone, etc.) and enters the code.
1. The user follows a normal authentication process in the browser.
1. Upon successful authentication, the application is authenticated on the device.

For more information, see [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](/azure/active-directory/develop/v2-oauth2-device-code).

Device code authentication in a development environment enables the application for all operations allowed by the interactive login credentials. As a result, if you're the owner or administrator of your subscription, your code has inherent access to most resources in that subscription without having to assign any specific permissions. However, you can use this method with a specific client ID, rather than the default, for which you can assign specific permissions.

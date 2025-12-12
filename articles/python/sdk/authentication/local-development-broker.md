---
title: Authenticate Python apps to Azure using brokered authentication.
description: Learn how to authenticate your app to Azure services when using the Azure SDK for Python during local development using brokered authentication.
ms.date: 11/24/2025
ms.topic: how-to
ms.custom: devx-track-python, passwordless-python
zone_pivot_group_filename: developer/python/python-zone-pivot-groups.json
zone_pivot_groups: operating-systems-set-one
---

# Authenticate Python apps to Azure services during local development using brokered authentication

[!INCLUDE [broker-intro](../../../includes/authentication/includes/broker-intro.md)]


:::zone target="docs" pivot="os-windows"

[!INCLUDE [broker-windows](../../../includes/authentication/includes/broker-windows.md)]

:::zone-end

:::zone target="docs" pivot="os-macos"

[!INCLUDE [broker-mac](../../../includes/authentication/includes/broker-mac.md)]

:::zone-end

:::zone target="docs" pivot="os-linux"

[!INCLUDE [broker-linux](../../../includes/authentication/includes/broker-linux.md)]

:::zone-end

[!INCLUDE [broker-configure-app](../../../includes/authentication/includes/broker-configure-app.md)]

[!INCLUDE [broker-assign-roles](../../../includes/authentication/includes/broker-assign-roles.md)]

## Implement the code

:::zone target="docs" pivot="os-windows"

The following example demonstrates using an [`InteractiveBrowserBrokerCredential`](/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential) to authenticate with the [`BlobServiceClient`](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient):

1. Install the packages. `pywin32` will be used in Windows to retrieve the window currently in the foreground.

   ```cmd
   pip install azure-identity-broker pywin32
   ```

2. Get a reference to the parent window on top of which the account picker dialog should appear. In the code example below, that will be the line:

   ```python
   current_window_handle = win32gui.GetForegroundWindow()
   ```

3. Create an instance of `InteractiveBrowserBrokerCredential` passing in the parent window reference. In the final code example, that will be the line:

   ```python
   credential = InteractiveBrowserBrokerCredential(parent_window_handle=current_window_handle)
   ```

4. Use the `credential` to access the Azure service, which is Blob Storage in this example.

Here's the final code example:

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

For the code to run successfully, your user account must be assigned an Azure role on the storage account that allows access to blob containers like **Storage Account Data Contributor**. If an app is specified, it must have API permissions set for **user_impersonation Access Azure Storage** (step 6 in the previous section). This API permission allows the app to access Azure storage on behalf of the signed-in user after consent is granted during sign-in.

The following screenshot shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-web-account-manager-account-picker.png" alt-text="A screenshot that shows the Windows sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user.":::

:::zone-end

:::zone target="docs" pivot="os-macos"

> [!Important]
> macOS support exists in `azure-identity-broker` versions 1.3.0 and later.

The following example demonstrates using an [`InteractiveBrowserBrokerCredential`](/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential) to authenticate with the [`BlobServiceClient`](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient).


1. Install the packages. `msal` (Microsoft Authentication Library) is used to provide a constant for the `parent_window_handle` parameter.

   ```bash
   pip install azure-identity-broker msal
   ```

2. Create an instance of `InteractiveBrowserBrokerCredential` passing in the parent window reference. This requires you to get a reference to the parent window on top of which the account picker dialog should appear (provided by the `msal` module). In the code example below, that will be the line:

   ```python
   credential = InteractiveBrowserBrokerCredential(
       parent_window_handle=msal.PublicClientApplication.CONSOLE_WINDOW_HANDLE
   )
   ```
3. Use the `credential` to access the Azure Service, which is Blob Storage in this example.

Here's the final code example:

```python
from azure.identity.broker import InteractiveBrowserBrokerCredential
from azure.storage.blob import BlobServiceClient
import msal

credential = InteractiveBrowserBrokerCredential(
    parent_window_handle=msal.PublicClientApplication.CONSOLE_WINDOW_HANDLE
)

client = BlobServiceClient("https://<storage-account-name>.blob.core.windows.net/", credential=credential)

# Prompt for credentials appears on first use of the client
for container in client.list_containers():
    print(container.name)
```

For more information about using MSAL Python with authentication brokers on macOS, see [Using MSAL Python with an Authentication Broker on macOS](/entra/msal/python/advanced/macos-broker).

For more exact control, such as setting a timeout, you can supply specific arguments to `InteractiveBrowserBrokerCredential` such as `timeout`.

For the code to run successfully, your user account must be assigned an Azure role on the storage account that allows access to blob containers like **Storage Account Data Contributor**. If an app is specified, it must have API permissions set for **user_impersonation Access Azure Storage** (step 6 in the previous section). This API permission allows the app to access Azure storage on behalf of the signed-in user after consent is granted during sign-in.

The following screenshot shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-macos-account-picker.png" alt-text="A screenshot that shows the macOS sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user.":::

:::zone-end

:::zone target="docs" pivot="os-linux"

> [!Important]
> Linux support exists in `azure-identity-broker` versions 1.3.0 and later.

The following example demonstrates using an [`InteractiveBrowserBrokerCredential`](/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential) to authenticate with the [`BlobServiceClient`](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient):

1. Install the packages. `msal` (Microsoft Authentication Library) is used to provide a constant for the `parent_window_handle` parameter.

   ```bash
   pip install azure-identity-broker msal
   ```

2. Create an instance of `InteractiveBrowserBrokerCredential` passing in the parent window reference. This requires you to get a reference to the parent window on top of which the account picker dialog should appear (provided by the `msal` module). In the code example below, that will be the line:

   ```python
   credential = InteractiveBrowserBrokerCredential(
       parent_window_handle=msal.PublicClientApplication.CONSOLE_WINDOW_HANDLE
   )
   ```
3. Use the `credential` to access the Azure service, which is Blob Storage in this example.

Here's the final code example:

```python
from azure.identity.broker import InteractiveBrowserBrokerCredential
from azure.storage.blob import BlobServiceClient
import msal

credential = InteractiveBrowserBrokerCredential(
    parent_window_handle=msal.PublicClientApplication.CONSOLE_WINDOW_HANDLE
)

client = BlobServiceClient("https://<storage-account-name>.blob.core.windows.net/", credential=credential)

# Prompt for credentials appears on first use of the client
for container in client.list_containers():
    print(container.name)
```

Make sure you have the [Linux dependencies](/entra/msal/python/advanced/linux-broker-py?tabs=ubuntudep#linux-dependencies) installed on your Linux distribution before running this code example. Also, there are [separate instructions](/entra/msal/python/advanced/linux-broker-py-wsl?tabs=ubuntudep#linux-package-dependencies) for WSL depending on the distribution.

For more exact control, such as setting a timeout, you can supply specific arguments to `InteractiveBrowserBrokerCredential` such as `timeout`.

For the code to run successfully, your user account must be assigned an Azure role on the storage account that allows access to blob containers like **Storage Account Data Contributor**. If an app is specified, it must have API permissions set for **user_impersonation Access Azure Storage** (step 6 in the previous section). This API permission allows the app to access Azure storage on behalf of the signed-in user after consent is granted during sign-in.

The following video shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-linux-login.gif" alt-text="An animated gif that shows the Linux sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user.":::

:::zone-end
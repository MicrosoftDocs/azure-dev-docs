---
title: Additional methods to authenticate to Azure resources from Go apps
description: This article describes additional, less common methods you can use to authenticate your Go app to Azure resources. 
ms.date: 03/25/2025
ms.topic: how-to
ms.custom: devx-track-go, passwordless-go
---

# Additional methods to authenticate to Azure resources from Go apps

This article lists additional methods that apps can use to authenticate to Azure resources. The methods in this article are less commonly used; when possible, we encourage you to use one of the methods outlined in [authenticating Go apps to Azure using the Azure SDK overview](./authentication-overview.md).

## Interactive browser authentication

This method interactively authenticates an application through [`InteractiveBrowserCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#InteractiveBrowserCredential) by collecting user credentials in the default system.

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

The following example demonstrates using an [`InteractiveBrowserCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#InteractiveBrowserCredential) to authenticate with the [`SubscriptionClient`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/subscription/armsubscription#SubscriptionsClient) in [`armsubscription`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/subscription/armsubscription) package:

```go
package main

import (
	"context"
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/subscription/armsubscription"
)

func main() {
	cred, err := azidentity.NewInteractiveBrowserCredential(nil)
	if err != nil {
		// TODO: handle error
	}
	ctx := context.Background()
	clientFactory, err := armsubscription.NewClientFactory(cred, nil)
	if err != nil {
		// TODO: handle error
	}
	res, err := clientFactory.NewSubscriptionsClient().Get(ctx, "<your_subscription_id>", nil)
	if err != nil {
		// TODO: handle error
	}
	// You could use response here. We use blank identifier for just demo purposes.
	_ = res
}
```

For more exact control, such as setting redirect URIs, you can supply specific arguments such as `RedirectURL` to `InteractiveBrowserCredential` via the [`InteractiveBrowserCredentialOptions`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#InteractiveBrowserCredentialOptions) type.

## Device code authentication

This method interactively authenticates a user on devices with limited UI (typically devices without a keyboard):

1. When the application attempts to authenticate, the credential prompts the user with a URL and an authentication code.
1. The user visits the URL on a separate browser-enabled device (a computer, smartphone, etc.) and enters the code.
1. The user follows a normal authentication process in the browser.
1. Upon successful authentication, the application is authenticated on the device.

For more information, see [Microsoft identity platform and the OAuth 2.0 device authorization grant flow](/entra/identity-platform/v2-oauth2-device-code).

Device code authentication in a development environment enables the application for all operations allowed by the interactive login credentials. As a result, if you're the owner or administrator of your subscription, your code has inherent access to most resources in that subscription without having to assign any specific permissions. However, you can use this method with a specific client ID, rather than the default, for which you can assign specific permissions.

Use [`DeviceCodeCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DeviceCodeCredential) type from [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to implement device code authentication.

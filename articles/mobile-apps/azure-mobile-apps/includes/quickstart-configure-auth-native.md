---
ms.topic: include
ms.date: 10/13/2023
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Configure your backend for authentication

To configure your backend for authentication, you must:

* Create an app registration.
* Configure [Azure App Service Authentication and Authorization](/azure/app-service/configure-authentication-provider-aad#-configure-with-advanced-settings).

During this tutorial, you configure your app to use Microsoft authentication, which uses configuration within Microsoft Entra ID.  A Microsoft Entra ID tenant has been configured automatically in your Azure subscription.

You need the backend URL of the Azure Mobile Apps service that was provided when you provisioned your service.

Configuring Azure Mobile Apps with native client authentication requires three steps:

1. Create an app registration in Microsoft Entra ID for your App Service app.
2. Enable Microsoft Entra ID in your App Service app.
3. Configure a native client application.

This process creates an **Application (client) ID** to identify your desktop app, and a **Scope** to identify the cloud backend. These settings are stored in your app code.

### Create an app registration for your App Service

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Microsoft Entra ID** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.  Enter `appservice-zumoqs` to distinguish it from the client app registration you complete later.
1. In **Redirect URI**, select **Web** and type `<backend-url>/.auth/login/aad/callback`. Replace `<backend-url>` with the URL for your Azure Mobile Apps service. For example, `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.  
1. Select **Register**.
1. Copy the **Application (client) ID**.
1. Select **Expose an API** > **Set**.
1. Press **Accept**.
1. Select **Add a scope**.  Press **Save and continue** to confirm the Application ID URI.
    * In **Scope name**, enter `user_impersonation`.  
    * Leave the permission as **Admins only**.
    * In the text boxes, enter the consent scope name and description you want users to see on the consent page.  For example, "Access the Todo Items."
    * Select **Add scope**.

### Enable Microsoft Entra ID in your App Service

1. In the [Azure portal](https://portal.azure.com), select [**All Resources**](https://portal.azure.com/#blade/HubsExtension/BrowseAll), then your App Service.
1. Select **Settings** > **Authentication**.
1. Press **Add identity provider**.
1. Select **Microsoft** as the identity provider.

    * For **App registration type**, select **Provide the details of an existing app registration**.
    * Paste the value you copied earlier into the **Application (client) ID** box.
    * For **Issuer URL**, enter `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0`.  This URL is the "magic tenant url" for Microsoft logins.
    * For **Restrict access**, select **Require authentication**.
    * For **Unauthenticated request**, select **HTTP 401 Unauthorized**.

1. Press **Add**.

You're now ready to use Microsoft Entra ID for authentication in your app.

### Configure a native client application

Register a native client to allow authentication to Web APIs hosted in your app using a client library such as the Microsoft Identity Library (MSAL).

1. In the [Azure portal](https://portal.azure.com), select **Microsoft Entra ID** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.  Enter `native-zumoqs` to distinguish this one from the one used by the App Service.
1. Select **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<backend-url>/.auth/login/aad/callback`. Replace `<backend-url>` with the URL for your Azure Mobile Apps service. For example, `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Register**.
1. Copy the value of the **Application (client) ID**. The Application ID is stored in your application code.
1. Select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app.  If you don't see the app registration, make sure that you added the **user_impersonation** scope.
1. Under **Select permissions**, select **user_impersonation**, and then select **Add permissions**.
1. Select **Authentication** > **Add a platform** > **Mobile and desktop applications**.
1. Check the box next to `https://login.microsoftonline.com/common/oauth2/nativeclient`.  
1. Add `http://localhost` in the field for extra URIs.
1. Select **Configure**.

At this point, you have two pieces of information you need to transfer to the client app:

* The **Application (client) ID** of the native client application registration.
* The **Scope** (found under API permissions in the native client application registration - click on the `user_impersonation` permission to see the full form).  A scope looks similar to `api://<client-id>/user_impersonation`. The client ID isn't the same as the client ID of the native client application.

> **DID YOU KNOW?**
> You can also authenticate users with organizational accounts in Microsoft Entra ID, Facebook, Google, Twitter, or any OpenID Connect compatible provider.  For more information, see the [Azure App Service documentation](/azure/app-service/app-service-authentication-how-to).

---
ms.topic: include
ms.date: 05/05/2021
author: adrianhall
ms.author: adhal
---

## Configure your backend for authentication

To configure your backend for authentication, you must:

* Create an app registration.
* Configure Azure App Service Authentication and Authorization.

During this tutorial, we will configure your app to use Microsoft authentication, which uses configuration within Azure Active Directory.  An Azure Active Directory tenant has been configured automatically in your Azure subscription.

To complete this tutorial, you will need to know the Backend URL for your application.  This was provided when you created your project.

For more information on configuring Authentication and Authorization with Azure Active Directory, review the [Azure App Service documentation](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad#-configure-with-advanced-settings)

Configuring Azure Mobile Apps with native client authentication requires three steps:

1. Create an app registration in Azure AD for your App Service app.
2. Enable Azure Active Directory in your App Service app.
3. Configure a native client application.

At the end of the process, you will have an **Application (client) ID** to identify your desktop app and a **Scope** that identifies the cloud backend. You will store these in the code for your desktop application.

### Create an app registration for your App Service

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.  For convenience, you may want to enter `appservice-zumoqs` to distinquish it from the client app registration you will complete later.
1. In **Redirect URI**, select **Web** and type `<app-url>/.auth/login/aad/callback`. Substitute your `BackendUrl` for `<app-url>`. For example, `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.  
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** as you will need it during the next section.
1. Select **Expose an API** > **Set**. Make a note of the application ID URI as you will need it in the next section.  Click **Accept**.
1. Select **Add a scope**.  Press **Save and continue** to confirm the Application ID URI.

    a. In **Scope name**, enter `user_impersonation`.  
    b. Leave the permission as **Admins only**.
    c. In the test boxes, enter the consent scope name and description you want users to see on the consent page.  For example, "Access the ZUMO Quickstart data".
    d. Select **Add scope**.

### Enable Azure Active Directory in your App Service

1. In the [Azure portal](https://portal.azure.com), search for and select **App Services**, then select your app.  Alternatively, you can select your resource group and then your app.
1. In the left pane, under **Settings**, select **Authentication / Authorization** > **On**.
1. By default, App Service authentication allows unauthenticated access to your app.  To enforce user authentication, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**.
1. Under **Authentication Providers**, select **Azure Active Directory**.
1. In **Management mode**, select **Advanced**.
1. In **Client ID**, enter the **Application (client) ID** for the app registration you configured earlier.
1. In **Issuer Url**, enter `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0`.  This is the "magic tenant url" for Microsoft logins.
1. Select **OK**, and then select **Save**.

You are now ready to use Azure Active Directory for authentication in your App Service app.

### Configure a native client application

You can register native clients to allow authentication to Web API's hosted in your app using a client library such as the Microsoft Identity Library (MSAL).

1. In the [Azure portal](https://portal.azure.com), select **Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.  You may want to use the name `native-zumoqs` to distinguish this one from the one used by the App Service.
1. Select **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<app-url>/.auth/login/aad/callback`. Substitute your `BackendUrl` for `<app-url>`. For example, `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the value of the **Application (client) ID**.  This is required later on to store in your app code.
1. Select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app.  If you don't see the app registration, make sure that you've added the **user_impersonation** scope.
1. Under **Select permissions**, select **user_impersonation**, and then select **Add permissions**.
1. Select **Authentication** > **Add a platform** > **Mobile and desktop applications**.
1. Check the box next to `https://login.microsoftonline.com/common/oauth2/nativeclient`.  Also, add `http://localhost` in the box for additional URIs.
1. Select **Configure**.

At this point, you have two pieces of information you need to transfer to the client app:

* The **Application (client) ID** of the native client application registration.
* The **Scope** (found under API permissions in the native client application registration - click on the user_impersonation permission tp see the full form).  This will be of the form `api://<client-id>/user_impersonation`. The client-id here will not be the same as the client ID of the native client application.

> **DID YOU KNOW?**
> You can also authenticate users with organizational accounts in Azure Active Directory, Facebook, Google, Twitter, or any OpenID Connect compatible provider.  Follow the instructions in the [Azure App Service documentation](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to).

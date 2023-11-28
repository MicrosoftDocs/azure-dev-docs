---
ms.topic: include
ms.date: 10/13/2023
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Configure a native client application

You can register native clients to allow authentication to Web APIs hosted in your app using a client library such as the Microsoft Identity Library (MSAL).

1. In the [Azure portal](https://portal.azure.com), select **Microsoft Entra ID** > **App registrations** > **New registration**.
2. In the **Register an application** page:
    * enter a **Name** for your app registration.  You may want to use the name `native-quickstart` to distinguish this one from the one used by your backend service.
    * Select **Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
    * In **Redirect URI**:
        * Select **Public client (mobile & desktop)**
        * Enter the URL `quickstart://auth`
3. Select **Register**.
4. Select **API permissions** > **Add a permission** > **My APIs**.
5. Select the app registration you created earlier for your backend service.  If you don't see the app registration, make sure that you added the **access_as_user** scope.
   
   ![Screenshot of the scope registration in the Azure portal.](~/mobile-apps/azure-mobile-apps/media/quickstart/common/register-native-app.png)

6. Under **Select permissions**, select **access_as_user**, and then select **Add permissions**.
7. Select **Authentication** > **Mobile and desktop applications**.
8. Check the box next to `https://login.microsoftonline.com/common/oauth2/nativeclient`.
9. Check the box next to `msal{client-id}://auth` (replacing `{client-id}` with your application ID).
10. Select **Add URI**, then add `http://localhost` in the field for extra URIs.
11. Select **Save** at the bottom of the page.
12. Select **Overview**.  Make a note of the **Application (client) ID** (referred to as the _Native Client Application ID_) as you need it to configure the mobile app.

We have defined three redirect URLs:

* `http://localhost` is used by WPF applications.
* `https://login.microsoftonline.com/common/oauth2/nativeclient` is used by UWP applications.
* `msal{client-id}://auth` is used by mobile (Android and iOS) applications.

---
ms.topic: include
ms.date: 05/05/2021
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

## Configure your backend for authentication

To configure your backend for authentication, you must:

* Create an app registration.
* Configure Azure App Service Authentication and Authorization.
* Add your app to the Allowed External Redirect URLs.

During this tutorial, you configure your app to use Microsoft authentication.  A Microsoft Entra ID tenant has been configured automatically in your Azure subscription.  You can use Microsoft Entra ID to configure Microsoft authentication.

You need the backend URL of the Azure Mobile Apps service that was provided when you provisioned the service.

### Create an app registration

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Microsoft Entra ID** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter `zumoquickstart` in the **Name** field.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
1. In **Redirect URI**, select **Web** and type `<backend-url>/.auth/login/aad/callback`.  For example, if your backend URL is `https://zumo-abcd1234.azurewebsites.net`, you would enter `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.
1. Press the **Register** button at the bottom of the form.
1. Copy the **Application (client) ID**.
1. From the left pane, select **Certificates & secrets** > **New client secret**.
1. Enter a suitable description, select a validity duration, then select **Add**.
1. Copy the secret on the **Certificates & secrets** page.  The value isn't displayed again.
1. Select **Authentication**.
1. Under **Implicit grant and hybrid flows**, enable **ID tokens**.
1. Press **Save** at the top of the page.

> [!IMPORTANT]
> The client secret value (password) is an important security credential.  Don't share the password with anyone or distribute it within a client application.

### Configure Azure App Service Authentication and Authorization

1. In the [Azure portal](https://portal.azure.com), select [**All Resources**](https://portal.azure.com/#blade/HubsExtension/BrowseAll), then your App Service.
1. Select **Settings** > **Authentication**.
1. Press **Add identity provider**.
1. Select **Microsoft** as the identity provider.

    * For **App registration type**, select **Provide the details of an existing app registration**.
    * Paste the values you copied earlier into the **Application (client) ID** and **Client secret** boxes.
    * For **Issuer URL**, enter `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0`.  This URL is the "magic tenant url" for Microsoft logins.
    * For **Restrict access**, select **Require authentication**.
    * For **Unauthenticated request**, select **HTTP 401 Unauthorized**.

1. Press **Add**.
1. Once the authentication screen returns, press **Edit** next to Authentication settings.
1. In the **Allowed external redirect URLs** box, enter `zumoquickstart://easyauth.callback`.
1. Press **Save**.

Step 10 requires that all users are authenticated before accessing your backend.  You can provide fine-grained controls by adding code to your backend.

> **DID YOU KNOW?**
> You can also allow users with organizational accounts in Azure Active Directory, Facebook, Google, Twitter, or any OpenID Connect compatible provider.  Follow the instructions in the [Azure App Service documentation](/azure/app-service/app-service-authentication-how-to).

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

During this tutorial, we'll configure your app to use Microsoft authentication.  An Azure Active Directory tenant has been configured automatically in your Azure subscription.  You can use Azure Active Directory to configure Microsoft authentication.

You will need the URL of the Azure Mobile Apps service. The backend URL was provided when you created your project.

### Create an app registration

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter `zumoquickstart` in the **Name** field.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
1. In **Redirect URI**, select **Web** and type `<backend-url>/.auth/login/aad/callback`.  For example, if your backend URL is `https://zumo-abcd1234.azurewebsites.net`, you would enter `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.
1. Press the **Register** button at the bottom of the form.
1. Copy the **Application (client) ID**.
1. From the left pane, select **Certificates & secrets** > **New client secret**.
1. Enter a suitable description, select a validity duration, then select **Add**.
1. Copy the secret on the **Certificates & secrets** page.  The value won't be displayed again.
1. Select **Authentication**. 
1. Under **Implicit grant**, enable **ID tokens**.
1. Press **Save** at the top of the page.

> [!IMPORTANT]
> The client secret value (password) is an important security credential.  Don't share the password with anyone or distribute it within a client application.

### Configure Azure App Service Authentication and Authorization

1. In the [Azure portal](https://portal.azure.com), select [**All Resources**](https://portal.azure.com/#blade/HubsExtension/BrowseAll), then your App Service.
1. Select **Settings** > **Authentication / Authorization**.
1. Ensure that **App Service Authentication** is **On**.
1. Under **Authentication Providers**, select **Azure Active Directory**.
1. Select **Advanced** under **Management mode**.
1. Paste the Application (client) ID that you obtained earlier.
1. Enter `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0` into the **Issuer Url** field.  This URL is the "magic tenant url" for Microsoft logins.
1. Press **Show secret**.  Paste the client secret value into the field that appears.
1. Select **OK**.
1. Set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**.
1. In the **Allowed External Redirect URLs**, enter `zumoquickstart://easyauth.callback`.
1. Select **Save**.

Step 10 requires that all users are authenticated before accessing your backend.  You can provide fine-grained controls by adding code to your backend.  For more information, see the Server SDK How-to for [Node.js](~/mobile-apps/azure-mobile-apps/howto/server/nodejs.md) or [ASP.NET Framework](~/mobile-apps/azure-mobile-apps/howto/server/dotnet-framework.md).

> **DID YOU KNOW?**
> You can also allow users with organizational accounts in Azure Active Directory, Facebook, Google, Twitter, or any OpenID Connect compatible provider.  Follow the instructions in the [Azure App Service documentation](/azure/app-service/app-service-authentication-how-to).

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
* Add your app to the Allowed External Redirect URLs.

During this tutorial, we will configure your app to use Microsoft authentication, which uses configuration within Azure Active Directory.  An Azure Active Directory tenant has been configured automatically in your Azure subscription.

To complete this tutorial, you will need to know the Backend URL for your application.  This was provided when you created your project.

### Create an app registration

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter `zumoquickstart` in the **Name** field.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
1. In **Redirect URI**, select **Web** and type `<backend-url>/.auth/login/aad/callback`.  For example, if your backend URL is `https://zumo-abcd1234.azurewebsites.net`, you would enter `https://zumo-abcd1234.azurewebsites.net/.auth/login/aad/callback`.
1. Press the **Register** button at the bottom of the form.
1. Copy the **Application (client) ID**.  You will need it later.
1. From the left pane, select **Certificates & secrets** > **New client secret**.  Enter a suitable description, 1elect a validity duration, then select **Add**.
1. Copy the value that appears on the **Certificates & secrets** page.  You will need it later and it won't be displayed again.
1. Select **Authentication**. Under **Implicit grant**, enable **ID tokens** to allow OpenID Connect user sign-ins from App Service.
1. Press **Save** at the top of the page.

> **Important**
> The client secret value (password) is an important security credential.  Do not share the password with anyone or distribute it within a client application.

### Configure Azure App Service Authentication and Authorization

1. In the [Azure portal](https://portal.azure.com), select [**All Resources**](https://portal.azure.com/#blade/HubsExtension/BrowseAll), then your App Service.
1. Select **Settings** > **Authentication / Authorization**.
1. Ensure that **App Service Authentication** is **On**.
1. Under **Authentication Providers**, select **Azure Active Directory**.
1. Select **Advanced** under **Management mode**.
1. Paste the Application (client) ID that you obtained earlier.
1. Enter `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0` into the **Issuer Url** field.  This is a "magic tenant url" for Microsoft logins.
1. Press **Show secret**.  Paste the client secret value into the field that appears.
1. Select **OK**.
1. To restrict access to Microsoft account users, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**.
1. In the **Allowed External Redirect URLs**, enter `zumoquickstart://easyauth.callback`.
1. Select **Save**.

Step 10 requires that all users are authenticated prior to accessing your backend.  You can provide more fine-grained controls by adding code to your backend.  For more details on this, consult the Server SDK How-to for [Node.js](../../howto/server/nodejs.md) or [ASP.NET Framework](../../howto/server/dotnet-framework.md).

> **DID YOU KNOW?**
> You can also authenticate users with organizational accounts in Azure Active Directory, Facebook, Google, Twitter, or any OpenID Connect compatible provider.  Follow the instructions in the [Azure App Service documentation](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to).

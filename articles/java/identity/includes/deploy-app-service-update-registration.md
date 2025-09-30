---
author: bmitchell287
ms.author: brendm
ms.reviewer: givermei
ms.date: 08/21/2025
---

Because the redirect URI changes to your deployed app to Azure App Service, you also need to change the redirect URI in your Microsoft Entra ID app registration. Use the following steps to make this change:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Use the search box to search for your app registration - for example, `java-servlet-webapp-authentication`.

1. Open your app registration by selecting its name.

1. Select **Authentication** from the menu.

1. In the **Web** - **Redirect URIs** section, select **Add URI**.

1. Fill out the URI of your app, appending `/auth/redirect` - for example, `https://<your-app-name>.azurewebsites.net/auth/redirect`.

1. Select **Save**.

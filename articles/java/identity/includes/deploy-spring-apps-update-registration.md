---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

Because the redirect URI changes to your deployed app on Azure Spring Apps, you also need to change the redirect URI in your Microsoft Entra ID app registration. Use the following steps to make this change:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Use the search box to search for your app registration - for example, `java-servlet-webapp-authentication`.

1. Open your app registration by selecting its name.

1. Select **Authentication** from the menu.

1. In the **Web** - **Redirect URIs** section, select **Add URI**.

1. Fill out the URI of your app, appending `/login/oauth2/code/` - for example, `https://<cluster-name>-<app-name>.azuremicroservices.io/login/oauth2/code/`.

1. Select **Save**.

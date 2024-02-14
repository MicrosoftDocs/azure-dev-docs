---
ms.author: givermei
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

Since the redirect URI will change to your deployed Web App to Azure App Service, you will also need to change the redirect URI in your Micorosft Entra ID App Registration. 

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page. 
1. Use the search box to search for you app registration, for example `java-servlet-webapp-authentication`.
1. Open your app registration by clicking on its name. 
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect**, for example `https://<your-app-name>.azurewebsites.net/auth/redirect`.
1. Select **Save**. 

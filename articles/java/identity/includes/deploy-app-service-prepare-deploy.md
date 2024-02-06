---
ms.author: givermei
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

When you deploy your application to App Service, your redirect URL will change to the redirect URL of your deployed Web App instance. You will need to change these settings in your `properties file`.

1. Navigate to your app's `authentication.properties` file and change the value of `app.homePage` to your deployed app's domain name. For example, if you chose `example-domain` for your app name in the previous step, you must now use the value  `https://example-domain.azurewebsites.net`. Be sure that you have also changed the protocol from `http` to `https`.

```ini
# app.homePage is by default set to dev server address and app context path on the server
# for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
app.homePage=https://<your-app-name>.azurewebsites.net
```

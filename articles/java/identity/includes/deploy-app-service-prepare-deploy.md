---
ms.author: givermei
ms.date: 03/11/2024
---

When you deploy your application to App Service, your redirect URL changes to the redirect URL of your deployed Web App instance. You need to change these settings in your properties file.

1. Navigate to your app's *authentication.properties* file and change the value of `app.homePage` to your deployed app's domain name. For example, if you chose `example-domain` for your app name in the previous step, you must now use the value  `https://example-domain.azurewebsites.net`. Be sure that you've also changed the protocol from `http` to `https`.

```ini
# app.homePage is by default set to dev server address and app context path on the server
# for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
app.homePage=https://<your-app-name>.azurewebsites.net
```

1. After saving this file, you need to rebuild your app.

   ```bash
   mvn clean package
   ```

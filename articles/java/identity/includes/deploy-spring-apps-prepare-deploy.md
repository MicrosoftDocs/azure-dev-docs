---
ms.author: givermei
ms.date: 01/01/2024
---

When you deploy your application to Azure Spring Apps, your redirect URL changes to the redirect URL of your deployed app instance in Azure Spring Apps. You need to change these settings in your *application.yml* file.

1. Navigate to your app's *src\main\resources\application.yml* file and change the value of `post-logout-redirect-uri` to your deployed app's domain name, which is `https://<cluster-name>-<app-name>.azuremicroservices.io`. For example, if you chose `cluster-ms-identity-spring-boot-webapp` for your Azure Spring Apps instance in the previous step and `ms-identity-spring-boot-webapp` for your app name, you must now use the value `https://cluster-ms-identity-spring-boot-webapp-ms-identity-spring-boot-webapp.azuremicroservices.io`.

```ini
post-logout-redirect-uri: https://cluster-ms-identity-spring-boot-webapp-ms-identity-spring-boot-webapp.azuremicroservices.io
```

1. After saving this file, you need to rebuild your app.

   ```bash
   mvn clean package
   ```

---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

When you deploy your application to Azure Spring Apps, your redirect URL changes to the redirect URL of your deployed app instance in Azure Spring Apps. Use the following steps to change these settings in your *application.yml* file:

1. Navigate to your app's *src\main\resources\application.yml* file and change the value of `post-logout-redirect-uri` to your deployed app's domain name, as shown in the following example. For example, if you chose `cluster-ms-identity-spring-boot-webapp` for your Azure Spring Apps instance in the previous step and `ms-identity-spring-boot-webapp` for your app name, you must now use `https://cluster-ms-identity-spring-boot-webapp-ms-identity-spring-boot-webapp.azuremicroservices.io` for the `post-logout-redirect-uri` value.

   ```ini
   post-logout-redirect-uri: https://<cluster-name>-<app-name>.azuremicroservices.io
   ```

1. After saving this file, use the following command to rebuild your app:

   ```bash
   mvn clean package
   ```

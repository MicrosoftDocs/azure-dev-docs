---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 08/21/2025
---

When you deploy your application to Azure Container Apps, your redirect URL changes to the redirect URL of your deployed app instance in Azure Container Apps. Use the following steps to change these settings in your **application.yml** file:

1. Navigate to your app's **src\main\resources\application.yml** file and change the value of `post-logout-redirect-uri` to your deployed app's domain name, as shown in the following example. Be sure to replace `<API_NAME>` and `<default-domain-of-container-app-environment>` with your actual values. For example, with the default domain for your Azure Container App environment from the previous step and `ms-identity-api` for your app name, you would use `https://ms-identity-api.<default-domain>` for the `post-logout-redirect-uri` value.

   ```ini
   post-logout-redirect-uri: https://<API_NAME>.<default-domain-of-container-app-environment>
   ```

1. After saving this file, use the following command to rebuild your app:

   ```bash
   mvn clean package
   ```

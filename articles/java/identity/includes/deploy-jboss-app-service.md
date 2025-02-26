---
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
---

## Run the sample

### [Deploy to Azure App Service](#tab/appsvc)

The following sections show you how to deploy the sample to Azure App Service.

### Prerequisites

[!INCLUDE [deploy-app-service-intro.md](./deploy-app-service-intro.md)]

### Configure the Maven plugin

[!INCLUDE [deploy-jboss-app-service-configure-maven.md](./deploy-jboss-app-service-configure-maven.md)]

### Prepare the app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](./deploy-app-service-prepare-deploy.md)]

[!INCLUDE [deploy-jboss-app-service-secret-note.md](./deploy-jboss-app-service-secret-note.md)]

### Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-app-service-update-registration.md](./deploy-app-service-update-registration.md)]

### Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](./deploy-app-service-deploy.md)]

### [Run locally](#tab/local)

Before you can deploy to JBoss, use the following steps to make some configuration changes in the sample itself, and then build or rebuild the package:

1. In the sample, find the **application.properties** or **authentication.properties** file where you configured the client ID, tenant, redirect URL, and so on.

1. In this file, change references to `localhost:8080` or `localhost:8443` to the URL and port that JBoss runs on, which by default should be `localhost:9990`.

1. You also need to make the same change in the Azure app registration, where you set it in the Azure portal as the **Redirect URI** value on the **Authentication** tab.

Use the following steps to deploy the sample to JBoss EAP via the web console:

1. Start the JBoss server with **%JBOSS_HOME%\bin\standalone.bat**.

1. Navigate to the JBoss web console in your browser at `http://localhost:9990`.

1. Go to **Deployments**, select **Add**, and then upload the **.war** you built.

1. Most of the default settings should be fine except that you should name the application to match the redirect URI you set in the sample configuration or Azure app registration. That is, if the redirect URI is `http://localhost:9990/msal4j-servlet-auth/`, then you should name the application `msal4j-servlet-auth`.

1. Select the **.war** file you uploaded, select **En/Disable** and **Confirm** to start the application.

1. After the application starts, navigate to `http://localhost:9990/<application-name>/`, and you should be able to access the application.

---

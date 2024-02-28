---
ms.author: givermei
ms.date: 01/01/2024
---

#### [Deploy to Azure App Service](#tab/appsvc)

[!INCLUDE [deploy-app-service-intro.md](./deploy-app-service-intro.md)]

##### Configure the Maven plugin

[!INCLUDE [deploy-jboss-app-service-configure-maven.md](./deploy-jboss-app-service-configure-maven.md)]

##### Prepare the web app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](./deploy-app-service-prepare-deploy.md)]

[!INCLUDE [deploy-jboss-app-service-secret-note.md](./deploy-jboss-app-service-secret-note.md)]

##### Update your Microsoft Entra ID App Registration

[!INCLUDE [deploy-app-service-update-registration.md](./deploy-app-service-update-registration.md)]

##### Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](./deploy-app-service-deploy.md)]

#### [Run locally](#tab/local)

Before you can deploy to JBoss, you need to make some configuration changes in the sample itself and build or rebuild the package:

1. In the sample there is likely an *application.properties* or *authentication.properties* file where you configured the client ID, tenant, redirect URL, etc.

1. In the above mentioned steps, changed references to localhost:8080 or localhost:8443 to the URL/port JBoss runs on, which by default should be localhost:9990

1. You also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to JBoss EAP via the web console:

1. Start the JBoss server with %JBOSS_HOME%\bin\standalone.bat

1. Navigate to the JBoss web console in your browser, http://localhost:9990

1. Go to **Deployments**, select **Add**, and then upload the *.war* you built

1. Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:9990/msal4j-servlet-auth/ then you should name the application 'msal4j-servlet-auth'

1. Select the *.war* file you uploaded, click En/Disable, and Confirm to start the application

1. After the application starts, navigate to http://localhost:9990/{whatever you named the application}/, and you should be able to access the application

---

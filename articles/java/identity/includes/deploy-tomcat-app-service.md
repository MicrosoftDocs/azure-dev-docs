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

[!INCLUDE [deploy-tomcat-app-service-configure-maven.md](./deploy-tomcat-app-service-configure-maven.md)]

### Prepare the app for deployment

[!INCLUDE [deploy-app-service-prepare-deploy.md](./deploy-app-service-prepare-deploy.md)]

[!INCLUDE [deploy-tomcat-app-service-secret-note.md](./deploy-tomcat-app-service-secret-note.md)]

### Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-app-service-update-registration.md](./deploy-app-service-update-registration.md)]

### Deploy the app

[!INCLUDE [deploy-app-service-deploy.md](./deploy-app-service-deploy.md)]

### [Run locally](#tab/local)

To run the sample on Tomcat, use the following steps:

1. In your Tomcat installation, ensure that there's an entry in **tomcat/conf/server.xml** for the address you want to host your application on.

   By default, the samples just expect to connect to `http://localhost:8080 or https://localhost:8443`, as defined in the `app.homePage` value in the **authentication.properties** file.

1. Copy the **.war** file you generated with Maven to the **/webapps/** directory in your Tomcat installation, and start the Tomcat server.

1. After Tomcat starts, open your browser and navigate to whatever URL you defined in step 1 and you should be able to access the application.

---

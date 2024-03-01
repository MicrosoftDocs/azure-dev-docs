---
title: Deploy your Java WebLogic web app to WebLogic on Azure VMs
description: Shows you how to deploy a Java WebLogic web app with sign-in by Microsoft Entra account to WebLogic on Azure VMs.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy your Java WebLogic web app to WebLogic on Azure VMs

This guidance assumes you have run through any of the Java WebLogic web app examples for enabling security with Microsoft Entra ID.

## Prerequisites

- Make sure you have followed the guidance of [Deploy WebLogic Server on Azure Virtual Machine using the Azure portal](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine) to deploy a [Oracle WebLogic Server](https://www.oracle.com/java/weblogic/).

## Prepare the web app for deployment

When you deploy your application to Oracle WebLogic Server, your redirect URL changes to the redirect URL of the app on the Oracle WebLogic Server instance. You need to change these settings in your properties file.

1. Navigate to your app's *authentication.properties* file and change the value of `app.homePage` to your deployed app's domain name. This domain name has the form `http://<vm-host-name>:<port>/<your-app-path>`. You can get the host name and port from **adminConsoleURL** by removing `/console/`. If you're using the recommended sample app, the URL should be `http://<vm-host-name>:<port>/testwebapp/`, which should be similar to `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/`.

```ini
# app.homePage is by default set to dev server address and app context path on the server
# for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
app.homePage=http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/
```

1. After saving this file, you need to rebuild your app.

   ```bash
   mvn clean package
   ```

1. After rebuilding the app, follow the steps of [Deploy a Java EE application from Administration Console portal](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#deploy-a-java-ee-application-from-administration-console-portal) to redeploy the application with your current *.war* file.

## Update your Microsoft Entra ID app registration

Since the redirect URI changes to your deployed App on Oracle WebLogic Server, you also need to change the redirect URI in your Microsoft Entra ID App Registration.

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Use the search box to search for you app registration - for example, `java-servlet-webapp-authentication`.
1. Open your app registration by selecting its name.
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect** - for example, `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/auth/redirect`.
1. Select **Save**.

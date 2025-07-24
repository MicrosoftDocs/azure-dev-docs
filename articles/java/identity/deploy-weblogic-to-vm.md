---
title: Deploy Java WebLogic to WebLogic on Azure Virtual Machines
description: Shows you how to deploy a Java WebLogic web app with sign-in by Microsoft Entra account to WebLogic on Azure Virtual Machines.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: install-set-up-deploy
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Deploy Java WebLogic apps to WebLogic on Azure Virtual Machines

This article shows you how to deploy a Java WebLogic web app with sign-in by Microsoft Entra account to WebLogic on Azure Virtual Machines.

## Prerequisites

- Completion of one of the following articles for enabling security with Microsoft Entra ID:
  - [Enable sign-in for Java WebLogic apps using Microsoft Entra ID](enable-java-weblogic-webapp-authentication-entra-id.md)
  - [Enable sign-in for Java WebLogic apps using MSAL4J with Azure Active Directory B2C](enable-java-weblogic-webapp-authentication-azure-ad-b2c.md)
  - [Enable Java WebLogic apps to sign in users and access Microsoft Graph](enable-java-weblogic-webapp-authorization-entra-id.md)
  - [Secure Java WebLogic apps using roles and role claims](enable-java-weblogic-webapp-authorization-role-entra-id.md)
  - [Secure Java WebLogic apps using groups and group claims](enable-java-weblogic-webapp-authorization-group-entra-id.md)
- A deployed [Oracle WebLogic Server](https://www.oracle.com/java/weblogic/). For more information, see [Deploy WebLogic Server on Azure Virtual Machine using the Azure portal](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine).

## Prepare the app for deployment

When you deploy your application to Oracle WebLogic Server, your redirect URL changes to the redirect URL of the app on the Oracle WebLogic Server instance. Use the following steps to change these settings in your properties file:

1. Navigate to your app's **authentication.properties** file and change the value of `app.homePage` to your deployed app's domain name, as shown in the following example. This domain name has the form `http://<vm-host-name>:<port>/<your-app-path>`. You can get the host name and port from **adminConsoleURL** by removing `/console/`. If you're using the recommended sample app, the URL should be `http://<vm-host-name>:<port>/testwebapp/`, which should be similar to `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/`.

   ```ini
   # app.homePage is by default set to dev server address and app context path on the server
   # for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
   app.homePage=http://<vm-host-name>:<port>/<your-app-path>
   ```

1. After saving this file, use the following command to rebuild your app:

   ```bash
   mvn clean package
   ```

1. After rebuilding the app, follow the steps of [Deploy a Java EE application from Administration Console portal](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#deploy-a-java-ee-application-from-administration-console-portal) to redeploy the application with your current **.war** file.

## Update your Microsoft Entra ID app registration

Because the redirect URI changes to your deployed app on Oracle WebLogic Server, you also need to change the redirect URI in your Microsoft Entra ID app registration. Use the following steps to make this change:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Use the search box to search for your app registration - for example, `java-servlet-webapp-authentication`.

1. Open your app registration by selecting its name.

1. Select **Authentication** from the menu.

1. In the **Web** - **Redirect URIs** section, select **Add URI**.

1. Fill out the URI of your web app, appending `/auth/redirect` - for example, `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/auth/redirect`.

1. Select **Save**.

Your deployment is now complete.

## More information

- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)

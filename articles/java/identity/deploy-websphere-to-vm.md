---
title: Deploy WebSphere to Traditional WebSphere on Azure VMs
description: Shows you how to deploy a Java WebSphere web app with sign-in by Microsoft Entra account to Traditional WebSphere on Azure Virtual Machines.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Deploy Java WebSphere apps to Traditional WebSphere on Azure Virtual Machines

This article shows you how to deploy a Java WebSphere web app with sign-in by Microsoft Entra account to Traditional WebSphere on Azure Virtual Machines.

This guidance assumes you have through any of the Java WebSphere web app examples for enabling security with Microsoft Entra ID.

## Prerequisites

- A deployed [IBM WebSphere Application Server Cluster](https://aka.ms/websphere-on-azure-portal). For more information, see [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](../ee/traditional-websphere-application-server-virtual-machines.md).

## Prepare the web app for deployment

When you deploy your application to WebSphere Application Server, your redirect URL changes to the redirect URL of your deployed WebSphere Application Server instance. You need to change these settings in your properties file.

1. Navigate to your app's *authentication.properties* file and change the value of `app.homePage` to your server URL and port number you're planning to use.

   ```ini
   # app.homePage is by default set to dev server address and app context path on the server
   # for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
   app.homePage=https://<server-url>:<port-number>/msal4j-servlet-auth/
   ```

1. After saving this file, you need to rebuild your app.

   ```bash
   mvn clean package
   ```

1. After the code finishes building, copy the *.war* file over to your target server's file system.

## Update your Microsoft Entra ID app registration

Because the redirect URI changes to your deployed App on WebSphere, you also need to change the redirect URI in your Microsoft Entra ID App Registration.

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Use the search box to search for your app registration - for example, `java-servlet-webapp-authentication`.
1. Open your app registration by selecting its name.
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect** - for example, `https://<server-url>:<port-number>/auth/redirect`.
1. Select **Save**.

## Deploy the application

1. On the **Applications** tab, select **New Application**, then **New Enterprise Application**.

1. Choose the *.war* file you built, then select **Next** until you get to the **Map context roots for Web modules** installation step.

1. For the context root, set it to the same value as after the port number in the 'Redirect URI' you set in sample configuration/Azure app registration. That is, if the redirect URI is `http://<server-url>:9080/msal4j-servlet-auth/`, then the context root should just be `msal4j-servlet-auth`.

1. Select **Finish**.

1. After the application finishes installing, go to the **WebSphere enterprise applications** section of the **Applications** tab.

1. Select the *.war* file you installed from the list of applications and then select **Start** to deploy.

1. After it finishes deploying, navigate to `http://<server-url>:9080/{whatever you set as the context root}` and you should be able to see the application.

## Next steps

For more information and other deployment options, see the following articles:

- [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](../ee/traditional-websphere-application-server-virtual-machines.md)
- [What are solutions to run the IBM WebSphere family of products on Azure?](../ee/websphere-family.md)

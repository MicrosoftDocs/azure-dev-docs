---
title: Deploy your Java Websphere web app to Traditional WebSphere on Azure VMs
description: Shows you how to deploy a Java Websphere web app with sign-in by Microsoft Entra account to Traditional WebSphere on VMs.
services: active-directory
documentationcenter: java
ms.date: 01/01/2024
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Deploy your Java Websphere web app to Traditional WebSphere on Azure VMs

This guidance assumes you have run through any of the Java Websphere web app examples for enabling security with Microsoft Entra ID. 

## Prerequisites

- Make sure you have followed the guidance of [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](/azure/developer/java/ee/traditional-websphere-application-server-virtual-machines?tabs=basic) to deploy a [IBM WebSphere Application Server Cluster](https://aka.ms/websphere-on-azure-portal). 


## Prepare the web app for deployment

When you deploy your application to WebSphere Application Server, your redirect URL will change to the redirect URL of your deployed WebSphere Application Server instance. You will need to change these settings in your `properties file`.

1. Navigate to your app's `authentication.properties` file and change the value of `app.homePage` to your server URL and port number you are planning to use. 

    ```ini
    # app.homePage is by default set to dev server address and app context path on the server
    # for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
    app.homePage=https://<server-url>:<port-number>/msal4j-servlet-auth/
    ```

1. After saving this file, you will need to rebuild your app.

    ```
    mvn clean package
    ```

1. Once the code has build, copy the .war file over to your target server's file system. 

## Update your Microsoft Entra ID App Registration

Since the redirect URI will change to your deployed App on WebSphere, you will also need to change the redirect URI in your Micorosft Entra ID App Registration. 

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page. 
1. Use the search box to search for you app registration, for example `java-servlet-webapp-authentication`.
1. Open your app registration by clicking on its name. 
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect**, for example `https://<server-url>:<port-number>/auth/redirect`.
1. Select **Save**. 

## Deploy the application

1. In the 'Applications' tab, select 'New Application', then 'New Enterprise Application'

1. Choose the .war you built, then click 'next' until you get to the 'Map context roots for Web modules' installation step (the other default settings should be fine)

1. For the context root, set it to the same value as after the port number in the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is `http://<server-url>:9080/msal4j-servlet-auth/` then the context root should just be 'msal4j-servlet-auth'

1. Click 'Finish', and after the application finishes installing go to the 'Websphere enterprise applications' section of the 'Applications' tab

1. Select the .war you just installed from the list of applications and click 'Start' to deploy

1. One it finishes deploying, navigate to `http://<server-url>:9080/{whatever you set as the context root}` and you should be able to see the application

## Next Steps

For more information and other deployment options, see the following articles:

- [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](/azure/developer/java/ee/traditional-websphere-application-server-virtual-machines?tabs=basic)
- [What are solutions to run the IBM WebSphere family of products on Azure?](/azure/developer/java/ee/websphere-family)

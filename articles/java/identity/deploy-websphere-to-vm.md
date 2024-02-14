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

TODO TODO TODO, the below is **NOT** correct. 

When you deploy your application to WebSphere Application Server, your redirect URL will change to the redirect URL of your deployed WebSphere Application Server instance. You will need to change these settings in your `properties file`.

1. Navigate to your app's `authentication.properties` file and change the value of `app.homePage` to your deployed app's domain name. For example, if you chose `example-domain` for your app name in the previous step, you must now use the value  `https://example-domain.azurewebsites.net`. Be sure that you have also changed the protocol from `http` to `https`.

```ini
# app.homePage is by default set to dev server address and app context path on the server
# for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
app.homePage=https://<your-app-name>.azurewebsites.net
```

1. After saving this file, you will need to rebuild your app.

 ```
 mvn clean package
 ```

## Update your Microsoft Entra ID App Registration

TODO TODO TODO, the below is **NOT** correct. 

Since the redirect URI will change to your deployed App on WebSphere, you will also need to change the redirect URI in your Micorosft Entra ID App Registration. 

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page. 
1. Use the search box to search for you app registration, for example `java-servlet-webapp-authentication`.
1. Open your app registration by clicking on its name. 
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect**, for example `https://<your-app-name>.azurewebsites.net/auth/redirect`.
1. Select **Save**. 

## Deploy the app

TODO TODO TODO, the below is **NOT** correct. 

1. On the administrative console, select **Applications > New Application** and then select **New Enterprise Application**.

1. On the next panel, select **Remote file system** and then select **Browse…**. You're given the option to browse the file systems of your installed servers.

1. Select the system that begins with **Dmgr**. You're shown the Deployment Manager’s file system. From there, select **V9** and then **installableApps**. In that directory, you should see many applications available to install. Select **DefaultApplication.ear** and then select **OK**.

Then, you're taken back to the page for selecting the application, which should look like the following screenshot:

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/select-test-app-page.png" alt-text="Screenshot of IBM WebSphere 'Specify the EAR, WAR, JAR, or SAR module to upload and install' dialog.":::

Select **Next** and then **Next** to go with the **Fast Path** deployment process.

In the **Fast Path** wizard, use the defaults for everything except **Step 2: map modules to servers**. On that page, select the checkbox for the **Default Web Application Module** row, then hold Ctrl and select the options under **Clusters and servers**. Finally, select **Apply**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png":::

You should see new entries in the table under the **Server** column. These entries should look similar to the ones in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane showing and 'Server' table column highlighted." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png":::

After you’ve completed all the steps, select **Finish**, and then on the next page select **Save**.

Next, you need to start the application. Go to **Applications > All Applications**. Select the checkbox for **DefaultApplication.ear**, ensure the **Action** is set to **Start**, and then select **Submit Action**.

You should see success messages that look similar to the ones in the following screenshot. If you see errors, it may be that you were too quick, and the app and configuration haven't reached the nodes yet.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png" alt-text="Screenshot of IBM WebSphere Messages pane." lightbox="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png":::

When you see the success messages, you can try the app. In your browser, navigate to the DNS name of the IHS deployment and add `/snoop`. You should see information similar to the following about the server instance that processed the request.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/test-app-running-page.png" alt-text="Screenshot of test application running in a browser.":::

When you refresh the browser, the app cycles through the server instances using the **Round Robin load-balancing policy**, which is the default policy for the Static Cluster deployment.

TODO TODO TODO, Add steps to navigate to the app??? 


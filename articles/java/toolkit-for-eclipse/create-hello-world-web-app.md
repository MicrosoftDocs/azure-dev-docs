---
title: Create a Hello World web app for Azure App Service using Eclipse
description: This tutorial shows you how to use the Azure Toolkit for Eclipse to create a Hello World Web App for Azure.
services: app-service
keywords: java, eclipse, web app, azure app service, hello world, quick start
documentationcenter: java
author: selvasingh
ms.assetid: 20d41e88-9eab-462e-8ee3-89da71e7a33f
ms.reviewer: asirveda
ms.date: 08/25/2020
ms.service: app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
ms.custom: devx-track-java
---

# Create a Hello World web app for Azure App Service using Eclipse

This article demonstrates the steps that are required to create a basic Hello World web app and publish your web app to Azure App Service by using the [Azure Toolkit for Eclipse](https://marketplace.eclipse.org/content/azure-toolkit-eclipse).

> [!NOTE]
>
> If you prefer using IntelliJ IDEA, check out our [similar tutorial for IntelliJ][intellij-hello-world].
>
>[!INCLUDE [quickstarts-free-trial-note](includes/quickstarts-free-trial-note.md)]
>
> Don't forget to clean up the resources after you complete this tutorial. In that case, running this guide will not exceed your free account quota.
>

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

## Installation and sign-in

The following steps walk you through the Azure sign in process in your Eclipse development environment.

1. If you haven't installed the plugin, see [Installing the Azure Toolkit for Eclipse](installation.md).

1. To sign in to your Azure account, click **Tools**, click **Azure**, and then click **Sign In**.

   :::image type="content" source="media/sign-in-instructions/eclipse-azure-signin.png" alt-text="Sign in to Azure in Eclipse IDE.":::

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in** ([other sign-in options](sign-in-instructions.md)).

1. Click **Copy&Open** in the **Azure Device Login** dialog.

1. In the browser, paste your device code (which has been copied when you clicked **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in.

1. Once signed in, close your browser and switch back to your Eclipse IDE. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then click **Select**.

### Install required software *(optional)*

To ensure you have required components to work with web app projects, follow these steps:

1. Click the **Help** menu, and then click **Install New Software**.

1. In the **Available Software** dialog, click **Manage**, and make sure the latest Eclipse version is selected (e.g. *2020-06*).

1. Click **Apply and Close**. Expand the *Work with:* dropdown menu to show suggested sites. Select the latest Eclipse version site to query available software.

1. Scroll down the list and select the **Web, XML, Java EE and OSGi Enterprise Development** item. Click **Next**.

1. In the Install Details window, click **Next**.

1. In the Review Licenses dialog, review the terms of the license agreements. If you accept the terms of the license agreements, click **I accept the terms of the license agreements** and then click **Finish**. 

   > [!NOTE]
   > You can check the installation progress on the lower-right corner of your Eclipse workspace.

1. If prompted to restart Eclipse to complete installation, click **Restart Now**.

## Creating a web app project

1. Click **File**, expand **New**, and then click **...Project**. Inside the New Project dialog window, expand **Web**, select **Dynamic Web Project**, and click **Next**.

   > [!TIP]
   > If you don't see **Web** listed as an available project, see [this section](#install-required-software-optional) to make sure you have the required Eclipse software.

1. For purposes of this tutorial, name the project **MyWebApp**. Your screen will appear similar to the following:
   
   ![New Dynamic Web Project properties][dynamic-web-project-properties]

1. Click **Finish**.

1. On the left-hand Package Explorer pane, expand **MyWebApp**. Right-click **WebContent**, hover over **New**, and then click **Other...**.

1. Expand **Web** to find the **JSP File** option. Click **Next**.

1. In the **New JSP File** dialog box, name the file **index.jsp**, keep the parent folder as **MyWebApp/WebContent**, and then click **Next**.

   ![New JSP File dialog box][new-jsp-file-dialog]

1. In the **Select JSP Template** dialog box, for purposes of this tutorial, select **New JSP File (html 5)**, and then click **Finish**.

1. When your index.jsp file opens in Eclipse, add in text to dynamically display **Hello World!** within the existing `<body>` element. Your updated `<body>` content should resemble the following example:
   
   ```jsp
   <body>
   <b><% out.println("Hello World!"); %></b>
   </body>
   ```
1. Save index.jsp.

## Deploying the web app to Azure

1. On the left-hand Package Explorer pane, right-click your project, choose **Azure**, and then choose **Publish as Azure Web App**.
   
   ![Publish as Azure Web App][publish-as-azure-web-app]

1. When the **Deploy Web App** dialog box appears, you can choose one of the following options:

   * Select an existing web app if one exists.

   * If you do not have an existing web app, click **Create**.

      Here you can configure the runtime environment, app service plan resource group, and app settings. Create new resources if necessary.

      Specify the requisite information for your web app in the **Create App Service** dialog box, and then click **Create**.

1. Select your web app and then click **Deploy**.

1. The toolkit will display a **Published** status under the **Azure Activity Log** tab when it has successfully deployed your web app, which is a hyperlink for the URL of your deployed web app.

1. You can browse to your web app using the link provided in the status message.

   ![Browsing your web app][browse-web-app]

## Cleaning up resources

1. After you have published your web app to Azure, you can manage it by right-clicking in Azure Explorer and selecting one of the options in the context menu. For example, you can **Delete** your web app here to clean up the resource for this tutorial.

   ![Manage app service][manage-app-service]

[!INCLUDE [show-azure-explorer](includes/show-azure-explorer.md)]

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

<!-- URL List -->

[Azure Toolkit for Eclipse]: /azure/developer/java/tookit-for-eclipse
[Azure Toolkit for IntelliJ]: ../toolkit-for-intellij
[intellij-hello-world]: ../toolkit-for-intellij/create-hello-world-web-app.md
[Web Apps Overview]: /azure/app-service/app-service-web-overview
[Apache Tomcat]: http://tomcat.apache.org/
[Jetty]: http://www.eclipse.org/jetty/

<!-- IMG List -->

[browse-web-app]: media/create-hello-world-web-app/browse-web-app.png
[dynamic-web-project-properties]: media/create-hello-world-web-app/dynamic-web-project-properties.png
[new-jsp-file-dialog]: media/create-hello-world-web-app/new-jsp-file-dialog.png
[publish-as-azure-web-app]: media/create-hello-world-web-app/publish-as-azure-web-app.png
[publish-status]: media/create-hello-world-web-app/publish-status.png
[manage-app-service]: media/create-hello-world-web-app/manage-app-service.png

---
title: Create a Hello World web app for Azure App Service using Eclipse
description: This tutorial shows you how to use the Azure Toolkit for Eclipse to create a Hello World Web App for Azure.
services: app-service
keywords: java, eclipse, web app, azure app service, hello world, quick start
documentationcenter: java
author: selvasingh
manager: routlaw
editor: ''

ms.assetid: 20d41e88-9eab-462e-8ee3-89da71e7a33f
ms.author: robmcm;asirveda
ms.date: 02/01/2018
ms.devlang: java
ms.service: app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# Create a Hello World web app for Azure App Service using Eclipse

Using open sourced [Azure Toolkit for Eclipse](https://marketplace.eclipse.org/content/azure-toolkit-eclipse) plugin, creating and deploying a basic Hello World application to Azure App Service as a web app can be done in a few minutes.

> [!NOTE]
>
> If you prefer using IntelliJ IDEA, check out our [similar tutorial for IntelliJ][intellij-hello-world].
>
>[!INCLUDE [quickstarts-free-trial-note](../includes/quickstarts-free-trial-note.md)]
>
> Don't forget to clean up the resources after you complete this tutorial. In that case, running this guide will not exceed your free account quota.
>

[!INCLUDE [azure-toolkit-for-intellij-basic-prerequisites](../includes/azure-toolkit-for-eclipse-basic-prerequisites.md)]

## Installation and sign-in

1. Drag the following button to your running Eclipse workspace to install the Azure Toolkit for Eclipse plugin ([other installation options](azure-toolkit-for-eclipse-installation.md)).

    [![Drag to your running Eclipse* workspace. *Requires Eclipse Marketplace Client](https://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png)](http://marketplace.eclipse.org/marketplace-client-intro?mpc_install=1919278 "Drag to your running Eclipse* workspace. *Requires Eclipse Marketplace Client")

1. To sign in to your Azure account, click **Tools**, then click **Azure**, and then click **Sign In**.
   ![Eclipse Menu for Azure Sign In][I01]

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in** ([other sign-in options](azure-toolkit-for-eclipse-sign-in-instructions.md)).

   ![The Azure Sign In window with device login selected][I02]

1. Click **Copy&Open** in **Azure Device Login** dialog .

   ![The Azure Login Dialog window][I03]

1. In the browser, paste your device code (which has been copied when you clicked **Copy&Open** in last step) and then click **Next**.

   ![The device login browser][I04]

1. Finally, in the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then click **OK**.

   ![The Select Subscriptions dialog box][I05]

## Creating web app project

1. Click **File**, click **New**, and then click **Dynamic Web Project**. (If you don't see **Dynamic Web Project** listed as an available project after clicking **File** and **New**, then do the following: click **File**, click **New**, click **Project...**, expand **Web**, click **Dynamic Web Project**, and click **Next**.)

   ![Creating a new Dynamic Web Project][file-new-dynamic-web-project]

2. For purposes of this tutorial, name the project **MyWebApp**. Your screen will appear similar to the following:
   
   ![New Dynamic Web Project properties][dynamic-web-project-properties]

3. Click **Finish**.

4. Within Eclipse's Project Explorer view, expand **MyWebApp**. Right-click **WebContent**, click **New**, and then click **JSP File**.

   ![Create new JSP file][create-new-jsp-file]

5. In the **New JSP File** dialog box, name the file **index.jsp**, keep the parent folder as **MyWebApp/WebContent**, and then click **Next**.

   ![New JSP File dialog box][new-jsp-file-dialog]

6. In the **Select JSP Template** dialog box, for purposes of this tutorial select **New JSP File (html)**, and then click **Finish**.

   ![Select JSP template][select-jsp-template]

7. When your index.jsp file opens in Eclipse, add in text to dynamically display **Hello World!** within the existing `<body>` element. Your updated `<body>` content should resemble the following example:
   
   ```jsp
   <body><b><% out.println("Hello World!"); %></b></body>
   ```

8. Save index.jsp.

## Deploying web app to Azure

1. Within Eclipse's Project Explorer view, right-click your project, choose **Azure**, and then choose **Publish as Azure Web App**.
   
   ![Publish as Azure Web App][publish-as-azure-web-app]

1. When the **Deploy Web App** dialog box appears, you can choose one of the following options:

   * Select an existing web app if one exists.

      ![Select app service][select-app-service]

   * Click **Create New Web App**.

      ![Create App Service][create-app-service]

      Specify the requisite information for your web app in the **Create App Service** dialog box, and then click **Create**.

      Here you can configure the runtime environment, app settings, service plan and resource group.

      ![Create App Service dialog box][create-app-service-dialog]

1. Select your web app and then click **Deploy**.

   ![Deploy app service][deploy-app-service]

1. The toolkit will display a **Published** status under the **Azure Activity Log** tab when it has successfully deployed your web app, which is a hyperlink for the URL of your deployed web app.

   ![Publish status][publish-status]

1. You can browse to your web app using the link provided in the status message.

   ![Browsing your web app][browse-web-app]

[!INCLUDE [azure-toolkit-for-eclipse-show-azure-explorer](../includes/azure-toolkit-for-eclipse-show-azure-explorer.md)]

## Cleaning up resources

1. After you have published your web app to Azure, you can manage it by right-clicking in Azure Explorer and selecting one of the options in the context menu. For example, you can **Delete** your web app here to clean up the resource for this tutorial.

   ![Manage app service][manage-app-service]

## Next steps

[!INCLUDE [azure-toolkit-for-eclipse-additional-resources](../includes/azure-toolkit-for-eclipse-additional-resources.md)]

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

<!-- URL List -->

[Azure Toolkit for Eclipse]: azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ../intellij/azure-toolkit-for-intellij.md
[intellij-hello-world]: ../intellij/azure-toolkit-for-intellij-create-hello-world-web-app.md
[Web Apps Overview]: /azure/app-service/app-service-web-overview
[Apache Tomcat]: http://tomcat.apache.org/
[Jetty]: http://www.eclipse.org/jetty/
[Legacy Version]: azure-toolkit-for-eclipse-create-hello-world-web-app-legacy-version.md

<!-- IMG List -->
[I01]: media/azure-toolkit-for-eclipse-sign-in-instructions/I01.png
[I02]: media/azure-toolkit-for-eclipse-sign-in-instructions/I02.png
[I03]: media/azure-toolkit-for-eclipse-sign-in-instructions/I03.png
[I04]: media/azure-toolkit-for-eclipse-sign-in-instructions/I04.png
[I05]: media/azure-toolkit-for-eclipse-sign-in-instructions/I05.png

[browse-web-app]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/browse-web-app.png
[file-new-dynamic-web-project]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/file-new-dynamic-web-project.png
[dynamic-web-project-properties]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/dynamic-web-project-properties.png
[create-new-jsp-file]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/create-new-jsp-file.png
[new-jsp-file-dialog]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/new-jsp-file-dialog.png
[select-jsp-template]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/select-jsp-template.png
[publish-as-azure-web-app]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/publish-as-azure-web-app.png
[deploy-web-app-dialog]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/deploy-web-app-dialog.png
[select-app-service]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/select-app-service.png
[create-app-service-dialog]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/create-app-service-dialog.png
[publish-status]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/publish-status.png
[create-app-service]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/create-app-service.png
[deploy-app-service]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/deploy-app-service.png
[manage-app-service]: ./media/azure-toolkit-for-eclipse-create-hello-world-web-app/manage-app-service.png

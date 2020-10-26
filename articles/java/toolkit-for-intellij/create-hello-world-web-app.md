---
title: Create a Hello World web app for Azure App Service using IntelliJ
description: This tutorial shows you how to use the Azure Toolkit for IntelliJ to create a Hello World Web App for Azure.
services: app-service
keywords: java, intellij, web app, azure app service, hello world, quick start
documentationcenter: java
author: selvasingh
ms.assetid: 75ce7b36-e3ae-491d-8305-4b42ce37db4e
ms.reviewer: asirveda
ms.date: 09/09/2020
ms.service: app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
ms.custom: devx-track-java
---

# Create a Hello World web app for Azure App Service using IntelliJ

This article demonstrates the steps that are required to create a basic Hello World web app and publish your web app to Azure App Service by using the [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

> [!NOTE]
>
> If you prefer using Eclipse, check out our [similar tutorial for Eclipse][eclipse-hello-world].
>
>[!INCLUDE [quickstarts-free-trial-note](includes/quickstarts-free-trial-note.md)]
>
> Don't forget to clean up the resources after you complete this tutorial. In that case, running this guide will not exceed your free account quota.
>

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

## Installation and sign-in

The following steps walk you through the Azure sign in process in your IntelliJ development environment.

1. If you haven't installed the plugin, see [Installing the Azure Toolkit for IntelliJ](installation.md).

1. To sign in to your Azure account, navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and click **Azure Sign in**..

   :::image type="content" source="media/sign-in-instructions/I01.png" alt-text="Sign in to Azure on IntelliJ."::: 

1. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in** ([other sign in options](sign-in-instructions.md)).

1. Click **Copy&Open** in the **Azure Device Login** dialog.

1. In the browser, paste your device code (which has been copied when you clicked **Copy&Open** in last step) and then click **Next**.

1. Select your Azure account and complete any authentication procedures necessary in order to sign in.

1. Once signed in, close your browser and switch back to your IntelliJ IDE. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then click **Select**.

## Creating a new web app project

1. Click **File**, expand **New**, and then click **Project**.

1. In the **New Project** dialog box, select **Maven**, and make sure the **Create from Archetype** option is checked. From the list, select **maven-archetype-webapp**, and then click **Next**.

   :::image type="content" source="media/create-hello-world-web-app/maven-archetype-webapp.png" alt-text="Select the maven-archetype-webapp option."::: 

1. Expand the **Artifact Coordinates** dropdown to view all input fields and specify the following information for your new web app and click **Next**:

   * **Name**: The name of your web app. This will automatically fill in the web app's **ArtifactId** field.
   * **GroupId**: The name of the artifact group, usually a company domain. (e.g. *com.microsoft.azure*)
   * **Version**: We'll keep the default version *1.0-SNAPSHOT*.

1. Customize any Maven settings or accept the defaults, and then click **Finish**.

1. Navigate to your project on the left-hand **Project** tab, and open the file **src/main/webapp/index.jsp**. Replace the code with the following and **save the changes**:

   ```html
   <html>
    <body>
      <b><% out.println("Hello World!"); %></b>
    </body>
   </html>
   ```
   :::image type="content" source="media/create-hello-world-web-app/open-index-page.png" alt-text="Open the index.jsp file.":::

## Deploying web app to Azure

1. Under the Project Explorer view, right-click your project, expand **Azure**, then click **Deploy to Azure Web Apps**.

1. In the Deploy to Azure dialog box, you can deploy the application to an existing Tomcat webapp or you can create a new one.

   a. Click **No available webapp, click to create a new one** to create a new webapp. Otherwise, choose **Create New WebApp** from the WebApp dropdown if there are existing webapps in your subscription.

      :::image type="content" source="media/create-hello-world-web-app/deploy-to-azure-webapps.png" alt-text="Deploy to Azure dialog window.":::

   In the pop-up **Create WebApp** dialog box, specify the following information and click **OK**: 

      * **Name**: The WebApp's domain name string.
      * **Subscription**: Specifies the Azure subscription that you want to use for the new WebApp.
      * **Platform**: Select *Linux*.
      * **Web Container**: Select *TOMCAT 9.0-jre8* or as appropriate.
      * **Resource Group**: Specifies the resource group for your WebApp. You may select an existing resource group associated with your Azure account or create a new one.
      * **App Service Plan**: Specifies the App Service Plan for your WebApp. You may select an existing plan associated with your Azure account or create a new one.

   b. To deploy to an existing webapp, choose the web app from WebApp drop down, and then click **Run**.

1. The toolkit will display a status message when it has successfully deployed your web app, along with the URL of your deployed web app if succeed.

1. You can browse to your web app using the link provided in the status message.

   :::image type="content" source="media/create-hello-world-web-app/browse-web-app.png" alt-text="Browsing your web app.":::

## Managing deploy configurations

> [!TIP]
> After you have published your web app, you can run the deployment by clicking the green arrow icon on the toolbar.

1. Before running your WebApp's deployment, you can modify the default settings by clicking the drop-down menu for your web app and selecting **Edit Configurations**.

   :::image type="content" source="media/create-hello-world-web-app/edit-configuration-menu.png" alt-text="Edit configuration menu.":::

1. On the **Run/Debug Configurations** dialog box, you can modify any of the default settings. Click **OK** to save the settings.

## Cleaning up resources

1. To delete your web app, navigate to the left-hand **Azure Explorer** sidebar and locate the **Web Apps** item. 

   > [!NOTE]
   > If the Web Apps menu item does not expand, manually refresh the list by clicking the **Refresh** icon on the Azure Explorer toolbar, or by right-clicking the Web Apps menu item and selecting **Refresh**.

1. Right-click the web app you'd like to delete and click **Delete**.

1. To delete your app service plan or resource group, visit the [Azure portal](https://portal.azure.com) and manually delete the resources under your subscription.

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

<!-- URL List -->

[Azure Toolkit for IntelliJ]: /azure/developer/java/tookit-for-intellij
[Azure Toolkit for Eclipse]: /azure/developer/java/tookit-for-eclipse
[eclipse-hello-world]: ../toolkit-for-eclipse/create-hello-world-web-app.md
[Web Apps Overview]: /azure/app-service/app-service-web-overview
[Apache Tomcat]: http://tomcat.apache.org/
[Jetty]: http://www.eclipse.org/jetty/
[intelliJ-sign-in-instructions]: sign-in-instructions.md

<!-- IMG List -->
[marketplace]:media/create-hello-world-web-app/marketplace.png
[file-new-project]: media/create-hello-world-web-app/file-new-project.png
[maven-archetype-webapp]: media/create-hello-world-web-app/maven-archetype-webapp.png
[groupid-and-artifactid]: media/create-hello-world-web-app/groupid-and-artifactid.png
[maven-options]: media/create-hello-world-web-app/maven-options.png
[project-name]: media/create-hello-world-web-app/project-name.png
[open-index-page]: media/create-hello-world-web-app/open-index-page.png
[edit-index-page]: media/create-hello-world-web-app/edit-index-page.png
[deploy-to-azure-menu]: media/create-hello-world-web-app/run-on-web-app-menu.png
[deploy-to-azure-dialog]: media/create-hello-world-web-app/run-on-web-app-dialog.png
[deploy-to-existing-webapp]: media/create-hello-world-web-app/deploy-to-existing-webapp.png
[create-new-web-app-dialog]: media/create-hello-world-web-app/create-new-web-app-dialog.png
[successfully-deployed]: media/create-hello-world-web-app/successfully-deployed.png
[browse-web-app]: media/create-hello-world-web-app/browse-web-app.png
[edit-configuration-menu]: media/create-hello-world-web-app/edit-configuration-menu.png
[edit-configuration-dialog]: media/create-hello-world-web-app/edit-configuration-dialog.png
[clean-resources]: media/create-hello-world-web-app/clean-resource.png

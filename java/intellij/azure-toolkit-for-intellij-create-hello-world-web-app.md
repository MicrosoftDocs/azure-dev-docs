---
title: Create a Hello World web app for Azure App Service using IntelliJ
description: This tutorial shows you how to use the Azure Toolkit for IntelliJ to create a Hello World Web App for Azure.
services: app-service
keywords: java, intellij, web app, azure app service, hello world, quick start
documentationcenter: java
author: selvasingh
manager: routlaw
editor: ''

ms.assetid: 75ce7b36-e3ae-491d-8305-4b42ce37db4e
ms.author: robmcm;asirveda
ms.date: 02/01/2018
ms.devlang: java
ms.service: app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# Create a Hello World web app for Azure App Service using IntelliJ

Using open sourced [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053) plugin, creating and deploying a basic Hello World application to Azure App Service as a web app can be done in a few minutes.

> [!NOTE]
>
> If you prefer using Eclipse, check out our [similar tutorial for Eclipse][eclipse-hello-world].
>
>[!INCLUDE [quickstarts-free-trial-note](../includes/quickstarts-free-trial-note.md)]
>
> Don't forget to clean up the resources after you complete this tutorial. In that case, running this guide will not exceed your free account quota.
>

[!INCLUDE [azure-toolkit-for-intellij-basic-prerequisites](../includes/azure-toolkit-for-intellij-basic-prerequisites.md)]

## Installation and Sign-in

1. In IntelliJ IDEA's Settings/Preferences dialog (Ctrl+Alt+S), select **Plugins**. Then, find the **Azure Toolkit for IntelliJ** in the **Marketplace** and click **Install**. After installed, click **Restart** to activate the plugin. 

   ![Azure Toolkit for IntelliJ plugin in Marketplace][marketplace]

2. To sign in to your Azure account, open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from IDEA menu **Tools/Azure/Azure Sign in**).

   ![The IntelliJ Azure Sign In command][I01]

3. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in** ([other sign in options](azure-toolkit-for-intellij-sign-in-instructions.md)).

   ![The Azure Sign In window with device login selected][I02]

4. Click **Copy&Open** in **Azure Device Login** dialog .

   ![The Azure Login Dialog window][I03]

5. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

   ![The device login browser][I04]

6. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **OK**.

   ![The Select Subscriptions dialog box][I05]

## Creating web app project

1. In IntelliJ, click the **File** menu, then click **New**, and then click **Project**.

   ![Create New Project][file-new-project]

2. In the **New Project** dialog box, select **Maven**, then **maven-archetype-webapp**, and then click **Next**.

   ![Choose Maven archetype Webapp][maven-archetype-webapp]

3. Specify the **GroupId** and **ArtifactId** for your web app, and then click **Next**.

   ![Specify GroupId and ArtifactId][groupid-and-artifactid]

4. Customize any Maven settings or accept the defaults, and then click **Next**.

   ![Specify Maven settings][maven-options]

5. Specify your project name and location, and then click **Finish**.

   ![Specify project name][project-name]

6. Under Project Explorer view, open and edit the file **src/main/webapp/index.jsp** as following and **save the changes**:

   ```html
   <html>
    <body>
      <b><% out.println("Hello World!"); %></b>
    </body>
   </html>
   ```

   ![Edit index page][edit-index-page]

## Deploying web app to Azure

1. Under Project Explorer view, right-click your project, expand **Azure**, then click **Deploy to Azure**.

   ![Deploy to Azure menu][deploy-to-azure-menu]

1. In the Deploy to Azure dialog box, you can directly deploy the application to an existing Tomcat webapp if you already have one, otherwise you should create a new one first.
   1. Click the link **No Available webapp, click to create a new one** to crete a new web app, you could choose **Create New WebApp** from WebApp dropdown if there are existing webapps in your subscription.

      ![Deploy to Azure dialog box][deploy-to-azure-dialog]

   1. In the pop-up dialog box, chose **TOMCAT 8.5-jre8** as Web Container and specify other required information, then click **OK** to create the webapp.

      ![Create new web app][create-new-web-app-dialog]

   1. Choose the web app from WebApp drop down, and then click **Run**.(You could start from here if you want deploy to an existing webapp)

      ![Deploy to existing webapp][deploy-to-existing-webapp]

1. The toolkit will display a status message when it has successfully deployed your web app, along with the URL of your deployed web app if succeed.

   ![Successful deployment][successfully-deployed]

1. You can browse to your web app using the link provided in the status message.

   ![Browsing your web app][browse-web-app]

## Managing deploy configurations

1. After you have published your web app, your settings will be saved as the default, and you can run the deployment by clicking the green arrow icon on the toolbar. You can modify your settings by clicking the drop-down menu for your web app and click **Edit Configurations**.

   ![Edit configuration menu][edit-configuration-menu]

1. When the **Run/Debug Configurations** dialog box is displayed, you can modify any of the default settings, and then click **OK**.

   ![Edit configuration dialog box][edit-configuration-dialog]

## Cleaning up resources

1. Deleting Web Apps in Azure Explorer

     ![Clean resources][clean-resources]

## Next steps

[!INCLUDE [azure-toolkit-for-intellij-additional-resources](../includes/azure-toolkit-for-intellij-additional-resources.md)]

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

<!-- URL List -->

[Azure Toolkit for IntelliJ]: azure-toolkit-for-intellij.md
[Azure Toolkit for Eclipse]: ../eclipse/azure-toolkit-for-eclipse.md
[eclipse-hello-world]: ../eclipse/azure-toolkit-for-eclipse-create-hello-world-web-app.md
[Web Apps Overview]: /azure/app-service/app-service-web-overview
[Apache Tomcat]: http://tomcat.apache.org/
[Jetty]: http://www.eclipse.org/jetty/
[Legacy Version]: azure-toolkit-for-intellij-create-hello-world-web-app-legacy-version.md
[intelliJ-sign-in-instructions]: azure-toolkit-for-intellij-sign-in-instructions.md

<!-- IMG List -->
[marketplace]:./media/azure-toolkit-for-intellij-create-hello-world-web-app/marketplace.png
[file-new-project]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/file-new-project.png
[maven-archetype-webapp]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/maven-archetype-webapp.png
[groupid-and-artifactid]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/groupid-and-artifactid.png
[maven-options]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/maven-options.png
[project-name]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/project-name.png
[open-index-page]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/open-index-page.png
[edit-index-page]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/edit-index-page.png
[deploy-to-azure-menu]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/run-on-web-app-menu.png
[deploy-to-azure-dialog]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/run-on-web-app-dialog.png
[deploy-to-existing-webapp]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/deploy-to-existing-webapp.png
[create-new-web-app-dialog]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/create-new-web-app-dialog.png
[successfully-deployed]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/successfully-deployed.png
[browse-web-app]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/browse-web-app.png
[edit-configuration-menu]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/edit-configuration-menu.png
[edit-configuration-dialog]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/edit-configuration-dialog.png
[clean-resources]: ./media/azure-toolkit-for-intellij-create-hello-world-web-app/clean-resource.png
[I01]: media/azure-toolkit-for-intellij-sign-in-instructions/I01.png
[I02]: media/azure-toolkit-for-intellij-sign-in-instructions/I02.png
[I03]: media/azure-toolkit-for-intellij-sign-in-instructions/I03.png
[I04]: media/azure-toolkit-for-intellij-sign-in-instructions/I04.png
[I05]: media/azure-toolkit-for-intellij-sign-in-instructions/I05.png

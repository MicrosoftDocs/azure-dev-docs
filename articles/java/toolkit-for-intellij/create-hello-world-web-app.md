---
title: Create a Hello World web app for Azure App Service using IntelliJ
description: This tutorial shows you how to use the Azure Toolkit for IntelliJ to create a Hello World Web App for Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.date: 09/09/2020
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
---

# Create a Hello World web app for Azure App Service using IntelliJ

This article demonstrates the steps that are required to create a basic Hello World web app and publish your web app to Azure App Service by using the [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

> [!NOTE]
> If you prefer using Eclipse, check out our [similar tutorial for Eclipse](../toolkit-for-eclipse/create-hello-world-web-app.md).
>
> [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
>
> Don't forget to clean up the resources after you complete this tutorial. In that case, running this guide will not exceed your free account quota.

[!INCLUDE [basic-prerequisites](includes/basic-prerequisites.md)]

## Install and sign-in

The following steps walk you through the Azure sign-in process in your IntelliJ development environment.

1. If you haven't installed the plugin, see [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

1. To sign in to your Azure account, navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then click **Azure Sign in**.

   :::image type="content" source="media/sign-in-instructions/I01.png" alt-text="Sign in to Azure on IntelliJ.":::

1. In the **Azure Sign In** window, select **OAuth 2.0**, and then click **Sign in**. For other sign-in options, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

1. In the browser, sign in with your account and then go back to IntelliJ. In the **Select Subscriptions** dialog box, click on the subscription that you want to use, then click **Select**.

## Create a new web app project

1. Click **File**, expand **New**, and then click **Project**.

1. In the **New Project** dialog box, select **Maven**, and make sure the **Create from Archetype** option is checked. From the list, select **maven-archetype-webapp**, and then click **Next**.

   :::image type="content" source="media/create-hello-world-web-app/maven-archetype-webapp.png" alt-text="Select the maven-archetype-webapp option.":::

1. Expand the **Artifact Coordinates** dropdown to view all input fields. Specify the following information for your new web app, and then click **Next**:

   * **Name**: The name of your web app. This value will be used to automatically fill in the web app's **ArtifactId** field.
   * **GroupId**: The name of the artifact group, usually a company domain, such as **com.microsoft.azure**.
   * **Version**: We'll keep the default version **1.0-SNAPSHOT**.

1. Customize any Maven settings or accept the defaults, and then click **Finish**.

1. To find the generated code, navigate to your project on the left-hand **Project** tab, then open the file **src/main/webapp/index.jsp**. You will see code similar to the following example.

   ```html
   <html>
    <body>
      <h2>Hello World!</h2>
    </body>
   </html>
   ```

   :::image type="content" source="media/create-hello-world-web-app/open-index-page.png" alt-text="Open the index.jsp file.":::

## Deploy web app to Azure

1. Under the **Project Explorer** view, right-click your project, expand **Azure**, then click **Deploy to Azure Web Apps**.

1. In the Deploy to Azure dialog box, you can deploy the application to an existing Tomcat webapp or you can create a new one.

   a. Click **+** to create a new webapp. Otherwise, choose **WebApp** from the WebApp dropdown if there are existing webapps in your subscription.

      :::image type="content" source="media/create-hello-world-web-app/deploy-to-azure-webapps.png" alt-text="Deploy to Azure dialog window.":::

   b. In the pop-up **Create WebApp** dialog box, specify the following information and click **OK**:

      * **Name**: The WebApp's domain name. This value should be unique across Azure.
      * **Platform**: Select **Linux-Java 8-TOMCAT 9.0** or as appropriate.

   c. To deploy to an existing webapp, choose the web app from WebApp drop down, and then click **Run**.

1. The toolkit will display a status message when it has successfully deployed your web app, along with the URL of your deployed web app if succeed.

1. You can browse to your web app using the link provided in the status message.

   :::image type="content" source="media/create-hello-world-web-app/browse-web-app.png" alt-text="Browsing your web app.":::

## Manage deploy configurations

> [!TIP]
> After you have published your web app, you can run the deployment by clicking the green arrow icon on the toolbar.

1. Before running your WebApp's deployment, you can modify the default settings by clicking the drop-down menu for your web app and selecting **Edit Configurations**.

   :::image type="content" source="media/create-hello-world-web-app/edit-configuration-menu.png" alt-text="Edit configuration menu.":::

1. On the **Run/Debug Configurations** dialog box, you can modify any of the default settings. Click **OK** to save the settings.

## Clean up resources

1. To delete your web app, navigate to the left-hand **Azure Explorer** sidebar and locate the **Web Apps** item.

   > [!NOTE]
   > If the Web Apps menu item does not expand, manually refresh the list by clicking the **Refresh** icon on the Azure Explorer toolbar, or by right-clicking the Web Apps menu item and selecting **Refresh**.

1. Right-click the web app you'd like to delete and click **Delete**.

1. To delete your app service plan or resource group, visit the [Azure portal](https://portal.azure.com) and manually delete the resources under your subscription.

## Next steps

[!INCLUDE [additional-resources](includes/additional-resources.md)]

For more information about creating Azure Web Apps, see [App Service overview](/azure/app-service/app-service-web-overview).

---
title: Deploy a Hello World web app running in a Linux container in the cloud using the Azure Toolkit for IntelliJ
description: Run a basic Hello World web app in a Linux container and deploy it to the cloud using the Azure Toolkit for IntelliJ.
services: app-service\web
documentationcenter: java
author: rmcmurray
manager: routlaw
editor: ''
ms.assetid: 
ms.author: robmcm
ms.date: 12/20/2018
ms.devlang: Java
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
---

# Deploy a Hello World web app to a Linux container in the cloud using the Azure Toolkit for IntelliJ

[Docker] containers are a widely used method for deploying web applications. By using Docker containers, developers can consolidate all their project files and dependencies into a single package for deployment to a server. The Azure Toolkit for IntelliJ simplifies this process for Java developers by adding features for to deploy containers to Microsoft Azure.

This article demonstrates the steps that are required to create a basic Hello World web app and publish your web app in a Linux container to Azure by using the Azure Toolkit for IntelliJ.

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]
* A [Docker] client.

> [!NOTE]
>
> To complete the steps in this tutorial, you need to configure [Docker] to expose the daemon on port 2375 without TLS. You can configure this setting when installing Docker, or through the Docker settings menu.
>
> ![Docker settings menu][docker-settings-menu]
>

## Create a new web app project

1. Start IntelliJ and sign in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for IntelliJ](https://docs.microsoft.com/java/azure/intellij/azure-toolkit-for-intellij-sign-in-instructions) article.

1. Click the **File** menu, then click **New**, and then click **Project**.
   
   ![Create New Project][file-new-project]

1. In the **New Project** dialog box, select **Maven**, then **maven-archetype-webapp**, and then click **Next**.
   
   ![Choose Maven archetype webapp][maven-archetype-webapp]
   
1. Specify the **GroupId** and **ArtifactId** for your web app, and then click **Next**.
   
   ![Specify GroupId and ArtifactId][groupid-and-artifactid]

1. Customize any Maven settings or accept the defaults, and then click **Next**.
   
   ![Specify Maven settings][maven-options]

1. Specify your project name and location, and then click **Finish**.
   
   ![Specify project name][project-name]

## Create an Azure Container Registry to use as a private Docker registry

The following steps walk you through using the Azure portal to create an Azure Container Registry.

> [!NOTE]
>
> If you want to use the Azure CLI instead of the Azure portal, follow the steps in [Create a private Docker container registry using the Azure CLI 2.0][Create Docker Registry using Azure CLI].
>

1. Browse to the [Azure portal] and sign in.

   Once you have signed in to your account on the Azure portal, you can follow the steps in the [Create a private Docker container registry using the Azure portal] article, which are paraphrased in the following steps for the sake of expediency.

1. Click the menu icon for **+ Create a resource**, then click **Containers**, and then click **Container Registry**.
   
   ![Create a new Azure Container Registry][create-container-registry-01]

1. When the **Create container registry** page is displayed, enter your **Registry name** and **Resource group**, choose **Enable** for the **Admin user**, and then click **Create**.

   ![Configure Azure Container Registry settings][create-container-registry-02]

## Deploy your web app in a Docker container

1. Right-click your project in the project explorer, choose **Azure**, and then click **Add Docker Support**.

   This will automatically create a Docker file with a default configuration.

   ![Add Docker support][add-docker-support]

1. After you have added Docker support, right-click your project in the project explorer, choose **Azure**, and then click **Run on Web App for Containers**.

   ![Run on Web App for Containers][run-on-web-app-for-containers]

1. When the **Run on Web App for Containers** dialog box is displayed, fill in the requisite information:

   * **Name**: This specifies the friendly name which is displayed in the Azure Toolkit. 

   * **Container Registry**: Choose the container registry from the drop-down menu that you created in the previous section of this article. The fields for **Server URL**, **Username**, and **Password** will be automatically populated.

   * **Image and tag**: Specifies the container image name; typically this will use the following syntax: "*registry*.azurecr.io/*appname*:latest", where: 
      * *registry* is your container registry from the previous section of this article 
      * *appname* is the name of your web app 

   * **Use Existing Web App** or **Create New Web App**: Specifies whether you will deploy your container to an existing web app or create a new web app. The **App name** that you specify will create the URL for your web app; for example: *wingtiptoys.azurewebsites.net*.

   * **Resource Group**: Specifies whether you will use an existing or create a new resource group. 

   * **App Service Plan**: Specifies whether you will use an existing or create a new app service plan. 

   ![Run on Web App for Containers][run-on-web-app-linux]

1. When you have finished configuring the settings listed above, click **Run**. When your web app has been successfully deployed, the status will be displayed in the **Run** window.

   ![Successfully deployed web app][successfully-deployed]

1. After your web app has been published, you can browse to the URL that specifed earlier for your web app; for example: *wingtiptoys.azurewebsites.net*.

   ![Browsing to your web app][browsing-to-web-app]

## Optional: Modify your web app publish settings

1. After you have published your web app, your settings will be saved as the default, and you can run your application on Azure by clicking the green arrow icon on the toolbar. You can modify these settings by clicking the drop-down menu for your web app and click **Edit Configurations**.

   ![Edit configuration menu][edit-configuration-menu]

1. When the **Run/Debug Configurations** dialog box is displayed, you can modify any of the default settings, and then click **OK**.

   ![Edit configuration dialog box][edit-configuration-dialog]

## Next steps

For additional resources for Docker, see the official [Docker website][Docker].

[!INCLUDE [azure-toolkit-for-intellij-additional-resources](../includes/azure-toolkit-for-intellij-additional-resources.md)]

<!-- URL List -->

[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Azure for Java Developers]: https://docs.microsoft.com/java/azure/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Create Docker Registry using Azure CLI]: /azure/container-registry/container-registry-get-started-azure-cli

[Docker]: https://www.docker.com/
[Configuring artifacts]: https://www.jetbrains.com/help/idea/2016.1/configuring-artifacts.html

<!-- IMG List -->

[add-docker-support]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/add-docker-support.png
[browsing-to-web-app]:  media/azure-toolkit-for-intellij-hello-world-web-app-linux/browsing-to-web-app.png
[create-container-registry-01]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/create-container-registry-01.png
[create-container-registry-02]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/create-container-registry-02.png
[docker-settings-menu]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/docker-settings-menu.png
[edit-configuration-dialog]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/edit-configuration-dialog.png
[edit-configuration-menu]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/edit-configuration-menu.png
[file-new-project]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/file-new-project.png
[groupid-and-artifactid]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/groupid-and-artifactid.png
[maven-archetype-webapp]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/maven-archetype-webapp.png
[maven-options]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/maven-options.png
[project-name]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/project-name.png
[run-on-web-app-for-containers]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/run-on-web-app-for-containers.png
[run-on-web-app-linux]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/run-on-web-app-linux.png
[successfully-deployed]: media/azure-toolkit-for-intellij-hello-world-web-app-linux/successfully-deployed.png

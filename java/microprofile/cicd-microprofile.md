---
title: CI/CD for MicroProfile apps using Azure Pipelines
description: Learn how to set up a CI/CD release cycle to deploy a MicroProfile app to an Azure Web App for Containers instance with Azure Pipelines.
services: devops
documentationcenter: MicroProfile
author: ruyakubu
manager: brunoborges
editor: ruyakubu

ms.assetid:
ms.author: ruyakubu
ms.date: 07/23/2019
ms.devlang: Java
ms.service: Azure DevOps
ms.tgt_pltfrm: multiple
ms.topic: tutorial
ms.workload: web
---

# CI/CD for MicroProfile apps using Azure Pipelines

This tutorial shows you how to easily set up an Azure Pipelines continuous integration and continuous deployment (CI/CD) release cycle to deploy your [MicroProfile](http://microprofile.io) Java EE application to an Azure Web App for Containers. The MicroProfile app in this tutorial uses a [Payara Micro](https://www.payara.fish/payara_micro) base image to create a WAR file. 

```Dockerfile
FROM payara/micro:5.182
COPY target/*.war $DEPLOY_DIR/ROOT.war
EXPOSE 8080
```
You start the Azure Pipelines containerization process by building a Docker image and pushing the container image to an Azure Container Registry (ACR). You complete the process by creating an Azure Pipelines release pipeline and deploying the container image to a web app.

## Prerequisites

1. In the [Azure portal](https://portal.azure.com), create an [Azure Container Registry](https://azure.microsoft.com/services/container-registry).
   
1. In the Azure portal, create an [Azure Web App for Containers](https://azure.microsoft.com/services/app-service/containers/). Select **Linux** for the **OS**, and for **Configure container**, select **Quickstart** as the **Image source**.  
   
1. Copy and save the clone URL from the sample GitHub repository at [https://github.com/Azure-Samples/microprofile-hello-azure](https://github.com/Azure-Samples/microprofile-hello-azure).
   
1. Register or log into your [Azure DevOps](https://dev.azure.com) organization, and create a new [project](/vsts/organizations/projects/create-project). 
   
1. Import the sample GitHub repository into Azure Repos:
   
   1. From your Azure DevOps project page, select **Repos** in the left navigation.
   1. Under **or import a repository**, select **Import**. 
   1. Under **Clone URL**, enter the Git clone URL you saved, and select **Import**.
  
## Create a build pipeline

The continuous integration build pipeline in Azure Pipelines automatically executes all build tasks each time there's a commit in the Java EE source app. In this example, Azure Pipelines uses Maven to build the Java MicroProfile project.

1. From your Azure DevOps project page, select **Pipelines** > **Builds** in the left navigation. 
   
1. Select **New Pipeline**.
   
1. Select **Use the classic editor to create a pipeline without YAML**. 
   
1. Make sure your project name and imported GitHub repository appear in the fields, and select **Continue**.
   
1. Select **Maven** from the list of templates, and then select **Apply**.
   
1. In the right pane, make sure **Hosted Ubuntu 1604** appears in the **Agent pool** dropdown.
   
   > [!NOTE]
   > This setting lets Azure Pipelines know which build server to use.  You can also use your private, customized build server.
   
1. To configure the pipeline for continuous integration, select the **Triggers** tab on the left pane, and then select the checkbox next to **Enable continuous integration**.  
   
1. At the top of the page, select the dropdown next to **Save & queue**, and select **Save**. 

   ![Enable continuous integration](media/cicd-microprofile/continuous-integration.png)

## Create a Docker build image

Azure Pipelines uses a Dockerfile with a base image from Payara Micro to create a Docker image.  

1. Select the **Tasks** tab, and then select the plus sign **+** next to **Agent job 1** to add a task.
   
   ![Add a new task](media/cicd-microprofile/add-task.png)
   
1. In the right pane, select **Docker** from the list of templates, and then select **Add**. 
   
1. Select **buildAndPush** in the left pane, and in the right pane, enter a description in the **Display name** field.
   
1. Under **Container Repository**, select **New** next to the **Container Registry** field. 
   
1. Fill out the **Add a Docker Registry service connection** dialog as follows:
   
   |Field|Value|
   |---|---|
   |**Registry type**|Select **Azure Container Registry**.|
   |**Connection Name**|Enter a name for the connection.|
   |**Azure subscription**|Select your Azure subscription from the dropdown, and if necessary, select **Authorize**.|
   |**Azure container registry**|Select your Azure Container Registry name from the dropdown.| 
   
1. Select **OK**.
   
   ![Add a Docker Registry service connection](media/cicd-microprofile/dockerconnection.png)
   
   > [!NOTE]
   > If you're using Docker Hub or another registry, select **Docker Hub** or **Others** instead of **Azure Container Registry** next to **Registry type**. Then provide the credentials and connection information for your container registry.
   
1. Under **Commands**, select **build** from the **Command** dropdown.
   
1. Select the ellipsis **...** next to the **Dockerfile** field, browse to and select the **Dockerfile** from your GitHub repository, and then select **OK**. 
   
   ![Select the Dockerfile](media/cicd-microprofile/selectdockerfile.png)
   
1. Under **Tags**, enter *latest* on a new line. 
   
1. At the top of the page, select the dropdown next to **Save & queue**, and select **Save**. 

## Push the Docker image to ACR

Azure Pipelines pushes the Docker image to your Azure Container Registry, and uses it to run the MicroProfile API app as a containerized Java web app.

1. Since you're using Docker in Azure Pipelines, create another Docker template by repeating the steps under [Create a Docker build image](#create-a-docker-build-image). This time, select **push** in the **Command** dropdown.
   
1. Select the dropdown next to **Save & queue**, and select **Save & queue**. 
   
1. In the **Run pipeline** popup, make sure **Hosted Ubuntu 1604** is selected under **Agent pool**, and select **Save and run**. 
   
1. After the build finishes, you can select the hyperlink on the **Build** page to verify build success and see other details.
   
   ![Select the build hyperlink](media/cicd-microprofile/checkbuild.png)

## Create a release pipeline

An Azure Pipelines continuous release pipeline automatically triggers deployment to a target environment like Azure as soon as a build succeeds. You can create release pipelines for environments like dev, test, staging, or production.

1. On your Azure DevOps project page, select **Pipelines** > **Releases** in the left navigation. 
   
1. Select **New Pipeline**.
   
1. Select **Deploy a Java app to Azure App Service** in the list of templates, and then select **Apply**. 
   
   ![Select the Deploy a Java app to Azure App Service template](media/cicd-microprofile/selectreleasetemplate.png)
   
1. In the popup window, change **Stage 1** to a stage name like *Dev*, *Test*, *Staging*, or *Production*, and then close the window. 
   
1. Under **Artifacts** in the left pane, select **Add** to link artifacts from the build pipeline to the release pipeline. 
   
1. In the right pane, select your build pipeline in the dropdown under **Source (build pipeline)**, and then select **Add**.
   
   ![Add a build artifact](media/cicd-microprofile/addbuildartifact.png)
   
1. Select the hyperlink in the **Production** stage to **View stage tasks**.
   
   ![Select the stage name](media/cicd-microprofile/viewstagetasks.png)
   
1. In the right pane, fill out the form as follows:
   
   |Field|Value|
   |---|---|
   |**Azure subscription**|Select your Azure subscription from the dropdown.|
   |**App type**|Select **Web App for Containers (Linux)** from the dropdown.|
   |**App service name**|Select your ACR instance from the dropdown.|
   |**Registry or Namespaces**|Enter your ACR name in the field. For example, enter *mymicroprofileregistry.azure.io*.
   |**Repository**|Enter the repository that contains your Docker image.| 
   
   ![Configure stage tasks](media/cicd-microprofile/configurestage.png)
   
1. In the left pane, select **Deploy War to Azure App Service**, and in the right pane, enter *latest* tag in the **Tag** field. 
   
1. In the left pane, select **Run on agent**, and in the right pane, select **Hosted Ubuntu 1604** from the **Agent pool** dropdown. 

## Set up environment variables

Add and define environment variables to connect to the container registry during deployment.

1. Select the **Variables** tab, and then select **Add** to add the following variables for your container registry URL, username, and password. 
   
   |Name|Value|
   |---|---|
   |*registry.url*|Enter your container registry URL. For example: *https:\//mymicroprofileregistry.azure.io*|
   |*registry.username*|Enter the username for the registry.|
   |*registry.password*|Enter the password for the registry. For security, select the lock icon to keep the password value hidden.|
   
   ![Add variables](media/cicd-microprofile/addvariables.png)
   
1. On the **Tasks** tab, select **Deploy War to Azure App Service** in the left pane. 
   
1. In the right pane, expand **Application and Configuration Settings**, and then select the ellipsis **...** next to the **App Settings** field.
   
1. In the **App settings** popup, select **Add** to define and assign the app setting variables:
   
   |Name|Value|
   |---|---|
   |*DOCKER_REGISTRY_SERVER_URL*|*$(registry.url)*|
   |*DOCKER_REGISTRY_SERVER_USERNAME*|*$(registry.username)*|
   |*DOCKER_REGISTRY_SERVER_PASSWORD*|*$(registry.password)*|
   
1. Select **OK**.
   
   ![Add and set variables](media/cicd-microprofile/appsettings.png)
   
## Set up continuous deployment 

To enable continuous deployment: 

1. On the **Pipeline** tab, under **Artifacts**, select the lightning icon in the build artifact. 
   
1. In the right pane, set the **Continuous deployment trigger** to **Enabled**.
   
1. Select **Save** at upper right, and then select **Save** again. 
   
   ![Enable continuous deployment trigger](media/cicd-microprofile/setcontinuousdeployment.png)
   
## Deploy the Java app

Now that you enabled CI/CD, modifying the source code creates and runs builds and releases automatically. You can also create and run releases manually, as follows:

1. At the upper right on the release pipeline page, select **Create release** .
   
1. On the **Create a new release** page, select the stage name under **Stages for a trigger change from automated to manual**. 
   
1. Select **Create**. 
   
1. Select the release name, hover over or select the stage, and then select **Deploy**. 
   
## Test the Java web app

After deployment completes successfully, test your web app. 

1. Copy the web app URL from the Azure portal.
   
   ![App Service app in the Azure portal](media/cicd-microprofile/portalurl.png)
   
1. Enter the URL in your web browser to run your app. The web page should say **Hello Azure!**
   
   ![Java web app page](media/cicd-microprofile/webapp.png)


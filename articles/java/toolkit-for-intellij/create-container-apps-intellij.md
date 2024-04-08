---
title: Deploy to Azure Container Apps using IntelliJ IDEA
description: Deploy Java projects to Azure Container Apps using IntelliJ IDEA
services: container-apps
author: silencejialuo
ms.author: jialuogan
ms.service: container-apps
ms.topic: quickstart
ms.date: 03/27/2024

---

# Quickstart: Deploy to Azure Container Apps using IntelliJ IDEA


In this tutorial, you'll deploy a containerized application to Azure Container Apps using Azure Toolkit for IntelliJ IDEA. Your job is to create a backend web API service that returns a static collection of music albums. 

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/create-container-apps-intellij/DeploytoACAScreenshot.png" alt-text="Browser the album API service you deploy."::: 


## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [Azure supported Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-support-on-azure), version 8, 11, 17 or 21. 
- An [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition installed
- [Maven 3.5.0+](https://maven.apache.org/download.cgi)
- A [Docker](https://www.docker.com/) client


## Install and sign-in
The following steps walk you through the Azure sign-in process in your IntelliJ development environment.

1. If you haven't installed the plugin, see [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

1. To sign in to your Azure account, navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then click **Azure Sign in**.

   :::image type="content" source="media/sign-in-instructions/I01.png" alt-text="Sign in to Azure on IntelliJ.":::

1. In the **Azure Sign In** window, select **OAuth 2.0**, and then click **Sign in**. For other sign-in options, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

1. In the browser, sign in with your account and then go back to IntelliJ. In the **Select Subscriptions** dialog box, click on the subscription that you want to use, then click **Select**.


## Clone the project

1. Use the following git command to clone the sample app:

```git
git clone https://github.com/Azure-Samples/containerapps-albumapi-java
cd containerapps-albumapi-java
git checkout IDE
```
2. Select **Open** to open the project in IntelliJ IDEA.

## Build and run the project locally

1. Build the project with [Maven](https://maven.apache.org/download.cgi).
```azurecli
mvn clean package -DskipTests
```

2. To verify application is running, open a browser and go to `http://localhost:8080/albums`. The page returns a list of the JSON objects.

```azurecli
java -jar target\containerapps-albumapi-java-0.0.1-SNAPSHOT.jar
```


## Push image to an Azure Container Registry

To deploy your project to Azure Container Apps, you need to build the container image and push it to an Azure Container Registry first.

1. In **Azure Explorer** view, expand the **Azure node**, right-click on **Container Registries**, and select **Create in Azure Portal**.
1. When the **Create container registry** page is displayed, enter the following information:

   * **Subscription**: Specifies the Azure subscription that you want to use for your container registry.

   * **Resource Group**: Specifies the resource group for your container registry. Select one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will select from a list of resource groups that are associated with your Azure account.

   * **Registry Name**: Specifies a name for the new container registry.

   * **Location**: Specifies the region where your container registry will be created (for example, "West US").

   * **SKU**: Specifies the service tier for your container registry. For this tutorial, select *Basic*. 

1. Click **Review + create** and verify that the information is correct. Finish by clicking **Create**.

1. Navigate to your project on the left-hand **Project** tab and open the *Dockerfile*.

1. Click the Azure icon on line 1 and select "Push Image to Azure Container Registry".

1. Select the registry you have created in the previous step, fill in the following information and click **Run**.

   * **Repository Name**: Specifies the name for the repository. 

   * **Tag Name**: Specifies the version of an image or other artifact.

   :::image type="content" source="media/create-container-apps-intellij/PushtoRegistry.png" alt-text="Push Imgae to Azure Container Registry.":::


## Create an environment and a container app

To set up your environment and deploy a container app in Azure, follow these steps: 

1. Right-click on **Container Apps Environment** in **Azure Explorer** view, and then select **Create Container Apps Environment**.

1. When the **Create Container Apps Environment** page is displayed, enter the following information and then click **OK**.

   * **Subscription**: Specifies the Azure subscription that you want to use.

   * **Resource Group**: Specifies the resource group for your container apps. Select one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will select from a list of resource groups that are associated with your Azure account.

   * **Name**: Specifies the name for the new container apps environment.

   * **Region**: Specifies the appropriate region.(for example, "Central  US").      
   * **Log Analytics workspace**: Specifies the Log Analytics workspace you want to use or accept the defaults.

   :::image type="content" source="media/create-container-apps-intellij/CreateACE.png" alt-text="Create Azure Container Environment.":::   

1. Once you’ve created the container apps environment, right-click on it and choose *Create > Container App** in Azure Explorer. Enter the following information:

   * **Subscription**: Specifies the Azure subscription that you want to use.

   * **Resource Group**: Specifies the resource group for your container apps. Select one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will select from a list of resource groups that are associated with your Azure account.

   * **Name**: Specifies the name for a new container app.

   * **Region**: Specifies the appropriate region.(for example, "Central US"). 

   * **Environment**: Specifies the Container Apps Environment you want to use.
   * **Quickstart**: Select "Use Quick Start Image"

   :::image type="content" source="media/create-container-apps-intellij/CreateACA.png" alt-text="Create Azure Container App.":::      

1. When you've specified all of the preceding options, click **OK**.The toolkit will display a status message when it has successfully created.

## Deploy the container app

1. Navigate to your project on the left-hand Project tab, and open the *Dockerfile*.

   :::image type="content" source="media/create-container-apps-intellij/OpenDockerfile.png" alt-text="Open the Dockerfile.":::  


1. In the *Dockerfile*, click the Azure icon on line 1 and select "Deploy Image to Container App".
   :::image type="content" source="media/create-container-apps-intellij/DeployImage.png" alt-text="Deploy Image to ACA.":::  

1. When the **Deploy Image to Azure Container Apps** page is displayed, enter the following information and click **Run**.

   * **Dockerfile/Image**: Specifies the path of the Dockerfile or accept the defaults.

   * **Container Registry**: Specifies Container Registry you want to use.

   * **Repository Name**: Specifies the repository name you want to use under your Container Registry.

   * **Tag Name**: Specifies the tag name you want to use under your Container Registry.

   * **Container App**: Specifies the Container App you want to deploy to.

   * **Ingress**:  Enable ingress for applications that require an HTTP or TCP endpoint. Select **Enable**.
   * **External Traffilc**: Enable external traffic for applications that need an HTTP or TCP endpoint. Select **Enable**.
   * **Target Port**: Set this value to the port number that your container uses. Open port 8080 in this step. 

   :::image type="content" source="media/create-container-apps-intellij/DeploytoACASettings.png" alt-text="Deploy Image to ACA with detailed settings.":::     
   
1. Once this deployment process finishes, the Azure Toolkit for IntelliJ will display a notification. Select browse to open the deployed app in a browser.

   :::image type="content" source="media/create-container-apps-intellij/DeploytoACAScreenshot.png" alt-text="Browser the album API service you deploy."::: 

In the browser's location bar, append the /albums path at the end of the app URL to view data from a sample API request.

## Clean up resources

If you want to clean up and remove an Azure Container Apps resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Use the following steps to clean up resources:

1. To delete your Azure Container Apps resources, navigate to the left-hand **Azure Explorer** sidebar and locate the **Container Apps Environment** item.

1. Right-click on the Azure Container Apps service you'd like to delete and then select **Delete**.

1. To delete your resource group, visit the [Azure portal](https://portal.azure.com) and manually delete the resources under your subscription.


## Next steps

> [!div class="nextstepaction"]
> [Learn more about developing in Java on Container Apps](/azure/container-apps/java-overview)

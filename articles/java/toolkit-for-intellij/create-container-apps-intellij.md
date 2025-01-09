---
title: Deploy to Azure Container Apps using IntelliJ IDEA
description: Deploy Java projects to Azure Container Apps using IntelliJ IDEA.
services: container-apps
author: KarlErickson
ms.author: jialuogan
ms.topic: quickstart
ms.date: 12/16/2024

---

# Quickstart: Deploy to Azure Container Apps using IntelliJ IDEA

This article shows you how to deploy a containerized application to Azure Container Apps using Azure Toolkit for IntelliJ IDEA. The article uses a sample backend web API service that returns a static collection of music albums.

## Prerequisites

- An Azure account with an active subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/), Ultimate or Community Edition.
- [Maven 3.5.0+](https://maven.apache.org/download.cgi).
- A [Docker](https://www.docker.com/) client.
- The [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053). For more information, see [Install the Azure Toolkit for IntelliJ](install-toolkit.md). You also need to sign in to your Azure account for the Azure Toolkit for IntelliJ. For more information, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

## Clone the project

1. Use the following commands to clone the sample app and check out the `IDE` branch:

    ```bash
    git clone https://github.com/Azure-Samples/containerapps-albumapi-java
    cd containerapps-albumapi-java
    git checkout IDE
    ```

1. Select **Open** to open the project in IntelliJ IDEA.

## Build and run the project locally

1. Use the following command to build the project with [Maven](https://maven.apache.org/download.cgi):

    ```azurecli
    mvn clean package -DskipTests
    ```

1. To verify that the application is running, open a browser and go to `http://localhost:8080/albums`. The page returns a list of JSON objects similar to the output of the following command:

    ```azurecli
    java -jar target\containerapps-albumapi-java-0.0.1-SNAPSHOT.jar
    ```

## Create an environment

Use the following steps to set up your environment and deploy a container app in Azure:

1. Right-click **Container Apps Environment** in **Azure Explorer** view, and then select **Create Container Apps Environment**.
1. On the **Create Container Apps Environment** page, enter the following information, and then select **OK**:
    - **Subscription**: Azure subscription to use.
    - **Resource Group**: Resource group for your container apps. Select one of the following options:
        - **Create New**: Specifies that you want to create a new resource group.
        - **Use Existing**: Specifies that you must select from a list of resource groups that are associated with your Azure account.
    - **Region**: The appropriate region, for example, **East US**.
    - **Name**: Name for the new container apps environment.
    - **Type**: Type of container apps environment, or accept the default.
    - **Workload Profiles**: Workload profiles for your container apps, or accept the default.
    - **Log Analytics workspace**: Log Analytics workspace to use, or accept the default.

   :::image type="content" source="media/create-container-apps-intellij/create-container-apps-environment.png" alt-text="Screenshot of Intelli J that shows the Create Container Apps Environment dialog box." lightbox="media/create-container-apps-intellij/create-container-apps-environment.png":::

### Deploy the container app

#### [SourceCode](#tab/sourcecode)

1. Right-click the container apps environment you created, and select **Create** > **Container App** in Azure Explorer. Enter the following information:
    - **Subscription**: Azure subscription to use.
    - **Resource Group**: Resource group for your container apps. Select one of the following options:
        - **Create New**: Specifies that you want to create a new resource group.
        - **Use Existing**: Specifies that you must select from a list of resource groups that are associated with your Azure account.
    - **Environment**: Container Apps Environment to use.
    - **Name**: Name for a new container app.
    - **Deployment**:
        - **Source**: Select the **Source Code** option.
        - **Code**: Select the entire source code from your local machine by selecting the folder button.
    - **Container Resource Allocation**:
        - **Workload Profile**: Select the appropriate workload profile based on your application's requirements.
        - **CPU and Memory**: Allocate the necessary CPU and memory resources for your container app.
    - **Ingress Settings**:
        - **Ingress**: Enable or disable ingress based on your application's needs. You can accept the default settings.
        - **External Traffic**: Specifies whether the container app should accept external traffic. You can accept the default settings.
        - **Target Port**: Enable or disable ingress based on your application's needs. Configure the target port to 8080.  
    - **Other**:
        - **Env Variables**: Set any environment variables required by your application.
        - **Min Replicas**: Minimum number of replicas for your container app. You can accept the default settings.
        - **Max Replicas**: Maximum number of replicas for your container app. You can accept the default settings.

    :::image type="content" source="media/create-container-apps-intellij/deploy-to-container-apps-source-code.png" alt-text="Screenshot of Intelli J that shows the Create Azure Container App dialog box." lightbox="media/create-container-apps-intellij/deploy-to-container-apps-source-code.png":::

1. Select **OK**. The toolkit displays a status message when the app deployment succeeds.

1. After the deployment finishes, the Azure Toolkit for IntelliJ displays a notification. Select **Browse** to open the deployed app in a browser.

    :::image type="content" source="media/create-container-apps-intellij/deploy-to-container-apps.png" alt-text="Screenshot of the deployed app in a browser window." lightbox="media/create-container-apps-intellij/deploy-to-container-apps.png":::

In the browser's address bar, append the `/albums` path to the end of the app URL to view data from a sample API request.

#### [Artifact](#tab/artifact)

1. Right-click the Container Apps environment you created and select **Create** > **Container App** in Azure Explorer. Enter the following information:

    - **Subscription**: Azure subscription to use.
    - **Resource Group**: Resource group for your container apps. Select one of the following options:
        - **Create New**: Specifies that you want to create a new resource group.
        - **Use Existing**: Specifies that you must select from a list of resource groups that are associated with your Azure account.
    - **Environment**: Container Apps environment to use.
    - **Name**: Name for a new container app.
    - **Deployment**:
        - **Source**: Select **Artifact**.
        - **Artifact**: Select the artifact file from your local machine by first selecting the folder button.
    - **Container Resource Allocation**:
        - **Workload Profile**: Select the appropriate workload profile based on your application's requirements.
        - **CPU and Memory**: Allocate the necessary CPU and memory resources for your container app.
    - **Ingress Settings**:
        - **Ingress**: Enable or disable ingress based on your application's needs. You can accept the default settings.
        - **External Traffic**: Specifies whether the container app should accept external traffic. You can accept the default settings.
        - **Target Port**: Enable or disable ingress based on your application's needs. Configure the target port to 8080.  
    - **Other**:
        - **Env Variables**: Set any environment variables required by your application.
        - **Min Replicas**: Minimum number of replicas for your container app. You can accept the default settings.
        - **Max Replicas**: Maximum number of replicas for your container app. You can accept the default settings.

    :::image type="content" source="media/create-container-apps-intellij/create-azure-container-apps-artifact.png" alt-text="Screenshot of Intelli J that shows the Create Azure Container App dialog box." lightbox="media/create-container-apps-intellij/create-azure-container-apps-artifact.png":::

1. Select **OK**. The toolkit displays a status message when the app deployment succeeds.

1. After the deployment finishes, the Azure Toolkit for IntelliJ displays a notification. Select **Browse** to open the deployed app in a browser.

    :::image type="content" source="media/create-container-apps-intellij/deploy-to-container-apps.png" alt-text="Screenshot of the deployed app in a browser window." lightbox="media/create-container-apps-intellij/deploy-to-container-apps.png":::

In the browser's address bar, append the `/albums` path to the end of the app URL to view data from a sample API request.

#### [Image](#tab/image)

1. On the **Project** tab, navigate to your project and select **Dockerfile**.

    :::image type="content" source="media/create-container-apps-intellij/open-docker-file.png" alt-text="Screenshot of Intelli J that shows the Project explorer with the Dockerfile node highlighted." lightbox="media/create-container-apps-intellij/open-docker-file.png":::

1. Select the Azure icon and then select **Deploy Image to Container App**.

    :::image type="content" source="media/create-container-apps-intellij/deploy-image-to-container-apps.png" alt-text="Screenshot of Intelli J that shows the Dockerfile in the editor with the Deploy Image to Container App menu option highlighted." lightbox="media/create-container-apps-intellij/deploy-image-to-container-apps.png":::

1. On the **Deploy Image to Azure Container Apps** page, enter the following information, and then select **Run**:
    - **Module**: Module to deploy.
    - **Container App**: Container App to deploy to.
    - **Deployment**:
        - **Source**: Select the **Container Image** option.
        - **Docker Host**: Docker host to use, or accept the default.
        - **Dockerfile/Image**: Path of the Dockerfile, or accept the default.
        - **Container Registry**: Container registry to use.
        - **Repository Name**: Repository name to use under your container registry.
        - **Tag Name**: Tag name to use under your Container Registry.
    - **Ingress Settings**:
        - **Ingress**: Enable or disable ingress based on your application's needs. You can accept the default settings.
        - **External Traffic**: Specifies whether the container app should accept external traffic. You can accept the default settings.
        - **Target Port**: Enable or disable ingress based on your application's needs. Open port 8080 in this step.
    - **Other**:
        - **Env Variables**: Set any environment variables required by your application.

    :::image type="content" source="media/create-container-apps-intellij/deploy-to-container-apps-image.png" alt-text="Screenshot of Intelli J that shows the Deploy to Azure Container Apps dialog box." lightbox="media/create-container-apps-intellij/deploy-to-container-apps-image.png":::

1. Select **OK**. The toolkit displays a status message when the app deployment succeeds.
1. After the deployment finishes, the Azure Toolkit for IntelliJ displays a notification. Select **Browse** to open the deployed app in a browser.

    :::image type="content" source="media/create-container-apps-intellij/deploy-to-container-apps.png" alt-text="Screenshot of the deployed app in a browser window." lightbox="media/create-container-apps-intellij/deploy-to-container-apps.png":::

In the browser's address bar, append the `/albums` path to the end of the app URL to view data from a sample API request.

---

## Clean up resources

To clean up and remove a Container Apps resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Use the following steps to clean up resources:

1. To delete your Container Apps resources, from the **Azure Explorer** sidebar, locate the **Container Apps Environment** item.
1. Right-click the Container Apps service to delete, and then select **Delete**.
1. To delete your resource group, visit the Azure portal and manually delete the resources under your subscription.

## Next steps

- [Java on Azure Container Apps overview](/azure/container-apps/java-overview)

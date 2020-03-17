---
title: Deploy a Spring Boot Web App on Azure App Service for Container
description: This tutorial walks you though the steps to deploy a Spring Boot application as a Linux web app on Microsoft Azure.
services: azure app service
documentationcenter: java
ms.date: 12/31/2019
ms.service: app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
ms.custom: mvc
---

# Deploy a Spring Boot application on Azure App Service for Container

This tutorial walks through using [Docker] to containerize your [Spring Boot] application and deploy your own docker image to a Linux host in the [Azure App Service](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-intro).

## Prerequisites

In order to complete the steps in this tutorial, you need to have the following prerequisites:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.

## Create the Spring Boot on Docker Getting Started web app

The following steps walk through the steps that are required to create a simple Spring Boot web application and test it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:

   ```bash
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you created; for example:

   ```bash
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project; for example:

   ```bash
   cd gs-spring-boot-docker/complete
   ```

1. Build the JAR file using Maven; for example:

   ```bash
   mvn package
   ```

1. Once the web app has been created, change directory to the `target` directory where the JAR file is located and start the web app; for example:

   ```bash
   cd target
   java -jar gs-spring-boot-docker-0.1.0.jar --server.port=80
   ```

1. Test the web app by browsing to it locally using a web browser. For example, if you have curl available and you configured the Tomcat server to run on port 80:

   ```bash
   curl http://localhost
   ```

1. You should see the following message displayed: **Hello Docker World**

   ![Browse Sample App Locally][SB01]

## Create an Azure Container Registry to use as a Private Docker Registry

The following steps walk through using the Azure portal to create an Azure Container Registry.

> [!NOTE]
>
> If you want to use the Azure CLI instead of the Azure portal, follow the steps in [Create a private Docker container registry using the Azure CLI 2.0](/azure/container-registry/container-registry-get-started-azure-cli).

1. Browse to the [Azure portal] and sign in.

   Once you have signed in to your account on the Azure portal, follow the steps in the [Create a private Docker container registry using the Azure portal] article, which are paraphrased in the following steps for the sake of expediency.

1. Click the menu icon for **+ New**, click **Containers**, and then click **Azure Container Registry**.

   ![Create a new Azure Container Registry][AR01]

1. When the **Create container registry** page is displayed, enter **Registry name**, **Subscription**, **Resource group**, and **Location**. Select **Enable** for the **Admin user**. Then click **Create**.

   ![Configure Azure Container Registry settings][AR03]

1. Once your container registry has been created, navigate to your container registry in the Azure portal, and click **Access Keys**. Take note of the username and password for the next steps.

   ![Azure Container Registry access keys][AR04]

## Configure Maven to use your Azure Container Registry access keys

1. Navigate to the completed project directory for your Spring Boot application, (for example: "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the latest version of [jib-maven-plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin), login server value, and access settings for your Azure Container Registry from the previous section of this tutorial. For example:

   ```xml
   <properties>
      <jib-maven-plugin.version>1.7.0</jib-maven-plugin.version>
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
      <username>wingtiptoysregistry</username>
      <password>{put your Azure Container Registry access key here}</password>
   </properties>
   ```

1. Add [jib-maven-plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin) to the `<plugins>` collection in the *pom.xml* file.  This example uses version 1.8.0.

   Specify the base image at `<from>/<image>`, here `mcr.microsoft.com/java/jre:8-zulu-alpine`. Specify the name of the final image to be built from the base in `<to>/<image>`.

   Authentication `{docker.image.prefix}` is the **Login server** on the registry page shown previously. The `{project.artifactId}` is the name and version number of the JAR file from the first Maven build of the project.

   Specify the username and password from registry pane in the `<to>/<auth>` node. For example:

   ```xml
   <plugin>
     <artifactId>jib-maven-plugin</artifactId>
     <groupId>com.google.cloud.tools</groupId>
     <version>1.8.0</version>
     <configuration>
        <from>
            <image>mcr.microsoft.com/java/jre:8-zulu-alpine</image>
        </from>
        <to>
            <image>${docker.image.prefix}/${project.artifactId}</image>
            <auth>
               <username>${username}</username>
               <password>${password}</password>
            </auth>
        </to>
     </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to rebuild the application and push the container to your Azure Container Registry:

   ```bash
   mvn compile jib:build
   ```

> [!NOTE]
>
> When you are using Jib to push your image to the Azure Container Registry, the image will not use the *Dockerfile*, see [this](https://cloudplatform.googleblog.com/2018/07/introducing-jib-build-java-docker-images-better.html) document for details.
>

## Create a web app on Linux on Azure App Service using your container image

1. Browse to the [Azure portal] and sign in.

2. Click the menu icon for **+ Create a resource**, click **Web**, and then click **Web App for Containers**.

   ![Create a new web app in the Azure portal][LX01]

3. When the **Web App on Linux** page is displayed, enter the following information:

   * Choose your **Subscription** from the drop-down list.

   * Choose an existing **Resource Group**, or specify a name to create a new resource group.

   * Enter a unique name for the **App name**; for example: "*wingtiptoyslinux*"

   * Specify `Docker Container` to **Publish**.

   * Choose *Linux* as the **Operating System**.

   * Select **Region**.

   * Accept **Linux Plan** and choose an existing **App Service Plan**, or click **Create new** to create a new app service plan.

   * Click **Next: Docker**.

   ![Configure web app settings][LX02]

      On the **Web App** page select **Docker**, and enter the following information:

   * Select **Single Container**.

   * **Registry**: Choose your container, for example: "*wingtiptoysregistry*"

   * **Image**: Select the image created previously, for example: "*gs-spring-boot-docker*"

   * **Tag**: Choose the tag for the image; for example: "*latest*"

   * **Startup Command**: Keep it blank since the image already has the start up command

   After you have entered all of the above information, click **Review + create**.

   ![Configure web app settings][LX02-A]

   * Click **Review + create**.

Review the information and click **Create**.

When the deployment is complete, click **Go to resource**.  The deployment page displays the URL to access the application.

   ![Get URL of deployment][LX02-B]

> [!NOTE]
>
> Azure will automatically map Internet requests to embedded Tomcat server that is running on the standard ports of 80 or 8080. However, if you configured your embedded Tomcat server to run on a custom port, you need to add an environment variable to your web app that defines the port for your embedded Tomcat server. To do so, use the following steps:
>
> 1. Browse to the [Azure portal] and sign in.
>
> 2. Click the icon for **Web Apps**, and select your app from the **App Services** page.
>
> 3. Click **Configuration** in the left navigation pane.
>
> 4. In the **Application settings** section, add a new setting named **WEBSITES_PORT** and enter your custom port number for the value.
>
> 5. Click **OK**. Then click **Save**.
>
> ![Saving a custom port number in the Azure portal][LX03]

<!--
##  OPTIONAL: Configure the embedded Tomcat server to run on a different port

The embedded Tomcat server in the sample Spring Boot application is configured to run on port 8080 by default. However, if you want to run the embedded Tomcat server to run on a different port, such as port 80 for local testing, you can configure the port by using the following steps.

1. Go to the *resources* directory (or create the directory if it does not exist); for example:
   ```shell
   cd src/main/resources
   ```

1. Open the *application.yml* file in a text editor if it exists, or create a new YAML file if it does not exist.

1. Modify the **server** setting so that the server runs on port 80; for example:
   ```yaml
   server:
      port: 80
   ```

1. Save and close the *application.yml* file.
-->

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/java/spring-framework)

### Additional Resources

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-app-from-container-registry-using-maven-plugin.md)
* [Deploy a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For further details about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

For help with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.

For more information about getting started with creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Container Service (AKS)]: https://azure.microsoft.com/services/container-service/
[Azure for Java Developers]: /azure/java/
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service-web/app-service-linux-using-custom-docker-image
[Docker]: https://www.docker.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops/java/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/

[Java Development Kit (JDK)]: https://aka.ms/azure-jdks
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- IMG List -->

[SB01]: ./media/deploy-spring-boot-java-app-on-linux/SB01.png
[SB02]: ./media/deploy-spring-boot-java-app-on-linux/SB02.png
[AR01]: ./media/deploy-spring-boot-java-app-on-linux/AR01.png
[AR03]: ./media/deploy-spring-boot-java-app-on-linux/AR03.png
[AR04]: ./media/deploy-spring-boot-java-app-on-linux/AR04.png
[LX01]: ./media/deploy-spring-boot-java-app-on-linux/LX01.png
[LX02]: ./media/deploy-spring-boot-java-app-on-linux/LX02.png
[LX02-A]: ./media/deploy-spring-boot-java-app-on-linux/LX02-A.png
[LX02-B]: ./media/deploy-spring-boot-java-app-on-linux/LX02-B.png
[LX03]: ./media/deploy-spring-boot-java-app-on-linux/LX03.png

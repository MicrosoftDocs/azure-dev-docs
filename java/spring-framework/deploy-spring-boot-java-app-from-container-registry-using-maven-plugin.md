---
title: How to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app in Azure Container Registry to Azure App Service
description: This tutorial will walk you though the steps to deploy a Spring Boot application in Azure Container Registry to Azure to Azure App Service by using a Maven plugin.
services: container-registry
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid: 
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# How to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app in Azure Container Registry to Azure App Service

This article demonstrates how to deploy a sample [Spring Boot] application to Azure Container Registry, and then use the Maven Plugin for Azure Web Apps to deploy your application to Azure App Service.

> [!NOTE]
> 
> The Maven Plugin for Azure Web Apps for [Apache Maven](http://maven.apache.org/) provides seamless integration of Azure App Service  into Maven projects, and streamlines the process for developers to deploy web apps to Azure App Service.
> 
> The Maven Plugin for Azure Web Apps is currently available as a preview. For now, only FTP publishing is supported, although additional features are planned for the future.
> 

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
>

## Clone the sample Spring Boot on Docker web app

In this section, you clone a containerized Spring Boot application and test it locally.

1. Open a command prompt or terminal window and create a local directory to hold your Spring Boot application, and change to that directory; for example:
   ```shell
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```shell
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you created; for example:
   ```shell
   git clone -b https://github.com/spring-guides/gs-spring-boot-docker
   ```

1. Change directory to the completed project; for example:
   ```shell
   cd gs-spring-boot-docker/complete
   ```

1. Build the JAR file using Maven; for example:
   ```shell
   mvn clean package
   ```

1. When the web app has been created, start the web app using Maven; for example:
   ```shell
   mvn spring-boot:run
   ```

1. Test the web app by browsing to it locally using a web browser. For example, you could use the following command if you have curl available:
   ```shell
   curl http://localhost:8080
   ```

1. You should see the following message displayed: **Hello Docker World**

   ![Browse Sample App Locally][SB01]

> [!NOTE]
>
> When you are using Docker locally, you may see an error which states that you cannot connect to localhost on port 2375. If this happens, you may need to enable using Docker locally without TLS. To do so, open your Docker settings and check the option to **Expose daemon on TCP://localhost:2375 without TLS**.
>
> ![Expose Docker daemon on local TCP port 2375][TL01]

## Create an Azure service principal

In this section, you create an Azure service principal that the Maven plugin uses when deploying your container to Azure.

1. Open a command prompt.

2. Sign into your Azure account by using the Azure CLI:
   ```azurecli
   az login
   ```
   Follow the instructions to complete the sign-in process.

3. Create an Azure service principal:
   ```azurecli
   az ad sp create-for-rbac --name "uuuuuuuu" --password "pppppppp"
   ```
   Where:

   | Parameter  |                    Description                     |
   |------------|----------------------------------------------------|
   | `uuuuuuuu` | Specifies the user name for the service principal. |
   | `pppppppp` | Specifies the password for the service principal.  |


4. Azure responds with JSON that resembles the following example:
   ```json
   {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "uuuuuuuu",
      "name": "http://uuuuuuuu",
      "password": "pppppppp",
      "tenant": "tttttttt-tttt-tttt-tttt-tttttttttttt"
   }
   ```

   > [!NOTE]
   >
   > You will use the values from this JSON response when you configure the Maven plugin to deploy your container to Azure. The `aaaaaaaa`, `uuuuuuuu`, `pppppppp`, and `tttttttt` are placeholder values, which are used in this example to make it easier to map these values to their respective elements when you configure your Maven `settings.xml` file in the next section.
   >
   >

## Create an Azure Container Registry using the Azure CLI

1. Open a command prompt.

1. Log in to your Azure account:
   ```azurecli
   az login
   ```

1. Create a resource group for the Azure resources you will use in this article:
   ```azurecli
   az group create --name=wingtiptoysresources --location=westus
   ```
   Replace `wingtiptoysresources` in this example with a unique name for your resource group.

1. Create a private Azure container registry in the resource group for your Spring Boot app: 
   ```azurecli
   az acr create --admin-enabled --resource-group wingtiptoysresources --location westus --name wingtiptoysregistry --sku Basic
   ```
   Replace `wingtiptoysregistry` in this example with a unique name for your container registry.

1. Retrieve the password for your container registry:
   ```azurecli
   az acr credential show --name wingtiptoysregistry --query passwords[0]
   ```
   Azure will respond with your password; for example:
   ```json
   {
      "name": "password",
      "value": "xxxxxxxxxx"
   }
   ```

## Add your Azure container registry and Azure service principal to your Maven settings

1. Open your Maven `settings.xml` file in a text editor; this file might be in a path like the following examples:
   * `/etc/maven/settings.xml`
   * `%ProgramFiles%\apache-maven\3.5.0\conf\settings.xml`
   * `$HOME/.m2/settings.xml`

2. Add your Azure Container Registry access settings from the previous section of this article to the `<servers>` collection in the *settings.xml* file; for example:

   ```xml
   <servers>
      <server>
         <id>wingtiptoysregistry</id>
         <username>wingtiptoysregistry</username>
         <password>xxxxxxxxxx</password>
      </server>
   </servers>
   ```
   Where:

   |   Element    |                                 Description                                  |
   |--------------|------------------------------------------------------------------------------|
   |    `<id>`    |         Contains the name of your private Azure container registry.          |
   | `<username>` |         Contains the name of your private Azure container registry.          |
   | `<password>` | Contains the password you retrieved in the previous section of this article. |


3. Add your Azure service principal settings from an earlier section of this article to the `<servers>` collection in the *settings.xml* file; for example:

   ```xml
   <servers>
      <server>
        <id>azure-auth</id>
         <configuration>
            <client>aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa</client>
            <tenant>tttttttt-tttt-tttt-tttt-tttttttttttt</tenant>
            <key>pppppppp</key>
            <environment>AZURE</environment>
         </configuration>
      </server>
   </servers>
   ```
   Where:

   |     Element     |                                                                                   Description                                                                                   |
   |-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   |     `<id>`      |                                Specifies a unique name which Maven uses to look up your security settings when you deploy your web app to Azure.                                |
   |   `<client>`    |                                                             Contains the `appId` value from your service principal.                                                             |
   |   `<tenant>`    |                                                            Contains the `tenant` value from your service principal.                                                             |
   |     `<key>`     |                                                           Contains the `password` value from your service principal.                                                            |
   | `<environment>` | Defines the target Azure cloud environment, which is `AZURE` in this example. (A full list of environments is available in the [Maven Plugin for Azure Web Apps] documentation) |


4. Save and close the *settings.xml* file.

## Build your Docker container image and push it to your Azure container registry

1. Navigate to the completed project directory for your Spring Boot application, (e.g. "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

2. Update the `<properties>` collection in the *pom.xml* file with the login server value for your Azure Container Registry from the previous section of this tutorial; for example:

   ```xml
   <properties>
      <azure.containerRegistry>wingtiptoysregistry</azure.containerRegistry>
      <docker.image.prefix>${azure.containerRegistry}.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
      <maven.build.timestamp.format>yyyyMMddHHmmssSSS</maven.build.timestamp.format>
   </properties>
   ```
   Where:

   |           Element           |                                                                       Description                                                                       |
   |-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `<azure.containerRegistry>` |                                              Specifies the name of your private Azure container registry.                                               |
   |   `<docker.image.prefix>`   | Specifies the URL of your private Azure container registry, which is derived by appending ".azurecr.io" to the name of your private container registry. |


3. Verify that `<plugin>` for the Docker plugin in your *pom.xml* file contains the correct properties for the login server address and registry name from the previous step in this tutorial. For example:

   ```xml
   <plugin>
      <groupId>com.spotify</groupId>
      <artifactId>docker-maven-plugin</artifactId>
      <version>0.4.11</version>
      <configuration>
         <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
         <registryUrl>https://${docker.image.prefix}</registryUrl>
         <serverId>${azure.containerRegistry}</serverId>
         <dockerDirectory>src/main/docker</dockerDirectory>
         <resources>
            <resource>
               <targetPath>/</targetPath>
               <directory>${project.build.directory}</directory>
               <include>${project.build.finalName}.jar</include>
            </resource>
         </resources>
      </configuration>
   </plugin>
   ```
   Where:

   |     Element     |                                       Description                                       |
   |-----------------|-----------------------------------------------------------------------------------------|
   |  `<serverId>`   |  Specifies the property which contains name of your private Azure container registry.   |
   | `<registryUrl>` | Specifies the property which contains the URL of your private Azure container registry. |


4. Navigate to the completed project directory for your Spring Boot application and run the following command to rebuild the application and push the container to your Azure container registry:

   ```
   mvn package docker:build -DpushImage 
   ```

5. OPTIONAL: Browse to the [Azure portal] and verify that there is Docker container image named **gs-spring-boot-docker** in your container registry.

   ![Verify container in Azure portal][CR01]

## Customize your pom.xml, then build and deploy your container to Azure

Open the `pom.xml` file for your Spring Boot application in a text editor, and then locate the `<plugin>` element for `azure-webapp-maven-plugin`. This element should resemble the following example:

   ```xml
   <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>0.1.3</version>
      <configuration>
         <authentication>
            <serverId>azure-auth</serverId>
         </authentication>
         <resourceGroup>wingtiptoysresources</resourceGroup>
         <appName>maven-linux-app-${maven.build.timestamp}</appName>
         <region>westus</region>
         <containerSettings>
            <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
            <registryUrl>https://${docker.image.prefix}</registryUrl>
            <serverId>${azure.containerRegistry}</serverId>
         </containerSettings>
         <appSettings>
            <property>
               <name>PORT</name>
               <value>8080</value>
            </property>
         </appSettings>
      </configuration>
   </plugin>
   ```

There are several values that you can modify for the Maven plugin, and a detailed description for each of these elements is available in the [Maven Plugin for Azure Web Apps] documentation. That being said, there are several values that are worth highlighting in this article:

| Element | Description |
|---|---|
| `<version>` | Specifies the version of the [Maven Plugin for Azure Web Apps]. You should check the version listed in the [Maven Central Respository](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-webapp-maven-plugin%22) to ensure that you are using the latest version. |
| `<authentication>` | Specifies the authentication information for Azure, which in this example contains a `<serverId>` element that contains `azure-auth`; Maven uses that value to look up the Azure service principal values in your Maven *settings.xml* file, which you defined in an earlier section of this article. |
| `<resourceGroup>` | Specifies the target resource group, which is `wingtiptoysresources` in this example. The resource group will be created during deployment if it does not already exist. |
| `<appName>` | Specifies the target name for your web app. In this example, the target name is `maven-linux-app-${maven.build.timestamp}`, where the `${maven.build.timestamp}` suffix is appended in this example to avoid conflict. (The timestamp is optional; you can specify any unique string for the app name.) |
| `<region>` | Specifies the target region, which in this example is `westus`. (A full list is in the [Maven Plugin for Azure Web Apps] documentation.) |
| `<containerSettings>` | Specifies the properties which contain the name and URL of your container. |
| `<appSettings>` | Specifies any unique settings for Maven to use when deploying your web app to Azure. In this example, a `<property>` element contains a name/value pair of child elements that specify the port for your app. |

> [!NOTE]
>
> The settings to change the port number in this example are only necessary when you are changing the port from the default.
>

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the *pom.xml* file; for example:
   ```shell
   mvn clean package
   ```

1. Deploy your web app to Azure by using Maven; for example:
   ```shell
   mvn azure-webapp:deploy
   ```

Maven will deploy your web app to Azure; if the web app does not already exist, it will be created.

> [!NOTE]
>
> If the region which you specify in the `<region>` element of your *pom.xml* file does not have enough servers available when you start your deployment, you might see an error similar to the following example:
>
> ```
> [INFO] Start deploying to Web App maven-linux-app-20170804...
> [INFO] ------------------------------------------------------------------------
> [INFO] BUILD FAILURE
> [INFO] ------------------------------------------------------------------------
> [INFO] Total time: 31.059 s
> [INFO] Finished at: 2017-08-04T12:15:47-07:00
> [INFO] Final Memory: 51M/279M
> [INFO] ------------------------------------------------------------------------
> [ERROR] Failed to execute goal com.microsoft.azure:azure-webapp-maven-plugin:0.1.3:deploy (default-cli) on project gs-spring-boot-docker: null: MojoExecutionException: CloudException: OnError while emitting onNext value: retrofit2.Response.class
> ```
>
> If this happens, you can specify another region and re-run the Maven command to deploy your application.
>
>

When your web has been deployed, you will be able to manage it by using the [Azure portal].

* Your web app will be listed in **App Services**:

   ![Web app listed in Azure portal App Services][AP01]

* And the URL for your web app will be listed in the **Overview** for your web app:

   ![Determining the URL for your web app][AP02]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about the various technologies discussed in this article, see the following articles:

* [Maven Plugin for Azure Web Apps]

* [Log in to Azure from the Azure CLI](/azure/xplat-cli-connect)

* [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli)

* [Maven Settings Reference](https://maven.apache.org/settings.html)

* [Docker plugin for Maven]

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Container Service (AKS)]: https://azure.microsoft.com/services/container-service/
[Azure for Java Developers]: /java/azure/
[Azure portal]: https://portal.azure.com/
[Maven Plugin for Azure Web Apps]: https://github.com/Microsoft/azure-maven-plugins/tree/master/azure-webapp-maven-plugin
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service/containers/tutorial-custom-docker-image
[Docker]: https://www.docker.com/
[Docker plugin for Maven]: https://github.com/spotify/docker-maven-plugin
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/

[Java Development Kit (JDK)]: https://aka.ms/azure-jdks
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- IMG List -->

[SB01]: ./media/deploy-spring-boot-java-app-from-container-registry-using-maven-plugin/SB01.png
[CR01]: ./media/deploy-spring-boot-java-app-from-container-registry-using-maven-plugin/CR01.png
[AP01]: ./media/deploy-spring-boot-java-app-from-container-registry-using-maven-plugin/AP01.png
[AP02]: ./media/deploy-spring-boot-java-app-from-container-registry-using-maven-plugin/AP02.png
[TL01]: ./media/deploy-spring-boot-java-app-from-container-registry-using-maven-plugin/TL01.png

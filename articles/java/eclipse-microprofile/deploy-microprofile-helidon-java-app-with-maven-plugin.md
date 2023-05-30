---
title: Deploy a Helidon Web App to Azure App Service with Maven
description: Learn how to deploy a Helidon App to App Service on Linux using the Maven Plugin for Azure Web App.
services: app-service
ms.date: 06/10/2020
ms.service: app-service
ms.topic: article
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-helidon, devx-track-azurecli, devx-track-extended-java
#Customer intent: As a Java developer, I want to deploy MicroProfile apps to Azure so that I don't have to deal with app server configuration and management.
---

# Deploy a Helidon Web App to Azure App Service with Maven

In this quickstart, you'll use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Helidon application to [Azure App Service on Linux](/azure/app-service/containers/). You'll want to choose Java SE deployment over [Tomcat and WAR files](/azure/app-service/containers/quickstart-java) when you want to consolidate your app's dependencies, runtime, and configuration into a single deployable artifact.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* The [Azure CLI](/cli/azure/), either locally or through [Azure Cloud Shell](https://shell.azure.com).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* Apache [Maven](https://maven.apache.org/), Version 3.

## Sign in to Azure CLI

The simplest and easiest way to get the Maven Plugin deploying your Helidon application is by using [Azure CLI](/cli/azure/).

Sign into your Azure account by using the Azure CLI:

```azurecli
az login
```

Follow the instructions to complete the sign-in process.

## Create sample app from MicroProfile Starter

In this section, you'll create a Helidon application and test it locally.

1. Open a web browser and navigate to the [MicroProfile Starter](https://start.microprofile.io/) site.

   :::image type="content" source="media/helidon/microprofile-starter-helidon.png" alt-text="Screenshot showing MicroProfile Starter with Helidon runtime selected.":::

1. Input or Select the field like follows.

   |  Field  | Value  |
   | ---- | ---- |
   |  groupId  |  com.microsoft.azure.samples.helidon  |
   |  artifactId  |  helidon-hello-azure  |
   |  MicroProfile Version  |  MP 3.2  |
   |  Java SE Version  |  Java 11  |
   |  MicroProfile Runtime  |  Helidon  |
   |  Examples for Specifications  |  Metrics, OpenAPI  |

1. Select **DOWNLOAD** to download the project.

1. Unzip the archive file; for example:

   ```bash
   unzip helidon-hello-azure.zip
   ```

1. Or you can create the project with following command:

   ```bash
   mvn -U archetype:generate -DinteractiveMode=false \
       -DarchetypeGroupId=io.helidon.archetypes \
       -DarchetypeArtifactId=helidon-quickstart-se \
       -DarchetypeVersion=2.0.0 \
       -DgroupId=com.microsoft.azure.samples.helidon \
       -DartifactId=helidon-hello-azure \
       -Dpackage=com.microsoft.azure.samples.helidon
   ```

1. Change directory to the completed project; for example:

   ```bash
   cd helidon-hello-azure/
   ```

1. Build the JAR file using Maven; for example:

   ```bash
   mvn clean package
   ```

1. When the web app has been created, start the web app using Maven; for example:

   ```bash
   java -jar target/helidon-hello-azure.jar
   ```

1. Test the web app by browsing to it locally using a web browser. For example, you could use the following command if you have curl available:

   ```bash
   curl http://localhost:8080/greet
   ```

1. You should see the following message displayed: **Hello World**

## Configure Maven Plugin for Azure App Service

In this section, you'll configure the Helidon project *pom.xml* file so that Maven can deploy the app to Azure App Service on Linux.

1. Open the *pom.xml* file in a code editor.

2. In the `<build>` section of the *pom.xml* file, insert the following `<plugin>` entry inside the `<plugins>` tag.

   ```xml
   <build>
     <finalName>helidon-hello-azure</finalName>
     <plugins>
       <plugin>
         <groupId>com.microsoft.azure</groupId>
         <artifactId>azure-webapp-maven-plugin</artifactId>
         <version>1.10.0</version>
       </plugin>
     </plugins>
   </build>
   ```

3. Then you can configure the deployment, run the following Maven command:

   ```bash
   mvn azure-webapp:config
   ```

   Select the following options when prompted:

   |  Input Field  |  Input/Select Value  |
   | ---- | ---- |
   |  Define value for OS(Default: Linux):  | 1. linux  |
   |  Define value for javaVersion(Default: Java 8):   | 1. Java 11  |
   |  Confirm (Y/N) | y |

   This command produces output similar to the following example:

   ```output
   [INFO] Scanning for projects...
   [INFO]
   [INFO] ------< com.microsoft.azure.samples.helidon:helidon-hello-azure >-------
   [INFO] Building myproject 1.0-SNAPSHOT
   [INFO] --------------------------------[ jar ]---------------------------------
   [INFO]
   [INFO] --- azure-webapp-maven-plugin:1.10.0:config (default-cli) @ helidon-hello-azure ---
   Define value for OS(Default: Linux):
   1. linux [*]
   2. windows
   3. docker
   Enter index to use: 1
   Define value for javaVersion(Default: Java 8):
   1. Java 11
   2. Java 8 [*]
   Enter index to use: 1
   Please confirm webapp properties
   AppName : helidon-hello-azure-1600998900939
   ResourceGroup : helidon-hello-azure-1600998900939-rg
   Region : westeurope
   PricingTier : PremiumV2_P1v2
   OS : Linux
   RuntimeStack : JAVA 11-java11
   Deploy to slot : false
   Confirm (Y/N)? : y
   [INFO] Saving configuration to pom.
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  02:44 min
   [INFO] Finished at: 2020-09-25T10:57:35+09:00
   [INFO] ------------------------------------------------------------------------
   ```

4. Add the `<appSettings>` section to the `<configuration>` section of `PORT`,  `WEBSITES_PORT`, and `WEBSITES_CONTAINER_START_TIME_LIMIT`. Add the `<include>/libs/*.jar</include>` to the resources in deployment.

   ```xml
   <plugin>
     <groupId>com.microsoft.azure</groupId>
     <artifactId>azure-webapp-maven-plugin</artifactId>
     <version>1.10.0</version>
     <configuration>
       <schemaVersion>V2</schemaVersion>
       <resourceGroup>microprofile</resourceGroup>
       <appName>helidon-hello-azure-1591663020899</appName>
       <pricingTier>P1v2</pricingTier>
       <region>japaneast</region>
       <runtime>
         <os>linux</os>
         <javaVersion>java11</javaVersion>
         <webContainer>java11</webContainer>
       </runtime>
       <appSettings>
         <property>
           <name>PORT</name>
           <value>8080</value>
         </property>
         <property>
           <name>WEBSITES_PORT</name>
           <value>8080</value>
         </property>
         <property>
           <name>WEBSITES_CONTAINER_START_TIME_LIMIT</name>
           <value>600</value>
         </property>
       </appSettings>
       <deployment>
         <resources>
           <resource>
             <directory>${project.basedir}/target</directory>
             <includes>
               <include>*.jar</include>
               <include>/libs/*.jar</include>
             </includes>
           </resource>
         </resources>
       </deployment>
     </configuration>
   ```

## Deploy the app to Azure

After you've configured all of the settings in the preceding sections of this article, you're ready to deploy your web app to Azure. To do so, use the following steps:

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the *pom.xml* file; for example:

   ```bash
   mvn clean package
   ```

1. Deploy your web app to Azure by using Maven; for example:

   ```bash
   mvn azure-webapp:deploy
   ```

Maven will deploy your web app to Azure. If the web app or web app plan doesn't already exist, it will be created for you. It might take a few minutes before the web app is visible at the URL shown in the output. Navigate to the URL in a Web browser. You should see the message displayed: **Hello World**

When your web has been deployed, you can manage it through the [Azure portal].

Your web app will be listed in **App Services**, as shown in the following screenshot:

:::image type="content" source="media/helidon/azure-portal-app-service-screen.png" alt-text="Screenshot of Azure portal with web app listed on App Services screen." lightbox="media/helidon/azure-portal-app-service-screen.png":::

You can access to your web app by selecting **Browse** on the **Overview** page for your web app:

:::image type="content" source="media/helidon/azure-portal-app-service-overview.png" alt-text="Screenshot of Azure portal showing the web app overview page." lightbox="media/helidon/azure-portal-app-service-overview.png":::

Verify that the deployment was successful by using the same cURL command as before(`/data/hello`), using your web app URL from the Portal instead of `localhost`. You should see the following message displayed: **Hello World**

## Confirm the log stream from the running App Service

You can see (or "tail") the logs from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

```azurecli
az webapp log tail \
    --resource-group microprofile \
    --name helidon-hello-azure-1600998900939
```

:::image type="content" source="media/helidon/azure-cli-app-service-log-stream.png" alt-text="Screenshot of terminal window showing log output." lightbox="media/helidon/azure-cli-app-service-log-stream.png":::

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

* From the Azure portal, select Resource group from the left menu.
* Enter **microprofile** in the **Filter by name** field, the resource group created in this tutorial should have this prefix.
* Select the resource group created in this tutorial.
* Select Delete resource group from the top menu.

## Next steps

To learn more about MicroProfile and Azure, continue to the MicroProfile on Azure documentation center.

> [!div class="nextstepaction"]
> [MicroProfile on Azure](./index.yml)

### Additional resources

For more information about the various technologies discussed in this article, see the following articles:

* [Maven Plugin for Azure Web Apps]

* [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli)

* [Maven Settings Reference](https://maven.apache.org/settings.html)

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure for Java Developers]: ../index.yml
[Azure portal]: https://portal.azure.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Maven Plugin for Azure Web Apps]: https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md

[Java Development Kit (JDK)]: ../fundamentals/java-support-on-azure.md
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- IMG List -->

[AP01]: media/deploy-spring-boot-java-app-with-maven-plugin/web-app-listed-azure-portal.png
[AP02]: media/deploy-spring-boot-java-app-with-maven-plugin/determine-web-app-url.png

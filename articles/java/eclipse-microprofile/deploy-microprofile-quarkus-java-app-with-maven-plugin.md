---
title: Deploy a Quarkus Web App to Azure App Service with Maven
description: Learn how to deploy a Quarkus App to App Service on Linux using the Maven Plugin for Azure Web App.
author: KarlErickson
ms.author: jialuogan
ms.date: 06/10/2020
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-appsvc, linux-related-content
#Customer intent: As a Java developer, I want to deploy MicroProfile apps to Azure so that I don't have to deal with app server configuration and management.
---

# Deploy a Quarkus web app to Azure App Service with Maven

In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Quarkus application to [Azure App Service on Linux](/azure/app-service/containers/). Choose Java SE deployment over [Tomcat and WAR files](/azure/app-service/containers/quickstart-java) when you want to consolidate your app's dependencies, runtime, and configuration into a single deployable artifact.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* The [Azure CLI](/cli/azure/), either locally or through [Azure Cloud Shell](https://shell.azure.com).

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).

* Apache [Maven](https://maven.apache.org/), version 3.

## Sign into the Azure CLI

The simplest and easiest way to get the Maven Plugin deploying your Quarkus application is by using the [Azure CLI](/cli/azure/).

Sign into your Azure account by using the Azure CLI:

```azurecli
az login
```

Follow the instructions to complete the sign-in process.

## Create sample app from the MicroProfile Starter

In this section, you create a Quarkus application and test it locally.

### Create a Java SE 8 base project

1. Open a web browser and navigate to the [MicroProfile Starter](https://start.microprofile.io/) site.

    :::image type="content" source="media/quarkus/microprofile-starter-quarkus.png" alt-text="Screenshot showing MicroProfile Starter with Quarkus runtime selected.":::

1. Provide the following values for the indicated fields:

    | Field                       | Value                               |
    |-----------------------------|-------------------------------------|
    | groupId                     | com.microsoft.azure.samples.quarkus |
    | artifactId                  | quarkus-hello-azure                 |
    | MicroProfile Version        | MP 3.2                              |
    | Java SE Version             | Java 8                              |
    | MicroProfile Runtime        | Quarkus                             |
    | Examples for Specifications | Metrics, OpenAPI                    |

1. Select **DOWNLOAD** to download the project.

1. Unzip the archive file by using the following command:

    ```bash
    unzip Quarkus-hello-azure.zip
    ```

### Create Java SE 11 base project

To create the Java 11 base project, use the following command:

```bash
mvn io.quarkus:quarkus-maven-plugin:2.6.1.Final:create \
  -DprojectGroupId=com.microsoft.azure.samples.quarkus \
  -DprojectArtifactId=quarkus-hello-azure \
  -DclassName="com.microsoft.azure.samples.quarkus.App" \
  -Dpath="/hello"
```

### Run the application in a local environment

1. Change the directory to the completed project by using the following command:

    ```bash
    cd quarkus-hello-azure/
    ```

1. Build and run the project by using the following Maven command:

    ```bash
    mvn quarkus:dev
    ```

1. Test the web application by browsing to it locally using a web browser. For example, you could use the following command if you have `curl` available:

    For a Java SE 8 project:

    ```bash
    curl http://localhost:8080/data/hello
    ```

    For a Java SE 11 project:

    ```bash
    curl http://localhost:8080/hello
    ```

1. You should see the following message displayed: **Hello World** or **hello**.

## Configure the Maven plugin for Azure App Service

In this section, you configure the Quarkus project **pom.xml** file so that Maven can deploy the app to Azure App Service on Linux.

1. Open the **pom.xml** file in a code editor.

1. In the `<build>` section of the **pom.xml** file, insert the following `<plugin>` entry inside the `<plugins>` tag after `maven-surefire-plugin`.

    ```xml
    <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>2.13.0</version>
    </plugin>
    ```

1. To configure the deployment, run the following Maven command:

    ```bash
    mvn azure-webapp:config
    ```

    Select the following options when prompted:

    | Input Field                                    | Input/Select Value                  |
    |------------------------------------------------|-------------------------------------|
    | Choose a subscription                          | Enter your subscription ID.         |
    | Define value for OS(Default: Linux):           | 2. linux                            |
    | Define value for javaVersion(Default: Java 8): | 2. Java 11                          |
    | Define value for pricingTier(Default: P1v2):   | 3. P1v2                             |
    | Confirm (Y/N)                                  | y                                   |

    This command produces output similar to the following example:

    ```output
    [INFO] Scanning for projects...
    [INFO]
    [INFO] ------< com.microsoft.azure.samples.quarkus:quarkus-hello-azure >-------
    [INFO] Building quarkus-hello-azure 1.0-SNAPSHOT
    [INFO] --------------------------------[ jar ]---------------------------------
    [INFO]
    [INFO] --- azure-webapp-maven-plugin:2.13.0:config (default-cli) @ quarkus-hello-azure ---
    [INFO] Auth type: OAUTH2
    Username: abc@xyz.com
    Available subscriptions:
    *  1: Subscription1(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx)
       2: Subscription2(yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyy)
    Please choose a subscription [xxx]: 1
    [INFO] Subscription: Subscription1(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx)
    Define value for OS [Linux]:
      1: Windows
    * 2: Linux
      3: Docker
    Enter your choice: 2
    Define value for javaVersion [Java 8]:
    * 1: Java 8
      2: Java 11
      3: Java 17
    Enter your choice: 2
    Define value for pricingTier [P1v2]:
      1: D1
      2: B3
    * 3: P1v2
      4: P1v3
      5: P2v2
      6: P2v3
      7: P3v2
      8: P3v3
      9: B1
     10: B2
     11: F1
     12: S1
     13: S2
     14: S3
     15: EP3
     16: EP2
     17: EP1
     18: Y1
     19: FC1
    Enter your choice: 3
    Please confirm webapp properties
    Subscription Id : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx
    AppName : quarkus-hello-azure-1601011883156
    ResourceGroup : quarkus-hello-azure-1601011883156-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Java : Java 11
    Web server stack: Java SE
    Deploy to slot : false
    Confirm (Y/N) [Y]:
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  16.502 s
    [INFO] Finished at: 2020-09-25T14:31:34+09:00
    [INFO] ------------------------------------------------------------------------
    ```

1. Add the `<appSettings>` section to the `<configuration>` section of `PORT`, `WEBSITES_PORT`, and `WEBSITES_CONTAINER_START_TIME_LIMIT`. Your XML entry for `azure-webapp-maven-plugin` should look similar to the following example:

    ```xml
    <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>2.13.0</version>
      <configuration>
        <schemaVersion>V2</schemaVersion>
        <resourceGroup>microprofile</resourceGroup>
        <appName>quarkus-hello-azure-1591836715762</appName>
        <pricingTier>P1v2</pricingTier>
        <region>centralus</region>
        <runtime>
          <os>linux</os>
          <javaVersion>java 11</javaVersion>
          <webContainer>java SE</webContainer>
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
              </includes>
            </resource>
          </resources>
        </deployment>
      </configuration>
    </plugin>
    ```

1. Add the following entry to the **src/main/resources/application.properties** file to create the uber-jar, also known as a *fat Jar*:

    ```bash
    quarkus.package.type=uber-jar
    ```

## Deploy the app to Azure

After configuring all of the settings in the preceding sections of this article, you're ready to deploy your web application to Azure. To do so, use the following steps:

1. If you made any changes to the **pom.xml** file, rebuild the JAR file by using the following command:

    ```bash
    mvn clean package
    ```

1. Deploy your web app to Azure by using the following command:

    ```bash
    mvn azure-webapp:deploy
    ```

If the deployment succeeds, you see the following output:

```output
[INFO] Successfully deployed the artifact to https://quarkus-hello-azure-1591836715762.azurewebsites.net
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  02:20 min
[INFO] Finished at: 2020-06-11T10:06:51+09:00
[INFO] ------------------------------------------------------------------------
```

Maven deploys your web application to Azure. If the web application or web application plan doesn't already exist, it's created for you. It might take a few minutes before the web application is visible at the URL shown in the output. Navigate to the URL in a web browser. You should see the following screen:

:::image type="content" source="media/quarkus/quarkus-front-page-11.png" alt-text="Screenshot of web browser showing front page of Quarkus.":::

After your web application is deployed, you can manage it through the [Azure portal].

Your web application is listed in the **microprofile** resource group.

You can access to your web application by selecting **Browse** in the **Overview** page for your web app. Verify that the deployment was successful and is running.

## Confirm the log stream from the running App Service

You can view the complete logs or use `tail` to view the end of the logs, from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

```azurecli
az webapp log tail 
    --resource-group microprofile \
    --name quarkus-hello-azure-1601011883156
```

:::image type="content" source="media/quarkus/azure-cli-app-service-log-stream.png" alt-text="Screenshot of terminal window showing log stream." lightbox="media/quarkus/azure-cli-app-service-log-stream.png":::

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. To do so, use the following steps:

1. From the Azure portal, select **Resource group** from the menu.

1. Enter **microprofile** in the **Filter by name** field. The resource group created in this tutorial should have this prefix.

1. Select the resource group created in this tutorial.

1. Select **Delete resource group** from the menu.

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

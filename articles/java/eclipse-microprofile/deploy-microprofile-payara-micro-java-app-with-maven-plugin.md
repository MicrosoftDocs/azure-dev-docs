---
title: Deploy a Payara Micro Web App to Azure App Service with Maven
description: Learn how to deploy a Payara Micro App to App Service on Linux using the Maven Plugin for Azure Web App.
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.date: 06/10/2020
ms.topic: article
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-payara, devx-track-azurecli, devx-track-extended-java, linux-related-content
#Customer intent: As a Java developer, I want to deploy MicroProfile apps to Azure so that I don't have to deal with app server configuration and management.
---

# Deploy a Payara Micro web app to Azure App Service with Maven

In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Payara Micro application to [Azure App Service on Linux](/azure/app-service/containers/). Choose Java SE deployment over [Tomcat and WAR files](/azure/app-service/containers/quickstart-java) when you want to consolidate your app's dependencies, runtime, and configuration into a single deployable artifact.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* The [Azure CLI](/cli/azure/), either locally or through [Azure Cloud Shell](https://shell.azure.com).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* Apache [Maven](https://maven.apache.org/), version 3.

## Sign in to the Azure CLI

The simplest and easiest way to get the Maven Plugin deploying your Payara Micro application is by using the [Azure CLI](/cli/azure/).

Sign in to your Azure account by using the Azure CLI:

```azurecli
az login
```

Follow the instructions to complete the sign-in process.

## Create a sample app from the MicroProfile Starter

In this section, you create a Payara Micro application and test it locally.

1. Open a web browser and navigate to the [MicroProfile Starter](https://start.microprofile.io/) site.

    :::image type="content" source="media/payara-micro/microprofile-starter-payara-micro.png" alt-text="Screenshot showing MicroProfile Starter with Payara Micro runtime selected.":::

1. Input or select the field values according to the following table:

    | Field                       | Value                                   |
    |-----------------------------|-----------------------------------------|
    | groupId                     | com.microsoft.azure.samples.payaramicro |
    | artifactId                  | payaramicro-hello-azure                 |
    | MicroProfile Version        | MP 3.2                                  |
    | Java SE Version             | Java 11                                 |
    | MicroProfile Runtime        | PayaraMicro                             |
    | Examples for Specifications | Metrics, OpenAPI                        |

1. Select **DOWNLOAD** to download the project.

1. Unzip the archive file by using the following command:

    ```bash
    unzip payaraMicro-hello-azure.zip
    ```

### Run the application in a local environment

1. Change the directory to the completed project by using the following command:

    ```bash
    cd payaramicro-hello-azure/
    ```

1. Build the project by using the following Maven command:

    ```bash
    mvn clean package
    ```

1. Run the project by using the following command:

    ```bash
    java -jar target/payaramicro-hello-azure-microbundle.jar
    ```

1. Test the web app by browsing to it locally using a web browser. For example, you could use the following command if you have `curl` available:

    ```bash
    curl http://localhost:8080/data/hello
    ```

1. You should see the following message displayed: **Hello World**.

## Configure the Maven plugin for Azure App Service

In this section, you configure the Payara Micro project **pom.xml** file so that Maven can deploy the app to Azure App Service on Linux.

1. Open the **pom.xml** file in a code editor.

1. In the `<build>` section of the **pom.xml** file, insert the following `<plugin>` entry inside the `<plugins>` tag:

    ```xml
    <build>
      <finalName>payaramicro-hello-azure</finalName>
      <plugins>
        <plugin>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-webapp-maven-plugin</artifactId>
            <version>1.10.0</version>
        </plugin>
      </plugins>
    </build>
    ```

1. Configure the deployment by running the following Maven command:

    ```bash
    mvn azure-webapp:config
    ```

    Select the following options when prompted:

    | Input Field                                         | Input/Select Value |
    |-----------------------------------------------------|--------------------|
    | Define value for OS(Default: Linux):                | 1. linux           |
    | Define value for javaVersion(Default: Java 8):      | 1. Java 11         |
    | Define value for runtimeStack(Default: TOMCAT 8.5): | TOMCAT 8.5         |
    | Confirm (Y/N)                                       | y                  |

    [!NOTE]
    Even though we don't use Tomcat, select `TOMCAT 8.5` at this time. During the detailed configuration, you modify the value from `TOMCAT 8.5` to `Java11`.

    This command produces output similar to the following example:

    ```output
    [INFO] Scanning for projects...
    [INFO]
    [INFO] --< com.microsoft.azure.samples.payaramicro:payaramicro-hello-azure >---
    [INFO] Building payaramicro-hello-azure 1.0-SNAPSHOT
    [INFO] --------------------------------[ war ]---------------------------------
    [INFO]
    [INFO] --- azure-webapp-maven-plugin:1.10.0:config (default-cli) @ payaramicro-hello-azure ---
    Define value for OS(Default: Linux):
    1. linux [*]
    2. windows
    3. docker
    Enter index to use:
    Define value for javaVersion(Default: Java 8):
    1. Java 11
    2. Java 8 [*]
    Enter index to use: 1
    Define value for runtimeStack(Default: TOMCAT 8.5):
    1. TOMCAT 9.0
    2. TOMCAT 8.5 [*]
    Enter index to use:
    Please confirm webapp properties
    AppName : payaramicro-hello-azure-1601009217863
    ResourceGroup : payaramicro-hello-azure-1601009217863-rg
    Region : westeurope
    PricingTier : PremiumV2_P1v2
    OS : Linux
    RuntimeStack : TOMCAT 8.5-java11
    Deploy to slot : false
    Confirm (Y/N)? : y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  22.302 s
    [INFO] Finished at: 2020-09-25T13:47:11+09:00
    [INFO] ------------------------------------------------------------------------
    ```

1. Modify the `runtime` entry from `TOMCAT 8.5` to `java11` and the `deployment` entry from `*.war` to `*.jar`. Then add the `<appSettings>` section to the `<configuration>` section of `PORT`, `WEBSITES_PORT`, and `WEBSITES_CONTAINER_START_TIME_LIMIT`. Your XML entry for `azure-webapp-maven-plugin` should look similar to the following example:

    ```xml
    <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>1.9.1</version>
      <configuration>
        <schemaVersion>V2</schemaVersion>
        <resourceGroup>microprofile</resourceGroup>
        <appName>payaramicro-hello-azure-1591860934798</appName>
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
              </includes>
            </resource>
          </resources>
        </deployment>
      </configuration>
    </plugin>
    ```

## Deploy the app to Azure

After you configure all of the settings in the preceding sections of this article, you're ready to deploy your web app to Azure. To do so, use the following steps:

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the **pom.xml** file, by using the following command:

    ```bash
    mvn clean package
    ```

1. Deploy your web app to Azure by using Maven in the following command:

    ```bash
    mvn azure-webapp:deploy
    ```

If the deployment succeeded, you see the following output:

```bash
[INFO] Successfully deployed the artifact to https://payaramicro-hello-azure-1601009217863.azurewebsites.net
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:58 min
[INFO] Finished at: 2020-09-25T13:55:13+09:00
[INFO] ------------------------------------------------------------------------
```

Maven deploys your web app to Azure. If the web app or web app plan doesn't already exist, it's created for you. It might take a few minutes before the web app is visible at the URL shown in the output. Navigate to the URL in a Web browser. You should see the following screen:

:::image type="content" source="media/payara-micro/payara-micro-front-page.png" alt-text="Screenshot of web browser showing front page of Payara Micro.":::

After your web app deploys, you can manage it through the [Azure portal].

Your web app is listed in the **microprofile** resource group.

You can access to your web app by selecting **Browse** on the **Overview** page for your web app. Verify that the deployment was successful and running.

## Confirm the log stream from the running App Service

You can view the logs in their entirety or use `tail` to view the end of the logs, from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

```azurecli
az webapp log tail \
    --resource-group microprofile \
    --name payaramicro-hello-azure-1601009217863
```

:::image type="content" source="media/payara-micro/azure-cli-app-service-log-stream.png" alt-text="Screenshot of terminal window showing log stream." lightbox="media/payara-micro/azure-cli-app-service-log-stream.png":::

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

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

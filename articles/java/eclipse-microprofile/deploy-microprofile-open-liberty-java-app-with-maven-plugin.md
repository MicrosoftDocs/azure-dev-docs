---
title: Deploy an Open Liberty Web App to Azure App Service with Maven
description: Learn how to deploy an Open Liberty App to App Service on Linux using the Maven Plugin for Azure Web App.
author: KarlErickson
ms.author: jialuogan
ms.date: 01/13/2022
ms.topic: article
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-azurecli, devx-track-extended-java, linux-related-content
#Customer intent: As a Java developer, I want to deploy MicroProfile apps to Azure so that I don't have to deal with app server configuration and management.
---

# Deploy an Open Liberty micro web app to Azure App Service with Maven

In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy an Open Liberty application to [Azure App Service on Linux](/azure/app-service/containers/). Choose Java SE deployment over [Tomcat and WAR files](/azure/app-service/containers/quickstart-java) when you want to consolidate your app's dependencies, runtime, and configuration into a single deployable artifact.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> While Azure App Service is engineered, operated, and supported by Microsoft, the software you run on top of it is subject to its own support plan support and license terms. For details about support of the software described in this article, see the main pages for that software as listed in the article.
> For support for Open Liberty, see [The Open Liberty support page](https://openliberty.io/support/).
> For support for WebSphere Liberty, see [IBM Cloud Support](https://www.ibm.com/cloud/support).

## Prerequisites

* The [Azure CLI](/cli/azure/), either locally or through [Azure Cloud Shell](https://shell.azure.com).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* Apache [Maven](https://maven.apache.org/), version 3.

## Sign in to the Azure CLI

The simplest and easiest way to get the Maven Plugin deploying your Open Liberty application is by using the [Azure CLI](/cli/azure/).

Sign in to your Azure account by using the Azure CLI:

```azurecli
az login
```

Follow the instructions to complete the sign-in process.

## Create a sample app from the MicroProfile Starter

In this section, you create an Open Liberty application and test it locally.

1. Open a web browser and navigate to the [MicroProfile Starter](https://start.microprofile.io/) site.

    :::image type="content" source="media/open-liberty/microprofile-starter-open-liberty-micro.png" alt-text="Screenshot showing MicroProfile Starter with Open Liberty runtime selected.":::

1. Use the values in the following table to populate the values in the MicroProfile Starter:

    | Field                       | Value                                   |
    |-----------------------------|-----------------------------------------|
    | groupId                     | com.microsoft.azure.samples.openliberty |
    | artifactId                  | openliberty-hello-azure                 |
    | MicroProfile Version        | MP 4.0                                  |
    | Java SE Version             | Java 11                                 |
    | MicroProfile Runtime        | Open Liberty                            |
    | Examples for Specifications | Metrics, OpenAPI                        |

1. Select **DOWNLOAD** to download the project.

1. Unzip the archive file by using the following command:

    ```bash
    unzip openliberty-hello-azure.zip
    ```

### Run the application in a local environment

1. Change directory to the completed project by using the following command:

    ```bash
    cd openliberty-hello-azure/
    ```

1. Build the project using Maven by using the following command:

    ```bash
    mvn clean package
    ```

1. Run the project by using the following command:

    ```bash
    java -jar target/openliberty-hello-azure.jar
    ```

1. Test the web app by browsing to it locally using a web browser. For example, you could use the following command if you have `curl` available:

    ```bash
    curl http://localhost:9080/data/hello
    ```

1. You should see the following message displayed: **Hello World**

## Configure Maven plugin for Azure App Service

In this section, you configure the Open Liberty project **pom.xml** file so that Maven can deploy the app to Azure App Service on Linux.

1. To configure the deployment, run the following Maven command:

    ```bash
    mvn com.microsoft.azure:azure-webapp-maven-plugin:2.3.0:config
    ```

    Select the following options when prompted:

    | Input Field                                         | Input/Select Value |
    |-----------------------------------------------------|--------------------|
    | Define value for OS(Default: Linux):                | 1. linux           |
    | Define value for javaVersion(Default: Java 8):      | 2. Java 11         |
    | Define value for runtimeStack(Default: TOMCAT 8.5): | 2. TOMCAT 8.5      |
    | Confirm (Y/N)                                       | y                  |

    > [!NOTE]
    > Even though we don't use Tomcat, select `TOMCAT 8.5` at this time. During the detailed configuration, you modify the value from `TOMCAT 8.5` to `Java`.
    >
    > This example uses a specific version of the Azure App Service Maven plugin. You should consider using the latest version available. You can discover the number of the latest version by visiting a site such as [mvnrepository.com](https://mvnrepository.com/artifact/com.microsoft.azure/azure-webapp-maven-plugin).

    This command produces output similar to the following example:

    ```output
    [INFO] Scanning for projects...
    [INFO]
    [INFO] ---< com.microsoft.azure.samples.openliberty:openliberty-hello-azure >----
    [INFO] Building openliberty-hello-azure 1.0-SNAPSHOT
    [INFO] --------------------------------[ war ]---------------------------------
    [INFO]
    [INFO] --- azure-webapp-maven-plugin:2.3.0:config (default-cli) @ openliberty-hello-azure ---
    Auth type: AZURE_CLI
    Default subscription:
    Username:
    [INFO] Subscription:
    [INFO] It may take a few minutes to load all Java Web Apps, please be patient.
    Define value for OS [Linux]:
      1: Windows
    * 2: Linux
      3: Docker
    Enter your choice:
    Define value for javaVersion [Java 8]:
    * 1: Java 8
      2: Java 11
    Enter your choice: 2
    Define value for webContainer [Tomcat 8.5]:
      1: Jbosseap 7
    * 2: Tomcat 8.5
      3: Tomcat 9.0
    Enter your choice:
    Define value for pricingTier [P1v2]:
      1: B1
      2: B2
      3: B3
      4: D1
      5: EP1
      6: EP2
      7: EP3
      8: F1
    *  9: P1v2
      10: P1v3
      11: P2v2
      12: P2v3
      13: P3v2
      14: P3v3
      15: S1
      16: S2
      17: S3
      18: Y1
    Enter your choice:
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : openliberty-hello-azure-1642075767899
    ResourceGroup : openliberty-hello-azure-1642075767899-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Java : Java 11
    Web server stack: Tomcat 8.5
    Deploy to slot : false
    Confirm (Y/N) [Y]:
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  21.981 s
    [INFO] Finished at: 2022-01-13T21:09:39+09:00
    [INFO] ------------------------------------------------------------------------
    ```

1. Modify the **server.xml** file under the **/src/main/liberty/config/** directory for running the Application on Azure Web Apps. In the file, add the `host="*"` line in the `<httpEndpoint>` tag, as shown in the following example:

    ```xml
    <httpEndpoint id="defaultHttpEndpoint"
                  host="*"
                  httpPort="9080"
                  httpsPort="9443"/>
    ```

1. Modify the `runtime` entry from `TOMCAT 8.5` to `java`, and the `deployment` from `*.war` to `*.jar` in the **pom.xml** file. Then add the `<appSettings>` section to the `<configuration>` section of `PORT`, `WEBSITES_PORT`, and `WEBSITES_CONTAINER_START_TIME_LIMIT`. Your XML entry for `azure-webapp-maven-plugin` should look similar to the following example:

    ```xml
    <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>2.3.0</version>
      <configuration>
        <schemaVersion>v2</schemaVersion>
        <subscriptionId>********-****-****-****-************</subscriptionId>
        <resourceGroup>openliberty-hello-azure-1642075767899-rg</resourceGroup>
        <appName>openliberty-hello-azure-1642075767899</appName>
        <pricingTier>P1v2</pricingTier>
        <region>japaneast</region>
        <runtime>
          <os>Linux</os>
          <javaVersion>Java 11</javaVersion>
          <webContainer>java</webContainer>
        </runtime>
      <appSettings>
        <property>
          <name>PORT</name>
          <value>9080</value>
        </property>
          <property>
          <name>WEBSITES_PORT</name>
          <value>9080</value>
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

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the **pom.xml** file by using the following command:

    ```bash
    mvn clean package
    ```

1. Deploy your web app to Azure by using Maven by using the following command:

    ```bash
    mvn azure-webapp:deploy
    ```

    If the deployment succeeded, you see the following output:

    ```output
    [INFO] Scanning for projects...
    [INFO]
    [INFO] ---< com.microsoft.azure.samples.openliberty:openliberty-hello-azure >----
    [INFO] Building openliberty-hello-azure 1.0-SNAPSHOT
    [INFO] --------------------------------[ war ]---------------------------------
    [INFO]
    [INFO] --- azure-webapp-maven-plugin:2.3.0:deploy (default-cli) @ openliberty-hello-azure ---
    Auth type: AZURE_CLI
    [INFO] Creating web app openliberty-hello-azure-1642075767899...
    [INFO] Successfully created Web App openliberty-hello-azure-1642075767899.
    [INFO] Trying to deploy external resources to openliberty-hello-azure-1642075767899...
    [INFO] Successfully deployed the resources to openliberty-hello-azure-1642075767899
    [INFO] Trying to deploy artifact to openliberty-hello-azure-1642075767899...
    [INFO] Deploying (/Users/Downloads/openliberty-hello-azure/target/openliberty-hello-azure.jar)[jar]  ...
    [INFO] Successfully deployed the artifact to https://openliberty-hello-azure-1642075767899.azurewebsites.net
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  01:11 min
    [INFO] Finished at: 2022-01-13T21:29:50+09:00
    [INFO] ------------------------------------------------------------------------
    ```

Maven deploys your web app to Azure. If the web app or web app plan doesn't already exist, it's created for you. It might take a few minutes before the web app is visible at the URL shown in the output. Navigate to the URL in a web browser. You should see the following screen:

:::image type="content" source="media/open-liberty/open-liberty-front-page.png" alt-text="Screenshot of web browser showing front page of Open Liberty.":::

After your app is deployed, you can manage it through the [Azure portal]. Your web app is listed in the resource group. You can access your web app by selecting **Browse** on the **Overview** page for your web app. Verify that the deployment was successful and running.

## Confirm the log stream from the running App Service

You can view the entire logs or use `tail` to view the end of the logs from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

```azurecli
az webapp log tail \
    --resource-group openliberty-hello-azure-1642075767899-rg \
    --name openliberty-hello-azure-1642075767899
```

:::image type="content" source="media/open-liberty/azure-cli-app-service-log-stream.png" alt-text="Screenshot of terminal window showing log stream." lightbox="media/open-liberty/azure-cli-app-service-log-stream.png":::

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group by using the following steps:

1. From the Azure portal, select `Resource group` from the menu.
1. Enter **microprofile** in the **Filter by name** field. The resource group created in this tutorial should have this prefix.
1. Select the resource group created in this tutorial.
1. Select **Delete resource group** from the menu.

## Next steps

To learn more about MicroProfile and Azure, continue to the MicroProfile on Azure documentation center.

> [!div class="nextstepaction"]
> [MicroProfile on Azure](./index.yml)

### Additional resources

For more information about the various technologies discussed in this article, see the following articles:

* [Maven Plugin for Azure Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md).
* [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli).
* [Maven Settings Reference](https://maven.apache.org/settings.html).

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure for Java Developers]: ../index.yml
[Azure portal]: https://portal.azure.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/

[Java Development Kit (JDK)]: ../fundamentals/java-support-on-azure.md
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- IMG List -->

[AP01]: media/deploy-spring-boot-java-app-with-maven-plugin/web-app-listed-azure-portal.png
[AP02]: media/deploy-spring-boot-java-app-with-maven-plugin/determine-web-app-url.png

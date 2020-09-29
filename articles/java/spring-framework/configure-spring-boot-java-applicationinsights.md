---
title: Configure Initializer app for Spring Boot Starter - Azure Monitor
description: Configure a Spring Boot application created with Spring Initializr to use Application Insights Spring Boot Starter.
services: Application-Insights
documentationcenter: java
author: dhaval24
ms.author: dhdoshi
ms.date: 11/29/2019
ms.service: azure-monitor
ms.tgt_pltfrm: application-insights
ms.topic: article
ms.custom: devx-track-java
---

# Configure a Spring Boot Initializer app to use Application Insights

This article walks you through creating a Spring Boot application using **[Spring Initializr]**. It uses Azure Application Insights Spring Boot Starter for end-to-end monitoring of Java applications on cloud.

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* Web Flux and Netty APIs are **not currently supported** with the Application Insights Spring Boot starter.

## Create a custom application using Spring Initializr

Create an application with the following procedure.

1. Browse to [https://start.spring.io/](https://start.spring.io/).

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application, and then select web dependency in the dependencies section.

   ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   >
   > Spring Initializr will use the **Group** and **Artifact** names to create the package name; for example: *com.vged.appinsights*.
   >

1. Click the **Generate** button.

1. When prompted, download the project to a path on your local computer.

1. After you have extracted the files on your local system, your custom Spring Boot application will be ready for editing.

## Create an Application Insights Resource on Azure

Create an application insights resource using the following procedure.

1. Browse to Azure at <https://portal.azure.com/> and click **+ Create a new resource**.

1. Click **IT & Management Tools**, and then click **Application Insights**.

1. On the **New Application Insights Resource** page, enter the following information:

* Specify your **Subscription** and **Resource group**.
* Enter the **Name** for your Application Insights resource.
* Select **Region**.

   When you have specified these options, click **Review and create**.

   ![Azure][AZ03]

* Review the specifications, and click **Create**.

After your resource has been created, you will see it listed on your Azure **Dashboard**, as well as under the **All Resources** pages. You can click on your resource on any of those locations to open the overview page of the Application Insights resource.

From the overview page copy the **instrumentation key**.

   ![Azure][AZ04]

## Configure your downloaded Spring Boot Application to use Application Insights

Configure the application using the following procedure.

1. Locate the *POM.xml* file in the root directory of your app, and add the following dependency in its dependencies section.

```XML
 <dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-spring-boot-starter</artifactId>
    <version>1.1.1</version>
</dependency>
```

1. Locate the *application.properties* file in the *resources* directory of your app, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add the following lines to the file, and replace the sample values with the appropriate properties with appropriate credentials:

   ```yaml
   # Specify the instrumentation key of your Application Insights resource.
   azure.application-insights.instrumentation-key=[your ikey from the resource]
   # Specify the name of your springboot application. This can be any logical name you would like to give to your app.
   spring.application.name=[your app name]
   ```

   For more ways to fine-tune Application Insights,  refer to [Application Insights Springboot starter readme](https://github.com/MicrosoftDocs/azure-dev-docs/blob/master/articles/java/spring-framework/spring-boot-starters-for-azure.md).

   > [!NOTE]
   > 
   > Use different Application Insights instrumentation keys (such as different resources) for different profiles like PROD, DEV, etc. 
   > Refer to [Spring Boot Profile Specific Properties] for additional information. 

1. Save and close the *application.properties* file.

1. Create a folder named *controller* under the source folder for your package; for example:

   `D:\Microsoft\demo\src\main\java\com\example\demo\controller`

   -or-

   `/users/example/home/demo/src/main/java/com/example/demo/controller`

1. Create a new file named *TestController.java* in the *controller* folder. Open the file in a text editor and add the following code to it:

   ```java
    package com.example.demo;

    import com.microsoft.applicationinsights.TelemetryClient;
    import java.io.IOException;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import com.microsoft.applicationinsights.telemetry.Duration;

    @RestController
    @RequestMapping("/sample")
    public class TestController {

        @Autowired
        TelemetryClient telemetryClient;

        @GetMapping("/hello")
        public String hello() {

            //track a custom event  
            telemetryClient.trackEvent("Sending a custom event...");

            //trace a custom trace
            telemetryClient.trackTrace("Sending a custom trace....");

            //track a custom metric
            telemetryClient.trackMetric("custom metric", 1.0);

            //track a custom dependency
            telemetryClient.trackDependency("SQL", "Insert", new Duration(0, 0, 1, 1, 1), true);

            return "hello";
        }
    }
   ```

   Replace `com.example.demo` with the package name for your project.

1. Save and close the *TestController.java* file.

1. Build your Spring Boot application with Maven and run it. For example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. Test the web app by browsing to `http://localhost:8080/sample/hello` using a web browser, or use the syntax like the following example if you have **curl** available:

   ```shell
   curl http://localhost:8080/sample/hello
   ```

   You should see the "hello!" message from your sample controller displayed. Application Insights will automatically collect this request and send it as a telemetry item with its associated custom event, custom metric, custom dependency, and custom trace as specified in the controller logic. 

   After a few seconds you should see the data on Azure. 

   ![Azure][AZ05]

Click on the **Application Map** tile to view high-level components and their interaction with each other. This is a recommended place to get a high level overview of entire application. Each Spring Boot Microservice is recognized by the spring application name. Remember to set it.

   ![Azure][AZ08] 

## Configure Springboot Application to send log4j logs to Application Insights

Configure the application to send logs using the following procedure.

1. Modify the POM.xml file of the project and add/modify the dependencies section with following. 

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-logging</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-log4j2</artifactId>
    </dependency>

    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-spring-boot-starter</artifactId>
        <version>1.1.1</version>
    </dependency>

    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-logging-log4j2</artifactId>
        <version>2.1.1</version>
    </dependency>
</dependencies>
```

2. Save and close the *POM.xml* file.

3. In \src\main\resources folder, create a new file *log4j2.xml* and configure it. For example:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration packages="com.microsoft.applicationinsights.log4j.v2">
  <Properties>
    <Property name="LOG_PATTERN">
      %d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${hostName} --- [%15.15t] %-40.40c{1.} : %m%n%ex
    </Property>
  </Properties>
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
    <ApplicationInsightsAppender name="aiAppender">
    </ApplicationInsightsAppender>
  </Appenders>
  <Loggers>
    <Root level="trace">
      <AppenderRef ref="Console"  />
      <AppenderRef ref="aiAppender"  />
    </Root>
  </Loggers>
</Configuration>
```

4. Build and run the Spring Boot application again as shown above.

Within a few seconds, you should see all the spring logs being available on Azure. You can look at the detailed log messages and do analysis on Analytics Portal.

![Azure][AZ07]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-app-from-container-registry-using-maven-plugin.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

Application Insights supports automatic collection of external dependencies and its correlation with incoming requests. Currently we support autocollection of Oracle, MsSQL, MySQL and Redis. For more details on enabling autocollection please follow the article [how to use Application Insights Java agent](/azure/application-insights/app-insights-java-agent).

For more information about Azure Application Insights, and its monitoring capabilities, see the **[Application Insights]** home page.

For more information about additional configuration details of Application Insights Spring Boot Starter, please refer to this [link](https://github.com/MicrosoftDocs/azure-dev-docs/blob/master/articles/java/spring-framework/spring-boot-starters-for-azure.md).

For feature requests and potential bugs, please open issues on our [GitHub](https://github.com/Microsoft/ApplicationInsights-Java/issues) repository.

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more popular projects built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at [https://github.com/spring-guides/](https://github.com/spring-guides/). In addition to choosing from the list of basic Spring Boot projects, **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot Profile Specific Properties]: https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-profile-specific-properties
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[Application Insights]: /azure/application-insights/

<!-- IMG List -->

[AZ01]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/Create_resource.png
[AZ02]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/Create_resource_2.png
[AZ03]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/Create_resource_3.png
[AZ04]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/Get_IKey.png
[AZ05]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/OverviewBladeResults.png
[AZ06]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/Search_and_traces.png
[AZ07]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/traces_details.png
[AZ08]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/AppMap.png

[SI01]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/spring_start.PNG
[SI02]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/After_extract.png

[RE01]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/applicationproperties_loc.png
[RE02]: media/configure-spring-boot-starter-java-app-with-azure-application-insights/applicationinsightsproperties.png

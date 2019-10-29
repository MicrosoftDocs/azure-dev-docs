---
title: Getting started with Logz.io for Java projects running on Azure
description: Integration and configuration of Logz.io for Java projects running on Azure.
author: judubois
manager: bborges
ms.assetid: 
ms.devlang: java
ms.topic: article
ms.service: azure

ms.date: 09/19/2019
ms.author: judubois
ms.custom: 
---

# Getting started with Logz.io for Java projects running on Azure

This tutorial shows you how to configure a classical Java application using either Log4J or Logback to send logs to the [Logz.io](https://logz.io/) service, where they will be ingested and analyzed. Logz.io provides a full monitoring solution based on Elasticsearch, Logstash, Kibana, and Grafana.

This tutorial uses Log4J and Logback, the two most widely used Java logging libraries, so it should work for most Java applications running on Azure. If you are already using the Elastic stack to monitor your Java application, this tutorial shows you how to reconfigure to target the Logz.io endpoint.

## Prerequisites

* [Java Developer Kit](https://aka.ms/azure-jdks), version 8 or greater
* A [Logz.io](https://logz.io/) account

## Get your Logz.io access token

You will need an access token to send logs to your Logz.io instance. To get your token, log in to your Logz.io account, select the cog icon in the right-hand corner, then select **Settings > General**. Copy the access token displayed in your account settings so you can use it when configuring the Logz.io Java library.

## Understand Logz.io's "Type" selection

A "Type" is a logical field in Elasticsearch that is used to separate different documents from one another. It is essential to configure this parameter properly in order to get the most of Logz.io.

A "Type" is your log format (for example: Apache, NGinx, MySQL) and not your source (for example, it's not: server1, server2, server3). As we are configuring Java applications in this quickstart, and we expect those applications will all have the same format, we are calling our type "java-application".

For advanced usage, you could group your Java applications into different types, which all have their own specific log format (log formatting is configurable with Log4J and Logback), so you could have a "spring-boot-monolith" type and "spring-boot-microservice" type, for example.

## Install and configure the Logz.io library for Log4J or Logback

[Logz.io](https://logz.io/) provides their own Java library, which is available on Maven Central. It is therefore straightforward to use it, but check if a newer library version is available when doing this setup.

If you are using Maven, add the following dependency to your `pom.xml` file:

**Log4J:**

```xml
<dependency>
    <groupId>io.logz.log4j2</groupId>
    <artifactId>logzio-log4j2-appender</artifactId>
    <version>1.0.11</version>
</dependency>
```

**Logback:**

```xml
<dependency>
    <groupId>io.logz.logback</groupId>
    <artifactId>logzio-logback-appender</artifactId>
    <version>1.0.22</version>
</dependency>
```

If you are using Gradle, add the following dependency to your build script:

**Log4J:**

```
implementation 'io.logz.log4j:logzio-log4j-appender:1.0.11'
```

**Logback:**

```
implementation 'io.logz.logback:logzio-logback-appender:1.0.22'
```

You must also configure its usage in your Log4J or Logback configuration file:

**Log4J:**

```xml
<Appenders>
    <LogzioAppender name="Logzio">
        <logzioToken>{{your-logz-io-token}}</logzioToken>
        <logzioType>java-application</logzioType>
        <logzioUrl>https://listener-wa.logz.io:8071</logzioUrl>
    </LogzioAppender>
</Appenders>

<Loggers>
    <Root level="info">
        <AppenderRef ref="Logzio"/>
    </Root>
</Loggers>
```

**Logback:**

```xml
<configuration>
    <!-- Use shutdownHook so that we can close gracefully and finish the log drain -->
    <shutdownHook class="ch.qos.logback.core.hook.DelayingShutdownHook"/>
    <appender name="LogzioLogbackAppender" class="io.logz.logback.LogzioLogbackAppender">
        <token>{{your-logz-io-token}}</token>
        <logzioUrl>https://listener-wa.logz.io:8071</logzioUrl>
        <logzioType>java-application</logzioType>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
    </appender>

    <root level="debug">
        <appender-ref ref="LogzioLogbackAppender"/>
    </root>
</configuration>
```

## Configure test and log analysis on Logz.io

After the Logz.io library is configured, your application should now send logs directly to it: in order to test that everything works correctly, go to the Logz.io console and select the "Live tail" tab. Click on the "run" button, and you should have a message telling you the connection is working:

```
Requesting Live Tail access...
Access granted. Opening connection...
Connected. Tailing...
````

Now start your application, or use it in order to produce some logs. They should appear directly on your screen. For example, here are the first startup messages of a Spring Boot application:

```
2019-09-19 12:54:40.685Z Starting JavaApp on javaapp-default-9-5cfcb8797f-dfp46 with PID 1 (/workspace/BOOT-INF/classes started by cnb in /workspace)
2019-09-19 12:54:40.686Z The following profiles are active: prod
2019-09-19 12:54:42.052Z Bootstrapping Spring Data repositories in DEFAULT mode.
2019-09-19 12:54:42.169Z Finished Spring Data repository scanning in 103ms. Found 6 repository interfaces.
2019-09-19 12:54:43.426Z Bean 'spring.task.execution-org.springframework.boot.autoconfigure.task.TaskExecutionProperties' of type [org.springframework.boot.autoconfigure.task.TaskExecutionProperties] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
```

As your logs are now processed by Logz.io, you can benefit from all the platform's services.

## Ship Azure VM log data to Logz.io

Here we will learn how to send logs from your Azure resources to Logz.io.

## Deploy the template

The first step is to deploy the Logz.io - Azure integration template. The integration is based on a ready-made Azure deployment template that sets up all the necessary building blocks of the pipeline — an Event Hub namespace, an Event Hub, 2 storage blobs, and all the correct permissions and connections required. The resources set up by the automated deployment can collect data for a single Azure region and ship that data to Logz.io.

Find the **Deploy to Azure** button displayed in the [first step of the repo’s readme](https://github.com/logzio/logzio-azure-serverless).

Once clicked, the Custom Deployment page in the Azure portal will be displayed with a list of pre-filled fields.

You can leave most of the fields as-is but be sure to enter the following settings:

* **Resource group**: Either select an existing group or create a new one.
* **Logzio Logs Host**: Enter the URL of the Logz.io listener. If you’re not sure what this URL is, check your login URL – if it’s app.logz.io, use listener.logz.io (this is the default setting). If it’s app-eu.logz.io, use listener-eu.logz.io.
* **Logzio Logs Token**: Enter the token of the Logz.io account you want to ship Azure logs to. You can find this token on the account page in the Logz.io UI.

Agree to the terms at the bottom of the page, and click Purchase. Azure will then deploy the template. This may take a minute or two - you will eventually see the Deployment succeeded message at the top of the portal.

You can visit the defined resource group to review the deployed resources.

To learn how to configure logzio-azure-serverless to back up logs to Azure Blob Storage, [click here](https://docs.logz.io/shipping/log-sources/azure-activity-logs.html).

## Stream Azure Log Data to Logz.io

Now that you’ve deployed the integration template, you’ll need to configure Azure to stream diagnostic logs to the Event Hub you just deployed. When data comes into the Event Hub, the function app will forward that data to Logz.io.

In the search bar, type “Diagnostics”, and then click **Diagnostics settings**. This brings you to the _Diagnostics settings_ page.

Choose a VM (or any other resource) from the list of resources, and click **Turn on diagnostics settings** to open the _Diagnostics settings_ panel for that resource.

Give your diagnostic settings a **Name**.

Select **Stream to an Event Hub**, and then click **Configure** to open the _Select Event Hub_ panel.

Choose your Event Hub:

* **Event Hub namespace**: Choose the namespace that starts with **LogzioNS** (LogzioNS6nvkqdcci10p, for example)
* **Event Hub name**: Choose **insights-operational-logs**
* **Event Hub policy name**: Choose **LogzioSharedAccessKey**
* Click **OK** to return to Diagnostics settings.

Click **OK** to return to the _Diagnostics settings_ panel.
In the Log section, select the data you want to stream, and then click **Save**. The selected data will now stream to the Event Hub.
To find additional information on how to stream log or metric data from Event Hub to an external tool, see [Stream Azure monitoring data to an Event Hub for consumption by an external tool](/azure/azure-monitor/platform/stream-monitoring-data-event-hubs).

## Visualize your data

Next, give your data some time to get from your system to Logz.io, and then open Kibana. You should see logs (with the type _eventhub_) filling up your dashboards (for more information on how to create dashboards, [click here!](https://logz.io/blog/perfect-kibana-dashboard/)).

From there, you can query for specific log data in the “Discover” tab, or create Kibana objects to visualize your data in the “Visualize” tab.

## Clean up resources

When you're finished with the Azure resources you created in this tutorial, you can delete them using the following command:

```azurecli-interactive
az group delete --name <resource group>
```

## Next steps

In this tutorial, you learned how to ... Next, learn how to ...:

> [!div class="nextstepaction"]
> [Azure](/azure)


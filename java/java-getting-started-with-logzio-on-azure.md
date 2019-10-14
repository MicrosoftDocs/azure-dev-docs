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

[Logz.io](https://logz.io/) provides a full monitoring solution based on Elasticsearch, Logstash, Kibana, and Grafana.

In this getting started guide, we will learn how to configure a classical Java application using either Log4J or Logback to send logs to the [Logz.io](https://logz.io/) service, where they will be ingested and analyzed. This guide should work for most Java applications running on Azure, as it uses the two most widely used Java logging libraries, Log4J and Logback.

## Supported JDK runtimes

Libraries used here require Java 8 and up.

## Logz.io account creation

Go to [Logz.io](https://logz.io/) to create your account.

Once you are logged in, you will need your Logz.io token in order to be able to send logs to your own instance. Select the cog in the right-hand corner, and go to `Settings > General`. In your account settings, you will have access to your token: copy it to a safe place, so you can use it when configuring the Logz.io Java library.

## Logz.io's "Type" selection

A "Type" is a logical field in Elasticsearch that is used to separate different documents from one another. It is essential to configure this parameter properly in order to get the most of Logz.io.

A "Type" is your log format (for example: Apache, NGinx, MySQL) and not your source (for example, it's not: server1, server2, server3). As we are configuring Java applications in this quickstart, and we expect those applications will all have the same format, we are calling our type "java-application".

For advanced usage, you could group your Java applications into different types, which all have their own specific log format (log formatting is configurable with Log4J and Logback), so you could have a "spring-boot-monolith" type and "spring-boot-microservice" type, for example.

## Library installation and configuration for Log4J

These instructions are for people using Log4J, if you use Logback, go to the next section.

[Logz.io](https://logz.io/) provides their own Java library, which is available on Maven Central. It is therefore straightforward to use it, but check if a newer library version is available when doing this setup.

If you are using Maven, add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>io.logz.log4j2</groupId>
    <artifactId>logzio-log4j2-appender</artifactId>
    <version>1.0.11</version>
</dependency>
```

If you are using Gradle, add the following the dependency to your build script:

```
implementation 'io.logz.log4j:logzio-log4j-appender:1.0.11'
```

Once the library is installed, you must configure its usage in your Log4J configuration file:

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

## Library installation and configuration for Logback

[Logz.io](https://logz.io/) provides their own Java library, which is available on Maven Central. It is therefore straightforward to use it, but check if a newer library version is available when doing this setup.

If you are using Maven, add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>io.logz.logback</groupId>
    <artifactId>logzio-logback-appender</artifactId>
    <version>1.0.22</version>
</dependency>
```

If you are using Gradle, add the following the dependency to your build script:

```
implementation 'io.logz.logback:logzio-logback-appender:1.0.22'
```

Once the library is installed, you must configure its usage in your Logback configuration file:

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

## Configuration test and log analysis on Logz.io

Once the Logz.io library is configured, your application should now send logs directly to it: in order to test that everything works correctly, go to the Logz.io console and select the "Live tail" tab. Click on the "run" button, and you should have a message telling you the connection is working:

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
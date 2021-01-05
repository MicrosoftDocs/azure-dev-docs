---
title: Logging with the log4j logging framework
description: An overview of the Azure SDK for Java integration with log4j
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Logging with the Log4j logging framework

As mentioned in the [logging overview](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), and as such, logging frameworks such as [log4j](https://logging.apache.org/log4j/2.x/) can be used. Choosing which logging framework to use is outside of the scope of this document, but needless to say, often times the best choice is the one you probably already have, whether you know it or not, thanks to third party dependencies sometimes being opinionated in this regard.

This document provides guidance to use the Log4J 2.x releases, but Log4J 1.x is equally supported by the Azure SDK for Java. To enable log4j logging, developers must do two things:

1. Include the log4j library as a dependency,
2. Create a configuration file (either `log4j2.properties` or `log4j2.xml`) under the `/src/main/resources` project directory.

For more information related to configuring log4j, please refer [here](https://logging.apache.org/log4j/2.x/manual/index.html).

## Adding maven dependencies

Adding the Maven dependency is simply a matter of including the following XML in the project Maven pom.xml file. Be sure to check online to see what the latest released version is, which at the time of this document being written was 2.14.0.

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.14.0</version>
</dependency>
```

## Configuring Log4j

### Using a property file

A flat properties file, named `log4j2.properties` can be placed under the `/src/main/resource` directory of the project. This file will take the following form:

```properties
appender.console.type = Console
appender.console.name = STDOUT
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %msg%n

logger.app.name = com.azure.core
logger.app.level = ERROR

rootLogger.level = info
rootLogger.appenderRefs = stdout
rootLogger.appenderRef.stdout.ref = STDOUT
```

### Using an XML file

An XML file, named `log4j2.xml` can be placed under the `/src/main/resource` directory of the project. This file will take the following form:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="%msg%n" />
        </Console>
    </Appenders>
    <Loggers>
        <Logger name="com.azure.core" level="error" additivity="true">
            <appender-ref ref="console" />
        </Logger>
        <Root level="info" additivity="false">
            <appender-ref ref="console" />
        </Root>
     </Loggers>
</Configuration>
```

## Next steps

In this document we have discussed configuring Log4j and how to make the Azure SDK for Java log through this. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html). If you use Log4j, there is a vast amount of [configuration guidance](https://logging.apache.org/log4j/2.x/manual/index.html) on its website also.

Once you have master logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](https://docs.microsoft.com/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](https://docs.microsoft.com/azure/developer/java/eclipse-microprofile/).

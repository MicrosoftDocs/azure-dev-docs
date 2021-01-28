---
title: Logging with the Azure SDK for Java and Log4j
description: An overview of the Azure SDK for Java integration with log4j
author: srnagar
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: srnagar
---

# Logging with the Azure SDK for Java and Log4j

This article provides an overview of how to log in applications that make use of the Azure SDK for Java and that wish to log using Log4j. As mentioned in the [logging overview](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), and as such, logging frameworks such as [log4j](https://logging.apache.org/log4j/2.x/) can be used.

This article provides guidance to use the Log4J 2.x releases, but Log4J 1.x is equally supported by the Azure SDK for Java. To enable log4j logging, developers must do two things:

1. Include the log4j library as a dependency,
2. Create a configuration file (either *log4j2.properties* or *log4j2.xml*) under the */src/main/resources* project directory.

For more information related to configuring log4j, please refer [here](https://logging.apache.org/log4j/2.x/manual/index.html).

## Adding Maven dependencies

Adding the Maven dependency is simply a matter of including the following XML in the project Maven *pom.xml* file. Be sure to check online to see what the latest released version is, which at the time this article was written was 2.14.0.

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.14.0</version>
</dependency>
```

## Configuring Log4j

There are two commonly used ways to configure Log4j: through an external properties file, or through an external XML file. These approaches are outlined below.

### Using a property file

You can place a flat properties file named *log4j2.properties* in the */src/main/resource* directory of the project. This file should take the following form:

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

You can place an XML file named *log4j2.xml* in the */src/main/resource* directory of the project. This file should take the following form:

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

In this article, we've discussed configuring Log4j and how to make the Azure SDK for Java log through this. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html). If you use Log4j, there's a vast amount of [configuration guidance](https://logging.apache.org/log4j/2.x/manual/index.html) on its website also.

Once you have master logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](/azure/developer/java/eclipse-microprofile/).

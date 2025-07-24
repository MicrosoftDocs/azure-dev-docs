---
title: Log with the Azure SDK for Java and Log4j
description: Provides an overview of the Azure SDK for Java integration with log4j.
ms.date: 04/02/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: srnagar
---

# Log with the Azure SDK for Java and Log4j

This article provides an overview of how to add logging using Log4j to applications that use the Azure SDK for Java. As mentioned in [Configure logging in the Azure SDK for Java](logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), so you can use logging frameworks such as [log4j](https://logging.apache.org/log4j/2.x/).

This article provides guidance to use the Log4J 2.x releases, but Log4J 1.x is equally supported by the Azure SDK for Java. To enable log4j logging, you must do two things:

1. Include the log4j library as a dependency,
2. Create a configuration file (either **log4j2.properties** or **log4j2.xml**) under the **/src/main/resources** project directory.

For more information related to configuring log4j, see [Welcome to Log4j 2](https://logging.apache.org/log4j/2.x/manual/index.html).

## Add the Maven dependency

To add the Maven dependency, include the following XML in the project's **pom.xml** file. Replace the `2.16.0` version number with the latest released version number shown on the [Apache Log4j SLF4J Binding page](https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-slf4j-impl).

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.16.0</version>
</dependency>
```

> [!NOTE]
> Due to known vulnerability [CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228), be sure to use Log4j version 2.16 or later

## Configuring Log4j

There are two common ways to configure Log4j: through an external properties file, or through an external XML file. These approaches are outlined below.

### Using a property file

You can place a flat properties file named **log4j2.properties** in the **/src/main/resources** directory of the project. This file should take the following form:

```properties
appender.console.type = Console
appender.console.name = STDOUT
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %d %5p [%t] %c{3} - %m%n

logger.app.name = com.azure.core
logger.app.level = ERROR

rootLogger.level = info
rootLogger.appenderRefs = stdout
rootLogger.appenderRef.stdout.ref = STDOUT
```

### Using an XML file

You can place an XML file named **log4j2.xml** in the **/src/main/resources** directory of the project. This file should take the following form:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d %5p [%t] %c{3} - %m%n" />
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

This article covered the configuration of Log4j and how to make the Azure SDK for Java use it for logging. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing the [SLF4J user manual](http://www.slf4j.org/manual.html) for further details. If you use Log4j, there's also vast amount of configuration guidance on its website. For more information, see [Welcome to Log4j 2!](https://logging.apache.org/log4j/2.x/manual/index.html)

After you've mastered logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](../spring-framework/spring-cloud-azure-overview.md).

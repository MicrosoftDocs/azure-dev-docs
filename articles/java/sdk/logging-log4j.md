---
title: Log With the Azure SDK for Java and Log4j
description: Learn how to configure Log4j with the Azure SDK for Java to capture and manage application logs. Follow the steps to enable logging in your app.
ms.date: 04/02/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: bmitchell287
ms.author: brendm
ms.reviewer: srnagar
---

# Log with the Azure SDK for Java and Log4j

This article shows how to configure Log4j for applications that use the Azure SDK for Java. As mentioned in [Configure logging in the Azure SDK for Java](logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), so you can use frameworks such as [Log4j 2](https://logging.apache.org/log4j/2.x/) to simplify troubleshooting.

This article provides guidance to use the Log4J 2.x releases, but the Azure SDK for Java also supports Log4J 1.x. To enable log4j logging, complete these two steps:

1. Include the log4j library as a dependency.
1. Create a configuration file (**log4j2.properties** or **log4j2.xml**) under the **/src/main/resources** project directory.

For more information about configuring log4j, see [Welcome to Log4j 2](https://logging.apache.org/log4j/2.x/manual/index.html).

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
> Due to known vulnerability [CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228), be sure to use Log4j version 2.16 or later.

## Configure Log4j

You can configure Log4j in two common ways: through an external properties file or through an external XML file. The following sections outline these approaches.

### Use a properties file

Place a flat properties file named **log4j2.properties** in the **/src/main/resources** directory of the project. This file should take the following form:

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

### Use an XML file

Place an XML file named **log4j2.xml** in the **/src/main/resources** directory of the project. The file should follow this structure:

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

This article covered the configuration of Log4j and how to make the Azure SDK for Java use it for logging. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing the [SLF4J user manual](http://www.slf4j.org/manual.html) for further details. If you use Log4j, there's also a vast amount of configuration guidance on its website. For more information, see [Welcome to Log4j 2!](https://logging.apache.org/log4j/2.x/manual/index.html)

After you master logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](../spring-framework/spring-cloud-azure-overview.md).

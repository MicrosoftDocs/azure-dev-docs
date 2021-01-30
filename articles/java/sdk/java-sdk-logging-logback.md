---
title: Log with the Azure SDK for Java and Logback
description: An overview of the Azure SDK for Java integration with logback
author: srnagar
ms.date: 01/29/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: srnagar
---

# Log with the Azure SDK for Java and Logback

This article provides an overview of how to add logging using Logback to applications that make use of the Azure SDK for Java. As mentioned in [Configure logging in the Azure SDK for Java](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), so you can use logging frameworks such as [Logback](http://logback.qos.ch/).

To enable Logback logging, you must do two things:

1. Include the Logback library as a dependency,
2. Create a file called *logback.xml* in the */src/main/resources* project directory.

For more information related to configuring Logback, see [Logback configuration](http://logback.qos.ch/manual/configuration.html) in the Logback documentation.

## Add the Maven dependency

To add the Maven dependency, include the following XML in the project's *pom.xml* file. Replace the *1.2.3* version number with the latest released version number shown on the [Logback Classic Module page](https://mvnrepository.com/artifact/ch.qos.logback/logback-classic).

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

## Add logback.xml to your project

[Logback](https://logback.qos.ch/manual/introduction.html) is one of the popular logging frameworks. To enable Logback logging, create a file called *logback.xml* in the *./src/main/resources* directory of your project. This file will contain the logging configurations to customize your logging needs. For more information on configuring *logback.xml*, see [Logback configuration](https://logback.qos.ch/manual/configuration.html) in the Logback documentation.

### Console logging

You can create a Logback configuration to log to the console as shown in the following example. This example is configured to log all logging events that are INFO level or higher, wherever they come from.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <layout class="ch.qos.logback.classic.PatternLayout">
      <Pattern>
        %black(%d{ISO8601}) %highlight(%-5level) [%blue(%t)] %blue(%logger{100}): %msg%n%throwable
      </Pattern>
    </layout>
  </appender>

  <root level="INFO">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

### Log Azure core errors

The example configuration below is similar to the previous configuration, but it lowers the level at which logging comes from all `com.azure.core` packaged classes (including subpackages). This way, everything INFO-level and higher is logged, except for `com.azure.core`, where only ERROR-level and higher is logged. For example, you can use this approach if you find the code in `com.azure.core` too noisy. This kind of configuration can also go both ways. For example, if you want to get more debug information from classes in `com.azure.core`, you could change this setting to DEBUG.

It's possible to have fine-grained control over the logging of specific classes, or specific packages. As shown below, `com.azure.core` will control the output of all core classes, but you could equally use `com.azure.security.keyvault` or equivalent to control the output as appropriate for the circumstances that are most informative in the context of the running application.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%message%n</pattern>
    </encoder>
  </appender>

  <logger name="com.azure.core" level="ERROR" />

  <root level="INFO">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

### Log to a file with log rotation enabled

The examples above log to the console, which isn't normally the preferred location for logs. Use the following configuration to log to a file instead, with hourly roll-over, and archiving in gzip format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <property name="LOGS" value="./logs" />
  <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOGS}/spring-boot-logger.log</file>
    <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
      <Pattern>%d %p %C{1.} [%t] %m%n</Pattern>
    </encoder>

    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- rollover hourly and gzip logs -->
      <fileNamePattern>${LOGS}/archived/spring-boot-logger-%d{yyyy-MM-dd-HH}.log.gz</fileNamePattern>
    </rollingPolicy>
  </appender>

  <!-- LOG everything at INFO level -->
  <root level="INFO">
    <appender-ref ref="RollingFile" />
  </root>
</configuration>
```

### Spring applications

The Spring framework works by reading the Spring *application.properties* file for various configurations, including the logging configuration. It's possible to configure the Spring application to read Logback configurations from any file, however. To do so, configure the `logging.config` property to point to the *logback.xml* configuration file by adding the following line into your Spring */src/main/resources/application.properties* file:

```properties
logging.config=classpath:logback.xml
```

## Next steps

This article covered the configuration of Logback and how to make the Azure SDK for Java use it for logging. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html). If you use Logback, there's a vast amount of [configuration guidance](http://logback.qos.ch/manual/configuration.html) on its website also.

Once you've master logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](/azure/developer/java/eclipse-microprofile/).

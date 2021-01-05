---
title: Logging with the logback logging framework
description: An overview of the Azure SDK for Java integration with logback
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Logging with the logback logging framework

As mentioned in the [logging overview](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), and as such, logging frameworks such as [logback](http://logback.qos.ch/) can be used. Choosing which logging framework to use is outside of the scope of this document, but needless to say, often the best choice is the one you probably already have, whether you know it or not, thanks to third-party dependencies sometimes being opinionated in this regard.

To enable logback logging, developers must do two things:

1. Include the logback library as a dependency,
2. Create a file called `logback.xml` under the `/src/main/resources` project directory. 

For more information related to configuring logback, please refer [here](http://logback.qos.ch/manual/configuration.html)

## Adding maven dependencies

Adding the Maven dependency is simply a matter of including the following XML in the project Maven pom.xml file. Be sure to check online to see what the latest released version is, which at the time of this document being written was 1.2.3.

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

## Add `logback.xml` to your project

[Logback](https://logback.qos.ch/manual/introduction.html) is one of the popular logging frameworks.
To enable logback logging, create a file called `logback.xml` under `./src/main/resources` directory of your project.
This file will contain the logging configurations to customize your logging needs. More information on configuring `logback.xml` can be found [here](https://logback.qos.ch/manual/configuration.html).

### Console logging

A simple logback configuration to log to console can be configured as shown below. It is configured to log all logging events that are INFO level or higher, regardless of where it comes from.

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

### Logging Azure core errors

The example configuration below is similar to the previous configuration, but it lowers the level at which logging coming from all `com.azure.core` packaged classes (including subpackages), so that everything INFO-level and higher is logged, except for `com.azure.core`, where only ERROR-level and higher will be logged. This can be used by developers who find the code in `com.azure.core` to be too noisy, for example. This kind of configuration can also go both ways - if developers want to get more debug information from classes in `com.azure.core`, they could set this to DEBUG, for example.

Note that it is possible to have fine-grained control over the logging of specific classes, or specific packages. As shown below, `com.azure.core` will control the output of all core classes, but this could have equally been `com.azure.security.keyvault` or equivalent, to control the output as appropriate for the circumstances that are most informative in the context of the running application.

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

In the examples above, logging was to the console, which is not normally the preferred location for logs. To configure logging to a file instead, which will be rolled over after hourly, and archived in gzip format, the following configuration will suffice:

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

The Spring framework works by reading the Spring `application.properties` file for various configurations, including the logging configuration. It is possible to configure the Spring application to read logback configurations from any file, however. To do this, developers configure the `logging.config` property to point to the `logback.xml` configuration file, by adding the following line into their Spring `/src/main/resources/application.properties` file:

```properties
logging.config=classpath:logback.xml
```

## Next steps

In this document we have discussed configuring logback and how to make the Azure SDK for Java log through this. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html). If you use logback, there is a vast amount of [configuration guidance](http://logback.qos.ch/manual/configuration.html) on its website also.

Once you have master logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](https://docs.microsoft.com/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](https://docs.microsoft.com/azure/developer/java/eclipse-microprofile/).

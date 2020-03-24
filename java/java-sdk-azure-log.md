---
title: Logging with the Azure SDK for Java
description: Learn how to configure logging frameworks for the Azure SDK for Java client libraries
keywords: Azure, Java, SDK, logging
author: bmitchell287
ms.author: brendm
ms.date: 03/24/2020
ms.topic: article
ms.service: multiple
---

# Logging with the Azure SDK for Java

This article gives example logging configurations for the [Azure SDK](https://azure.microsoft.com/downloads/) for Java. For more detail on configuration options, such as setting log levels or custom logging by class, refer to the documentation for your chosen logging framework.

The Azure SDK for Java client libraries use the [Simple Logging Facade for Java](https://www.slf4j.org/) (SLF4J). SLF4J allows you to use your preferred logging framework, which is called at the time of application deployment.

> [!NOTE]
> This article applies to the most recent versions of the Azure SDK client libraries. To see if a library is supported, refer to the list of [Azure SDK latest releases](https://azure.github.io/azure-sdk/releases/latest/java.html). If your application is using an older version of the Azure SDK client libraries, refer to specific instructions in the applicable service documentation.

## Declare a logging framework

Before you implement these loggers, you must declare the relevant framework as a dependency in your project. For more information, see the  [SLF4J user manual](http://www.slf4j.org/manual.html#projectDep).

## Configure Log4j or Log4j 2

You can configure Log4j and Log4j 2 logging in a properties file or an XML file. For detailed information on Log4j and Log4j 2 logging, refer to the [Apache Log4j 2 manual](https://logging.apache.org/log4j/2.x/manual/configuration.html).

### Use a properties file

In the *./src/main/resource* directory of your project, create a new file named *log4j.properties* or *log4j2.properties* (the latter for Logj4 2). Use these examples to get started.

Log4j example:

```properties
log4j.rootLogger=INFO, A1
log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%m%n
log4j.logger.com.azure.core=ERROR
```

Log4j2 example:

```properties
appender.console.type = Console
appender.console.name = LogToConsole
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %msg%n
logger.app.name=com.azure.core
logger.app.level=ERROR
```

### Use an XML file

Alternatively, you can use an XML file to configure Log4j and Log4j2. In the *./src/main/resource* directory of your project, create a new file named *log4j.xml* or *log4j2.xml* (the latter for Logj4 2). Use these examples to get started.

Log4j example:

```xml
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration debug="true" xmlns:log4j='http://jakarta.apache.org/log4j/'>

  <appender name="console" class="org.apache.log4j.ConsoleAppender">
    <param name="Target" value="System.out"/>
    <layout class="org.apache.log4j.PatternLayout">
    <param name="ConversionPattern" value="%m%n" />
    </layout>
  </appender>
  <logger name="com.azure.core" additivity="true">
	<level value="ERROR" />
	<appender-ref ref="console" />
  </logger>

  <root>
    <priority value ="info"></priority>
    <appender-ref ref="console"></appender>
  </root>

</log4j:configuration>
```

Log4j2 example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout
                pattern="%msg%n" />
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

## Configure Logback

[Logback](https://logback.qos.ch/manual/introduction.html) is one of the popular logging frameworks, and a native implementation of SLF4J. To configure Logback, create a new XML file named *logback.xml* in the *./src/main/resources* directory of your project. You can find more information on configuration options at the [Logback Project website](https://logback.qos.ch/manual/configuration.html).

Here's an example Logback configuration:

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

Here's a simple Logback configuration for logging to the console:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appender name="Console"
    class="ch.qos.logback.core.ConsoleAppender">
    <layout class="ch.qos.logback.classic.PatternLayout">
      <Pattern>
        %black(%d{ISO8601}) %highlight(%-5level) [%blue(%t)] %blue(%logger{100}): %msg%n%throwable
      </Pattern>
    </layout>
  </appender>

  <root level="INFO">
    <appender-ref ref="Console" />
  </root>
</configuration>
```

Here's a configuration for logging to a file that is rolled over after each hour and archived in GZIP file format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <property name="LOGS" value="./logs" />
  <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOGS}/spring-boot-logger.log</file>
    <encoder
      class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
      <Pattern>%d %p %C{1.} [%t] %m%n</Pattern>
    </encoder>

    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- rollover hourly and gzip logs -->
      <fileNamePattern>${LOGS}/archived/spring-boot-logger-%d{yyyy-MM-dd-HH}.log.gz</fileNamePattern>
    </rollingPolicy>
  </appender>

  <!-- LOG everything at INFO level -->
  <root level="info">
    <appender-ref ref="RollingFile" />
  </root>
</configuration>
```

### Configure Logback for a Spring Boot application

Spring looks for your project configurations, including logging, in the *application.properties* file, which is in the *./src/main/resources* directory. In the *application.properties* file, add the following line to link your *logback.xml* to your Spring Boot application:

```properties
logging.config=classpath:logback.xml
```

## Configure fallback logging for temporary debugging

In scenarios where it’s not possible to redeploy your application with an SLF4J logger, you can use the fallback logger that is built into the Azure client libraries for Java. To enable this logger, you must first confirm there is no SLF4J logger (as this will take precedence), and then set the `AZURE_LOG_LEVEL` environment variable. After you set the environment variable, you’ll need to restart your application to start generating logs.

The following table shows the allowed values this environment variable.

|Log level   |Allowed environment variable values   |
|----------|-----------|
|VERBOSE   |"verbose", "debug"     |
|INFORMATIONAL|"info", "information", "informational"  |
|WARNING     |"warn", "warning"       |
|ERROR    |"err", "error"  |

## Next steps

- [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs) 
- [Review Azure security logging and auditing options](/azure/security/fundamentals/log-audit)
- [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)

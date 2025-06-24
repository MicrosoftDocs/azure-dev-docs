---
title: Log with the Azure SDK for Java and java.util.logging
description: Provides an overview of the Azure SDK for Java integration with java.util.logging.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: srnagar
---

# Log with the Azure SDK for Java and java.util.logging

This article provides an overview of how to add logging using `java.util.logging` to applications that use the Azure SDK for Java. The `java.util.logging` framework is part of the JDK. As mentioned in [Configure logging in the Azure SDK for Java](logging-overview.md), all Azure client libraries log through [Simple Logging Facade for Java (SLF4J)](http://www.slf4j.org/), so you can use logging frameworks such as [`java.util.logging`](https://docs.oracle.com/javase/8/docs/api/java/util/logging/Logger.html).

To enable `java.util.logging`, you must do two things:

1. Include the SLF4J adapter for `java.util.logging` as a dependency,
2. Create a file called **logging.properties** under the **/src/main/resources** project directory.

For more information related to configuring your logger, see [Configuring Logging Output](https://docs.oracle.com/cd/E23549_01/doc.1111/e14568/handler.htm) in the Oracle documentation.

## Add the Maven dependency

To add the Maven dependency, include the following XML in the project's **pom.xml** file. Replace the `1.7.30` version number with the latest released version number shown on the [SLF4J JDK14 Binding page](https://mvnrepository.com/artifact/org.slf4j/slf4j-jdk14).

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.30</version> <!-- replace this version with the latest available version on Maven central -->
</dependency>
```

## Add logging.properties to your project

To log using `java.util.logging`, create a file called **logging.properties** under the **./src/main/resources** directory of your project or anywhere else. This file will contain the logging configurations to customize your logging needs. Provide path to the file by setting the `java.util.logging.config.file` system property. You must set this property before you create the logger instance. For more information, see [Java Logging: Configuration](http://tutorials.jenkov.com/java-logging/configuration.html).

### Console logging

You can create a configuration to log to the console as shown in the following example. This example is configured to log all logging events that are INFO level or higher, wherever they come from.

```properties
handlers = java.util.logging.ConsoleHandler
.level = INFO

java.util.logging.ConsoleHandler.level = INFO
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.SimpleFormatter.format=[%1$tF %1$tH:%1$tM:%1$tS.%1$tL] [%4$s] %3$s %5$s %n
```

### Log to a file

The previous example logs to the console, which isn't normally the preferred location for logs. To configure logging to a file instead, use the following configuration:

```properties
handlers = java.util.logging.FileHandler
.level = INFO

java.util.logging.FileHandler.pattern = %h/myapplication.log
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.level = INFO
```

This code will create a file called **myapplication.log** in your home directory (`%h`). This logger doesn't support automatic file rotation after a certain period. If you require this functionality, you'll need to write a scheduler to manage log file rotation.

## Next steps

This article covered the configuration of `java.util.logging` and how to make the Azure SDK for Java use it for logging. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing the [SLF4J user manual](http://www.slf4j.org/manual.html) for further details.

After you've mastered logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](../spring-framework/spring-cloud-azure-overview.md).

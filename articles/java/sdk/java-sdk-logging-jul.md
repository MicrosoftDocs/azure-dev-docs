---
title: Logging with the Azure SDK for Java and java.util.logging
description: An overview of the Azure SDK for Java integration with java.util.logging
author: srnagar
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: srnagar
---

# Logging with the Azure SDK for Java and java.util.logging

This article provides an overview of how to log in applications that make use of the Azure SDK for Java and that wish to log using the java.util.logging framework that's part of the JDK. As mentioned in the [logging overview](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), and as such, logging frameworks such as [java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/Logger.html) can be used.

To enable java.util.logging, you must do two things:

1. Include the SLF4J adapter for java.util.logging as a dependency,
2. Create a file called *logging.properties* under the */src/main/resources* project directory.

For more information related to configuring your logger, see [Configuring Logging Output](https://docs.oracle.com/cd/E23549_01/doc.1111/e14568/handler.htm) in Oracle documentation.

## Add the Maven dependency

Adding the Maven dependency is simply a matter of including the following XML in the project Maven *pom.xml* file. Be sure to check online to see what the latest released version is, which at the time this article was written was [1.7.30](https://mvnrepository.com/artifact/org.slf4j/slf4j-jdk14).

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.30</version> <!-- replace this version with the latest available version on Maven central -->
</dependency>
```

## Add logging.properties to your project

To log using `java.util.logging`, create a file called *logging.properties* under *./src/main/resources* directory of your project. This file will contain the logging configurations to customize your logging needs. For more information, see [Java Logging: Configuration](http://tutorials.jenkov.com/java-logging/configuration.html).

If you would like to use a different filename other than *logging.properties*, you can do so by setting the `java.util.logging.config.file` system property. This property must be set before the logger instance is created.

### Console logging

You can create a configuration to log to console as shown in the following example. This example is configured to log all logging events that are INFO level or higher, wherever they come from.

```properties
handlers = java.util.logging.ConsoleHandler
.level = INFO

java.util.logging.ConsoleHandler.level = INFO
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.SimpleFormatter.format=[%1$tF %1$tT] [%4$s] %5$s %n
```

### Log to a file

In the examples above, logging was to the console, which isn't normally the preferred location for logs. To configure logging to a file instead, use the following configuration:

```properties
handlers = java.util.logging.FileHandler
.level = INFO

java.util.logging.FileHandler.pattern = %h/myapplication.log
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.level = INFO
```

This will create a file called *myapplication.log* in your home directory (`%h`). This logger doesn't support automatic file rotation after a certain period. If you require this functionality, you'll need to write a scheduler to manage log file rotation.

## Next steps

This article has covered the configuration of `java.util.logging` and how to make the Azure SDK for Java use it for logging. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html).

Once you've mastered logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](/azure/developer/java/eclipse-microprofile/).

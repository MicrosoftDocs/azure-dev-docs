---
title: Logging with the java.util.logging
description: An overview of the Azure SDK for Java integration with java.util.logging
author: srnagar
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: srnagar
---

# Logging with java.util.logging

As mentioned in the [logging overview](java-sdk-logging-overview.md), all Azure client libraries log through [SLF4J](http://www.slf4j.org/), and as such, logging frameworks such as [java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/Logger.html) can be used. Choosing which logging framework to use is outside of the scope of this document, but needless to say, often times the best choice is the one you probably already have, whether you know it or not, thanks to third party dependencies sometimes being opinionated in this regard.

To enable java.util.logging, developers must do two things:

1. Include the SLF4J adapter for java.util.logging as a dependency,
2. Create a file called `logging.properties` under the `/src/main/resources` project directory. 

For more information related to configuring your logger, please refer [here](https://docs.oracle.com/cd/E23549_01/doc.1111/e14568/handler.htm)

## Add Maven dependency

Adding the Maven dependency is simply a matter of including the following XML in the project Maven pom.xml file. Be sure to check online to see what the latest released version is, which at the time of this document being written was [1.7.30](https://mvnrepository.com/artifact/org.slf4j/slf4j-jdk14).

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.30</version> <!-- replace this version with the latest available version on Maven central -->
</dependency>
```

## Add `logging.properties` to your project

To log using `java.util.logging`, create a file called `logging.properties` under `./src/main/resources` directory of your project. This file will contain the logging configurations to customize your logging needs. More information on configuring `logging.properties` can be found [here](http://tutorials.jenkov.com/java-logging/configuration.html).

If you would like to use a different filename other than `logging.properties`, you can do so by setting the `java.util.logging.config.file` system property. Note that this property has to be set before the logger instance is created.

### Console logging

A simple configuration to log to console can be configured as shown below. Note that it is configured to log all logging events that are INFO level or higher, regardless of where it comes from.

```properties
handlers = java.util.logging.ConsoleHandler
.level = INFO

java.util.logging.ConsoleHandler.level = INFO
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.SimpleFormatter.format=[%1$tF %1$tT] [%4$s] %5$s %n
```

### Log to a file

In the examples above, logging was to the console, which is not normally the preferred location for logs. To configure logging to a file instead, use the following configuration:

```properties
handlers = java.util.logging.FileHandler
.level = INFO

java.util.logging.FileHandler.pattern = %h/myapplication.log
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
java.util.logging.FileHandler.level = INFO
```

This will create a file called `myapplication.log` in your home directory (`%h`). Note that this logger does not support automatic file rotation after a certain period. So, if you need this functionality, you will have to write a scheduler to manage log file rotation.

## Next steps

In this document we have discussed configuring `java.util.logging` and how to make the Azure SDK for Java log through this. Because the Azure SDK for Java works with all SLF4J logging frameworks, consider reviewing [the SLF4J documentation for further details](http://www.slf4j.org/manual.html).

Once you have mastered logging, consider looking into the integrations that Azure offers into frameworks such as [Spring](https://docs.microsoft.com/azure/developer/java/spring-framework/spring-boot-starters-for-azure) and [MicroProfile](https://docs.microsoft.com/azure/developer/java/eclipse-microprofile/).

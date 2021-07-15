---
title: Transition from Java 7 to Java 8
titleSuffix: Azure
description: A guide for managing the move from Java 7 to Java 8. 
author: karianna
manager: maverbur
tags: java
ms.service: azure
ms.devlang: java
ms.topic: article
ms.date: 07/14/2021
ms.author: maverbur
ms.custom: devx-track-java
---

# Java 7 will become End Of Life (EOL) on 29 July 2022

Java 7 community support ends on 29 July 2022. Any applications running on Java 7
will continue to run, but Java 7 itself won't receive updates or security patches.

To minimize risk and potential security vulnerabilities, upgrade your applications to
Java 8 or 11 depending on your workload requirements.

## Transition from Java 7 to Java 8

There's no one-size-fits-all solution to transition code from Java 7 to Java 8.
Moving from Java 7 to Java 8 is typically a small amount of work. Potential issues
include a handful of changed APIs, tightening of type inference in javac, changes to class loaders,
and changes to permgen (part of garbage collection).

In general, the approach is to try to run on Java 8 without recompiling first.

If the goal is to get an application up and running as quickly as possible, just
trying to run on Java 8 is often the best approach. For a library, the goal will
be to publish an artifact that is compiled and tested with JDK 8.

The [Oracle JDK Migration Guide](https://www.oracle.com/java/technologies/javase/jdk8-adoption-guide.html) is the canonical
guide to follow. It covers all of the [incompatibilities in the Java specification](https://www.oracle.com/java/technologies/javase/8-compatibility-guide.html#A999198) and
[incompatibilities in the JDK implementation](https://www.oracle.com/java/technologies/javase/8-compatibility-guide.html#A999387). Most of these incompatibilities
are edge cases and you should investigate when you see a warning or experience an error.

Usage of Java 8 features isn't covered in this document.

## Running on Java 8

Most applications should run on Java 8 without modification. The first thing to try
is to run on Java 8 without recompiling the code. The point of just running is to
see what warnings and errors come out of the execution. This approach gets an  
application to run on Java 8 more quickly by focusing on the minimum that needs
to be done.

Most of the problems you may come across can be resolved without having to recompile code.
If an issue has to be fixed in the code, then make the fix but continue to compile
with JDK 7. If possible, work on getting the application to *run* with `java`
version 8 before *compiling* with JDK 8.

## Compiling with Java 8

Compiling with JDK 8 may require updates to build scripts, tools, test frameworks,
and included libraries. Use the `-Xlint:unchecked` option for *javac* to get the
details on use of JDK internal API and other warnings.

## Migration off Java 7 for Azure App Service

To migrate your App Services from Java 7 to Java 8 or 11, sign in to Azure portal, navigate to the web app(s) you want to update,
go to **Configuration** > **Settings** > **Stack Settings**. You will see dropdowns for the Java major and minor
versions, and the Tomcat version (if you're using Tomcat). Select Java 8 or 11. Remember, you can make this configuration change in a [Deployment Slot](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) to safely test the configuration change, then swap the new environment into production. (Java 7 may be hidden to keep customers from taking dependencies on old runtimes.)

![Use the selector to change your Java version](media/app-service-java-version-selector.png)

If you need to specify any new runtime options, you can specify those in the `JAVA_TOOLS` app setting, and they will be applied when your application starts. See [the Java configuration guide](https://docs.microsoft.com/azure/app-service/configure-language-java?pivots=platform-linux) for more information.

## Next steps

Once the application runs on Java 8, we recommend continuing following the Java modernization path to Java 11 using
the following guides.

* [Reasons to move to Java 11](./reasons-to-move-to-java-11.md).
* [Transition from Java 8 to Java 11](./transition-from-java-8-to-java-11.md).

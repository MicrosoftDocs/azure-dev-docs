---
title: Spring Boot Native Applications
description: Shows you how to enable Spring Cloud Azure libraries to work with Spring Boot native image applications.
ms.date: 03/10/2025
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-arm-template
---

# Spring Boot native image applications

This article shows you how to enable Spring Cloud Azure libraries to work with Spring Boot native image applications.

For more information about using Spring Cloud Azure libraries in Spring Boot native image applications, see [Introducing GraalVM Native Images](https://docs.spring.io/spring-boot/reference/packaging/native-image/introducing-graalvm-native-images.html) in the Spring documentation.

Azure SDK JARs are signed. However, Spring Boot doesn't support the JAR signature verification for native images.

To solve this issue, you must disable the JAR signature verification, as described in this article.

## Disable JAR signature verification

Use the following steps to disable signature verification:

1. Create a **custom.security** file in **src/main/resources** with the following contents:

   ```
   jdk.jar.disabledAlgorithms=MD2, MD5, RSA, DSA
   ```

1. If you're using Maven, add the following configuration:

   ```xml
   <plugin>
       <groupId>org.graalvm.buildtools</groupId>
       <artifactId>native-maven-plugin</artifactId>
       <configuration>
           <buildArgs>
               <arg>-Djava.security.properties=src/main/resources/custom.security</arg>
           </buildArgs>
       </configuration>
   </plugin>
   ```

   If you're using Gradle, add the following configuration:

   ```groovy
   graalvmNative {
     binaries {
       main {
         buildArgs('-Djava.security.properties=' + file("$rootDir/custom.security").absolutePath)
       }
     }
   }
   ```

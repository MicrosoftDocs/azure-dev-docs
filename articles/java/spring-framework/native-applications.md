---
title: Spring Boot native applications
description: This article describes the usage of Spring Boot native image applications with Spring Cloud Azure libraries
ms.date: 03/10/2025
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-arm-template, devx-track-extended-java
---

# Spring Boot native image applications

You can use Spring Cloud Azure libraries in [Spring Boot native image applications](https://docs.spring.io/spring-boot/reference/packaging/native-image/introducing-graalvm-native-images.html).

Azure SDK JARs are signed. However, Spring Boot doesn't support the JAR signature verification for native images. 

To solve this issue, disable the JAR signature verification.

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
   
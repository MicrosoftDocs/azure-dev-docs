---
# Mandatory fields.
title: Use Docker images with a JDK for Azure Java development
description: 
author: bmitchell287
manager: douge
ms.author: brendm # Microsoft employees only
ms.date: 4/9/2019
ms.devlang: java
ms.topic: conceptual
---
# Use Docker with a JDK for Azure 

Pre-built Docker images for Java 7, 8, and 11 are available through [Docker Hub](https://hub.docker.com/_/microsoft-java-se).

Certified Docker container images for Zulu JDK, JRE, and JRE-headless on multiple base OS images are available at Docker Hub:

* [JDK](https://hub.docker.com/_/microsoft-java-jdk)
* [JRE](https://hub.docker.com/_/microsoft-java-jre)
* [JRE-headless](https://hub.docker.com/_/microsoft-java-jre-headless)

## Running a Docker image

Docker images can be run using the syntax `$ docker run mcr.microsoft.com/java/jdk:tag java` as shown in the following example.

```cli
docker run mcr.microsoft.com/java/jdk:8u212-zulu-alpine java -version 
```

## Creating a Docker image

You can create an image using Microsoft's official Docker Hub images as shown in the following examples.

### Create a Docker file

```cli
FROM mcr.microsoft.com/java/jdk:8u212-zulu-alpine 
  
RUN echo $' \
  
public class HelloWorld { \
   public static void main(String[] args) { \
      // Prints "Hello, World" in the terminal window. \
      System.out.println("Hello, World - From Microsoft Azure !!!"); \
   } \
}' > HelloWorld.java
  
RUN javac HelloWorld.java
  
CMD ["java", "HelloWorld"]
```

### Build a Docker image

```cli
docker build -t hello-world
```

### Run the new image

```cli
docker run hello-world
```

You will see the following output:

```output
Hello World - From Microsoft Azure !!!
```

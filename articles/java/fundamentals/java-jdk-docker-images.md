---
# Mandatory fields.
title: Use Docker images with a JDK for Azure Java development
description: Learn how to use Docker images with a Java Development Kit (JDK) for Azure using the command line interface. 
ms.date: 04/09/2019
ms.topic: conceptual
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java
---

# Use Docker with a Java Development Kit (JDK) for Azure

This article describes how to use Docker with a Java Development Kit (JDK) for Azure. Pre-built Docker images are available through [Docker Hub](https://hub.docker.com/_/microsoft-java-se).

* [JDK](https://hub.docker.com/_/microsoft-java-jdk)
* [JRE](https://hub.docker.com/_/microsoft-java-jre)
* [JRE-headless](https://hub.docker.com/_/microsoft-java-jre-headless)

## Running a Docker image

Docker images can be run using the syntax `$ docker run mcr.microsoft.com/java/jdk:tag java` as shown in the following example.

```cli
docker run mcr.microsoft.com/java/jdk:11-zulu-ubuntu java -version
```

## Creating a Docker image

You can create an image using Microsoft's official Docker Hub images as shown in the following examples.

### Create a Docker file

```cli
FROM mcr.microsoft.com/java/jdk:11-zulu-ubuntu
  
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

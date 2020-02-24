---
title: Build and push images to Azure Container Registry using Maven and Jib
description: This tutorial shows you how to build a containerized Java app and push it to Azure Container Registry using the Maven Jib plugin.
author: KarlErickson
ms.author: karler
ms.topic: conceptual
ms.date: 02/11/2019
---

# Tutorial: use Maven and Jib to build container images and push to Azure Container Registry

This tutorial shows you how to build a containerized Java app and push it to Azure Container Registry using the Maven Jib plugin.

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* Apache's [Maven] build tool (Version 3 or above).
* A [Git] client.
* A [Docker] client.

## Create the Spring Boot on Docker Getting Started web app

The following steps walk you through building a Spring Boot web application and testing it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:

   ```powershell
   md C:\SpringBoot
   cd C:\SpringBoot
   ```

   ```bash
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory.

   ```bash
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project.

   ```bash
   cd gs-spring-boot-docker/complete
   cd complete
   ```

1. Use Maven to build and run the sample app.

   ```bash
   mvn package spring-boot:run
   ```

1. Test the web app by browsing to `http://localhost:8080`, or with the following `curl` command:

   ```bash
   curl http://localhost:8080
   ```

You should see the following message displayed: **Hello Docker World**

## Create an Azure Container Registry using the Azure CLI

1. Open a command prompt and log in to your Azure account with Azure CLI:

   ```azurecli
   az login
   ```

1. Choose your Azure Subscription:

   ```azurecli
   az account set -s <YourSubscriptionID>
   ```

1. Create a resource group for the Azure resources used in this tutorial.

   ```azurecli
   az group create --name=acr-rg --location=eastus
   ```

1. Create a private Azure container registry in the resource group. The tutorial pushes the sample app as a Docker image to this registry in later steps. Replace `myacr` with a unique name for your registry.

   ```azurecli
   az acr create --resource-group acr-rg --location eastus \
    --name myacr --sku Basic
   ```

## Push your app to the container registry via Jib

1. Install the [ACR Docker credential helper](https://github.com/Azure/acr-docker-credential-helper) with the following script.

   ```powershell
   iex ([System.Text.Encoding]::UTF8.GetString((Invoke-WebRequest -Uri https://aka.ms/acr/installaad/win).Content))
   ```

   ```bash
   curl -L https://aka.ms/acr/installaad/bash | /bin/bash
   ```

1. Log in to your Azure Container Registry from the Azure CLI.

   ```azurecli
   # set the default name for Azure Container Registry, otherwise you will need to specify the name in "az acr login"
   az configure --defaults acr=myacr
   az acr login
   ```

1. Navigate to the completed project directory for your Spring Boot application (for example, "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the registry name for your Azure Container Registry and the latest version of [jib-maven-plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

   ```xml
   <properties>
      <docker.image.prefix>myacr.azurecr.io</docker.image.prefix>
      <jib-maven-plugin.version>1.8.0</jib-maven-plugin.version>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the *pom.xml* file so that the `<plugin>` contains the `jib-maven-plugin`. Note that we are using a [base image from MCR](https://docs.microsoft.com/java/azure/jdk/java-jdk-docker-images): `mcr.microsoft.com/java/jdk:8u212-zulu-alpine`, which contains an officially supported JDK for Azure.

   ```xml
   <plugin>
     <artifactId>jib-maven-plugin</artifactId>
     <groupId>com.google.cloud.tools</groupId>
     <version>${jib-maven-plugin.version}</version>
     <configuration>
        <from>
            <image>mcr.microsoft.com/java/jdk:8u212-zulu-alpine</image>
        </from>
        <to>
            <image>${docker.image.prefix}/${project.artifactId}</image>
        </to>
     </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to build the image and push the image to the registry:

   ```bash
   mvn compile jib:build
   ```

> [!NOTE]
>
> Due to the security concern of Azure Cli and Azure Container Registry, the credential created by `az acr login` is valid for 1 hour, if you meet *401 Unauthorized* error, you can run the `az acr login -n <your registry name>` command again to reauthenticate.

## Verify your container image

Congratulations! Now you have your containerized Java App build on Azure supported JDK pushed to your ACR. You can now test the image by deploying it to Azure App Service, or pulling it to local with command:

```bash
docker pull yuchenacr.azurecr.io/gs-spring-boot-docker:latest
```

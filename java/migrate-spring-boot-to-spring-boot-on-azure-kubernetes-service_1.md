---
title: Migrate Spring Boot Applications to Spring Boot applications on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 4/10/2020
---

# Migrate Spring Boot Applications to Spring Boot applications on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an 
existing Spring Boot application to run on Azure Kubernetes Service (AKS).

## Pre-migration


### In-place testing

Before you create container images, migrate your application to the JDK and Spring Boot version that you intend to use on AKS. Test your application thoroughly to ensure compatibility and performance.

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/migration/provision-azure-container-registry-and-azure-kubernetes-service.md)]

## Create a Docker image for Spring Boot

To create a Dockerfile, you'll need the following prerequisites:

* A supported JDK
* Your JVM runtime options.
* A way to pass in environment variables (if applicable).

You can then perform the steps described in the following sections, where applicable. You can use the [Spring Boot Container Quickstart repo](https://github.com/Azure/spring-boot-container-quickstart) as a starting point for your Dockerfile and your Spring Boot application.

1. [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume)

#### Configure KeyVault FlexVolume

Create an Azure KeyVault and populate all the necessary secrets. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/quick-create-cli). Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will also need to update the startup script used to bootstrap your Spring Boot application. This script must import the certificates into the keystore used by Spring Boot before starting the application.


[!INCLUDE [build-and-push-the-docker-image-to-azure-container-registry](includes/migration/build-and-push-the-docker-image-to-azure-container-registry.md)]

[!INCLUDE [provision-a-public-ip-address](includes/migration/provision-a-public-ip-address.md)]

[!INCLUDE [deploy-to-aks](includes/migration/deploy-to-aks.md)]

### Configure persistent storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

[!INCLUDE [migrate-scheduled-jobs-aks](includes/migration/migrate-scheduled-jobs-aks.md)]

## Post-migration

Now that you have migrated your application to Azure Kubernetes Service, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

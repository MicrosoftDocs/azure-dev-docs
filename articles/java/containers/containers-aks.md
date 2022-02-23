---
title: Containerizing your Java applications for Azure Kubernetes Service
description: This guide describes how to containerize your Java applications on Azure Kubernetes Service
ms.author: manriem
ms.topic: conceptual
ms.date: 02/10/2022
ms.custom: devx-track-java
recommendations: false
---

# Containerizing your Java applications for Azure Kubernetes Service

If you have not gone through [Containerizing your Java application](containers-overview.md) please start there as it will give you guidance for container memmory, JVM heap memory, GC and vCPU cores.

## Determine appropriate VM SKU for AKS node pool

Determine if the AKS node pool(s) that are available for your AKS cluster can fit the container memory and vCPU cores you are intending to use. If the AKS node pool can host the application then continue on. Otherwise provision a node pool that is appropriate for the amount of container memory and vCPU cores you are targeting.

## Set CPU requests and limits

As a rule of thumb for Java application do not specify CPU requests. If you must limit the CPU on the Kubernetes level map the vCPU core number one for one onto the CPU limits numbers. E.g map 2 vCPU cores to 2.0 in the kubernetes deployment file.

## Set memory request and limits

As a rule of thumb for Java applications do not specify memory requests. Set the memory limits to the amount that you previosuly determined. Make sure the memory limits number is the container memory and NOT the JVM heap memory value.

## Set the JVM arguments in the deployment file

Remember to set the JVM heap memory to the amount you have previously determined. Note that we recommend you pass this as an environment variable so you can easily change the value without the need to have to rebuild the container image.

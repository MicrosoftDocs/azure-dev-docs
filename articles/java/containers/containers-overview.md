---
title: Containerizing your Java applications
description: This topic provides an overview of recommended strategies for containerizing your Java applications.
ms.author: manriem
ms.topic: conceptual
ms.date: 02/10/2022
ms.custom: devx-track-java
recommendations: false
---

# Containerizing your Java applications

This topic provides an overview of recommended strategies for containerizing Java applications.

1. [New application](#new-application)
1. [Existing (on premises) application](#existing-on-premises-application)

## New application

### Determine how much memory to start with

TODO

### Determine which GC to use

TODO

### Determine how many CPU cores are needed

TODO

### Picking a starting point

With everything explained before we recommend to start the containerization of your new Java application with 2 vCPu cores, 4 GB with 75% allocated to JVN Heap memory and the Parallel GC. If you think that will not work then the table below gives you combinations of CPU, memory and GC you can alternatively choose as your starting point.

TODO

## Existing (on premises) application 

If you already have your application running on premises or on a VM in the cloud then our recommendation is to start your containerization journey with:

1. the same amount of CPU (cores) the application has currently available
1. the same amount of memory as the application currently has access to.
1. the same JVM parameters as currently in use.

If the vCPU cores and/or memory combination is not available pick the closest one rounding up the vCPU cores and memory.

## Next steps

[Establishing a base line](containers-baseline.md)

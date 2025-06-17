---
title: Containerize your Java Applications
description: This article provides an overview of recommended strategies for containerizing your Java applications.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.topic: article
ms.date: 04/13/2022
ms.custom: devx-track-java, devx-track-extended-java
recommendations: false
---

# Containerize your Java applications

This article provides an overview of recommended strategies and settings for containerizing Java applications. When you're containerizing a Java application, carefully consider how much CPU time the container has available. Then consider how much memory is available both in terms of total amount of memory, and the heap size of the Java Virtual Machine (JVM). In containerized environments, applications might have access to all processors and therefore be able to run multiple threads in parallel. It's common, though, that containers have a CPU quota applied that might throttle access to CPUs.

The JVM has heuristics to determine the number of "available processors" based on CPU quota, which can dramatically influence the performance of Java applications. The memory allocated to the container itself and the size of the heap area for the JVM are as important as the processors. These factors determine the behavior of the garbage collector (GC) and the overall performance of the system.

## Containerize a new application

When you're containerizing a Java workload for a new application, you must take two things into account when thinking about memory:

* The memory allocated to the container itself.
* The amount of memory available to the Java process.

### Understand JVM default ergonomics

Applications need a starting point and settings. The JVM has default ergonomics with predefined values that are based on number of available processors and amount of memory in the system. The default values shown in the following tables are used when the JVM is started without specific startup flags or parameters.

The following table shows the default GC used for the resources available:

| Resources available                                    | Default GC |
|--------------------------------------------------------|------------|
| Any number of processors <br/> Up to 1,791 MB of memory | SerialGC   |
| 2+ processors <br/> 1,792 MB or more of memory          | G1GC       |

The following table shows the default maximum heap size depending on how much memory is available in the environment where the JVM is running:

| Memory available    | Default maximum heap size |
|---------------------|---------------------------|
| Up to 256 MB        | 50% of available memory   |
| 256 MB to 512 MB    | ~127 MB                    |
| More than 512 MB    | 25% of available memory   |

The default initial heap size is 1/64 of available memory. These values are valid for OpenJDK 11 and later—and for most distributions, including Microsoft Build of OpenJDK, Azul Zulu, Eclipse Temurin, Oracle OpenJDK, and others.

### Determine container memory

Pick a container memory amount that serves your work load best, depending on the needs of your application and its distinctive usage patterns. For example, if your application creates large object graphs, then you probably need more memory than you'd need for applications with many small object graphs.

> [!TIP]
> If you don't know how much memory to allocate, a good starting point is 4 GB.

### Determine JVM heap memory

When you allocate JVM heap memory, the JVM needs more memory than what is used for the JVM heap. When you set the maximum JVM heap memory, it should never be equal to the amount of container memory because that causes container Out of Memory (OOM) errors and container crashes.

> [!TIP]
> Allocate 75% of container memory for the JVM heap.

On OpenJDK 11 and later, you can set the JVM heap size in the following ways:

| Description   | Flag                   | Examples                  |
|---------------|------------------------|---------------------------|
| Fixed value   | `-Xmx`                 | `-Xmx4g`                  |
| Dynamic value | `-XX:MaxRAMPercentage` | `-XX:MaxRAMPercentage=75` |

#### Minimum/initial heap size

Where the environment is guaranteed to have a certain amount of memory reserved to a JVM instance, such as in a container, you should set the minimum heap size - or initial heap size - to the same size as the maximum heap size. This setting indicates to the JVM that it shouldn't perform the task of freeing memory to the OS.

To set a minimum heap size, use `-Xms` for absolute amounts or `-XX:InitialRAMPercentage` for percentage amounts.

> [!IMPORTANT]
> The flag `-XX:MinRAMPercentage`, despite what the name suggests, is used for setting the default *maximum* RAM percentage for systems with up to 256 MB of RAM available in the system.

:::image type="content" source="media/default-heap-chart-openjdk17.png" alt-text="Chart showing the default heap size on OpenJDK 17.":::

### Determine which GC to use

Previously, you determined the amount of JVM heap memory to start with. The next step is to choose your GC. The amount of maximum JVM heap memory you have is often a factor in choosing your GC. The following table describes the characteristics of each GC.

| Factors             | SerialGC                | ParallelGC                                                   | G1GC                                                                   | ZGC                                                                    | ShenandoahGC                                                           |
|---------------------|-------------------------|--------------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------------|
| Number of cores     | 1                       | 2                                                            | 2                                                                      | 2                                                                      | 2                                                                      |
| Multi-threaded      | No                      | Yes                                                          | Yes                                                                    | Yes                                                                    | Yes                                                                    |
| Java heap size      | <4 GBytes               | <4 GBytes                                                    | >4 GBytes                                                              | >4 GBytes                                                              | >4 GBytes                                                              |
| Pause               | Yes                     | Yes                                                          | Yes                                                                    | Yes (<1 ms)                                                            | Yes (<10 ms)                                                           |
| Overhead            | Minimal                 | Minimal                                                      | Moderate                                                               | Moderate                                                               | Moderate                                                               |
| Tail-latency Effect | High                    | High                                                         | High                                                                   | Low                                                                    | Moderate                                                               |
| JDK version         | All                     | All                                                          | JDK 8+                                                                 | JDK 17+                                                                | JDK 11+                                                                |
| Best for            | Single core small heaps | Multi-core small heaps or batch workloads with any heap size | Responsive in medium to large heaps (request-response/DB interactions) | Responsive in medium to large heaps (request-response/DB interactions) | Responsive in medium to large heaps (request-response/DB interactions) |

> [!TIP]
> For most general-purpose microservice applications, start with the Parallel GC.

### Determine how many CPU cores are needed

For any GC other than SerialGC, we recommend two or more vCPU cores - or at least `2000m` for `cpu_limit` on Kubernetes. We don't recommend selecting anything less than one vCPU core on containerized environments.

> [!TIP]
> If you don't know how many cores to start with, a good choice is two vCPU cores.

### Pick a starting point

We recommend starting with two replicas or instances in container orchestration environments like Kubernetes, OpenShift, Azure Spring Apps, Azure Container Apps, and Azure App Service. The following table summarizes the recommended starting points for the containerization of your new Java application.

| vCPU cores | Container memory | JVM heap size | GC         | Replicas |
|------------|------------------|---------------|------------|----------|
| 2          | 4 GB             | 75%           | ParallelGC | 2        |

Use the following JVM parameters:

```java
-XX:+UseParallelGC -XX:MaxRAMPercentage=75
```

## Containerize an existing on premises application

If your application is already running on premises or on a VM in the cloud, then we recommend that you start with the following configuration:

* The same amount of memory that the application currently has access to.
* The same number of CPUs or vCPU cores the application currently has available.
* The same JVM parameters that you currently use.

If the vCPU cores or container memory combination isn't available, then pick the closest one, rounding up the vCPU cores and container memory.

## Next steps

Now that you understand the general recommendations for containerizing Java applications, continue on to the following article to establish a containerization baseline:

* [Establish a baseline for containerized Java applications](baseline.md)

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

This topic provides an overview of recommended strategies and settings for containerizing Java applications.

When you are containerizing a Java application, you have to carefully consider how much CPU time the container will have available, and then how much memory will be available both in terms of total amount of memory, and the heap size of the JVM. On most containerized environments, applications may have access to all processors and therefore be able to run multiple threads in parallel. It is common, though, that containers have a CPU quota applied that may throttle access to CPUs. 

The JVM has heuristics to determine the amount of "available processors" based on CPU quota, and this can dramatically influence the performance of Java applications. Just as important as processors, the memory allocated to the container itself and the size of the heap area for the JVM will determine the behavior of the Garbage Collector and the overall performance of the system.

1. [New application](#new-application)
1. [Existing (on premises) application](#existing-on-premises-application)

## New application

When you are containerizing a Java workload you have to take two things into account when thinking about memory. Firstly, is the memory allocated to the container itself and secondly, is the amount of memory available to the Java process.

### JVM default ergonomics

Applications still need a starting point and settings. The JVM has default ergonomics with pre-defined values based on number of available processors and amount of memory in the system, for when the JVM is started without specific startup flags or parameters.

**Default Garbage Collector**

| Resources Available                                | Default                   |
|----------------------------------------------------|---------------------------|
| Any number of processors <br/> Up to 1791MB memory | SerialGC                  |
| 2+ processors <br/> 1792MB or more memory          | G1GC                      |

**Default Initial Heap Size**

| Type of Environment | Default                  |
|---------------------|--------------------------|
| Containers          | 1/4 of available memory  |
| Non-container       | 1/64 of available memory |

The above is valid for OpenJDK 11 until OpenJDK 17 for most distributions, including Microsoft Build of OpenJDK, Azul Zulu, Eclipse Temurin, Oracle OpenJDK, and others.

### Determine container memory

Depending on the needs of your application and its distinctive usage patterns, you will have to pick an amount of container memory that will serve your work load the best. For example, if your application creates large object graphs then you will probably have to allocate more memory than if your application had a large number of small object graphs. If you do not know how much memory to allocate a good starting point would be to begin with 4GB.

Recommendation: Our recommendation is to start with 4GB of container memory.

### Determine JVM heap memory

When allocating JVM heap memory, you need to be aware that the JVM needs more memory than just what is used for the JVM heap. So when setting the maximum JVM heap memory it should NEVER be equal to the amount of container memory as that will cause container Out of Memory (OOM) errors and container crashes.

Recommendation: Our recommendation is to allocate 75% of container memory for the JVM heap.

Developers can set the JVM Heap Size in two ways, on OpenJDK 11 and later:

| Flag                   | Examples                |
|------------------------|-------------------------|
| `-Xmx`                 | -Xmx4g                  |
| `-XX:MaxRAMPercentage` | -XX:MaxRAMPercentage=75 |

### Determine which Garbage Collector to use

Previously you determined an amount of JVM heap memory to start with, the next step is to choose your Garbage Collector (GC). The amount of maximum JVM heap memory you have is often a factor in choosing your GC. The table below describes what characteristics each GC has.

Recommendation: Our recommendation is to start with the Parallel GC.

|                 | Serial | Parallel | G1 | Z | Shenandoah |
| --------------- | ------ | -------- | -- | - | ---------- |
| Number of cores | 1 | 2 | 2 | 2 | 2 |
| Multi-threaded  | No | Yes | Yes | Yes | Yes |
| Java Heap size  | <4GBytes | <4GBytes | >4GBytes | >28GBytes | >4GBytes |
| Pause           | Yes | Yes | Yes | Yes (<1ms) | Yes (<10ms) |
| Overhead        | Minimal | Minimal | Moderate | Moderate+| Moderate++ |
| Tail-latency Effect | High | High | High | Low | Moderate |
| JDK version     | All | All | JDK 8+ | JDK 17+ | JDK 11+ |
| Best for        | Single core small heaps | Batch workloads (with any heap size) or multi-core small heaps | responsive in medium to large heaps (request-response/DB interactions) | responsive in medium to large heaps (request-response/DB interactions) | responsive in medium to large heaps (request-response/DB interactions) |


### Determine how many CPU cores are needed

If you selected the Serial GC, then you will need a minimum of 1 vCPU core. For any other GC, we recommend 2+ vCPU cores. Note that selecting anything less than 1 vCPU core is NOT recommended for any GC choice.

Recommendation: Our recommendation is to start with 2 vCPU cores.

### Picking a starting point

If you have not picked starting points yet, we recommend to start the containerization of your new Java application with the following:

| vCPU cores | Container Memory | JVM Heap Size | Garbage Collector | Replicas |
|------------|------------------|---------------|-------------------|----------|
| 2          | 4 GB             | 75%           | ParallelGC        | 2        |

In container orchestration environments like Kubernetes, OpenShift, Azure Spring Cloud, Azure Container Apps, and Azure App Service, we recommend starting with 2 replicas/instances.

The correct JVM parameters to be used are:

         -XX:+ParallelGC -XX:MaxRAMPercentage=75 

## Existing (on premises) application 

If you already have your application running on premises or on a VM in the cloud then our recommendation is to start your containerization journey with:

1. The same amount of memory as the application currently has access to.
1. The same amount of CPU (vCPU cores) the application has currently available.
1. The same JVM parameters that you currently use.

If the vCPU cores and/or container memory combination is not available then pick the closest one, rounding up the vCPU cores and container memory.

## Next steps

[Establishing a base line](containers-baseline.md)

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

This article provides an overview of recommended strategies and settings for containerizing Java applications.

When you're containerizing a Java application, carefully consider how much CPU time the container will have available. Then consider how much memory will be available both in terms of total amount of memory, and the heap size of the Java Virtual Machine (JVM). In most containerized environments, applications may have access to all processors and therefore be able to run multiple threads in parallel. It's common, though, that containers have a CPU quota applied that may throttle access to CPUs.

The JVM has heuristics to determine the number of "available processors" based on CPU quota, and this can dramatically influence the performance of Java applications. The memory allocated to the container itself and the size of the heap area for the JVM are as important as the processors. These factors will determine the behavior of the Garbage Collector and the overall performance of the system.

## New application

When you're containerizing a Java workload for a new application, you have to take two things into account when thinking about memory:

* The memory allocated to the container itself.
* The amount of memory available to the Java process.

### JVM default ergonomics

Applications need a starting point and settings. The JVM has default ergonomics with pre-defined values based on number of available processors and amount of memory in the system. The default ergonomics are used when the JVM is started without specific startup flags or parameters.

When there are no JVM parameters specified, the default values shown in the following tables are applied.

**Default Garbage Collector**

| Resources available                                    | Default  |
|--------------------------------------------------------|----------|
| Any number of processors <br/> Up to 1791 MB of memory | SerialGC |
| 2+ processors <br/> 1792 MB or more of memory          | G1GC     |

**Default Initial Heap Size**

| Type of environment | Default                  |
|---------------------|--------------------------|
| Containers          | 1/4 of available memory  |
| Non-container       | 1/64 of available memory |

These values are valid for OpenJDK 11 and later, and for most distributions, including Microsoft Build of OpenJDK, Azul Zulu, Eclipse Temurin, Oracle OpenJDK, and others.

### Determine container memory

Depending on the needs of your application and its distinctive usage patterns, you'll have to pick an amount of container memory that will serve your work load the best. For example, if your application creates large object graphs, then you'll probably have to allocate more memory than if your application had a large number of small object graphs.

**Recommendation:** If you don't know how much memory to allocate, a good starting point is 4 GB.

### Determine JVM heap memory

When allocating JVM heap memory, you need to be aware that the JVM needs more memory than just what is used for the JVM heap. When setting the maximum JVM heap memory, it should NEVER be equal to the amount of container memory because that will cause container Out of Memory (OOM) errors and container crashes.

**Recommendation:** Allocate 75% of container memory for the JVM heap.

Developers can set the JVM Heap Size in two ways, on OpenJDK 11 and later:

| Description   | Flag                   | Examples                  |
|---------------|------------------------|---------------------------|
| Fixed value   | `-Xmx`                 | `-Xmx4g`                  |
| Dynamic value | `-XX:MaxRAMPercentage` | `-XX:MaxRAMPercentage=75` |

### Determine which Garbage Collector to use

Previously, you determined the amount of JVM heap memory to start with. The next step is to choose your Garbage Collector (GC). The amount of maximum JVM heap memory you have is often a factor in choosing your GC. The following table describes the characteristics of each GC.

| Factors             | SerialGC  | ParallelGC | G1GC      | ZGC         | ShenandoahGC |
|---------------------|-----------|------------|-----------|-------------|--------------|
| Number of cores     | 1         | 2          | 2         | 2           | 2            |
| Multi-threaded      | No        | Yes        | Yes       | Yes         | Yes          |
| Java Heap size      | <4 GBytes | <4 GBytes  | >4 GBytes | >28 GBytes  | >4 GBytes    |
| Pause               | Yes       | Yes        | Yes       | Yes (<1 ms) | Yes (<10 ms) |
| Overhead            | Minimal   | Minimal    | Moderate  | Moderate    | Moderate     |
| Tail-latency Effect | High      | High       | High      | Low         | Moderate     |
| JDK version         | All       | All        | JDK 8+    | JDK 17+     | JDK 11+      |
| Best for            | Single core small heaps | Multi-core small heaps or batch workloads with any heap size | Responsive in medium to large heaps (request-response/DB interactions) | Responsive in medium to large heaps (request-response/DB interactions) | Responsive in medium to large heaps (request-response/DB interactions) |

**Recommendation:** For most general-purpose microservice applications, start with the Parallel GC.

### Determine how many CPU cores are needed

For any Garbage Collector other than SerialGC, we recommend two or more vCPU cores. We don't recommend selecting anything less than 1 vCPU core on containerized environments.

**Recommendation:** Start with 2 vCPU cores.

### Pick a starting point

In container orchestration environments like Kubernetes, OpenShift, Azure Spring Cloud, Azure Container Apps, and Azure App Service, we recommend starting with two replicas/instances. The following table summarizes the recommended starting points for the containerization of your new Java application.

| vCPU cores | Container Memory | JVM Heap Size | Garbage Collector | Replicas |
|------------|------------------|---------------|-------------------|----------|
| 2          | 4 GB             | 75%           | ParallelGC        | 2        |

The JVM parameters to use are: ```-XX:+ParallelGC -XX:MaxRAMPercentage=75```

## Existing (on premises) application

If you already have your application running on premises or on a VM in the cloud, then our recommendation is to start your containerization journey with the following:

* The same amount of memory that the application currently has access to.
* The same number of CPUs (vCPU cores) the application currently has available.
* The same JVM parameters that you currently use.

If the vCPU cores and/or container memory combination isn't available, then pick the closest one, rounding up the vCPU cores and container memory.

## Next steps

[Establishing a baseline](containers-baseline.md)

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

When you are containerizing a Java workload you have to take two things into account when thinking about memory. Firstly, is the memory allocated to the container itself and secondly, is the amount of memory available to the Java process.

#### Determine container memory

Depending on the needs of your application and its distinctive usage patterns, you will have to pick an amount of container memory that will serve your work load the best. For example, if your application creates large object graphs then you will probably have to allocate more memory than if your application had a large number of small object graphs. If you do not know how much memory to allocate a good starting point would be to begin with 4GB.

Recommendation: Our recommendation is to start with 4GB of container memory.

#### Determine JVM heap memory

When allocating JVM heap memory, you need to be aware that the JVM needs more memory than just what is used for the JVM heap. So when setting the maximum JVM heap memory it should NEVER be equal to the amount of container memory as that will cause container Out of Memory (OOM) errors and container crashes.

Recommendation: Our recommendation is to allocate 75% of container memory for the JVM heap.

### Determine which Garbage Collector to use

Previously you determined an amount of JVM heap memory to start with, the next step is to choose your Garbage Collector (GC). The amount of maximum JVM heap memory you have is often a factor in choosing your GC. The table below describes what characteristics each GC has.

Recommendation: Our recommendation is to start with the Parallel GC.

| Garbage Collector | Key points |
|-------------------|------------|
| Serial GC         | Single CPU containers |
| Parallel GC       | 1. Multiple GC threads |
|                   | Stop-the World during any collection |
|                   | Great for throughput, bad for latency |
|                   | Smaller heaps (up to 4GB) |
|                   | Good for batch jobs |
| G1GC              | Low pause |
|                   | Low latency |
|                   | Larger heaps (more than 4GB) |
|                   | Higher tail latency |
| ZGC               | Real-time sub milliseconds latency |
|                   | Great for super large heaps |
|                   | Low tail latency |
|                   | Oracle-led |
| Shenandoah GC     | Real-time sub milliseconds latency |
|                   | Great for super large heaps |
|                   | Low tail latency |
|                   | Red Hat-led, with AWS contributions |


### Determine how many CPU cores are needed

If you selected the Serial GC, then you will need a minimum of 1 vCPU core. For any other GC, we recommend 2+ vCPU cores. Note that selecting anything less than 1 vCPU core is NOT recommended for any GC choice.

Recommendation: Our recommendation is to start with 2 vCPU cores.

### Picking a starting point

With everything explained before, and if you have not picked starting points yet, we recommend to start the containerization of your new Java application with 2 vCPu cores, 4 GB of container memory with 75% allocated to JVM Heap memory and the Parallel GC. 

## Existing (on premises) application 

If you already have your application running on premises or on a VM in the cloud then our recommendation is to start your containerization journey with:

1. The same amount of memory as the application currently has access to.
1. The same amount of CPU (vCPU cores) the application has currently available.
1. The same JVM parameters that you currently use.

If the vCPU cores and/or container memory combination is not available pick the closest one rounding up the vCPU cores and container memory.

## Next steps

[Establishing a base line](containers-baseline.md)

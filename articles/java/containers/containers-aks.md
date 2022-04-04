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

If you have not gone through [Containerizing your Java application](containers-overview.md) please start there as it will give you guidance for container memory, JVM heap memory, Garbage Collectors (GCs) and vCPU cores.

## Determine appropriate VM SKU for AKS node pool

Determine if the Azure Kubernetes Service node pool(s) that are available for your cluster can fit the container memory and vCPU cores you are intending to use. If the AKS node pool can host the application then continue on. Otherwise provision a node pool that is appropriate for the amount of container memory and vCPU cores you are targeting.

What is important to keep in mind is that the cost of a VM SKU is proportionally equivalent to the amount of cores and memory. After determining your starting point in terms of vCPUs and memory for one container instance, evaluate if your application's needs can only be met by horizontal scalling. For reliable, always-on systems, a minimum of two replicas must be available. Scale up and out as needed.

## Set CPU requests and limits

If you must limit the CPU, ensure you apply the same value for both `limits` and `requests` in the deployment file. Be aware that the JVM does not dynamically adjusts its runtime, such as the garbage collector and other thread pools. The JVM reads the number of processors available only during startup time.

**Recommendation:** set same value for CPU requests and CPU limits.

```yaml
containers:
- image: myimage
  name: myapp
  resources:
    limits:
      cpu: "2"
    requests:
      cpu: "2"
```

### JVM Available Processors

When the HotSpot JVM in OpenJDK identifies it is running inside a container, it looks into values such as `cpu_quota` and `cpu_period` to evaluate how many processors it considers are available to itself. In general, any value up to `1000m` milicores are identified as a single processor machine. Any value between `1001m` and `2000m` is identified as dual processor machine, and so forth. This information is available through the API  `Runtime.getRuntime().availableProcessors()` ([see documentation][javadoc]). This value may also be used by some of the concurrent Garbage Collectors to configure their threas. Other APIs, libraries and frameworks may also use this information to configure thread pools.

[javadoc]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Runtime.html#availableProcessors()

Kubernetes CPU quotas are related to the amount of time a process spends in the CPU, and not the amount of CPUs available to the process. Multi-threaded runtimes such as the JVM may still utilize multiple processors concurrently, with multiple threads. Even if a container has a limit of 1 vCPU, the JVM may be instructed to see 2 or more available processors.

To inform the JVM of the exact number of processors it should be seeing in a Kubernetes environment, use the following JVM flag:

```
-XX:ActiveProcessorCount=N
```

## Set memory request and limits

Set the memory limits to the amount that you previosuly determined. Make sure the memory limits number is the container memory and NOT the JVM heap memory value.

Recommendation: Our recommendation is to set the memory requests equal to the memory limits.

```yaml
containers:
  - name: myimage
    image: myapp
    resources:
      limits:
        memory: "4Gi"
      requests:
        memory: "4Gi"
```

## Set the JVM arguments in the deployment file

Remember to set the JVM heap memory to the amount you have previously determined. Note that we recommend you pass this as an environment variable so you can easily change the value without the need to have to rebuild the container image.

```yaml
containers:
  - name: myimage
    image: myapp
    env:
    - name: JAVA_OPTS
      value: "-XX:+UseParallelGC -XX:MaxRAMPercentage=75"
```

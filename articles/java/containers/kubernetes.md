---
title: Containerize your Java Applications for Kubernetes
description: This article describes how to containerize your Java applications for Kubernetes deployment
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.topic: how-to
ms.date: 04/13/2022
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-liberty-aro, devx-track-javaee-wls, devx-track-javaee-wls-aks
recommendations: false
---

# Containerize your Java applications for Kubernetes

This article describes how to containerize your Java applications for deployment on Kubernetes. For guidance on container memory, JVM heap memory, garbage collectors (GCs), and vCPU cores, see [Containerize your Java applications](overview.md).

## Determine the appropriate VM SKU for the Kubernetes node pool

Determine whether the Kubernetes node pool or pools that are available for your cluster can fit the container memory and vCPU cores that you intend to use. If the node pool can host the application, then continue on. Otherwise, provision a node pool that's appropriate for the amount of container memory and number of vCPU cores you're targeting.

Keep in mind that the cost of a VM SKU is proportional to the number of cores and amount of memory. After you determine your starting point in terms of vCPUs and memory for one container instance, determine whether you can meet your application's needs by horizontal scaling only. For reliable, always-on systems, a minimum of two replicas must be available. Scale up and out as needed.

## Set CPU requests and limits

If you must limit the CPU, ensure that you apply the same value for both `limits` and `requests` in the deployment file. The JVM doesn't dynamically adjust its runtime, such as the GC and other thread pools. The JVM reads the number of processors available only during startup time.

> [!TIP]
> Set same value for CPU requests and CPU limits.

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

### Understand JVM available processors

When the HotSpot JVM in OpenJDK identifies that it's running inside a container, it uses values such as `cpu_quota` and `cpu_period` to determine how many processors are available to it. In general, any value up to `1000m` millicores are identified as a single processor machine. Any value between `1001m` and `2000m` is identified as a dual processor machine, and so forth. This information is available through the API [Runtime.getRuntime().availableProcessors()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Runtime.html#availableProcessors()). Some of the concurrent GCs might also use this value to configure their threads. Other APIs, libraries, and frameworks might also use this information to configure thread pools.

Kubernetes CPU quotas are related to the amount of time a process spends in the CPU, and not the number of CPUs available to the process. Multi-threaded runtimes such as the JVM might still use multiple processors concurrently, with multiple threads. Even if a container has a limit of one vCPU, the JVM might be instructed to see two or more available processors.

To inform the JVM of the exact number of processors it should be seeing in a Kubernetes environment, use the following JVM flag:

```java
-XX:ActiveProcessorCount=N
```

## Set memory request and limits

Set the memory limits to the amount that you previously determined. Be sure the memory limits number is the container memory and NOT the JVM heap memory value.

> [!TIP]
> Set the memory requests equal to the memory limits.

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

Remember to set the JVM heap memory to the amount you previously determined. We recommend that you pass this value as an environment variable so you can easily change it without needing to rebuild the container image.

```yaml
containers:
  - name: myimage
    image: myapp
    env:
    - name: JAVA_OPTS
      value: "-XX:+UseParallelGC -XX:MaxRAMPercentage=75"
```

## Next steps

- [Java containerization strategies](index.yml)
- Jakarta EE on Azure container runtimes
  - Oracle WebLogic Server
    - [Azure Kubernetes Service](/azure/virtual-machines/workloads/oracle/weblogic-aks?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/ee/breadcrumb/toc.json)
  - IBM WebSphere Liberty, Open Liberty, and traditional WebSphere
    - [Azure Kubernetes Service, Azure Red Hat OpenShift](../ee/websphere-family.md)

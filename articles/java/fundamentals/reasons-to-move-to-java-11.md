---
title: Reasons to move to Java 11
titleSuffix: Azure
description: A summary-level document intended for decision makers who are weighing the benefits of moving from Java 8 to Java 11. 
author: dsgrieve
manager: maverbur
tags: java
ms.topic: article
ms.date: 11/19/2019
ms.author: dagrieve
ms.custom: devx-track-java
---

# Reasons to move to Java 11

The question is not *if* you should move to Java 11, but *when*. Within
the next few years, Java 8 will no longer be supported, and users will
have to move to Java 11. We argue that there are benefits to moving to
Java 11 and encourage teams to do so as soon as possible.

Since Java 8, new features have been added and enhancements have been
made. There are noticeable additions and modifications to API, and there
are enhancements that improve startup, performance, and memory usage.

## Transitioning to Java 11

Transitioning to Java 11 can be done in a stepwise fashion. It is *not*
required for code to use Java modules to run on Java 11. Java 11 can be
used to run code developed and built with JDK 8.
But there are some potential issues, primarily concerning deprecated
API, class loaders, and reflection.

The Microsoft Java Engineering Group has a guide to
[transition from Java 8 to Java 11](./transition-from-java-8-to-java-11.md). 
The [Java Platform, Standard Edition Oracle JDK 9
Migration Guide](https://docs.oracle.com/javase/9/migrate/toc.htm) and
[The State of the Module System: Compatibility and
Migration](http://openjdk.java.net/projects/jigsaw/spec/sotms/#compatibility--migration)
are other useful guides. 

## High-level changes between Java 8 and 11

This section does not enumerate all the changes made in Java versions 9 \[[1](#ref1)\], 
10 \[[2](#ref2)\], and 11 \[[3](#ref3)\]. Changes that have an impact on
performance, diagnostics, and productivity are highlighted.

### Modules \[[4](#ref4)\]

Modules address issues of configuration and encapsulation that are
difficult to manage in large-scale applications running on the
*classpath*. A *module* is a self-describing collection of Java
classes and interfaces, and related resources.

Modules make it possible to customize runtime configurations that
contain only the components required by an application. This customization creates a
smaller footprint and allows an application to be statically linked, using
[jlink](https://docs.oracle.com/en/java/javase/11/tools/jlink.html),
into a custom runtime for deployment. This smaller footprint can be particularly useful
in a microservices architecture.

Internally, the JVM is able to take advantage of modules in a way that
makes class-loading more efficient. The result is a runtime that is
smaller, lighter, and faster to start. Optimization techniques used by
the JVM to improve application performance can be more effective
because modules encode which components a class requires.

For programmers, modules help enforce strong encapsulation by
requiring explicit declaration of which packages a module exports and
which components it requires, and by restricting reflective access.
This level of encapsulation makes an application more secure and
easier to maintain.

An application can continue to use the *classpath* and does not have
to transition to modules as a requisite for running on Java 11.

### Profiling and diagnostics

#### Java Flight Recorder \[[5](#ref5)\]

Java Flight Recorder (JFR) gathers diagnostic and profiling data from
a running Java application. JFR has little impact on a running Java
application. The collected data can then be analyzed with Java
Mission Control (JMC) and other tools. Whereas JFR and JMC were
commercial features in Java 8, both are open source in Java 11.

#### Java Mission Control \[[6](#ref6)\]

Java Mission Control (JMC) provides a graphical display of data
collected by the Java Flight Recorder (JFR) and is open source in Java
11. In addition to general information about the running application,
JMC allows the user to drill down into the data. JFR and JMC can
be used to diagnose runtime issues such as memory leaks, GC overhead, 
hot methods, thread bottlenecks, and blocking I/O.

#### Unified logging \[[7](#ref7)\]

Java 11 has a common logging system for all components of the JVM.
This unified logging system allows the user to define what components
to log, and to what level. This fine-grained logging is useful for
performing root-cause analysis on JVM crashes and for diagnosing
performance issues in a production environment.

#### Low-overhead heap profiling \[[8](#ref8)\]

New API has been added to the Java Virtual Machine Tool Interface
(JVMTI) for sampling Java heap allocations. The sampling has
low-overhead and can be enabled continuously. While heap allocation
can be monitored with Java Flight Recorder (JFR), the sampling method
in JFR only works on allocations. The JFR implementation may also miss
allocations. In contrast, heap sampling in Java 11 can provide
information about both live and dead objects.

Application Performance Monitoring (APM) vendors are starting to
utilize this new feature and the Java Engineering Group is investigating
its potential use with Azure performance monitoring tools.

#### StackWalker \[[9](#ref9)\]

Getting a snapshot of the stack for the current thread is often used
when logging. The problem is how much of the stack trace to log, and
whether to log the stack trace at all. For example, one may want to see
the stack trace only for a certain exception from a method. The
StackWalker class (added in Java 9) gives a snapshot of the stack and
provides methods that give the programmer fine-grained control over
how to consume the stack trace.

### Garbage collection \[[10](#ref10)\]

The following garbage collectors are available in Java 11: Serial,
Parallel, Garbage-First, and Epsilon. The default garbage collector in
Java 11 is the Garbage First Garbage Collector (G1GC).

Three other collectors are mentioned here for completeness. The Z
Garbage Collector (ZGC) is a concurrent, low-latency collector that
attempts to keep pause times under 10ms. ZGC is available as an
experimental feature in Java 11. The Shenandoah collector is a
low-pause collector that reduces GC pause times by performing more
garbage collection concurrently with the running Java program.
Shenandoah is an experimental feature in Java 12, but there are
backports to Java 11. The Concurrent Mark and Sweep collector (CMS) is
available but has been deprecated since Java 9.

The JVM sets GC defaults for the average use-case. Often,
these defaults, and other GC settings, need to be tuned for optimum
throughput or latency, according to the application's requirements.
Properly tuning the GC requires deep knowledge of the GC, expertise
that the [Microsoft Java Engineering Group](mailto:javaplatformgroup@microsoft.com)
provides.

#### G1GC

The default garbage collector in Java 11 is the G1 garbage collector
(G1GC). The aim of G1GC is to strike a balance between latency and
throughput. The G1 garbage collector attempts to achieve high
throughput by meeting pause time goals with high probability. G1GC is
designed to avoid full collections, but when the concurrent
collections can\'t reclaim memory fast enough a fallback full GC will
occur. The full GC uses the same number of parallel worker threads as
the young and mixed collections.

#### Parallel GC

The parallel collector is the default collector in Java 8. Parallel GC is a
throughput collector that uses multiple threads to speed up garbage
collection.

#### Epsilon \[[11](#ref11)\]

The Epsilon garbage collector handles allocations but does not reclaim
any memory. When the heap is exhausted, the JVM will shut down.
Epsilon is useful for short-lived services and for applications that
are known to be garbage-free.

#### Improvements for docker containers \[[12](#ref12)\]

Prior to Java 10, memory and CPU constraints set on a container were
not recognized by the JVM. In Java 8, for example, the JVM will default the maximum
heap size to ¼ of the physical memory of the underlying host. Starting with
Java 10, the JVM uses constraints set by container control groups
(cgroups) to set memory and CPU limits (see note below).
For example, the default maximum heap size is ¼ of the container's memory limit 
(e.g., 500MB for -m2G).

JVM Options were also added to give Docker container users
fine-grained control over the amount of system memory that will be
used for the Java heap.

This support is enabled by default and is only available on
Linux-based platforms.

> [!NOTE]
> Most of the cgroup enablement work was backported to Java 8 as of
> jdk8u191. Further improvements may not necessarily be backported to 8.

#### Multi-release jar files \[[13](#ref13)\]

It is possible in Java 11 to create a jar file that contains multiple,
Java-release-specific versions of class files. Multi-release jar files make it possible
for library developers to support multiple versions of Java without
having to ship multiple versions of jar files. For the consumer of
these libraries, multi-release jar files solves the issue of having to
match specific jar files to specific runtime targets.

## Miscellaneous performance improvements

The following changes to the JVM have a direct impact on performance.

-   **JEP 197: Segmented Code Cache** \[[14](#ref14)\] - Divides the code cache
    into distinct segments. This segmentation provides better control of
    the JVM memory footprint, shortens scanning time of compiled
    methods, significantly decreases the fragmentation of code cache,
    and improves performance.

-   **JEP 254: Compact Strings** \[[15](#ref15)\] - Changes the internal
    representation of a String from a two bytes per char to one or two
    bytes per char, depending on the char encoding. Since most Strings
    contain ISO-8859-1/Latin-1 characters, this change effectively
    halves the amount of space required to store a String.

-   **JEP 310: Application Class-Data Sharing** \[[16](#ref16)\] - Class-Data
    Sharing decreases startup time by allowing archived classes to be
    memory-mapped at runtime. Application Class-Data Sharing extends
    class-data sharing by allowing application classes to be placed in the CDS
    archive. When multiple JVMs share the same archive file, memory is
    saved, and the overall system response time improves.

-   **JEP 312: Thread-Local Handshakes** \[[17](#ref17)\] - Makes it possible to
    execute a callback on threads without performing a global VM
    safepoint, which helps the VM achieve lower latency by reducing the
    number of global safepoints.

-   **Lazy Allocation of Compiler Threads** \[[18](#ref18)\] - In tiered
    compilation mode, the VM starts a large number of compiler threads.
    This mode is the default on systems with many CPUs. These threads
    are created regardless of the available memory or the number of 
    compilation requests. Threads
    consume memory even when they are idle (which is almost
    all the time), which leads to an inefficient use of resources. To
    address this issue, the implementation has been changed to start
    only one compiler thread of each type during startup. Starting
    additional threads, and shutting down unused threads, is handled
    dynamically. 

The following changes to the core libraries have an impact on
performance of new or modified code.

-   **JEP 193: Variable Handles** \[[19](#ref19)\] - Defines a standard means to
    invoke the equivalents of various java.util.concurrent.atomic and
    sun.misc.Unsafe operations upon object fields and array elements, a
    standard set of fence operations for fine-grained control of memory
    ordering, and a standard reachability-fence operation to ensure that
    a referenced object remains strongly reachable.

-   **JEP 269: Convenience Factory Methods for Collections** \[[20](#ref20)\] -
    Defines library APIs to make it convenient to create instances of
    collections and maps with small numbers of elements. The static
    factory methods on the collection interfaces that create compact,
    unmodifiable collection instances. These instances are inherently
    more efficient. The APIs create collections that are
    compactly represented and do not have a wrapper class.

-   **JEP 285: Spin-Wait Hints** \[[21](#ref21)\] - Provides API that allows Java
    to hint to the run-time system that it is in a spin loop. Certain
    hardware platforms benefit from software indication that a thread is
    in a busy-wait state.

-   **JEP 321: HTTP Client (Standard)** \[[22](#ref22)\]- Provides a new HTTP
    client API that implements HTTP/2 and WebSocket and can replace the
    legacy HttpURLConnection API.

## References

<a id="ref1">\[1\]</a> Oracle Corporation, \"Java Development Kit 9 Release Notes,\"
(Online). Available: https://www.oracle.com/technetwork/java/javase/9u-relnotes-3704429.html.
(Accessed November 13, 2019).

<a id="ref2">\[2\]</a> Oracle Corporation, \"Java Development Kit
10 Release Notes,\" (Online). Available:
https://www.oracle.com/technetwork/java/javase/10u-relnotes-4108739.html.
(Accessed November 13, 2019).

<a id="ref3">\[3\]</a> Oracle Corporation, \"Java Development Kit
11 Release Notes,\" (Online). Available:
https://www.oracle.com/technetwork/java/javase/11u-relnotes-5093844.html.
(Accessed November 13, 2019).

<a id="ref4">\[4\]</a> Oracle Corporation, \"Project Jigsaw,\" September 22, 
2017. (Online). Available: http://openjdk.java.net/projects/jigsaw/.
(Accessed November 13, 2019).

<a id="ref5">\[5\]</a> Oracle Corporation, \"JEP 328: Flight
Recorder,\" September 9, 2018. (Online). Available:
http://openjdk.java.net/jeps/328. (Accessed November 13, 2019).

<a id="ref6">\[6\]</a> Oracle
Corporation, \"Mission Control,\" April 25, 2019. (Online). Available:
https://wiki.openjdk.java.net/display/jmc/Main. (Accessed November 13, 2019).

<a id="ref7">\[7\]</a> Oracle Corporation, \"JEP 158: Unified JVM Logging,\" 
February 14, 2019. (Online). Available: http://openjdk.java.net/jeps/158.
(Accessed November 13, 2019).

<a id="ref8">\[8\]</a> Oracle Corporation, \"JEP 331:
Low-Overhead Heap Profiling,\" September 5, 2018. (Online). Available:
http://openjdk.java.net/jeps/331. (Accessed November 13, 2019).

<a id="ref9">\[9\]</a> Oracle
Corporation, \"JEP 259: Stack-Walking API,\" July 18, 2017. (Online).
Available: http://openjdk.java.net/jeps/259. (Accessed November 13, 2019).

<a id="ref10">\[10\]</a> Oracle Corporation, \"JEP 248: Make G1 the Default Garbage
Collector,\" September 12, 2017. (Online). Available:
http://openjdk.java.net/jeps/248. (Accessed November 13, 2019).

<a id="ref11">\[11\]</a> Oracle
Corporation, \"JEP 318: Epsilon: A No-Op Garbage Collector,\" September 24, 2018.
(Online). Available: http://openjdk.java.net/jeps/318. (Accessed November 13, 2019).

<a id="ref12">\[12\]</a> Oracle Corporation, \"JDK-8146115: Improve docker
container detection and resource configuration usage,\" September 16, 2019.
(Online). Available:
https://bugs.java.com/bugdatabase/view_bug.do?bug_id=JDK-8146115.
(Accessed November 13, 2019).

<a id="ref13">\[13\]</a> Oracle Corporation, \"JEP 238:
Multi-Release JAR Files,\" June 22, 2017. (Online). Available:
http://openjdk.java.net/jeps/238. (Accessed November 13, 2019).

<a id="ref14">\[14\]</a> Oracle
Corporation, \"JEP 197: Segmented Code Cache,\" April 28, 2017. (Online).
Available: http://openjdk.java.net/jeps/197. (Accessed November 13, 2019).

<a id="ref15">\[15\]</a> Oracle Corporation, \"JEP 254: Compact Strings,\" 
May 18, 2019. (Online). Available: http://openjdk.java.net/jeps/254.
(Accessed November 13, 2019).

<a id="ref16">\[16\]</a> Oracle Corporation, \"JEP 310:
Application Class-Data Sharing,\" August 17, 2018. (Online). Available:
https://openjdk.java.net/jeps/310. (Accessed November 13, 2019).

<a id="ref17">\[17\]</a> Oracle
Corporation, \"JEP 312: Thread-Local Handshakes,\" August 21, 2019.
(Online). Available: https://openjdk.java.net/jeps/312. (Accessed November 13, 2019).

<a id="ref18">\[18\]</a> Oracle Corporation, \"JDK-8198756: Lazy allocation of
compiler threads,\" Oct 29, 2018. (Online). Available:
https://bugs.java.com/bugdatabase/view_bug.do?bug_id=8198756.
(Accessed November 13, 2019).

<a id="ref19">\[19\]</a> Oracle Corporation, \"JEP 193: Variable
Handles,\" August 17, 2017. (Online). Available:
https://openjdk.java.net/jeps/193. (Accessed November 13, 2019).

<a id="ref20">\[20\]</a> Oracle
Corporation, \"JEP 269: Convenience Factory Methods for Collections,\"
June 26, 2017. (Online). Available: https://openjdk.java.net/jeps/269.
(Accessed November 13, 2019).

<a id="ref21">\[21\]</a> Oracle Corporation, \"JEP 285: Spin-Wait
Hints,\" August 20, 2017. (Online). Available:
https://openjdk.java.net/jeps/285. (Accessed November 13, 2019).

<a id="ref22">\[22\]</a> Oracle
Corporation, \"JEP 321: HTTP Client (Standard),\" September 27, 2018. (Online).
Available: https://openjdk.java.net/jeps/321. (Accessed November 13, 2019).

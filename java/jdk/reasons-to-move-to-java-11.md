---
title: Reasons to move to Java 11
description: A summary-level document intended for decision makers who are weighing the benefits of moving from Java 8 to Java 11. 
author: dsgrieve
manager: maverberg
editor: ''
tags: java

ms.topic: article
ms.date: mm/dd/yyyy
ms.author: David.Grieve@Microsoft.com

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
required for code to use Java modules to run on Java 11. Code can
continue to be developed and built with JDK 8 while being run on Java 11
but there are some potential issues, primarily concerning deprecated
API, class loaders, and reflection.

A comprehensive guide to transitioning from Java 8 to Java 11 will be
forthcoming from the Microsoft Java Platform Group. Meanwhile, there are
many guides for transitioning from Java 8 to Java 9 that can get you
started. For example, [Java Platform, Standard Edition Oracle JDK 9
Migration Guide](https://docs.oracle.com/javase/9/migrate/toc.htm) and
[The State of the Module System: Compatibility and
Migration](http://openjdk.java.net/projects/jigsaw/spec/sotms/#compatibility--migration).

## High-Level Changes between Java 8 and 11

This section does not enumerate all the changes made in Java versions 9 \[[1](#ref1)\], 
10 \[[2](#ref2)\], and 11 \[[3](#ref3)\], but seeks to highlight those that have an impact on
performance, diagnostics, and productivity.

### Modules \[[4](#ref4)\]

Modules address issues of configuration and encapsulation that are
difficult to manage in large scale applications running on the
*classpath*. A *module* is a self-describing collection of Java
classes and interfaces, and related resources.

Modules make it possible to customize runtime configurations that
contain only the components required by an application. This creates a
smaller footprint and allows an application to be statically linked, using
[jlink](https://docs.oracle.com/en/java/javase/11/tools/jlink.html),
into a custom runtime for deployment. This can be particularly useful
in a microservices architecture., into a custom runtime for
deployment. This can be particularly useful in a microservices
architecture.

Internally, the JVM is able to take advantage of modules in a way that
makes class-loading more efficient, resulting in a runtime that is
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

### Profiling and Diagnostics

#### Java Flight Recorder \[[5](#ref5)\]

Java Flight Recorder (JFR) gathers diagnostic and profiling data from
a running Java application with very little impact on a running Java
application. The collected data can then be analyzed with JMC Java
Mission Control (JMC) and other tools. Whereas JFR and JMC were
commercial features in Java 8, both are open source in Java 11.

#### Java Mission Control \[[6](#ref6)\]

Java Mission Control (JMC) provides a graphical display of data
collected by the Java Flight Recorder (JFR) and is open source in Java
11. In addition to general information about the running application,
JMC allows the user to drill down into the data to diagnose runtime
issues such as memory leaks, GC overhead, hot methods, thread
bottlenecks, and blocking I/O.

#### Unified Logging \[[7](#ref7)\]

Java 11 has a common logging system for all components of the JVM.
This unified logging system allows the user to define what components
to log, and to what level. This fine-grained logging is useful for
performing root-cause analysis on JVM crashes and for diagnosing
performance issues in a production environment.

#### Low-Overhead Heap Profiling \[[8](#ref8)\]

New API has been added to the Java Virtual Machine Tool Interface
(JVMTI) for sampling Java heap allocations. The sampling has
low-overhead and can be enabled continuously. While heap allocation
can be monitored with Java Flight Recorder (JFR), the sampling method
in JFR only works on allocation implementations and it may also miss
allocations. Furthermore, the sampling in Java 11 can provide
information about both live and dead objects.

Application Performance Monitoring (APM) vendors are starting to
utilize this new feature and the Java Platform Group is investigating
its potential use with Azure performance monitoring tools.

#### StackWalker \[[9](#ref9)\]

Getting a snapshot of the stack for the current thread is often used
when logging. The problem is how much of the stack trace to log, and
whether log the stack trace at all. For example, one may want to see
the stack trace only for a certain exception from a method. The
StackWalker class (added in Java 9) gives a snapshot of the stack and
provides methods that give the programmer fine-grained control over
how to consume the stack trace.

### Garbage Collection \[[10](#ref10)\]

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

Note that the JVM sets GC defaults for the average use-case. Often,
these defaults, and other GC settings, need to be tuned for optimum
throughput or latency, according to the application's requirements.
Properly tuning the GC requires deep knowledge of the GC, expertise
that the Java Platform Group provides to our customers.

#### G1GC

The default garbage collector in Java 11 is the G1 garbage collector
(G1GC). The aim of G1GC is to strike a balance between latency and
throughput. The G1 garbage collector attempts to achieve high
throughput by meeting pause time goals with high probability. G1GC is
designed to avoid full collections, but when the concurrent
collections can\'t reclaim memory fast enough a fall back full GC will
occur. The full GC uses the same number of parallel worker threads as
the young and mixed collections.

#### Parallel GC

The parallel collector is the default collector in Java 8. This is a
throughput collector that uses multiple threads to speed up garbage
collection.

#### Epsilon \[[11](#ref11)\]

The Epsilon garbage collector handles allocations but does not reclaim
any memory. When the heap is exhausted, the JVM will shut down.
Epsilon is useful for short-lived services and for applications that
are known to be garbage-free.

#### Improvements for Docker Containers \[[12](#ref12)\]

Prior to Java 10, running Java in a container could cause performance
issues because memory and CPU constraints set on the container were
not recognized by the JVM. For example, if a Docker container is run
with a memory limit (e.g., -m2G), the JVM will default the maximum
heap size to ¼ of the physical memory of the underlying host. Since
Java 10, the JVM uses constraints set by container control groups
(cgroups) and sets memory and CPU limits accordingly (see note below).
In the example given, for Java 10+, the JVM will default the maximum
heap size to ¼ of the container's memory limit.

JVM Options were also added to give Docker container users
fine-grained control over the amount of system memory that will be
used for the Java heap.

This support is enabled by default and is only available on
Linux-based platforms.

> [!NOTE]
> Most of the cgroup enablement work was backported to Java 8 as of
> jdk8u191. Further improvements may not necessarily be backported to 8.

#### Multi-Release jar files \[[13](#ref13)\]

It is possible in Java 11 to create a jar file that contains multiple,
Java-release-specific versions of class files. This makes it possible
for library developers to support multiple versions of Java without
having to ship multiple versions of jar files. For the consumer of
these libraries, multi-release jar files solves the issue of having to
match specific jar files to specific runtime targets.

## Miscellaneous Performance Improvements

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
    this by allowing application classes to be placed in the CDS
    archive. When multiple JVMs share the same archive file, memory is
    saved, and the overall system response time improves.

-   **JEP 312: Thread-Local Handshakes** \[[17](#ref17)\] - Makes it possible to
    execute a callback on threads without performing a global VM
    safepoint, which helps the VM achieve lower latency by reducing the
    number of global safepoints.

-   **Lazy Allocation of Compiler Threads** \[[18](#ref18)\] - In tiered
    compilation mode, which is on by default, the VM starts a large
    number of compiler threads on systems with many CPUs regardless of
    the available memory and the number of compilation requests. Because
    the threads consume memory even when they are idle (which is almost
    all the time), this leads to an inefficient use of resources. To
    address this issue, the implementation has been changed to start
    only one compiler thread of each type during startup and to handle
    the start and shutdown of further threads dynamically.

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
    more efficient because the APIs create collections that are
    compactly represented and do not have the indirection of a wrapper
    class.

-   **JEP 285: Spin-Wait Hints** \[[21](#ref21)\] - Provides API that allows Java
    to hint to the run-time system that it is in a spin loop. Certain
    hardware platforms benefit from software indication that a thread is
    in a busy-wait state.

-   **JEP 321: HTTP Client (Standard)** \[[22](#ref22)\]- Provides a new HTTP
    client API that implements HTTP/2 and WebSocket and can replace the
    legacy HttpURLConnection API.

## Appendix A: New Language Features

There are many language features that have been added to Java since JDK 8. 
Most of these new features are aimed squarely at developer
productivity (think "less typing"). There are also many new APIs that
make it easier to write code and make the code more readable.

While it is not necessary to refactor existing code to run on JDK 11,
these features should be considered when making bug fixes or doing new
development.

### Local-Variable Type Inference \[[23](#ref23)\] \[[24](#ref24)\]

In JDK 11, the var identifier can be used when declaring a local
variable with a non-null initializer. This reduces the amount of
redundant code that must be written to declare a variable. For
example, in JDK 8, one would write:

```java
Map\<String,MyObject\> myObjectMap = new HashMap\<\>();
```

But in JDK 11, the type can be inferred from the initializer and the
redundant Map\<String,MyObject\> becomes unnecessary. In JDK 11, the
code can be simplified with the var identifier:

```java
var myObjectMap = new HashMap\<String,MyObject\>();
```

Local-Variable type inference is useful in for loops indexes,
try-with-resources variables, and formal parameters of a lambda
expression.

```java
for(var index=0; index \< 10; index++ {...} // index infers as int                                                               
for(var s: Arrays.asList(\"1\", \"2\", \"3\")) { sum += Integer.valueOf(s); }                                                     Function\<Number,Integer\> toInt = (var n) -\> n.intValue();          
```

Note that the type of a lambda parameter is inferred regardless of the
var identifier. Using var with the formal parameters of a lambda
expression allows the parameters to be annotated:

```java
Function\<Number,Integer\> toInt = (@NotNull var n) -\> n.intValue();
```

### Convenience Factory Methods for Collections \[[25](#ref25)\]

Static factory methods were added to the List, Set and Map interfaces
to make it convenient to create unmodifiable instances of collections
with a small number of elements. This simplifies the pattern of having
to create and populate a collection to use the
Collections.unmodifiableXXX APIs.

One possible way to create an unmodifiable List in Java 8 is to write
the code:

```java
 List\<String\> list = new ArrayList\<\>();
 list.add(\"one\");
 list.add(\"two\");
 list.add(\"three\");
 List\<String,Integer\> unmodifiableList =                             
 Collections.unmodifiableList(List);                                   
```

In Java 11, this can be written more succinctly as:

```java
List\<String\> unmodifiableList = List.of(\"one\", \"two\", \"three\");
```

Note that the unmodifiable view of a collection returned by
Collections.unmodifableXXX is "read through". This means that
modifications to the original collection are seen by the unmodifiable
collection. The of API does not suffer from this short-coming.

In addition to the of API There is also a copyOf API that returns an
unmodifiable copy of the List, Set or Map.

### More Concise try-with-resources \[[26](#ref26)\]

In JDK 8, try-with-resource required a fresh variable declaration for
a resource. JDK 11 allows a final, or effectively final variable to be
used for the resource. This gives the developer more freedom in how
resource variables are declared and initialized.

```java
 MyResource resource = new MyResource(path);
 ...\                                        
 try (resource) {
 ...
 }                                           
```

### Allow Diamond Operator for Anonymous Inner Classes \[[26](#ref26)\]

The restriction on using the diamond operator for anonymous inner
classes has been relaxed.

```java
 interface NumConsumer\<N extends Number\> { void consume(N n); }\     
 // JDK 8 requires type
 NumConsumer\<Integer\> intConsumer8 = new NumConsumer\<Integer\>() {  
 \@Override void consumer(Integer I) {...}};
 // JDK 11 allows diamond operator
 NumConsumer\<Integer\> intConsumer11 = new NumConsumer\<\>() {        
 \@Override void consumer(Integer I) {...}};                           
```

The use of the diamond operator requires that the type be denotable. A
type which is non-denotable cannot be written explicitly in code.

Appendix B: Future Enhancements
===============================

Placeholder for summaries of future enhancements to be added in a future
revision of this document.

-   Vector API

-   Project Valhalla (Value Types)

-   Project Panama

-   Project Loom

Appendix C: BACKLOG 
====================

Items to be considered for future revisions of this document. This list
may not be complete. Items with strikethrough have been addressed.

Added in 9:

-   ~~JEP 238 - Multi-release jar files. Extend the JAR file format to
    allow multiple, Java-release-specific versions of class files to
    coexist in a single archive.~~

-   JEP 266 - Reactive streams (java.util.concurrent.Flow API),
    CompletableFuture additional API

-   Optional::stream, ifPresentOrElse, or

-   Stream API additions -- takeWhile, dropWhile, ofNullable, iterate

-   JEP 280 - Indify string concatenation

-   JEP 274 -- Enhanced Method Handles

-   ~~JEP 285 -- Spin wait hints - Thread.onSpinWait() API.~~

Added in 10:

-   Optional.orElseThrow()

-   ~~JEP 269 - Unmodifiable collection API -- e.g., List\<E\>
    copyOf(Collection\<? Extends E\>), Collectors.toUnmodifiableXXX~~

-   ~~JEP 286 - Local-variable type inference~~

-   ~~JEP 307 -- Parallel full GC for G1~~

-   ~~JEP 310 - Application class data sharing. Improves startup
    footprint by sharing common class metadata across different java
    processes.~~

-   ~~JEP 312 - Thread-local handshakes. Improves performance by making
    it possible to execute a callback on threads without a global VM
    safepoint.~~

-   JEP 316 - Heap allocation on alternative memory devices

Added in 11:

-   ~~JEP 321 - Standardized HTTP Client~~

-   toArray(IntFunction\<A\[\]\>) - instead of typical toArray(new
    Foo\[0\]), can do toArray(Foo\[\]::new) or whatever so long as a
    Foo\[\] is returned.

-   ~~JEP 323 - Local-variable syntax for lambda parameters~~

Benchmarks

Provide our own benchmarks:

-   Throughput, Latency, Footprint, Cold start, warm start

-   Load, underutilization, endurance etc.

References
==========
<a id="ref1">\[1\]</a> Oracle Corporation, \"Java Development Kit 9 Release Notes,\"
(Online). Available: https://www.oracle.com/technetwork/java/javase/9u-relnotes-3704429.html.
(Accessed 13/11/2019).

<a id="ref2">\[2\]</a> Oracle Corporation, \"Java Development Kit
10 Release Notes,\" (Online). Available:
https://www.oracle.com/technetwork/java/javase/10u-relnotes-4108739.html.
(Accessed 13/11/2019).

<a id="ref3">\[3\]</a> Oracle Corporation, \"Java Development Kit
11 Release Notes,\" (Online). Available:
https://www.oracle.com/technetwork/java/javase/11u-relnotes-5093844.html.
(Accessed 13/11/2019).

<a id="ref4">\[4\]</a> Oracle Corporation, \"Project Jigsaw,\" 22
9 2017. (Online). Available: http://openjdk.java.net/projects/jigsaw/.
(Accessed 13/11/2019).

<a id="ref5">\[5\]</a> Oracle Corporation, \"JEP 328: Flight
Recorder,\" 9/9/2018. (Online). Available:
http://openjdk.java.net/jeps/328. (Accessed 13/11/2019).

<a id="ref6">\[6\]</a> Oracle
Corporation, \"Mission Control,\" 25/4/2019. (Online). Available:
https://wiki.openjdk.java.net/display/jmc/Main. \[Accessed 13/11/2019\].

\[7\] Oracle Corporation, \"JEP 158: Unified JVM Logging,\" 14 02
2019. (Online). Available: http://openjdk.java.net/jeps/158.
(Accessed 13/11/2019).

\[8\] Oracle Corporation, \"JEP 331:
Low-Overhead Heap Profiling,\" 5/9/2018. (Online). Available:
http://openjdk.java.net/jeps/331. (Accessed 13/11/2019).
\\[9\\] Oracle
Corporation, \"JEP 259: Stack-Walking API,\" 18/07/2017. (Online).
Available: http://openjdk.java.net/jeps/259. \[Accessed 13/11/2019\].

<a id="ref10">\[10\]</a> Oracle Corporation, \"JEP 248: Make G1 the Default Garbage
Collector,\" 12/9/2017. (Online). Available:
http://openjdk.java.net/jeps/248. (Accessed 13/11/2019).
<a id="ref11">\[11\]</a> Oracle
Corporation, \"JEP 318: Epsilon: A No-Op Garbage Collector,\" 24/9/2018.
(Online). Available: http://openjdk.java.net/jeps/318. \[Accessed 13/11/2019\].
<a id="ref12">\[12\]</a> Oracle Corporation, \"JDK-8146115 : Improve docker
container detection and resource configuration usage,\" 16/9/2019.
(Online). Available:
https://bugs.java.com/bugdatabase/view\_bug.do?bug\_id=JDK-8146115.
(Accessed 13/11/2019).
<a id="ref13">\[13\]</a> Oracle Corporation, \"JEP 238:
Multi-Release JAR Files,\" 22/6/2017. (Online). Available:
http://openjdk.java.net/jeps/238. (Accessed 13/11/2019).
<a id="ref14">\[14\]</a> Oracle
Corporation, \"JEP 197: Segmented Code Cache,\" 28/04/2017. (Online).
Available: http://openjdk.java.net/jeps/197. \[Accessed 13/11/2019\].
<a id="ref15">\[15\]</a> Oracle Corporation, \"JEP 254: Compact Strings,\" 18 05
2019. (Online). Available: http://openjdk.java.net/jeps/254.
(Accessed 13/11/2019).
<a id="ref16">\[16\]</a> Oracle Corporation, \"JEP 310:
Application Class-Data Sharing,\" 17/8/2018. (Online). Available:
https://openjdk.java.net/jeps/310. (Accessed 13/11/2019).
<a id="ref17">\[17\]</a> Oracle
Corporation, \"JEP 312: Thread-Local Handshakes,\" 21/8/2019.
(Online). Available: https://openjdk.java.net/jeps/312. \[Accessed 13/11/2019\].
<a id="ref18">\[18\]</a> Oracle Corporation, \"JDK-8198756 : Lazy allocation of
compiler threads,\" 29/10/2018. (Online). Available:
https://bugs.java.com/bugdatabase/view\_bug.do?bug\_id=8198756.
(Accessed 13/11/2019).
<a id="ref19">\[19\]</a> Oracle Corporation, \"JEP 193: Variable
Handles,\" 17/8/2017. (Online). Available:
https://openjdk.java.net/jeps/193. (Accessed 13/11/2019).
<a id="ref20">\[20\]</a> Oracle
Corporation, \"JEP 269: Convenience Factory Methods for Collections,\"
26/6/2017. (Online). Available: https://openjdk.java.net/jeps/269.
(Accessed 13/11/2019).
<a id="ref21">\[21\]</a> Oracle Corporation, \"JEP 285: Spin-Wait
Hints,\" 20/8/2017. (Online). Available:
https://openjdk.java.net/jeps/285. (Accessed 13/11/2019).
<a id="ref22">\[22\]</a> Oracle
Corporation, \"JEP 321: HTTP Client (Standard),\" 27/9/2018. (Online).
Available: https://openjdk.java.net/jeps/321. \[Accessed 13/11/2019\].
<a id="ref23">\[23\]</a> Oracle Corporation, \"JEP 286: Local-Variable Type
Inference,\" 12/10/2018. (Online). Available:
https://openjdk.java.net/jeps/286. (Accessed 13/11/2019).
<a id="ref24">\[24\]</a> Oracle
Corporation, \"JEP 323: Local-Variable Syntax for Lambda Parameters,\"
23/8/2018. (Online). Available: https://openjdk.java.net/jeps/323.
(Accessed 13/11/2019).
<a id="ref25">\[25\]</a> Oracle Corporation, \"JEP 269:
Convenience Factory Methods for Collections,\" 26/6/2017. (Online).
Available: https://openjdk.java.net/jeps/269. \[Accessed 13/11/2019\].
<a id="ref26">\[26\]</a> Oracle Corporation, \"JEP 213: Milling Project Coin,\" 9 3
2017. (Online). Available: https://openjdk.java.net/jeps/213.
(Accessed 13/11/2019).

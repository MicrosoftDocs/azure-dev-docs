---
title: Transitioning from Java 8 to Java 11
description: A guide for managing the move from Java 8 to Java 11. 
author: dsgrieve
manager: maverberg
tags: java
ms.service: azure
ms.devlang: java
ms.topic: article
ms.date: 11/19/2019
ms.author: dagrieve
---

# Transitioning from Java 8 to Java 11

For a non-trivial application, moving from Java 8 to Java 11 can be a significant 
amount of work. Potential issues include removed API, deprecated packages, use of
internal API, changes to class loaders, and changes to garbage collection. Moving 
to Java 11 is worth the effort. Since Java 8, new features have been added and 
enhancements have been made. There are noticeable additions and modifications to API,
and there are enhancements that improve startup, performance, and memory usage.

There is no one-size-fits-all solution to transitioning from Java 8 to Java 11. 
In general, the choices are to try to run on Java 11 without recompiling, or to
compile with JDK 11 first. If the goal is to get anapplication up and running as 
quickly as possible, just trying to run on Java 11 is often the best approach. 
For a library, the goal will be to publish an artifcat that is compiled and tested
with JDK 11.

Java 11 has two tools to use if you want to get a feel for the issues you may enocounter.
The first is [jdeprscan](https://docs.oracle.com/en/java/javase/11/tools/jdeprscan.html), which 
can scan a `jar` file or set of class files for use of deprecated or removed API.
```console
jdeprscan --release 11 my-application.jar
```
Use of deprecated API is not a blocking issue, but is something to look into. Is there an 
updated jar file? Do you need to log an issue to address the use of deprecated API? Use of 
removed API, on the other hand, is a blocking issue that has to be addressed before you try
to run on Java 11.

The `jdeprscan` tool spits out an error message if it has trouble resolving a dependent class.
For example, `error: cannot find class org/apache/logging/log4j/Logger`. Adding dependent 
classes to the `--class-path` is recommended, but the tool will continue the scan without it.
Note that the argument is *&#8209;&#8209;class&#8209;path*. Frustratingly, no other variations
of the classpath argument will work. 
```console
jdeprscan --release 11 --class-path log4j-api-2.13.0.jar my-application.jar
error: cannot find class sun/misc/BASE64Encoder
class com/company/Util uses deprecated method java/lang/Double::<init>(D)V
```
This output tells us that the `com.company.Util` class is calling a deprecated constructor of the
`java.lang.Double` class. The javadoc will recommend API to use in place of deprecated API. 
Note that no amount of work will resolve the `error: cannot find class sun/misc/BASE64Encoder`
because it is API that has been removed. More on that later. 

Using the `--release 11` option is recommended since that will give the most complete list
of deprecated API. If you want to prioritize which deprecated API to go after, dial the setting
back to `--release 8`. API that was deprecated in Java 8 is likely to be removed sooner than
API that was deprecated after Java 8. 

Run `jdeprscan --release 11 --list` to get a sense of what API has been deprecated since Java 8.
To get a list of API that has been removed, run run `jdeprscan --release 11 --list --for-removal`.

The other tool that is useful for sniffing out potential problems is 
[jdeps](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html), which is a Java class
dependency analyzer. 
Use *jdeps* with the `--jdk-internals` option to find dependencies on JDK internal API.
```console
jdeps --jdk-internals --multi-release 11 --class-path log4j-api-2.13.0.jar my-application.jar
Util.class -> JDK removed internal API
Util.class -> jdk.base
Util.class -> jdk.unsupported
   com.company.Util        -> sun.misc.BASE64Encoder        JDK internal API (JDK removed internal API)
   com.company.Util        -> sun.misc.Unsafe               JDK internal API (jdk.unsupported)
   com.company.Util        -> sun.nio.ch.Util               JDK internal API (java.base)

Warning: JDK internal APIs are unsupported and private to JDK implementation that are
subject to be removed or changed incompatibly and could break your application.
Please modify your code to eliminate dependence on any JDK internal APIs.
For the most recent update on JDK internal API replacements, please check:
https://wiki.openjdk.java.net/display/JDK8/Java+Dependency+Analysis+Tool

JDK Internal API                         Suggested Replacement
----------------                         ---------------------
sun.misc.BASE64Encoder                   Use java.util.Base64 @since 1.8
sun.misc.Unsafe                          See http://openjdk.java.net/jeps/260   

```
The jdeps tool tells you which class depends on which internal API and gives suggested replacements 
for some, but not all, internal API. The OpenJDK wiki page 
[Java Dependency Analysis Tool](https://wiki.openjdk.java.net/display/JDK8/Java+Dependency+Analysis+Tool)
has recommended replacements for some commonly used JDK internal APIs. 

You can continue to use internal API in Java 11, but replacing the usage should be a priority. 
The internal APIs are encapsulated in the module given in the parentheses. For example, 
*sun.nio.ch.Util* is encapsulated in the module *java.base*. The `--add-exports` command line
option can be used to [break encapsulation](http://openjdk.java.net/jeps/261). 

What *jdeprscan* and *jdeps* cannot do is warn about the use of reflection to access to encapsulated API. 
Reflective access is checked at runtime. The default behavior is to permit the access and generate a warning. 
This can be controlled with the `--illegal-access` command line option. Ultimately, in order to know if there
is any use of internal or removed API, you have to run the code on Java 11. 

It is worth mentioning that the same warnings and errors regarding deprecated API will come out of 
running *javac* from JDK 11. But *jdeprscan* and *jdeps* let you continue to compile with JDK 8. 


Most applications should run on Java 11 without modification. The first thing to try
is to use a version 11 `java` without recompiling the code, and without making any
changes to the command line or library dependencies. The point of doing this is to
see what warnings and errors come out of the execution. This approach gets an  
application to run on Java 11 more quickly by focusing on the minimum that needs 
to be done. 

Compiling on Java 11 will require updates to build scripts, tools, test frameworks, 
and included libraries. Compiler warnings and errors have to be addressed.
Some of the warnings will also be issues at runtime `TODO: example here`. 

Libraries should consider packaging as a 
[multi-release jar file](https://docs.oracle.com/en/java/javase/11/docs/specs/jar/jar.html#multi-release-jar-files). 
Multi-release jar files allow you to support both Java 8 and Java 11 runtimes 
from the same jar file. They do, however, add some build complexity which is 
beyond the scope of this document. 



Once the application runs on Java 11, the next step would be to upgrade
third party libraries. Look for updated versions of the libraries your 
application depends on. Choose modular libraries, if possible, and move
those libraries off the class-path and onto the module-path. Use the  
module-path as much as possible, even if you don't plan on using modules
in your application. Using the module-path has better performance for 
class loading than the class-path does. 



If you get the application to run on Java 11 first, then upgrade third party
libraries, run first, then upgrade third party libraries,  

Compiling first 

The other approach is to use tools like 
[jdeprscan](https://docs.oracle.com/en/java/javase/11/tools/jdeprscan.html)
and [jdeps](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html) to look 
for issues. The downside to this approach is that these tools can only do
static analysis. They cannot detect access to JDK-internal or deprecated API
through reflection which will be detected at runtime. Also, resolving
deprecation warnings can be done as a separate effort since  
deprecated API is a runtime issue only if the API has been removed.

There is no no one-size-fits-all approach to transitioning an application to Java 11.
The [run first](#run-on-java-11) approach is recommended. This guide offers
advice on how to deal with the issues you may encounter when moving from Java 8 to Java 11.  
The reader is encouraged to consult other guides, such as the
[Oracle JDK Migration Guide](https://docs.oracle.com/en/java/javase/11/migrate/index.htm). 

Please note that this document does not address how to make existing code 
[modular](http://openjdk.java.net/projects/jigsaw). 

## Run on Java 11

Before running on Java 11, do a quick scan of the command-line options. 
[Options that have been removed](#unrecognized options) since Java 8 will cause the Java Virtual 
Machine (JVM) to exit. The [JaCoLine](https://jacoline.dev/about) tool is a good one to use
to detect problems with the command line options.

Parallel GC should be explicitly set with the command-line option `-XX:+UseParallelGC`,
if the garbage collector has not been set in the VM options.
The Parallel garbage collector (Parallel GC) is the default GC in Java 8. The default
changed in Java 9 to the Garbage First garbage collector (G1GC). In order to make a 
fair comparison of an application running on Java 8 versus Java 11, the GC settings
must be the same. Experimenting with G1GC, or otherwise tuning the GC, should be 
deferred until the application has been validated on Java 11. 

If running on the Hot Spot VM, setting the command line option `-XX:+PrintCommandLineFlags`
will dump the values of options set by the VM, particularly the defaults set by the GC.
For the most part, the defaults are the same from 8 to 11. To ensure the settings
are consistent, set this option when running the application with Java 8
and use the printed options when running on Java 11. 

Setting the command line option `--illegal-access=warn` is recommended.
In Java 11, using reflection to access to JDK-internal API will result in an
[illegal reflective access warning](#warning:-an-illegal-reflective-access-operation-has-occurred).
By default, the warning is only issued for
the first illegal access. Setting `--illegal-access=warn` will cause a warning
on *every* illegal reflective access. 
Once the application runs  on Java 11, set `--illegal-access=deny` to mimic
the future behavior of the Java runtime. 

Most of the problems can be resolved without having to recompile code. If an 
issue has to be fixed in the code, then make the fix but continue to compile 
with JDK 8. Work on getting the application to *run* with `java` version 11 
before *compiling* with JDK 11. 

Issues you may encounter are:

- [-Xbootclasspath/p is no longer a supported option](#--patch-module)
- [Unrecognized VM option](#unrecognized-options)
- [Unrecognized option](#unrecognized-options)
- [VM Warning: Ignoring option](#vm-warnings)
- [VM Warning: Option &lt;*option*&gt; was deprecated](#vm-warnings)
- [WARNING: An illegal reflective access operation has occurred](#warning:-an-illegal-reflective-access-operation-has-occurred)
- [java.lang.NoClassDefFoundError](#java.lang.noclassdeffounderror)
- [java.lang.ClassNotFoundError](#java.lang.noclassdeffounderror)
- [java.lang.UnsupportedClassVersionError](#unsupportedclassversionerror)

### Unrecognized options

If a command-line option has been removed, the application will print 
`Unrecognized option:` or `Unrecognized VM option` followed by the name 
of the offending option. An unrecognized option will cause the VM to exit.
Options that have been deprecated, but not removed, will produce 
a [VM warning](#vm-warnings).

In general, options that were removed have no replacement and the only recourse is to remove the option 
from the command line. The exception is options for garbage collection logging. GC logging was 
[reimplemented](http://openjdk.java.net/jeps/271) in Java 9 to use the 
[unified JVM logging framework](http://openjdk.java.net/jeps/158). Refer to "Table 2-2 Mapping Legacy Garbage Collection Logging Flags to the Xlog Configuration" in the section [Enable Logging with the JVM Unified Logging Framework](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-BE93ABDC-999C-4CB5-A88B-1994AAAC74D5) of the Java SE 11 Tools Reference. 

### VM warnings

Use of deprecated options will produce a warning. An option is deprecated when it has been replaced
or is no longer useful. As with [removed options](#unrecognized-options), these options should be 
removed from the command line.
The warning `VM Warning: Option &lt;option&gt; was deprecated` means that the option is still supported,
but that support may be removed in the future. 
An option that is no longer supported and will generate the warning `VM Warning: Ignoring option`.
Options that are no longer supported have no effect on the runtime.

The web page [VM Options Explorer](https://chriswhocodes.com/hotspot_option_differences.html) provides an exhaustive
list of options that have been added to or removed from Java since JDK 7. 

### Error: Could not create the Java Virtual Machine

This error message is printed when the JVM encounters an [unrecognized option](#unrecognized-options).
Remove the offending option from the command line.  

### WARNING: An illegal reflective access operation has occurred

When Java code uses reflection to access JDK-internal API, the runtime will issue an
illegal reflective access warning.

```console
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by my.sample.Main (file:/C:/sample/) to method sun.nio.ch.Util.getTemporaryDirectBuffer(int)
WARNING: Please consider reporting this to the maintainers of com.company.Main
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
```

What this means is that a module has not exported the package that
is being accessed through reflection (the package is encapsulated in the module).
The warning in the example above is issued because the `sun.nio.ch` package is not
exported by the `java.base` module.
In other words, there is no `exports sun.nio.ch;` in the `module-info.java`
file of module `java.base`. 

To address this warning, look for updated code that does not make use of 
the JDK-internal API. If the issue cannot be resolved with updated code, either the `--add-exports`
or the `--add-opens` command-line option can be used to open access to the package.
These options allow access to un-exported types of a module from another module.

The `--add-exports` option has the syntax `--add-exports <module>/<package>=<target-module>(,<target-module>)*`.
This option allows the target module to access the *public* types of the named package
of the source module. There can be more than one `--add-exports`, but only one for 
each unique combination of module and package.  

To access *non-public* types, the 
Access to While `--add-exports` will work for public types of the named package, If the code uses `setAccessible` to 

The format of the options are
and `--add-opens <module>/<package>=<target-module>(,<target-module>)*`
The *&lt;module&gt;* parameter names the module that hides *&lt;package&gt;*, and *&lt;target-module&gt;* 
names the module that wants to open the hidden package. In the example warning, the 
`sun.nio.ch` package is hidden in the `java.base` module. The target module is the 
module in which the application 
Here, the application is not defined in a module. Classes that are not defined in a module
implicitly belong to the *unnamed* module and the *&lt;target-module&gt;*
is literally `ALL-UNNAMED`. Adding `--add-exports java.base/sun.nio.ch=ALL-UNNAMED` 
to the command line will work around the warning in the example. 

The warning can be ignored as a first effort to getting up and running on Java 11.
The Java 11 runtime permits the reflective access so that legacy code can
continue to work.  

The `--add-exports` or `--add-opens` options should be considered as a work-around, not a long-term solution.
Using these options breaks encapsulation of the module system which is 
meant to keep JDK-internal API from being used.  If the internal API 
is removed or changes, the application will fail.  Reflective access will be 
denied in the future, except where access enabled by command line options such as `--add-opens`.
To mimic the future behavior, set `--illegal-access=deny` on the command line.

### java.lang.NoClassDefFoundError

#### NoClassDefFoundError caused by split-packages

A split package is when a package is found in more than one library. The symptom of a split-package 
problem is that a class you know to be on the class-path is not found. 

This issue will only occur when using the module-path. The Java module system optimizes 
class lookup by restricting a package to one *named* module. The runtime gives preference to the 
module-path over the class-path when doing a class lookup. If a package is split between 
a module and the class-path, only the module is used to do the class lookup. This can lead 
to `NoClassDefFound` errors. 

An easy way to check for a split package is to plug your module path and class path into [jdeps](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html) 
and use the path to your application class files as the &lt;path&gt;. If there is a split package,
jdeps will print out a warning: `Warning: split package: <package-name> <module-path> <split-path>`. 

This issue can be resolved by using `--patch-module <module-name>=<path>[,<path>]` to add the split package into the named module. 
```
├ com.sample.module
└
```

#### NoClassDefFoundError caused by using Java EE or CORBA modules

If the application runs on Java 8 but throws a `java.lang.NoClassDefFoundError` or a 
`java.lang.NoClassDefFoundError`, then it is
likely that the application is using a package from the Java EE or CORBA modules. 
These modules were deprecated in Java 9 and [removed in Java 11](https://openjdk.java.net/jeps/320). 

To resolve the issue, add a runtime dependency to your project.

[!div class="mx-tdBreakAll"].
|Removed module|Affected Package|Suggested dependency|
|-|-|-|
|Java API for XML Web Services (JAX-WS) |java.xml.ws |[JAX WS RI Runtime](https://mvnrepository.com/artifact/com.sun.xml.ws/jaxws-rt) |
|Java Architecture for XML Binding (JAXB) |java.xml.bind |[JAXB Runtime](https://mvnrepository.com/artifact/org.glassfish.jaxb/jaxb-runtime)|
|JavaBeans Activation Framework (JAV) |java.activation |[JavaBeans (TM) Activation Framework](https://mvnrepository.com/artifact/javax.activation/activation) |
|Common Annotations |java.xml.ws.annotation |[Javax Annotation API](https://mvnrepository.com/artifact/javax.annotation/javax.annotation-api)|
|Common Object Request Broker Architecture (CORBA) |java.corba | [GlassFish CORBA ORB](https://mvnrepository.com/artifact/org.glassfish.corba/glassfish-corba-orb) |
|Java Transaction API (JTA) |java.transaction | [Java Transaction API](https://mvnrepository.com/artifact/javax.transaction/jta)|

### --patch-module

### UnsupportedClassVersionError

This exception means that you are trying to run code that was compiled with a later version of Java on an earlier version of Java. For example, you are running on Java 11 with a jar that was compiled with JDK 13. 

| Java version | Class file format version |
|-|-|
| 8  | 52 |
| 9  | 53 |
| 10 | 54 |
| 11 | 55 |
| 12 | 56 |
| 13 | 57 |

### 
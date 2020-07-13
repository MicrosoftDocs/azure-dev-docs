---
title: Transition from Java 8 to Java 11
titleSuffix: Azure
description: A guide for managing the move from Java 8 to Java 11. 
author: dsgrieve
manager: maverbur
tags: java
ms.service: azure
ms.devlang: java
ms.topic: article
ms.date: 11/19/2019
ms.author: dagrieve
ms.custom: devx-track-java
---

# Transition from Java 8 to Java 11

There's no one-size-fits-all solution to transition code from Java 8 to Java 11.
For a non-trivial application, moving from Java 8 to Java 11 can be a significant 
amount of work. Potential issues include removed API, deprecated packages, use of
internal API, changes to class loaders, and changes to garbage collection. 

In general, the approaches are to try to run on Java 11 without recompiling, or to
compile with JDK 11 first. If the goal is to get an application up and running as 
quickly as possible, just trying to run on Java 11 is often the best approach. 
For a library, the goal will be to publish an artifact that is compiled and tested
with JDK 11.

Moving to Java 11 is worth the effort. New features have been added and 
enhancements have been made since Java 8. These features and enhancements
improve startup, performance, memory usage, and provide better integration
with containers. And there are additions and modifications to API that 
improve developer productivity. 

This document touches on tools to inspect code. It also covers
issues that you may run into and recommendations
for resolving them. You should also consult other guides, such as the
[Oracle JDK Migration Guide](https://docs.oracle.com/en/java/javase/11/migrate/index.html). How to make existing code 
[modular](http://openjdk.java.net/projects/jigsaw) is not covered here.  


## The toolbox

Java 11 has two tools, *jdeprscan* and *jdeps*, that are useful for sniffing out potential issues. These tools can be run against existing class or jar files. You can assess the transition effort without having to recompile. 

[jdeprscan](https://docs.oracle.com/en/java/javase/11/tools/jdeprscan.html) looks for use of deprecated or removed API.
Use of deprecated API is not a blocking issue, but is something to look into. Is there an
updated jar file? Do you need to log an issue to address the use of deprecated API? Use of 
removed API is a blocking issue that has to be addressed before you try
to run on Java 11.


[jdeps](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html), which is a Java class
dependency analyzer. When used with the `--jdk-internals` option, *jdeps* tells you which 
class depends on which internal API. You can continue to use internal API in Java 11, but 
replacing the usage should be a priority. The OpenJDK wiki page 
[Java Dependency Analysis Tool](https://wiki.openjdk.java.net/display/JDK8/Java+Dependency+Analysis+Tool)
has recommended replacements for some commonly used JDK internal APIs. 

There are *jdeps* and *jdeprscan* plugins for both Gradle and Maven. We recommend adding these
tools to your build scripts. 

> [!div class="mx-tdBreakAll"]
> |Tool|Gradle Plugin|Maven Plugin|
> |-|-|-|
> |jdeps|[jdeps-gradle-plugin](https://github.com/kordamp/jdeps-gradle-plugin)|[Apache Maven JDeps Plugin](https://maven.apache.org/plugins/maven-jdeps-plugin/index.html)|
> |jdeprscan|[jdeprscan-gradle-plugin](https://github.com/kordamp/jdeprscan-gradle-plugin)|[Apache Maven JDeprScan Plugin](https://maven.apache.org/plugins/maven-jdeprscan-plugin/index.html)|

The Java compiler itself, *javac*, is another tool in your toolbox. The warnings and errors you get from *jdeprscan* and *jdeps* will come out of the compiler.  The advantage of using
*jdeprscan* and *jdeps* is that you can run these tools over existing jars and class files, including
third-party libraries.

What *jdeprscan* and *jdeps* cannot do is warn about the use of reflection to access encapsulated API. 
Reflective access is checked at runtime. Ultimately, you have to run the code on Java 11 to know with certainty.

### Using jdeprscan

The easiest way to use [jdeprscan](https://docs.oracle.com/en/java/javase/11/tools/jdeprscan.html) is 
to give it a jar file from an existing build. You can also give it a directory, such as the compiler
output directory, or an individual class name. Use the `--release 11` option to get the most complete
list of deprecated API. If you want to prioritize which deprecated API to go after, dial the setting
back to `--release 8`. API that was deprecated in Java 8 is likely to be removed sooner than
API that has been deprecated more recently. 

```console
jdeprscan --release 11 my-application.jar
```

The *jdeprscan* tool generates an error message if it has trouble resolving a dependent class.
For example, `error: cannot find class org/apache/logging/log4j/Logger`. Adding dependent 
classes to the `--class-path` or using the application class-path is recommended, but the tool will continue the scan without it.
The argument is *&#8209;&#8209;class&#8209;path*. No other variations
of the class-path argument will work.

```console
jdeprscan --release 11 --class-path log4j-api-2.13.0.jar my-application.jar
error: cannot find class sun/misc/BASE64Encoder
class com/company/Util uses deprecated method java/lang/Double::<init>(D)V
```
This output tells us that the `com.company.Util` class is calling a deprecated constructor of the
`java.lang.Double` class. The javadoc will recommend API to use in place of deprecated API. 
No amount of work will resolve the `error: cannot find class sun/misc/BASE64Encoder`
because it is API that has been removed. Since Java 8, `java.util.Base64` should be used. 

Run `jdeprscan --release 11 --list` to get a sense of what API has been deprecated since Java 8. 
To get a list of API that has been removed, run `jdeprscan --release 11 --list --for-removal`.

### Using jdeps

Use [jdeps](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html), with the `--jdk-internals` option to find dependencies on JDK internal API. The command line option `--multi-release 11` is needed for this example because *log4j-core-2.13.0.jar* is a 
[multi-release jar file](https://docs.oracle.com/en/java/javase/11/docs/specs/jar/jar.html#multi-release-jar-files). 
Without this option, *jdeps* will complain if it finds a multi-release jar file. The option specifies which version of
class files to inspect. 

```console
jdeps --jdk-internals --multi-release 11 --class-path log4j-core-2.13.0.jar my-application.jar
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

The output gives some good advice on eliminating use of JDK internal API! Where possible, 
the replacement API is suggested. The name of the module where the package is encapsulated 
is given in the parentheses. The module name can be used with `--add-exports` or `--add-opens`
if it is necessary to explicitly [break encapsulation](https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-2F61F3A9-0979-46A4-8B49-325BA0EE8B66). 

The use of *sun.misc.BASE64Encoder* or *sun.misc.BASE64Decoder*
will result in a *java.lang.NoClassDefFoundError* in Java 11. Code that uses these
APIs has to be modified to use *java.util.Base64*. 

Try to eliminate the use of any API coming from the module *jdk.unsupported*. API from
this module will reference [JDK Enhancement Proposal (JEP) 260](http://openjdk.java.net/jeps/260) 
as a suggested replacement.
In a nutshell, JEP 260 says that the use of internal API will be supported until 
replacement API is available. Even though your code 
may use JDK internal API, it will continue to run, for a while at least. Do take a look at
JEP 260 since it does point to replacements for some internal API. 
[variable handles](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/invoke/VarHandle.html) 
can be used in place of some *sun.misc.Unsafe* API, for example. 

*jdeps* can do more than just scan for use of JDK internals. It is a useful tool for analyzing 
dependencies and for generating a module-info files. Take a look at the [documentation](https://docs.oracle.com/en/java/javase/11/tools/jdeps.html) for more.

### Using javac

Compiling with JDK 11 will require updates to build scripts, tools, test frameworks, 
and included libraries. Use the `-Xlint:unchecked` option for *javac* to get the
details on use of JDK internal API and other warnings. It may also be necessary to use 
`--add-opens` or `--add-reads` to expose encapsulated packages to the compiler (see [JEP 261](http://openjdk.java.net/jeps/261)). 

Libraries can consider packaging as a 
[multi-release jar file](https://docs.oracle.com/en/java/javase/11/docs/specs/jar/jar.html#multi-release-jar-files). 
Multi-release jar files allow you to support both Java 8 and Java 11 runtimes 
from the same jar file. They do add complexity to the build. How to build
multi-release jars is beyond the scope of this document. 

## Running on Java 11

Most applications should run on Java 11 without modification. The first thing to try
is to run on Java 11 without recompiling the code. The point of just running is to
see what warnings and errors come out of the execution. This approach gets an  
application to run on Java 11 more quickly by focusing on the minimum that needs 
to be done. 

Most of the problems you may encounter can be resolved without having to recompile code.
If an issue has to be fixed in the code, then make the fix but continue to compile 
with JDK 8. If possible, work on getting the application to *run* with `java` 
version 11 before *compiling* with JDK 11. 

### Check command line options

Before running on Java 11, do a quick scan of the command-line options. 
[Options that have been removed](#unrecognized-options) will cause the Java Virtual 
Machine (JVM) to exit. This check is especially important if you use GC logging options since
they have changed drastically from Java 8. The [JaCoLine](https://jacoline.dev/about) tool is a good one to use
to detect problems with the command line options. 

### Check third-party libraries

A potential source of trouble is third-party libraries that you don't control. You can 
proactively update third-party libraries to more recent versions. Or you can see 
what falls out of running the application and only update those libraries that are necessary. 
The problem with updating all libraries to a recent version is that it makes it 
harder to find root cause if there is some error in the application. Did the error happen
because of some updated library? Or was the error caused by some change in
the runtime? The problem with updating only what's necessary is that it may 
take several iterations to resolve.

The recommendation here is to make as few changes as possible and to update 
third-party libraries as a [separate effort](#next-steps). If you do update a third-party library, 
more often than not you will want the latest-and-greatest version that is compatible
with Java 11. 
Depending on how far behind your current version is, you may want to take 
a more cautious approach and upgrade to the first Java 9+ compatible version. 

In addition to looking at release notes, you can use *jdeps* and *jdeprscan* 
to assess the jar file. Also, the OpenJDK Quality Group maintains a 
[Quality Outreach](https://wiki.openjdk.java.net/display/quality/Quality+Outreach) 
wiki page that lists the status of testing of many Free Open Source Software (FOSS)
projects against versions of OpenJDK. 

### Explicitly set garbage collection

The Parallel garbage collector (Parallel GC) is the default GC in Java 8. If the application is using the
default, then the GC should be explicitly set with the command-line option `-XX:+UseParallelGC`.
The default changed in Java 9 to the Garbage First garbage collector (G1GC). In order to make a 
fair comparison of an application running on Java 8 versus Java 11, the GC settings
must be the same. Experimenting with the GC settings should be 
deferred until the application has been validated on Java 11. 

### Explicitly set default options

If running on the HotSpot VM, setting the command line option `-XX:+PrintCommandLineFlags`
will dump the values of options set by the VM, particularly the defaults set by the GC.
Run with this flag on Java 8 and use the printed options when running on Java 11. 
For the most part, the defaults are the same from 8 to 11. But using the settings from
8 ensures parity.

Setting the command line option `--illegal-access=warn` is recommended.
In Java 11, using reflection to access to JDK-internal API will result in an
[illegal reflective access warning](#warning-an-illegal-reflective-access-operation-has-occurred).
By default, the warning is only issued for
the first illegal access. Setting `--illegal-access=warn` will cause a warning
on *every* illegal reflective access. You will find more case if illegal access with the option set to *warn*. But you will also get a lot of redundant warnings.  
Once the application runs on Java 11, set `--illegal-access=deny` to mimic
the future behavior of the Java runtime. Starting with Java 16, the default will 
be `--illegal-access=deny`. 

### ClassLoader cautions

In Java 8, you can cast the system class loader to a `URLClassLoader`. This is usually done by applications and libraries that 
want to inject classes into the classpath at runtime. The class loader hierarchy has
changed in Java 11. The system class loader (also known as the application class loader) is now an internal class. 
Casting to a `URLClassLoader` will throw a `ClassCastException` at runtime. Java 11 does not have API 
to dynamically augment the classpath at runtime but it can be done through reflection, with the obvious caveats
about using internal API. 

In Java 11, the boot class loader only loads core modules. If you create a class loader with 
a null parent, it may not find all platform classes. In Java 11, you need to pass `ClassLoader.getPlatformClassLoader()`
instead of `null` as the parent class loader in such cases. 

### Locale data changes

The default source for locale data in Java 11 was changed with [JEP 252](http://openjdk.java.net/jeps/252) to the Unicode Consortium's Common Locale Data Repository. 
This may have an impact on localized formatting. Set the system property `java.locale.providers=COMPAT,SPI` to revert to the Java 8 locale behavior, if necessary. 

### Potential issues

Here are some of the common issues you might come across. Follow the links for more details about these issues.

- [Unrecognized VM option](#unrecognized-options)
- [Unrecognized option](#unrecognized-options)
- [VM Warning: Ignoring option](#vm-warnings)
- [VM Warning: Option &lt;*option*&gt; was deprecated](#vm-warnings)
- [WARNING: An illegal reflective access operation has occurred](#warning-an-illegal-reflective-access-operation-has-occurred)
- [java.lang.reflect.InaccessibleObjectException](#javalangreflectinaccessibleobjectexception)
- [java.lang.NoClassDefFoundError](#javalangnoclassdeffounderror)
- [-Xbootclasspath/p is no longer a supported option](#-xbootclasspathp-is-no-longer-a-supported-option)
- [java.lang.UnsupportedClassVersionError](#unsupportedclassversionerror)

#### Unrecognized options

If a command-line option has been removed, the application will print 
`Unrecognized option:` or `Unrecognized VM option` followed by the name 
of the offending option. An unrecognized option will cause the VM to exit.
Options that have been deprecated, but not removed, will produce 
a [VM warning](#vm-warnings).

In general, options that were removed have no replacement and the only recourse is to remove the option 
from the command line. The exception is options for garbage collection logging. GC logging was 
[reimplemented](http://openjdk.java.net/jeps/271) in Java 9 to use the 
[unified JVM logging framework](http://openjdk.java.net/jeps/158). Refer to "Table 2-2 Mapping Legacy Garbage Collection Logging Flags to the Xlog Configuration" in the section [Enable Logging with the JVM Unified Logging Framework](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-BE93ABDC-999C-4CB5-A88B-1994AAAC74D5) of the Java SE 11 Tools Reference. 

#### VM warnings

Use of deprecated options will produce a warning. An option is deprecated when it has been replaced
or is no longer useful. As with [removed options](#unrecognized-options), these options should be 
removed from the command line.
The warning `VM Warning: Option <option> was deprecated` means that the option is still supported,
but that support may be removed in the future. 
An option that is no longer supported and will generate the warning `VM Warning: Ignoring option`.
Options that are no longer supported have no effect on the runtime.

The web page [VM Options Explorer](https://chriswhocodes.com/hotspot_option_differences.html) provides an exhaustive
list of options that have been added to or removed from Java since JDK 7. 

#### Error: Could not create the Java Virtual Machine

This error message is printed when the JVM encounters an [unrecognized option](#unrecognized-options).

#### WARNING: An illegal reflective access operation has occurred

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
is being accessed through reflection. The package is *encapsulated* in the module and is, 
basically, internal API. The warning can be ignored as a first effort to getting up and running on Java 11.
The Java 11 runtime permits the reflective access so that legacy code can
continue to work.  

To address this warning, look for updated code that does not make use of 
the internal API. If the issue cannot be resolved with updated code, either the `--add-exports`
or the `--add-opens` command-line option can be used to open access to the package.
These options allow access to unexported types of one module from another module.

The [`--add-exports`](https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-2F61F3A9-0979-46A4-8B49-325BA0EE8B66)
option allows the target module to access the *public* types of the named package
of the source module. Sometimes code will use `setAccessible(true)` to access non-public members and API. This is known as
*deep reflection*. In this case, use [`--add-opens`](https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-12F945EB-71D6-46AF-8C3D-D354FD0B1781) to give your code access to the non-public
members of a package. If you are unsure whether to use *--add-exports* or *--add-opens*, start with 
*--add-exports*. 

The `--add-exports` or `--add-opens` options should be considered as a work-around, not a long-term solution.
Using these options breaks encapsulation of the module system, which is 
meant to keep JDK-internal API from being used.  If the internal API 
is removed or changes, the application will fail.  Reflective access will be 
denied in Java 16, except where access enabled by command line options such as `--add-opens`.
To mimic the future behavior, set `--illegal-access=deny` on the command line.

The warning in the example above is issued because the `sun.nio.ch` package is not
exported by the `java.base` module. In other words, there is no `exports sun.nio.ch;` in the `module-info.java`
file of module `java.base`. This can be resolved with `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`. 
Classes that are not defined in a module implicitly belong to the *unnamed* module, literally named `ALL-UNNAMED`.

#### java.lang.reflect.InaccessibleObjectException

This exception indicates that you are trying to call `setAccessible(true)` on a field or method of an encapsulated class. 
You may also get an [illegal reflective access warning](#warning-an-illegal-reflective-access-operation-has-occurred). Use the 
[`--add-opens`](https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-12F945EB-71D6-46AF-8C3D-D354FD0B1781) option 
to give your code access to the non-public members of a package. The exception message will tell you the module "does not open" the
package to the module that is trying to call *setAccessible*. If the module is "unnamed module", use `UNNAMED-MODULE`
as the target-module in the *--add-opens* option.

```shell
java.lang.reflect.InaccessibleObjectException: Unable to make field private final java.util.ArrayList jdk.internal.loader.URLClassPath.loaders accessible: 
module java.base does not "opens jdk.internal.loader" to unnamed module @6442b0a6

$ java --add-opens=java.base/jdk.internal.loader=UNNAMED-MODULE example.Main
```

#### java.lang.NoClassDefFoundError

*NoClassDefFoundError* is most likely caused by a split package, or by referencing removed modules. 

##### NoClassDefFoundError caused by split-packages

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

##### NoClassDefFoundError caused by using Java EE or CORBA modules

If the application runs on Java 8 but throws a `java.lang.NoClassDefFoundError` or a 
`java.lang.ClassNotFoundException`, then it is
likely that the application is using a package from the Java EE or CORBA modules. 
These modules were deprecated in Java 9 and [removed in Java 11](https://openjdk.java.net/jeps/320). 

To resolve the issue, add a runtime dependency to your project.

> [!div class="mx-tdBreakAll"]
> |Removed module|Affected Package|Suggested dependency|
> |-|-|-|
> |Java API for XML Web Services (JAX-WS) |java.xml.ws |[JAX WS RI Runtime](https://mvnrepository.com/artifact/com.sun.xml.ws/jaxws-rt) |
> |Java Architecture for XML Binding (JAXB) |java.xml.bind |[JAXB Runtime](https://mvnrepository.com/artifact/org.glassfish.jaxb/jaxb-runtime)|
> |JavaBeans Activation Framework (JAV) |java.activation |[JavaBeans (TM) Activation Framework](https://mvnrepository.com/artifact/javax.activation/activation) |
> |Common Annotations |java.xml.ws.annotation |[Javax Annotation API](https://mvnrepository.com/artifact/javax.annotation/javax.annotation-api)|
> |Common Object Request Broker Architecture (CORBA) |java.corba | [GlassFish CORBA ORB](https://mvnrepository.com/artifact/org.glassfish.corba/glassfish-corba-orb) |
> |Java Transaction API (JTA) |java.transaction | [Java Transaction API](https://mvnrepository.com/artifact/javax.transaction/jta)|

#### -Xbootclasspath/p is no longer a supported option

Support for `-Xbootclasspath/p` has been removed. Use `--patch-module` instead. The *--patch-module* option is described in [JEP 261](http://openjdk.java.net/jeps/261). Look for the section labeled "Patching module content". *--patch-module* can be used with *javac* and with *java* to override or augment the classes in a module. 

What *--patch-module* does, in effect, is insert the patch module into the module system's class lookup. The module system will 
grab the class from the patch module first. This is the same effect as pre-pending the bootclasspath in Java 8. 

#### UnsupportedClassVersionError

This exception means that you are trying to run code that was compiled with a later version of Java on an earlier version of Java. For example, you are running on Java 11 with a jar that was compiled with JDK 13. 

| Java version | Class file format version |
|-|-|
| 8  | 52 |
| 9  | 53 |
| 10 | 54 |
| 11 | 55 |
| 12 | 56 |
| 13 | 57 |

## Next steps

Once the application runs on Java 11, consider moving libraries off the 
class-path and onto the module-path. Look for updated versions of the libraries your 
application depends on. Choose modular libraries, if available. Use the 
module-path as much as possible, even if you don't plan on using modules
in your application. Using the module-path has better performance for 
class loading than the class-path does. 

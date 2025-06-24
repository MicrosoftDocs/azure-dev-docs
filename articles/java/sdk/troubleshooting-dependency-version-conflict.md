---
title: Troubleshoot dependency version conflicts when you use the Azure SDK for Java
description: Provides an overview of how to troubleshoot dependency version conflicts related to using the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: limolkova
---

# Troubleshoot dependency version conflicts

This article describes dependency version conflicts and how to troubleshoot them.

Azure client libraries for Java depend on popular third-party libraries such as the following ones:

- [Jackson](https://github.com/FasterXML/jackson)
- [Netty](https://netty.io/)
- [Reactor](https://projectreactor.io/)
- [SLF4J](http://www.slf4j.org/)

Many Java applications and frameworks use these libraries directly or transitively, which leads to [version conflicts](https://en.wikipedia.org/wiki/Dependency_hell). Dependency managers such as [Maven](https://maven.apache.org) and [Gradle](https://docs.gradle.org) resolve all dependencies so that there's only a single version of each dependency on the classpath. However, it's not guaranteed that the resolved dependency version is compatible with all consumers of that dependency in your application. For more information, see [Introduction to the Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html) in the Maven documentation and [Understanding dependency resolution](https://docs.gradle.org/current/userguide/dependency_resolution.html) in the Gradle documentation.

The API incompatibility of direct dependencies results in compilation errors. [Diamond dependency](https://en.wikipedia.org/wiki/Dependency_hell#Problems) incompatibility usually results in runtime failures such as [NoClassDefFoundError](https://docs.oracle.com/javase/8/docs/api/java/lang/NoClassDefFoundError.html), [NoSuchMethodError](https://docs.oracle.com/javase/8/docs/api/java/lang/NoSuchMethodError.html), or other [LinkageError](https://docs.oracle.com/javase/8/docs/api/java/lang/LinkageError.html). Not all libraries strictly follow [semantic versioning](https://semver.org/), and breaking changes sometimes happen within the same major version.

## Diagnose version mismatch issues

The following sections describe methods on how to diagnose version mismatch issues.

### Use the Azure SDK for Java build tool

The Azure SDK for Java build tool, introduced in [Get started with Azure SDK and Apache Maven](get-started-maven.md), helps to identify commonly encountered issues. We recommend that you add this build tool to your project and run it by adding the `azure:run` Maven target to your regular build process. With the appropriate configuration, you can identify and resolve dependency conflicts more proactively, before they become issues at runtime.

### View a dependency tree

Run `mvn dependency:tree` or `gradle dependencies --scan` to show the full dependency tree for your application, with version numbers. `mvn dependency:tree -Dverbose` gives more information, but may be misleading. For more information, see [Apache Maven Dependency Tree](https://maven.apache.org/shared/maven-dependency-tree/) in the Maven documentation. For each library that you suspect has a version conflict, note its version number and determine which components depend on it.

Dependency resolution in development and production environments may work differently. [Apache Spark](https://spark.apache.org/docs/latest/), [Apache Flink](https://ci.apache.org/projects/flink/flink-docs-release-1.13/), [Databricks](https://databricks.com/), and IDE plugins need extra configuration for custom dependencies. They can also bring their own versions of Azure Client libraries or common components. For more information, see the following articles:

- [Bundling Your Application’s Dependencies](https://spark.apache.org/docs/latest/submitting-applications.html#bundling-your-applications-dependencies) for Apache Spark
- [Project Configuration](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/dev/datastream/project-configuration/) for Apache Flink
- [How to correctly update a Maven library in Databricks](https://kb.databricks.com/libraries/maven-library-version-mgmt.html) for Databricks

For more information on conflict resolution in such environments, see the [Create a fat JAR](#create-a-fat-jar) section later in this article.

### Configure Azure Functions

The internal dependency version on Azure Functions (running Java 8 only) takes precedence over a user-provided one. This dependency causes version conflicts, especially with Jackson, Netty, and Reactor.

To solve this problem, set the `FUNCTIONS_WORKER_JAVA_LOAD_APP_LIBS` environment variable to `true` or `1`. Be sure to update the Azure Function Tools (v2 or v3) to the latest version.

> [!NOTE]
> This configuration applies to Azure Functions running Java 8 only, Functions running Java 11 don't need special configuration.

### Configure Apache Spark

The Azure SDK for Java supports multiple versions of Jackson, but issues can sometimes arise depending on your build tooling and its dependency resolution ordering. A good example of this problem is with Apache Spark, version 3.0.0 and later, which depends on Jackson 2.10. While it's compatible with the Azure SDK for Java, developers often discover that a more recent version of Jackson is used instead, which results in incompatibilities. To mitigate this problem, you should pin a specific version of Jackson (one that is compatible with Spark). For more information, see the [Support for multiple Jackson versions](#support-for-multiple-jackson-versions) section in this article.

If you use earlier versions of Spark, or if another library you use requires an even earlier version of Jackson that the Azure SDK for Java doesn't support, continue reading this article for possible mitigation steps.

### Detect Jackson runtime version

In Azure Core 1.21.0, we added runtime detection and better diagnostics of the Jackson runtime version.

If you see `LinkageError` (or any of its subclasses) related to the Jackson API, check the message of the exception for runtime version information. For example: `com.azure.core.implementation.jackson.JacksonVersionMismatchError: com/fasterxml/jackson/databind/cfg/MapperBuilder Package versions: jackson-annotations=2.9.0, jackson-core=2.9.0, jackson-databind=2.9.0, jackson-dataformat-xml=2.9.0, jackson-datatype-jsr310=2.9.0, azure-core=1.19.0-beta.2`

Look for warning and error logs from `JacksonVersion`. For more information, see [Configure logging in the Azure SDK for Java](./logging-overview.md). For example: `[main] ERROR com.azure.core.implementation.jackson.JacksonVersion - Version '2.9.0' of package 'jackson-core' is not supported (too old), please upgrade.`

> [!NOTE]
> Check that all of the Jackson packages have the same version.

For the list of packages used by Azure SDK and the supported Jackson versions, see the [Support for multiple Jackson versions](#support-for-multiple-jackson-versions) section.

## Mitigate version mismatch issues

The following sections describe how to mitigate version mismatch issues.

### Use Azure SDK BOM

Use the latest stable [Azure SDK BOM](https://search.maven.org/artifact/com.azure/azure-sdk-bom) and don't specify Azure SDK and dependency versions in your POM file. When applicable, use the [Azure Spring Boot BOM](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-bom/).

The dependencies listed in the Azure SDK BOM are tested rigorously to avoid dependency conflicts.

### Avoid unnecessary dependencies

Remove dependencies if you can. Sometimes, an application has dependencies on multiple libraries that provide essentially the same functionality. Such unnecessary dependencies expose applications to security vulnerabilities, version conflicts, and support and maintenance costs.

### Update dependency versions

If switching to the latest Azure SDK BOM doesn't help, identify the libraries causing conflicts and the components that use them. (For more information, see the [View a dependency tree](#view-a-dependency-tree) section earlier in this article.) Try updating to a newer version, which protects against security vulnerabilities, and often brings new features, performance improvements, and bug fixes.

Avoid downgrading the Azure SDK version because it may expose your application to known vulnerabilities and issues.

### Shade libraries

Sometimes there's no combination of libraries that work together, and shading comes as the last resort.

> [!NOTE]
> Shading has significant drawbacks: it increases package size and number of classes on the classpath, it makes code navigation and debugging hard, doesn't relocate JNI code, breaks reflection, and may violate code licenses among other things. It should be used only after other options are exhausted.

Shading enables you to include dependencies within a JAR at build time, then rename packages and update application code to use the code in the shaded location. Diamond dependency conflict is no longer an issue because there are two different copies of a dependency. You may shade a library that has a conflicting transitive dependency or a direct application dependency, as described in the following list:

- **Transitive dependency conflict**: For example, third-party library `A` requires Jackson 2.9, which Azure SDKs don't support, and it's not possible to update `A`. Create a new module, which includes `A` and shades (relocates) Jackson 2.9 and, optionally, other dependencies of `A`.
- **Application dependency conflict**: Your application uses Jackson 2.9 directly. While you're working on updating your code, you can shade and relocate Jackson 2.9 into a new module with relocated Jackson classes instead.

> [!NOTE]
> Creating fat JAR with relocated Jackson classes doesn't resolve a version conflict in these examples - it only forces a single shaded version of Jackson.

### Create a fat JAR

Environments like Databricks or Apache Spark have custom dependency management and provide common libraries like Jackson. To avoid conflict with provided libraries, you may want to build a fat JAR that contains all the dependencies. For more information, see [Apache Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin). In many cases, relocating Jackson classes (`com.fasterxml.jackson`) mitigates the issue. Sometimes such environments also bring their own version of Azure SDKs, so you might be compelled to relocate `com.azure` namespace to work around version conflicts.

## Understand compatible dependency versions

For information about `azure-core`-specific dependencies and their versions, see [azure-core](https://search.maven.org/artifact/com.azure/azure-core/) at the Maven Central Repository. The following table shows some general considerations:

| Dependency                      | Supported versions                                                                                                                                                                                                                                                      |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Jackson                         | 2.10.0 and newer minor versions are compatible. For more information, see the [Support for multiple Jackson versions](#support-for-multiple-jackson-versions) section.                                                                                                  |
| SLF4J                           | 1.7.*                                                                                                                                                                                                                                                                   |
| netty-tcnative-boringssl-static | 2.0.*                                                                                                                                                                                                                                                                   |
| netty-common                    | 4.1.*                                                                                                                                                                                                                                                                   |
| reactor-core                    | 3.X.* - Major and minor version numbers must exactly match the ones your `azure-core` version depends on. For more information, see the Project Reactor [policy on deprecations](https://github.com/reactor/.github/blob/main/SUPPORT.adoc#our-policy-on-deprecations). |

### Support for multiple Jackson versions

The Azure SDK for Java supports working with a range of Jackson versions. The lowest-supported version is Jackson 2.10.0. The Azure SDK for Java client libraries adjust their configuration and Jackson usage depending on the version that is detected at runtime. This adjustment enables greater compatibility with older versions of the Spring framework, Apache Spark, and other common environments.
Applications can downgrade Jackson versions (to 2.10.0 or higher) without breaking Azure SDK for Java client libraries.

> [!NOTE]
> Using old versions of Jackson may expose applications to known vulnerabilities and issues. For more information, see the [list of known vulnerabilities for Jackson libraries](https://www.cvedetails.com/product-list/vendor_id-15866/Fasterxml.html).

When pinning a specific version of Jackson, make sure to do it for all modules used by Azure SDK, which are shown in the following list:

- `jackson-annotations`
- `jackson-core`
- `jackson-databind`
- `jackson-dataformat-xml`
- `jackson-datatype-jsr310`

### Migration from Jackson to azure-json

Azure client libraries for Java are in the process of migration to [azure-json](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/serialization/azure-json), which doesn't depend on any 3rd party components, and offers shared primitives, abstractions, and helpers for JSON.

Environments like Apache Spark, Apache Flink, and Databricks might bring older versions of `azure-core` that don't yet depend on `azure-json`. As a result, when using newer versions of Azure libraries in such environments, you might get errors similar to `java.lang.NoClassDefFoundError: com/azure/json/JsonSerializable`. You can mitigate this error by adding an explicit dependency on `azure-json`.

## Next steps

Now that you're familiar with dependency version conflicts and how to troubleshoot them, see [Dependency Management for Java](https://devblogs.microsoft.com/azure-sdk/dependency-management-for-java/) for information on the best way to prevent them.

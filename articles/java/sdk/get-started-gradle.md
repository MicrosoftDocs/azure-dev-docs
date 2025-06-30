---
title: Get started with Azure SDK and Gradle
description: Learn how to build projects using Azure SDK and Gradle.
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
ms.date: 02/14/2025
ms.topic: get-started
ms.custom: devx-track-java, devx-track-extended-java
---

# Get started with Azure SDK and Gradle

This article shows you how to use Gradle to build applications with the Azure SDK for Java. In this article, you set up a new project with Gradle, build projects with Gradle, and use the GraalVM native image tooling to create platform-specific native binaries.

## Prerequisites

* [Java Developer Kit](../fundamentals/java-support-on-azure.md), version 8 or later. We recommend version 17 for the best experience.
* [Gradle](http://gradle.org)

## Create a new Gradle project

Unlike Maven, Gradle doesn't have an archetype system for bootstrapping projects in a template fashion. Bootstrapping a Gradle project is possible, but it doesn't configure Azure SDK for Java specifics like the [Maven equivalent](get-started-maven.md). To work through the steps, first use the following command to create a new, empty directory from the command line:

```bash
gradle init --type java-application
```

You're prompted to answer a short series of questions, after which you have a directory containing a collection of files and subdirectories. To ensure that the generated files compile, run the following commands required to verify the build:

```bash
gradle clean assemble test
```

You can now move on to editing the **build.gradle** file located in the app directory. For starters, to make dependency version management simpler, the Azure SDK for Java team publishes the [Azure SDK for Java client BOM](https://central.sonatype.com/artifact/com.azure/azure-sdk-bom/1.2.10/versions) each month. This BOM file includes all Generally Available (GA) Azure SDK for Java client packages with their compatible dependency version.

To use dependency versions for an Azure SDK for Java client library that is in the BOM, include the following snippet in the project **build.gradle** file. Replace the `{bom_version_to_target}` placeholder with the [latest release of the Azure SDK for Java BOM](https://central.sonatype.com/artifact/com.azure/azure-sdk-bom/1.2.10/versions).

```groovy
dependencies {
    implementation platform('com.azure:azure-sdk-bom:{bom_version_to_target}')
}
```

You can find all releases of the Azure SDK for Java client BOM at [azure-sdk-bom](https://central.sonatype.com/artifact/com.azure/azure-sdk-bom/1.2.10/versions). We recommend using the latest version to take advantage of the newest features of the Azure SDK for Java client libraries.

Once you've started depending on the Azure SDK for Java BOM, you can include dependencies on libraries without specifying their version. These version values are looked up automatically in the Azure SDK for Java BOM. For example, to include an `azure-storage-blob` dependency, add the following lines to your **build.gradle** file:

```groovy
dependencies {
    implementation 'com.azure:azure-storage-blob'
}
```

Using Gradle to define project dependencies can make managing your projects simpler. With the Azure SDK BOM, you can accelerate your project while being more confident about your dependency versioning over the long term. We recommend using the BOM to keep dependencies aligned and up to date.

### Include a package not in the BOM

The Azure SDK for Java client BOM includes only Generally Available (GA) libraries. If you want to depend on a package that is still in beta or on a library version different than the one included in the BOM, you can specify the Maven dependency version along with the `groupId` and `artifactId` in the dependency section. You can choose to have dependencies that use BOM versions and dependencies with overridden versions in the same project POM file, as shown in the following example:

```groovy
dependencies {
    // Use the dependency version that is in the BOM
    implementation 'com.azure:azure-messaging-eventhubs'

    // Override the Service Bus dependency version specified in the BOM
    implementation 'com.azure:azure-messaging-servicebus:7.4.0'
}
```

If you use this approach and specify versions directly in your project, you might get dependency version conflicts. These conflicts arise because different packages may depend on different versions of common dependencies, and these versions may not be compatible with each other. When conflicts occur, you can experience undesirable behavior at compile time or runtime. We recommend that you rely on versions that are in the Azure SDK BOM unless necessary. For more information on dealing with dependencies when using the Azure SDK for Java, see [Troubleshoot dependency version conflicts](/azure/developer/java/sdk/troubleshooting-dependency-version-conflict).

## Build a native image with GraalVM

You can use GraalVM to create a native image of a Java application. GraalVM compiles the Java code ahead of time into native machine code, which can yield drastic performance gains in certain situations. The Azure SDK for Java provides the necessary metadata in each of its client libraries to support GraalVM native image compilation.

To get started, you need to install GraalVM and prepare your development system for compiling native images. The installation process for GraalVM is straightforward, and the GraalVM documentation provides step-by-step instructions for [installing GraalVM](https://www.graalvm.org/latest/docs/getting-started/) and [using GraalVM to install native-image](https://www.graalvm.org/latest/reference-manual/native-image/). Follow the [prerequisites](https://www.graalvm.org/latest/reference-manual/native-image/#prerequisites) section carefully to install the necessary native compilers for your operating system.

With your existing Gradle-based project, you can follow the [GraalVM instructions for Gradle](https://graalvm.github.io/native-build-tools/latest/gradle-plugin.html) on how to add GraalVM support to your project. In doing so, you then have more build options, allowing you to compile your application into the standard Java bytecode, or into a native image compiled by GraalVM.

Next, you're ready to run a native image build. You can use standard Gradle tooling to use GraalVM native image. For Gradle, use the following command:

```bash
gradle nativeCompile
```

After you run this command, GraalVM outputs a native executable for the platform it's running on. The executable appears in the Gradle **/app/build/native/nativeCompile** directory of your project. You can now run your application with this executable file, and it should perform similarly to a standard Java application.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Azure extensions for IntelliJ and Eclipse](get-started-ide.md)

---
title: Get started with Azure SDK and Apache Maven
description: Learn how to build projects using Azure SDK and Apache Maven
ms.author: jogiles
ms.date: 12/10/2021
ms.topic: article
---

# Get started with Azure SDK and Apache Maven

This article shows you how to use Apache Maven to build applications with the Azure SDK for Java. In this article, you'll set up a new project with Maven, build projects with Maven, and use the GraalVM native image tooling to create platform-specific native binaries.

The Azure SDK for Java project includes a Maven archetype that can accelerate the bootstrapping of a new project. The Azure SDK for Java Maven archetype creates a new application, with files and a directory structure that follows best practices. In particular, the Azure SDK for Java Maven archetype creates a new Maven project with the following features:

* A dependency on the latest `azure-sdk-bom` BOM release, which ensures that all Azure SDK for Java dependencies are aligned, and gives you the best developer experience possible.
* Built-in support for GraalVM native image compilation.
* Support for generating a new project with a specified set of Azure SDK for Java client libraries.
* Integration with the Azure SDK for Java build tooling, which will give build-time analysis of your project to ensure that many best practices are followed.

## Prerequisites

* [Java Developer Kit](../fundamentals/java-support-on-azure.md), version 8 or later. We recommend version 17 for the best experience.
* [Apache Maven](http://maven.apache.org)

## Create a new Maven project

The Azure SDK for Java Maven archetype is published to Maven Central. That means you can use the archetype directly to bootstrap a new application with the following command:

```bash
mvn archetype:generate \
    -DarchetypeGroupId=com.azure.tools \
    -DarchetypeArtifactId=azure-sdk-archetype
```

After you enter this command, a series of prompts will ask for details about your project so the archetype can generate the right output for you. The following table describes the properties you'll need to provide values for:

| Name             | Description  |
|------------------|--------------|
| `groupId`        | (Required) The Maven `groupId` to use in the POM file created for the generated project.  |
| `artifactId`     | (Required) The Maven `artifactId` to use in the POM file created for the generated project.  |
| `package`        | (Optional) The package name to put the generated code into. Inferred from the `groupId` if it's not specified. |
| `azureLibraries` | (Optional) A comma-separated list of Azure SDK for Java libraries, using their Maven artifact IDs. For a list of such artifact IDs, see [Azure SDK Releases](https://azure.github.io/azure-sdk/releases/latest/java.html). |
| `enableGraalVM`  | (Optional) *false* to indicate that the generated Maven POM file shouldn't include support for compiling your application to a native image using GraalVM; otherwise, *true*. The default value is *true*. |
| `javaVersion`    | (Optional) The minimum version of the JDK to target when building the generated project, such as *8*, *11*, or *17*. The default value is the latest LTS release (currently *17*). The minimum value is *8*. |
| `junitVersion`   | (Optional) The version of JUnit to include as a dependency. The default value is *5*. Valid values *4* and *5*. |

Alternately, you can provide these values when you call the archetype command shown earlier. This approach is useful, for example, for automation purposes). You can specify the values as parameters using the standard Maven syntax of appending `-D` to the parameter name, for example: <br>`-DjavaVersion=17`.

### Java version support

As a best practice, you should use a Java LTS release when deploying to production. By default, the Azure SDK Maven archetype will select the latest LTS release, which currently sets a Java 17 baseline. However, you can override the default behavior by setting the `javaVersion` parameter.

## Add Azure SDK for Java to an existing project

To make dependency version management simpler, the Azure SDK for Java team publishes the [Azure SDK for Java client BOM](https://repo1.maven.org/maven2/com/azure/azure-sdk-bom/) each month. This BOM file includes all Generally Available (GA) Azure SDK for Java client packages with their compatible dependency version.

To use dependency versions for an Azure SDK for Java client library that is in the BOM, include the following snippet in the project *pom.xml* file. Replace the *`{bom_version_to_target}`* placeholder with the BOM version number you want to target. Replace the *`{artifactId}`* placeholder with the Azure service SDK package name.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-sdk-bom</artifactId>
      <version>{bom_version_to_target}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>{artifactId}</artifactId>
  </dependency>
</dependencies>
```

You can find all releases of the Azure SDK for Java client BOM at [azure-sdk-bom](https://repo1.maven.org/maven2/com/azure/azure-sdk-bom/). We recommend using the latest version to take advantage of the newest features of the Azure SDK for Java client libraries.

Using Maven to define project dependencies can make managing your projects simpler. With the Azure SDK BOM and Azure SDK Maven archetype, you can accelerate your project while being more confident about your dependency versioning over the long term. We recommend using the BOM to keep dependencies aligned and up to date.

### Include a package not in the BOM

The Azure SDK for Java client BOM includes only Generally Available (GA) libraries. If you want to depend on a package that is still in beta or on a library version different than the one included in the BOM, you can specify the Maven dependency version along with the `groupId` and `artifactId` in the dependency section. You can choose to have dependencies that use BOM versions and dependencies with overridden versions in the same project POM file, as shown in the following example:

```xml
<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-eventhubs</artifactId> <!-- Use the dependency version that is in the BOM -->
  </dependency>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-servicebus</artifactId>
    <version>7.4.0</version> <!-- Override the Service Bus dependency version specified in the BOM -->
  </dependency>
</dependencies>
```

If you use the above approach and specify versions directly in your project, you might get dependency version conflicts. These conflicts arise because different packages may depend on different versions of common dependencies, and these versions may not be compatible with each other. When conflicts occur, you can experience undesirable behavior at compile time or runtime. That's why we recommended that you rely on versions that are in Azure SDK BOM unless strictly necessary.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Azure extensions for IntelliJ and Eclipse](get-started-ide.md)

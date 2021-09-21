---
title: Troubleshoot dependency version conflict when using the Azure SDK for Java
description: An overview of how to troubleshoot dependency version conflicts related to using the Azure SDK for Java
ms.date: 09/17/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: lmolkova
---

# Troubleshooting Dependency Version Conflicts

Azure client libraries for Java depend on several popular third-party libraries: [Jackson](https://github.com/FasterXML/jackson), [Netty](https://netty.io/), [Reactor](https://projectreactor.io/), and [SLF4J](http://www.slf4j.org/).

Many Java applications and frameworks use these libraries directly or transitively, which leads to [version conflicts](https://en.wikipedia.org/wiki/Dependency_hell). Dependency managers such as [Maven](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html) and [Gradle](https://docs.gradle.org/current/userguide/dependency_resolution.html) resolve all dependencies so that there's only a single version of each dependency on the classpath. It's not guaranteed that the resolved dependency version is compatible with all consumers of that dependency in your application.

API incompatibility of direct dependency results in compilation errors. Diamond dependency incompatibility usually results in runtime failures such as [NoClassDefFoundError](https://docs.oracle.com/javase/8/docs/api/java/lang/NoClassDefFoundError.html), [NoSuchMethodError](https://docs.oracle.com/javase/8/docs/api/java/lang/NoSuchMethodError.html), or other [LinkageError](https://docs.oracle.com/javase/8/docs/api/java/lang/LinkageError.html). Not all libraries strictly follow [Semantic Versioning](https://semver.org/) and breaking changes sometimes happen within the same major version.

## Troubleshooting

### Diagnosing version mismatch issues

#### Dependency tree

Run `mvn dependency:tree` or `gradle dependencies — scan` to show full dependency tree with versions. (Note: `mvn dependency:tree -Dverbose` gives more information, but [may be misleading](https://maven.apache.org/shared/maven-dependency-tree/)). Notice versions of library you suspect has version conflict and check which components depend on it.

Dependency resolution in development and production environments may work differently. Here are some environments that may need extra configuration for custom dependencies:

- [Apache Spark](https://spark.apache.org/docs/latest/submitting-applications.html#bundling-your-applications-dependencies)
- [Apache Flink](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/dev/datastream/project-configuration/)
- [Databricks](https://kb.databricks.com/libraries/maven-library-version-mgmt.html)
- IDE plugins

#### Azure Functions (Java 8) configuration

Internal dependency version on Azure Functions (running Java 8 only) takes precedence over user-provided one - it causes version conflicts especially with Jackson, Netty, and Reactor.

**Solution**: set `FUNCTIONS_WORKER_JAVA_LOAD_APP_LIBS` environment variable to `true` or `1`. Make sure to update Azure Function Tools (v2 or v3) to latest version.

#### Jackson runtime version detection

In Azure Core 1.21.0, we added runtime detection and better diagnostics of Jackson version.

- If you see `LinkageError` (or any of its subclasses) related to Jackson API, check message of the exception for runtime version information.</br>Example: `com.azure.core.implementation.jackson.JacksonVersionMismatchError: com/fasterxml/jackson/databind/cfg/MapperBuilder Package versions: jackson-annotations=2.9.0, jackson-core=2.9.0, jackson-databind=2.9.0, jackson-dataformat-xml=2.9.0, jackson-datatype-jsr310=2.9.0, azure-core=1.19.0-beta.2`

- Look for warning/error [logs](https://docs.microsoft.com/azure/developer/java/sdk/logging-overview) from `JacksonVersion`.</br>Example: `[main] ERROR com.azure.core.implementation.jackson.JacksonVersion - Version '2.9.0' of package 'jackson-core' is not supported (too old), please upgrade.`

### Mitigation

#### Use Azure SDK BOM

Use latest stable [Azure SDK BOM](https://search.maven.org/artifact/com.azure/azure-sdk-bom) and don't specify Azure SDK and dependency versions in your POM file. When applicable, use [Azure Spring Boot BOM](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-bom/).
Dependencies listed in the Azure SDK BOM are rigorously to avoid dependency conflicts.

#### Avoid unnecessary dependencies

Remove dependencies if you can - sometimes we find ourselves with dependencies on multiple libraries that provide essentially the same functionality. Such unnecessary dependencies expose applications to security vulnerabilities, version conflicts, support and maintenance costs.

#### Update dependency versions

If switching to the latest Azure SDK BOM does't help, identify libraries causing conflict (see [Dependency tree](#dependency-tree)) and what uses them. Try updating versions - it is good practice to keep dependencies up to date as it protects against security vulnerabilities, and often brings new features, performance improvements, and bug fixes.

Avoid downgrading Azure SDK version as it may expose your application to known vulnerabilities and issues.

#### Shade

Sometimes there's no combination of libraries that work together and shading comes as the last resort. Shading allows including dependencies within JAR at build time, renaming packages, and updating application code to use the code in the shaded location. Diamond dependency conflict is no longer an issue as we now have two different copies of dependency.

You may shade library that has conflicting transitive dependency or a direct application dependency:

1. **Transitive dependency conflict**: for example, third-party library `A` requires Jackson 2.9, which is not supported by Azure SDKs, and it's not possible to update `A`. Create a new JAR, which includes `A` and shades Jackson 2.9 (and optimally other dependencies of `A`).
2. **Application dependency conflict**: your application uses Jackson 2.9 directly and while you're working on updating you code, you can shade Jackson 2.9. Check out the example below.

**Note**: shading Jackson into application JAR doesn't resolve version conflict - it only forces single shaded version of Jackson.

Example of shading Jackson libraries under a new JAR with Maven:

- Use [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/).
- Create a new package that wraps Jackson libraries
- Configure shading plugin:

```xml
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-shade-plugin</artifactId>
<version>${maven-shade-plugin-version}</version>
<executions>
    <execution>
        <phase>package</phase>
        <goals>
            <goal>shade</goal>
        </goals>
        <configuration>
            <!--Create shaded JAR only-->
            <shadedArtifactAttached>false</shadedArtifactAttached>
            <!--Remove original replaced dependencies-->
            <createDependencyReducedPom>true</createDependencyReducedPom>
            <!--Promotes transitive dependencies of removed dependencies to direct-->
            <promoteTransitiveDependencies>true</promoteTransitiveDependencies>
            <artifactSet>
                <includes>
                    <include>com.fasterxml.jackson:*</include>
                    <include>com.fasterxml.jackson.*:*</include>
                </includes>
            </artifactSet>
            <relocations>
                <relocation>
                    <pattern>com.fasterxml.jackson</pattern>
                    <shadedPattern>org.example.shaded.com.fasterxml.jackson</shadedPattern>
                    <includes>
                        <include>com.fasterxml.jackson.**</include>
                    </includes>
                </relocation>
            </relocations>
        </configuration>
    </execution>
</executions>
</plugin>
```

- Run `mvn package` to create a Jackson wrapper JAR file: it doesn't depend on original Jackson libraries anymore, instead it includes renamed Jackson packages and classes. Make sure to update namespaces in your application code to `org.example.shaded.com.fasterxml.jackson.*` (or other prefix of your choice).

## Compatible dependency versions

Refer to [Maven](https://search.maven.org/artifact/com.azure/azure-core/) for details on `azure-core` specific dependencies and their versions. Here are some general considerations:

| Dependency | Supported versions |
| ---------- | ------------------ |
| Jackson    | 2.10.0 or newer minor versions are compatible. |
| SLF4J      | 1.7.* |
| netty-tcnative-boringssl-static | 2.0.* |
| netty-common | 4.1.* |
| reactor-core | 3.X.\*, *Major, and minor* versions have to match exactly ones your `azure-core` version depends upon - refer to [Project Reactor breaking change policy](https://github.com/reactor/.github/blob/main/SUPPORT.adoc#our-policy-on-deprecations) |

## Next steps

Now that you're familiar with dependency version conflicts and how to troubleshoot them, read more on [Azure SDK BOM](https://devblogs.microsoft.com/azure-sdk/dependency-management-for-java/) as the best way to prevent them.

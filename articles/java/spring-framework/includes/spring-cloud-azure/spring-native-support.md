---
ms.date: 06/30/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## Spring Native support

Spring Native provides support for compiling Spring Boot applications to native executables using the [GraalVM][graalvm] [native-image][graalvm-native-docs] compiler. The native images will bring many advantages, such as instant startup, instant peak performance, and reduced memory consumption. Some Spring Cloud Azure features can also benefit from the Spring Native support. The goal is that Spring Cloud Azure applications can be built as native images without any code modification. For more information, see the [Spring Native documentation][spring-native-overview].

### Support

Spring Cloud Azure has been validated against GraalVM and Spring Native, and provides the beta version support. You can try it on your projects if they are using those supported dependencies, and [raise bugs][azure-sdk-java-issues] or [contribute pull requests][spring-cloud-azure-native-configuration] if something goes wrong on Spring Cloud Azure. For more information, see the [Support][spring-native-support] section in the Spring Native documentation.

#### Spring Native

Spring Cloud Azure `4.1.0-beta.1` has been tested against Spring Native `0.11.4` and GraalVM `22.0.0`.

#### Spring Cloud Azure Native

> [!NOTE]
> Spring Native `0.11.4` has been tested against Spring Cloud Azure Native Configuration `4.0.0-beta.1`.

Spring Cloud Azure provides a dependency `spring-cloud-azure-native-configuration` that is an extension of Spring Native configuration for Spring Cloud Azure libraries. The Spring Native AOT plugin will combine the `spring-native-configuration` and `spring-cloud-azure-native-configuration` to build applications into native executables. You don't need any extra modifications to the code that uses Spring Cloud Azure libraries apart from adding the dependency, which only applies to the code in the Spring Cloud Azure libraries.

The following features are supported:

* Azure App Configuration clients auto-configuration
* Azure Event Hubs clients auto-configuration
* Azure Key Vault Certificates clients auto-configuration
* Azure Key Vault Secrets clients auto-configuration
* Azure Storage Blob clients auto-configuration
* Azure Storage File Share clients auto-configuration
* Azure Storage Queue clients auto-configuration
* Spring Integration for Azure Event Hubs
* Spring Integration for Azure Storage Queue

#### Limitations

The Spring Cloud Azure support for Spring Native is still in the early stages and continues to be updated. The following features are not yet supported:

* Azure Cosmos clients auto-configuration
* Azure Service Bus clients auto-configuration
* Spring Data for Azure Cache for Redis
* Spring Data for Azure Cosmos
* Spring Cloud Stream for Azure Event Hubs
* Spring Cloud Stream for Azure Service Bus
* Spring Kafka for Azure Event Hubs
* Spring Integration for Azure Service Bus

> [!NOTE]
> Not all the native image options are supported by Spring Native. For more information, see the [Native image options][spring-native-image-options] section of the Spring Native documentation.

> [!WARNING]
> Spring Cloud Azure `4.1.0-beta.1` is not validated for building native executables based on Gradle Kotlin.

### Project setup

Spring Cloud Azure applications can enable Spring Native support by following the instructions in the [Getting started][spring-native-getting-started] section of the Spring Native documentation. The only additional processing required is to add the following dependency to the POM file.

> [!TIP]
> The dependency `com.azure.spring:spring-cloud-azure-native-configuration` is not managed in `com.azure.spring:spring-cloud-azure-dependencies`.

#### [Maven](#tab/maven)

```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-native-configuration</artifactId>
  <version>4.0.0-beta.1</version>
</dependency>
```

#### [Gradle](#tab/gradle)

```groovy
dependencies {
    implementation "com.azure.spring:spring-cloud-azure-native-configuration:4.0.0-beta.1"
}
```

---

### Build the native application

The following sections describe the two main ways to build a Spring Boot native application with Spring Cloud Azure libraries.

#### Build with Buildpacks

The native application can be built as follows:

##### [Maven](#tab/maven)

```shell
mvn spring-boot:build-image
```

##### [Gradle](#tab/gradle)

```shell
gradle bootBuildImage
```

---

For more information, see the [Getting started with Buildpacks][spring-native-getting-started-buildpacks] section in the Spring Native documentation.

#### Build with Native Build Tools

You can build the native application by using the following command:

##### [Maven](#tab/maven)

```shell
mvn -Pnative -DskipTests package
```

##### [Gradle](#tab/gradle)

```shell
gradle nativeCompile
```

---

For more information, see the [Getting started with Native Build Tools][spring-native-getting-started-native-build-tools] section of the Spring Native documentation.

### Run the native application

The following sections describe the two main ways to run a native executable.

> [!TIP]
> Assuming the project artifact ID is `spring-cloud-azure-sample` and the project version is `0.0.1-SNAPSHOT`, you can specify the custom image name in one of the following ways:
>
> * If you're using [Cloud Native Buildpacks][spring-boot-container-images.buildpacks], use the `image`->`name`->`custom-image-name` configuration element in the Spring Boot plugin.
> * If you're using [GraalVM Native Build Tools][graalvm-native-buildtools], use the `imageName`->`custom-image-name` configuration element in the Spring Boot plugin.

#### Run with Buildpacks

To run the application, you can use `docker` the usual way as shown in the following example:

```shell
docker run --rm -p 8080:8080 spring-cloud-azure-sample:0.0.1-SNAPSHOT
```

#### Run with Native Build Tools

To run your application, use the following command:

##### [Maven](#tab/maven)

```cmd
target\spring-cloud-azure-sample
```

##### [Gradle](#tab/gradle)

```cmd
build\native\nativeCompile\spring-cloud-azure-sample
```

---

### Samples

For more information, see [Using Spring Native with Spring Cloud Azure Storage Blob Starter][azure-spring-sample-storage-blob-native] on GitHub.

Here are other verified samples that support Spring Native. For more information, see [Run Samples Based On Spring Native][azure-spring-samples] on GitHub.

> [!div class="mx-tdBreakAll"]
> | Library Artifact ID                                     | Supported Example Projects                                                                                      |
> |---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
> | spring-cloud-azure-starter-appconfiguration             | [appconfiguration-client][appconfiguration-client]                                                              |
> | spring-cloud-azure-starter-eventhubs                    | [eventhubs-client][eventhubs-client]                                                                            |
> | spring-cloud-azure-starter-integration-eventhubs        | [storage-queue-integration][storage-queue-integration], [storage-queue-operation][storage-queue-operation]      |
> | spring-cloud-azure-starter-integration-storage-queue    | [appconfiguration-client][appconfiguration-client]                                                              |
> | spring-cloud-azure-starter-keyvault-secrets             | [property-source][property-source], [secret-client][secret-client]                                              |
> | spring-cloud-azure-starter-storage-blob                 | [storage-blob-sample][storage-blob-sample]                                                                      |
> | spring-cloud-azure-starter-storage-file-share           | [storage-file-sample][storage-file-sample]                                                                      |
> | spring-cloud-azure-starter-storage-queue                | [storage-queue-client][storage-queue-client]                                                                    |

<!-- URL links -->
[graalvm]: https://www.graalvm.org/
[graalvm-docs]: https://www.graalvm.org/reference-manual
[graalvm-native-docs]: https://www.graalvm.org/reference-manual/native-image
[graalvm-native-buildtools]: https://github.com/graalvm/native-build-tools
[spring-cloud-azure-native-configuration]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring-experimental/spring-cloud-azure-native-configuration
[azure-sdk-java-issues]: https://github.com/Azure/azure-sdk-for-java/issues
[spring-native-overview]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#overview
[spring-native-support]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#support
[spring-native-image-options]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#native-image-options
[spring-native-getting-started]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#getting-started
[spring-native-getting-started-buildpacks]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#getting-started-buildpacks
[spring-native-getting-started-native-build-tools]: https://docs.spring.io/spring-native/docs/0.11.4/reference/htmlsingle/#getting-started-native-build-tools
[spring-boot-container-images.buildpacks]: https://docs.spring.io/spring-boot/docs/2.6.6/reference/html/container-images.html#container-images.buildpacks
[azure-spring-samples]: https://github.com/Azure-Samples/azure-spring-boot-samples#run-samples-based-on-spring-native
[azure-spring-sample-storage-blob-native]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/spring-native/storage-blob-native
[appconfiguration-client]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-starter-appconfiguration/appconfiguration-client
[eventhubs-client]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-cloud-azure-starter-eventhubs/eventhubs-client
[storage-queue-integration]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-integration-storage-queue/storage-queue-integration
[storage-queue-operation]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-integration-storage-queue/storage-queue-operation
[appconfiguration-client]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-starter-appconfiguration/appconfiguration-client
[property-source]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/spring-cloud-azure-starter-keyvault-secrets/property-source
[secret-client]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/spring-cloud-azure-starter-keyvault-secrets/secret-client
[storage-blob-sample]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-storage-blob/storage-blob-sample
[storage-file-sample]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-storage-file-share/storage-file-sample
[storage-queue-client]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-storage-queue/storage-queue-client

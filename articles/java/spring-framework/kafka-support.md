---
title: Spring Cloud Azure Kafka support
description: This article describes how Spring Cloud Azure and Kafka can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure Kafka support

**This article applies to:** ✅ Version 4.20.0 ✅ Version 5.22.0

From version 4.3.0, Spring Cloud Azure for Kafka supports various types of credentials to authenticate and connect to Azure Event Hubs.

## Supported Kafka version

The current version of the starter should be compatible with Apache Kafka Clients 2.0.0 using Java 8 or higher.

## Supported authentication types

The following authentication types are supported:

- Plain connection string authentication
  - Direct connection string authentication
  - ARM-based connection string authentication
- OAuth credential authentication
  - Managed identity authentication
  - Username/password authentication
  - Service principal authentication
  - `DefaultAzureCredential` authentication

## How it works

### OAuth credential authentication

This section describes the overall workflow of Spring Cloud Azure OAuth authentication.

Spring Cloud Azure will first build one of the following types of credentials depending on the application authentication configuration:

- `ClientSecretCredential`
- `ClientCertificateCredential`
- `UsernamePasswordCredential`
- `ManagedIdentityCredential`

If none of these types of credentials are found, the credential chain via `DefaultAzureTokenCredential` will be used to obtain credentials from application properties, environment variables, managed identity, or IDEs. For detailed information, see [Spring Cloud Azure authentication](authentication.md).

### Plain connection string authentication

For the connection string authentication mode, you can use connection string authentication directly or use the Azure Resource Manager to retrieve the connection string. For more information about the usage, see the [Basic usage for connection string authentication](#basic-usage-connection-string) section.

> [!NOTE]
> Since version of 4.3.0, connection string authentication is deprecated in favor of OAuth authentications.

## Configuration

### Configurable properties when using Kafka support with OAuth authentication

Spring Cloud Azure for Kafka supports the following two levels of configuration options:

1. Spring Cloud Azure for Event Hubs Kafka properties.
1. The global authentication configuration options of `credential` and `profile` with prefixes of `spring.cloud.azure`.
1. Kafka-specific level configurations. The Kafka-level configurations are also available for Spring Boot and Spring Cloud Stream binders for `common`, `consumer`, `producer`, or `admin` scopes, which have different prefixes.

The global properties are exposed via `com.azure.spring.cloud.autoconfigure.context.AzureGlobalProperties`. The Kafka-specific properties are exposed via `org.springframework.boot.autoconfigure.kafka.KafkaProperties` (Spring Boot) and `org.springframework.cloud.stream.binder.kafka.properties.KafkaBinderConfigurationProperties` (Spring Cloud Stream binder).

The following list shows all supported configuration options.

- Spring Cloud Azure for Event Hubs Kafka properties.

  - Property: `spring.cloud.azure.eventhubs.kafka.enabled`
  - Description: whether to enable credential free connection to Azure Event Hubs for Kafka, the default value is `true`.

- The Spring Cloud Azure global authentication configuration options

  - Prefix: `spring.cloud.azure`
  - Supported options: `spring.cloud.azure.credential.*`, `spring.cloud.azure.profile.*`

  For the full list of global configuration options, see [Global configuration properties](configuration-properties-global.md).

- Spring Boot Kafka common configuration

  - Prefix: `spring.kafka.properties.azure`
  - Example: `spring.kafka.properties.azure`.credential.*

- Spring Kafka consumer configuration options

  - Prefix: `spring.kafka.consumer.properties.azure`
  - Example: `spring.kafka.consumer.properties.azure`.credential.*

- Spring Kafka producer configuration options

  - Prefix: `spring.kafka.producer.properties.azure`
  - Example: `spring.kafka.producer.properties.azure`.credential.*

- Spring Kafka admin configuration options

  - Prefix: `spring.kafka.admin.properties.azure`
  - Example: `spring.kafka.admin.properties.azure`.credential.*

- Spring Cloud Stream Kafka Binder common configuration

  - Prefix: `spring.cloud.stream.kafka.binder.configuration.azure`
  - Example: `spring.cloud.stream.kafka.binder.configuration.azure`.credential.*

- Spring Cloud Stream Kafka Binder consumer configuration

  - Prefix: `spring.cloud.stream.kafka.binder.consumer-properties.azure`
  - Example: `spring.cloud.stream.kafka.binder.consumer-properties.azure`.credential.*

- Spring Cloud Stream Kafka Binder producer configuration

  - Prefix: `spring.cloud.stream.kafka.binder.producer-properties.azure`
  - Example: `spring.cloud.stream.kafka.binder.producer-properties.azure`.credential.*

- Spring Cloud Stream Kafka Binder admin configuration

  - Prefix: Not supported, should use Spring Boot Kafka common or admin configuration.

The following table shows the Spring Boot Kafka common configuration options:

> [!div class="mx-tdBreakAll"]
> | Name                                                                                                         | Description                                                                                                                                                                                            |
> |--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | spring.kafka.properties.azure.credential.client-certificate-password                                         | Password of the certificate file.                                                                                                                                                                      |
> | spring.kafka.properties.azure.credential.client-certificate-path                                             | Path of a PEM certificate file to use when performing service principal authentication with Azure.                                                                                                     |
> | spring.kafka.properties.azure.credential.client-id                                                           | Client ID to use when performing service principal authentication with Azure. This is a legacy property.                                                                                               |
> | spring.kafka.properties.azure.credential.client-secret                                                       | Client secret to use when performing service principal authentication with Azure. This is a legacy property.                                                                                           |
> | spring.kafka.properties.azure.credential.managed-identity-enabled                                            | Whether to enable managed identity to authenticate with Azure. If `true` and the `client-id` is set, will use the client ID as user assigned managed identity client ID. The default value is `false`. |
> | spring.kafka.properties.azure.credential.password                                                            | Password to use when performing username/password authentication with Azure.                                                                                                                           |
> | spring.kafka.properties.azure.credential.username                                                            | Username to use when performing username/password authentication with Azure.                                                                                                                           |
> | spring.kafka.properties.azure.profile.environment.active-directory-endpoint                                  | The Microsoft Entra endpoint to connect to.                                                                                                                                                     |
> | spring.kafka.properties.azure.profile.tenant-id                                                              | Tenant ID for Azure resources. The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID.                                                                                                                                              |

> [!NOTE]
> The configuration options in different levels apply the following rules. The more specific configuration options have higher priority than the common ones. For example:
>
> - Spring Kafka common configuration options supersede the global options.
> - Spring Kafka consumer configuration options supersede the common options.
> - Spring Kafka producer configuration options supersede the common options.
> - Spring Kafka admin configuration options supersede the common options.
> - The Spring Cloud Stream Kafka Binder options are just like the above.

### Configurable properties when using Kafka support with plain connection string authentication

The following table shows the Spring Boot Event Hubs for Kafka common configuration options:

> [!div class="mx-tdBreakAll"]
> | Property                                                 | Description                                                                                                                                               |
> |----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.eventhubs**.kafka.enabled           | Whether to enable the Azure Event Hubs Kafka support. The default value is `true`.                                                                        |
> | **spring.cloud.azure.eventhubs**.connection-string       | Azure Event Hubs connection string. Provide this value when you want to provide the connection string directly.                                           |
> | **spring.cloud.azure.eventhubs**.namespace               | Azure Event Hubs namespace. Provide this value when you want to retrieve the connection information through Azure Resource Manager.                       |
> | **spring.cloud.azure.eventhubs**.resource.resource-group | The resource group of Azure Event Hubs namespace. Provide this value when you want to retrieve the connection information through Azure Resource Manager. |
> | **spring.cloud.azure**.profile.subscription-id           | The subscription ID. Provide this value when you want to retrieve the connection information through Azure Resource Manager.                              |

## Dependency setup

Add the following dependency to your project. This will automatically include the `spring-boot-starter` dependency in your project transitively.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

> [!NOTE]
> Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For details, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

## Basic usage

The following sections show the classic Spring Boot application usage scenarios.

### Use OAuth authentication

When you use the OAuth authentication provided by Spring Cloud Azure for Kafka, you can configure the specific credentials using the above configurations. Alternatively, you can choose to configure nothing about credentials, in which case Spring Cloud Azure will load the credentials from the environment. This section describes the usages that load the credentials from the Azure CLI environment or the Azure Spring Apps hosting environment.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see the [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id) section to make sure the security principal has been granted the sufficient permission to access the Azure resource.

The following section describes the scenarios using different Spring ecosystem libraries with OAuth authentication.

#### Spring Kafka application support

This section describes the usage scenario for Spring Boot application using Spring Kafka or Spring Integration Kafka library.

##### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
<!-- Using Spring Kafka library only-->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <version>{version}</version><!--Need to be set, for example:2.8.6-->
</dependency>
<!-- Using Spring Integration library only -->
<dependency>
    <groupId>org.springframework.integration</groupId>
    <artifactId>spring-integration-kafka</artifactId>
    <version>{version}</version><!--Need to be set, for example:5.5.12-->
</dependency>
```

<a name="spring-kafka-configuration-setup"></a>
##### Configuration update

To use the OAuth authentication, just specify the Event Hubs endpoint, as shown in the following example:

```properties
spring.kafka.bootstrap-servers=<NAMESPACENAME>.servicebus.windows.net:9093
```

#### Spring Cloud Stream binder Kafka application support

This section describes the usage scenario for Spring Boot applications using the Spring Cloud Stream binder Kafka library.

##### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-kafka</artifactId>
    <version>{version}</version><!--Need to be set, for example:3.2.3-->
</dependency>
```

##### Configuration

To use the OAuth authentication, just specify the Event Hubs endpoint as shown in the following example:

```properties
spring.cloud.stream.kafka.binder.brokers=<NAMESPACENAME>.servicebus.windows.net:9093
```

> [!NOTE]
> If you're using version `4.3.0`, don't forget to set the `spring.cloud.stream.binders.<kafka-binder-name>.environment.spring.main.sources=com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration` property to enable the whole OAuth authentication workflow, where `kafka-binder-name` is `kafka` by default in a single Kafka binder application. The configuration `AzureKafkaSpringCloudStreamConfiguration` specifies the OAuth security parameters for `KafkaBinderConfigurationProperties`, which is used in `KafkaOAuth2AuthenticateCallbackHandler` to enable Azure Identity.
>
> For version after `4.4.0`, this property will be added automatically for each Kafka binder environment, so there's no need for you to add it manually.

#### Use managed identity for OAuth authentication

1. To use the managed identity, you need enable the managed identity for your service and assign the `Azure Event Hubs Data Receiver` and `Azure Event Hubs Data Sender` roles. For more information, see [Assign Azure roles for access rights](/azure/event-hubs/authorize-access-azure-active-directory#assign-azure-roles-for-access-rights).

1. Configure the following properties in your **application.yml** file:

   ```yaml
   spring:
     cloud:
       azure:
         credential:
           managed-identity-enabled: true
   ```

   > [!IMPORTANT]
   > If you're using user-assigned managed identity, you also need to add the property `spring.cloud.azure.credential.client-id` with your user-assigned managed identity client ID.

##### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-cloud-azure-starter/spring-cloud-azure-sample-eventhubs-kafka) repository on GitHub.

<a name="basic-usage-connection-string"></a>
### Use connection string authentication

You can use connection string authentication directly or use the Azure Resource Manager to retrieve the connection string.

###### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

> [!NOTE]
> Since version of 5.0.0, when using connection string authentication with Spring Cloud Stream framework, the following property is still required to ensure that the connection string can take effect, where the value of `<kafka-binder-name>` should be `kafka` when there is no customized configuration for your Kafka binder name: `spring.cloud.stream.binders.<kafka-binder-name>.environment.spring.main.sources=com.azure.spring.cloud.autoconfigure.implementation.eventhubs.kafka.AzureEventHubsKafkaAutoConfiguration`
>
> If the version of `spring-cloud-dependencies` you used is `2022.0.0`, you'll encounter exception the `java.lang.IllegalStateException: kafka_context has not been refreshed yet`. To solve this problem, upgrade to a higher version.

###### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

> [!NOTE]
> Since version of 4.3.0, connection string authentication is deprecated in favor of OAuth authentications.
>
> Since version of 4.5.0, when using connection string authentication with Spring Cloud Stream framework, the following property is required to ensure that the connection string can take effect, where the value of `<kafka-binder-name>` should be `kafka` when there is no customized configuration for your Kafka binder name: `spring.cloud.stream.binders.<kafka-binder-name>.environment.spring.main.sources=com.azure.spring.cloud.autoconfigure.eventhubs.kafka.AzureEventHubsKafkaAutoConfiguration`

---

#### Dependency setup

Add the following dependencies if you want to migrate your Apache Kafka application to use Azure Event Hubs for Kafka.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

If you want to retrieve the connection string using Azure Resource Manager, add the following dependency:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-resourcemanager</artifactId>
</dependency>
```

#### Configuration

##### Use Event Hubs connection string directly

The simplest way to connect to Event Hubs for Kafka is with the connection string. Just add the following property.

```properties
spring.cloud.azure.eventhubs.connection-string=${AZURE_EVENTHUBS_CONNECTION_STRING}
```

##### Use Azure Resource Manager to retrieve connection string

If you don't want to configure the connection string in your application, you can use Azure Resource Manager to retrieve the connection string. To authenticate with Azure Resource Manager, you can also use credentials stored in Azure CLI or another local development tool such as Visual Studio Code or Intellij IDEA. Alternately, you can use Managed Identity if your application is deployed to Azure Cloud. Just be sure the principal has sufficient permission to read resource metadata.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see the [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id) section to be sure the security principal has been granted the sufficient permission to access the Azure resource.

To use Azure Resource Manager to retrieve the connection string, just add the following property.

```yaml
spring:
  cloud:
    azure:
      profile:
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      eventhubs:
        namespace: ${AZURE_EVENTHUBS_NAMESPACE}
        resource:
          resource-group: ${AZURE_EVENTHUBS_RESOURCE_GROUP}
```

## Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repository on GitHub.

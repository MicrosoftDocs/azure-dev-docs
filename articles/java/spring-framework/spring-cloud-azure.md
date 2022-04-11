---
title: Spring Cloud Azure 4.0 reference documentation
description: Spring Cloud Azure reference documentation
ms.date: 03/16/2022
ms.topic: article
ms.author: seal
ms.custom: devx-track-java
---

# Spring Cloud Azure 4.0 reference documentation

This article provides reference documentation for Spring Cloud Azure 4.0.

## Get help

If you have any questions about this documentation, create a GitHub issue in one of the following GitHub repositories. Pull requests are also welcome.

| GitHub repositories                                                                          | Description                              |
|----------------------------------------------------------------------------------------------|------------------------------------------|
| [Azure/azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring) | This repository holds the source code.   |
| [MicrosoftDocs/azure-dev-docs](https://github.com/MicrosoftDocs/azure-dev-docs)              | This repository holds the documentation. |

## What's new in 4.0 since 3.10.x

This documentation covers changes made in 4.0 since 3.10. This major release brings better security, leaner dependencies, support for production readiness, and more.

> [!TIP]
> For more information on migrating to 4.0, see [Migration guide for 4.0](spring-cloud-azure-appendix.md#migration-guide-for-40).

The following list summarizes some of the changes that Spring Cloud Azure 4.0 provides:

* A unified development experience, with unified project name, artifact ID, and properties.
* Simplified dependency management using a single `spring-cloud-azure-dependencies` BOM.
* Expanded Azure support on [Spring Initializr](https://start.spring.io) to cover Kafka, Event Hubs, Azure Cache for Redis, and Azure App Configuration.
* Rearchitected Spring module dependencies to remove excess layers and entanglement.
* Managed Identity support for Azure App Configuration, Event Hubs, Service Bus, Cosmos DB, Key Vault, Storage Blob, and Storage Queue.
* Continued support for authentication methods in the underlying Azure SDK from our Spring libraries, such as SAS token and token credential authentication with Service Bus and Event Hubs.
* [Credential chain](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#defaultazurecredential) is now enabled by default, enabling applications to obtain credentials from application properties, environment variables, managed identity, IDEs, and so on.
* Granular access control at the resource level (such as Service Bus queue) to enable better security governance and adherence to IT policies.
* More options exposed in a Spring-idiomatic way through significantly improved auto-configuration coverage of Azure SDK clients for both synchronous and asynchronous scenarios.
* Added health indicators for Azure App Configuration, Event Hubs, Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File.
* Spring Cloud Sleuth support for all HTTP-based Azure SDKs.

## Migration guide

For more information on migrating to 4.0, see [Migration guide for 4.0](spring-cloud-azure-appendix.md#migration-guide-for-40).

## Getting started

### Setting up dependencies

#### Bill of material (BOM)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>${spring.cloud.azure.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

The version for spring-cloud-azure-dependencies is 4.0.0.

#### Starter dependencies

Spring Cloud Azure Starters are a set of convenient dependency descriptors to include in your application. Each starter contains all the dependencies and transitive dependencies needed to begin using their corresponding Spring Cloud Azure module. These starters boost your Spring Boot application development with Azure services.

For example, if you want to get started using Spring and Azure Cosmos DB for data persistence, include the `spring-cloud-azure-starter-cosmos` dependency in your project.

The following table lists application starters provided by Spring Cloud Azure under the `com.azure.spring` group:

> [!div class="mx-tdBreakAll"]
> | Name                                            | Description                                                                             |
> |-------------------------------------------------|-----------------------------------------------------------------------------------------|
> | spring-cloud-azure-starter                      | The core starter, including auto-configuration support.                                 |
> | spring-cloud-azure-starter-active-directory     | The starter for using Azure Active Directory with Spring Security.                      |
> | spring-cloud-azure-starter-active-directory-b2c | The starter for using Azure Active Directory B2C with Spring Security.                  |
> | spring-cloud-azure-starter-appconfiguration     | The starter for using Azure App Configuration.                                          |
> | spring-cloud-azure-starter-cosmos               | The starter for using Azure Cosmos DB.                                                  |
> | spring-cloud-azure-starter-eventhubs            | The starter for using Azure Event Hubs.                                                 |
> | spring-cloud-azure-starter-keyvault-secrets     | The starter for using Azure Key Vault Secrets.                                          |
> | spring-cloud-azure-starter-servicebus           | The starter for using Azure Service Bus.                                                |
> | spring-cloud-azure-starter-servicebus-jms       | The starter for using Azure Service Bus and JMS.                                        |
> | spring-cloud-azure-starter-storage-blob         | The starter for using Azure Storage Blob.                                               |
> | spring-cloud-azure-starter-storage-file-share   | The starter for using Azure Storage File Share.                                         |
> | spring-cloud-azure-starter-storage-queue        | The starter for using Azure Storage Queue.                                              |
> | spring-cloud-azure-starter-actuator             | The starter for using Spring Boot’s Actuator, which provides production ready features. |

The following table lists starters for Spring Data support:

> [!div class="mx-tdBreakAll"]
> | Name                                   | Description                                                      |
> |----------------------------------------|------------------------------------------------------------------|
> | spring-cloud-azure-starter-data-cosmos | The starter for using Azure Cosmos DB and Spring Data Cosmos DB. |

The following table lists starters for Spring Integration support:

> [!div class="mx-tdBreakAll"]
> | Name                                                 | Description                                                       |
> |------------------------------------------------------|-------------------------------------------------------------------|
> | spring-cloud-azure-starter-integration-eventhubs     | The starter for using Azure Event Hubs and Spring Integration.    |
> | spring-cloud-azure-starter-integration-servicebus    | The starter for using Azure Service Bus and Spring Integration.   |
> | spring-cloud-azure-starter-integration-storage-queue | The starter for using Azure Storage Queue and Spring Integration. |

The following table lists starters for Spring Cloud Stream support:

> [!div class="mx-tdBreakAll"]
> | Name                                         | Description                                                             |
> |----------------------------------------------|-------------------------------------------------------------------------|
> | spring-cloud-azure-starter-stream-eventhubs  | The starters for using Azure Event Hubs and Spring Cloud Stream Binder. |
> | spring-cloud-azure-starter-stream-servicebus | The starter for using Azure Service Bus and Spring Cloud Stream Binder. |

### Learning Spring Cloud Azure

We've prepared a full list of samples to show usage. You can find these samples at [Spring Cloud Azure Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0).

## Spring Cloud Azure configuration

Most of Azure Service SDKs can be divided into two categories by transport type: HTTP-based or AMQP-based. There are properties that are common to all SDKs, such as authentication principals and Azure environment settings, or common to HTTP-based clients, such as logging level to log HTTP requests and responses. In Spring Cloud Azure 4.0, we added five common categories of configuration properties that you can specify for each Azure service.

The following table lists properties common to multiple services:

| Property                                      | Description                                                                      |
|-----------------------------------------------|----------------------------------------------------------------------------------|
| *spring.cloud.azure.azure-service*.client     | Configures the transport clients underneath one Azure service SDK.               |
| *spring.cloud.azure.azure-service*.credential | Configures authentication with Azure Active Directory for one Azure service SDK. |
| *spring.cloud.azure.azure-service*.profile    | Configures the Azure cloud environment for one Azure service SDK.                |
| *spring.cloud.azure.azure-service*.proxy      | Configures the proxy options for one Azure service SDK.                          |
| *spring.cloud.azure.azure-service*.retry      | Configures the retry options applicable to one Azure service SDK.                |

There are some properties that you can share among different Azure services, for example to use the same service principal to access Azure Cosmos DB and Azure Event Hubs. Spring Cloud Azure 4.0 enables you to define properties that apply to all Azure SDKs in the namespace `spring.cloud.azure`.

The following table lists global properties:

| Property                        | Description                                                                          |
|---------------------------------|--------------------------------------------------------------------------------------|
| *spring.cloud.azure*.client     | Configures the transport clients; applies to all Azure SDKs by default.              |
| *spring.cloud.azure*.credential | Configures authentication with Azure Active Directory for all Azure SDKs by default. |
| *spring.cloud.azure*.profile    | Configures the Azure cloud environment for all Azure SDKs by default.                |
| *spring.cloud.azure*.proxy      | Configures the proxy options applicable to all Azure SDK clients by default.         |
| *spring.cloud.azure*.retry      | Configures the retry options applicable to all Azure SDK clients by default.         |

> [!NOTE]
> Properties configured under each Azure service will override the global configurations.

The configuration properties' prefixes have been unified to the `spring.cloud.azure` namespace since Spring Cloud Azure 4.0 to make configuration properties more consistent and more intuitive. The following table provides a quick review of the prefixes for supported Azure services:

| Azure service               | Configuration property prefix             |
|-----------------------------|-------------------------------------------|
| Azure App Configuration     | *spring.cloud.azure*.appconfiguration     |
| Azure Cosmos DB             | *spring.cloud.azure*.cosmos               |
| Azure Event Hubs            | *spring.cloud.azure*.eventhubs            |
| Azure Key Vault Certificate | *spring.cloud.azure*.keyvault.certificate |
| Azure Key Vault Secret      | *spring.cloud.azure*.keyvault.secret      |
| Azure Service Bus           | *spring.cloud.azure*.servicebus           |
| Azure Storage Blob          | *spring.cloud.azure*.storage.blob         |
| Azure Storage File Share    | *spring.cloud.azure*.storage.fileshare    |
| Azure Storage Queue         | *spring.cloud.azure*.storage.queue        |

## Spring Cloud Azure authentication

### DefaultAzureCredential

The `DefaultAzureCredential` is appropriate for most scenarios where the application is intended to ultimately run in the Azure Cloud. This is because the `DefaultAzureCredential` combines credentials commonly used to authenticate when deployed with credentials used to authenticate in a development environment.

> [!NOTE]
> `DefaultAzureCredential` is intended to simplify getting started with the SDK by handling common scenarios with reasonable default behaviors. If you want more control or your scenario isn't served by the default settings, you should use other credential types.

The `DefaultAzureCredential` will attempt to authenticate via the following mechanisms in order:

* Environment - The `DefaultAzureCredential` will read account information specified via environment variables and use it to authenticate.
* Managed Identity - If the application is deployed to an Azure host with Managed Identity enabled, the `DefaultAzureCredential` will authenticate with that account.
* IntelliJ - If you've authenticated via Azure Toolkit for IntelliJ, the `DefaultAzureCredential` will authenticate with that account.
* Visual Studio Code - If you've authenticated via the Visual Studio Code Azure Account plugin, the `DefaultAzureCredential` will authenticate with that account.
* Azure CLI - If you've authenticated an account via the Azure CLI `az login` command, the `DefaultAzureCredential` will authenticate with that account.

:::image type="content" source="media/spring-cloud-azure/default-azure-credential-authentication.png" alt-text="Diagram showing the authentication mechanism for `DefaultAzureCredential`." border="false":::

> [!TIP]
> Be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

### Managed identity

A common challenge is the management of secrets and credentials used to secure communication between different components making up a solution. Managed identities eliminate the need to manage credentials. Managed identities provide an identity for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. Applications may use the managed identity to obtain Azure AD tokens. For example, an application may use a managed identity to access resources like Azure Key Vault where you can store credentials in a secure manner or to access storage accounts.

We encourage using managed identity instead of using connection string or key in your application because it's more secure and will save the trouble of managing secrets and credentials. In this case, `DefaultAzureCredential` could better serve the scenario of developing locally using account information stored locally, then deploying the application to Azure Cloud and using managed identity.

#### Managed identity types

There are two types of managed identities:

* *System-assigned* - Some Azure services allow you to enable a managed identity directly on a service instance. When you enable a system-assigned managed identity, an identity is created in Azure AD that is tied to the lifecycle of that service instance. So when the resource is deleted, Azure automatically deletes the identity for you. By design, only that Azure resource can use this identity to request tokens from Azure AD.
* *User-assigned* - You may also create a managed identity as a standalone Azure resource. You can create a user-assigned managed identity and assign it to one or more instances of an Azure service. With user-assigned managed identities, the identity is managed separately from the resources that use it.

> [!NOTE]
> When you use a user-assigned managed identity, you can specify it using `spring.cloud.azure.credential.managed-identity-client-id` or `spring.cloud.azure.<azure-service>.credential.managed-identity-client-id`. You don't need credential configuration if you use a system-assigned managed identity.

> [!TIP]
> Be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

For more information about managed identity, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

### Other credential types

If you want more control, or your scenario isn't served by the `DefaultAzureCredential` or the default settings, you should use other credential types.

#### Authentication and authorization with Azure Active Directory

With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user or an application service principal. When a security principal (a user or an application) attempts to access an Azure resource, for example an Event Hubs resource, the request must be authorized. With Azure AD, access to a resource is a two-step process:

1. First, the security principal's identity is authenticated, and an OAuth 2.0 token is returned.
2. Next, the token is passed as part of a request to the Azure service to authorize access to the specified resource.

##### Authenticate with Azure Active Directory

To connect applications to resources that support Azure Active Directory (Azure AD) authentication, you can set the following configurations with the prefix `spring.cloud.azure.credential` or `spring.cloud.azure.<azure-service>.credential`

The following table lists authentication properties:

| Property                    | Description                                                                                                                                         |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| client-id                   | The client ID to use when performing service principal authentication with Azure.                                                                   |
| client-secret               | The client secret to use when performing service principal authentication with Azure.                                                               |
| client-certificate-path     | The client secret to use when performing service principal authentication with Azure.                                                               |
| client-certificate-password | The password of the certificate file.                                                                                                               |
| username                    | The username to use when performing username/password authentication with Azure.                                                                    |
| password                    | The password to use when performing username/password authentication with Azure.                                                                    |
| managed-identity-client-id  | The client ID to use when using user-assigned managed identity or app registration (when working with AKS pod-identity) to authenticate with Azure. |

> [!TIP]
> For the list of all Spring Cloud Azure configuration properties, see [List of configuration properties](spring-cloud-azure-appendix.md#list-of-configuration-properties).

##### Authorize access with Azure Active Directory

The authorization step requires that one or more Azure roles be assigned to the security principal. The roles that are assigned to a security principal determine the permissions that the principal will have.

> [!TIP]
> For the list of all Azure built-in roles, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

The following table lists the Azure built-in roles for authorizing access to Azure services supported in Spring Cloud Azure:

| Role                                                                                                               | Description                                                                                               |
|--------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [App Configuration Data Owner](/azure/role-based-access-control/built-in-roles#app-configuration-data-owner)       | Allows full access to App Configuration data.                                                             |
| [App Configuration Data Reader](/azure/role-based-access-control/built-in-roles#app-configuration-data-reader)     | Allows read access to App Configuration data.                                                             |
| [Azure Event Hubs Data Owner](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner)         | Allows full access to Azure Event Hubs resources.                                                         |
| [Azure Event Hubs Data Receiver](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver)   | Allows receive access to Azure Event Hubs resources.                                                      |
| [Azure Event Hubs Data Sender](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-send)         | Allows send access to Azure Event Hubs resources.                                                         |
| [Azure Service Bus Data Owner](/azure/role-based-access-control/built-in-roles#azure-service-bus-data-owner)       | Allows full access to Azure Service Bus resources.                                                        |
| [Azure Service Bus Data Receiver](/azure/role-based-access-control/built-in-roles#azure-service-bus-data-receiver) | Allows receive access to Azure Service Bus resources.                                                     |
| [Azure Service Bus Data Sender](/azure/role-based-access-control/built-in-roles#azure-service-bus-data-sender)     | Allows send access to Azure Service Bus resources.                                                        |
| [Storage Blob Data Owner](/azure/role-based-access-control/built-in-roles#storage-blob-data-owner)                 | Provides full access to Azure Storage blob containers and data, including assigning POSIX access control. |
| [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader)               | Read and list Azure Storage containers and blobs.                                                         |
| [Storage Queue Data Reader](/azure/role-based-access-control/built-in-roles#storage-queue-data-reader)             | Read and list Azure Storage queues and queue messages.                                                    |
| [Redis Cache Contributor](/azure/role-based-access-control/built-in-roles#redis-cache-contributor)                 | Manage Redis caches.                                                                                      |

> [!NOTE]
> When using Spring Cloud Azure Resource Manager to get the connection strings for Event Hubs, Service Bus, and Storage Queue, or the properties of Cache for Redis, assign the Azure built-in role `Contributor`. Azure Cache for Redis is special, and you can also assign the `Redis Cache Contributor` role to get the Redis properties.

> [!NOTE]
> A Key Vault access policy determines whether a given security principal, namely a user, application or user group, can perform different operations on Key Vault secrets, keys, and certificates. You can assign access policies using the Azure portal, the Azure CLI, or Azure PowerShell. For more information, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy).

> [!IMPORTANT]
> Azure Cosmos DB exposes two built-in role definitions: `Cosmos DB Built-in Data Reader` and `Cosmos DB Built-in Data Contributor`. However, Azure portal support for role management isn't available yet. For more information about the permission model, role definitions, and role assignment, see [Configure role-based access control with Azure Active Directory for your Azure Cosmos DB account](/azure/cosmos-db/how-to-setup-rbac).

#### SAS token

You can also configure services for authentication with Shared Access Signature (SAS). `spring.cloud.azure.<azure-service>.sas-token` is the property to configure. For example, use `spring.cloud.azure.storage.blob.sas-token` to authenticate to Storage Blob service.

#### Connection string

Connection string is supported by some Azure services to provide connection information and credentials. To connect to those Azure services using connection string, just configure `spring.cloud.azure.<azure-service>.connection-string`. For example, configure `spring.cloud.azure.eventhubs.connection-string` to connect to the Event Hubs service.

## Production ready

We’ve added health indicators for App Configuration, Event Hubs, Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File, as well as Spring Cloud Sleuth support for all HTTP-based Azure SDKs. As an example, you now can probe to determine whether a storage blob is up or down via Spring Boot actuator endpoint, as well as track dependencies and latencies going from your application to Key Vault.

### Enable health indicator

To enable the health indicators, add the Spring Cloud Azure Actuator Starter dependency to your *pom.xml* file. This dependency will also include the `spring-boot-starter-actuator`.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-actuator</artifactId>
</dependency>
```

The following table lists configurable properties to enable or disable health indicators for each Azure service:

| Azure Service     | Property                                           |
|-------------------|----------------------------------------------------|
| App Configuration | *management.health.azure*-appconfiguration.enabled |
| Cosmos DB         | *management.health.azure*-cosmos.enabled           |
| Event Hubs        | *management.health.azure*-eventhubs.enabled        |
| Key Vault         | *management.health.azure*-keyvault.enabled         |
| Storage           | *management.health.azure*-storage.enabled          |

> [!NOTE]
> Calling the health endpoint of Azure services may cause extra charges. For example, if you call `http://HOST_NAME:{port}/actuator/health/cosmos` to get the Cosmos DB health info, it will calculate Request Units (RUs). For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

### Enable Sleuth

When you want to trace Azure SDK activities by using Spring Cloud Sleuth, add the following Spring Cloud Azure Trace Sleuth dependency to your *pom.xml* file:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-trace-sleuth</artifactId>
</dependency>
```

> [!NOTE]
> Only HTTP-based Azure SDK clients are currently supported. For example, Event Hubs and Service Bus with AMQP transport are currently not supported. For these requirements, we recommend that you use [Azure Application Insight](/azure/azure-monitor/app/app-insights-overview).

## Auto-configure Azure SDK clients

Spring Boot greatly simplifies the Spring Cloud Azure experience. Spring Cloud Azure Starters are a set of convenient dependency descriptors to include in your application. Our starters handle the object instantiation and configuration logic so you don’t have to. Every starter depends on the Spring Cloud Azure starter to provide critical bits of configuration, like the Azure Cloud environment and authentication information. You can configure these properties, for example, in a YAML file with contents similar to the following:

```yaml
spring:
  cloud:
    azure:
      profile:
        tenant-id: ${AZURE_TENANT_ID}
        cloud: Azure
      credential:
        client-id: ${AZURE_CLIENT_ID}
```

> [!NOTE]
> The `cloud` property is optional.

These properties are optional and, if not specified, Spring Boot will attempt to automatically find them for you. For details on how Spring Boot finds these properties, refer to the documentation.

### Dependency setup

There are two ways to use Spring Cloud Azure starters. The first way is to use Azure SDKs with the `spring-cloud-azure-starter` dependency as shown in the following example:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

The second way is to avoid adding Azure SDK dependencies and instead include the Spring Cloud Azure Starter for each Service directly. For example, with Cosmos DB, you would add the following dependency:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-cosmos</artifactId>
</dependency>
```

> [!TIP]
> For the list of supported starters, see [Starter dependencies](#starter-dependencies).

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

Configuration properties for each Azure service are under prefix `spring.cloud.azure`.

> [!TIP]
> For the list of all Spring Cloud Azure configuration properties, see [List of configuration properties](spring-cloud-azure-appendix.md#list-of-configuration-properties).

### Basic usage

Adding the following properties to your *application.yaml* file will autoconfigure the Cosmos DB client for you.

```yaml
spring:
  cloud:
    azure:
      cosmos:
        database: ${AZURE_COSMOS_DATABASE_NAME}
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        consistency-level: eventual
        connection-mode: direct
```

 Then, both `CosmosClient` and `CosmosAsyncClient` are available in the context and can be autowired, as shown in the following example:

```java
class Demo {
@Autowired
private CosmosClient cosmosClient;

    @Override
    public void run() {
        User item = User.randomUser();
        CosmosContainer container = cosmosClient.getDatabase(databaseName).getContainer(containerName);
        container.createItem(item);
    }
}
```

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Resource handling

The Spring project provides a [Spring Resources](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources) abstraction to access a number of low-level resources. The project provides interfaces like `Resource`, `ResourceLoader` and `ResourcePatternResolver`. Spring Cloud Azure implements these interfaces for Azure Storage services, which allows you to interact with Azure storage Blob and File Share using the Spring programming model. Spring Cloud Azure provides `spring-cloud-azure-starter-storage-blob` and `spring-cloud-azure-starter-storage-file-share` to auto-configure Azure Storage Blob and Azure Storage File Share.

The following table lists Azure Storage related libraries:

| Starter                                       | Service     | Description                                                                                                                             |
|-----------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| spring-cloud-azure-starter-storage-blob       | Azure Blobs | Allows unstructured data to be stored and accessed at a massive scale in block blobs.                                                   |
| spring-cloud-azure-starter-storage-file-share | Azure Files | Offers fully managed cloud file shares that you can access from anywhere via the industry standard Server Message Block (SMB) protocol. |

### Dependency setup

```xml
<dependencies>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-storage-file-share</artifactId>
    </dependency>
</dependencies>
```

The `spring-cloud-azure-starter-storage-blob` dependency is only required when you're using Azure Storage Blob.

The `spring-cloud-azure-starter-storage-file-share` dependency is only required when you're using Azure Storage File Share.

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties of `spring-cloud-azure-starter-storage-blob`:

> [!div class="mx-tdBreakAll"]
> | Property                                       | Description                                                                                           |
> |------------------------------------------------|-------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.storage.blob*.enabled      | A value that indicates whether an Azure Blob Storage service is enabled. The default value is *true*. |
> | *spring.cloud.azure.storage.blob*.endpoint     | The URI to connect to Azure Blob Storage.                                                             |
> | *spring.cloud.azure.storage.blob*.account-key  | The private key to connect to Azure Blob Storage.                                                     |
> | *spring.cloud.azure.storage.blob*.account-name | The Azure Storage account name.                                                                       |

The following table lists the configurable properties of `spring-cloud-azure-starter-storage-file-share`:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Description                                                                                        |
> |-----------------------------------------------------|----------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.storage.fileshare*.enabled      | A value that indicates whether Azure File Storage service is enabled. The default value is *true*. |
> | *spring.cloud.azure.storage.fileshare*.endpoint     | The URI to connect to Azure File Storage.                                                          |
> | *spring.cloud.azure.storage.fileshare*.account-key  | The private key to connect to Azure File Storage.                                                  |
> | *spring.cloud.azure.storage.fileshare*.account-name | The Azure Storage account name.                                                                    |

### Basic usage

Add the following properties to your *application.yml* file:

```yaml
spring:
  cloud:
    azure:
      storage:
        blob:
          account-name: ${STORAGE_ACCOUNT_NAME}
          account-key: ${STORAGE_ACCOUNT_PRIVATE_KEY}
          endpoint: ${STORAGE_BLOB_ENDPOINT}
        fileshare:
          account-name: ${STORAGE_ACCOUNT_NAME}
          account-key: ${STORAGE_ACCOUNT_PRIVATE_KEY}
          endpoint:  ${STORAGE_FILESHARE_ENDPOINT}
```

#### Get a resource

##### Get a resource with @Value

You can use the annotation of `@Value("azure-blob://[your-container-name]/[your-blob-name]")` to autowire a blob resource, as shown in the following example:

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageResource;
```

You can use the annotation of `@Value("azure-file://[your-fileshare-name]/[your-file-name]")` to autowire a file resource, as shown in the following example:

```java
@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageResource;
```

##### Get a resource with ResourceLoader

```java
@Autowired
private ResourceLoader resourceLoader;

// ...

// Get a BlobResource.
Resource storageBlobResource = resourceLoader.getResource("azure-blob://[your-container-name]/[your-blob-name]");

// Get a FileResource.
Resource storageFileResource = resourceLoader.getResource("azure-file://[your-fileshare-name]/[your-file-name]");
```

##### Get resources by searching pattern

You can use the implementation class `AzureStorageBlobProtocolResolver` of `ResourcePatternResolver` to search for a `blob` resource, and `AzureStorageFileProtocolResolver` of `ResourcePatternResolver` to search for a `file` resource

For pattern search, the `searchPattern` should start with `azure-blob://` or `azure-file://`. For example, `azure-blob://**/**` means to list all blobs in all containers, and `azure-blob://demo-container/**` means to list all blobs in the `demo-container` container, including any subfolder.

For location search, the `searchLocation` should start with `azure-blob://` or `azure-file://` and the remaining file path should exist, otherwise an exception will be thrown.

```java
@Autowired
private AzureStorageBlobProtocolResolver azureStorageBlobProtocolResolver;

@Autowired
private AzureStorageFileProtocolResolver azureStorageFileProtocolResolver;

// Get all text blobs.
Resource[] blobTextResources = azureStorageBlobProtocolResolver.getResources("azure-blob://[container-pattern]/*.txt");

// Get all text files.
Resource[] fileTextResources = azureStorageFileProtocolResolver.getResources("azure-file://[fileshare-pattern]/*.txt");
```

#### Handling with resource

##### Download data from specific resource

You can download a resource from Azure Blob or file storage with the `getInputStream()` method of the `Resource` class, as shown in the following example:

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageBlobResource;

@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageFileResource;

// ...

// Download data as a stream from a blob resource.
InputStream inputblobStream = storageBlobResource.getInputStream();

// Download data as a stream from a file resource.
InputStream inputfileStream = storageFileResource.getInputStream();
```

##### Upload data to specific resource

You can upload to a resource to Azure Blob or file storage by casting the Spring `Resource` to `WritableResource`, as shown in the following example:

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageBlobResource;

@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageFileResource;

String data = "sampledata";

// Upload string data to a blob.
try (OutputStream blobos = ((WritableResource) this.storageBlobResource).getOutputStream()) {
    blobos.write(data.getBytes());
}

// Upload string data to a file.
try (OutputStream fileos = ((WritableResource) this.storageFileResource).getOutputStream()) {
    fileos.write(data.getBytes());
}
```

#### Multipart upload

Files larger than 4 MiB will be uploaded to Azure Storage in parallel.

### Samples

See the [storage-blob-sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/storage/spring-cloud-azure-starter-storage-blob/storage-blob-sample) and [storage-file-sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/storage/spring-cloud-azure-starter-storage-file-share/storage-file-sample) on GitHub.

## Secret management

`spring-cloud-azure-starter-keyvault-secrets` adds Azure Key Vault as a Spring `PropertySource`, so you can access secrets stored in Azure Key Vault like any other externalized configuration property, such as properties in files.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-keyvault-secrets</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties of `spring-cloud-azure-starter-keyvault-secrets`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                 | Description                                                                       |
> |--------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
> | *spring.cloud.azure.keyvault.secret*.endpoint                            | The Key Vault URI.                                                                |
> | *spring.cloud.azure.keyvault.secret*.service-version                     | The service version.                                                              |
> | *spring.cloud.azure.keyvault.secret*.property-source-enabled             | A value that indicates whether to enable this property source.                    |
> | *spring.cloud.azure.keyvault.secret*.property-sources                    | Multiple property sources.                                                        |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].name             | The name of this property source.                                                 |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].endpoint         | The Key Vault URI.                                                                |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].service-version  | The service version.                                                              |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].case-sensitive   | A value that indicates whether the secret name is case-sensitive.                 |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].secret-keys      | The supported secret names. If not configured, it will retrieve all secret names. |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].refresh-interval | The refresh interval.                                                             |

### Basic usage

#### One property source

##### Property configuration

If you want to authenticate by `client-id` and `client-secret`, the following properties are required:

```yaml
spring:
  cloud:
    azure:
      profile:
        tenant-id: ${AZURE_TENANT_ID}
      credential:
        client-id: ${AZURE_CLIENT_ID}
        client-secret: ${AZURE_CLIENT_SECRET}
      keyvault:
        secret:
          property-source-enabled: true
          endpoint: ${AZURE_KEYVAULT_ENDPOINT}
```

> [!NOTE]
> If your application is authenticated by other methods like Managed Identity or Azure CLI, properties like `tenant-id`, `client-id`, and `client-secret` aren't necessary. However, if these properties are configured, then these properties have higher priority. For more information, see [Spring Cloud Azure authentication](#spring-cloud-azure-authentication).

##### Java Code

```java
@SpringBootApplication
public class SampleApplication implements CommandLineRunner {

    @Value("${sampleProperty}")
    private String sampleProperty;

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("sampleProperty: " + sampleProperty);
    }
}
```

#### Multiple property sources

##### Property configuration

```yaml
spring:
  cloud:
    azure:
      keyvault:
        secret:
          property-source-enabled: true
          property-sources:
            -
              name: key-vault-1
              endpoint: ${ENDPOINT_1}
              profile:
                tenant-id: ${AZURE_TENANT_ID_1}
              credential:
                client-id: ${AZURE_CLIENT_ID_1}
                client-secret: ${AZURE_CLIENT_SECRET_1}
            -
              name: key-vault-2
              endpoint: ${ENDPOINT_2}
              profile:
                tenant-id: ${AZURE_TENANT_ID_2}
              credential:
                client-id: ${AZURE_CLIENT_ID_2}
                client-secret: ${AZURE_CLIENT_SECRET_2}

```

> [!NOTE]
> If your application is authenticated by other methods like Managed Identity or Azure CLI, properties like `tenant-id`, `client-id`, and `client-secret` aren't necessary. However, if these properties are configured, then these properties have higher priority. For more information, see [Spring Cloud Azure authentication](#spring-cloud-azure-authentication).

##### Java code

```java
@SpringBootApplication
public class SampleApplication implements CommandLineRunner {

    @Value("${sampleProperty1}")
    private String sampleProperty1;
    @Value("${sampleProperty2}")
    private String sampleProperty2;
    @Value("${samplePropertyInMultipleKeyVault}")
    private String samplePropertyInMultipleKeyVault;

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }

    public void run(String[] args) {
        System.out.println("sampleProperty1: " + sampleProperty1);
        System.out.println("sampleProperty2: " + sampleProperty2);
        System.out.println("samplePropertyInMultipleKeyVault: " + samplePropertyInMultipleKeyVault);
    }

}
```

### Advanced usage

#### Special characters in property name

Key Vault secret names support only characters in `[0-9a-zA-Z-]`. For more information, see the[Vault-name and Object-name](/azure/key-vault/general/about-keys-secrets-certificates#vault-name-and-object-name) section of [Azure Key Vault keys, secrets and certificates overview](/azure/key-vault/general/about-keys-secrets-certificates). If your property name contains other characters, you can use the workarounds described in the following sections.

##### Use `-` instead of `.` in secret names

`.` isn't supported in secret names. If your application has a property name that contains `.`, such as `spring.datasource.url`, replace `.` with `-` when saving the secret in Azure Key Vault. For example, save `spring-datasource-url` in Azure Key Vault. In your application, you can still use `spring.datasource.url` to retrieve the property value.

> [!NOTE]
> This method cannot satisfy requirement like `spring.datasource-url`. When you save `spring-datasource-url` in Key Vault, only `spring.datasource.url` and `spring-datasource-url` is supported to retrieve the property value, but `spring.datasource-url` isn't supported. To handle this case, see the [Use property placeholders](#use-property-placeholders) section.

##### Use property placeholders

For example, suppose you're setting this property in your *application.properties* file:

```properties
property.with.special.character__=${propertyWithoutSpecialCharacter}
```

The application will get a `propertyWithoutSpecialCharacter` key name and assign its value to `property.with.special.character__`.

#### Case-sensitive

To enable case-sensitive mode, you can set the following property:

```properties
spring.cloud.azure.keyvault.secret.property-sources[].case-sensitive=true
```

### Samples

See the [spring-cloud-azure-starter-keyvault-secrets samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/keyvault/spring-cloud-azure-starter-keyvault-secrets) on GitHub.

## Spring Data support

### Spring Data Cosmos DB support

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a globally distributed database service that allows developers to work with data using various standard APIs, such as SQL, MongoDB, Graph, and Azure Table storage.

Connect to Cosmos DB using Spring Data and Cosmos DB libraries.

### Dependency setup

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-data-cosmos</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties of `spring-cloud-azure-starter-data-cosmos`:

> [!div class="mx-tdBreakAll"]
> | Property                                                           | Description                                                                                                     |
> |--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.cosmos*.enabled                                | A value that indicates whether Azure Cosmos Service is enabled. The default value is *true*.                    |
> | *spring.cloud.azure.cosmos*.database                               | The Cosmos DB database ID.                                                                                      |
> | *spring.cloud.azure.cosmos*.endpoint                               | The URI to connect Cosmos DB.                                                                                   |
> | *spring.cloud.azure.cosmos*.key                                    | The PrivateKey to connect Cosmos DB.                                                                            |
> | *spring.cloud.azure.cosmos*.credential.client-certificate-password | The password of the certificate file.                                                                           |
> | *spring.cloud.azure.cosmos*.credential.client-certificate-path     | The path of a PEM certificate file to use when performing service principal authentication with Azure.          |
> | *spring.cloud.azure.cosmos*.credential.client-id                   | The client ID to use when performing service principal authentication with Azure.                               |
> | *spring.cloud.azure.cosmos*.credential.client-secret               | The client secret to use when performing service principal authentication with Azure.                           |
> | *spring.cloud.azure.cosmos*.credential.managed-identity-client-id  | The client ID to use when using managed identity to authenticate with Azure.                                    |
> | *spring.cloud.azure.cosmos*.credential.password                    | The password to use when performing username/password authentication with Azure.                                |
> | *spring.cloud.azure.cosmos*.credential.username                    | The username to use when performing username/password authentication with Azure.                                |
> | *spring.cloud.azure.cosmos*.populate-query-metrics                 | A value that indicates whether to populate diagnostics strings and query metrics. The default value is *false*. |
> | *spring.cloud.azure.cosmos*.consistency-level                      | A [consistency level](/azure/cosmos-db/consistency-levels) for Azure Cosmos DB.                                 |

### Key concepts

The following list shows the key concepts of the Spring Data support:

* The Spring Data `CrudRepository` and `ReactiveCrudRepository`, which provide the following basic CRUD functionality:

  * save
  * findAll
  * findOne by ID
  * deleteAll
  * delete by ID
  * delete entity

* The Spring Data [@Id](https://github.com/spring-projects/spring-data-commons/blob/db62390de90c93a78743c97cc2cc9ccd964994a5/src/main/java/org/springframework/data/annotation/Id.java) annotation. There are two ways to map a field in a domain class to the `id` of an Azure Cosmos DB document:

  * Annotate a field in domain class with `@Id`. This field will be mapped to document `id` in Cosmos DB.
  * Set the name of this field to `id`. This field will be mapped to document `id` in Cosmos DB.

  > [!NOTE]
  > If both ways are applied, the `@Id` annotation has higher priority.

* Custom collection names. By default, collection name will be class name of user domain class. To customize it, add annotation `@Document(collection="myCustomCollectionName")` to your domain class, that's all.

* Supports [Azure Cosmos DB partition](/azure/cosmos-db/partitioning-overview). To specify a field of your domain class to be a partition key field, annotate it with `@PartitionKey`. When you do CRUD operations, specify your partition value. For more examples, see [AddressRepositoryIT.java](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure_4.0.0/sdk/cosmos/azure-spring-data-cosmos-test/src/test/java/com/azure/spring/data/cosmos/repository/integration/AddressRepositoryIT.java) on GitHub.

* Supports [Spring Data custom query](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) find operation.

* Supports [spring-boot-starter-data-rest](https://spring.io/projects/spring-data-rest).

* Supports List and nested types in domain classes.

### Basic usage

#### Use a private key to access Cosmos DB

The simplest way to connect Cosmos DB with `spring-cloud-azure-starter-data-cosmos` is with a primary key. Add the following properties:

```yaml
spring:
  cloud:
    azure:
      cosmos:
        key: ${AZURE_COSMOS_KEY}
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        database: ${AZURE_COSMOS_DATABASE}
```

#### Define an entity

Define an entity as a Document in Cosmos DB, as shown in the following example:

```java
@Container(containerName = "mycollection")
public class User {
    @Id
    private String id;
    private String firstName;
    @PartitionKey
    private String lastName;
    private String address;

    public User() {
    }

    public User(String id, String firstName, String lastName, String address) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return String.format("%s %s, %s", firstName, lastName, address);
    }
}
```

The `id` field will be used as the document `id` in Azure Cosmos DB. Alternately, you can annotate any field with `@Id` to map it to the document `id`.

The annotation `@Container(containerName = "mycollection")` is used to specify the collection name of your document in Azure Cosmos DB.

#### Create repositories

To create repositories, extend the `ReactiveCosmosRepository` interface, which provides Spring Data repository support.

```java
@Repository
public interface UserRepository extends ReactiveCosmosRepository<User, String> {
    Flux<User> findByFirstName(String firstName);
}
```

Currently, the `ReactiveCosmosRepository` interface provides basic save, delete, and find operations. More operations will be supported later.

#### Create an application class

The following example creates an application class with all the components:

```java
@SpringBootApplication
public class CosmosSampleApplication implements CommandLineRunner {

private static final Logger LOGGER = LoggerFactory.getLogger(CosmosSampleApplication.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private CosmosProperties properties;

    public static void main(String[] args) {
        SpringApplication.run(CosmosSampleApplication.class, args);
    }

    public void run(String... var1) {
        final User testUser = new User("testId", "testFirstName",
                "testLastName", "test address line one");

        // Save the User class to Azure Cosmos DB database.
        final Mono<User> saveUserMono = repository.save(testUser);

        final Flux<User> firstNameUserFlux = repository.findByFirstName("testFirstName");

        //  Nothing happens until we subscribe to these Monos.
        //  findById will not return the user as user isn't present.
        final Mono<User> findByIdMono = repository.findById(testUser.getId());
        final User findByIdUser = findByIdMono.block();
        Assert.isNull(findByIdUser, "User must be null");

        final User savedUser = saveUserMono.block();
        Assert.state(savedUser != null, "Saved user must not be null");
        Assert.state(savedUser.getFirstName().equals(testUser.getFirstName()),
                "Saved user first name doesn't match");

        firstNameUserFlux.collectList().block();

        final Optional<User> optionalUserResult = repository.findById(testUser.getId()).blockOptional();
        Assert.isTrue(optionalUserResult.isPresent(), "Cannot find user.");

        final User result = optionalUserResult.get();
        Assert.state(result.getFirstName().equals(testUser.getFirstName()),
                "query result firstName doesn't match!");
        Assert.state(result.getLastName().equals(testUser.getLastName()),
                "query result lastName doesn't match!");
        LOGGER.info("findOne in User collection get result: {}", result.toString());

    }

    @PostConstruct
    public void setup() {
        // For this example, remove all of the existing records.
        this.repository.deleteAll().block();
    }
}
```

This example includes an autowired `UserRepository` interface to support save, delete, and find operations.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/cosmos) on GitHub.

When you use the Azure Cosmos DB Spring Boot Starter, you can directly use the Spring Data for Azure Cosmos DB package for more complex scenarios. For more information, see [Spring Data for Azure Cosmos DB](https://github.com/Azure/azure-sdk-for-java/tree/spring-cloud-azure_4.0.0/sdk/cosmos/azure-spring-data-cosmos).

## Spring security with Azure AD

When you're building a web application, identity and access management will always be foundational pieces.

Azure enables you to democratize your application development journey because it offers a cloud-base identity service as well as deep integration with the rest of the Azure ecosystem.

Spring Security makes it easy to secure your Spring-based applications, but it isn't tailored to a specific identity provider. The `spring-cloud-azure-starter-active-directory` (`aad-starter` for short) enables you to connect your web application to an Azure Active Directory (Azure AD) tenant and protect a resource server with Azure AD. `aad-starter` uses the Oauth 2.0 protocol to protect web applications and resource servers.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
```

### Configuration

The following table lists the configurable properties of `spring-cloud-azure-starter-active-directory`:

> [!div class="mx-tdBreakAll"]
> | Name                                                                                | Description                                                                                                                                                                                                              |
> |-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.active-directory*.app-id-uri                                    | The app ID URI, which might be used in the "aud" claim of an `id_token`.                                                                                                                                                 |
> | *spring.cloud.azure.active-directory*.application-type                              | The type of the Azure AD application.                                                                                                                                                                                    |
> | *spring.cloud.azure.active-directory*.authenticate-additional-parameters            | Other parameters to add to the Authorization URL.                                                                                                                                                                        |
> | *spring.cloud.azure.active-directory*.authorization-clients                         | The OAuth2 authorization clients.                                                                                                                                                                                        |
> | *spring.cloud.azure.active-directory*.credential.client-id                          | The client ID to use when performing service principal authentication with Azure.                                                                                                                                        |
> | *spring.cloud.azure.active-directory*.credential.client-secret                      | The client secret to use when performing service principal authentication with Azure.                                                                                                                                    |
> | *spring.cloud.azure.active-directory*.jwk-set-cache-lifespan                        | The lifespan of the cached JWK set before it expires, in minutes. The default value is *5*.                                                                                                                              |
> | *spring.cloud.azure.active-directory*.jwk-set-cache-refresh-time                    | The refresh time of the cached JWK set before it expires, in minutes. The default value is *5*.                                                                                                                          |
> | *spring.cloud.azure.active-directory*.jwt-connect-timeout                           | The connection timeout for the JWKSet Remote URL call.                                                                                                                                                                   |
> | *spring.cloud.azure.active-directory*.jwt-read-timeout                              | The read timeout for the JWKSet Remote URL call.                                                                                                                                                                         |
> | *spring.cloud.azure.active-directory*.jwt-size-limit                                | The size limit in bytes of the JWKSet Remote URL call.                                                                                                                                                                   |
> | *spring.cloud.azure.active-directory*.post-logout-redirect-uri                      | The redirect URI after logout.                                                                                                                                                                                           |
> | *spring.cloud.azure.active-directory*.profile.cloud                                 | The name of the Azure cloud to connect to. Supported types are: AZURE, AZURE_CHINA, AZURE_GERMANY, AZURE_US_GOVERNMENT, OTHER.                                                                                           |
> | *spring.cloud.azure.active-directory*.profile.environment                           | Properties for Azure Active Directory endpoints.                                                                                                                                                                         |
> | *spring.cloud.azure.active-directory*.profile.tenant-id                             | The Azure Tenant ID.                                                                                                                                                                                                     |
> | *spring.cloud.azure.active-directory*.redirect-uri-template                         | The redirection endpoint used by the authorization server to return responses containing authorization credentials to the client via the resource owner user-agent. The default value is `{baseUrl}/login/oauth2/code/`. |
> | *spring.cloud.azure.active-directory*.resource-server.claim-to-authority-prefix-map | A value that configures which claim will be used to build `GrantedAuthority`, and the prefix of the `GrantedAuthority`'s string value. The default value is: `"scp" -> "SCOPE_", "roles" -> "APPROLE_"`.                 |
> | *spring.cloud.azure.active-directory*.resource-server.principal-claim-name          | A value that configures which claim in access token be returned in `AuthenticatedPrincipal#getName`. The default value is *sub*.                                                                                         |
> | *spring.cloud.azure.active-directory*.session-stateless                             | *true* to activate the stateless auth filter `AADAppRoleStatelessAuthenticationFilter`; *false* to activate `AADAuthenticationFilter`. The default value is *false*.                                                     |
> | *spring.cloud.azure.active-directory*.user-group.allowed-group-ids                  | The group IDs can be used to construct `GrantedAuthority`.                                                                                                                                                               |
> | *spring.cloud.azure.active-directory*.user-group.allowed-group-names                | The group names can be used to construct `GrantedAuthority`.                                                                                                                                                             |
> | *spring.cloud.azure.active-directory*.user-group.use-transitive-members             | *true* to use `v1.0/me/transitiveMemberOf` to get members; *false* to use `v1.0/me/memberOf`. The default value is *false*.                                                                                              |
> | *spring.cloud.azure.active-directory*.user-name-attribute                           | A value that decides which claim will be the principal's name.                                                                                                                                                           |

The following sections provide some examples of using these properties:

#### Property example 1: application type

The `spring.cloud.azure.active-directory.application-type` property is optional, and its value can be inferred by dependencies. Only `web_application_and_resource_server` must be configured manually, as shown in this example: `spring.cloud.azure.active-directory.application-type=web_application_and_resource_server`.

The following table lists the application types of `spring-cloud-azure-starter-active-directory`:

| Has dependency: `spring-security-oauth2-client` | Has dependency: `spring-security-oauth2-resource-server` | Valid values of application type                                                                               | Default value              |
|-------------------------------------------------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------|
| Yes                                             | No                                                       | `web_application`                                                                                              | `web_application`          |
| No                                              | Yes                                                      | `resource_server`                                                                                              | `resource_server`          |
| Yes                                             | Yes                                                      | `web_application`,`resource_server`,<br/>`resource_server_with_obo`,<br/>`web_application_and_resource_server` | `resource_server_with_obo` |

#### Property example 2: use Azure China instead of Azure Global

To use [Azure China](/azure/china/resources-developer-guide#check-endpoints-in-azure), add the following properties to your *application.yml* file:

```yaml
spring:
  cloud:
    azure:
      active-directory:
        base-uri: https://login.partner.microsoftonline.cn
        graph-base-uri: https://microsoftgraph.chinacloudapi.cn
```

#### Property example 3: use `Group Name` or `Group ID` to protect some method in web application

To protect a method in a web application, use the following steps:

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           user-group:
             allowed-group-names: group1_name_1, group2_name_2
             # 1. If allowed-group-ids == all, then all group ID will take effect.
             # 2. If "all" is used, we should not configure other group IDs.
             # 3. "all" is only supported for allowed-group-ids, not supported for allowed-group-names.
             allowed-group-ids: group_id_1, group_id_2
   ```

1. Add `@EnableGlobalMethodSecurity(prePostEnabled == true)` to a web application, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled == true)
   public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {
   
       /**
        * Add configuration logic as needed.
        */
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests()
               .anyRequest().authenticated();

           // Do some custom configuration.
       }
   }
   ```

1. Then, use the `@PreAuthorize` annotation to protect the method, as shown in the following example:

   ```java
   @Controller
   public class RoleController {
       @GetMapping("group1")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_group1')")
       public String group1() {
           return "group1 message";
       }
   
       @GetMapping("group2")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_group2')")
       public String group2() {
           return "group2 message";
       }
   
       @GetMapping("group1Id")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_<group1-id>')")
       public String group1Id() {
           return "group1Id message";
       }
   
       @GetMapping("group2Id")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_<group2-id>')")
       public String group2Id() {
           return "group2Id message";
       }
   }
   ```

#### Property example 4: Incremental consent in a web application visiting resource servers

To use [incremental consent](/azure/active-directory/azuread-dev/azure-ad-endpoint-comparison#incremental-and-dynamic-consent), add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           authorization-clients:
             graph:
               scopes: https://graph.microsoft.com/Analytics.Read, email
             arm: # client registration ID
               on-demand: true  # means incremental consent
               scopes: https://management.core.windows.net/user_impersonation
   ```

After this step, `arm`'s scopes (`https://management.core.windows.net/user_impersonation`) doesn't need to be consented at sign-in time. When a user requests the `/arm` endpoint, the user needs to consent the scope. That's what `incremental consent` means.

After the scopes have been consented, Azure AD server will remember that this user has already granted the permission to the web application. So incremental consent won't happen again after user consent.

#### Property example 5: Client credential flow in resource server visiting resource servers

To use [client credential flow](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow), add the following properties to your *application.yml* file:

```yaml
spring:
  cloud:
    azure:
      active-directory:
        authorization-clients:
          webapiC:                          # When authorization-grant-type is null, on behalf of flow is used by default
            authorization-grant-type: client_credentials
            scopes:
              - <Web-API-C-app-ID-URL>/.default
```

### Basic usage

#### Usage 1: accessing a web application

This scenario uses [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to sign in a user with a Microsoft account.

*System diagram*:

:::image type="content" source="media/spring-cloud-azure/system-diagram-stand-alone-web-application.png" alt-text="System diagram for a standalone web application." border="false":::

To use this scenario, follow these steps:

1. Be sure the redirect URI has been set to `APPLICATION_BASE_URI/login/oauth2/code/` (for example: `http://localhost:8080/login/oauth2/code/`).

   > [!NOTE]
   > The tailing `/` cannot be omitted.

   :::image type="content" source="media/spring-cloud-azure/web-application-set-redirect-uri-app-registrations.png" alt-text="Azure portal screenshot showing app registrations screen, with steps highlighted for setting a redirect URI." lightbox="media/spring-cloud-azure/web-application-set-redirect-uri-app-registrations.png":::

   :::image type="content" source="media/spring-cloud-azure/web-application-set-redirect-uri-authentication.png" alt-text="Azure portal screenshot showing authentication screen for an application, with steps highlighted for setting a redirect URI." lightbox="media/spring-cloud-azure/web-application-set-redirect-uri-authentication.png":::

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-client</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
   ```

1. Write your Java code.

   `AADWebSecurityConfigurerAdapter` contains the necessary web security configuration for `aad-starter`. `DefaultAADWebSecurityConfigurerAdapter` is configured automatically if you don't provide an implementation. You can provide an implementation by extending `AADWebSecurityConfigurerAdapter` and calling `super.configure(http)` explicitly in the `configure(HttpSecurity http)` function, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {
       /**
        * Add configuration logic as needed.
        */
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests()
                   .anyRequest().authenticated();
           // Do some custom configuration.
       }
   }
   ```

#### Usage 2: web application accessing resource servers

*System diagram*:

:::image type="content" source="media/spring-cloud-azure/system-diagram-web-application-visiting-resource-servers.png" alt-text="System diagram for a web application accessing resource servers." border="false":::

To use this scenario, follow these steps:

1. Be sure to set `redirect URI`.

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-client</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           authorization-clients:
             graph:
               scopes: https://graph.microsoft.com/Analytics.Read, email
   ```

   Here, `graph` is the name of `OAuth2AuthorizedClient`, `scopes` means the scopes needed to consent when logging in.

1. Write Java code, as shown in the following example:

   ```java
   public class Demo {
       @GetMapping("/graph")
       @ResponseBody
       public String graph(
           @RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graphClient) {

           // toJsonString() is just a demo.
           // oAuth2AuthorizedClient contains access_token. We can use this access_token to access resource server.
           return toJsonString(graphClient);
       }
   }
   ```

   Here, `graph` is the client name configured in step 2. `OAuth2AuthorizedClient` contains `access_token`. You can use `access_token` to access the resource server.

#### Usage 3: accessing a resource server

This scenario doesn't support sign-in. You can protect the server by validating the `access_token`. If the access token is valid, the server serves the request.

*System diagram*:

:::image type="content" source="media/spring-cloud-azure/system-diagram-stand-alone-resource-server-usage.png" alt-text="System diagram for standalone resource server usage." border="false":::

To use `aad-starter` in this scenario, follow these steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           client-id: <client-id>
           app-id-uri: <app-id-uri>
   ```

   You can use both `client-id` and `app-id-uri` to verify access tokens. You can get `app-id-uri` from the Azure portal, as shown in the following screenshots.

   :::image type="content" source="media/spring-cloud-azure/get-app-id-uri-app-registrations.png" alt-text="Azure portal screenshot showing app registrations screen, with steps highlighted for getting the `Application ID URI` value." lightbox="media/spring-cloud-azure/get-app-id-uri-app-registrations.png":::

   :::image type="content" source="media/spring-cloud-azure/get-app-id-uri-expose-api.png" alt-text="Azure portal screenshot showing 'Expose an API' screen, with steps highlighted for getting the `Application ID URI` value." lightbox="media/spring-cloud-azure/get-app-id-uri-expose-api.png":::

1. Write Java code.

   `AADResourceServerWebSecurityConfigurerAdapter` contains the necessary web security configuration for a resource server. `DefaultAADResourceServerWebSecurityConfigurerAdapter` is configured automatically if you don't provide an implementation. You can provide an implementation by extending `AADResourceServerWebSecurityConfigurerAdapter` and calling `super.configure(http)` explicitly in the `configure(HttpSecurity http)` function, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2ResourceServerSecurityConfig extends AADResourceServerWebSecurityConfigurerAdapter {
       /**
        * Add configuration logic as needed.
        */
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests((requests) -> requests.anyRequest().authenticated());
       }
   }
   ```

#### Usage 4: resource server visiting other resource servers

This scenario supports visit other resource servers from a resource server.

*System diagram*:

:::image type="content" source="media/spring-cloud-azure/system-diagram-resource-server-visiting-other-resource-servers.png" alt-text="System diagram for a resource server visiting other resource servers." border="false":::

To use `aad-starter` in this scenario, follow these steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-client</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           app-id-uri: ${WEB_API_ID_URI}
           authorization-clients:
             graph:
               scopes:
                 - https://graph.microsoft.com/User.Read
   ```

1. Write Java code using `@RegisteredOAuth2AuthorizedClient` to access a related resource server, as shown in the following example:

   ```java
   public class SampleController {
       @PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
       @GetMapping("call-graph")
       public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
           return callMicrosoftGraphMeEndpoint(graph);
       }
   }
   ```

#### Usage 5: web application and resource server in one application

This scenario supports `Web application` and `Resource server` in one application.

To use `aad-starter` in this scenario, follow these steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-oauth2-client</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file. Set property `spring.cloud.azure.active-directory.application-type` to `web_application_and_resource_server` and specify the authorization type for each authorization client.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           app-id-uri: ${WEB_API_ID_URI}
           application-type: web_application_and_resource_server  # This is required.
           authorization-clients:
             graph:
               authorizationGrantType: authorization_code # This is required.
               scopes:
                 - https://graph.microsoft.com/User.Read
                 - https://graph.microsoft.com/Directory.Read.All
   ```

1. Write Java code that configures multiple `HttpSecurity` instances. In the following example, `AADOAuth2SecurityMultiConfig` contains two security configurations, one for a resource server and one for a web application.

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled == true)
   public class AADWebApplicationAndResourceServerConfig {
   
       @Order(1)
       @Configuration
       public static class ApiWebSecurityConfigurationAdapter extends AADResourceServerWebSecurityConfigurerAdapter {
           protected void configure(HttpSecurity http) throws Exception {
               super.configure(http);

               // All the paths that match `/api/**`(configurable) work as `Resource Server`, other paths work as `Web application`.
               http.antMatcher("/api/**")
                   .authorizeRequests().anyRequest().authenticated();
           }
       }
   
       @Configuration
       public static class HtmlWebSecurityConfigurerAdapter extends AADWebSecurityConfigurerAdapter {
   
           @Override
           protected void configure(HttpSecurity http) throws Exception {
               super.configure(http);

               // @formatter:off
               http.authorizeRequests()
                   .antMatchers("/login").permitAll()
                   .anyRequest().authenticated();
               // @formatter:on
           }
       }
   }
   ```

### Advanced features

#### Support access control by ID token in web application

`aad-starter` supports creating `GrantedAuthority` from `id_token`'s `roles` claim to enable using `id_token` for authorization in web applications. You can use the `appRoles` feature of Azure Active Directory to create a `roles` claim and implement access control.

> [!NOTE]
> The `roles` claim generated from `appRoles` is decorated with the prefix `APPROLE_`. When using `appRoles` as a `roles` claim, you should avoid configuring the `group` attribute as `roles` at the same time. The latter will override the claim to contain group information instead of `appRoles`.
>
> Avoid the following configuration in your manifest:
>
> ```json
> {
>   "optionalClaims": {
>     "idtoken": [{
>       "name": "groups",
>       "additionalProperties": ["emit_as_roles"]
>     }]
>   }
> }
> ```

To use `aad-starter` in this scenario, follow these steps:

1. Follow the instructions in [Add app roles to your application and receive them in the token](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) to add app roles in your application and assign them to users or groups.

1. Add the following `appRoles` configuration in your application's manifest:

   ```json
   {
     "appRoles": [
       {
         "allowedMemberTypes": [
           "User"
         ],
         "displayName": "Admin",
         "id": "2fa848d0-8054-4e11-8c73-7af5f1171001",
         "isEnabled": true,
         "description": "Full admin access",
         "value": "Admin"
       }
     ]
   }
   ```

1. Write Java code similar to the following example:

   ```java
   class Demo {
       @GetMapping("Admin")
       @ResponseBody
       @PreAuthorize("hasAuthority('APPROLE_Admin')")
       public String admin() {
           return "Admin message";
       }
   }
   ```

#### Support conditional access in web application

`aad-starter` supports Conditional Access policies. For more information, see [Azure AD Conditional Access documentation](/azure/active-directory/conditional-access/). By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure. *Access control* includes many concepts. [Block Access](/azure/active-directory/conditional-access/howto-conditional-access-policy-block-access) and [Grant Access](/azure/active-directory/conditional-access/concept-conditional-access-grant) are important. In some scenarios, `aad-starter` will help you complete Grant Access controls.

The following discussion is based on the [Resource server visiting other resource servers](#usage-4-resource-server-visiting-other-resource-servers) scenario. In this discussion, a resource server with out-of-the-box functionality is called `webapiA` and the other resource servers are called `webapiB`. When you configure the `webapiB` application with Conditional Access such as [multi-factor authentication](/azure/active-directory/authentication/concept-mfa-howitworks), `aad-starter` stater will help send the Conditional Access information of `webapiA` to the web application, and the web application will help complete the Conditional Access Policy. This process is shown in the following diagram:

:::image type="content" source="media/spring-cloud-azure/aad-conditional-access-flow.png" alt-text="System diagram for Azure AD conditional access flow." border="false":::

You can use our samples to create a Conditional Access scenario:

* For `webapp`, you can use [aad-web-application](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-web-application).

* For `webapiA`, you can use [aad-resource-server-obo](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server-obo).

* For `webapiB`, you can use [aad-resource-server](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server).

To use `aad-starter` in this scenario, follow these steps:

1. Follow the guide to create a conditional access policy for `webapiB`.

   :::image type="content" source="media/spring-cloud-azure/aad-create-conditional-access-policies.png" alt-text="Azure portal screenshot showing policies screen for conditional access." lightbox="media/spring-cloud-azure/aad-create-conditional-access-policies.png":::

   :::image type="content" source="media/spring-cloud-azure/aad-conditional-access-add-application.png" alt-text="Azure portal screenshot showing new conditional access policy screen with cloud apps pane showing." lightbox="media/spring-cloud-azure/aad-conditional-access-add-application.png":::

1. Follow the instructions in [Require MFA for all users](/azure/active-directory/conditional-access/howto-conditional-access-policy-all-users-mfa) or specify the user account in your policy.

   :::image type="content" source="media/spring-cloud-azure/aad-create-conditional-access-users-groups.png" alt-text="Azure portal screenshot showing new conditional access policy screen with users and groups pane showing." lightbox="media/spring-cloud-azure/aad-create-conditional-access-users-groups.png":::

1. Use the following guides to configure and run the samples:

   * To configure `webapiB`, see [Configure Web API](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server#configure-web-api).
   * To configure `webapiA`, see [Configure your middle-tier Web API A](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server-obo#configure-your-middle-tier-web-api-a).
   * To configure `webapp`, see [Configure web app](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-web-application#configure-web-app).

#### Support setting redirect-uri-template

The following diagram illustrates redirect URIs:

:::image type="content" source="media/spring-cloud-azure/system-diagram-redirect-uri.png" alt-text="System diagram for redirect URIs." border="false":::

To customize the `redirect-uri`, use the following steps:

1. Add the `redirect-uri-template` property to your *application.yml* file.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory
         redirect-uri-template: ${REDIRECT-URI-TEMPLATE}
   ```

1. Update the configuration of the Azure cloud platform in the Azure portal.

   You need to configure the same `redirect-uri` value as in the *application.yml* file, as shown in the following screenshot:

   :::image type="content" source="media/spring-cloud-azure/web-application-configuration-redirect-uri.png" alt-text="Azure portal screenshot showing application authentication screen with redirect URI field highlighted." lightbox="media/spring-cloud-azure/web-application-configuration-redirect-uri.png":::

1. Write your Java code. After you set `redirect-uri-template`, update `SecurityConfigurerAdapter`, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {
       /**
        * Add configuration logic as needed.
        */
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.oauth2Login()
               .loginProcessingUrl("${REDIRECT-URI-TEMPLATE}")
               .and()
               .authorizeRequests()
               .anyRequest().authenticated();
       }
   }
   ```

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Spring security with Azure AD B2C

Azure Active Directory (Azure AD) B2C is an identity management service that enables you to customize and control how customers sign up, sign in, and manage their profiles when using your applications. Azure AD B2C enables these actions while protecting the identities of your customers at the same time.

### Dependency setup

```xml
<dependencies>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-active-directory-b2c</artifactId>
    </dependency>
</dependencies>
```

### Configuration

The following table lists the configurable properties of `spring-cloud-azure-starter-active-directory-b2c`:

> [!div class="mx-tdBreakAll"]
> | Name                                                                         | Description                                                                                              |
> |------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.active-directory.b2c*.app-id-uri                         | The app ID URI, which might be used in the "aud" claim of a token.                                       |
> | *spring.cloud.azure.active-directory.b2c*.authenticate-additional-parameters | More parameters for authentication.                                                                      |
> | *spring.cloud.azure.active-directory.b2c*.authorization-clients              | The client configuration.                                                                                |
> | *spring.cloud.azure.active-directory.b2c*.base-uri                           | The Azure AD B2C endpoint base URI.                                                                      |
> | *spring.cloud.azure.active-directory.b2c*.credential                         | The Azure AD B2C credential information.                                                                 |
> | *spring.cloud.azure.active-directory.b2c*.jwt-connect-timeout                | The connection timeout for the JWKSet Remote URL call.                                                   |
> | *spring.cloud.azure.active-directory.b2c*.jwt-read-timeout                   | The read Timeout for the JWKSet Remote URL call.                                                         |
> | *spring.cloud.azure.active-directory.b2c*.jwt-size-limit                     | The size limit in bytes of the JWKSet Remote URL call.                                                   |
> | *spring.cloud.azure.active-directory.b2c*.login-flow                         | The primary sign-in flow key. The default value is `sign-up-or-sign-in`.                                 |
> | *spring.cloud.azure.active-directory.b2c*.logout-success-url                 | The redirect URL after sign out. The default value is `http://localhost:8080/login`.                     |
> | *spring.cloud.azure.active-directory.b2c*.profile                            | The Azure AD B2C profile information.                                                                    |
> | *spring.cloud.azure.active-directory.b2c*.reply-url                          | The reply URL after getting the authorization code. The default value is `{baseUrl}/login/oauth2/code/`. |
> | *spring.cloud.azure.active-directory.b2c*.user-flows                         | The user flows.                                                                                          |
> | *spring.cloud.azure.active-directory.b2c*.user-name-attribute-name           | The user name attribute name.                                                                            |

For full configurations, see [Migration guide for 4.0](spring-cloud-azure-appendix.md#migration-guide-for-40).

### Basic usage

A `web application` is any web based application that enables a user to sign in with Azure AD, whereas a `resource server` will either accept or deny access after validating an `access_token` obtained from Azure AD. This guide covers the following scenarios:

* Accessing a web application.
* Web application accessing resource servers.
* Accessing a resource server.
* Resource server accessing other resource servers.

:::image type="content" source="media/spring-cloud-azure/system-diagram-b2c-web-application-web-api-overall.png" alt-text="System diagram of web application interaction with Azure AD and resource servers." border="false":::

#### Usage 1: accessing a web application

This scenario uses [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to sign in a user with your Azure AD B2C user. Use the following steps:

1. Select **Azure AD B2C** from the Azure portal menu, select **Applications**, and then select **Add**.

1. Specify your application **Name**, we call it `webapp`, add `http://localhost:8080/login/oauth2/code/` for the **Reply URL**, record the **Application ID** as your `WEB_APP_AZURE_CLIENT_ID` and then select **Save**.

1. Select **Keys** from your application, select **Generate key** to generate `WEB_APP_AZURE_CLIENT_SECRET`, and then select **Save**.

1. Select **User flows** and then select **New user flow**.

1. Choose **Sign up or in**, **Profile editing**, and **Password reset** to create user flows respectively. Specify your user flow **Name** and **User attributes and claims**, then select **Create**.

1. Select **API permissions** &gt; **Add a permission** &gt; **Microsoft APIs**, select **Microsoft Graph**,
  select **Delegated permissions**, select **offline_access** and **openid** permissions, then select **Add permission** to complete the process.

1. Grant admin consent for **Graph** permissions.

   :::image type="content" source="media/spring-cloud-azure/add-graph-permissions.png" alt-text="Azure portal screenshot showing API permissions screen for an app, with graph permissions highlighted." lightbox="media/spring-cloud-azure/add-graph-permissions.png":::

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>azure-spring-boot-starter-active-directory-b2c</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-thymeleaf</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
       </dependency>
       <dependency>
           <groupId>org.thymeleaf.extras</groupId>
           <artifactId>thymeleaf-extras-springsecurity5</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following properties to your *application.yml* file using the values you created earlier, as shown in the following example:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           b2c:
             authenticate-additional-parameters:
               domain_hint: xxxxxxxxx         # optional
               login_hint: xxxxxxxxx          # optional
               prompt: [login,none,consent]   # optional
             base-uri: ${BASE_URI}
             credential:
               client-id: ${WEBAPP_AZURE_CLIENT_ID}
               client-secret: ${WEBAPP_AZURE_CLIENT_SECRET}
             login-flow: ${LOGIN_USER_FLOW_KEY}     # default to sign-up-or-sign-in, will look up the user-flows map with provided key.
             logout-success-url: ${LOGOUT_SUCCESS_URL}
             user-flows:
               ${YOUR_USER_FLOW_KEY}: ${USER_FLOW_NAME}
             user-name-attribute-name: ${USER_NAME_ATTRIBUTE_NAME}
   ```

1. Write your Java code.

   Write Controller code similar to the following example:

   ```java
   @Controller
   public class WebController {
   
       private void initializeModel(Model model, OAuth2AuthenticationToken token) {
           if (token != null) {
               final OAuth2User user = token.getPrincipal();
               model.addAllAttributes(user.getAttributes());
               model.addAttribute("grant_type", user.getAuthorities());
               model.addAttribute("name", user.getName());
           }
       }
   
       @GetMapping(value = { "/", "/home" })
       public String index(Model model, OAuth2AuthenticationToken token) {
           initializeModel(model, token);
           return "home";
       }
   }
   ```

   Write security configuration code similar to the following example:

   ```java
   @EnableWebSecurity
   public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
   
       private final AADB2COidcLoginConfigurer configurer;
   
       public WebSecurityConfiguration(AADB2COidcLoginConfigurer configurer) {
           this.configurer == configurer;
       }
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           // @formatter:off
           http.authorizeRequests()
               .anyRequest().authenticated()
               .and()
               .apply(configurer);
           // @formatter:off
       }
   }
   ```

1. Copy the *home.html* file from [aad-b2c-web-application sample](https://github.com/Azure-Samples/azure-spring-boot-samples/blob/spring-cloud-azure_4.0.0/aad/spring-cloud-azure-starter-active-directory-b2c/aad-b2c-web-application/src/main/resources/templates/home.html), then replace the `PROFILE_EDIT_USER_FLOW` and `PASSWORD_RESET_USER_FLOW` with your user flow name respectively that completed earlier.

1. Build and test your app. Let `Webapp` run on port *8080*, then follow these steps:

   1. After your application is built and started by Maven, open `http://localhost:8080/` in a web browser. You should be redirected to a sign-in page.

   1. Select the link with the sign-in user flow. You should be redirected Azure AD B2C to start the authentication process.

   1. After you've logged in successfully, you should see the sample home page from the browser.

#### Usage 2: web application accessing resource servers

This scenario is based on the [Accessing a web application](#usage-1-accessing-a-web-application-1) scenario to allow applications to access other resources, that is [The OAuth 2.0 client credentials grant](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow) flow. Use the following steps:

1. Select **Azure AD B2C** from the Azure portal menu, select **Applications**, and then select **Add**.

1. Set **Name** to the application name (we call it *webApiA*), set the **Application ID** to your `WEB_API_A_AZURE_CLIENT_ID` value, and then select **Save**.

1. Select **Keys** from your application, select **Generate key** to generate the `WEB_API_A_AZURE_CLIENT_SECRET` value, and then select **Save**.

1. Select **Expose an API** from the navigation pane,select the **Set** link,
  set **Application ID URI** to your `WEB_API_A_APP_ID_URL` value, and then select **Save**.

1. Select **Manifest** from the navigation pane, paste the following JSON segment into the `appRoles` array, set **Application ID URI** to your `WEB_API_A_APP_ID_URL` value, record the value of the app role as your `WEB_API_A_ROLE_VALUE` value, and then select **Save**.

   ```json
   {
     "allowedMemberTypes": [
       "Application"
     ],
     "description": "WebApiA.SampleScope",
     "displayName": "WebApiA.SampleScope",
     "id": "04989db0-3efe-4db6-b716-ae378517d2b7",
     "isEnabled": true,
     "value": "WebApiA.SampleScope"
   }
   ```

   :::image type="content" source="media/spring-cloud-azure/application-manifest-app-roles.png" alt-text="Azure portal screenshot showing application manifest screen with `appRoles` JSON highlighted." lightbox="media/spring-cloud-azure/application-manifest-app-roles.png":::

1. Select **API permissions** &gt; **Add a permission** &gt; **My APIs**, select the **WebApiA** application name, select **Application Permissions**, select the **WebApiA.SampleScope** permission, and then select **Add permission** to complete the process.

1. Grant admin consent for **WebApiA** permissions.

   :::image type="content" source="media/spring-cloud-azure/application-api-permissions.png" alt-text="Azure portal screenshot showing application API permissions screen.":::

1. Add the following dependency based on the [Accessing a web application](#usage-1-accessing-a-web-application-1) scenario.

   ```xml
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-webflux</artifactId>
   </dependency>
   ```

1. Add the following properties to your *application.yml* file based on the [Accessing a web application](#usage-1-accessing-a-web-application-1) scenario.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           b2c:
             base-uri: ${BASE_URI}             # Such as: https://xxxxb2c.b2clogin.com
             profile:
               tenant-id: ${AZURE_TENANT_ID}
             authorization-clients:
               ${RESOURCE_SERVER_A_NAME}:
                 authorization-grant-type: client_credentials
                 scopes: ${WEB_API_A_APP_ID_URL}/.default
   ```

1. Write your `Webapp` Java code.

   Write Controller code similar to the following example:

   ```java
   class Demo {
       /**
        * Access to protected data from Webapp to WebApiA through client credential flow. The access token is obtained by webclient, or
        * <p>@RegisteredOAuth2AuthorizedClient("webApiA")</p>. In the end, these two approaches will be executed to
        * DefaultOAuth2AuthorizedClientManager#authorize method, get the access token.
        *
        * @return Respond to protected data from WebApi A.
        */
       @GetMapping("/webapp/webApiA")
       public String callWebApiA() {
           String body = webClient
               .get()
               .uri(LOCAL_WEB_API_A_SAMPLE_ENDPOINT)
               .attributes(clientRegistrationId("webApiA"))
               .retrieve()
               .bodyToMono(String.class)
               .block();
           LOGGER.info("Call callWebApiA(), request '/webApiA/sample' returned: {}", body);
           return "Request '/webApiA/sample'(WebApi A) returned a " + (body != null ? "success." : "failure.");
       }
   }
   ```

   The security configuration code is the same as in the [Accessing a web application](#usage-1-accessing-a-web-application-1) scenario, but with another bean `webClient` added as shown in the following example:

   ```java
   public class SampleConfiguration {
       @Bean
       public WebClient webClient(OAuth2AuthorizedClientManager oAuth2AuthorizedClientManager) {
           ServletOAuth2AuthorizedClientExchangeFilterFunction function =
               new ServletOAuth2AuthorizedClientExchangeFilterFunction(oAuth2AuthorizedClientManager);
           return WebClient.builder()
                           .apply(function.oauth2Configuration())
                           .build();
       }
   }
   ```

1. To write your `WebApiA` Java code, see the [Accessing a resource server](#usage-3-accessing-a-resource-server-1) section.

1. Build and test your app. Let `Webapp` and `WebApiA` run on port *8080* and *8081* respectively. Start the `Webapp` and `WebApiA` applications, then return to the home page after logging in successfully. You can access `http://localhost:8080/webapp/webApiA` to get a *WebApiA* resource response.

#### Usage 3: accessing a resource server

This scenario doesn't support sign in, it just protects the server by validating the access token, and if valid, serves the request. Use the following steps:

1. See [Usage 2: Web Application Accessing Resource Servers](#usage-2-web-application-accessing-resource-servers) to build your `WebApiA` permission.

1. Add `WebApiA` permission and grant admin consent for your web application.

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.azure.spring</groupId>
           <artifactId>azure-spring-boot-starter-active-directory-b2c</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
   </dependencies>
   ```

1. Add the following configuration.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           b2c:
             base-uri: ${BASE_URI}             # Such as: https://xxxxb2c.b2clogin.com
             profile:
               tenant-id: ${AZURE_TENANT_ID}
             app-id-uri: ${APP_ID_URI}         # If you're using v1.0 token, configure app-id-uri for `aud` verification
             credential:
               client-id: ${AZURE_CLIENT_ID}           # If you're using v2.0 token, configure client-id for `aud` verification
   ```

1. Write your Java code.

   Write Controller code similar to the following example:

   ```java
   class Demo {
       /**
        * webApiA resource api for web app
        * @return test content
        */
       @PreAuthorize("hasAuthority('APPROLE_WebApiA.SampleScope')")
       @GetMapping("/webApiA/sample")
       public String webApiASample() {
           LOGGER.info("Call webApiASample()");
           return "Request '/webApiA/sample'(WebApi A) returned successfully.";
       }
   }
   ```

   Write security configuration code similar to the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled == true)
   public class ResourceServerConfiguration extends WebSecurityConfigurerAdapter {
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           http.authorizeRequests((requests) -> requests.anyRequest().authenticated())
               .oauth2ResourceServer()
               .jwt()
               .jwtAuthenticationConverter(new AADJwtBearerTokenAuthenticationConverter());
       }
   }
   ```

1. Build and test your app. Let `WebApiA` run on port *8081*. Get the access token for `webApiA` resource and access `http://localhost:8081/webApiA/sample` as the Bearer authorization header.

#### Usage 4: resource server accessing other resource servers

This scenario is an upgrade of [Accessing a resource server](#usage-3-accessing-a-resource-server-1), and supports access to other application resources based on the OAuth2 client credentials flow. Use the following steps:

1. Referring to the previous steps, create a `WebApiB` application and expose an application permission `WebApiB.SampleScope`, as shown in the following example:

   ```json
   {
     "allowedMemberTypes": [
       "Application"
     ],
     "description": "WebApiB.SampleScope",
     "displayName": "WebApiB.SampleScope",
     "id": "04989db0-3efe-4db6-b716-ae378517d2b7",
     "isEnabled": true,
     "lang": null,
     "origin": "Application",
     "value": "WebApiB.SampleScope"
   }
   ```

1. Grant admin consent for `WebApiB` permissions.

1. Based on [Accessing a resource server](#usage-3-accessing-a-resource-server-1), add the following dependency to your *pom.xml* file:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-webflux</artifactId>
   </dependency>
   ```

1. Add the following properties to your *application.yml* file based on the [Accessing a resource server](#usage-3-accessing-a-resource-server-1) scenario configuration.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           b2c:
             credential:
               client-secret: ${WEB_API_A_AZURE_CLIENT_SECRET}
             authorization-clients:
               ${RESOURCE_SERVER_B_NAME}:
                 authorization-grant-type: client_credentials
                 scopes: ${WEB_API_B_APP_ID_URL}/.default
   ```

1. Write your Java code.

   Write `WebApiA` controller code similar to the following example:

   ```java
   public class SampleController {
       /**
        * Access to protected data from WebApiA to WebApiB through client credential flow. The access token is obtained by webclient, or
        * <p>@RegisteredOAuth2AuthorizedClient("webApiA")</p>. In the end, these two approaches will be executed to
        * DefaultOAuth2AuthorizedClientManager#authorize method, get the access token.
        *
        * @return Respond to protected data from WebApi B.
        */
       @GetMapping("/webApiA/webApiB/sample")
       @PreAuthorize("hasAuthority('APPROLE_WebApiA.SampleScope')")
       public String callWebApiB() {
           String body = webClient
               .get()
               .uri(LOCAL_WEB_API_B_SAMPLE_ENDPOINT)
               .attributes(clientRegistrationId("webApiB"))
               .retrieve()
               .bodyToMono(String.class)
               .block();
           LOGGER.info("Call callWebApiB(), request '/webApiB/sample' returned: {}", body);
           return "Request 'webApiA/webApiB/sample'(WebApi A) returned a " + (body != null ? "success." : "failure.");
       }
   }
   ```

   Write `WebApiB` controller code similar to the following example:

   ```java
   public class SampleController {
       /**
        * webApiB resource api for other web application
        * @return test content
        */
       @PreAuthorize("hasAuthority('APPROLE_WebApiB.SampleScope')")
       @GetMapping("/webApiB/sample")
       public String webApiBSample() {
           LOGGER.info("Call webApiBSample()");
           return "Request '/webApiB/sample'(WebApi B) returned successfully.";
       }
   }
   ```

   The security configuration code is the same as in the [Accessing a resource server](#usage-3-accessing-a-resource-server-1) scenario, but with another `webClient` bean added as shown in the following example:

   ```java
   public class SampleConfiguration {
       @Bean
       public WebClient webClient(OAuth2AuthorizedClientManager oAuth2AuthorizedClientManager) {
           ServletOAuth2AuthorizedClientExchangeFilterFunction function =
               new ServletOAuth2AuthorizedClientExchangeFilterFunction(oAuth2AuthorizedClientManager);
           return WebClient.builder()
                           .apply(function.oauth2Configuration())
                           .build();
       }
   }
   ```

1. Build and test your app. Let `WebApiA` and `WebApiB` run on port 8081 and 8082 respectively. Start the `WebApiA` and `WebApiB` applications, get the access token for the `webApiA` resource, and access `http://localhost:8081/webApiA/webApiB/sample` as the Bearer authorization header.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Spring Integration support

The Spring Integration Extension for Azure provides Spring Integration adapters for the various services provided by the [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java/). The following list shows the supported adapters:

* `spring-cloud-azure-starter-integration-eventhubs` - for more information, see [Spring Integration with Azure Event Hubs](#spring-integration-with-azure-event-hubs)
* `spring-cloud-azure-starter-integration-servicebus` - for more information, see [Spring Integration with Azure Service Bus](#spring-integration-with-azure-service-bus)
* `spring-cloud-azure-starter-integration-storage-queue` - for more information, see [Spring Integration with Azure Storage Queue](#spring-integration-with-azure-storage-queue)

This extension provides Spring Integration support for these Azure services: Event Hubs, Service Bus, and Storage Queue.

## Spring Integration with Azure Event Hubs

### Key concepts

Azure Event Hubs is a big data streaming platform and event ingestion service that can receive and process millions of events per second. Data sent to Event Hubs can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

Spring Integration enables lightweight messaging within Spring-based applications and supports integration with external systems via declarative adapters. These adapters provide a higher-level of abstraction over Spring’s support for remoting, messaging, and scheduling. The *Spring Integration for Event Hubs* extension project provides inbound and outbound channel adapters and gateways for Azure Event Hubs.

> [!NOTE]
> RxJava support APIs are dropped from version 4.0.0. For details, see Javadoc.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-eventhubs</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following sections describe the configuration options:

> [!NOTE]
> From version 4.0.0, when the `spring.cloud.azure.eventhubs.processor.checkpoint-store.create-container-if-not-exists` property isn't enabled manually, no Storage container will be created automatically with the name from `spring.cloud.azure.eventhubs.event-hub-name`.

#### Azure common configuration options

You can configure the following properties with the default Spring Cloud Azure unified properties by changing the prefix from `spring.cloud.azure.eventhubs` to `spring.cloud.azure`.

The following table lists the common configurable properties of `spring-cloud-azure-starter-integration-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                   | Type                        | Description                                                                                                                                        |
> |----------------------------------------------------------------------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.eventhubs*.enabled                                     | boolean                     | A value that indicates whether Azure Event Hubs service is enabled.                                                                                |
> | *spring.cloud.azure.eventhubs*.credential.*                                | NA                          | The properties used for getting a token credential.                                                                                                |
> | *spring.cloud.azure.eventhubs*.credential.clientId                         | String                      | The client ID to use when performing service principal authentication with Azure.                                                                  |
> | *spring.cloud.azure.eventhubs*.credential.clientSecret                     | String                      | The client secret to use when performing service principal authentication with Azure.                                                              |
> | *spring.cloud.azure.eventhubs*.credential.clientCertificatePath            | String                      | The path of a PEM certificate file to use when performing service principal authentication with Azure.                                             |
> | *spring.cloud.azure.eventhubs*.credential.clientCertificatePassword        | String                      | The password of the certificate file.                                                                                                              |
> | *spring.cloud.azure.eventhubs*.credential.username                         | String                      | The username to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.eventhubs*.credential.password                         | String                      | The password to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.eventhubs*.credential.managedIdentityClientId          | String                      | The client ID to use when using managed identity to authenticate with Azure.                                                                       |
> | *spring.cloud.azure.eventhubs*.profile.*                                   | String                      | The properties related to an Azure subscription.                                                                                                   |
> | *spring.cloud.azure.eventhubs*.profile.tenantId                            | String                      | The tenant ID for Azure resources.                                                                                                                 |
> | *spring.cloud.azure.eventhubs*.profile.subscriptionId                      | String                      | The subscription ID to use when connecting to Azure resources.                                                                                     |
> | *spring.cloud.azure.eventhubs*.profile.cloud                               | AzureProfileAware.CloudType | The name of the Azure cloud to connect to.                                                                                                         |
> | *spring.cloud.azure.eventhubs*.profile.environment.*                       | NA                          | The properties to Azure services, such as endpoints, resource IDs, and so on.                                                                      |
> | *spring.cloud.azure.eventhubs*.profile.environment.activeDirectoryEndpoint | String                      | The Azure Active Directory endpoint to connect to.                                                                                                 |
> | *spring.cloud.azure.eventhubs*.resource.*                                  | String                      | The metadata defining an Azure resource.                                                                                                           |
> | *spring.cloud.azure.eventhubs*.resource.resourceGroup                      | String                      | The name of the Azure resource group.                                                                                                              |
> | *spring.cloud.azure.eventhubs*.resource.resourceId                         | String                      | The ID of the Azure resource group.                                                                                                                |
> | *spring.cloud.azure.eventhubs*.resource.region                             | String                      | The name of region.                                                                                                                                |
> | *spring.cloud.azure.eventhubs*.client.transportType                        | AmqpTransportType           | The transport type switches available for AMQP protocol.                                                                                           |
> | *spring.cloud.azure.eventhubs*.retry.*                                     | NA                          | The retry properties.                                                                                                                              |
> | *spring.cloud.azure.eventhubs*.retry.backoff.*                             | NA                          | The backoff properties when a retry fails.                                                                                                         |
> | *spring.cloud.azure.eventhubs*.retry.backoff.delay                         | Duration                    | The amount of time to wait between retry attempts.                                                                                                 |
> | *spring.cloud.azure.eventhubs*.retry.backoff.maxDelay                      | Duration                    | The maximum permissible amount of time between retry attempts.                                                                                     |
> | *spring.cloud.azure.eventhubs*.retry.backoff.multiplier                    | Double                      | The multiplier used to calculate the next backoff delay. If positive, the value is used as a multiplier for generating the next delay for backoff. |
> | *spring.cloud.azure.eventhubs*.retry.maxAttempts                           | Integer                     | The maximum number of attempts.                                                                                                                    |
> | *spring.cloud.azure.eventhubs*.retry.timeout                               | Duration                    | The amount of time to wait until a timeout.                                                                                                        |
> | *spring.cloud.azure.eventhubs*.proxy.*                                     | NA                          | The common proxy properties.                                                                                                                       |
> | *spring.cloud.azure.eventhubs*.proxy.type                                  | String                      | The type of the proxy.                                                                                                                             |
> | *spring.cloud.azure.eventhubs*.proxy.hostname                              | String                      | The host of the proxy.                                                                                                                             |
> | *spring.cloud.azure.eventhubs*.proxy.port                                  | Integer                     | The port of the proxy.                                                                                                                             |
> | *spring.cloud.azure.eventhubs*.proxy.authenticationType                    | String                      | The authentication type used against the proxy.                                                                                                    |
> | *spring.cloud.azure.eventhubs*.proxy.username                              | String                      | The username used to authenticate with the proxy.                                                                                                  |
> | *spring.cloud.azure.eventhubs*.proxy.password                              | String                      | The password used to authenticate with the proxy.                                                                                                  |

#### Azure Event Hubs client configuration options

The following options are used to configure Azure Event Hubs SDK Client.

The following table lists the client configurable properties of `spring-cloud-azure-starter-integration-storage-queue`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                            | Type               | Description                                                                                                   |
> |-------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.eventhubs*.connection-string                                    | String             | The Event Hubs Namespace connection string value.                                                             |
> | *spring.cloud.azure.eventhubs*.namespace                                            | String             | The Event Hubs Namespace value.                                                                               |
> | *spring.cloud.azure.eventhubs*.domainName                                           | String             | The domain name of an Azure Event Hubs Namespace value.                                                       |
> | *spring.cloud.azure.eventhubs*.eventHubName                                         | String             | The name of an event hub entity.                                                                              |
> | *spring.cloud.azure.eventhubs*.customEndpointAddress                                | String             | The custom Endpoint address.                                                                                  |
> | *spring.cloud.azure.eventhubs*.isSharedConnection                                   | Boolean            | A value that indicates whether to use the same connection for different event hub producer / consumer client. |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.*                          | NA                 | The blob checkpoint store configuration options.                                                              |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.createContainerIfNotExists | Boolean            | A value that indicates whether to create a container if it doesn't exist.                                     |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.customerProvidedKey        | String             | The Base64 encoded string of the encryption key.                                                              |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.encryptionScope            | String             | The encryption scope to encrypt blob contents on the server.                                                  |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.serviceVersion             | BlobServiceVersion | The versions of Azure Storage Blob supported by this client library.                                          |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.blobName                   | String             | The storage blob name.                                                                                        |
> | *spring.cloud.azure.eventhubs*.processor.checkpointStore.containerName              | String             | The storage container name.                                                                                   |

### Basic usage

#### Send messages to Azure Event Hubs

For this scenario, use the following steps:

1. Fill the credential configuration options.

   * For credentials as connection string, add the following property to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             connection-string: ${AZURE_SERVICE_BUS_CONNECTION_STRING}
     ```

   * For credentials as MSI, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           eventhubs:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

   * For credentials as service principal, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           eventhubs:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

1. Create a `DefaultMessageHandler` with the `EventHubsTemplate` bean to send messages to Event Hubs, as shown in the following example:

   ```java
   class Demo{
       private static final String OUTPUT_CHANNEL = "output";
       private static final String EVENTHUB_NAME = "eh1";
   
       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler messageSender(EventHubsTemplate queueOperation) {
           DefaultMessageHandler handler = new DefaultMessageHandler(EVENTHUB_NAME, queueOperation);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }
               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.error("There was an error sending the message.", ex);
               }
           });
           return handler;
       }
   }
   ```

1. Create a Message gateway binding with the message handler created in the last step via a message channel, as shown in the following example:

   ```java
   class Demo{
       @Autowired
       EventHubOutboundGateway messagingGateway;
   
       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface EventHubOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway, as shown in the following example:

   ```java
   class Demo{
       public void demo() {
           this.messagingGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Event Hubs

For this scenario, use the following steps:

1. Fill in the credential configuration options.

1. Create a bean for the message channel as the input channel, as shown in the following example:

   ```java
   class Demo{
       private static final String INPUT_CHANNEL = "input";
       private static final String EVENTHUB_NAME = "eh1";
       private static final String CONSUMER_GROUP = "$Default";
   
       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create `EventHubsInboundChannelAdapter` with the `EventHubsProcessorContainer` bean to receive messages to Event Hubs, as shown in the following example:

   ```java
   @Bean
   class Demo{
       public EventHubsInboundChannelAdapter messageChannelAdapter(
           @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
           EventHubsProcessorContainer processorContainer) {
           CheckpointConfig config = new CheckpointConfig(CheckpointMode.MANUAL);
   
           EventHubsInboundChannelAdapter adapter =
               new EventHubsInboundChannelAdapter(processorContainer, EVENTHUB_NAME,
                   CONSUMER_GROUP, config);
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }
   }
   ```

1. Create a message receiver binding with the `EventHubsInboundChannelAdapter` created in the last step via the message channel we created before, as shown in the following example:

   ```java
   class Demo{
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
                       .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message))
                       .doOnError(e -> LOGGER.error("Error found", e))
                       .subscribe();
       }
   }
   ```

<a name="spring-integration-event-hubs-message-headers"></a>
#### Event Hubs message headers

The following table shows how Event Hubs message properties are mapped to Spring message headers. For Azure Event Hubs, the message is called as `event`.

> [!div class="mx-tdBreakAll"]
> | Event Hubs Event Properties    | Spring Message Header Constants                                                    | Type                                               | Description                                                                                           |
> |--------------------------------|------------------------------------------------------------------------------------|----------------------------------------------------|-------------------------------------------------------------------------------------------------------|
> | Enqueued time                  | com.azure.spring.eventhubs.support.EventHubsHeaders#ENQUEUED_TIME                  | Instant                                            | The instant, in UTC, of when the event was enqueued in the event hub partition.                       |
> | Offset                         | com.azure.spring.eventhubs.support.EventHubsHeaders#OFFSET                         | Long                                               | The offset of the event when it was received from the associated event hub partition.                 |
> | Partition key                  | com.azure.spring.messaging.AzureHeaders#PARTITION_KEY                              | String                                             | The partition hashing key if it was set when originally publishing the event.                         |
> | Partition ID                   | com.azure.spring.messaging.AzureHeaders#RAW_PARTITION_ID                           | String                                             | The partition ID of the event hub.                                                                    |
> | Sequence number                | com.azure.spring.eventhubs.support.EventHubsHeaders#SEQUENCE_NUMBER                | Long                                               | The sequence number assigned to the event when it was enqueued in the associated event hub partition. |
> | Last enqueued event properties | com.azure.spring.eventhubs.support.EventHubsHeaders#LAST_ENQUEUED_EVENT_PROPERTIES | LastEnqueuedEventProperties                        | The properties of the last enqueued event in this partition.                                          |
> | NA                             | com.azure.spring.messaging.AzureHeaders#CHECKPOINTER                               | com.azure.spring.messaging.checkpoint.Checkpointer | The header for checkpoint the specific message.                                                       |

Users can parse the message headers for the related information of each event. To set a message header for the event, all customized headers will be put as an application property of an event, where the header is set as the property key. When events are received from Event Hubs, all application properties will be converted to the message header.

> [!NOTE]
> Message headers of partition key, enqueued time, offset and sequence number isn't supported to be set manually.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/eventhubs/spring-cloud-azure-starter-integration-eventhubs/eventhubs-integration) on GitHub.

## Spring Integration with Azure Service Bus

### Key concepts

Spring Integration enables lightweight messaging within Spring-based applications and supports integration with external systems via declarative adapters.

The Spring Integration for Azure Service Bus extension project provides inbound and outbound channel adapters for Azure Service Bus.

> [!NOTE]
> `CompletableFuture` support APIs have been deprecated from version 2.10.0, and are replaced by Reactor Core from version 4.0.0. For details, see Javadoc.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-servicebus</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

#### Azure common configuration options

You can configure the following properties with the default Spring Cloud Azure unified properties by changing the prefix from `spring.cloud.azure.servicebus` to `spring.cloud.azure`.

The following table lists the common configurable properties of `spring-cloud-azure-starter-integration-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                    | Type                        | Description                                                                                                                                        |
> |-----------------------------------------------------------------------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.servicebus*.enabled                                     | boolean                     | A value that indicates whether an Azure Service Bus is enabled.                                                                                    |
> | *spring.cloud.azure.servicebus*.credential.*                                | NA                          | The properties used for getting token credential.                                                                                                  |
> | *spring.cloud.azure.servicebus*.credential.clientId                         | String                      | The client ID to use when performing service principal authentication with Azure.                                                                  |
> | *spring.cloud.azure.servicebus*.credential.clientSecret                     | String                      | The client secret to use when performing service principal authentication with Azure.                                                              |
> | *spring.cloud.azure.servicebus*.credential.clientCertificatePath            | String                      | The path of a PEM certificate file to use when performing service principal authentication with Azure.                                             |
> | *spring.cloud.azure.servicebus*.credential.clientCertificatePassword        | String                      | The password of the certificate file.                                                                                                              |
> | *spring.cloud.azure.servicebus*.credential.username                         | String                      | The username to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.servicebus*.credential.password                         | String                      | The password to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.servicebus*.credential.managedIdentityClientId          | String                      | The client ID to use when using managed identity to authenticate with Azure.                                                                       |
> | *spring.cloud.azure.servicebus*.profile.*                                   | String                      | The properties related to an Azure subscription.                                                                                                   |
> | *spring.cloud.azure.servicebus*.profile.tenantId                            | String                      | The tenant ID for Azure resources.                                                                                                                 |
> | *spring.cloud.azure.servicebus*.profile.subscriptionId                      | String                      | The subscription ID to use when connecting to Azure resources.                                                                                     |
> | *spring.cloud.azure.servicebus*.profile.cloud                               | AzureProfileAware.CloudType | The name of the Azure cloud to connect to.                                                                                                         |
> | *spring.cloud.azure.servicebus*.profile.environment.*                       | NA                          | The properties of Azure services, such as endpoints, resource IDs, and so on.                                                                      |
> | *spring.cloud.azure.servicebus*.profile.environment.activeDirectoryEndpoint | String                      | The Azure Active Directory endpoint to connect to.                                                                                                 |
> | *spring.cloud.azure.servicebus*.resource.*                                  | String                      | The metadata defining an Azure resource.                                                                                                           |
> | *spring.cloud.azure.servicebus*.resource.resourceGroup                      | String                      | The name of the Azure resource group.                                                                                                              |
> | *spring.cloud.azure.servicebus*.resource.resourceId                         | String                      | The ID of the Azure resource group.                                                                                                                |
> | *spring.cloud.azure.servicebus*.resource.region                             | String                      | The name of region.                                                                                                                                |
> | *spring.cloud.azure.servicebus*.client.transportType                        | AmqpTransportType           | The transport type switches available for AMQP protocol.                                                                                           |
> | *spring.cloud.azure.servicebus*.retry.*                                     | NA                          | The retry properties.                                                                                                                              |
> | *spring.cloud.azure.servicebus*.retry.backoff.*                             | NA                          | The backoff properties when a retry fails.                                                                                                         |
> | *spring.cloud.azure.servicebus*.retry.backoff.delay                         | Duration                    | The amount of time to wait between retry attempts.                                                                                                 |
> | *spring.cloud.azure.servicebus*.retry.backoff.maxDelay                      | Duration                    | The maximum permissible amount of time between retry attempts.                                                                                     |
> | *spring.cloud.azure.servicebus*.retry.backoff.multiplier                    | Double                      | The multiplier used to calculate the next backoff delay. If positive, the value is used as a multiplier for generating the next delay for backoff. |
> | *spring.cloud.azure.servicebus*.retry.maxAttempts                           | Integer                     | The maximum number of attempts.                                                                                                                    |
> | *spring.cloud.azure.servicebus*.retry.timeout                               | Duration                    | The amount of time to wait until a timeout.                                                                                                        |
> | *spring.cloud.azure.servicebus*.proxy.*                                     | NA                          | The common proxy properties.                                                                                                                       |
> | *spring.cloud.azure.servicebus*.proxy.type                                  | String                      | The type of the proxy.                                                                                                                             |
> | *spring.cloud.azure.servicebus*.proxy.hostname                              | String                      | The host of the proxy.                                                                                                                             |
> | *spring.cloud.azure.servicebus*.proxy.port                                  | Integer                     | The port of the proxy.                                                                                                                             |
> | *spring.cloud.azure.servicebus*.proxy.authenticationType                    | String                      | The authentication type used against the proxy.                                                                                                    |
> | *spring.cloud.azure.servicebus*.proxy.username                              | String                      | The username used to authenticate with the proxy.                                                                                                  |
> | *spring.cloud.azure.servicebus*.proxy.password                              | String                      | The password used to authenticate with the proxy.                                                                                                  |

#### Azure Service Bus client configuration options

The options in this section are used to configure Azure Service Bus SDK Client.

The following table lists the client configurable properties of `spring-cloud-azure-starter-integration-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Property                                                | Type                 | Description                                                                                             |
> |---------------------------------------------------------|----------------------|---------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.servicebus*.connection-string       | String               | The Service Bus Namespace connection string value.                                                      |
> | *spring.cloud.azure.servicebus*.namespace               | String               | The Service Bus Namespace value.                                                                        |
> | *spring.cloud.azure.servicebus*.domainName              | String               | The domain name of an Azure Service Bus Namespace value.                                                |
> | *spring.cloud.azure.servicebus*.entityName              | String               | The entity name of Azure Service Bus queue or topic.                                                    |
> | *spring.cloud.azure.servicebus*.entityType              | ServiceBusEntityType | The entity type of Azure Service Bus queue or topic.                                                    |
> | *spring.cloud.azure.servicebus*.crossEntityTransactions | Boolean              | A value that indicates whether to enable cross entity transaction on the connection to the service bus. |

### Basic usage

#### Send messages to Azure Service Bus

For this scenario, use the following steps:

1. Fill in the credential configuration options.

   * For credentials as connection string, add the following property to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           servicebus:
             connection-string: ${AZURE_SERVICE_BUS_CONNECTION_STRING}
     ```

   * For credentials as MSI, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

   * For credentials as service principal, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

1. Create a `DefaultMessageHandler` with the `ServiceBusTemplate` bean to send messages to Service Bus, and set the entity type for the `ServiceBusTemplate`, as shown in the following example:

   ```java
   class Demo{
       private static final String OUTPUT_CHANNEL = "queue.output";
   
       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler queueMessageSender(ServiceBusTemplate serviceBusTemplate) {
           serviceBusTemplate.setDefaultEntityType(ServiceBusEntityType.QUEUE);
           DefaultMessageHandler handler = new DefaultMessageHandler(QUEUE_NAME, serviceBusTemplate);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }
   
               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.info("There was an error sending the message.");
               }
           });
   
           return handler;
       }
   }
   ```

1. Create a Message gateway binding with the message handler created in the last stop via a message channel, as shown in the following example:

   ```java
   class Demo{
       @Autowired
       QueueOutboundGateway messagingGateway;
   
       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface QueueOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway

   ```java
   class Demo{
       public void demo() {
           this.messagingGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Service Bus

For this scenario, use the following steps:

1. Fill in the credential configuration options.

1. Create a message channel bean as the input channel, as shown in the following example:

   ```java
   class Demo{
       private static final String INPUT_CHANNEL = "input";
   
       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create a `ServiceBusInboundChannelAdapter` with the `ServiceBusProcessorContainer` bean to receive messages to Service Bus, as shown in the following example:

   ```java
   class Demo{
       private static final String QUEUE_NAME = "queue1";
   
       @Bean
       public ServiceBusInboundChannelAdapter queueMessageChannelAdapter(
           @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel, ServiceBusProcessorContainer processorContainer) {
           ServiceBusInboundChannelAdapter adapter = new ServiceBusInboundChannelAdapter(processorContainer, QUEUE_NAME,
               new CheckpointConfig(CheckpointMode.MANUAL));
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }
   }
   ```

1. Create a message receiver binding with `ServiceBusInboundChannelAdapter` created in the last step via the message channel we created before, as shown in the following example:

   ```java
   class Demo{
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
                       .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message))
                       .doOnError(e -> LOGGER.error("Error found", e))
                       .subscribe();
       }
   }
   ```

#### Configure ServiceBusMessageConverter to customize ObjectMapper

`ServiceBusMessageConverter` is a configurable bean to enable users to customize `ObjectMapper`.

<a name="spring-integration-service-bus-message-headers"></a>
#### Service Bus message headers

For some Service Bus headers that can be mapped to multiple Spring header constants, the priority of different Spring headers is listed.

The following table shows the mappings between Service Bus Headers and Spring Headers:

> [!div class="mx-tdBreakAll"]
> | Service Bus Message Headers and Properties | Spring Message Header Constants                                                     | Type     | Priority Number (Descending priority) |
> |--------------------------------------------|-------------------------------------------------------------------------------------|----------|---------------------------------------|
> | ContentType                                | org.springframework.messaging.MessageHeaders.CONTENT_TYPE                           | String   | not applicable                        |
> | CorrelationId                              | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.CORRELATION_ID         | String   | not applicable                        |
> | **MessageId**                              | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.MESSAGE_ID             | String   | 1                                     |
> | **MessageId**                              | com.azure.spring.messaging.AzureHeaders.RAW_ID                                      | String   | 2                                     |
> | **MessageId**                              | org.springframework.messaging.MessageHeaders.ID                                     | UUID     | 3                                     |
> | PartitionKey                               | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.PARTITION_KEY          | String   | not applicable                        |
> | ReplyTo                                    | org.springframework.messaging.MessageHeaders.REPLY_CHANNEL                          | String   | not applicable                        |
> | ReplyToSessionId                           | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.REPLY_TO_SESSION_ID    | String   | not applicable                        |
> | **ScheduledEnqueueTimeUtc**                | com.azure.spring.messaging.AzureHeaders.SCHEDULED_ENQUEUE_MESSAGE                   | Integer  | 1                                     |
> | **ScheduledEnqueueTimeUtc**                | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.SCHEDULED_ENQUEUE_TIME | Instant  | 2                                     |
> | SessionID                                  | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.SESSION_ID             | String   | not applicable                        |
> | TimeToLive                                 | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.TIME_TO_LIVE           | Duration | not applicable                        |
> | To                                         | com.azure.spring.servicebus.support.ServiceBusMessageHeaders.TO                     | String   | not applicable                        |

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/servicebus/spring-cloud-azure-starter-integration-servicebus) on GitHub.

*Example: Manually set the partition key for the message*

This example demonstrates how to manually set the partition key for the message in the application.

_Recommended:_ Use `ServiceBusMessageHeaders.PARTITION_KEY` as the key of the header.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(ServiceBusMessageHeaders.PARTITION_KEY, "Customize partition key")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

_Not recommended but currently supported:_ `AzureHeaders.PARTITION_KEY` as the key of the header.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(AzureHeaders.PARTITION_KEY, "Customize partition key")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

> [!NOTE]
> When both `ServiceBusMessageHeaders.PARTITION_KEY` and `AzureHeaders.PARTITION_KEY` are set in the message headers,
`ServiceBusMessageHeaders.PARTITION_KEY` is preferred.

*Example: Set the session ID for the message*

This example demonstrates how to manually set the session ID of a message in the application.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(ServiceBusMessageHeaders.SESSION_ID, "Customize session ID")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

> [!NOTE]
> When the `ServiceBusMessageHeaders.SESSION_ID` is set in the message headers, and a different `ServiceBusMessageHeaders.PARTITION_KEY` (or `AzureHeaders.PARTITION_KEY`) header is also set, the value of the session ID will eventually be used to overwrite the value of the partition key.

## Spring Integration with Azure Storage Queue

### Key concepts

Azure Queue Storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-storage-queue</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

#### Azure common configuration options

You can configure the following properties with the default Spring Cloud Azure unified properties by changing the prefix from `spring.cloud.azure.storage.queue` to `spring.cloud.azure`.

The following table lists the common configurable properties of `spring-cloud-azure-starter-integration-storage-queue`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                       | Type                        | Description                                                                                                                                        |
> |--------------------------------------------------------------------------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.storage.queue*.enabled                                     | boolean                     | A value that indicates whether an Azure Storage Queue is enabled.                                                                                  |
> | *spring.cloud.azure.storage.queue*.credential.*                                | NA                          | The properties used for getting token credential.                                                                                                  |
> | *spring.cloud.azure.storage.queue*.credential.clientId                         | String                      | The client ID to use when performing service principal authentication with Azure.                                                                  |
> | *spring.cloud.azure.storage.queue*.credential.clientSecret                     | String                      | The client secret to use when performing service principal authentication with Azure.                                                              |
> | *spring.cloud.azure.storage.queue*.credential.clientCertificatePath            | String                      | The path of a PEM certificate file to use when performing service principal authentication with Azure.                                             |
> | *spring.cloud.azure.storage.queue*.credential.clientCertificatePassword        | String                      | The password of the certificate file.                                                                                                              |
> | *spring.cloud.azure.storage.queue*.credential.username                         | String                      | The username to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.storage.queue*.credential.password                         | String                      | The password to use when performing username/password authentication with Azure.                                                                   |
> | *spring.cloud.azure.storage.queue*.credential.managedIdentityClientId          | String                      | The client ID to use when using managed identity to authenticate with Azure.                                                                       |
> | *spring.cloud.azure.storage.queue*.profile.*                                   | String                      | The properties related to an Azure subscription.                                                                                                   |
> | *spring.cloud.azure.storage.queue*.profile.tenantId                            | String                      | The tenant ID for Azure resources.                                                                                                                 |
> | *spring.cloud.azure.storage.queue*.profile.subscriptionId                      | String                      | The subscription ID to use when connecting to Azure resources.                                                                                     |
> | *spring.cloud.azure.storage.queue*.profile.cloud                               | AzureProfileAware.CloudType | The name of the Azure cloud to connect to.                                                                                                         |
> | *spring.cloud.azure.storage.queue*.profile.environment.*                       | NA                          | The properties to Azure services, such as endpoints, resource IDs, and so on.                                                                      |
> | *spring.cloud.azure.storage.queue*.profile.environment.activeDirectoryEndpoint | String                      | The Azure Active Directory endpoint to connect to.                                                                                                 |
> | *spring.cloud.azure.storage.queue*.resource.*                                  | String                      | The metadata defining an Azure resource.                                                                                                           |
> | *spring.cloud.azure.storage.queue*.resource.resourceGroup                      | String                      | The name of the Azure resource group.                                                                                                              |
> | *spring.cloud.azure.storage.queue*.resource.resourceId                         | String                      | The ID of the Azure resource group.                                                                                                                |
> | *spring.cloud.azure.storage.queue*.resource.region                             | String                      | The name of region.                                                                                                                                |
> | *spring.cloud.azure.storage.queue*.client.transportType                        | AmqpTransportType           | The transport type switches available for the AMQP protocol.                                                                                       |
> | *spring.cloud.azure.storage.queue*.retry.*                                     | NA                          | The retry properties.                                                                                                                              |
> | *spring.cloud.azure.storage.queue*.retry.backoff.*                             | NA                          | The backoff properties when a retry fails.                                                                                                         |
> | *spring.cloud.azure.storage.queue*.retry.backoff.delay                         | Duration                    | The amount of time to wait between retry attempts.                                                                                                 |
> | *spring.cloud.azure.storage.queue*.retry.backoff.maxDelay                      | Duration                    | The maximum permissible amount of time between retry attempts.                                                                                     |
> | *spring.cloud.azure.storage.queue*.retry.backoff.multiplier                    | Double                      | The multiplier used to calculate the next backoff delay. If positive, the value is used as a multiplier for generating the next delay for backoff. |
> | *spring.cloud.azure.storage.queue*.retry.maxAttempts                           | Integer                     | The maximum number of attempts.                                                                                                                    |
> | *spring.cloud.azure.storage.queue*.retry.timeout                               | Duration                    | The mount of time to wait until a timeout.                                                                                                         |
> | *spring.cloud.azure.storage.queue*.proxy.*                                     | NA                          | The common proxy properties.                                                                                                                       |
> | *spring.cloud.azure.storage.queue*.proxy.type                                  | String                      | The type of the proxy.                                                                                                                             |
> | *spring.cloud.azure.storage.queue*.proxy.hostname                              | String                      | The host of the proxy.                                                                                                                             |
> | *spring.cloud.azure.storage.queue*.proxy.port                                  | Integer                     | The port of the proxy.                                                                                                                             |
> | *spring.cloud.azure.storage.queue*.proxy.authenticationType                    | String                      | The authentication type used against the proxy.                                                                                                    |
> | *spring.cloud.azure.storage.queue*.proxy.username                              | String                      | The username used to authenticate with the proxy.                                                                                                  |
> | *spring.cloud.azure.storage.queue*.proxy.password                              | String                      | The password used to authenticate with the proxy.                                                                                                  |

#### Azure Storage Queue client configuration options

The options in this section are used to configure Azure Storage Queue SDK Client.

The following table lists the client configurable properties of `spring-cloud-azure-starter-integration-storage-queue`:

> [!div class="mx-tdBreakAll"]
> | Property                                             | Type                | Description                                                      |
> |------------------------------------------------------|---------------------|------------------------------------------------------------------|
> | *spring.cloud.azure.storage.queue*.connection-string | String              | The Storage Queue Namespace connection string value.             |
> | *spring.cloud.azure.storage.queue*.accountName       | String              | The Storage Queue account name.                                  |
> | *spring.cloud.azure.storage.queue*.accountKey        | String              | The Storage Queue account key.                                   |
> | *spring.cloud.azure.storage.queue*.endpoint          | String              | The Storage Queue service endpoint.                              |
> | *spring.cloud.azure.storage.queue*.sasToken          | String              | The SAS token credential                                         |
> | *spring.cloud.azure.storage.queue*.serviceVersion    | QueueServiceVersion | The `QueueServiceVersion` that is used when making API requests. |
> | *spring.cloud.azure.storage.queue*.messageEncoding   | String              | The queue message encoding.                                      |

### Basic usage

#### Send messages to Azure Storage Queue

For this scenario, use these steps:

1. Fill in the credential configuration options.

   * For credentials as connection string, add the following property to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           storage:
             queue:
               connection-string: ${AZURE_SERVICE_BUS_CONNECTION_STRING}
     ```

   * For credentials as MSI, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           storage:
             queue:
               namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

   * For credentials as service principal, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: ${AZURE_TENANT_ID}
           storage:
             queue:
               namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

1. Create a `DefaultMessageHandler` with the `StorageQueueOperation` bean to send messages to Storage Queue, as shown in the following example:

   ```java
   class Demo{
       private static final String STORAGE_QUEUE_NAME = "example";
       private static final String OUTPUT_CHANNEL = "output";
   
       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler messageSender(StorageQueueOperation storageQueueOperation) {
           DefaultMessageHandler handler = new DefaultMessageHandler(STORAGE_QUEUE_NAME, storageQueueOperation);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }
   
               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.info("There was an error sending the message.");
               }
           });
           return handler;
       }
   }
   ```

1. Create a Message gateway binding with the message handler created in the last stop via a message channel, as shown in the following example:

   ```java
   class Demo{
       @Autowired
       StorageQueueOutboundGateway storageQueueOutboundGateway;
   
       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface StorageQueueOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway, as shown in the following example:

   ```java
   class Demo{
       public void demo() {
           this.storageQueueOutboundGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Storage Queue

For this scenario, use these steps:

1. Fill in the credential configuration options.

1. Create a bean for the message channel as the input channel, as shown in the following example:

   ```java
   class Demo{
       private static final String INPUT_CHANNEL = "input";
   
       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create a `StorageQueueMessageSource` with the `StorageQueueOperation` bean to receive messages to Storage Queue, as shown in the following example:

   ```java
   class Demo{
       private static final String STORAGE_QUEUE_NAME = "example";
   
       @Bean
       @InboundChannelAdapter(channel = INPUT_CHANNEL, poller = @Poller(fixedDelay = "1000"))
       public StorageQueueMessageSource storageQueueMessageSource(StorageQueueOperation storageQueueOperation) {
           storageQueueOperation.setCheckpointMode(CheckpointMode.MANUAL);
           storageQueueOperation.setVisibilityTimeoutInSeconds(10);
   
           return new StorageQueueMessageSource(STORAGE_QUEUE_NAME, storageQueueOperation);
       }
   }
   ```

1. Create a message receiver binding with the `StorageQueueMessageSource` created in the last step via the message channel we created before, as shown in the following example:

   ```java
   class Demo{
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
                       .doOnError(Throwable::printStackTrace)
                       .doOnSuccess(t -> LOGGER.info("Message '{}' successfully checkpointed", message))
                       .subscribe();
       }
   }
   ```

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/storage/spring-cloud-azure-starter-integration-storage-queue) on GitHub.

## Spring Cloud Stream support

Spring Cloud Stream is a framework for building highly scalable event-driven microservices connected with shared messaging systems.

The framework provides a flexible programming model built on already established and familiar Spring idioms and best practices, including support for persistent pub/sub semantics, consumer groups, and stateful partitions.

The following list shows the current binder implementations:

* `spring-cloud-azure-stream-binder-eventhubs` - for more information, see [Spring Cloud Stream Binder for Azure Event Hubs](#spring-cloud-stream-binder-for-azure-event-hubs)
* `spring-cloud-azure-stream-binder-servicebus` - for more information, see [Spring Cloud Stream Binder for Azure Service Bus](#spring-cloud-stream-binder-for-azure-service-bus)

## Spring Cloud Stream Binder for Azure Event Hubs

### Key concepts

The Spring Cloud Stream Binder for Azure Event Hubs provides the binding implementation for the Spring Cloud Stream framework. This implementation uses Spring Integration Event Hubs Channel Adapters at its foundation. From design's perspective, Event Hubs is similar as Kafka. Also, you can access Event Hubs via the Kafka API. If your project has a tight dependency on the Kafka API, you can try the [Events Hub with Kafka API Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/eventhubs/spring-cloud-azure-starter/spring-cloud-azure-sample-eventhubs-kafka)

#### Consumer group

Event Hubs provides similar support for the consumer group as Apache Kafka, but with slightly different logic. While Kafka stores all committed offsets in the broker, you must store offsets for Event Hubs messages being processed manually. The Event Hubs SDK provides the function to store such offsets inside an Azure Storage account. That's why you must provide values for `spring.cloud.eventhubs.processor.checkpoint-store.*`.

#### Partitioning support

Event Hubs provides a similar concept of physical partition as Kafka. But unlike Kafka's auto rebalancing between consumers and partitions, Event Hubs provides a kind of preemptive mode. The storage account acts as a lease to determine which partition is owned by which consumer. When a new consumer starts, it will try to steal some partitions from most heavy-loaded consumers to achieve the workload balancing.

To specify the load balancing strategy, properties of `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.load-balancing.*` are provided. For more information, see [Azure Event Hubs consumer properties](#azure-event-hubs-consumer-properties).

#### Batch Consumer support

Azure Spring Cloud Stream Event Hubs binder supports [Spring Cloud Stream Batch Consumer feature](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#_batch_consumers).

To work with the batch-consumer mode, you should set the `spring.cloud.stream.bindings.<binding-name>.consumer.batch-mode` property to *true*. When enabled, an `org.springframework.messaging.Message` of which the payload is a list of batched events will be received and passed to the consumer function. Each message header is also converted as a list, of which the content is the associated header value parsed from each event. For the communal headers of partition ID, checkpointer, and last enqueued properties, they're presented as a single value for the entire batch of events shares the same one. For more information, see [Event Hubs message headers](#spring-cloud-stream-binder-event-hubs-message-headers).

> [!NOTE]
> The checkpoint header only exists when `MANUAL` checkpoint mode is used.

Checkpointing of batch consumer supports two modes: `BATCH` and `MANUAL`. `BATCH` mode is an auto checkpointing mode to checkpoint the entire batch of events together once they're received by the binder. `MANUAL` mode is to checkpoint the events by users. When used, the
`com.azure.spring.messaging.checkpoint.Checkpointer` will be passed into the message header, and users could use it to do checkpointing.

You can specify the batch size by using the properties `max-size` and `max-wait-time` with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.batch.`, where `max-size` is a necessary property and `max-wait-time` is optional. For more information, see [Azure Event Hubs consumer properties](#azure-event-hubs-consumer-properties).

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
</dependency>
```

Alternatively, you can also use the Azure Spring Cloud Stream Event Hubs Starter, as shown in the following example for Maven:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-stream-eventhubs</artifactId>
</dependency>
```

### Configuration

The following sections show the configuration options available.

<a name="event-hubs-connection-configration-properties"></a>
#### Connection configuration properties

These properties are exposed via `com.azure.spring.cloud.autoconfigure.eventhubs.properties.AzureEventHubsProperties`.

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the connection configurable properties of `spring-cloud-azure-stream-binder-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Property                                               | Type    | Description                                                 |
> |--------------------------------------------------------|---------|-------------------------------------------------------------|
> | *spring.cloud.azure.eventhubs*.enabled                 | boolean | A value that indicates whether Azure Event Hubs is enabled. |
> | *spring.cloud.azure.eventhubs*.connection-string       | String  | The Event Hubs Namespace connection string value.           |
> | *spring.cloud.azure.eventhubs*.namespace               | String  | The Event Hubs Namespace value.                             |
> | *spring.cloud.azure.eventhubs*.domain-name             | String  | The domain name of an Azure Event Hubs Namespace value.     |
> | *spring.cloud.azure.eventhubs*.custom-endpoint-address | String  | The custom endpoint address.                                |

> [!TIP]
> You can configure the common Azure Service SDK configuration options for the Azure Spring Cloud Stream Event Hubs binder as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](#spring-cloud-azure-configuration). You can configure these options with either the unified prefix `spring.cloud.azure.` or the prefix `spring.cloud.azure.eventhubs.`.

#### Checkpoint configuration properties

These properties are exposed via `com.azure.spring.cloud.autoconfigure.eventhubs.properties.AzureEventHubsProperties.Processor.BlobCheckpointStore` for the configuration of `BlobCheckpointStore`, which is the default implementation of `CheckpointStore` to use Storage Blobs for persisting partition ownership and checkpoint information.

> [!NOTE]
> From version 4.0.0, when the property of **spring.cloud.azure.eventhubs.processor.checkpoint-store.create-container-if-not-exists** isn't enabled manually, no Storage container will be created automatically with the name from **spring.cloud.stream.bindings.binding-name.destination**.

The following table lists the checkpointing configurable properties of `spring-cloud-azure-stream-binder-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                 | Type    | Description                                                               |
> |------------------------------------------------------------------------------------------|---------|---------------------------------------------------------------------------|
> | *spring.cloud.azure.eventhubs.processor.checkpoint-store*.create-container-if-not-exists | Boolean | A value that indicates whether to create a container if it doesn't exist. |
> | *spring.cloud.azure.eventhubs.processor.checkpoint-store*.account-name                   | String  | The name for the storage account.                                         |
> | *spring.cloud.azure.eventhubs.processor.checkpoint-store*.account-key                    | String  | The storage account access key.                                           |
> | *spring.cloud.azure.eventhubs.processor.checkpoint-store*.container-name                 | String  | The storage container name.                                               |

> [!TIP]
> You can configure the common Azure Service SDK configuration options for the Storage Blob checkpoint store as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](#spring-cloud-azure-configuration). You can configure these options with either the unified prefix `spring.cloud.azure.` or the prefix `spring.cloud.azure.eventhubs.processor.checkpoint-store`.

> [!NOTE]
> The default maximum connection pool size of the Storage Blob client is changed from `500` in version 3.x to `16` now, and the pending acquire queue size, which is double of pool size, is now `32`. To override these values, set the property `spring.cloud.azure.eventhubs.processor.checkpoint-store.client.maximum-connection-pool-size`.

#### Azure Event Hubs binding configuration properties

The following sections provide more information about consumer properties, advanced consumer configurations, producer properties, and advanced producer configurations.

##### Azure Event Hubs consumer properties

The following table lists the consumer configurable properties of `spring-cloud-azure-stream-binder-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                                              | Type                             | Description                                                                                                                                                                              |
> |-----------------------------------------------------------------------------------------------------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.mode                                        | CheckpointMode                   | The checkpoint mode used when the consumer decides how to checkpoint a message.                                                                                                          |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.count                                       | Integer                          | The number of messages for each partition for one checkpoint. Will take effect only when the `PARTITION_COUNT` checkpoint mode is used.                                                  |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.interval                                    | Duration                         | The time interval for one checkpoint. Will take effect only when the `TIME` checkpoint mode is used.                                                                                     |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.batch.max-size                                         | Integer                          | The maximum number of events in a batch. Required for the batch-consumer mode.                                                                                                           |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.batch.max-wait-time                                    | Duration                         | The maximum time duration for batch consuming. Will take effect only when the batch-consumer mode is enabled and is optional.                                                            |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.load-balancing.update-interval                         | Duration                         | The time duration interval for updating.                                                                                                                                                 |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.load-balancing.strategy                                | LoadBalancingStrategy            | The load balancing strategy.                                                                                                                                                             |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.load-balancing.partition-ownership-expiration-interval | Duration                         | The time duration after which ownership of the partition expires.                                                                                                                        |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.track-last-enqueued-event-properties                   | Boolean                          | A value that indicates whether the event processor should request information on the last enqueued event on its associated partition, and track that information as events are received. |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.prefetch-count                                         | Integer                          | The count used by the consumer to control the number of events the event hub consumer will actively receive and queue locally.                                                           |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.initial-partition-event-position                       | Map of `StartPositionProperties` | The map containing the event position to use for each partition if a checkpoint for the partition doesn't exist in the checkpoint store. This map is keyed off of the partition ID.      |

##### Advanced consumer configuration

You can customize the [connection](#event-hubs-connection-configration-properties), [checkpoint](#checkpoint-configuration-properties), and [common Azure SDK client](#spring-cloud-azure-configuration) configurations for each binder consumer, which you can configure with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.`.

##### Azure Event Hubs producer properties

The following table lists the producer configurable properties of `spring-cloud-azure-stream-binder-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                    | Type    | Description                                                                                                              |
> |-----------------------------------------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.stream.eventhubs.bindings.binding-name.producer*.sync         | boolean | A value that indicates whether the producer will wait for a response after a send operation.                             |
> | *spring.cloud.stream.eventhubs.bindings.binding-name.producer*.send-timeout | long    | The amount of time to wait for a response after a send operation. Will take effect only when a sync producer is enabled. |

##### Advanced producer configuration

You can customize the [connection](#event-hubs-connection-configration-properties), [checkpoint](#checkpoint-configuration-properties), and [common Azure SDK client](#spring-cloud-azure-configuration) configurations for each binder producer, which you can configure with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.producer.`.

### Basic usage

#### Sending and receiving messages from/to Event Hubs

For this scenario, use these steps:

1. Fill in the configuration options with credential information.

   * For credentials as connection string, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             connection-string: ${EVENTHUB_NAMESPACE_CONNECTION_STRING}
             processor:
               checkpoint-store:
                 container-name: ${CHECKPOINT-CONTAINER}
                 account-name: ${CHECKPOINT-STORAGE-ACCOUNT}
                 account-key: ${CHECKPOINT-ACCESS-KEY}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${EVENTHUB-NAME}
               group: ${CONSUMER-GROUP}
             supply-out-0:
               destination: ${THE-SAME-EVENTHUB-NAME-AS-ABOVE}
           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

   * For credentials as service principal, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${SERVICE_PRINCIPAL_ID}
             client-secret: ${SERVICE-PRINCIPAL_SECRET}
           profile:
             tenant-id: ${TENANT_ID}
           eventhubs:
             namespace: ${EVENTHUB_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${EVENTHUB_NAME}
               group: ${CONSUMER_GROUP}
             supply-out-0:
               destination: ${THE_SAME_EVENTHUB_NAME_AS_ABOVE}
           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

   * For credentials as MSI, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-client-id: ${AZURE_MANAGED_IDENTITY_CLIENT_ID}
           eventhubs:
             namespace: ${EVENTHUB-NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER-NAME}
                 account-name: ${ACCOUNT-NAME}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${EVENTHUB_NAME}
               group: ${CONSUMER_GROUP}
             supply-out-0:
               destination: ${THE_SAME_EVENTHUB_NAME_AS_ABOVE}
     
           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

1. Write code to define supplier and consumer, as shown in the following example:

   ```java
   @Bean
   public Consumer<Message<String>> consume() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
               message.getPayload(),
               message.getHeaders().get(EventHubsHeaders.PARTITION_KEY),
               message.getHeaders().get(EventHubsHeaders.SEQUENCE_NUMBER),
               message.getHeaders().get(EventHubsHeaders.OFFSET),
               message.getHeaders().get(EventHubsHeaders.ENQUEUED_TIME)
           );
   
           checkpointer.success()
           .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
           .doOnError(error -> LOGGER.error("Exception found", error))
           .subscribe();
       };
   }
   
   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("Hello world, " + i++).build();
       };
   }
   ```

#### Partitioning support

A `PartitionSupplier` with user-provided partition information will be created to configure the partition information about the message to be sent. The following diagram shows the process of obtaining the different priorities of the partition ID and key:

:::image type="content" source="media/spring-cloud-azure/flowchart-partitioning-support.png" alt-text="Flowchart showing the partitioning support process." border="false":::

#### Batch consumer support

For this scenario, use these steps:

1. Fill in the batch configuration options:

   ```yaml
   spring:
     cloud:
       stream:
         function:
           definition: consume
         bindings:
           consume-in-0:
             destination: ${AZURE_EVENTHUB_NAME}
             group: ${AZURE_EVENTHUB_CONSUMER_GROUP}
             consumer:
               batch-mode: true
         eventhubs:
           bindings:
             consume-in-0:
               consumer:
                 batch:
                   max-batch-size: 10 # Required for batch-consumer mode
                   max-wait-time: 1m # Optional, the default value is null
                 checkpoint:
                   mode: BATCH # or MANUAL as needed
   ```

1. Write code to define supplier and consumer. For checkpointing mode as `BATCH`, you can use the following code to send messages and consume in batches:

   ```java
   @Bean
   public Consumer<Message<List<String>>> consume() {
       return message -> {
           for (int i = 0; i < message.getPayload().size(); i++) {
               LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                   message.getPayload().get(i),
                   ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_PARTITION_KEY)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_SEQUENCE_NUMBER)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_OFFSET)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_ENQUEUED_TIME)).get(i));
           }
       };
   }
   
   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("\"test"+ i++ +"\"").build();
       };
   }
   ```

   For checkpointing mode as `MANUAL`, you can use the following code to send messages and consume/checkpoint in batches:

   ```java
   @Bean
   public Consumer<Message<List<String>>> consume() {
       return message -> {
           for (int i = 0; i < message.getPayload().size(); i++) {
               LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                   message.getPayload().get(i),
               ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_PARTITION_KEY)).get(i),
               ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_SEQUENCE_NUMBER)).get(i),
               ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_OFFSET)).get(i),
               ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_ENQUEUED_TIME)).get(i));
           }
       
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           checkpointer.success()
           .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
           .doOnError(error -> LOGGER.error("Exception found", error))
           .subscribe();
       };
   }
   
   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("\"test"+ i++ +"\"").build();
       };
   }
   ```

> [!NOTE]
> In the batch-consuming mode, the default content type of Spring Cloud Stream binder is `application/json`, so be sure the message payload is aligned with the content type. For example, when using the default content type of `application/json` to receive messages with `String` payload, the payload should be JSON String, surrounded with double quotes for the original String text. While for `text/plain` content type, it can be a `String` object directly. For more information, see [Spring Cloud Stream Content Type Negotiation](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#content-type-management) in the Spring documentation.

#### Error channels

The following list describes the error channels:

* Consumer error channel

  This channel is open by default. You can handle the error message as shown in the following example:

  ```java
  // Replace destination with spring.cloud.stream.bindings.input.destination
  // Replace group with spring.cloud.stream.bindings.input.group
  @ServiceActivator(inputChannel = "{destination}.{group}.errors")
  public void consumerError(Message<?> message) {
      LOGGER.error("Handling customer ERROR: " + message);
  }
  ```

* Producer error channel

  This channel isn't open by default. You need to add a configuration in your *application.properties* file to enable it.

  ```properties
  spring.cloud.stream.default.producer.errorChannelEnabled=true
  ```

  You can handle the error message as shown in the following example:

  ```java
  // Replace destination with spring.cloud.stream.bindings.output.destination
  @ServiceActivator(inputChannel = "{destination}.errors")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling Producer ERROR: " + message);
  }
  ```

* Global default error channel

  A global error channel called "errorChannel" is created by default Spring Integration, which allows users to subscribe many endpoints to it.

  ```java
  @ServiceActivator(inputChannel = "errorChannel")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling ERROR: " + message);
  }
  ```

<a name="spring-cloud-stream-binder-event-hubs-message-headers"></a>
#### Event Hubs message headers

For the basic message headers supported, see [Event Hubs message headers](#spring-integration-event-hubs-message-headers) in the [Spring Integration with Azure Event Hubs](#spring-integration-with-azure-event-hubs) section.

When the `batch-consumer` mode is enabled, the specific headers of batched messages are listed as shown in the table below. This table contains a list of values from each single Event Hubs event.

The following table shows the mappings between Batch Event Hubs properties and Spring headers:

> [!div class="mx-tdBreakAll"]
> | Event Hubs Event Properties | Spring Batch Message Header Constants                                                      | Type            | Description                                                                                                            |
> |-----------------------------|--------------------------------------------------------------------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------|
> | Enqueued time               | com.azure.spring.eventhubs.support.EventHubsHeaders#BATCH_CONVERTED_ENQUEUED_TIME          | List of Instant | List of the instant, in UTC, when each event was enqueued in the event hub partition.                                  |
> | Offset                      | com.azure.spring.eventhubs.support.EventHubsHeaders#BATCH_CONVERTED_OFFSET                 | List of Long    | List of the offset of each event when it was received from the associated event hub partition.                         |
> | Partition key               | com.azure.spring.messaging.AzureHeaders#BATCH_CONVERTED_PARTITION_KEY                      | List of String  | List of the partition hashing key if it was set when originally publishing each event.                                 |
> | Sequence number             | com.azure.spring.eventhubs.support.EventHubsHeaders#BATCH_CONVERTED_SEQUENCE_NUMBER        | List of Long    | List of the sequence number assigned to each event when it was enqueued in the associated event hub partition.         |
> | System properties           | com.azure.spring.eventhubs.support.EventHubsHeaders#BATCH_CONVERTED_SYSTEM_PROPERTIES      | List of Map     | List of the system properties of each event.                                                                           |
> | Application properties      | com.azure.spring.eventhubs.support.EventHubsHeaders#BATCH_CONVERTED_APPLICATION_PROPERTIES | List of Map     | List of the application properties of each event, where all customized message headers or event properties are placed. |

> [!NOTE]
> When publish messages, all the above batch headers if exist will be removed from the messages to send.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/eventhubs/spring-cloud-azure-stream-binder-eventhubs) on GitHub.

## Spring Cloud Stream Binder for Azure Service Bus

### Key concepts

The Spring Cloud Stream Binder for Azure Service Bus provides the binding implementation for the Spring Cloud Stream Framework. This implementation uses Spring Integration Service Bus Channel Adapters at its foundation.

#### Scheduled message

This binder supports submitting messages to a topic for delayed processing. Users can send scheduled messages with header `x-delay` expressing in milliseconds a delay time for the message. The message will be delivered to the respective topics after `x-delay` milliseconds.

#### Consumer group

Service Bus Topic provides similar support of the consumer group as Apache Kafka, but with slightly different logic. This binder relies on `Subscription` of a topic to act as a consumer group.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
</dependency>
```

Alternatively, you can also use the Azure Spring Cloud Stream Service Bus Starter, as shown in the following example for Maven:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-stream-servicebus</artifactId>
</dependency>
```

### Configuration

The following sections describe the configuration options.

<a name="service-bus-connection-configration-properties"></a>
#### Connection configuration properties

These properties are exposed via `com.azure.spring.cloud.autoconfigure.servicebus.properties.AzureServiceBusProperties`.

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the common configurable properties of `spring-cloud-azure-stream-binder-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Property                                          | Type    | Description                                                     |
> |---------------------------------------------------|---------|-----------------------------------------------------------------|
> | *spring.cloud.azure.servicebus*.enabled           | boolean | A value that indicates whether an Azure Service Bus is enabled. |
> | *spring.cloud.azure.servicebus*.connection-string | String  | The Service Bus Namespace connection string value.              |
> | *spring.cloud.azure.servicebus*.namespace         | String  | The Service Bus Namespace value.                                |
> | *spring.cloud.azure.servicebus*.domain-name       | String  | The domain name of an Azure Service Bus Namespace value.        |

> [!TIP]
> You can configure the common Azure Service SDK configuration options for the Azure Spring Cloud Stream Service Bus binder as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](#spring-cloud-azure-configuration). You can configure these options with either the unified prefix `spring.cloud.azure.` or the prefix `spring.cloud.azure.servicebus.`.

#### Azure Service Bus binding configuration properties

The following sections provide more information about consumer properties, advanced consumer configurations, producer properties, and advanced producer configurations.

##### Azure Service Bus consumer properties

The following table lists the consumer configurable properties of `spring-cloud-azure-stream-binder-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                     | Type                  | Description                                                                                     |
> |----------------------------------------------------------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.requeue-rejected             | boolean               | A value that indicates whether the failed messages are routed to the DLQ.                       |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.checkpoint-mode              | CheckpointMode        | The checkpoint mode of checkpointing message. The supported modes are `MANUAL` and `RECORD`.    |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.max-concurrent-calls         | Integer               | The maximum number of concurrent messages that the Service Bus processor client should process. |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.max-concurrent-sessions      | Integer               | The maximum number of concurrent sessions to process at any given time.                         |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.session-aware                | Boolean               | A value that indicates whether the session is enabled.                                          |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.prefetch-count               | Integer               | The prefetch count of the Service Bus processor client.                                         |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.sub-queue                    | SubQueue              | The type of the sub queue to connect to.                                                        |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.max-auto-lock-renew-duration | Duration              | The amount of time to continue auto-renewing the lock.                                          |
> | *spring.cloud.stream.servicebus.bindings.binding-name.consumer*.receive-mode                 | ServiceBusReceiveMode | The receive mode of the Service Bus processor client.                                           |

##### Advanced consumer configuration

You can customize the [connection](#service-bus-connection-configration-properties) and [common Azure SDK client](#spring-cloud-azure-configuration) configurations for each binder consumer, which you can configure with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.`.

##### Azure Service Bus producer properties

The following table lists the producer configurable properties of `spring-cloud-azure-stream-binder-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                     | Type                 | Description                                                                     |
> |------------------------------------------------------------------------------|----------------------|---------------------------------------------------------------------------------|
> | *spring.cloud.stream.servicebus.bindings.binding-name.producer*.sync         | boolean              | Switch flag for sync of producer.                                               |
> | *spring.cloud.stream.servicebus.bindings.binding-name.producer*.send-timeout | long                 | The timeout value for sending of producer.                                      |
> | *spring.cloud.stream.servicebus.bindings.binding-name.producer*.entity-type  | ServiceBusEntityType | The Service Bus entity type of the producer; required for the binding producer. |

> [!IMPORTANT]
> When using the binding producer, property of `spring.cloud.stream.servicebus.bindings.<binding-name>.producer.entity-type` is required to be configured.

##### Advanced producer configuration

You can customize the [connection](#service-bus-connection-configration-properties) and [common Azure SDK client](#spring-cloud-azure-configuration) configurations for each binder producer, which you can configure with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.producer.`.

### Basic usage

#### Sending and receiving messages from/to Service Bus

For this scenario, use these steps:

1. Fill in the configuration options with credential information.

   * For credentials as connection string, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           servicebus:
             connection-string: ${SERVICEBUS_NAMESPACE_CONNECTION_STRING}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${SERVICEBUS_ENTITY_NAME}
               # If you use Service Bus Topic, add the following configuration
               # group: ${SUBSCRIPTION_NAME}
             supply-out-0:
               destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
           servicebus:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint-mode: MANUAL
               supply-out-0:
                 producer:
                   entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

   * For credentials as service principal, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${CLIENT_ID}
             client-secret: ${CLIENT_SECRET}
           profile:
             tenant-id: ${TENANT_ID}
           servicebus:
             namespace: ${SERVICEBUS_NAMESPACE}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${SERVICEBUS_ENTITY_NAME}
               # If you use Service Bus Topic, add the following configuration
               # group: ${SUBSCRIPTION_NAME}
             supply-out-0:
               destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
           servicebus:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint-mode: MANUAL
               supply-out-0:
                 producer:
                   entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

   * For credentials as MSI, add the following properties to your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-client-id: ${MANAGED_IDENTITY_CLIENT_ID}
           servicebus:
             namespace: ${SERVICEBUS_NAMESPACE}
         stream:
           function:
             definition: consume;supply
           bindings:
             consume-in-0:
               destination: ${SERVICEBUS_ENTITY_NAME}
               # If you use Service Bus Topic, add the following configuration
               # group: ${SUBSCRIPTION_NAME}
             supply-out-0:
               destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
           servicebus:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint-mode: MANUAL
               supply-out-0:
                 producer:
                   entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

1. Write code to define supplier and consumer, as shown in the following example:

   ```java
   @Bean
   public Consumer<Message<String>> consume() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
               message.getPayload(),
               message.getHeaders().get(EventHubsHeaders.PARTITION_KEY),
               message.getHeaders().get(EventHubsHeaders.SEQUENCE_NUMBER),
               message.getHeaders().get(EventHubsHeaders.OFFSET),
               message.getHeaders().get(EventHubsHeaders.ENQUEUED_TIME)
           );
       
           checkpointer.success()
                       .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                       .doOnError(error -> LOGGER.error("Exception found", error))
                       .subscribe();
       };
   }
   
   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("Hello world, " + i++).build();
       };
   }
   ```

#### Partition key support

The binder supports [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning) by allowing setting partition key and session ID in the message header. This section describes how to set the partition key for messages.

Spring Cloud Stream provides a partition key SpEL expression property `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression`. For example, you can set this property to `&quot;&#39;partitionKey-&#39; + headers[&lt;message-header-key&gt;]&quot;` and add a header called `message-header-key`. Spring Cloud Stream will use the value for this header when evaluating the above expression to assign a partition key. Here's a producer example:

```java
@Bean
public Supplier<Message<String>> generate() {
    return () -> {
        String value = “random payload”;
        return MessageBuilder.withPayload(value)
                             .setHeader("<message-header-key>", value.length() % 4)
                             .build();
    };
}
```

#### Session support

The binder supports [message sessions](/azure/service-bus-messaging/message-sessions) of Service Bus. You can set the session ID of a message via the message header, as shown in the following example:

```java
@Bean
public Supplier<Message<String>> generate() {
    return () -> {
        String value = “random payload”;
        return MessageBuilder.withPayload(value)
                             .setHeader(ServiceBusMessageHeaders.SESSION_ID, "Customize session ID")
                             .build();
    };
}
```

> [!NOTE]
> According to [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning), session ID has a higher priority than partition key. So when both of `ServiceBusMessageHeaders#SESSION_ID` and `ServiceBusMessageHeaders#PARTITION_KEY` (or `AzureHeaders#PARTITION_KEY`) headers are set, the value of the session ID will eventually be used to overwrite the value of the partition key.

#### Error channels

The following list describes the error channels:

* Consumer error channel

  This channel is open by default, and a default consumer error channel handler is used to send failed messages to the dead-letter queue when `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.requeue-rejected` is enabled, otherwise the failed messages will be abandoned.

  To customize the consumer error channel handler, you can register your own error handler to the related consumer error channel in this way:

  ```java
  // Replace destination with spring.cloud.stream.bindings.input.destination
  // Replace group with spring.cloud.stream.bindings.input.group
  @ServiceActivator(inputChannel = "{destination}.{group}.errors")
  public void consumerError(Message<?> message) {
      LOGGER.error("Handling customer ERROR: " + message);
  }
  ```

* Producer error channel

  This channel isn't open by default. You need to add a configuration in your *application.properties* file to enable it, like this:

  ```properties
  spring.cloud.stream.default.producer.errorChannelEnabled=true
  ```

  You can handle the error message in this way:

  ```java
  // Replace destination with spring.cloud.stream.bindings.output.destination
  @ServiceActivator(inputChannel = "{destination}.errors")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling Producer ERROR: " + message);
  }
  ```

* Global default error channel

  A global error channel called `errorChannel` is created by default Spring Integration, which allows users to subscribe many endpoints to it.

  ```java
  @ServiceActivator(inputChannel = "errorChannel")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling ERROR: " + message);
  }
  ```

#### Service Bus message headers

For the basic message headers supported, see [Service Bus message headers](#spring-integration-service-bus-message-headers) in the [Spring Integration with Azure Service Bus](#spring-integration-with-azure-service-bus) section.

> [!NOTE]
> When setting the partiton key, the priority of message header is higher than Spring Cloud Stream property. So `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression` will take effect only when none of the headers of `ServiceBusMessageHeaders#SESSION_ID`, `ServiceBusMessageHeaders#PARTITION_KEY`, `AzureHeaders#PARTITION_KEY` is configured.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/servicebus/spring-cloud-azure-stream-binder-servicebus) on GitHub.

## Spring JMS support

This section describes how to use Azure Service Bus by the JMS API integrated into the Spring JMS framework. You must provide an Azure Service Bus connection string, which is to be parsed into the login username, password, and remote URI for the AMQP broker.

### Dependency setup

Add the following dependencies if you want to migrate your Spring JMS application to use Azure Service Bus.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
</dependency>
```

<a name="spring-jms-support-configuration"></a>
### Configuration

The following table lists the configurable properties when using the Spring JMS support:

> [!div class="mx-tdBreakAll"]
> | Property                                                       | Description                                                                                                                  |
> |----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
> | *spring.jms.servicebus*.connection-string                      | The Azure Service Bus connection string. Should be provided when you want to provide the connection string directly.         |
> | *spring.jms.servicebus*.topic-client-id                        | The JMS clientID. Only works for the `topicJmsListenerContainerFactory` bean.                                                |
> | *spring.jms.servicebus*.idle-timeout                           | The idle duration.                                                                                                           |
> | *spring.jms.servicebus*.pricing-tier                           | The Azure Service Bus Price Tier.                                                                                            |
> | *spring.jms.servicebus*.listener.reply-pub-sub-domain          | A value that indicates whether the reply destination type is *topic*.                                                        |
> | *spring.jms.servicebus*.listener.phase                         | The phase in which this container should be started and stopped.                                                             |
> | *spring.jms.servicebus*.listener.reply-qos-settings            | Configures the `QosSettings` to use when sending a reply.                                                                    |
> | *spring.jms.servicebus*.listener.subscription-durable          | A value that indicates whether to make the subscription durable. Only works for the `topicJmsListenerContainerFactory` bean. |
> | *spring.jms.servicebus*.listener.subscription-shared           | A value that indicates whether to make the subscription shared. Only works for the `topicJmsListenerContainerFactory` bean.  |
> | *spring.jms.servicebus*.password                               | The login password of the AMQP broker.                                                                                       |
> | *spring.jms.servicebus*.pool.block-if-full                     | A value that indicates whether to block when a connection is requested and the pool is full.                                 |
> | *spring.jms.servicebus*.pool.block-if-full-timeout             | The blocking period before throwing an exception if the pool is still full.                                                  |
> | *spring.jms.servicebus*.pool.enabled                           | A value that indicates whether a `JmsPoolConnectionFactory` should be created instead of a `regularConnectionFactory`.       |
> | *spring.jms.servicebus*.pool.idle-timeout                      | The connection idle timeout.                                                                                                 |
> | *spring.jms.servicebus*.pool.max-connections                   | The maximum number of pooled connections.                                                                                    |
> | *spring.jms.servicebus*.pool.max-sessions-per-connection       | The maximum number of pooled sessions per connection in the pool.                                                            |
> | *spring.jms.servicebus*.pool.time-between-expiration-check     | The time to sleep between runs of the idle connection eviction thread.                                                       |
> | *spring.jms.servicebus*.pool.use-anonymous-producers           | A value that indicates whether to use only one anonymous `MessageProducer` instance.                                         |
> | *spring.jms.servicebus*.prefetch-policy.all                    | The fallback value for the prefetch option in this Service Bus namespace.                                                    |
> | *spring.jms.servicebus*.prefetch-policy.durable-topic-prefetch | The number of prefetch messages for a durable topic.                                                                         |
> | *spring.jms.servicebus*.prefetch-policy.queue-browser-prefetch | The number of prefetch messages for a queue browser.                                                                         |
> | *spring.jms.servicebus*.prefetch-policy.queue-prefetch         | The number of prefetch messages for a queue.                                                                                 |
> | *spring.jms.servicebus*.prefetch-policy.topic-prefetch         | The number of prefetch messages for a topic.                                                                                 |
> | *spring.jms.servicebus*.remote-url                             | The URL of the AMQP broker.                                                                                                  |
> | *spring.jms.servicebus*.username                               | The login user of the AMQP broker.                                                                                           |

> [!NOTE]
> To keep it simple, this table omits the Spring JMS general configuration. For more information, see [JMS (Java Message Service)](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/jms.html) in the Spring documentation.

### Basic usage

#### Use Service Bus connection string

To connect to Service Bus for Spring JMS application, use the connection string by adding the following properties:

```yaml
spring:
  jms:
    servicebus:
      connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
      pricing-tier: ${PRICING_TIER}
```

> [!NOTE]
> The default enabled `ConnectionFactory` is the `CachingConnectionFactory`, which adds `Session` caching as well `MessageProducer` caching. If you want to activate the connection pooling feature of `JmsPoolConnectionFactory`, set the `*spring.jms.servicebus*.pool.enabled` property to *true*. You can find the other pooling configuration options (with the `*spring.jms.servicebus*.pool.*` prefix) in the previous [Configuration](#spring-jms-support-configuration) section.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0/servicebus/spring-cloud-azure-starter-servicebus-jms) on GitHub.

## Kafka support

Connect to Azure Event Hubs using Spring Kafka libraries. (Note that [Basic pricing tier isn't supported](https://azure.microsoft.com/pricing/details/event-hubs/#explore-pricing-options).) There are two approaches to connect to Azure Event Hubs for Kafka. The first approach is to provide the Azure Event Hubs connection string directly. The second approach is to use Azure Resource Manager to retrieve the connection string.

### Dependency setup

Add the following dependency if you want to migrate your Apache Kafka application to use Azure Event Hubs for Kafka:

```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

If you want to retrieve the connection string using Azure Resource Manager, add the following dependency also:

```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-resourcemanager</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties when using the Kafka support:

> [!div class="mx-tdBreakAll"]
> | Property                                               | Description                                                                                                                                                   |
> |--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.eventhubs*.kafka.enabled           | A value that indicates whether to enable the Azure Event Hubs Kafka support. The default value is *true*.                                                     |
> | *spring.cloud.azure.eventhubs*.connection-string       | The Azure Event Hubs connection string. Should be provided when you want to provide the connection string directly.                                           |
> | *spring.cloud.azure.eventhubs*.namespace               | The Azure Event Hubs namespace. Should be provided when you want to retrieve the connection information through Azure Resource Manager.                       |
> | *spring.cloud.azure.eventhubs*.resource.resource-group | The resource group of the Azure Event Hubs namespace. Should be provided when you want to retrieve the connection information through Azure Resource Manager. |
> | *spring.cloud.azure*.profile.subscription-id           | The subscription ID. Should be provided when you want to retrieve the connection information through Azure Resource Manager.                                  |

> [!NOTE]
> Authentication information is also required for authenticating for Azure Resource Manager. The credential related configurations of Resource Manager should be configured under prefix `spring.cloud.azure`. For more information, see [Spring Cloud Azure authentication](#spring-cloud-azure-authentication).

### Basic usage

#### Use Event Hubs connection string

The simplest way to connect to Event Hubs for Kafka is with the connection string. To do this, add the following properties:

```yaml
spring:
  cloud:
    azure:
      eventhubs:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
```

#### Use Azure Resource Manager to retrieve connection string

If you don't want to configure connection string in your application, it's also possible to use Azure Resource Manager to retrieve the connection string. You can use credentials stored in Azure CLI or other local development tool, like Visual Studio Code or Intellij IDEA to authenticate with Azure Resource Manager. You can also use Managed Identity if your application is deployed to Azure Cloud. Just be sure the principal has sufficient permission to read resource metadata.

Add the following properties:

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

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Redis support

Connect to Azure Cache for Redis using Spring Redis libraries. By adding `spring-cloud-azure-starter` and `spring-cloud-azure-resourcemanager` to your application, it's possible to read the Azure Cache for Redis connection information through Azure Resource Manager and auto-configure the Redis properties.

### Dependency setup

Add the following dependencies if you want to use the Spring Cloud Azure Redis support to your Spring Boot application using Redis.

```xml
<dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-resourcemanager</artifactId>
    </dependency>
</dependencies>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties when using the Redis support:

> [!div class="mx-tdBreakAll"]
> | Property                                           | Description                                                                                       |
> |----------------------------------------------------|---------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.redis*.enabled                 | A value that indicates whether the Azure Cache for Redis is enabled. The default value is *true*. |
> | *spring.cloud.azure.redis*.name                    | *Required*. Azure Cache for Redis instance name.                                                  |
> | *spring.cloud.azure.redis*.resource.resource-group | *Required*. The resource group of Azure Cache for Redis.                                          |
> | *spring.cloud.azure*.profile.subscription-id       | *Required*. The subscription ID.                                                                  |

> [!NOTE]
> Authentication information is also required for authenticating for Azure Resource Manager. The credential related configurations of Resource Manager should be configured under prefix `spring.cloud.azure`. For more information, see [Spring Cloud Azure authentication](#spring-cloud-azure-authentication).

### Basic usage

Add the following properties:

```properties
spring.cloud.azure.redis.name=${AZURE_CACHE_REDIS_NAME}
spring.cloud.azure.redis.resource.resource-group=${AZURE_CACHE_REDIS_RESOURCE_GROUP}
```

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Resource Manager

Connect to Azure resources for all Azure SDKs services that Spring Cloud uses. Construct `TokenCredential` by using various credential information, and then construct `AzureResourceManager` to help the Azure SDKs clients to authenticate and authorize.

### Dependency setup

```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-resourcemanager</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

The following table lists the configurable properties of `spring-cloud-azure-resourcemanager`:

> [!div class="mx-tdBreakAll"]
> | Property                                                           | Description                                                                                            |
> |--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.resource-manager*.enabled                      | A value that indicates whether the Resource Manager is enabled. The default value is *true*.           |
> | *spring.cloud.azure.credential*.client-certificate-password        | The password of the certificate file.                                                                  |
> | *spring.cloud.azure.credential*.client-certificate-path            | The path of a PEM certificate file to use when performing service principal authentication with Azure. |
> | *spring.cloud.azure.credential*.client-id                          | The client ID to use when performing service principal authentication with Azure.                      |
> | *spring.cloud.azure.credential*.client-secret                      | The client secret to use when performing service principal authentication with Azure.                  |
> | *spring.cloud.azure.credential*.managed-identity-client-id         | The client ID to use when using managed identity to authenticate with Azure.                           |
> | *spring.cloud.azure.credential*.username                           | The username to use when performing username/password authentication with Azure.                       |
> | *spring.cloud.azure.credential*.password                           | The password to use when performing username/password authentication.                                  |
> | *spring.cloud.azure.profile*.cloud                                 | The name of the Azure cloud to connect to.                                                             |
> | *spring.cloud.azure.profile*.environment.active-directory-endpoint | The Azure Active Directory endpoint to connect to for authentication.                                  |
> | *spring.cloud.azure.profile*.subscription-id                       | The subscription ID to use when connecting to Azure resources.                                         |
> | *spring.cloud.azure.profile*.tenant-id                             | The tenant ID for Azure resources.                                                                     |

### Basic usage

Azure Resource Manager helps the Azure SDK client to complete authentication and authorization. You can integrate Azure Resource Manager into a specific Spring Cloud Azure Starter to work together, or you can use it with Spring Cloud Azure auto-configuration modules and third-party libraries to complete authentication. For more information, see [Kafka Support](#kafka-support) and [Redis Support](#redis-support).

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.0.0) on GitHub.

## Configuration properties

For the list of all Spring Cloud Azure configuration properties, see [List of configuration properties](spring-cloud-azure-appendix.md#list-of-configuration-properties).

## Appendix

* [Configuration properties](spring-cloud-azure-appendix.md#configuration-properties)
* [Migration guide for 4.0](spring-cloud-azure-appendix.md#migration-guide-for-40)

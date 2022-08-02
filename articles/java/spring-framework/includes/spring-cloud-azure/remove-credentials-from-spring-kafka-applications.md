---
author: KarlErickson
ms.author: v-yonghuiye
ms.date: 07/26/2022
---

### Remove credentials from Spring Kafka applications

You can use the Event Hubs Kafka endpoint in your Spring Kafka application. From Spring Cloud Azure 4.3.0, you can configure and run your application without credentials. This article is a migration guide for removing credentials from Spring Kafka applications.

#### Update dependencies

First, add the `spring-cloud-azure-dependencies` BOM, as shown in the following example:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>${version.spring.cloud.azure}</version> <!-- The version for spring-cloud-azure-dependencies is 4.3.0+. -->
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

Then, add the Spring Cloud Azure starter, as shown in the following example:

```xml
<dependencies>
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
</dependencies>
```

#### Update configuration

If you're using Spring Kafka, remove the following options if you have customized values:

- `spring.kafka.security.protocol`
- `spring.kafka.security.properties.sasl.mechanism`
- `spring.kafka.security.properties.sasl.jaas.config`

The final configuration should look like the following example:

```properties
spring.kafka.bootstrap-servers=<NAMESPACENAME>.servicebus.windows.net:9093
```

If you're using Spring Cloud Stream Binder Kafka, remove the following options if you have customized values:

- `spring.kafka.security.protocol`
- `spring.kafka.security.properties.sasl.mechanism`
- `spring.kafka.security.properties.sasl.jaas.config`
- `spring.cloud.stream.kafka.configuration.security.protocol`
- `spring.cloud.stream.kafka.configuration.sasl.mechanism`
- `spring.cloud.stream.kafka.configuration.sasl.jaas.config`

Then, add the following option:

- `spring.cloud.stream.binders.kafka.environment.spring.main.sources`

The final configuration should look like the following example:

```properties
spring.cloud.stream.kafka.binder.brokers=<NAMESPACENAME>.servicebus.windows.net:9093
spring.cloud.stream.binders.kafka.environment.spring.main.sources=com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration
```

> [!NOTE]
> The `spring.cloud.stream.binders.kafka.environment.spring.main.sources` option is used to specify the additional configuration of `KafkaBinderConfigurationPropertiesBeanPostProcessor` specifying the OAuth security parameters for the particular binder.

#### Run locally

##### Grant permissions

With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user or an application service principal.

Because Azure Event Hubs supports Azure role-based access control, you need to assign the corresponding data plane roles to the security principal you use when you want to read or write data to it. In this article, you'll use an Azure CLI credential to connect to Azure Event Hubs, so you need to assign roles to an Azure CLI account. For more information about assigning access roles, see [Authorize access to Event Hubs resources using Azure Active Directory](/azure/event-hubs/authorize-access-azure-active-directory).

> [!NOTE]
> For data access, set the data plane access role: Azure Event Hubs Data Sender and Azure Event Hubs Data Receiver.

##### Sign in to your Azure account

To use the Azure CLI credential, first use the Azure CLI command `az login` to sign in. Then, build and test your application.

> [!NOTE]
> If you want to use other local environment credentials, for example with IntelliJ, see [Spring Cloud Azure Authentication](/azure/developer/java/spring-framework/spring-cloud-azure#spring-cloud-azure-authentication).

#### Deploy to Azure Spring Apps

This section describes how to run the application locally. In production, you can deploy the application to Azure hosting environments like Azure Spring Apps.

##### Create and configure managed identity

To connect with managed identities, enable the managed identity on Azure Spring Apps and grant the access permissions. For more information, see [Create and configure a managed identity on Azure hosting services](../../spring-cloud-azure-appendix.md#create-and-configure-a-managed-identity-on-azure-hosting-services). For information on how to assign roles to the managed identity, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!NOTE]
> For data access, set the data plane access role: Azure Event Hubs Data Sender and Azure Event Hubs Data Receiver.

##### Deploy to Azure Spring Apps

For more information, see [Deploy application to Azure hosting services](../../spring-cloud-azure-appendix.md#deploy-application-to-azure-hosting-services).

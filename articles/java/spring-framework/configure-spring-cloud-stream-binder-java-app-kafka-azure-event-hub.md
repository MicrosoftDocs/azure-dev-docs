---
title: Use Spring Kafka with Azure Event Hubs for Kafka API
description: Shows you how to configure a Java-based Spring Cloud Stream Binder to use Apache Kafka with Azure Event Hubs. 
services: event-hubs
ms.date: 11/16/2022
ms.service: event-hubs
ms.topic: article
ms.custom: devx-track-java, passwordless-java, spring-cloud-azure
---

# Use Spring Kafka with Azure Event Hubs for Kafka API

This article shows you how to configure a Java-based Spring Cloud Stream Binder to use Azure Event Hubs for Kafka for sending and receiving messages with Azure Event Hubs. For more information, see [Use Azure Event Hubs from Apache Kafka applications](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)

In this article, we include two authentication methods: [Azure Active Directory (Azure AD) authentication](/azure/event-hubs/authenticate-application) and [Shared Access Signatures (SAS) authentication](/azure/event-hubs/authenticate-shared-access-signature). The **Passwordless** tab shows the Azure AD authentication and the **Connection string** tab shows the SAS authentication.

Azure AD authentication is a mechanism for connecting to Azure Event Hubs for Kafka using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

SAS authentication uses the connection string of your Azure Event Hubs namespace for the delegated access to Event Hubs for Kafka. If you choose to use Shared Access Signatures as credentials, you need to manage the connection string by yourself.

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [Azure CLI](/cli/azure/install-azure-cli) 2.37.0 or higher required. We recommend Azure Cloud Shell so you'll be logged in automatically and have access to all the tools you need.
- If you're using a Windows machine and want to run the samples locally, install and use the latest [Windows Subsystem for Linux (WSL)](/windows/wsl/install).
- A supported [Java Development Kit](../fundamentals/java-support-on-azure.md), version 8 or higher. (17 or higher preferred. A JDK is included in Azure Cloud Shell). We recommend installing the [Microsoft Build of OpenJDK](/java/openjdk/install).
- Apache's [Maven](http://maven.apache.org/), version 3 or later.
- A [Git](https://git-scm.com/downloads) client.
- [cURL](https://curl.haxx.se) or a similar HTTP utility to test functionality.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Prepare the working environment

First, set up some environment variables. In [Azure Cloud Shell](https://shell.azure.com/), run the following commands:

```bash
export AZ_RESOURCE_GROUP=eventhubs-workshop
export AZ_EVENTHUBS_NAMESPACE_NAME=my-eventhubs-namespace
export AZ_EVENTHUB_NAME=my-eventhub
export AZ_LOCATION=<YOUR_AZURE_REGION>
```

Replace the `<YOUR_AZURE_REGION>` placeholder with the Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by using `az account list-locations`.

Next, sign to your Azure account:

```bash
az login
```

Then, use the following command to set your current subscription context. Replace `ssssssss-ssss-ssss-ssss-ssssssssssss` with the GUID for the subscription you want to use with Azure:

```azurecli
az account set --subscription ssssssss-ssss-ssss-ssss-ssssssssssss
```

Run the following command to create a resource group:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION
```

## Create an Azure Event Hubs instance

The following sections describe how to create an Azure Event Hubs namespace and service instance.

### Create an Azure Event Hubs namespace

Run the following command to create the namespace:

```azurecli
az eventhubs namespace create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_EVENTHUBS_NAMESPACE_NAME \
    --location $AZ_LOCATION
```

### Create an Azure Event Hubs instance in your namespace

After your namespace is deployed, run the following command to create an event hub in your namespace.

```azurecli
az eventhubs eventhub create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_EVENTHUB_NAME \
    --namespace-name $AZ_EVENTHUBS_NAMESPACE_NAME
```

### Prepare credentials

#### [Passwordless (Recommended)](#tab/passwordless)

Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal.

If you want to run this sample locally with Azure AD authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

> [!NOTE]
> You need to set the following data plane access roles: `Azure Event Hubs Data Sender` and `Azure Event Hubs Data Receiver`.

To authenticate using the Azure CLI, use the following steps.

1. First, use the following command to get the resource ID for your Azure Event Hubs namespace:

   ```azurecli
   export AZURE_RESOURCE_ID=$(az resource show \
       --resource-group $AZ_RESOURCE_GROUP \
       --name $AZ_EVENTHUBS_NAMESPACE_NAME \
       --resource-type Microsoft.EventHub/Namespaces \
       --query "id" \
       --output tsv)
   ```

1. Second, use the following command to get your user object ID of your Azure CLI user account:

   ```azurecli
   export AZURE_ACCOUNT_ID=$(az ad signed-in-user show \
       --query "id" --output tsv)
   ```

1. Then, use the following commands to assign the `Azure Event Hubs Data Sender` and `Azure Event Hubs Data Receiver` roles to your account.

   ```azurecli
   az role assignment create \
       --assignee $AZURE_ACCOUNT_ID \
       --role "Azure Event Hubs Data Receiver" \
       --scope $AZURE_RESOURCE_ID
   
   az role assignment create \
       --assignee $AZURE_ACCOUNT_ID \
       --role "Azure Event Hubs Data Sender" \
       --scope $AZURE_RESOURCE_ID
   ```

For more information about granting access roles, see [Authorize access to Event Hubs resources using Azure Active Directory](/azure/event-hubs/authorize-access-azure-active-directory).

#### [Connection string](#tab/connection-string)

Run the following command to get the connection string of your Event Hubs namespace.

```azurecli
export AZ_EVENTHUBS_CONNECTION_STRING=$(az eventhubs namespace authorization-rule keys list \
    --resource-group $AZ_RESOURCE_GROUP \
    --namespace-name $AZ_EVENTHUBS_NAMESPACE_NAME \
    --name RootManageSharedAccessKey \
    --query "primaryConnectionString" \
    --output tsv)
```

---

## Code the application

### Generate the application by using Spring Initializr

Generate the application on the command line by using the following command:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=web,kafka,cloud-stream,azure-support -d baseDir=azure-eventhubs-workshop -d bootVersion=2.7.8 -d javaVersion=8 | tar -xzvf -
```

### Configure Spring Boot to use Azure Event Hubs for Kafka

Open the *src/main/resources/application.properties* file, then add the following contents:

#### [Passwordless (Recommended)](#tab/passwordless)

```properties
spring.cloud.stream.kafka.binder.brokers=${AZ_EVENTHUBS_NAMESPACE_NAME}.servicebus.windows.net:9093
spring.cloud.stream.function.definition=consume;supply
spring.cloud.stream.bindings.consume-in-0.destination=${AZ_EVENTHUB_NAME}
spring.cloud.stream.bindings.consume-in-0.group=$Default
spring.cloud.stream.bindings.supply-out-0.destination=${AZ_EVENTHUB_NAME}
```

> [!NOTE]
> If you're using version `spring-cloud-azure-dependencies:4.3.0`, then you should add the property `spring.cloud.stream.binders.<kafka-binder-name>.environment.spring.main.sources` with the value `com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration`.
>
> Since `4.4.0`, this property will be added automatically, so there's no need to add it manually.

The following table describes the fields in the configuration:

| Field                                                   | Description                                                                                                                                                                                  |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spring.cloud.stream.kafka.binder.brokers`              | Specifies the Azure Event Hubs endpoint.                                                                                                                                                     |
| `spring.cloud.stream.bindings.consume-in-0.destination` | Specifies the input destination event hub, which for this tutorial is the hub you created earlier.                                                                                           |
| `spring.cloud.stream.bindings.consume-in-0.group `      | Specifies a Consumer Group from Azure Event Hubs, which you can set to `$Default` in order to use the basic consumer group that was created when you created your Azure Event Hubs instance. |
| `spring.cloud.stream.bindings.supply-out-0.destination` | Specifies the output destination event hub, which for this tutorial is the same as the input destination.                                                                                    |

#### [Connection string](#tab/connection-string)

```properties
spring.cloud.azure.eventhubs.connection-string=${AZ_EVENTHUBS_CONNECTION_STRING}
spring.cloud.stream.function.definition=consume;supply
spring.cloud.stream.bindings.consume-in-0.destination=${AZ_EVENTHUB_NAME}
spring.cloud.stream.bindings.consume-in-0.group=$Default
spring.cloud.stream.bindings.supply-out-0.destination=${AZ_EVENTHUB_NAME}

```

> [!NOTE]
> Support of connection string credentials has been deprecated from version `4.3.0`.

The following table describes the fields in the configuration:

| Field                                                   | Description                                                                                                                                                                                  |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spring.cloud.azure.eventhubs.connection-string`        | Specifies the connection string of your Azure Event Hubs namespace.                                                                                                                          |
| `spring.cloud.stream.bindings.consume-in-0.destination` | Specifies the input destination event hub, which for this tutorial is the hub you created earlier.                                                                                           |
| `spring.cloud.stream.bindings.consume-in-0.group `      | Specifies a Consumer Group from Azure Event Hubs, which you can set to `$Default` in order to use the basic consumer group that was created when you created your Azure Event Hubs instance. |
| `spring.cloud.stream.bindings.supply-out-0.destination` | Specifies the output destination event hub, which for this tutorial is the same as the input destination.                                                                                    |

---

> [!NOTE]
> If you enable automatic topic creation, be sure to add the configuration item `spring.cloud.stream.kafka.binder.replicationFactor`, with the value set to at least *1*. For more information, see [Spring Cloud Stream Kafka Binder Reference Guide](https://docs.spring.io/spring-cloud-stream-binder-kafka/docs/3.1.2/reference/html/spring-cloud-stream-binder-kafka.html).

### Produce and consume messages

Next, add the Java code that will send and receive events with your event hub.

#### Modify the main application class

Open the main application Java file in a text editor, and add the following lines to the file:

```java
package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.function.Consumer;
import java.util.function.Supplier;

@SpringBootApplication
public class DemoApplication {

    private static final Logger LOGGER = LoggerFactory.getLogger(DemoApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public Sinks.Many<Message<String>> many() {
        return Sinks.many().unicast().onBackpressureBuffer();
    }

    @Bean
    public Supplier<Flux<Message<String>>> supply(Sinks.Many<Message<String>> many) {
        return () -> many.asFlux()
                         .doOnNext(m -> LOGGER.info("Manually sending message {}", m))
                         .doOnError(t -> LOGGER.error("Error encountered", t));
    }

    @Bean
    public Consumer<Message<String>> consume() {
        return message -> LOGGER.info("New message received: '{}'", message.getPayload());
    }
}
```

#### Create a new class for the source connector

Create a new Java file named *KafkaSource.java* in the package directory of your app. Open the file in a text editor and add the following lines:

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Sinks;

@RestController
public class KafkaSource {

    @Autowired
    private Sinks.Many<Message<String>> many;

    @PostMapping("/messages")
    public String sendMessage(@RequestParam String message) {
        many.emitNext(new GenericMessage<>(message), Sinks.EmitFailureHandler.FAIL_FAST);
        return message;
    }
}
```

## Test the application

Use the following steps to test the application.

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located.

1. Use the following commands to build your Spring Boot application with Maven and run it.

   ```shell
   mvn clean package -Dmaven.test.skip=true
   mvn spring-boot:run
   ```

1. After your application is running, use the following command to test it:

   ```shell
   curl -X POST http://localhost:8080/messages?message=hello
   ```

   You should see "hello" posted to your application's logs, as shown in the following example output:

   ```output
   2021-06-02 14:47:13.956  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka version: 3.0.1
   2021-06-02 14:47:13.957  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka commitId: 62abe01bee039651
   2021-06-02 14:47:13.957  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka startTimeMs: 1622616433956
   2021-06-02 14:47:16.668  INFO 23984 --- [container-0-C-1] com.example.demo.DemoApplication   : New message received: 'hello'
   ```

## Deploy to Azure Spring Apps

In this article, you tested the application and ran it locally. In production, you can deploy the application to Azure hosting environments like Azure Spring Apps. Use the following steps to deploy to Azure Spring Apps using managed identity.

1. Create an Azure Spring Apps instance and enable system-assigned managed identity. For more information, see [Enable system-assigned managed identity](/azure/spring-apps/how-to-enable-system-assigned-managed-identity?tabs=azure-portal).

1. Assign roles to the managed identity. For more information, see [Assign Azure roles](/azure/role-based-access-control/role-assignments-portal).

1. Deploy to Azure Spring Apps. For more information, see [Deploy Spring Boot applications using Maven](/azure/spring-apps/how-to-maven-deploy-apps).

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

For more information about Azure support for event hub Stream Binder and Apache Kafka, see the following articles:

- [What is Azure Event Hubs?](/azure/event-hubs/event-hubs-about)
- [Azure Event Hubs for Apache Kafka](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)
- [Create an Event Hubs namespace and an event hub using the Azure portal](/azure/event-hubs/event-hubs-create)
- [Create Apache Kafka enabled event hubs](/azure/event-hubs/event-hubs-create-kafka-enabled)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java](/azure/devops/).

The [Spring Framework](https://spring.io/) is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot](https://spring.io/projects/spring-boot/), which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available in the [Spring Guides](https://github.com/spring-guides) collection of repositories on GitHub. In addition to choosing from the list of basic Spring Boot projects, the [Spring Initializr](https://start.spring.io/) helps developers get started with creating custom Spring Boot applications.

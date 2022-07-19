---
title: Use Spring Kafka with Azure Event Hubs
description: Shows you how to configure a Java-based Spring Cloud Stream Binder to use Apache Kafka with Azure Event Hubs. 
services: event-hubs
documentationcenter: java
ms.date: 07/08/2022
ms.service: event-hubs
ms.topic: article
ms.custom: devx-track-java
---

# Use Spring Kafka with Azure Event Hubs

This article shows you how to configure a Java-based Spring Cloud Stream Binder to use [Apache Kafka](http://kafka.apache.org) with Azure Event Hubs. In this article, you'll create the project by using Spring Initializr and deploy to Azure Spring Apps using Managed Identity.

By using [Apache Kafka](http://kafka.apache.org) with Azure Event Hubs, you can take advantage of Spring Cloud Azure to use various types of credentials for authentication. For more information, see [Spring Cloud Azure authentication](./spring-cloud-azure.md?tabs=maven#spring-cloud-azure-authentication).

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

> [!IMPORTANT]
> Spring Boot version 2.5 or 2.6 is required to complete the steps in this article.

## Create an Azure Event Hubs instance

The following sections describe how to create an Azure Event Hubs namespace and service instance.

### Create an Azure Event Hubs namespace

First, use the following steps to create a namespace.

1. Browse to the [Azure portal](https://portal.azure.com) and sign in.

1. Select **Create a resource**, then **Search the Marketplace**, then search for *Event Hubs*.

1. Select **Create**.

   :::image type="content" source="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-01.png" alt-text="Screenshot of Azure portal showing Event Hubs creation page." lightbox="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-01.png":::

1. On the **Create Namespace** page, enter the following information:

   * Choose the **Subscription** you want to use for your namespace.
   * Specify whether to create a new **Resource group** for your namespace, or choose an existing resource group.
   * Enter a unique **Namespace name**, which will become part of the URI for your event hub namespace. For example: if you entered *wingtiptoys-space* for the **Name**, the URI would be `wingtiptoys-space.servicebus.windows.net`.
   * Specify the **Location** for your event hub namespace.
   * Specify the **Pricing tier**, which will limit your usage scenarios.
   * You can also specify the **Throughput units** for the namespace.

   :::image type="content" source="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-02.png" alt-text="Screenshot of Azure portal showing Event Hubs Create Namespace page." lightbox="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-02.png":::

1. When you've specified the options listed above, select **Review + Create**.

1. Review the specification and select **Create** to create your namespace.

### Create an Azure Event Hubs instance in your namespace

After your namespace is deployed, use the following steps to create an event hub in the namespace.

1. Navigate to the namespace created in the previous step.

1. Select **Event Hub** in top menu bar.

1. Name the event hub.

1. Select **Create**.

   :::image type="content" source="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-05.png" alt-text="Screenshot of Azure portal showing create event hub page." lightbox="media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-05.png":::

## Grant permissions

Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

For this sample to run locally, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

> [!NOTE]
> You need to set the data plane access role: `Azure Event Hubs Data Sender` and `Azure Event Hubs Data Receiver`.

For example, to authenticate using the Azure CLI, use the following steps:

1. Optionally, sign out and delete some authentication files to remove any lingering credentials by using the following command:

   ```azurecli
   az logout
   rm ~/.azure/accessTokens.json
   rm ~/.azure/azureProfile.json
   ```

1. Sign in to your Azure account by using the following command:

   ```azurecli
   az login
   ```

   Follow the instructions to complete the sign-in process.

1. List your subscriptions by using the following command:

   ```azurecli
   az account list
   ```

   Azure will return a list of your subscriptions, each of which will look similar to the following example. Copy the `id` value for the subscription that you want to use.

   ```json
   [
     {
       "cloudName": "AzureCloud",
       "id": "ssssssss-ssss-ssss-ssss-ssssssssssss",
       "name": "Converted Windows Azure MSDN - Visual Studio Ultimate",
       "state": "Enabled",
       "tenantId": "tttttttt-tttt-tttt-tttt-tttttttttttt",
       "user": {
         "name": "contoso@microsoft.com",
         "type": "user"
       }
     }
   ]
   ```

1. Use the following command and specify the GUID for the subscription you want to use with Azure:

   ```azurecli
   az account set --subscription <your-account-ID>
   ```

For more information about granting access roles, see [Authorize access to Event Hubs resources using Azure Active Directory](/azure/event-hubs/authorize-access-azure-active-directory).

## Create a Spring Boot application

Use the following steps to create an application.

1. Browse to [Spring Initializr](https://start.spring.io).

1. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify a **Spring Boot** version that is equal to **2.7.0**.
   * Specify the **Group** and **Artifact** names for your application.
   * Select **8** or **11** for the Java version.
   * Add the **Web**, **Azure Support**, **Cloud Stream**, and **Spring for Apache Kafka** dependencies.

     :::image type="content" source="media/spring-initializer/2.7.0/mvn-java8-azure-web-cloud-stream-kafka.png" alt-text="Screenshot of Spring Initializr with options highlighted." lightbox="media/spring-initializer/2.7.0/mvn-java8-azure-web-cloud-stream-kafka.png":::

   > [!NOTE]
   > Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.wingtiptoys.kafka*.

1. When you've specified the options listed above, select **Generate Project**.

1. When prompted, download the project to a path on your local computer.

1. After you've extracted the files on your local system, your Spring Boot application will be ready for editing.

## Update configuration

1. Add an *application.yaml* in the *resources* directory of your app; for example:

   *C:\SpringBoot\kafka\src\main\resources\application.yaml*

   -or-

   */users/example/home/kafka/src/main/resources/application.yaml*

2. Open the *application.yaml* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your event hub:

   ```yaml
   spring:
     cloud:
       stream:
         kafka:
           binder: 
             brokers: <NAMESPACENAME>.servicebus.windows.net:9093
         function:
           definition: consume;supply
         bindings:
           consume-in-0:
             destination: wingtiptoyshub
             group: $Default
           supply-out-0:
             destination: wingtiptoyshub
         binders:
           kafka:
             environment:
               spring:
                 main:
                   sources: com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration
   ```

   The property `spring.cloud.stream.binders.kafka.environment.spring.main.sources` is used for adding Spring Cloud Azure configuration for `KafkaBinderConfigurationPropertiesBeanPostProcessor` for each particular binder. The configuration specifies the OAuth security parameters for `KafkaBinderConfigurationProperties`, which is used in `KafkaOAuth2AuthenticateCallbackHandler` to take the Spring Cloud Azure token credentials. The configuration is used in the following scenarios:

   * When you run the application locally for development purposes, it will read the credential from local environments like IntelliJ, Visual Studio Code, or Azure CLI.
   * When the application is deployed to Azure Managed Identity enabled hosting environments, like Azure Spring Apps, it will load the credential from the Managed Identity.

   The following table describes the fields in the configuration:

   | Field                                                               | Description                                                                                                                                                                                                           |
   |---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.stream.kafka.binder.brokers`                          | Specifies the Azure Event Hubs endpoint.                                                                                                                                                                              |
   | `spring.cloud.stream.bindings.consume-in-0.destination`             | Specifies the input destination Azure Event Hubs, which for this tutorial is the hub you created earlier.                                                                                                             |
   | `spring.cloud.stream.bindings.consume-in-0.group `                  | Specifies a Consumer Group from Azure Event Hubs, which you can set to `$Default` in order to use the basic consumer group that was created when you created your Azure Event Hubs instance.                          |
   | `spring.cloud.stream.bindings.supply-out-0.destination`             | Specifies the output destination Azure Event Hubs, which for this tutorial is the same as the input destination.                                                                                                      |
   | `spring.cloud.stream.binders.kafka.environment.spring.main.sources` | Specifies more configurations for the particular binder. The value should be `com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration` to enable the whole OAuth authentication workflow. |

   > [!NOTE]
   > If you enable automatic topic creation, be sure to add the configuration item `spring.cloud.stream.kafka.binder.replicationFactor`, with the value set to at least 1. For more information, see [Spring Cloud Stream Kafka Binder Reference Guide](https://docs.spring.io/spring-cloud-stream-binder-kafka/docs/3.1.2/reference/html/spring-cloud-stream-binder-kafka.html).

3. Save and close the *application.yaml* file.

## Produce and consume messages

In this section, you create the necessary Java classes for sending events to your event hub.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

   *C:\SpringBoot\kafka\src\main\java\com\wingtiptoys\kafka\EventhubApplication.java*

   -or-

   */users/example/home/kafka/src/main/java/com/wingtiptoys/kafka/EventhubApplication.java*

1. Open the main application Java file in a text editor, and add the following lines to the file:

   ```java
   package com.wingtiptoys.kafka;
   
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
   public class KafkaApplication {
   
       private static final Logger LOGGER = LoggerFactory.getLogger(KafkaApplication.class);
   
       public static void main(String[] args) {
           SpringApplication.run(KafkaApplication.class, args);
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

1. Save and close the main application Java file.

### Create a new class for the source connector

1. Create a new Java file named *KafkaSource.java* in the package directory of your app, then open the file in a text editor and add the following lines:

   ```java
   package com.wingtiptoys.kafka;
   
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

1. Save and close the *KafkaSource.java* file.

## Build and test

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

   ```cmd
   cd C:\SpringBoot\kafka
   ```

   -or-

   ```bash
   cd /users/example/home/kafka
   ```

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package -Dmaven.test.skip=true
   mvn spring-boot:run
   ```

1. Once your application is running, you can use *curl* to test your application; for example:

   ```shell
   curl -X POST http://localhost:8080/messages?message=hello
   ```

   You should see "hello" posted to your application's logs. For example:

   ```output
   2021-06-02 14:47:13.956  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka version: 2.6.0
   2021-06-02 14:47:13.957  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka commitId: 62abe01bee039651
   2021-06-02 14:47:13.957  INFO 23984 --- [oundedElastic-1] o.a.kafka.common.utils.AppInfoParser     : Kafka startTimeMs: 1622616433956
   2021-06-02 14:47:16.668  INFO 23984 --- [container-0-C-1] com.wingtiptoys.kafka.KafkaApplication   : New message received: 'hello'
   ```

## Deploy to Azure Spring Apps

In this article, you tested the application and ran it locally. In production, you can deploy the application to Azure hosting environments like Azure Spring Apps. Use the following steps to deploy to Azure Spring Apps using managed identity.

1. Create an Azure Spring Apps instance and enable system-assigned managed identity. For more information, see [Enable system-assigned managed identity](/azure/spring-cloud/how-to-enable-system-assigned-managed-identity?tabs=azure-portal).

1. Assign roles to the managed identity. For more information, see [Assign Azure roles](/azure/role-based-access-control/role-assignments-portal).

1. Deploy to Azure Spring Apps. For more information, see [Deploy Spring Boot applications using Maven](/azure/spring-cloud/how-to-maven-deploy-apps).

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

For more information about Azure support for event hub Stream Binder and Apache Kafka, see the following articles:

* [What is Azure Event Hubs?](/azure/event-hubs/event-hubs-about)

* [Azure Event Hubs for Apache Kafka](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)

* [Create an Event Hubs namespace and an event hub using the Azure portal](/azure/event-hubs/event-hubs-create)

* [Create Apache Kafka enabled event hubs](/azure/event-hubs/event-hubs-create-kafka-enabled)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java](/azure/devops/).

The [Spring Framework](https://spring.io/) is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot](https://spring.io/projects/spring-boot/), which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available in the [Spring Guides](https://github.com/spring-guides) collection of repositories on GitHub. In addition to choosing from the list of basic Spring Boot projects, the [Spring Initializr](https://start.spring.io/) helps developers get started with creating custom Spring Boot applications.
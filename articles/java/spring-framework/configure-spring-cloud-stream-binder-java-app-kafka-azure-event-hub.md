---
title: How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs
description: Learn how to configure an application created with the Spring Boot Initializr to use Apache Kafka with Azure Event Hubs.
services: event-hubs
documentationcenter: java
ms.date: 10/13/2018
ms.service: event-hubs
ms.topic: article
ms.custom: devx-track-java
---

# How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs

This article demonstrates how to configure a Java-based Spring Cloud Stream Binder created with the Spring Boot Initializer to use [Apache Kafka] with Azure Event Hubs.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

> [!NOTE]
> * Spring Boot version 2.0 or greater is required to complete the steps in this article.

## Create an Azure Event Hub using the Azure portal

### Create an Azure Event Hub Namespace

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **Create a resource**, then **Search the Marketplace**, then search for *Event Hubs*.

1. Select **Create**.

   ![Create Azure Event Hub Namespace][IMG01]

1. On the **Create Namespace** page, enter the following information:

   * Choose the **Subscription** you want to use for your namespace.
   * Specify whether to create a new **Resource group** for your namespace, or choose an existing resource group.
   * Enter a unique **Namespace name**, which will become part of the URI for your event hub namespace. For example: if you entered *wingtiptoys-space* for the **Name**, the URI would be `wingtiptoys-space.servicebus.windows.net`.
   * Specify the **Location** for your event hub namespace.
   * Specify the **Pricing tier**, which will limit your usage scenarios .
   * You can also specify the **Throughput units** for the namespace.

   ![Specify Azure Event Hub Namespace options][IMG02]

1. When you have specified the options listed above, select **Review + Create**.

1. Review the specification and select **Create** to create your namespace.

### Create an Azure Event Hub in your namespace

After your namespace is deployed, you can create an event hub in the namespace.

1. Navigate to the namespace created in the previous step.

1. Select **Event Hub** in top menu bar.

1. Name the event hub.

1. Select **Create**.

   ![Create Event Hub][IMG05]

## Create a simple Spring Boot application with the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify a **Spring Boot** version that is equal to or greater than 2.0.
   * Specify the **Group** and **Artifact** names for your application.
   * Add the **Web** dependency.

      ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   > 1. The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.wingtiptoys.kafka*.

1. When you have specified the options listed above, click **Generate Project**.

1. When prompted, download the project to a path on your local computer.

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready for editing.

## Configure your Spring Boot app to use the Spring Cloud Kafka Stream and Azure Event Hub starters

1. Locate the *pom.xml* file in the root directory of your app; for example:

   *C:\SpringBoot\kafka\pom.xml*

   -or-

   */users/example/home/kafka/pom.xml*

1. Open the *pom.xml* file in a text editor, and add the Event Hubs Kafka starters to the list of `<dependencies>`:

   ```xml
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>azure-spring-cloud-starter-eventhubs-kafka</artifactId>
     <version>2.10.0</version>
   </dependency>
   ```

1. Save and close the *pom.xml* file.

## Sign into Azure and set your subscription

First, use the following steps to authenticate using the Azure CLI.

1. Optionally, sign out and delete some authentication files to remove any lingering credentials:

   ```azurecli
   az logout
   rm ~/.azure/accessTokens.json
   rm ~/.azure/azureProfile.json
   ```

1. Sign into your Azure account by using the Azure CLI:

   ```azurecli
   az login
   ```

   Follow the instructions to complete the sign-in process.

1. List your subscriptions:

   ```azurecli
   az account list
   ```

   Azure will return a list of your subscriptions. Copy the `id` value for the subscription that you want to use; for example:

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

1. Specify the GUID for the subscription you want to use with Azure; for example:

   ```azurecli
   az account set -s ssssssss-ssss-ssss-ssss-ssssssssssss
   ```

## Create a service principal

Azure AD *service principals* provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service. "Service" is any application, service, or platform that needs to access Azure resources. You can configure a service principal with access rights scoped only to those resources you specify. Then, configure your application or service to use the service principal's credentials to access those resources.

To create a service principal, use the following command.

```azurecli
az ad sp create-for-rbac --name contososp
```

The value of the `name` option must be unique within your subscription. Save aside the values returned from the command for use later in the tutorial. The return JSON will look similar to the following output:

```output
{
  "appId": "sample-app-id",
  "displayName": "contososp",
  "name": "http://contososp",
  "password": "sample-password",
  "tenant": "sample-tenant"
}
```

## Configure your Spring Boot app to use your Azure Event Hub

1. Add an *application.yaml* in the *resources* directory of your app; for example:

   *C:\SpringBoot\kafka\src\main\resources\application.yaml*

   -or-

   */users/example/home/kafka/src/main/resources/application.yaml*

2. Open the *application.yaml* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your event hub:

   ```yaml
   spring:
     cloud:
       azure:
         client-id: <your client ID>
         client-secret: <your client secret>
         tenant-id: <your tenant ID>
         resource-group: <your resource group>
         subscription-id: <your subscription ID>
         eventhub:
           namespace: wingtiptoys
       stream:
         function:
           definition: consume;supply
         bindings:
           consume-in-0:
             destination: wingtiptoyshub
             group: $Default
           supply-out-0:
             destination: wingtiptoyshub
   ```
   
   Where:

   |                       Field                       |                                                                                   Description                                                                                    |
   |---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   |           `spring.cloud.azure.client-id`          |                                                    The `appId` from the return JSON from `az ad sp create-for-rbac`.                                                             |
   |         `spring.cloud.azure.client-secret`        |                                                    The `password` from the return JSON from `az ad sp create-for-rbac`.                                                          |
   |           `spring.cloud.azure.tenant-id`          |                                                    The `tenant` from the return JSON from `az ad sp create-for-rbac`.                                                            |
   |        `spring.cloud.azure.resource-group`        |                                                      Specifies the Azure Resource Group that contains your Azure Event Hub.                                                      |
   |        `spring.cloud.azure.subscription-id`        |                                                     Specifies the Azure Subscription that contains your Azure Event Hub.                                                        |
   |            `spring.cloud.azure.region`            |                                           Specifies the geographical region that you specified when you created your Azure Event Hub.                                            |
   |     `spring.cloud.azure.auto-create-resources`    |                                           Specifies true to enable automatic creation of related resources if they don't exist.                                                 |
   |      `spring.cloud.azure.eventhub.namespace`      |                                          Specifies the unique name that you specified when you created your Azure Event Hub Namespace.                                           |
   | `spring.cloud.stream.bindings.input.destination`  |                            Specifies the input destination Azure Event Hub, which for this tutorial is the  hub you created earlier in this tutorial.                            |
   |    `spring.cloud.stream.bindings.input.group `    | Specifies a Consumer Group from Azure Event Hub, which can be set to '$Default' in order to use the basic consumer group that was created when you created your Azure Event Hub. |
   | `spring.cloud.stream.bindings.output.destination` |                               Specifies the output destination Azure Event Hub, which for this tutorial will be the same as the input destination.                               |

   > [!NOTE]
   > If you enable automatic topic creation, be sure to add the configuration item `spring.cloud.stream.kafka.binder.replicationFactor`, with the value set to at least 1. For more information, see [Spring Cloud Stream Kafka Binder Reference Guide](https://docs.spring.io/spring-cloud-stream-binder-kafka/docs/3.1.2/reference/html/spring-cloud-stream-binder-kafka.html).

3. Save and close the *application.yaml* file.

## Add sample code to implement basic event hub functionality

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

## Build and test your application

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

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about Azure support for Event Hub Stream Binder and Apache Kafka, see the following articles:

* [What is Azure Event Hubs?](/azure/event-hubs/event-hubs-about)

* [Azure Event Hubs for Apache Kafka](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)

* [Create an Event Hubs namespace and an event hub using the Azure portal](/azure/event-hubs/event-hubs-create)

* [Create Apache Kafka enabled event hubs](/azure/event-hubs/event-hubs-create-kafka-enabled)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Apache Kafka]: http://kafka.apache.org
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[IMG01]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-01.png
[IMG02]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-02.png
[IMG05]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-kafka-event-hub-05.png

[SI01]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/create-project-01.png

[TB01]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/test-browser-01.png
[TB02]: media/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub/test-browser-02.png
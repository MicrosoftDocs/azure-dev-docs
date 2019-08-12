---
title: Spring Cloud Azure Stream Binder for Azure Service Bus
description: This article demonstrates how to use Spring Cloud Stream Binder to send messages to and receive messages from Azure Service Bus.
author: seanli1988
manager: kyliel
ms.author: Sean.Li
ms.date: 08/12/2019
ms.devlang: java
ms.service: azure-java
ms.topic: article
---

# How to use Spring Cloud Azure Stream Binder for Azure Service Bus

[!INCLUDE [spring-boot-20-note.md](../includes/spring-boot-20-note.md)]

## Overview

Azure provides an asynchronous messaging platform called [Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-overview) ("Service Bus") that is based on the [Advanced Message Queueing Protocol 1.0](http://www.amqp.org/) ("AMQP 1.0") standard. Service Bus can be used across the range of supported Azure platforms.

This article demonstrates how to use the Spring Cloud Stream Binder to send messages to and receive messages from Azure Service Bus `queues` and `topics`.

## Prerequisites

The following prerequisites are required for this article:

1. An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.comfree/).

1. A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.

1. Apache's [Maven](http://maven.apache.org/), version 3.2 or later.

1. If you already have a configured Service Bus queue and topic, ensure that the Service Bus namespace meets the following requirements:

    1. Allows access from all networks
    1. Is Premium (or higher)
    1. Has an access policy with read/write access for your queue and topic

1. If you don't have a configured Service Bus queue and topic, use the Azure portal to [create a Service Bus queue](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-quickstart-portal) and [create a Service Bus topic](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal). Ensure that the namespace meets the requirements specified in the previous step.

1. If you don't have a Spring Boot application, [create a **Maven** project with the Spring Initializr](https://start.spring.io/). Remember to select **Maven Project** and, under **Dependencies**, add the **Web** dependency.

## Configure your Spring Boot app to use the Azure Service Bus Spring Cloud Stream Binder starter

1. Locate the *pom.xml* file in the root directory of your app; for example:

    `C:\SpringBoot\servicebus\pom.xml`

    -or-

    `/users/example/home/servicebus/pom.xml`

2. If you use Azure Service Bus queue, open the *pom.xml* file and add the Spring Cloud Service Bus Queue Stream Binder starter to the list of `<dependencies>`:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-azure-servicebus-queue-stream-binder</artifactId>
        <version>1.1.0.RC5</version>
    </dependency>
    ```

    ![Edit pom.xml file 1](https://github.com/bqchen/Spring-StreamBinder-ServiceBus/raw/master/S1.PNG)

    If you use Azure Service Bus topic, open the *pom.xml* file and add the Spring Cloud Service Bus Topic Stream Binder starter to the list of `<dependencies>`:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-azure-servicebus-topic-stream-binder</artifactId>
        <version>1.1.0.RC5</version>
    </dependency>
    ```

    ![Edit pom.xml file](https://github.com/bqchen/Spring-StreamBinder-ServiceBus/raw/master/S2.PNG)

3. Save and close the *pom.xml* file.

## Configure your Spring Boot app to use Spring Cloud Stream Binder for your Service Bus

You can configure your app based on either connection string or credential file. In this tutorial, connection string based usage is recommended. For more information about credential file based usage, please see our [
Spring Cloud Azure Stream Binder for Service Bus queue Code Sample](https://github.com/microsoft/spring-cloud-azure/tree/release/1.1.0.RC4/spring-cloud-azure-samples/servicebus-queue-binder-sample#credential-file-based-usage
) and [Spring Cloud Azure Stream Binder for Service Bus topic Code Sample](https://github.com/microsoft/spring-cloud-azure/tree/release/1.1.0.RC4/spring-cloud-azure-samples/servicebus-topic-binder-sample#credential-file-based-usage).

1. Locate the *application.properties* in the *resources* directory of your app; for example:

   `C:\SpringBoot\servicebus\src\main\resources\application.properties`

   -or-

   `/users/example/home/servicebus/src/main/resources/application.properties`

2. If you use Service Bus queue, open the *application.properties* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your service bus:

    ```yaml
    spring.cloud.azure.servicebus.connection-string=<ServiceBusNamespaceConnectionString>
    spring.cloud.stream.bindings.input.destination=examplequeue
    spring.cloud.stream.bindings.output.destination=examplequeue
    spring.cloud.stream.servicebus.queue.bindings.input.consumer.checkpoint-mode=MANUAL
    ```

    If you use Service Bus topic, open the *application.properties* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your service bus:

    ```yaml
    spring.cloud.azure.servicebus.connection-string=<ServiceBusNamespaceConnectionString>
    spring.cloud.stream.bindings.input.destination=exampletopic
    spring.cloud.stream.bindings.input.group=examplesubscription
    spring.cloud.stream.bindings.output.destination=exampletopic
    spring.cloud.stream.servicebus.topic.bindings.input.consumer.checkpoint-mode=MANUAL
    ```

    Where:

    |                                        Field                                   |                                                                                   Description                                                                                    |
    |--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    |               `spring.cloud.azure.servicebus.connection-string`                |                                        Specifies the connection string that you obtained in your Azure Service Bus Namespace from your portal.                                   |
    |               `spring.cloud.stream.bindings.input.destination`                 |                            Specifies the input destination Azure Service Bus, which for this tutorial is the queue / topic you created earlier.                         |
    |                  `spring.cloud.stream.bindings.input.group`                    |                                            Specifies a subscription that you created in your Azure Service Bus Topic **ONLY** when you use Service Bus Topic.                                |
    |               `spring.cloud.stream.bindings.output.destination`                |                               Specifies the output destination Azure Service Bus, which for this tutorial will be the same as the input destination.                        |
    | `spring.cloud.stream.servicebus.queue.bindings.input.consumer.checkpoint-mode` |                                                       Specifies the checkpoint mode for queue, which for this tutorial will be `MANUAL`.                                                   |
    | `spring.cloud.stream.servicebus.topic.bindings.input.consumer.checkpoint-mode` |                                                       Specifies the checkpoint mode for topic, which for this tutorial will be `MANUAL`.                                                   |

3. Save and close the *application.properties* file.

## Add sample code to implement basic Service Bus functionality

In this section, you create the necessary Java classes for sending messages to your Service Bus.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

    `C:\SpringBoot\servicebus\src\main\java\com\example\ServiceBusBinderApplication.java`

   -or-

   `/users/example/home/servicebus/src/main/java/com/example/ServiceBusBinderApplication.java`

2. Open the main application Java file in a text editor, and add the following lines to the file:

    ```java
    package com.example;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    @SpringBootApplication
    public class ServiceBusBinderApplication {

        public static void main(String[] args) {
            SpringApplication.run(ServiceBusBinderApplication.class, args);
        }
    }
    ```

3. Save and close the main application Java file.

### Create a new class for the source connector

1. Create a new Java file named *StreamBinderSource.java* in the package directory of your app, then open the file in a text editor and add the following lines:

    ```java
    package com.example;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.cloud.stream.annotation.EnableBinding;
    import org.springframework.cloud.stream.messaging.Source;
    import org.springframework.messaging.support.GenericMessage;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    @EnableBinding(Source.class)
    @RestController
    public class StreamBinderSource {

        @Autowired
        private Source source;

        @PostMapping("/messages")
        public String postMessage(@RequestParam String message) {
            this.source.output().send(new GenericMessage<>(message));
            return message;
        }
    }
    ```

2. Save and close the *StreamBinderSources.java* file.

### Create a new class for the sink connector

1. Create a new Java file named *StreamBinderSink.java* in the package directory of your app, then open the file in a text editor and add the following lines:

    ```java
    package com.example;

    import com.microsoft.azure.spring.integration.core.AzureHeaders;
    import com.microsoft.azure.spring.integration.core.api.Checkpointer;
    import org.springframework.cloud.stream.annotation.EnableBinding;
    import org.springframework.cloud.stream.annotation.StreamListener;
    import org.springframework.cloud.stream.messaging.Sink;
    import org.springframework.messaging.handler.annotation.Header;

    @EnableBinding(Sink.class)
    public class StreamBinderSink {

        @StreamListener(Sink.INPUT)
        public void handleMessage(String message, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
            System.out.println(String.format("New message received: '%s'", message));
            checkpointer.success().handle((r, ex) -> {
                if (ex == null) {
                    System.out.println(String.format("Message '%s' successfully checkpointed", message));
                }
                return null;
            });
        }
    }
    ```

2. Save and close the *StreamBinderSink.java* file.

## Build and test your application

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

    `cd C:\SpringBoot\servicebus`

    -or-

    `cd /users/example/home/servicebus`

2. Build your Spring Boot application with Maven and run it; for example:

    ```shell
    mvn clean spring-boot:run
    ```

3. Once your application is running, you can use *curl* to test your application; for example:

    ```shell
    curl -X POST localhost:8080/messages?message=hello
    ```

    You should see "hello" posted to your application's logs. For example:

    ```shell
    New message received: 'hello'
    Message 'hello' successfully checkpointed
    ```

## Clean up resources

You can delete the resources on your [Azure Portal](http://ms.portal.azure.com/) to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

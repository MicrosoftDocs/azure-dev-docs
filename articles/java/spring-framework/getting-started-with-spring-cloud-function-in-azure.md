---
title: Getting started with Spring Cloud Function in Azure
description: Learn about using Spring Cloud Function in Azure.
documentationcenter: java
author: jdubois
manager: brborges
ms.author: judubois
ms.date: 07/17/2019
ms.service: azure-functions
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
---

# Getting started with Spring Cloud Function in Azure

This article guides you through using [Spring Cloud Functions](https://spring.io/projects/spring-cloud-function) to develop a Java function and publish it to Azure Functions. When you're done, your function code runs on the [Consumption Plan](/azure/azure-functions/functions-scale#consumption-plan) in Azure and can be triggered using an HTTP request.

[!INCLUDE [quickstarts-free-trial-note](includes/quickstarts-free-trial-note.md)]

## Prerequisites

To develop functions using Java, you must have the following installed:

- [Java Developer Kit](../fundamentals/java-support-on-azure.md), version 11
- [Apache Maven](https://maven.apache.org), version 3.0 or above
- [Azure CLI](/cli/azure)
- [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#v2) version 3.0.13901.0 or above

> [!IMPORTANT]
> You must set the JAVA_HOME environment variable to the install location of the JDK to complete this quickstart.

## What we are going to build

We are going to build a classical "Hello, World" function, that runs on Azure Functions, and which is configured with Spring Cloud Function.

It will receive a simple `User` JSON object, which contains a user name, and send back a `Greeting` object, which contains the welcome message to that user.

The project we will build here is available in the [hello-spring-function-azure](https://github.com/Azure-Samples/hello-spring-function-azure) repository on GitHub. You can use that sample repository directly if you want to see the final work that is detailed in this quickstart.

## Create a new Maven project

We are going to create an empty Maven project, and configure it with Spring Cloud Function and Azure Functions.

In an empty folder, create a new *pom.xml* file and copy/paste the content from the sample project's [pom.xml](https://github.com/Azure-Samples/hello-spring-function-azure/blob/master/pom.xml) file.

> [!NOTE]
> This file uses Maven dependencies from both Spring Boot and Spring Cloud Function, and it configures
the Spring Boot and Azure Functions Maven plugins.

A few properties need to be customized for your application:

- `<functionAppName>` is the name of your Azure Function
- `<functionAppRegion>` is the name of the Azure region where your Function is deployed
- `<functionResourceGroup>` is the name of the Azure resource group you are using

You should change those properties directly near the top of the *pom.xml* file:

```xml
<properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <maven.compiler.source>11</maven.compiler.source>
  <maven.compiler.target>11</maven.compiler.target>

  <azure.functions.java.library.version>1.4.2</azure.functions.java.library.version>
  <azure.functions.maven.plugin.version>1.11.0</azure.functions.maven.plugin.version>

  <!-- customize those two properties. The functionAppName should be unique across Azure -->
  <functionResourceGroup>my-spring-function-resource-group</functionResourceGroup>
  <functionAppName>my-spring-function</functionAppName>

  <functionAppRegion>westeurope</functionAppRegion>
  <stagingDirectory>${project.build.directory}/azure-functions/${functionAppName}</stagingDirectory>
  <start-class>com.example.DemoApplication</start-class>
</properties>
```

## Create Azure configuration files

Create a *src/main/azure* folder and add the following Azure Functions configuration files to it.

*host.json*:

```json
{
  "version": "2.0",
  "functionTimeout": "00:10:00"
}
```

*local.settings.json*:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "java",
    "MAIN_CLASS":"com.example.DemoApplication",
    "AzureWebJobsDashboard": ""
  }
}
```

## Create domain objects

Azure Functions can receive and send objects in JSON format.
We are now going to create our `User` and `Greeting` objects, which represent our domain model.
You can create more complex objects, with more properties, if you want to customize this quickstart and make 
it more interesting for you.

Create a *src/main/java/com/example/model* folder and add the following two files:

*User.java*:

```java
package com.example.model;

public class User {

    private String name;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

*Greeting.java*:

```java
package com.example.model;

public class Greeting {

    private String message;

    public Greeting() {
    }

    public Greeting(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

## Create the Spring Boot application

This application will manage all business logic, and will have access to the full Spring Boot ecosystem.
This gives you two main benefits over a standard Azure Function:

- It doesn't rely on the Azure Functions APIs, so you can easily port it to other systems. For example, you can reuse it in a normal Spring Boot application.
- You can use all the `@Enable` annotations from Spring Boot to add new features.

In the *src/main/java/com/example* folder, create the following file, which is a normal Spring Boot application:

*DemoApplication.java*:

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

Now create the following file, which contains a Spring Boot component that represents the Function we want to run:

*Hello.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.function.Function;

@Component
public class Hello implements Function<Mono<User>, Mono<Greeting>> {

    public Mono<Greeting> apply(Mono<User> mono) {
        return mono.map(user -> new Greeting("Hello, " + user.getName() + "!\n"));
    }
}
```

> [!NOTE]
> The `Hello` function is quite specific:
>
> - It is a `java.util.function.Function`. It contains the business logic, and it uses a standard Java API to transform one object into another.
> - Because it has the `@Component` annotation, it's a Spring Bean, and by default its name is the same as the class, but starting with a lowercase character: `hello`. Following this naming convention is important if you want to create other functions in your application. The name must match the Azure Functions name we'll create in the next section.

## Create the Azure Function

In order to benefit from the full Azure Functions API, we're now going to code a specific class: an Azure Function that will delegate its execution to the Spring Cloud Function we've created in the previous step.

In the *src/main/java/com/example* folder, create the following Azure Function class file:

*HelloHandler.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import org.springframework.cloud.function.adapter.azure.FunctionInvoker;

import java.util.Optional;

public class HelloHandler extends FunctionInvoker<User, Greeting> {

    @FunctionName("hello")
    public HttpResponseMessage execute(
        @HttpTrigger(name = "request", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<User>> request,
        ExecutionContext context) {
        User user = request.getBody()
                           .filter((u -> u.getName() != null))
                           .orElseGet(() -> new User(
                               request.getQueryParameters()
                                      .getOrDefault("name", "world")));
        context.getLogger().info("Greeting user name: " + user.getName());
        return request
            .createResponseBuilder(HttpStatus.OK)
            .body(handleRequest(user, context))
            .header("Content-Type", "application/json")
            .build();
    }
}
```

This Java class is an Azure Function, with the following interesting features:

- It extends `FunctionInvoker`, which creates the link between Azure Functions and Spring Cloud Functions. This is what provides the `handleRequest()` method that's used in its `body()` method.
- The name of the function, as defined by the `@FunctionName("hello")` annotation, is `hello`.
- It's a real Azure Function, so you can use the full Azure Functions API here.

## Add unit tests

This step is optional but recommended to validate that the application works correctly.

Create a *src/test/java/com/example* folder and add the following JUnit tests:

*HelloTest.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import com.microsoft.azure.functions.ExecutionContext;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.function.adapter.azure.FunctionInvoker;
import reactor.core.publisher.Mono;

import java.util.logging.Logger;

import static org.assertj.core.api.Assertions.assertThat;

public class HelloTest {

    @Test
    public void test() {
        Mono<Greeting> result = new Hello().apply(Mono.just(new User("foo")));
        assertThat(result.block().getMessage()).isEqualTo("Hello, foo!\n");
    }

    @Test
    public void start() {
        FunctionInvoker<User, Greeting> handler = new FunctionInvoker<>(
            Hello.class);
        Greeting result = handler.handleRequest(new User("foo"), new ExecutionContext() {
            @Override
            public Logger getLogger() {
                return Logger.getLogger(HelloTest.class.getName());
            }

            @Override
            public String getInvocationId() {
                return "id1";
            }

            @Override
            public String getFunctionName() {
                return "hello";
            }
        });
        handler.close();
        assertThat(result.getMessage()).isEqualTo("Hello, foo!\n");
    }
}
```

You can now test your Azure Function using Maven:

```bash
mvn clean test
```

## Run the Function locally

Before you deploy your application to Azure Function, let's first test it locally.

First you need to package your application into a Jar file:

```bash
mvn package
```

Now that the application is packaged, you can run it using the `azure-functions` Maven plugin:

```bash
mvn azure-functions:run
```

The Azure Function should now be available on your localhost, using port 7071. You can test the function by sending it a POST request, with a `User` object in JSON format. For example, using cURL:

```bash
curl -X POST http://localhost:7071/api/hello -d "{\"name\":\"Azure\"}"
```

The Function should answer you with a `Greeting` object, still in JSON format:

```output
{
  "message": "Hello, Azure!\n"
}
```

Here's a screenshot of the cURL request on the top of the screen, and the local Azure Function at the bottom:

![Azure Function running locally][RFL01]

## Debug the Function locally

The following sections describe how to debug the function.

### Debug using Intellij IDEA

Open the project in Intellij IDEA, then create a **Remote JVM Debug** run configuration to attach. For more information, see [Tutorial: Remote debug](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html).

![Create a Remote JVM Debug run configuration][create-remote-jvm-debug-run-configuration]

Run the application with the following command:

```bash
mvn azure-functions:run -DenableDebug
```

When the application starts, you'll see the following output:

```output
Worker process started and initialized.
Listening for transport dt_socket at address: 5005
```

Start project debugging in Intellij IDEA. You'll see the following output:

```output
Connected to the target VM, address: 'localhost:5005', transport: 'socket'
```

Mark the breakpoints you want to debug. After sending a request, the Intellij IDEA will enter debugging mode.

### Debug using Visual Studio Code

Open the project in Visual Studio Code, then configure the following *launch.json* file content:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Attach to Remote Program",
            "request": "attach",
            "hostName": "127.0.0.1",
            "port": 5005
        }
    ]
}
```

Run the application with the following command:

```bash
mvn azure-functions:run -DenableDebug
```

When the application starts, you'll see the following output:

```output
Worker process started and initialized.
Listening for transport dt_socket at address: 5005
```

Start project debugging in Visual Studio Code, then mark the breakpoints you want to debug. After sending a request, Visual Studio Code will enter debugging mode. For more information, see [Running and debugging Java](https://code.visualstudio.com/docs/java/java-debugging).

## Deploy the Function to Azure Functions

Now you're going to publish the Azure Function to production. Remember that the `<functionAppName>`, `<functionAppRegion>`, and `<functionResourceGroup>` properties you've defined in your *pom.xml* file will be used to configure your function.

> [!NOTE]
> The Maven plugin needs to authenticate with Azure. If you have Azure CLI installed, use `az login` before continuing.
> For more authentication options, see [Authentication](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication) in the [azure-maven-plugins](https://github.com/microsoft/azure-maven-plugins) repository.

Run Maven to deploy your function automatically:

```bash
mvn azure-functions:deploy
```

Now go to the [Azure portal](https://portal.azure.com) to find the `Function App` that has been created.

Click on the function:

- In the function overview, note the function's URL.
- Select the **Platform features** tab to find the **Log streaming** service, then select this service to check your running function.

Now, as you did in the previous section, use cURL to access the running function, as shown in the following example. Be sure to replace `your-function-name` by your real function name.

```bash
curl https://your-function-name.azurewebsites.net/api/hello -d "{\"name\":\"Azure\"}"
```

Like in the previous section, the Function should answer you with a `Greeting` object, still in JSON format:

```output
{
  "message": "Welcome, Azure"
}
```

Congratulations, you have a Spring Cloud Function running on Azure Functions!

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

<!-- IMG List -->

[RFL01]: media/getting-started-with-spring-cloud-function-in-azure/RFL01.png
[create-remote-jvm-debug-run-configuration]: media/getting-started-with-spring-cloud-function-in-azure/create-remote-jvm-debug-run-configuration.png

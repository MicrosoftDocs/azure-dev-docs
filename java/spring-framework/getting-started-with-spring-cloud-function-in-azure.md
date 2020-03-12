---
title: Getting started with Spring Cloud Function in Azure
description: Learn about using Spring Cloud Function in Azure.
documentationcenter: java
author: judubois
manager: brborges
ms.author: judubois
ms.date: 07/17/2019
ms.service: azure-functions
ms.tgt_pltfrm: multiple
ms.topic: article
---

# Getting started with Spring Cloud Function in Azure

This article guides you through using [Spring Cloud Functions](https://spring.io/projects/spring-cloud-function) to develop a Java function and publish it to Azure Functions. When you're done, your function code runs on the [Consumption Plan](/azure/azure-functions/functions-scale#consumption-plan) in Azure and can be triggered using an HTTP request.

[!INCLUDE [quickstarts-free-trial-note](../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To develop functions using Java, you must have the following installed:

- [Java Developer Kit](https://aka.ms/azure-jdks), version 8
- [Apache Maven](https://maven.apache.org), version 3.0 or above
- [Azure CLI](https://docs.microsoft.com/cli/azure)
- [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#v2) version 2.7.1158 or above

> [!IMPORTANT]
> The JAVA_HOME environment variable must be set to the install location of the JDK to complete this quickstart.

## What we are going to build

We are going to build a classical "Hello, World" function, that runs on Azure Functions, and which is configured with Spring Cloud Function.

It will receive a simple `User` JSON object, which contains a user name, and sends back a `Greeting` object, which contains the welcome message to that user.

The project we build here is available on [https://github.com/Azure-Samples/hello-spring-function-azure](https://github.com/Azure-Samples/hello-spring-function-azure), so you can use that sample repository directly if you want to see the final work that is detailed in this quickstart.

## Create a new Maven project

We are going to create an empty Maven project, and configure it with Spring Cloud Function and Azure Functions.

In an empty folder, create a new *pom.xml* and copy/paste the content from our sample project at [https://github.com/Azure-Samples/hello-spring-function-azure/blob/master/pom.xml](https://github.com/Azure-Samples/hello-spring-function-azure/blob/master/pom.xml).

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
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <azure.functions.maven.plugin.version>1.4.1</azure.functions.maven.plugin.version>
    <azure.functions.java.library.version>1.3.0</azure.functions.java.library.version>
    <functionAppName>my-spring-function</functionAppName>
    <functionAppRegion>westus</functionAppRegion>
    <stagingDirectory>${project.build.directory}/azure-functions/${functionAppName}</stagingDirectory>
    <functionResourceGroup>my-resource-group</functionResourceGroup>
    <start-class>com.example.HelloFunction</start-class>
    <wrapper.version>1.0.22.RELEASE</wrapper.version>
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

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    private String name;

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

    public Greeting() {
    }

    public Greeting(String message) {
        this.message = message;
    }

    private String message;

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
This gives you therefore two main benefits over a standard Azure Function:

- It doesn't rely on the Azure Functions APIs, so it can easily be ported to other systems. For example, it could be reused in a normal Spring Boot application.
- It can use all the `@Enable` annotations from Spring Boot to easily add powerful new features.

In the *src/main/java/com/example* folder, create the following file, which is a normal Spring Boot application:

*HelloFunction.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.function.Function;

@SpringBootApplication
public class HelloFunction {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HelloFunction.class, args);
    }

    @Bean
    public Function<User, Greeting> hello() {
        return user -> new Greeting("Welcome, " + user.getName());
    }
}
```

> [!NOTE] 
> The `hello()` function is quite specific:
> 
> - It returns a `java.util.function.Function`, which is the function that will be used in this quickstart. It contains the business logic, and is uses a standard Java API to transform one object into another.
> - As it has the `@Bean` annotation, it is a Spring Bean, and by default its name is the one of the method, `hello`. This is important if you want to create other functions in your application, as this name must match the Azure Functions name we will create in the next section.

## Create the Azure Function

In order to benefit from the full Azure Functions API, we are now going to code a specific class: it is an Azure Function that will delegate its execution to the Spring Cloud Function we have created in the previous step.

In the *src/main/java/com/example* folder, create the following Azure Function:

*HelloHandler.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import org.springframework.cloud.function.adapter.azure.AzureSpringBootRequestHandler;

import java.util.Optional;

public class HelloHandler extends AzureSpringBootRequestHandler<User, Greeting> {

    @FunctionName("hello")
    public Greeting execute(
            @HttpTrigger(name = "request", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<User>> request,
            ExecutionContext context) {

        context.getLogger().info("Greeting user name: " + request.getBody().get().getName());
        return handleRequest(request.getBody().get(), context);
    }
}
```

This Java class is an Azure Function, with the following interesting features:

- It extends `AzureSpringBootRequestHandler`, which does the link between Azure Functions and Spring Cloud Function. This is what provides the `handleRequest()` method that is used in its `execute()` method.
- The name of the function, as defined by the `@FunctionName("hello")` annotation, is the same as the Spring bean we have configured in the previous step, `hello`.
- It is a real Azure Function, so you can use the full Azure Functions API here.

## Add unit tests

Of course, this step is optional, but as good developers you should add unit tests to validate that the application works correctly.

Create a *src/test/java/com/example* folder, and add the following JUnit tests:

*HelloFunctionTest.java*:

```java
package com.example;

import com.example.model.Greeting;
import com.example.model.User;
import org.junit.Test;
import org.springframework.cloud.function.adapter.azure.AzureSpringBootRequestHandler;

import static org.assertj.core.api.Assertions.assertThat;

public class HelloFunctionTest {

    @Test
    public void test() {
        Greeting result = new HelloFunction().hello().apply(new User("foo"));
        assertThat(result.getMessage()).isEqualTo("Welcome, foo");
    }

    @Test
    public void start() throws Exception {
        AzureSpringBootRequestHandler<User, Greeting> handler = new AzureSpringBootRequestHandler<>(
                HelloFunction.class);
        Greeting result = handler.handleRequest(new User("foo"), null);
        handler.close();
        assertThat(result.getMessage()).isEqualTo("Welcome, foo");
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
curl http://localhost:7071/api/hello -d "{\"name\":\"Azure\"}"
```

The Function should answer you with a `Greeting` object, still in JSON format:

```Output
{
  "message": "Welcome, Azure"
}
```

Here is a screenshot of the cURL request on the top of the screen, and the local Azure Function at the bottom:

 ![Azure Function running locally][RFL01]

## Deploy the Function to Azure Functions

Now you are going to publish the Azure Function to production. Remember that the `<functionAppName>`, `<functionAppRegion>` and `<functionResourceGroup>` properties you have defined in your *pom.xml* will be used to configure your function.

> [!NOTE]
> The Maven plugin needs to authenticate with Azure, if you have Azure CLI installed, use `az login` before continuing.
> Check here for more authentication options.

Run Maven to deploy your function automatically:

```bash
mvn azure-functions:deploy
```

> [!NOTE]
> Maven plugin need to authenticate with Azure, if you have Azure CLI installed, use `az login` before continuing.
> Check [here](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication) for more authentication options.

Now go to the [Azure portal](https://portal.azure.com) to find the `Function App` that has been created.

Click on the function:

- In the function overview, note the function's URL.
- Select the **Platform features** tab to find the **Log streaming** service, then select this service to check your running function.

Now, as you did in the previous section, use cURL to access the running function. Please replace `your-function-name` by your real function name:

```bash
curl https:/your-function-name.azurewebsites.net/api/hello -d "{\"name\":\"Azure\"}"
```

Like in the previous section, the Function should answer you with a `Greeting` object, still in JSON format:

```Output
{
  "message": "Welcome, Azure"
}
```

Congratulations, you have a Spring Cloud Function running on Azure Functions!

<!-- IMG List -->

[RFL01]: ./media/getting-started-with-spring-cloud-function-in-azure/RFL01.png

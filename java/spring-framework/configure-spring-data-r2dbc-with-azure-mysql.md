---
title: How to use Spring Data R2DBC with Azure Database for MySQL
description: Learn how to use Spring Data R2DBC with an Azure Database for MySQL database.
documentationcenter: java
ms.date: 03/18/2020
ms.service: mysql
ms.tgt_pltfrm: multiple
ms.topic: conceptual
ms.author: judubois
ms.topic: article
---

# How to use Spring Data R2DBC with Azure MySQL

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. It can be used with Spring WebFlux to create fully reactive Spring Boot applications, using non-blocking APIs and providing better scalability than the classic "one thread per connection" approach.

This topic demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in an [Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/), using the R2DBC implementation for MySQL from [https://github.com/mirromutth/r2dbc-mysql](https://github.com/mirromutth/r2dbc-mysql).

## Prerequisites

The following prerequisites are required to complete the steps in this article:

- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
- A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [https://aka.ms/azure-jdks](https://aka.ms/azure-jdks).
- [cURL](https://curl.haxx.se) or similar HTTP utility to test functionality.

## Prepare the working environment

The instructions below can be followed using a terminal on your local computer (Windows, macOS, or Linux), but we recommend you use the [Azure Shell](https://shell.azure.com/). Using that browser-based tool, you'll be automatically logged in, and you'll have access to all the tools that you'll need.

First, we will set up some environment variables:

```bash
export AZ_RESOURCE_GROUP=r2dbc-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_USERNAME=r2dbc
export AZ_MYSQL_PASSWORD=<YOUR_MYSQL_PASSWORD>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

You will need to configure the following parameters:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL Server instance. It should be unique across Azure.
- `<YOUR_AZURE_REGION>`: the Azure region you'll use. You can use `eastus` by default, but we recommend you configure a region closer to where you live. You can have the full list of available regions by typing `az account list-locations`.
- `<YOUR_MYSQL_PASSWORD>`: the password of your MySQL database server. That password should have a minimum of eight characters, and characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: the IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to point your browser to [http://ipv4.icanhazip.com](http://ipv4.icanhazip.com).

Once those variables are set up, you can create the resource group in which we will work throughout this quickstart:

```bash
az group create --name $AZ_RESOURCE_GROUP --location $AZ_LOCATION | jq
```

> [!NOTE]
> 
> We use the `jq` utility, which is installed by default on [Azure Shell](https://shell.azure.com/), in order to display JSON data and make it more readable.
> If you don't like that utility, you can safely remove the `| jq` part of all the commands we will use.

In case you want to clean up any resources that you have used during this quickstart, you'll be able to delete everything at once, by deleting this resource group:

```bash
az group delete --yes --name $AZ_RESOURCE_GROUP | jq
```

## Create an Azure Database for MySQL

The first thing we will create is a managed MySQL Server instance.

> [!NOTE]
> 
> You can read more detailed information about creating MySQL databases in [Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

Still in your [Azure Shell](https://shell.azure.com/) instance, execute the following script:

```bash
az mysql server create --name $AZ_DATABASE_NAME \
    --sku-name B_Gen5_1 --storage-size 5120 \
    --resource-group $AZ_RESOURCE_GROUP --location $AZ_LOCATION \
    --admin-user $AZ_MYSQL_USERNAME --admin-password $AZ_MYSQL_PASSWORD
```

This command will create a small MySQL Server instance.

### Configure a firewall rule for your MySQL Server instance

Azure Database for MySQL instances are secured by default: they have a firewall that doesn't allow any incoming connection. In order to be able to use our database, we need to add a firewall rule that will allow our local IP address to access the database server.

As we have configured our local IP address at the beginning of this article, you can open up the server's firewall by running:

```bash
az mysql server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP --server $AZ_DATABASE_NAME \
    --name $AZ_DATABASE_NAME-database-allow-local-ip \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    | jq
```

### Configure a MySQL database

The MySQL server that we created earlier is empty: it doesn't have any database that we can use with our Spring Boot application. Create a new database called `r2dbc`:

```bash
az mysql db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME --name r2dbc \
    | jq
```

## Create a reactive Spring Boot application

### Generate the application using Spring Initializr

To create a reactive Spring Boot application, we will use [Spring Initializr](https://start.spring.io/). The application we will create uses:

- Spring Boot 2.3.0 M3
- Java 8 (but it will also work with newer versions like Java 11)
- The following dependencies: Spring Reactive Web (also known as "Spring WebFlux") and Spring Data R2DBC.

Generate this application using the command line, by typing:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-r2dbc-workshop -d bootVersion=2.3.0.M3 -d javaVersion=8 | tar -xzvf -
```

### Add the reactive MySQL driver implementation

Open up the generated project's `pom.xml` file to add the reactive MySQL driver from [https://github.com/mirromutth/r2dbc-mysql](https://github.com/mirromutth/r2dbc-mysql).

After the `spring-boot-starter-webflux` dependency, add the following snippet:

```xml
<dependency>
   <groupId>dev.miku</groupId>
   <artifactId>r2dbc-mysql</artifactId>
   <version>0.8.1.RELEASE</version>
   <scope>runtime</scope>
</dependency>
```

### Configure Spring Boot to use the Azure Database for MySQL

Open up the *src/main/resources/application.properties* file, and add:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:mysql://$AZ_DATABASE_NAME.mysql.database.azure.com:3306/r2dbc
spring.r2dbc.username=r2dbc@$AZ_DATABASE_NAME
spring.r2dbc.password=$AZ_MYSQL_USERNAME
```

- Replace the two `$AZ_DATABASE_NAME` variables by the value you configured at the beginning of this article.
- Replace the `$AZ_MYSQL_USERNAME` variable by the value you configured at the beginning of this article.

You should now be able to start your application using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

Here is a screenshot of the application running for the first time:

   ![Run the application][R2DBC-MYSQL01]

### Create the database schema

Inside the main `DemoApplication` class, configure a new Spring bean that will create the database schema we will use:

```java
    @Bean
    public ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("schema.sql"));
        initializer.setDatabasePopulator(populator);
        return initializer;
    }
```

That Spring bean uses a file called *schema.sql*, you need to create that file in the *src/main/resources* folder:

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the application and run it again: this script should use the `r2dbc` database that we created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here is a screenshot of the database table being created:

   ![Create the database table][R2DBC-MYSQL02]

## Code the application

We will now add the Java code that will use R2DBC to store and retrieve data from our MySQL Server instance.

Now, create a new `Todo` Java class, next to the `DemoApplication` class:

```java
package com.example.demo;

import org.springframework.data.annotation.Id;

public class Todo {

    public Todo() {
    }

    public Todo(String description, String details, boolean done) {
        this.description = description;
        this.details = details;
        this.done = done;
    }

    @Id
    private Long id;

    private String description;

    private String details;

    private boolean done;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}
```

This class is a domain model, that is mapped on the `todo` table that we have created before.

To manage that class, we will need a repository: create a new `TodoRepository` in the same package:

```java
package com.example.demo;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface TodoRepository extends ReactiveCrudRepository<Todo, Long> {
}
```

This repository is a reactive repository, that is managed by Spring Data R2DBC.

Now, let's finish our application by creating a controller, that will be able to store and retrieve data: create a `TodoController` class in the same package, and copy/paste the following code.

```java
package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Todo> createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    @GetMapping("/")
    public Flux<Todo> getTodos() {
        return todoRepository.findAll();
    }
}
```

Now that your code is finished, kill the application and start it up again:

```bash
./mvnw spring-boot:run
```

## Test the application

To test the application, we will use cURL.

Let's first create a new "todo" item in the database:

```bash
curl  --header "Content-Type: application/json" \
          --request POST \
          --data '{"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done": "true"}' \
          http://127.0.0.1:8080
```

This command should return the created item:

```json
{"id":1,"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done":true}
```

Next, retrieve the data using a new cURL request:

```bash
curl http://127.0.0.1:8080
```

And this command should return the list of "todos", including the item we have created:

```json
[{"id":1,"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done":true}]
```

Here is a screenshot of these cURL requests:

   ![Test with cURL][R2DBC-MYSQL03]

Congratulations! You've created a fully reactive Spring Boot application, that uses R2DBC to store and retrieve data from Azure Database for MySQL.

## Summary

In this tutorial, you created a sample Java application that uses Spring Data R2DBC to store and retrieve information in an Azure Database for MySQL database using R2DBC.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/java/spring-framework)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers](/azure/java/) and the [Working with Azure DevOps and Java](/azure/devops/) pages.

<!-- IMG List -->

[R2DBC-MYSQL01]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png
[R2DBC-MYSQL02]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png
[R2DBC-MYSQL03]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png

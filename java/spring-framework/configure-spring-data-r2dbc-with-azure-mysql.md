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

This topic demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in an [Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/), using the R2DBC implementation for MySQL from [https://github.com/mirromutth/r2dbc-mysql](https://github.com/mirromutth/r2dbc-mysql).

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. It can be used with Spring WebFlux to create fully reactive Spring Boot applications, using non-blocking APIs and providing better scalability than the classic "one thread per connection" approach.

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart) or [Azure CLI](/cli/azure/install-azure-cli).
- [Java 8](https://www.azul.com/downloads/zulu/) (included in Azure Cloud Shell). 
- [cURL](https://curl.haxx.se) or similar HTTP utility to test functionality.

## Prepare the working environment

The instructions below can be followed using a terminal on your local computer (Windows, macOS, or Linux), but we recommend you use the [Azure Shell](https://shell.azure.com/). Using that browser-based tool, you'll be automatically logged in, and you'll have access to all the tools that you'll need.

First, set up some environment variables using the following commands:

```bash
AZ_RESOURCE_GROUP=r2dbc-workshop
AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
AZ_LOCATION=<YOUR_AZURE_REGION>
AZ_MYSQL_USERNAME=r2dbc
AZ_MYSQL_PASSWORD=<YOUR_MYSQL_PASSWORD>
AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this topic:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL Server instance. It should be unique across Azure.
- `<YOUR_AZURE_REGION>`: the Azure region you'll use. You can use `eastus` by default, but we recommend you configure a region closer to where you live. You can have the full list of available regions by typing `az account list-locations`.
- `<YOUR_MYSQL_PASSWORD>`: the password of your MySQL database server. That password should have a minimum of eight characters, and characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: the IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to point your browser to [http://ipv4.icanhazip.com](http://ipv4.icanhazip.com).

Next, create a resource group.

```bash
az group create --name $AZ_RESOURCE_GROUP --location $AZ_LOCATION | jq
```

> [!NOTE]
> We use the `jq` utility, which is installed by default on [Azure Cloud Shell](https://shell.azure.com/), in order to display JSON data and make it more readable.
> If you don't like that utility, you can safely remove the `| jq` part of all the commands we'll use.

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

Open up the generated project's *pom.xml* file to add the reactive MySQL driver from [https://github.com/mirromutth/r2dbc-mysql](https://github.com/mirromutth/r2dbc-mysql).

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

Inside the main `DemoApplication` class, configure a new Spring bean that will create the database schema you'll use:

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

This Spring bean uses a file called *schema.sql*, so create that file in the *src/main/resources* folder:

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Use the following command to stop the application and run it again. The application will now use the `r2dbc` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table being created:

   ![Create the database table][R2DBC-MYSQL02]

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your MySQL Server instance.

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

This class is a domain model mapped on the `todo` table that you created before.

To manage that class, you'll need a repository. Define a new `TodoRepository` interface in the same package:

```java
package com.example.demo;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface TodoRepository extends ReactiveCrudRepository<Todo, Long> {
}
```

This repository is a reactive repository managed by Spring Data R2DBC.

Next, finish the application by creating a controller that can store and retrieve data. Implement a `TodoController` class in the same package, and add the following code:

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

Finally, halt the application and start it up again:

```bash
./mvnw spring-boot:run
```

## Test the application

To test the application, you can use cURL.

First, create a new "todo" item in the database:

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

This command will return the list of "todos", including the item you've created:

```json
[{"id":1,"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done":true}]
```

Here is a screenshot of these cURL requests:

   ![Test with cURL][R2DBC-MYSQL03]

Congratulations! You've created a fully reactive Spring Boot application, that uses R2DBC to store and retrieve data from Azure Database for MySQL.

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group:

```bash
az group delete --yes --name $AZ_RESOURCE_GROUP | jq
```

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

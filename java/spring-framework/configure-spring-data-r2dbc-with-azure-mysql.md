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

## Create an Azure Database for MySQL

> [!NOTE]
> 
> You can read more detailed information about creating MySQL databases in [Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Databases**, and then click **Azure Database for MySQL**.

   ![Create a MySQL database][R2DBC-MYSQL01]

1. Enter the following information:

   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Server name**: Choose a unique name for your MySQL server; this will be used to create a fully-qualified domain name like *r2dbc.mysql.database.azure.com*.
   - **Data source**: For this tutorial, select `None` to create a new database.
   - **Admin username**: Specify the database administrator name.
   - **Password** and **Confirm password**: Specify the password for your database administrator.
   - **Location**: Specify the closest geographic region for your database.
   - **Version**: Specify the most-up-to-date database version.

   ![Create your MySQL database properties][R2DBC-MYSQL02]

1. When you have entered all of the above information, click **Review + create**.

1. Review the specification and click **Create**.

### Configure a firewall rule for your server using the Azure portal

1. In the the Azure portal at <https://portal.azure.com/>, click **All Resources**, then select the Azure Database for MySQL resource you just created.

1. Select **Connection security**, and in the **Firewall rules**, create a new rule by specifying a unique name for the rule, then enter the range of IP addresses that will need access to your database, and then click **Save**. (For this exercise the IP address is that of your development machine, which is the client.  You can use it for both **Start IP address** and **End IP address**.)

   ![Configure connection security][R2DBC-MYSQL03]

1. Click on "Save" to save your new firewall rule.

### Retrieve the connection string for your server using the Azure portal

1. Still in the Azure Database for MySQL resource you just created, click **Connection strings**, and copy the value in the **JDBC** text field.

   ![Retrieve your JDBC connection string][R2DBC-MYSQL04]

## Create a reactive Spring Boot application

### Generate the application using Spring Initializr

To create a reactive Spring Boot application, we will use [Spring Initializr](https://start.spring.io/). The application we will create uses:

- Spring Boot 2.3.0 M3
- Java 11
- The following dependencies: Spring Reactive Web (also known as "Spring WebFlux") and Spring Data R2DBC.

Generate this application using the command line, by typing:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-r2dbc-workshop -d bootVersion=2.3.0.M3 -d javaVersion=11 | tar -xzvf -
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

Open up the `src/main/resources/application.properties` file, and add:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:mysql://XXXXXXXXXXXXXXXX.mysql.database.azure.com:3306
spring.r2dbc.username=YYYYYYYYYYYYYYYY@azure-r2dbc-workshop-mysql-server
spring.r2dbc.password=ZZZZZZZZZZZZZZZZ
```

You will need to configure the following properties:

1. `spring.r2dbc.url`: replace `XXXXXXXXXXXXXXXX` by the name of your MySQL server.
2. `spring.r2dbc.username`: replace `YYYYYYYYYYYYYYYY` by your MySQL administrator login, and `XXXXXXXXXXXXXXXX` by the name of your MySQL server.
3. `spring.r2dbc.password`: replace `ZZZZZZZZZZZZZZZZ` by your MySQL password

   ![Configure your Spring Boot properties][R2DBC-MYSQL05]

You should now be able to start your application using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

   ![Run the application][R2DBC-MYSQL06]

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

That Spring bean uses a file called `schema.sql`, you need to create that file in the `src/main/resources` folder:

```sql
CREATE SCHEMA IF NOT EXISTS r2dbc;
USE r2dbc;
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the application and run it again: this should create the `r2dbc` database schema, as well as the `todo` table that it contains.

```bash
./mvnw spring-boot:run
```

   ![Create the database schema][R2DBC-MYSQL07]

## Code the application

First, we need to reconfigure the `src/main/resources/application.properties` file, in order to use the database schema we just created.

Open up that file again, and add the `r2dbc` schema at the end of the database URL, configured by the `spring.r2dbc.url` key:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:mysql://XXXXXXXXXXXXXXXX.mysql.database.azure.com:3306/r2dbc
spring.r2dbc.username=YYYYYYYYYYYYYYYY@azure-r2dbc-workshop-mysql-server
spring.r2dbc.password=ZZZZZZZZZZZZZZZZ
```

   ![Configure the database name][R2DBC-MYSQL09]

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

This should return the created item:

```json
{"id":1,"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done":true}
```

Let's now request that data using a new cURL request:

```bash
curl http://127.0.0.1:8080
```

And this should return the list of "todos", including the item we have just created:

```json
[{"id":1,"description":"configuration","details":"congratulations, you have set up R2DBC correctly!","done":true}]
```

   ![Test with cURL][R2DBC-MYSQL09]

__Congratulations!__ You have created a fully reactive Spring Boot application, that uses R2DBC to store and retrieve data from Azure Database for MySQL.

## Summary

In this tutorial, you created a sample Java application that uses Spring Data R2DBC to store and retrieve information in an Azure Database for MySQL database using R2DBC.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/java/spring-framework)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers](/azure/java/) and the [Working with Azure DevOps and Java](/azure/devops/) pages.

<!-- IMG List -->

[MYSQL01]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png
[MYSQL02]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png
[MYSQL03]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png
[MYSQL04]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-04.png
[MYSQL05]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-05.png
[MYSQL06]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-06.png
[MYSQL07]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-07.png
[MYSQL08]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-08.png
[MYSQL09]: media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-09.png

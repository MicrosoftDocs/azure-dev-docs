---
title: Use Spring Data R2DBC with Azure Database for MySQL
description: Learn how to use Spring Data R2DBC with an Azure Database for MySQL database.
documentationcenter: java
ms.date: 10/10/2020
ms.service: mysql
ms.tgt_pltfrm: multiple
ms.author: judubois
ms.topic: article
ms.custom: devx-track-java
---

# Use Spring Data R2DBC with Azure Database for MySQL

This topic demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in [Azure Database for MySQL](/azure/mysql/) by using the R2DBC implementation for MySQL from the [r2dbc-mysql GitHub repository](https://github.com/mirromutth/r2dbc-mysql).

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. You can use it with Spring WebFlux to create fully reactive Spring Boot applications that use non-blocking APIs. It provides better scalability than the classic "one thread per connection" approach.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Sample application

In this article, we will code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-mysql](https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-mysql).

[!INCLUDE [spring-data-mysql-setup.md](includes/spring-data-mysql-setup.md)]

[!INCLUDE [spring-data-create-reactive.md](includes/spring-data-create-reactive.md)]

### Generate the application by using Spring Initializr

> [!NOTE]
>
> Spring Initializr uses Java 11 as the default version. To use the Spring Boot Starters described in this topic, you must select Java 8 instead.
> 

Generate the application on the command line by entering:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-database-workshop -d bootVersion=2.3.4.RELEASE -d javaVersion=8 | tar -xzvf -
```

### Add the reactive MySQL driver implementation

Open the generated project's *pom.xml* file to add the reactive MySQL driver from the [r2dbc-mysql repository on GitHub](https://github.com/mirromutth/r2dbc-mysql).

After the `spring-boot-starter-webflux` dependency, add the following snippet:

```xml
<dependency>
   <groupId>dev.miku</groupId>
   <artifactId>r2dbc-mysql</artifactId>
   <version>0.8.1.RELEASE</version>
   <scope>runtime</scope>
</dependency>
```

### Configure Spring Boot to use Azure Database for MySQL

Open the *src/main/resources/application.properties* file, and add:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:pool:mysql://$AZ_DATABASE_NAME.mysql.database.azure.com:3306/demo
spring.r2dbc.username=spring@$AZ_DATABASE_NAME
spring.r2dbc.password=$AZ_MYSQL_PASSWORD
```

- Replace the two `$AZ_DATABASE_NAME` variables with the value that you configured at the beginning of this article.
- Replace the `$AZ_MYSQL_PASSWORD` variable with the value that you configured at the beginning of this article.

> [!NOTE]
> For better performance, the `spring.r2dbc.url` property is configured to use a connection pool using [r2dbc-pool](https://github.com/r2dbc/r2dbc-pool).

You should now be able to start your application by using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

[![The running application](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png)](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png#lightbox)

### Create the database schema

[!INCLUDE [spring-data-r2dbc-create-schema.md](includes/spring-data-r2dbc-create-schema.md)]

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table as it's being created:

[![Creation of the database table](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png)](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png#lightbox)

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your MySQL server.

[!INCLUDE [spring-data-r2dbc-create-application.md](includes/spring-data-r2dbc-create-application.md)]

Here's a screenshot of these cURL requests:

[![Test with cURL](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png)](media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png#lightbox)

Congratulations! You've created a fully reactive Spring Boot application that uses R2DBC to store and retrieve data from Azure Database for MySQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

### Additional resources

For more information about Spring Data R2DBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/r2dbc/docs/current/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).
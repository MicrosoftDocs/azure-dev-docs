---
title: Use Spring Data R2DBC with Azure Database for PostgreSQL
description: Learn how to use Spring Data R2DBC with an Azure Database for PostgreSQL database.
documentationcenter: java
ms.date: 10/10/2020
ms.service: postgresql
ms.tgt_pltfrm: multiple
ms.author: judubois
ms.topic: article
ms.custom: devx-track-java
---

# Use Spring Data R2DBC with Azure Database for PostgreSQL

This topic demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in an [Azure Database for PostgreSQL](/azure/postgresql/) database. The sample will use the R2DBC implementation for PostgreSQL from the [r2dbc-postgresql](https://github.com/pgjdbc/r2dbc-postgresql) repository on GitHub.

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. You can use it with Spring WebFlux to create fully reactive Spring Boot applications that use non-blocking APIs. It provides better scalability than the classic "one thread per connection" approach.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Sample application

In this article, we will code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-postgresql).

[!INCLUDE [spring-data-postgresql-setup.md](includes/spring-data-postgresql-setup.md)]

[!INCLUDE [spring-data-create-reactive.md](includes/spring-data-create-reactive.md)]

### Generate the application by using Spring Initializr

> [!NOTE]
>
> Spring Initializr uses Java 11 as the default version. To use the Spring Boot Starters described in this topic, you must select Java 8 instead.
> 

Generate the application on the command line by using the following command:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-database-workshop -d bootVersion=2.3.4.RELEASE -d javaVersion=8 | tar -xzvf -
```

### Add the reactive PostgreSQL driver implementation

Open the generated project's *pom.xml* file, and then add the reactive PostgreSQL driver from the [r2dbc-postgresql repository on GitHub](https://github.com/pgjdbc/r2dbc-postgresql). After the `spring-boot-starter-webflux` dependency, add the following text:

```xml
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Configure Spring Boot to use Azure Database for PostgreSQL

Open the *src/main/resources/application.properties* file, and add the following text:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:pool:postgres://$AZ_DATABASE_NAME.postgres.database.azure.com:5432/demo
spring.r2dbc.username=spring@$AZ_DATABASE_NAME
spring.r2dbc.password=$AZ_POSTGRESQL_PASSWORD
spring.r2dbc.properties.sslMode=REQUIRE
```

> [!WARNING]
> For security reasons, Azure Database for PostgreSQL requires to use SSL connections. This is why you need to add the `spring.r2dbc.properties.sslMode=REQUIRE` configuration property, otherwise the R2DBC PostgreSQL driver will try to connect using an insecure connection, which will fail.

Replace the two `$AZ_DATABASE_NAME` variables and the `$AZ_POSTGRESQL_PASSWORD` variable with the values that you configured at the beginning of this article.

> [!NOTE]
> For better performance, the `spring.r2dbc.url` property is configured to use a connection pool using [r2dbc-pool](https://github.com/r2dbc/r2dbc-pool).

You should now be able to start your application by using the provided Maven wrapper as follows:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

[![The running application](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-01.png)](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-01.png#lightbox)

### Create the database schema

[!INCLUDE [spring-data-r2dbc-create-schema.md](includes/spring-data-r2dbc-create-schema.md)]

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again using the following command. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table as it's being created:

[![Creation of the database table](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-02.png)](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-02.png#lightbox)

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your PostgreSQL server.

[!INCLUDE [spring-data-r2dbc-create-application.md](includes/spring-data-r2dbc-create-application.md)]

Here's a screenshot of these cURL requests:

[![Test with cURL](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-03.png)](media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-03.png#lightbox)

Congratulations! You've created a fully reactive Spring Boot application that uses R2DBC to store and retrieve data from Azure Database for PostgreSQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

### Additional resources

For more information about Spring Data R2DBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/r2dbc/docs/current/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).
---
title: Use Spring Data JDBC with Azure Database for MySQL
description: Learn how to use Spring Data JDBC with an Azure Database for MySQL database.
documentationcenter: java
ms.date: 10/12/2020
ms.service: mysql
ms.tgt_pltfrm: multiple
ms.author: judubois
ms.topic: article
ms.custom: devx-track-java
---

# Use Spring Data JDBC with Azure Database for MySQL

This topic demonstrates creating a sample application that uses [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc) to store and retrieve information in [Azure Database for MySQL](/azure/mysql/).

[JDBC](https://jcp.org/en/jsr/detail?id=221) is the standard Java API to connect to traditional relational databases.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Sample application

In this article, we will code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql).

[!INCLUDE [spring-data-mysql-setup.md](includes/spring-data-mysql-setup.md)]

### Generate the application by using Spring Initializr

Generate the application on the command line by entering:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=web,data-jdbc,mysql -d baseDir=azure-database-workshop -d bootVersion=2.3.4.RELEASE -d javaVersion=8 | tar -xzvf -
```

### Configure Spring Boot to use Azure Database for MySQL

Open the *src/main/resources/application.properties* file, and add:

```properties
logging.level.org.springframework.jdbc.core=DEBUG

spring.datasource.url=jdbc:mysql://$AZ_DATABASE_NAME.mysql.database.azure.com:3306/demo?serverTimezone=UTC
spring.datasource.username=spring@$AZ_DATABASE_NAME
spring.datasource.password=$AZ_MYSQL_PASSWORD

spring.datasource.initialization-mode=always
```

- Replace the two `$AZ_DATABASE_NAME` variables with the value that you configured at the beginning of this article.
- Replace the `$AZ_MYSQL_PASSWORD` variable with the value that you configured at the beginning of this article.

> [!WARNING]
> The configuration property `spring.datasource.initialization-mode=always` means that Spring Boot will automatically generate a database schema, using the `schema.sql` file that we will create later, each time the server is started. This is great for testing, but remember this will delete your data at each restart, so this shouldn't be used in production!

> [!NOTE]
> We append `?serverTimezone=UTC` to the configuration property `spring.datasource.url`, to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Otherwise, our Java server would not use the same date format as the database, which would result in an error.

You should now be able to start your application by using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

[![The running application](media/configure-spring-data-jdbc-with-azure-mysql/create-mysql-01.png)](media/configure-spring-data-jdbc-with-azure-mysql/create-mysql-01.png#lightbox)

### Create the database schema

Spring Boot will automatically execute *src/main/resources/`schema.sql`* in order to create a database schema. Create that file, with the following content:

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

## Code the application

Next, add the Java code that will use JDBC to store and retrieve data from your MySQL server.

[!INCLUDE [spring-data-jdbc-create-application.md](includes/spring-data-jdbc-create-application.md)]

Here's a screenshot of these cURL requests:

[![Test with cURL](media/configure-spring-data-jdbc-with-azure-mysql/create-mysql-02.png)](media/configure-spring-data-jdbc-with-azure-mysql/create-mysql-02.png#lightbox)

Congratulations! You've created a Spring Boot application that uses JDBC to store and retrieve data from Azure Database for MySQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

### Additional resources

For more information about Spring Data JDBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).
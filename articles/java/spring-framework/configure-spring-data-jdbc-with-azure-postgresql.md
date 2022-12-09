---
title: Use Spring Data JDBC with Azure Database for PostgreSQL
description: Learn how to use Spring Data JDBC with an Azure Database for PostgreSQL database.
documentationcenter: java
ms.service: postgresql
ms.tgt_pltfrm: multiple
author: KarlErickson
ms.date: 12/05/2022
ms.author: bbenz
ms.topic: article
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java
ms.contributors: judubois-09162021
---

# Use Spring Data JDBC with Azure Database for PostgreSQL

This article demonstrates how to create a sample application that uses [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc) to store and retrieve information in an [Azure Database for PostgreSQL](/azure/postgresql/) database.

[JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) is the standard Java API to connect to traditional relational databases.

In this article, we'll include two authentication methods: Azure Active Directory (Azure AD) authentication and PostgreSQL authentication. The **Passwordless** tab shows the Azure AD authentication and the **Password** tab shows the PostgreSQL authentication.

Azure AD authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

PostgreSQL authentication uses accounts stored in PostgreSQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in PostgreSQL, you'll need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql).

[!INCLUDE [spring-data-postgresql-setup.md](includes/spring-data-postgresql-setup.md)]

### Generate the application by using Spring Initializr

Generate the application on the command line by using the following command:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=web,data-jdbc,postgresql,azure-support -d baseDir=azure-database-workshop -d bootVersion=2.7.6 -d javaVersion=1.8 | tar -xzvf -
```

> [!NOTE]
> * Spring Cloud Azure currently supports passwordless connections only in version `4.5.0`. If you want to use passwordless connections, be sure to specify the version as `4.5.0`.
> * Spring Initializr currently doesn't add the `com.azure.spring:spring-cloud-azure-starter-jdbc-postgresql` dependency automatically, so you should manually add the dependency to your *pom.xml* or *build.gradle* file.

### Configure Spring Boot to use Azure Database for PostgreSQL

Open the *src/main/resources/application.properties* file, and add the following text:

#### [Passwordless (Recommended)](#tab/passwordless)

```properties
logging.level.org.springframework.jdbc.core=DEBUG

spring.datasource.url=jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
spring.datasource.username=${AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME}
spring.datasource.azure.passwordless-enabled=true

spring.sql.init.mode=always
```

#### [Password](#tab/password)

```properties
logging.level.org.springframework.jdbc.core=DEBUG

spring.datasource.url=jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
spring.datasource.username=${AZ_POSTGRESQL_NON_ADMIN_USERNAME}
spring.datasource.password=${AZ_POSTGRESQL_NON_ADMIN_PASSWORD}

spring.sql.init.mode=always
```

---

> [!WARNING]
> The configuration property `spring.sql.init.mode=always` means that Spring Boot will automatically generate a database schema, using the *schema.sql* file that you'll create later, each time the server is started. This feature is great for testing, but remember that it will delete your data at each restart, so you shouldn't use it in production.

> [!NOTE]
> This article describes the basic usage, but you can also use a service principal or managed identity to connect. For more information, see [Connect to Azure PostgreSQL using a service principal](spring-cloud-azure.md#connect-to-azure-postgresql-using-a-service-principal) or [Connect to Azure PostgreSQL with Managed Identity in Azure Spring Apps](spring-cloud-azure.md#connect-to-azure-postgresql-with-managed-identity-in-azure-spring-apps).

You should now be able to start your application by using the provided Maven wrapper as follows:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

:::image type="content" source="media/configure-spring-data-jdbc-with-azure-postgresql/running-application.png" alt-text="Screenshot of the running application." lightbox="media/configure-spring-data-jdbc-with-azure-postgresql/running-application.png":::

### Create the database schema

Spring Boot will automatically execute the *src/main/resources/schema.sql* file in order to create a database schema. Create that file and add the following content:

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again using the following command. The application will now use the database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

## Code the application

Next, add the Java code that will use JDBC to store and retrieve data from your PostgreSQL server.

[!INCLUDE [spring-data-jdbc-create-application.md](includes/spring-data-jdbc-create-application.md)]

Here's a screenshot of these cURL requests:

:::image type="content" source="media/configure-spring-data-jdbc-with-azure-postgresql/curl-test.png" alt-text="Screenshot of the cURL test." lightbox="media/configure-spring-data-jdbc-with-azure-postgresql/curl-test.png":::

Congratulations! You've created a Spring Boot application that uses JDBC to store and retrieve data from Azure Database for PostgreSQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

### Additional resources

For more information about Spring Data JDBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).

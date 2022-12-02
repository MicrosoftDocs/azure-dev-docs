---
title: Use Spring Data JPA with Azure Database for MySQL
description: Learn how to use Spring Data JPA with an Azure Database for MySQL database.
ms.service: mysql
ms.tgt_pltfrm: multiple
author: KarlErickson
ms.date: 09/27/2022
ms.author: bbenz
ms.topic: article
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java
ms.contributors: judubois-09162021
---

# Use Spring Data JPA with Azure Database for MySQL

This article demonstrates creating a sample application that uses [Spring Data JPA](https://spring.io/projects/spring-data-jpa) to store and retrieve information in [Azure Database for MySQL](/azure/mysql/).

[The Java Persistence API (JPA)](https://en.wikipedia.org/wiki/Java_Persistence_API) is the standard Java API for object-relational mapping.

In this article, we'll include two authentication methods: Azure Active Directory (Azure AD) authentication and MySQL authentication. The **Passwordless** tab shows the Azure AD authentication and the **Password** tab shows the MySQL authentication.

Azure AD authentication is a mechanism for connecting to Azure Database for MySQL using identities defined in Azure AD. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

MySQL authentication uses accounts stored in MySQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in MySQL, you'll need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Sample application

In this article, we will code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql).

[!INCLUDE [spring-data-mysql-setup.md](includes/spring-data-mysql-setup.md)]

### Generate the application by using Spring Initializr

Generate the application on the command line by entering:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=web,data-jpa,mysql,azure-support -d baseDir=azure-database-workshop -d bootVersion=2.7.6 -d javaVersion=1.8 | tar -xzvf -
```

> [!NOTE]
> Spring Cloud Azure currently supports passwordless connections only in version `4.5.0-beta.1`. If you want to use passwordless connections, be sure to specify the version as `4.5.0-beta.1`.

### Configure Spring Boot to use Azure Database for MySQL

Open the *src/main/resources/application.properties* file and add the following contents:

#### [Passwordless (Recommended)](#tab/passwordless)

```properties
logging.level.org.hibernate.SQL=DEBUG

spring.datasource.azure.passwordless-enabled=true
spring.datasource.url=jdbc:mysql://${AZ_DATABASE_NAME}.mysql.database.azure.com:3306/demo?serverTimezone=UTC
spring.datasource.username=${AZ_MYSQL_AD_NON_ADMIN_USERNAME}

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
```

#### [Password](#tab/password)

```properties
logging.level.org.hibernate.SQL=DEBUG

spring.datasource.url=jdbc:mysql://${AZ_DATABASE_NAME}.mysql.database.azure.com:3306/demo?serverTimezone=UTC
spring.datasource.username=${AZ_MYSQL_NON_ADMIN_USERNAME}
spring.datasource.password=${AZ_MYSQL_NON_ADMIN_PASSWORD}

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
```

---

> [!WARNING]
> The configuration property `spring.sql.init.mode=always` means that Spring Boot will automatically generate a database schema, using the *schema.sql* file that you'll create later, each time the server is started. This feature is great for testing, but remember that it will delete your data at each restart, so you shouldn't use it in production.
>
> The configuration property `spring.datasource.url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Otherwise, your Java server would not use the same date format as the database, which would result in an error.

> [!NOTE]
> This article describes the basic usage, but you can also use a service principal or managed identity to connect. For more information, see [Connect to Azure MySQL using a service principal](spring-cloud-azure.md#connect-to-azure-mysql-using-a-service-principal) or [Connect to Azure MySQL with Managed Identity in Azure Spring Apps](spring-cloud-azure.md#connect-to-azure-mysql-with-managed-identity-in-azure-spring-apps).

You should now be able to start your application by using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

:::image type="content" source="media/configure-spring-data-jpa-with-azure-mysql/running-application.png" alt-text="Screenshot of the running application." lightbox="media/configure-spring-data-jpa-with-azure-mysql/running-application.png":::

## Code the application

Next, add the Java code that will use JPA to store and retrieve data from your MySQL server.

[!INCLUDE [spring-data-jpa-create-application.md](includes/spring-data-jpa-create-application.md)]

Here's a screenshot of these cURL requests:

:::image type="content" source="media/configure-spring-data-jpa-with-azure-mysql/curl-test.png" alt-text="Screenshot of the cURL test." lightbox="media/configure-spring-data-jpa-with-azure-mysql/curl-test.png":::

Congratulations! You've created a Spring Boot application that uses JPA to store and retrieve data from Azure Database for MySQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

### Additional resources

For more information about Spring Data JPA, see Spring's [reference documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).

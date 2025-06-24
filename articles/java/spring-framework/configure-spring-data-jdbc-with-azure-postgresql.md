---
title: Use Spring Data JDBC with Azure Database for PostgreSQL
description: Learn how to use Spring Data JDBC with an Azure Database for PostgreSQL database.
author: KarlErickson
ms.date: 08/28/2024
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java, spring-cloud-azure, devx-track-extended-java
zone_pivot_group_filename: java/java-zone-pivot-groups.json
zone_pivot_groups: passwordless-postgresql
---

# Use Spring Data JDBC with Azure Database for PostgreSQL

This tutorial demonstrates how to store data in an [Azure Database for PostgreSQL](/azure/postgresql/) database using [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc).

[JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) is the standard Java API to connect to traditional relational databases.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and PostgreSQL authentication. The **Passwordless** tab shows the Microsoft Entra authentication and the **Password** tab shows the PostgreSQL authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

PostgreSQL authentication uses accounts stored in PostgreSQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in PostgreSQL, you need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [PostgreSQL command line client](https://www.postgresql.org/download/).

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring Data JDBC**, and **PostgreSQL Driver** dependencies, and then select Java version 8 or higher.

::: zone pivot="postgresql-passwordless-flexible-server"

- If you don't have one, create an Azure Database for PostgreSQL Flexible Server instance named `postgresqlflexibletest` and a database named `demo`. For instructions, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).

## See the sample application

In this tutorial, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql).

[!INCLUDE [spring-data-azure-postgresql-flexible-server-setup.md](includes/spring-data-azure-postgresql-flexible-server-setup.md)]

### Configure Spring Boot to use Azure Database for PostgreSQL

To store data from Azure Database for PostgreSQL using Spring Data JDBC, follow these steps to configure the application:

1. Configure Azure Database for PostgreSQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlflexibletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_ad_non_admin_username>
   spring.datasource.azure.passwordless-enabled=true

   spring.sql.init.mode=always
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlflexibletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_non_admin_username>
   spring.datasource.password=<your_postgresql_non_admin_password>

   spring.sql.init.mode=always
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule, and the following note won't be properly indented. -->
    ---

   > [!WARNING]
   > The configuration property `spring.sql.init.mode=always` means that Spring Boot will automatically generate a database schema, using the **schema.sql** file that you'll create next, each time the server is started. This feature is great for testing, but remember that it will delete your data at each restart, so you shouldn't use it in production.

::: zone-end

::: zone pivot="postgresql-passwordless-single-server"

- If you don't have one, create an Azure Database for PostgreSQL Single Server instance named `postgresqlsingletest` and a database named `demo`. For instructions, see [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/single-server/quickstart-create-server-database-portal).

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-postgresql).

[!INCLUDE [spring-data-azure-postgresql-single-server-setup.md](includes/spring-data-azure-postgresql-single-server-setup.md)]

### Configure Spring Boot to use Azure Database for PostgreSQL

To store data from Azure Database for PostgreSQL using Spring Data JDBC, follow these steps to configure the application:

1. Configure Azure Database for PostgreSQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlsingletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_ad_non_admin_username>@postgresqlsingletest
   spring.datasource.azure.passwordless-enabled=true

   spring.sql.init.mode=always
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlsingletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_non_admin_username>@postgresqlsingletest
   spring.datasource.password=<your_postgresql_non_admin_password>

   spring.sql.init.mode=always
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule, and the following note won't be properly indented. -->
    ---

   > [!WARNING]
   > The configuration property `spring.sql.init.mode=always` means that Spring Boot will automatically generate a database schema, using the **schema.sql** file that you'll create next, each time the server is started. This feature is great for testing, but remember that it will delete your data at each restart, so you shouldn't use it in production.

::: zone-end

<!-- NOTE: The numbering must start with 2 here to continue the sequence after the previous step, otherwise the numbering will reset to 1. -->
2. Create the **src/main/resources/schema.sql** configuration file to configure the database schema, then add the following contents.

   ```sql
   DROP TABLE IF EXISTS todo;
   CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
   ```

[!INCLUDE [spring-data-jdbc-create-application.md](includes/spring-data-jdbc-create-application.md)]

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure PostgreSQL Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/postgresql)

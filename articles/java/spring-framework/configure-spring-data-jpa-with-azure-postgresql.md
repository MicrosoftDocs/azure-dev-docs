---
title: Use Spring Data JPA with Azure Database for PostgreSQL
description: Learn how to use Spring Data JPA with an Azure Database for PostgreSQL database.
ms.date: 08/28/2024
ms.author: karler
ms.reviewer: seal
author: KarlErickson
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java, spring-cloud-azure, devx-track-extended-java
zone_pivot_group_filename: java/java-zone-pivot-groups.json
zone_pivot_groups: passwordless-postgresql
---

# Use Spring Data JPA with Azure Database for PostgreSQL

This tutorial demonstrates how to store data in [Azure Database for PostgreSQL](/azure/postgresql/) using [Spring Data JPA](https://spring.io/projects/spring-data-jpa).

[The Java Persistence API (JPA)](https://en.wikipedia.org/wiki/Java_Persistence_API) is the standard Java API for object-relational mapping.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and PostgreSQL authentication. The **Passwordless** tab shows the Microsoft Entra authentication and the **Password** tab shows the PostgreSQL authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

PostgreSQL authentication uses accounts stored in PostgreSQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in PostgreSQL, you need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [PostgreSQL command line client](https://www.postgresql.org/download/).

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring Data JDBC**, and **PostgreSQL Driver** dependencies, and then select Java version 8 or higher.

::: zone pivot="postgresql-passwordless-flexible-server"

- If you don't have one, create an Azure Database for PostgreSQL Flexible Server instance named `postgresqlflexibletest` and a database named `demo`. For instructions, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).

> [!IMPORTANT]
> To use passwordless connections, configure the Microsoft Entra admin user for your Azure Database for PostgreSQL Flexible Server instance. For more information, see [Manage Microsoft Entra roles in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-manage-azure-ad-users).

## See the sample application

In this tutorial, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jpa-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-jpa-postgresql).

[!INCLUDE [spring-data-azure-postgresql-flexible-server-setup.md](includes/spring-data-azure-postgresql-flexible-server-setup.md)]

### Configure Spring Boot to use Azure Database for PostgreSQL

To store data from Azure Database for PostgreSQL using Spring Data JPA, follow these steps to configure the application:

1. Configure Azure Database for PostgreSQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlflexibletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_ad_non_admin_username>
   spring.datasource.azure.passwordless-enabled=true

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlflexibletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_non_admin_username>
   spring.datasource.password=<your_postgresql_non_admin_password>

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

::: zone-end

::: zone pivot="postgresql-passwordless-single-server"

- If you don't have one, create an Azure Database for PostgreSQL Single Server instance named `postgresqlsingletest` and a database named `demo`. For instructions, see [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/single-server/quickstart-create-server-database-portal).

> [!IMPORTANT]
> To use passwordless connections, configure the Microsoft Entra admin user for your Azure Database for PostgreSQL Single Server instance. For more information, see [Use Microsoft Entra ID for authentication with PostgreSQL](/azure/postgresql/single-server/how-to-configure-sign-in-azure-ad-authentication).

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jpa-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-jpa-postgresql).

[!INCLUDE [spring-data-azure-postgresql-single-server-setup.md](includes/spring-data-azure-postgresql-single-server-setup.md)]

### Configure Spring Boot to use Azure Database for PostgreSQL

To store data from Azure Database for PostgreSQL using Spring Data JPA, follow these steps to configure the application:

1. Configure Azure Database for PostgreSQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlsingletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_ad_non_admin_username>@postgresqlsingletest
   spring.datasource.azure.passwordless-enabled=true

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:postgresql://postgresqlsingletest.postgres.database.azure.com:5432/demo?sslmode=require
   spring.datasource.username=<your_postgresql_non_admin_username>@postgresqlsingletest
   spring.datasource.password=<your_postgresql_non_admin_password>

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

::: zone-end

[!INCLUDE [spring-data-jpa-create-application.md](includes/spring-data-jpa-create-application.md)]

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure PostgreSQL Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/postgresql)

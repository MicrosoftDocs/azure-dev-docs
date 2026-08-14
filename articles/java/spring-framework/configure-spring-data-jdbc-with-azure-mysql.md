---
title: Use Spring Data JDBC with Azure Database for MySQL
description: Learn how to use Spring Data JDBC to store and query data in an Azure Database for MySQL database, using either passwordless Microsoft Entra or MySQL authentication. Start now.
author: KarlErickson
ms.date: 08/19/2025
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java, spring-cloud-azure, devx-track-extended-java
zone_pivot_group_filename: java/java-zone-pivot-groups.json
zone_pivot_groups: passwordless-mysql
---

# Use Spring Data JDBC with Azure Database for MySQL

This tutorial demonstrates how to store data in an [Azure Database for MySQL](/azure/mysql/) database by using [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc).

[JDBC](https://jcp.org/en/jsr/detail?id=221) is the standard Java API to connect to traditional relational databases.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and MySQL authentication. The **Passwordless** tab shows the Microsoft Entra authentication and the **Password** tab shows the MySQL authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Database for MySQL by using identities defined in Microsoft Entra ID. By using Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

MySQL authentication uses accounts stored in MySQL. If you choose to use passwords as credentials for the accounts, you store these credentials in the `user` table. Because these passwords are stored in MySQL, you need to manage the rotation of the passwords yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [MySQL command line client](https://dev.mysql.com/downloads/).

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring Data JDBC**, and **MySQL Driver** dependencies. Then select Java version 8 or higher.

::: zone pivot="mysql-passwordless-flexible-server"

- If you don't have one, create an Azure Database for MySQL Flexible Server instance named `mysqlflexibletest`. For instructions, see [Quickstart: Use the Azure portal to create an Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/quickstart-create-server-portal). Then, create a database named `demo`. For instructions, see [Create and manage databases for Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/how-to-create-manage-databases).

## See the sample application

In this tutorial, you code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql).

[!INCLUDE [spring-data-azure-mysql-flexible-server-setup.md](includes/spring-data-azure-mysql-flexible-server-setup.md)]

### Configure Spring Boot to use Azure Database for MySQL

To store data in Azure Database for MySQL using Spring Data JDBC, follow these steps to configure the application:

1. Configure Azure Database for MySQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlflexibletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_ad_non_admin_username>
   spring.datasource.azure.passwordless-enabled=true

   spring.sql.init.mode=always
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlflexibletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_non_admin_username>
   spring.datasource.password=<your_mysql_non_admin_password>

   spring.sql.init.mode=always
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it renders as a hard rule. -->
    ---

   > [!WARNING]
   > The configuration property `spring.sql.init.mode=always` means that Spring Boot automatically generates a database schema, using the **schema.sql** file that you create next, each time the server starts. This feature is great for testing, but it deletes your data at each restart. Don't use it in production.
   >
   > The configuration property `spring.datasource.url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Without this parameter, your Java server doesn't use the same date format as the database, which results in an error.

::: zone-end

::: zone pivot="mysql-passwordless-single-server"

- If you don't have one, create an Azure Database for MySQL single server instance named `mysqlsingletest`. For instructions, see [Quickstart: Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/single-server/quickstart-create-mysql-server-database-using-azure-portal). Then, create a database named `demo`. For instructions, see the [Create a database](/azure/mysql/single-server/how-to-create-users#create-a-database) section of [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

## See the sample application

In this article, you code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-mysql).

[!INCLUDE [spring-data-azure-mysql-single-server-setup.md](includes/spring-data-azure-mysql-single-server-setup.md)]

### Configure Spring Boot to use Azure Database for MySQL

To store data in Azure Database for MySQL using Spring Data JDBC, follow these steps to configure the application:

1. Configure Azure Database for MySQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlsingletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_ad_non_admin_username>@mysqlsingletest
   spring.datasource.azure.passwordless-enabled=true

   spring.sql.init.mode=always
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlsingletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_non_admin_username>@mysqlsingletest
   spring.datasource.password=<your_mysql_non_admin_password>

   spring.sql.init.mode=always
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it renders as a hard rule, and the following note isn't properly indented. -->
    ---

   > [!WARNING]
   > The configuration property `spring.sql.init.mode=always` means that Spring Boot automatically generates a database schema, using the **schema.sql** file that you create next, each time the server starts. This feature is great for testing, but it deletes your data at each restart. Don't use it in production.
   >
   > The configuration property `spring.datasource.url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Without this parameter, your Java server doesn't use the same date format as the database, which results in an error.

::: zone-end

<!-- NOTE: The numbering must start with 2 here to continue the sequence after the previous step, otherwise the numbering resets to 1. -->
2. Create the **src/main/resources/schema.sql** configuration file to configure the database schema, and then add the following contents.

   ```sql
   DROP TABLE IF EXISTS todo;
   CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
   ```

[!INCLUDE [spring-data-jdbc-create-application.md](includes/spring-data-jdbc-create-application.md)]

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure MySQL Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/mysql)

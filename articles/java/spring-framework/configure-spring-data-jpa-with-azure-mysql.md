---
title: Use Spring Data JPA with Azure Database for MySQL
description: Learn how to use Spring Data JPA with an Azure Database for MySQL database.
author: KarlErickson
ms.date: 08/28/2024
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, passwordless-java, spring-cloud-azure, devx-track-extended-java
zone_pivot_group_filename: java/java-zone-pivot-groups.json
zone_pivot_groups: passwordless-mysql
---

# Use Spring Data JPA with Azure Database for MySQL

This tutorial demonstrates how to store data in [Azure Database for MySQL](/azure/mysql/) database using [Spring Data JPA](https://spring.io/projects/spring-data-jpa).

[The Java Persistence API (JPA)](https://en.wikipedia.org/wiki/Java_Persistence_API) is the standard Java API for object-relational mapping.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and MySQL authentication. The **Passwordless** tab shows the Microsoft Entra authentication and the **Password** tab shows the MySQL authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Database for MySQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

MySQL authentication uses accounts stored in MySQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in MySQL, you need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [MySQL command line client](https://dev.mysql.com/downloads/).

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring Data JPA**, and **MySQL Driver** dependencies, and then select Java version 8 or higher.

::: zone pivot="mysql-passwordless-flexible-server"

- If you don't have one, create an Azure Database for MySQL Flexible Server instance named `mysqlflexibletest`. For instructions, see [Quickstart: Use the Azure portal to create an Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/quickstart-create-server-portal). Then, create a database named `demo`. For instructions, see [Create and manage databases for Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/how-to-create-manage-databases).

> [!IMPORTANT]
> To use passwordless connections, create a Microsoft Entra admin user for your Azure Database for MySQL instance. For instructions, see the [Configure the Microsoft Entra Admin](/azure/mysql/flexible-server/how-to-azure-ad#configure-the-azure-ad-admin) section of [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-azure-ad).

## See the sample application

In this tutorial, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql).

[!INCLUDE [spring-data-azure-mysql-flexible-server-setup.md](includes/spring-data-azure-mysql-flexible-server-setup.md)]

### Configure Spring Boot to use Azure Database for MySQL

To store data from Azure Database for MySQL using Spring Data JPA, follow these steps to configure the application:

1. Configure Azure Database for MySQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.azure.passwordless-enabled=true
   spring.datasource.url=jdbc:mysql://mysqlflexibletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_ad_non_admin_username>

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlflexibletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_non_admin_username>
   spring.datasource.password=<your_mysql_non_admin_password>

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

   > [!WARNING]
   > The configuration property `spring.datasource.url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Without this parameter, your Java server wouldn't use the same date format as the database, which would result in an error.

::: zone-end

::: zone pivot="mysql-passwordless-single-server"

- If you don't have one, create an Azure Database for MySQL Single Server instance named `mysqlsingletest`. For instructions, see [Quickstart: Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/single-server/quickstart-create-mysql-server-database-using-azure-portal). Then, create a database named `demo`. For instructions, see the [Create a database](/azure/mysql/single-server/how-to-create-users#create-a-database) section of [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

> [!IMPORTANT]
> To use passwordless connections, create a Microsoft Entra admin user for your Azure Database for MySQL instance. For instructions, see the [Setting the Microsoft Entra Admin user](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication#setting-the-azure-ad-admin-user) section of [Use Microsoft Entra ID for authentication with MySQL](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication).

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql](https://github.com/Azure-Samples/quickstart-spring-data-jpa-mysql).

[!INCLUDE [spring-data-azure-mysql-single-server-setup.md](includes/spring-data-azure-mysql-single-server-setup.md)]

### Configure Spring Boot to use Azure Database for MySQL

To store data from Azure Database for MySQL using Spring Data JPA, follow these steps to configure the application:

1. Configure Azure Database for MySQL credentials by adding the following properties to your **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.azure.passwordless-enabled=true
   spring.datasource.url=jdbc:mysql://mysqlsingletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_ad_non_admin_username>@mysqlsingletest

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.hibernate.SQL=DEBUG

   spring.datasource.url=jdbc:mysql://mysqlsingletest.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<your_mysql_non_admin_username>@mysqlsingletest
   spring.datasource.password=<your_mysql_non_admin_password>

   spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.properties.hibernate.dialect =org.hibernate.dialect.MySQL8Dialect
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule, and the following note won't be properly indented. -->
    ---

   > [!WARNING]
   > The configuration property `spring.datasource.url` has `?serverTimezone=UTC` appended to tell the JDBC driver to use the UTC date format (or Coordinated Universal Time) when connecting to the database. Without this parameter, your Java server wouldn't use the same date format as the database, which would result in an error.

::: zone-end

[!INCLUDE [spring-data-jpa-create-application.md](includes/spring-data-jpa-create-application.md)]

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure MySQL Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/mysql)

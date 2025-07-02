---
title: Use Spring Data JDBC with Azure SQL Database
description: Learn how to use Spring Data JDBC with an Azure SQL Database.
ms.date: 08/28/2024
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, spring-cloud-azure, passwordless-java, devx-track-extended-java
---

# Use Spring Data JDBC with Azure SQL Database

This tutorial demonstrates how to store data in [Azure SQL Database](/azure/sql-database/) using [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc).

[JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) is the standard Java API to connect to traditional relational databases.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and SQL Database authentication. The Passwordless tab shows the Microsoft Entra authentication and the Password tab shows the SQL Database authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Database for SQL Database using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

SQL Database authentication uses accounts stored in SQL Database. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the user table. Because these passwords are stored in SQL Database, you need to manage the rotation of the passwords by yourself.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [sqlcmd Utility](/sql/tools/sqlcmd/sqlcmd-utility).

- [ODBC Driver](/sql/connect/odbc/download-odbc-driver-for-sql-server) 17 or 18.

- If you don't have one, create an Azure SQL Server instance named `sqlservertest` and a database named `demo`. For instructions, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring Data JDBC**, and **MS SQL Server Driver** dependencies, and then select Java version 8 or higher.

## See the sample application

In this tutorial, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-jdbc-sql-server](https://github.com/Azure-Samples/quickstart-spring-data-jdbc-sql-server).

[!INCLUDE [spring-data-sql-server-setup.md](includes/spring-data-sql-server-setup.md)]

## Store data from Azure SQL Database

With an Azure SQL Database instance, you can store data by using Spring Cloud Azure.

To install the Spring Cloud Azure Starter module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.22.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Starter artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  ```

  > [!NOTE]
  > As this is a dependency, it should be added in the `<dependencies>` section of the **pom.xml**. Its version is not configured here, as it is managed by the BOM that we added previously.

### Configure Spring Boot to use Azure SQL Database

To store data from Azure SQL Database using Spring Data JDBC, follow these steps to configure the application:

1. Configure an Azure SQL Database credentials in the **application.properties** configuration file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:sqlserver://sqlservertest.database.windows.net:1433;databaseName=demo;authentication=DefaultAzureCredential;

   spring.sql.init.mode=always
   ```

   #### [Password](#tab/password)

   ```properties
   logging.level.org.springframework.jdbc.core=DEBUG

   spring.datasource.url=jdbc:sqlserver://sqlservertest.database.windows.net:1433;database=demo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
   spring.datasource.username=<your_sql_server_non_admin_username>@sqlservertest
   spring.datasource.password=<your_sql_server_non_admin_password>

   spring.sql.init.mode=always
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule, and the following note won't be properly indented. -->
    ---

   > [!WARNING]
   > The configuration property `spring.sql.init.mode=always` means that Spring Boot will automatically generate a database schema, using the **schema.sql** file that you'll create next, each time the server is started. This is great for testing, but remember that this will delete your data at each restart, so you shouldn't use it in production.

<!-- NOTE: The numbering must start with 2 here to continue the sequence after the previous step, otherwise the numbering will reset to 1. -->
2. Create the **src/main/resources/schema.sql** configuration file to configure the database schema, then add the following contents.

   ```sql
   DROP TABLE IF EXISTS todo;
   CREATE TABLE todo (id INT IDENTITY PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BIT);
   ```

[!INCLUDE [spring-data-jdbc-create-application.md](includes/spring-data-jdbc-create-application.md)]

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)

---
title: How to use Spring Data JDBC with Azure PostgreSQL
description: Learn how to use Spring Data JDBC with an Azure PostgreSQL database.
services: postgresql
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: postgresql
ms.tgt_pltfrm: multiple
ms.topic: article
---

# How to use Spring Data JDBC with Azure PostgreSQL

## Overview

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information in an Azure [PostgreSQL](https://www.postgresql.org/) database using [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* [Curl](https://curl.haxx.se/) or similar HTTP utility to test functionality.
* The [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line utility.
* A [Git](https://git-scm.com/downloads) client.

## Create a PostgreSQL database for Azure

### Create a PostgreSQL database server using the Azure Portal

> [!NOTE]
> 
> You can read more detailed information about creating PostgreSQL databases in [Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Databases**, and then click **Azure Database for PostgreSQL**.

   ![Create a PostgreSQL database][POSTGRESQL01]

1. Enter the following information:

   - **Server name**: Choose a unique name for your PostgreSQL server; this will be used to create a fully-qualified domain name like *wingtiptoyspostgresql.postgres.database.azure.com*.
   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Select source**: For this tutorial, select `Blank` to create a new database.
   - **Server admin login**: Specify the database administrator name.
   - **Password** and **Confirm password**: Specify the password for your database administrator.
   - **Location**: Specify the closest geographic region for your database.
   - **Version**: Specify the most-up-to-date database version.
   - **Pricing tier**: For this tutorial, specify the least-expensive pricing tier.

   ![Create your PostgreSQL database properties][POSTGRESQL02]

1. When you have entered all of the above information, click **Create**.

### Configure a firewall rule for your PostgreSQL database server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the PostgreSQL database you just created.

   ![Select your PostgreSQL database][POSTGRESQL03]

1. Click **Connection security**, and in the **Firewall rules**, create a new rule by specifying a unique name for the rule, then enter the range of IP addresses that will need access to your database, and then click **Save**.

   ![Configure connection security][POSTGRESQL04]

### Retrieve the connection string for your PostgreSQL server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the PostgreSQL database you just created.

   ![Select your PostgreSQL database][POSTGRESQL03]

1. Click **Connection strings**, and copy the value in the **JDBC** text field.

   ![Retrieve your JDBC connection string][POSTGRESQL05]

### Create PostgreSQL database using the `psql` command-line utility

1. Open a command shell and connect to your PostgreSQL server by entering a `psql` command like the following example:

   ```shell
   psql --host=wingtiptoyspostgresql.postgres.database.azure.com --port=5432 --username=wingtiptoysuser@wingtiptoyspostgresql --dbname=postgres
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `host` | Specifies your fully qualified PostgreSQL server name from earlier in this article. |
   | `host` | Specifies the PostgreSQL server port, which is `5432` by default. |
   | `username` | Specifies your PostgreSQL administrator and shortened server name from earlier in this article. |
   | `dbname` | Specifies that you want to use the default `postgres` database for now. |

   Your PostgreSQL server should respond with a display like the following example:

   ```shell
   psql (9.3.24, server 10.5)
   SSL connection (cipher: ECDHE-RSA-AES256-SHA384, bits: 256)
   Type "help" for help.
   
   postgres=>
   ```

1. Create a database named *mypgsqldb* by entering a `psql` command like the following example:

   ```SQL
   CREATE DATABASE mypgsqldb;
   ```

   Your PostgreSQL server should respond with a display like the following example:

   ```shell
   CREATE DATABASE
   ```

1. OPTIONAL: You can verify that your database was created by entering a `\l` at the `psql`; your PostgreSQL server should respond with something like the following example:

   ```shell
                   List of databases
          Name        |      Owner      | Encoding
   -------------------+-----------------+----------
    azure_maintenance | azure_superuser | UTF8
    azure_sys         | azure_superuser | UTF8
    mypgsqldb         | wingtiptoysuser | UTF8
    postgres          | azure_superuser | UTF8
    template0         | azure_superuser | UTF8
    template1         | azure_superuser | UTF8
   (6 rows)
   ```

1. Enter `\q` to exit the `psql` utility.

## Configure the sample application

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-jdbc-on-azure.git
   ```

1. Locate the *application.properties* file in the *resources* directory of the sample project, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add or configure the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.datasource.url=jdbc:postgresql://wingtiptoyspostgresql.postgres.database.azure.com:5432/mypgsqldb?ssl=true&sslmode=prefer
   spring.datasource.username=wingtiptoysuser@wingtiptoyspostgresql
   spring.datasource.password=********
    ```
   Where:

   | Parameter | Description |
   |---|---|
   | `spring.datasource.url` | Specifies your PostgreSQL JDBC string from earlier in this article. |
   | `spring.datasource.username` | Specifies your PostgreSQL administrator name from earlier in this article, with the shortened server name appended to it. |
   | `spring.datasource.password` | Specifies your PostgreSQL administrator password from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

1. Build the sample application with Maven; for example:

   ```shell
   mvn clean package -P postgresql
   ```

1. Start the sample application; for example:

   ```shell
   java -jar target/spring-data-jdbc-on-azure-0.1.0-SNAPSHOT.jar
   ```

1. Create new records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s -d '{"name":"dog","species":"canine"}' -H "Content-Type: application/json" -X POST http://localhost:8080/pets

   curl -s -d '{"name":"cat","species":"feline"}' -H "Content-Type: application/json" -X POST http://localhost:8080/pets
   ```

   Your application should return values like the following:

   ```shell
   Added Pet(id=1, name=dog, species=canine).

   Added Pet(id=2, name=cat, species=feline).
   ```

1. Retrieve all of the existing records using `curl` from a command prompt like the following examples:

   ```shell
   curl -s http://localhost:8080/pets
   ```
    
   Your application should return values like the following:

   ```json
   [{"id":1,"name":"dog","species":"canine"},{"id":2,"name":"cat","species":"feline"}]
   ```

## Summary

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information in an Azure PostgreSQL database using JDBC.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Azure for Java Developers]: /java/azure/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Data]: https://spring.io/projects/spring-data
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[POSTGRESQL01]: media/configure-spring-data-jdbc-with-azure-postgresql/create-postgresql-01.png
[POSTGRESQL02]: media/configure-spring-data-jdbc-with-azure-postgresql/create-postgresql-02.png
[POSTGRESQL03]: media/configure-spring-data-jdbc-with-azure-postgresql/create-postgresql-03.png
[POSTGRESQL04]: media/configure-spring-data-jdbc-with-azure-postgresql/create-postgresql-04.png
[POSTGRESQL05]: media/configure-spring-data-jdbc-with-azure-postgresql/create-postgresql-05.png

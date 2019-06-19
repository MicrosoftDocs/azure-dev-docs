---
title: How to use Spring Data JPA with Azure MySQL
description: Learn how to use Spring Data JPA with an Azure MySQL database.
services: mysql
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: mysql
ms.tgt_pltfrm: multiple
ms.topic: article
---

# How to use Spring Data JPA with Azure MySQL

## Overview

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information in an Azure [MySQL](https://www.mysql.com/) database using [Java Persistence API (JPA)](https://docs.oracle.com/javaee/7/tutorial/persistence-intro.htm).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* [Curl](https://curl.haxx.se/) or similar HTTP utility to test functionality.
* The [mysql](https://dev.mysql.com/downloads/) command-line utility.
* A [Git](https://git-scm.com/downloads) client.

## Create a MySQL database for Azure

### Create a MySQL database server using the Azure Portal

> [!NOTE]
> 
> You can read more detailed information about creating MySQL databases in [Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Databases**, and then click **Azure Database for MySQL**.

   ![Create a MySQL database][MYSQL01]

1. Enter the following information:

   - **Server name**: Choose a unique name for your MySQL server; this will be used to create a fully-qualified domain name like *wingtiptoysmysql.mysql.database.azure.com*.
   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Select source**: For this tutorial, select `Blank` to create a new database.
   - **Server admin login**: Specify the database administrator name.
   - **Password** and **Confirm password**: Specify the password for your database administrator.
   - **Location**: Specify the closest geographic region for your database.
   - **Version**: Specify the most-up-to-date database version.
   - **Pricing tier**: For this tutorial, specify the least-expensive pricing tier.

   ![Create your MySQL database properties][MYSQL02]

1. When you have entered all of the above information, click **Create**.

### Configure a firewall rule for your MySQL database server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the MySQL database you just created.

   ![Select your MySQL database][MYSQL03]

1. Click **Connection security**, and in the **Firewall rules**, create a new rule by specifying a unique name for the rule, then enter the range of IP addresses that will need access to your database, and then click **Save**.

   ![Configure connection security][MYSQL04]

### Retrieve the connection string for your MySQL server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the MySQL database you just created.

   ![Select your MySQL database][MYSQL03]

1. Click **Connection strings**, and copy the value in the **JDBC** text field.

   ![Retrieve your JDBC connection string][MYSQL05]

### Create MySQL database using the `mysql` command-line utility

1. Open a command shell and connect to your MySQL server by entering a `mysql` command like the following example:

   ```shell
   mysql --host wingtiptoysmysql.mysql.database.azure.com --user wingtiptoysuser@wingtiptoysmysql -p
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `host` | Specifies your fully qualified MySQL server name from earlier in this article. |
   | `user` | Specifies your MySQL administrator and shortened server name from earlier in this article. |
   | `p` | Specifies to wait until prompted for a password. |


   Your MySQL server should respond with a display like the following example:

   ```shell
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 64552
   Server version: 5.6.39.0 MySQL Community Server (GPL)
   
   Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.
   
   Oracle is a registered trademark of Oracle Corporation and/or its
   affiliates. Other names may be trademarks of their respective
   owners.
   
   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
   
   mysql>
   ```

1. Create a database named *mysqldb* by entering a `mysql` command like the following example:

   ```SQL
   CREATE DATABASE mysqldb;
   ```

   Your MySQL server should respond with a display like the following example:

   ```shell
   Query OK, 1 row affected (0.30 sec)
   ```

1. OPTIONAL: You can verify that your database was created by entering a `mysql` command like the following example:

   ```SQL
   SHOW DATABASES;
   ```

   Your MySQL server should respond with a display like the following example:

   ```shell
   +--------------------+
   | Database           |
   +--------------------+
   | information_schema |
   | mysql              |
   | mysqldb            |
   | performance_schema |
   | sys                |
   +--------------------+
   ```

1. Enter `\q` to exit the `mysql` utility.

## Configure the sample application

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-jpa-on-azure.git
   ```

1. Locate the *application.properties* file in the *resources* directory of the sample project, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add or configure the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.jpa.database-platform=org.hibernate.dialect.MySQL5InnoDBDialect
   spring.datasource.url=jdbc:mysql://wingtiptoysmysql.mysql.database.azure.com:3306/mysqldb?useSSL=true&requireSSL=false
   spring.datasource.username=wingtiptoysuser@wingtiptoysmysql
   spring.datasource.password=********
    ```
   Where:

   | Parameter | Description |
   |---|---|
   | `spring.jpa.database-platform` | Specifies the JPA database platform. |
   | `spring.datasource.url` | Specifies your MySQL JDBC string from earlier in this article. |
   | `spring.datasource.username` | Specifies your MySQL administrator name from earlier in this article, with the shortened server name appended to it. |
   | `spring.datasource.password` | Specifies your MySQL administrator password from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

1. Build the sample application with Maven; for example:

   ```shell
   mvn clean package -P mysql
   ```

1. Start the sample application; for example:

   ```shell
   java -jar target/spring-data-jpa-on-azure-0.1.0-SNAPSHOT.jar
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

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information in an Azure MySQL database using JPA.

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

[MYSQL01]: media/configure-spring-data-jpa-with-azure-mysql/create-mysql-01.png
[MYSQL02]: media/configure-spring-data-jpa-with-azure-mysql/create-mysql-02.png
[MYSQL03]: media/configure-spring-data-jpa-with-azure-mysql/create-mysql-03.png
[MYSQL04]: media/configure-spring-data-jpa-with-azure-mysql/create-mysql-04.png
[MYSQL05]: media/configure-spring-data-jpa-with-azure-mysql/create-mysql-05.png

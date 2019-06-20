---
title: How to use Spring Data JPA with Azure SQL Database
description: Learn how to use Spring Data JPA with an Azure SQL database.
services: sql-database
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: sql-database
ms.tgt_pltfrm: multiple
ms.topic: article
---

# How to use Spring Data JPA with Azure SQL Database

## Overview

This article demonstrates creating a sample application that uses [Spring Data] to store and retrieve information in an [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) using [Java Persistence API (JPA)](https://docs.oracle.com/javaee/7/tutorial/persistence-intro.htm).

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* [Curl](https://curl.haxx.se/) or similar HTTP utility to test functionality.
* A [Git](https://git-scm.com/downloads) client.

## Create an Azure SQL Database

### Create a SQL database server using the Azure Portal

> [!NOTE]
> 
> You can read more detailed information about creating Azure SQL databases in [Create an Azure SQL database in the Azure portal](/azure/sql-database/sql-database-get-started-portal).

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Databases**, and then click **SQL Database**.

   ![Create a SQL database][SQL01]

1. Specify the following information:

   - **Database name**: Choose a unique name for your SQL database; this will be created in the SQL server that you will specify later.
   - **Subscription**: Specify your Azure subscription to use.
   - **Resource group**: Specify whether to create a new resource group, or choose an existing resource group.
   - **Select source**: For this tutorial, select `Blank database` to create a new database.

   ![Specify your SQL database properties][SQL02]
   
1. Click **Server**, then **Create a new server**, and then specify the following information:

   - **Server name**: Choose a unique name for your SQL server; this will be used to create a fully-qualified domain name like *wingtiptoyssql.database.windows.net*.
   - **Server admin login**: Specify the database administrator name.
   - **Password** and **Confirm password**: Specify the password for your database administrator.
   - **Location**: Specify the closest geographic region for your database.

   ![Specify your SQL server][SQL03]

1. When you have entered all of the above information, click **Select**.

1. For this tutorial, specify the least-expensive **Pricing tier**, and then click **Create**.

   ![Create your SQL database][SQL04]

### Configure a firewall rule for your SQL server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the SQL server you just created.

   ![Select your SQL server][SQL05]

1. In the **Overview** section, click **Show firewall settings**

   ![Show firewall settings][SQL06]

1. In the **Firewalls and virtual networks** section, create a new rule by specifying a unique name for the rule, then enter the range of IP addresses that will need access to your database, and then click **Save**.

   ![Configure firewall settings][SQL07]

### Retrieve the connection string for your SQL server using the Azure Portal

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **All Resources**, then click the SQL database you just created.

   ![Select your SQL database][SQL08]

1. Click **Connection strings**, then click **JDBC**, and copy the value in the JDBC text field.

   ![Retrieve your JDBC connection string][SQL09]

## Configure the sample application

1. Open a command shell and clone the sample project using a git command like the following example:

   ```shell
   git clone https://github.com/Azure-Samples/spring-data-jdbc-on-azure.git
   ```

1. Locate the *application.properties* file in the *resources* directory of the sample project, or create the file if it does not already exist.

1. Open the *application.properties* file in a text editor, and add or configure the following lines in the file, and replace the sample values with the appropriate values from earlier:

   ```yaml
   spring.datasource.url=jdbc:sqlserver://wingtiptoyssql.database.windows.net:1433;database=wingtiptoys;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
   spring.datasource.username=wingtiptoysuser@wingtiptoyssql
   spring.datasource.password=********
    ```
   Where:

   | Parameter | Description |
   |---|---|
   | `spring.datasource.url` | Specifies an edited version of your SQL JDBC string from earlier in this article. |
   | `spring.datasource.username` | Specifies your SQL administrator name from earlier in this article, with the shortened server name appended to it. |
   | `spring.datasource.password` | Specifies your SQL administrator password from earlier in this article. |

1. Save and close the *application.properties* file.

## Package and test the sample application 

1. Build the sample application with Maven; for example:

   ```shell
   mvn clean package -P sql
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

In this tutorial, you created a sample Java application that uses Spring Data to store and retrieve information in an Azure SQL database using JPA.

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

[SQL01]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-01.png
[SQL02]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-02.png
[SQL03]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-03.png
[SQL04]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-04.png
[SQL05]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-05.png
[SQL06]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-06.png
[SQL07]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-07.png
[SQL08]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-08.png
[SQL09]: media/configure-spring-data-jpa-with-azure-sql-server/create-azure-sql-09.png

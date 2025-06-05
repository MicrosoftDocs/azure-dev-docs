---
title: Use Spring Data R2DBC with Azure SQL Database
description: Learn how to use Spring Data R2DBC with an Azure SQL Database.
ms.author: karler
ms.reviewer: seal
ms.date: 07/22/2022
author: KarlErickson
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Data R2DBC with Azure SQL Database

This article demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in [Azure SQL Database](/azure/sql-database/) by using the R2DBC implementation for Microsoft SQL Server from the [r2dbc-mssql GitHub repository](https://github.com/r2dbc/r2dbc-mssql).

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. You can use it with Spring WebFlux to create fully reactive Spring Boot applications that use non-blocking APIs. It provides better scalability than the classic "one thread per connection" approach.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [sqlcmd Utility](/sql/tools/sqlcmd/sqlcmd-utility).

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-sql-server](https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-sql-server).

## Prepare the working environment

First, set up some environment variables by using the following commands:

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_SQL_SERVER_ADMIN_USERNAME=spring
export AZ_SQL_SERVER_ADMIN_PASSWORD=<YOUR_AZURE_SQL_ADMIN_PASSWORD>
export AZ_SQL_SERVER_NON_ADMIN_USERNAME=nonspring
export AZ_SQL_SERVER_NON_ADMIN_PASSWORD=<YOUR_AZURE_SQL_NON_ADMIN_PASSWORD>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your Azure SQL Database server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by using `az account list-locations`.
- `<AZ_SQL_SERVER_ADMIN_PASSWORD>` and `<AZ_SQL_SERVER_NON_ADMIN_PASSWORD>`: The password of your Azure SQL Database server, which should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

[!INCLUDE [security-note](../includes/security-note.md)]

Next, create a resource group by using the following command:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure SQL Database instance

Next, create a managed Azure SQL Database server instance by running the following command.

> [!NOTE]
> The MS SQL password has to meet specific criteria, and setup will fail with a non-compliant password. For more information, see [Password Policy](/sql/relational-databases/security/password-policy/).

```azurecli
az sql server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_SQL_SERVER_ADMIN_USERNAME \
    --admin-password $AZ_SQL_SERVER_ADMIN_PASSWORD \
    --output tsv
```

## Configure a firewall rule for your Azure SQL Database server

Azure SQL Database instances are secured by default. They have a firewall that doesn't allow any incoming connection. To be able to use your database, you need to add a firewall rule that will allow the local IP address to access the database server.

Because you configured your local IP address at the beginning of this article, you can open the server's firewall by running the following command:

```azurecli
az sql server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME-database-allow-local-ip \
    --server $AZ_DATABASE_NAME \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    --output tsv
```

If you're connecting to your Azure SQL Database server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall.

Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
export AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli

az sql server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME-database-allow-local-ip-wsl \
    --server $AZ_DATABASE_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --output tsv

```

## Configure an Azure SQL database

The Azure SQL Database server that you created earlier is empty. It doesn't have any database that you can use with the Spring Boot application. Create a new database called `demo` by running the following command:

```azurecli
az sql db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name demo \
    --server $AZ_DATABASE_NAME \
    --output tsv
```

## Create an SQL database non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

Create a SQL script called **create_user.sql** for creating a non-admin user. Add the following contents and save it locally:

[!INCLUDE [security-note](../includes/security-note.md)]

```bash
cat << EOF > create_user.sql
USE demo;
GO
CREATE USER $AZ_SQL_SERVER_NON_ADMIN_USERNAME WITH PASSWORD='$AZ_SQL_SERVER_NON_ADMIN_PASSWORD'
GO
GRANT CONTROL ON DATABASE::demo TO $AZ_SQL_SERVER_NON_ADMIN_USERNAME;
GO
EOF
```

Then, use the following command to run the SQL script to create the non-admin user:

```bash
sqlcmd -S $AZ_DATABASE_NAME.database.windows.net,1433  -d demo -U $AZ_SQL_SERVER_ADMIN_USERNAME -P $AZ_SQL_SERVER_ADMIN_PASSWORD  -i create_user.sql
```

> [!NOTE]
> For more information about creating SQL database users, see [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql).

---

[!INCLUDE [spring-data-create-reactive.md](includes/spring-data-create-reactive.md)]

## Generate the application by using Spring Initializr

Generate the application on the command line by running the following command:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-database-workshop -d bootVersion=2.7.11 -d javaVersion=17 | tar -xzvf -
```

## Add the reactive Azure SQL Database driver implementation

Open the generated project's **pom.xml** file to add the reactive Azure SQL Database driver from the [r2dbc-mssql GitHub repository](https://github.com/r2dbc/r2dbc-mssql).

After the `spring-boot-starter-webflux` dependency, add the following text:

```xml
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-mssql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Configure Spring Boot to use Azure SQL Database

Open the **src/main/resources/application.properties** file, and add the following text:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:pool:mssql://$AZ_DATABASE_NAME.database.windows.net:1433/demo
spring.r2dbc.username=nonspring@$AZ_DATABASE_NAME
spring.r2dbc.password=$AZ_SQL_SERVER_NON_ADMIN_PASSWORD
```

Replace the two `$AZ_DATABASE_NAME` variables and the `$AZ_SQL_SERVER_NON_ADMIN_PASSWORD` variable with the values that you configured at the beginning of this article.

> [!NOTE]
> For better performance, the `spring.r2dbc.url` property is configured to use a connection pool using [r2dbc-pool](https://github.com/r2dbc/r2dbc-pool).

You should now be able to start your application by using the provided Maven wrapper as follows:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-01.png" alt-text="Screenshot of the running application." lightbox="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-01.png":::

## Create the database schema

[!INCLUDE [spring-data-r2dbc-create-schema.md](includes/spring-data-r2dbc-create-schema.md)]

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id INT IDENTITY PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BIT);
```

Stop the running application, and start it again using the following command. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table as it's being created:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-02.png" alt-text="Screenshot of the creation of the database table." lightbox="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-02.png":::

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your Azure SQL Database server.

[!INCLUDE [spring-data-r2dbc-create-application.md](includes/spring-data-r2dbc-create-application.md)]

Here's a screenshot of these cURL requests:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-03.png" alt-text="Screenshot of the cURL test." lightbox="media/configure-spring-data-r2dbc-with-azure-azure-sql/create-azure-sql-03.png":::

Congratulations! You've created a fully reactive Spring Boot application that uses R2DBC to store and retrieve data from Azure SQL Database.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

## See also

For more information about Spring Data R2DBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/r2dbc/docs/current-SNAPSHOT/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).

---
title: Use Spring Data R2DBC with Azure Database for MySQL
description: Learn how to use Spring Data R2DBC with an Azure Database for MySQL database.
ms.author: karler
ms.reviewer: seal
ms.date: 07/22/2022
author: KarlErickson
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Data R2DBC with Azure Database for MySQL

This article demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in [Azure Database for MySQL](/azure/mysql/) by using the R2DBC implementation for MySQL from the [r2dbc-mysql GitHub repository](https://github.com/asyncer-io/r2dbc-mysql).

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. You can use it with Spring WebFlux to create fully reactive Spring Boot applications that use non-blocking APIs. It provides better scalability than the classic "one thread per connection" approach.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [MySQL command line client](https://dev.mysql.com/downloads/).

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-mysql](https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-mysql).

## Prepare the working environment

First, set up some environment variables by running the following commands:

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_ADMIN_USERNAME=spring
export AZ_MYSQL_ADMIN_PASSWORD=<YOUR_MYSQL_ADMIN_PASSWORD>
export AZ_MYSQL_NON_ADMIN_USERNAME=spring-non-admin
export AZ_MYSQL_NON_ADMIN_PASSWORD=<YOUR_MYSQL_NON_ADMIN_PASSWORD>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by using `az account list-locations`.
- `<YOUR_MYSQL_ADMIN_PASSWORD>` and `<YOUR_MYSQL_NON_ADMIN_PASSWORD>`: The password of your MySQL database server, which should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).

[!INCLUDE [security-note](../includes/security-note.md)]

Next, create a resource group:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for MySQL instance and set up the admin user

The first thing you'll create is a managed MySQL server with an admin user.

> [!NOTE]
> You can read more detailed information about creating MySQL servers in [Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

```azurecli
az mysql flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_MYSQL_ADMIN_USERNAME \
    --admin-password $AZ_MYSQL_ADMIN_PASSWORD \
    --yes \
    --output tsv
```

## Configure a MySQL database

Create a new database called `demo` by using the following command:

```azurecli
az mysql flexible-server db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --database-name demo \
    --server-name $AZ_DATABASE_NAME \
    --output tsv
```

## Configure a firewall rule for your MySQL server

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

You can skip this step if you're using Bash because the `flexible-server create` command already detected your local IP address and set it on MySQL server.

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall. Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
export AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az mysql flexible-server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --rule-name allowiprange \
    --output tsv
```

## Create a MySQL non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

> [!NOTE]
> You can read more detailed information about creating MySQL users in [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

First, create a SQL script called **create_user.sql** for creating a non-admin user. Add the following contents and save it locally:

[!INCLUDE [security-note](../includes/security-note.md)]

```bash
cat << EOF > create_user.sql
CREATE USER '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%' IDENTIFIED BY '$AZ_MYSQL_NON_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON demo.* TO '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%';
FLUSH PRIVILEGES;
EOF
```

Then, use the following command to run the SQL script to create the non-admin user:

```bash
mysql -h $AZ_DATABASE_NAME.mysql.database.azure.com --user $AZ_MYSQL_ADMIN_USERNAME --enable-cleartext-plugin --password=$AZ_MYSQL_ADMIN_PASSWORD < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

[!INCLUDE [spring-data-create-reactive.md](includes/spring-data-create-reactive.md)]

## Generate the application by using Spring Initializr

Generate the application on the command line by entering:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-database-workshop -d bootVersion=2.7.11 -d javaVersion=17 | tar -xzvf -
```

## Add the reactive MySQL driver implementation

Open the generated project's **pom.xml** file to add the reactive MySQL driver from the [r2dbc-mysql repository on GitHub](https://github.com/asyncer-io/r2dbc-mysql).

After the `spring-boot-starter-webflux` dependency, add the following snippet:

```xml
<dependency>
  <groupId>io.asyncer</groupId>
  <artifactId>r2dbc-mysql</artifactId>
  <version>0.9.1</version>
</dependency>
```

## Configure Spring Boot to use Azure Database for MySQL

Open the **src/main/resources/application.properties** file, and add:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:pool:mysql://$AZ_DATABASE_NAME.mysql.database.azure.com:3306/demo?tlsVersion=TLSv1.2
spring.r2dbc.username=spring-non-admin
spring.r2dbc.password=$AZ_MYSQL_NON_ADMIN_PASSWORD
```

Replace the `$AZ_DATABASE_NAME` and `$AZ_MYSQL_NON_ADMIN_PASSWORD` variables with the values that you configured at the beginning of this article.

> [!NOTE]
> For better performance, the `spring.r2dbc.url` property is configured to use a connection pool using [r2dbc-pool](https://github.com/r2dbc/r2dbc-pool).

You should now be able to start your application by using the provided Maven wrapper:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png" alt-text="Screenshot of the running application." lightbox="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-01.png":::

## Create the database schema

[!INCLUDE [spring-data-r2dbc-create-schema.md](includes/spring-data-r2dbc-create-schema.md)]

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table as it's being created:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png" alt-text="Screenshot of the creation of the database table." lightbox="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-02.png":::

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your MySQL server.

[!INCLUDE [spring-data-r2dbc-create-application.md](includes/spring-data-r2dbc-create-application.md)]

Here's a screenshot of these cURL requests:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png" alt-text="Screenshot of the cURL test." lightbox="media/configure-spring-data-r2dbc-with-azure-mysql/create-mysql-03.png":::

Congratulations! You've created a fully reactive Spring Boot application that uses R2DBC to store and retrieve data from Azure Database for MySQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

## See also

For more information about Spring Data R2DBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/r2dbc/docs/current-SNAPSHOT/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).

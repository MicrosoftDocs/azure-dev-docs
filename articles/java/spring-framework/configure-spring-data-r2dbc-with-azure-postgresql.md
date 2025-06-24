---
title: Use Spring Data R2DBC with Azure Database for PostgreSQL
description: Learn how to use Spring Data R2DBC with an Azure Database for PostgreSQL database.
ms.author: karler
ms.reviewer: seal
ms.date: 07/22/2022
author: KarlErickson
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, team=cloud_advocates, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Data R2DBC with Azure Database for PostgreSQL

This article demonstrates creating a sample application that uses [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc) to store and retrieve information in an [Azure Database for PostgreSQL](/azure/postgresql/) database. The sample will use the R2DBC implementation for PostgreSQL from the [r2dbc-postgresql](https://github.com/pgjdbc/r2dbc-postgresql) repository on GitHub.

[R2DBC](https://r2dbc.io/) brings reactive APIs to traditional relational databases. You can use it with Spring WebFlux to create fully reactive Spring Boot applications that use non-blocking APIs. It provides better scalability than the classic "one thread per connection" approach.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]
- [PostgreSQL command line client](https://www.postgresql.org/download/).

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

## See the sample application

In this article, you'll code a sample application. If you want to go faster, this application is already coded and available at [https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-postgresql](https://github.com/Azure-Samples/quickstart-spring-data-r2dbc-postgresql).

## Prepare the working environment

First, set up some environment variables by running the following commands:

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_SERVER_NAME=<YOUR_DATABASE_SERVER_NAME>
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_POSTGRESQL_ADMIN_USERNAME=spring
export AZ_POSTGRESQL_ADMIN_PASSWORD=<YOUR_POSTGRESQL_ADMIN_PASSWORD>
export AZ_POSTGRESQL_NON_ADMIN_USERNAME=nonspring
export AZ_POSTGRESQL_NON_ADMIN_PASSWORD=<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_SERVER_NAME>`: The name of your PostgreSQL server, which should be unique across Azure.
- `<YOUR_DATABASE_NAME>`: The database name of the PostgreSQL server, which should be unique within Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by using `az account list-locations`.
- `<YOUR_POSTGRESQL_ADMIN_PASSWORD>` and `<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>`: The password of your PostgreSQL database server, which should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

[!INCLUDE [security-note](../includes/security-note.md)]

Next, create a resource group by using the following command:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for PostgreSQL instance and set up the admin user

The first thing you'll create is a managed PostgreSQL server with an admin user.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL servers in [Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal).

```azurecli
az postgres flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_POSTGRESQL_ADMIN_USERNAME \
    --admin-password $AZ_POSTGRESQL_ADMIN_PASSWORD \
    --yes \
    --output tsv
```

## Configure a PostgreSQL database

The PostgreSQL server that you created earlier is empty. Use the following command to create a new database.

```azurecli
az postgres flexible-server db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --database-name $AZ_DATABASE_NAME \
    --server-name $AZ_DATABASE_SERVER_NAME \
    --output tsv
```

## Configure a firewall rule for your PostgreSQL server

Azure Database for PostgreSQL instances are secured by default. They have a firewall that doesn't allow any incoming connection. To be able to use your database, you need to add a firewall rule that will allow the local IP address to access the database server.

Because you configured your local IP address at the beginning of this article, you can open the server's firewall by running the following command:

```azurecli
az postgres flexible-server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME \
    --rule-name $AZ_DATABASE_SERVER_NAME-database-allow-local-ip \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    --output tsv
```

If you're connecting to your PostgreSQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall.

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
az postgres flexible-server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME \
    --rule-name $AZ_DATABASE_SERVER_NAME-database-allow-local-ip \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --output tsv
```

## Create a PostgreSQL non-admin user and grant permission

Next, create a non-admin user and grant all permissions to the database.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL users in [Create users in Azure Database for PostgreSQL](/azure/PostgreSQL/flexible-server/how-to-create-users).

Create a SQL script called **create_user.sql** for creating a non-admin user. Add the following contents and save it locally:

[!INCLUDE [security-note](../includes/security-note.md)]

```bash
cat << EOF > create_user.sql
CREATE ROLE "$AZ_POSTGRESQL_NON_ADMIN_USERNAME" WITH LOGIN PASSWORD '$AZ_POSTGRESQL_NON_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $AZ_DATABASE_NAME TO "$AZ_POSTGRESQL_NON_ADMIN_USERNAME";
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$AZ_POSTGRESQL_ADMIN_USERNAME dbname=$AZ_DATABASE_NAME port=5432 password=$AZ_POSTGRESQL_ADMIN_PASSWORD sslmode=require" < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

[!INCLUDE [spring-data-create-reactive.md](includes/spring-data-create-reactive.md)]

## Generate the application by using Spring Initializr

Generate the application on the command line by using the following command:

```bash
curl https://start.spring.io/starter.tgz -d dependencies=webflux,data-r2dbc -d baseDir=azure-database-workshop -d bootVersion=2.7.11 -d javaVersion=17 | tar -xzvf -
```

## Add the reactive PostgreSQL driver implementation

Open the generated project's **pom.xml** file, and then add the reactive PostgreSQL driver from the [r2dbc-postgresql repository on GitHub](https://github.com/pgjdbc/r2dbc-postgresql). After the `spring-boot-starter-webflux` dependency, add the following text:

```xml
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-postgresql</artifactId>
    <version>0.8.12.RELEASE</version>
    <scope>runtime</scope>
</dependency>
```

## Configure Spring Boot to use Azure Database for PostgreSQL

Open the **src/main/resources/application.properties** file, and add the following text:

```properties
logging.level.org.springframework.data.r2dbc=DEBUG

spring.r2dbc.url=r2dbc:pool:postgres://$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com:5432/$AZ_DATABASE_NAME
spring.r2dbc.username=nonspring
spring.r2dbc.password=$AZ_POSTGRESQL_NON_ADMIN_PASSWORD
spring.r2dbc.properties.sslMode=REQUIRE
```

Replace the `$AZ_DATABASE_SERVER_NAME`, `$AZ_DATABASE_NAME`, and `$AZ_POSTGRESQL_NON_ADMIN_PASSWORD` variables with the values that you configured at the beginning of this article.

> [!WARNING]
> For security reasons, Azure Database for PostgreSQL requires to use SSL connections. This is why you need to add the `spring.r2dbc.properties.sslMode=REQUIRE` configuration property, otherwise the R2DBC PostgreSQL driver will try to connect using an insecure connection, which will fail.

> [!NOTE]
> For better performance, the `spring.r2dbc.url` property is configured to use a connection pool using [r2dbc-pool](https://github.com/r2dbc/r2dbc-pool).

You should now be able to start your application by using the provided Maven wrapper as follows:

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the application running for the first time:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-01.png" alt-text="Screenshot of the running application." lightbox="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-01.png":::

## Create the database schema

[!INCLUDE [spring-data-r2dbc-create-schema.md](includes/spring-data-r2dbc-create-schema.md)]

```sql
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (id SERIAL PRIMARY KEY, description VARCHAR(255), details VARCHAR(4096), done BOOLEAN);
```

Stop the running application, and start it again using the following command. The application will now use the `demo` database that you created earlier, and create a `todo` table inside it.

```bash
./mvnw spring-boot:run
```

Here's a screenshot of the database table as it's being created:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-02.png" alt-text="Screenshot of the creation of the database table." lightbox="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-02.png":::

## Code the application

Next, add the Java code that will use R2DBC to store and retrieve data from your PostgreSQL server.

[!INCLUDE [spring-data-r2dbc-create-application.md](includes/spring-data-r2dbc-create-application.md)]

Here's a screenshot of these cURL requests:

:::image type="content" source="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-03.png" alt-text="Screenshot of the cURL test." lightbox="media/configure-spring-data-r2dbc-with-azure-postgresql/create-postgresql-03.png":::

Congratulations! You've created a fully reactive Spring Boot application that uses R2DBC to store and retrieve data from Azure Database for PostgreSQL.

[!INCLUDE [spring-data-conclusion.md](includes/spring-data-conclusion.md)]

## See also

For more information about Spring Data R2DBC, see Spring's [reference documentation](https://docs.spring.io/spring-data/r2dbc/docs/current-SNAPSHOT/reference/html/#reference).

For more information about using Azure with Java, see [Azure for Java developers](../index.yml) and [Working with Azure DevOps and Java](/azure/devops/).

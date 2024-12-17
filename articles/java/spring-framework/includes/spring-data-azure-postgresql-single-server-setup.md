---
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
---

## Configure a firewall rule for your PostgreSQL server

Azure Database for PostgreSQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

To be able to use your database, open the server's firewall to allow the local IP address to access the database server. For more information, see [Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal](/azure/postgresql/single-server/how-to-manage-firewall-using-portal).

If you're connecting to your PostgreSQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall.

## Create a PostgreSQL non-admin user and grant permission

Next, create a non-admin user and grant all permissions to the database.

### [Passwordless (Recommended)](#tab/passwordless)

You can use the following method to create a non-admin user that uses a passwordless connection.

[!INCLUDE [create-postgresql-single-server-non-admin-user.md](create-postgresql-single-server-non-admin-user.md)]

### [Password](#tab/password)

Create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE ROLE "<your_postgresql_non_admin_username>" WITH LOGIN PASSWORD '<your_postgresql_non_admin_password>';
GRANT ALL PRIVILEGES ON DATABASE demo TO "<your_postgresql_non_admin_username>";
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
psql "host=postgresqlsingletest.postgres.database.azure.com user=<your_postgresql_admin_username>@postgresqlsingletest dbname=demo port=5432 password=<your_postgresql_admin_password> sslmode=require" < create_user.sql
```

> [!NOTE]
> You can read more detailed information about creating PostgreSQL users in [Create users in Azure Database for PostgreSQL](/azure/PostgreSQL/flexible-server/how-to-create-users).

---

## Store data from Azure Database for PostgreSQL

Now that you have an Azure Database for PostgreSQL Single server instance, you can store data by using Spring Cloud Azure.

To install the Spring Cloud Azure Starter JDBC PostgreSQL module, add the following dependencies to your *pom.xml* file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.19.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.19.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your *pom.xml* file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Starter JDBC PostgreSQL artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-jdbc-postgresql</artifactId>
  </dependency>
  ```

> [!NOTE]
> Passwordless connections have been supported since version `4.5.0`.

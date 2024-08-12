---
author: KarlErickson
ms.date: 04/06/2023
ms.author: hangwan
---

## Configure a firewall rule for your MySQL server

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

To be able to use your database, open the server's firewall to allow the local IP address to access the database server. For more information, see [Manage firewall rules for Azure Database for MySQL - Flexible Server using the Azure portal](/azure/mysql/flexible-server/how-to-manage-firewall-portal).

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host IP address to your firewall.

## Create a MySQL non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

### [Passwordless (Recommended)](#tab/passwordless)

You can use the following method to create a non-admin user that uses a passwordless connection.

[!INCLUDE [create-mysql-flexible-server-non-admin-user.md](create-mysql-flexible-server-non-admin-user.md)]

### [Password](#tab/password)

Create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE USER '<your_mysql_non_admin_username>'@'%' IDENTIFIED BY '<your_mysql_non_admin_password>';
GRANT ALL PRIVILEGES ON demo.* TO '<your_mysql_non_admin_username>'@'%';
FLUSH PRIVILEGES;
EOF
```

Then, use the following command to run the SQL script to create the non-admin user:

```bash
mysql -h mysqlflexibletest.mysql.database.azure.com --user <your_mysql_admin_username> --enable-cleartext-plugin --password=<your_mysql_admin_password> < create_user.sql
```

> [!TIP]
> You can read more detailed information about creating MySQL users in [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

---

## Store data from Azure Database for MySQL

Now that you have an Azure Database for MySQL Flexible server instance, you can store data by using Spring Cloud Azure.

To install the Spring Cloud Azure Starter JDBC MySQL module, add the following dependencies to your *pom.xml* file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.15.0</version>
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

- The Spring Cloud Azure Starter JDBC MySQL artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-jdbc-mysql</artifactId>
  </dependency>
  ```

> [!NOTE]
> Passwordless connections have been supported since version `4.5.0`.

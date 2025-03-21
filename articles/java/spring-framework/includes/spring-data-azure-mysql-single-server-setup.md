---
author: KarlErickson
ms.date: 04/06/2023
ms.author: karler
ms.reviewer: seal
---

## Configure a firewall rule for your MySQL server

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

To be able to use your database, open the server's firewall to allow the local IP address to access the database server. For more information, see [Create and manage Azure Database for MySQL firewall rules by using the Azure portal](/azure/mysql/single-server/how-to-manage-firewall-using-portal).

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host IP address to your firewall.

## Create a MySQL non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

### [Passwordless (Recommended)](#tab/passwordless)

> [!IMPORTANT]
> To use passwordless connections, create a Microsoft Entra admin user for your Azure Database for MySQL instance. For more information, see the [Setting the Microsoft Entra Admin user](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication#setting-the-azure-ad-admin-user) section of [Use Microsoft Entra ID for authentication with MySQL](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication).

Create a SQL script called **create_ad_user.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_MYSQL_AD_NON_ADMIN_USERID=$(az ad signed-in-user show --query id --output tsv)

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER '<your_mysql_ad_non_admin_username>' IDENTIFIED BY '$AZ_MYSQL_AD_NON_ADMIN_USERID';
GRANT ALL PRIVILEGES ON demo.* TO '<your_mysql_ad_non_admin_username>'@'%';
FLUSH privileges;
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
mysql -h mysqlsingletest.mysql.database.azure.com --user <your_mysql_ad_admin_username>@mysqlsingletest --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

> [!TIP]
> To use Microsoft Entra authentication to connect to Azure Database for MySQL, you need to sign in with the Microsoft Entra admin user you set up, and then get the access token as the password. For more information, see [Use Microsoft Entra ID for authentication with MySQL](/azure/mysql/single-server/how-to-configure-sign-in-azure-ad-authentication).

### [Password](#tab/password)

Create a SQL script called **create_user.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE USER '<your_mysql_non_admin_username>'@'%' IDENTIFIED BY '<your_mysql_non_admin_password>';
GRANT ALL PRIVILEGES ON demo.* TO '<your_mysql_non_admin_username>'@'%';
FLUSH PRIVILEGES;
EOF
```

Then, use the following command to run the SQL script to create the non-admin user:

```bash
mysql -h mysqlsingletest.mysql.database.azure.com --user <your_mysql_admin_username>@mysqlsingletest --enable-cleartext-plugin --password=<your_mysql_admin_password> < create_user.sql
```

> [!NOTE]
> For more information, see [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

---

## Store data from Azure Database for MySQL

Now that you have an Azure Database for MySQL Single Server instance, you can store data by using Spring Cloud Azure.

To install the Spring Cloud Azure Starter JDBC MySQL module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.21.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.19.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
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

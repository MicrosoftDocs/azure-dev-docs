---
title: Migrate an application to use passwordless connections with Azure Database for MySQL
description: Learn how to migrate existing applications using Azure Database for MySQL away from authentication patterns such as passwords to more secure approaches like Managed Identity.
ms.topic: how-to
author: KarlErickson
ms.author: hangwan
ms.date: 01/18/2023
ms.custom: passwordless-java, passwordless-js, passwordless-python, passwordless-dotnet, spring-cloud-azure, devx-track-java, devx-track-azurecli, devx-track-extended-java
---

# Migrate an application to use passwordless connections with Azure Database for MySQL

This article explains how to migrate from traditional authentication methods to more secure, passwordless connections with Azure Database for MySQL.

Application requests to Azure Database for MySQL must be authenticated. Azure Database for MySQL provides several different ways for apps to connect securely. One of the ways is to use passwords. However, you should prioritize passwordless connections in your applications when possible.

## Compare authentication options

When the application authenticates with Azure Database for MySQL, it provides a username and password pair to connect to the database. Depending on where the identities are stored, there are two types of authentication: Microsoft Entra authentication and MySQL authentication.

<a name='azure-ad-authentication'></a>

### Microsoft Entra authentication

Microsoft Entra authentication is a mechanism for connecting to Azure Database for MySQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Using Microsoft Entra ID for authentication provides the following benefits:

- Authentication of users across Azure Services in a uniform way.
- Management of password policies and password rotation in a single place.
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords.
- Customers can manage database permissions using external (Microsoft Entra ID) groups.
- Microsoft Entra authentication uses MySQL database users to authenticate identities at the database level.
- Support of token-based authentication for applications connecting to Azure Database for MySQL.

### MySQL authentication

You can create accounts in MySQL. If you choose to use passwords as credentials for the accounts, these credentials will be stored in the `user` table. Because these passwords are stored in MySQL, you need to manage the rotation of the passwords by yourself.

Although it's possible to connect to Azure Database for MySQL with passwords, you should use them with caution. You must be diligent to never expose the passwords in an unsecure location. Anyone who gains access to the passwords is able to authenticate. For example, there's a risk that a malicious user can access the application if a connection string is accidentally checked into source control, sent through an unsecure email, pasted into the wrong chat, or viewed by someone who shouldn't have permission. Instead, consider updating your application to use passwordless connections.

[!INCLUDE [introducing-passwordless-connections](includes/introducing-passwordless-connections.md)]

## Migrate an existing application to use passwordless connections

The following steps explain how to migrate an existing application to use passwordless connections instead of a password-based solution.

### 0) Prepare the working environment

First, use the following command to set up some environment variables.

```bash
export AZ_RESOURCE_GROUP=<YOUR_RESOURCE_GROUP>
export AZ_DATABASE_SERVER_NAME=<YOUR_DATABASE_SERVER_NAME>
export AZ_DATABASE_NAME=demo
export AZ_MYSQL_AD_NON_ADMIN_USERNAME=<YOUR_AZURE_AD_NON_ADMIN_USER_DISPLAY_NAME>
export AZ_MYSQL_AD_MI_USERNAME=<YOUR_AZURE_AD_MI_DISPLAY_NAME>
export AZ_USER_IDENTITY_NAME=<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName --output tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id --output tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_RESOURCE_GROUP>`: The name of the resource group your resources are in.
- `<YOUR_DATABASE_SERVER_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_AD_NON_ADMIN_USER_DISPLAY_NAME>`: The display name of your Microsoft Entra non-admin user. Make sure the name is a valid user in your Microsoft Entra tenant.
- `<YOUR_AZURE_AD_MI_DISPLAY_NAME>`: The display name of Microsoft Entra user for your managed identity. Make sure the name is a valid user in your Microsoft Entra tenant.
- `<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>`: The name of your user-assigned managed identity server, which should be unique across Azure.

### 1) Configure Azure Database for MySQL

<a name='11-enable-azure-ad-based-authentication'></a>

#### 1.1) Enable Microsoft Entra ID-based authentication

To use Microsoft Entra ID access with Azure Database for MySQL, you should set the Microsoft Entra admin user first. Only a Microsoft Entra Admin user can create/enable users for Microsoft Entra ID-based authentication.

If you're using Azure CLI, run the following command to make sure it has sufficient permission:

```bash
az login --scope https://graph.microsoft.com/.default
```

Run the following command to the create user identity for assigning:

```azurecli
az identity create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_USER_IDENTITY_NAME
```

> [!IMPORTANT]
> After creating the user-assigned identity, ask your *Global Administrator* or *Privileged Role Administrator* to grant the following permissions for this identity: `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.ALL`. For more information, see the [Permissions](/azure/mysql/flexible-server/concepts-azure-ad-authentication#permissions) section of [Active Directory authentication](/azure/mysql/flexible-server/concepts-azure-ad-authentication).

Run the following command to assign the identity to the MySQL server for creating the Microsoft Entra admin:

```azurecli
az mysql flexible-server identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_SERVER_NAME \
    --identity $AZ_USER_IDENTITY_NAME
```

Then, run following command to set the Microsoft Entra admin:

```azurecli
az mysql flexible-server ad-admin create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_SERVER_NAME \
    --display-name $CURRENT_USERNAME \
    --object-id $CURRENT_USER_OBJECTID \
    --identity $AZ_USER_IDENTITY_NAME
```

This command will set the Microsoft Entra admin to the current signed-in user.

> [!NOTE]
> You can only create one Microsoft Entra admin per MySQL server. Selection of another one will overwrite the existing Microsoft Entra admin configured for the server.

### 2) Configure Azure Database for MySQL for local development

#### 2.1) Configure a firewall rule for local IP

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

You can skip this step if you're using Bash because the `flexible-server create` command already detected your local IP address and set it on MySQL server.

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you need to add the WSL host ID to your firewall. Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP address:

```bash
export AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az mysql server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_SERVER_NAME-database-allow-local-ip-wsl \
    --server $AZ_DATABASE_SERVER_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --output tsv
```

#### 2.2) Create a MySQL non-admin user and grant permission

Next, create a non-admin Microsoft Entra user and grant all permissions on the `$AZ_DATABASE_NAME` database to it. You can change the database name `$AZ_DATABASE_NAME` to fit your needs.

Create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_MYSQL_AD_NON_ADMIN_USERID=$(az ad signed-in-user show --query id --output tsv)

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER '$AZ_MYSQL_AD_NON_ADMIN_USERNAME' IDENTIFIED BY '$AZ_MYSQL_AD_NON_ADMIN_USERID';
GRANT ALL PRIVILEGES ON $AZ_DATABASE_NAME.* TO '$AZ_MYSQL_AD_NON_ADMIN_USERNAME'@'%';
FLUSH privileges;
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
mysql -h $AZ_DATABASE_SERVER_NAME.mysql.database.azure.com --user $CURRENT_USERNAME --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

> [!NOTE]
> You can read more detailed information about creating MySQL users in [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

### 3) Sign in and migrate the app code to use passwordless connections

For local development, make sure you're authenticated with the same Microsoft Entra account you assigned the role to on your MySQL. You can authenticate via the Azure CLI, Visual Studio, Azure PowerShell, or other tools such as IntelliJ.

[!INCLUDE [sign-in](includes/passwordless-sign-in.md)]

Next, use the following steps to update your code to use passwordless connections. Although conceptually similar, each language uses different implementation details.

### [Java](#tab/java)

1. Inside your project, add the following reference to the `azure-identity-extensions` package. This library contains all of the entities necessary to implement passwordless connections.

   ```xml
   <dependency>
       <groupId>com.azure</groupId>
       <artifactId>azure-identity-extensions</artifactId>
       <version>1.0.0</version>
   </dependency>
   ```

1. Enable the Azure MySQL authentication plugin in the JDBC URL. Identify the locations in your code that currently create a `java.sql.Connection` to connect to Azure Database for MySQL. Update `url` and `user` in your *application.properties* file to match the following values:

   ```properties
   url=jdbc:mysql://$AZ_DATABASE_SERVER_NAME.mysql.database.azure.com:3306/$AZ_DATABASE_NAME?serverTimezone=UTC&sslMode=REQUIRED&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin
   user=$AZ_MYSQL_AD_NON_ADMIN_USERNAME
   ```

   > [!NOTE]
   > If you're using the `MysqlConnectionPoolDataSource` class as the datasource in your application, be sure to remove `defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin` from the URL.

   ```properties
   url=jdbc:mysql://$AZ_DATABASE_SERVER_NAME.mysql.database.azure.com:3306/$AZ_DATABASE_NAME?serverTimezone=UTC&sslMode=REQUIRED&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin
   user=$AZ_MYSQL_AD_NON_ADMIN_USERNAME
   ```

1. Replace the one `$AZ_DATABASE_SERVER_NAME` variable, one `$AZ_DATABASE_NAME` variable and one `$AZ_MYSQL_AD_NON_ADMIN_USERNAME` variable with the values that you configured at the beginning of this article.

1. Remove the `password` from the JDBC URL.

### [Spring](#tab/spring)

1. Inside your project, add the following reference to the `spring-cloud-azure-starter-jdbc-mysql` package. This library contains all of the entities necessary to implement passwordless connections.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-jdbc-mysql</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Update the *application.yaml* or *application.properties* file as shown in the following example. Change the `spring.datasource.username` to the Microsoft Entra user, remove the `spring.datasource.password` property, and add `spring.datasource.azure.passwordless-enabled=true`.

   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://${AZ_DATABASE_SERVER_NAME}.mysql.database.azure.com:3306/${AZ_DATABASE_NAME}?serverTimezone=UTC
       username: ${AZ_MYSQL_AD_NON_ADMIN_USERNAME}
       azure:
         passwordless-enabled: true
   ```

---

#### Run the app locally

After making these code changes, run your application locally. The new configuration should pick up your local credentials if you're signed in to a compatible IDE or command line tool, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your local dev user in Azure will allow your app to connect to the Azure service locally.

### 4) Configure the Azure hosting environment

After your application is configured to use passwordless connections and it runs locally, the same code can authenticate to Azure services after it's deployed to Azure. For example, an application deployed to an Azure App Service instance that has a managed identity assigned can connect to Azure Storage.

In this section, you'll execute two steps to enable your application to run in an Azure hosting environment in a passwordless way:

- Assign the managed identity for your Azure hosting environment.
- Assign roles to the managed identity.

> [!NOTE]
> Azure also provides [Service Connector](/azure/service-connector/overview), which can help you connect your hosting service with PostgreSQL. With Service Connector to configure your hosting environment, you can omit the step of assigning roles to your managed identity because Service Connector will do it for you. The following section describes how to configure your Azure hosting environment in two ways: one via Service Connector and the other by configuring each hosting environment directly.

> [!IMPORTANT]
> Service Connector's commands require [Azure CLI](/cli/azure/install-azure-cli) 2.41.0 or higher.

#### Assign the managed identity using the Azure portal

The following steps show you how to assign a system-assigned managed identity for various web hosting services. The managed identity can securely connect to other Azure Services using the app configurations you set up previously.

##### [App Service](#tab/app-service)

1. On the main overview page of your Azure App Service instance, select **Identity** from the navigation pane.

1. On the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/passwordless-connections/migration-create-identity.png" alt-text="Screenshot of Azure portal Identity page of App Service resource with System assigned tab showing and Status field highlighted." lightbox="media/passwordless-connections/migration-create-identity.png":::

##### [Service Connector](#tab/service-connector)

When you use Service Connector, it can help to assign the system-assigned managed identity for your Azure hosting environment. However, Azure portal doesn’t support configuring Azure Database this way, so you need to use Azure CLI to assign the identity.

##### [Container Apps](#tab/container-apps)

1. On the main overview page of your Azure Container Apps instance, select **Identity** from the navigation pane.

1. On the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/passwordless-connections/container-apps-identity.png" alt-text="Screenshot of Azure portal Identity page of Container App resource showing System assigned tab with Status field highlighted." lightbox="media/passwordless-connections/container-apps-identity.png":::

##### [Azure Spring Apps](#tab/azure-spring-apps)

1. On the main overview page of your Azure Spring Apps instance, select **Identity** from the navigation pane.

1. On the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/passwordless-connections/spring-apps-identity.png" alt-text="Screenshot of Azure portal Identity page of App resource with System assigned tab showing and Status field highlighted." lightbox="media/passwordless-connections/spring-apps-identity.png":::

##### [Virtual Machines](#tab/virtual-machines)

1. On the main overview page of your virtual machine, select **Identity** from the navigation pane.

1. On the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/passwordless-connections/virtual-machine-identity.png" alt-text="Screenshot of Azure portal Identity page of Virtual machine resource with System assigned tab showing and Status field highlighted." lightbox="media/passwordless-connections/virtual-machine-identity.png":::

##### [AKS](#tab/aks)

An Azure Kubernetes Service (AKS) cluster requires an identity to access Azure resources like load balancers and managed disks. This identity can be either a managed identity or a service principal. By default, when you create an AKS cluster, a system-assigned managed identity is automatically created.

---

You can also assign managed identity on an Azure hosting environment by using the Azure CLI.

##### [App Service](#tab/app-service)

You can assign a managed identity to an Azure App Service instance with the [az webapp identity assign](/cli/azure/webapp/identity) command, as shown in the following example:

```azurecli
export AZ_MI_OBJECT_ID=$(az webapp identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <service-instance-name> \
    --query principalId \
    --output tsv)
```

##### [Service Connector](#tab/service-connector)

You can use Service Connector to create a connection between an Azure compute hosting environment and a target service by using the Azure CLI. Service Connector currently supports the following compute services:

- Azure App Service
- Azure Spring Apps
- Azure Container Apps

Before starting, use the following command to assign a user-assigned managed identity for Microsoft Entra authentication. For more information, see [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-azure-ad).

```azurecli
export AZ_IDENTITY_RESOURCE_ID=$(az identity create \
    --name <user-identity-name> \
    --resource-group $AZ_RESOURCE_GROUP \
    --query id \
    --output tsv)
```

> [!IMPORTANT]
> After creating the user-assigned identity, ask your *Global Administrator* or *Privileged Role Administrator* to grant the following permissions for this identity: `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.ALL`. For more information, see the [Permissions](/azure/mysql/flexible-server/concepts-azure-ad-authentication#permissions) section of [Active Directory authentication](/azure/mysql/flexible-server/concepts-azure-ad-authentication).

Then, install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI:

```azurecli
az extension add --name serviceconnector-passwordless --upgrade
```

If you're using Azure App Service, use the `az webapp connection` command, as shown in the following example:

```azurecli
az webapp connection create mysql-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <app-service-name>
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity mysql-identity-id=$AZ_IDENTITY_RESOURCE_ID
```

If you're using Azure Spring Apps, use `the az spring connection` command, as shown in the following example:

```azurecli
az spring connection create mysql-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --service <service-name> \
    --app <service-instance-name> \
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity mysql-identity-id=$AZ_IDENTITY_RESOURCE_ID
```

If you're using Azure Container Apps, use the `az containerapp connection` command, as shown in the following example:

```azurecli
az containerapp connection create mysql-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <app-service-name>
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity mysql-identity-id=$AZ_IDENTITY_RESOURCE_ID
```

##### [Container Apps](#tab/container-apps)

You can assign a managed identity to an Azure Container Apps instance with the [az containerapp identity assign](/cli/azure/containerapp/identity) command, as shown in the following example:

```azurecli
export AZ_MI_OBJECT_ID=$(az containerapp identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <service-instance-name> \
    --query principalId \
    --output tsv)
```

##### [Azure Spring Apps](#tab/azure-spring-apps)

You can assign a managed identity to an Azure Spring Apps instance with the [az spring app identity assign](/cli/azure/spring/app/identity) command, as shown in the following example:

```azurecli
export AZ_MI_OBJECT_ID=$(az spring app identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <service-instance-name> \
    --service <service-name> \
    --query identity.principalId \
    --output tsv)
```

##### [Virtual Machines](#tab/virtual-machines)

You can assign a managed identity to a virtual machine with the [az vm identity assign](/cli/azure/vm/identity) command, as shown in the following example:

```azurecli
export AZ_MI_OBJECT_ID=$(az vm identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <service-instance-name> \
    --query principalId \
    --output tsv)
```

##### [AKS](#tab/aks)

You can assign a managed identity to an Azure Kubernetes Service (AKS) instance with the [az aks update](/cli/azure/aks) command, as shown in the following example:

```azurecli
export AZ_MI_OBJECT_ID=$(az aks update \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <AKS-cluster-name> \
    --enable-managed-identity \
    --query identityProfile.kubeletidentity.objectId \
    --output tsv)
```

---

#### Assign roles to the managed identity

Next, grant permissions to the managed identity you assigned to access your MySQL instance.

These steps will create a Microsoft Entra user for the managed identity and grant all permissions for the database `$AZ_DATABASE_NAME` to it. You can change the database name `$AZ_DATABASE_NAME` to fit your needs.

First, create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_MYSQL_AD_MI_USERID=$(az ad sp show --id $AZ_MI_OBJECT_ID --query appId --output tsv)

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER '$AZ_MYSQL_AD_MI_USERNAME' IDENTIFIED BY '$AZ_MYSQL_AD_MI_USERID';
GRANT ALL PRIVILEGES ON $AZ_DATABASE_NAME.* TO '$AZ_MYSQL_AD_MI_USERNAME'@'%';
FLUSH privileges;
EOF
```

Then, use the following command to run the SQL script to create the Microsoft Entra non-admin user:

```bash
mysql -h $AZ_DATABASE_SERVER_NAME.mysql.database.azure.com --user $CURRENT_USERNAME --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

#### Test the app

Before deploying the app to the hosting environment, you need to make one more change to the code because the application is going to connect to MySQL using the user created for the managed identity.

### [Java](#tab/java)

Update your code to use the user created for the managed identity:

```java
properties.put("user", "$AZ_MYSQL_AD_MI_USERNAME");
```

### [Spring](#tab/spring)

Update the *application.yaml* or *application.properties* file. Change the `spring.datasource.username` to the user created for the managed identity.

```yaml
spring:
  datasource:
    url: jdbc:mysql://${AZ_DATABASE_SERVER_NAME}.mysql.database.azure.com:3306/${AZ_DATABASE_NAME}?serverTimezone=UTC
    username: ${AZ_MYSQL_AD_MI_USERNAME}
    azure:
      passwordless-enabled: true​
```

---

After making these code changes, you can build and redeploy the application. Then, browse to your hosted application in the browser. Your app should be able to connect to the MySQL database successfully. Keep in mind that it may take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

- [Authorize access to blob data with managed identities for Azure resources](/azure/storage/blobs/authorize-managed-identity).
- [Authorize access to blobs using Microsoft Entra ID](/azure/storage/blobs/authorize-access-azure-active-directory)

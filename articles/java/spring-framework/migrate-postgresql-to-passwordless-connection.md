---
title: Passwordless Connections for Azure Database for PostgreSQL
description: Learn how to migrate applications to passwordless connections with Azure Database for PostgreSQL and managed identities. Follow the steps to improve security.
ms.topic: how-to
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/19/2025
ms.custom: passwordless-java, passwordless-js, passwordless-python, passwordless-dotnet, spring-cloud-azure, devx-track-java, devx-track-azurecli, devx-track-extended-java
---

# Migrate an application to use passwordless connections with Azure Database for PostgreSQL

This article explains how to migrate from traditional authentication methods to more secure, passwordless connections with Azure Database for PostgreSQL.

Application requests to Azure Database for PostgreSQL must be authenticated. Azure Database for PostgreSQL provides several different ways for apps to connect securely. One of the ways is to use passwords. However, you should prioritize passwordless connections in your applications when possible.

## Compare authentication options

When the application authenticates with Azure Database for PostgreSQL, it provides a username and password pair to connect the database. Depending on where the identities are stored, there are two types of authentication: Microsoft Entra authentication and PostgreSQL authentication.

<a name='azure-ad-authentication'></a>

### Microsoft Entra authentication

Microsoft Entra authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Microsoft Entra ID. By using Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Using Microsoft Entra ID for authentication provides the following benefits:

- Authentication of users across Azure Services in a uniform way.
- Management of password policies and password rotation in a single place.
- Multiple forms of authentication supported by Microsoft Entra ID, which can eliminate the need to store passwords.
- Customers can manage database permissions by using external (Microsoft Entra ID) groups.
- Use PostgreSQL database users by Microsoft Entra authentication to authenticate identities at the database level.
- Support token-based authentication for applications connecting to Azure Database for PostgreSQL.

### PostgreSQL authentication

You can create accounts in PostgreSQL. If you choose to use passwords as credentials for the accounts, store these credentials in the `user` table. Because PostgreSQL stores these passwords, you need to manage the rotation of the passwords yourself.

Although you can connect to Azure Database for PostgreSQL with passwords, use them with caution. Never expose the passwords in an insecure location. Anyone who gains access to the passwords can authenticate. For example, a malicious user can access the application if you accidentally check a connection string into source control, send it through an insecure email, paste it into the wrong chat, or if someone without permission views it. Instead, consider updating your application to use passwordless connections.

[!INCLUDE [introducing-passwordless-connections](includes/introducing-passwordless-connections.md)]

## Migrate an existing application to use passwordless connections

The following steps explain how to migrate an existing application to use passwordless connections instead of a password-based solution.

### 0) Prepare the working environment

First, use the following command to set up some environment variables.

```bash
export AZ_RESOURCE_GROUP=<YOUR_RESOURCE_GROUP>
export AZ_DATABASE_SERVER_NAME=<YOUR_DATABASE_SERVER_NAME>
export AZ_DATABASE_NAME=demo
export AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME=<YOUR_AZURE_AD_NON_ADMIN_USER_DISPLAY_NAME>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName --output tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_RESOURCE_GROUP>`: The name of the resource group for your resources.
- `<YOUR_DATABASE_SERVER_NAME>`: The name of your PostgreSQL server. It should be unique across Azure.
- `<YOUR_AZURE_AD_NON_ADMIN_USER_DISPLAY_NAME>`: The display name of your Microsoft Entra non-admin user. Ensure the name is a valid user in your Microsoft Entra tenant.
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com).

### 1) Configure Azure Database for PostgreSQL

<a name='11-enable-azure-ad-based-authentication'></a>

#### 1.1) Enable Microsoft Entra ID-based authentication

To use Microsoft Entra ID access with Azure Database for PostgreSQL, set the Microsoft Entra admin user first. Only a Microsoft Entra admin user can create or enable users for Microsoft Entra ID-based authentication.

To set up a Microsoft Entra administrator after creating the server, follow the steps in [Manage Microsoft Entra roles in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-manage-azure-ad-users).

> [!NOTE]
> PostgreSQL Flexible Server can create multiple Microsoft Entra administrators.

### 2) Configure Azure Database for PostgreSQL for local development

#### 2.1) Configure a firewall rule for local IP

Azure Database for PostgreSQL instances are secured by default. They have a firewall that doesn't allow any incoming connection. To use your database, you need to add a firewall rule that allows your local IP address to access the database server.

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

Get the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, and then use the following command to set an environment variable for the WSL IP Address:

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

#### 2.2) Create a PostgreSQL non-admin user and grant permission

Next, create a non-admin Microsoft Entra user and grant all permissions on the `$AZ_DATABASE_NAME` database to it. You can change the database name `$AZ_DATABASE_NAME` to fit your needs.

Create a SQL script called **create_ad_user_local.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_ad_user_local.sql
select * from pgaadauth_create_principal('$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME', false, false);
EOF
```

Then, use the following command to run the SQL script and create the Microsoft Entra non-admin user:

```bash
psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$CURRENT_USERNAME dbname=postgres port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user_local.sql
```

Now, use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user_local.sql
```

> [!NOTE]
> For more information about creating PostgreSQL users, see [Create users in Azure Database for PostgreSQL](/azure/PostgreSQL/single-server/how-to-create-users).

### 3) Sign in and migrate the app code to use passwordless connections

For local development, ensure you're authenticated with the same Microsoft Entra account you assigned the role to on your PostgreSQL. Authenticate via the Azure CLI, Visual Studio, Azure PowerShell, or other tools such as IntelliJ.

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

1. Enable the Azure PostgreSQL authentication plugin in JDBC URL. Identify the locations in your code that currently create a `java.sql.Connection` to connect to Azure Database for PostgreSQL. Update `url` and `user` in your **application.properties** file to match the following values:

   ```properties
   url=jdbc:postgresql://$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com:5432/$AZ_DATABASE_NAME?sslmode=require&authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin
   user=$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME
   ```

1. Replace the `$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME` and the two `$AZ_DATABASE_SERVER_NAME` variables with the value that you configured at the beginning of this article.

### [Spring](#tab/spring)

1. Inside your project, add the following reference to the `spring-cloud-azure-starter-jdbc-postgresql` package. This library contains all of the entities necessary to implement passwordless connections.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-jdbc-postgresql</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Update the **application.yaml** or **application.properties** file as shown in the following example. Change the `spring.datasource.username` to the Microsoft Entra user, remove the `spring.datasource.password` property, and add `spring.datasource.azure.passwordless-enabled=true`.

   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/$AZ_DATABASE_NAME?sslmode=require
       username: ${AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME}
       azure:
         passwordless-enabled: true
   ```

---

#### Run the app locally

After making these code changes, run your application locally. The new configuration picks up your local credentials if you're signed in to a compatible IDE or command line tool, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your local dev user in Azure allow your app to connect to the Azure service locally.

### 4) Configure the Azure hosting environment

After you configure your application to use passwordless connections and run it locally, the same code can authenticate to Azure services after you deploy it to Azure. For example, an application deployed to an Azure App Service instance that has a managed identity assigned can connect to Azure Storage.

In this section, you execute two steps to enable your application to run in an Azure hosting environment in a passwordless way:

- Assign the managed identity for your Azure hosting environment.
- Assign roles to the managed identity.

> [!NOTE]
> Azure also provides [Service Connector](/azure/service-connector/overview), which can help you connect your hosting service with PostgreSQL. By using Service Connector to configure your hosting environment, you can omit the step of assigning roles to your managed identity because Service Connector assigns them for you. The following section describes how to configure your Azure hosting environment in two ways: one via Service Connector and the other by configuring each hosting environment directly.

> [!IMPORTANT]
> Service Connector's commands require [Azure CLI](/cli/azure/install-azure-cli) 2.41.0 or higher.

#### Assign the managed identity using the Azure portal

The following steps show you how to assign a system-assigned managed identity for various web hosting services. The managed identity can securely connect to other Azure services by using the app configurations you set up previously.

##### [App Service](#tab/app-service)

1. On the main overview page of your Azure App Service instance, select **Identity** from the navigation pane.

1. On the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

##### [Service Connector](#tab/service-connector)

When you use Service Connector, it can help to assign the system-assigned managed identity for your Azure hosting environment. However, Azure portal doesn't support configuring Azure Database this way, so you need to use Azure CLI to assign the identity.

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

An Azure Kubernetes Service (AKS) cluster requires an identity to access Azure resources like load balancers and managed disks. This identity can be either a managed identity or a service principal. By default, when you create an AKS cluster, Azure automatically creates a system-assigned managed identity.

---

You can also assign a managed identity on an Azure hosting environment by using the Azure CLI.

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

First, install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI:

```azurecli
az extension add --name serviceconnector-passwordless --upgrade
```

If you're using Azure App Service, use the `az webapp connection` command, as shown in the following example:

```azurecli
az webapp connection create postgres-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <app-service-name>
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity
```

If you're using Azure Spring Apps, use `the az spring connection` command, as shown in the following example:

```azurecli
az spring connection create postgres-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --service <service-name> \
    --app <service-instance-name> \
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity
```

If you're using Azure Container Apps, use the `az containerapp connection` command, as shown in the following example:

```azurecli
az containerapp connection create postgres-flexible \
    --resource-group $AZ_RESOURCE_GROUP \
    --name <app-service-name>
    --target-resource-group $AZ_RESOURCE_GROUP \
    --server $AZ_DATABASE_SERVER_NAME \
    --database $AZ_DATABASE_NAME \
    --system-identity
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

You can assign a managed identity to an Azure Spring Apps instance as shown in the following example:

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

Next, grant permissions to the managed identity you assigned to access your PostgreSQL instance.

##### [Service Connector](#tab/assign-role-service-connector)

If you connected your services by using Service Connector, the commands in the previous step already assigned the role, so you can skip this step.

##### [Azure CLI](#tab/assign-role-azure-cli)

The following steps create a Microsoft Entra user for the managed identity and grant all permissions for the database `$AZ_DATABASE_NAME` to it. You can change the database name `$AZ_DATABASE_NAME` to fit your needs.

First, create a SQL script named **create_ad_user_mi.sql** for creating a non-admin user. Add the following contents and save it locally:

```bash
export AZ_POSTGRESQL_AD_MI_USERNAME=$(az ad sp show \
    --id $AZ_MI_OBJECT_ID \
    --query displayName \
    --output tsv)

cat << EOF > create_ad_user_mi.sql
select * from pgaadauth_create_principal_with_oid('$AZ_POSTGRESQL_AD_MI_USERNAME', '$AZ_MI_OBJECT_ID', 'service', false, false);
EOF
```

Then, use the following command to run the SQL script and create the Microsoft Entra non-admin user:

```bash
psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$CURRENT_USERNAME dbname=postgres port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user_mi.sql
```

Now, use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user_mi.sql
```

---

#### Test the app

Before deploying the app to the hosting environment, you need to make one more change to the code because the application connects to PostgreSQL by using the user you created for the managed identity.

### [Java](#tab/java)

Update your code to use the user created for the managed identity:

> [!NOTE]
> If you used the Service Connector command, skip this step.

```java
properties.put("user", "$AZ_POSTGRESQL_AD_MI_USERNAME");
```

### [Spring](#tab/spring)

Update the **application.yaml** or **application.properties** file. Change the `spring.datasource.username` to the user created for the managed identity.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/$AZ_DATABASE_NAME?sslmode=require
    username: ${AZ_POSTGRESQL_AD_MI_USERNAME}
    azure:
      passwordless-enabled: true
```

If you used the Service Connector command, remove the properties `spring.datasource.url` and `spring.datasource.username`. You only need to add the following setting:

```yaml
spring:
  datasource:
    azure:
      passwordless-enabled: true
```

---

After making these code changes, you can build and redeploy the application. Then, browse to your hosted application in the browser. Your app should be able to connect to the PostgreSQL database successfully. It might take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

To explore the concepts discussed in this article in more depth, see the following resources:

- [Authorize access to blob data with managed identities for Azure resources](/azure/storage/blobs/authorize-managed-identity).
- [Authorize access to blobs using Microsoft Entra ID](/azure/storage/blobs/authorize-access-azure-active-directory)

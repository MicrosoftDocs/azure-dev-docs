---
title: Spring Cloud Azure PostgreSQL support
description: This article describes how Spring Cloud Azure and Azure PostgreSQL can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure PostgreSQL support

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.19.0

[Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) is a relational database service based on the open-source Postgres database engine. It's a fully managed database-as-a-service that can handle mission-critical workloads with predictable performance, security, high availability, and dynamic scalability.

From version `4.5.0`, Spring Cloud Azure supports various types of credentials for authentication to Azure Database for PostgreSQL Flexible Server.

## Supported PostgreSQL version

For supported versions, see [Supported PostgreSQL major versions in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/concepts-supported-versions).

## Core features

### Passwordless connection

Passwordless connection uses Microsoft Entra authentication for connecting to Azure services without storing any credentials in the application, its configuration files, or in environment variables. Microsoft Entra authentication is a mechanism for connecting to Azure Database for PostgreSQL using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

## How it works

Spring Cloud Azure will first build one of the following types of credentials depending on the application authentication configuration:

- `ClientSecretCredential`
- `ClientCertificateCredential`
- `UsernamePasswordCredential`
- `ManagedIdentityCredential`
- `DefaultAzureCredential`

If none of these types of credentials are found, the `DefaultAzureCredential` credentials will be obtained from application properties, environment variables, managed identities, or the IDE. For more information, see [Spring Cloud Azure authentication](authentication.md).

The following high-level diagram summarizes how authentication works using OAuth credential authentication with Azure Database for PostgreSQL. The arrows indicate communication pathways.

:::image type="content" source="media/spring-cloud-azure/authentication-postgresql-entra-id.png" alt-text="Diagram showing Microsoft Entra authentication for PostgreSQL ." border="false":::

## Configuration

Spring Cloud Azure for PostgreSQL supports the following two levels of configuration options:

1. The global authentication configuration options of `credential` and `profile` with prefixes of `spring.cloud.azure`.

1. Spring Cloud Azure for PostgreSQL common configuration options.

The following table shows the Spring Cloud Azure for PostgreSQL common configuration options:

> [!div class="mx-tdBreakAll"]
> | Name                                                                  | Description                                                                                                                                                                                            |
> |-----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | spring.datasource.azure.passwordless-enabled                          | Whether to enable passwordless connections to Azure databases by using OAuth2 Microsoft Entra token credentials.                                                                                |
> | spring.datasource.azure.credential.client-certificate-password        | Password of the certificate file.                                                                                                                                                                      |
> | spring.datasource.azure.credential.client-certificate-path            | Path of a PEM certificate file to use when performing service principal authentication with Azure.                                                                                                     |
> | spring.datasource.azure.credential.client-id                          | Client ID to use when performing service principal authentication with Azure. This is a legacy property.                                                                                               |
> | spring.datasource.azure.credential.client-secret                      | Client secret to use when performing service principal authentication with Azure. This is a legacy property.                                                                                           |
> | spring.datasource.azure.credential.managed-identity-enabled           | Whether to enable managed identity to authenticate with Azure. If *true* and the `client-id` is set, will use the client ID as user assigned managed identity client ID. The default value is *false*. |
> | spring.datasource.azure.credential.password                           | Password to use when performing username/password authentication with Azure.                                                                                                                           |
> | spring.datasource.azure.credential.username                           | Username to use when performing username/password authentication with Azure.                                                                                                                           |
> | spring.datasource.azure.profile.cloud-type                            | Name of the Azure cloud to connect to.                                                                                                                                                                 |
> | spring.datasource.azure.profile.environment.active-directory-endpoint | The Microsoft Entra endpoint to connect to.                                                                                                                                                     |
> | spring.datasource.azure.profile.tenant-id                             | Tenant ID for Azure resources. The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID.                                                                                                                                              |

## Dependency setup

Add the following dependency to your project. This will automatically include the `spring-boot-starter` dependency in your project transitively.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-jdbc-postgresql</artifactId>
</dependency>
```

> [!NOTE]
> Passwordless connections have been supported since version `4.5.0`.
>
> Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For more information, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

## Basic usage

The following sections show the classic Spring Boot application usage scenarios.

> [!IMPORTANT]
> Passwordless connection uses Microsoft Entra authentication. To use Microsoft Entra authentication, you should set the Microsoft Entra admin user first. Only a Microsoft Entra admin user can create and enable users for Microsoft Entra ID-based authentication. For more information, see [Use Spring Data JDBC with Azure Database for PostgreSQL](configure-spring-data-jdbc-with-azure-postgresql.md).

### Connect to Azure PostgreSQL locally without password

1. To create users and grant permission, see the [Create a PostgreSQL non-admin user and grant permission](configure-spring-data-jdbc-with-azure-postgresql.md#create-a-postgresql-non-admin-user-and-grant-permission) section of [Use Spring Data JDBC with Azure Database for PostgreSQL](configure-spring-data-jdbc-with-azure-postgresql.md).

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
       username: ${AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME}
       azure:
         passwordless-enabled: true
   ```

### Connect to Azure PostgreSQL using a service principal

1. Assign role to service principal:

   1. Create a SQL script called *create_ad_user_sp.sql* for creating a non-admin user. Add the following contents and save it locally:

      > [!IMPORTANT]
      > Make sure `<service-principal-name>` already exists in your Microsoft Entra tenant, or you won't be able to create the non-admin user.

      ```bash
      cat << EOF > create_ad_user_sp.sql
      select * from pgaadauth_create_principal('<service-principal-name>', false, false);
      EOF
      ```

   1. Use the following command to run the SQL script to create the Microsoft Entra non-admin user:

      ```bash
      psql "host=$AZ_DATABASE_SERVER_NAME.postgres.database.azure.com user=$CURRENT_USERNAME@$AZ_DATABASE_SERVER_NAME dbname=postgres port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user_sp.sql
      ```

   1. Now use the following command to remove the temporary SQL script file:

      ```bash
      rm create_ad_user_sp.sql
      ```

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         credential:
           client-id: ${AZURE_CLIENT_ID}
           client-secret: ${AZURE_CLIENT_SECRET}
         profile:
           tenant-id: <tenant>
     datasource:
       url: jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
       username: ${AZ_POSTGRESQL_AD_SP_USERNAME}
       azure:
         passwordless-enabled: true
   ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

### Connect to Azure PostgreSQL with Managed Identity in Azure Spring Apps

1. To enable managed identity, see the [Assign the managed identity using the Azure portal](migrate-postgresql-to-passwordless-connection.md#assign-the-managed-identity-using-the-azure-portal) section of [Migrate an application to use passwordless connections with Azure Database for PostgreSQL](migrate-postgresql-to-passwordless-connection.md).

1. To grant permissions, see the [Assign roles to the managed identity](migrate-postgresql-to-passwordless-connection.md#assign-roles-to-the-managed-identity) section of [Migrate an application to use passwordless connections with Azure Database for PostgreSQL](migrate-postgresql-to-passwordless-connection.md).

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         credential:
           managed-identity-enabled: true
           client-id: ${AZURE_CLIENT_ID}
     datasource:
       url: jdbc:postgresql://${AZ_DATABASE_SERVER_NAME}.postgres.database.azure.com:5432/${AZ_DATABASE_NAME}?sslmode=require
       username: ${AZ_POSTGRESQL_AD_MI_USERNAME}
       azure:
         passwordless-enabled: true
   ```

> [!NOTE]
> For more information, see [Tutorial: Deploy a Spring application to Azure Spring Apps with a passwordless connection to an Azure database](deploy-passwordless-spring-database-app.md)

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repository on GitHub.

---
title: Spring Cloud Azure resource manager
description: This article describes Spring Cloud Azure resource manager.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-arm-template, devx-track-extended-java
---

# Spring Cloud Azure Resource Manager

**This article applies to:** ✔️ Version 4.19.0 ✔️ Version 5.16.0

Azure Resource Manager (ARM) is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. Spring Cloud Azure Resource Manager can help provision resources or retrieve resource metadata.

## Dependency setup

```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-resourcemanager</artifactId>
</dependency>
```

## Configuration

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Configurable properties of spring-cloud-azure-resourcemanager:

> [!div class="mx-tdBreakAll"]
> | Property                                                             | Description                                                                                        |
> |----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.resource-manager**.enabled                      | Whether the Resource Manager is enabled. Default is true.                                          |
> | **spring.cloud.azure.credential**.client-id                          | Client ID to use when performing service principal authentication with Azure.                      |
> | **spring.cloud.azure.credential**.client-secret                      | Client secret to use when performing service principal authentication with Azure.                  |
> | **spring.cloud.azure.credential**.client-certificate-path            | Path of a PEM certificate file to use when performing service principal authentication with Azure. |
> | **spring.cloud.azure.credential**.client-certificate-password        | Password of the certificate file.                                                                  |
> | **spring.cloud.azure.credential**.username                           | Username to use when performing username/password authentication with Azure.                       |
> | **spring.cloud.azure.credential**.password                           | Password to use when performing username/password authentication.                                  |
> | **spring.cloud.azure.credential**.managed-identity-enabled           | Whether to enable managed identity.                                                                |
> | **spring.cloud.azure.profile**.cloud-type                            | Name of the Azure cloud to connect to.                                                             |
> | **spring.cloud.azure.profile**.environment.active-directory-endpoint | The Microsoft Entra endpoint to connect to for authentication.                              |
> | **spring.cloud.azure.profile**.subscription-id                       | Subscription ID to use when connecting to Azure resources.                                         |
> | **spring.cloud.azure.profile**.tenant-id                             | Tenant ID for Azure resources. The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID.                                         |
> | **spring.cloud.azure.azure-service**.namespace                   | The namespace of the Azure service to provision resources with.                                    |
> | **spring.cloud.azure.azure-service**.resource.resource-group     | The resource group holding an Azure service resource.                                              |

## Basic usage

Spring Cloud Azure Resource Manager can work together with specific Spring Cloud Azure starters to retrieve connection information, such as connection strings, to connect to Azure services. It can also work together with `spring-cloud-azure-starter` and third-party libraries to retrieve metadata like username/password, and to complete authentication. For more information, see [Spring Cloud Azure Kafka Support](kafka-support.md) and [Spring Cloud Azure Redis Support](redis-support.md).

For example, to retrieve the connection string of an Azure Service, developers can use a service principal as the credential to authenticate and retrieve the connection string. The configuration is listed the follows. The provided service principal should
be assigned a role of `Contributor` of the associated namespace at least. See [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory) to make sure the principal has been granted the sufficient permission to access the Azure resource.

```yaml
spring:
  cloud:
    azure:
      credential:
        client-id: ${AZURE_CLIENT_ID}
        client-secret: ${AZURE_CLIENT_SECRET}
      profile:
        tenant-id: <tenant>
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      <azure-service>:
        namespace: ${SERVICEBUS_NAMESPACE}
        resource:
          resource-group: ${RESOURCE_GROUP}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

## Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repository on GitHub.

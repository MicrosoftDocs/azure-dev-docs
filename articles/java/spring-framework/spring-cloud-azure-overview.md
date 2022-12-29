---
title: Spring Cloud Azure Overview
description: Spring Cloud Azure is a project that helps developers easier to use Azure services in Spring Boot application by providing a group of Java libraries.
author: KarlErickson
ms.author: rujche
ms.service: azure-java
ms.topic: overview
ms.date: 12/29/2022
---

# What is Spring Cloud Azure? 

Spring Cloud Azure is an open-source project that helps developers easier to use [Azure services](https://azure.microsoft.com/en-us/products/) in [Spring](https://spring.io/) application.

As an open-source project. All its content are public. Here are links to its content:
 - Source code: [Azure/azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring).
 - Samples: [Azure-Samples/azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples).
 - Document: [Spring Cloud Azure](.) (Current page).

## What is Spring Cloud Azure used for?

Spring Cloud Azure can help developer easier to develop these features in Spring application:
 - Managing configuration properties by [Azure App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/overview).
 - Sending and receiving messages by [Azure Event Hubs](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about) / [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) / [Azure Storage Queue](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction).
 - Managing secrets / certificates by [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview).
 - Supporting sign in users with work or school accounts provisioned by [Azure Active Directory](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis).
 - Supporting sign in users with social accounts (like Facebook and Google) by [Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview).
 - Protecting your web APIs and accessing protected APIs like Microsoft Graph to work with your users' and organization's data by [Azure Active Directory](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis) / [Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview).
 - Storing structured data by [Azure Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/introduction).
 - Storing unstructured data (like text or binary data) by [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview).
 - Storing files by [Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction).

:::image type="content" source="media/spring-cloud-azure-overview/spring-cloud-azure-overview.png" alt-text="Spring Cloud Azure Overview.":::

## Benefits Of Using Spring Cloud Azure

This section will demonstrate the benefits of using Spring Cloud Azure. Take retrieve secrets stored in Azure Key Vault as an example, comparing the difference of developing a Spring Boot application with and without Spring Cloud Azure.

### Without Spring Cloud Azure

TODO(rujche): Implement following contents.

1. Add dependencies in pom.xml
2. Need to manage client-id client-secret by writing java code.
3. Add necessary properties in application.yml
4. Need to construct `SecretClient` by himself.
5. If `SecretClient` need to be used in multiple places, should define a `SecretClient` bean.
6. Autowired `SecretClient` in related place.

### With Spring Cloud Azure

TODO(rujche): Implement following contents.
1. Add `spring-cloud-azure-starter-keyvault-secrets`.
2. Add necessary properties in application.yml
3. Autowired `SecretClient` in related place.

Furthermore, he can use these features:
1. Use `@Value` to get the secret value.
2. Use Health indicator oto check the health of Key Vault.
3. No need to worry about the problem of version compatibility between Spring Boot and Azure SDK. 

## Next steps

+ [Load a secret from Azure Key Vault](configure-spring-boot-starter-java-app-with-azure-key-vault.md)
+ [Secure REST API using Spring Security 5 and Azure Active Directory](configure-spring-boot-starter-java-app-with-azure-active-directory.md)
+ [Access data with Azure Cosmos DB NoSQL API](configure-spring-boot-starter-java-app-with-cosmos-db.md)

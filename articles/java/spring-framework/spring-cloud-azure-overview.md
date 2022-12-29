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

Without Spring Cloud Azure, if you want to retrieve secrets stored in Azure Key Vault, you need to these steps:

1. Add dependencies in pom.xml
   ```xml
   <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-security-keyvault-secrets</artifactId>
      <version>4.5.2</version>
   </dependency>
   ```
2. Construct `SecretClient`.
   ```java
   public class DemoClass {
     public static void main(String... args) {
     SecretClient client = new SecretClientBuilder()
         .vaultUrl("vaultUrl")
         .credential(new ClientSecretCredentialBuilder()
             .tenantId("tenantId")
             .clientId("clientId")
             .clientSecret("clientSecret")
             .build())
         .buildClient();
     }
   }
   ```
3. Avoid hard code information like `client-id` and `client-secret`. Make these properties configurable:
   ```java
   @ConfigurationProperties("azure.keyvault")
   public class KeyVaultProperties {
     private String vaultUrl;
     private String tenantId;
     private String clientId;
     private String clientSecret;
   
     public KeyVaultProperties(String vaultUrl, String tenantId, String clientId, String clientSecret) {
         this.vaultUrl = vaultUrl;
         this.tenantId = tenantId;
         this.clientId = clientId;
         this.clientSecret = clientSecret;
     }
   
     public String getVaultUrl() {
         return vaultUrl;
     }
   
     public void setVaultUrl(String vaultUrl) {
         this.vaultUrl = vaultUrl;
     }
   
     public String getTenantId() {
         return tenantId;
     }
   
     public void setTenantId(String tenantId) {
         this.tenantId = tenantId;
     }
   
     public String getClientId() {
         return clientId;
     }
   
     public void setClientId(String clientId) {
         this.clientId = clientId;
     }
   
     public String getClientSecret() {
         return clientSecret;
     }
   
     public void setClientSecret(String clientSecret) {
         this.clientSecret = clientSecret;
     }
   }
   ```
   Then update your application code like this:
   ```java
   @SpringBootApplication
   @EnableConfigurationProperties(KeyVaultProperties.class)
   public class SecretClientApplication implements CommandLineRunner {
       private KeyVaultProperties properties;

       public SecretClientApplication(KeyVaultProperties properties) {
           this.properties = properties;
       }

       public static void main(String[] args) {
           SpringApplication.run(SecretClientApplication.class, args);
       }

       @Override
       public void run(String... args) {
           SecretClient client = new SecretClientBuilder()
                   .vaultUrl(properties.getVaultUrl())
                   .credential(new ClientSecretCredentialBuilder()
                           .tenantId(properties.getTenantId())
                           .clientId(properties.getClientId())
                           .clientSecret(properties.getClientSecret())
                           .build())
                   .buildClient();
           System.out.println("sampleProperty: " + client.getSecret("sampleProperty").getValue());
       }
   }
   ```
4. Add necessary properties in application.yml
   ```yaml
   azure:
     keyvault:
       vault-url:
       tenant-id:
       client-id:
       client-secret:
   ```
5. If `SecretClient` need to be used in multiple places, should define a `SecretClient` bean. Then auto-wire `SecretClient` in related place.

### With Spring Cloud Azure

With Spring Cloud Azure, if you want to retrieve secrets stored in Azure Key Vault, things will be much easier. You just need to do these steps:

1. Add dependencies in pom.xml
   ```xml
   <dependencies>
     <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-keyvault-secrets</artifactId>
     </dependency>
   </dependencies>
   ```
   Use bom to manage Spring Cloud Azure version:
   ```xml
   <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>4.5.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
   </dependencyManagement>
   ```
2. Add necessary properties in application.yml
   ```yaml
   spring:
     cloud:
       azure:
         keyvault:
           secret:
             endpoint:
   ```
   Login by [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/), then credential can be provided by Azure CLI, no need to add other credential information (like `client-id` and `client-secret`).
   ```shell
   az login
   ```
3. Auto-wire `SecretClient` in related place.
   ```java
   @SpringBootApplication
   public class SecretClientApplication implements CommandLineRunner {

     private final SecretClient secretClient;

     public SecretClientApplication(SecretClient secretClient) {
         this.secretClient = secretClient;
     }

     public static void main(String[] args) {
         SpringApplication.run(SecretClientApplication.class, args);
     }

     @Override
     public void run(String... args) {
         System.out.println("sampleProperty: " + secretClient.getSecret("sampleProperty").getValue());
     }
   }
   ```

Besides the autoconfigured `SecretClient`, Spring Cloud Azure still provided some other features. For example: Use `@Value` to get the secret value. Here is example java code:
   ```java
   @SpringBootApplication
   public class PropertySourceApplication implements CommandLineRunner {

     @Value("${sampleProperty1}")
     private String sampleProperty1;

     public static void main(String[] args) {
         SpringApplication.run(PropertySourceApplication.class, args);
     }

     public void run(String[] args) {
         System.out.println("sampleProperty1: " + sampleProperty1);
     }

   }
   ```

## Components of Spring Cloud Azure

### Azure Support

Provides autoconfiguration support for Azure Services. e.g. Service Bus, Storage, Active Directory, etc.

### Azure Active Directory

Provides integration support for Spring Security with Azure Active Directory for authentication. Please refer to [Developer Guide / Spring Security support](./spring-cloud-azure?tabs=maven#spring-security-support) to get more information.

### Azure Key Vault

Provides Spring `@Value` annotation support for integration with Azure Key Vault Secrets. Please refer to [Developer Guide / Secret management](./spring-cloud-azure?tabs=maven#secret-management) to get more information.

### Azure Storage

Provides Spring Boot support for Azure Storage services. Please refer to [Developer Guide / Resource handling](./spring-cloud-azure?tabs=maven#resource-handing) to get more information.


# Get Support

If you need get support about Spring Cloud Azure, you can ask for help by these ways:

- Azure support tickets. Customers with an [Azure support plan](https://azure.microsoft.com/en-ca/support/options/) can open an [Azure support ticket](https://azure.microsoft.com/en-ca/support/create-ticket/). We recommend this option if your problem requires immediate attention.
- GitHub issues in [Azure/azure-sdk-for-java repository](https://github.com/Azure/azure-sdk-for-java). We use GitHub Issues to track bugs, questions, and feature requests. GitHub Issues are free, but response time is not guaranteed. See [GitHub issues support process](https://devblogs.microsoft.com/azure-sdk/github-issue-support-process/) for more details.


## Next steps

+ [Load a secret from Azure Key Vault](configure-spring-boot-starter-java-app-with-azure-key-vault.md)
+ [Secure REST API using Spring Security 5 and Azure Active Directory](configure-spring-boot-starter-java-app-with-azure-active-directory.md)
+ [Access data with Azure Cosmos DB NoSQL API](configure-spring-boot-starter-java-app-with-cosmos-db.md)

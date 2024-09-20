---
title: Spring Cloud Azure Overview
description: Spring Cloud Azure is a project that helps make it easier to use Azure services in Spring Boot applications by providing a group of Java libraries.
author: KarlErickson
ms.author: hangwan
ms.topic: overview
ms.date: 08/28/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# What is Spring Cloud Azure?

Spring Cloud Azure is an open source project that helps make it easier to use [Azure services](https://azure.microsoft.com/products/) in [Spring](https://spring.io/) applications.

Spring Cloud Azure is an open source project, with all resources available to the public. The following list provides links to these resources:

- Source code: [Azure/azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring).
- Samples: [Azure-Samples/azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples).
- Documentation: [Spring Cloud Azure](./index.yml).

## What is Spring Cloud Azure used for?

Spring Cloud Azure can help make it easier to accomplish the following tasks in Spring applications:

- Managing configuration properties with [Azure App Configuration](/azure/azure-app-configuration/overview).
- Sending and receiving messages with [Azure Event Hubs](/azure/event-hubs/event-hubs-about), [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview), and [Azure Storage Queue](/azure/storage/queues/storage-queues-introduction).
- Managing secrets and certificates with [Azure Key Vault](/azure/key-vault/general/overview).
- Supporting user sign-in with work or school accounts provisioned with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis).
- Supporting user sign-in with social accounts like Facebook and Google with [Azure Active Directory B2C](/azure/active-directory-b2c/overview).
- Protecting your web APIs and accessing protected APIs like Microsoft Graph to work with your users' and organization's data with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis) and [Azure Active Directory B2C](/azure/active-directory-b2c/overview).
- Storing structured data with [Azure Cosmos DB](/azure/cosmos-db/introduction).
- Storing unstructured data like text or binary data with [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview).
- Storing files with [Azure Files](/azure/storage/files/storage-files-introduction).

## Benefits of using Spring Cloud Azure

The following section demonstrates the benefits of using Spring Cloud Azure. In this section, the retrieval of secrets stored in Azure Key Vault is used as an example. This section compares the differences between developing a Spring Boot application with and without Spring Cloud Azure.

### Without Spring Cloud Azure

Without Spring Cloud Azure, if you want to retrieve secrets stored in Azure Key Vault, you need to the following steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-security-keyvault-secrets</artifactId>
      <version>4.5.2</version>
   </dependency>
   ```

1. Construct a `SecretClient` class instance by using code similar to the following example:

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

1. Avoid hard coding information such as `client-id` and `client-secret` by making these properties configurable, as shown in the following example:

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

1. Update your application code as shown in this example:

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

1. Add the necessary properties to your *application.yml* file, as shown in the following example:

   ```yaml
   azure:
     keyvault:
       vault-url:
       tenant-id:
       client-id:
       client-secret:
   ```

1. If you need to use `SecretClient` in multiple places, define a `SecretClient` bean. Then, auto-wire `SecretClient` in the relevant places.

### With Spring Cloud Azure

With Spring Cloud Azure, if you want to retrieve secrets stored in Azure Key Vault, the requirements are simpler, as shown in the following steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependencies>
     <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-keyvault-secrets</artifactId>
     </dependency>
   </dependencies>
   ```

1. Use a bill of materials (BOM) to manage the Spring Cloud Azure version, as shown in the following example:

   ```xml
   <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.16.0</version>
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

1. Add the following properties to your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         keyvault:
           secret:
             endpoint:
   ```

1. Sign in with [Azure CLI](/cli/azure/) by using the following command. Your credentials will then be provided by Azure CLI, so there will be no need to add other credential information such as `client-id` and `client-secret`.

   ```azurecli
   az login
   ```

1. Auto-wire `SecretClient` in the relevant places, as shown in the following example:

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

Spring Cloud Azure will provide some other features besides the auto-configured `SecretClient`. For example, you can use `@Value` to get the secret value, as shown in the following example:

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

### Azure support

Provides auto-configuration support for Azure Services, such as Service Bus, Storage, Active Directory, and so on.

<a name='azure-active-directory'></a>

### Microsoft Entra ID

Provides integration support for Spring Security with Microsoft Entra ID for authentication. For more information, see [Spring Cloud Azure support for Spring Security](spring-security-support.md).

### Azure Key Vault

Provides Spring `@Value` annotation support for integration with Azure Key Vault Secrets. For more information, see [Spring Cloud Azure secret management](secret-management.md).

### Azure Storage

Provides Spring Boot support for Azure Storage services. For more information, see [Spring Cloud Azure resource handling](resource-handling.md).

## Get support

If you need support for Spring Cloud Azure, you can ask for help in the following ways:

- Create Azure support tickets. Customers with an [Azure support plan](https://azure.microsoft.com/support/options/) can open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/). We recommend this option if your problem requires immediate attention.
- File GitHub issues in the [Azure/azure-sdk-for-java repository](https://github.com/Azure/azure-sdk-for-java). We use GitHub issues to track bugs, questions, and feature requests. GitHub issues are free, but the response time isn't guaranteed. For more information, see [GitHub issues support process](https://devblogs.microsoft.com/azure-sdk/github-issue-support-process/).

## Next steps

- [Tutorial: Read a secret from Azure Key Vault in a Spring Boot application](configure-spring-boot-starter-java-app-with-azure-key-vault.md)
- [Secure REST API using Spring Security 5 and Microsoft Entra ID](configure-spring-boot-starter-java-app-with-azure-active-directory.md)
- [How to use the Spring Boot Starter with Azure Cosmos DB for NoSQL](configure-spring-boot-starter-java-app-with-cosmos-db.md)

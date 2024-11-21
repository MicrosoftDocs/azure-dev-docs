---
title: Spring Cloud Azure secret management
description: This article describes Spring Cloud Azure secret management.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure secret management

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.18.0

Spring Cloud Azure construct `PropertySource` which holds secrets stored in Azure Key Vault Secrets.

## Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-keyvault-secrets</artifactId>
</dependency>
```

> [!TIP]
> We also provide `spring-cloud-azure-starter-keyvault` to support all the features of Key Vault. If you choose to use it, `spring.cloud.azure.keyvault.enable` is the property to configure and the default value is *true*. You can then use `spring.cloud.azure.keyvault.<keyvault-service>.enable` to disable unneeded services.

## Basic usage

If you want to authenticate by `client-id` and `client-secret`, the following properties are required:

### Configuration Properties

```yaml
spring:
  cloud:
    azure:
      keyvault:
        secret:
          property-sources:
            - name: key-vault-property-source-1
              endpoint: ${ENDPOINT_1}
            - name: key-vault-property-source-2
              endpoint: ${ENDPOINT_2}
```

### Java code

```java
@SpringBootApplication
public class SampleApplication implements CommandLineRunner {

    @Value("${sampleProperty1}")
    private String sampleProperty1;
    @Value("${sampleProperty2}")
    private String sampleProperty2;
    @Value("${samplePropertyInMultipleKeyVault}")
    private String samplePropertyInMultipleKeyVault;

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }

    public void run(String[] args) {
        System.out.println("sampleProperty1: " + sampleProperty1);
        System.out.println("sampleProperty2: " + sampleProperty2);
        System.out.println("samplePropertyInMultipleKeyVault: " + samplePropertyInMultipleKeyVault);
    }
}
```

## Advanced usage

### Special characters in property name

Key Vault secret names support only characters in `[0-9a-zA-Z-]`. For more information, see the[Vault-name and Object-name](/azure/key-vault/general/about-keys-secrets-certificates#vault-name-and-object-name) section of [Azure Key Vault keys, secrets and certificates overview](/azure/key-vault/general/about-keys-secrets-certificates). If your property name contains other characters, you can use the workarounds described in the following sections.

#### Use `-` instead of `.` in secret names

`.` isn't supported in secret names. If your application has a property name that contains `.`, such as `spring.datasource.url`, replace `.` with `-` when saving the secret in Azure Key Vault. For example, save `spring-datasource-url` in Azure Key Vault. In your application, you can still use `spring.datasource.url` to retrieve the property value.

> [!NOTE]
> This method cannot satisfy a requirement like `spring.datasource-url`. When you save `spring-datasource-url` in Key Vault, only `spring.datasource.url` and `spring-datasource-url` is supported to retrieve the property value, but `spring.datasource-url` isn't supported. To handle this case, see the [Use property placeholders](#use-property-placeholders) section.

#### Use property placeholders

For example, suppose you're setting this property in your *application.properties* file:

```properties
property.with.special.character__=${propertyWithoutSpecialCharacter}
```

The application will get a `propertyWithoutSpecialCharacter` key name and assign its value to `property.with.special.character__`.

### Case-sensitive

To enable case-sensitive mode, you can set the following property:

```properties
spring.cloud.azure.keyvault.secret.property-sources[].case-sensitive=true
```

### Not retrieve all secrets in Key Vault

If you stored 1000 secrets in the Key Vault, and you just want to use 3 of them. You can list the 3 secret names by `spring.cloud.azure.keyvault.secret.property-sources[].secret-keys`.

### Setting refresh interval

By default, the secrets in `KeyVaultPropertySource` will refresh every 30 minutes. You can configure the time by `spring.cloud.azure.keyvault.secret.property-sources[].refresh-interval`. For example: `spring.cloud.azure.keyvault.secret.property-sources[].refresh-interval=60m` means refresh every 60 minutes. Set to `0` to disable auto refresh.

### PropertySource priority

If key exists in multiple PropertySources, which will take effect is decided by the priority.

* If there is no `SystemEnvironmentPropertySource` in the `PropertySource` list, then `KeyVaultPropertySource` will take the highest priority.
* If there is `SystemEnvironmentPropertySource` in the `PropertySource` list, then `SystemEnvironmentPropertySource` have higher priority than `KeyVaultPropertySource`, which means you can use an environment variable to override the Key Vault secret value in your application.
* If there are multiple key vault property sources in the `PropertySource` list, then the definition order is the priority order. Taking the above sample as an example, `key-vault-property-source-1` has a higher priority than `key-vault-property-source-2`.

### Configure token credential for Key Vault property source

If you need to use a specified token credential for Key Vault `PropertySource`, you can register the `TokenCredential` bean in the `ConfigurableBootstrapContext` for `KeyVaultEnvironmentPostProcessor`, this feature is supported from Spring Cloud Azure 5.18.0. Here is an example to use `AzureCliCredential`:

```java
public static void main(String[] args) {
    SpringApplication application = new SpringApplication(PropertySourceApplication.class);
    application.addBootstrapRegistryInitializer(registry -> 
            registry.register(TokenCredential.class, context -> new AzureCliCredentialBuilder().build()));

    application.run(args);
}
```

### All configurable properties

> [!div class="mx-tdBreakAll"]
> | Property                                                                 | Default value | Description                                                                                            |
> |--------------------------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.keyvault.secret*.property-source-enabled             | true          | Whether to enable the Key Vault property source.                                                       |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].name             |               | Name of this property source.                                                                          |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].endpoint         |               | Azure Key Vault endpoint.                                                                              |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].case-sensitive   | false         | Whether the secret keys are case-sensitive.                                                            |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].secret-keys      |               | The secret keys supported for this property source. All keys be retrieved if this property is missing. |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].refresh-interval | 30m           | Time interval to refresh all Key Vault secrets.                                                        |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].service-version  |               | Secret service version used when making API requests.                                                  |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].client           |               | Client related properties.                                                                             |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].credential       |               | Credential related properties.                                                                         |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].profile          |               | Profile related properties.                                                                            |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].proxy            |               | Proxy related properties.                                                                              |
> | *spring.cloud.azure.keyvault.secret*.property-sources[].retry            |               | Retry related properties.                                                                              |

* See [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory) to make sure the [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) has been granted the sufficient permission to access the Azure Key Vault Secrets.
* If common properties like `client`, `credential`, `profile`, `proxy`, `retry` aren't configured in `spring.cloud.azure.keyvault.secret.property-sources[].xxx`, `spring.cloud.azure.xxx` will be used. See [Spring Cloud Azure configuration](configuration-properties-global.md) to get more information about these common properties.
* See [Spring Cloud Azure configuration properties](configuration-properties-all.md) to get more information about nested properties.

## Samples

See the [spring-cloud-azure-starter-keyvault-secrets samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/spring-cloud-azure-starter-keyvault-secrets/property-source) on GitHub.

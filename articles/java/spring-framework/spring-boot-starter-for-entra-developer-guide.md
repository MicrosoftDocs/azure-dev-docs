---
title: Spring Boot Starter for Microsoft Entra developer's guide
description: This guide describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Microsoft Entra starter.
ms.date: 04/06/2023
ms.topic: how-to
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.custom: devx-track-java, engagement-fy23, spring-cloud-azure, devx-track-extended-java
appliesto:
- ✅ Version 4.20.0
- ✅ Version 5.22.0
---

# Spring Boot Starter for Microsoft Entra developer's guide

This article describes the features and core scenarios of the Spring Boot Starter for Microsoft Entra ID. The article also includes guidance on common issues, workarounds, and diagnostic steps.

When you're building a web application, identity and access management are foundational pieces. Azure offers a cloud-based identity service that has deep integration with the rest of the Azure ecosystem.

Although Spring Security makes it easy to secure your Spring-based applications, it isn't tailored to a specific identity provider. The Spring Boot Starter for Microsoft Entra ID enables you to connect your web application to a Microsoft Entra tenant and protect your resource server with Microsoft Entra ID. It uses the Oauth 2.0 protocol to protect web applications and resource servers.

The following links provide access to the starter package, documentation, and samples:

- [The spring-cloud-azure-starter-active-directory package (Maven)](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-active-directory)
- [Quick start](./configure-spring-boot-starter-java-app-with-entra.md)
- [Samples](https://github.com/Azure-Samples/azure-spring-boot-samples)

## Prerequisites

To follow the instructions in this guide, you must have the following prerequisites:

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
- A supported Java Development Kit (JDK), version 8 or higher. For more information, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
- [Apache Maven](https://maven.apache.org/), version 3.0 or higher.
- An application registered with Microsoft Entra ID. For more information, see [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Core scenarios

This guide describes how to use the Microsoft Entra starter in the following scenarios:

- [Access a web application](#access-a-web-application)
- [Access resource servers from a web application](#access-resource-servers-from-a-web-application)
- [Protect a resource server/API](#protect-a-resource-serverapi)
- [Access other resource servers from a resource server](#access-other-resource-servers-from-a-resource-server)
- [Web application and resource server in one application](#web-application-and-resource-server-in-one-application)

A *web application* is any web-based application that enables a user to sign in. A *resource server* will either accept or deny access after validating an access token.

### Access a web application

This scenario uses the [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to enable a user to sign in with a Microsoft account.

To use the Microsoft Entra starter in this scenario, use the following steps:

Set the redirect URI to `<application-base-uri>/login/oauth2/code/`. For example: `http://localhost:8080/login/oauth2/code/`. Be sure to include the trailing `/`. For more information about the redirect URI, see [Add a redirect URI](/azure/active-directory/develop/quickstart-register-app#add-a-redirect-uri) in [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

   :::image type="content" source="media/spring-boot-starter-for-entra-developer-guide/web-application-set-redirect-uri-2.png" alt-text="Screenshot of Azure portal showing web app authentication page with redirect URI highlighted.":::

Add the following dependencies to your **pom.xml** file.

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

> [!NOTE]
> For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

Add the following properties to your **application.yml** file. You can get the values for these properties from the app registration you created in the Azure portal, as described in the prerequisites.

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       profile:
         tenant-id: <tenant>
       credential:
         client-id: <your-client-ID>
         client-secret: <your-client-secret>
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Use the default security configuration or provide your own configuration.

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

Option 1: Use the default configuration.

With this option, you don't need to do anything. The `DefaultAadWebSecurityConfiguration` class is configured automatically.

Option 2: Provide a self-defined configuration.

To provide a configuration, apply the `AadWebApplicationHttpSecurityConfigurer#aadWebApplication` method for the `HttpSecurity`, as shown in the following example:

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
public class AadOAuth2LoginSecurityConfig {

   /**
    * Add configuration logic as needed.
    */
   @Bean
   SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http.apply(AadWebApplicationHttpSecurityConfigurer.aadWebApplication())
               .and()
           .authorizeHttpRequests()
               .anyRequest().authenticated();
           // Do some custom configuration.
       return http.build();
   }
}
```

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

Option 1: Use the default configuration.

With this option, you don't need to do anything. The `DefaultAadWebSecurityConfigurerAdapter` class is configured automatically.

Option 2: Provide a self-defined configuration.

To provide a configuration, extend the `AadWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadOAuth2LoginSecurityConfig extends AadWebSecurityConfigurerAdapter {

   /**
    * Add configuration logic as needed.
   */
   @Override
   protected void configure(HttpSecurity http) throws Exception {
       super.configure(http);
       http.authorizeRequests()
           .anyRequest().authenticated();
       // Do some custom configuration.
   }
}
```

---

### Access resource servers from a web application

To use the Microsoft Entra starter in this scenario, use the following steps:

Set the redirect URI as described previously.

Add the following dependencies to your **pom.xml** file.

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

> [!NOTE]
> For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

Add the following properties to your **application.yml** file, as described previously:

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       profile:
         tenant-id: <tenant>
       credential:
         client-id: <your-client-ID>
         client-secret: <your-client-secret>
       authorization-clients:
         graph:
           scopes: https://graph.microsoft.com/Analytics.Read, email
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Here, `graph` is the name of your `OAuth2AuthorizedClient`, and `scopes` are the scopes needed for consent when logging in.

Add code to your application similar to the following example:

```java
@GetMapping("/graph")
@ResponseBody
public String graph(
   @RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graphClient
) {
   // toJsonString() is just a demo.
   // oAuth2AuthorizedClient contains access_token. We can use this access_token to access the resource server.
   return toJsonString(graphClient);
}
```

Here, `graph` is the client ID configured in the previous step. `OAuth2AuthorizedClient` contains the access token, which is used to access the resource server.

For a complete sample demonstrating this scenario, see [spring-cloud-azure-starter-active-directory sample: aad-web-application](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-web-application).

### Protect a resource server/API

This scenario doesn't support sign in, but protects the server by validating the access token. If the access token is valid, the server serves the request.

To use the Microsoft Entra starter in this scenario, use the following steps:

Add the following dependencies to your **pom.xml** file.

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

> [!NOTE]
> For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

Add the following properties to your **application.yml** file, as described previously:

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       credential:
         client-id: <your-client-ID>
       app-id-uri: <your-app-ID-URI>
```

You can use both the `<your-client-ID>` and `<your-app-ID-URI>` values to verify the access token. You can get the `<your-app-ID-URI>` value from the Azure portal, as shown in the following images:

:::image type="content" source="media/spring-boot-starter-for-entra-developer-guide/get-app-id-uri-2.png" alt-text="Screenshot of Azure portal showing web app Expose an API page with Application ID URI highlighted.":::

Use the default security configuration or provide your own configuration.

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

Option 1: Use the default configuration.

With this option, you don't need to do anything. The `DefaultAadResourceServerConfiguration` class is configured automatically.

Option 2: Provide a self-defined configuration.

To provide a configuration, apply the `AadResourceServerHttpSecurityConfigurer#aadResourceServer` method for the `HttpSecurity`, as shown in the following example:

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
public class AadOAuth2ResourceServerSecurityConfig {

   /**
    * Add configuration logic as needed.
    */
   @Bean
   public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
       http.apply(AadResourceServerHttpSecurityConfigurer.aadResourceServer())
               .and()
           .authorizeHttpRequests()
               .anyRequest().authenticated();
       return http.build();
   }
}
```

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

Option 1: Use the default configuration.

With this option, you don't need to do anything. The `DefaultAadResourceServerWebSecurityConfigurerAdapter` class is configured automatically.

Option 2: Provide a self-defined configuration.

To provide a configuration, extend the `AadResourceServerWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadOAuth2ResourceServerSecurityConfig extends AadResourceServerWebSecurityConfigurerAdapter {

   /**
    * Add configuration logic as needed.
    */
   @Override
   protected void configure(HttpSecurity http) throws Exception {
       super.configure(http);
       http.authorizeRequests((requests) -> requests.anyRequest().authenticated());
   }
}
```

---

For a complete sample demonstrating this scenario, see [spring-cloud-azure-starter-active-directory sample: aad-resource-server](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server).

### Access other resource servers from a resource server

This scenario supports a resource server visiting other resource servers.

To use the Microsoft Entra starter in this scenario, use the following steps:

Add the following dependencies to your **pom.xml** file.

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

> [!NOTE]
> For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

Add the following properties to your **application.yml** file:

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       profile:
         tenant-id: <tenant>
       credential:
         client-id: <web-API-A-client-ID>
         client-secret: <web-API-A-client-secret>
       app-id-uri: <web-API-A-app-ID-URI>
       authorization-clients:
         graph:
           scopes:
              - https://graph.microsoft.com/User.Read
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Use the `@RegisteredOAuth2AuthorizedClient` attribute in your code to access the related resource server, as shown in the following example:

```java
@PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
@GetMapping("call-graph")
public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
   return callMicrosoftGraphMeEndpoint(graph);
}
```

For a complete sample demonstrating this scenario, see [spring-cloud-azure-starter-active-directory sample: aad-resource-server-obo](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/aad/spring-cloud-azure-starter-active-directory/web-client-access-resource-server/aad-resource-server-obo).

### Web application and resource server in one application

This scenario supports [Access a web application](#access-a-web-application) and [Protect a resource server/API](#protect-a-resource-serverapi) in one application.

To use `aad-starter` in this scenario, follow these steps:

Add the following dependencies to your **pom.xml** file.

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

> [!NOTE]
> For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

Update your **application.yml** file. Set property `spring.cloud.azure.active-directory.application-type` to `web_application_and_resource_server`, and specify the authorization type for each authorization client, as shown in the following example.

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       profile:
         tenant-id: <tenant>
       credential:
         client-id: <Web-API-C-client-id>
         client-secret: <Web-API-C-client-secret>
       app-id-uri: <Web-API-C-app-id-url>
       application-type: web_application_and_resource_server  # This is required.
       authorization-clients:
         graph:
           authorizationGrantType: authorization_code  # This is required.
           scopes:
             - https://graph.microsoft.com/User.Read
             - https://graph.microsoft.com/Directory.Read.All
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Write Java code to configure multiple `HttpSecurity` instances.

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

In the following example code, `AadWebApplicationAndResourceServerConfig` contains two security  filter chain beans, one for a resource server, and one for a web application. The `apiFilterChain` bean has a high priority to configure the resource server security builder. The `htmlFilterChain` bean has a low priority to configure the web application security builder.

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
public class AadWebApplicationAndResourceServerConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http.apply(AadResourceServerHttpSecurityConfigurer.aadResourceServer())
                .and()
            // All the paths that match `/api/**`(configurable) work as the resource server. Other paths work as the web application.
            .securityMatcher("/api/**")
            .authorizeHttpRequests()
                .anyRequest().authenticated();
        return http.build();
    }

    @Bean
    public SecurityFilterChain htmlFilterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        http.apply(AadWebApplicationHttpSecurityConfigurer.aadWebApplication())
                .and()
            .authorizeHttpRequests()
                .requestMatchers("/login").permitAll()
                .anyRequest().authenticated();
        // @formatter:on
        return http.build();
    }
}
```

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

In the following example code, `AadWebApplicationAndResourceServerConfig` contains two security configurations, one for a resource server, and one for a web application. The `ApiWebSecurityConfigurationAdapter` class has a high priority to configure the resource server security adapter. The `HtmlWebSecurityConfigurerAdapter` class has a low priority to configure the web application security adapter.

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadWebApplicationAndResourceServerConfig {

   @Order(1)
   @Configuration
   public static class ApiWebSecurityConfigurationAdapter extends AadResourceServerWebSecurityConfigurerAdapter {
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           // All the paths that match `/api/**`(configurable) work as the resource server. Other paths work as  the web application.
           http.antMatcher("/api/**")
               .authorizeRequests().anyRequest().authenticated();
       }
   }

   @Configuration
   public static class HtmlWebSecurityConfigurerAdapter extends AadWebSecurityConfigurerAdapter {

       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           // @formatter:off
           http.authorizeRequests()
                   .antMatchers("/login").permitAll()
                   .anyRequest().authenticated();
           // @formatter:on
       }
   }
}
```

---

### Application type

The `spring.cloud.azure.active-directory.application-type` property is optional because its value can be inferred by dependencies. You must manually set the property only when you use the `web_application_and_resource_server` value.

| Has dependency: spring-security-oauth2-client | Has dependency: spring-security-oauth2-resource-server |                  Valid values of application type                                                         | Default value               |
|-----------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------|
|                      Yes                      |                          No                            |                       `web_application`                                                                   |       `web_application`     |
|                      No                       |                          Yes                           |                       `resource_server`                                                                   |       `resource_server`     |
|                      Yes                      |                          Yes                           | `web_application`,`resource_server`,<br>`resource_server_with_obo`, `web_application_and_resource_server` | `resource_server_with_obo`  |

## Configurable properties

The Spring Boot Starter for Microsoft Entra ID provides the following properties:

| Properties                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                              |
|----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.cloud.azure.active-directory.app-id-uri                                                           | Used by the resource server to validate the audience in the access token. The access token is valid only when the audience is equal to the `<your-client-ID>` or `<your-app-ID-URI>` values described previously.                                                                                                                                                      |
| spring.cloud.azure.active-directory.authorization-clients                                                | A map that configures the resource APIs the application is going to visit. Each item corresponds to one resource API the application is going to visit. In your Spring code, each item corresponds to one `OAuth2AuthorizedClient` object.                                                                                                                               |
| spring.cloud.azure.active-directory.authorization-clients.`<your-client-name>`.scopes                    | The API permissions of a resource server that the application is going to acquire.                                                                                                                                                                                                                                                                                       |
| spring.cloud.azure.active-directory.authorization-clients.`<your-client-name>`.authorization-grant-type  | The type of authorization client. Supported types are [`authorization_code`](/azure/active-directory/develop/v2-oauth2-auth-code-flow) (default type for webapp), [`on_behalf_of`](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) (default type for resource-server), [`client_credentials`](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow). |
| spring.cloud.azure.active-directory.application-type                                                     | Refer to [Application type](#application-type).                                                                                                                                                                                                                                                                                                                          |
| spring.cloud.azure.active-directory.profile.environment.active-directory-endpoint                        | The base URI for the authorization server. The default value is `https://login.microsoftonline.com/`.                                                                                                                                                                                                                                                                    |
| spring.cloud.azure.active-directory.credential.client-id                                                 | The registered application ID in Microsoft Entra ID.                                                                                                                                                                                                                                                                                                                               |
| spring.cloud.azure.active-directory.credential.client-secret                                             | The client secret of the registered application.                                                                                                                                                                                                                                                                                                                         |
| spring.cloud.azure.active-directory.user-group.use-transitive-members                                    | Use `v1.0/me/transitiveMemberOf` to get groups if set to `true`. Otherwise, use `/v1.0/me/memberOf`.                                                                                                                                                                                                                                                                     |
| spring.cloud.azure.active-directory.post-logout-redirect-uri                                             | The redirect URI for posting the sign-out.                                                                                                                                                                                                                                                                                                                               |
| spring.cloud.azure.active-directory.profile.tenant-id                                                    | The Azure tenant ID. The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID.                                                                                                                                                                                                                                                                                                                         |
| spring.cloud.azure.active-directory.user-group.allowed-group-names                                       | The expected user groups that an authority will be granted to if found in the response from the `MemberOf` Graph API call.                                                                                                                                                                                                                                               |
| spring.cloud.azure.active-directory.user-name-attribute                                                  | Indicates which claim will be the principal's name.                                                                                                                                                                                                                                                                                                                      |

The following examples show you how to use these properties:

**Property example 1:** To use [Azure China 21Vianet](/azure/china/resources-developer-guide#check-endpoints-in-azure) instead of Azure Global, use the following step.

- Add the following properties to your **application.yml** file:

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           enabled: true
           profile:
             environment:
               active-directory-endpoint: https://login.partner.microsoftonline.cn
   ```

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) instead of the Azure public cloud.

**Property example 2:** To use a group name to protect some method in a web application, use the following steps:

Add the following property to your **application.yml** file:

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       user-group:
         allowed-groups: group1, group2
```

Use the default security configuration or provide your own configuration.

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

Option 1: Use the default configuration. With this option, you don't need to do anything. The `DefaultAadWebSecurityConfiguration` class is configured automatically.

Option 2: Provide a self-defined configuration. To provide a configuration, apply the `AadWebApplicationHttpSecurityConfigurer#aadWebApplication` method for the `HttpSecurity`, as shown in the following example:

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
public class AadOAuth2LoginSecurityConfig {

   /**
    * Add configuration logic as needed.
    */
   @Bean
   public SecurityFilterChain htmlFilterChain(HttpSecurity http) throws Exception {
       // @formatter:off
       http.apply(AadWebApplicationHttpSecurityConfigurer.aadWebApplication())
               .and()
           .authorizeHttpRequests()
               .anyRequest().authenticated();
       // @formatter:on
       // Do some custom configuration.
       return http.build();
   }
}
```

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

Option 1: Use the default configuration. With this option, you don't need to do anything. The `DefaultAadWebSecurityConfigurerAdapter` class is configured automatically.

Option 2: Provide a self-defined configuration. To provide a configuration, extend the `AadWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class AadOAuth2LoginSecurityConfig extends AadWebSecurityConfigurerAdapter {

   /**
    * Add configuration logic as needed.
    */
   @Override
   protected void configure(HttpSecurity http) throws Exception {
       super.configure(http);
       http.authorizeRequests()
           .anyRequest().authenticated();
       // Do some custom configuration.
   }
}
```

---

Use the `@PreAuthorize` annotation to protect the method, as shown in the following example:

```java
@Controller
public class RoleController {
   @GetMapping("group1")
   @ResponseBody
   @PreAuthorize("hasRole('ROLE_group1')")
   public String group1() {
       return "group1 message";
   }

   @GetMapping("group2")
   @ResponseBody
   @PreAuthorize("hasRole('ROLE_group2')")
   public String group2() {
       return "group2 message";
   }

   @GetMapping("group1Id")
   @ResponseBody
   @PreAuthorize("hasRole('ROLE_<group1-id>')")
   public String group1Id() {
       return "group1Id message";
   }

   @GetMapping("group2Id")
   @ResponseBody
   @PreAuthorize("hasRole('ROLE_<group2-id>')")
   public String group2Id() {
       return "group2Id message";
   }
}
```

**Property example 3:** To enable client credential flow in a resource server visiting resource servers, use the following steps:

Add the following property to your **application.yml** file:

```yaml
spring:
 cloud:
   azure:
     active-directory:
       enabled: true
       authorization-clients:
         webapiC:   # When authorization-grant-type is null, on behalf of flow is used by default
           authorization-grant-type: client_credentials
           scopes:
             - <Web-API-C-app-id-url>/.default
```

Add code to your application similar to the following example:

```java
@PreAuthorize("hasAuthority('SCOPE_Obo.WebApiA.ExampleScope')")
@GetMapping("webapiA/webapiC")
public String callClientCredential() {
   String body = webClient
       .get()
       .uri(CUSTOM_LOCAL_READ_ENDPOINT)
       .attributes(clientRegistrationId("webapiC"))
       .retrieve()
       .bodyToMono(String.class)
       .block();
   LOGGER.info("Response from Client Credential: {}", body);
   return "client Credential response " + (null != body ? "success." : "failed.");
}
```

## Advanced features

### Support access control by ID token in a web application

The starter supports creating `GrantedAuthority` from an ID token's `roles` claim to allow using the ID token for authorization in a web application. You can use the `appRoles` feature of Microsoft Entra ID to create a `roles` claim and implement access control.

> [!NOTE]
> The `roles` claim generated from `appRoles` is decorated with prefix `APPROLE_`.
>
> When using `appRoles` as a `roles` claim, avoid configuring a group attribute as `roles` at the same time. Otherwise, the group attribute will override the claim to contain group information instead of `appRoles`. You should avoid the following configuration in your manifest:
>
>    ```manifest
>    "optionalClaims": {
>        "idtoken": [{
>            "name": "groups",
>            "additionalProperties": ["emit_as_roles"]
>        }]
>    }
>    ```

To support access control by ID token in a web application, use the following steps:

Add app roles in your application and assign them to users or groups. For more information, see [How to: Add app roles to your application and receive them in the token](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps).

Add the following `appRoles` configuration to your application's manifest:

```manifest
 "appRoles": [
   {
     "allowedMemberTypes": [
       "User"
     ],
     "displayName": "Admin",
     "id": "2fa848d0-8054-4e11-8c73-7af5f1171001",
     "isEnabled": true,
     "description": "Full admin access",
     "value": "Admin"
    }
 ]
```

Add code to your application similar to the following example:

```java
@GetMapping("Admin")
@ResponseBody
@PreAuthorize("hasAuthority('APPROLE_Admin')")
public String Admin() {
   return "Admin message";
}
```

## Troubleshooting

### Enable client logging

The Azure SDKs for Java offer a consistent logging story to help troubleshoot and resolve application errors. The logs produced will capture the flow of an application before reaching the terminal, helping to locate the root issue. View the [logging](https://github.com/Azure/azure-sdk-for-java/wiki/Logging-in-Azure-SDK) wiki for guidance on enabling logging.

### Enable Spring logging

Spring enables all the supported logging systems to set logger levels in the Spring environment - for example, in **application.properties** - by using `logging.level.<logger-name>=<level>` where `<level>` is one of `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, or `OFF`. You can configure the root logger by using `logging.level.root`.

The following example shows potential logging settings in the **application.properties** file:

```properties
logging.level.root=WARN
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate=ERROR
```

For more information about logging configuration in Spring, see [Logging](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging) in the Spring documentation.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

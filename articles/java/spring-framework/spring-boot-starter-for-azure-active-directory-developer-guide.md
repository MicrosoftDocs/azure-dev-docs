---
title: Spring Boot Starter for Azure Active Directory developer's guide
description: This guide describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Azure Active Directory starter.
ms.date: 04/14/2021
ms.service: active-directory
ms.topic: article
author: stliu
ms.author: shaozliu
ms.custom: devx-track-java
---

# Spring Boot Starter for Azure Active Directory developer's guide

This article describes the features and core scenarios of the Spring Boot Starter for Azure Active Directory (Azure AD). The article also includes guidance on common issues, workarounds, and diagnostic steps.

When you're building a web application, identity and access management are foundational pieces. Azure offers a cloud-based identity service that has deep integration with the rest of the Azure ecosystem.

Although Spring Security makes it easy to secure your Spring-based applications, it isn't tailored to a specific identity provider. The Spring Boot Starter for Azure AD enables you to connect your web application to an Azure AD tenant and protect your resource server with Azure AD. It uses the Oauth 2.0 protocol to protect web applications and resource servers.

The following links provide access to the starter package, documentation, and samples:

- [The azure-spring-boot-starter-active-directory package (Maven)](https://mvnrepository.com/artifact/com.azure.spring/azure-spring-boot-starter-active-directory)
- [API reference documentation](https://azure.github.io/azure-sdk-for-java/springboot.html#azure-spring-boot)
- [Product documentation](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples)

## Prerequisites

To follow the instructions in this guide, you must have the following prerequisites:

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
- A supported Java Development Kit (JDK), version 8 or later. For more information, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
- [Apache Maven](https://maven.apache.org/), version 3.0 or later.
- An application registered with Azure AD. For more information, see [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

## Core scenarios

This guide describes how to use the Azure AD starter in the following scenarios:

- [Access a web application](#access-a-web-application)
- [Access resource servers from a web application](#access-resource-servers-from-a-web-application)
- [Protect a resource server/API](#protect-a-resource-serverapi)
- [Access other resource servers from a resource server](#access-other-resource-servers-from-a-resource-server)

A *web application* is any web-based application that enables a user to sign in. A *resource server* will either accept or deny access after validating an access token.

### Access a web application

This scenario uses the [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to enable a user to sign in with a Microsoft account.

To use the Azure AD starter in this scenario, use the following steps:

1. Set the redirect URI to *\<application-base-uri>/login/oauth2/code/*. For example: `http://localhost:8080/login/oauth2/code/`. Be sure to include the trailing `/`. For more information about the redirect URI, see [Add a redirect URI](/azure/active-directory/develop/quickstart-register-app#add-a-redirect-uri) in [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

   :::image type="content" source="media/spring-boot-starter-for-azure-active-directory-developer-guide/web-application-set-redirect-uri-1.png" alt-text="Set the redirect URI for a web application using the Azure portal, part 1":::

   :::image type="content" source="media/spring-boot-starter-for-azure-active-directory-developer-guide/web-application-set-redirect-uri-2.png" alt-text="Set the redirect URI for a web application using the Azure portal, part 2":::

1. Add the following dependencies to your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.5.0-beta.1</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-client</artifactId>
   </dependency>
   ```

1. Add the following properties to your *application.yml* file. You can get the values for these properties from the app registration you created in the Azure portal, as described in the prerequisites.

   ```yaml
   azure:
     activedirectory:
       tenant-id: <your-tenant-ID>
       client-id: <your-client-ID>
       client-secret: <your-client-secret>
   ```

1. Use the default security configuration or provide your own configuration.

   The `AADWebSecurityConfigurerAdapter` base class contains the necessary web security configuration for the Azure AD starter. The `DefaultAADWebSecurityConfigurerAdapter` class is configured automatically if you don't provide a configuration.

   To provide a configuration, extend the `AADWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {

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

### Access resource servers from a web application

To use the Azure AD starter in this scenario, use the following steps:

1. Set the redirect URI as described previously.

1. Add the following dependencies to your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.5.0-beta.1</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-client</artifactId>
   </dependency>
   ```

1. Add the following properties to your *application.yml* file, as described previously:

   ```yaml
   azure:
     activedirectory:
       tenant-id: <your-tenant-ID>
       client-id: <your-client-ID>
       client-secret: <your-client-secret>
       authorization-clients:
         graph:
           scopes: https://graph.microsoft.com/Analytics.Read, email
   ```

   Here, `graph` is the name of your `OAuth2AuthorizedClient`, and `scopes` are the scopes needed for consent when logging in.

1. Add code to your application similar to the following example:

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

For a complete sample demonstrating this scenario, see [OAuth 2.0 Sample for Azure AD Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-webapp).

### Protect a resource server/API

This scenario doesn't support sign in, but protects the server by validating the access token. If the access token is valid, the server serves the request.

To use the Azure AD starter in this scenario, use the following steps:

1. Add the following dependencies to your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.5.0-beta.1</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
   </dependency>
   ```

1. Add the following properties to your *application.yml* file, as described previously:

   ```yaml
   azure:
     activedirectory:
       client-id: <your-client-ID>
       app-id-uri: <your-app-ID-URI>
   ```

   You can use both the *\<your-client-ID>* and *\<your-app-ID-URI>* values to verify the access token. You can get the *\<your-app-ID-URI>* value from the Azure portal, as shown in the following images:

   :::image type="content" source="media/spring-boot-starter-for-azure-active-directory-developer-guide/get-app-id-uri-1.png" alt-text="Get the app ID URI from the Azure portal, part 1":::

   :::image type="content" source="media/spring-boot-starter-for-azure-active-directory-developer-guide/get-app-id-uri-2.png" alt-text="Get the app ID URI from the Azure portal, part 2":::

1. Use the default security configuration or provide your own configuration.

   The `AADResourceServerWebSecurityConfigurerAdapter` base class contains the necessary web security configuration for the resource server. The `DefaultAADResourceServerWebSecurityConfigurerAdapter` class is configured automatically if you don't provide a configuration.

   To provide a configuration, extend the `AADResourceServerWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2ResourceServerSecurityConfig extends AADResourceServerWebSecurityConfigurerAdapter {

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

For a complete sample demonstrating this scenario, see [OAuth 2.0 Sample for Azure AD Spring Boot Starter Resource Server library for Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server).

### Access other resource servers from a resource server

This scenario supports a resource server visiting other resource servers.

To use the Azure AD starter in this scenario, use the following steps:

1. Add the following dependencies to your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.5.0-beta.1</version>
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

1. Add the following properties to your *application.yml* file:

   ```yaml
   azure:
      activedirectory:
         tenant-id: <tenant-ID-registered-by-application>
         client-id: <web-API-A-client-ID>
         client-secret: <web-API-A-client-secret>
         app-id-uri: <web-API-A-app-ID-URI>
         authorization-clients:
            graph:
               scopes:
                  - https://graph.microsoft.com/User.Read
   ```

1. Use the `@RegisteredOAuth2AuthorizedClient` attribute in your code to access the related resource server, as shown in the following example:

   ```java
   @PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
   @GetMapping("call-graph")
   public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
       return callMicrosoftGraphMeEndpoint(graph);
   }
   ```

For a complete sample demonstrating this scenario, see [OAuth 2.0 Sample for azure-spring-boot-sample-active-directory-resource-server-obo library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server-obo).

## Configurable properties

The Spring Boot Starter for Azure AD provides the following properties:

| Properties                                                              | Description                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| azure.activedirectory.app-id-uri                                    | Used by the resource server to validate the audience in the access token. The access token is valid only when the audience is equal to the *\<your-client-ID>* or *\<your-app-ID-URI>* values described previously.    |
| azure.activedirectory.authorization-clients                         | A map that configures the resource APIs the application is going to visit. Each item corresponds to one resource API the application is going to visit. In your Spring code, each item corresponds to one `OAuth2AuthorizedClient` object.|
| azure.activedirectory.authorization-clients.*\<your-client-name>*.scopes    | The API permissions of a resource server that the application is going to acquire.                 |
| azure.activedirectory.authorization-clients.*\<your-client-name>*.on-demand | Used for incremental consent. The default value is *false*. If the value is *true*, the application doesn't request consent when the user signs in. When the application needs permission, it performs incremental consent with one OAuth2 authorization code flow.|
| azure.activedirectory.base-uri                                      | The base URI for the authorization server. The default value is `https://login.microsoftonline.com/`.  |
| azure.activedirectory.client-id                                     | The registered application ID in Azure AD.                                                         |
| azure.activedirectory.client-secret                                 | The client secret of the registered application.                                                   |
| azure.activedirectory.graph-membership-uri                          | Used to load the users' groups. The default value is `https://graph.microsoft.com/v1.0/me/memberOf`, which gets direct groups. To get all transitive membership, set it to `https://graph.microsoft.com/v1.0/me/transitiveMemberOf`. The two URIs are for Azure Global. If you want to use Azure China instead, see **Property example 1** below.|
| azure.activedirectory.post-logout-redirect-uri                      | The redirect URI for posting the sign-out.                            |
| azure.activedirectory.tenant-id                                     | The Azure tenant ID.                                             |
| azure.activedirectory.user-group.allowed-groups                     | The expected user groups that an authority will be granted to if found in the response from the MemberOf Graph API Call. |
| azure.activedirectory.user-name-attribute                           | Indicates which claim will be the principal's name. |

The following examples show you how to use these properties:

**Property example 1:** To use [Azure China 21Vianet](/azure/china/resources-developer-guide#check-endpoints-in-azure) instead of Azure Global, use the following step.

- Add the following properties to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       base-uri: https://login.partner.microsoftonline.cn
       graph-base-uri: https://microsoftgraph.chinacloudapi.cn
   ```

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) instead of the Azure public cloud.

**Property example 2:** To use a group name to protect some method in a web application, use the following steps:

1. Add the following property to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       user-group:
         allowed-groups: group1, group2
   ```

1. Add `@EnableGlobalMethodSecurity(prePostEnabled = true)` to your web application, as shown in the following example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginSecurityConfig extends AADWebSecurityConfigurerAdapter {

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

1. Use the `@PreAuthorize` annotation to protect the method, as shown in the following example:

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

**Property example 3:** To enable [incremental consent](/azure/active-directory/azuread-dev/azure-ad-endpoint-comparison#incremental-and-dynamic-consent) in a web application visiting resource servers, use the following steps:

1. Add the following properties to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       authorization-clients:
         graph:
           scopes: https://graph.microsoft.com/Analytics.Read, email
         arm: # client registration id
           on-demand: true  # means incremental consent
           scopes: https://management.core.windows.net/user_impersonation
   ```

1. Add code to your application similar to the following example:

   ```java
   @GetMapping("/arm")
   @ResponseBody
   public String arm(
       @RegisteredOAuth2AuthorizedClient("arm") OAuth2AuthorizedClient armClient
   ) {
       // toJsonString() is just a demo.
       // oAuth2AuthorizedClient contains access_token. We can use this access_token to access resource server.
       return toJsonString(armClient);
   }
   ```

This example uses incremental consent. Therefore, the user won't need to consent to the `arm` scopes at sign-in, but only upon request of the `/arm` endpoint. The Azure AD server will remember that the user has already granted the permission. Therefore, after the user consents to the scopes, incremental consent won't happen anymore.

**Property example 4:** To enable client credential flow in a resource server visiting resource servers, use the following steps:

1. Add the following property to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       authorization-clients:
         webapiC:   # When authorization-grant-type is null, on behalf of flow is used by default
           authorization-grant-type: client_credentials
           scopes:
               - <Web-API-C-app-id-url>/.default
   ```

1. Add code to your application similar to the following example:

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

The starter supports creating `GrantedAuthority` from an ID token's `roles` claim to allow using the ID token for authorization in a web application. You can use the `appRoles` feature of Azure AD to create a `roles` claim and implement access control.

> [!NOTE]
> - The `roles` claim generated from `appRoles` is decorated with prefix `APPROLE_`.
> - When using `appRoles` as a `roles` claim, avoid configuring a group attribute as `roles` at the same time. Otherwise, the group attribute will override the claim to contain group information instead of `appRoles`. You should avoid the following configuration in your manifest:
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

1. Add app roles in your application and assign them to users or groups. For more information, see [How to: Add app roles to your application and receive them in the token](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps).

1. Add the following `appRoles` configuration to your application's manifest:

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

1. Add code to your application similar to the following example:

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

Azure SDKs for Java offers a consistent logging story to help troubleshoot and resolve application errors. The logs produced will capture the flow of an application before reaching the terminal, helping to locate the root issue. View the [logging](https://github.com/Azure/azure-sdk-for-java/wiki/Logging-with-Azure-SDK#use-logback-logging-framework-in-a-spring-boot-application) wiki for guidance on enabling logging.

### Enable Spring logging

Spring enables all the supported logging systems to set logger levels in the Spring environment (for example, in *application.properties*) by using `logging.level.<logger-name>=<level>` where level is one of TRACE, DEBUG, INFO, WARN, ERROR, FATAL, or OFF. You can configure the root logger by using `logging.level.root`.

The following example shows potential logging settings in the *application.properties* file:

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

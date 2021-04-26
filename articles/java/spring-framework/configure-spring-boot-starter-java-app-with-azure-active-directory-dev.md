---
title: Spring Boot Starter for Azure Active Directory developer's guide
description: This guide describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Azure Active Directory starter.
ms.date: 04/14/2021
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java
---

# Azure AD Spring Boot Starter client library for Java

This article describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Azure Active Directory starter.

When you're building a web application, identity and access management will always be foundational pieces. Azure offers a cloud-based identity service that has deep integration with the rest of the Azure ecosystem.

Although Spring Security makes it easier to secure your Spring-based applications, it's not tailored to a specific identity provider.

The `azure-spring-boot-starter-active-directory` (`aad-starter` for short) provides the most optimal way to connect your web application to an Azure Active Directory (Azure AD) tenant and protect your resource server with Azure AD. It uses the Oauth 2.0 protocol to protect web applications and resource servers.

[Package (Maven)](https://mvnrepository.com/artifact/com.azure.spring/azure-spring-boot-starter-active-directory) | [API reference documentation](https://azure.github.io/azure-sdk-for-java/springboot.html#azure-spring-boot) | [Product documentation](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples)

## Prerequisites

- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/) with version 8 or above
- [Azure Subscription](https://azure.microsoft.com/free)
- [Maven](https://maven.apache.org/) 3.0 or above
- [Register an application in the Azure portal](/azure/active-directory/develop/quickstart-register-app)
- [Build developing version artifacts if needed](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/ENVIRONMENT_CHECKLIST.md#use-development-version)

## Key concepts

A *web application* is any web-based application that allows user to login, whereas a *resource server* will either accept or deny access after validating `access_token`. We will cover 4 scenarios in this guide:

1. Accessing a web application.
1. Web application accessing resource servers.
1. Accessing a resource server.
1. Resource server accessing other resource servers.

### Accessing a web application

This scenario uses the [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to login in a user with a Microsoft account.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application.png" alt-text="Standalone web application":::

1. Make sure `redirect URI` has been set to `{application-base-uri}/login/oauth2/code/`, for example *http://localhost:8080/login/oauth2/code/*. Note that you can't omit the trailing `/`.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/   web-application-set-redirect-uri-1.png" alt-text="Web Application set redirect uri 1":::

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application-set-redirect-uri-2.png" alt-text="Web Application set redirect uri 2":::

2. Add the following dependencies in your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.2.0</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-client</artifactId>
   </dependency>
   ```

3. Add properties in application.yml. These values should be got in [prerequisite](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-starter-active-directory#prerequisites).

   ```yaml
   azure:
     activedirectory:
       tenant-id: xxxxxx-your-tenant-id-xxxxxx
       client-id: xxxxxx-your-client-id-xxxxxx
       client-secret: xxxxxx-your-client-secret-xxxxxx
   ```

4. Write your Java code:

   `AADWebSecurityConfigurerAdapter` contains necessary web security configuration for **aad-starter**.

   1. `DefaultAADWebSecurityConfigurerAdapter` is configured automatically if you not provide one.

   2. You can provide one by extending `AADWebSecurityConfigurerAdapter` and call `super.configure(http)` explicitly in the `configure(HttpSecurity http)` function. Here is an example:

   <!-- embedme ../azure-spring-boot/src/samples/java/com/azure/spring/aad/AADOAuth2LoginConfigSample.java#L18-L29 -->

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginConfigSample extends AADWebSecurityConfigurerAdapter {
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests()
               .antMatchers("/login").permitAll()
               .anyRequest().authenticated();
       }
   }
   ```

### Web application accessing resource servers

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application-visiting-resource-servers.png" alt-text="Web application visiting resource servers":::

1. Make sure `redirect URI` has been set, just like [Accessing a web application](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-starter-active-directory#accessing-a-web-application).

2. Add the following dependencies in your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.2.0</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-client</artifactId>
   </dependency>
   ```

3. Add properties in application.yml:

   ```yaml
   azure:
     activedirectory:
       tenant-id: xxxxxx-your-tenant-id-xxxxxx
       client-id: xxxxxx-your-client-id-xxxxxx
       client-secret: xxxxxx-your-client-secret-xxxxxx
       authorization-clients:
         graph:
           scopes: https://graph.microsoft.com/Analytics.Read, email
   ```

   Here, `graph` is the name of `OAuth2AuthorizedClient`, `scopes` means the scopes need to consent when login.

4. Write your Java code:

   ```java
   @GetMapping("/graph")
   @ResponseBody
   public String graph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graphClient) {
       // toJsonString() is just a demo.
       // graphClient contains access_token. We can use this access_token to access resource server.
       return toJsonString(graphClient);
   }
   ```

   Here, `graph` is the client name configured in step 2. OAuth2AuthorizedClient contains access_token. access_token can be used to access resource server.

### Protecting a resource server/API

This scenario not support login. Just protect the server by validating the access_token, and if valid, serves the request.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/resource-server.png" alt-text="Standalone resource server usage":::

To use **aad-starter** in this scenario, we need these steps:

1. Add the following dependencies in your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.2.0</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
   </dependency>
   ```

2. Add properties in application.yml:

   ```yaml
   azure:
     activedirectory:
       client-id: <client-id>
       app-id-uri: <app-id-uri>
   ```

   You can use both `client-id` and `app-id-uri` to verify the access token. You can get the `app-id-uri` value from the Azure portal:

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/get-app-id-uri-1.png" alt-text="Get App Id Uri 1":::

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/get-app-id-uri-2.png" alt-text="Get App Id Uri 2":::

3. Write Java code:

   `AADResourceServerWebSecurityConfigurerAdapter` contains necessary web security configuration for resource server.

   1. `DefaultAADResourceServerWebSecurityConfigurerAdapter` is configured automatically if you not provide one.

   2. You can provide one by extending `AADResourceServerWebSecurityConfigurerAdapter` and call `super.configure(http)` explicitly
in the `configure(HttpSecurity http)` function. Here is an example:

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class CustomWebServerSecurityConfig extends AADResourceServerWebSecurityConfigurerAdapter {
       @Override
       protected void configure(HttpSecurity http) {
          super.configure(http);
          // Do some custom configuration
       }
   }
   ```

### Resource server visiting other resource servers

This scenario support visit other resource servers in resource servers.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/resource-server-visiting-other-resource-servers.png" alt-text="Resource server visiting other resource servers":::

To use **aad-starter** in this scenario, we need these steps:

1. Add the following dependencies in your *pom.xml* file.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-active-directory</artifactId>
       <version>3.2.0</version>
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

2. Add properties in application.yml:

   ```yaml
   azure:
      activedirectory:
         tenant-id: <Tenant-id-registered-by-application>
         client-id: <Web-API-A-client-id>
         client-secret: <Web-API-A-client-secret>
         app-id-uri: <Web-API-A-app-id-url>
         authorization-clients:
            graph:
               scopes:
                  - https://graph.microsoft.com/User.Read
   ```

3. Write Java code:

   Using `@RegisteredOAuth2AuthorizedClient` to access related resource server:

   ```java
   @GetMapping("call-graph")
   public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
       return callMicrosoftGraphMeEndpoint(graph);
   }
   ```

### Configurable properties

This starter provides following properties:

| Properties                                                              | Description                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **azure.activedirectory**.app-id-uri                                    | It used in resource server, used to validate the audience in access_token. access_token is valid only when the audience in access_token equal to client-id or app-id-uri    |
| **azure.activedirectory**.authorization-clients                         | A map configure the resource APIs the application is going to visit. Each item corresponding to one resource API the application is going to visit. In Spring code, each item corresponding to one OAuth2AuthorizedClient object|
| **azure.activedirectory**.authorization-clients.{client-name}.scopes    | API permissions of a resource server that the application is going to acquire.                 |
| **azure.activedirectory**.authorization-clients.{client-name}.on-demand | This is used for incremental consent. The default value is false. If it's true, it's not consent when user login, when application needs the additional permission, incremental consent is performed with one OAuth2 authorization code flow.|
| **azure.activedirectory**.base-uri                                      | Base uri for authorization server, the default value is `https://login.microsoftonline.com/`.  |
| **azure.activedirectory**.client-id                                     | Registered application ID in Azure AD.                                                         |
| **azure.activedirectory**.client-secret                                 | client secret of the registered application.                                                   |
| **azure.activedirectory**.graph-membership-uri                          | It's used to load users' groups. The default value is `https://graph.microsoft.com/v1.0/me/memberOf`, this uri just get direct groups. To get all transitive membership, set it to `https://graph.microsoft.com/v1.0/me/transitiveMemberOf`. The 2 uris are both Azure Global, check `Property example 1` if you want to use Azure China.|
| **azure.activedirectory**.post-logout-redirect-uri                      | Redirect uri for posting log-out.                            |
| **azure.activedirectory**.tenant-id                                     | Azure Tenant ID.                                             |
| **azure.activedirectory**.user-group.allowed-groups                     | Expected user groups that an authority will be granted to if found in the response from the MemeberOf Graph API Call. |

Here are some examples about how to use these properties:

#### Property example 1: Use [Azure China](/azure/china/resources-developer-guide#check-endpoints-in-azure) instead of Azure Global.

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) rather than the Azure public cloud.

- Add property in application.yml

   ```yaml
   azure:
     activedirectory:
       base-uri: https://login.partner.microsoftonline.cn
       graph-base-uri: https://microsoftgraph.chinacloudapi.cn
   ```

#### Property example 2: Use `group name` to protect some method in web application

1. Add property in application.yml

   ```yaml
   azure:
     activedirectory:
       user-group:
         allowed-groups: group1, group2
   ```

2. Add `@EnableGlobalMethodSecurity(prePostEnabled = true)` in web application:

   <!-- embedme ../azure-spring-boot/src/samples/java/com/azure/spring/aad/AADOAuth2LoginConfigSample.java#L18-L29 -->

   ```java
   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   public class AADOAuth2LoginConfigSample extends AADWebSecurityConfigurerAdapter {
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests()
               .antMatchers("/login").permitAll()
               .anyRequest().authenticated();
       }
   }
   ```

3. Then we can protect the method by `@PreAuthorize` annotation:

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
   }
   ```

#### Property example 3: [Incremental consent](/azure/active-directory/azuread-dev/azure-ad-endpoint-comparison#incremental-and-dynamic-consent) in Web application visiting resource servers

1. Add property in application.yml

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

2. Write Java code:

   ```java
   @Controller
   public class OnDemandClientController {
   
       @GetMapping("/arm")
       @ResponseBody
       public String arm(
           @RegisteredOAuth2AuthorizedClient("arm") OAuth2AuthorizedClient oAuth2AuthorizedClient
       ) {
           // toJsonString() is just a demo.
           // oAuth2AuthorizedClient contains access_token. We can use this access_token to access resource server.
           return toJsonString(oAuth2AuthorizedClient);
       }
   }
   ```

After these steps. `arm`'s scopes (https://management.core.windows.net/user_impersonation) doesn't need to be consented at login time. When user request `/arm` endpoint, user needs to consent the scope. That's `incremental consent` means.

After the scopes have been consented, Azure AD server will remember that this user has already granted the permission to the web application. So incremental consent will not happen anymore after user consented.

## Examples

### Web application visiting resource servers

<!-- TODO double-check that this is intentionally NOT the master/main branch. -->

See [OAuth 2.0 Sample for Azure AD Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-webapp).

### Resource server

Please refer to [azure-spring-boot-sample-active-directory-resource-server](https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server/README.md).

### Resource server visiting other resource servers

Please refer to [azure-spring-boot-sample-active-directory-resource-server-obo](https://github.com/ZhuXiaoBing-cn/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server-obo).

## Troubleshooting

### Enable client logging

Azure SDKs for Java offers a consistent logging story to help aid in troubleshooting application errors and expedite their resolution. The logs produced will capture the flow of an application before reaching the terminal state to help locate the root issue. View the [logging](https://github.com/Azure/azure-sdk-for-java/wiki/Logging-with-Azure-SDK#use-logback-logging-framework-in-a-spring-boot-application) wiki for guidance about enabling logging.

### Enable Spring logging

Spring allow all the supported logging systems to set logger levels set in the Spring Environment (for example, in application.properties) by using `logging.level.<logger-name>=<level>` where level is one of TRACE, DEBUG, INFO, WARN, ERROR, FATAL, or OFF. The root logger can be configured by using logging.level.root.

The following example shows potential logging settings in `application.properties`:

```properties
logging.level.root=WARN
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate=ERROR
```

For more information about setting logging in spring, please refer to the [official doc](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-logging).

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

<!-- LINKS -->
[Azure portal]: https://ms.portal.azure.com/#home
[azure-spring-boot-sample-active-directory-resource-server-by-filter]: https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server-by-filter
[Azure AD App Roles feature]: /azure/architecture/multitenant-identity/app-roles#roles-using-azure-ad-app-roles
[client credentials grant flow]: /azure/active-directory/develop/v1-oauth2-client-creds-grant-flow
[configured in your manifest]: /azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#examples
[graph-api-list-member-of]: /graph/api/user-list-memberof?view=graph-rest-1.0
[graph-api-list-transitive-member-of]: /graph/api/user-list-transitivememberof?view=graph-rest-1.0
[instructions here]: https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/CONTRIBUTING.md
[OAuth 2.0 implicit grant flow]: /azure/active-directory/develop/v1-oauth2-implicit-grant-flow
[set up in the manifest of your application registration]: /azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps

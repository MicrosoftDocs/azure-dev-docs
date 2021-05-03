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

# Azure AD Spring Boot Starter client library for Java

This article describes the features of the Spring Boot Starter for Azure Active Directory (Azure AD). The article also includes guidance on common issues, workarounds, and diagnostic steps.

When you're building a web application, identity and access management are foundational pieces. Azure offers a cloud-based identity service that has deep integration with the rest of the Azure ecosystem.

Although Spring Security makes it easy to secure your Spring-based applications, it isn't tailored to a specific identity provider. The Spring Boot Starter for Azure AD (**aad-starter** for short) enables you to connect your web application to an Azure AD tenant and protect your resource server with Azure AD. It uses the Oauth 2.0 protocol to protect web applications and resource servers.

<!-- `azure-spring-boot-starter-active-directory` (`aad-starter` for short) -->

[Package (Maven)](https://mvnrepository.com/artifact/com.azure.spring/azure-spring-boot-starter-active-directory) | [API reference documentation](https://azure.github.io/azure-sdk-for-java/springboot.html#azure-spring-boot) | [Product documentation](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples)

## Prerequisites

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
- A supported Java Development Kit (JDK), version 8 or later. For more information, see [Java long-term support and medium-term support on Azure and Azure Stack](../fundamentals/java-jdk-long-term-support.md).
- [Apache Maven](https://maven.apache.org/), version 3.0 or later.
- An application [registered with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

## Key concepts

A *web application* is any web-based application that enables a user to sign in. A *resource server* will either accept or deny access after validating an access token.

This guide covers the following scenarios:

1. Accessing a web application.
1. Accessing resource servers from a web application.
1. Accessing a resource server.
1. Accessing other resource servers from a resource server.

### Accessing a web application

This scenario uses the [The OAuth 2.0 authorization code grant](/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow to enable a user to sign in with a Microsoft account.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application.png" alt-text="Standalone web application":::

1. Set the `redirect URI` to *{application-base-uri}/login/oauth2/code/*, for example *http://localhost:8080/login/oauth2/code/*. Be sure to include the trailing `/`.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application-set-redirect-uri-1.png" alt-text="Web Application set redirect URI 1":::

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application-set-redirect-uri-2.png" alt-text="Web Application set redirect URI 2":::

2. Add the following dependencies to your *pom.xml* file.

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

3. Add the following properties to your *application.yml* file. You can get the values for these properties from the [prerequisites](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-starter-active-directory#prerequisites).

   ```yaml
   azure:
     activedirectory:
       tenant-id: xxxxxx-your-tenant-id-xxxxxx
       client-id: xxxxxx-your-client-id-xxxxxx
       client-secret: xxxxxx-your-client-secret-xxxxxx
   ```

4. Write your Java code:

   The `AADWebSecurityConfigurerAdapter` class contains the necessary web security configuration for **aad-starter**.

   1. The `DefaultAADWebSecurityConfigurerAdapter` class is configured automatically if you don't provide a configuration.

   2. To provide a configuration, extend the `AADWebSecurityConfigurerAdapter` class and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

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

### Web application accessing resource servers

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/web-application-visiting-resource-servers.png" alt-text="Web application visiting resource servers":::

1. Be sure to set the `redirect URI`, just like [Accessing a web application](https://github.com/Azure/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-starter-active-directory#accessing-a-web-application).

2. Add the following dependencies to your *pom.xml* file.

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

3. Add the following properties to your *application.yml* file:

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

   Here, `graph` is the name of `OAuth2AuthorizedClient`, and `scopes` means the scopes needed for consent when logging in.

4. Write your Java code:

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

   Here, `graph` is the client name configured in step 2. `OAuth2AuthorizedClient` contains the access token, which is used to access the resource server.

### Protecting a resource server/API

This scenario doesn't support sign in, but protects the server by validating the access token. If the access token is valid, the server serves the request.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/resource-server.png" alt-text="Standalone resource server usage":::

To use **aad-starter** in this scenario, use the following steps:

1. Add the following dependencies in your *pom.xml* file.

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

2. Add the following properties to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       client-id: <client-id>
       app-id-uri: <app-id-uri>
   ```

   You can use both `client-id` and `app-id-uri` to verify the access token. You can get the `app-id-uri` value from the Azure portal:

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/get-app-id-uri-1.png" alt-text="Get App ID Uri 1":::

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/get-app-id-uri-2.png" alt-text="Get App ID Uri 2":::

3. Write Java code:

   `AADResourceServerWebSecurityConfigurerAdapter` contains the necessary web security configuration for the resource server.

   1. `DefaultAADResourceServerWebSecurityConfigurerAdapter` is configured automatically if you not provide a configuration.

   2. To provide a configuration, extend `AADResourceServerWebSecurityConfigurerAdapter` and call `super.configure(http)` in the `configure(HttpSecurity http)` function, as shown in the following example:

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

### Resource server visiting other resource servers

This scenario supports a resource server visiting other resource servers.

**System diagram**:

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory-dev/resource-server-visiting-other-resource-servers.png" alt-text="Resource server visiting other resource servers":::

To use **aad-starter** in this scenario, use the following steps:

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

2. Add the following properties to your *application.yml* file:

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

   Use the `@RegisteredOAuth2AuthorizedClient` attribute to access the related resource server:

   ```java
   @PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
   @GetMapping("call-graph")
   public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
       return callMicrosoftGraphMeEndpoint(graph);
   }
   ```

### Configurable properties

The Spring Boot Starter for Azure AD provides the following properties:

| Properties                                                              | Description                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **azure.activedirectory**.app-id-uri                                    | Used by the resource server to validate the audience in `access_token`. `access_token` is valid only when the audience in access_token equal to `client-id` or `app-id-uri`.    |
| **azure.activedirectory**.authorization-clients                         | A map that configures the resource APIs the application is going to visit. Each item corresponds to one resource API the application is going to visit. In your Spring code, each item corresponds to one `OAuth2AuthorizedClient` object.|
| **azure.activedirectory**.authorization-clients.{client-name}.scopes    | The API permissions of a resource server that the application is going to acquire.                 |
| **azure.activedirectory**.authorization-clients.{client-name}.on-demand | Used for incremental consent. The default value is *false*. If it's *true*, it doesn't consent when the user signs in. When the application needs the additional permission, incremental consent is performed with one OAuth2 authorization code flow.|
| **azure.activedirectory**.base-uri                                      | The base URI for the authorization server. The default value is `https://login.microsoftonline.com/`.  |
| **azure.activedirectory**.client-id                                     | The registered application ID in Azure AD.                                                         |
| **azure.activedirectory**.client-secret                                 | The client secret of the registered application.                                                   |
| **azure.activedirectory**.graph-membership-uri                          | Used to load the users' groups. The default value is `https://graph.microsoft.com/v1.0/me/memberOf`, which gets direct groups. To get all transitive membership, set it to `https://graph.microsoft.com/v1.0/me/transitiveMemberOf`. The two URIs are for Azure Global. See `Property example 1` if you want to use Azure China instead.|
| **azure.activedirectory**.post-logout-redirect-uri                      | The redirect URI for posting the sign-out.                            |
| **azure.activedirectory**.tenant-id                                     | The Azure tenant ID.                                             |
| **azure.activedirectory**.user-group.allowed-groups                     | The expected user groups that an authority will be granted to if found in the response from the MemberOf Graph API Call. |
| **azure.activedirectory**.user-name-attribute                           | Indicates which claim will be the principal's name. |

The following examples show you how to use these properties:

**Property example 1:** Use [Azure China 21Vianet](/azure/china/resources-developer-guide#check-endpoints-in-azure) instead of Azure Global.

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) instead of the Azure public cloud.

- Add the following properties to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       base-uri: https://login.partner.microsoftonline.cn
       graph-base-uri: https://microsoftgraph.chinacloudapi.cn
   ```

**Property example 2:** Use `group name` to protect some method in web application.

1. Add the following property to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       user-group:
         allowed-groups: group1, group2
   ```

2. Add `@EnableGlobalMethodSecurity(prePostEnabled = true)` to your web application, as shown in the following example:

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

3. Use the `@PreAuthorize` annotation to protect the method, as shown in the following example:

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

**Property example 3:** [Incremental consent](/azure/active-directory/azuread-dev/azure-ad-endpoint-comparison#incremental-and-dynamic-consent) in a web application visiting resource servers.

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

2. Write Java code:

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

After these steps, `arm`'s scopes (https://management.core.windows.net/user_impersonation) don't need to be consented at sign-in. When the user requests the `/arm` endpoint, the user needs to consent the scope. That's what `incremental consent` means.

After the scopes have been consented, Azure AD server will remember that this user has already granted the permission to the web application. So incremental consent won't happen anymore after the user has consented.

**Property example 4:** Client credential flow in a resource server visiting resource servers.

1. Add the following property to your *application.yml* file:

   ```yaml
   azure:
     activedirectory:
       authorization-clients:
         webapiC:                          # When authorization-grant-type is null, on behalf of flow is used by default
           authorization-grant-type: client_credentials
           scopes:
               - <Web-API-C-app-id-url>/.default
   ```

2. Write Java code:

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

### Advanced features

#### Support access control by ID token in a web application

The starter supports creating `GrantedAuthority` from id_token's `roles` claim to allow using `id_token` for authorization in a web application. You can use the `appRoles` feature of Azure AD to create a `roles` claim and implement access control.

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

1. Add app roles in your application and assign them to users or groups. For more information, see [How to: Add app roles to your application and receive them in the token](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps).

2. Add the following `appRoles` configuration to your application's manifest:

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

3. Write Java code:

   ```java
   @GetMapping("Admin")
   @ResponseBody
   @PreAuthorize("hasAuthority('APPROLE_Admin')")
   public String Admin() {
       return "Admin message";
   }
   ```

#### Support Conditional Access in a web application
  
This starter supports [Conditional Access](/azure/active-directory/conditional-access) policies. By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure. There are many access-control concepts, but [Block Access](/azure/active-directory/conditional-access/howto-conditional-access-policy-block-access) and [Grant Access](/azure/active-directory/conditional-access/concept-conditional-access-grant) are particularly important. In some scenarios, this starter will help you complete Grant Access controls.

In [Resource server visiting other resource server] scenario(For better description, we think that resource server with OBO function as **webapiA** and the other resource servers as **webapiB**), When we configure the webapiB application with Conditional Access(such as [multi-factor authentication]), this stater will help us send the Conditional Access information of the webapiA to the web application and the web application will help us complete the Conditional Access Policy. As shown below:

![aad-conditional-access-flow.png](resource/aad-conditional-access-flow.png)

We can use our sample to create a Conditional Access scenario.

- **webapp**: [azure-spring-boot-sample-active-directory-webapp].
- **webapiA**:  [azure-spring-boot-sample-active-directory-resource-server-obo].
- **webapiB**: [azure-spring-boot-sample-active-directory-resource-server].

1. Follow the guide to create conditional access policy for webapiB.

   ![aad-create-conditional-access](resource/aad-create-conditional-access.png)

   ![aad-conditional-access-add-application](resource/aad-conditional-access-add-application.png) 
  
1. [Require MFA for all users] or specify the user account in your policy.

   ![aad-create-conditional-access](resource/aad-conditional-access-add-user.png)

1. Follow the guide, configure our samples.

   1. **webapiB**: [configure webapiB]
   1. **webapiA**: [configure webapiA]
   1. **webapp**: [configure webapp]

1. Add properties in application.yml.  

   - webapp:

      ```yaml
      azure:
        activedirectory:
          client-id: <Web-API-A-client-id>
          client-secret: <Web-API-A-client-secret>
          tenant-id: <tenant-id-registered-by-application>
          app-id-uri: <Web-API-A-app-id-url>
          authorization-clients:
            webapiA:
              scopes:
                - <Web-API-A-app-id-url>/Obo.WebApiA.ExampleScope
      ```

   - webapiA:

      ```yaml
      azure:
        activedirectory:
          client-id: <Web-API-A-client-id>
          client-secret: <Web-API-A-client-secret>
          tenant-id: <tenant-id-registered-by-application>
          app-id-uri: <Web-API-A-app-id-url>
          authorization-clients:
            webapiB:
              scopes:
                - <Web-API-B-app-id-url>/WebApiB.ExampleScope
      ```

   - webapiB:

      ```yaml
      azure:
        activedirectory:
           client-id: <Web-API-B-client-id>
           app-id-uri: <Web-API-B-app-id-url>
      ```

1. Write your Java code:

   - webapp :

      ```java
      @GetMapping("/webapp/webapiA/webapiB")
      @ResponseBody
      public String callWebApi(@RegisteredOAuth2AuthorizedClient("webapiA") OAuth2AuthorizedClient webapiAClient) {
          return callWebApiAEndpoint(webapiAClient);
      }
      ```

   - webapiA:

      ```java
      @PreAuthorize("hasAuthority('SCOPE_Obo.WebApiA.ExampleScope')")
      @GetMapping("webapiA/webapiB")
      public String callCustom(
          @RegisteredOAuth2AuthorizedClient("webapiB") OAuth2AuthorizedClient webapiBClient) {
          return callWebApiBEndpoint(webapiBClient);
      }
      ```

   - webapiB:

      ```java
      @GetMapping("/webapiB")
      @ResponseBody
      @PreAuthorize("hasAuthority('SCOPE_WebApiB.ExampleScope')")
      public String file() {
          return "Response from WebApiB.";
      }
      ```

## Examples

### Web application visiting resource servers

<!-- TODO double-check that this is intentionally NOT the master/main branch. -->

See [OAuth 2.0 Sample for Azure AD Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-webapp).

### Resource server

See [azure-spring-boot-sample-active-directory-resource-server](https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server/README.md).

### Resource server visiting other resource servers

See [azure-spring-boot-sample-active-directory-resource-server-obo](https://github.com/ZhuXiaoBing-cn/azure-sdk-for-java/tree/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server-obo).

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

For more information about logging configuration in Spring, see [Logging](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-logging) in the Spring documentation.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

<!-- LINKS --    TODO CHECK AND REMOVE  -->
[Azure portal]: https://ms.portal.azure.com/#home
[azure-spring-boot-sample-active-directory-resource-server-by-filter]: https://github.com/Azure/azure-sdk-for-java/blob/azure-spring-boot_3.1.0/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-active-directory-resource-server-by-filter
[Azure AD App Roles feature]: /azure/architecture/multitenant-identity/app-roles#roles-using-azure-ad-app-roles
[configured in your manifest]: /azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#examples
[graph-api-list-member-of]: /graph/api/user-list-memberof?view=graph-rest-1.0
[graph-api-list-transitive-member-of]: /graph/api/user-list-transitivememberof?view=graph-rest-1.0
[set up in the manifest of your application registration]: /azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps

---
title: Use the Spring Boot Starter for Azure Active Directory B2C
description: Learn how to configure a Spring Boot Initializer app with the Azure Active Directory B2C starter.
services: active-directory-b2c
documentationcenter: java
author: panli
manager: kevinzha
ms.author: panli
ms.date: 02/06/2020
ms.service: active-directory-b2c
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
---

# Tutorial: Secure a Java web app using the Spring Boot Starter for Azure Active Directory B2C.

## Overview

This article demonstrates creating a Java app with the [Spring Initializr](https://start.spring.io/) that uses the Spring Boot Starter for Azure Active Directory (Azure AD).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Java application using the Spring Initializr
> * Configure Azure Active Directory B2C
> * Secure the application with Spring Boot classes and annotations
> * Build and test your Java application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

2. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application, and then select the **Web** and **Security** module of the Spring Initializr.

   ![Specify Group and Aritifact names](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/si-n.png)


3. Click `Generate Project`, download the project to a path on your local computer when prompted.

## Create Azure Active Directory instance

### Create the Active Directory instance

1. Log into <https://portal.azure.com>.

2. Click **+Create a resource**, then **Identity**, and then **See all**.  Search for **Azure Active Directory B2C**.

   ![Create new Azure Active Directory B2C instance](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/az-1-n.png)

3. Click **Create**.

   ![Get your B2C tenant name](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/az-5-n.png)

4. Select **Create a new Azure AD B2C Tenant**.

   ![Create new Azure Active Directory](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/az-2-n.png)

5. Enter your Organization name and your Initial domain name, and save the domain name for later reference.  Click **Create**.

   ![Choose your Azure Active Directory](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/az-3-n.png)

6. When the Active Directory creation is complete, navigate to the new directory.  Or search for `b2c` and click `Azure AD B2C` service.

   ![Locate the Azure Active Directory B2C instance](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/az-4-n.ng.png)

### Add an application registration for your Spring Boot app

1. Select **Azure AD B2C** from the portal menu, click **Applications**, and then click **Add**.

   ![Add a new app registration](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/b2c1-n.png)

2. Specify your application **Name**, add `http://localhost:8080/home` for the **Redirect URI**. Click **Save**.  Then record the **Application ID** as your `${your-client-id}`.  

   ![Add Application Redirect URI](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/b2c2-n.png)

3. Select **Certificates & secrets** and click **New Client Secrete** to generate the key.

   ![Create user flow](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/b2c3-n.png)

4. Select **User flows** on your left, and then **Click** **New user flow **.

5. Choose **Sign up or in**, **Profile editing** and **Password reset** to create your user flow. Refer to [this article](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows) for more details on this step.

## Configure and compile your app

1. Extract the files from the project archive you created and downloaded earlier in this tutorial into a directory.

2. Navigate to the parent folder for your project, and open the `pom.xml` Maven project file in a text editor.

3. Add the dependencies for Spring OAuth2 security to the `pom.xml`:

   ```xml
   <dependency>
       <groupId>com.microsoft.azure</groupId>
       <artifactId>azure-active-directory-b2c-spring-boot-starter</artifactId>
       <version>2.2.4</version>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-thymeleaf</artifactId>
   </dependency>
   <dependency>
       <groupId>org.thymeleaf.extras</groupId>
       <artifactId>thymeleaf-extras-springsecurity5</artifactId>
   </dependency>
   ```

4. Save and close the *pom.xml* file.

5. Navigate to the *src/main/resources* folder in your project and open the *application.yml* file in a text editor.

6. Specify the settings for your app registration using the values you created earlier; for example:

   ```yaml
   azure:
     activedirectory:
       b2c:
         tenant: ${your-tenant-name} #this is also the first part of your domain name before onmicrosoft.com.
         client-id: ${your-client-id}
         client-secret: ${your-client-secret}
         reply-url: ${your-redirect-uri-from-aad} # should be the absolute url.
         logout-success-url: ${you-logout-success-url}
         user-flows:
           sign-up-or-sign-in: ${your-sign-up-or-in-user-flow}
           profile-edit: ${your-profile-edit-user-flow}     # optional
           password-reset: ${your-password-reset-user-flow} # optional
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `azure.activedirectory.b2c.tenant` | Contains your AD B2C's `${your-tenant-name` from earlier. |
   | `azure.activedirectory.b2c.client-id` | Contains the `${your-client-id}` from your application that you completed earlier. |
   | `azure.activedirectory.b2c.client-secret` | Contains the `${your-client-secret}` from your application that you completed earlier. |
   | `azure.activedirectory.b2c.reply-url` | Contains one of the **Redirect URI** from your application that you completed earlier. |
   | `azure.activedirectory.b2c.logout-success-url` | Specify the URL when your application logout successfully. |
   | `azure.activedirectory.b2c.user-flows` | Contains the name of the user flows that you completed earlier.

   > [!NOTE]
   > 
   > For a full list of values that are available in your *application.yml* file, see the [Azure Active Directory B2C Spring Boot Sample][AAD B2C Spring Boot Sample] on GitHub.
   >

7. Save and close the *application.yml* file.

8. Create a folder named *controller* in the Java source folder for your application.

9. Create a new Java file named *WebController.java* in the *controller* folder and open it in a text editor.

10. Enter the following code, then save and close the file:

    ```java
    package com.example.demo.controller;
    
    import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
    import org.springframework.security.oauth2.core.user.OAuth2User;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;
    
    @Controller
    public class WebController {
    
        private void initializeModel(Model model, OAuth2AuthenticationToken token) {
            if (token != null) {
                final OAuth2User user = token.getPrincipal();
    
                model.addAttribute("grant_type", user.getAuthorities());
                model.addAllAttributes(user.getAttributes());
            }
        }
    
        @GetMapping(value = "/")
        public String index(Model model, OAuth2AuthenticationToken token) {
            initializeModel(model, token);
    
            return "home";
        }
    
        @GetMapping(value = "/greeting")
        public String greeting(Model model, OAuth2AuthenticationToken token) {
            initializeModel(model, token);
    
            return "greeting";
        }
    
        @GetMapping(value = "/home")
        public String home(Model model, OAuth2AuthenticationToken token) {
            initializeModel(model, token);
    
            return "home";
        }
    }
    ```

11. Create a folder named *security* in the Java source folder for your application.

12. Create a new Java file named *WebSecurityConfiguration.java* in the *security* folder and open it in a text editor.

13. Enter the following code, then save and close the file:

    ```java
    package com.example.demo.security;
    
    import com.microsoft.azure.spring.autoconfigure.b2c.AADB2COidcLoginConfigurer;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
    
    @EnableWebSecurity
    public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    
        private final AADB2COidcLoginConfigurer configurer;
    
        public WebSecurityConfiguration(AADB2COidcLoginConfigurer configurer) {
            this.configurer = configurer;
        }
    
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .authorizeRequests()
                    .anyRequest()
                    .authenticated()
                    .and()
                    .apply(configurer)
            ;
        }
    }
    ```
14. Copy the `greeting.html` and `home.html` from [Azure AD B2C Spring Boot Sample](https://github.com/Microsoft/azure-spring-boot/tree/master/azure-spring-boot-samples/azure-active-directory-b2c-oidc-spring-boot-sample/src/main/resources/templates), and replace the
`${your-profile-edit-user-flow}` and `${your-password-reset-user-flow}` with your user flow name
respectively that completed earlier.

## Build and test your app

1. Open a command prompt and change directory to the folder where your app's *pom.xml* file is located.

2. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

3. After your application is built and started by Maven, open `http://localhost:8080/` in a web browser; 
you should be redirected to login page.

   ![Login page](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/lo1-n.png)

4. Click linke with name of `${your-sign-up-or-in}` user flow, you should be rediected Azure AD B2C to start the authentication process.

   ![Azure AD B2C login](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/lo2-n.png)

4. After you have logged in successfully, you should see the sample `home page` from the browser,

   ![Successful login](media/configure-spring-boot-starter-java-app-with-azure-active-directory-b2c-oidc/lo3-n.png)

## Summary

In this tutorial, you created a new Java web application using the Azure Active Directory B2C starter,
configured a new Azure AD B2C tenant and registered a new application in it, and then configured your
application to use the Spring annotations and classes to protect the web app.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/developer/java/spring-framework)

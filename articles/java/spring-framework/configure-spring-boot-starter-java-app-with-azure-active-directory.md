---
title: How to use the Spring Boot Starter for Azure Active Directory
description: Learn how to configure a Spring Boot Initializer app with the Azure Active Directory starter.
services: active-directory
documentationcenter: java
ms.date: 03/05/2020
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
---

# Tutorial: Secure a Java web app using the Spring Boot Starter for Azure Active Directory

## Overview

This article demonstrates creating a Java app with the **[Spring Initializr]** that uses the Spring Boot Starter for Azure Active Directory (Azure AD).

In this tutorial, you learn how to:

 * Create a Java application using the Spring Initializr
 * Configure Azure Active Directory
 * Secure the application with Spring Boot classes and annotations
 * Build and test your Java application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application.

   ![Specify Group and Artifact names][create-spring-app-01]

1. Scroll down and add **Dependencies** for **Spring Web**, **Azure Active Directory**, and **Spring Security**.

1. At the bottom of the page and click the **Generate** button.

   ![Select Security, Web and Azure Active Directory starters][create-spring-app-02]

1. When prompted, download the project to a path on your local computer.

## Create Azure Active Directory instance

### Create the Active Directory instance

1. Log into <https://portal.azure.com>.

1. Click **+Create a resource**, then **Identity**, and then **Azure Active Directory**.

   ![Create new Azure Active Directory instance][create-directory-01]

1. Enter your **Organization name** and your **Initial domain name**. Copy the full URL of your directory; you will use that to add user accounts later in this tutorial. (For example: `wingtiptoysdirectory.onmicrosoft.com`.) 

    Copy the full URL of your directory; you will use that to add user accounts later in this tutorial. (For example: wingtiptoysdirectory.onmicrosoft.com.).

    When you have finished, click **Create**. It will take a few minutes to create the new resource.

   ![Specify Azure Active Directory names][create-directory-02]

1. When complete, click to access the new directory.

   ![Select your Azure account name][create-directory-03]

1. Copy the **Tenant ID**; you will use that value to configure your *application.properties* file later in this tutorial.

   ![Copy your Tenant ID][create-directory-05]

### Add an application registration for your Spring Boot app

1. From the portal menu, click **App registrations**, and then click **Register an application**.

   ![Add a new app registration][create-app-registration-01]

1. Specify your application, and then click **Register**.

   ![Create new app registration][create-app-registration-02]

1. When the page for your app registration appears, copy your **Application ID** and the **Tenant ID**; you will use these values to configure your *application.properties* file later in this tutorial.

   ![Create app registration keys][create-app-registration-03]

1. Click **Certificates & secrets** in the left navigation pane.  Then click **New client secret**.

   ![Create app registration keys][create-app-registration-03-5]

1. Add a **Description** and select duration in the **Expires** list.  Click **Add**. The value for the key will be automatically filled in.

   ![Specify app registration key parameters][create-app-registration-04]

1. Copy and save the value of the client secret to configure your *application.properties* file later in this tutorial. (You will not be able to retrieve this value later.)

   ![Specify app registration key parameters][create-app-registration-04-5]

1. Click **API permissions** in the left navigation pane. 

1. Click **Microsoft Graph** and tick **Access the directory as the signed-in user** and **Sign in and read user profile**. Click **Grant Permissions...** and **Yes** when prompted.

   ![Grant access permissions][create-app-registration-08]

1. From the main page for your app registration, click **Authentication**, and click **Add a platform**.  Then click **Web applications**.

    ![Edit Reply URLs][create-app-registration-09]

1. Enter <http:<span></span>//localhost:8080/login/oauth2/code/azure> as a new **Redirect URI**, and then click **Configure**.

    ![Add new Reply URL][create-app-registration-10]

1. From the main page for your app registration, click **Manifest**, then set the value of the `oauth2AllowImplicitFlow` parameter to `true`, and then click **Save**.

    ![Configure app manifest][create-app-registration-11]

    > [!NOTE]
    > 
    > For more information about the `oauth2AllowImplicitFlow` parameter and other application settings, see [Azure Active Directory application manifest][AAD app manifest]. 
    >

### Add a user account to your directory, and add that account to a group

1. From the **Overview** page of your Active Directory, click **All Users**, and then click **New user**.

   ![Add a new user account][create-user-01]

1. When the **User** panel is displayed, enter the **User name** and **Name**.  Then click **Create**.

   ![Enter user account information][create-user-02]

   > [!NOTE]
   > 
   > You need to specify your directory URL from earlier in this tutorial when you enter the user name; for example:
   >
   > `wingtipuser@wingtiptoysdirectory.onmicrosoft.com`
   > 

1. Click **Groups**, then **Create a new group** that you will use for authorization in your application.

1. Then click **No members selected**. (For the purposes of this tutorial, we'll create a group named *users*.)  Search for the user created in the previous step.  Click **Select** to add the user to the group.  Then Click **Create** to create the new group.

   ![Select the user for group][create-user-03]

1. Go back to the **Users** panel, select your test user, and click **Reset password**, and copy the password; you will use this when you log into your application later in this tutorial. 

   ![Show the password][create-user-04]

## Configure and compile your app

1. Extract the files from the project archive you created and downloaded earlier in this tutorial into a directory.

1. Navigate to the parent folder for your project, and open the `pom.xml` Maven project file in a text editor.

1. Add the dependencies for Spring OAuth2 security to the `pom.xml`:

   ```xml
   <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-oauth2-client</artifactId>
   </dependency>
   <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-oauth2-jose</artifactId>
   </dependency>
   ```

1. Save and close the *pom.xml* file.

1. Navigate to the *src/main/resources* folder in your project and open the *application.properties* file in a text editor.

1. Specify the settings for your app registration using the values you created earlier; for example:

   ```yaml
   # Specifies your Active Directory ID:
   azure.activedirectory.tenant-id=22222222-2222-2222-2222-222222222222

   # Specifies your App Registration's Application ID:
   spring.security.oauth2.client.registration.azure.client-id=11111111-1111-1111-1111-1111111111111111

   # Specifies your App Registration's secret key:
   spring.security.oauth2.client.registration.azure.client-secret=AbCdEfGhIjKlMnOpQrStUvWxYz==

   # Specifies the list of Active Directory groups to use for authorization:
   azure.activedirectory.active-directory-groups=Users
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `azure.activedirectory.tenant-id` | Contains your Active Directory's **Directory ID** from earlier. |
   | `spring.security.oauth2.client.registration.azure.client-id` | Contains the **Application ID** from your app registration that you completed earlier. |
   | `spring.security.oauth2.client.registration.azure.client-secret` | Contains the **Value** from your app registration key that you completed earlier. |
   | `azure.activedirectory.active-directory-groups` | Contains a list of Active Directory groups to use for authorization. |

   > [!NOTE]
   > 
   > For a full list of values that are available in your *application.properties* file, see  the [Azure Active Directory Spring Boot Sample][AAD Spring Boot Sample] on GitHub.
   >

1. Save and close the *application.properties* file.

1. Create a folder named *controller* in the Java source folder for your application; for example: *src/main/java/com/wingtiptoys/security/controller*.

1. Create a new Java file named *HelloController.java* in the *controller* folder and open it in a text editor.

1. Enter the following code, then save and close the file:

   ```java
   package com.wingtiptoys.security;

   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.security.access.prepost.PreAuthorize;
   import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
   import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
   import org.springframework.ui.Model;

   @RestController
   public class HelloController {
      @Autowired
      @PreAuthorize("hasRole('Users')")
      @RequestMapping("/")
      public String helloWorld() {
         return "Hello World!";
      }
   }
   ```
   > [!NOTE]
   > 
   > The group name that you specify for the `@PreAuthorize("hasRole('')")` method must contain one of the groups that you specified in the `azure.activedirectory.active-directory-groups` field of your *application.properties* file.
   > 
   > You can also specify different authorization settings for different request mappings; for example:
   >
   > ``` java
   > public class HelloController {
   >    @Autowired
   >    @PreAuthorize("hasRole('Users')")
   >    @RequestMapping("/")
   >    public String helloWorld() {
   >       return "Hello Users!";
   >    }
   >    @PreAuthorize("hasRole('Group1')")
   >    @RequestMapping("/Group1")
   >    public String groupOne() {
   >       return "Hello Group 1 Users!";
   >    }
   >    @PreAuthorize("hasRole('Group2')")
   >    @RequestMapping("/Group2")
   >    public String groupTwo() {
   >       return "Hello Group 2 Users!";
   >    }
   > }
   > ```
   >    

1. Create a folder named *security* in the Java source folder for your application; for example: *src/main/java/com/wingtiptoys/security/security*.

1. Create a new Java file named *WebSecurityConfig.java* in the *security* folder and open it in a text editor.

1. Enter the following code, then save and close the file:

    ```java
    package com.wingtiptoys.security;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
    import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
    import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
    import org.springframework.security.oauth2.core.oidc.user.OidcUser;

    @EnableWebSecurity
    @EnableGlobalMethodSecurity(prePostEnabled = true)
    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
        @Autowired
        private OAuth2UserService<OidcUserRequest, OidcUser> oidcUserService;

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                .authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .userInfoEndpoint()
                .oidcUserService(oidcUserService);
        }
    }
    ```

## Build and test your app

1. Open a command prompt and change directory to the folder where your app's *pom.xml* file is located.

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

   ![Build your application][build-application]

1. After your application is built and started by Maven, open http:<span></span>//localhost:8080 in a web browser; you should be prompted for a user name and password.

   ![Logging into your application][application-login]

   > [!NOTE]
   > 
   > You may be prompted to change your password if this is the first login for a new user account.
   > 
   > ![Changing your password][update-password]
   > 

1. After you have logged in successfully, you should see the sample "Hello World" text from the controller.

   ![Successful login][hello-world]

   > [!NOTE]
   > 
   > User accounts which are not authorized will receive an **HTTP 403 Unauthorized** message.
   >

## Summary

In this tutorial, you created a new Java web application using the Azure Active Directory starter, configured a new Azure AD tenant and registered a new application in it, and then configured your application to use the Spring annotations and classes to protect the web app.

## See also
* For information about new UI options see [New Azure portal app registration training guide](/azure/active-directory/develop/app-registrations-training-guide-for-app-registrations-legacy-users)

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/developer/java/spring-framework)

<!-- URL List -->

[Azure Active Directory Documentation]: /azure/active-directory/
[AAD app manifest]: /azure/active-directory/develop/active-directory-application-manifest
[Get started with Azure AD]: /azure/active-directory/get-started-azure-ad
[Azure for Java Developers]: /azure/developer/java/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[AAD Spring Boot Sample]: https://github.com/Microsoft/azure-spring-boot/tree/master/azure-spring-boot-samples/azure-active-directory-spring-boot-backend-sample

<!-- IMG List -->

[create-spring-app-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-spring-app-01.png
[create-spring-app-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-spring-app-02.png
[create-spring-app-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-spring-app-03.png

[create-directory-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-01.png
[create-directory-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-02.png
[create-directory-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-03.png
[create-directory-04]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-04.png
[create-directory-05]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-05.png

[create-app-registration-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-01.png
[create-app-registration-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-02.png
[create-app-registration-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03.png
[create-app-registration-03-5]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03-5.png
[create-app-registration-04]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04.png
[create-app-registration-04-5]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04-5.png
[create-app-registration-05]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-05.png
[create-app-registration-06]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-06.png
[create-app-registration-07]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-07.png
[create-app-registration-08]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-08.png
[create-app-registration-09]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-09.png
[create-app-registration-10]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-10.png
[create-app-registration-11]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-11.png

[create-user-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-01.png
[create-user-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-02.png
[create-user-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-03.png
[create-user-04]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-04.png

[application-login]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/application-login.png
[build-application]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/build-application.png
[hello-world]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/hello-world.png
[update-password]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/update-password.png



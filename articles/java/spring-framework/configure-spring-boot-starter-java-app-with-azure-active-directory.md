---
title: How to use the Spring Boot Starter for Azure Active Directory
description: Learn how to configure a Spring Boot Initializer app with the Azure Active Directory starter.
services: active-directory
documentationcenter: java
ms.date: 02/07/2021
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java
adobe-target: true
---

# Tutorial: Secure a Java web app using the Spring Boot Starter for Azure Active Directory

This article demonstrates creating a Java app with the **[Spring Initializr]** that uses the Spring Boot Starter for Azure Active Directory (Azure AD).

In this tutorial, you learn how to:

* Create a Java application using the Spring Initializr
* Configure Azure Active Directory
* Secure the application with Spring Boot classes and annotations
* Build and test your Java application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following prerequisites are required to complete the steps in this article:

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application.
1. Add **Dependencies** for **Spring Web**, **Azure Active Directory**, and **OAuth2 Client**.
1. At the bottom of the page, select the **GENERATE** button.

   >[!div class="mx-imgBorder"]
   >![Specify Group and Artifact names, select dependencies][create-spring-app-01]

1. When prompted, download the project to a path on your local computer.

## Create Azure Active Directory instance

### Create the Active Directory instance

1. Log into <https://portal.azure.com>.

1. Select **All services**, then **Identity**, and then **Azure Active Directory**.

   >[!div class="mx-imgBorder"]
   >![Create new Azure Active Directory instance_step1][create-directory-00]

   >[!div class="mx-imgBorder"]
   >![Create new Azure Active Directory instance_step2][create-directory-01]

1. Enter your **Organization name** and your **Initial domain name**. Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.)

   Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.).

   When you've finished, select **Create**. It will take a few minutes to create the new resource.

   >[!div class="mx-imgBorder"]
   >![Specify Azure Active Directory names][create-directory-02]

1. When complete, select to access the new directory.

   >[!div class="mx-imgBorder"]
   >![Select your Azure account name][create-directory-03]

1. Copy the **Tenant ID**. You'll use the ID value to configure your *application.properties* file later in this tutorial.

   >[!div class="mx-imgBorder"]
   >![Copy your Tenant ID][create-directory-04]

### Add an application registration for your Spring Boot app

1. From the portal menu, select **App registrations**, and then select **Register an application**.

   >[!div class="mx-imgBorder"]
   >![Add a new app registration][create-app-registration-01]

1. Specify your application, and then select **Register**.

   >[!div class="mx-imgBorder"]
   >![Create new app registration][create-app-registration-02]

1. When the page for your app registration appears, copy your **Application ID** and the **Tenant ID**. You'll use these values to configure your *application.properties* file later in this tutorial.

   >[!div class="mx-imgBorder"]
   >![Copy app registration keys][create-app-registration-03]

1. Select **Certificates & secrets** in the left navigation pane.  Then select **New client secret**.

   >[!div class="mx-imgBorder"]
   >![Create app registration keys][create-app-registration-03-5]

1. Add a **Description** and select duration in the **Expires** list. Select **Add**. The value for the key will be automatically filled in.

   >[!div class="mx-imgBorder"]
   >![Specify app registration key parameters][create-app-registration-04]

1. Copy and save the value of the client secret to configure your *application.properties* file later in this tutorial. (You won't be able to retrieve this value later.)

   >[!div class="mx-imgBorder"]
   >![Copy app registration key value][create-app-registration-04-5]

1. Select **API permissions** in the left navigation pane.

1. Select **Microsoft Graph** and tick **Access the directory as the signed-in user** and **Sign in and read user profile**. Select **Grant Permissions...** and **Yes** when prompted.

   >[!div class="mx-imgBorder"]
   >![Add access permissions][create-app-registration-08]

1. Select **Grant admin consent for Azure Sample** and select **Yes**.

   >[!div class="mx-imgBorder"]
   >![Grant access permissions][create-app-registration-05]

1. From the main page for your app registration, select **Authentication**, and select **Add a platform**.  Then select **Web applications**.

   >[!div class="mx-imgBorder"]
   >![Edit Reply URLs][create-app-registration-09]

1. Enter *http://localhost:8080/login/oauth2/code/* as a new **Redirect URI**, and then select **Configure**.

   >[!div class="mx-imgBorder"]
   >![Add new Reply URL][create-app-registration-10]

1. If you've modified the *pom.xml* file to use an AAD starter version earlier than 3.0.0: under **Implicit grant and hybrid flows**, select **ID tokens (used for implicit and hybrid flows)**, then select **Save**.

   >[!div class="mx-imgBorder"]
   >![Enable Id Tokens][create-app-registration-11]

### Add a user account to your directory, and add that account to a group

1. From the **Overview** page of your Active Directory, select **Users**, and then select **New user**.

   >[!div class="mx-imgBorder"]
   >![Add a new user account][create-user-01]

1. When the **User** panel is displayed, enter the **User name** and **Name**.  Then select **Create**.

   >[!div class="mx-imgBorder"]
   >![Enter user account information][create-user-02]

   > [!NOTE]
   > You need to specify your directory URL from earlier in this tutorial when you enter the user name. For example:
   >
   > `test-user@azuresampledirectory.onmicrosoft.com`

1. From the **Overview** page of your Active Directory, select **Groups**, then **New group**, which you'll use for authorization in your application.

1. Select **No members selected**. (For the purposes of this tutorial, we'll create a group named *group1*.)  Search for the user created in the previous step.  Choose **Select** to add the user to the group.  Then select **Create** to create the new group.

   >[!div class="mx-imgBorder"]
   >![Select the user for group][create-user-03]

1. Go back to the **Users** panel, select your test user, and select **Reset password**, and copy the password. You'll use the password when you log into your application later in this tutorial.

   >[!div class="mx-imgBorder"]
   >![Show the password][create-user-04]

## Configure and compile your app

1. Extract the files from the project archive you created and downloaded earlier in this tutorial into a directory.

1. Navigate to the *src/main/resources* folder in your project, then open the *application.properties* file in a text editor.

1. Specify the settings for your app registration using the values you created earlier. For example:

   ```properties
   # Specifies your Active Directory ID:
   azure.activedirectory.tenant-id=22222222-2222-2222-2222-222222222222
   # Specifies your App Registration's Application ID:
   azure.activedirectory.client-id=11111111-1111-1111-1111-1111111111111111
   # Specifies your App Registration's secret key:
   azure.activedirectory.client-secret=AbCdEfGhIjKlMnOpQrStUvWxYz==
   # Specifies the list of Active Directory groups to use for authorization:
   azure.activedirectory.user-group.allowed-groups=group1
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `azure.activedirectory.tenant-id` | Contains your Active Directory's **Directory ID** from earlier. |
   | `azure.activedirectory.client-id` | Contains the **Application ID** from your app registration that you completed earlier. |
   | `azure.activedirectory.client-secret` | Contains the **Value** from your app registration key that you completed earlier. |
   | `azure.activedirectory.user-group.allowed-groups` | Contains a list of Active Directory groups to use for authorization. |

   > [!NOTE]
   > For a full list of values that are available in your *application.properties* file, see the [Azure Active Directory Spring Boot Sample][AAD Spring Boot Sample] on GitHub.

1. Save and close the *application.properties* file.

1. Create a folder named *controller* in the Java source folder for your application. For example: *src/main/java/com/wingtiptoys/security/controller*.

1. Create a new Java file named *HelloController.java* in the *controller* folder and open it in a text editor.

1. Enter the following code, then save and close the file:

   ```java
   package com.wingtiptoys.security;

   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.security.access.prepost.PreAuthorize;

   @RestController
   public class HelloController {

       @GetMapping("group1")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_group1')")
       public String group1() {
           return "Hello Group 1 Users!";
       }

       @GetMapping("group2")
       @ResponseBody
       @PreAuthorize("hasRole('ROLE_group2')")
       public String group2() {
           return "Hello Group 2 Users!";
       }
   }
   ```

   > [!NOTE]
   > The group name that you specify for the `@PreAuthorize("hasRole('')")` method must contain one of the groups that you specified in the `azure.activedirectory.user-group.allowed-groups` field of your *application.properties* file.
   >
   > You can also specify different authorization settings for different request mappings. For example:
   >
   > ``` java
   > public class HelloController {
   >
   >     @PreAuthorize("hasRole('ROLE_Users')")
   >     @RequestMapping("/")
   >     public String helloWorld() {
   >         return "Hello Users!";
   >     }
   >     @PreAuthorize("hasRole('ROLE_group1')")
   >     @RequestMapping("/Group1")
   >     public String groupOne() {
   >         return "Hello Group 1 Users!";
   >     }
   >     @PreAuthorize("hasRole('ROLE_group2')")
   >     @RequestMapping("/Group2")
   >     public String groupTwo() {
   >         return "Hello Group 2 Users!";
   >     }
   > }
   > ```

1. Open your application class in a text editor.

1. Add `@EnableWebSecurity` and `@EnableGlobalMethodSecurity(prePostEnabled = true)` in your application class as shown in the following example, then save and close the file:

   ```java
   package com.wingtiptoys;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
   import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

   @EnableWebSecurity
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   @SpringBootApplication
   public class SpringBootSampleActiveDirectoryApplication {
       public static void main(String[] args) {
           SpringApplication.run(SpringBootSampleActiveDirectoryApplication.class, args);
       }
   }
   ```

## Build and test your app

1. Open a command prompt and change directory to the folder where your app's *pom.xml* file is located.

1. Build your Spring Boot application with Maven and run it. For example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

   >[!div class="mx-imgBorder"]
   >![Build your application][build-application]

1. After your application is built and started by Maven, open `http://localhost:8080/group1` in a web browser. You should be prompted for a user name and password.

   >[!div class="mx-imgBorder"]
   ![Logging into your application][application-login]

   > [!NOTE]
   > You may be prompted to change your password if this is the first login for a new user account.

   >[!div class="mx-imgBorder"]
   >![Changing your password][update-password]

1. After you've logged in successfully, you should see the sample "Hello Group 1 Users!" text from the controller.

   >[!div class="mx-imgBorder"]
   >![Authorized_group1][hello-group1]

   > [!NOTE]
   > User accounts which are not authorized will receive an **HTTP 403 Unauthorized** message.

   >[!div class="mx-imgBorder"]
   >![UnAuthorized_group2][Unauthorized-group2]

## Summary

In this tutorial, you created a new Java web application using the Azure Active Directory starter, configured a new Azure AD tenant, registered a new application in the tenant, and then configured your application to use the Spring annotations and classes to protect the web app.

## See also

* For information about new UI options, see [New Azure portal app registration training guide](/azure/active-directory/develop/app-registrations-training-guide-for-app-registrations-legacy-users)

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

   >[!div class="nextstepaction"]
   >[Spring on Azure](./index.yml)

<!-- URL List -->

[Azure Active Directory Documentation]: /azure/active-directory/
[AAD app manifest]: /azure/active-directory/develop/active-directory-application-manifest
[Get started with Azure AD]: /azure/active-directory/get-started-azure-ad
[Azure for Java Developers]: ../index.yml
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[AAD Spring Boot Sample]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/

<!-- IMG List -->

[create-spring-app-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-spring-app-01.png

[create-directory-00]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-00.png
[create-directory-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-01.png
[create-directory-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-02.png
[create-directory-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-03.png
[create-directory-04]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-04.png

[create-app-registration-01]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-01.png
[create-app-registration-02]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-02.png
[create-app-registration-03]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03.png
[create-app-registration-03-5]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03-5.png
[create-app-registration-04]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04.png
[create-app-registration-04-5]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04-5.png
[create-app-registration-05]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-05.png
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
[hello-group1]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/hello-group1.png
[update-password]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/update-password.png
[Unauthorized-group2]: media/configure-spring-boot-starter-java-app-with-azure-active-directory/unauthorized-group2.png

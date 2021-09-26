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

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application.
1. Add **Dependencies** for **Spring Web**, **Azure Active Directory**, and **OAuth2 Client**.
1. At the bottom of the page, select the **GENERATE** button.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-spring-app-01.png" alt-text="Specify Group and Artifact names, select dependencies":::

1. When prompted, download the project to a path on your local computer.

> [!NOTE]
> We've released Spring Boot Starter for Azure Active Directory [3.6.1](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/azure-spring-boot-starter-active-directory/CHANGELOG.md) to address the following CVE report [CVE-2021-22119: Denial-of-Service attack with spring-security-oauth2-client](https://tanzu.vmware.com/security/cve-2021-22119). If you're using the older version, please upgrade it to 3.6.1 or above. 

## Create Azure Active Directory instance

### Create the Active Directory instance

If you are the administrator of an existing instance, you can skip this process.

1. Log into <https://portal.azure.com>.

1. Select **All services**, then **Identity**, and then **Azure Active Directory**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-00.png" alt-text="Create new Azure Active Directory instance_step1":::

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-01.png" alt-text="Create new Azure Active Directory instance_step2":::

1. Enter your **Organization name** and your **Initial domain name**. Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.)

   Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.).

   When you've finished, select **Create**. It will take a few minutes to create the new resource.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-02.png" alt-text="Specify Azure Active Directory names":::

1. When complete, select to access the new directory.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-03.png" alt-text="Select your Azure account name":::

1. Copy the **Tenant ID**. You'll use the ID value to configure your *application.properties* file later in this tutorial.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-directory-04.png" alt-text="Copy your Tenant ID":::

### Add an application registration for your Spring Boot app

1. From the portal menu, select **App registrations**, and then select **Register an application**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-01.png" alt-text="Add a new app registration":::

1. Specify your application, and then select **Register**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-02.png" alt-text="Create new app registration":::

1. When the page for your app registration appears, copy your **Application ID** and the **Tenant ID**. You'll use these values to configure your *application.properties* file later in this tutorial.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03.png" alt-text="Copy app registration keys":::

1. Select **Certificates & secrets** in the left navigation pane.  Then select **New client secret**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-03-5.png" alt-text="Create app registration keys":::

1. Add a **Description** and select duration in the **Expires** list. Select **Add**. The value for the key will be automatically filled in.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04.png" alt-text="Specify app registration key parameters":::

1. Copy and save the value of the client secret to configure your *application.properties* file later in this tutorial. (You won't be able to retrieve this value later.)

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-04-5.png" alt-text="Copy app registration key value":::

1. From the main page for your app registration, select **Authentication**, and select **Add a platform**.  Then select **Web applications**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-09.png" alt-text="Edit Reply URLse":::

1. Enter *http://localhost:8080/login/oauth2/code/* as a new **Redirect URI**, and then select **Configure**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-10.png" alt-text="Add new Reply URL":::

1. If you've modified the *pom.xml* file to use an AAD starter version earlier than 3.0.0: under **Implicit grant and hybrid flows**, select **ID tokens (used for implicit and hybrid flows)**, then select **Save**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-registration-11.png" alt-text="Enable Id Tokens":::

### Add a user account to your directory, and add that account to an appRole

1. From the **Overview** page of your Active Directory, select **Users**, and then select **New user**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-01.png" alt-text="Add a new user account":::

1. When the **User** panel is displayed, enter the **User name** and **Name**.  Then select **Create**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-02.png" alt-text="Enter user account information":::

   > [!NOTE]
   > You need to specify your directory URL from earlier in this tutorial when you enter the user name. For example:
   >
   > `test-user@azuresampledirectory.onmicrosoft.com`

1. From the main page for your app registration, select **App roles**, then select **Create app role**. Provide values for the form fields, select **Do you want to enable this app role?**, then select **Apply**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-01.png" alt-text="Enter app role information":::

1. From the **Overview** page of your Azure AD directory, select **Enterprise applications**

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-02.png" alt-text="Select Enterprise application":::

1. Select **All applications** , then select the application you added the app role to in a previous step.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-03.png" alt-text="Choose the application to assign app role":::

1. Select **Users and groups**, then select **Add user/group**.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-04.png" alt-text="Assign app role to user":::

1. Under **Users**, select **None Selected**. Select the user you created earlier, select **Select**, then select **Assign**. If you created more than one app role earlier, select a role.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-05.png" alt-text="Choose user account":::

1. Go back to the **Users** panel, select your test user, and select **Reset password**, and copy the password. You'll use the password when you log into your application later in this tutorial.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-04.png" alt-text="Show the password":::

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
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `azure.activedirectory.tenant-id` | Contains your Active Directory's **Directory ID** from earlier. |
   | `azure.activedirectory.client-id` | Contains the **Application ID** from your app registration that you completed earlier. |
   | `azure.activedirectory.client-secret` | Contains the **Value** from your app registration key that you completed earlier. |
   
   > [!NOTE]
   > For a full list of values that are available in your *application.properties* file, see the [Configurable properties](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/azure-spring-boot-starter-active-directory/README.md#configurable-properties) section of the [Azure AD Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-boot-starter-active-directory) on GitHub.

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
        @GetMapping("Admin")
        @ResponseBody
        @PreAuthorize("hasAuthority('APPROLE_Admin')")
        public String Admin() {
            return "Admin message";
        }
   }
   ```

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

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/build-application.png" alt-text="Build your application":::

1. After your application is built and started by Maven, open `http://localhost:8080/Admin` in a web browser. You should be prompted for a user name and password.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/application-login.png" alt-text="Logging into your application":::

   > [!NOTE]
   > You may be prompted to change your password if this is the first login for a new user account.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/update-passwor.png" alt-text="Changing your password":::

1. After you've logged in successfully, you should see the sample "Admin message" text from the controller.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/hello-admin.png" alt-text="Authorized admin":::

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
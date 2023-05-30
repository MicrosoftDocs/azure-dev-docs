---
title: Add sign-in with Azure Active Directory account to a Spring web app
description: Shows you how to develop a Spring web app which supports sign-in by Azure Active Directory account.
services: active-directory
documentationcenter: java
ms.date: 01/17/2023
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
adobe-target: true
---

# Add sign-in with Azure Active Directory account to a Spring web app

This article shows you how to develop a Spring web app which supports sign-in by [Azure Active Directory (Azure AD) account](/azure/active-directory/fundamentals/active-directory-whatis#terminology). After finishing all steps in this article, the web app will redirect to the Azure AD sign-in page when it's been accessed anonymously. The following screenshot shows the Azure AD sign-in page:

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/application-login.png" alt-text="Screenshot of application 'Sign in' dialog.":::

## Prerequisites

The following prerequisites are required to complete the steps in this article:

* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* [Apache Maven](http://maven.apache.org/), version 3.0 or higher.
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Artifact** names for your application.
1. Add **Dependencies** for **Spring Web**, **Azure Active Directory**, and **OAuth2 Client**.
1. At the bottom of the page, select the **GENERATE** button.

   :::image type="content" source="media/spring-initializer/2.7.1/mvn-java8-aad-oauth2-web.png" alt-text="Screenshot of Spring Initializr with basic options.":::

1. When prompted, download the project to a path on your local computer.

## Create Azure Active Directory instance

### Create the Active Directory instance

If you're the administrator of an existing instance, you can skip this process.

1. Log into <https://portal.azure.com>.

1. Select **All services**, then **Identity**, and then **Azure Active Directory**.

1. Enter your **Organization name** and your **Initial domain name**. Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.)

   Copy the full URL of your directory. You'll use the URL to add user accounts later in this tutorial. (For example: `azuresampledirectory.onmicrosoft.com`.).

   When you've finished, select **Create**. It will take a few minutes to create the new resource.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/specify-azure-active-directory-name.png" alt-text="Screenshot of the Configuration section of the Azure Active Directory 'Create a tenant' screen." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/specify-azure-active-directory-name.png":::

1. When complete, select the displayed link to access the new directory.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/select-your-azure-account-name.png" alt-text="Screenshot of 'Create a tenant' success message.":::

1. Copy the **Tenant ID**. You'll use the ID value to configure your *application.properties* file later in this tutorial.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/your-tenant-id.png" alt-text="Screenshot of Azure Active Directory tenant screen with 'Tenant ID' highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/your-tenant-id.png":::

### Add an application registration for your Spring Boot app

1. From the portal menu, select **App registrations**, and then select **Register an application**.

1. Specify your application, and then select **Register**.

1. When the page for your app registration appears, copy your **Application (client) ID** and the **Directory (tenant) ID**. You'll use these values to configure your *application.properties* file later in this tutorial.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/your-application-id-and-tenant-id.png" alt-text="Screenshot of application with 'Application (client) ID' and 'Directory (tenant) ID' highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/your-application-id-and-tenant-id.png":::

1. Select **Certificates & secrets** in the left navigation pane.  Then select **New client secret**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-client-secret.png" alt-text="Screenshot of application 'Certificates & secrets' screen with 'New client secret' highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-client-secret.png":::

1. Add a **Description** and select duration in the **Expires** list. Select **Add**. The value for the key will be automatically filled in.

1. Copy and save the value of the client secret to configure your *application.properties* file later in this tutorial. (You won't be able to retrieve this value later.)

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/copy-client-secret.png" alt-text="Screenshot of application with new client secret highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/copy-client-secret.png":::

1. From the main page for your app registration, select **Authentication**, and select **Add a platform**.  Then select **Web applications**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/add-web-platforms.png" alt-text="Screenshot of application Authentication screen with 'Configure platforms' section showing and Web platform highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/add-web-platforms.png":::

1. Enter *http://localhost:8080/login/oauth2/code/* as a new **Redirect URI**, and then select **Configure**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/specify-redirect-uri.png" alt-text="Screenshot of application Authentication screen with 'Configure Web' section showing and 'Redirect URIs' highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/specify-redirect-uri.png":::

1. If you've modified the *pom.xml* file to use an Azure AD starter version earlier than 3.0.0: under **Implicit grant and hybrid flows**, select **ID tokens (used for implicit and hybrid flows)**, then select **Save**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/enable-id-tokens.png" alt-text="Screenshot of application Authentication screen with 'ID tokens' selected." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/enable-id-tokens.png":::

### Add a user account to your directory, and add that account to an appRole

1. From the **Overview** page of your Active Directory, select **Users**, and then select **New user**.

1. When the **User** panel is displayed, enter the **User name** and **Name**.  Then select **Create**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-user-with-name.png" alt-text="Screenshot of 'New user' dialog.":::

   > [!NOTE]
   > You need to specify your directory URL from earlier in this tutorial when you enter the user name. For example:
   >
   > `test-user@azuresampledirectory.onmicrosoft.com`

1. From the main page for your app registration, select **App roles**, then select **Create app role**. Provide values for the form fields, select **Do you want to enable this app role?**, then select **Apply**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-for-application.png" alt-text="Screenshot of application 'App roles' screen with 'Create app role' pane showing." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/create-app-role-for-application.png":::

1. From the **Overview** page of your Azure AD directory, select **Enterprise applications**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/select-enterprise-application.png" alt-text="Screenshot of Azure Active Directory 'Enterprise applications' screen." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/select-enterprise-application.png":::

1. Select **All applications**, then select the application you added the app role to in a previous step.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/select-application-to-add-role.png" alt-text="Screenshot of 'Enterprise applications' screen with 'All applications' list showing." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/select-application-to-add-role.png":::

1. Select **Users and groups**, then select **Add user/group**.

1. Under **Users**, select **None Selected**. Select the user you created earlier, select **Select**, then select **Assign**. If you created more than one app role earlier, select a role.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/assign-user-to-app-role.png" alt-text="Screenshot of application 'Add Assignment' screen with Users pane showing." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/assign-user-to-app-role.png":::

1. Go back to the **Users** panel, select your test user, and select **Reset password**, and copy the password. You'll use the password when you log into your application later in this tutorial.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/reset-user-password.png" alt-text="Screenshot of user with 'Temporary password' field highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-azure-active-directory/reset-user-password.png":::

## Configure and compile your app

1. Extract the files from the project archive you created and downloaded earlier in this tutorial into a directory.

1. Navigate to the *src/main/resources* folder in your project, then open the *application.properties* file in a text editor.

1. Specify the settings for your app registration using the values you created earlier. For example:

   ```properties
   # Enable related features.
   spring.cloud.azure.active-directory.enabled=true
   # Specifies your Active Directory ID:
   spring.cloud.azure.active-directory.profile.tenant-id=22222222-2222-2222-2222-222222222222
   # Specifies your App Registration's Application ID:
   spring.cloud.azure.active-directory.credential.client-id=11111111-1111-1111-1111-1111111111111111
   # Specifies your App Registration's secret key:
   spring.cloud.azure.active-directory.credential.client-secret=AbCdEfGhIjKlMnOpQrStUvWxYz==
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `spring.cloud.azure.active-directory.enabled` | Enable the features provided by spring-cloud-azure-starter-active-directory |
   | `spring.cloud.azure.active-directory.profile.tenant-id` | Contains your Active Directory's **Directory ID** from earlier. |
   | `spring.cloud.azure.active-directory.credential.client-id` | Contains the **Application ID** from your app registration that you completed earlier. |
   | `spring.cloud.azure.active-directory.credential.client-secret` | Contains the **Value** from your app registration key that you completed earlier. |
   

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


## Build and test your app

1. Open a command prompt and change directory to the folder where your app's *pom.xml* file is located.

1. Build your Spring Boot application with Maven and run it. For example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/build-application.png" alt-text="Screenshot of Maven build output.":::

1. After your application is built and started by Maven, open `http://localhost:8080/Admin` in a web browser. You should be prompted for a user name and password.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/application-login.png" alt-text="Screenshot of application 'Sign in' dialog.":::

   > [!NOTE]
   > You may be prompted to change your password if this is the first login for a new user account.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/update-password.png" alt-text="Screenshot of application 'Update your password' dialog.":::

1. After you've logged in successfully, you should see the sample "Admin message" text from the controller.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-active-directory/hello-admin.png" alt-text="Screenshot of application admin message.":::

## Summary

In this tutorial, you created a new Java web application using the Azure Active Directory starter, configured a new Azure AD tenant, registered a new application in the tenant, and then configured your application to use the Spring annotations and classes to protect the web app.

## See also

* For information about new UI options, see [New Azure portal app registration training guide](/azure/active-directory/develop/app-registrations-training-guide-for-app-registrations-legacy-users)

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

   >[!div class="nextstepaction"]
   >[Spring on Azure](./index.yml)

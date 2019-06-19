---
title: How to use the Spring Boot Starter for Azure Storage
description: Learn how to configure a Spring Boot Initializer app with the Azure Storage starter.
services: storage
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: storage
ms.tgt_pltfrm: na
ms.topic: article
ms.workload: storage
---

# How to use the Spring Boot Starter for Azure Storage

## Overview

This article walks you through creating a custom application using the **Spring Initializr**, then adding the Azure storage starter to your application, and then using your application to upload a blob to your Azure storage account.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
* The [Azure Command-Line Interface (CLI)](http://docs.microsoft.com/cli/azure/overview).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* Apache's [Maven](http://maven.apache.org/), version 3.0 or later.

> [!IMPORTANT]
>
> Spring Boot version 2.0 or greater is required to complete the steps in this article.
>

## Create an Azure Storage Account and blob container for your application

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Click **+Create a resource**, then **Storage**, and then click **Storage Account**.

   ![Create Azure Storage Account][IMG01]

1. On the **Create Namespace** page, enter the following information:

   * Enter a unique **Name**, which will become part of the URI for your storage account. For example: if you entered **wingtiptoysstorage** for the **Name**, the URI would be *wingtiptoysstorage.core.windows.net*.
   * Choose **Blob storage** for the **Account kind**.
   * Specify the **Location** for your storage account.
   * Choose the **Subscription** you want to use for your storage account.
   * Specify whether to create a new **Resource group** for your storage account, or choose an existing resource group.

   ![Specify Azure Storage Account options][IMG02]

1. When you have specified the options listed above, click **Create** to create your storage account.

1. When the Azure portal has created your storage account, click **Blobs**, then click **+Container**.

   ![Create blob container][IMG03]

1. Enter a **Name** for your blob container, and then click **OK**.

   ![Specify blob container options][IMG04]

1. The Azure portal will list your blob container after is has been created.

   ![Reviewing the list of blob containers][IMG05]

## Create a simple Spring Boot application with the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify a **Spring Boot** version that is equal to or greater than 2.0.
   * Specify the **Group** and **Artifact** names for your application.
   * Add the **Web** dependency.

      ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   >
   > The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.wingtiptoys.storage*.
   >

1. When you have specified the options listed above, click **Generate Project**.

1. When prompted, download the project to a path on your local computer.

   ![Download Spring project][SI02]

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready for editing.

## Configure your Spring Boot app to use the Azure Storage starter

1. Locate the *pom.xml* file in the root directory of your app; for example:

   `C:\SpringBoot\storage\pom.xml`

   -or-

   `/users/example/home/storage/pom.xml`

1. Open the *pom.xml* file in a text editor, and add the Spring Cloud Azure Storage starter to the list of `<dependencies>`:

   ```xml
   <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>spring-azure-starter-storage</artifactId>
      <version>1.0.0.M2</version>
   </dependency>
   ```

   ![Edit pom.xml file][SI03]

1. Save and close the *pom.xml* file.

## Create an Azure Credential File

1. Open a command prompt.

1. Navigate to the *resources* directory of your Spring Boot app; for example:

   ```shell
   cd C:\SpringBoot\storage\src\main\resources
   ```

   -or-

   ```shell
   cd /users/example/home/storage/src/main/resources
   ```

1. Sign in to your Azure account:

   ```azurecli
   az login
   ```

1. List your subscriptions:

   ```azurecli
   az account list
   ```
   Azure will return a list of your subscriptions, and you will need to copy the GUID for the subscription that you want to use; for example:

   ```json
   [
     {
       "cloudName": "AzureCloud",
       "id": "11111111-1111-1111-1111-111111111111",
       "isDefault": true,
       "name": "Converted Windows Azure MSDN - Visual Studio Ultimate",
       "state": "Enabled",
       "tenantId": "22222222-2222-2222-2222-222222222222",
       "user": {
         "name": "gena.soto@wingtiptoys.com",
         "type": "user"
       }
     }
   ]
   ```

1. Specify the GUID for the subscription you want to use with Azure; for example:

   ```azurecli
   az account set -s 11111111-1111-1111-1111-111111111111
   ```

1. Create your Azure Credential file:

   ```azurecli
   az ad sp create-for-rbac --sdk-auth > my.azureauth
   ```

   This command will create a *my.azureauth* file in your *resources* directory with contents that resemble the following example:

   ```json
   {
     "clientId": "33333333-3333-3333-3333-333333333333",
     "clientSecret": "44444444-4444-4444-4444-444444444444",
     "subscriptionId": "11111111-1111-1111-1111-111111111111",
     "tenantId": "22222222-2222-2222-2222-222222222222",
     "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
     "resourceManagerEndpointUrl": "https://management.azure.com/",
     "activeDirectoryGraphResourceId": "https://graph.windows.net/",
     "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
     "galleryEndpointUrl": "https://gallery.azure.com/",
     "managementEndpointUrl": "https://management.core.windows.net/"
   }
   ```

## Configure your Spring Boot app to use your Azure Storage account

1. Locate the *application.properties* in the *resources* directory of your app; for example:

   `C:\SpringBoot\storage\src\main\resources\application.properties`

   -or-

   `/users/example/home/storage/src/main/resources/application.properties`

2. Open the *application.properties* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your storage account:

   ```yaml
   spring.cloud.azure.credential-file-path=my.azureauth
   spring.cloud.azure.resource-group=wingtiptoysresources
   spring.cloud.azure.region=West US
   spring.cloud.azure.storage.account=wingtiptoysstorage
   ```
   Where:

   |                   Field                   |                                            Description                                            |
   |-------------------------------------------|---------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.credential-file-path` |            Specifies Azure credential file that you created earlier in this tutorial.             |
   |    `spring.cloud.azure.resource-group`    |           Specifies the Azure Resource Group that contains your Azure Storage account.            |
   |        `spring.cloud.azure.region`        | Specifies the geographical region that you specified when you created your Azure Storage account. |
   |   `spring.cloud.azure.storage.account`    |            Specifies Azure Storage account that you created earlier in this tutorial.             |


3. Save and close the *application.properties* file.

## Add sample code to implement basic Azure storage functionality

In this section, you create the necessary Java classes for storing a blob in your Azure storage account.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

   `C:\SpringBoot\storage\src\main\java\com\wingtiptoys\storage\StorageApplication.java`

   -or-

   `/users/example/home/storage/src/main/java/com/wingtiptoys/storage/StorageApplication.java`

1. Open the main application Java file in a text editor, and add the following lines to the file:

   ```java
   package com.wingtiptoys.storage;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class StorageApplication {
      public static void main(String[] args) {
         SpringApplication.run(StorageApplication.class, args);
      }
   }
   ```

1. Save and close the main application Java file.

### Add a web controller class

1. Create a new Java file named *WebController.java* in the package directory of your app; for example:

   `C:\SpringBoot\storage\src\main\java\com\wingtiptoys\storage\WebController.java`

   -or-

   `/users/example/home/storage/src/main/java/com/wingtiptoys/storage/WebController.java`

1. Open the web controller Java file in a text editor, and add the following lines to the file:

   ```java
   package com.wingtiptoys.storage;

   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.core.io.Resource;
   import org.springframework.core.io.WritableResource;
   import org.springframework.util.StreamUtils;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.PostMapping;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RestController;

   import java.io.IOException;
   import java.io.OutputStream;
   import java.nio.charset.Charset;

   @RestController
   public class WebController {

      @Value("blob://test/myfile.txt")
      private Resource blobFile;

      @GetMapping(value = "/")
      public String readBlobFile() throws IOException {
         return StreamUtils.copyToString(
            this.blobFile.getInputStream(),
            Charset.defaultCharset()) + "\n";
      }

      @PostMapping(value = "/")
      public String writeBlobFile(@RequestBody String data) throws IOException {
         try (OutputStream os = ((WritableResource) this.blobFile).getOutputStream()) {
            os.write(data.getBytes());
         }
         return "File was updated.\n";
      }
   }
   ```

   Where the `@Value("blob://[container]/[blob]")` syntax respectively defines the names of the container and blob where you want to store the data.

1. Save and close the web controller Java file.

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

   `cd C:\SpringBoot\storage`

   -or-

   `cd /users/example/home/storage`

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. Once your application is running, you can use *curl* to test your application; for example:

   a. Send a POST request to update a file's contents:

      ```shell
      curl -X POST -H "Content-Type: text/plain" -d "Hello World" http://localhost:8080/
      ```

      You should see a response that the file was updated.

   b. Send a GET request to verify the file's contents:

      ```shell
      curl -X GET http://localhost:8080/
      ```

     You should see the "Hello World" text that you posted.

## Summary

In this tutorial, you created a new Java application using the **[Spring Initializr]**, added the Azure storage starter to your application, and then configured your application to upload a blob to your Azure storage account.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about the additional Spring Boot Starters that are available for Microsoft Azure, see [Spring Boot Starters for Azure](spring-boot-starters-for-azure.md).

For detailed information about additional Azure storage APIs that you can call from your Spring Boot applications, see the following articles:
* [How to use Azure Blob storage from Java](/azure/storage/blobs/storage-java-how-to-use-blob-storage)
* [How to use Azure Queue storage from Java](/azure/storage/queues/storage-java-how-to-use-queue-storage)
* [How to use Azure Table storage from Java](/azure/cosmos-db/table-storage-how-to-use-java)
* [How to use Azure File storage from Java](/azure/storage/files/storage-java-how-to-use-file-storage)

<!-- IMG List -->

[IMG01]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-01.png
[IMG02]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-02.png
[IMG03]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-03.png
[IMG04]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-04.png
[IMG05]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-05.png

[SI01]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-project-01.png
[SI02]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-project-02.png
[SI03]: ./media/configure-spring-boot-starter-java-app-with-azure-storage/create-project-03.png

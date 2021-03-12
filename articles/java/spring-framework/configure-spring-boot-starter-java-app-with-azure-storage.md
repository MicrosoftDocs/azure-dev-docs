---
title: How to use the Spring Boot Starter for Azure Storage
description: Learn how to configure a Spring Boot Initializer app with the Azure Storage starter.
services: storage
documentationcenter: java
ms.date: 10/14/2020
ms.service: storage
ms.topic: article
ms.workload: storage
ms.custom: devx-track-java, devx-track-azurecli
---

# How to use the Spring Boot Starter for Azure Storage

This article walks you through creating a custom application using the **Spring Initializr**, then adding the Azure storage starter to your application, and then using your application to upload a blob to your Azure storage account.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free Azure account](https://azure.microsoft.com/pricing/free-trial/).
* The [Azure Command-Line Interface (CLI)](/cli/azure/index).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

> [!IMPORTANT]
>
> Spring Boot version 2.0 or greater is required to complete the steps in this article.
>

## Create an Azure Storage Account and blob container for your application

The following procedure creates an Azure storage account and container in the portal.

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **Create a resource**, then **Get started**, and then select **Storage Account**.

   ![Create Azure Storage Account][IMG01]

1. On the **Create storage account** page, enter the following information:

   * Select **Subscription**.
   * Select **Resource group**, or create a new resource group.
   * Enter a unique **Storage account name**, which will become part of the URI for your storage account. For example: if you entered **wingtiptoysstorage** for the **Name**, the URI would be *wingtiptoysstorage.core.windows.net*.
   * Specify the **Location** for your storage account.
1. When you have specified the options listed above, select **Review + create**. 
1. Review the specification, then select **Create** to create your storage account.
1. When the deployment is complete, select **Go to resource**.
1. Select **Containers**.
1. Select **Container**.
   * Name the container.
   * Select *Blob* from the drop-down list.

   ![Create blob container][IMG02]

1. The Azure portal will list your blob container after is has been created.

You can also use Azure CLI to create an Azure storage account and container using the following steps. Remember to replace the placeholder values (in angle brackets) with your own values.

1. Open a command prompt.
1. Sign in to your Azure account:

   ```azurecli
   az login
   ```
   
1. If you don't have a resource group, create one using the following command:
   
   ```azurecli
   az group create \
      --name <resource-group> \
      --location <location>
   ```
   
1. Create a storage account by using the following command:
  
   ```azurecli
    az storage account create \
      --name <storage-account> \
      --resource-group <resource-group> \
      --location <location> 
   ```

1. To create a container, use the following command:
   
   ```azurecli
    az storage container create \
      --account-name <storage-account-name> \
      --name <container-name> \
      --auth-mode login
   ```
## Create a simple Spring Boot application with the Spring Initializr

The following procedure creates the Spring boot application.

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   * Generate a **Maven** project.
   * Specify **Java 11**.
   * Specify a **Spring Boot** version that is equal to or greater than 2.3.
   * Specify the **Group** and **Artifact** names for your application.
   * Add the **Spring Web** dependency.

      ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   > The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.wingtiptoys.storage*.

1. When you have specified the options listed above, select **GENERATE**.

1. When prompted, download the project to a path on your local computer.

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready to edit.

## Configure your Spring Boot app to use the Azure Storage starter

The following procedure configures the Spring boot application to use Azure storage.

1. Locate the *pom.xml* file in the root directory of your app; for example:

   `C:\SpringBoot\storage\pom.xml`

   -or-

   `/users/example/home/storage/pom.xml`

1. Open the *pom.xml* file in a text editor, and add the Spring Cloud Azure Storage starter to the list of `<dependencies>`:

   ```xml
   <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>spring-starter-azure-storage</artifactId>
      <version>1.2.8</version>
   </dependency>
   ```

1. If you're using JDK version 9 or greater, add the following dependencies:

   ```xml
   <dependency>
       <groupId>javax.xml.bind</groupId>
       <artifactId>jaxb-api</artifactId>
       <version>2.3.1</version>
   </dependency>
   <dependency>
       <groupId>org.glassfish.jaxb</groupId>
       <artifactId>jaxb-runtime</artifactId>
       <version>2.3.1</version>
       <scope>runtime</scope>
   </dependency>
   ```

1. Save and close the *pom.xml* file.

## Create an Azure Credential File

The following procedure creates the Azure credential file.

1. Open a command prompt.

1. Navigate to the *resources* directory of your Spring Boot app; for example:

   ```cmd
   cd C:\SpringBoot\storage\src\main\resources
   ```

   -or-

   ```bash
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

The following procedure configures the Spring boot application to use your Azure storage account.

1. Locate the *application.properties* in the *resources* directory of your app; for example:

   `C:\SpringBoot\storage\src\main\resources\application.properties`

   -or-

   `/users/example/home/storage/src/main/resources/application.properties`

2. Open the *application.properties* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your storage account:

   ```yaml
   spring.cloud.azure.credential-file-path=my.azureauth
   spring.cloud.azure.resource-group=wingtiptoysresources
   spring.cloud.azure.region=westUS
   spring.cloud.azure.storage.account=wingtiptoysstorage
   blob=azure-blob://containerName/blobName
   ```
   Where:

   |                   Field                   |                                            Description                                            |
   |-------------------------------------------|---------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.credential-file-path` |            Specifies Azure credential file that you created earlier in this tutorial.             |
   |    `spring.cloud.azure.resource-group`    |           Specifies the Azure Resource Group that contains your Azure Storage account.            |
   |        `spring.cloud.azure.region`        | Specifies the geographical region that you specified when you created your Azure Storage account. |
   |   `spring.cloud.azure.storage.account`    |            Specifies Azure Storage account that you created earlier in this tutorial.             |
   |                   `blob`                  |           Specifies the names of the container and blob where you want to store the data.         |
    
3. Save and close the *application.properties* file.

## Add sample code to implement basic Azure storage functionality

In this section, you create the necessary Java classes for storing a blob in your Azure storage account.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

   `C:\SpringBoot\storage\src\main\java\com\wingtiptoys\storage\StorageApplication.java`

   -or-

   `/users/example/home/storage/src/main/java/com/wingtiptoys/storage/StorageApplication.java`

1. Open the main application Java file in a text editor, and add the following lines to the file. Replace wingtiptoys with your values:

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

### Add a blob controller class

1. Create a new Java file named *BlobController.java* in the package directory of your app; for example:

   `C:\SpringBoot\storage\src\main\java\com\wingtiptoys\storage\BlobController.java`

   -or-

   `/users/example/home/storage/src/main/java/com/wingtiptoys/storage/BlobController.java`

1. Open the blob controller Java file in a text editor, and add the following lines to the file.  Change *wingtiptoys* to your resource group and *storage* to your artifact name.

   ```java
   package com.wingtiptoys.storage;

   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.core.io.Resource;
   import org.springframework.core.io.WritableResource;
   import org.springframework.util.StreamUtils;
   import org.springframework.web.bind.annotation.*;

   import java.io.IOException;
   import java.io.OutputStream;
   import java.nio.charset.Charset;

   @RestController
   @RequestMapping("blob")
   public class BlobController {
   
       @Value("${blob}")
       private Resource blobFile;
   
       @GetMapping
       public String readBlobFile() throws IOException {
           return StreamUtils.copyToString(
                   this.blobFile.getInputStream(),
                   Charset.defaultCharset());
       }
   
       @PostMapping
       public String writeBlobFile(@RequestBody String data) throws IOException {
           try (OutputStream os = ((WritableResource) this.blobFile).getOutputStream()) {
               os.write(data.getBytes());
           }
           return "file was updated";
       }
   }
   ```

1. Save and close the blob controller Java file.

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

   ```cmd
   cd C:\SpringBoot\storage
   ```

   -or-
   
   ```bash
   cd /users/example/home/storage
   ```

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. Once your application is running, you can use *curl* to test your application; for example:

   a. Send a POST request to update a file's contents:

      ```shell
      curl -d 'new message' -H 'Content-Type: text/plain' localhost:8080/blob
      ```

      You should see a response that the file was updated.

   b. Send a GET request to verify the file's contents:

      ```shell
      curl -X GET http://localhost:8080/
      ```

     You should see the "Hello World" text that you posted.

## Summary

In this tutorial, you created a new Java application using the **[Spring Initializr]**, added the Azure storage starter to your application, and then configured your application to upload a blob to your Azure storage account.


## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](index.yml)

### Additional Resources

For more information about the additional Spring Boot Starters that are available for Microsoft Azure, see [Spring Boot Starters for Azure](spring-boot-starters-for-azure.md).

For detailed information about additional Azure storage APIs that you can call from your Spring Boot applications, see the following articles:
* [How to use Azure Blob storage from Java](/azure/storage/blobs/storage-java-how-to-use-blob-storage)
* [How to use Azure Queue storage from Java](/azure/storage/queues/storage-java-how-to-use-queue-storage)
* [How to use Azure Table storage from Java](/azure/cosmos-db/table-storage-how-to-use-java)
* [How to use Azure File storage from Java](/azure/storage/files/storage-java-how-to-use-file-storage)

<!-- IMG List -->

[IMG01]: media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-01.png
[IMG02]: media/configure-spring-boot-starter-java-app-with-azure-storage/create-storage-account-02.png

[SI01]: media/configure-spring-boot-starter-java-app-with-azure-storage/create-project-01.png

---
title: Use Spring Boot to upload a file to Azure Blob Storage
description: Learn how to configure a Spring Boot Initializer app with the Azure Storage starter.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Boot to upload a file to Azure Blob Storage

This tutorial shows you how to upload and read from container blobs in an Azure Blob Storage account from a Spring Boot application.

[Azure Blob Storage](/azure/storage/blobs/) is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing a massive amount of unstructured data, such as text or binary data.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.
- [Apache Maven](http://maven.apache.org/), version 3.0 or higher.
- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.
- An Azure storage account and container. If you don't have one, [create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, and then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to resources, in your newly created Azure Storage account, assign the `Storage Blob Data Contributor` role to the Microsoft Entra account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

## Create a container

First, create a container named `testcontainer` by following the instructions in [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal).

## Upload and read blobs from Azure Storage account container

Now that you have an Azure Storage account and container, you can upload and read files from blobs with Spring Cloud Azure.

To install the Spring Cloud Azure Storage Blob Starter module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.22.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Storage Blob Starter artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
  </dependency>
  ```

### Code the application

To upload and read files from blobs by using the Spring Cloud Azure Storage Blob starter, configure the application by using the following steps.

1. Configure a Storage account name and endpoint in the **application.properties** configuration file, as shown in the following example.

   ```properties
   spring.cloud.azure.storage.blob.account-name=${AZURE_STORAGE_ACCOUNT_NAME}
   spring.cloud.azure.storage.blob.endpoint=${AZURE_STORAGE_ACCOUNT_ENDPOINT}
   ```

1. Create a new `BlobController` Java class as shown in the following example. This class is used to upload and read files from the container blob in the Azure Storage account.

   ```java
   package com.example.demo;

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

       @Value("azure-blob://testcontainer/test.txt")
       private Resource blobFile;

       @GetMapping("/readBlobFile")
       public String readBlobFile() throws IOException {
           return StreamUtils.copyToString(
                   this.blobFile.getInputStream(),
                   Charset.defaultCharset());
       }

       @PostMapping("/writeBlobFile")
       public String writeBlobFile(@RequestBody String data) throws IOException {
           try (OutputStream os = ((WritableResource) this.blobFile).getOutputStream()) {
               os.write(data.getBytes());
           }
           return "file was updated";
       }
   }
   ```

   [!INCLUDE [spring-default-azure-credential-overview.md](includes/spring-default-azure-credential-overview.md)]

1. After your application is running, use `curl` to test your application by following these steps.

   1. Send a POST request to update a file's contents by using the following command:

      ```shell
      curl http://localhost:8080/blob/writeBlobFile -d "new message" -H "Content-Type: text/plain"
      ```

      You should see a response that says `file was updated`.

   1. Send a GET request to verify the file's contents by using the following command:

      ```shell
      curl -X GET http://localhost:8080/blob/readBlobFile
      ```

      You should see the "new message" text that you posted.

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Storage Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage)

### See also

For more information about the additional Spring Boot Starters that are available for Microsoft Azure, see [What is Spring Cloud Azure?](spring-cloud-azure-overview.md)

For more information about additional Azure storage APIs that you can call from your Spring Boot applications, see the following articles:

- [Quickstart: Azure Blob Storage client library for Java](/azure/storage/blobs/storage-java-how-to-use-blob-storage)
- [How to use Queue Storage from Java](/azure/storage/queues/storage-quickstart-queues-java)
- [How to use Azure Table client library for Java](/azure/cosmos-db/table-storage-how-to-use-java)
- [Develop for Azure Files with Java SE](/azure/storage/files/storage-java-how-to-use-file-storage)
- [Quickstart: Quarkus extension for Azure Blob Storage](/azure/storage/blobs/storage-quickstart-blobs-java-quarkus)

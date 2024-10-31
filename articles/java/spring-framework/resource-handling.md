---
title: Spring Cloud Azure resource handling
description: This article describes Spring Cloud Azure resource handling.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure resource handling

**This article applies to:** ✔️ Version 4.19.0 ✔️ Version 5.17.1

The Spring project provides a [Spring Resources](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources) abstraction to access a number of low-level resources. The project provides interfaces like `Resource`, `ResourceLoader` and `ResourcePatternResolver`. Spring Cloud Azure implements these interfaces for Azure Storage services, which allows you to interact with Azure storage Blob and File Share using the Spring programming model. Spring Cloud Azure provides `spring-cloud-azure-starter-storage-blob` and `spring-cloud-azure-starter-storage-file-share` to auto-configure Azure Storage Blob and Azure Storage File Share.

The following table lists Azure Storage related libraries:

| Starter                                       | Service                  | Description                                                                                                                             |
|-----------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| spring-cloud-azure-starter-storage-blob       | Azure Storage Blob       | Allows unstructured data to be stored and accessed at a massive scale in block blobs.                                                   |
| spring-cloud-azure-starter-storage-file-share | Azure Storage File Share | Offers fully managed cloud file shares that you can access from anywhere via the industry standard Server Message Block (SMB) protocol. |

## Dependency setup

```xml
<dependencies>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-storage-file-share</artifactId>
    </dependency>
</dependencies>
```

The `spring-cloud-azure-starter-storage-blob` dependency is only required when you're using Azure Storage Blob.

The `spring-cloud-azure-starter-storage-file-share` dependency is only required when you're using Azure Storage File Share.

> [!TIP]
> We also provide `spring-cloud-azure-starter-storage` to support all the features of Storage. If you choose to use it, `spring.cloud.azure.storage.enable` is the property to configure and the default value is *true*. You can then use `spring.cloud.azure.storage.<storage-service>.enable` to disable unneeded services.

## Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory).

The following table lists the configurable properties of `spring-cloud-azure-starter-storage-blob`:

> [!div class="mx-tdBreakAll"]
> | Property                                       | Default | Description                                                              |
> |------------------------------------------------|---------|--------------------------------------------------------------------------|
> | *spring.cloud.azure.storage.blob*.enabled      | true    | A value that indicates whether an Azure Blob Storage service is enabled. |
> | *spring.cloud.azure.storage.blob*.endpoint     |         | The URI to connect to Azure Blob Storage.                                |
> | *spring.cloud.azure.storage.blob*.account-key  |         | The private key to connect to Azure Blob Storage.                        |
> | *spring.cloud.azure.storage.blob*.account-name |         | The Azure Storage Blob account name.

The following table lists the configurable properties of `spring-cloud-azure-starter-storage-file-share`:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Default | Description                                                           |
> |-----------------------------------------------------|---------|-----------------------------------------------------------------------|
> | *spring.cloud.azure.storage.fileshare*.enabled      | true    | A value that indicates whether Azure File Storage service is enabled. |
> | *spring.cloud.azure.storage.fileshare*.endpoint     |         | The URI to connect to Azure File Storage.                             |
> | *spring.cloud.azure.storage.fileshare*.account-key  |         | The private key to connect to Azure File Storage.                     |
> | *spring.cloud.azure.storage.fileshare*.account-name |         | The Azure Storage File Share account name.                                       |

## Basic usage

Add the following properties to your *application.yml* file:

```yaml
spring:
  cloud:
    azure:
      storage:
        blob:
          account-name: ${STORAGE_ACCOUNT_NAME}
          account-key: ${STORAGE_ACCOUNT_KEY}
          endpoint: ${STORAGE_BLOB_ENDPOINT}
        fileshare:
          account-name: ${STORAGE_ACCOUNT_NAME}
          account-key: ${STORAGE_ACCOUNT_KEY}
          endpoint:  ${STORAGE_FILESHARE_ENDPOINT}
```

### Get a resource

#### Get a resource with @Value

You can use the annotation of `@Value("azure-blob://[your-container-name]/[your-blob-name]")` to autowire a blob resource, as shown in the following example:

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageBlobResource;
```

You can use the annotation of `@Value("azure-file://[your-fileshare-name]/[your-file-name]")` to autowire a file resource, as shown in the following example:

```java
@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageFileResource;
```

#### Get a resource with ResourceLoader

```java
@Autowired
private ResourceLoader resourceLoader;
...
// Get a BlobResource.
Resource storageBlobResource = resourceLoader.getResource("azure-blob://[your-container-name]/[your-blob-name]");

// Get a FileResource.
Resource storageFileResource = resourceLoader.getResource("azure-file://[your-fileshare-name]/[your-file-name]");
```

#### Get resources by searching pattern

You can use an implementation class of `ResourcePatternResolver` to search resources. Use `AzureStorageBlobProtocolResolver` to search `blob` resources and `AzureStorageFileProtocolResolver` to search `file` resources.

* For pattern search, the `searchPattern` should start with `azure-blob://` or `azure-file://`. For example, `azure-blob://**/**` means to list all blobs in all containers, and `azure-blob://demo-container/**` means to list all blobs in the `demo-container` container, including any sub-folder.

* For location search, the `searchLocation` should start with `azure-blob://` or `azure-file://` and the remaining file path should exist, otherwise an exception will be thrown.

```java
@Autowired
private AzureStorageBlobProtocolResolver azureStorageBlobProtocolResolver;

@Autowired
private AzureStorageFileProtocolResolver azureStorageFileProtocolResolver;

// Get all text blobs.
Resource[] blobTextResources = azureStorageBlobProtocolResolver.getResources("azure-blob://[container-pattern]/*.txt");

// Get all text files.
Resource[] fileTextResources = azureStorageFileProtocolResolver.getResources("azure-file://[fileshare-pattern]/*.txt");
```

### Handling with resource

#### Download data from specific resource

You can download a resource from Azure Storage Blob or File Share with the `getInputStream()` method of `Resource`.

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageBlobResource;

@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageFileResource;

//...

// Download data as a stream from a blob resource.
InputStream inputblobStream = storageBlobResource.getInputStream();

// Download data as a stream from a file resource.
InputStream inputfileStream = storageFileResource.getInputStream();
```

#### Upload data to specific resource

You can upload to a resource to Azure Blob or file storage by casting the Spring `Resource` to `WritableResource`, as shown in the following example:

```java
@Value("azure-blob://[your-container-name]/[your-blob-name]")
private Resource storageBlobResource;

@Value("azure-file://[your-fileshare-name]/[your-file-name]")
private Resource storageFileResource;

String data = "sampledata";

// Upload string data to a blob.
try (OutputStream blobos = ((WritableResource) this.storageBlobResource).getOutputStream()) {
    blobos.write(data.getBytes());
}

// Upload string data to a file.
try (OutputStream fileos = ((WritableResource) this.storageFileResource).getOutputStream()) {
    fileos.write(data.getBytes());
}
```

### Multipart upload

Files larger than 4 MiB will be uploaded to Azure Storage in parallel.

## Samples

See the [storage-blob-sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-storage-blob/storage-blob-sample) and [storage-file-sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-storage-file-share/storage-file-sample) repositories on GitHub.

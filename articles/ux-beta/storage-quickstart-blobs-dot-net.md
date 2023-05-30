---
title: "Quickstart: Azure Blob Storage library v12 - .NET"
description: In this quickstart, you will learn how to use the Azure Blob Storage client library version 12 for .NET to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: stevenmatthew
ms.author: shaas
ms.date: 10/06/2021
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, devx-track-dotnet
ROBOTS: NOINDEX
---

# Quickstart: Azure Blob Storage client library v12 for .NET

Get started with the Azure Blob Storage client library v12 for .NET. Azure Blob Storage is Microsoft's object storage solution for the cloud. Follow steps to install the package and try out example code for basic tasks. Blob storage is optimized for storing massive amounts of unstructured data.

The examples in this quickstart show you how to use the Azure Blob Storage client library v12 for .NET to:

- [Authenticate to Azure](#authenticate-the-app-to-azure)
- [Create a container](#create-a-container)
- [Upload a blob to a container](#upload-a-blob-to-a-container)
- [List blobs in a container](#list-blobs-in-a-container)
- [Download a blob](#download-a-blob)
- [Delete a container](#delete-a-container)

Additional resources:

- [API reference documentation](/dotnet/api/azure.storage.blobs)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](/azure/storage/common/storage-samples-dotnet?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](/azure/storage/common/storage-account-create)
- Current [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system. Be sure to get the SDK and not the runtime.

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library v12 for .NET.

### Create the project

For the steps ahead, you'll need to create a .NET console app using either the .NET CLI or Visual Studio 2022.

### [Visual Studio 2022](#tab/visual-studio)

1. At the top of Visual Studio, navigate to **File** > **New** > **Project..**.

1. In the dialog window, enter *console app* into the project template search box and select the first result. Choose **Next** at the bottom of the dialog.

    :::image type="content" source="media/visual-studio-new-console-app.png" alt-text="A screenshot showing how to create a new project using Visual Studio.":::

1. For the **Project Name**, enter *BlobQuickstartV12*. Leave the default values for the rest of the fields and select **Next**.

1. For the **Framework**, ensure .NET 6.0 is selected. Then choose **Create**. The new project will open inside the Visual Studio environment.

### [.NET CLI](#tab/net-cli)

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name *BlobQuickstartV12*. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

   ```dotnetcli
   dotnet new console -n BlobQuickstartV12
   ```

1. Switch to the newly created *BlobQuickstartV12* directory.

   ```console
   cd BlobQuickstartV12
   ```

1. Open the project in your desired code editor. To open the project in:
    * Visual Studio, locate and double-click the `BlobQuickStartV12.csproj` file.
    * Visual Studio Code, run the following command:

    ```bash
    code .
    ```
---

### Install the package

To interact with Azure Blob Storage, install the Azure Blob Storage client library for .NET.

### [Visual Studio 2022](#tab/visual-studio)

1. In **Solution Explorer**, right-click the **Dependencies** node of your project. Select **Manage NuGet Packages**.

1. In the resulting window, search for *Azure.Storage.Blobs*. Select the appropriate result, and select **Install**.

    :::image type="content" source="media/visual-studio-add-package.png" alt-text="A screenshot showing how to add a new package using Visual Studio.":::

### [.NET CLI](#tab/net-cli)

```dotnetcli
dotnet add package Azure.Storage.Blobs
```

---

### Set up the app code

Replace the starting code in the `Program.cs` file so that it matches the following example, which includes the necessary `using` statements for this exercise.

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
```

[!INCLUDE [storage-quickstart-credentials-free-include](./includes/storage-quickstart-credential-free-include.md)]

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that does not adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture.](./media/storage-blobs-introduction/blob-1.png)

Use the following .NET classes to interact with these resources:

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

## Code examples

The sample code snippets in the following sections show you how to perform basic data operations with the Azure Blob Storage client library for .NET.

### Create a container

Decide on a name for the new container. The code below appends a GUID value to the container name to ensure that it is unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

You can call the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method on the `blobServiceClient` to create a container in your storage account.

Add this code to the end of the `Program.cs` class:

```csharp
//Create a unique name for the container
string containerName = "quickstartblobs" + Guid.NewGuid().ToString();

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
```

### Upload a blob to a container

Add the following code to the end of the `Program.cs` class:

```csharp
// Create a local file in the ./data/ directory for uploading and downloading
string localPath = "data";
Directory.CreateDirectory(localPath);
string fileName = "quickstart" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(localPath, fileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to a blob
BlobClient blobClient = containerClient.GetBlobClient(fileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blobClient.Uri);

// Upload data from the local file
await blobClient.UploadAsync(localFilePath, true);
```

The code snippet completes the following steps:

1. Creates a text file in the local *data* directory.
1. Gets a reference to a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method on the container from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync#Azure_Storage_Blobs_BlobClient_UploadAsync_System_String_System_Boolean_System_Threading_CancellationToken_) method. This method creates the blob if it doesn't already exist, and overwrites it if it does.

### List blobs in a container

List the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add the following code to the end of the `Program.cs` class:

```csharp
Console.WriteLine("Listing blobs...");

// List all blobs in the container
await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
{
    Console.WriteLine("\t" + blobItem.Name);
}
```

### Download a blob

Download the previously created blob by calling the [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync) method. The example code adds a suffix of "DOWNLOADED" to the file name so that you can see both files in local file system.

Add the following code to the end of the `Program.cs` class:

```csharp
// Download the blob to a local file
// Append the string "DOWNLOADED" before the .txt extension 
// so you can compare the files in the data directory
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t{0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
```

### Delete a container

The following code cleans up the resources the app created by deleting the entire container by using [DeleteAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.deleteasync). It also deletes the local files created by the app.

The app pauses for user input by calling `Console.ReadLine` before it deletes the blob, container, and local files. This is a good chance to verify that the resources were actually created correctly, before they are deleted.

Add the following code to the end of the `Program.cs` class:

```csharp
// Clean up
Console.Write("Press any key to begin clean up");
Console.ReadLine();

Console.WriteLine("Deleting blob container...");
await containerClient.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Done");
```

## Run the code

This app creates a test file in your local *data* folder and uploads it to Blob storage. The example then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files.

Navigate to your application directory, then build and run the application.

```console
dotnet build
```

```console
dotnet run
```

The output of the app is similar to the following example:

```output
Azure Blob Storage v12 - .NET quickstart sample

Uploading to Blob storage as blob:
         https://mystorageacct.blob.core.windows.net/quickstartblobs60c70d78-8d93-43ae-954d-8322058cfd64/quickstart2fe6c5b4-7918-46cb-96f4-8c4c5cb2fd31.txt

Listing blobs...
        quickstart2fe6c5b4-7918-46cb-96f4-8c4c5cb2fd31.txt

Downloading blob to
        ./data/quickstart2fe6c5b4-7918-46cb-96f4-8c4c5cb2fd31DOWNLOADED.txt

Press any key to begin clean up
Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the clean up process, check your *data* folder for the two files. You can open them and observe that they are identical.

After you've verified the files, press the **Enter** key to delete the test files and finish the demo.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using .NET.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage SDK v12 .NET samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)

- For tutorials, samples, quick starts and other documentation, visit [Azure for .NET and .NET Core developers](/dotnet/azure/).
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).

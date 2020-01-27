---
author: yevster
ms.author: yebronsh
ms.date: 1/20/2020
---

### Inventory persistence usage

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content (for example, via an Apache integration), you'll need an alternate location for that static content. You may wish to consider moving static content to Azure Blob Storage and adding Azure CDN for lightning-fast downloads globally. For more information, see [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website) and [Quickstart: Integrate an Azure storage account with Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account).

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided a sample implementation for your use at [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

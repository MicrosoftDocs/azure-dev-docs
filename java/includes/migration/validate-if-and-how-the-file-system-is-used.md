---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Validate if and how the file system is used

Unlike in a container-based environment, VM filesystems operate the same way as on-premises filesystems with respect to persistence, startup, and shutdown. Even so, it's important to be aware of your filesystem needs and ensure the VMs have adequate storage size and performance.

#### Read-only static content

If your application currently serves static content, you'll need an alternate location for it. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).


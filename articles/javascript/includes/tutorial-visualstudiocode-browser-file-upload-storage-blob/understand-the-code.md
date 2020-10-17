---
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
title: include file understand-the-code.md
description: include file understand-the-code.md
---
In this section of the tutorial, the Azure SDK client library code for Storage blobs is explained. It is written in TypeScript but doesn't depend on the types for understanding. The code is framework-agnostic and could be used on either the client or server. As the code is built for a tutorial, choices were made for simplicity and comprehension. These choices are explained; you should review your own project for intentional use, security, and efficiency. 

## Upload file to Azure Storage blob with Azure SDK client library

The `uploadToBlob.ts` loads the dependencies, authenticates to Azure, and connects to your specific Storage resource using the SAS token.

:::code language="typescript" source="~/js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts":::

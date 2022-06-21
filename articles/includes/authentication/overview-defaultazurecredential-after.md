---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
`DefaultAzureCredential` will automatically detect the authentication mechanism configured for the app and obtain the necessary tokens to authenticate the app to Azure. If an application makes use of more than one SDK client, the same credential object can be used with each SDK client object.
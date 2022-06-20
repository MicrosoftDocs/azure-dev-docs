---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
Internally, `DefaultAzureCredential` implements a chain of selecting credential providers for authenticating applications to Azure resources.  Each credential provider is able to detect if credentials of that type are configured for the app.  `DefaultAzureCredential` sequentially checks each provider in order and uses the credentials from the first provider that has credentials configured.

If you've more than one credential configured, the order of finding the credential through the chain is important. 
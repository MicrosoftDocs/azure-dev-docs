---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 12/04/2024
ms.author: diberry
---

|Token-based authentication|Secrets (connection strings and keys)|
|--|--|
|[Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege), establish the specific permissions needed by the app on the Azure resource. | A connection string or key grants full rights to the Azure resource.|
|There's no application secret to store.| Must store and rotate secrets in app setting or environment variable.|
|The Azure Identity library manages tokens for you behind the scenes. This makes using token-based authentication as easy to use as a connection string.|Secrets aren't managed.|

Use of connection strings should be limited to initial proof of concept apps or development prototypes that don't access production or sensitive data. Otherwise, the token-based authentication classes available in the Azure Identity library should always be preferred when authenticating to Azure resources.
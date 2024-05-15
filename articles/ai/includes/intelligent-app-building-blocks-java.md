---
ms.custom: overview
ms.topic: include
ms.date: 05/15/2024
ms.service: azure
---

## Secure resources with passwordless connections

Application requests to most Azure services must be authenticated with keys or [passwordless connections](../passwordless-connections.md). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.
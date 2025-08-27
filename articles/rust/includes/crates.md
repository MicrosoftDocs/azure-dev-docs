---
ms.custom: devx-track-rust
ms.topic: include
ms.date: 08/27/2025
---

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Description |
|---------|---------|-------------|
| **Cosmos DB** | [`azure_data_cosmos`][Crate - cosmos] | NoSQL database operations |
| **Event Hubs** | [`azure_messaging_eventhubs`][Crate - event hubs] | Big data streaming platform |
| **Key Vault** | [`azure_security_keyvault_certificates`][Crate - key vault - certificates]<br>[`azure_security_keyvault_secrets`][Crate - key vault - secrets]<br>[`azure_security_keyvault_keys`][Crate - key vault - keys] | Manage secrets, keys, and certificates |
| **Storage** | [`azure_storage_blob`][Crate - storage] | Create and manage Azure Storage blobs and containers. |

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK for Rust and shouldn't be used for modern development.
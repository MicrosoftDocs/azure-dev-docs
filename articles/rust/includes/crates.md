---
ms.custom: devx-track-rust
ms.topic: include
ms.date: 08/27/2025
---

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Docs| Description |
|---------|---------|--| -------------|
| [**Identity**][1P docs - identity] | [`azure_identity`][Crate - identity] | [Docs][Docs - identity] | Azure Active Directory authentication |
| [**Cosmos DB**][1P docs - cosmos] | [`azure_data_cosmos`][Crate - cosmos] | [Docs][Docs - cosmos] | NoSQL database operations |
| [**Event Hubs**][1P docs - event hubs] | [`azure_messaging_eventhubs`][Crate - event hubs] | [Docs][Docs - event hubs] | Big data streaming platform |
| [**Key Vault certificates**][1P docs - key vault - certificates] | [`azure_security_keyvault_certificates`][Crate - key vault - certificates] | [Docs][Docs - key vault - certificates] | Manage certificates in Azure Key Vault |
| [**Key Vault keys**][1P docs - key vault - keys] | [`azure_security_keyvault_keys`][Crate - key vault - keys] | [Docs][Docs - key vault - keys] | Manage keys in Azure Key Vault |
| [**Key Vault secrets**][1P docs - key vault - secrets] | [`azure_security_keyvault_secrets`][Crate - key vault - secrets] | [Docs][Docs - key vault - secrets] | Manage secrets in Azure Key Vault |
| [**Storage**][1P docs - storage] | [`azure_storage_blob`][Crate - storage] | [Docs][Docs - storage] | Create and manage Azure Storage blobs and containers. |

Common functionality for all crates such as authentication, error handling, and logging is provided by the [`azure_core`][Crate - core] crate.

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK for Rust and shouldn't be used for modern development.

[1P docs - identity]: /entra/identity
[1P docs - cosmos]: /azure/cosmos-db
[1P docs - event hubs]: /azure/event-hubs
[1P docs - key vault - certificates]: /azure/key-vault/certificates
[1P docs - key vault - keys]: /azure/key-vault/keys
[1P docs - key vault - secrets]: /azure/key-vault/secrets
[1P docs - storage]: /azure/storage

[Crate - identity]: https://crates.io/crates/azure_identity
[Crate - core]: https://crates.io/crates/azure_core
[Crate - cosmos]: https://crates.io/crates/azure_data_cosmos
[Crate - event hubs]: https://crates.io/crates/azure_messaging_eventhubs
[Crate - key vault - secrets]: https://crates.io/crates/azure_security_keyvault_secrets
[Crate - key vault - certificates]: https://crates.io/crates/azure_security_keyvault_certificates
[Crate - key vault - keys]: https://crates.io/crates/azure_security_keyvault_keys
[Crate - storage]: https://crates.io/crates/azure_storage

[Docs - identity]: https://docs.rs/azure_identity/latest/azure_identity/
[Docs - core]: https://docs.rs/azure_core
[Docs - cosmos]: https://docs.rs/azure_data_cosmos
[Docs - event hubs]: https://docs.rs/azure_messaging_eventhubs
[Docs - key vault - secrets]: https://docs.rs/azure_security_keyvault_secrets
[Docs - key vault - certificates]: https://docs.rs/azure_security_keyvault_certificates
[Docs - key vault - keys]: https://docs.rs/azure_security_keyvault_keys
[Docs - storage]: https://docs.rs/azure_storage
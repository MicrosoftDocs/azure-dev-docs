---
title: Access Azure services using Azure SDK for Rust crates
description: Learn how to access Azure services using Azure SDK for Rust crates. Build secure, scalable Rust apps with Azure—get started today.
ms.date: 08/14/2025
ms.topic: overview
ms.service: azure
ms.custom: devx-track-rust
---

# What are Azure SDK for Rust crates?

Azure SDK for Rust crates enable Rust applications to access Azure services. These client libraries provide a consistent, idiomatic experience, making it easier to build secure and scalable cloud solutions with Rust and Azure.

[Crates] | [API reference documentation] | [Source code] 

## Key concepts for Azure SDK for Rust crates

- **Idiomatic Rust**: Built with Rust best practices and conventions.
- **Async support**: Fully async APIs with pluggable runtime support (defaulting to tokio).
- **Type safety**: Uses Rust's type system for compile-time safety.
- **Thread safety**: All client instance methods are thread-safe and independent of each other.
- **Memory safety**: Zero-cost abstractions with no garbage collection overhead.
- **Modular design**: Use only the crates you need.
- **Unified configuration**: Configure service clients, logging, and retries with [`ClientOptions`][Ref doc - core - ClientOptions].
- **Consistent error handling**: Handle errors consistently across services with [`azure_core::Error`][Ref doc - core - Error].
- **Response handling**: Access detailed HTTP response data with [`Response<T>`][Ref doc - core - Response].
- **Pagination support**: Work with paginated APIs by using [`Pager<T>`][Ref doc - core - Pager] for async streams.
- **Authentication abstractions**: Standardized credential management via [`TokenCredential`][Ref doc - core - TokenCredential].

## Rust guidance

The [Azure SDK design guidelines for Rust](https://azure.github.io/azure-sdk/rust_introduction.html) outline the core design principles and patterns that all Azure SDK crates follow. These guidelines ensure that SDKs are consistent, intuitive, and idiomatic for Rust, making it easier for developers to adopt and use Azure services. By adhering to these standards, the Azure SDK crates provides a familiar and predictable experience, with clear patterns for authentication, error handling, and client configuration that align with the broader Azure SDK ecosystem.

## Differences between crates and REST APIs

Use the following information to understand when to use each type of access.

* The Azure SDK crates are the preferred method for accessing your Azure service. These crates abstract away the boilerplate code required to manage cloud-based Azure platform REST requests such as authentication, retries, and logging.
* Azure REST APIs are the preferred method if you are:
  * Working with preview services that don't have Azure crates available yet. Consider your code as preview, which should be updated when the service is generally available with crates.
  * Wanting to make REST calls directly because you don't want to use the entire crate to use a single REST API or you want deeper control over the HTTP requests.

## Rust version

The Azure SDK crates are currently in **beta**. While the APIs are stabilizing and the crates are suitable for development and testing, some breaking changes might occur before the 1.0 release. These crates support the most commonly used Azure services, and we regularly add more based on community feedback and demand.

## Azure SDK for Rust crates

[!INCLUDE [crates](../includes/crates.md)]

## Next steps

- [Install the Azure SDK for Rust crates](./installation.md)
[!INCLUDE [common resources](../includes/resources.md)]


[API reference documentation]: https://docs.rs/releases/search?query=azure_
[Crates]: https://crates.io/users/azure-sdk?sort=recent-downloads
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/


[Ref doc - core - ClientOptions]:https://docs.rs/azure_core/latest/azure_core/http/struct.ClientOptions.html
[Ref doc - core - Error]: https://docs.rs/azure_core/latest/azure_core/struct.Error.html
[Ref doc - core - Response]: https://docs.rs/azure_core/latest/azure_core/http/struct.Response.html
[Ref doc - core - Pager]: https://docs.rs/azure_core/latest/azure_core/http/type.Pager.html
[Ref doc - core - TokenCredential]: https://docs.rs/azure_core/latest/azure_core/credentials/trait.TokenCredential.html

---
title: Use Azure Core types in Rust applications  
description: Learn how to use Azure Core types for HTTP clients, async runtimes, and type conventions in Azure SDK for Rust applications. Customize behavior and implement your own clients.
ms.date: 10/27/2025
ms.topic: how-to
ms.service: azure-rust
ms.custom: devx-track-rust
ai-usage: ai-generated
---

# Use Azure Core types in Rust applications

The `azure_core` crate provides fundamental types, traits, and abstractions that form the foundation of all Azure SDK for Rust crates. Understanding these types helps you customize HTTP clients, async runtimes, and work with Azure service responses effectively. This article explains how to use Azure Core types for advanced scenarios in your Rust applications.

[Crates] | [API reference documentation] | [Source code]

## Prerequisites

- Rust 1.85 or later
- Basic understanding of Rust async programming
- Familiarity with HTTP concepts
- [Azure SDK for Rust crates installed](./installation.md)

## Key Azure Core types

The `azure_core` crate provides several important types that you'll encounter when working with Azure services:

### Response types

- **`Response<T>`**: Wraps service responses with HTTP details
- **`Result<T>`**: Standard Rust result type for error handling
- **`Pager<T>`**: Handles paginated responses from Azure services
- **`Poller<T>`**: Manages long-running operations

### Client configuration

- **`ClientOptions`**: Configures service clients
- **`Transport`**: Abstracts HTTP client implementation
- **`HttpClient`**: Trait for custom HTTP client implementations

### Error handling

- **`Error`**: Unified error type across Azure services
- **`ErrorKind`**: Categorizes different error types

## HTTP requests

This section covers how to customize HTTP client behavior and implement custom HTTP clients for Azure SDK operations.

### Customize reqwest behavior

Instead of implementing a completely new HTTP client, you can customize the default `reqwest::Client`. This approach is simpler and allows you to leverage reqwest's features while adjusting specific behaviors like timeouts, compression, or connection pooling. This is particularly useful when you need to tune performance or work around specific network constraints:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_ureq_client.rs" :::

### Implement a custom HTTP client

You can replace the default HTTP client (reqwest) with your own implementation by implementing the `HttpClient` trait. This is useful when you need specific HTTP client features, want to avoid tokio dependencies, or need to integrate with existing HTTP infrastructure. This example shows how to use the `ureq` HTTP client, which is a synchronous client that can be useful in embedded or resource-constrained environments:

TBD



## Async operations

This section covers how to customize the async runtime and handle asynchronous operations in Azure SDK for Rust applications.

### Replace the async runtime

You can replace the default `tokio` runtime with a custom implementation. This is useful when your application uses a different async runtime like `async-std`, or when you need to customize task scheduling behavior for specific performance requirements. The Azure SDK abstracts runtime operations through the `AsyncRuntime` trait:

TBD


## Custom types and models

This section covers type conventions, custom model implementations, and response handling patterns in Azure SDK for Rust.

### Understand type conventions

Azure SDK for Rust crates follow consistent naming conventions for types. These conventions help you understand what each type does and how to use it effectively. Understanding these patterns makes it easier to work with any Azure service:

#### Header types

Types that end with `Headers` contain HTTP header properties. These types provide access to HTTP response headers returned by Azure services, which often contain important metadata about the operation:

TBD

#### Request types

Types that end with `Request` represent operation parameters. These types bundle all the inputs needed for a specific Azure service operation, providing type safety and clear documentation of what data is required:
TBD

### Bring Your Own Model (BYOM)

You can define custom types that work with Azure Core paging and other abstractions. This is particularly useful when you need to transform Azure service responses into domain-specific models or when working with custom APIs that follow Azure patterns:

TBD

### Handle responses with type safety

Use `Response<T>` to access both the deserialized response and HTTP details. This type provides maximum flexibility by giving you access to both the parsed response data and the raw HTTP information, which is essential for debugging and advanced scenarios:

TBD

### Configure client options globally

Use `ClientOptions` to configure behavior across all Azure service clients. This approach ensures consistent behavior across your entire application and makes it easy to adjust settings like retry policies and timeouts in one place:

TBD

## Next steps

- [Authenticate with Azure services](./authentication/overview.md)
- [Handle errors in Azure SDK for Rust crates](./logging.md)
- [Use Azure SDK for Rust crates](./use-crates.md)

[!INCLUDE [common resources](../includes/resources.md)]

[API reference documentation]: https://docs.rs/azure_core/
[Crates]: https://crates.io/crates/azure_core
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/core/azure_core/
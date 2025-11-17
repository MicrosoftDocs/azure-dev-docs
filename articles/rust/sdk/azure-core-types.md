---
title: Use Azure Core types in Rust applications  
description: Learn how to use Azure Core types in Rust applications to customize HTTP clients, policies, and error handling. Discover how to implement your own clients and optimize Azure SDK usage.
ms.date: 11/17/2025
ms.topic: how-to
ms.service: azure-rust
ms.custom: devx-track-rust
ai-usage: ai-assisted
---

# Use Azure Core types in Rust applications

The `azure_core` crate provides fundamental types, traits, and abstractions that form the foundation of all Azure SDK for Rust crates. This article demonstrates how to implement custom HTTP clients, create custom policies for request/response processing, and access detailed error information from Azure services.

[Crates] | [API reference documentation] | [Source code]

## HTTP requests

This section covers how to customize HTTP client behavior and implement custom HTTP clients for Azure SDK operations.

### Implement a custom HTTP client

You can replace the default HTTP client (reqwest) with your own implementation by implementing the `HttpClient` trait. This is useful when you need specific HTTP client features, want to avoid tokio dependencies, or need to integrate with existing HTTP infrastructure. This example shows how to use the `ureq` HTTP client, which is a synchronous client that can be useful in embedded or resource-constrained environments.

First, implement the `HttpClient` trait for your custom client:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_ureq_client.rs" range="16-47" :::

Then, configure the client with your custom HTTP implementation:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_ureq_client.rs" range="49-73" :::

### Implement custom HTTP policies

You can customize request and response processing by implementing the `Policy` trait. Policies let you modify requests before they're sent or inspect responses before they're returned. This example shows how to create a policy that removes the request's User-Agent header:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_remove_user_agent.rs" range="18-38":::

Add your custom policy to the client options object:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_remove_user_agent.rs" range="44-49":::

Then construct the client:

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_remove_user_agent.rs" range="58-62":::

## Service error details

You can access detailed errors returned by the Azure service. The following example demonstrates deserializing a standard Azure error response to get more details such as the `error_code` and error details.

:::code language="rust" source="~/../azure-sdk-for-rust-permalink/sdk/core/azure_core/examples/core_error_response.rs" range="19-75" :::


## Next steps

- [Authenticate with Azure services](./authentication/overview.md)
- [Handle errors in Azure SDK for Rust crates](./logging.md)
- [Use Azure SDK for Rust crates](./use-crates.md)

[!INCLUDE [common resources](../includes/resources.md)]

[API reference documentation]: https://docs.rs/azure_core/
[Crates]: https://crates.io/crates/azure_core
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/core/azure_core/
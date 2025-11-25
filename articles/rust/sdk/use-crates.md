---
title: Use Azure SDK for Rust crates to access Azure services
description: Get started with Azure SDK for Rust crates. Learn authentication, explore supported Azure services, and follow best practices with code examples. Build secure Azure applications in Rust—start now.
ms.date: 10/10/2025
ms.topic: concept-article
ms.service: azure-rust
ms.custom: devx-track-rust
---

# Use Azure SDK for Rust crates to access Azure services

The Azure SDK for Rust crates help you access Azure services from Rust applications. This article explains how to use these crates, including authentication, supported services, and best practices.

[Crates] | [API reference documentation] | [Source code]

## Prerequisites to develop with crates

- Rust 1.85 or later. The version is specified in the Azure SDK for Rust crates [Cargo.toml][Azure SDK main Cargo.toml].
- An Azure subscription. You can [create one for free][Free Subscription].
- [Azure CLI]
- [Azure Developer CLI]
- [Azure SDK for Rust crates](./installation.md)

> [!TIP]
> For the best development experience, ensure you have the latest stable version of Rust installed. 


## Provide authentication credentials

The Azure crates need credentials to authenticate to Microsoft Entra ID. Azure services provide different authentication methods for connection. We recommend using the [`azure_identity`][Crate - identity] crate for authentication. Learn more about [authentication for Azure SDK for Rust crates](./authentication/overview.md).

## Client objects

You use client objects to interact with Azure services. Each client object, from a service's crate, corresponds to a specific Azure service and provides methods to perform operations on that service. For example, [`azure_security_keyvault_secrets::SecretClient`][Ref doc - secret - SecretClient] is used to interact with Azure Key Vault secrets.

When you create the client objects, you can provide a [`ClientOptions`][Ref doc - core - ClientOptions] parameter for customizing the interactions with the service. Use `ClientOptions` to set things like timeouts, retry policies, and other configurations.

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/authenticate_azure_cli.rs":::

## Error handling

When a service call fails, the returned [Response][Ref doc - core - Response] contains the [`status`][Ref doc - core - http status code].  

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/error_handling.rs":::

## Page results

If a service call returns multiple values in pages, it returns `Result<Pager<T>>` as a [`Result`][Ref doc - core - Result] of [`Pager`][Ref doc - core - Pager]. 

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/page_results.rs":::

## Pagination to process each page of items

To iterate through all items in a paginated response, use the [`into_pages()`][Ref doc - core - into_pages] method on the returned [`Pager`][Ref doc - core - Pager]. This method returns an async stream of pages as a [`PageIterator`][Ref doc - core - PageIterator], so you can process each page as it becomes available. 

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/paging_all_items.rs":::

## Sample code

The code shown in this article is available on <https://github.com/azure-samples/azure-sdk-for-rust-docs/>.

## Next steps

[!INCLUDE [common resources](../includes/resources.md)]


[API reference documentation]: https://docs.rs/releases/search?query=azure_
[Crates]: ../azure-sdk-library-package-index.md
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/

[Azure SDK main Cargo.toml]: https://github.com/Azure/azure-sdk-for-rust/blob/main/Cargo.toml

[Ref doc - secret - SecretClient]: https://docs.rs/azure_security_keyvault_secrets/latest/azure_security_keyvault_secrets/struct.SecretClient.html
[Ref doc - core - ClientOptions]:https://docs.rs/azure_core/latest/azure_core/http/struct.ClientOptions.html
[Ref doc - core - Response]: https://docs.rs/azure_core/latest/azure_core/http/response/struct.Response.html
[Ref doc - core - http status code]: https://docs.rs/azure_core/latest/azure_core/http/enum.StatusCode.html
[Ref doc - core - Result]: https://docs.rs/azure_core/latest/azure_core/type.Result.html
[Ref doc - core - Pager]: https://docs.rs/azure_core/latest/azure_core/http/pager/type.Pager.html
[Ref doc - core - into_pages]: https://docs.rs/azure_core/latest/azure_core/http/pager/struct.ItemIterator.html#method.into_pages
[Ref doc - core - PageIterator]: https://docs.rs/azure_core/latest/azure_core/http/pager/struct.PageIterator.html

[Crate - identity]: https://crates.io/crates/azure_identity

[Free Subscription]: https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn/

[Azure Developer CLI]: /azure/developer/azure-developer-cli
[Azure CLI]: /cli/azure/
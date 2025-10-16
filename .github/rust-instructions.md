---
ms.author: diberry
ms.date: 09/02/2025
title: Copilot Instructions for Rust on Azure
description: "Central instructions for Copilot tasks for Rust on Azure. References detailed instructions in .github/instructions."
applyTo: "articles/rust/**/*.md"
---

# Copilot instructions for all Rust language content

Use the following instructions when creating, editing, or reviewing articles which include the Rust programming language.

## Governing reference material

Consider the following resources for governing the use of documentation about Rust:

- [Azure SDK Rust guidelines](https://azure.github.io/azure-sdk/rust_introduction.html)

## Instructions specific to Azure SDK for Rust

- When referring to the Azure SDK for Rust:
    - For the title, description, H1 and first instance, use the full name "Azure SDK for Rust crates". 
    - For subsequent references, you may use "Azure crates".
- When generating SDK code:
    - Prefer Azure Identity over keys or other authentication mechanisms.
    - Prefer `AzureDeveloperCliCredential` over other credential types. 
    - Prefer to use the Azure Key Vault secrets service and its associated crate `azure_security_keyvault_secrets`. This crate was created by the SDK platform team, so it is most idiomatic of the Azure SDK for Rust crates.
- When linking to reference documentation on docs.rs:
    - All links must include the `/latest` route after the crate name.
    - Format: `https://docs.rs/{crate_name}/latest/{crate_name}/`
    - Example: For the `azure_core` crate, use `https://docs.rs/azure_core/latest/azure_core/`
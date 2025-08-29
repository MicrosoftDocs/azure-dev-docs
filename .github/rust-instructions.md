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
    - Prefer Azure Developer CLI credential over other credential types. 
    - Prefer to use the Azure Key Vault secrets service and its associated crate `azure_security_keyvault_secrets`. This crate was create by the SDK platform team so it is most idiomatic of the Azure SDK for Rust crates.
---
title: Overview of the Azure SDK for C++
description: Learn how the Azure SDK for C++ can help you create and manage applications that run on Azure.
ms.topic: concept-article
ms.date: 08/25/2026
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# What is the Azure SDK for C++?

The Azure SDK for C++ is a collection of client libraries that let your C++ applications interact with Azure services from local or cloud environments. These libraries, built on the Azure REST API, use familiar C++ syntax and implement common cloud patterns such as authentication, logging, and retries. With the Azure SDK for C++, you can manage and use Azure resources directly from your C++ code.

## Client libraries

The Azure SDK for C++ is composed of numerous client libraries, each designed to interact with specific Azure services. This modular approach allows developers to include only the libraries they need, minimizing unnecessary dependencies and reducing bloat in their projects.

Each Azure service can have one or multiple libraries tailored to different functionalities. For example, Azure Key Vault offers separate libraries for managing keys, secrets, and certificates. This granularity lets you target the capabilities you need without including extra features.

Breaking the Azure SDK for C++ into small, consumable service libraries lets you manage dependencies precisely and keep your applications maintainable.

## Installation and integration

The Azure SDK for C++ supports acquiring libraries through vcpkg, a package manager for C++. vcpkg manages dependencies in C++ projects: it downloads the source of your project's dependencies, along with their dependencies, and builds them as part of your project's build process.

vcpkg integrates with CMake, a widely used build system for C++ projects. Through a CMake module, vcpkg manages the entire dependency chain, so that all required libraries are downloaded and built consistently across development environments.

To install and integrate the Azure SDK for C++ libraries into your projects, see [Install and integrate libraries from the Azure SDK for C++](./install-and-integrate-the-sdk.md).

## Unified design principles

The Azure SDK for C++ is built on a foundation of core libraries that provide common types and patterns across all service libraries. This unified design provides consistency across libraries, which makes the SDK easier to learn and use.

When you start with your first library, you encounter these common types and patterns. After you're familiar with them, moving to other libraries in the SDK is straightforward, because they share the same behavior. This consistency helps you get up to speed with new libraries quickly.

These unified design principles mean that whether you work with Azure Key Vault, Azure Storage, or another service, you get the same predictable behavior when you manage and use Azure resources.

## Open source

The Azure SDK for C++ is an open-source project. Because it's open source, you can [inspect the source code](https://github.com/Azure/azure-sdk-for-cpp) of each library to understand how the SDK operates and confirm that it meets your needs.

You can provide feedback through [issues on the GitHub repository](https://github.com/Azure/azure-sdk-for-cpp/issues), which helps improve the SDK. You can also contribute directly. Whether you're fixing bugs, adding features, or improving documentation, contributions through pull requests (PRs) are welcome.

## Next steps

- [Install and Integrate the Azure SDK for C++](install-and-integrate-the-sdk.md)

---
title: Overview of the Azure SDK for C++
description: Learn how the Azure SDK for C++ can help you create and manage applications that run on Azure.
author: ronniegeraghty
ms.author: rgeraghty
ms.service: AzureSDKForCpp
ms.topic: overview
ms.date: 11/14/2024
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# What is the Azure SDK for C++?

The Azure SDK for C++ provides a set of client libraries that enable your C++ applications to interact seamlessly with Azure services, whether in local or cloud environments. These libraries, built on top of the Azure REST API, offer familiar C++ syntax and implement common cloud patterns such as authentication, logging, and retries. By using the Azure SDK for C++, you can efficiently manage and utilize Azure resources, enhancing your development workflow with robust and reliable cloud capabilities.

## Client Libraries

The Azure SDK for C++ is composed of numerous client libraries, each designed to interact with specific Azure services. This modular approach allows developers to include only the libraries they need, minimizing unnecessary dependencies and reducing bloat in their projects.

Each Azure service can have one or multiple libraries tailored to different functionalities. For example, Azure Key Vault offers separate libraries for managing Keys, Secrets, and Certificates. This granularity ensures that developers can precisely target the capabilities they require without incorporating extraneous features.

Breaking down the Azure SDK for C++ into these small, consumable service libraries, allows users to efficiently manage their dependencies and streamline their development process. This design not only enhances the flexibility and maintainability of applications but also aligns with common cloud development patterns, ensuring a seamless integration with Azure services.

## Installation & Integration

The Azure SDK for C++ supports acquiring libraries through vcpkg, a modern package manager for C++. vcpkg simplifies the often frustrating task of managing dependencies in C++ projects. By using vcpkg, you can easily download the source of your project's dependencies and their dependencies, and build them as part of your project's build process.

vcpkg integrates seamlessly with CMake, a widely used build system for C++ projects. By utilizing a CMake module, vcpkg manages the entire dependency chain, ensuring that all required libraries are correctly downloaded and built. This integration not only streamlines the setup process but also ensures consistency across different development environments.

By using vcpkg and CMake, you can focus more on developing your application and less on managing dependencies, enhancing your overall development workflow.

## Unified Design Principles

The Azure SDK for C++ is built on a foundation of core libraries that provide common types and patterns across all service libraries. This unified design ensures consistency and familiarity, making it easier for developers to learn and use the SDK effectively.

When you start with your first library from the Azure SDK for C++, you'll encounter these common types and patterns. As you become familiar with them, you'll find that transitioning to other libraries within the SDK is seamless. This consistency allows you to quickly get up to speed with new libraries, enhancing your productivity and reducing the learning curve.

Adhering to these unified design principles, allows the Azure SDK for C++ to offer a cohesive and intuitive development experience. Whether you're working with Azure Key Vault, Azure Storage, or any other service, you'll benefit from the same reliable and predictable behavior, enabling you to efficiently manage and utilize Azure resources.

## Open Source

The Azure SDK for C++ is an open source project, providing transparency and accessibility to its users. By being open source, it allows developers to [inspect the source code](https://github.com/Azure/azure-sdk-for-cpp) of each library, gaining a deeper understanding of how the SDK operates and ensuring that it meets their specific needs.

We actively encourage feedback from our users through [issues on our GitHub repository](https://github.com/Azure/azure-sdk-for-cpp/issues). This feedback is invaluable in helping us improve the SDK and address any concerns or suggestions from the community. Additionally, we welcome contributions from developers around the world. Whether it's fixing bugs, adding new features, or improving documentation, contributions through pull requests (PRs) are always appreciated.

By fostering an open-source community, we aim to create a collaborative environment where developers can work together to enhance the Azure SDK for C++. This collaborative approach not only improves the quality of the SDK but also ensures that it evolves to meet the needs of its users.

## Next steps

- [Install and Integrate the Azure SDK for C++](install-and-integrate-the-sdk.md)

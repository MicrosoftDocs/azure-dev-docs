---
title: Get started with Azure Developer CLI 
description: Learn how to get started with Azure Developer CLI
keywords: 
author: puicchan
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with Azure Developer CLI

To get started, we recommend using a DevContainer, which has the least number of prerequisites you need to install on your machine. The readme in any of the [sample templates](azure-dev-cli-templates.md) is a good start or you can refer to the quickstart: [Get Started with DevContainer](get-started-devcontainer.md).

If DevContainer isn't right for you, you have other development environment options.

## Development environment choices

To run any sample template, the first thing you need to do is decide where you want your development environment to be hosted.  

|Environment|Description|Pros|Cons|
|---|---|---|---|
|**[VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|Container with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.|Linux containers only, but can run on Windows host. You need to clone the repository. The container initialization can take a long time.|
|**[GitHub Codespaces](https://github.com/features/codespaces)** (Support is coming)|Container with all dependencies installed and run on GitHub.com in the browser.|All dependencies installed and you don't need to clone the code locally.|Linux containers only. Some features and functionality may not be supported. The container initialization can take a long time.|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.|

Once you've decided which development environment is right for you, learn more about how to:

- [Get started using bare metal setup](get-started-bare-metal.md)

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).

---
title: Get started with Azure Developer CLI 
description: Learn how to get started with Azure Developer CLI
keywords: 
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with cloud development using Java on Azure
## Setup

To run this project, the first thing you need to do is decide where you want your development environment to be hosted.  

You have the following options:

|Environment|Description|Pros|Cons|
|---|---|---|---|
|**[VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|Container with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.|Linux containers only, but can run on Windows host. You need to clone the repository. The container initialization can take a long time.|
|**[GitHub Codespaces](https://github.com/features/codespaces)**|Container with all dependencies installed and run on GitHub.com in the browser.|All dependencies installed and you don't need to clone the code locally.|Linux containers only. Some features and functionality may not be supported. The container initialization can take a long time.|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.|

Once you have decided which development environment is right for you, expand one of the sections below for the setup steps.


## Explore more samples

To learn more about how to use the Azure management libraries for Java to manage resources and automate tasks, see our sample code for [virtual machines](virtual-machine-samples.md), [web apps](web-apps-samples.md), and [SQL database](sql-database-samples.md).

## Reference and release notes

A [reference](/java/api) is available for all packages.

## Get help and give feedback

Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure+java). Report bugs and open issues against the Azure SDK for Java in the [GitHub repository](https://github.com/Azure/azure-sdk-for-java).

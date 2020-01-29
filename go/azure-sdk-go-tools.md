---
title: Tools for developers using the Azure SDK for Go
description: Tools for working with the Azure SDK for Go, and Azure services
ms.date: 09/05/2018
ms.topic: conceptual
---

# Tools for developers using the Azure SDK for Go

To be effective at writing Go code and have it work seamlessly with Azure services, here are some recommended tools.

## Azure CLI

The Azure CLI provides a command-line interface to create and configure Azure resources in your subscriptions. The CLI can help you get started building common and shared Azure resources quickly, so that you can focus on more complex usage of services. The CLI has query and filtering features so you can pipe output directly to your favorite command-line tools. The CLI is available for installation on your local system, as a Docker image, or through [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).

> [!div class="nextstepaction"]
> [Install the Azure CLI](/cli/azure/install-azure-cli)

## Visual Studio Code

Visual Studio Code is a lightweight editor that offers Go support. This extension offers features like
autocomplete, `impl` templates, refactoring, and debugging. Visual Studio Code also offers support for in-editor
access to source control, and extensions for working with Azure services.

* [Install Visual Studio Code](https://code.visualstudio.com/Download)
* [Get the Visual Studio Code Go extension](https://code.visualstudio.com/docs/languages/go)
* [Get the Visual Studio Code Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-azureextensionpack)

## CI/CD with Azure DevOps Project

Azure DevOps Project pipelines allow you to set up a continuous integration system for your Go applications. All it takes is a git repo, and you can 
deploy and test directly on Azure.

> [!div class="nextstepaction"]
> [Learn how to create a CI/CD pipeline with Azure DevOps Project](/azure/devops-project/azure-devops-project-go)

## Dependency management with dep

The Azure SDK for Go uses dep for dependency management. The dep command allows you to pull and vendor requirements for your Go application,
 avoiding version conflicts and ensuring that your project works correctly.

> [!div class="nextstepaction"]
> [Get the dep dependency manager](https://github.com/golang/dep)

---
title: Azure Tools for Java Developers
description: IDE integrations, emulators, resource explorers, and command-line interfaces for Java developers working on Azure.
author: KarlErickson
ms.author: karler
ms.topic: article
ms.date: 10/23/2025
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
ai-usage: ai-assisted
---

# Azure tools for Java developers

This article describes common tools available for developers using Azure for Java.

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) is a lightweight but powerful code editor available for macOS, Windows, and Linux. VS Code supports a simple, modern Java development workflow through a set of extensions that provide project support, code completion, debugging, linting, and navigation.

For Java development, install the [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack), which includes essential extensions for language support, debugging, testing, Maven and Gradle integration, project management, and more. This extension pack provides everything you need for productive Java development in VS Code.

For working with Azure, install the [Azure Tools Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), which includes extensions for Azure App Service, Azure Functions, Azure Databases, Azure Storage, and more. These extensions enable you to browse and manage Azure resources, deploy applications, and work with Azure services directly from VS Code.

For more information, see [Get Started with Visual Studio Code and Java](https://code.visualstudio.com/docs/java).

## Eclipse and IntelliJ plugins

Manage Azure resources and deploy apps from your IDE with The Azure toolkits for [Eclipse](../toolkit-for-eclipse/index.yml) and [IntelliJ](../toolkit-for-intellij/index.yml).

![IntelliJ toolkit showing the Azure Explorer](media/intelliJ-azure-explorer.png)

[Get started with Azure Toolkit for Eclipse](../toolkit-for-eclipse/create-hello-world-web-app.md) | [Get started with Azure Toolkit for IntelliJ](../toolkit-for-intellij/create-hello-world-web-app.md)

## Apache Maven and Gradle plugins

Deploy Java applications to Azure with ease by configuring Azure plugins as part of your Maven or Gradle builds. Currently, the plugins support Azure App Service, Azure Functions, Azure Container Apps, and Azure Spring Apps.

- [Azure Plugins for Gradle](https://github.com/microsoft/azure-gradle-plugins)
- [Azure Plugins for Apache Maven](https://github.com/microsoft/azure-maven-plugins)
- [Maven Archetypes for Azure Services](https://github.com/Microsoft/azure-maven-archetypes)

## Supported Java runtimes

Java developers are free to use the distribution and version of Java of their choice for most Microsoft Azure and Azure Stack services. For more information, see [Java support on Azure and Azure Stack](java-support-on-azure.md).

## Azure CLI

The Azure CLI provides a command-line experience to manage Azure resources. You can use it in your browser with [Azure Cloud Shell](/azure/cloud-shell/overview), or you can [install](/cli/azure/install-azure-cli) it on macOS, Linux, and Windows and run it from the command line.

[Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

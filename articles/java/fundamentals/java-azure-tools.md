---
title: Azure tools for Java developers
description: IDE integrations, emulators, resource explorers, and command-line interfaces for Java developers working on Azure.
author: KarlErickson
ms.author: karler
ms.topic: article
ms.date: 11/13/2018
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
---

# Azure tools for Java developers

This article describes common tools available for developers using Azure for Java.

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) is a lightweight but powerful code editor available for macOS, Windows, and Linux. VS Code supports a simple, modern Java development workflow through a set of extensions that provide project support, code completion, debugging, linting, and navigation.

[Get Started with Visual Studio Code and Java](https://code.visualstudio.com/docs/java)
[Java extension pack for Visual Studio Code](https://code.visualstudio.com/docs/java/extensions)

## Eclipse and IntelliJ plugins

Manage Azure resources and deploy apps from your IDE with The Azure toolkits for [Eclipse](../toolkit-for-eclipse/index.yml) and [IntelliJ](../toolkit-for-intellij/index.yml).

![IntelliJ toolkit showing the Azure Explorer](media/intelliJ-azure-explorer.png)

[Get started with Azure Toolkit for Eclipse](/azure/app-service-web/app-service-web-eclipse-create-hello-world-web-app) | [Get started with Azure Toolkit for IntelliJ](/azure/app-service-web/app-service-web-intellij-create-hello-world-web-app)

## Apache Maven and Gradle plugins

Deploy Java applications to Azure with ease by configuring Azure plugins as part of your Maven or Gradle builds. Currently, the plugins support Azure App Service, Azure Functions, and Azure Spring Apps.

- [Azure Plugins for Gradle](https://github.com/microsoft/azure-gradle-plugins)
- [Azure Plugins for Apache Maven](https://github.com/microsoft/azure-maven-plugins)
- [Maven Archetypes for Azure Services](https://github.com/Microsoft/azure-maven-archetypes)

## Supported Java runtimes

Java developers are free to use the distribution and version of Java of their choice for most Microsoft Azure and Azure Stack services. For more information, see [Java support on Azure and Azure Stack](java-support-on-azure.md).

## Azure CLI

The Azure CLI provides a command-line experience to manage Azure resources. You can use it in your browser with [Azure Cloud Shell](/azure/cloud-shell/overview), or you can [install](/cli/azure/install-azure-cli) it on macOS, Linux, and Windows and run it from the command line.

[Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

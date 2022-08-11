---
title: Azure Developer CLI vs. Azure CLI (preview)
description: Learn more about the difference between Azure Developer CLI and the Azure CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/10/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI vs. Azure CLI (preview)

Azure Developer CLI and Azure CLI - what's the difference?

The new Azure Developer CLI builds upon the experience and foundations of the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). You can use both tools together, as needed, to support your Azure workflow.

**Azure Developer CLI** focuses on **the developer workflow**. Apart from provisioning/managing Azure resources, the CLI helps to stitch cloud components, local development configuration, and pipeline automation together into a complete solution.

**Azure CLI** is a control plane tool for creating and administering Azure infrastructure, such as virtual machines, virtual networks, and storage.

## Azure Developer CLI history

In the early iteration, Azure Developer CLI was an Azure CLI extension written in Python. Based on user feedback, we made a strategic decision to convert to a standalone Azure Developer CLI written in Go, which is more portable.

## `azd` templates vs. Azure CLI

In the Azure CLI, `az deployment` deploys ARM templates, with 100% focus on the creation and provision of cloud infrastructure (Azure resources) needed to run your app.

In the Azure Developer CLI, we use bicep templates, as it's a more declarative and maintainable revision of the ARM template language.

## Limitations

Currently, Azure Developer CLI has a dependency on Azure CLI, calling Az CLI under the hood.

## Next steps

- [Learn more about Azure Developer CLI](./overview.md).
- [Install the CLI](./install-azd.md)
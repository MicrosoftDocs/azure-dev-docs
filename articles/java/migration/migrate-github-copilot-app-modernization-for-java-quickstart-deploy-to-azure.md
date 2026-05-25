---
title: "Quickstart: Deploy Your Project to Azure by Using GitHub Copilot Modernization"
description: Shows you how to deploy your migrated application to Azure by using GitHub Copilot modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: honc
ms.topic: quickstart
ms.date: 03/11/2026
ai-usage: ai-assisted
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
zone_pivot_group_filename: developer/java/java-zone-pivot-groups.json
zone_pivot_groups: ide-set-one
---

# Quickstart: Deploy your project to Azure by using GitHub Copilot modernization

In this quickstart, you deploy your project to Azure by using GitHub Copilot modernization.

During development, you often need to deploy your project to a cloud environment for testing. The GitHub Copilot modernization extension automates the deployment process, deploying your migrated project to Azure and fixing any deployment errors along the way.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A GitHub account with an active [GitHub Copilot](https://github.com/features/copilot) subscription under any plan.
- One of the following IDEs:
  - The latest version of [Visual Studio Code](https://code.visualstudio.com/) (version 1.113 or later) with the following extensions:
    - [GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview). For setup instructions, see [Set up GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup). Be sure to sign in to your GitHub account within Visual Studio Code.
    - [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure). Restart Visual Studio Code after installation.
  - The latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download) (version 2023.3 or later) with the following plugins:
    - [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot) (version 1.5.59 or later). Be sure to sign in to your GitHub account within IntelliJ IDEA.
    - [GitHub Copilot modernization](https://plugins.jetbrains.com/plugin/28791-github-copilot-app-modernization). Restart IntelliJ IDEA after installation.

::: zone pivot="vscode"
[!INCLUDE [quickstart-assess-migrate-visual-studio-code.md](./includes/quickstart-deploy-to-azure-visual-studio-code.md)]
::: zone-end

::: zone pivot="intellij"
[!INCLUDE [quickstart-assess-migrate-intellij-idea.md](./includes/quickstart-deploy-to-azure-intellij-idea.md)]
::: zone-end

## Customize with your own prompts

The deployment task buttons send predefined prompts. For more control, type a custom prompt directly in the Copilot chat with Agent mode to specify the target Azure resource, subscription, resource group, scaling preferences, or environment configuration.

> [!TIP]
> Example prompts:
>
> - `"Deploy my app to the AKS cluster in subscription: <sub-id>, resource group: <rg-name>"` - target a specific Kubernetes cluster.
> - `"Deploy my containerized application to Azure Container Apps and configure auto-scaling with a minimum of 2 replicas"` - specify scaling preferences.

## See also

- [Quickstart: Prepare Azure infrastructure](migrate-github-copilot-app-modernization-for-java-quickstart-infrastructure.md)
- [GitHub Copilot modernization documentation](../../github-copilot-app-modernization/index.yml)

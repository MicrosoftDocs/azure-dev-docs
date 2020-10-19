---
title: include file 1
description: include file 1
ms.topic: include
ms.date: 06/01/2020
ms.custom: devx-track-js
---

# Deploy Deno to Azure App Service using Visual Studio Code

In this tutorial, you deploy a Deno application to Azure App Service (on Linux or Windows) using the Azure CLI.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-deno&mktingSource=vscode-tutorial-appservice-deno)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Deno](https://deno.land/#installation)
- Having Azure CLI installed and logged in

## Install or run in Azure Cloud Shell

The easiest way to get started with the Azure CLI is by running it in an Azure Cloud Shell environment through your browser. To learn about Cloud Shell, see  [Quickstart for Bash in Azure Cloud Shell](/azure/cloud-shell/quickstart).

When you're ready to install the CLI, see the [installation instructions](/cli/azure/install-azure-cli).

After installing the CLI for the first time, check that it's installed and you've got the correct version by running `az --version`.

> [!NOTE]
> If you're using the Azure classic deployment model, [install the Azure classic CLI](/cli/azure/install-classic-cli).

## Sign in

Before using any CLI commands with a local install, you need to sign in with [az login](/cli/azure/reference-index#az-login).

[!INCLUDE [interactive-login](../../azure-cli/includes/interactive-login.md)]

After logging in, you see a list of subscriptions associated with your Azure account. The subscription information with `isDefault: true` is the currently activated subscription after logging in. To select another subscription, use the [az account set](/cli/azure/account#az-account-set) command with the subscription ID to switch to. For more information about subscription selection, see [Use multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).

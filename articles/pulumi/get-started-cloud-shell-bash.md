---
title: Configure Pulumi in Azure Cloud Shell with Bash
description: Learn how to configure Pulumi in Azure Cloud Shell with Bash
keywords: azure devops pulumi cloud shell cli install configure portal interactive login rbac service principal automated script
ms.topic: how-to
ms.date: 12/30/2022
ms.custom: devx-track-pulumi, mode-api
adobe-target: true
# Customer intent: As someone new to Pulumi and Azure, I want configure Pulumi in Azure Cloud Shell using the Bash environment.
---

# Configure Pulumi in Azure Cloud Shell with Bash

[!INCLUDE [Pulumi abstract](./includes/abstract.md)]

This article presents you with the options to authenticate to Azure for use with Pulumi.

In this article, you learn how to:
> [!div class="checklist"]

> * Configure Cloud Shell
> * Display current Azure account
> * Understand common Pulumi and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials when in an explicit Pulumi provider declaration

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 2. Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## 3. Install latest version of Pulumi in Azure Cloud Shell

[!INCLUDE [install-latest-version.md](includes/install-latest-version-bash.md)]

## 4. Verify the default Azure subscription

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## 5. Authenticate Pulumi to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

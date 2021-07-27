---
title: Authenticate Terraform to Azure
description: In this article, you learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform to Azure

To use Terraform commands against your Azure subscription, you must first authenticate Terraform to that subscription. This article covers some common scenarios for authenticating to Azure.

In this article, you learn how to:
> [!div class="checklist"]
> * Understand common Terraform and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Authenticate Terraform to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group](create-resource-group.md)
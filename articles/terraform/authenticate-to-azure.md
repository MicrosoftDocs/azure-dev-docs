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
[!INCLUDE [authenticate-to-azure-checklist.md](includes/authenticate-to-azure-checklist)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Configure your environment

[!INCLUDE [terraform-configuration-options.md](includes/terraform-configuration-options.md)]

## 2    . Authenticate Terraform to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group](create-resource-group.md)
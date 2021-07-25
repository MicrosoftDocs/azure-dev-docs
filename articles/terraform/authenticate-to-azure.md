---
title: Authenticate Terraform to Azure
description: In this article, you learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell interactive authentication microsoft account subscription
ms.topic: how-to
ms.date: 07/24/2021
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate to Azure.
---

# Authenticate Terraform to Azure

Terraform only supports authenticating to Azure via the Azure CLI. Azure PowerShell is not supported. Therefore, while you can use the Azure PowerShell module when doing your Terraform work, you'll first need to authenticate to Azure using the Azure CLI. The following options illustrate some typical scenarios:

- Using Azure CLI to authenticate interactively
- Using 

## Authenticate to Azure with a Microsoft Account

[!INCLUDE [authenticate-to-azure-interactive.md](includes/authenticate-to-azure-interactive.md)]

## Authenticate Terraform to Azure using a service principal

[!INCLUDE [authenticate-to-azure-script.md](includes/authenticate-to-azure-script.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group](create-resource-group.md)
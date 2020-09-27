---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 09/27/2020
ms.author: tarcher
---

## Configure your environment

Based on your environment, install and configure Terraform:

- [Configure Terraform using Azure Cloud Shell and Azure CLI](get-started-cloud-shell.md)
- [Configure Terraform using Azure PowerShell](get-started-powershell.md)

The configuration articles also explain how to do the following tasks:

- Create a base Terraform configuration file. The file includes the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) in the `provider` block and defines an [Azure resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#what-is-a-resource-group).
- Create and apply a Terraform execution plan to "run" your code.
- Reverse an execution plan once you're finished using the resources and want to delete them.

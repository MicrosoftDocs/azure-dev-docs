---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 07/26/2021
ms.author: tarcher
---

**Key points**:

- As with any environment variable, to access an Azure subscription value from within a Terraform script, use the following syntax: `${env.<environment_variable>}`. For example, to access the `ARM_SUBSCRIPTION_ID` value, specify `${env.ARM_SUBSCRIPTION_ID}`.
- Creating and applying Terraform execution plans makes changes on the Azure subscription associated with the service principal. This fact can sometimes be confusing if you're logged into one Azure subscription and the environment variables point to a second Azure subscription. Let's look at the following example to explain. Let's say you have two Azure subscriptions: SubA and SubB. If the current Azure subscription is SubA (determined via `az account show`) while the environment variables point to SubB, any changes made by Terraform are on SubB. Therefore, you would need to log in to your SubB subscription to run Azure CLI commands or Azure PowerShell commands to view your changes.
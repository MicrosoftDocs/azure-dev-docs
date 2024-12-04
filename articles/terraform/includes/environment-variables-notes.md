---
ms.author: tarcher
ms.topic: include
ms.date: 10/23/2024
ms.custom: devx-track-terraform
---

**Key points:**

- For more information about working with environment variables in Terraform HCL, see [Reading and using environment variables in Terraform runs](https://support.hashicorp.com/hc/en-us/articles/4547786359571-Reading-and-using-environment-variables-in-Terraform-runs).
- Creating and applying Terraform execution plans makes changes on the Azure subscription associated with the service principal. This fact can sometimes be confusing if you're logged into one Azure subscription and the environment variables point to a second Azure subscription. Let's look at the following example to explain. Let's say you have two Azure subscriptions: SubA and SubB. If the current Azure subscription is SubA (determined via `az account show`) while the environment variables point to SubB, any changes made by Terraform are on SubB. Therefore, you would need to log in to your SubB subscription to run Azure CLI commands or Azure PowerShell commands to view your changes.
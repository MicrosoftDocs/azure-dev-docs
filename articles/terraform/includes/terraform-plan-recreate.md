---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/18/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

After making the changes to your configuration, recreate and apply the Terraform execution plan:

1. Run `terraform plan -out main.tfplan` to recreate the plan.
1. Run `terraform apply main.tfplan` to apply the plan.

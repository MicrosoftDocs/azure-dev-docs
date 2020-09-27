---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 09/27/2020
ms.author: tarcher
---

  **Notes:**

  - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
  - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.
  - To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).
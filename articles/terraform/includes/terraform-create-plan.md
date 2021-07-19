---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 03/15/2021
ms.author: tarcher
---

After initialization, you create an execution plan by running [terraform plan](https://www.terraform.io/docs/commands/plan.html).

```cmd
terraform plan -out <terraform_plan>.tfplan
```

[!INCLUDE [terraform-plan-notes.md](terraform-plan-notes.md)]
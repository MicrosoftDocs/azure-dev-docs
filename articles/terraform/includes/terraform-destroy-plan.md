---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 07/31/2021
ms.author: tarcher
---

When you no longer need the resources create via Terraform, do the following steps:

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) and specify the `destroy` flag.

    ```cmd
    terraform plan -destroy -out main.destroy.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](terraform-plan-notes.md)]

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```cmd
    terraform apply main.destroy.tfplan
    ```

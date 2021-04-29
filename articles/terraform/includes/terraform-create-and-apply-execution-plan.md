---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 09/27/2020
ms.author: tarcher
---

## Create and apply a Terraform execution plan

In this section, you learn how to create an *execution plan* and apply it to your cloud infrastructure.

1. To initialize the Terraform deployment, run [terraform init](https://www.terraform.io/docs/commands/init.html). This command downloads the Azure modules required to create an Azure resource group.

    ```cmd
    terraform init
    ```

1. After initialization, you create an execution plan by running [terraform plan](https://www.terraform.io/docs/commands/plan.html).

    ```cmd
    terraform plan -out <terraform_plan>.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](terraform-plan-notes.md)]

1. Once you're ready to apply the execution plan to your cloud infrastructure, you run [terraform apply](https://www.terraform.io/docs/commands/apply.html).

    ```cmd
    terraform apply <terraform_plan>.tfplan
    ```

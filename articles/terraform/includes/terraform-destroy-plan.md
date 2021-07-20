---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 07/20/2021
ms.author: tarcher
---

1. To reverse, or undo, the execution plan, run [terraform plan](https://www.terraform.io/docs/commands/plan.html) and specify the `destroy` flag.

    ```cmd
    terraform plan -destroy -out main.destroy.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](terraform-plan-notes.md)]

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```cmd
    terraform apply main.destroy.tfplan
    ```

**Key points:**

- If you rerun the steps in the [Verify results](#6-verify-results) section, you see that the changes to your Azure subscription have been undone.
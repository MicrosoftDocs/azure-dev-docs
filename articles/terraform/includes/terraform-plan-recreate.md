---
ms.author: tarcher
ms.topic: include
ms.date: 01/28/2022
ms.custom: devx-track-terraform
---

After making the changes to your configuration, recreate and apply the Terraform execution plan:

1. Run `terraform plan -out main.tfplan` to recreate the plan.
1. Run `terraform apply main.tfplan` to apply the plan.

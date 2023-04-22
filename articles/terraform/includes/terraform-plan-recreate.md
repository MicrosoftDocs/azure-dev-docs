---
ms.author: tarcher
ms.topic: include
ms.date: 04/22/2023
ms.custom: devx-track-terraform
---

After making the changes to your configuration, recreate and apply the Terraform execution plan:

1. Run `terraform plan -out main.tfplan` to recreate the plan.
1. Run `terraform apply main.tfplan` to apply the plan.

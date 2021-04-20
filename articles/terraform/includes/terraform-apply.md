---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 03/15/2021
ms.author: tarcher
---

Once you're ready to apply the execution plan to your cloud infrastructure, you run [terraform apply](https://www.terraform.io/docs/commands/apply.html).

```cmd
terraform apply <terraform_plan>.tfplan
```

**Notes:**

- The usage of the `terraform apply` command above assumes you used the optional `-out` parameter when you ran `terraform plan`.
- If you specified the `-out` parameter when you ran `terraform plan`, replace the `<terraform_plan>` placeholder with that parameter value.
- If you didn't use the `-out` parameter when you ran `terraform plan`, simply call `terraform apply` without any parameters.
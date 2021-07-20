---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 09/19/2021
ms.author: tarcher
---

Once you're ready to apply the execution plan to your cloud infrastructure, you run [terraform apply](https://www.terraform.io/docs/commands/apply.html).

```cmd
terraform apply main.tfplan
```

**Key points:**

- The `terraform apply` command above assumes you previously ran `terraform plan -out main.tfplan`.
- If you specified a different filename for the `-out` parameter, you'll need to specify that filename in the call to `terraform apply`.
- If you didn't use the `-out` parameter, simply call `terraform apply` without any parameters.
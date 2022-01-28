---
ms.author: tarcher
ms.topic: include
ms.date: 01/04/2022
ms.custom: devx-track-terraform
---

Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan to your cloud infrastructure.

```cmd
terraform apply main.tfplan
```

**Key points:**

- The `terraform apply` command above assumes you previously ran `terraform plan -out main.tfplan`.
- If you specified a different filename for the `-out` parameter, use that same filename in the call to `terraform apply`.
- If you didn't use the `-out` parameter, simply call `terraform apply` without any parameters.

---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

> [!IMPORTANT]
> The *application.yml* file of the application currently holds the value of your client secret in the `client-secret` parameter. It isn't good practice to keep this value in this file. You might also be taking a risk if you commit it to a Git repository.
>
> As an extra security step, you can store this value in [Azure Key Vault](/azure/key-vault/general/basic-concepts) and [load the secret from Key Vault](../../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault.md) to make it available in your application.

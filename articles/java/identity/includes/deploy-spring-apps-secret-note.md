---
ms.author: givermei
ms.date: 03/11/2024
---

> [!IMPORTANT]
> The *application.yml* file of the application currently holds the value of your client secret in the `client-secret` parameter. It isn't good practice to keep this value in this file. You might also risk committing it to a Git repository. Because this is a secret value it should be treated as such. As an extra step you can store this value in [Key Vault](/azure/key-vault/general/basic-concepts) and [load the secret from Key Vault](../../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault.md) to make it available in your web application.

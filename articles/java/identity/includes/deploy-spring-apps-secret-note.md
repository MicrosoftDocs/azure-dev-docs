---
ms.author: givermei
ms.date: 01/01/2024
ms.custom: devx-track-java
---

> [!IMPORTANT]
> The *application.yml* file of the application currently holds the value of your client secret in the `client-secret` parameter. It is not good practice to keep this value in this file. You might also risk committing it to a Git repository. Since this is a secret value it should be treated as such. As an extra step you can store this value in [Key Vault](/azure/key-vault/general/basic-concepts) and [load the secret from Key Vault](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault) to make it available in your web application.

---
ms.author: givermei
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

> [!IMPORTANT]
> In this same `application.yml` file you have a setting for your `client-secret`. It is not a good practice to deploy this value to Azure Spring Apps. Neither is it a good practice to leave this value in your code and potentially push it up to your git repository. For removing this secret value from your code, you can find more detailed guidance in the [Deploy to Azure Spring APps - Remove secret](../deploy-spring-boot-to-azure-spring-apps.md) section. This guidance adds extra steps for pushing the secret value to [Key Vault](/azure/key-vault/general/basic-concepts) and to [Load application secrets using Key Vault](/azure/spring-apps/enterprise/quickstart-key-vault-enterprise). 

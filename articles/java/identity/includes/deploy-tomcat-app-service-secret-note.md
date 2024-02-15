---
ms.author: givermei
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

> [!IMPORTANT]
> In this same `authentication.properties` file you have a setting for your `aad.secret`. It is not a good practice to deploy this value to App Service. Neither is it a good practice to leave this value in your code and potentially push it up to your git repository. For removing this secret value from your code, you can find more detailed guidance in the [Deploy to App Service - Remove secret](../tomcat-deploy-to-app-service.md#remove-secret-values) section. This guidance adds extra steps for pushing the secret value to [Key Vault](/azure/key-vault/general/basic-concepts) and to use [Key Vault References](/azure/app-service/app-service-key-vault-references?tabs=azure-cli). 

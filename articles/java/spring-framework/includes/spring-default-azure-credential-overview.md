---
ms.date: 07/21/2023
ms.author: karler
ms.reviewer: seal
author: KarlErickson
---

> [!TIP]
> In this tutorial, there are no authentication operations in the configurations or the code. However, connecting to Azure services requires authentication. To complete the authentication, you need to use Azure Identity. Spring Cloud Azure uses `DefaultAzureCredential`, which the Azure Identity library provides to help you get credentials without any code changes.
>
> `DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments (such as local and production environments) without implementing environment-specific code. For more information, see [DefaultAzureCredential](../../sdk/authentication/azure-hosted-apps.md#defaultazurecredential).
>
> To complete the authentication in local development environments, you can use Azure CLI, Visual Studio Code, PowerShell, or other methods. For more information, see [Azure authentication in Java development environments](../../sdk/authentication/dev-env.md). To complete the authentication in Azure hosting environments, we recommend using user-assigned managed identity. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

---
ms.date: 03/27/2023
author: KarlErickson
ms.author: hangwan
---

## Prepare your local environment

In this tutorial, the configurations and code don't have any authentication operations. However, connecting to an Azure service requires authentication. To complete the authentication, you need to use the Azure Identity client library. Spring Cloud Azure uses `DefaultAzureCredential`, which the Azure Identity library provides to help you get credentials without any code changes.

`DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments - such as local or production environments - without implementing environment-specific code. For more information, see the [DefaultAzureCredential](../../sdk/authentication/azure-hosted-apps.md#defaultazurecredential) section of [Authenticate Azure-hosted Java applications](../../sdk/authentication/azure-hosted-apps.md).

To use Azure CLI, IntelliJ, or other methods to complete the authentication in local development environments, see [Azure authentication in Java development environments](../../sdk/authentication/dev-env.md). To complete the authentication in Azure hosting environments, we recommend using managed identity. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

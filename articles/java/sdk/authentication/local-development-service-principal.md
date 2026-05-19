---
title: Authenticate Java apps during local development by using service principals
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services during local development by using application service principals.
ms.date: 02/24/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Java apps to Azure services during local development by using service principals

During local development, applications need to authenticate to Azure to access various Azure services. You can authenticate locally by using one of the following approaches:

- Use a developer account with one of the developer tools supported by the Azure Identity library. For more information, see [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md).
- Use a service principal.

This article explains how to use an application service principal. For more information about service principals, see [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals). In this article, you learn:

- How to register an application with Microsoft Entra to create a service principal.
- How to use Microsoft Entra groups to efficiently manage permissions.
- How to assign roles to scope permissions.
- How to authenticate by using a service principal from your app code.

Using dedicated application service principals enables you to follow the principle of least privilege when accessing Azure resources. You can limit permissions to the specific requirements of the app during development to prevent accidental access to Azure resources intended for other apps or services. This approach also helps you avoid problems when you move the app to production by ensuring it isn't over-privileged in the development environment.

:::image type="content" source="../../../includes/authentication/media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram that shows how a local Java app uses a service principal to connect to Azure resources.":::

When you register the app in Azure, an application service principal is created. For local development, you should:

- Create a separate app registration for each developer working on the app so each developer has their own application service principal and doesn't need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, set environment variables with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.

[!INCLUDE [create-app-registration](../../../includes/authentication/create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

## Set the app environment variables

At runtime, certain credentials from the [Azure Identity library](/java/api/com.azure.identity), such as `DefaultAzureCredential`, `EnvironmentCredential`, and `ClientSecretCredential`, search for service principal information by convention in the environment variables. When working with Java, you can configure environment variables in different ways depending on your tooling and environment.

Regardless of the approach you choose, configure the following environment variables for a service principal:

- `AZURE_CLIENT_ID`: Used to identify the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that was generated for the app.

#### [Bash](#tab/bash)

Add the following lines to your `~/.bashrc` or `~/.zshrc` file. Replace the placeholder values with the actual values from your app registration:

```bash
export AZURE_CLIENT_ID="<your-client-id>"
export AZURE_TENANT_ID="<your-tenant-id>"
export AZURE_CLIENT_SECRET="<your-client-secret>"
```

After editing the file, run `source ~/.bashrc` or `source ~/.zshrc` to apply the changes to your current session.

#### [Visual Studio Code](#tab/vscode-env)

Configure environment variables in `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Launch App",
            "request": "launch",
            "mainClass": "com.example.App",
            "env": {
                "AZURE_CLIENT_ID": "<your-client-id>",
                "AZURE_TENANT_ID": "<your-tenant-id>",
                "AZURE_CLIENT_SECRET": "<your-client-secret>"
            }
        }
    ]
}
```

#### [IntelliJ IDEA](#tab/intellij-env)

Configure environment variables in the run configuration:

1. Select **Run > Edit Configurations...**.
1. Select your application configuration.
1. In the **Environment variables** field, add your variables:

   ```text
   AZURE_CLIENT_ID=<your-client-id>;AZURE_TENANT_ID=<your-tenant-id>;AZURE_CLIENT_SECRET=<your-client-secret>
   ```

1. Select **Apply** and then **OK**.

---

[!INCLUDE [authenticate-azure-services-from-app](includes/authenticate-azure-services-from-app.md)]

## Next steps

This article covered authentication through a service principal. This form of authentication is one of many ways you can authenticate in the Azure SDK for Java. The following articles describe other ways to authenticate:

- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate Azure-hosted Java apps to Azure resources by using a user-assigned managed identity](user-assigned-managed-identity.md)

If you run into problems related to service principal authentication, see [Troubleshoot service principal authentication](../troubleshooting-authentication-service-principal.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

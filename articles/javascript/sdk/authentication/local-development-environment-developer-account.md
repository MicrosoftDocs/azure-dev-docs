---
title: Authenticate Node.js Apps to Azure Using Developer Accounts
description: Learn how to authenticate your application to Azure services when using the Azure SDK for Node.js during local development using developer accounts.
ms.topic: how-to
ms.date: 01/20/2026
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - devx-track-js
  - sfi-image-nochange

---

# Authenticate Node.js apps to Azure services during local development using developer accounts

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a service principal](local-development-environment-service-principal.md) or to use a developer account. This article explains how to use a developer account. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts
- How to assign roles to developer accounts to scope permissions
- How to sign-in to supported local development tools
- How to authenticate using a developer account from your app code

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from one of the following developer tools:

- Azure CLI
- Azure Developer CLI
- Azure PowerShell
- Visual Studio Code

The Azure Identity library can detect that the developer is signed-in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](./local-development-environment-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

[!INCLUDE [sign-in-dev-tooling](../../../includes/authentication/developer-tooling.md)]

[!INCLUDE [Implement DefaultAzureCredential](./includes/implement-default-azure-credential.md)]

## Authenticate to Azure services from your app

The [Azure Identity library](https://learn.microsoft.com/en-us/javascript/api/%40azure/identity) provides implementations of [TokenCredential](/javascript/api/%40azure/identity/tokencredential) that support various scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) or a specific development tool credential when working with user accounts locally.

### Implement the code 


Complete the following steps:

1. Add references to the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) and the [Microsoft.Extensions.Azure](https://www.nuget.org/packages/Microsoft.Extensions.Azure) packages in your project:

    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package Microsoft.Extensions.Azure
    ```

1. In `Program.cs`, add `using` directives for the `Azure.Identity` and `Microsoft.Extensions.Azure` namespaces.

1. Register the Azure service client using the corresponding `Add`-prefixed extension method.

    Azure services are accessed using specialized client classes from the Azure SDK client libraries. Register these client types so you can access them through dependency injection across your app.

1. Pass a `TokenCredential` instance to the `UseCredential` method. Common `TokenCredential` examples include:

    - A `DefaultAzureCredential` instance optimized for local development. This example sets environment variable `AZURE_TOKEN_CREDENTIALS` to `dev`. For more information, see [Exclude a credential type category](credential-chains.md#exclude-a-credential-type-category).

      :::code language="csharp" source="../snippets/authentication/local-dev-account/Program.cs" id="snippet_DefaultAzureCredentialDev":::

    - An instance of a credential corresponding to a specific development tool, such as `VisualStudioCredential`.

      :::code language="csharp" source="../snippets/authentication/local-dev-account/Program.cs" id="snippet_VisualStudioCredential":::

    > [!TIP]
    > When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials.

---

Complete the following steps:

1. Add the [`@azure/identity`](https://www.npmjs.com/package/@azure/identity) package to your project:

    ```bash
    npm install @azure/identity
    ```

1. Import the `DefaultAzureCredential` class from `@azure/identity` in your application code.

1. Create a `DefaultAzureCredential` instance and use it to authenticate Azure SDK client objects. For example, to list Azure subscriptions:

    ```javascript
    import { DefaultAzureCredential } from "@azure/identity";
    import { SubscriptionClient } from "@azure/arm-subscriptions";

    // Acquire credential
    const credential = new DefaultAzureCredential();

    async function listSubscriptions() {
      try {
        const client = new SubscriptionClient(credential);
        for await (const item of client.subscriptions.list()) {
          const subscriptionDetails = await client.subscriptions.get(item.subscriptionId);
          console.log(subscriptionDetails);
        }
      } catch (err) {
        console.error(JSON.stringify(err));
      }
    }

    listSubscriptions()
      .then(() => {
        console.log("done");
      })
      .catch((ex) => {
        console.log(ex);
      });
    ```

    > [!TIP]
    > When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials. `DefaultAzureCredential` will automatically use the credentials from the signed-in developer tool (such as Azure CLI, Azure PowerShell, or Visual Studio Code) for local development.
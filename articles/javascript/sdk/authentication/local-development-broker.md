---
title: Authenticate JavaScript apps to Azure using brokered authentication.
ms.reviewer: diberry
ms.author: diberry
author: diberry
description: Learn how to authenticate your app to Azure services when using the Azure SDK for JavaScript during local development using brokered authentication.
ms.date: 11/13/2025
ms.topic: how-to
ms.custom: devx-track-js
zone_pivot_group_filename: developer/pivots.yml
zone_pivot_groups: pivot-os-windows-linux
---

# Authenticate JavaScript apps to Azure services during local development using brokered authentication

[!INCLUDE [broker-intro](../../../includes/authentication/includes/broker-intro.md)]

:::zone target="docs" pivot="os-windows"

[!INCLUDE [broker-windows](../../../includes/authentication/includes/broker-windows.md)]

:::zone-end

:::zone target="docs" pivot="os-linux"

[!INCLUDE [broker-linux](../../../includes/authentication/includes/broker-linux.md)]

:::zone-end

[!INCLUDE [broker-configure-app](../../../includes/authentication/includes/broker-configure-app.md)]

[!INCLUDE [broker-assign-roles](../../../includes/authentication/includes/broker-assign-roles.md)]

## Implement the code

The Azure Identity library supports brokered authentication using [InteractiveBrowserCredential](/javascript/api/@azure/identity/interactivebrowsercredential). For example, to use `InteractiveBrowserCredential` in an Node.js console app to authenticate to Azure Key Vault with the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient), follow these steps:

1. Install the [@azure/identity](https://www.npmjs.com/package/@azure/identity) and [@azure/identity-broker](https://www.npmjs.com/package/@azure/identity-broker) packages:

   ```bash
   npm install @azure/identity @azure/identity-broker
   ```

1. Create an instance of [InteractiveBrowserCredential](/javascript/api/@azure/identity/interactivebrowsercredential) using broker options and register the native broker plugin:

    :::code language="typescript" source="~/../azure-sdk-for-js-docs/samples/identity/credentials/src/broker.ts" id="BROKER":::

> [!TIP]
> View the [complete sample app code](https://github.com/Azure-Samples/azure-sdk-for-js-docs/blob/main/samples/identity/credentials/src/broker.ts) in the Azure SDK for JavaScript GitHub repository.

In the preceding example, property `useDefaultBrokerAccount` is set to `true`, which opts into a silent, brokered authentication flow with the default system account. In this way, the user doesn't have to repeatedly select the same account. If silent, brokered authentication fails, or `useDefaultBrokerAccount` is set to `false`, `InteractiveBrowserCredential` falls back to interactive, brokered authentication.

:::zone target="docs" pivot="os-windows"

The following screenshot shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-web-account-manager-account-picker.png" alt-text="A screenshot that shows the Windows sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user.":::

:::zone-end

:::zone target="docs" pivot="os-linux"

The following video shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-linux-login.gif" alt-text="An animated gif that shows the Linux sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user.":::

:::zone-end

## Related content

- [Authenticate JavaScript apps to Azure services by using the Azure SDK for JavaScript](overview.md)
- [Authenticate JavaScript apps to Azure services during local development](local-development-environment-service-principal.md)
- [Azure Identity library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity)
- [Azure Identity Broker library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity-broker)
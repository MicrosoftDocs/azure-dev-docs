---
title: Authenticate Java Apps to Azure Using Brokered Auth
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services during local development by using brokered authentication with the Azure Identity library.
ms.date: 02/24/2026
ms.topic: how-to
ms.custom: devx-track-java
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Java apps to Azure services during local development by using brokered authentication

[!INCLUDE [broker-introduction](../../../includes/authentication/broker-introduction.md)]

[!INCLUDE [broker-windows](../../../includes/authentication/broker-windows.md)]

[!INCLUDE [broker-configure-application](../../../includes/authentication/broker-configure-application.md)]

[!INCLUDE [broker-assign-roles](../../../includes/authentication/broker-assign-roles.md)]

## Implement brokered authentication code

The Azure Identity library supports brokered authentication by using [InteractiveBrowserCredential](/java/api/com.azure.identity.interactivebrowsercredential). The [azure-identity-broker](https://central.sonatype.com/artifact/com.azure/azure-identity-broker) library provides `InteractiveBrowserBrokerCredentialBuilder`, which creates an `InteractiveBrowserCredential` capable of using the system authentication broker. For example, to use brokered authentication in a Java console app to authenticate to Azure Key Vault with the [SecretClient](/java/api/com.azure.security.keyvault.secrets.secretclient), follow these steps:

1. Add the `azure-identity-broker` dependency to your `pom.xml` file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity-broker</artifactId>
    </dependency>
    ```

1. Get a reference to the parent window on top of which the account picker dialog should appear. For platform-specific examples, see [Get a window handle](#get-a-window-handle).

1. Create an instance of `InteractiveBrowserCredential` using `InteractiveBrowserBrokerCredentialBuilder`:

    ```java
    import com.azure.identity.InteractiveBrowserCredential;
    import com.azure.identity.broker.    InteractiveBrowserBrokerCredentialBuilder;
    import com.azure.security.keyvault.secrets.SecretClient;
    import com.azure.security.keyvault.secrets.SecretClientBuilder;
    import com.azure.security.keyvault.secrets.models.KeyVaultSecret;
    
    long windowHandle = getWindowHandle(); // See examples below
    
    InteractiveBrowserCredential credential = new     InteractiveBrowserBrokerCredentialBuilder()
        .setWindowHandle(windowHandle)
        .useDefaultBrokerAccount()
        .build();
    
    SecretClient client = new SecretClientBuilder()
        .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
        .credential(credential)
        .buildClient();
    
    KeyVaultSecret secret = client.getSecret("MySecret");
    System.out.println("Retrieved secret: " + secret.getName());
    ```

In the preceding example, `useDefaultBrokerAccount` opts into a silent, brokered authentication flow with the default system account. In this way, the user doesn't have to repeatedly select the same account. If silent, brokered authentication fails, `InteractiveBrowserCredential` falls back to interactive, brokered authentication.

The following screenshot shows the alternative interactive, brokered authentication experience:

:::image type="content" source="../../../includes/authentication/media/broker-web-account-manager-account-picker.png" alt-text="Screenshot of the Windows sign-in experience when using a broker-enabled InteractiveBrowserCredential instance to authenticate a user." lightbox="../../../includes/authentication/media/broker-web-account-manager-account-picker.png":::

### Get a window handle

When you authenticate interactively by using `InteractiveBrowserCredential`, you need a parent window handle to make sure the authentication dialog appears correctly over the window that sends the request.

#### JavaFX application

For a JavaFX application, use JNA (Java Native Access) to get the window handle:

```java
import com.sun.jna.Pointer;
import com.sun.jna.platform.win32.User32;
import com.sun.jna.platform.win32.WinDef;

public long getWindowHandle(Stage stage) {
    WinDef.HWND hwnd = User32.INSTANCE.FindWindow(null, stage.getTitle());
    return Pointer.nativeValue(hwnd.getPointer());
}
```

#### Console application

For a console application on Windows, use JNA to get the console window handle:

```java
import com.sun.jna.Pointer;
import com.sun.jna.platform.win32.Kernel32;
import com.sun.jna.platform.win32.WinDef;

WinDef.HWND hwnd = Kernel32.INSTANCE.GetConsoleWindow();
long windowHandle = Pointer.nativeValue(hwnd.getPointer());
```

## Related content

- [Authenticate Java apps to Azure services by using the Azure Identity library](overview.md)
- [Authenticate Java apps to Azure services during local development by using developer accounts](local-development-dev-accounts.md)
- [Azure Identity library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity)
- [Azure Identity Broker library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity-broker)

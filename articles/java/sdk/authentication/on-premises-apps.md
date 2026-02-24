---
title: Authenticate to Azure Resources From On-Premises Java Apps
titleSuffix: Azure SDK for Java
description: Learn how to authenticate on-premises Java apps to Azure services using the Azure SDK for Java. Set up service principals, assign roles, and configure credentials.
ms.date: 02/23/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate to Azure resources from Java apps hosted on-premises

Apps hosted outside of Azure, such as on-premises or in a third-party data center, should use an application service principal through [Microsoft Entra ID](/entra/fundamentals/whatis) to authenticate to Azure services. In the following sections, you learn:

- How to register an application with Microsoft Entra to create a service principal.
- How to assign roles to scope permissions.
- How to authenticate by using a service principal from your app code.

By using dedicated application service principals, you can follow the principle of least privilege when accessing Azure resources. Limit permissions to the specific requirements of the app during development to prevent accidental access to Azure resources intended for other apps or services. This approach also helps you avoid problems when moving the app to production by ensuring the app isn't over-privileged in the development environment.

Create a different app registration for each environment where you host the app. You can configure environment-specific resource permissions for each service principal and ensure an app deployed to one environment doesn't access Azure resources in another environment.

[!INCLUDE [authenticate-create-app-registration](../../../includes/authentication/includes/authenticate-create-app-registration.md)]

[!INCLUDE [authentication-assign-service-principal-roles](../../../includes/authentication/includes/authentication-assign-service-principal-roles.md)]

## Set the app environment variables

At runtime, certain credentials from the [Azure Identity library](/java/api/com.azure.identity), such as `DefaultAzureCredential`, `EnvironmentCredential`, and `ClientSecretCredential`, search for service principal information by convention in the environment variables. When working with Java, you can configure environment variables in multiple ways, depending on your tooling and environment.

Regardless of the approach you choose, configure the following environment variables for a service principal:

- `AZURE_CLIENT_ID`: Used to identify the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that was generated for the app.

### [Bash](#tab/bash)

Set the following environment variables. Replace the placeholder values with the actual values from your app registration:

```bash
export AZURE_CLIENT_ID="<your-client-id>"
export AZURE_TENANT_ID="<your-tenant-id>"
export AZURE_CLIENT_SECRET="<your-client-secret>"
```

For a Java application running as a systemd service on a production server, define the environment variables in a file and reference it with the `EnvironmentFile` directive in the service unit file:

```ini
[Unit]
Description=Java application service
After=network.target

[Service]
User=app-user
WorkingDirectory=/path/to/java-app
EnvironmentFile=/path/to/java-app/app-environment-variables
ExecStart=/usr/bin/java -jar app.jar

[Install]
WantedBy=multi-user.target
```

The environment file should contain a list of environment variables with their values:

```bash
AZURE_CLIENT_ID=<your-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_SECRET=<your-client-secret>
```

### [Visual Studio Code](#tab/vs-code)

In Visual Studio Code, set environment variables in the `.vscode/launch.json` file of your project. The app automatically uses these values when it starts. However, these configurations don't travel with your app during deployment, so you need to set up environment variables on your target hosting environment.

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

### [IntelliJ IDEA](#tab/intellij-env)

Configure environment variables in the run configuration:

1. Select **Run > Edit Configurations...**.
1. Select your application configuration.
1. In the **Environment variables** field, add your variables:

   ```text
   AZURE_CLIENT_ID=<your-client-id>;AZURE_TENANT_ID=<your-tenant-id>;AZURE_CLIENT_SECRET=<your-client-secret>
   ```

1. Select **Apply** and then **OK**.

### [Windows](#tab/windows)

You can set environment variables for Windows from the command line. However, all apps running on that operating system can access the values, which could cause conflicts. Use caution with this approach. You can set environment variables at the user or system level.

```cmd
# Set user environment variables
setx AZURE_CLIENT_ID "<your-client-id>"
setx AZURE_TENANT_ID "<your-tenant-id>"
setx AZURE_CLIENT_SECRET "<your-client-secret>"

# Set system environment variables - requires running as admin
setx AZURE_CLIENT_ID "<your-client-id>" /m
setx AZURE_TENANT_ID "<your-tenant-id>" /m
setx AZURE_CLIENT_SECRET "<your-client-secret>" /m
```

You can also use PowerShell to set environment variables at the user or system level:

```powershell
# Set user environment variables
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "User")

# Set system environment variables - requires running as admin
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "Machine")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "Machine")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "Machine")
```

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various *credentials* - implementations of `TokenCredential` that support different scenarios and Microsoft Entra authentication flows. The following steps show you how to use [ClientSecretCredential](/java/api/com.azure.identity.clientsecretcredential) when you work with service principals locally and in production.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the various Azure SDK client libraries. For any Java code that creates an Azure SDK client object in your app, follow these steps:

1. Import the `ClientSecretCredentialBuilder` class from the `com.azure.identity` package.
1. Create a `ClientSecretCredential` object by using `ClientSecretCredentialBuilder` with the `tenantId`, `clientId`, and `clientSecret`.
1. Pass the `ClientSecretCredential` instance to the Azure SDK client object builder's `credential` method.

An example of this approach is shown in the following code segment:

```java
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;

String tenantId = System.getenv("AZURE_TENANT_ID");
String clientId = System.getenv("AZURE_CLIENT_ID");
String clientSecret = System.getenv("AZURE_CLIENT_SECRET");

ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    .tenantId(tenantId)
    .clientId(clientId)
    .clientSecret(clientSecret)
    .build();

BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .endpoint("https://<account-name>.blob.core.windows.net")
    .credential(credential)
    .buildClient();
```


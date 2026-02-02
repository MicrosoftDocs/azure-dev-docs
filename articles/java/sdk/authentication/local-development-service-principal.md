---
title: Authenticate Java apps during local development by using service principals
titleSuffix: Azure SDK for Java
description: Learn how to authenticate Java apps to Azure services during local development by using application service principals.
ms.date: 02/02/2026
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli
author: bmitchell287
ms.author: brendm
ms.reviewer: vigera
ai-usage: ai-generated
---

# Authenticate Java apps to Azure services during local development by using service principals

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a developer account](local-development-dev-accounts.md) or a service principal. This article explains how to use an application service principal. For more information about service principals, see [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals). In the sections ahead, you learn:

- How to register an application with Microsoft Entra to create a service principal.
- How to use Microsoft Entra groups to efficiently manage permissions.
- How to assign roles to scope permissions.
- How to authenticate by using a service principal from your app code.

Using dedicated application service principals enables you to follow the principle of least privilege when accessing Azure resources. You can limit permissions to the specific requirements of the app during development to prevent accidental access to Azure resources intended for other apps or services. This approach also helps you avoid problems when you move the app to production by ensuring it isn't over-privileged in the development environment.

When you register the app in Azure, an application service principal is created. For local development:

- Create a separate app registration for each developer working on the app so each developer has their own application service principal and doesn't need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, set environment variables with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.

## Register the app in Azure

Create application service principal objects through an app registration in Azure by using either the Azure portal or the Azure CLI.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, use the search bar to go to the **App registrations** page.
1. On the **App registrations** page, select **+ New registration**.
1. On the **Register an application** page:
   - For the **Name** field, enter a descriptive value that includes the app name and the target environment.
      - For **Supported account types**, select **Accounts in this organizational directory only (Microsoft Customer Led only - Single tenant)**, or select the option that best fits your requirements.
1. Select **Register** to register your app and create the service principal.
1. On the **App registration** page for your app, copy the **Application (client) ID** and **Directory (tenant) ID** and paste them in a temporary location for later use in your app code configurations.
1. Select **Add a certificate or secret** to set up credentials for your app.
1. On the **Certificates & secrets** page, select **+ New client secret**.
1. In the **Add a client secret** flyout panel that opens:
   - For the **Description**, enter a value of **Current**.
   - For the **Expires** value, keep the default recommended value of **180 days**.
   - Select **Add** to add the secret.
1. On the **Certificates & secrets** page, copy the **Value** property of the client secret for use in a future step.

> [!NOTE]
> The client secret value appears only once after the app registration is created. You can add more client secrets without invalidating this client secret, but there's no way to display this value again.

#### [Azure CLI](#tab/azure-cli)

Use the following command to create a service principal and configure its access to Azure resources:

```azurecli
az ad sp create-for-rbac \
    --name <your-application-name> \
    --role Contributor \
    --scopes /subscriptions/<your-subscription-id>
```

This command returns a value similar to the following output:

```output
{
  "appId": "generated-app-ID",
  "displayName": "app-name",
  "name": "http://app-name",
  "password": "random-password",
  "tenant": "tenant-ID"
}
```

Check the returned credentials and note the following information:

- `appId` is the `AZURE_CLIENT_ID`.
- `password` is the `AZURE_CLIENT_SECRET`.
- `tenant` is the `AZURE_TENANT_ID`.

Alternatively, use the following command to create a service principal along with a self-signed certificate:

```azurecli
az ad sp create-for-rbac \
    --name <your-application-name> \
    --role Contributor \
    --cert <certificate-name> \
    --create-cert
```

Note the path and location of the certificate for use with `ClientCertificateCredential`.

---

## Create a Microsoft Entra group for local development

Create a Microsoft Entra group to encapsulate the roles (permissions) the app needs in local development rather than assigning the roles to individual service principal objects. This approach offers the following advantages:

- Every developer has the same roles assigned at the group level.
- If a new role is needed for the app, add it to the group.
- If a new developer joins the team, create a new application service principal for the developer and add it to the group, ensuring the developer has the right permissions to work on the app.

#### [Azure portal](#tab/azure-portal)

1. Go to the **Microsoft Entra ID** overview page in the Azure portal.
1. Select **All groups** from the left-hand menu.
1. On the **Groups** page, select **New group**.
1. On the **New group** page, fill out the following form fields:
   - **Group type**: Select **Security**.
   - **Group name**: Enter a name for the group that includes a reference to the app or environment name.
   - **Group description**: Enter a description that explains the purpose of the group.
1. Select the **No members selected** link under **Members** to add members to the group.
1. In the flyout panel that opens, search for the service principal you created earlier and select it from the filtered results. Choose the **Select** button at the bottom of the panel to confirm your selection.
1. Select **Create** at the bottom of the **New group** page to create the group and return to the **All groups** page. If you don't see the new group listed, wait a moment and refresh the page.

#### [Azure CLI](#tab/azure-cli)

Run the following command to create a new group:

```azurecli
az ad group create \
    --display-name <group-name> \
    --mail-nickname <group-nickname> \
    --description "<group-description>"
```

To add the service principal to the group:

```azurecli
az ad group member add \
    --group <group-name> \
    --member-id <service-principal-object-id>
```

To get the service principal's object ID:

```azurecli
az ad sp show --id <app-id> --query id --output tsv
```

---

## Assign roles to the group

Next, determine what roles (permissions) your app needs on what resources and assign those roles to the Microsoft Entra group you created. You can assign roles to groups at the resource, resource group, or subscription scope. The following example shows you how to assign roles at the resource group scope, since most apps group all their Azure resources into a single resource group.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the **Overview** page of the resource group that contains your app.
1. Select **Access control (IAM)** from the left navigation.
1. On the **Access control (IAM)** page, select **+ Add** and then choose **Add role assignment** from the drop-down menu. The **Add role assignment** page provides several tabs to configure and assign roles.
1. On the **Role** tab, use the search box to locate the role you want to assign. Select the role, and then choose **Next**.
1. On the **Members** tab:
   - For the **Assign access to** value, select **User, group, or service principal**.
   - For the **Members** value, choose **+ Select members** to open the **Select members** flyout panel.
   - Search for the Microsoft Entra group you created earlier and select it from the filtered results. Choose **Select** to select the group and close the flyout panel.
   - Select **Review + assign** at the bottom of the **Members** tab.
1. On the **Review + assign** tab, select **Review + assign** at the bottom of the page.

#### [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role to the group:

```azurecli
az role assignment create \
    --assignee "<group-object-id>" \
    --role "<role-name>" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
```

To get the group's object ID:

```azurecli
az ad group show --group <group-name> --query id --output tsv
```

---

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

In Visual Studio Code, set environment variables by using a `.env` file in your project or through the `launch.json` configuration. Create a `.env` file in your project root:

```bash
AZURE_CLIENT_ID=<your-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_SECRET=<your-client-secret>
```

Or configure environment variables in `.vscode/launch.json`:

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

In IntelliJ IDEA, configure environment variables in the run configuration:

1. Select **Run > Edit Configurations...**.
1. Select your application configuration.
1. In the **Environment variables** field, add your variables:

   ```text
   AZURE_CLIENT_ID=<your-client-id>;AZURE_TENANT_ID=<your-tenant-id>;AZURE_CLIENT_SECRET=<your-client-secret>
   ```

1. Select **Apply** and then **OK**.

---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various credentials as implementations of `TokenCredential` that support different scenarios and Microsoft Entra authentication flows. The following steps demonstrate how to use `ClientSecretCredential` when working with service principals locally and in production.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the Azure SDK client libraries. The following code samples demonstrate how to configure credentials for service principal authentication.

#### Use DefaultAzureCredential

Use `DefaultAzureCredential` for most scenarios because it automatically discovers credentials from environment variables (when configured for a service principal) and falls back to other credentials in development environments.

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

// DefaultAzureCredential automatically discovers credentials from environment variables
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ClientSecretCredential

If you want to explicitly use the service principal credentials, use `ClientSecretCredential`:

```java
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

String tenantId = System.getenv("AZURE_TENANT_ID");
String clientId = System.getenv("AZURE_CLIENT_ID");
String clientSecret = System.getenv("AZURE_CLIENT_SECRET");

ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    .tenantId(tenantId)
    .clientId(clientId)
    .clientSecret(clientSecret)
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

#### Use ClientCertificateCredential

For certificate-based authentication, use `ClientCertificateCredential`:

```java
import com.azure.identity.ClientCertificateCredential;
import com.azure.identity.ClientCertificateCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;

ClientCertificateCredential credential = new ClientCertificateCredentialBuilder()
    .tenantId("<your-tenant-id>")
    .clientId("<your-client-id>")
    .pemCertificate("<path-to-pem-certificate>")
    // Or use .pfxCertificate("<path-to-pfx-certificate>", "<pfx-password>")
    .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
    .vaultUrl("https://<your-key-vault-name>.vault.azure.net")
    .credential(credential)
    .buildClient();
```

## Next steps

This article covered authentication through a service principal. This form of authentication is one of many ways you can authenticate in the Azure SDK for Java. The following articles describe other ways to authenticate:

- [Authenticate locally using developer credentials](local-development-dev-accounts.md)
- [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)
- [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)

If you run into problems related to service principal authentication, see [Troubleshoot service principal authentication](../troubleshooting-authentication-service-principal.md).

After you master authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

---
title: Azure authentication with service principal
titleSuffix: Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to authenticating applications via service principal.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: vigera
---

# Azure authentication with service principal

This article looks at how the Azure Identity library supports Microsoft Entra token authentication via service principal. This article covers the following subjects:

* [Create a service principal with the Azure CLI](#create-a-service-principal-with-the-azure-cli)
* [Client secret credential](#client-secret-credential)
* [Client certificate credential](#client-certificate-credential)

For more information, see [Application and service principal objects in Microsoft Entra ID](/azure/active-directory/develop/app-objects-and-service-principals). For troubleshooting service principal authentication issues, see [Troubleshoot service principal authentication](../troubleshooting-authentication-service-principal.md).

## Create a service principal with the Azure CLI

Use the following [Azure CLI](/cli/azure) examples to create or get client secret credentials.

Use the following command to create a service principal and configure its access to Azure resources:

```azurecli
az ad sp create-for-rbac \
    --name <your application name> \
    --role Contributor \
    --scopes /subscriptions/mySubscriptionID
```

This command returns a value similar to the following output:

```output
{
"appId": "generated-app-ID",
"displayName": "dummy-app-name",
"name": "http://dummy-app-name",
"password": "random-password",
"tenant": "tenant-ID"
}
```

Use the following command to create a service principal along with a certificate. Note down the path/location of this certificate.

```azurecli
az ad sp create-for-rbac \
    --name <your application name> \
    --role Contributor \
    --cert <certificate name> \
    --create-cert
```

Check the returned credentials and to note down the following information:

* `AZURE\_CLIENT\_ID` for the appId.
* `AZURE\_CLIENT\_SECRET` for the password.
* `AZURE\_TENANT\_ID` for the tenant.

## Client secret credential

This credential authenticates the created service principal through its client secret (password). This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientSecretCredential`.

```java
/**
 *  Authenticate with client secret.
 */
ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
  .clientId("<your client ID>")
  .clientSecret("<your client secret>")
  .tenantId("<your tenant ID>")
  .build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(clientSecretCredential)
  .buildClient();
```

## Client certificate credential

This credential authenticates the created service principal through its client certificate. This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientCertificateCredential`.

```java
/**
 *  Authenticate with a client certificate.
 */
ClientCertificateCredential clientCertificateCredential = new ClientCertificateCredentialBuilder()
  .clientId("<your client ID>")
  .pemCertificate("<path to PEM certificate>")
  // Choose between either a PEM certificate or a PFX certificate.
  //.pfxCertificate("<path to PFX certificate>")
  //.clientCertificatePassword("PFX CERTIFICATE PASSWORD")
  .tenantId("<your tenant ID>")
  .build();

// Azure SDK client builders accept the credential as a parameter.
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://<your Key Vault name>.vault.azure.net")
  .credential(clientCertificateCredential)
  .buildClient();
```

## Next steps

This article covered authentication via service principal. This form of authentication is one of multiple ways you can authenticate in the Azure SDK for Java. The following articles describe other ways:

* [Azure authentication in development environments](dev-env.md)
* [Authenticating applications hosted in Azure](azure-hosted-apps.md)
* [Authentication with User Credentials](user.md)

If you run into issues related to service principal authentication, see [Troubleshoot service principal authentication](../troubleshooting-authentication-service-principal.md).

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](../logging-overview.md) for information on the logging functionality provided by the SDK.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

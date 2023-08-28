---
title: Azure authentication with service principal
description: An overview of the Azure SDK for Java concepts related to authenticating applications via service principal
ms.date: 02/02/2021
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java
author: KarlErickson
ms.author: vigera
---

# Azure authentication with service principal

This article looks at how the Azure Identity library supports Azure Active Directory token authentication via service principal. Topics covered in this article include:

* [Create a service principal with the Azure CLI](#create-a-service-principal-with-the-azure-cli)
* [Client secret credential](#client-secret-credential)
* [Client certificate credential](#client-certificate-credential)

For more information, see [Application and service principal objects in Azure Active Directory](/azure/active-directory/develop/app-objects-and-service-principals). For troubleshooting service principal authentication issues, refer to the [troubleshooting service principal authentication](troubleshooting-authentication-service-principal.md) documentation.

## Create a service principal with the Azure CLI

Use the [Azure CLI](/cli/azure) examples below to create or get client secret credentials.

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
  //.pfxCertificate("<path to PFX certificate>", "PFX CERTIFICATE PASSWORD")
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

* [Azure authentication in development environments](identity-dev-env-auth.md)
* [Authenticating applications hosted in Azure](identity-azure-hosted-auth.md)
* [Authentication with User Credentials](identity-user-auth.md)

If you run into issues related to service principal authentication, you can refer to the [troubleshooting service principal authentication](troubleshooting-authentication-service-principal.md) documentation.

After you've mastered authentication, see [Configure logging in the Azure SDK for Java](logging-overview.md) for information on the logging functionality provided by the SDK.

<!-- LINKS -->
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

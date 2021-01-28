---
title: Azure authentication with service principal
description: An overview of the Azure SDK for Java concepts related to authenticating applications via Service Principal
author: g2vinay
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: vigera
---

# Azure authentication with service principal

This article provides an overview of the Azure Identity library support for Azure Active Directory token authentication via Service Principal through a a set of TokenCredential implementations. Topics covered in this article include:

* [Creating a Service Principal with the Azure CLI](#creating-a-service-principal-with-the-azure-cli)
* [Client Secret Credential](#client-secret-credential)
* [Client Certificate Credential](#client-certificate-credential)

More conceptual details can be found here for [Service principal authentication](/azure/active-directory/develop/app-objects-and-service-principals).

## Creating a Service Principal with the Azure CLI

Use the [Azure CLI][azure_cli] snippet below to create/get client secret credentials.

* Create a service principal and configure its access to Azure resources:

```bash
az ad sp create-for-rbac -n <your-application-name> --skip-assignment
```

Output:

```json
{
"appId": "generated-app-ID",
"displayName": "dummy-app-name",
"name": "http://dummy-app-name",
"password": "random-password",
"tenant": "tenant-ID"
}
```

* Run `az ad sp create-for-rbac -n <your-application-name> --skip-assignment --cert <cert-name> --create-cert` to create a service principal along with a certificate. Note down the path/location of this certificate.
* Use the returned credentials above to note down the following:
  * `AZURE\_CLIENT\_ID` for the appId.
  * `AZURE\_CLIENT\_SECRET` for the password.
  * `AZURE\_TENANT\_ID` for the tenant.

## Client Secret Credential

This credential authenticates the created service principal through its client secret (password). This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientSecretCredential`.

```java
/**
 *  Authenticate with client secret.
 */
ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
  .clientId("<YOUR_CLIENT_ID>")
  .clientSecret("<YOUR_CLIENT_SECRET>")
  .tenantId("<YOUR_TENANT_ID>")
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(clientSecretCredential)
  .buildClient();
```

## Client Certificate Credential

This credential authenticates the created service principal through its client certificate. This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientCertificateCredential`.

```java
/**
 *  Authenticate with a client certificate.
 */
ClientCertificateCredential clientCertificateCredential = new ClientCertificateCredentialBuilder()
  .clientId("<YOUR_CLIENT_ID>")
  .pemCertificate("<PATH TO PEM CERTIFICATE>")
  // choose between either a PEM certificate or a PFX certificate
  //.pfxCertificate("<PATH TO PFX CERTIFICATE>", "PFX CERTIFICATE PASSWORD")
  .tenantId("<YOUR_TENANT_ID>")
  .build();

// Azure SDK client builders accept the credential as a parameter
SecretClient client = new SecretClientBuilder()
  .vaultUrl("https://{YOUR_VAULT_NAME}.vault.azure.net")
  .credential(clientCertificateCredential)
  .buildClient();
```

## Next steps

In this article we have covered authentication via service principal, which is one of the ways in which developers can authenticate in the Azure SDK for Java. There are other authentication methods that readers may wish to review:

* [Azure authentication in development environments](java-sdk-identity-dev-env-auth.md)
* [Authenticating applications hosted in Azure](java-sdk-identity-azure-hosted-auth.md)
* [Authentication with User Credentials](java-sdk-identity-user-auth.md)

Once you've mastered authentication, consider looking into the [logging functionality](java-sdk-logging-overview.md) offered by the Azure SDK for Java.

<!-- LINKS -->
[azure_cli]: /cli/azure
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

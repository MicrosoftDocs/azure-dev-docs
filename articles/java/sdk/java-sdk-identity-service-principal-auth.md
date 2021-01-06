---
title: Authenticating with Service Principal
description: An overview of the Azure SDK for Java concepts related to authenticating applications via Service Principal
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
---

# Authenticating with Service Principal

The Azure Identity library provides Azure Active Directory token authentication support via Service Principal through a a set of TokenCredential implementations.

- [Authenticating with Service Principal](#authenticating-with-service-principal)
  - [Creating a Service Principal with the Azure CLI](#creating-a-service-principal-with-the-azure-cli)
  - [Client Secret Credential](#client-secret-credential)
  - [Client Certificate Credential](#client-certificate-credential)

More conceptual details can be found here for [Service principal authentication](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals).

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

* Use the returned credentials above to note down **AZURE\_CLIENT\_ID**(appId), **AZURE\_CLIENT\_SECRET**(password) and **AZURE\_TENANT\_ID**(tenant).

## Client Secret Credential

This credential authenticates the created service principal through its client secret (password). This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientSecretCredential`.

```java
/**
*  Authenticate with client secret.
*/
public void createClientSecretCredential() {
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
}
```

## Client Certificate Credential

This credential authenticates the created service principal through its client certificate. This example demonstrates authenticating the `SecretClient` from the [azure-security-keyvault-secrets][secrets_client_library] client library using the `ClientCertificateCredential`.

```java
/**
*  Authenticate with a client certificate.
*/
public void createClientCertificateCredential() {
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
}
```

<!-- LINKS -->
[azure_cli]: https://docs.microsoft.com/cli/azure
[secrets_client_library]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets

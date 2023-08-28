---
title: Troubleshooting Service Principal Authentication
description: An overview of how to troubleshoot service principal authentication issues
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Service Principal Authentication

This troubleshooting document provides guidance on dealing with issues encountered when authenticating Azure SDK for Java applications via service principal, through various `TokenCredential` implementations. For more information, see the [conceptual documentation on service principal credential types](/azure/developer/java/sdk/identity-service-principal-auth).

## Troubleshooting ClientSecretCredential

When using the `ClientSecretCredential`, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error code    | Issue                                                           | Mitigation                                                                                                                                                                                                                                                                                                                                                  |
|---------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS7000215 | An invalid client secret was provided.                          | Ensure the `clientSecret` provided when constructing the credential is valid. If unsure, create a new client secret using the Azure portal. Details on creating a new client secret can be found [here](/azure/active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).                                    |
| AADSTS7000222 | An expired client secret was provided.                          | Create a new client secret using the Azure portal. Details on creating a new client secret can be found [here](/azure/active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).                                                                                                                             |
| AADSTS700016  | The specified application wasn't found in the specified tenant. | Ensure the specified `clientId` and `tenantId` are correct for your application registration. For multi-tenant apps, ensure the application has been added to the desired tenant by a tenant admin. To add a new application in the desired tenant, follow the instructions [here](/azure/active-directory/develop/howto-create-service-principal-portal). |

## Troubleshooting ClientCertificateCredential

When using the `ClientCertificateCredential`, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error code   | Description                                                     | Mitigation                                                                                                                                                                                                                                                                                                                                                 |
|--------------|-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS700027 | Client assertion contains an invalid signature.                 | Ensure the specified certificate has been uploaded to the AAD application registration. Instructions for uploading certificates to the application registration can be found [here](/azure/active-directory/develop/howto-create-service-principal-portal#option-1-upload-a-certificate).                                                                  |
| AADSTS700016 | The specified application wasn't found in the specified tenant. | Ensure the specified `clientId` and `tenantId` are correct for your application registration. For multi-tenant apps, ensure the application has been added to the desired tenant by a tenant admin. To add a new application in the desired tenant, follow the instructions [here](/azure/active-directory/develop/howto-create-service-principal-portal). |

## Troubleshooting ClientAssertionCredential

When using the `ClientAssertionCredential`, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error code   | Description                                                                  | Mitigation                                                                                                                                                                                                                                                                                                    |
|--------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS700021 | Client assertion application identifier doesn't match 'client_id' parameter. | Ensure the JWT assertion created has the correct values specified for the `sub` and `issuer` value of the payload, both of these should have the value be equal to `clientId`. Refer to documentation for [client assertion format](/azure/active-directory/develop/active-directory-certificate-credentials) |
| AADSTS700023 | Client assertion audience claim does not match Realm issuer.                 | Ensure the audience `aud` field in the JWT assertion created has the correct value for the audience specified in the payload. This should be set to `https://login.microsoftonline.com/{tenantId}/v2`.                                                                                                        |
| AADSTS50027  | JWT token is invalid or malformed.                                           | Ensure the JWT assertion token is in the valid format. Refer to the documentation for [client assertion format](/azure/active-directory/develop/active-directory-certificate-credentials).                                                                                                                    |

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

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

When using the `ClientSecretCredential`, you may optionally try/catch for `ClientAuthenticationException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error code    | Issue                                                           | Mitigation                                                                                                                                                                                                                                                                                                                                                  |
|---------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS7000215 | An invalid client secret was provided.                          | Ensure the `clientSecret` provided when constructing the credential is valid. If unsure, create a new client secret using the Azure portal. For more information, see the [Create a new application secret](/azure/active-directory/develop/howto-create-service-principal-portal#option-3-create-a-new-application-secret) section of [Create a Microsoft Entra ID application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).                                    |
| AADSTS7000222 | An expired client secret was provided.                          | Create a new client secret using the Azure portal. For more information, see the [Create a new application secret](/azure/active-directory/develop/howto-create-service-principal-portal#option-3-create-a-new-application-secret) section of [Create a Microsoft Entra ID application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).                                                                                                                             |
| AADSTS700016  | The specified application wasn't found in the specified tenant. | Ensure the specified `clientId` and `tenantId` are correct for your application registration. For multi-tenant apps, ensure that a tenant admin has added the application to the desired tenant. For more information, see [Create a Microsoft Entra ID application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). |

## Troubleshooting ClientCertificateCredential

When using the `ClientCertificateCredential`, you may optionally try/catch for `ClientAuthenticationException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error code   | Description                                                     | Mitigation                                                                                                                                                                                                                                                                                                                                                 |
|--------------|-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS700027 | Client assertion contains an invalid signature.                 | Ensure that you've uploaded the specified certificate to the Microsoft Entra ID application registration. For more information, see the [Upload a trusted certificate issued by a certificate authority](/azure/active-directory/develop/howto-create-service-principal-portal#option-1-recommended-upload-a-trusted-certificate-issued-by-a-certificate-authority) section of [Create a Microsoft Entra ID application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).                                                                  |
| AADSTS700016 | The specified application wasn't found in the specified tenant. | Ensure the specified `clientId` and `tenantId` are correct for your application registration. For multi-tenant apps, ensure that a tenant admin has added the application to the desired tenant. For more information, see [Create a Microsoft Entra ID application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). |

## Troubleshooting ClientAssertionCredential

When using the `ClientAssertionCredential`, you may optionally try/catch for `ClientAuthenticationException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error code   | Description                                                                  | Mitigation                                                                                                                                                                                                                                                                                                    |
|--------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AADSTS700021 | The client assertion application identifier doesn't match the `client_id` parameter. | Ensure that the JWT assertion created has the correct values specified for the `sub` and `issuer` value of the payload. Both of these fields should be equal to `clientId`. For the client assertion format, see [Microsoft identity platform application authentication certificate credentials](/azure/active-directory/develop/active-directory-certificate-credentials). |
| AADSTS700023 | The client assertion audience claim doesn't match the Realm issuer.                 | Ensure that the audience `aud` field in the JWT assertion created has the correct value for the audience specified in the payload. Set this field to `https://login.microsoftonline.com/{tenantId}/v2`.                                                                                                        |
| AADSTS50027  | JWT token is invalid or malformed.                                           | Ensure the JWT assertion token is in the valid format. Refer to the documentation for [client assertion format](/azure/active-directory/develop/active-directory-certificate-credentials).                                                                                                                    |

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

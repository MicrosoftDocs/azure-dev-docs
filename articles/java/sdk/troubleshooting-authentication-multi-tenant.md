---
title: Troubleshoot Multi-Tenant Authentication
titleSuffix: Azure SDK for Java
description: Learn how to troubleshoot multi-tenant authentication errors in Azure SDK for Java, resolve tenant token issues faster, and apply the fixes now.
ms.date: 04/02/2025
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: bmitchell287
ms.author: brendm
ms.reviewer: jogiles
---

# Troubleshoot multitenant authentication

This article explains how to troubleshoot multitenant authentication problems and helps you fix tenant-related token errors in Java applications.

When you use credentials in a multitenant context, you can optionally try/catch for `ClientAuthenticationException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error message                                                                       | Description                                                                                        | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `The current credential is not configured to acquire tokens for tenant <tenant-ID>` | The application must configure the credential to allow acquiring tokens from the requested tenant. | Add the requested tenant ID to `additionallyAllowedTenants` on the credential builder, or add \"*\" to `additionallyAllowedTenants` to allow acquiring tokens for any tenant. <br><br>This exception was added as part of a breaking change to multitenant authentication in version `1.6.0`. Users experiencing this error after upgrading can find information about the change and migration in [BREAKING_CHANGES.md](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/BREAKING_CHANGES.md) |

## Next steps

If the troubleshooting guidance in this article doesn't help resolve issues when you use the Azure SDK for Java client libraries, [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

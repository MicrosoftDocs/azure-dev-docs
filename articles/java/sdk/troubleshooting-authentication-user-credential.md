---
title: Troubleshoot user credential authentication
titleSuffix: Azure SDK for Java
description: Provides an overview of how to troubleshoot user credential authentication issues.
ms.date: 09/07/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot user credential authentication

This article provides guidance on dealing with issues encountered when authenticating Azure SDK for Java applications with user-provided credentials, through various `TokenCredential` implementations. For more information, see [Azure authentication with user credentials](authentication/user.md).

## Troubleshoot UsernamePasswordCredential

When you use `UsernamePasswordCredential`, you can optionally try/catch for `ClientAuthenticationException`. The following table shows the errors that this exception indicates, and methods of mitigation:

| Error code    | Issue                                        | Mitigation                                                                                     |
|---------------|----------------------------------------------|------------------------------------------------------------------------------------------------|
| `AADSTS50126` | The provided username or password is invalid | Ensure that the `username` and `password` provided when constructing the credential are valid. |

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

---
title: Troubleshooting Multi-tenant Authentication
description: An overview of how to troubleshoot multi-tenant authentication issues
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Multi-tenant Authentication

This troubleshooting document provides guidance on dealing with issues encountered when in a multi-tenant context.

When using credentials in a multi-tenant context, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Message |Description| Mitigation |
|---|---|---|
|The current credential is not configured to acquire tokens for tenant &lt;tenant ID&gt;|The application must configure the credential to allow acquiring tokens from the requested tenant.|Add the requested tenant ID it to the `additionallyAllowedTenants` on the credential builder, or add \"*\" to `additionallyAllowedTenants` to allow acquiring tokens for any tenant.</p>This exception was added as part of a breaking change to multi tenant authentication in version `1.6.0`. Users experiencing this error after upgrading can find details on the change and migration in [BREAKING_CHANGES.md](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/BREAKING_CHANGES.md) |

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue][azsdkjava_github_repo_new_issue] on the [Azure SDK for Java GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java
[azsdkjava_github_repo_new_issue]: https://github.com/Azure/azure-sdk-for-java/issues/new/choose
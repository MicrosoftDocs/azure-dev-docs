---
title: Troubleshooting User Credential Authentication
description: An overview of how to troubleshoot user credential authentication issues
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting User Credential Authentication

This troubleshooting document provides guidance on dealing with issues encountered when authenticating Azure SDK for Java applications with user-provided credentials, through various `TokenCredential` implementations. For more information, see the [conceptual documentation on user-provided credential types](/azure/developer/java/sdk/identity-user-auth).

## Troubleshooting UsernamePasswordCredential

When using the `UsernamePasswordCredential`, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Code | Issue | Mitigation |
|---|---|---|
|AADSTS50126|The provided username or password is invalid|Ensure the `username` and `password` provided when constructing the credential are valid.|

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue on the projects GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java

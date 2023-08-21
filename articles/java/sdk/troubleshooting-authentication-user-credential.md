---
title: Troubleshoot overview when using the Azure SDK for Java
description: An overview of how to troubleshoot issues related to using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting User Credential Authentication

TODO

## Troubleshoot `UsernamePasswordCredential` authentication issues

When using the `UsernamePasswordCredential`, you may optionally try/catch for `ClientAuthenticationException`. The table below shows the errors that this exception indicates, and methods of mitigation.

| Error Code | Issue | Mitigation |
|---|---|---|
|AADSTS50126|The provided username or password is invalid|Ensure the `username` and `password` provided when constructing the credential are valid.|

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue on the projects GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java

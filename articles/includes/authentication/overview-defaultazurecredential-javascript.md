---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 12/04/2024
ms.author: diberry
---

The [DefaultAzureCredential](#use-defaultazurecredential-in-an-application) class provided by the Azure Identity library allows apps to use different authentication methods depending on the environment in which they're run. This behavior allows apps to be promoted from local development to test environments to production without code changes. You configure the appropriate authentication method for each environment, and `DefaultAzureCredential` will automatically detect and use that authentication method. The use of `DefaultAzureCredential` should be preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

Details about using `DefaultAzureCredential` are covered at [Use `DefaultAzureCredential` in an application](#use-defaultazurecredential-in-an-application).

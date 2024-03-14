---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
The Azure SDK [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) method allows apps to use different authentication methods depending on the environment they're run in. This allows apps to deploy in local, test, and production environments without code changes.  You configure the appropriate authentication method for each environment and `DefaultAzureCredential` automatically detects and uses that authentication method. The use of `DefaultAzureCredential` is preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

Details about using the DefaultAzureCredential class are covered later in this article in the section [Use DefaultAzureCredential in an application](/javascript/api/@azure/identity/defaultazurecredential).
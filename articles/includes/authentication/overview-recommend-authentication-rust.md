---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
The recommended approach is to have your apps use **token-based authentication**, rather than connection strings or keys, when authenticating to Azure resources. The Azure Identity crate (`azure_identity`) provides token-based authentication and allows apps to seamlessly authenticate to Azure resources whether the app is in local development, deployed to Azure, or deployed to an on-premises server.

The specific type of token-based authentication an app should use to authenticate to Azure resources depends on where the app is running and is shown in the following diagram.

|Environment|Authentication|
|--|--|
|**Local**| When a developer is running an app during local development - The app can authenticate to Azure using the developer's local credentials.  These options are provided in more detail in the _crates.io_ documentation: [Authenticate via development tools](https://crates.io/crates/azure_identity#authenticate-via-development-tools).|
|**Azure**| When an app is hosted on Azure - The app should authenticate to Azure resources using a managed identity. This option is discussed in more detail in the _crates.io_ documentation: [Authenticate Azure-hosted applications](https://crates.io/crates/azure_identity#authenticate-azure-hosted-applications).|
|**On-premises**|When an app is hosted and deployed on-premises - The app should authenticate to Azure resources using an application service principal. This option is discussed in in the _crates.io_ documentation: [Authenticate service principals](https://crates.io/crates/azure_identity#authenticate-service-principals).|

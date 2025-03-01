---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 5/31/2023
---

### Determine whether a license is needed

For IBM WebSphere Liberty, you must accept the terms on the license agreement corresponding to the version of the IBM Program in the application container. For the license agreement applicable to this IBM Program, see [Viewing license information for WebSphere Liberty operator](https://ibm.biz/was-license). For more information, see [Running WebSphere Liberty on Microsoft Azure](https://www.ibm.com/docs/was-liberty/core?topic=container-running-websphere-liberty-microsoft-azure).

If your product edition is something other than the default IBM WebSphere Application Server (base), the `.spec.license.edition value` must specify your product edition. Other available values are IBM WebSphere Application Server Liberty Core and IBM WebSphere Application Server Network Deployment. The prebuilt Azure Marketplace offer allows you to select the supported product edition.

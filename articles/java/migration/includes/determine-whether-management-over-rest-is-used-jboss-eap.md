---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether Management REST API is used

If the lifecycle of your application includes using the  Management REST API, you need to delegate those management operations to ARM (Azure Resource Manager). The JBoss management interface and REST API is not exposed on App Service. Instead, the App Service platform handles the orchestration and lifecycle of your EAP instances.

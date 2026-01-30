---
author: KarlErickson
ms.author: karler
ms.reviewer: manriem
ms.date: 01/13/2026
---

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the Azure Kubernetes Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

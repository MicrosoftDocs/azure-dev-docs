---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 09/30/2022
---

### Ensure that the target is the appropriate target for your migration effort

The first step in a successful migration of a WLS application to Azure is selecting the most appropriate migration target. WLS runs well on Azure virtual machines (VMs) or Azure Kubernetes Service (AKS). The VM target is the easiest choice, because it most closely resembles an on-premises deployment. The administrative and deployment experience for virtual machines is very analogous to what you have on-premises. The trade-off for this ease is economic cost. Generally speaking, the per-minute cost for a VM-based solution is higher compared with AKS. While an AKS-based solution costs less to run, you must constrain your application to fit within the requirements of AKS. If minimizing change is the most important factor for your migration effort, consider a VM-based migration. In this case, see [Migrate WebLogic applications to Azure Virtual Machines](../migrate-weblogic-to-virtual-machines.md). If you can tolerate converting your application to run within Kubernetes to reduce runtime cost, consider an AKS-based migration.  In this case, continue with [Migrate WebLogic Server applications to Azure Kubernetes Service](../migrate-weblogic-to-azure-kubernetes-service.md).

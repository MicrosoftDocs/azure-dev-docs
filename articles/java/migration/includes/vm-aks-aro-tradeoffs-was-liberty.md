---
author: KarlErickson
ms.author: haiche
ms.date: 04/03/2023
---

### Ensure that the target is the appropriate target for your migration effort

The first step in a successful migration of a WAS application to Azure is selecting the most appropriate migration target.

WAS traditional runs well on Azure Virtual Machines. The virtual machine (VM) target is the easiest choice, because it most closely resembles an on-premises deployment. The administrative and deployment experience for virtual machines is analogous to what you have on-premises.

Another option is to migrate to containers by converting WAS traditional workload to application containers. You can run the container target on Azure Kubernetes Service (AKS) and Azure Red Hat OpenShit (ARO). The trade-off for this ease is economic cost.

Generally speaking, the per-minute cost for a VM-based solution is higher compared with containers. While a container-based solution costs less to run, you must constrain your application to fit within the requirements of container orchestration platform. If minimizing change is the most important factor for your migration effort, consider a VM-based migration. In this case, see [Migrate IBM WAS traditional applications to Azure Virtual Machines](../migrate-websphere-to-virtual-machines.md). If you can tolerate converting your application to run within containers to reduce runtime cost, consider an AKS-based or ARO-based migration.

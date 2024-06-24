---
author: KarlErickson
ms.author: haiche
ms.date: 05/31/2023
ms.custom: devx-track-java, devx-track-extended-java, linux-related-content
---

### Ensure that the target is the appropriate target for your migration effort

The first step in a successful migration of a WAS application to Azure is selecting the most appropriate migration target.

WAS traditional runs well on Azure Virtual Machines. The virtual machine (VM) target is the easiest choice, because it most closely resembles an on-premises deployment. The administrative and deployment experience for virtual machines is analogous to what you have on-premises.

Another option is to migrate to containers by converting WAS traditional workload to application containers. You can run the container target on Azure Kubernetes Service (AKS) and Azure Red Hat OpenShift. The trade-off for this ease is economic cost.

Generally speaking, the per-minute cost for a VM-based solution is higher compared with containers. While a container-based solution costs less to run, you must constrain your application to fit within the requirements of the container orchestration platform.

If minimizing change is the most important factor for your migration effort, consider a VM-based migration. In this case, see [Migrate WebSphere applications to Azure Virtual Machines](../migrate-websphere-to-virtual-machines.md).

If you can tolerate converting your application to run within containers to reduce runtime cost, consider an AKS-based or Azure Red Hat OpenShift-based migration.

For AKS-based migration, you can start using the Free tier. Get free cluster management and pay for only the virtual machines, associated storage, and networking resources consumed. In this case, see [Migrate WebSphere applications to Azure Kubernetes Service](../migrate-websphere-to-azure-kubernetes-service.md).

For Azure Red Hat OpenShift-based migration, in addition to the compute and infrastructure costs, application nodes have another cost for the OpenShift license component. This cost is billed based on the number of application nodes and the instance type. Use on-demand pricing or reserved instances, whichever best meets the need of your workload and business. In this case, see [Migrate WebSphere applications to Azure Red Hat OpenShift](../migrate-websphere-to-azure-redhat-openshift.md).

The how-to guides in the Azure Red Hat OpenShift documentation cover some aspects that are relevant to migration. For the complete list of how-to guides, see the [Azure Red Hat OpenShift documentation](/azure/openshift/).

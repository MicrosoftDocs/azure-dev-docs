---
author: KarlErickson
ms.author: karler
ms.date: 03/17/2023
ms.custom: devx-track-java, devx-track-extended-java, linux-related-content
---

### Ensure that the target is the appropriate target for your migration effort

The first step in a successful migration of a JBoss EAP application to Azure is selecting the most appropriate migration target. JBoss EAP runs well on Azure virtual machines (VMs) or Azure Red Hat OpenShift.

The VM target is the easiest choice, because it most closely resembles an on-premises deployment. The administrative and deployment experience for virtual machines is analogous to what you have on-premises. Selecting VMs allows you to defer modernization.

Red Hat OpenShift brings together tested and trusted services to reduce the friction of developing, modernizing, deploying, running, and managing applications. Azure Red Hat OpenShift is built on Kubernetes. Azure Red Hat OpenShift delivers a consistent experience across public cloud, on-premises, hybrid cloud, or edge architecture.

If minimizing change is the most important factor for your migration effort, consider a VM-based migration. In this case, see [Migrate JBoss EAP applications to JBoss EAP on Azure VMs](../migrate-jboss-eap-to-jboss-eap-on-azure-vms.md). If you can tolerate converting your application to run within Red Hat OpenShift to reduce runtime cost, consider an Azure Red Hat OpenShift-based migration. In this case, continue with [Migrate JBoss EAP applications to JBoss EAP on Azure Red Hat OpenShift](../migrate-jboss-eap-to-azure-redhat-openshift.md). To understand the differences between JBoss EAP and JBoss EAP for OpenShift, see [Comparison: JBoss EAP and JBoss EAP for OpenShift](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_online/introduction#how_does_eap_work_on_openshift).

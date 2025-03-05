---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 05/31/2023
---

### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production servers and the average and peak request counts and resource utilization. You need this information regardless of the migration path you choose. This information is useful, for example, to help guide selection of the size of the VMs in your node, the amount of memory to be used by the container, and how many CPU shares the container would need.

To take advantage of unused capacity at a significant cost savings, it's possible to use Azure Spot Virtual Machines in Azure Red Hat OpenShift. To learn how, see [Use Azure Spot Virtual Machines in an Azure Red Hat OpenShift cluster](/azure/openshift/howto-spot-nodes).

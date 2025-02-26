---
author: KarlErickson
ms.author: karler
ms.reviewer: manriem
ms.date: 2/28/2020
---

### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production server(s) and the average and peak request counts and resource utilization. You'll need this information regardless of the migration path you choose. It's useful, for example, to help guide selection of the size of the VMs in your node pool, the amount of memory to be used by the container, and how many CPU shares the container needs.

It's possible to resize node pools in AKS. To learn how, see [Resize node pools in Azure Kubernetes Service (AKS)](/azure/aks/resize-node-pool).

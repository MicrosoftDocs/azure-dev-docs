---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 04/03/2023
---

### Determine whether WAS clustering is used

Most likely, you've deployed your application on multiple WAS servers to achieve high availability. You can migrate these clusters directly from your on-premises installation to WAS running in Azure Virtual Machines. For more information, see [WebSphere Application Server Network Deployment](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=network-deployment-all-operating-systems-version-90) in the IBM documentation.

### Account for load-balancing requirements

Load balancing is an essential part of migrating your WAS cluster to Azure. The easiest solution is to use the built-in support for [Azure Application Gateway](/azure/application-gateway/overview) or [IBM HTTP Server](https://www.ibm.com/docs/en/ibm-http-server/9.0.5) provided in the Azure Marketplace offer for [IBM WebSphere Application Server Cluster](https://aka.ms/twas-cluster-portal).

For a summary of the capabilities of Azure Application Gateway compared to other Azure load-balancing solutions, see [Load-balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

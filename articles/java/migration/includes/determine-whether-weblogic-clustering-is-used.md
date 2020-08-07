---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. You can migrate these clusters directly from your on-premises installation to WebLogic running in Azure Virtual Machines. For more information, see [Domain Configuration Files](https://docs.oracle.com/middleware/12213/wls/DOMCF/config_files.htm#DOMCF127) in the Oracle documentation.

### Account for load-balancing requirements

Load balancing is an essential part of migrating your Oracle WebLogic Server cluster to Azure.  The easiest solution is to use the built-in support for [Azure Application Gateway](/azure/application-gateway/overview) provided in the Azure Marketplace offer for Oracle WebLogic Server cluster.  For a tutorial on this topic, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](../migrate-weblogic-with-app-gateway.md).

For a summary of the capabilities of Azure Application Gateway compared to other Azure load-balancing solutions, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

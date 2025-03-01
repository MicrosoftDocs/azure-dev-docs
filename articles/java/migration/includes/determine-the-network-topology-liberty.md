---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 05/31/2023
---

### Determine the network topology

The current set of Azure Marketplace offers is a starting point for your migration. If the offer doesn't cover aspects of your architecture that you need to migrate, you need to capture the network topology of your existing deployment. Then, you need to reproduce that topology in Azure, even after standing up the basic offer with one of the solution templates.

Network topology is a broad topic, but the following references can give some direction to your migration efforts:

* For an enumeration of the high level topics relevant to the migration of network topology to Azure, see [WebSphere Application Server Network Deployment topologies](https://www.ibm.com/docs/mpf/7.1.0?topic=runtimes-websphere-application-server-network-deployment-topologies).
* Because data sources are separate servers in a Liberty system, you must consider them as part of the network topology analysis. For more information, see [WebSphere Application Server Liberty Data Sources](https://www.ibm.com/docs/was-liberty/base?topic=liberty-configuring-relational-database-connectivity-in).
* Messaging sources are also separate servers. For more information, see [WebSphere Application Server Liberty: WebSphere MQ messaging](https://www.ibm.com/docs/was-liberty/base?topic=configuration-wmqjmsclient).
* Load balancing is a fundamental requirement. For information on the Liberty side of load balancing, see [WebSphere Application Server Liberty collective architecture](https://www.ibm.com/docs/was-liberty/base?topic=SSEQTP_liberty/com.ibm.websphere.wlp.zseries.doc/ae/cwlp_collective_arch.html).

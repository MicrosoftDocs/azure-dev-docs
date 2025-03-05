---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/03/2023
---

### Determine the network topology

The current set of Azure Marketplace offers is a starting point for your migration. If the offer doesn't cover aspects of your architecture that you need to migrate, you need to capture the network topology of your existing deployment. Then, you need to reproduce that network topology in Azure, even after standing up the basic offer with one of the solution templates.

Network topology is a broad topic, but the following references can give some direction to your migration efforts:

* The following reference enumerates the high level topics relevant to the migration of network topology to Azure: [WebSphere Application Server Network Deployment topologies](https://www.ibm.com/docs/en/mpf/7.1.0?topic=runtimes-websphere-application-server-network-deployment-topologies).
* Because data sources are separate servers in a WAS system, you must consider them as part of the network topology analysis. For more information, see [WebSphere Application Server Data Sources](https://www.ibm.com/docs/en/was/9.0.5?topic=concepts-data-sources).
* Messaging sources are also separate servers. For more information, see [Network topologies: Interoperating by using the WebSphere MQ messaging provider](https://www.ibm.com/docs/en/was/9.0.5?topic=iummp-network-topologies-interoperating-by-using-websphere-mq-messaging-provider).
* Load balancing is a fundamental requirement. The following reference covers the WAS side of load balancing: [WebSphere Application Server Network Deployment load-balanced clustering](https://www.ibm.com/docs/en/mfci/7.6.2?topic=haas-websphere-application-server-network-deployment-load-balanced-clustering).

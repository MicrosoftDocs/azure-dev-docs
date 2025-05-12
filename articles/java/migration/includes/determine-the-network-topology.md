---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 1/21/2020
---

### Determine the network topology

The current set of Azure Marketplace offers is a starting point for your migration. If the offer does not cover aspects of your architecture that you need to migrate, you'll need to capture the network topology of your existing deployment and reproduce that in Azure, even after standing up the basic offer with one of the solution templates.

This is a very broad topic, but the following references can give some direction to your migration efforts:

* This reference enumerates the high level topics relevant to the migration of network topology to Azure: [Fast Track Deployment Guide](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/intro/deploying.html#GUID-E0BE4A3E-44CD-4C95-9540-7A850BF02F6A).
* This reference describes important concerns regarding clustering, which has an impact on network topology: [WebLogic Server Clustering](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/intro/clustering.html#GUID-E39A18C2-B990-485F-BFB1-0549250FABFE).
* Because data sources are separate servers in a WebLogic system, you must consider them as part of the network topology analysis. [WebLogic Server Data Sources](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/intro/jdbc.html).
* Messaging sources are also separate servers. [WebLogic Server Messaging](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/intro/jms.html)
* Load balancing is a fundamental requirement. This reference covers the WebLogic Server side of load balancing: [Load Balancing in a Cluster](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/intro/clustering.html).

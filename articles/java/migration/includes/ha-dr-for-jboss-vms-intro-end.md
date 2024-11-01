---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. The primary region has a full deployment of the JBoss EAP cluster. After the primary region is protected by [Azure Site Recovery](https://azure.microsoft.com/products/site-recovery), you can restore the secondary region during the failover. As a result, the primary region is actively servicing network requests from the users, while the secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption.

Azure Traffic Manager detects the health of the app deployed in the JBoss EAP cluster to implement the conditional routing. The geo-failover RTO of the application tier depends on the time for shutting down the primary cluster, restoring the secondary cluster, starting VMs and running the secondary JBoss EAP cluster. The RPO depends on the replication policy of Azure Site Recovery and Azure SQL Database because the cluster data is stored and replicated in the local storage of the VMs and application data is persisted and replicated in the Azure SQL Database failover group.

The preceding diagram shows **Primary region** and **Secondary region** as the two regions comprising the HA/DR architecture. These regions need to be Azure paired regions. For more information on paired regions, see [Azure cross-region replication](/azure/reliability/cross-region-replication-azure). The article uses East US and West US as the two regions, but they can be any paired regions that make sense for your scenario. For the list of region pairings, see the [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions) section of [Azure cross-region replication](/azure/reliability/cross-region-replication-azure).

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The read/write listener endpoint always points to the primary server and is connected to the JBoss EAP cluster in each region. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This tutorial was written with Azure Site Recovery and Azure SQL Database service because the tutorial relies on the HA features of these services. Other database choices are possible, but the HA features of whatever database you chose must be considered.

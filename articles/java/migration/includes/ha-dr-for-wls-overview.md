---
author: KarlErickson
ms.author: haiche
ms.date: 04/29/2024
---

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The primary server is in active read-write mode and connected to the primary WLS cluster. The secondary server is in passive ready-only mode and connected to the secondary WLS cluster. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This article was written with the Azure SQL Database service because the article relies on the high availability (HA) features of that service. Other database choices are possible, but you must consider the HA features of whatever database you choose. For more information, including information on how to optimize the configuration of data sources for replication, see [Configuring Data Sources for Oracle Fusion Middleware Active-Passive Deployment](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.4/asdrg/setting-and-managing-disaster-recovery-sites.html#GUID-445693AB-B592-4E11-9B44-A208444B75F2).

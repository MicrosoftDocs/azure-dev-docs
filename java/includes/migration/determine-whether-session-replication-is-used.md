---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether session replication is used

If your application relies on session replication, with or without Oracle Coherence*Web, you have three options:

1. Coherence*Web can run alongside a WebLogic Server in the Azure virtual machines, but you must manually configure this option after you provision the offer. If you are using standalone Coherence, you can also run it in an Azure virtual machine, but you must manually configure this option after you provision the offer.
2. Refactor your application to use a database for session management.
3. Refactor your application to externalize the session to Azure Redis Service. For more information, see [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

For all of these options, it's a good idea to master how WebLogic does HTTP Session State Replication. For more information, see [HTTP Session State Replication](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/clust/failover.html#GUID-E13D8142-66BA-46A1-854F-4FC6F82992DD) in the Oracle documentation.

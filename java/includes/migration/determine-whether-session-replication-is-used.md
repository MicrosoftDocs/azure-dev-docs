---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether session replication is used

If your application relies on session replication and Oracle Coherence*Web, you have three options:

1. Coherence*Web can run along side a WebLogic Server in the Azure virtual machines, but this option must be manually configured after the offer is provisioned
   * If you are using standalone Coherence, this also can run in an Azure virtual machine, but this option must be manually configured after the offer is provisioned
2. Refactor your application to use a database for session management.
3. Refactor your application to externalize the session management.


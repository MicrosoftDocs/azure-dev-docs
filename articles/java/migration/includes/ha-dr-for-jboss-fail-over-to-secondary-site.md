---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

First, use the following steps to failover the Azure SQL Database from the primary server to the secondary server:

1. Switch to the browser tab of your Azure SQL Database failover group - for example, `failovergroup-gzh032124`.
1. Select **Failover** > **Yes**.
1. Wait until it completes.

Next, use the following steps to failover the JBoss EAP cluster with the recovery plan:

1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, `recovery-service-vault-westus-gzh032124`.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, `recovery-plan-gzh032124`.
1. Select **Failover**. Check **I understand the risk. Skip test failover.**. Leave the defaults for others, select **OK**.

   > [!NOTE]
   > Optinally you can execute **Test failover** and **Cleanup test failover** to make sure everything works as expected before **Failover**. For more information, see [Tutorial: Run a disaster recovery drill for Azure VMs](/azure/site-recovery/azure-to-azure-tutorial-dr-drill). This tutorial chose **Failover** directly to simplify the exercise.

1. Monitor the failover in notifications until it completes. It takes about 10 minutes for the exercise of this tutorial.

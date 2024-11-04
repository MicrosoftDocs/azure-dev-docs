---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

Ensure the steps in the previous section completed successfully. Follow the steps in this section to commit the failover.

1. In the search box at the top of the Azure portal, type **Recovery Services vaults** and select it from the search results.
1. Select your Recovery Services vault (for example, `recovery-service-vault-westus-gzh032124`).
1. Under the **Manage** section, select **Recovery Plans (Site Recovery)**. 
2. Select the recovery plan(for example, `recovery-plan-gzh032124`).
1. Select **Commit**, then **OK**.
1. Monitor the notifications until it completes.

   :::image type="content" source="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png" alt-text="Screenshot of failover commit completed." lightbox="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png":::

1. Select **Items in recovery plan**. You should see 3 items listed as **Failover committed**.

---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

Ensure that the steps in the previous section completed successfully. Then, use the following steps to commit the failover:

1. In the search box at the top of the Azure portal, type **Recovery Services vaults** and select it from the search results.
1. Select your Recovery Services vault - for example, `recovery-service-vault-westus-gzh032124`.
1. Under the **Manage** section, select **Recovery Plans (Site Recovery)**.
1. Select the recovery plan - for example, `recovery-plan-gzh032124`.
1. Select **Commit**, then **OK**.
1. Monitor the notifications until it completes.

   :::image type="content" source="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png" alt-text="Screenshot of failover commit completed." lightbox="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png":::

1. Select **Items in recovery plan**. You should see 3 items listed as **Failover committed**.

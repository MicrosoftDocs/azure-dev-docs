---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

Commit the failover after verifying the the previous step has succesfully completed.

1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, `recovery-service-vault-westus-gzh032124`.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, `recovery-plan-gzh032124`.
1. Select **Commit** > **OK**.
1. Monitor the notifications until it completes.

   :::image type="content" source="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png" alt-text="Screenshot of failover commit completed." lightbox="../media/migrate-jboss-eap-to-vms-with-ha-dr/failover-commit-completed.png":::

1. Select **Items in recovery plan**, you should see 3 items listed as **Failover committed**.

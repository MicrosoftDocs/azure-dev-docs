---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

1. Enter the resource group name of Azure SQL Database servers (for example, `sqlserver-rg-gzh032124`) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 1-4 for the resource group of the Traffic Manager - for example, `myResourceGroupTM1`.
1. In the search box at the top of the Azure portal, enter **Recovery Services vaults** and select **Recovery Services vaults** in the search results.
1. Select the name of your Recovery Services vault - for example, `recovery-service-vault-westus-gzh032124`.
1. Under **Manage**, select **Recovery Plans (Site Recovery)**. Select the recovery plan you created - for example, `recovery-plan-gzh032124`.
1. Use the same steps in section [Disable the replication](#disable-the-replication) to remove locks on replicated items.
1. Repeat steps 1-4 for the resource group of the primary JBoss EAP cluster - for example, `jboss-eap-cluster-westus-gzh032124`.
1. Repeat steps 1-4 for the resource group of the secondary JBoss EAP cluster - for example, `jboss-eap-cluster-eastus-gzh032124`.
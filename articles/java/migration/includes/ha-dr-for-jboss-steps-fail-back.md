---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

1. Select recovery service vault deployed in the primary region - for example, `recovery-service-vault-eastus-gzh032124`.
1. Select resource group deployed in the primary region - for example, `jboss-eap-cluster-eastus-gzh032124`.
1. In section [Commit the failover](#commit-the-failover), select your Recovery Services vault deployed in the primary - for example, `recovery-service-vault-eastus-gzh032124`.
1. In the Traffic Manager profile, you should see that endpoint `myPrimaryEndpoint` becomes **Online** and endpoint `myFailoverEndpoint` becomes **Degraded**.
1. In section [Re-protect the failover site](#re-protect-the-failover-site):
    1. The primary region is your failover site and active, you should re-protect it in your secondary region.
    1. Clean up resource deployed in your secondary region - for example, resources deployed in `jboss-eap-cluster-westus-gzh032124`.
    1. Use the same steps in the [Set up disaster recovery for the cluster using Azure Site Recovery](#set-up-disaster-recovery-for-the-cluster-using-azure-site-recovery) for protecting the primary region in the secondary region, except:
        1. Skipping steps in **Create a Recovery Services vault** as you created one before - for example, `recovery-service-vault-westus-gzh032124`.
        1. For **Enable replication** > **Replication settings**, select existing virtual network in the secondary region for **Failover virtual network**.

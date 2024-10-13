---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

In this section, you set up disaster recovery for Azure VMs in the primary cluster using Azure Site Recovery, by following the steps in [Tutorial: Set up disaster recovery for Azure VMs](/azure/site-recovery/azure-to-azure-tutorial-enable-replication). You just need the following sections: [Create a Recovery Services vault](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#create-a-recovery-services-vault) and [Enable replication](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication). Pay attention to the following steps as you go through the article, then return to this article after the primary cluster is protected:

1. When you reach the section [Create a Recovery Services vault](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#create-a-recovery-services-vault):
    1. In step 5 for **Resource group**, create a new resource group with a unique name in your subscription - for example, `recovery-service-westus-gzh032124`.
    1. In step 6 for **Vault name**, provide a vault name - for example, `recovery-service-vault-westus-gzh032124`.
    1. In step 7 for **Region**, select **West US 2**.
    1. Before selecting **Review + create** in step 8, select **Next: Redundancy**. In **Redundancy** pane, select **Geo-redundant** for **Backup Storage Redundancy** and **Enable** for **Cross Region Restore**.

       > [!NOTE]
       > Make sure you select **Geo-redundant** for **Backup Storage Redundancy** and **Enable** for **Cross Region Restore** in **Redundancy** pane. Otherwise the storage of the primary cluster can't be replicated to the secondary region.

    1. Enable Site Recovery by following steps in section [Enable Site Recovery](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-site-recovery).

1. When you reach the section [Enable replication](/azure/site-recovery/azure-to-azure-tutorial-enable-replication#enable-replication):
    1. Select source settings:
        1. For **Region**, select **East US**.
        1. For **Resource group**, select the resource where the primary cluster is deployed - for example, `jboss-eap-cluster-eastus-gzh032124`.

           > [!NOTE]
           > If the desired resource group is not listed, you can select **West US 2** for Region first and then switch back to **East US**.

        1. Leave as default for other fields.
    1. Select the VMs:
        1. In **Virtual machines**, select all VMs listed - for example, there're 3 VMs deployed in the primary cluster for this tutorial.
    1. Review replication settings:
        1. For **Target location**, select **West US 2**.
        1. For **Target resource group**, select the resource group where the service recovery vault is deployed - for example, `jboss-eap-cluster-westus-gzh032124`.
           1. If the expected resource group is not shown, select another region, then return to **West US 2**.
        1. Note down the new failover virtual network and failover subnet, which are mapped from ones in the primary region.
        1. Leave the defaults for other fields.
    1. Manage:
        1. For **Replication policy**, use the default policy *24-hour-retention-policy*. You can also create a new policy for your business.
        1. Leave the defaults for other fields as well.
    1. Review:
        1. After selecting **Enable replication**, notice the message **Creating Azure resources. Don't close this blade.** displayed at the bottom of the page. Do nothing and wait until the blade is closed automatically. You're redirected to **Site Recovery** page.
        1. Under **Protected items**, select **Replicated items**. Initially there are no items listed because the replication is still in progress. The replication takes time to complete, it's about 1 hour for this tutorial. Refresh the page periodically until you see all VMs are **Protected**, for example:

           :::image type="content" source="../media/migrate-jboss-eap-to-vms-with-ha-dr/replicated-items-protected.png" alt-text="Screenshot of VMs that are replicated and protected." lightbox="../media/migrate-jboss-eap-to-vms-with-ha-dr/replicated-items-protected.png":::

Next, create a recovery plan to include all replicated items so they can fail over together. Execute the instructions in [Create a recovery plan](/azure/site-recovery/site-recovery-create-recovery-plans#create-a-recovery-plan), with the following customization:

1. In step 2, enter a name for the plan - for example, `recovery-plan-gzh032124`.
1. In step 3, select **East US** for **Source** and **West US 2** for **Target**.
1. In step 4 for **Select items**, select all protected items - for example, the 3 protected VMs for this tutorial.

Keep the page open to use later for testing failover.

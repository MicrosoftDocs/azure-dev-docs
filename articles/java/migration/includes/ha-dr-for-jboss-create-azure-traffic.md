---
author: KarlErickson
ms.author: karler
ms.reviewer: zhihaoguo
ms.date: 11/28/2024
---

Create an Azure Traffic Manager profile by following the instructions in [Quickstart: Create a Traffic Manager profile using the Azure portal](/azure/traffic-manager/quickstart-create-traffic-manager-profile). You just need the following sections: **Create a Traffic Manager profile** and **Add Traffic Manager endpoints**. Use the following steps as you go through these sections, then return to this article after you create and configure the Azure Traffic Manager.

1. When you reach the section [Create a Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#create-a-traffic-manager-profile), in step 2 **Create Traffic Manager profile**, use the following steps:

    1. Write down the unique Traffic Manager profile name for **Name** - for example, `tm-profile-gzh032124`.
    1. Write down the new resource group name for **Resource group** - for example, `myResourceGroupTM1`.

1. When you reach the section [Add Traffic Manager endpoints](/azure/traffic-manager/quickstart-create-traffic-manager-profile#add-traffic-manager-endpoints), use the following steps:

    1. After you open the Traffic Manager profile in step 2, in the **Configuration** page, use the following steps:

        1. For **DNS time to live (TTL)**, enter **10**.

        1. Under **Fast endpoint failover settings**, use the following values:

            * For **Probing internal**, select **10**.
            * For **Tolerated number of failures**, enter **3**.
            * For **Probe timeout**, **5**.

        1. Select **Save**. Wait until it completes.

    1. In step 4 for adding the primary endpoint `myPrimaryEndpoint`, use the following steps:

        1. For **Target resource type**, select **Public IP address**.

        1. Select the **Choose public IP address** dropdown and enter the name of the public IP address of the Application Gateway in the **East US** region. You should see one entry matched. Select it for **Public IP address**.

    1. In step 6 for adding a failover secondary endpoint `myFailoverEndpoint`, use the following steps:

        1. For **Target resource type**, select **Public IP address**.

        1. Select the **Choose public IP address** dropdown and enter the name of the public IP address of the Application Gateway in the **West US 2** region. You should see one entry matched. Select it for **Public IP address**.

    1. Wait for a while. Select **Refresh** until the **Monitor status** for endpoint `myPrimaryEndpoint` is **Online** and **Monitor status** for endpoint `myFailoverEndpoint` is **Degraded**.

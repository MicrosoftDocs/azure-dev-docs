---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

1. In the search box at the top of the Azure portal, enter **Resource groups** and select **Resource groups** in the search results.
1. Select the name of resource group for your failover region. Sort items by **Type** in the **Resource Group** page.
1. Select **Type** filter > select *Virtual machine* from dropdown list of **Value** > **Apply**. Select all virtual machines > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.
1. Select **Type** filter > select *Disk* from dropdown list of **Value** > **Apply**. Select all disks > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications, wait until it completes.
1. Select **Type** filter > select *Private endpoint* from dropdown list of **Value** > **Apply**. Select all private endpoints > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes. Ignore this step if type **Private endpoint** is not listed.
1. Select **Type** filter > select *Network Interface* from dropdown list of **Value** > **Apply**. Select all network interfaces > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.
1. Select **Type** filter > select *Storage account* from dropdown list of **Value** > **Apply**. Select all storage accounts > **Delete** > Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.
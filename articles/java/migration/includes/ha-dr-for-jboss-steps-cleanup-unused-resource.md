---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

1. In the search box at the top of the Azure portal, enter **Resource groups** and select **Resource groups** in the search results.
1. Select the name of resource group for your newly created secondary region.
1. Next to the textarea labeled **Filter for any field...**, select the **X** to remove all filters.
1. Select **Add filter**. Set **Filter** to **Type**. Set **Operator** to **Equals**.
1. Select the dropdown menu next to the field **Value**.
1. Toggle the **Select all** checkbox until no values are selected.
1. Ensure all of the following types are selected.
   1. **Virtual machine**.
   1. **Disk**.
   1. **Private endpoint**.
   1. **Network interface**.
   1. **Storage account**.
1. Select the dropdown menu next to the field **Value** to close the dropdown. You must see **5 resource types** as the value of **Value**.
1. Select **Apply**.
1. Select the checkbox next to the label **Name** at the top of the filtered list.
1. Select **Delete**.
1. Enter **delete** to confirm deletion > Select **Delete**. Monitor the process in notifications until it completes.

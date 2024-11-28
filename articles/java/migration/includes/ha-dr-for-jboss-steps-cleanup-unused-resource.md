---
author: KarlErickson
ms.author: zhihaoguo
ms.date: 11/28/2024
---

1. In the search box at the top of the Azure portal, enter **Resource groups** and then select **Resource groups** in the search results.

1. Select the name of resource group for your newly created secondary region.

1. Next to the text area labeled **Filter for any field...**, select the **X** to remove all filters.

1. Select **Add filter**. Set **Filter** to **Type**. Set **Operator** to **Equals**.

1. Select the dropdown menu next to the field **Value**.

1. Toggle the **Select all** checkbox until no values are selected.

1. Ensure that all of the following types are selected:

   * **Virtual machine**
   * **Disk**
   * **Private endpoint**
   * **Network interface**
   * **Storage account**

1. Select the dropdown menu next to the field **Value** to close the dropdown. You must see **5 resource types** as the value of **Value**.

1. Select **Apply**.

1. Select the checkbox next to the label **Name** at the top of the filtered list.

1. Select **Delete**.

1. Enter **delete** to confirm deletion then select **Delete**. Monitor the process in notifications until it completes.

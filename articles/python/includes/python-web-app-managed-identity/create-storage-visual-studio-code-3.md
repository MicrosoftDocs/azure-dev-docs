---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

Create a container named *photos*.

1. Locate **Blob Containers** under the storage account you created.

1. Right-click **Blob Containers** and select **Create Blob Container...**

1. In the dialog box at the top of the screen, enter the name "photos" for the container. 

At this point, you need to set the container's **Public access level** to *Blob (anonymous read access for blobs)*. This can't be done with the Visual Studio Code extension. You can do set access through the Azure portal or Azure CLI. For example, you can right-select the storage account name and select **Open in Portal** and follow the portal instructions.

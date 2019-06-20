---
title: Displaying Javadoc Content in Eclipse for the Azure Libraries Package for Java
description: How to display the Javadoc content for the Azure Libraries in Eclipse.
services: ''
documentationcenter: java
author: rmcmurray
manager: routlaw
editor: ''

ms.assetid: 30f8b6a1-1d76-4d1c-861b-1db478c46e6b
ms.author: robmcm
ms.date: 02/01/2018
ms.devlang: Java
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: na
---

# Displaying Javadoc Content in Eclipse for the Azure Libraries Package for Java

The Javadoc content for the Azure Libraries for Java can be viewed within your Eclipse environment by associating the Javadoc content to the Azure Libraries for Java. The following steps show you how to use this functionality within Eclipse.

This procedure assumes you have already added the Azure Library for Java to your build path.

## To display Javadoc content in Eclipse for the Azure Libraries for Java

1. Within Eclipse's Project Explorer, in the **Referenced Libraries** section of your project, open the context menu for the Azure Library for Java JAR. For example, **microsoft-windowsazure-api-0.1.0.jar** (the version number may be different, dependent upon which version you have installed).

1. Click **Properties**.

1. Within the **Properties** dialog, in the left-hand pane, click **Javadoc Location**. The **Javadoc Location** dialog is displayed.

1. You can specify a **Javadoc URL**, or a **Javadoc in archive**.

   * If you choose to specify a **Javadoc URL**, use the URLs such as **http://dl.windowsazure.com/javadoc** or **http://dl.windowsazure.com/storage/javadoc**.

   * If you choose to use **Javadoc in archive**, you can specify an external file, or a workspace file.

   Make your choice and browse/validate as needed. The following example associates the Azure Libraries for Java with the corresponding Javadoc JAR that has been downloaded locally to a folder named **c:\MyAzureJARs**.

   ![Display Javadoc content.][ic553487]

1. *Optional Step*: Click **Validate**. Potential issues with the Javadoc JAR could be displayed here.

1. Click **OK**.

Once associated with the library, the Javadoc content should display within your Eclipse IDE. For example, if `blob` is defined of type `CloudBlockBlob` within your code, the following is an example of Javadoc content that appears when you type `blob.acquireLease` in code:

![Display Javadoc content.][ic553488]

## Next steps

[!INCLUDE [azure-toolkit-for-eclipse-additional-resources](../includes/azure-toolkit-for-eclipse-additional-resources.md)]

<!-- URL List -->

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh698319.aspx -->

<!-- IMG List -->

[ic553487]: media/azure-toolkit-for-eclipse-displaying-javadoc-content-for-azure-libraries/ic553487.png
[ic553488]: media/azure-toolkit-for-eclipse-displaying-javadoc-content-for-azure-libraries/ic553488.png

---
title: Managing Redis Caches using the Azure Explorer for IntelliJ
description: Learn how to manage your Azure Redis caches by using the Azure Explorer for IntelliJ.
ms.date: 03/14/2022
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
---

# Managing Redis Caches using the Azure Explorer for IntelliJ

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing Redis caches in their Azure account from inside the IntelliJ IDE.

[!INCLUDE [prerequisites](includes/prerequisites.md)]

[!INCLUDE [show-azure-explorer](includes/show-azure-explorer.md)]

## Create a Redis Cache by using IntelliJ

The following steps walk you through the steps to create a Redis cache using the Azure Explorer.

1. Sign in to your Azure account by using the steps in [Sign-in instructions for the Azure Toolkit for IntelliJ].

1. In the **Azure Explorer** tool window, expand the **Azure** node, right-click **Redis Caches**, and then click **Create**.

   ![Create Redis Cache menu][CR01]

1. When the **Create Azure Cache for Redis** dialog box appears, specify the following options:

   * **Basic**:

      * **Subscription**: Specifies the Azure subscription you want to use for the new Redis cache.

      * **Resource Group**: Specifies the resource group for your redis cache. Select one of the following options:

         * **Create new**: Specifies that you want to create a new resource group by clicking **+** to finish.

         * **Use existing**: Specifies that you'll select from a dropdown list of resource groups that are associated with your Azure account.

   * **Instance details**:

      * **DNS Name**: Specifies the DNS subdomain for the new Redis cache, which is prepended to ".redis.cache.windows.net" - for example, **wingtiptoys.redis.cache.windows.net**.

      * **Location**: Specifies the location where your Redis cache is created - for example, **West US**.

      * **Pricing Tier**: Specifies which pricing tier your Redis cache uses. This setting determines the number of client connections. (For more information, see [Azure Cache for Redis pricing].)

      * **Non-TLS port**: Specifies whether your Redis cache allows non-TLS connections. By default, the non-TLS port is disabled. For more information, see [Azure Cache for Redis management FAQs].

      ![Create New Redis Cache dialog box][CR02]

1. When you've specified all your Redis cache settings, click **OK**.

1. After your Redis cache has been created, it will be displayed in the Azure Explorer.

   ![Redis Cache in Azure Explorer][CR03]

> [!NOTE]
> For more information about configuring your Azure Cache for Redis cache settings, see [How to configure Azure Cache for Redis].

## Display the properties for your Redis Cache in IntelliJ

1. In the Azure Explorer, right-click your Redis cache and click **Show properties**.

   ![Azure Explorer context menu to display properties for a Redis cache][SP01]

1. The Azure Explorer displays the properties for your Redis cache.

   ![Redis cache properties][SP02]

## Delete your Redis Cache by using IntelliJ

1. In the Azure Explorer, right-click your Redis cache and click **Delete**.

   ![Azure Explorer context menu to delete a Redis cache][DE01]

1. Click **Yes** when prompted to delete your Redis cache.

   ![Delete Redis cache prompt][DE02]

## Next steps

For more information about Azure Redis caches, configuration settings and pricing, see the following links:

* [Azure Cache for Redis]
* [Azure Cache for Redis documentation]
* [Azure Cache for Redis pricing]
* [How to configure Azure Cache for Redis]

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

[Azure Cache for Redis pricing]: https://azure.microsoft.com/pricing/details/cache/
[Azure Cache for Redis]: https://azure.microsoft.com/services/cache/
[Azure Cache for Redis management FAQs]: /azure/azure-cache-for-redis/cache-management-faq
[Azure Cache for Redis documentation]: /azure/azure-cache-for-redis
[How to configure Azure Cache for Redis]: /azure/azure-cache-for-redis/cache-configure
[Sign-in instructions for the Azure Toolkit for IntelliJ]: ./sign-in-instructions.md

<!-- IMG List -->

[CR01]: media/managing-redis-caches-using-azure-explorer/CR01.png
[CR02]: media/managing-redis-caches-using-azure-explorer/CR02.png
[CR03]: media/managing-redis-caches-using-azure-explorer/CR03.png

[SP01]: media/managing-redis-caches-using-azure-explorer/SP01.png
[SP02]: media/managing-redis-caches-using-azure-explorer/SP02.png

[DE01]: media/managing-redis-caches-using-azure-explorer/DE01.png
[DE02]: media/managing-redis-caches-using-azure-explorer/DE02.png

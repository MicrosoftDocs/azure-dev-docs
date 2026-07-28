---
title: Azure Management Libraries for Java Web App Samples
description: Explore Java web app samples that use Azure management libraries to create and update web apps in App Service. Get the code.
author: bmitchell287
ms.author: brendm
ms.reviewer: jogiles
ms.date: 06/02/2025
ms.topic: concept-article
ms.custom: devx-track-java, devx-track-extended-java
---

# Azure management libraries for Java - web app samples

The following table links to Java source code you can use to create and configure web apps.

| Sample | Description |
|---|---|
| **Create an app** ||
| [Create a web app and manage deployment slots][2] | Create a web app and deploy to staging slots, and then swap deployments between slots. |
| **Configure an app** ||
| [Create a web app and configure a custom domain][3] | Create a web app with a custom domain and self-signed SSL certificate. |
| **Scale an app** ||
| [Scale a web app with high availability across multiple regions][4] | Scale a web app in three different geographical regions and make them available through a single endpoint using Azure Traffic Manager. | 
| **Connect an app to resources** ||
| [Connect a web app to a storage account][5] | Create an Azure storage account and add the storage account connection string to the app settings. |
| [Connect a web app to a SQL database][6] | Create a web app and SQL database, and then add the SQL database connection string to the app settings. |

[2]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/appservice/samples/ManageWebAppSlots.java
[3]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/appservice/samples/ManageWebAppWithCustomDomain.java
[4]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/appservice/samples/ScaleWebAppWithTrafficManager.java
[5]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/appservice/samples/ConnectWebAppToStorageAccount.java
[6]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/appservice/samples/ConnectWebAppToSqlDatabase.java

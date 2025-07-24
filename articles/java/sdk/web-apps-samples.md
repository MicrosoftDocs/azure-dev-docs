---
title: Azure management libraries for Java web app samples
description: Get sample code for creating and updating Azure web apps hosted in App Service using the Azure management libraries for Java.
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
ms.date: 06/02/2025
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Azure management libraries for Java - Web app samples 

The following table links to Java source you can use to create and configure web apps.

| Sample | Description |
|---|---|
| **Create an app** ||
| [Create a web app and deploy from FTP or GitHub][1] | Deploy web apps from local Git, FTP, and continuous integration from GitHub. |
| [Create a web app and manage deployment slots][2] | Create a web app and deploy to staging slots, and then swap deployments between slots. |
| **Configure an app** ||
| [Create a web app and configure a custom domain][3] | Create a web app with a custom domain and self-signed SSL certificate. |
| **Scale an app** ||
| [Scale a web app with high availability across multiple regions][4] | Scale a web app in three different geographical regions and make them available through a single endpoint using Azure Traffic Manager. | 
| **Connect an app to resources** ||
| [Connect a web app to a storage account][5] | Create an Azure storage account and add the storage account connection string to the app settings. |
| [Connect a web app to a SQL database][6] | Create a web app and SQL database, and then add the SQL database connection string to the app settings. |

[1]: ./index.yml
[2]: https://github.com/Azure-Samples/app-service-java-manage-staging-and-production-slots-for-web-apps/
[3]: https://github.com/Azure-Samples/app-service-java-manage-web-apps-with-custom-domains/
[4]: https://github.com/Azure-Samples/app-service-java-scale-web-apps-on-linux
[5]: https://github.com/Azure-Samples/app-service-java-manage-storage-connections-for-web-apps/
[6]: https://github.com/Azure-Samples/app-service-java-manage-data-connections-for-web-apps/

---
title: Azure management libraries for Java web app samples
description: Get sample code for creating and updating Azure web apps hosted in App Service using the Azure management libraries for Java
keywords: Azure, Java, SDK, API, Maven, Gradle, web apps, app service
author: rloutlaw
ms.date: 04/16/2017
ms.topic: article
ms.service: multiple
ms.assetid: 43633e5c-9fb1-4807-ba63-e24c126754e2
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java
---

# Azure management libraries for Java - Web app samples 

The following table links to Java source you can use to create and configure web apps.

**Create an app**

| [Create a web app and deploy from FTP or GitHub][1] | Deploy web apps from local Git, FTP, and continuous integration from GitHub. |
| [Create a web app and manage deployment slots][2] | Create a web app and deploy to staging slots, and then swap deployments between slots. |

**Configure an app**

| [Create a web app and configure a custom domain][3] | Create a web app with a custom domain and self-signed SSL certificate. |

**Scale an apps**

| [Scale a web app with high availability across multiple regions][4] | Scale a web app in three different geographical regions and make them available through a single endpoint using Azure Traffic Manager. | 

**Connect an app to resources**

| [Connect a web app to a storage account][5] | Create an Azure storage account and add the storage account connection string to the app settings. |
| [Connect a web app to a SQL database][6] | Create a web app and SQL database, and then add the SQL database connection string to the app settings. |

[1]: java-sdk-configure-webapp-sources.md
[2]: https://github.com/Azure-Samples/app-service-java-manage-staging-and-production-slots-for-web-apps/
[3]: https://github.com/Azure-Samples/app-service-java-manage-web-apps-with-custom-domains/
[4]: https://azure.microsoft.com/resources/samples/app-service-java-scale-web-apps-on-linux/
[5]: https://github.com/Azure-Samples/app-service-java-manage-storage-connections-for-web-apps/
[6]: https://github.com/Azure-Samples/app-service-java-manage-data-connections-for-web-apps/
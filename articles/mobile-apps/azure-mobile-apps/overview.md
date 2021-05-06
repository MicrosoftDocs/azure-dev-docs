---
title: About Azure Mobile Apps
description: Learn about the Azure Mobile Apps components and services.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# About Azure Mobile Apps

[Azure App Service](https://docs.microsoft.com/azure/app-service/overview) is a fully managed [platform as a service](https://azure.microsoft.com/overview/what-is-paas/) (PaaS) offering for professional developers. The service brings a rich set of capabilities to web, mobile, and integration scenarios.

Azure Mobile Apps gives enterprise developers and system integrators a mobile-application development platform that's highly scalable and globally available.  Using resources in the Azure cloud, it provides your mobile app with:

* Authentication
* Data query
* Offline data synchronization

![Visual overview of Azure Mobile Apps capabilities](./media/overview.png)

## Why Mobile Apps?

With the Mobile Apps SDKs, you can:

* **Build native and cross-platform apps**: Build cloud-enabled apps for Android, iOS, or Windows using native SDKs.
* **Connect to your enterprise systems**: Authenticate your users with Azure Active Directory, and connect to enterprise data stores.
* **Build offline-ready apps with data sync**: Make your mobile workforce more productive by building apps that work offline. Use Azure Mobile Apps to sync data in the background.

## Azure Mobile Apps features

The following features are important to cloud-enabled mobile development:

* **Authentication and authorization**: Use Azure Mobile Apps to sign-in users using social and enterprise provides.  Azure App Service supports Azure Active Directory, Facebook, Google, Microsoft, Twitter, and OpenID Connect.

* **Data access**: Mobile Apps provides a mobile-friendly OData v3 data source that's linked to Azure SQL Database or an on-premises SQL server.

* **Offline sync**: Build robust and responsive mobile applications that operate with an offline dataset. You can sync this dataset automatically with service, and handle conflicts with ease.

* **Client SDKs**: There is a complete set of client SDKs that cover cross-platform development ([.NET](howto/client/dotnet.md), and [Apache Cordova](howto/client/cordova.md)). Each client SDK is available with an MIT license and is open-source.

## Azure App Service features

The following platform features are useful for mobile production sites:

* [**Autoscaling**](https://docs.microsoft.com/azure/app-service/manage-scale-up): With App Service, you can quickly scale up or scale out to handle any incoming customer load. Manually select the number and size of VMs, or set up autoscaling to scale your service based on load or schedule.

* [**Staging environments**](https://docs.microsoft.com/azure/app-service/deploy-staging-slots): App Service can run multiple versions of your site, so you can perform A/B testing, test in production as part of a larger DevOps plan, and do in-place staging of a new mobile service.

* [**Continuous deployment**](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment): App Service can integrate with common _source control management_ (SCM) systems, allowing you to easily deploy a new version of your mobile service.

* [**Virtual networking**](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet): App Service can connect to on-premises resources by using virtual network, Azure ExpressRoute, or hybrid connections.

* [**Isolated and dedicated environments**](https://docs.microsoft.com/azure/app-service/environment/intro): For securely running Azure App Service apps, you can run App Service in a fully isolated and dedicated environment. This environment is ideal for application workloads that require high scale, isolation, or secure network access.

## Next steps

To get started with Azure Mobile Apps, complete a Getting Started tutorial. The tutorial covers the basics of producing a mobile service and client of your choice. It also covers integrating authentication and offline sync. You can complete the tutorial multiple times, once for each client application.

* [Apache Cordova](quickstarts/cordova/index.md)
* [Windows (UWP)](quickstarts/uwp/index.md)
* [Windows (WPF)](quickstarts/wpf/index.md)
* [Xamarin (Android)](quickstarts/xamarin-android/index.md)
* [Xamarin (iOS)](quickstarts/xamarin-ios/index.md)
* [Xamarin (Forms)](quickstarts/xamarin-forms/index.md)

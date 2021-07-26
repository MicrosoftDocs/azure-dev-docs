---
title: Build a Xamarin.Android app with Azure Mobile Apps
description: Get up to speed with Xamarin.Android and Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Build a Xamarin.Android app with Azure Mobile Apps

This tutorial shows you how to add a cloud-based backend service to an Android mobile app by using Xamarin and an Azure mobile app backend.  You will create both a new mobile app backend and a simple *Todo list* app that stores app data in Azure.

You must complete this tutorial before other Xamarin Android tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need:

* An appropriate IDE:
  * For Windows: install [Visual Studio 2019](/xamarin/get-started/installation/windows).
  * For Mac: install [Visual Studio for Mac](/visualstudio/mac/installation).

* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * [Log into your Azure account](/cli/azure/authenticate-azure-cli) and [select a subscription](/cli/azure/manage-azure-subscriptions-azure-cli) using the Azure CLI.
* An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds), with the following settings:
  * Phone: Pixel 4 (includes Play Store)
  * System Image: Pie (API 28, x86, Google Play)

You can complete this tutorial on Mac or Windows.

## Download the Xamarin.Android quickstart project

The Xamarin.Android quickstart project is located in the `samples/xamarin-android` folder of the [azure/azure-mobile-apps](https://github.com/azure/azure-mobile-apps) GitHub repository.  You can [download the repository as a ZIP file](https://github.com/Azure/azure-mobile-apps/archive/main.zip), then unpack it.  The files will be created in the `azure-mobile-apps-main` folder.

Once downloaded, open a Terminal and change directory to the location of the files.

[!INCLUDE [deploy-backend](~/mobile-apps/azure-mobile-apps/includes/quickstart-deploy-backend.md)]

## Configure the Xamarin.Android quickstart project

Open the `ZumoQuickstart` solution in Visual Studio (located at `samples/xamarin-android`).  Edit the `Constants.cs` class to replace the `BackendUrl` with your backend URL.  For example, if your backend URL was `https://zumo-abcd1234.azurewebsites.net`, then the file would look like this:

``` csharp
namespace ZumoQuickstart
{
    /// <summary>
    /// Constants used to configure the application.
    /// </summary>
    public static class Constants
    {
        /// <summary>
        /// The base URL of the backend service within Azure.
        /// </summary>
        public static string BackendUrl { get; } = "https://zumo-abcd1234.azurewebsites.net";
    }
}
```

Save the file.

## Run the app

Select the _Any CPU_ configuration and an Android emulator:

![Android Configuration](../../media/xamarin-android-configuration.png)

Press F5 to build and run the project.  The Android emulator will start, then Visual Studio will install the app. Finally, the app will start.

Enter some text in the **Add New Item** field, then press enter or click the add item button.  The item is added to the list.  Click on the item to set or clear the "completed" flag.

![Quickstart Android](../../media/xamarin-android-startup.png)

## Next steps

Continue on to implement [offline data synchronization](./offline.md).

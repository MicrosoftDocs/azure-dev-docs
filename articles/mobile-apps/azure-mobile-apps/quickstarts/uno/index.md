---
title: Build an Uno Platform app with Azure Mobile Apps
description: Get up to speed with the Uno Platform and Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 09/07/2023
ms.author: adhal
---

# Build an Uno Platform app with Azure Mobile Apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

The [Uno Platform](https://platform.uno/) lets you create .NET UI applications for Windows, macOS, Linux, iOS, Android, and Web Assembly from a single codebase.  This tutorial shows you how to add a cloud-based backend service to an Uno Platform Android mobile app by using Azure Mobile Apps and an Azure mobile app backend. You create both a new mobile app backend and a simple *Todo list* app that stores app data in Azure.

You must complete this tutorial before all other Uno Platform tutorials about using Azure Mobile Apps.

> [!NOTE]
> Although the Uno Platform supports a wide variety of platforms, the Azure Mobile Apps library is only supported on mobile and desktop platforms.  The tutorial only covers the Android platform.

## Prerequisites

To complete this tutorial, you need:

* [Visual Studio 2022](/visualstudio/install/install-visual-studio?view=vs-2022&preserve-view=true) with the following workloads.
  * ASP.NET and web development
  * Azure development
  * .NET desktop development
  * .NET Multi-platform App UI development
* The [Uno Platform for Visual Studio extension](https://platform.uno/visual-studio/).
* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * Sign in with `az login` and select an appropriate subscription before starting.
* (Optional) The [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
* For Android support, an [Android Virtual Device](https://developer.android.com/studio/run/managing-avds) with the following settings:
  * Phone: Any phone image - we use the Pixel 5 for testing.
  * System Image: Android 11 (API 30 with Google APIs)

This tutorial assumes you are using Windows and Visual Studio 2022.  We recommend that you walk through the [Uno Platform tutorial](https://platform.uno/docs/articles/getting-started-tutorial-1.html) to become acquainted with the development process for the Uno Platform.

## Download the sample app

[!INCLUDE [Instructions to download the sample from GitHub.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/download-sample.md)]

## Deploy the backend to Azure

> [!NOTE]
> If you have already deployed the backend from another quick start, you can use the same backend and skip this step.

[!INCLUDE [Instructions for deploying a backend service.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/deploy-backend.md)]

## Configure the sample app

[!INCLUDE [Instructions for configuring the sample code.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-sample.md)]

## Build and run the sample app for Android

1. In the solutions explorer, expand the `uno/Platforms` folder.
1. Right-click the `TodoApp.Uno.Mobile` project and select **Set as Startup Project**.
1. In the top bar, select the **Any CPU** configuration, **TodoApp.Uno.Mobile** target.  Select a suitable Android emulator to run the application:

    ![Screenshot showing how to select an Android emulator in Visual Studio.](./media/win-android-configuration.png)

1. Press **F5** to build and run the project.

Once the app has started, you see an empty list with a text box.  You can:

* Enter some text, then press the **+** icon to add the item.
* Set or clear the check box to mark any item as done.
* Press the refresh icon to reload data from the service.

    ![Screenshot of the Uno Platform app running on Android.](./media/running-android-app.png)

## Next steps

Continue the tutorial by [adding authentication to the app](./authentication.md).

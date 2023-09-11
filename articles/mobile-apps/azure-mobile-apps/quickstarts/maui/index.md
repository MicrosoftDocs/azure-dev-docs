---
title: Build a .NET MAUI app with Azure Mobile Apps
description: Get up to speed with .NET MAUI and Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 09/07/2023
ms.author: adhal
recommendations: false
zone_pivot_group_filename: developer/mobile-apps/azure-mobile-apps/zumo-zone-pivot-groups.json
zone_pivot_groups: vs-platform-options
---

# Build a .NET MAUI app with Azure Mobile Apps

This tutorial shows you how to add a cloud-based backend service to a cross-platform mobile app by using .NET MAUI and an Azure mobile app backend.  You'll create both a new mobile app backend and a simple *Todo list* app that stores app data in Azure.

You must complete this tutorial before other .NET MAUI tutorials using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need:

::: zone pivot="vs2022-windows"

* [Visual Studio 2022](/visualstudio/install/install-visual-studio?view=vs-2022&preserve-view=true) with the following workloads:
  * ASP.NET and web development
  * Azure development
  * Mobile development with .NET
* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * Sign in with `az login` and select an appropriate subscription before starting.
* (Optional) The [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
* An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds), with the following settings:
  * Phone: Any phone image - we use the Pixel 5 for testing.
  * System Image: Android 11 (API 30 with Google APIs)
* An available Mac (for compiling and running the iOS version):
  * Install [XCode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
  * Open Xcode after installing so that it can add any extra required components.
  * Once open, select **XCode Preferences...** > **Components**, and install an iOS simulator.
  * Follow the guide to [Pair to Mac](/xamarin/ios/get-started/installation/windows/connecting-to-mac/).

A mac is required to compile the iOS version.

::: zone-end

::: zone pivot="vs2022-mac"

* [Visual Studio 2022 for Mac](https://visualstudio.microsoft.com/vs/mac/preview/) version 17.4 or later.
  * Ensure that the MAUI workloads are installed and updated.
    * Use `sudo dotnet workload list` to show the installed workloads.
    * Use `sudo dotnet workload install maui` to install the MAUI workloads.
    * Use `sudo dotnet workload update` to update the MAUI workloads.
* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * Sign in with `az login` and select an appropriate subscription.
* (Optional) The [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
* Install [XCode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) v14.0 or later.
  * Open Xcode after installing so that it can download and install any extra required components.
  * Run `xcode-select --install` to install the command line tools.
  * If you have an Apple Developer account, go to **Settings** > **Accounts** and add the account to XCode.

::: zone-end

You can complete this tutorial on Mac or Windows.

## Download the sample app

::: zone pivot="vs2022-windows"

[!INCLUDE [Instructions to download the sample from GitHub on Windows.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/download-sample.md)]

::: zone-end

::: zone pivot="vs2022-mac"

[!INCLUDE [Instructions to download the sample from GitHub on macOS.](~/mobile-apps/azure-mobile-apps/includes/quickstart/mac/download-sample.md)]

::: zone-end

## Deploy the backend to Azure

> [!NOTE]
> If you have already deployed the backend from another quick start, you can use the same backend and skip this step.

::: zone pivot="vs2022-windows"

[!INCLUDE [Instructions for deploying a backend service on Windows.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/deploy-backend.md)]

::: zone-end

::: zone pivot="vs2022-mac"

[!INCLUDE [Instructions for deploying a backend service on macOS.](~/mobile-apps/azure-mobile-apps/includes/quickstart/mac/deploy-back-end.md)]

::: zone-end

## Configure the sample app

::: zone pivot="vs2022-windows"

[!INCLUDE [Instructions for configuring the sample code on Windows.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-sample.md)]

::: zone-end

::: zone pivot="vs2022-mac"

[!INCLUDE [Instructions for configuring the sample code on macOS.](~/mobile-apps/azure-mobile-apps/includes/quickstart/mac/configure-sample.md)]

::: zone-end

## Build and run the Android app

::: zone pivot="vs2022-windows"

1. In the solutions explorer, expand the `maui` folder.
2. Right-click the `TodoApp.MAUI` project and select **Set as Startup Project**.
3. In the top bar, select an appropriate Android emulator:

   ![Screenshot showing how to set the run configuration for a dot net maui for Android app.](./media/win-android-configuration.png)

4. If no Android emulators are available, you need to create one.  For more information, see [Android emulator setup](/xamarin/android/get-started/installation/android-emulator/).  To create a new Android emulator:

   * Select **Tools** > **Android** > **Android Device Manager**.
   * Select **+ New**.
   * Select the following options on the left-hand side:
     * Name: `quickstart`
     * Base Device: **Pixel 5**
     * Processor: **x86_64**
     * OS: **Android 11.0 - API 30**
     * Google APIs: **Checked**
   * Select **Create**.
   * If necessary, accept the license agreement.  The image will then be downloaded.
   * Once the **Start** button appears, press **Start**.
   * If you're prompted about Hyper-V hardware acceleration, read the documentation to enable hardware acceleration before continuing.  The emulator will be slow without enabling hardware acceleration.

   > [!TIP]
   > Start your Android emulator before continuing.  You can do this by opening the Android Device Manager and pressing **Start** next to your chosen emulator.

5. Press **F5** to build and run the project.

Once the app has started, you'll see an empty list and a text box to add items in the emulator.  You can:

* Enter some text in the box, then press Enter to insert a new item.
* Select an item to set or clear the completed flag.
* Press the refresh icon to reload data from the service.

![Screenshot of the running Android app showing the to do list.](./media/android-running-app.png)

::: zone-end

::: zone pivot="vs2022-mac"

1. In the solutions explorer, expand the `maui` folder.
2. Right-click the `TodoApp.MAUI` project and select **Set as Startup Project**.
3. In the top bar, select an appropriate Android emulator:

   ![Screenshot showing how to set the run configuration for a dot net maui for Android app.](./media/mac-android-configuration.png)

4. If no Android emulators are available, you need to create one.  For more information, see [Android emulator setup](/xamarin/android/get-started/installation/android-emulator/).  To create a new Android emulator:

   * Select **Tools** > **Device Manager**.
   * Select **+ New Device**.
   * Select the following options on the left-hand side:
     * Name: `quickstart`
     * Base Device: **Pixel 5**
     * Processor: **arm64-v8A**
     * OS: **Android 11.0 - API 30**
     * Google APIs: **Checked**
   * Select **Create**.
   * If necessary, accept the license agreement.  The image will then be downloaded.
   * Once the **Play** button appears, press **Play**.

5. Press **F5** to build and run the project.

Once the app has started, you'll see an empty list and a text box to add items in the emulator.  You can:

* Enter some text in the box, then press Enter to insert a new item.
* Select an item to set or clear the completed flag.
* Press the refresh icon to reload data from the service.

![Screenshot of the running Android app showing the to do list.](./media/android-running-app.png)

::: zone-end

::: zone pivot="vs2022-windows"

## Build and run the Windows app

1. In the solutions explorer, expand the `maui` folder.
2. Right-click the `TodoApp.MAUI` project and select **Set as Startup Project**.
3. In the top bar, select **Windows Machine**.

   ![Screenshot showing how to set the run configuration for a dot net maui for windows app.](./media/win-windows-configuration.png)


4. Press **F5** to build and run the project.

Once the app has started, you'll see an empty list and a text box to add items.  You can:

* Enter some text in the box, then press Enter to insert a new item.
* Select an item to set or clear the completed flag.
* Press the refresh icon to reload data from the service.

![Screenshot of the running Windows app showing the to do list.](./media/windows-running-app.png)

::: zone-end

::: zone pivot="vs2022-mac"

## Build and run the iOS app

1. In the solutions explorer, expand the `maui` folder.
2. Right-click the `TodoApp.MAUI` project and select **Set as Startup Project**.
3. In the top bar, select an appropriate iOS simulator:

   ![Screenshot showing how to set the run configuration for a dot net maui for iOS app.](./media/mac-ios-configuration.png)

4. Press **F5** to build and run the project.

Once the app has started, you'll see an empty list and a text box to add items in the emulator.  You can:

* Enter some text in the box, then press Enter to insert a new item.
* Select an item to set or clear the completed flag.
* Press the refresh icon to reload data from the service.

![Screenshot of the running iOS app showing the to do list.](./media/ios-running-app.png)

::: zone-end

## Next steps

Continue the tutorial by [adding authentication to the app](./authentication.md).

---
title: Build an Apache Cordova app with Azure Mobile Apps
description: Get up to speed with Apache Cordova and Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Build an Apache Cordova app with Azure Mobile Apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial shows you how to add a cloud-based backend service to an Apache Cordova cross-platform app by using Azure Mobile Apps and an Azure mobile app backend.  You'll create both a new mobile app backend and a simple *Todo list* app that stores app data in Azure.

Complete this tutorial before continuing with other Apache Cordova tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need:

* [A working Apache Cordova 8.1.2 installation](https://cordova.apache.org/docs/en/latest/).
* A text editor (such as [Visual Studio Code](https://code.visualstudio.com/)).
* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * [Log into your Azure account](/cli/azure/authenticate-azure-cli) and [select a subscription](/cli/azure/manage-azure-subscriptions-azure-cli) using the Azure CLI.

This tutorial can be completed on either Windows or Mac systems.  The iOS version of the app can only be run on a Mac.  This tutorial uses Windows (with the app running on Android) only.

### Apache Cordova 8.1.2 or earlier required

Apache Cordova released an incompatible change to the tool in v9.0.0.  If you have Apache Cordova v9.0.0 or later installed, the plugin won't work, complaining of a dependency problem with the `q` module.

### Visual Studio Code

There is an [Apache Cordova extension](https://marketplace.visualstudio.com/items?itemName=Msjsdiag.cordova-tools) for Visual Studio Code that allows you to run the application with debugging.  Visual Studio Code is highly recommended for Apache Cordova development.

### Install Gradle

The most common error when configuring Apache Cordova on Windows is the installing Gradle.  This is installed by default using Android Studio but is not available for normal usage.  Download and unpack the [latest release](https://gradle.org/releases/), then add the `bin` directory to your PATH manually.

## Download the Apache Cordova quickstart project

The Apache Cordova quickstart project is located in the `samples/cordova` folder of the [azure/azure-mobile-apps](https://github.com/azure/azure-mobile-apps) GitHub repository.  You can [download the repository as a ZIP file](https://github.com/Azure/azure-mobile-apps/archive/main.zip), then unpack it.  The files will be created in the `azure-mobile-apps-main` folder.

Once downloaded, open a Terminal and change directory to the location of the files.  

[!INCLUDE [deploy-backend](~/mobile-apps/azure-mobile-apps/includes/quickstart-deploy-backend.md)]

## Configure the Apache Cordova quickstart project

Run `npm install` to install all dependencies.

Add a platform to the project.  For example, to add the Android platform, use:

``` bash
cordova platform add android
```

You can add `browser`, `android`, and `ios` as needed.  The `browser` platform will not work with offline sync enabled. Once you have added all the platforms you wish to use, run `cordova requirements` to ensure all requirements have been met.

Open the `www/js/index.js` file in a text editor.  Edit the definition of `BackendUrl` to show your backend URL.  For example, if your backend URL was `https://zumo-abcd1234.azurewebsites.net`, then the Backend URL would look like this:

``` javascript
    var BackendUrl = "https://zumo-abcd1234.azurewebsites.net";
```

Save the file.  Open the `www/index.html` file in a text editor.  Edit the `Content-Security-Policy` to update the URL to match your backend URL; for example:

``` html
<meta http-equiv="Content-Security-Policy" 
    content="default-src 'self' data: gap: https://zumo-abcd1234.azurewebsites.net; style-src 'self'; media-src *;">
```

To build the app, use the following command:

``` bash
cordova build
```

## Run the app

If running from a browser (using `cordova platform add browser`), then you must enable CORS support within Azure App Service.  To do this, run the following command:

```azurecli
az webapp cors add -g zumo-quickstart --name ZUMOAPPNAME --allowed-origins "*"
```

Replace the `ZUMPAPPNAME` with the name of your Azure App Service mobile backend.  Once the backend is configured, run the following command:

``` bash
cordova run android
```

Once the initial startup is complete, you can add and delete items from the list.  Todo items are stored in the Azure SQL instance connected to your Azure Mobile Apps backend.

If the emulator does not automatically start, open Android Studio, then select **Configure** > **AVD Manager**.  You can now start the emulator manually.  If you run `adb devices -l`, you should see your selected emulated device.  You should now be able to run `cordova run android`.


![Apache Cordova App](../../media/cordova-android-startup.png)

## Next steps

Continue on to implement [offline data synchronization](./offline.md).

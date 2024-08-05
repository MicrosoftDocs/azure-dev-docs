---
title: Build a Windows (WinUI3) app with Azure Mobile Apps
description: Get up to speed with Windows (WinUI3) and Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 09/07/2023
ms.author: adhal
---

# Build a Windows (WinUI3) app with Azure Mobile Apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial shows you how to add a cloud-based backend service to a Windows App SDK (WinUI3) desktop app by using Azure Mobile Apps and an Azure mobile app backend.  You'll create both a new mobile app backend and a simple *Todo list* app that stores app data in Azure.

You must complete this tutorial before all other Windows (WinUI3) tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need:

* [Visual Studio 2022](/visualstudio/install/install-visual-studio?view=vs-2022&preserve-view=true) with the following workloads.
  * ASP.NET and web development
  * Azure development
  * .NET desktop development
  * Universal Windows Platform development
  * In the **Installation details** pane of the installation dialog box, select **Windows App SDK C# Templates** (at the bottom of the list).
  * In the **Individual components** tab of the installation dialog box, in the **SDKs, libraries, and frameworks** section, make sure **Windows 10 SDK** is selected. Choose a version equal to or later than 10.0.19041.0.
* An [Azure account](https://azure.microsoft.com/pricing/free-trial).
* The [Azure CLI](/cli/azure/install-azure-cli).
  * Sign in with `az login` and select an appropriate subscription before starting.
* (Optional) The [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

For more information on the tools required for Windows App SDK development, see [Install tools for the Windows App SDK](/windows/apps/windows-app-sdk/set-up-your-development-environment).

This tutorial can only be completed on a Windows system.

## Download the sample app

[!INCLUDE [Instructions to download the sample from GitHub.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/download-sample.md)]

## Deploy the backend to Azure

> [!NOTE]
> If you have already deployed the backend from another quick start, you can use the same backend and skip this step.

[!INCLUDE [Instructions for deploying a backend service.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/deploy-backend.md)]

## Configure the sample app

[!INCLUDE [Instructions for configuring the sample code.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-sample.md)]

## Build and run the sample app

1. In the solutions explorer, expand the `windows` folder.
1. Right-click the `TodoApp.WinUI` project and select **Set as Startup Project**.
1. Ensure the top bar shows **TodoApp.WinUI (Package)** as the debug target:

    ![Screenshot of the Visual Studio configuration bar.](./media/win-configuration.png)

2. Press **F5** to build and run the project.

Once the app has started, you'll see an empty list with a text box.  You can:

* Enter some text, then press Enter or the **+** icon to add the item.
* Set or clear the check box to mark any item as done.
* Press the refresh icon to reload data from the service.

    ![Screenshot of the Windows app running on Windows.](./media/running-app.png)

## Next steps

Continue the tutorial by [adding authentication to the app](./authentication.md).
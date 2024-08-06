---
title: Add offline data sync to your Windows (WinUI3) app
description: Add offline data sync to your Windows (WinUI3) app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 06/11/2021
ms.author: adhal
---

# Add offline data sync to your Windows (WinUI3) app

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial covers the offline sync feature of Azure Mobile Apps for the Windows App SDK (WinUI3) quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there's no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Before starting this tutorial, you should have completed the [Windows (WinUI3) Quickstart Tutorial](./index.md), which includes creating a suitable backend service.  We also assume you have [added authentication](./authentication.md) to your application.  You can add offline capabilities to your app without authentication.

## Update the app to support offline sync

In online operation, you read to and write from a `IRemoteTable<T>`.  When using offline sync, you read to and write from a `IOfflineTable<T>` instead.  The `IOfflineTable<T>` is backed by an on-device SQLite database, and synchronized with the backend database.

### Add the necessary NuGet packages

[!INCLUDE[Instructions for adding the offline NuGet Packages.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-nuget.md)]

[!INCLUDE[Instructions for altering the code to support offline.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-code.md)]

### Set the offline database location

In the `TodoApp.WinUI` project, edit the `MainWindow.xaml.cs` file.  Change the definition of the `RemoteTodoService` as follows:

``` csharp
_service = new RemoteTodoService(GetAuthenticationToken)
{
    OfflineDb = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\offline.db"
};
```

If you haven't completed the [authentication tutorial](./authentication.md), the definition should look like this instead:

``` csharp
_serviceWinUI3WinUI3W = new RemoteTodoService()
{
    OfflineDb = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\offline.db"
};
```

> [!NOTE]
> You can store the offline database wherever you have read/write/create permissions on a Windows system.  The `Environment.SpecialFolder` class gives standard locations according to the application.

[!INCLUDE [Instructions for testing offline mode.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/test-offline-app.md)]

[!INCLUDE [Instructions to clean up resources.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/clean-up.md)]

## Next steps

* Review the HOW TO documentation:
  * [ASP.NET6 service documentation](~/mobile-apps/azure-mobile-apps/howto/server/dotnet-core.md)
  * [.NET client documentation](~/mobile-apps/azure-mobile-apps/howto/client/dotnet.md)
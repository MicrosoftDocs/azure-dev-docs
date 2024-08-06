---
title: Add offline data sync to your Windows (UWP) app
description: Add offline data sync to your Windows (UWP) app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/11/2022
ms.author: adhal
---

# Add offline data sync to your Windows (UWP) app

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial covers the offline sync feature of Azure Mobile Apps for the UWP quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there's no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Before starting this tutorial, you should have completed the [UWP Quickstart Tutorial](./index.md), which includes creating a suitable backend service.  We also assume you have [added authentication](./authentication.md) to your application.  You can add offline capabilities to your app without authentication.

## Update the app to support offline sync

In online operation, you read to and write from a `IRemoteTable<T>`.  When using offline sync, you read to and write from a `IOfflineTable<T>` instead.  The `IOfflineTable<T>` is backed by an on-device SQLite database, and synchronized with the backend database.

### Add the necessary NuGet packages

[!INCLUDE[Instructions for adding the offline NuGet Packages.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-nuget.md)]

[!INCLUDE[Instructions for altering the code to support offline.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-code.md)]

### Set the offline database location

In the `TodoApp.UWP` project, edit the `App.xaml.cs` file.  Change the definition of the `RemoteTodoService` as follows:

``` csharp
TodoService = new RemoteTodoService(GetAuthenticationToken)
{
    OfflineDb = ApplicationData.Current.LocalCacheFolder.Path + "\\offline.db"
};
```

If you have not completed the [authentication tutorial](./authentication.md), the definition should look like this instead:

``` csharp
TodoService = new RemoteTodoService()
{
    OfflineDb = ApplicationData.Current.LocalCacheFolder.Path + "\\offline.db"
};
```

You may need to add the following to the top of the file if `ApplicationData` is not recognized:

``` csharp
using Windows.Storage;
```

> [!NOTE]
> The Universal Windows Platform restricts where you can read and write data.  You can use any of the storage folders in [`ApplicationData.Current`](/uwp/api/Windows.Storage.ApplicationData?view=winrt-22000&preserve-view=true).  If you want to ensure that the data is available but not backed up to the cloud, use `LocalCacheFolder`.

[!INCLUDE [Instructions for testing offline mode.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/test-offline-app.md)]

[!INCLUDE [Instructions to clean up resources.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/clean-up.md)]

## Next steps

* Review the HOW TO documentation:
  * [ASP.NET6 service documentation](~/mobile-apps/azure-mobile-apps/howto/server/dotnet-core.md)
  * [.NET client documentation](~/mobile-apps/azure-mobile-apps/howto/client/dotnet.md)

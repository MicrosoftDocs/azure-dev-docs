---
title: Add offline data sync to your Xamarin.Android app
description: Add offline data sync to your Xamarin.Android app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 01/12/2024
ms.author: adhal
---

# Add offline data sync to your Xamarin.Android app

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial covers the offline sync feature of Azure Mobile Apps for the Xamarin.Android quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there's no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Before starting this tutorial, you should have completed the [Xamarin.Android Quickstart Tutorial](./index.md), which includes creating a suitable backend service.  We also assume you have [added authentication](./authentication.md) to your application.  However, this is optional.

## Update the app to support offline sync

In online operation, you read to and write from a `IRemoteTable<T>`.  When using offline sync, you read to and write from a `IOfflineTable<T>` instead.  The `IOfflineTable` is backed by an on-device SQLite database, and synchronized with the backend database.

[!INCLUDE[Update NuGet Dependencies on Windows.](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-nuget.md)]

[!INCLUDE[Update RemoteService](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-offline-code.md)]

### Set the offline database location

<!-- TODO: Update for the RemoteTodoService Definition -->

In the `TodoApp.Android` project, edit the `App.xaml.cs` file.  Change the definition of the `RemoteTodoService` as follows:

``` csharp
TodoService = new RemoteTodoService(async () => await GetAuthenticationToken())
{
    OfflineDb = Xamarin.Essentials.FileSystem.AppDataDirectory + "/offline.db"
};
```

If you haven't completed the [authentication tutorial](./authentication.md), the definition should look like this instead:

``` csharp
TodoService = new RemoteTodoService()
{
    OfflineDb = Xamarin.Essentials.FileSystem.AppDataDirectory + "/offline.db"
};
```

[!INCLUDE [Instructions for testing offline mode.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/test-offline-app.md)]

[!INCLUDE [Instructions to clean up resources.](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/clean-up.md)]

## Next steps

* Review the HOW TO documentation:
  * [ASP.NET6 service documentation](~/mobile-apps/azure-mobile-apps/howto/server/dotnet-core.md)
  * [.NET client documentation](~/mobile-apps/azure-mobile-apps/howto/client/dotnet.md)

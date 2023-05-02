---
title: Offline data sync for mobile apps
description: Learn about offline data sync for mobile apps.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/06/2022
ms.author: adhal
---

# Offline Data Sync

Offline data sync is an SDK feature of Azure Mobile Apps. Data is stored in a local store.  When your app is offline, you can still create, modify, and search the data. Data is synchronized with your Azure Mobile Apps service when your device is online. The SDK supports conflict resolution, when the same record is changed on both the client and the service.

Offline sync has several benefits:

* Improves app responsiveness.
* Improves app reliability when there's bad network connectivity.
* Limits network use on high-latency or metered networks.
* Supports disconnected use.

The following tutorials show how to add offline sync to your mobile clients using Azure Mobile Apps:

* [Avalonia: Enable offline sync](../quickstarts/avalonia/offline.md)
* [.NET MAUI: Enable offline sync](../quickstarts/maui/offline.md)
* [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md)
* [Windows (WinUI3): Enable offline sync](../quickstarts/winui/offline.md)
* [Windows (WPF): Enable offline sync](../quickstarts/wpf/offline.md)
* [Xamarin.Android: Enable offline sync](../quickstarts/xamarin-android/offline.md)
* [Xamarin.Forms: Enable offline sync](../quickstarts/xamarin-forms/offline.md)
* [Xamarin.iOS: Enable offline sync](../quickstarts/xamarin-ios/offline.md)

## What is a sync table?

The Azure Mobile Apps SDKs provide an `IRemoteTable<T>` that accesses the service directly.  The operation will fail if the device doesn't have a network connection.  A *sync table* (provided by `IOfflineTable<T>`) provides the same operations against a local database.  The local store can then be synchronized with the service at a later time.  Before any operations can be performed, the local store must be initialized.

## What is a local store?

A local store is the data persistence layer on the client device. Most platforms use SQLite for the local store, but iOS uses Core Data.  You can also implement your own local store. For example, use a version of SQLite with SQLCipher to produce an encrypted store.

## How offline sync works

Your client code controls when local changes are synchronized with a data sync service. Nothing is sent to the service until there you *push* local changes. Similarly, the local store is populated with new data only when you *pull* data.

You can push pending operations for all tables, a list of tables, or one table:

``` csharp
// All tables
await client.PushTablesAsync();

// A list of tables
var tablesToPush = new string[] { "table1", "table2" };
await client.PushTablesAsync(tablesToPush);

// A single table
await table.PushItemsAsync();
```

### Synchronization

The push operation sends all pending changes in the operations queue to the service.  The pending change is sent to the service using an HTTP REST call, which in turn modifies your database.  Push operations are done before any pull operations.  The pull operation pulls changed data from the service and stores it in the local store.

### Implicit Push

If a pull is executed against a table that has pending local updates, the pull first executes a push on the sync context. This push helps minimize conflicts between changes that are already queued and new data from the server.

### Incremental Sync

The Datasync Framework implements "incremental sync".  For each unique query, the `UpdatedAt` field of the last successfully transferred record is stored as a token in the offline store.  Only new records are pulled on successive operations.

### Purging

You can clear the contents of the local store using `IOfflineTable<T>.PurgeAsync`. Purging may be necessary if you have stale data in the client database, or if you wish to discard all pending changes.

A purge clears a table from the local store.  You'll receive an error if purging will remove unsent changes. If you receive an error, you can *force purge* using a parameter.

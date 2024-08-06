---
title: Offline data sync for mobile apps
description: Learn about offline data sync for mobile apps.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/06/2022
ms.author: adhal
---

# Offline data sync

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

Offline data sync is an SDK feature of Azure Mobile Apps. Data is stored in a local store. When your app is offline, you can still create, modify, and search the data. Data is synchronized with your Azure Mobile Apps service when your device is online. The SDK supports conflict resolution when the same record is changed on both the client and the service.

Offline sync has several benefits:

* Improves app responsiveness
* Improves app reliability when there's bad network connectivity
* Limits network use on high-latency or metered networks
* Supports disconnected use

The following tutorials show how to add offline sync to your mobile clients by using Azure Mobile Apps:

* [Avalonia: Enable offline sync](../quickstarts/avalonia/offline.md)
* [.NET MAUI: Enable offline sync](../quickstarts/maui/offline.md)
* [Uno Platform: Enable offline sync](../quickstarts/uno/offline.md)
* [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md)
* [Windows (WinUI3): Enable offline sync](../quickstarts/winui/offline.md)
* [Windows (WPF): Enable offline sync](../quickstarts/wpf/offline.md)
* [Xamarin.Android: Enable offline sync](../quickstarts/xamarin-android/offline.md)
* [Xamarin.Forms: Enable offline sync](../quickstarts/xamarin-forms/offline.md)
* [Xamarin.iOS: Enable offline sync](../quickstarts/xamarin-ios/offline.md)

## What is a sync table?

The Azure Mobile Apps SDKs provide `IRemoteTable<T>`, which accesses the service directly. The operation fails if the device doesn't have a network connection. A *sync table* (provided by `IOfflineTable<T>`) provides the same operations against a local store. The local store can then be synchronized with the service at a later time. Before you perform any operations, you must initialize the local store.

## What is a local store?

A local store is the data persistence layer on the client device. Most platforms use SQLite for the local store, but iOS uses Core Data. You can also implement your own local store. For example, use a version of SQLite with SQLCipher to produce an encrypted store.

## How does offline sync work?

Your client code controls when local changes are synchronized with a data sync service. Nothing is sent to the service until you *push* local changes. Similarly, the local store is populated with new or updated data only when you *pull* data.

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

The push operation sends all pending changes in the operations queue to the service. The pending change is sent to the service through an HTTP REST call, which in turn modifies your database.

Push operations are done before any pull operations. The pull operation pulls changed data from the service and stores it in the local store.

### Implicit push

If you execute a pull against a table that has pending local updates, the pull first executes a push for that table. This push helps minimize conflicts between changes that are already queued and new data from the server. You can optionally configure a push of all tables by setting `PushOtherTables` in `PullOptions`:

```csharp
var pullOptions = new PullOptions { PushOtherTables = true };
await table.PullItemsAsync(pullOptions);
```

### Pulling a subset of records

You can, optionally, specify a query that's used to determine which records should be included in the offline database. For example:

```csharp
var query = table.CreateQuery().Where(x => x.Color == "Blue");
await table.PullItemsAsync(query);
```

### Incremental sync

Azure Mobile Apps implements incremental sync. Only records that have changed since the last pull operation are pulled. Incremental sync saves time and bandwidth when you're processing large tables.

For each unique query, the `UpdatedAt` field of the last successfully transferred record is stored as a token in the offline store. The last `UpdatedAt` value is stored in the delta-token store. The delta-token store is implemented as a table in the offline store.

### Performance and consistency

Synchronization sometimes stops prematurely. For example:

* The network that you're using for synchronization becomes unavailable during the synchronization process.
* You force-close the application during synchronization.

To minimize the risk of a consistency problem within the offline database, each record is written to the database as it's received. You can, optionally, decide to write the records to the database in batches. Batched operations increase the performance of the offline database writes during the pull operation. However, they also increase the risk of an inconsistency between the table metadata and the data within the table.

You can tune the interval between writes as follows:

```csharp
var pullOptions = new PullOptions { WriteDeltaTokenInterval = 25 };
await table.PullItemsAsync(pullOptions);
```

This code gathers writes into batches of 25 records. Performance testing suggests that performance improves up to a value of 25. A `WriteDeltaTokenInterval` value greater than 25 doesn't significantly improve performance.

### Purging

You can clear the contents of the local store by using `IOfflineTable<T>.PurgeItemsAsync`. Purging might be necessary if you have stale data in the client database, or if you want to discard all pending changes. A purge clears a table from the local store. To purge a table:

```csharp
await table.PurgeItemsAsync("", new PurgeOptions());
```

The `PurgeItemsAsync()` method throws an `InvalidOperationException` error if there are pending changes in the table. In this case, you can force the purge to happen:

```csharp
await table.PurgeItemsAsync("", new PurgeOptions { DiscardPendingOperations = true });
```

Purging is a last resort for cleaning up a table in the offline store, because it wipes all records from the cache and requires you to re-download them.

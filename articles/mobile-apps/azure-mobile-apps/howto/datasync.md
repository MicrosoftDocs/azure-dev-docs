---
title: Offline data sync for mobile apps
description: Learn about offline data sync for mobile apps.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Offline Data Sync

Offline data sync is an SDK feature of Azure Mobile Apps. Data is stored in a local store.  When your app is offline, you can still create, modify, and search the data. Data is synchronized with your Azure Mobile Apps service when your device is online. The SDK supports conflict resolution, when the same record is changed on both the client and the service.

Offline sync has several benefits:

* Improves app responsiveness.
* Improves app reliability when there is bad network connectivity.
* Limits network use on high-latency or metered networks.
* Supports disconnected use.

The following tutorials show how to add offline sync to your mobile clients using Azure Mobile Apps:

* [Apache Cordova: Enable offline sync](../quickstarts/cordova/offline.md)
* [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md)
* [Windows (WPF): Enable offline sync](../quickstarts/wpf/offline.md)
* [Xamarin.Android: Enable offline sync](../quickstarts/xamarin-android/offline.md)
* [Xamarin.Forms: Enable offline sync](../quickstarts/xamarin-forms/offline.md)
* [Xamarin.iOS: Enable offline sync](../quickstarts/xamarin-ios/offline.md)

## What is a sync table?

The Azure Mobile Apps SDKs provide an `IMobileServiceTable` that accesses the service directly.  The operation will fail if the device doesn't have a network connection.  A *sync table* provides the same operations against a local database.  The local store can then be synchronized with the service at a later time.  Before any operations can be performed, the local store must be initialized.

## What is a local store?

A local store is the data persistence layer on the client device. Most platforms use SQLite for the local store, but iOS uses Core Data.  Windows requires a plugin.  For more information,  see [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md).  

You can also implement your own local store. For example, use a version of SQLite with SQLCipher to produce an encrypted store.

## What is a sync context?

A *sync context* is associated with the `MobileServiceClient` to track data changes in sync tables. The sync context maintains an *operation queue*.  An operations queue is an ordered list of pending modifications that haven't been sent to the server yet.  A local store is associated with the sync context using an initialize method such as `IMobileServicesSyncContext.InitializeAsync(localstore)` in the .NET client SDK.

## How offline sync works

Your client code controls when local changes are synchronized with an Azure Mobile App service. Nothing is sent to the service until there you *push* local changes. Similarly, the local store is populated with new data only when you *pull* data.

### Synchronization

The push operation sends all pending changes in the operations queue to the service.  The pending change is sent to the service using a HTTP REST call, which in turn modifies your database.  Push operations are done before any pull operations.  The pull operation pulls changed data from the service and stores it in the local store.

### Implicit Push

If a pull is executed against a table that has pending local updates, the pull first executes a push on the sync context. This push helps minimize conflicts between changes that are already queued and new data from the server.

### Incremental Sync

The first parameter to the pull operation is a *query name*. If you use a non-null query name, the Azure Mobile SDK does an *incremental sync*. Each time a pull operation is triggered, the latest `updatedAt` timestamp from that result set is stored. Later pull operations retrieve only records after that timestamp. To use incremental sync, your server must return meaningful `updatedAt` values. The query name must be unique for each logical query in your app.

If the query has a parameter, one way to create a unique query name is to incorporate the parameter value. For instance, if you're filtering on `userId`, your query name could be as follows (in C#):

``` csharp
await todoTable.PullAsync("todoItems" + userid, syncTable.Where(u => u.UserId == userId));
```

If you want to opt out of incremental sync, pass `null` as the query ID. Each pull will retrieve all the records.

### Purging

You can clear the contents of the local store using `IMobileServiceSyncTable.PurgeAsync`. Purging may be necessary if you have stale data in the client database, or if you wish to discard all pending changes.

A purge clears a table from the local store.  You will receive an error if purging will remove unsent changes. If you receive an error, you can *force purge* using a parameter.

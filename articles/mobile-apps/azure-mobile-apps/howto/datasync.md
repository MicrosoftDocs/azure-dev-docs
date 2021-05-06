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

Offline data sync is an SDK feature of Azure Mobile Apps. Data is stored in a local store.  When your app is offline, you can still create, modify, and search the data. When your app is online, data is synchronized with your Azure Mobile Apps service. The SDK supports conflict resolution, when the same record is changed on both the client and the service.

Offline sync has several benefits:

* Improve app responsiveness by caching server data locally on the device
* Create robust apps that remain useful when there are network issues
* Allow end users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices
* Limit network use on high-latency or metered networks

The following tutorials show how to add offline sync to your mobile clients using Azure Mobile Apps:

* [Apache Cordova: Enable offline sync](../quickstarts/cordova/offline.md)
* [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md)
* [Windows (WPF): Enable offline sync](../quickstarts/wpf/offline.md)
* [Xamarin.Android: Enable offline sync](../quickstarts/xamarin-android/offline.md)
* [Xamarin.Forms: Enable offline sync](../quickstarts/xamarin-forms/offline.md)
* [Xamarin.iOS: Enable offline sync](../quickstarts/xamarin-ios/offline.md)

## What is a sync table?

To access the "/tables" endpoint, the Azure Mobile client SDKs provide interfaces such as `IMobileServiceTable` (.NET client SDK). These APIs connect directly to the Azure Mobile App backend and fail if the client device does not have a network connection.

To support offline use, your app should instead use the *sync table* APIs, such as `IMobileServiceSyncTable` (.NET client SDK). All the same CRUD operations (Create, Read, Update, Delete) work against sync table APIs, except now they read from or write to a *local store*. Before any sync table operations can be performed, the local store must be initialized.

## What is a local store?

A local store is the data persistence layer on the client device. Most platforms use SQLite for the local store, but iOS uses Core Data.

Windows apps need the SQLite extension. For more information, see [Windows (UWP): Enable offline sync](../quickstarts/uwp/offline.md).  Android and iOS ship with the correct libraries. You can also implement their own local store. For instance, if you wish to store data in an encrypted store, you can use SQLCipher for encryption.

## What is a sync context?

A *sync context* is associated with the `MobileServiceClient` to track data changes in sync tables. The sync context maintains an *operation queue*.  An operations queue is an ordered list of pending modifications that have not been sent to the server yet.  A local store is associated with the sync context using an initialize method such as `IMobileServicesSyncContext.InitializeAsync(localstore)` in the .NET client SDK.

## How offline sync works

Your client code controls when local changes are synchronized with an Azure Mobile App service. Nothing is sent to the service until there you *push* local changes. Similarly, the local store is populated with new data only when you *pull* data.

### Push

Push is an operation on the sync context. It sends all pending changes since the last push. Push executes a series of REST calls to your Azure Mobile App service, which in turn modifies your server database.

### Pull

Pull is performed on a per-table basis and can be customized with a query to retrieve only a subset of the server data. The Azure Mobile client SDKs then insert the resulting data into the local store.

### Implicit Push

If a pull is executed against a table that has pending local updates, the pull first executes a `push()` on the sync context. This push helps minimize conflicts between changes that are already queued and new data from the server.

### Incremental Sync

The first parameter to the pull operation is a *query name*. If you use a non-null query name, the Azure Mobile SDK performs an *incremental sync*. Each time a pull operation is triggered, the latest `updatedAt` timestamp from that result set is stored. Subsequent pull operations retrieve only records after that timestamp. To use incremental sync, your server must return meaningful `updatedAt` values. The query name must be unique for each logical query in your app.

If the query has a parameter, one way to create a unique query name is to incorporate the parameter value. For instance, if you are filtering on `userId`, your query name could be as follows (in C#):

``` csharp
await todoTable.PullAsync("todoItems" + userid, syncTable.Where(u => u.UserId == userId));
```

If you want to opt out of incremental sync, pass `null` as the query ID. Each pull will retrieve all the records.

### Purging

You can clear the contents of the local store using `IMobileServiceSyncTable.PurgeAsync`. Purging may be necessary if you have stale data in the client database, or if you wish to discard all pending changes.

A purge clears a table from the local store. If there are operations awaiting synchronization with the server database, the purge throws an exception unless the *force purge* parameter is set.

For example, suppose in the "todo list" example, Device1 only pulls items that are not completed. A todoitem "Buy milk" is marked completed on the server by another device. However, Device1 still has the "Buy milk" todoitem in local store because it is only pulling items that are not marked complete. A purge clears this stale item.

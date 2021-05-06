---
title: Add Offline Data Sync to your Apache Cordova App
description: Add offline data sync to your Apache Cordova app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add Offline Sync to your Apache Cordova app

This tutorial covers the offline sync feature of Azure Mobile Apps for the Apache Cordova quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Prior to starting this tutorial, you should have completed the [Apache Cordova Quickstart Tutorial](./index.md), which includes creating a suitable backend service.

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps](../../howto/datasync.md).

## Update the app to support offline sync

In online operation, you use `getTable()` to get a reference to the online table.  When implementing offline capabilities, you use `getSyncTable()` to get a reference to the offline SQlite store.  The SQlite store is provided by the Apache Cordova [`cordova-sqlite-storage` plugin](https://www.npmjs.com/package/cordova-sqlite-storage/v/0.8.2).

> **NOTE**
> Offline synchronization is only available for Android and iOS.  It will not work within the browser platform specification.

In the `www/js/index.js` file:

1. Update the `initializeStore()` method to initialize the local SQlite database:

    ``` javascript
    function initializeStore() {
        store = new WindowsAzure.MobileServiceSqliteStore();

        var tableDefinition = {
            name: 'todoitem',
            columnDefinitions: {
                id: 'string',
                deleted: 'boolean',
                version: 'string',
                Text: 'string',
                Complete: 'boolean'
            }
        };

        return store
            .defineTable(tableDefinition)
            .then(initializeSyncContext);
    }

    function initializeSyncContext() {
        syncContext = client.getSyncContext();
        syncContext.pushHandler = {
            onConflict: function (pushError) {
                return pushError.cancelAndDiscard();
            },
            onError: function (pushError) {
                return pushError.cancelAndDiscard();
            }
        };
        return syncContext.initialize(store);
    }
    ```

2. Update the `setup()` method to use the offline version of the table:

    ``` javascript
    function setup() {
        todoTable = client.getSyncTable('todoitem');
        refreshDisplay();
        addItemEl.addEventListener('submit', addItemHandler);
        refreshButtonEl.addEventListener('click', refreshDisplay);
    }
    ```

3. Replace the `syncLocalTable()` method that will synchronize the data in the offline store with the online store:

    ``` javascript
    function syncLocalTable() {
        return syncContext.push().then(function () {
            return syncContext.pull(new WindowsAzure.Query('todoitem'));
        });
    }
    ```

## Build the app

Run the following commands to build the Android app:

``` bash
cordova clean android
cordova build android
```

You can run the app:

``` bash
cordova run android
```

> **Test within Visual Studio Code**
>
> You can use the debugger within Visual Studio Code if you have the [Cordova Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.cordova-tools) extension installed.  Click on the debugger, then create a `launch.json` file.  When prompted, select **Cordova**, then select the configurations (such as _Run Android on emulator_).
>
> Now that you have a `launch.json`, you can run the app in the debugger.  It will launch on your emulator of choice.  However, you will now be able to see the debug output in your debug console.

## Test the app

In this section, test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.  

When you add data items, they are held in the local SQLite store, but not synced to the mobile service until you refresh the list. Other apps may have different requirements regarding when data needs to be synchronized, but for demo purposes this tutorial has the user explicitly request it.

When you refresh the data, a new background task starts. It first pushes all changes made to the local store using synchronization context, then pulls all changed data from Azure to the local table.

1. Open the app.  TThe data is automatically refreshed from the server.
2. Make some changes to the data through the app.  Add an item, or change the completion state.
3. View the data through the Azure portal, SQL Server Manager, or another app that is viewing the data without offline capabilities.  Changes have not been pushed to the service.
4. Click on the _Refresh_ button to push the changes to the server.
5. View the data again.  Changes have been pushed to the service.

## Next Steps

Continue on to implement [authentication](./auth.md).

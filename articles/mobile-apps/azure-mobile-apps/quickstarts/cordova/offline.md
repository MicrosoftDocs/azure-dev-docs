---
title: Add offline data sync to your Apache Cordova app
description: Add offline data sync to your Apache Cordova app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add offline data sync to your Apache Cordova app

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This tutorial covers the offline sync feature of Azure Mobile Apps for the Apache Cordova quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Prior to starting this tutorial, you should have completed the [Apache Cordova Quickstart Tutorial](./index.md), which includes creating a suitable backend service.

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps](../../howto/data-sync.md).

## Update the app to support offline sync

In online operation, you use `getTable()` to get a reference to the online table.  When implementing offline capabilities, you use `getSyncTable()` to get a reference to the offline SQlite store.  The SQlite store is provided by the Apache Cordova [`cordova-sqlite-storage` plugin](https://www.npmjs.com/package/cordova-sqlite-storage/v/0.8.2).

> [!NOTE]
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

### Test within Visual Studio Code

You can use the debugger within Visual Studio Code if you have the [Cordova Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.cordova-tools) extension installed.  Click on the debugger, then create a `launch.json` file.  When prompted, select **Cordova**, then select the configurations (such as _Run Android on emulator_).  Once you have created a launch configuration, you can run the app in the debugger.  It will launch on your emulator of choice.  However, you will now be able to see the debug output in your debug console.

[!INCLUDE [testing](~/mobile-apps/azure-mobile-apps/includes/quickstart-offline-testing.md)]

## Next steps

Continue on to implement [authentication](./authentication.md).

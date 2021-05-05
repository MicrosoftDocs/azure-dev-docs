---
title: Add Offline Data Sync to your Windows (UWP) App
description: Add offline data sync to your Windows (UWP) app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add Offline Sync to your Windows (UWP) app

This tutorial covers the offline sync feature of Azure Mobile Apps for the UWP quickstart app. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

Prior to starting this tutorial, you should have completed the [UWP Quickstart Tutorial](./index.md), which includes creating a suitable backend service.

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps](../../howto/datasync.md).

In online operation, you read to and write from a `MobileServiceTable`.  When using offline sync, you read to and write from a `MobileServiceSyncTable` instead.  The `MobileServiceSyncTable` is backed by an on-device SQLite database, and synchronized with the backend database.

In the `DataModel/TodoService.cs` class:

1. Update the definition of the `mTable` variable, and add a definition for the local store.  Comment out the current definition, and uncomment the offline sync version.

    ``` csharp
    // private IMobileServiceTable<TodoItem> mTable;
    private IMobileServiceSyncTable<TodoItem> mTable;
    private MobileServiceSQLiteStore mStore;
    ```

   Ensure you add relevant imports using Alt+Enter.

2. Update the `InitializeAsync()` method to define the offline version of the table :

    ``` csharp
    private async Task InitializeAsync()
    {
        using (await initializationLock.LockAsync())
        {
            if (!isInitialized)
            {
                // Define the offline store.
                mStore = new MobileServiceSQLiteStore("todoitems.db");
                mStore.DefineTable<TodoItem>();
                await mClient.SyncContext.InitializeAsync(mStore).ConfigureAwait(false);

                // Get a reference to the table.
                mTable = mClient.GetSyncTable<TodoItem>();
                isInitialized = true;
            }
        }
    }
    ```

3. Replace the `SynchronizeAsync()` method that will synchronize the data in the offline store with the online store:

    ``` csharp
    public async Task SynchronizeAsync()
    {
        await InitializeAsync().ConfigureAwait(false);

        IReadOnlyCollection<MobileServiceTableOperationError> syncErrors = null;
        try
        {
            await mClient.SyncContext.PushAsync().ConfigureAwait(false);
            await mTable.PullAsync("todoitems", mTable.CreateQuery()).ConfigureAwait(false);
        }
        catch (MobileServicePushFailedException error)
        {
            if (error.PushResult != null)
            {
                syncErrors = error.PushResult.Errors;
            }
        }

        if (syncErrors != null)
        {
            foreach (var syncError in syncErrors)
            {
                if (syncError.OperationKind == MobileServiceTableOperationKind.Update && syncError.Result != null)
                {
                    // Prefer server copy
                    await syncError.CancelAndUpdateItemAsync(syncError.Result).ConfigureAwait(false);
                }
                else
                {
                    // Discard local copy
                    await syncError.CancelAndDiscardItemAsync().ConfigureAwait(false);
                }
            }
        }
    }
    ```

## Test the app

In this section, test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.  

When you add data items, they are held in the local SQLite store, but not synced to the mobile service until you refresh the list. Other apps may have different requirements regarding when data needs to be synchronized, but for demo purposes this tutorial has the user explicitly request it.

When you refresh the data, a new background task starts. It first pushes all changes made to the local store using synchronization context, then pulls all changed data from Azure to the local table.

1. Open the app.  This will automatically refresh the data from the server.
2. Make some changes to the data through the app.  Add an item, or change the completion state.
3. View the data through the Azure Portal, SQL Server Manager, or another app that is viewing the data without offline capabilities.  Note that the changes have not been pushed to the service.
4. Click on the _Refresh_ button to push the changes to the server.
5. View the data again.  Note that the changes have been pushed to the service.

## Next Steps

Continue on to implement [authentication](./auth.md).

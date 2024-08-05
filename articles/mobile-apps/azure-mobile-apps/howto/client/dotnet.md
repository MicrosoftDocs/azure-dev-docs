---
title: How to use the .NET SDK for Azure Mobile Apps
description: How to use the .NET SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 09/07/2023
ms.author: adhal
---

# How to use the Azure Mobile Apps client library for .NET

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This guide shows you how to perform common scenarios using the .NET client library for Azure Mobile Apps. Use the .NET client library in any .NET 6 or .NET Standard 2.0 application, including MAUI, Xamarin, and Windows (WPF, UWP, and WinUI).

If you're new to Azure Mobile Apps, consider first completing one of the quickstart tutorials:

* [AvaloniaUI](../../quickstarts/avalonia/index.md)
* [MAUI (Android and iOS)](../../quickstarts/maui/index.md)
* [Uno Platform](../../quickstarts/uno/index.md)
* [Windows (UWP)](../../quickstarts/uwp/index.md)
* [Windows (WinUI3)](../../quickstarts/winui/index.md)
* [Windows (WPF)](../../quickstarts/wpf/index.md)
* [Xamarin (Android Native)](../../quickstarts/xamarin-android/index.md)
* [Xamarin (iOS Native)](../../quickstarts/xamarin-ios/index.md)
* [Xamarin Forms (Android and iOS)](../../quickstarts/xamarin-forms/index.md)

> [!NOTE]
> This article covers the latest (v6.0) edition of the Microsoft Datasync Framework.  For older clients, see the [v4.2.0 documentation](./dotnet-v4.md).

## Supported platforms

The .NET client library supports any .NET Standard 2.0 or .NET 6 platform, including:

* .NET MAUI for Android, iOS, and Windows platforms.
* Android API level 21 and later (Xamarin and Android for .NET).
* iOS version 12.0 and later (Xamarin and iOS for .NET).
* Universal Windows Platform builds 19041 and later.
* Windows Presentation Framework (WPF).
* Windows App SDK (WinUI 3).
* Xamarin.Forms

In addition, samples have been created for [Avalonia](https://www.avaloniaui.net/) and [Uno Platform](https://platform.uno/).  The [TodoApp sample](https://github.com/Azure/azure-mobile-apps/tree/main/samples/TodoApp) contains an example of each tested platform.

## Setup and Prerequisites

Add the following libraries from NuGet:

* [Microsoft.Datasync.Client]
* [Microsoft.Datasync.Client.SQLiteStore] if using offline tables.

If using a platform project (for example, .NET MAUI), ensure you add the libraries to the platform project and any shared project.

## Create the service client

The following code creates the service client, which is used to coordinate all communication to the backend and offline tables.

```csharp
var options = new DatasyncClientOptions 
{
    // Options set here
};
var client = new DatasyncClient("MOBILE_APP_URL", options);
```

In the preceding code, replace `MOBILE_APP_URL` with the URL of the [ASP.NET Core backend](../server/dotnet-core.md).  The client should be created as a singleton.  If using an authentication provider, it can be configured like this:

```csharp
var options = new DatasyncClientOptions 
{
    // Options set here
};
var client = new DatasyncClient("MOBILE_APP_URL", authProvider, options);
```

More details on the authentication provider are provided later in this document.

### Options

A complete (default) set of options can be created like this:

``` csharp
var options = new DatasyncClientOptions
{
    HttpPipeline = new HttpMessageHandler[](),
    IdGenerator = (table) => Guid.NewGuid().ToString("N"),
    InstallationId = null,
    OfflineStore = null,
    ParallelOperations = 1,
    SerializerSettings = null,
    TableEndpointResolver = (table) => $"/tables/{tableName.ToLowerInvariant()}",
    UserAgent = $"Datasync/5.0 (/* Device information */)"
};
```

#### HttpPipeline

Normally, an HTTP request is made by passing the request through the authentication provider (which adds the `Authorization` header for the currently authenticated user) before sending the request.  You can, optionally, add more delegating handlers.  Each request passes through the delegating handlers before being sent to the service.  Delegating handlers allow you to add extra headers, do retries, or provide logging capabilities.

Examples of delegating handlers are provided for [logging](#enable-request-logging) and [adding request headers](#customize-request-headers) later in this article.

#### IdGenerator

When an entity is added to an offline table, it must have an ID.  An ID is generated if one isn't provided.  The `IdGenerator` option allows you to tailor the ID that is generated.  By default, a globally unique ID is generated. For example, the following setting generates a string that includes the table name and a GUID:

``` csharp
var options = new DatasyncClientOptions 
{
    IdGenerator = (table) => $"{table}-{Guid.NewGuid().ToString("D").ToUpperInvariant()}"
}
```

#### InstallationId

If an `InstallationId` is set, a custom header `X-ZUMO-INSTALLATION-ID` is sent with each request to identify the combination of the application on a specific device.  This header can be recorded in logs and allows you to determine the number of distinct installations for your app.  If you use `InstallationId`, the ID should be stored in persistent storage on the device so that unique installations can be tracked.

#### OfflineStore

The `OfflineStore` is used when configuring offline data access.  For more information, see [Work with offline tables](#work-with-offline-tables).

#### ParallelOperations

Part of the offline synchronization process involves pushing queued operations to the remote server.  When the push operation is triggered, the operations are submitted in the order they were received.  You can, optionally, use up to eight threads to push these operations.  Parallel operations use more resources on both client and server to complete the operation faster.  The order in which operations arrive at the server can't be guaranteed when using multiple threads.

#### SerializerSettings

If you've changed the serializer settings on the data sync server, you need to make the same changes to the `SerializerSettings` on the client.  This option allows you to specify your own serializer settings.

#### TableEndpointResolver

By convention, tables are located on the remote service at the `/tables/{tableName}` path (as specified by the `Route` attribute in the server code).  However, tables can exist at any endpoint path.  The `TableEndpointResolver` is a function that turns a table name into a path for communicating with the remote service.

For example, the following changes the assumption so that all tables are located under `/api`:

``` csharp
var options = new DatasyncClientOptions
{
    TableEndpointResolver = (table) => $"/api/{table}"
};
```

#### UserAgent

The data sync client generates a suitable User-Agent header value based on the version of the library.  Some developers feel the user agent header leaks information about the client.  You can set the `UserAgent` property to any valid header value.

## Work with remote tables

The following section details how to search and retrieve records and modify the data within a remote table.  The following topics are covered:

* [Create a table reference](#create-a-remote-table-reference)
* [Query data](#query-data-from-a-remote-server)
* [Count items from a query](#count-items-from-a-query)
* [Look up remote data by ID](#look-up-remote-data-by-id)
* [Insert data on the remote server](#insert-data-on-the-remote-server)
* [Update data on the remote server](#update-data-on-the-remote-server)
* [Delete data on the remote server](#delete-data-on-the-remote-server)
* [Conflict resolution and optimistic concurrency](#conflict-resolution-and-optimistic-concurrency)

### Create a remote table reference

To create a remote table reference, use `GetRemoteTable<T>`:

``` csharp
IRemoteTable<TodoItem> remoteTable = client.GetRemoteTable();
```

If you wish to return a read-only table, use the `IReadOnlyRemoteTable<T>` version:

``` csharp
IReadOnlyRemoteTable<TodoItem> remoteTable = client.GetRemoteTable();
```

The model type must implement the `ITableData` contract from the service.  Use `DatasyncClientData` to provide the required fields:

``` csharp
public class TodoItem : DatasyncClientData
{
    public string Title { get; set; }
    public bool IsComplete { get; set; }
}
```

The `DatasyncClientData` object includes:

* `Id` (string) - a globally unique ID for the item.
* `UpdatedAt` (System.DataTimeOffset) - the date/time that the item was last updated.
* `Version` (string) - an opaque string used for versioning.
* `Deleted` (boolean) - if `true`, the item is deleted.

The service maintains these fields.  Don't adjust these fields as part of your client application.

Models can be annotated using [Newtonsoft.JSON attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm).  The name of the table can be specified by using the `DataTable` attribute:

``` csharp
[DataTable("todoitem")]
public class MyTodoItemClass : DatasyncClientData
{
    public string Title { get; set; }
    public bool IsComplete { get; set; }
}
```

Alternatively, specify the name of the table in the `GetRemoteTable()` call:

``` csharp
IRemoteTable<TodoItem> remoteTable = client.GetRemoteTable("todoitem");
```

The client uses the path `/tables/{tablename}` as the URI. The table name is also the name of the offline table in the SQLite database.

### Supported types

Aside from primitive types (int, float, string, etc.), the following types are supported for models:

* `System.DateTime` - as an ISO-8601 UTC date/time string with ms accuracy.
* `System.DateTimeOffset` - as an ISO-8601 UTC date/time string with ms accuracy.
* `System.Guid` - formatted as 32 digits separated as hyphens.

### Query data from a remote server

The remote table can be used with LINQ-like statements, including:

* Filtering with a `.Where()` clause.
* Sorting with various `.OrderBy()` clauses.
* Selecting properties with `.Select()`.
* Paging with `.Skip()` and `.Take()`.

### Count items from a query

If you need a count of the items that the query would return, you can use `.CountItemsAsync()` on a table or `.LongCountAsync()` on a query:

```csharp
// Count items in a table.
long count = await remoteTable.CountItemsAsync();

// Count items in a query.
long count = await remoteTable.Where(m => m.Rating == "R").LongCountAsync();
```

This method causes a round-trip to the server.  You can also get a count while populating a list (for example), avoiding the extra round-trip:

```csharp
var enumerable = remoteTable.ToAsyncEnumerable() as AsyncPageable<T>;
var list = new List<T>();
long count = 0;
await foreach (var item in enumerable)
{
    count = enumerable.Count;
    list.Add(item);
}
```

The count will be populated after the first request to retrieve the table contents.

#### Returning all data

Data is returned via an [IAsyncEnumerable]:

``` csharp
var enumerable = remoteTable.ToAsyncEnumerable();
await foreach (var item in enumerable) 
{
    // Process each item
}
```

Use any of the following terminating clauses to convert the `IAsyncEnumerable<T>` to a different collection:

```csharp
T[] items = await remoteTable.ToArrayAsync();

Dictionary<string, T> items = await remoteTable.ToDictionaryAsync(t => t.Id);

HashSet<T> items = await remoteTable.ToHashSetAsync();

List<T> items = await remoteTable.ToListAsync();
```

Behind the scenes, the remote table handles paging of the result for you.  All items are returned irrespective of how many server side requests are needed to fulfill the query.  These elements are also available on query results (for example, `remoteTable.Where(m => m.Rating == "R")`).

The Data sync framework also provides `ConcurrentObservableCollection<T>` - a thread-safe observable collection.  This class can be used in the context of UI applications that would normally use `ObservableCollection<T>` to manage a list (for example, Xamarin Forms or MAUI lists).  You can clear and load a `ConcurrentObservableCollection<T>` directly from a table or query:

```csharp
var collection = new ConcurrentObservableCollection<T>();
await remoteTable.ToObservableCollection(collection);
```

Using `.ToObservableCollection(collection)` triggers the `CollectionChanged` event once for the entire collection rather than for individual items, resulting in a faster redraw time.  

The `ConcurrentObservableCollection<T>` also has predicate-driven modifications:

```csharp
// Add an item only if the identified item is missing.
bool modified = collection.AddIfMissing(t => t.Id == item.Id, item);

// Delete one or more item(s) based on a predicate
bool modified = collection.DeleteIf(t => t.Id == item.Id);

// Replace one or more item(s) based on a predicate
bool modified = collection.ReplaceIf(t => t.Id == item.Id, item);
```

Predicate-driven modifications can be used in event handlers when the index of the item isn't known in advance.

#### Filtering data

You can use a `.Where()` clause to filter data.  For example:

``` csharp
var items = await remoteTable.Where(x => !x.IsComplete).ToListAsync();
```

Filtering is done on the service prior to the IAsyncEnumerable and on the client after the IAsyncEnumerable.  For example:

``` csharp
var items = (await remoteTable.Where(x => !x.IsComplete).ToListAsync()).Where(x => x.Title.StartsWith("The"));
```

The first `.Where()` clause (return only incomplete items) is executed on the service, whereas the second `.Where()` clause (starting with "The") is executed on the client.

The `Where` clause supports operations that be translated into the OData subset. Operations include:

* Relational operators (`==`, `!=`, `<`, `<=`, `>`, `>=`),
* Arithmetic operators (`+`, `-`, `/`, `*`, `%`),
* Number precision (`Math.Floor`, `Math.Ceiling`),
* String functions (`Length`, `Substring`, `Replace`, `IndexOf`, `Equals`, `StartsWith`, `EndsWith`) (ordinal and invariant cultures only),
* Date properties (`Year`, `Month`, `Day`, `Hour`, `Minute`, `Second`),
* Access properties of an object, and
* Expressions combining any of these operations.

#### Sorting data

Use `.OrderBy()`, `.OrderByDescending()`, `.ThenBy()`, and `.ThenByDescending()` with a property accessor to sort data.

``` csharp
var items = await remoteTable.OrderBy(x => x.IsComplete).ThenBy(x => x.Title).ToListAsync();
```

The sorting is done by the service.  You can't specify an expression in any sorting clause.  If you wish to sort by an expression, use client-side sorting:

``` csharp
var items = await remoteTable.ToListAsync().OrderBy(x => x.Title.ToLowerCase());
```

#### Selecting properties

You can return a subset of data from the service:

``` csharp
var items = await remoteTable.Select(x => new { x.Id, x.Title, x.IsComplete }).ToListAsync();
```

#### Return a page of data

You can return a subset of the data set using `.Skip()` and `.Take()` to implement paging:

``` csharp
var pageOfItems = await remoteTable.Skip(100).Take(10).ToListAsync();
```

In a real world app, you can use queries similar to the preceding example with a pager control or comparable UI to
navigate between pages.

All the functions described so far are additive, so we can keep chaining them. Each chained call affects more of the query. One more example:

```csharp
var query = todoTable
                .Where(todoItem => todoItem.Complete == false)
                .Select(todoItem => todoItem.Text)
                .Skip(3).
                .Take(3);
List<string> items = await query.ToListAsync();
```

### Look up remote data by ID

The `GetItemAsync` function can be used to look up objects from the database with a particular ID.

```csharp
TodoItem item = await remoteTable.GetItemAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D");
```

If the item you're trying to retrieve has been soft-deleted, you must use the `includeDeleted` parameter:

```csharp
// The following code will throw a DatasyncClientException if the item is soft-deleted.
TodoItem item = await remoteTable.GetItemAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D");

// This code will retrieve the item even if soft-deleted.
TodoItem item = await remoteTable.GetItemAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D", includeDeleted: true);
```

### Insert data on the remote server

All client types must contain a member named **Id**, which is by default a string. This **Id** is required to perform CRUD operations and for offline sync. The following code illustrates how to use the `InsertItemAsync` method to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

```csharp
var item = new TodoItem { Title = "Text", IsComplete = false };
await remoteTable.InsertItemAsync(item);
// Note that item.Id will now be set
```

If a unique custom ID value isn't included in the `item` during an insert, the server generates an ID. You can retrieve the generated ID by inspecting the object after the call returns.

### Update data on the remote server

The following code illustrates how to use the `ReplaceItemAsync` method to update an existing record with the same ID with new information.

```csharp
// In this example, we assume the item has been created from the InsertItemAsync sample

item.IsComplete = true;
await remoteTable.ReplaceItemAsync(todoItem);
```

### Delete data on the remote server

The following code illustrates how to use the `DeleteItemAsync` method to delete an existing instance.

```csharp
// In this example, we assume the item has been created from the InsertItemAsync sample

await todoTable.DeleteItemAsync(item);
```

### Conflict resolution and optimistic concurrency

Two or more clients can write changes to the same item at the same time. Without conflict detection, the last write would overwrite any previous updates. **Optimistic concurrency control** assumes that each transaction can commit and therefore doesn't use any resource locking.  Optimistic concurrency control verifies that no other transaction has modified the data before committing the data. If the data has been modified, the transaction is rolled back.

Azure Mobile Apps supports optimistic concurrency control by tracking changes to each item using the `version` system property column that is defined for each table in your Mobile App backend. Each time a record is updated, Mobile Apps sets the `version` property for that record to a new value. During each update request, the `version` property of the record included with the request is compared to the same property for the record on the server. If the version passed with the request doesn't match the backend, then the client library raises a `DatasyncConflictException<T>` exception. The type included with the exception is the record from the backend containing the servers version of the record. The application can then use this information to decide whether to execute the update request again with the correct `version` value from the backend to commit changes.

Optimistic concurrency is automatically enabled when using the `DatasyncClientData` base object.

In addition to enabling optimistic concurrency, you must also catch the `DatasyncConflictException<T>` exception in your code.  Resolve the conflict by applying the correct `version` to the updated record and then repeat the call with the resolved record. The following code shows how to resolve a write conflict once detected:

```csharp
private async void UpdateToDoItem(TodoItem item)
{
    DatasyncConflictException<TodoItem> exception = null;

    try
    {
        //update at the remote table
        await remoteTable.UpdateAsync(item);
    }
    catch (DatasyncConflictException<TodoItem> writeException)
    {
        exception = writeException;
    }

    if (exception != null)
    {
        // Conflict detected, the item has changed since the last query
        // Resolve the conflict between the local and server item
        await ResolveConflict(item, exception.Item);
    }
}


private async Task ResolveConflict(TodoItem localItem, TodoItem serverItem)
{
    //Ask user to choose the resolution between versions
    MessageDialog msgDialog = new MessageDialog(
        String.Format("Server Text: \"{0}\" \nLocal Text: \"{1}\"\n",
        serverItem.Text, localItem.Text),
        "CONFLICT DETECTED - Select a resolution:");

    UICommand localBtn = new UICommand("Commit Local Text");
    UICommand ServerBtn = new UICommand("Leave Server Text");
    msgDialog.Commands.Add(localBtn);
    msgDialog.Commands.Add(ServerBtn);

    localBtn.Invoked = async (IUICommand command) =>
    {
        // To resolve the conflict, update the version of the item being committed. Otherwise, you will keep
        // catching a MobileServicePreConditionFailedException.
        localItem.Version = serverItem.Version;

        // Updating recursively here just in case another change happened while the user was making a decision
        UpdateToDoItem(localItem);
    };

    ServerBtn.Invoked = async (IUICommand command) =>
    {
        RefreshTodoItems();
    };

    await msgDialog.ShowAsync();
}
```

## Work with offline tables

Offline tables use a local SQLite store to store data for use when offline.  All table operations are done against the local SQLite store instead of the remote server store.  Ensure you add the `Microsoft.Datasync.Client.SQLiteStore` to each platform project and to any shared projects.

Before a table reference can be created, the local store must be prepared:

```csharp
var store = new OfflineSQLiteStore(Constants.OfflineConnectionString);
store.DefineTable<TodoItem>();
```

Once the store has been defined, you can create the client:

``` csharp
var options = new DatasyncClientOptions 
{
    OfflineStore = store
};
var client = new DatasyncClient("MOBILE_URL", options);
```

Finally, you must ensure that the offline capabilities are initialized:

``` csharp
await client.InitializeOfflineStoreAsync();
```

Store initialization is normally done immediately after the client is created.  The **OfflineConnectionString** is a URI used for specifying both the location of the SQLite database and the options used to open the database. For more information, see [URI Filenames in SQLite](https://sqlite.org/uri.html).  

* To use an in-memory cache, use `file:inmemory.db?mode=memory&cache=private`.
* To use a file, use `file:/path/to/file.db`

You must specify the absolute filename for the file.  If using Xamarin, you can use the [Xamarin Essentials File System Helpers](/xamarin/essentials/file-system-helpers?context=xamarin%2Fxamarin-forms&tabs=android) to construct a path: For example:

``` csharp
var dbPath = $"{Filesystem.AppDataDirectory}/todoitems.db";
var store = new OfflineSQLiteStore($"file:/{dbPath}?mode=rwc");
```

If you're using MAUI, you can use the [MAUI File System Helpers](/dotnet/maui/platform-integration/storage/file-system-helpers) to construct a path: For example:

``` csharp
var dbPath = $"{Filesystem.AppDataDirectory}/todoitems.db";
var store = new OfflineSQLiteStore($"file:/{dbPath}?mode=rwc");
```

### Create an offline table

A table reference can be obtained using the `GetOfflineTable<T>` method:

```csharp
IOfflineTable<TodoItem> table = client.GetOfflineTable<TodoItem>();
```

As with the remote table, you can also expose a read-only offline table:

```csharp
IReadOnlyOfflineTable<TodoItem> table = client.GetOfflineTable<TodoItem>();
```

You don't need to authenticate to use an offline table.  You only need to authenticate when you're communicating with the backend service.

### Synchronize an Offline Table

Offline tables aren't synchronized with the backend by default.  Synchronization is split into two pieces.  You can push changes separately from downloading new items.  For example:

```csharp
public async Task SyncAsync()
{
    ReadOnlyCollection<TableOperationError> syncErrors = null;

    try
    {
        foreach (var offlineTable in offlineTables.Values)
        {
            await offlineTable.PushItemsAsync();
            await offlineTable.PullItemsAsync("", options);
        }
    }
    catch (PushFailedException exc)
    {
        if (exc.PushResult != null)
        {
            syncErrors = exc.PushResult.Errors;
        }
    }

    // Simple error/conflict handling
    if (syncErrors != null)
    {
        foreach (var error in syncErrors)
        {
            if (error.OperationKind == TableOperationKind.Update && error.Result != null)
            {
                //Update failed, reverting to server's copy.
                await error.CancelAndUpdateItemAsync(error.Result);
            }
            else
            {
                // Discard local change.
                await error.CancelAndDiscardItemAsync();
            }

            Debug.WriteLine(@"Error executing sync operation. Item: {0} ({1}). Operation discarded.", error.TableName, error.Item["id"]);
        }
    }
}
```

By default, all tables use incremental synchronization - only new records are retrieved.  A record is included for each unique query (generated by creating an MD5 hash of the OData query).

> [!NOTE]
> The first argument to `PullItemsAsync` is the OData query that indicates which records to pull to the device. It's better to modify the service to only return records specific to the user rather than to create complex queries on the client side.

The options (defined by the `PullOptions` object) don't generally need to be set.  Options include:

* `PushOtherTables` - if set to true, all tables are pushed.
* `QueryId` - a specific query ID to use rather than the generated one.
* `WriteDeltaTokenInterval` - how often to write the delta-token used to track incremental synchronization.

The SDK performs an implicit `PushAsync()` before pulling records.

Conflict handling happens on a `PullAsync()` method.  Handle conflicts in the same way as online tables.  The conflict is produced when `PullAsync()` is called instead of during the insert, update, or delete. If multiple conflicts happen, they're bundled into a single `PushFailedException`.  Handle each failure separately.

### Push changes for all tables

To push all changes to the remote server, use:

``` csharp
await client.PushTablesAsync();
```

To push changes for a subset of tables, provide an `IEnumerable<string>` to the `PushTablesAsync()` method:

``` csharp
var tablesToPush = new string[] { "TodoItem", "Notes" };
await client.PushTables(tablesToPush);
```

Use the `client.PendingOperations` property to read the number of operations waiting to be pushed to the remote service.  This property is `null` when no offline store has been configured.

### Run complex SQLite queries

If you need to do complex SQL queries against the offline database, you can do so using the `ExecuteQueryAsync()` method.  For example, to do a `SQL JOIN` statement, define a `JObject` that shows the structure of the return value, then use `ExecuteQueryAsync()`:

``` csharp
var definition = new JObject() 
{
    { "id", string.Empty },
    { "title", string.Empty },
    { "first_name", string.Empty },
    { "last_name", string.Empty }
};
var sqlStatement = "SELECT b.id as id, b.title as title, a.first_name as first_name, a.last_name as last_name FROM books b INNER JOIN authors a ON b.author_id = a.id ORDER BY b.id";

var items = await store.ExecuteQueryAsync(definition, sqlStatement, parameters);
// Items is an IList<JObject> where each JObject conforms to the definition.
```

The definition is a set of key/values.  The keys must match the field names that the SQL query returns, and the values must be the default value of the type expected.  Use `0L` for numbers (long), `false` for booleans, and `string.Empty` for everything else.  

> SQLite has a restrictive set of supported types.  Date/times are stored as the number of milliseconds since the epoch to allow comparisons.

## Authenticate users

Azure Mobile Apps allows you to generate an authentication provider for handling authentication calls.  Specify the authentication provider when constructing the service client:

``` csharp
AuthenticationProvider authProvider = GetAuthenticationProvider();
var client = new DatasyncClient("APP_URL", authProvider);
```

Whenever authentication is required, the authentication provider is called to get the token.  A generic authentication provider can be used for both Authorization header based authentication and App Service Authentication and Authorization based authentication. Use the following model:

``` csharp
public AuthenticationProvider GetAuthenticationProvider()
    => new GenericAuthenticationProvider(GetTokenAsync);

// Or, if using Azure App Service Authentication and Authorization
// public AuthenticationProvider GetAuthenticationProvider()
//    => new GenericAuthenticationProvider(GetTokenAsync, "X-ZUMO-AUTH");

public async Task<AuthenticationToken> GetTokenAsync()
{
    // TODO: Any code necessary to get the right access token.
    
    return new AuthenticationToken 
    {
        DisplayName = "/* the display name of the user */",
        ExpiresOn = DateTimeOffset.Now.AddHours(1), /* when does the token expire? */
        Token = "/* the access token */",
        UserId = "/* the user id of the connected user */"
    };
}
```

Authentication tokens are cached in memory (never written to device) and refreshed when necessary.

### Use the Microsoft identity platform

The Microsoft identity platform allows you to easily integrate with Microsoft Entra ID.  See the quick start tutorials for a complete tutorial on how to implement Microsoft Entra authentication.  The following code shows an example of retrieving the access token:

``` csharp
private readonly string[] _scopes = { /* provide your AAD scopes */ };
private readonly object _parentWindow; /* Fill in with the required object before using */
private readonly PublicClientApplication _pca; /* Create one */

public MyAuthenticationHelper(object parentWindow) 
{
    _parentWindow = parentWindow;
    _pca = PublicClientApplicationBuilder.Create(clientId)
            .WithRedirectUri(redirectUri)
            .WithAuthority(authority)
            /* Add options methods here */
            .Build();
}

public async Task<AuthenticationToken> GetTokenAsync()
{
    // Silent authentication
    try
    {
        var account = await _pca.GetAccountsAsync().FirstOrDefault();
        var result = await _pca.AcquireTokenSilent(_scopes, account).ExecuteAsync();
        
        return new AuthenticationToken 
        {
            ExpiresOn = result.ExpiresOn,
            Token = result.AccessToken,
            UserId = result.Account?.Username ?? string.Empty
        };    
    }
    catch (Exception ex) when (exception is not MsalUiRequiredException)
    {
        // Handle authentication failure
        return null;
    }

    // UI-based authentication
    try
    {
        var account = await _pca.AcquireTokenInteractive(_scopes)
            .WithParentActivityOrWindow(_parentWindow)
            .ExecuteAsync();
        
        return new AuthenticationToken 
        {
            ExpiresOn = result.ExpiresOn,
            Token = result.AccessToken,
            UserId = result.Account?.Username ?? string.Empty
        };    
    }
    catch (Exception ex)
    {
        // Handle authentication failure
        return null;
    }
}
```

For more information on integrating the Microsoft identity platform with ASP.NET 6, see the [Microsoft identity platform](/azure/active-directory/develop/v2-overview) documentation.

### Use Xamarin Essentials or MAUI WebAuthenticator

For Azure App Service Authentication, you can use the [Xamarin Essentials WebAuthenticator](/xamarin/essentials/web-authenticator) or the [MAUI WebAuthenticator](/dotnet/maui/platform-integration/communication/authentication) to get a token:

``` csharp
Uri authEndpoint = new Uri(client.Endpoint, "/.auth/login/aad");
Uri callback = new Uri("myapp://easyauth.callback");

public async Task<AuthenticationToken> GetTokenAsync()
{
    var authResult = await WebAuthenticator.AuthenticateAsync(authEndpoint, callback);
    return new AuthenticationToken 
    {
        ExpiresOn = authResult.ExpiresIn,
        Token = authResult.AccessToken
    };
}
```

The `UserId` and `DisplayName` aren't directly available when using Azure App Service Authentication.  Instead, use a lazy requestor to retrieve the information from the `/.auth/me` endpoint:

``` csharp
var userInfo = new AsyncLazy<UserInformation>(() => GetUserInformationAsync());

public async Task<UserInformation> GetUserInformationAsync() 
{
    // Get the token for the current user
    var authInfo = await GetTokenAsync();

    // Construct the request
    var request = new HttpRequestMessage(HttpMethod.Get, new Uri(client.Endpoint, "/.auth/me"));
    request.Headers.Add("X-ZUMO-AUTH", authInfo.Token);

    // Create a new HttpClient, then send the request
    var httpClient = new HttpClient();
    var response = await httpClient.SendAsync(request);

    // If the request is successful, deserialize the content into the UserInformation object.
    // You will have to create the UserInformation class.
    if (response.IsSuccessStatusCode) 
    {
        var content = await response.ReadAsStringAsync();
        return JsonSerializer.Deserialize<UserInformation>(content);
    }
}
```

## Advanced topics

### Purging entities in the local database

Under normal operation, purging entities isn't required.  The synchronization process removes deleted entities and maintains the required metadata for local database tables.  However, there are times when purging entities within the database is helpful.  One such scenario is when you need to delete a large number of entities and it's more efficient to wipe data from the table locally.

To purge records from a table, use `table.PurgeItemsAsync()`:

```csharp
var query = table.CreateQuery();
var purgeOptions = new PurgeOptions();
await table.PurgeItermsAsync(query, purgeOptions, cancellationToken);
```

The query identifies the entities to be removed from the table.  Identify the entities to be purged using LINQ:

```csharp
var query = table.CreateQuery().Where(m => m.Archived == true);
```

The `PurgeOptions` class provides settings to modify the purge operation:

* `DiscardPendingOperations` discards any pending operations for the table that are in the operations queue waiting to be sent to the server.
* `QueryId` specifies a query ID that is used to identify the delta token to use for the operation.
* `TimestampUpdatePolicy` specifies how to adjust the delta token at the end of the purge operation:
  * `TimestampUpdatePolicy.NoUpdate` indicates the delta token must not be updated.
  * `TimestampUpdatePolicy.UpdateToLastEntity` indicates the delta token should be updated to the `updatedAt` field for the last entity stored in the table.
  * `TimestampUpdatePolicy.UpdateToNow` indicates the delta token should be updated to the current date/time.
  * `TimestampUpdatePolicy.UpdateToEpoch` indicates the delta token should be reset to synchronize all data.

Use the same `QueryId` value you used when calling `table.PullItemsAsync()` to synchronize data. The `QueryId` specifies the delta token to update when the purge is complete. 

### Customize request headers

To support your specific app scenario, you might need to customize communication with the Mobile App backend. For example, you can add a custom header to every outgoing request or change response status codes before returning to the user. Use a custom [DelegatingHandler], as in the following example:

```csharp
public async Task CallClientWithHandler()
{
    var options = new DatasyncClientOptions
    {
        HttpPipeline = new DelegatingHandler[] { new MyHandler() }
    };
    var client = new Datasync("AppUrl", options);
    var todoTable = client.GetRemoteTable<TodoItem>();
    var newItem = new TodoItem { Text = "Hello world", Complete = false };
    await todoTable.InsertItemAsync(newItem);
}

public class MyHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // Change the request-side here based on the HttpRequestMessage
        request.Headers.Add("x-my-header", "my value");

        // Do the request
        var response = await base.SendAsync(request, cancellationToken);

        // Change the response-side here based on the HttpResponseMessage

        // Return the modified response
        return response;
    }
}
```

### Enable request logging

You can also use a DelegatingHandler to add request logging:

```csharp
public class LoggingHandler : DelegatingHandler
{
    public LoggingHandler() : base() { }
    public LoggingHandler(HttpMessageHandler innerHandler) : base(innerHandler) { }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token)
    {
        Debug.WriteLine($"[HTTP] >>> {request.Method} {request.RequestUri}");
        if (request.Content != null)
        {
            Debug.WriteLine($"[HTTP] >>> {await request.Content.ReadAsStringAsync().ConfigureAwait(false)}");
        }

        HttpResponseMessage response = await base.SendAsync(request, token).ConfigureAwait(false);

        Debug.WriteLine($"[HTTP] <<< {response.StatusCode} {response.ReasonPhrase}");
        if (response.Content != null)
        {
            Debug.WriteLine($"[HTTP] <<< {await response.Content.ReadAsStringAsync().ConfigureAwait(false)}");
        }

        return response;
    }
}
```

### Monitor synchronization events

When a synchronization event happens, the event is published to the `client.SynchronizationProgress` event delegate.  The events can be used to monitor the progress of the synchronization process.  Define a synchronization event handler as follows:

```csharp
client.SynchronizationProgress += (sender, args) => {
    // args is of type SynchronizationEventArgs
};
```

The `SynchronizationEventArgs` type is defined as follows:

```csharp
public enum SynchronizationEventType
{
    PushStarted,
    ItemWillBePushed,
    ItemWasPushed,
    PushFinished,
    PullStarted,
    ItemWillBeStored,
    ItemWasStored,
    PullFinished
}

public class SynchronizationEventArgs
{
    public SynchronizationEventType EventType { get; }
    public string ItemId { get; }
    public long ItemsProcessed { get; } 
    public long QueueLength { get; }
    public string TableName { get; }
    public bool IsSuccessful { get; }
}
```

The properties within `args` are either `null` or `-1` when the property isn't relevant to the synchronization event.

<!-- NuGet Packages -->
[Microsoft.Datasync.Client]: https://www.nuget.org/packages/Microsoft.Datasync.Client
[Microsoft.Datasync.Client.SQLiteStore]: https://www.nuget.org/packages/Microsoft.Datasync.Client.SQLiteStore

<!-- DOTNET API References -->
[DelegatingHandler]: /dotnet/api/system.net.http.delegatinghandler
[IAsyncEnumerable]: /dotnet/api/system.collections.generic.iasyncenumerable-1

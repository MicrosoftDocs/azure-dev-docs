---
title: How to use the .NET SDK for Azure Mobile Apps
description: How to use the .NET SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/06/2022
ms.author: adhal
---

# How to use the Azure Mobile Apps client library for .NET

This guide shows you how to perform common scenarios using the .NET client library for Azure Mobile Apps.  Use the .NET client library in Windows (WPF, UWP) or Xamarin (Native or Forms) applications.  If you're new to Azure Mobile Apps, consider first completing the [Quickstart for Xamarin.Forms](../../quickstarts/xamarin-forms/index.md) tutorial.  

> [!NOTE]
> This article covers the latest (v5.0.0) edition of the Microsoft Datasync Framework.  For older clients, see the [v4.2.0 documentation](./dotnet-v4.md).

## Supported platforms

The .NET client library supports .NET Standard 2.0, .NET 6 and the following platforms:

* Xamarin.Android above API level 19.
* Xamarin.iOS version 8.0 and above..
* Universal Windows Platform builds 19041 and above.
* Windows Presentation Framework (WPF).
* Windows App SDK (WinUI 3).
* .NET MAUI for Android, iOS, and Windows platforms.

Other platforms may work, but haven't been tested at this time.  The TodoApp sample (located in the samples directory) contains an example of each tested platform.

## Setup and Prerequisites

Add the following libraries from NuGet:

* [Microsoft.Datasync.Client]
* [Microsoft.Datasync.Client.SQLiteStore] if using offline tables.

If using a platform project (for example, Xamarin.Forms), ensure you add the libraries to the platform project and any shared project.

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

More details on the authentication provider are given below.

### Options

The following options can be set:

* `HttpPipeline` - an ordered list of [DelegatingHandler] objects used for constructing the HTTP pipeline.
* `IdGenerator` - a function that returns an ID for a new entity when required.
* `InstallationId` - a globally unique string for identifying "this" application on "this" device.
* `OfflineStore` - the offline store to use.
* `SerializerSettings` - the JSON serializer settings to use.
* `UserAgent` - the User-Agent header value to use.

When not specified, default values are used for each option.

* `HttpPipeline` - an empty pipeline.
* `IdGenerator` - a new GUID, represented as a series of hex digits.
* `InstallationId` - a generated GUID that is stored on device in between application runs.
* `OfflineStore` - not set - offline tables aren't available.
* `SerializerSettings` - a default set of serializer settings suitable for communicating with the default service.
* `UserAgent` - `Datasync/5.0 (/* device information */)` - the device information is replaced by details of the device.

To generate a different ID, use `IdGenerator`.  For example, the following options will generate an ID comprised of the table name and a GUID:

``` csharp
var options = new DataSyncClientOptions 
{
    IdGenerator = (tableName) => $"{tableName}-{Guid.NewGuid().ToString("D").ToUpper()}"
};
```

## Work with remote tables

The following section details how to search and retrieve records and modify the data within a remote table.  The following topics are covered:

* [Create a table reference](#create-a-remote-table-reference)
* [Query data](#query-data-from-a-remote-server)
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

These fields are maintained by the service and shouldn't be set by the client application.

Models can be annotated using [Newtonsoft.JSON attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm).  In addition, the name of the table may be specified by using the `DataTable` attribute:

``` csharp
[DataTable("todoitem")]
public class MyTodoItemClass : DatasyncClientData
{
    public string Title { get; set; }
    public bool IsComplete { get; set; }
}
```

Alternatively, you can specify the name of the table in the `GetRemoteTable()` call:

``` csharp
IRemoteTable<TodoItem> remoteTable = client.GetRemoteTable("todoitem");
```

The client will use the path `/tables/tablename` as the URI, and the table name will be the name of the offline table in the SQLite database.

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

#### Returning all data

Data is returned via an [IAsyncEnumerable]:

``` csharp
var enumerable = remoteTable.ToAsyncEnumerable();
await foreach (var item in enumerable) 
{
    // Process each item
}
```

In addition, you can use any of the terminating clauses for IAsyncEnumerable from the [System.Linq.Async] package:

``` csharp
var items = await remoteTable.ToAsyncEnumerable().ToListAsync();
```

Behind the scenes, the remote table is handling paging of the result for you.  All items will be returned irrespective of how many server side requests are needed to fulfill the query.

#### Filtering data

You can use a `.Where()` clause to filter data.  Multiple `.Where()` clauses are combined with "AND".  For example:

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
* String functions (`Length`, `Substring`, `Replace`, `IndexOf`, `Equals`, `StartsWith`, `EndsWith`),
  * When using culture-aware functions, Ordinal and Invariant cultures are supported.
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
MobileServiceTableQuery<TodoItem> query = todoTable
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

### Insert data on the remote server

All client types must contain a member named **Id**, which is by default a string. This **Id** is required to perform CRUD operations and for offline sync. The following code illustrates how to use the `InsertItemAsync` method to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

```csharp
var item = new TodoItem { Title = "Text", IsComplete = false };
await remoteTable.InsertItemAsync(item);
// Note that item.Id will now be set
```

If a unique custom ID value isn't included in the `item` during an insert, a GUID is generated by the server. You can retrieve the generated ID by inspecting the object after the call returns.

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

Two or more clients may write changes to the same item at the same time. Without conflict detection, the last write would overwrite any previous updates. **Optimistic concurrency control** assumes that each transaction can commit and therefore doesn't use any resource locking.  Optimistic concurrency control verifies that no other transaction has modified the data before committing the data. If the data has been modified, the transaction is rolled back.

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

Store initialization is normally done immediately after the client is created.  The **OfflineConnectionString** is a URI used for specifying both the location of the SQLite database and the options used to open the database.  For more information, see [URI Filenames in SQLite](https://sqlite.org/uri.html).  

* To use an in-memory cache, use `file:inmemory.db?mode=memory&cache=private`.
* To use a file, use `file:/path/to/file.db`

You must specify the absolute filename for the file.  If using Xamarin, you can use the [Xamarin.Essentials File System Helpers](/xamarin/essentials/file-system-helpers?context=xamarin%2Fxamarin-forms&tabs=android) to construct a path: For example:

``` csharp
var dbPath = $"{Filesystem.AppDataDirectory}/todoitems.db";
var store = new OfflineSQLiteStore($"file://{dbPath}?mode=rwc");
```

### Create an offline table

A table reference can be obtained using the `GetOfflineTable<T>` method:

```csharp
var table = client.GetOfflineTable<TodoItem>();
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

The options (defined by the `PullOptions` object) do not generally need to be set.  Options include:

* `PushOtherTables` - if set to true, all tables are pushed.
* `QueryId` - a specific query ID to use rather than the generated one.

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

### Run complex SQLite queries

If you need to do complex SQL queries against the offline database, you can do so using the `ExecuteQueryAsync()` method.  For example, to do a `SQL JOIN` statement, define the return value form, then use `ExecuteQueryAsync()`:

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

The definition is a set of key/values.  The keys must match the field names being returned by the SQL statement, and the values must be the default value of the type expected.  Use `0L` for numbers (long), `false` for booleans, and a string for everything else.  SQLite has a restrictive set of types to work with.  Date/times are stored as a numeric value (as ms since the epoch) for comparison.

## Authenticate users

Azure Mobile Apps allows you to generate an authentication provider for handling authentication calls.  Specify the authentication provider when constructing the service client:

``` csharp
AuthenticationProvider authProvider = GetAuthenticationProvider();
var client = new DatasyncClient("APP_URL", authProvider);
```

Whenever authentication is required, the authentication provider will be called to get the token.  A generic authentication provider can be used for both Authorization header based authentication and App Service Authentication and Authorization based authentication. Use the following model:

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

### Use the Microsoft Identity Platform

The Microsoft Identity Platform allows you to easily integrate with Azure Active Directory.  See the quick start tutorials for a complete tutorial on how to implement Azure Active Directory authentication.  The following code shows an example of retrieving the access token:

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

For more information on integrating the Microsoft Identity Platform with ASP.NET 6, see the [Microsoft Identity Platform](/azure/active-directory/develop/v2-overview) documentation.

### Use Xamarin.Essentials WebAuthenticator

For Azure App Service Authentication, you can use the [Xamarin.Essentials WebAuthenticator](/xamarin/essentials/web-authenticator) to get a token:

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

### Customize request headers

To support your specific app scenario, you might need to customize communication with the Mobile App backend. For example, you may want to add a custom header to every outgoing request or even change responses status codes. You can use a custom [DelegatingHandler], as in the following example:

```csharp
public async Task CallClientWithHandler()
{
    var options = new DatasyncClientOptions
    {
        HttpPipeline = new DelegatingHandler[] { new MyHandler() }
    };
    var client = new Datasync("AppUrl", options);
    var todoTable = client.GetRemoveTable<TodoItem>();
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

<!-- NuGet Packages -->
[Microsoft.Datasync.Client]: https://www.nuget.org/packages/Microsoft.Datasync.Client
[Microsoft.Datasync.Client.SQLiteStore]: https://www.nuget.org/packages/Microsoft.Datasync.Client.SQLiteStore
[System.Linq.Async]: https://www.nuget.org/packages/System.Linq.Async/

<!-- DOTNET API References -->
[DelegatingHandler]: /dotnet/api/system.net.http.delegatinghandler
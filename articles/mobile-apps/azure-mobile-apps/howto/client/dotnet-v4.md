---
title: How to use the .NET v4.2.0 SDK for Azure Mobile Apps
description: How to use the .NET v4.2.0 SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# How to use the Azure Mobile Apps v4.2.0 client library for .NET

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This guide shows you how to perform common scenarios using the .NET client library for Azure Mobile Apps.  Use the .NET client library in Windows (WPF, UWP) or Xamarin (Native or Forms) applications.  If you are new to Azure Mobile Apps, consider first completing the [Quickstart for Xamarin.Forms](../../quickstarts/xamarin-forms/index.md) tutorial.  

> [!WARNING]
> This article covers information for the v4.2.0 library version, which is superceded by the v5.0.0 library.  For the most up to date information, see the article for the [latest version](./dotnet.md)

## Supported platforms

The .NET client library supports .NET Standard 2.0 and the following platforms:

* Xamarin.Android from API level 19 up to API level 30.
* Xamarin.iOS version 8.0 through 14.3.
* Universal Windows Platform builds 16299 and above.
* Any .NET Standard 2.0 application.

The "server-flow" authentication uses a WebView for the presented UI and may not be available on every platform.  If it isn't available, you must provide a "client-flow" authentication.  This client library is not suitable for watch or IoT form factors when using authentication.

## Setup and prerequisites

We assume that you have already created and published your Azure Mobile Apps backend project, which includes at least one table.  In the code used in this topic, the table is named `TodoItem` and it has a string `Id`, and `Text` fields and a boolean `Complete` column.  This table is the same table created when you complete the [Quickstart](../../quickstarts/xamarin-forms/index.md).

The corresponding typed client-side type in C# is this class:

``` csharp
public class TodoItem
{
    public string Id { get; set; }

    [JsonProperty(PropertyName = "text")]
    public string Text { get; set; }

    [JsonProperty(PropertyName = "complete")]
    public bool Complete { get; set; }
}
```

The [JsonPropertyAttribute](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonPropertyAttribute.htm) is used to define the *PropertyName* mapping between the client field and the table field.

To learn how to create tables in your Mobile Apps backend, see the [.NET Server SDK topic](../server/dotnet-framework.md) the [Node.js Server SDK topic](../server/nodejs.md).

### Install the managed client SDK package

Right-click your project, press **Manage NuGet Packages**, search for the `Microsoft.Azure.Mobile.Client` package, then press **Install**.  For offline capabilities, install the `Microsoft.Azure.Mobile.Client.SQLiteStore` package as well.

## Create the Azure Mobile Apps client

The following code creates the [MobileServiceClient](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient) object that is used to access your Mobile App backend.

```csharp
var client = new MobileServiceClient("MOBILE_APP_URL");
```

In the preceding code, replace `MOBILE_APP_URL` with the URL of the App Service backend. The `MobileServiceClient` object should be a singleton.

## Work with tables

The following section details how to search and retrieve records and modify the data within the table.  The following
topics are covered:

* [Create a table reference](#create-a-table-reference)
* [Query data](#query-data-from-your-mobile-app)
* [Filter returned data](#filter-returned-data)
* [Sort returned data](#sort-returned-data)
* [Return data in pages](#return-data-in-pages)
* [Select specific columns](#select-specific-columns)
* [Look up a record by ID](#look-up-data-by-id)
* [Execute untyped queries](#execute-untyped-queries)
* [Insert data](#insert-data)
* [Update data](#update-data)
* [Delete data](#delete-data)
* [Conflict resolution and optimistic concurrency](#conflict-resolution-and-optimistic-concurrency)
* [Bind data to a Windows user interface](#bind-data-to-a-windows-user-interface)
* [Change the page size](#change-the-page-size)

### Create a table reference

All the code that accesses or modifies data in a backend table calls functions on the `MobileServiceTable` object. Obtain a reference to the table by calling the [GetTable](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient.gettable) method, as follows:

```csharp
IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
```

The returned object uses the typed serialization model. An untyped serialization model is also supported. The following example [creates a reference to an untyped table](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient.gettable):

```csharp
// Get an untyped table reference
IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");
```

In untyped queries, you must specify the underlying OData query string.

### Query data from your mobile app

This section describes how to issue queries to the Mobile App backend, which includes the following functionality:

* [Filter returned data](#filter-returned-data)
* [Sort returned data](#sort-returned-data)
* [Return data in pages](#return-data-in-pages)
* [Select specific columns](#select-specific-columns)
* [Look up a record by ID](#look-up-data-by-id)

> [!NOTE]
> A server-driven page size is enforced to prevent all rows from being returned.  Paging keeps default requests for large data sets from negatively impacting the service.  To return more than 50 rows, use the `Skip` and `Take` method, as described in [Return data in pages](#return-data-in-pages).

### Filter returned data

The following code illustrates how to filter data by including a `Where` clause in a query. It returns all items from `todoTable` whose `Complete` property is equal to `false`. The [Where](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.where) function applies a row filtering predicate to the query against the table.

```csharp
// This query filters out completed TodoItems and items without a timestamp.
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .ToListAsync();
```

You can view the URI of the request sent to the backend by using message inspection software, such as browser developer tools or [Fiddler](https://www.telerik.com/fiddler). If you look at the request URI, notice that the query string is modified:

```csharp
GET /tables/todoitem?$filter=(complete+eq+false) HTTP/1.1
```

This OData request is translated into an SQL query by the Server SDK:

```csharp
SELECT *
    FROM TodoItem
    WHERE ISNULL(complete, 0) = 0
```

The function that is passed to the `Where` method can have an arbitrary number of conditions.

```csharp
// This query filters out completed TodoItems where Text isn't null
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false && todoItem.Text != null)
    .ToListAsync();
```

This example would be translated into an SQL query by the Server SDK:

```csharp
SELECT *
    FROM TodoItem
    WHERE ISNULL(complete, 0) = 0
          AND ISNULL(text, 0) = 0
```

This query can also be split into multiple clauses:

```csharp
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .Where(todoItem => todoItem.Text != null)
    .ToListAsync();
```

The two methods are equivalent and may be used interchangeably.  The former option&mdash;of concatenating
multiple predicates in one query&mdash;is more compact and recommended.

The `Where` clause supports operations that be translated into the OData subset. Operations include:

* Relational operators (`==`, `!=`, `<`, `<=`, `>`, `>=`),
* Arithmetic operators (`+`, `-`, `/`, `*`, `%`),
* Number precision (`Math.Floor`, `Math.Ceiling`),
* String functions (`Length`, `Substring`, `Replace`, `IndexOf`, `StartsWith`, `EndsWith`),
* Date properties (`Year`, `Month`, `Day`, `Hour`, `Minute`, `Second`),
* Access properties of an object, and
* Expressions combining any of these operations.

When considering what the Server SDK supports, you can consider the [OData v3 Documentation](https://www.odata.org/documentation/odata-version-3-0/).

### Sort returned data

The following code illustrates how to sort data by including an [OrderBy](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.orderby) or [OrderByDescending](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.orderbydescending) function in the query. It returns items from `todoTable` sorted ascending by the `Text` field.

```csharp
// Sort items in ascending order by Text field
MobileServiceTableQuery<TodoItem> query = todoTable
                .OrderBy(todoItem => todoItem.Text)
List<TodoItem> items = await query.ToListAsync();

// Sort items in descending order by Text field
MobileServiceTableQuery<TodoItem> query = todoTable
                .OrderByDescending(todoItem => todoItem.Text)
List<TodoItem> items = await query.ToListAsync();
```

### Return data in pages

By default, the backend returns only the first 50 rows. You can increase the number of returned rows by calling the [Take](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.take) method. Use `Take` along with the [Skip](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.skip) method to request a specific "page" of the total dataset returned by the query. The following query, when executed, returns the top three items in the table.

```csharp
// Define a filtered query that returns the top 3 items.
MobileServiceTableQuery<TodoItem> query = todoTable.Take(3);
List<TodoItem> items = await query.ToListAsync();
```

The following revised query skips the first three results and returns the next three results. This query produces the second "page" of data, where the page size is three items.

```csharp
// Define a filtered query that skips the top 3 items and returns the next 3 items.
MobileServiceTableQuery<TodoItem> query = todoTable.Skip(3).Take(3);
List<TodoItem> items = await query.ToListAsync();
```

The [IncludeTotalCount](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.includetotalcount) method requests the total count for *all* the records that would have been returned,
ignoring any paging/limit clause specified:

```csharp
query = query.IncludeTotalCount();
```

In a real world app, you can use queries similar to the preceding example with a pager control or comparable UI to
navigate between pages.

> [!NOTE]
> To override the 50-row limit in a Mobile App backend, you must also apply the [EnableQueryAttribute](/previous-versions/aspnet/dn726413(v=vs.118)) to the public GET method and specify the paging behavior. When applied to the method, the following sets the maximum returned rows to 1000:
>
> `[EnableQuery(MaxTop=1000)]`


### Select specific columns

You can specify which set of properties to include in the results by adding a [Select](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetablequery-1.select) clause to your query. For example, the following code shows how to select just one field and also how to select and format multiple fields:

```csharp
// Select one field -- just the Text
MobileServiceTableQuery<TodoItem> query = todoTable
                .Select(todoItem => todoItem.Text);
List<string> items = await query.ToListAsync();

// Select multiple fields -- both Complete and Text info
MobileServiceTableQuery<TodoItem> query = todoTable
                .Select(todoItem => string.Format("{0} -- {1}",
                    todoItem.Text.PadRight(30), todoItem.Complete ?
                    "Now complete!" : "Incomplete!"));
List<string> items = await query.ToListAsync();
```

All the functions described so far are additive, so we can keep chaining them. Each chained call affects more of the query. One more example:

```csharp
MobileServiceTableQuery<TodoItem> query = todoTable
                .Where(todoItem => todoItem.Complete == false)
                .Select(todoItem => todoItem.Text)
                .Skip(3).
                .Take(3);
List<string> items = await query.ToListAsync();
```

### Look up data by ID

The [LookupAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.lookupasync) function can be used to look up objects from the database with a particular ID.

```csharp
// This query filters out the item with the ID of 37BBF396-11F0-4B39-85C8-B319C729AF6D
TodoItem item = await todoTable.LookupAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D");
```

### Execute untyped queries
When executing a query using an untyped table object, you must explicitly specify the OData query string by calling [ReadAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.readasync), as in the following example:

```csharp
// Lookup untyped data using OData
JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");
```

You get back JSON values that you can use like a property bag. For more information on `JToken` and Newtonsoft Json, see the [Newtonsoft JSON](https://www.newtonsoft.com/json) site.

### Insert data

All client types must contain a member named **Id**, which is by default a string. This **Id** is required to perform CRUD operations and for offline sync. The following code illustrates how to use the [InsertAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.insertasync) method to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

```csharp
await todoTable.InsertAsync(todoItem);
```

If a unique custom ID value is not included in the `todoItem` during an insert, a GUID is generated by the server. You can retrieve the generated ID by inspecting the object after the call returns.

To insert untyped data, you may take advantage of Json.NET:

```csharp
JObject jo = new JObject();
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.InsertAsync(jo);
```

Here is an example using an email address as a unique string id:

```csharp
JObject jo = new JObject();
jo.Add("id", "myemail@emaildomain.com");
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.InsertAsync(jo);
```

### Working with ID values

Mobile Apps supports unique custom string values for the table's **id** column. A string value allows applications to use custom values such as email addresses or user names for the ID.  String IDs provide you with the following benefits:

* IDs are generated without making a round trip to the database.
* Records are easier to merge from different tables or databases.
* IDs values can integrate better with an application's logic.

When a string ID value is not set on an inserted record, the Mobile App backend generates a unique value for the ID. You can use the [Guid.NewGuid](/dotnet/api/system.guid.newguid) method to generate your own ID values, either on the client or in the backend.

```csharp
JObject jo = new JObject();
jo.Add("id", Guid.NewGuid().ToString("N"));
```

### Update data

The following code illustrates how to use the [UpdateAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.updateasync) method to update an existing record with the same ID with new information. The parameter contains the data to be updated as a .NET object.

```csharp
await todoTable.UpdateAsync(todoItem);
```

To update untyped data, you may take advantage of [Newtonsoft JSON](https://www.newtonsoft.com/json) as follows:

```csharp
JObject jo = new JObject();
jo.Add("id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.UpdateAsync(jo);
```

An `id` field must be specified when making an update. The backend uses the `id` field to identify which row to update. The `id` field can be obtained from the result of the `InsertAsync` call. An `ArgumentException` is raised if you try to update an item without providing the `id` value.

### Delete data

The following code illustrates how to use the [DeleteAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.deleteasync) method to delete an existing instance. The instance is identified by the `id` field set on the `todoItem`.

```csharp
await todoTable.DeleteAsync(todoItem);
```

To delete untyped data, you may take advantage of Json.NET as follows:

```csharp
JObject jo = new JObject();
jo.Add("id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
await table.DeleteAsync(jo);
```

When you make a delete request, an ID must be specified. Other properties are not passed to the service or are ignored at the service. The result of a `DeleteAsync` call is usually `null`. The ID to pass in can be obtained from the result of the `InsertAsync` call. A `MobileServiceInvalidOperationException` is thrown when you try to delete an item without specifying the `id` field.

### Conflict resolution and optimistic concurrency

Two or more clients may write changes to the same item at the same time. Without conflict detection, the last write would overwrite any previous updates. **Optimistic concurrency control** assumes that each transaction can commit and therefore does not use any resource locking.  Before committing a transaction, optimistic concurrency control verifies that no other transaction has modified the data. If the data has been modified, the committing transaction is rolled back.

Mobile Apps supports optimistic concurrency control by tracking changes to each item using the `version` system property column that is defined for each table in your Mobile App backend. Each time a record is updated, Mobile Apps sets the `version` property for that record to a new value. During each update request, the `version` property of the record included with the request is compared to the same property for the record on the server. If the version passed with the request does not match the backend, then the client library raises a `MobileServicePreconditionFailedException<T>` exception. The type included with the exception is the record from the backend containing the servers version of the record. The application can then use this information to decide whether to execute the update request again with the correct `version` value from the backend to commit changes.

Define a column on the table class for the `version` system property to enable optimistic concurrency. For example:

```csharp
public class TodoItem
{
    public string Id { get; set; }

    [JsonProperty(PropertyName = "text")]
    public string Text { get; set; }

    [JsonProperty(PropertyName = "complete")]
    public bool Complete { get; set; }

    // *** Enable Optimistic Concurrency *** //
    [JsonProperty(PropertyName = "version")]
    public string Version { set; get; }
}
```

Applications using untyped tables enable optimistic concurrency by setting the `Version` flag on the `SystemProperties` of the table as follows.

```csharp
//Enable optimistic concurrency by retrieving version
todoTable.SystemProperties |= MobileServiceSystemProperties.Version;
```

In addition to enabling optimistic concurrency, you must also catch the `MobileServicePreconditionFailedException<T>` exception in your code when calling [UpdateAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.updateasync).  Resolve the conflict by applying the correct `version` to the updated record and call [UpdateAsync](/dotnet/api/microsoft.windowsazure.mobileservices.imobileservicetable.updateasync) with the resolved record. The following code shows how to resolve a write conflict once detected:

```csharp
private async void UpdateToDoItem(TodoItem item)
{
    MobileServicePreconditionFailedException<TodoItem> exception = null;

    try
    {
        //update at the remote table
        await todoTable.UpdateAsync(item);
    }
    catch (MobileServicePreconditionFailedException<TodoItem> writeException)
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

For more information, see the [Offline Data Sync in Azure Mobile Apps](../data-sync.md) topic.

### Bind data to a Windows user interface

This section shows how to display returned data objects using UI elements in a Windows app.  The following example code binds to the source of the list with a query for incomplete items. The [MobileServiceCollection](/dotnet/api/microsoft.windowsazure.mobileservices.mobileservicecollection-2) creates a Mobile Apps-aware binding collection.

```csharp
// This query filters out completed TodoItems.
MobileServiceCollection<TodoItem, TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .ToCollectionAsync();

// itemsControl is an IEnumerable that could be bound to a UI list control
IEnumerable itemsControl  = items;

// Bind this to a ListBox
ListBox lb = new ListBox();
lb.ItemsSource = items;
```

Some controls in the managed runtime support an interface called [ISupportIncrementalLoading](/uwp/api/Windows.UI.Xaml.Data.ISupportIncrementalLoading). This interface allows controls to request extra data when the user scrolls. There is built-in support for this interface for universal Windows apps via [MobileServiceIncrementalLoadingCollection](/dotnet/api/microsoft.windowsazure.mobileservices), which automatically handles the calls from the controls. Use `MobileServiceIncrementalLoadingCollection` in Windows apps as follows:

```csharp
MobileServiceIncrementalLoadingCollection<TodoItem,TodoItem> items;
items = todoTable.Where(todoItem => todoItem.Complete == false).ToIncrementalLoadingCollection();

ListBox lb = new ListBox();
lb.ItemsSource = items;
```

To use the new collection on Windows Phone 8 and "Silverlight" apps, use the `ToCollection` extension methods on `IMobileServiceTableQuery<T>` and `IMobileServiceTable<T>`. To load data, call `LoadMoreItemsAsync()`.

```csharp
MobileServiceCollection<TodoItem, TodoItem> items = todoTable.Where(todoItem => todoItem.Complete==false).ToCollection();
await items.LoadMoreItemsAsync();
```

When you use the collection created by calling `ToCollectionAsync` or `ToCollection`, you get a collection that can be bound to UI controls.  This collection is paging-aware.  Since the collection is loading data from the network, loading sometimes fails. To handle such failures, override the `OnException` method on `MobileServiceIncrementalLoadingCollection` to handle exceptions resulting from calls to `LoadMoreItemsAsync`.

Consider if your table has many fields but you only want to display some of them in your control. You may use the guidance in the preceding section "[Select specific columns](#select-specific-columns)" to select specific columns to display in the UI.

### Change the page size

Azure Mobile Apps returns a maximum of 50 items per request by default.  You can change the paging size by increasing the maximum page size on both the client and server.  To increase the requested page size, specify `PullOptions` when using `PullAsync()`:

```csharp
PullOptions pullOptions = new PullOptions
    {
        MaxPageSize = 100
    };
```

Assuming you have made the `PageSize` equal to or greater than 100 within the server, a request returns up to 100 items.

## Work with offline tables

Offline tables use a local SQLite store to store data for use when offline.  All table operations are done against the local SQLite store instead of the remote server store.  To create an offline table, first prepare your project.

* In Visual Studio, right-click the solution > **Manage NuGet Packages for Solution...**, then search for and install the
   **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package for all projects in the solution.
* For Windows devices, press **References** > **Add Reference...**, expand the **Windows** folder > **Extensions**, then enable the appropriate **SQLite for Windows** SDK along with the **Visual C++ 2013 Runtime for Windows** SDK. The SQLite SDK names vary slightly with each Windows platform.

Before a table reference can be created, the local store must be prepared:

```csharp
var store = new MobileServiceSQLiteStore(Constants.OfflineDbPath);
store.DefineTable<TodoItem>();

//Initializes the SyncContext using the default IMobileServiceSyncHandler.
await this.client.SyncContext.InitializeAsync(store);
```

Store initialization is normally done immediately after the client is created.  The **OfflineDbPath** should be a filename suitable for use on all platforms that you support.  If the path is a fully qualified path (that is, it starts with a slash), then that path is used.  If the path is not fully qualified, the file is placed in a platform-specific location.

* For iOS and Android devices, the default path is the "Personal Files" folder.
* For Windows devices, the default path is the application-specific "AppData" folder.

A table reference can be obtained using the `GetSyncTable<>` method:

```csharp
var table = client.GetSyncTable<TodoItem>();
```

You do not need to authenticate to use an offline table.  You only need to authenticate when you are communicating with the backend service.

### Synchronize an offline table

Offline tables are not synchronized with the backend by default.  Synchronization is split into two pieces.  You can push changes separately from downloading new items.  Here is a typical sync method:

```csharp
public async Task SyncAsync()
{
    ReadOnlyCollection<MobileServiceTableOperationError> syncErrors = null;

    try
    {
        await this.client.SyncContext.PushAsync();

        await this.todoTable.PullAsync(
            //The first parameter is a query name that is used internally by the client SDK to implement incremental sync.
            //Use a different query name for each unique query in your program
            "allTodoItems",
            this.todoTable.CreateQuery());
    }
    catch (MobileServicePushFailedException exc)
    {
        if (exc.PushResult != null)
        {
            syncErrors = exc.PushResult.Errors;
        }
    }

    // Simple error/conflict handling. A real application would handle the various errors like network conditions,
    // server conflicts and others via the IMobileServiceSyncHandler.
    if (syncErrors != null)
    {
        foreach (var error in syncErrors)
        {
            if (error.OperationKind == MobileServiceTableOperationKind.Update && error.Result != null)
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

If the first argument to `PullAsync` is null, then incremental sync is not used.  Each sync operation retrieves all records.

The SDK performs an implicit `PushAsync()` before pulling records.

Conflict handling happens on a `PullAsync()` method.  You can deal with conflicts in the same way as online tables.  The conflict is produced when `PullAsync()` is called instead of during the insert, update, or delete. If multiple conflicts happen, they are bundled into a single MobileServicePushFailedException.  Handle each failure separately.

## Work with a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

You call a custom API by calling one of the [InvokeApiAsync](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient.invokeapiasync) methods on the client. For example, the following line of code sends a POST request to the **completeAll** API on the backend:

```javascript
var result = await client.InvokeApiAsync<MarkAllResult>("completeAll", System.Net.Http.HttpMethod.Post, null);
```

This form is a typed method call and requires that the **MarkAllResult** return type is defined. Both typed and untyped methods are supported.

The InvokeApiAsync() method prepends '/api/' to the API that you wish to call unless the API starts with a '/'. For example:

* `InvokeApiAsync("completeAll",...)` calls /api/completeAll on the backend
* `InvokeApiAsync("/.auth/me",...)` calls /.auth/me on the backend

You can use InvokeApiAsync to call any WebAPI, including those WebAPIs that are not defined with Azure Mobile Apps.  When you use InvokeApiAsync(), the appropriate headers, including authentication headers, are sent with the request.

## Authenticate users

Mobile Apps supports authenticating and authorizing app users using various external identity providers: Facebook, Google, Microsoft Account, Twitter, and Microsoft Entra ID. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. 

Two authentication flows are supported: *client-managed* and *server-managed* flow. The server-managed flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client-managed flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

> [!NOTE]
> We recommend using a client-managed flow in your production apps.

To set up authentication, you must register your app with one or more identity providers.  The identity provider generates a client ID and a client secret for your app.  These values are then set in your backend to enable Azure App Service authentication/authorization.  

The following topics are covered in this section:

* [Client-managed authentication](#client-managed-authentication)
* [Server-managed authentication](#server-managed-authentication)
* [Caching the authentication token](#caching-the-authentication-token)

### Client-managed authentication

Your app can independently contact the identity provider and then provide the returned token during sign-in with your backend. This client flow enables you to provide a single sign-on experience for users or to retrieve extra user data from the identity provider. Client flow authentication is preferred to using a server flow as the identity provider SDK provides a more native UX feel and allows for more customization.

Examples are provided for the following client-flow authentication patterns:

* [Active Directory Authentication Library](#authenticate-users-with-the-active-directory-authentication-library)
* [Facebook or Google](#single-sign-on-using-a-token-from-facebook-or-google)

#### Authenticate users with the Active Directory Authentication Library

You can use the Active Directory Authentication Library (ADAL) to initiate user authentication from the client using Microsoft Entra authentication.

> [!WARNING]
> Support for Active Directory Authentication Library (ADAL) will end in December, 2022. Apps using ADAL on existing OS versions will continue to work, but technical support and security updates will end. For more information, see [Migrate apps to MSAL](/azure/active-directory/develop/msal-migration).

1. Configure your mobile app backend for Microsoft Entra sign-on by following the [How to configure App Service for Active Directory login](/azure/app-service/configure-authentication-provider-aad) tutorial. Make sure to complete the optional step of registering a native client application.
2. In Visual Studio, open your project and add a reference to the `Microsoft.IdentityModel.Clients.ActiveDirectory` NuGet package. When searching, include pre-release versions.
3. Add the following code to your application, according to the platform you are using. In each, make the following replacements:

   * Replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application. The format should be `https://login.microsoftonline.com/contoso.onmicrosoft.com`. This value can be copied from the Domain tab in your Microsoft Entra ID in the [Azure portal].
   * Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain the client ID from the **Advanced** tab under **Microsoft Entra Settings** in the portal.
   * Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.
   * Replace **INSERT-REDIRECT-URI-HERE** with your site's `/.auth/login/done` endpoint, using the HTTPS scheme. This value should be similar to `https://contoso.azurewebsites.net/.auth/login/done`.

     The code needed for each platform follows:

     **Windows:**

     ```csharp
     private MobileServiceUser user;
     private async Task AuthenticateAsync()
     {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        while (user == null)
        {
            string message;
            try
            {
                AuthenticationContext ac = new AuthenticationContext(authority);
                AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                    new Uri(redirectUri), new PlatformParameters(PromptBehavior.Auto, false) );
                JObject payload = new JObject();
                payload["access_token"] = ar.AccessToken;
                user = await App.MobileService.LoginAsync(
                    MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
                message = string.Format("You are now logged in - {0}", user.UserId);
            }
            catch (InvalidOperationException)
            {
                message = "You must log in. Login Required";
            }
            var dialog = new MessageDialog(message);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }
     }
     ```

     **Xamarin.iOS**

     ```csharp
     private MobileServiceUser user;
     private async Task AuthenticateAsync(UIViewController view)
     {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        try
        {
            AuthenticationContext ac = new AuthenticationContext(authority);
            AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                new Uri(redirectUri), new PlatformParameters(view));
            JObject payload = new JObject();
            payload["access_token"] = ar.AccessToken;
            user = await client.LoginAsync(
                MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(@"ERROR - AUTHENTICATION FAILED {0}", ex.Message);
        }
     }
     ```

     **Xamarin.Android**

     ```csharp
     private MobileServiceUser user;
     private async Task AuthenticateAsync()
     {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        try
        {
            AuthenticationContext ac = new AuthenticationContext(authority);
            AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                new Uri(redirectUri), new PlatformParameters(this));
            JObject payload = new JObject();
            payload["access_token"] = ar.AccessToken;
            user = await client.LoginAsync(
                MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
        }
        catch (Exception ex)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.SetMessage(ex.Message);
            builder.SetTitle("You must log in. Login Required");
            builder.Create().Show();
        }
     }
     protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
     {

        base.OnActivityResult(requestCode, resultCode, data);
        AuthenticationAgentContinuationHelper.SetAuthenticationAgentContinuationEventArgs(requestCode, resultCode, data);
     }
     ```

#### Single sign-on using a token from Facebook or Google

You can use the client flow as shown in this snippet for Facebook or Google.

```csharp
var token = new JObject();
// Replace access_token_value with actual value of your access token obtained
// using the Facebook or Google SDK.
token.Add("access_token", "access_token_value");

private MobileServiceUser user;
private async Task AuthenticateAsync()
{
    while (user == null)
    {
        string message;
        try
        {
            // Change MobileServiceAuthenticationProvider.Facebook
            // to MobileServiceAuthenticationProvider.Google if using Google auth.
            user = await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
            message = string.Format("You are now logged in - {0}", user.UserId);
        }
        catch (InvalidOperationException)
        {
            message = "You must log in. Login Required";
        }

        var dialog = new MessageDialog(message);
        dialog.Commands.Add(new UICommand("OK"));
        await dialog.ShowAsync();
    }
}
```

### Server-managed authentication

Once you have registered your identity provider, call the [LoginAsync](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient.loginasync) method on the MobileServiceClient with the [MobileServiceAuthenticationProvider](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider) value of your provider. For example, the following code initiates a server flow sign-in by using Facebook.

```csharp
private MobileServiceUser user;
private async System.Threading.Tasks.Task Authenticate()
{
    while (user == null)
    {
        string message;
        try
        {
            user = await client
                .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
            message =
                string.Format("You are now logged in - {0}", user.UserId);
        }
        catch (InvalidOperationException)
        {
            message = "You must log in. Login Required";
        }

        var dialog = new MessageDialog(message);
        dialog.Commands.Add(new UICommand("OK"));
        await dialog.ShowAsync();
    }
}
```

If you are using an identity provider other than Facebook, change the value of MobileServiceAuthenticationProvider to the value for your provider.

In a server flow, Azure App Service manages the OAuth authentication flow by displaying the sign-in page of the selected provider.  Once the identity provider returns, Azure App Service generates an App Service authentication token. The [LoginAsync](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceclient.loginasync) method returns a [MobileServiceUser](/dotnet/api/microsoft.windowsazure.mobileservices.mobileserviceuser), which provides both the UserId of the authenticated user and the MobileServiceAuthenticationToken, as a JSON web token (JWT). This token can be cached and reused until it expires. For more information, see [Caching the authentication token](#caching-the-authentication-token).

> [!NOTE]
> Under the covers, Azure Mobile Apps uses a [Xamarin.Essentials](/xamarin/essentials/web-authenticator?tabs=ios) WebAuthenticator 
> to do the work.  You must handle the response from the service by calling back into Xamarin.Essentials.  For details, see [WebAuthenticator].

### Caching the authentication token

In some cases, the call to the login method can be avoided after the first successful authentication by storing the authentication token from the provider.  Microsoft Store and UWP apps can use [PasswordVault](/uwp/api/Windows.Security.Credentials.PasswordVault) to cache the current authentication token after a successful sign-in, as follows:

```csharp
await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook);

PasswordVault vault = new PasswordVault();
vault.Add(new PasswordCredential("Facebook", client.currentUser.UserId,
    client.currentUser.MobileServiceAuthenticationToken));
```

The UserId value is stored as the UserName of the credential and the token is the stored as the Password. On subsequent start-ups, you can check the **PasswordVault** for cached credentials. The following example uses cached credentials when they are found, and otherwise attempts to authenticate again with the backend:

```csharp
// Try to retrieve stored credentials.
var creds = vault.FindAllByResource("Facebook").FirstOrDefault();
if (creds != null)
{
    // Create the current user from the stored credentials.
    client.currentUser = new MobileServiceUser(creds.UserName);
    client.currentUser.MobileServiceAuthenticationToken =
        vault.Retrieve("Facebook", creds.UserName).Password;
}
else
{
    // Regular login flow and cache the token as shown above.
}
```

When you sign out a user, you must also remove the stored credential, as follows:

```csharp
client.Logout();
vault.Remove(vault.Retrieve("Facebook", client.currentUser.UserId));
```

When you use client-managed authentication, you can also cache the access token obtained from your provider such as Facebook or Twitter. This token can be supplied to request a new authentication token from the backend, as follows:

```csharp
var token = new JObject();
// Replace <your_access_token_value> with actual value of your access token
token.Add("access_token", "<your_access_token_value>");

// Authenticate using the access token.
await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
```

## Miscellaneous Topics

### Handle errors

When an error occurs in the backend, the client SDK raises a `MobileServiceInvalidOperationException`.  The following example shows how to handle an exception that is returned by the backend:

```csharp
private async void InsertTodoItem(TodoItem todoItem)
{
    // This code inserts a new TodoItem into the database. When the operation completes
    // and App Service has assigned an ID, the item is added to the CollectionView
    try
    {
        await todoTable.InsertAsync(todoItem);
        items.Add(todoItem);
    }
    catch (MobileServiceInvalidOperationException e)
    {
        // Handle error
    }
}
```

### Customize request headers

To support your specific app scenario, you might need to customize communication with the Mobile App backend. For example, you may want to add a custom header to every outgoing request or even change responses status codes. You can use a custom [DelegatingHandler](/dotnet/api/system.net.http.delegatinghandler), as in the following example:

```csharp
public async Task CallClientWithHandler()
{
    MobileServiceClient client = new MobileServiceClient("AppUrl", new MyHandler());
    IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
    var newItem = new TodoItem { Text = "Hello world", Complete = false };
    await todoTable.InsertAsync(newItem);
}

public class MyHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage>
        SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
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

<!-- Links -->
[WebAuthenticator]: /xamarin/essentials/web-authenticator

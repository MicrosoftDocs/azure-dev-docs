---
ms.topic: include
ms.date: 06/03/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

### Update the remote service client

Open the `TodoApp.Data` project and locate the `RemoteTodoService.cs` class (within the `Services` directory).  Update the class as follows:

1. Add the following `using` statement to the top of the file:

    ``` csharp
    using Microsoft.Datasync.Client.SQLiteStore;
    ```

2. Change the definition of `_table` to be an `IOfflineTable<TodoItem>`:

    ``` csharp
    /// <summary>
    /// Reference to the table used for datasync operations.
    /// </summary>
    private IOfflineTable<TodoItem> _table = null;
    ```

3. Add a new property for storing the offline database location:

    ``` csharp
    /// <summary>
    /// The path to the offline database
    /// </summary>
    public string OfflineDb { get; set; }
    ```

4. Update the `InitializeAsync` method to define the offline database:

    ``` csharp
    // Create the offline store definition
    var connectionString = new UriBuilder { Scheme = "file", Path = OfflineDb, Query = "?mode=rwc" }.Uri.ToString();
    var store = new OfflineSQLiteStore(connectionString);
    store.DefineTable<TodoItem>();
    var options = new DatasyncClientOptions
    {
        OfflineStore = store,
        HttpPipeline = new HttpMessageHandler[] { new LoggingHandler() }
    };

    // Create the datasync client.
    _client = TokenRequestor == null 
        ? new DatasyncClient(Constants.ServiceUri, options)
        : new DatasyncClient(Constants.ServiceUri, new GenericAuthenticationProvider(TokenRequestor), options);

    // Initialize the database
    await _client.InitializeOfflineStoreAsync();

    // Get a reference to the offline table.
    _table = _client.GetOfflineTable<TodoItem>();

    // Set _initialized to true to prevent duplication of locking.
    _initialized = true;
    ```

5. Update the `RefreshItemsAsync()` to do offline synchronization:

    ``` csharp
    /// <summary>
    /// Refreshes the TodoItems list manually.
    /// </summary>
    /// <returns>A task that completes when the refresh is done.</returns>
    public async Task RefreshItemsAsync()
    {
        await InitializeAsync();

        // First, push all the items in the table.
        await _table.PushItemsAsync();

        // Then, pull all the items in the table.
        await _table.PullItemsAsync();

        return;
    }
    ```
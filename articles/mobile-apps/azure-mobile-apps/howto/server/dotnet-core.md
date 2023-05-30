---
title: How to use the ASP.NET Core SDK for Azure Mobile Apps
description: How to use the ASP.NET Core SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 12/17/2022
ms.author: adhal
---

# How to use the ASP.NET Core backend server SDK

This article shows you have to configure and use the ASP.NET Core backend server SDK to produce a data sync server.

## Supported platforms

The ASP.NET Core backend server supports ASP.NET Core 6.0.

Database servers must meet the following criteria have a `DateTime` or `Timestamp` type field that is stored with millisecond accuracy.  Repository implementations are provided for [Entity Framework Core][5] and [LiteDb][6].

For specific database support, see the following sections:

* [Azure Cosmos DB](#azure-cosmos-db)
* [PostgreSQL](#postgresql)
* [SqLite](#sqlite)
* [LiteDb](#litedb)

## Create a new data sync server

A data sync server uses the normal ASP.NET Core mechanisms for creating the server.  It consists of three steps:

1. Create an ASP.NET Core server project.
1. Add Entity Framework Core
1. Add Data sync Services

For information on creating an ASP.NET Core service with Entity Framework Core, see [the tutorial][6].

To enable data sync services, you need to add the following NuGet libraries:

* [Microsoft.AspNetCore.Datasync]
* [Microsoft.AspNetCore.Datasync.EFCore] for Entity Framework Core based tables.
* [Microsoft.AspNetCore.Datasync.InMemory] for in-memory tables.

Modify the `Program.cs` file.  Add the following line under all other service definitions:

``` csharp
builder.Services.AddDatasyncControllers();
```

You can also use the ASP.NET Core `datasync-server` template:

```dotnetcli
# This only needs to be done once
dotnet new -i Microsoft.AspNetCore.Datasync.Template.CSharp
mkdir My.Datasync.Server
cd My.Datasync.Server
dotnet new datasync-server
```

The template includes a sample model and controller.

## Create a table controller for a SQL table

The default repository uses Entity Framework Core. Creating a table controller is a three-step process:

1. Create a model class for the data model.
1. Add the model class to the `DbContext` for your application.
1. Create a new `TableController<T>` class to expose your model.

### Create a model class

All model classes must implement `ITableData`.  Each repository type has an abstract class that implements `ITableData`.  The Entity Framework Core repository uses `EntityTableData`:

``` csharp
public class TodoItem : EntityTableData
{
    /// <summary>
    /// Text of the Todo Item
    /// </summary>
    public string Text { get; set; }

    /// <summary>
    /// Is the item complete?
    /// </summary>
    public bool Complete { get; set; }
}
```

The `ITableData` (which is implemented by `EntityTableData`) provides the ID of the record, together with extra properties for handling data sync services:

* `UpdatedAt` (`DateTimeOffset?`) provides the date that the record was last updated.
* `Version` (`byte[]`) provides an opaque value that changes on every write.
* `Deleted` (`bool`) is true if the record has been deleted but not yet purged.

Don't change these properties in your code.  They're maintained by the repository.

### Update the `DbContext`

Each model in the database must be registered in the `DbContext`.  For example:

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; }
}
```

### Create a table controller

A table controller is a specialized `ApiController`.  Here's a minimal table controller:

```csharp
[Route("tables/[controller]")]
public class TodoItemController : TableController<TodoItem>
{
    public TodoItemController(AppDbContext context) : base()
    {
        Repository = new EntityTableRepository<TodoItem>(context);
    }
}
```

> [!NOTE]
> * The controller must have a route.  By convention, tables are exposed on a subpath of `/tables`, but they can be placed anywhere.  If you're using client libraries earlier than v5.0.0, then the table must be a subpath of `/tables`.
> * The controller must inherit from `TableController<T>`, where `<T>` is an implementation of the `ITableData` implementation for your repository type.
> * Assign a repository based on the same type as your model.

### Implementing an in-memory repository

You can also use an in-memory repository with no persistent storage. Add a singleton service for the repository in your `Program.cs`:

```csharp
IEnumerable<Model> seedData = GenerateSeedData();
builder.Services.AddSingleton<IRepository<Model>>(new InMemoryRepository<Model>(seedData));
```

Set up your table controller as follows:

```csharp
[Route("tables/[controller]")]
public class ModelController : TableController<Model>
{
    public MovieController(IRepository<Model> repository) : base(repository)
    {
    }
}
```

## Configure table controller options

You can configure certain aspects of the controller using `TableControllerOptions`:

```csharp
[Route("tables/[controller]")]
public class MoodelController : TableController<Model>
{
    public ModelController(IRepository<Model> repository) : base(repository)
    {
        Options = new TableControllerOptions { PageSize = 25 };
    }
}
```

The options you can set include:

* `PageSize` (`int`, default: 100) is the maximum number of items in a single page that will be returned by a query operation.
* `MaxTop` (`int`, default: 512000) is the maximum number of items returned in a query operation without paging.
* `EnableSoftDelete` (`bool`, default: false) enables soft-delete, which marks items as deleted instead of deleting them from the database.  Soft delete allows clients to update their offline cache, but requires that deleted items are purged from the database separately.
* `UnauthorizedStatusCode` (`int`, default: 401 Unauthorized) is the status code returned when the user isn't allowed to do an action.

## Configure access permissions

By default, a user can do anything they want to entities within a table - create, read, update, and delete any record.  For more fine-grained control over authorization, create a class that implements `IAccessControlProvider`.  The `IAccessControlProvider` uses three methods to implement authorization:

* `GetDataView()` returns a lambda that limits what the connected user can see.
* `IsAuthorizedAsync()` determines if the connected user can perform the action on the specific entity that is being requested.
* `PreCommitHookAsync()` adjusts any entity immediately before being written to the repository.

Between the three methods, you can effectively handle most access control cases.  If you need access to the `HttpContext`, [configure an HttpContextAccessor][4].

As an example, the following implements a personal table, where a user can only see their own records.

``` csharp
public class PrivateAccessControlProvider<T>: IAccessControlProvider<T>
    where T : ITableData
    where T : IUserId
{
    private readonly IHttpContextAccessor _accessor;

    public PrivateAccessControlProvider(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    private string UserId { get => _accessor.HttpContext.User?.Identity?.Name; }

    public Expression<Func<T,bool>> GetDataView()
    {
      return (UserId == null)
        ? _ => false
        : model => model.UserId == UserId;
    }

    public Task<bool> IsAuthorizedAsync(TableOperation op, T entity, CancellationToken token = default)
    {
        if (op == TableOperation.Create || op == TableOperation.Query)
        {
            return Task.FromResult(true);
        }
        else
        {
            return Task.FromResult(entity?.UserId != null && entity?.UserId == UserId);
        }
    }

    public virtual Task PreCommitHookAsync(TableOperation operation, T entity, CancellationToken token = default)
    {
        entity.UserId == UserId;
        return Task.CompletedTask;
    }
}
```

The methods are async in case you need to do an extra database lookup to get the correct answer. You can implement the `IAccessControlProvider<T>` interface on the controller, but you still have to pass in the `IHttpContextAccessor` to access the `HttpContext` in a thread safe manner.

To use this access control provider, update your `TableController` as follows:

```csharp
[Authorize]
[Route("tables/[controller]")]
public class ModelController : TableController<Model>
{
    public ModelsController(AppDbContext context, IHttpContextAccessor accessor) : base()
    {
        AccessControlProvider = new PrivateAccessControlProvider<Model>(accessor);
        Repository = new EntityTableRepository<Model>(context);
    }
}
```

If you want to allow both unauthenticated and authenticated access to a table, decorate it with `[AllowAnonymous]` instead of `[Authorize]`.  

## Configure logging

Logging is handled through [the normal logging mechanism][3] for ASP.NET Core.  Assign the `ILogger` object to the `Logger` property:

```csharp
[Authorize]
[Route("tables/[controller]")]
public class ModelController : TableController<Model>
{
    public ModelsController(AppDbContext context, Ilogger<ModelController> logger) : base()
    {
        Repository = new EntityTableRepository<Model>(context);
        Logger = logger;
    }
}
```

## Enable Azure App Service Identity

The ASP.NET Core data sync server supports [ASP.NET Core Identity][1], or any other authentication and authorization scheme you wish to support.  To assist with upgrades from prior versions of Azure Mobile Apps, we also provide an identity provider that implements [Azure App Service Identity][2].  To configure Azure App Service Identity in your application, edit your `Program.cs`:

``` csharp
builder.Services.AddAuthentication(AzureAppServiceAuthentication.AuthenticationScheme)
  .AddAzureAppServiceAuthentication(options => options.ForceEnable = true);

// Then later, after you have created the app
app.UseAuthentication();
app.UseAuthorization();
```

## Database Support

The following sections provide information on using Azure Mobile Apps with specific databases.

### Azure Cosmos DB

Azure Cosmos DB is a fully managed, serverless NoSQL database for high-performance applications of any size or scale.  See [Azure Cosmos DB Provider](/ef/core/providers/cosmos) for information on using Azure Cosmos DB with Entity Framework Core.  When using Azure Cosmos DB with Azure Mobile Apps:

1. Derive models from the `ETagEntityTableData` class:

    ``` csharp
    public class TodoItem : ETagEntityTableData
    {
        public string Title { get; set; }
        public bool Completed { get; set; }
    }
    ```

2. Add an `OnModelCreating(ModelBuilder)` method to the `DbContext`.  Configure the entity for each exposed table to use ETag concurrency checks:

    ``` csharp
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<TodoItem>().Property(t => t.EntityTag).IsETagConcurrency();
        base.OnModelCreating(builder);
    }
    ```

You can also set the container, partition key, and other Azure Cosmos DB settings in the `OnModelCreating(ModelBuilder)` method.

Azure Cosmos DB is supported in the `Microsoft.AspNetCore.Datasync.EFCore` NuGet package since v5.0.11. There's [a sample showing how to implement Azure Cosmos DB][cosmos-sample] available in the GitHub repository.

### PostgreSQL

PostgreSQL does not support "timestamp" row versions. If using PostgreSQL, create the following class:

```csharp
public class PgEntityTableData : EntityTableData
{
    /// <summary>
    /// The row version for the entity.
    /// </summary>
    [NotMapped]
    public override byte[] Version
    {
        get => BitConverter.GetBytes(RowVersion);
        set => BitConverter.ToUInt32(value);
    }

    /// <summary>
    /// The actual version
    /// </summary>
    [JsonIgnore]
    [Timestamp]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    [Column("xmin", TypeName = "xid")]
    public uint RowVersion { get; set; }
}
```

This will ensure the version property is correctly created and handled within the database.  Your model will now look similar to the following:

```csharp
public class TodoItem : PgEntityTableData
{
    public string Title { get; set; }
    public bool Completed { get; set; }
}
```

### SqLite

> [!WARNING]
> Do not use SqLite for production services.  SqLite is only suitable for client-side usage in production.

SqLite doesn't have a date/time field that supports millisecond accuracy.  As such, it isn't suitable for anything except for testing.  If you wish to use SqLite, ensure you implement a value converter and value comparer on each model for date/time properties.  The easiest method to implement value converters and comparers is in the `OnModelCreating(ModelBuilder)` method of your `DbContext`:

```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    var timestampProps = builder.Model.GetEntityTypes().SelectMany(t => t.GetProperties())
        .Where(p => p.ClrType == typeof(byte[]) && p.ValueGenerated == ValueGenerated.OnAddOrUpdate);
    var converter = new ValueConverter<byte[], string>(
        v => Encoding.UTF8.GetString(v),
        v => Encoding.UTF8.GetBytes(v)
    );
    foreach (var property in timestampProps)
    {
        property.SetValueConverter(converter);
        property.SetDefaultValueSql("STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')");
    }
    base.OnModelCreating(builder);
}
```

Install an update trigger when you initialize the database:

```csharp
internal static void InstallUpdateTriggers(DbContext context)
{
    foreach (var table in context.Model.GetEntityTypes())
    {
        var props = table.GetProperties().Where(prop => prop.ClrType == typeof(byte[]) && prop.ValueGenerated == ValueGenerated.OnAddOrUpdate);
        foreach (var property in props)
        {
            var sql = $@"
                CREATE TRIGGER s_{table.GetTableName()}_{prop.Name}_UPDATE AFTER UPDATE ON {table.GetTableName()}
                BEGIN
                    UPDATE {table.GetTableName()}
                    SET {prop.Name} = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')
                    WHERE rowid = NEW.rowid;
                END
            ";
            context.Database.ExecuteSqlRaw(sql);
        }
    }
}
```

Ensure that the `InstallUpdateTriggers` method is only called once during database initialization:

``` csharp
public void InitializeDatabase(DbContext context)
{
    bool created = context.Database.EnsureCreated();
    if (created && context.Database.IsSqlite())
    {
        InstallUpdateTriggers(context);
    }
    context.Database.SaveChanges();
}
```

### LiteDB

[LiteDB](https://www.litedb.org/) is a serverless database delivered in a single small DLL written in .NET C# managed code.  It's a simple and fast NoSQL database solution for stand-alone applications.  To use LiteDb with on-disk persistent storage:

1. Add a singleton for the `LiteDatabase` to the `Program.cs`:

    ``` csharp
    const connectionString = builder.Configuration.GetValue<string>("LiteDb:ConnectionString");
    builder.Services.AddSingleton<LiteDatabase>(new LiteDatabase(connectionString));
    ```

2. Derive models from the `LiteDbTableData`:

    ``` csharp
    public class TodoItem : LiteDbTableData
    {
        public string Title { get; set; }
        public bool Completed { get; set; }
    }
    ```

    You can use any of the `BsonMapper` attributes that are supplied with the LiteDb NuGet package.

3. Create a controller using the `LiteDbRepository`:

    ``` csharp
    [Route("tables/[controller]")]
    public class TodoItemController : TableController<TodoItem>
    {
        public TodoItemController(LiteDatabase db) : base()
        {
            Repository = new LiteDbRepository<TodoItem>(db, "todoitems");
        }
    }
    ```

You can use any other repository capability (such as the access control provider or logger) with this pattern.  LiteDB is supported by the `Microsoft.AspNetCore.Datasync.LiteDb` package on NuGet.

## OpenAPI Support

You can publish the API defined by data sync controllers using [NSwag](/aspnet/core/tutorials/getting-started-with-nswag) or [Swashbuckle](/aspnet/core/tutorials/getting-started-with-swashbuckle).  In both cases, start by setting up the service as you normally would for the chosen library.  

### NSwag

Follow the basic instructions for NSwag integration, then modify as follows:

1. Add packages to your project to support NSwag.  The following packages are required:
   
    * [NSwag.AspNetCore](https://www.nuget.org/packages/NSwag.AspNetCore).
    * [Microsoft.AspNetCore.Datasync.NSwag](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.NSwag).

2. Add the following to the top of your `Program.cs` file:

    ```csharp
    using Microsoft.AspNetCore.Datasync.NSwag;
    ```

3. Add a service to generate an OpenAPI definition to your `Program.cs` file:

    ```csharp
    builder.Services.AddOpenApiDocument(options =>
    {
        options.AddDatasyncProcessors();
    });
    ```

4. Enable the middleware for serving the generated JSON document and the Swagger UI, also in `Program.cs`:

    ```csharp
    if (app.Environment.IsDevelopment())
    {
        app.UseOpenApi();
        app.UseSwaggerUI3();
    }
    ```

With this configuration, browsing to the `/swagger` endpoint of the web service will allow you to browse the API.  The OpenAPI definition can then be imported into other services (such as Azure API Management).  For more information on configuring NSwag, see [Get started with NSwag and ASP.NET Core](/aspnet/core/tutorials/getting-started-with-nswag).

### Swashbuckle

Follow the basic instructions for Swashbuckle integration, then modify as follows:

1. Add packages to your project to support Swashbuckle.  The following packages are required:

    * [Swashbuckle.AspNetCore](https://www.nuget.org/packages/Swashbuckle.AspNetCore).
    * [Swashbuckle.AspNetCore.Newtonsoft](https://www.nuget.org/packages/Swashbuckle.AspNetCore.Newtonsoft).
    * [Microsoft.AspNetCore.Datasync.Swashbuckle](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.Swashbuckle).

2. Add the following to the top of your `Program.cs` file:

    ```csharp
    using Microsoft.AspNetCore.Datasync.Swashbuckle;
    ```

3. Add a service to generate an OpenAPI definition to your `Program.cs` file:

    ```csharp
    builder.Services.AddSwaggerGen(options => 
    {
        options.AddDatasyncControllers();
    });
    builder.Services.AddSwaggerGenNewtonsoftSupport();
    ```

    > [!NOTE]
    > The `AddDatasyncControllers()` method takes an optional `Assembly` that corresponds to the assembly that contains your table controllers.  The `Assembly` parameter is only required if your table controllers are in a different project to the service.

4. Enable the middleware for serving the generated JSON document and the Swagger UI, also in `Program.cs`:

    ```csharp
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options => 
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            options.RoutePrefix = string.Empty;
        });
    }
    ```

With this configuration, browsing to the root of the web service will allow you to browse the API.  The OpenAPI definition can then be imported into other services (such as Azure API Management).  For more information on configuring Swashbuckle, see [Get started with Swashbuckle and ASP.NET Core](/aspnet/core/tutorials/getting-started-with-swashbuckle).

## Limitations

The ASP.NET Core edition of the service libraries implements OData v4 for the list operation. When the server is running in backwards compatibility mode, filtering on a substring isn't supported.

<!-- Links -->
[1]: /aspnet/core/security/authentication/identity?view=aspnetcore-6.0&preserve-view=true
[2]: /azure/app-service/overview-authentication-authorization
[3]: /aspnet/core/fundamentals/logging/?view=aspnetcore-6.0&preserve-view=true
[4]: /aspnet/core/fundamentals/http-context?view=aspnetcore-6.0&preserve-view=true#use-httpcontext-from-custom-components
[5]: /ef/core/providers
[6]: /aspnet/core/tutorials/first-web-api?view=aspnetcore-6.0&preserve-view=true

[cosmos-sample]: https://github.com/azure/azure-mobile-apps/tree/main/samples/CosmosTodoService

[Microsoft.AspNetCore.Datasync]: https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync
[Microsoft.AspNetCore.Datasync.EFCore]: https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.EFCore
[Microsoft.AspNetCore.Datasync.InMemory]: https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.InMemory

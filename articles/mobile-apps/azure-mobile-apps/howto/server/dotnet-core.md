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

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This article shows you have to configure and use the ASP.NET Core backend server SDK to produce a data sync server.

## Supported platforms

The ASP.NET Core backend server supports ASP.NET 6.0 or later.

Database servers must meet the following criteria have a `DateTime` or `Timestamp` type field that is stored with millisecond accuracy.  Repository implementations are provided for [Entity Framework Core][5] and [LiteDb][6].

For specific database support, see the following sections:

* [Azure SQL and SQL Server](#azure-sql)
* [Azure Cosmos DB](#azure-cosmos-db)
* [PostgreSQL](#postgresql)
* [SqLite](#sqlite)
* [LiteDb](#litedb)

## Create a new data sync server

A data sync server uses the normal ASP.NET Core mechanisms for creating the server.  It consists of three steps:

1. Create an ASP.NET 6.0 (or later) server project.
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

The `ITableData` interface provides the ID of the record, together with extra properties for handling data sync services:

* `UpdatedAt` (`DateTimeOffset?`) provides the date that the record was last updated.
* `Version` (`byte[]`) provides an opaque value that changes on every write.
* `Deleted` (`bool`) is true if the record is marked for deletion but not yet purged.

The Data sync library maintains these properties.  Don't modify these properties in your own code.

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
>
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

* `PageSize` (`int`, default: 100) is the maximum number of items a query operation returned in a single page.
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
    public ModelController(AppDbContext context, Ilogger<ModelController> logger) : base()
    {
        Repository = new EntityTableRepository<Model>(context);
        Logger = logger;
    }
}
```

## Monitor repository changes

When the repository is changed, you can trigger workflows, log the response to the client, or do other work in one of two methods:

### Option 1: Implement a PostCommitHookAsync

The `IAccessControlProvider<T>` interface provides a `PostCommitHookAsync()` method.  Th `PostCommitHookAsync()` method is called after the data is written to the repository but before returning the data to the client.  Care must be made to ensure that the data being returned to the client isn't changed in this method.

```csharp
public class MyAccessControlProvider<T> : AccessControlProvider<T> where T : ITableData
{
    public override async Task PostCommitHookAsync(TableOperation op, T entity, CancellationToken cancellationToken = default)
    {
        // Do any work you need to here.
        // Make sure you await any asynchronous operations.
    }
}
```

Use this option if you're running asynchronous tasks as part of the hook.

### Option 2: Use the RepositoryUpdated event handler

The `TableController<T>` base class contains an event handler that is called at the same time as the `PostCommitHookAsync()` method.

```csharp
[Authorize]
[Route(tables/[controller])]
public class ModelController : TableController<Model>
{
    public ModelController(AppDbContext context) : base()
    {
        Repository = new EntityTableRepository<Model>(context);
        RepositoryUpdated += OnRepositoryUpdated;
    }

    internal void OnRepositoryUpdated(object sender, RepositoryUpdatedEventArgs e) 
    {
        // The RepositoryUpdatedEventArgs contains Operation, Entity, EntityName
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

Entity Framework Core doesn't set up value generation for date/time columns.  (See [Date/time value generation](/ef/core/modeling/generated-properties?tabs=data-annotations#datetime-value-generation)).  The Azure Mobile Apps repository for Entity Framework Core automatically updates the `UpdatedAt` field for you.  However, if your database is updated outside of the repository, you  must arrange for the `UpdatedAt` and `Version` fields to be updated.

### Azure SQL

Create a trigger for each entity:

```sql
CREATE OR ALTER TRIGGER [dbo].[TodoItems_UpdatedAt] ON [dbo].[TodoItems]
    AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE 
        [dbo].[TodoItems] 
    SET 
        [UpdatedAt] = GETUTCDATE() 
    WHERE 
        [Id] IN (SELECT [Id] FROM INSERTED);
END
```

You can install this trigger using either a migration or immediately after `EnsureCreated()` to create the database.

### Azure Cosmos DB

Azure Cosmos DB is a fully managed NoSQL database for high-performance applications of any size or scale.  See [Azure Cosmos DB Provider](/ef/core/providers/cosmos) for information on using Azure Cosmos DB with Entity Framework Core.  When using Azure Cosmos DB with Azure Mobile Apps:

1. Set up the Cosmos Container with a composite index that specifies the `UpdatedAt` and `Id` fields.  Composite indices can be added to a container through the Azure portal, ARM, Bicep, Terraform, or within code. Here's an example [bicep](/azure/azure-resource-manager/bicep/overview) resource definition:

    ``` bicep
    resource cosmosContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
        name: 'TodoItems'
        parent: cosmosDatabase
        properties: {
            resource: {
                id: 'TodoItems'
                partitionKey: {
                    paths: [
                        '/Id'
                    ]
                    kind: 'Hash'
                }
                indexingPolicy: {
                    indexingMode: 'consistent'
                    automatic: true
                    includedPaths: [
                        {
                            path: '/*'
                        }
                    ]
                    excludedPaths: [
                        {
                            path: '/"_etag"/?'
                        }
                    ]
                    compositeIndexes: [
                        [
                            {
                                path: '/UpdatedAt'
                                order: 'ascending'
                            }
                            {
                                path: '/Id'
                                order: 'ascending'
                            }
                        ]
                    ]
                }
            }
        }
    }
    ```

   If you pull a subset of items in the table, ensure you specify all properties involved in the query.

2. Derive models from the `ETagEntityTableData` class:

    ``` csharp
    public class TodoItem : ETagEntityTableData
    {
        public string Title { get; set; }
        public bool Completed { get; set; }
    }
    ```

3. Add an `OnModelCreating(ModelBuilder)` method to the `DbContext`.  The Cosmos DB driver for Entity Framework places all entities into the same container by default.  At a minimum, you must pick a suitable partition key and ensure the `EntityTag` property is marked as the concurrency tag.  For example, the following snippet stores the `TodoItem` entities in their own container with the appropriate settings for Azure Mobile Apps:

    ``` csharp
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<TodoItem>(builder =>
        {
            // Store this model in a specific container.
            builder.ToContainer("TodoItems");
            // Do not include a discriminator for the model in the partition key.
            builder.HasNoDiscriminator();
            // Set the partition key to the Id of the record.
            builder.HasPartitionKey(model => model.Id);
            // Set the concurrency tag to the EntityTag property.
            builder.Property(model => model.EntityTag).IsETagConcurrency();
        });
        base.OnModelCreating(builder);
    }
    ```

Azure Cosmos DB is supported in the `Microsoft.AspNetCore.Datasync.EFCore` NuGet package since v5.0.11. For more information, review the following links:

* [Cosmos DB Sample][cosmos-sample].
* [EF Core Azure Cosmos DB Provider](/ef/core/providers/cosmos) documentation.
* [Cosmos DB index policy](/azure/cosmos-db/index-policy) documentation.

### PostgreSQL

Create a trigger for each entity:

```sql
CREATE OR REPLACE FUNCTION todoitems_datasync() RETURNS trigger AS $$
BEGIN
    NEW."UpdatedAt" = NOW() AT TIME ZONE 'UTC';
    NEW."Version" = convert_to(gen_random_uuid()::text, 'UTF8');
    RETURN NEW
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER
    todoitems_datasync
BEFORE INSERT OR UPDATE ON
    "TodoItems"
FOR EACH ROW EXECUTE PROCEDURE
    todoitems_datasync();
```

You can install this trigger using either a migration or immediately after `EnsureCreated()` to create the database.  

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

1. Install the `Microsoft.AspNetCore.Datasync.LiteDb` package from NuGet.

2. Add a singleton for the `LiteDatabase` to the `Program.cs`:

    ``` csharp
    const connectionString = builder.Configuration.GetValue<string>("LiteDb:ConnectionString");
    builder.Services.AddSingleton<LiteDatabase>(new LiteDatabase(connectionString));
    ```

3. Derive models from the `LiteDbTableData`:

    ``` csharp
    public class TodoItem : LiteDbTableData
    {
        public string Title { get; set; }
        public bool Completed { get; set; }
    }
    ```

    You can use any of the `BsonMapper` attributes that are supplied with the LiteDb NuGet package.

4. Create a controller using the `LiteDbRepository`:

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

Browsing to the `/swagger` endpoint of the web service allows you to browse the API.  The OpenAPI definition can then be imported into other services (such as Azure API Management).  For more information on configuring NSwag, see [Get started with NSwag and ASP.NET Core](/aspnet/core/tutorials/getting-started-with-nswag).

### Swashbuckle

Follow the basic instructions for Swashbuckle integration, then modify as follows:

1. Add packages to your project to support Swashbuckle.  The following packages are required:

    * [Swashbuckle.AspNetCore](https://www.nuget.org/packages/Swashbuckle.AspNetCore).
    * [Swashbuckle.AspNetCore.Newtonsoft](https://www.nuget.org/packages/Swashbuckle.AspNetCore.Newtonsoft).
    * [Microsoft.AspNetCore.Datasync.Swashbuckle](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.Swashbuckle).

2. Add a service to generate an OpenAPI definition to your `Program.cs` file:

    ```csharp
    builder.Services.AddSwaggerGen(options => 
    {
        options.AddDatasyncControllers();
    });
    builder.Services.AddSwaggerGenNewtonsoftSupport();
    ```

    > [!NOTE]
    > The `AddDatasyncControllers()` method takes an optional `Assembly` that corresponds to the assembly that contains your table controllers.  The `Assembly` parameter is only required if your table controllers are in a different project to the service.

3. Enable the middleware for serving the generated JSON document and the Swagger UI, also in `Program.cs`:

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

With this configuration, browsing to the root of the web service allows you to browse the API.  The OpenAPI definition can then be imported into other services (such as Azure API Management).  For more information on configuring Swashbuckle, see [Get started with Swashbuckle and ASP.NET Core](/aspnet/core/tutorials/getting-started-with-swashbuckle).

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

---
title: How to use the ASP.NET Core SDK for Azure Mobile Apps
description: How to use the ASP.NET Core SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 11/11/2021
ms.author: adhal
---

# How to use the ASP.NET Core backend server SDK

This topic shows you have to configure and use the ASP.NET Core backend server SDK to produce a datasync server.

## Supported Platforms

The ASP.NET Core backend server supports ASP.NET Core 6.0.

Database servers must meet the following criteria:

* Supported by [Entity Framework Core](https://docs.microsoft.com/ef/core/providers/?tabs=dotnet-core-cli).
* `DateTimeOffset` support with ms accuracy.

Currently, all databases supported by Entity Framework Core except SQLite can be used "out of the box".  SQLite needs work to handle ms accuracy.

## Create a new datasync server

A datasync server uses the normal ASP.NET Core mechanisms for creating the server.  It consists of three steps:

1. Create an ASP.NET Core server project.
1. Add Entity Framework Core
1. Add Datasync Services

In addition, you can optionally add identity (authentication and authorization) to your service.  For information on creating an ASP.NET Core service with Entity Framework Core, please see [the tutorial](https://docs.microsoft.com/aspnet/core/tutorials/first-web-api?view=aspnetcore-6.0).

To enable datasync services, you need to add the following NuGet libraries:

* [Microsoft.AspNetCore.Datasync](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync)
* [Microsoft.AspNetCore.Datasync.EFCore](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.EFCore) for Entity Framework Core based tables.
* [Microsoft.AspNetCore.Datasync.InMemory](https://www.nuget.org/packages/Microsoft.AspNetCore.Datasync.InMemory) for in-memory tables.

Modify the `Program.cs` file.  Add the following line under all other service definitions:

``` csharp
builder.Services.AddDatasyncControllers();
```

You can also use the ASP.NET Core datasync-server template:

```dotnetcli
# This only needs to be done once
dotnet new -i Microsoft.AspNetCore.Datasync.Template.CSharp
mkdir My.Datasync.Server
cd My.Datasync.Server
dotnet new datasync-server
```

The template includes a sample model and controller.

## Create a table controller for a SQL table

The default repository uses Entity Framework Core. Creating a table controller is a three step process:

1. Create a model class for the data model.
1. Add the model class to the `DbContext` for your application.
1. Create a new `TableController<T>` class to expose your model.

### Create a model class

All model classes must conform to `ITableData` and add the abstract class for the repository type you are using.  Entity Framework Core uses `EntityTableData`, as follows:

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

The `ITableData` (which is implemented by `EntityTableData`) provides the ID of the record, together with additional properties for handling datasync services:

* `UpdatedAt` (`DateTimeOffset?`) provides the date that the record was last updated.
* `Version` (`byte[]`) provides an opaque value that changes on every write.
* `Deleted` (`bool`) is true if the record has been deleted but not yet purged.

These values are maintained by the server, and should not be manually altered by your code.

### Update the `DbContext`

Entity Framework Core requires that each model in the database be registered in the `DbContext`.  For example:

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

A table controller is a specialized `ApiController`.  Here is a minimal table controller:

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

Of note:

* The controller must have a route.  By convention, tables are exposed on a sub-path of `/tables`, but they can be placed anywhere.  If you are using client libraries earlier than v5.0.0, then the table must be a sub-path of `/tables`.
* The controller must inherit from `TableController<T>`, where `<T>` is an implementation of the `ITableData` implementation for your repository type.
* You must assign a repository based on the same type as your model.

### Implementing an in-memory repository

In addition to the Entity Framework Core repository, we support an in-memory repository.  This must be exposed as a `Singleton`.  To configure an in-memory repository, add a singleton for the repository in your `Program.cs`:

```csharp
IEnumerable<Model> seedData = GenerateSeedData();
builder.Services.AddSingleton<IRepository<Model>>(new InMemoryRepository<Model>(seedData));
```

You can then set up your table controller as follows:

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
* `MaxTop` (`int`, default: 512000) is the maximum value allowed for a `$top` query option.  This is equivalent to the LINQ `.Take()` value.
* `EnableSoftDelete` (`bool`, default: false) enables soft-delete, which marks items as deleted instead of deleting them from the database.  This allows clients to update their offline cache, but requires that the items be purged periodically.
* `UnauthorizedStatusCode` (`int`, default: 401 Unauthorized) is the status code that is returned if the user is not authorized to do a specific operation.  By default, it is `401 Unauthorized`, but can be set to anything you want.

## Configure access permissions

By default, a user can do anything they want to entities within a table - create, read, update, and delete any record.  This is normally undesirable, so you will want to create an `AccessControlProvider`.  This object implements `IAccessControlProvider` to implement three methods:

* `GetDataView()` returns a lambda that limits what the connected user can see.
* `IsAuthorizedAsync()` determines if the connected user can perform the action on the specific entity that is being requested.
* `PreCommitHookAsync()` adjusts any entity immediately prior to being written to the repository.

Between the three methods, you can effectively handle most access control cases.  If you need access to the `HttpContext`, you will need to [configure a HttpContextAccessor](https://docs.microsoft.com/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0#use-httpcontext-from-custom-components).

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

    public Func<T,bool> GetDataView()
    {
      return (UserId == null)
        ? _ => false
        : model => model.UserId == UserId;
    }

    public Task<bool> IsAuthorizedAsync(TableOperation op, T? entity, CancellationToken token = default) 
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

The methods are async in case you need to do an additional database lookup to get the correct answer. You can implement the `IAccessControlProvider<T>` interface on the controller, but you still have to pass in the `IHttpContextAccessor` to access the `HttpContext` in a thread safe manner.

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

Logging is handled through [the normal logging mechanism](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-6.0) for ASP.NET Core.  You need to assign the appropriate `ILogger` to the `Logger` property:

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

The ASP.NET Core datasync server supports [ASP.NET Core Identity](https://docs.microsoft.com/aspnet/core/security/authentication/identity?view=aspnetcore-6.0), or any other authentication and authorization scheme you wish to support.  To assist with upgrades from prior versions of Azure Mobile Apps, we also provide an identity provider that implements [Azure App Service Identity](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization).  To configure Azure App Service Identity in your application, edit your `Program.cs`:

``` csharp
builder.Services.AddAuthentication(AzureAppServiceAuthentication.AuthenticationScheme)
  .AddAzureAppServiceAuthentication(options => options.ForceEnable = true);

// Then later, after you have created the app
app.UseAuthentication();
app.UseAuthorization();
```

## Limitations

The ASP.NET Core edition of the service libraries implements OData v4 for the list operation.  When running in "backwards compatibility" mode, filtering on a substring is not supported.

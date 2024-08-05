---
title: How to use the ASP.NET Framework SDK for Azure Mobile Apps
description: How to use the ASP.NET Framework SDK for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 12/19/2022
ms.author: adhal
---

# How to use the ASP.NET Framework SDK for Azure Mobile Apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This topic shows you how to use the .NET backend server SDK in key Azure App Service Mobile Apps scenarios. The Azure Mobile Apps SDK helps you work with mobile clients from your ASP.NET application.

> [!WARNING]
> This article covers information for the v4.2.0 library version, which is superceded by the v5.0.0 library.  For the most up to date information, see the article for the [latest version](./dotnet-core.md)

## Create an Azure Mobile Apps ASP.NET Framework backend

You can create an ASP.NET Framework app using Visual Studio 2019.  

* Choose the **ASP.NET Web Application (.NET Framework)** template.  If you are having trouble locating this template, select **C#**, **All platforms**, and **Web**.
* After selecting a name and location for the application, select the **Web API** project template.  The correct collection of base services for your application will be installed.

### Download and initialize the SDK

The SDK is available on [NuGet.org](https://nuget.org), and provides the base functionality required to get started using Azure Mobile Apps.  To install the package:

1. Right-click on the project, then select **Manage NuGet Packages...**.  
1. In the **Browse** tab, enter `Microsoft.Azure.Mobile.Server` in the search box, then press Enter.
1. Select the `Microsoft.Azure.Mobile.Server.Quickstart` package.
1. Click **Install**.
1. Follow the prompts to complete installation.

Repeat the process to install `Microsoft.Owin.Host.SystemWeb` as well.

> [!NOTE] 
> Do not update the packages that are used as dependencies, such as `Newtonsoft.JSON` or `System.IdentityModel.Jwt`.  The APIs of these packages have, in many cases, changed and are now incompatible with Azure Mobile Apps for ASP.NET Framework.

### Initialize the server project

An Azure Mobile Apps server project is initialized similar to other ASP.NET Framework projects; by including an OWIN Startup class.  To add an OWIN Startup class:

1. Right-click on the project, then select **Add** > **New Item**
1. Select **Web** > **General**, then select the **OWIN Startup class** template.
1. Enter the name `Startup.cs` as the startup name.
1. The contents of the `Startup.cs` file should be similar to the following code:

    ``` csharp
    using Microsoft.Azure.Mobile.Server.Config;
    using Microsoft.Owin;
    using Owin;
    using System.Web.Http;

    [assembly: OwinStartup(typeof(WebApplication1.Startup))]
    namespace WebApplication1
    {
        public class Startup
        {
            public void Configuration(IAppBuilder app)
            {
                HttpConfiguration config = new HttpConfiguration();
                new MobileAppConfiguration()
                    // no added features
                    .ApplyTo(config);
                app.UseWebApi(config);
            }
        }
    }
    ```

    The `OwinStartup`, namespace, and class name will be different, depending on your project.  Specifically, you should replace the contents of the `Configuration()` method, and adjust the `using` directives accordingly.

To enable individual features, you must call extension methods on the **MobileAppConfiguration** object before calling **ApplyTo**. For example, the following code adds the default routes to all API controllers that have the attribute `[MobileAppController]` during initialization:

``` csharp
new MobileAppConfiguration()
    .MapApiControllers()
    .ApplyTo(config);
```

The following setup is considered a "normal" usage that enables both table and API controllers using Entity Framework to access a SQL service.

``` csharp
new MobileAppConfiguration()
    .AddMobileAppHomeController()
    .MapApiControllers()
    .AddTables(
        new MobileAppTableConfiguration()
            .MapTableControllers()
            .AddEntityFramework()
    )
    .MapLegacyCrossDomainController()
    .ApplyTo(config);
```

The extension methods used are:

* `AddMobileAppHomeController()` provides the default Azure Mobile Apps home page.
* `MapApiControllers()` provides custom API capabilities for WebAPI controllers decorated with the `[MobileAppController]` attribute.
* `AddTables()` provides a mapping of the `/tables` endpoints to table controllers.
* `AddTablesWithEntityFramework()` is a short-hand for mapping the `/tables` endpoints using Entity Framework based controllers.
* `MapLegacyCrossDomainController()` provides standard CORS headers for local development.

### SDK extensions

The following NuGet-based extension packages provide various mobile features that can be used by your application. You enable extensions during initialization by using the **MobileAppConfiguration** object.

* [Microsoft.Azure.Mobile.Server.Quickstart]
    Supports the basic Mobile Apps setup. Added to the configuration by calling the **UseDefaultConfiguration** extension method during initialization. This extension includes following extensions: Notifications, Authentication, Entity, Tables, Cross-domain, and Home packages.
* [Microsoft.Azure.Mobile.Server.Home](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Home/)
    Implements the default *this mobile app is up and running page* for the web site root. Add to the configuration by calling the **AddMobileAppHomeController** extension method.
* [Microsoft.Azure.Mobile.Server.Tables](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Tables/)
    includes classes for working with data and sets-up the data pipeline. Add to the configuration by calling the **AddTables** extension method.
* [Microsoft.Azure.Mobile.Server.Entity](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Entity/)
    Enables the Entity Framework to access data in the SQL Database. Add to the configuration by calling the **AddTablesWithEntityFramework** extension method.
* [Microsoft.Azure.Mobile.Server.Authentication]
    Enables authentication and sets-up the OWIN middleware used to validate tokens. Add to the configuration by calling the **AddAppServiceAuthentication** and **IAppBuilder**.**UseAppServiceAuthentication** extension methods.
* [Microsoft.Azure.Mobile.Server.Notifications]
    Enables push notifications and defines a push registration endpoint. Add to the configuration by calling the **AddPushNotifications** extension method.
* [Microsoft.Azure.Mobile.Server.CrossDomain](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.CrossDomain/)
    Creates a controller that serves data to legacy web browsers from your Mobile App. Add to the configuration by calling the **MapLegacyCrossDomainController** extension method.
* [Microsoft.Azure.Mobile.Server.Login]
    Provides the `AppServiceLoginHandler.CreateToken()` method, which is a static method used during custom authentication scenarios.

## Publish the server project

This section shows you how to publish your .NET backend project from Visual Studio.  There are other methods by which you can publish your application.  For more information, see the [Azure App Service documentation](/azure/app-service/deploy-continuous-deployment).

1. In Visual Studio, rebuild the project to restore NuGet packages.
1. In Solution Explorer, right-click the project, click **Publish**.
1. If you have not published this project before, you will configure publishing.
    * Select **Azure** for the target.
    * Select **Azure App Service (Windows) for the specific target.**
    * Select the app service instance you wish to deploy to.  If you don't have one, use the **+** to create one.
    * Click **Finish**.
2. If you have not linked a SQL database before, click **Configure** next to the SQL Database.
    * Select **Azure SQL Database**
    * Select your database.  If you don't have one or wish to use a different one, click the **+** to create a new database and server.
    * Enter `MS_TableConnectionString` as the Database connection string name.  Fill in the username and password in the boxes provided.
    * Click **Finish**
3. Click **Publish**

It takes some time to publish to Azure.  For more information, see [the Visual Studio documentation](/visualstudio/deployment/quickstart-deploy-to-azure).

## Define a table controller

Define a Table Controller to expose a SQL table to mobile clients.  Configuring a Table Controller requires three steps:

1. Create a Data Transfer Object (DTO) class.
1. Configure a table reference in the Mobile DbContext class.
1. Create a table controller.

A Data Transfer Object (DTO) is a plain C# object that inherits from `EntityData`.  For example:

``` csharp
public class TodoItem : EntityData
{
    public string Text { get; set; }
    public bool Complete {get; set;}
}
```

The DTO is used to define the table within the SQL database.  To create the database entry, add a `DbSet<>` property to the `DbContext` you are using:

``` csharp
public class MobileServiceContext : DbContext
{
    private const string connectionStringName = "Name=MS_TableConnectionString";

    public MobileServiceContext() : base(connectionStringName)
    {

    }

    public DbSet<TodoItem> TodoItems { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        modelBuilder.Conventions.Add(
            new AttributeToColumnAnnotationConvention<TableColumnAttribute, string>(
                "ServiceColumnTable", (property, attributes) => attributes.Single().ColumnType.ToString()));
    }
}
```

Finally, create a new controller:

1. Right-click on the `Controllers` folder.
1. Select **Web API** > **Web API 2 Controller - Empty**
1. Enter a name for the controller.
1. Replace the contents of the new controller with the following code:

    ``` csharp
    public class TodoItemController : TableController<TodoItem>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            ZUMOAPPNAMEContext context = new ZUMOAPPNAMEContext();
            DomainManager = new EntityDomainManager<TodoItem>(context, Request);
        }

        // GET tables/TodoItem
        public IQueryable<TodoItem> GetAllTodoItems()
        {
            return Query();
        }

        // GET tables/TodoItem/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<TodoItem> GetTodoItem(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/TodoItem/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<TodoItem> PatchTodoItem(string id, Delta<TodoItem> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/TodoItem
        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/TodoItem/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteTodoItem(string id)
        {
            return DeleteAsync(id);
        }
    }
    ```

### Adjust the table paging size

By default, Azure Mobile Apps returns 50 records per request.  Paging ensures that the client does not tie up their UI thread nor the server for too long, ensuring a good user experience. To change the table paging size, increase the server side "allowed query size" and the client-side page size The server side "allowed query size" is adjusted using the `EnableQuery` attribute:

``` csharp
[EnableQuery(PageSize = 500)]
```

Ensure the PageSize is the same or larger than the size requested by the client.  Refer to the specific client HOWTO documentation for details on changing the client page size.

## Define a custom API controller

The custom API controller provides the most basic functionality to your Mobile App backend by exposing an endpoint. You can register a mobile-specific API controller using the [MobileAppController] attribute. The `MobileAppController` attribute registers the route, sets up the Mobile Apps JSON serializer, and turns on client version checking.

The contents of the Custom API controller are:

``` csharp
[MobileAppController]
public class CustomAPIController : ApiController
{
    // Content here
}
```

Once configured with the `MobileAppController` attribute, you can define the custom API in the same way as any other Web API.

## Work with authentication

Azure Mobile Apps uses App Service Authentication / Authorization to secure your mobile backend.  This section shows you how to perform the following authentication-related tasks in your .NET backend server project:

* [Add authentication to a server project](#add-auth)
* [Use custom authentication for your application](#custom-auth)
* [Retrieve authenticated user information](#user-info)
* [Restrict data access for authorized users](#authorize)

### <a id="add-auth"></a>Add authentication to a server project

You can add authentication to your server project by extending the **MobileAppConfiguration** object and configuring OWIN middleware.

1. In Visual Studio, install the [Microsoft.Azure.Mobile.Server.Authentication] package.
1. In the `Startup.cs` project file, add the following line of code at the beginning of the **Configuration** method:

    ``` csharp
    app.UseAppServiceAuthentication(config);
    ```

    This OWIN middleware component validates tokens issued by the associated App Service gateway.
1. Add the `[Authorize]` attribute to any controller or method that requires authentication.

### <a id="custom-auth"></a>Use custom authentication for your application

> [!IMPORTANT]
> In order to enable custom authentication, you must first enable App Service Authentication without selecting a provider for your App Service in the Azure portal. This will enable the `WEBSITE_AUTH_SIGNING_KEY` environment variable when hosted.
>
> If you do not wish to use one of the App Service Authentication/Authorization providers, you can implement your own login system. Install the [Microsoft.Azure.Mobile.Server.Login] package to assist with authentication token generation.  Provide your own code for validating user credentials. For example, you might check against salted and hashed passwords in a database. In the example below, the `isValidAssertion()` method (defined elsewhere) is responsible for these checks.

The custom authentication is exposed by creating an ApiController and exposing `register` and `login` actions. The client should use a custom UI to collect the information from the user.  The information is then submitted to the API with a standard HTTP POST call. Once the server validates the assertion, a token is issued using the `AppServiceLoginHandler.CreateToken()` method.  The ApiController **should not** use the `[MobileAppController]` attribute.

An example `login` action:

```csharp
public IHttpActionResult Post([FromBody] JObject assertion)
{
    if (isValidAssertion(assertion)) // user-defined function, checks against a database
    {
        JwtSecurityToken token = AppServiceLoginHandler.CreateToken(new Claim[] { new Claim(JwtRegisteredClaimNames.Sub, assertion["username"]) },
            mySigningKey,
            myAppURL,
            myAppURL,
            TimeSpan.FromHours(24) );
        return Ok(new LoginResult()
        {
            AuthenticationToken = token.RawData,
            User = new LoginResultUser() { UserId = userName.ToString() }
        });
    }
    else // user assertion was not valid
    {
        return this.Request.CreateUnauthorizedResponse();
    }
}
```

In the preceding example, `LoginResult` and `LoginResultUser` are serializable objects exposing required properties. The client expects login responses to be returned as JSON objects of the form:

``` json
{
    "authenticationToken": "<token>",
    "user": {
        "userId": "<userId>"
    }
}
```

The `AppServiceLoginHandler.CreateToken()` method includes an *audience* and an *issuer* parameter. Both of these parameters are set to the URL of your application root, using the HTTPS scheme. Similarly you should set *secretKey* to be the value of your application's signing key. Do not distribute the signing key in a client as it can be used to mint keys and impersonate users. You can obtain the signing key while hosted in App Service by referencing the `WEBSITE_AUTH_SIGNING_KEY` environment variable. If needed in a local debugging context, follow the instructions in the [Local debugging with authentication](#local-debug) section to retrieve the key and store it as an application setting.

The issued token may also include other claims and an expiry date.  Minimally, the issued token must include a subject (**sub**) claim.

You can support the standard client `loginAsync()` method by overloading the authentication route.  If the client calls `client.loginAsync('custom');` to log in, your route must be `/.auth/login/custom`.  You can set the route for the custom authentication controller using `MapHttpRoute()`:

``` csharp
config.Routes.MapHttpRoute("custom", ".auth/login/custom", new { controller = "CustomAuth" });
```

> [!TIP]
> Using the `loginAsync()` approach ensures that the authentication token is attached to every subsequent call to the service.

### <a id="user-info"></a>Retrieve authenticated user information

When a user is authenticated by App Service, you can access the assigned user ID and other information in your .NET backend code. The user information can be used for making authorization decisions in the backend. The following code obtains the user ID associated with a request:

``` csharp
// Get the SID of the current user.
var claimsPrincipal = this.User as ClaimsPrincipal;
string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
```

The SID is derived from the provider-specific user ID and is static for a given user and login provider.  The SID is null for invalid authentication tokens.

App Service also lets you request specific claims from your login provider. Each identity provider can provide more information using the identity provider SDK.  For example, you can use the Facebook Graph API for friends information.  You can specify claims that are requested in the provider blade in the Azure portal. Some claims require more configuration with the identity provider.

The following code calls the **GetAppServiceIdentityAsync** extension method to get the login credentials, which include the access token needed to make requests against the Facebook Graph API:

``` csharp
// Get the credentials for the logged-in user.
var credentials = await this.User.GetAppServiceIdentityAsync<FacebookCredentials>(this.Request);

if (credentials.Provider == "Facebook")
{
    // Create a query string with the Facebook access token.
    var fbRequestUrl = "https://graph.facebook.com/me/feed?access_token="
        + credentials.AccessToken;

    // Create an HttpClient request.
    var client = new System.Net.Http.HttpClient();

    // Request the current user info from Facebook.
    var resp = await client.GetAsync(fbRequestUrl);
    resp.EnsureSuccessStatusCode();

    // Do something here with the Facebook user information.
    var fbInfo = await resp.Content.ReadAsStringAsync();
}
```

Add a using statement for `System.Security.Principal` to provide the **GetAppServiceIdentityAsync** extension method.

### <a id="authorize"></a>Restrict data access for authorized users

In the previous section, we showed how to retrieve the user ID of an authenticated user. You can restrict access to data and other resources based on this value. For example, adding a userId column to tables and filtering the query results by the user ID is a simple way to limit returned data only to authorized users. The following code returns data rows only when the SID matches the value in the UserId column on the TodoItem table:

``` csharp
// Get the SID of the current user.
var claimsPrincipal = this.User as ClaimsPrincipal;
string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;

// Only return data rows that belong to the current user.
return Query().Where(t => t.UserId == sid);
```

The `Query()` method returns an `IQueryable` that can be manipulated by LINQ to handle filtering.


## Debug and troubleshoot the .NET Server SDK

Azure App Service provides several debugging and troubleshooting techniques for ASP.NET applications:

* [Monitoring Azure App Service](/azure/app-service/web-sites-monitor)
* [Enable diagnostic logging in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
* [Troubleshoot an Azure App Service in Visual Studio](/azure/app-service/troubleshoot-dotnet-visual-studio)

### Logging

You can write to App Service diagnostic logs by using the standard ASP.NET trace writing. Before you can write to the logs, you must enable diagnostics in your Azure Mobile Apps backend.

To enable diagnostics and write to the logs:

1. Follow the steps in [Enable application logging (Windows)](/azure/app-service/troubleshoot-diagnostic-logs).
1. Add the following using statement in your code file:

    ``` csharp
    using System.Web.Http.Tracing;
    ```

1. Create a trace writer to write from the .NET backend to the diagnostic logs, as follows:

    ``` csharp
    ITraceWriter traceWriter = this.Configuration.Services.GetTraceWriter();
    traceWriter.Info("Hello, World");
    ```

1. Republish your server project, and access the Azure Mobile Apps backend to execute the code path with the logging.
1. Download and evaluate the logs, as described in [Access log files](/azure/app-service/troubleshoot-dotnet-visual-studio#webserverlogs).

### <a id="local-debug"></a>Local debugging with authentication

You can run your application locally to test changes before publishing them to the cloud. For most Azure Mobile Apps backends, press *F5* while in Visual Studio. However, there are some extra considerations when using authentication.

You must have a cloud-based mobile app with App Service Authentication/Authorization configured, and your client must have the cloud endpoint specified as the alternate login host. See the documentation for your client platform for the specific steps required.

Ensure that your mobile backend has [Microsoft.Azure.Mobile.Server.Authentication] installed. Then, in your application's OWIN startup class, add the following, after `MobileAppConfiguration` has been applied to your `HttpConfiguration`:

``` csharp
app.UseAppServiceAuthentication(new AppServiceAuthenticationOptions()
{
    SigningKey = ConfigurationManager.AppSettings["authSigningKey"],
    ValidAudiences = new[] { ConfigurationManager.AppSettings["authAudience"] },
    ValidIssuers = new[] { ConfigurationManager.AppSettings["authIssuer"] },
    TokenHandler = config.GetAppServiceTokenHandler()
});
```

In the preceding example, you should configure the *authAudience* and *authIssuer* application settings within your Web.config file to each be the URL of your application root, using the HTTPS scheme. Similarly you should set *authSigningKey* to be the value of your application's signing key. 

To obtain the signing key:

1. Navigate to your app within the [Azure portal](https://portal.azure.com)
1. Click **Tools** > **Kudu** > **Go**.
1. In the Kudu Management site, click **Environment**.
1. Find the value for `WEBSITE_AUTH_SIGNING_KEY`.

Use the signing key for the *authSigningKey* parameter in your local application config.  Your mobile backend is now equipped to validate tokens when running locally, which the client obtains the token from the cloud-based endpoint.

<!-- Links -->
[Microsoft.Azure.Mobile.Server]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/
[Microsoft.Azure.Mobile.Server.Quickstart]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Quickstart/
[Microsoft.Azure.Mobile.Server.Authentication]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Authentication/
[Microsoft.Azure.Mobile.Server.Login]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Login/
[Microsoft.Azure.Mobile.Server.Notifications]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Notifications/

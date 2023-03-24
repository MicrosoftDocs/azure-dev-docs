---
ms.topic: include
ms.date: 06/03/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

Open Visual Studio and select the `TodoAppService.NET6` project.  

1. Right-click on the `TodoAppService.NET6` project, then select **Manage NuGet Packages...**.
2. Select the **Browse** tab, then enter **Microsoft.Identity.Web** in the search box.

    ![Screenshot of adding the M S A L NuGet in Visual Studio.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/add-identity-web-nuget.png)

3. Select the `Microsoft.Identity.Web` package, then press **Add Package**.
4. Accept the license to complete the installation of the package.
5. Open `Program.cs`.  Add the following to the list of `using` statements:

  ``` csharp
  using Microsoft.AspNetCore.Authentication.JwtBearer;
  using Microsoft.Identity.Web;
  ```

6. Add the following code directly above the call to `builder.Services.AddDbContext()`:

  ``` csharp
  builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
  builder.Services.AddAuthorization();
  ```

7. Add the following code directly above the call to `app.MapControllers()`:

  ``` csharp
  app.UseAuthentication();
  app.UseAuthorization();
  ```

  Your `Program.cs` should now look like this:

  ``` csharp
  using Microsoft.AspNetCore.Datasync;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.AspNetCore.Authentication.JwtBearer;
  using Microsoft.Identity.Web;
  using TodoAppService.NET6.Db;
    
  var builder = WebApplication.CreateBuilder(args);
  var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
  if (connectionString == null)
  {
    throw new ApplicationException("DefaultConnection is not set");
  }
    
  builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
  builder.Services.AddAuthorization();
  builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
  builder.Services.AddDatasyncControllers();
    
  var app = builder.Build();
    
  // Initialize the database
  using (var scope = app.Services.CreateScope())
  {
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.InitializeDatabaseAsync().ConfigureAwait(false);
  }
    
  // Configure and run the web service.
  app.UseAuthentication();
  app.UseAuthorization();
  app.MapControllers();
  app.Run();
  ```

8. Edit the `Controllers\TodoItemController.cs`.  Add an `[Authorize]` attribute to the class.  Your class should look like this:

  ``` csharp
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Datasync;
  using Microsoft.AspNetCore.Datasync.EFCore;
  using Microsoft.AspNetCore.Mvc;
  using TodoAppService.NET6.Db;

  namespace TodoAppService.NET6.Controllers
  {
    [Authorize]
    [Route("tables/todoitem")]
    public class TodoItemController : TableController<TodoItem>
    {
      public TodoItemController(AppDbContext context)
        : base(new EntityTableRepository<TodoItem>(context))
      {
      }
    }
  }
  ```

9. Edit the `appsettings.json`.  Add the following block:

  ``` json
    "AzureAd": {
      "Instance": "https://login.microsoftonline.com",
      "ClientId": "<client-id>",
      "TenantId": "common"
    },
  ```

  Once complete, it should look like this:

  ``` json
  {
    "AzureAd": {
      "Instance": "https://login.microsoftonline.com",
      "ClientId": "<client-id>",
      "TenantId": "common"
    },
    "ConnectionStrings": {
      "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TodoApp;Trusted_Connection=True"
    },
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "AllowedHosts": "*"
  }
  ```

  Replace the `<client-id>` with the Application (client) ID that you recorded earlier.

Once complete, you can publish your service again:

10. Right-click on the `TodoAppService.NET6` project, then select **Publish** > **Publish to Azure...**.
11. Select your backend service, then select **Publish** to publish the updated site to Azure.

Open a browser to `https://yoursite.azurewebsites.net/tables/todoitem?ZUMO-API-VERSION=3.0.0`.  Note that the service now returns a `401` response, which indicates that authentication is required.

![Screenshot of the browser showing an error.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/not-authorized.png)

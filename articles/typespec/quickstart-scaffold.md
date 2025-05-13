---
title: "Quickstart: Create a new API project with TypeSpec"
description: Learn how to generate and set up a new RESTful API project using TypeSpec to scaffold consistent client and server code for cloud services.
ms.topic: quickstart
ms.date: 04/30/2025
ms.custom: devx-track-typespec, devx-track-dotnet
#zone_pivot_groups: typespec-quickstart-on-azure-languages
#zone_pivot_group_filename: developer/typespec/zone-pivot-groups.json
#customer intent: As a developer or API designer, I want to create an TypeSpec API and deploy it to Azure so that I can learn the entire end to end development and deployment cycle.
---

# Quickstart: Create a new API project with TypeSpec

In this quickstart: learn how to use TypeSpec to design, generate, and implement a RESTful API application. TypeSpec is an open-source language for describing cloud service APIs and generates client and server code for multiple platforms. By following this quickstart, you learn how to define your API contract once and generate consistent implementations, helping you build more maintainable and well-documented API services.

In this quickstart, you:

> [!div class="checklist"]
> * Define your API using TypeSpec
> * Create an API server application
> * Integrate Azure Cosmos DB for persistent storage
> * Run and test your API locally
> * Deploy to Azure

## Prerequisites

[!INCLUDE [dotnet-prereq](includes/quickstart/prereqs-csharp.md)]


## Developing with TypeSpec

TypeSpec defines your API in a language-agnostic way and generates the API server and client library for multiple platforms. This functionality allows you to:

* Define your API contract once
* Generate consistent server and client code
* Focus on implementing business logic rather than API infrastructure

**TypeSpec provides API service management**:

* API definition language
* Server-side routing middleware for API
* Client libraries for consuming API

**You provide client requests and server integrations:**

* Implement business logic in middleware such as Azure services for databases, storage, and messaging
* Hosting server for your API (locally or in Azure)
* Deployment scripts for repeatable provisioning and deployment

## Create a new TypeSpec application

1. Create a new folder to hold the API server and TypeSpec files. 

    ```console
    mkdir my_typespec_quickstart
    cd my_typespec_quickstart
    ```

1. Install the [TypeSpec compiler](https://www.npmjs.com/package/@typespec/compiler) globally:

    ```console
    npm install -g @typespec/compiler
    ```

1. Check TypeSpec installed correctly:

    ```console
    tsp --version
    ```

1. Initialize the TypeSpec project:

    ```
    tsp init
    ```

1. Answer the following prompts with the answers provided:

    * Initialize a new project here? Y
    * Select a project template? Generic REST API
    * Enter a project name: Widgets
    * What emitters do you want to use? 
        * OpenAPI 3.1 document
        * C# server stubs

    TypeSpec **emitters** are libraries that utilize various TypeSpec compiler APIs to reflect on the TypeSpec compilation process and generate artifacts.

1. Wait for the initialization to complete before continuing.

    ```console
    Run tsp compile . to build the project.
    
    Please review the following messages from emitters:
      @typespec/http-server-csharp: 
    
            Generated ASP.Net services require dotnet 9:
            https://dotnet.microsoft.com/download 
    
            Create an ASP.Net service project for your TypeSpec:
            > npx hscs-scaffold . --use-swaggerui --overwrite
    
            More information on getting started:
            https://aka.ms/tsp/hscs/start
    ```
    
1. Compile the project:

    ```console
    tsp compile .
    ```
    
1. TypeSpec generates the default project in `./tsp-output`, creating two separate folders:

    * schema
    * server

1. Open the `./tsp-output/schema/openapi.yaml` file. Notice that the few lines in `./main.tsp` generated over 200 lines of OpenApi specification for you. 

1. Open the `./tsp-output/server/aspnet` folder. Notice that the scaffolded .NET files include:
1. This quick scaffolding generates middleware that you can integrate into an existing API server.

    * `./generated/operations/IWidgets.cs` defines the interface for the Widgets methods.
    * `./generated/controllers/WidgetsController.cs` implements the integration to the Widgets methods.
    * `./generated/models` defines the models for the Widget API. 

## Configure TypeSpec emitters

Use the TypeSpec files to configure the API server generation.

1. Open the `tsconfig.yaml` and replace the existing configuration with the following YAML:

    ```yml
    emit:
      - "@typespec/openapi3"
      - "@typespec/http-server-csharp"
    options:
      "@typespec/openapi3":
        emitter-output-dir: "{cwd}/server/wwwroot"
        openapi-versions:
          - 3.1.0
      "@typespec/http-server-csharp":
        emitter-output-dir: "{cwd}/server/"
        use-swaggerui: true
        overwrite: true
        emit-mocks: "mocks-and-project-files"
    ```
    
    This configuration projects several changes we need for a fully generated .NET API server:

    * `emit-mocks`: Create all the project files needed for the server.
    * `use-swaggerui`: Integrate the Swagger UI so you can use the API in a browser-friendly way.
    * `emitter-output-dir`: Set the output directory for both server generation and OpenApi specification generation.
    * Generate everything into `./server`.

1. Recompile the project:

    ```console
    tsp compile .
    ```

1. Change into the new `/server` directory:

    ```console
    cd server
    ```

1. Create a default developer certificate if you don't already have one:

    ```console
    dotnet dev-certs https
    ```

1. Run the project:

    ```console
    dotnet run
    ```

    Wait for the notification to **Open in browser**. 

1. Open the browser and add the Swagger UI route, `/swagger`. 
    
    :::image type="content" source="./media/quickstart-scaffold/default-widget-swagger-ui.png" alt-text="A screenshot showing the Swagger UI with the Widgets API." lightbox="./media/quickstart-scaffold/default-widget-swagger-ui.png":::
    
1. The default TypeSpec API and server both work.

## Understand application file structure

[!INCLUDE [cs-file-structure](includes/quickstart/file-structure-csharp.md)]

## Change persistence to Azure Cosmos DB no-sql

Now that the basic Widget API server is working, update the server to work with [Azure Cosmos DB](/azure/cosmos-db/) for a persistent data store. 

1. In the `./server` directory, add [Azure Cosmos DB](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) to the project:

    ```console
    dotnet add package Microsoft.Azure.Cosmos
    ```

1. Add the [Azure Identity library](https://www.nuget.org/packages/Azure.Identity) to [authenticate to Azure](/dotnet/azure/sdk/authentication/):

    ```console
    dotnet add package Azure.Identity
    ```

1. Update the `./server/ServiceProject.csproj` for Cosmos DB integration settings:

    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
      <PropertyGroup>
        ... existing settings ...
        <EnableSdkContainerSupport>true</EnableSdkContainerSupport>
      </PropertyGroup>
      <ItemGroup>
        ... existing settings ...
        <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
      </ItemGroup>
    </Project>
    ```

1. Create a new registration file, `./azure/CosmosDbRegistration` to manage the Cosmos DB registration:

    ```csharp
    using Microsoft.Azure.Cosmos;
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Threading.Tasks;
    using Azure.Identity;
    using DemoService;

    namespace WidgetService.Service
    {
        /// <summary>
        /// Registration class for Azure Cosmos DB services and implementations
        /// </summary>
        public static class CosmosDbRegistration
        {
            /// <summary>
            /// Registers the Cosmos DB client and related services for dependency injection
            /// </summary>
            /// <param name="builder">The web application builder</param>
            public static void RegisterCosmosServices(this WebApplicationBuilder builder)
            {
                // Register the HttpContextAccessor for accessing the HTTP context
                builder.Services.AddHttpContextAccessor();

                // Get configuration settings
                var cosmosEndpoint = builder.Configuration["Configuration:AzureCosmosDb:Endpoint"];

                // Validate configuration
                ValidateCosmosDbConfiguration(cosmosEndpoint);

                // Configure Cosmos DB client options
                var cosmosClientOptions = new CosmosClientOptions
                {
                    SerializerOptions = new CosmosSerializationOptions
                    {
                        PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                    },
                    ConnectionMode = ConnectionMode.Direct
                };

                builder.Services.AddSingleton(serviceProvider =>
                {
                    var credential = new DefaultAzureCredential();

                    // Create Cosmos client with token credential authentication
                    return new CosmosClient(cosmosEndpoint, credential, cosmosClientOptions);
                });

                // Initialize Cosmos DB if needed
                builder.Services.AddHostedService<CosmosDbInitializer>();

                // Register WidgetsCosmos implementation of IWidgets
                builder.Services.AddScoped<IWidgets, WidgetsCosmos>();
            }

            /// <summary>
            /// Validates the Cosmos DB configuration settings
            /// </summary>
            /// <param name="cosmosEndpoint">The Cosmos DB endpoint</param>
            /// <exception cref="ArgumentException">Thrown when configuration is invalid</exception>
            private static void ValidateCosmosDbConfiguration(string cosmosEndpoint)
            {
                if (string.IsNullOrEmpty(cosmosEndpoint))
                {
                    throw new ArgumentException("Cosmos DB Endpoint must be specified in configuration");
                }
            }
        }
    }
    ```

    Notice the environment variable for the endpoint:

    ```csharp
    var cosmosEndpoint = builder.Configuration["Configuration:AzureCosmosDb:Endpoint"];
    ```

1. Create a new Widget class, `./azure/WidgetsCosmos.cs` to integrate with Azure Cosmos DB. 

    ```csharp
    using System;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos;
    using Microsoft.Extensions.Logging;
    using System.Collections.Generic;
    using System.Linq;

    // Use generated models and operations
    using DemoService;

    namespace WidgetService.Service
    {
        /// <summary>
        /// Implementation of the IWidgets interface that uses Azure Cosmos DB for persistence
        /// </summary>
        public class WidgetsCosmos : IWidgets
        {
            private readonly CosmosClient _cosmosClient;
            private readonly ILogger<WidgetsCosmos> _logger;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly string _databaseName = "WidgetDb";
            private readonly string _containerName = "Widgets";

            /// <summary>
            /// Initializes a new instance of the WidgetsCosmos class.
            /// </summary>
            /// <param name="cosmosClient">The Cosmos DB client instance</param>
            /// <param name="logger">Logger for diagnostic information</param>
            /// <param name="httpContextAccessor">Accessor for the HTTP context</param>
            public WidgetsCosmos(
                CosmosClient cosmosClient,
                ILogger<WidgetsCosmos> logger,
                IHttpContextAccessor httpContextAccessor)
            {
                _cosmosClient = cosmosClient;
                _logger = logger;
                _httpContextAccessor = httpContextAccessor;
            }

            /// <summary>
            /// Gets a reference to the Cosmos DB container for widgets
            /// </summary>
            private Container WidgetsContainer => _cosmosClient.GetContainer(_databaseName, _containerName);

            /// <summary>
            /// Lists all widgets in the database
            /// </summary>
            /// <returns>Array of Widget objects</returns>
            public async Task<WidgetList> ListAsync()
            {
                try
                {
                    var queryDefinition = new QueryDefinition("SELECT * FROM c");
                    var widgets = new List<Widget>();

                    using var iterator = WidgetsContainer.GetItemQueryIterator<Widget>(queryDefinition);
                    while (iterator.HasMoreResults)
                    {
                        var response = await iterator.ReadNextAsync();
                        widgets.AddRange(response.ToList());
                    }

                    // Create and return a WidgetList instead of Widget[]
                    return new WidgetList
                    {
                        Items = widgets.ToArray()
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error listing widgets from Cosmos DB");
                    throw new Error(500, "Failed to retrieve widgets from database");
                }
            }

            /// <summary>
            /// Retrieves a specific widget by ID
            /// </summary>
            /// <param name="id">The ID of the widget to retrieve</param>
            /// <returns>The retrieved Widget</returns>
            public async Task<Widget> ReadAsync(string id)
            {
                try
                {
                    var response = await WidgetsContainer.ReadItemAsync<Widget>(
                        id, new PartitionKey(id));

                    return response.Resource;
                }
                catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    _logger.LogWarning("Widget with ID {WidgetId} not found", id);
                    throw new Error(404, $"Widget with ID '{id}' not found");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error reading widget {WidgetId} from Cosmos DB", id);
                    throw new Error(500, "Failed to retrieve widget from database");
                }
            }
            /// <summary>
            /// Creates a new widget from the provided Widget object
            /// </summary>
            /// <param name="body">The Widget object to store in the database</param>
            /// <returns>The created Widget</returns>
            public async Task<Widget> CreateAsync(Widget body)
            {
                try
                {
                    // Validate the Widget
                    if (body == null)
                    {
                        throw new Error(400, "Widget data cannot be null");
                    }

                    if (string.IsNullOrEmpty(body.Id))
                    {
                        throw new Error(400, "Widget must have an Id");
                    }

                    if (body.Color != "red" && body.Color != "blue")
                    {
                        throw new Error(400, "Color must be 'red' or 'blue'");
                    }

                    // Save the widget to Cosmos DB
                    var response = await WidgetsContainer.CreateItemAsync(
                        body, new PartitionKey(body.Id));

                    _logger.LogInformation("Created widget with ID {WidgetId}", body.Id);
                    return response.Resource;
                }
                catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
                {
                    _logger.LogError(ex, "Widget with ID {WidgetId} already exists", body.Id);
                    throw new Error(409, $"Widget with ID '{body.Id}' already exists");
                }
                catch (Exception ex) when (!(ex is Error))
                {
                    _logger.LogError(ex, "Error creating widget in Cosmos DB");
                    throw new Error(500, "Failed to create widget in database");
                }
            }

            /// <summary>
            /// Updates an existing widget with properties specified in the patch document
            /// </summary>
            /// <param name="id">The ID of the widget to update</param>
            /// <param name="body">The WidgetMergePatchUpdate object containing properties to update</param>
            /// <returns>The updated Widget</returns>
            public async Task<Widget> UpdateAsync(string id, TypeSpec.Http.WidgetMergePatchUpdate body)
            {
                try
                {
                    // Validate input parameters
                    if (body == null)
                    {
                        throw new Error(400, "Update data cannot be null");
                    }

                    if (body.Color != null && body.Color != "red" && body.Color != "blue")
                    {
                        throw new Error(400, "Color must be 'red' or 'blue'");
                    }

                    // First check if the item exists
                    Widget existingWidget;
                    try
                    {
                        var response = await WidgetsContainer.ReadItemAsync<Widget>(
                            id, new PartitionKey(id));
                        existingWidget = response.Resource;
                    }
                    catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("Widget with ID {WidgetId} not found for update", id);
                        throw new Error(404, $"Widget with ID '{id}' not found");
                    }

                    // Apply the patch updates only where properties are provided
                    bool hasChanges = false;

                    if (body.Weight.HasValue)
                    {
                        existingWidget.Weight = body.Weight.Value;
                        hasChanges = true;
                    }

                    if (body.Color != null)
                    {
                        existingWidget.Color = body.Color;
                        hasChanges = true;
                    }

                    // Only perform the update if changes were made
                    if (hasChanges)
                    {
                        // Use ReplaceItemAsync for the update
                        var updateResponse = await WidgetsContainer.ReplaceItemAsync(
                            existingWidget, id, new PartitionKey(id));

                        _logger.LogInformation("Updated widget with ID {WidgetId}", id);
                        return updateResponse.Resource;
                    }

                    // If no changes, return the existing widget
                    _logger.LogInformation("No changes to apply for widget with ID {WidgetId}", id);
                    return existingWidget;
                }
                catch (Error)
                {
                    // Rethrow Error exceptions
                    throw;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating widget {WidgetId} in Cosmos DB", id);
                    throw new Error(500, "Failed to update widget in database");
                }
            }

            /// <summary>
            /// Deletes a widget by its ID
            /// </summary>
            /// <param name="id">The ID of the widget to delete</param>
            public async Task DeleteAsync(string id)
            {
                try
                {
                    await WidgetsContainer.DeleteItemAsync<Widget>(id, new PartitionKey(id));
                    _logger.LogInformation("Deleted widget with ID {WidgetId}", id);
                }
                catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    _logger.LogWarning("Widget with ID {WidgetId} not found for deletion", id);
                    throw new Error(404, $"Widget with ID '{id}' not found");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deleting widget {WidgetId} from Cosmos DB", id);
                    throw new Error(500, "Failed to delete widget from database");
                }
            }

            /// <summary>
            /// Analyzes a widget by ID and returns a simplified analysis result
            /// </summary>
            /// <param name="id">The ID of the widget to analyze</param>
            /// <returns>An AnalyzeResult containing the analysis of the widget</returns>
            public async Task<AnalyzeResult> AnalyzeAsync(string id)
            {
                try
                {
                    // First retrieve the widget from the database
                    Widget widget;
                    try
                    {
                        var response = await WidgetsContainer.ReadItemAsync<Widget>(
                            id, new PartitionKey(id));
                        widget = response.Resource;
                    }
                    catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("Widget with ID {WidgetId} not found for analysis", id);
                        throw new Error(404, $"Widget with ID '{id}' not found");
                    }

                    // Create the analysis result
                    var result = new AnalyzeResult
                    {
                        Id = widget.Id,
                        Analysis = $"Weight: {widget.Weight}, Color: {widget.Color}"
                    };

                    _logger.LogInformation("Analyzed widget with ID {WidgetId}", id);
                    return result;
                }
                catch (Error)
                {
                    // Rethrow Error exceptions
                    throw;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error analyzing widget {WidgetId} from Cosmos DB", id);
                    throw new Error(500, "Failed to analyze widget from database");
                }
            }
        }
    }
    ```
    
1. Create the `./server/services/CosmosDbInitializer.cs` file to authenticate to Azure:

    ```csharp
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    namespace WidgetService.Service
    {
        /// <summary>
        /// Hosted service that initializes Cosmos DB resources on application startup
        /// </summary>
        public class CosmosDbInitializer : IHostedService
        {
            private readonly CosmosClient _cosmosClient;
            private readonly ILogger<CosmosDbInitializer> _logger;
            private readonly IConfiguration _configuration;
            private readonly string _databaseName;
            private readonly string _containerName = "Widgets";

            public CosmosDbInitializer(CosmosClient cosmosClient, ILogger<CosmosDbInitializer> logger, IConfiguration configuration)
            {
                _cosmosClient = cosmosClient;
                _logger = logger;
                _configuration = configuration;
                _databaseName = _configuration["CosmosDb:DatabaseName"] ?? "WidgetDb";
            }

            public async Task StartAsync(CancellationToken cancellationToken)
            {
                _logger.LogInformation("Ensuring Cosmos DB database and container exist...");

                try
                {
                    // Create database if it doesn't exist
                    var databaseResponse = await _cosmosClient.CreateDatabaseIfNotExistsAsync(
                        _databaseName,
                        cancellationToken: cancellationToken);

                    _logger.LogInformation("Database {DatabaseName} status: {Status}", _databaseName,
                        databaseResponse.StatusCode == System.Net.HttpStatusCode.Created ? "Created" : "Already exists");

                    // Create container if it doesn't exist (using id as partition key)
                    var containerResponse = await databaseResponse.Database.CreateContainerIfNotExistsAsync(
                        new ContainerProperties
                        {
                            Id = _containerName,
                            PartitionKeyPath = "/id"
                        },
                        throughput: 400, // Minimum RU/s
                        cancellationToken: cancellationToken);

                    _logger.LogInformation("Container {ContainerName} status: {Status}", _containerName,
                        containerResponse.StatusCode == System.Net.HttpStatusCode.Created ? "Created" : "Already exists");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error initializing Cosmos DB");
                    throw;
                }
            }

            public Task StopAsync(CancellationToken cancellationToken)
            {
                return Task.CompletedTask;
            }
        }
    }
    ```
  
1. Update the `./server/program.cs` to use Cosmos DB and allow the Swagger UI to be used in a production deployment. Copy in the entire file:

    ```csharp
    // Generated by @typespec/http-server-csharp
    // <auto-generated />
    #nullable enable

    using TypeSpec.Helpers;
    using WidgetService.Service;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllersWithViews(options =>
    {
        options.Filters.Add<HttpServiceExceptionFilter>();
    });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Replacee original registration with the Cosmos DB one
    //MockRegistration.Register(builder);
    CosmosDbRegistration.RegisterCosmosServices(builder);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.DocumentTitle = "TypeSpec Generated OpenAPI Viewer";
        c.SwaggerEndpoint("/openapi.yaml", "TypeSpec Generated OpenAPI Docs");
        c.RoutePrefix = "swagger";
    });



    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.Use(async (context, next) =>
    {
        context.Request.EnableBuffering();
        await next();
    });

    app.MapGet("/openapi.yaml", async (HttpContext context) =>
    {
        var externalFilePath = "wwwroot/openapi.yaml"; // Full path to the file outside the project
        if (!File.Exists(externalFilePath))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsync("OpenAPI spec not found.");
            return;
        }
        context.Response.ContentType = "application/json";
        await context.Response.SendFileAsync(externalFilePath);
    });


    app.UseRouting();

    app.UseAuthorization();


    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");


    app.Run();
    ```

1. Build the project:

    ```console
    dotnet build
    ```

    The project now builds with Cosmos DB integration. Let's create the deployment scripts to create the Azure resources and deploy the project.

## Create deployment infrastructure

Create the files needed to have a repeatable deployment with [Azure Developer CLI](/azure/developer/azure-developer-cli/) and Bicep templates. 

1. At the root of the TypeSpec project, create an `azure.yaml` deployment definition file and paste in the following source:

    ```yml
    # yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
    
    name: azure-typespec-scaffold-dotnet
    metadata:
        template: azd-init@1.14.0
    services:
        api:
            project: ./server
            host: containerapp
            language: dotnet
    pipeline:
      provider: github
    ```

    Notice that this configuration references the generated project location (`./server`). Ensure that `./tspconfig.yaml` matches the location specified in `./azure.yaml`.

1. At the root of the TypeSpec project, create an `./infra` directory.
1. Create a `./infra/main.bicepparam` file and copy in the following to define the parameters we need for deployment:

    ```bicep
    using './main.bicep'
    
    param environmentName = readEnvironmentVariable('AZURE_ENV_NAME', 'dev')
    param location = readEnvironmentVariable('AZURE_LOCATION', 'eastus2')
    param deploymentUserPrincipalId = readEnvironmentVariable('AZURE_PRINCIPAL_ID', '')
    ```

    This param list provides the minimum parameters needed for this deployment.

1. Create a `./infra/main.bicep` file and copy in the following to define the Azure resources for provisioning and deployment:

    ```bicep
    metadata description = 'Bicep template for deploying a GitHub App using Azure Container Apps and Azure Container Registry.'
    
    targetScope = 'resourceGroup'
    param serviceName string = 'api'
    var databaseName = 'WidgetDb'
    var containerName = 'Widgets'
    
    @minLength(1)
    @maxLength(64)
    @description('Name of the environment that can be used as part of naming resource convention')
    param environmentName string
    
    @minLength(1)
    @description('Primary location for all resources')
    param location string
    
    @description('Id of the principal to assign database and application roles.')
    param deploymentUserPrincipalId string = ''
    
    var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
    
    var tags = {
      'azd-env-name': environmentName
      repo: 'https://github.com/typespec'
    }
    
    module managedIdentity 'br/public:avm/res/managed-identity/user-assigned-identity:0.4.1' = {
      name: 'user-assigned-identity'
      params: {
        name: 'identity-${resourceToken}'
        location: location
        tags: tags
      }
    }
    
    module cosmosDb 'br/public:avm/res/document-db/database-account:0.8.1' = {
      name: 'cosmos-db-account'
      params: {
        name: 'cosmos-db-nosql-${resourceToken}'
        location: location
        locations: [
          {
            failoverPriority: 0
            locationName: location
            isZoneRedundant: false
          }
        ]
        tags: tags
        disableKeyBasedMetadataWriteAccess: true
        disableLocalAuth: true
        networkRestrictions: {
          publicNetworkAccess: 'Enabled'
          ipRules: []
          virtualNetworkRules: []
        }
        capabilitiesToAdd: [
          'EnableServerless'
        ]
        sqlRoleDefinitions: [
          {
            name: 'nosql-data-plane-contributor'
            dataAction: [
              'Microsoft.DocumentDB/databaseAccounts/readMetadata'
              'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*'
              'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*'
            ]
          }
        ]
        sqlRoleAssignmentsPrincipalIds: union(
          [
            managedIdentity.outputs.principalId
          ],
          !empty(deploymentUserPrincipalId) ? [deploymentUserPrincipalId] : []
        )
        sqlDatabases: [
          {
            name: databaseName
            containers: [
              {
                name: containerName
                paths: [
                  '/id'
                ]
              }
            ]
          }
        ]
      }
    }
    
    module containerRegistry 'br/public:avm/res/container-registry/registry:0.5.1' = {
      name: 'container-registry'
      params: {
        name: 'containerreg${resourceToken}'
        location: location
        tags: tags
        acrAdminUserEnabled: false
        anonymousPullEnabled: true
        publicNetworkAccess: 'Enabled'
        acrSku: 'Standard'
      }
    }
    
    var containerRegistryRole = subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '8311e382-0749-4cb8-b61a-304f252e45ec'
    ) 
    
    module registryUserAssignment 'br/public:avm/ptn/authorization/resource-role-assignment:0.1.1' = if (!empty(deploymentUserPrincipalId)) {
      name: 'container-registry-role-assignment-push-user'
      params: {
        principalId: deploymentUserPrincipalId
        resourceId: containerRegistry.outputs.resourceId
        roleDefinitionId: containerRegistryRole
      }
    }
    
    module logAnalyticsWorkspace 'br/public:avm/res/operational-insights/workspace:0.7.0' = {
      name: 'log-analytics-workspace'
      params: {
        name: 'log-analytics-${resourceToken}'
        location: location
        tags: tags
      }
    }
    
    module containerAppsEnvironment 'br/public:avm/res/app/managed-environment:0.8.0' = {
      name: 'container-apps-env'
      params: {
        name: 'container-env-${resourceToken}'
        location: location
        tags: tags
        logAnalyticsWorkspaceResourceId: logAnalyticsWorkspace.outputs.resourceId
        zoneRedundant: false
      }
    }
    
    module containerAppsApp 'br/public:avm/res/app/container-app:0.9.0' = {
      name: 'container-apps-app'
      params: {
        name: 'container-app-${resourceToken}'
        environmentResourceId: containerAppsEnvironment.outputs.resourceId
        location: location
        tags: union(tags, { 'azd-service-name': serviceName })
        ingressTargetPort: 8080
        ingressExternal: true
        ingressTransport: 'auto'
        stickySessionsAffinity: 'sticky'
        scaleMaxReplicas: 1
        scaleMinReplicas: 1
        corsPolicy: {
          allowCredentials: true
          allowedOrigins: [
            '*'
          ]
        }
        managedIdentities: {
          systemAssigned: false
          userAssignedResourceIds: [
            managedIdentity.outputs.resourceId
          ]
        }
        secrets: {
          secureList: [
            {
              name: 'azure-cosmos-db-nosql-endpoint'
              value: cosmosDb.outputs.endpoint
            }
            {
              name: 'user-assigned-managed-identity-client-id'
              value: managedIdentity.outputs.clientId
            }
          ]
        }
        containers: [
          {
            image: 'mcr.microsoft.com/dotnet/samples:aspnetapp-9.0'
            name: serviceName
            resources: {
              cpu: '0.25'
              memory: '.5Gi'
            }
            env: [
              {
                name: 'CONFIGURATION__AZURECOSMOSDB__ENDPOINT'
                secretRef: 'azure-cosmos-db-nosql-endpoint'
              }
              {
                name: 'AZURE_CLIENT_ID'
                secretRef: 'user-assigned-managed-identity-client-id'
              }
            ]
          }
        ]
      }
    }
    
    output CONFIGURATION__AZURECOSMOSDB__ENDPOINT string = cosmosDb.outputs.endpoint
    output CONFIGURATION__AZURECOSMOSDB__DATABASENAME string = databaseName
    output CONFIGURATION__AZURECOSMOSDB__CONTAINERNAME string = containerName
    
    output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
    output AZURE_CONTAINER_REGISTRY_USERNAME string = containerRegistry.outputs.location
    ```

1. The containerAppsApp tag uses the serviceName variable (set to `api` at the top of the file) and the `api` specified in `./azure.yaml`. This connection tells the Azure Developer CLI where to deploy the .NET project to the Azure Container Apps hosting resource.

    ```bicep
    ...bicep...

    module containerAppsApp 'br/public:avm/res/app/container-app:0.9.0' = {
      name: 'container-apps-app'
      params: {
        name: 'container-app-${resourceToken}'
        environmentResourceId: containerAppsEnvironment.outputs.resourceId
        location: location
        tags: union(tags, { 'azd-service-name': serviceName })                    <--------- `API`

    ...bicep..
    ```


## Deploy application to Azure

You can deploy this application to Azure using Azure Container Apps:

1. Authenticate to the Azure Developer CLI:

    ```console
    azd auth login
    ```
    

1. Deploy to Azure Container Apps using the Azure Developer CLI:

    ```console
    azd up
    ```

## Use application in browser

Once deployed, you can:

1. Access the Swagger UI to test your API at `/swagger`.
2. Use the **Try it now** feature on each API to create, read, update, and delete widgets through the API. 

## Grow your application

Now that you have the entire end to end process working, continue to build your API: 

* Learn more about the [TypeSpec language](https://typespec.io/docs/language-basics/overview/) to add more APIs and API layer features in the `./main.tsp`.
* Add additional [emitters](https://typespec.io/docs/extending-typespec/emitters-basics/) and configure their parameters in the `./tspconfig.yaml`.
* As you add more features in your TypeSpec files, support those changes with source code in the server project. 
* Continue to use [passwordless authentication](/dotnet/azure/sdk/authentication/) with Azure Identity.

## Clean up resources

When you're done with this quickstart, you can remove the Azure resources:

```console
azd down
```

Or delete the resource group directly from the Azure portal.

## Next steps

- [TypeSpec documentation](https://microsoft.github.io/typespec/)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)
- [Deploy Node.js apps to Azure](/azure/app-service/quickstart-nodejs)
- [Azure Container Apps documentation](/azure/container-apps/)
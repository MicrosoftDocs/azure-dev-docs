---
ms.custom: devx-track-ts, devx-track-typespec, devx-track-dotnet, devx-track-csharp
ms.topic: include
ms.date: 04/23/2025
---
The project structure for the generated server includes the .NET controller-based API server, the .NET files for building the project, and the middleware for your Azure integration. 

```console
├── appsettings.Development.json
├── appsettings.json
├── docs
├── generated
├── mocks
├── Program.cs
├── Properties
├── README.md
├── ServiceProject.csproj
└── wwwroot
```

* **Add your business logic**: in this example, start with the `./mocks/Widget.cs` file. The generated `Widget.cs` provides in-memory persistence which is replaced with Azure Cosmos DB later in this article. 
* **Update the server**: add any specific server configurations to `./program.cs`. 
* **Update integrated service configuration**: Later in this article, the project will get the Azure Cosmos DB settings required to connect to the no-sql  database.
* **Use the OpenApi spec**: the TypeSpec generated the OpenApi3.json file into the wwwroot file and made it available to Swagger UI during development. This provides a UI for your specification. You can interact with your API without have to providing an request mechanism such as a REST client or web front-end. 

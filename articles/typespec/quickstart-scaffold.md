---
title: Create a new API project using TypeSpec and TypeScript
description: Learn how to generate and set up a new RESTful API project using TypeSpec to scaffold consistent client and server code for cloud services.
ms.topic: quickstart
ms.date: 04/30/2025
ms.custom: devx-track-typespec, devx-track-ts, devx-track-dotnet
zone_pivot_groups: typespec-quickstart-on-azure-languages
zone_pivot_group_filename: developer/typespec/zone-pivot-groups.json
#customer intent: As a developer or API designer, I want to create an TypeSpec API and deploy it to Azure so that I can learn the entire end to end development and deployment cycle.
---

# Create a new API project with TypeSpec

This tutorial demonstrates how to use TypeSpec to design, generate, and implement a RESTful API application. TypeSpec is an open-source language for describing cloud service APIs and generates client and server code for multiple platforms. By following this tutorial, you'll learn how to define your API contract once and generate consistent implementations, helping you build more maintainable and well-documented API services.

In this tutorial, you:

> [!div class="checklist"]
> * Define your API using TypeSpec
> * Create an API server application
> * Integrate Azure Cosmos DB for persistent storage
> * Run and test your API locally
> * Deploy to Azure

## Prerequisites

::: zone pivot="csharp"

[!INCLUDE [dotnet-prereq](includes/quickstart/prereqs-csharp.md)]

::: zone-end

::: zone pivot="typescript"

[!INCLUDE [ts-prereq](includes/quickstart/prereqs-typescript.md)]

::: zone-end

## Application structure with TypeSpec

TypeSpec defines your API in a language-agnostic way and generates the server and client code for multiple platforms. This allows you to:

* Define your API contract once
* Generate consistent server and client code
* Focus on implementing business logic rather than API infrastructure

**TypeSpec provides API service management**:

* API definition language
* Server-side routing middleware for API
* Client libraries for consuming API

**You provide client requests and server integrations:**

* Implement business logic in middleware
* Integrating Azure services such as databases, storage, and messaging
* Hosting your API (locally or in Azure)

## Create a new application

Create a new folder to hold the API server and TypeSpec files. 

```console
mkdir my_typespec_quickstart
cd my_typespec_quickstart
```

## Install TypeSpec

1. Install the [TypeSpec compiler](https://www.npmjs.com/package/@typespec/compiler) globally:

    ```bash
    npm install -g @typespec/compiler
    ```

1. The TypeSpec files are in a separate `tsp` folder to establish separation of concerns.

    ```
    mkdir tsp
    cd tsp
    ```

## Configure TypeSpec compilation

1. Create the `main.tsp` TypeSpec file for a simple Widget API. 

    ```typescript
    import "@typespec/http";
    
    using Http;
    @service(#{ title: "Widget Service" })
    namespace DemoService;
    
    model Widget {
      @visibility(Lifecycle.Read, Lifecycle.Update)
      @path
      id: string;
    
      weight: int32;
      color: "red" | "blue";
    }
    
    @error
    model Error {
      code: int32;
      message: string;
    }
    
    @route("/widgets")
    @tag("Widgets")
    interface Widgets {
      @get list(): Widget[] | Error;
      @get read(@path id: string): Widget | Error;
      @post create(...Widget): Widget | Error;
      @patch update(...Widget): Widget | Error;
      @delete delete(@path id: string): void | Error;
    }
    ```

## Configure and compile the API server generation.

::: zone pivot="csharp"

1. Create the `tspconfig.yaml` configuration file.

    ```yml
    emit:
    - "@typespec/openapi3"
    - "@typespec/http-server-csharp"
    options:
      "@typespec/openapi3":
        emitter-output-dir: "{project-root}/../server/wwwroot"
      "@typespec/http-server-csharp":
        emitter-output-dir: "{project-root}/../server"
        use-swaggerui: true
        overwrite: true
        emit-mocks: "mocks-and-project-files"
    ```

1. Install the dependencies.

    ```console
    npm install @typespec/openapi3 @typespec/http-server-csharp
    ```

1. Generate the `OpenApi.yaml` and API Server.
    ```console
    tsp compile . --config ./tspconfig.yaml
    ```
    
::: zone-end

::: zone pivot="typescript"

1. Create the `tspconfig.yaml` configuration file.

    ```yml
    emit:
    - "@typespec/openapi3"
    - "@typespec/http-server-js"
    options:
      "@typespec/openapi3":
        emitter-output-dir: "{project-root}/../server/wwwroot"
      "@typespec/http-server-js":
        emitter-output-dir: "{project-root}/../server"
        express: true
    ```

1. Install the dependencies.

    ```console
    npm install @typespec/openapi3 @typespec/http-server-js
    ```

1. Generate the `OpenApi.yaml` and API Server.
    ```console
    tsp compile . --config ./tspconfig.yaml
    ```

::: zone-end

## Compile a TypeSpec API server

::: zone pivot="csharp"

Verify the generated server works:

```console
cd ../server && dotnet build
```


::: zone-end

::: zone pivot="typescript"

Verify the generated server works:

```console
cd ../server && npm run build
```

::: zone-end

## Application file structure

::: zone pivot="csharp"

[!INCLUDE [ts-file-structure](includes/quickstart/file-structure-csharp.md)]

::: zone-end

::: zone pivot="typescript"

[!INCLUDE [ts-file-structure](includes/quickstart/file-structure-typescript.md)]

::: zone-end

## Run a TypeSpec API server locally

::: zone pivot="csharp"

1. Run the .NET 9 API server with:

    ```console
    dotnet run
    ```

1. When the browser opens, add the Swagger UI route: `/swagger/index.html`.

::: zone-end

::: zone pivot="typescript"

1. Run the Express.js server with: 

    ```console
    npm start
    ```

1. When the browser opens, add the Swagger UI route: `/swagger`.

::: zone-end

The SwaggerUI displays and allows you to interact with the API, persisting to an in-memory store.

## Change persistence to Azure Cosmos DB no-sql



## Create Azure Developer CLI infrastructure 

## Deploy application to Azure

You can deploy this application to Azure using Azure Container Apps:

1. Create an Azure Container Registry
2. Build and push your Docker image
3. Deploy to Azure Container Apps using the Azure Developer CLI:

  ```bash
  azd up
  ```

## Use application in browser

Once deployed, you can:

1. Access the Swagger UI to test your API
2. Create, read, update, and delete widgets through the API
3. Use the generated client SDK in another application to consume your API

## Clean up resources

When you're done with this tutorial, you can clean up the Azure resources:

```bash
azd down
```

Or delete the resource group directly from the Azure portal.

## Related articles

- [TypeSpec documentation](https://microsoft.github.io/typespec/)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)
- [Deploy Node.js apps to Azure](/azure/app-service/quickstart-nodejs)
- [Azure Container Apps documentation](/azure/container-apps/)
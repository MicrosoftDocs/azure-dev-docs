---
title: "Quickstart: Create a new API project with TypeSpec and TypeScript"
description: Learn how to generate and set up a new RESTful TypeScript API project using TypeSpec to scaffold consistent client and server code for cloud services.
ms.topic: quickstart
ms.date: 07/24/2025
ms.custom: devx-track-typespec, devx-track-js, devx-track-ts
#zone_pivot_groups: typespec-quickstart-on-azure-languages
#zone_pivot_group_filename: developer/typespec/zone-pivot-groups.json
#customer intent: As a developer or API designer, I want to create an TypeSpec API and deploy it to Azure so that I can learn the entire end to end development and deployment cycle.
---

# Quickstart: Create a new API project with TypeSpec and TypeScript

In this quickstart: learn how to use TypeSpec to design, generate, and implement a RESTful TypeScript API application. TypeSpec is an open-source language for describing cloud service APIs and generates client and server code for multiple platforms. By following this quickstart, you learn how to define your API contract once and generate consistent implementations, helping you build more maintainable and well-documented API services.

In this quickstart, you:

> [!div class="checklist"]
> * Define your API using TypeSpec
> * Create an API server application
> * Integrate Azure Cosmos DB for persistent storage
> * Deploy to Azure
> * Run and test your API

## Prerequisites

[!INCLUDE [ts-prereq](includes/quickstart/prereqs-typescript.md)]


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
        * JavaScript server stubs

    TypeSpec **emitters** are libraries that utilize various TypeSpec compiler APIs to reflect on the TypeSpec compilation process and generate artifacts.

1. Wait for the initialization to complete before continuing.
    
1. Compile the project:

    ```console
    tsp compile .
    ```
    
1. TypeSpec generates the default project in `./tsp-output`, creating two separate folders:

    * **schema** is the OpenApi 3 specification. Notice that the few lines in `./main.tsp` generated over 200 lines of OpenApi specification for you.
    * **server** is the generated middleware. This middleware can be incorporated into a Node.js server project.
        * `./tsp-output/js/src/generated/models/all/demo-service.ts` defines the interfaces for the Widgets API.
        * `./tsp-output/js/src/generated/http/openapi3.ts` defines the Open API spec as a TypeScript file and is regenerated every time you compile your TypeSpec project.
    
## Configure TypeSpec emitters

Use the TypeSpec files to configure the API server generation to scaffold the entire Express.js server.

1. Open the `./tsconfig.yaml` and replace the existing configuration with the following YAML:

    ```yml
    emit:
      - "@typespec/openapi3"
      - "@typespec/http-server-js"
    options:
      "@typespec/openapi3":
        emitter-output-dir: "{output-dir}/server/schema"
        openapi-versions:
          - 3.1.0
      "@typespec/http-server-js":
        emitter-output-dir: "{output-dir}/server"
        express: true
    ```
    
    This configuration creates a complete Express.js API server:

    * `express`: Generate the Express.js API server, including the Swagger UI.
    * `emitter-output-dir`: Generate everything into `./server` directory.

1. Delete the existing `./tsp-output`. Don't worry, you'll generate the server in the next step. 

1. Use the TypeSpec JavaScript emitter to create the Express.js server:

    ```console
    npx hsjs-scaffold
    ```

1. Change into the new `./tsp-output/server` directory:

    ```console
    cd ./tsp-output/server
    ```

1. Compile the TypeScript into JavaScript.

    ```console
    tsc
    ```

1. Run the project:

    ```console
    npm start
    ```

    Wait for the notification to **Open in browser**. 

1. Open the browser and go to `http://localhost:3000/.api-docs`. 
    
    :::image type="content" source="media/quickstart-scaffold/default-widget-swagger-ui.png" alt-text="Screenshot of browser displaying Swagger UI for Widgets API.":::

1. The default TypeSpec API and server both work. If you want to finish off this API server, add your business logic to support the Widgets APIs in `./tsp-output/server/src/controllers/widgets.ts`. The UI is connected to the API which returns hardcoded fake data. 

## Understand application file structure

[!INCLUDE [js-file-structure](includes/quickstart/file-structure-typescript.md)]

## Change persistence to Azure Cosmos DB no-sql

Now that the basic Express.js API server is working, update the Express.js server to work with [Azure Cosmos DB](/azure/cosmos-db/) for a persistent data store. This includes changes to the `index.ts` to use Cosmos DB integration in the middleware. All changes should happen outside the `./tsp-output/server/src/generated` directory.

1. In the `./tsp-output/server` directory, add [Azure Cosmos DB](/azure/cosmos-db/) to the project:

    ```console
    npm install @azure/cosmos
    ```

1. Add the [Azure Identity library](https://www.npmjs.com/package/@azure/identity) to [authenticate to Azure](/azure/developer/javascript/sdk/authentication/overview):

    ```console
    npm install @azure/identity
    ```

1. Create an `./tsp-output/server/src/azure` directory to hold source code specific to Azure.
1. Create the `cosmosClient.ts` file in that directory to create a Cosmos DB client object and paste in the following code:

    ```typescript
    import { CosmosClient, Database, Container } from "@azure/cosmos";
    import { DefaultAzureCredential } from "@azure/identity";
    
    /**
     * Interface for CosmosDB configuration settings
     */
    export interface CosmosConfig {
      endpoint: string;
      databaseId: string;
      containerId: string;
      partitionKey: string;
    } 
    
    /**
     * Singleton class for managing CosmosDB connections
     */
    export class CosmosClientManager {
      private static instance: CosmosClientManager;
      private client: CosmosClient | null = null;
      private config: CosmosConfig | null = null;
    
      private constructor() {}
    
      /**
       * Get the singleton instance of CosmosClientManager
       */
      public static getInstance(): CosmosClientManager {
        if (!CosmosClientManager.instance) {
          CosmosClientManager.instance = new CosmosClientManager();
        }
        return CosmosClientManager.instance;
      }
    
      /**
       * Initialize the CosmosDB client with configuration if not already initialized
       * @param config CosmosDB configuration
       */
      private ensureInitialized(config: CosmosConfig): void {
        if (!this.client || !this.config) {
          this.config = config;
          this.client = new CosmosClient({
            endpoint: config.endpoint,
            aadCredentials: new DefaultAzureCredential(),
          });
        }
      }
    
      /**
       * Get a database instance, creating it if it doesn't exist
       * @param config CosmosDB configuration
       * @returns Database instance
       */
      private async getDatabase(config: CosmosConfig): Promise<Database> {
        this.ensureInitialized(config);
        const { database } = await this.client!.databases.createIfNotExists({ id: config.databaseId });
        return database;
      }
    
      /**
       * Get a container instance, creating it if it doesn't exist
       * @param config CosmosDB configuration
       * @returns Container instance
       */
      public async getContainer(config: CosmosConfig): Promise<Container> {
        const database = await this.getDatabase(config);
        const { container } = await database.containers.createIfNotExists({
          id: config.containerId,
          partitionKey: { paths: [config.partitionKey] }
        });
        return container;
      }
    
      /**
       * Clean up resources and close connections
       */
      public dispose(): void {
        this.client = null;
        this.config = null;
      }
    }
    
    export const buildError = (error: any, message: string) => {
      const statusCode = error?.statusCode || 500;
      return {
        code: statusCode,
        message: `${message}: ${error?.message || 'Unknown error'}`
      };
    };
    ```

    Notice the file uses the endpoint, database, and container. It doesn't need a connection string or key because it's using the Azure Identity credential `DefaultAzureCredential`. Learn more about this method of [secure authentication for both local and production](/azure/developer/javascript/sdk/authentication/overview) environments.

1. Create a new Widget controller, `./tsp-output/server/src/controllers/WidgetsCosmos.ts`, and paste in the following integration code for Azure Cosmos DB.

    ```typescript
    import { Widgets, Widget, WidgetList,   AnalyzeResult,Error } from "../generated/models/all/demo-service.js";
    import { WidgetMergePatchUpdate } from "../generated/models/all/typespec/http.js";
    import { CosmosClientManager, CosmosConfig, buildError } from "../azure/cosmosClient.js";
    import { HttpContext } from "../generated/helpers/router.js";
    import { Container } from "@azure/cosmos";
    
    export interface WidgetDocument extends Widget {
      _ts?: number;
      _etag?: string;
    }
    
    /**
     * Implementation of the Widgets API using Azure Cosmos DB for storage
     */
    export class WidgetsCosmosController implements Widgets<HttpContext>  {
      private readonly cosmosConfig: CosmosConfig;
      private readonly cosmosManager: CosmosClientManager;
      private container: Container | null = null;
    
      /**
       * Creates a new instance of WidgetsCosmosController
       * @param azureCosmosEndpoint Cosmos DB endpoint URL
       * @param databaseId The Cosmos DB database ID
       * @param containerId The Cosmos DB container ID
       * @param partitionKey The partition key path
       */
      constructor(azureCosmosEndpoint: string, databaseId: string, containerId: string, partitionKey: string) {
        if (!azureCosmosEndpoint) throw new Error("azureCosmosEndpoint is required");
        if (!databaseId) throw new Error("databaseId is required");
        if (!containerId) throw new Error("containerId is required");
        if (!partitionKey) throw new Error("partitionKey is required");
    
        this.cosmosConfig = {
          endpoint: azureCosmosEndpoint,
          databaseId: databaseId,
          containerId: containerId,
          partitionKey: partitionKey
        };
    
        this.cosmosManager = CosmosClientManager.getInstance();
      }
    
      /**
       * Get the container reference, with caching
       * @returns The Cosmos container instance
       */
      private async getContainer(): Promise<Container | null> {
        if (!this.container) {
          try {
            this.container = await this.cosmosManager.getContainer(this.cosmosConfig);
            return this.container;
          } catch (error: any) {
            console.error("Container initialization error:", error);
            throw buildError(error, `Failed to access container ${this.cosmosConfig.containerId}`);
          }
        }
        return this.container;
      }
    
      /**
       * Create a new widget
       * @param widget The widget to create
       * @returns The created widget with assigned ID
       */
      async create(ctx: HttpContext,
        body: Widget
      ): Promise<Widget | Error> {
    
        const id = body.id;
    
        try {
          const container = await this.getContainer();
    
          if(!container) {
            return buildError({statusCode:500}, "Container is not initialized");
          }
    
          if (!body.id) {
            return buildError({statusCode:400}, "Widget ID is required");
          }
    
          const response = await container.items.create<Widget>(body, { 
            disableAutomaticIdGeneration: true 
          });
    
          if (!response.resource) {
            return buildError({statusCode:500}, `Failed to create widget ${body.id}: No resource returned`);
          }
    
          return this.documentToWidget(response.resource);
        } catch (error: any) {
          if (error?.statusCode === 409) {
            return buildError({statusCode:409}, `Widget with id ${id} already exists`);
          }
          return buildError(error, `Failed to create widget ${id}`);
        }
      }
    
      /**
       * Delete a widget by ID
       * @param id The ID of the widget to delete
       */
      async delete(ctx: HttpContext, id: string): Promise<void | Error> {
        try {
          const container = await this.getContainer();
    
          if(!container) {
            return buildError({statusCode:500}, "Container is not initialized");
          }
    
          await container.item(id, id).delete();
        } catch (error: any) {
          if (error?.statusCode === 404) {
            return buildError({statusCode:404}, `Widget with id ${id} not found`);
          }
          return buildError(error, `Failed to delete widget ${id}`);
        }
      }
    
      /**
       * Get a widget by ID
       * @param id The ID of the widget to retrieve
       * @returns The widget if found
       */
      async read(ctx: HttpContext, id: string): Promise<Widget | Error> {
        try {
          const container = await this.getContainer();
    
          if(!container) {
            return buildError({statusCode:500}, "Container is not initialized");
          }
    
          const { resource } = await container.item(id, id).read<WidgetDocument>();
    
          if (!resource) {
            return buildError({statusCode:404}, `Widget with id ${id} not found`);
          }
    
          return this.documentToWidget(resource);
        } catch (error: any) {
          return buildError(error, `Failed to read widget ${id}`);
        }
      }
    
      /**
       * List all widgets with optional paging
       * @returns List of widgets
       */
      async list(ctx: HttpContext): Promise<WidgetList | Error> {
        try {
          const container = await this.getContainer();
    
          if(!container) {
            return buildError({statusCode:500}, "Container is not initialized");
          }
    
          const { resources } = await container.items
            .query({ query: "SELECT * FROM c" })
            .fetchAll();
    
          return { items: resources.map(this.documentToWidget) };
        } catch (error: any) {
          return buildError(error, "Failed to list widgets");
        }
      }
    
      /**
       * Update an existing widget
       * @param id The ID of the widget to update
       * @param body The partial widget data to update
       * @returns The updated widget
       */
      async update(
        ctx: HttpContext,
        id: string,
        body: WidgetMergePatchUpdate,
      ): Promise<Widget | Error> {
        try {
          const container = await this.getContainer();
    
          if(!container) {
            return buildError({statusCode:500}, "Container is not initialized");
          }
    
          // First check if the widget exists
          const { resource: item } = await container.item(id).read<WidgetDocument>();
          if (!item) {
            return buildError({statusCode:404}, `Widget with id ${id} not found`);
          }
    
          // Apply patch updates to the existing widget
          const updatedWidget: Widget = {
            ...item,
            ...body,
            id
          };
    
          // Replace the document in Cosmos DB
          const { resource } = await container.item(id).replace(updatedWidget);
    
          if (!resource) {
            return buildError({statusCode:500}, `Failed to update widget ${id}: No resource returned`);
          }
    
          return this.documentToWidget(resource);
        } catch (error: any) {
          return buildError(error, `Failed to update widget ${id}`);
        }
      }
    
      async analyze(ctx: HttpContext, id: string): Promise<AnalyzeResult | Error> {
        return {
          id: "mock-string",
          analysis: "mock-string",
        };
      }
    
      /**
       * Convert a Cosmos DB document to a Widget
       */
      private documentToWidget(doc: WidgetDocument): Widget {
        return Object.fromEntries(
          Object.entries(doc).filter(([key]) => !key.startsWith('_'))
        ) as Widget;
      }
    }
    ```

1. Update the `./tsp-output/server/src/index.ts` to import the new controller, get the Azure Cosmos DB environment settings, then create the WidgetsCosmosController and pass to the router`. 

    ```typescript
    // Generated by Microsoft TypeSpec
    
    import { WidgetsCosmosController } from "./controllers/WidgetsCosmos.js";
    
    import { createDemoServiceRouter } from "./generated/http/router.js";
    
    import express from "express";
    
    import morgan from "morgan";
    
    import { addSwaggerUi } from "./swagger-ui.js";
    
    const azureCosmosEndpoint = process.env.AZURE_COSMOS_ENDPOINT!;
    const azureCosmosDatabase = "WidgetDb";
    const azureCosmosContainer = "Widgets";
    const azureCosmosPartitionKey = "/Id";
    
    const router = createDemoServiceRouter(
      new WidgetsCosmosController(
        azureCosmosEndpoint, 
        azureCosmosDatabase, 
        azureCosmosContainer, 
        azureCosmosPartitionKey)
    );
    const PORT = process.env.PORT || 3000;
    
    const app = express();
    
    app.use(morgan("dev"));
    
    const SWAGGER_UI_PATH = process.env.SWAGGER_UI_PATH || "/.api-docs";
    
    addSwaggerUi(SWAGGER_UI_PATH, app);
    
    app.use(router.expressMiddleware);
    
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log(
        `API documentation is available at http://localhost:${PORT}${SWAGGER_UI_PATH}`,
      );
    });
    ```

1. In a terminal at `./tsp-output/server`, compile the TypeScript into JavaScript.

    ```console
    tsc
    ```

    The project now builds with Cosmos DB integration. Let's create the deployment scripts to create the Azure resources and deploy the project.

## Create deployment infrastructure

Create the files needed to have a repeatable deployment with [Azure Developer CLI](/azure/developer/azure-developer-cli/) and [Bicep templates](/azure/azure-resource-manager/bicep/file). 

1. At the root of the TypeSpec project, create an `azure.yaml` deployment definition file and paste in the following source:

    ```yml
    # yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
    
    name: azure-typespec-scaffold-js
    metadata:
        template: azd-init@1.14.0
    services:
        api:
            project: ./
            host: containerapp
            language: js
            docker:
                path: Dockerfile
    pipeline:
      provider: github
    hooks:
      postprovision:
        windows:
          shell: pwsh
          run: |
            # Set environment variables for the Container App
            azd env set AZURE_COSMOS_ENDPOINT "$env:AZURE_COSMOS_ENDPOINT"
          continueOnError: false
          interactive: true
        posix:
          shell: sh
          run: |
            # Set environment variables for the Container App
            azd env set AZURE_COSMOS_ENDPOINT "$AZURE_COSMOS_ENDPOINT"
          continueOnError: false
          interactive: true
    ```

    Notice that this configuration references the entire TypeSpec project. 

1. At the root of the TypeSpec project, create the `./Dockerfile` which is used to build the container for Azure Container Apps.

    ```dockerfile
    # Stage 1: Build stage
    FROM node:20-alpine AS builder
    
    WORKDIR /app
    
    # Install TypeScript globally
    RUN npm install -g typescript
    
    # Copy package files first to leverage Docker layer caching
    COPY package*.json ./
    
    # Create the tsp-output/server directory structure
    RUN mkdir -p tsp-output/server
    
    # Copy server package.json 
    COPY tsp-output/server/package.json ./tsp-output/server/
    
    # Install build and dev dependencies
    RUN npm i --force --no-package-lock
    RUN cd tsp-output/server && npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Build the TypeScript code
    RUN cd tsp-output/server && tsc
    
    #---------------------------------------------------------------
    
    # Stage 2: Runtime stage
    FROM node:20-alpine AS runtime
    
    # Set NODE_ENV to production for better performance
    ENV NODE_ENV=production
    
    WORKDIR /app
    
    # Copy only the server package files
    COPY tsp-output/server/package.json ./
    
    # Install only production dependencies
    RUN npm install
    
    # Copy all necessary files from the builder stage
    # This includes the compiled JavaScript, any static assets, etc.
    COPY --from=builder /app/tsp-output/server/dist ./dist
    
    # Set default port and expose it
    ENV PORT=3000
    EXPOSE 3000
    
    # Run the application
    CMD ["node", "./dist/src/index.js"]
    ```


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
    var partitionKey = '/id'
    
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
                  partitionKey
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
        ingressTargetPort: 3000
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
            image: 'mcr.microsoft.com/devcontainers/typescript-node'
            name: serviceName
            resources: {
              cpu: '0.25'
              memory: '.5Gi'
            }
            env: [
              {
                name: 'AZURE_COSMOS_ENDPOINT'
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
    
    output AZURE_COSMOS_ENDPOINT string = cosmosDb.outputs.endpoint
    output AZURE_COSMOS_DATABASE string = databaseName
    output AZURE_COSMOS_CONTAINER string = containerName
    output AZURE_COSMOS_PARTITION_KEY string = partitionKey
    
    output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
    output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name
    ```

    The **OUTPUT** variables allow you to use the provisioned cloud resources with your local development.

1
## Deploy application to Azure

You can deploy this application to Azure using Azure Container Apps:

1. In a terminal at the root of the project, authenticate to the Azure Developer CLI:

    ```console
    azd auth login
    ```
    

1. Deploy to Azure Container Apps using the Azure Developer CLI:

    ```console
    azd up
    ```

1. Answer the following prompts with the answers provided:

    * Enter a unique environment name: `tsp-server-js`
    * Select an Azure Subscription to use: select your subscription
    * Select an Azure location to use: select a location near you
    * Pick a resource group to use: Select *Create a new resource group*
    * Enter a name for the new resource group: accept the default provided

1. Wait until the deployment completes. The response includes information similar to the following:

    ```console
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service api
      - Endpoint: https://container-app-123.ambitiouscliff-456.centralus.azurecontainerapps.io/
    
    
    SUCCESS: Your up workflow to provision and deploy to Azure completed in 6 minutes 32 seconds.
    ```

## Use application in browser

Once deployed, you can:

1. In the console, select the `Endpoint` url to open it in a browser. 
1. Add the route, `/.api-docs`, to the endpoint to use the Swagger UI.
1. Use the **Try it now** feature on each method to create, read, update, and delete widgets through the API. 

## Grow your application

Now that you have the entire end to end process working, continue to build your API: 

* Learn more about the [TypeSpec language](https://typespec.io/docs/language-basics/overview/) to add more APIs and API layer features in the `./main.tsp`.
* Add more [emitters](https://typespec.io/docs/extending-typespec/emitters-basics/) and configure their parameters in the `./tspconfig.yaml`.
* As you add more features in your TypeSpec files, support those changes with source code in the server project. 
* Continue to use [passwordless authentication](/azure/developer/javascript/sdk/authentication/overview) with Azure Identity.

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
---
title: "Develop Contoso Real Estate API-first"
description: Understand the Contoso Real Estate API-first approach with Azure Functions, OpenAPI and TypeScript.
ms.topic: conceptual
ms.date: 09/18/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to develop a API layer with modern tools so that I can build scalable and efficient APIs that can handle high traffic loads and integrate with other Azure services seamlessly.
---

# Contoso Real Estate serverless APIs 

The Contoso Real Estate API is a serverless API layer for the enterprise application.  It provides access to the data sources including the Strapi headless CMS and the employee reservations and payments. 

## API-first approach

When designing APIs, the Contoso Real Estate team had challenges including: 

* **API design at scale**: Driving consistency and quality is very costly. Guidelines are difficult to apply and review comes too late in the process.​
* **Versioning**: Supporting many service versions at the same time. Building version tolerant services and clients is very difficult and error prone.​
* **Service implementations**: Services are handwritten to match the API spec. It's too easy for a service implementation and spec _not_ to match each other. Generating code to ensure compliance is difficult or impossible.​
* **High-quality client libraries**: Shipping high quality clients requires hand-authored code. Current code generation tools often fall short.​
* **Writing OpenAPI​**: OpenAPI is primarily a format designed for tools to consume. Authoring it is difficult, time consuming and error prone.​
* **Multiple protocols​**: The same data shapes are used across different protocols, for example REST, gRPC, especially when crossing internal and external boundaries.​

To resolve these challenges, Contoso Real Estate team wanted to: 

* Codify the API Guidelines into reusable components.​
* Describe operations and their associated shapes.​
* Drastically improve developer experience of designing APIs by providing productive tooling that highlights problems at developer time. ​
* Support a wide range of protocols and serialization formats.​
* Drive the generation of high-quality assets across the entire service delivery pipeline (services, clients, docs, CLIs, and other API specification formats).​

The team decided to apply the API-first design approach where the API layer is at the center of the data flow and user-interaction, separating it from the business logic. The API layer is designed with the following principles:

* Decoupling with micro-architectures
* Composability with cloud-native design
* Extensibility by adding more parts without overhead
* Reusability with less code and maintenance efforts
* User experience driven software with the UI design as a starting point

The Contoso Real Estate REST API is designed with [TypeSpec](https://microsoft.github.io/typespec/). **TypeSpec** is a language for describing cloud service APIs and generating other API description languages, client and service code, documentation, and other assets. TypeSpec provides highly extensible core language primitives that can describe API shapes common among REST, GraphQL, gRPC, and other protocols. TypeSpec allows you to define the API with TypeScript and generate the OpenAPI specification. 

The Contoso Real Estate team appreciated writing the API specification in TypeSpec using TypeScript code to define the API. Designing and defining the API in TypeScript allowed for easy tool integration and linting:

* Define API layer including routes, versions, and servers with succint type-safe code
* Create and maintain enums and models including the error model
* Provide text string descriptions for objects to help with autogeneration of SDK reference documentation
* Provide examples for objects to help with sample code to onboarding new developers to the API

### Create OpenAPI specification from TypeSpec

The following procedure creates one of the routes for the API, `listings`, with TypeSpec and generates the OpenAPI specification.

1. Install the [TypeSpec CLI](https://www.npmjs.com/package/@typespec/compiler) with npm.

    ```bash
    npm install -g @typespec/compiler
    ```
2. Create a new project with the `init` command.

    ```bash
    tsp init
    ```

    Select the **generic Rest API** and @typespec/rest, @typespec/openapi3 are selected. The profile files are created for you

3. Install dependencies.

    ```bash
    tsp install
    ```

4. Edit the `main.tsp` TypeSpec (TypeScript) file with your API definition. The following is an example of the `/api/listings` API endpoint for the Contoso Real Estate application.
    
    ```typescript
    import "@typespec/rest";
    import "@typespec/openapi3";
    
    using TypeSpec.Http;
    
    @service({
      title: "Contoso Real Estate Listings Service",
      version: "2023-09-06",
    })
    @server("/api", "Contoso Azure Hosted Production Endpoint")
    @server("http://localhost:7071/api", "Localhost Development Endpoint")
    @doc("This is the Contoso Real Estate portal listings service")
    namespace ContosoRealEstate;
    
    enum ammenities {
      `swimming pool`,
      gym,
      `wi-fi`,
      parking,
      balcony,
      terrace,
      garden,
      patio,
      sauna,
      jacuzzi,
      fireplace,
      `air conditioning`,
      heating,
      elevator,
      `laundry room`,
      dishwasher,
      microwave,
      furniture,
      `no furniture`,
    }
    
    model Address {
      type: {};
      description: "A valid address for listing";
      id: string;
      slug: string;
      buildingNumber: string;
      street: string;
      city: string;
      zipCode: string;
      country: string;
      createdAt: {
        type: string;
        format: "date-time";
      };
      state?: string;
    }
    
    model Review {
      type: {};
      description: "A valid review for listing";
      id?: string;
      slug?: string;
      userId: string;
      listingId: string;
      rating: int32;
      comment: string;
    }
    
    model Listing {
      @visibility("read")
      id?: {
        type: string;
        format: "uuid";
        description: "Autogenerated unique identifier for the listing";
        example: "1db1f3a89eb2dde64e827aea";
      };
    
      title: string;
      slug: string;
      createdAt?: {
        type: string;
        format: "date-time";
      };
      bathrooms: int32;
      bedrooms: int32;
      description: string;
      type?: string;
      isFeatured?: boolean;
      isRecommended?: boolean;
      photos: string[];
      capacity?: int32;
      ammenities?: {
        type: Array<string>;
        description: "Identifies ammenities in a listing";
        items: {
          type: ContosoRealEstate.ammenities;
          default: [];
          example: ["fireplace", "garden"];
        };
      };
      reviews?: {
        type: Array<string>;
        description: "listing reviews";
        items: {
          $ref: "#/components/schemas/Review";
          example: [
            {
              id: "1db1f3a89eb2dde64e827aea";
              rating: 4;
              comment: "Great place to stay!";
            }
          ];
        };
      };
      address: {
        type: {};
        description: "A valid address for listing";
        $ref: "#/components/schemas/Address";
        example: {
          city: "Edinburgh";
          country: "Scotland";
          street: "Sojourner Drive";
          buildingNumber: "Apt 3B";
          zipCode: "10001";
        };
      };
      fees?: {};
    }
    
    @error
    model Error {
      code: int32;
      message: string;
    }
    
    @route("listings")
    @tag("listing")
    interface Listings {
      @get list(): Listing[] | Error;
      @get read(@path id: string): Listing | Error;
    }
    ``````

5. Compile the project to create the OpenAPI specification file.

    ```bash
    tsp compile main.tsp --emit @typespec/openapi3
    ```

6. Review the verbose OpenAPI file found at `./tsp-output/@typespec/openapi3/openapi.yaml`:

    ```yaml
    openapi: 3.0.0
    info:
      title: Contoso Real Estate Listings Service
      version: '2023-09-06'
      description: This is the Contoso Real Estate portal listings service
    tags:
      - name: listing
    paths:
      /listings:
        get:
          tags:
            - listing
          operationId: Listings_list
          parameters: []
          responses:
            '200':
              description: The request has succeeded.
              content:
                application/json:
                  schema:
                    type: array
                    items:
                      $ref: '#/components/schemas/Listing'
            default:
              description: An unexpected error response.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Error'
      /listings/{id}:
        get:
          tags:
            - listing
          operationId: Listings_read
          parameters:
            - name: id
              in: path
              required: true
              schema:
                type: string
          responses:
            '200':
              description: The request has succeeded.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Listing'
            default:
              description: An unexpected error response.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Error'
    components:
      schemas:
        Address:
          type: object
          properties:
            type:
              type: object
              properties: {}
            description:
              type: string
              enum:
                - A valid address for listing
            id:
              type: string
            slug:
              type: string
            buildingNumber:
              type: string
            street:
              type: string
            city:
              type: string
            zipCode:
              type: string
            country:
              type: string
            createdAt:
              type: object
              properties:
                type:
                  type: string
                format:
                  type: string
                  enum:
                    - date-time
              required:
                - type
                - format
            state:
              type: string
          required:
            - type
            - description
            - id
            - slug
            - buildingNumber
            - street
            - city
            - zipCode
            - country
            - createdAt
        Error:
          type: object
          properties:
            code:
              type: integer
              format: int32
            message:
              type: string
          required:
            - code
            - message
        Listing:
          type: object
          properties:
            id:
              type: object
              properties:
                type:
                  type: string
                format:
                  type: string
                  enum:
                    - uuid
                description:
                  type: string
                  enum:
                    - Autogenerated unique identifier for the listing
                example:
                  type: string
                  enum:
                    - 1db1f3a89eb2dde64e827aea
              required:
                - type
                - format
                - description
                - example
              readOnly: true
            title:
              type: string
            slug:
              type: string
            createdAt:
              type: object
              properties:
                type:
                  type: string
                format:
                  type: string
                  enum:
                    - date-time
              required:
                - type
                - format
            bathrooms:
              type: integer
              format: int32
            bedrooms:
              type: integer
              format: int32
            description:
              type: string
            type:
              type: string
            isFeatured:
              type: boolean
            isRecommended:
              type: boolean
            photos:
              type: array
              items:
                type: string
            capacity:
              type: integer
              format: int32
            ammenities:
              type: object
              properties:
                type:
                  type: array
                  items:
                    type: string
                description:
                  type: string
                  enum:
                    - Identifies ammenities in a listing
                items:
                  type: object
                  properties:
                    type:
                      $ref: '#/components/schemas/ammenities'
                    default:
                      type: array
                      items: {}
                    example:
                      type: array
                      items: {}
                  required:
                    - type
                    - default
                    - example
              required:
                - type
                - description
                - items
            reviews:
              type: object
              properties:
                type:
                  type: array
                  items:
                    type: string
                description:
                  type: string
                  enum:
                    - listing reviews
                items:
                  type: object
                  properties:
                    $ref:
                      type: string
                      enum:
                        - '#/components/schemas/Review'
                    example:
                      type: array
                      items: {}
                  required:
                    - $ref
                    - example
              required:
                - type
                - description
                - items
            address:
              type: object
              properties:
                type:
                  type: object
                  properties: {}
                description:
                  type: string
                  enum:
                    - A valid address for listing
                $ref:
                  type: string
                  enum:
                    - '#/components/schemas/Address'
                example:
                  type: object
                  properties:
                    city:
                      type: string
                      enum:
                        - Edinburgh
                    country:
                      type: string
                      enum:
                        - Scotland
                    street:
                      type: string
                      enum:
                        - Sojourner Drive
                    buildingNumber:
                      type: string
                      enum:
                        - Apt 3B
                    zipCode:
                      type: string
                      enum:
                        - '10001'
                  required:
                    - city
                    - country
                    - street
                    - buildingNumber
                    - zipCode
              required:
                - type
                - description
                - $ref
                - example
            fees:
              type: object
              properties: {}
          required:
            - title
            - slug
            - bathrooms
            - bedrooms
            - description
            - photos
            - address
        Review:
          type: object
          properties:
            type:
              type: object
              properties: {}
            description:
              type: string
              enum:
                - A valid review for listing
            id:
              type: string
            slug:
              type: string
            userId:
              type: string
            listingId:
              type: string
            rating:
              type: integer
              format: int32
            comment:
              type: string
          required:
            - type
            - description
            - userId
            - listingId
            - rating
            - comment
        ammenities:
          type: string
          enum:
            - swimming pool
            - gym
            - wi-fi
            - parking
            - balcony
            - terrace
            - garden
            - patio
            - sauna
            - jacuzzi
            - fireplace
            - air conditioning
            - heating
            - elevator
            - laundry room
            - dishwasher
            - microwave
            - furniture
            - no furniture
    servers:
      - url: http://localhost:7071/api
        description: Localhost Development Endpoint
        variables: {}
      - url: /api
        description: Contoso Azure Hosted Production Endpoint
        variables: {}
    ```

7. Add TypeSpec information for the remaining APIS:

    | API | Method| Description |
    | --- | --- | ---|
    |`/listings` | GET |Returns a list of listings. |
    |`/listings/{listingId}` | GET| Returns a listing by ID. |
    |`/users`|GET|Returns a list of Users.|
    |`/users`|POST|Create a new user.|
    |`/users/{id}`|GET|Get user by ID.|
    |`/favorites`|GET|Get all favorites.|
    |`/favorites`|POST|Add a favorite.|
    |`/favorites`|DELETE|Delete a favorite.|
    |`/favorites/{id}`|GET|Returns a favorite by ID.|
    |`/reservations`|GET|Get all reservations.|
    |`/reservations/{id}`|GET|Get reservation by ID.|
    |`/reservations/{id}`|PATCH|Update reservation status.|
    |`/checkout`|POST|Checkout a reservation.|
    |`/payments`|GET|Get all payments.|
    |`/payments`|POST|Add a payment.|
    |`/payments/{id}`|GET|Get payment by ID.|

## API development with Azure Functions

The Contoso Real Estate API is developed with [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview). Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure. Use Azure Functions to run a script or piece of code in response to a variety of events. Azure Functions supports triggers, which are ways to start execution of your code, and bindings, which are ways to simplify coding for input and output data.

### Environment variables

### Database integration

### Services integration

The API package is part of the Contoso Real Estate monorepo which has been configured with DevContainers. The DevContainers include the required dependencies to develop locally including npm packages and database services such as PostGreSQL and MongoDB.

Use the following steps to prepare to develop locally. 

1. Go to the Contoso Real Estate project on GitHub and select [fork](https://github.com/Azure-Samples/contoso-real-estate/fork). Complete the steps to fork the `main` branch into your own GitHub account.
1. Open the forked repository in GitHub Codespaces: select **Code** then select **Codespaces** tab, then select **New codespace**.
1. Wait for the Codespace to be created. This may take a few minutes.
1. In the development environment, install the dependencies.

    ```bash
    npm install
    ```

1. The databases haven't started yet and there is an additional one-time step to restore the PostGreSQL database. In the terminal, run the following command to start and restore the local databases.

    ```bash
    npm run start:services
    ```

    Wait until the database is restored before continuing.

1. To run the Azure Functions API in the `./packages/API` directory, run the following command:

    ```bash
    npm run start:api
    ```

    Wait until the APIs are displayed in the terminal before continuing. 

1. From the **Ports** tab, select the _globe_ icon on the **7071** port to open the API in a new browser tab.

    :::image type="content" source="./media/contoso-real-estate-serverless-api/visual-studio-code-codespaces-select-port.png" alt-text="Screenshot of the Codespace showing the Port tab with the API port, 7071, highlighted." lightbox="./media/contoso-real-estate-serverless-api/visual-studio-code-codespaces-select-port.png":::

1. The Functions app home page is played. 

    :::image type="content" source="./media/contoso-real-estate-serverless-api/azure-functions-app-home-page.png" alt-text="Screenshot of Azure Functions app home page." lightbox="./media/contoso-real-estate-serverless-api/azure-functions-app-home-page.png":::
 
1. Change the URL by adding `/api/listings` to the end to use the **listings** API. 
1. When you see the listings returned, you know the PostGreSQL database is working and the Azure Functions API is getting data from the database. 

    :::image type="content" source="./media/contoso-real-estate-serverless-api/contoso-real-estate-property-listings-json-result.png" alt-text="Screenshot of Azure Functions app home page." lightbox="./media/contoso-real-estate-serverless-api/contoso-real-estate-property-listings-json-result.png":::

1. An example of a single listing returned is: 

    ```json
    {
        "id": 2,
        "title": "Practical loft downtown",
        "slug": "great-location-close-to-downtown",
        "created_at": "2021-01-13T09:00:00.000Z",
        "bathrooms": "2",
        "bedrooms": "4",
        "description": "Beautiful home in a great neighborhood. This home has a large yard and is close to downtown.",
        "type": "Condo",
        "is_featured": "1",
        "is_recommended": "1",
        "photos": [
          "pic-green.png",
          "pic-orange.png",
          "pic-purple.png",
          "pic-green.png",
          "pic-yellowgreen.png"
        ],
        "capacity": "4",
        "ammenities": [
          "wifi|Wi-Fi",
          "outdoor_garden|Garden",
          "balcony|Balcony"
        ],
        "reviews_stars": "2",
        "reviews_number": "290",
        "is_favorited": "0",
        "address": [
          "53",
          "Hanvegib",
          "MN",
          "FL",
          "Dupit River",
          "62077",
          "(27.7827",
          "37.10311)"
        ],
        "fees": [
          "25",
          "56",
          "65",
          "1936",
          "36",
          "GBP:£"
        ],
        "updated_at": "2023-01-23T15:31:31.874Z",
        "published_at": "2023-01-23T15:31:31.706Z",
        "created_by_id": null,
        "updated_by_id": null
      }
    ``````

1. Kill the terminal where you ran `npm run start:api`. 

## Understand how the Functions app connects to the database

For local development, including using the database services in the local environment, the configuration file is already using default values.

1. Open the `./packages/API/config/index.ts` file to view the **getConfig** function.

    ```typescript
    configCache = {
      observability: {
        connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
        roleName: process.env.APPLICATIONINSIGHTS_NAME,
      },
      database: {
        connectionString: process.env.AZURE_COSMOS_CONNECTION_STRING_KEY || "mongodb://mongo:MongoPass@localhost:27017",
        database: process.env.AZURE_COSMOS_DATABASE_NAME || "contosoportal",
      },
      strapi: {
        database: process.env.STRAPI_DATABASE_NAME || "strapi",
        user: process.env.STRAPI_DATABASE_USERNAME || "postgres",
        password: process.env.STRAPI_DATABASE_PASSWORD || "PostgresPass",
        host: process.env.STRAPI_DATABASE_HOST || "localhost",
        port: process.env.STRAPI_DATABASE_PORT ? Number(process.env.STRAPI_DATABASE_PORT) : 5432,
        ssl: !process.env.STRAPI_DATABASE_HOST || process.env.STRAPI_DATABASE_SSL === "false" ? false : true,
      },
      stripeServiceUrl: process.env.STRIPE_SERVICE_URL || "http://localhost:4242",
    } as AppConfig;
    ``````

1. View the `./packages/API/config/pgclient.ts` file to understand how the authenticated PostGreSQL client is created and returned. 

    ```typescript
    import pg from "pg";
    import { logger } from "./observability";
    import { getConfig } from "./index";
    
    export async function pgQuery(transaction: string, args?: any[]) {
      let client;
      try {
        const config = (await getConfig()).strapi;
        client = new pg.Client(config);
    
        console.log("Connecting to PostgreSQL database...");
        await client.connect();
        console.log("Connected to PostgreSQL database");
    
        return await client.query(transaction, args);
      } catch (err) {
        logger.error(`PostgreSQL database error: ${err}`);
        throw err;
      } finally {
        await client?.end();
      }
    };
    ```

1. View the `./packages/API/get-listings/index.ts` file to see the Functions API to get the listings from the PostgreSQL databases.

    ```typescript
    import { AzureFunction, Context, HttpRequest } from "@azure/functions";
    import { pgQuery } from "../config/pgclient";
    
    const getListings: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
      try {
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 10;
        const featured = Boolean(req.query.featured) === true ? '1' : '0';
    
        if (offset < 0) {
          context.res = {
            status: 400,
            body: {
              error: "Offset must be greater than or equal to 0",
            },
          };
          return;
        } else if (limit < 0) {
          context.res = {
            status: 400,
            body: {
              error: "Limit must be greater than or equal to 0",
            },
          };
          return;
        } else if (offset > limit) {
          context.res = {
            status: 400,
            body: {
              error: "Offset must be less than or equal to limit",
            },
          };
          return;
        }
    
        const result = await pgQuery(`SELECT * FROM listings WHERE is_featured = $3 LIMIT $1 OFFSET $2`, [limit, offset, featured]);
    
        const listing = result.rows.map((row: any) => {
          row.fees = row.fees.split("|");
          row.photos = row.photos.split("|");
          row.address = row.address.split("|");
          row.ammenities = row.ammenities.split(",");
          return row;
        });
        context.res = {
          status: 200,
          body: listing,
        };
      } catch (err) {
        context.log.error("Error:", err);
        context.res = {
          status: 500,
          body: "An error occurred while processing the request",
        };
      }
    }
    
    export default getListings;
    ``````

## Understand how the Functions app connects to Azure resources

When working with Azure resources, instead of local databases, the environment variables used in the Functions app need to change. To get the new values, you need to provision the Azure resources with Azure Developer CLI. Part of the provisioning process creates an environment file with the environment variables and secrets.


1. Provision the Azure resources which creates the database and loads the environment variables and secrets into `./.azure/` in a file prefixed with your environment name entered during the `azd provision` step.

    ```bash
    azd auth login
    azd provision
    ```

    This step also creates the database and restores the data from the backup in the Azure Database for PostgreSQL flexible server.

1. To use the Azure resources with local development, create an environment file for the Azure Functions app with the Azure resources.

    ```bash
    cd ./packages/api
    npm run env
    ``````

1. Restart the Functions app locally from the `./packages/api` subfolder.

    ```bash
    func start
    ```

1. Open the Functions app in the browser from the **PORTS** tab and add the API route, `/api/listings` and get the same data list of properties as when you used the local database.


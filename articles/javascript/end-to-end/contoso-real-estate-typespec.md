---
title: "Develop Contoso Real Estate API-first with TypeSpect"
description: Understand the Contoso Real Estate API-first approach TypeSpec.
ms.topic: conceptual
ms.date: 09/18/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to develop a API layer with modern tools so that I can build scalable and efficient APIs that can handle high traffic loads and integrate with other Azure services seamlessly.
---

# Contoso Real Estate API-first development with TypeSpec

The Contoso Real Estate API uses TypeSpec to define the easily maintainable OpenAPI surface. 

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

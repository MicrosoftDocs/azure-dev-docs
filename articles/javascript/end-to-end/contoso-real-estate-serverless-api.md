---
title: "Tutorial: Develop Contoso Real Estate Serverless APIs"
description: Understand the Contoso Real Estate serverless API development with Azure Functions, which connect to PostGreSQL for property listings.
ms.topic: tutorial
ms.date: 09/22/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate, devx-track-extended-azdevcli
# CustomerIntent: As a senior developer new to Azure, I want to develop a API layer with modern tools so that I can build scalable and efficient APIs that can handle high traffic loads and integrate with other Azure services seamlessly.
---

# Tutorial: API development with Azure Functions

[!INCLUDE [include](./includes/contoso-intro-paragraph.md)]

In this tutorial, you'll learn how the Contoso Real Estate API is developed with [Azure Functions](/azure/azure-functions/functions-overview). Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure. Use Azure Functions to run a script or piece of code in response to a variety of events. Azure Functions supports triggers, which are ways to start execution of your code, and bindings, which are ways to simplify coding for input and output data.


## Start API in Codespaces against local database

The API package is part of the Contoso Real Estate monorepo, which has been configured with DevContainers. The DevContainers include the required dependencies to develop locally including npm packages and database services such as PostGreSQL and MongoDB.

Use the following steps to prepare to develop locally. 

1. Go to the Contoso Real Estate project on GitHub and select [fork](https://github.com/Azure-Samples/contoso-real-estate/fork). Complete the steps to fork the `main` branch into your own GitHub account.
1. Open the forked repository in GitHub Codespaces: select **Code** then select **Codespaces** tab, then select **New codespace**.
1. Wait for the Codespace to be created. This may take a few minutes.
1. In the development environment, install the dependencies.

    ```bash
    npm install
    ```

1. The databases haven't started yet and there's an additional one-time step to restore the PostGreSQL database. In the terminal, run the following command to start and restore the local databases.

    ```bash
    npm run start:services
    ```

    Wait until the database is restored before continuing.

1. Rename the existing `./packages/API/local.settings.sample.json` to `./packages/API/local.settings.json` in order to start the Azure Functions successfully.

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

    :::image type="content" source="./media/contoso-real-estate-serverless-api/contoso-real-estate-property-listings-json-result.png" alt-text="Screenshot of Azure Functions property list as JavaScript Object Notation (JSON) result." lightbox="./media/contoso-real-estate-serverless-api/contoso-real-estate-property-listings-json-result.png":::

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

## Start API in Codespaces against Azure database

When working with Azure resources, instead of local databases, the environment variables used in the Functions app need to change. To get the new values, you need to provision the Azure resources with Azure Developer CLI. Part of the provisioning process creates an environment file with the environment variables and secrets.


1. Provision the Azure resources, which create the database and loads the environment variables and secrets into `./.azure/` in a file prefixed with your environment name entered during the `azd provision` step.

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
    npm run start
    ```

1. Open the Functions app in the browser from the **PORTS** tab and add the API route, `/api/listings` and get the same data list of properties as when you used the local database.


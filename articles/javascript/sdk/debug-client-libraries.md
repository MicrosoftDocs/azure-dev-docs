---
title: Configure logging in Azure SDK libraries for JavaScript
description: Learn how to configure logging in Azure SDK libraries for JavaScript to diagnose authentication issues, troubleshoot credential chains, and gain visibility into SDK operations.
ms.date: 08/14/2024
ms.topic: how-to
ms.custom: devx-track-js
zone_pivot_group_filename: ../javascript/javascript-zone-pivot-groups.yml
zone_pivot_groups: js-ts
#customer intent: As a JavaScript developer using Azure services, I want to understand how to enable and configure logging in Azure SDK client libraries to diagnose authentication issues, troubleshoot credential chains, and gain visibility into SDK operations.
---

# Configure logging in Azure SDK client libraries for JavaScript

This article explains how to configure logging in Azure SDK libraries for JavaScript. Enabling logging helps you diagnose authentication issues, troubleshoot credential chains, and gain visibility into SDK operations.


* Set the `AZURE_LOG_LEVEL=verbose` environment variable to turn on logging.
* Use the `@azure/logger` package in your source code.

Valid log levels include `verbose`, `info`, `warning`, and `error`.

You can also set different log levels for specific Azure services with service-specific environment variables. For example:

* `AZURE_IDENTITY_LOGGER_LEVEL=verbose` - For Azure Identity specific logging
* `AZURE_STORAGE_LOGGER_LEVEL=verbose` - For Azure Storage specific logging
* `AZURE_KEYVAULT_LOGGER_LEVEL=verbose` - For Azure Key Vault specific logging

These service-specific log levels take precedence over the global `AZURE_LOG_LEVEL` setting for their respective services.


::: zone pivot="js"

## Prerequisites

- An Azure subscription: [Create one for free][Free Subscription]
- [Node.js LTS][Node.js website]
- Optional, an authentication tool such as [Azure CLI] used for authentication in a local development environment. To create the necessary context, sign in with the Azure CLI. 

## Enable logging with environment variable

Start the application with the environment variable for a simple way to enable logging.

```shell
AZURE_LOG_LEVEL=verbose node index.js
```

## Set environment variables

You can also add environment variables to a `.env` file in your project root. Create a file named `.env` and add the following content.

```ini
AZURE_LOG_LEVEL=verbose
AZURE_CLIENT_ID=<YOUR_CLIENT_ID>
AZURE_STORAGE_ACCOUNT_NAME=<YOUR_STORAGE_ACCOUNT_NAME>
AZURE_STORAGE_CONTAINER_NAME=<YOUR_STORAGE_CONTAINER_NAME>
```

## Enable logging with logger package in source code

The following code sample uses the [@azure/logger] package to debug the Azure SDK client libraries.

### Configure logging for specific services

In addition to setting a global log level, you can configure different log levels for specific Azure services directly in your code:

```javascript
// Import service-specific setLogLevel functions
import { setLogLevel as setIdentityLogLevel } from "@azure/identity";
import { setLogLevel as setStorageLogLevel } from "@azure/storage-blob";

// Set different log levels for different services
setIdentityLogLevel("verbose");  // Detailed logs for identity operations
setStorageLogLevel("warning");   // Only warnings and errors for storage operations
```

This approach gives you fine-grained control over logging verbosity when working with multiple Azure services in the same application.


1. Create `index.mjs` with the following code.

    ```javascript
    import { 
        ChainedTokenCredential, 
        ManagedIdentityCredential, 
        AzureCliCredential 
    } from "@azure/identity";
    import { BlobServiceClient } from "@azure/storage-blob";
    import { AzureLogger, setLogLevel } from "@azure/logger";
    
    // Check required environment variables
    if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
        throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required");
    }
    
    if (!process.env.AZURE_STORAGE_CONTAINER_NAME) {
        throw new Error("AZURE_STORAGE_CONTAINER_NAME environment variable is required");
    }
    
    // Client ID is optional and only used in production environments
    // No need to check for its existence
    
    // Turn on debugging for all Azure SDKs   
    setLogLevel("verbose");
    
    // Configure the logger to use console.log
    AzureLogger.log = (...args) => {
        console.log(...args);
    };

    const credential = new ChainedTokenCredential(
        new ManagedIdentityCredential({ clientId: process.env.AZURE_CLIENT_ID }),
        new AzureCliCredential()
    );
    
    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        credential
    );
    // get container properties
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
    
    async function main(){
        try {
            const properties = await containerClient.getProperties();
            console.log(properties);
        } catch (err) {
            console.error("Error retrieving container properties:", err.message);
            throw err; // Re-throw to allow the catch handler below to process it
        }
    }
    
    main().catch((err) => {
        console.error("Error running sample:", err.message);
        process.exit(1); // Exit with error code
    });
    ```


1. Create the project and install the npm dependencies.

    ```console
    npm init -y
    npm pkg set type=module
    npm install @azure/identity @azure/storage-blob
    ```

1. Sign in to your Azure subscription in your local environment with Azure CLI.

    ```azurecli
    az login
    ```

1. Run the app with an environment variable file. The `--env-file` option was introduced in Node.js 20.6.0.

    ```console
    node --env-file .env index.mjs
    ```

1. Find the successful credential in the output - the `ChainedTokenCredential` allows your code to seamlessly switch between authentication methods, first trying `ManagedIdentityCredential` (for production environments like Azure App Service) and then falling back to `AzureCliCredential` (for local development), with logs showing which credential succeeded.

::: zone-end



::: zone pivot="ts"


## Prerequisites

- An Azure subscription: [Create one for free][Free Subscription]
- [Node.js LTS][Node.js website]
- [TypeScript]
- Optional, an authentication tool such as [Azure CLI] used for authentication in a local development environment. To create the necessary context, sign in with the Azure CLI. 

## Enable logging with environment variable

Start the application with the environment variable for a simple way to enable logging.

```shell
AZURE_LOG_LEVEL=verbose node index.js
```

## Set environment variables

You can also add environment variables to a `.env` file in your project root. Create a file named `.env` and add the following content.

```ini
AZURE_LOG_LEVEL=verbose
AZURE_CLIENT_ID=<YOUR_CLIENT_ID>
AZURE_STORAGE_ACCOUNT_NAME=<YOUR_STORAGE_ACCOUNT_NAME>
AZURE_STORAGE_CONTAINER_NAME=<YOUR_STORAGE_CONTAINER_NAME>
```

## Enable logging with logger package in source code

The following code sample uses the [@azure/logger] package to debug the Azure SDK client libraries.

### Configure logging for specific services

In addition to setting a global log level, you can configure different log levels for specific Azure services directly in your code:

```typescript
// Import service-specific setLogLevel functions
import { setLogLevel as setIdentityLogLevel } from "@azure/identity";
import { setLogLevel as setStorageLogLevel } from "@azure/storage-blob";

// Set different log levels for different services
setIdentityLogLevel("verbose");  // Detailed logs for identity operations
setStorageLogLevel("warning");   // Only warnings and errors for storage operations
```

This approach gives you fine-grained control over logging verbosity when working with multiple Azure services in the same application.


1. Create `index.ts` with the following code.

    ```typescript
    import { 
        ChainedTokenCredential, 
        ManagedIdentityCredential, 
        AzureCliCredential 
    } from "@azure/identity";
    import { BlobServiceClient, ContainerProperties } from "@azure/storage-blob";
    import { AzureLogger, setLogLevel } from "@azure/logger";
    
    // Check required environment variables
    if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
        throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required");
    }
    
    if (!process.env.AZURE_STORAGE_CONTAINER_NAME) {
        throw new Error("AZURE_STORAGE_CONTAINER_NAME environment variable is required");
    }
    
    // Client ID is optional and only used in production environments
    // No need to check for its existence
    
    // Turn on debugging for all Azure SDKs   
    setLogLevel("verbose");
    
    // Configure the logger to use console.log with TypeScript type safety
    AzureLogger.log = (...args: unknown[]): void => {
        console.log(...args);
    };
    
    const credential = new ChainedTokenCredential(
        new ManagedIdentityCredential({ clientId: process.env.AZURE_CLIENT_ID }),
        new AzureCliCredential()
    );
    
    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        credential
    );
    // get container properties
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
    
    async function main(): Promise<void> {
        try {
            const properties: ContainerProperties = await containerClient.getProperties();
            console.log(properties);
        } catch (err) {
            const error = err as Error;
            console.error("Error retrieving container properties:", error.message);
            throw error;
        }
    }
    
    main().catch((err: Error) => {
        console.error("Error running sample:", err.message);
        process.exit(1);
    });
    ```


1. Create the project and install the npm dependencies.

    ```console
    npm init -y
    npm pkg set type=module
    npm install @azure/identity @azure/storage-blob @types/node
    ```

1. Sign in to your Azure subscription in your local environment with Azure CLI.

    ```azurecli
    az login
    ```

1. Build the application.

    ```console
    tsc
    ```
 
1. Run the app with an environment variable file.  The `--env-file` option was introduced in Node.js 20.6.0.

    ```console
    node --env-file .env index.js
    ```

1. Find the successful credential in the output - the `ChainedTokenCredential` allows your code to seamlessly switch between authentication methods, first trying `ManagedIdentityCredential` (for production environments like Azure App Service) and then falling back to `AzureCliCredential` (for local development), with logs showing which credential succeeded.


::: zone-end

[Free Subscription]: https://azure.microsoft.com/free/
[TypeScript]: https://www.typescriptlang.org/ 
[Node.js website]: https://nodejs.org/
[Azure CLI]: /cli/azure/install-azure-cli
[Azure JS SDK logging]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core#logging
[@azure/logger]: https://www.npmjs.com/package/@azure/logger
---
title: "Configure logging in the Azure SDK libraries for JavaScript"
description: This article describes how to use Azure SDK logging for JavaScript to see internal library information to debug an Azure Identity credential chain.
ms.date: 09/10/2024
ms.topic: how-to
ms.custom: devx-track-js
#customer intent: As a JavaScript developer new to Azure, I want understand how to get runtime information from Azure SDK client libraries.
---

# How to log with Azure SDK client libraries

To diagnose an unexpected issue or to understand what any Azure SDK client library for JavaScript is doing, [enable logging](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core#logging) in your app. You can this with either of the methods below:

* Use `AZURE_LOG_LEVEL=verbose` environment variable to turn on logging.
* Use `@azure/logger` package in your source code.

Valid log levels include `verbose`, `info`, `warning`, and `error`.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- <a href="https://nodejs.org/" target="_blank">Node.js LTS.</a>
- Optional, authentication tool such as [Azure CLI](/cli/azure/install-azure-cli) used for authentication in a local development environment, create the necessary context by signing in with the Azure CLI. 

## Debug with environment variable

A simple way to use the environment variable is to start the application with the environment variable.

```shell
AZURE_LOG_LEVEL=verbose node index.js
```

## Debug with logger package in source code

The following code sample uses the [@azure/logger](https://www.npmjs.com/package/@azure/logger) package to debug the Azure SDK client libraries. 

1. Create `index.js` with the following code:

    ```javascript
    import { 
        ChainedTokenCredential, 
        ManagedIdentityCredential, 
        AzureCliCredential 
    } from "@azure/identity";
    import { BlobServiceClient } from "@azure/storage-blob";

    // Turn on debugging    
    const { AzureLogger, setLogLevel } = require("@azure/logger");
    setLogLevel("verbose");
    AzureLogger.log = (...args) => {
        console.log(...args);
    };

    const credential = new ChainedTokenCredential(
        new ManagedIdentityCredential({ clientId: "<YOUR_CLIENT_ID>" }),
        new AzureCliCredential()
    );
    
    const blobServiceClient = new BlobServiceClient(
        "https://dinaberrystor.blob.core.windows.net",
        credential
    );
    // get container properties
    const containerClient = blobServiceClient.getContainerClient("<CONTAINER_NAME>");
    
    async function main(){
        const properties = await containerClient.getProperties();
        console.log(properties);
    }
    
    main().catch((err) => {
        console.error("Error running sample:", err.message);
    });
    ```

2. Install the npm dependencies.

    ```bash
    npm install @azure/identity @azure/storage-blob
    ```

3. Sign into your Azure subscription in your local environment with Azure CLI:

    ```azurecli
    az login
    ```

4. Run the app:

    ```bash
    node index.js
    ```

5. Find the successful credential: `getToken() => SUCCESS`.

    ```output
    azure:core-client:warning The baseUri option for SDK Clients has been deprecated, please use endpoint instead.
    azure:core-client:warning The baseUri option for SDK Clients has been deprecated, please use endpoint instead.
    azure:storage-blob:info RetryPolicy: =====> Try=1 Primary
    azure:identity:info ManagedIdentityCredential(MSAL) => getToken() => Using the MSAL provider for Managed Identity.
    azure:identity:info ManagedIdentityCredential - Token Exchange => ManagedIdentityCredential - Token Exchange: Unavailable. The environment v
    ariables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE
    azure:identity:info ManagedIdentityCredential(MSAL) => getToken() => Using the IMDS endpoint to probe for availability.
    azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Pinging the Azure IMDS endpoint
    azure:core-rest-pipeline retryPolicy:info Retry 0: Attempting to send request 3941fc44-d241-4efa-8e41-86b9760bb825
    azure:core-rest-pipeline:info Request: {
      "url": "http://169.254.169.254/metadata/identity/oauth2/token",
      "headers": {
        "accept": "application/json",
        "accept-encoding": "gzip,deflate",
        "user-agent": "azsdk-js-identity/4.4.1 core-rest-pipeline/1.17.0 Node/20.13.1 OS/(x64-Windows_NT-10.0.26100)",
        "x-ms-client-request-id": "3941fc44-d241-4efa-8e41-86b9760bb825"
      },
      "method": "GET",
      "timeout": 1000,
      "disableKeepAlive": false,
      "withCredentials": false,
      "tracingOptions": {
        "tracingContext": {
          "_contextMap": {}
        }
      },
      "requestId": "3941fc44-d241-4efa-8e41-86b9760bb825",
      "allowInsecureConnection": true,
      "enableBrowserStreams": false
    }
    azure:core-rest-pipeline retryPolicy:error Retry 0: Received an error from request 3941fc44-d241-4efa-8e41-86b9760bb825
    azure:core-rest-pipeline retryPolicy:info Retry 0: Maximum retries reached. Returning the last received response, or throwing the last recei
    ved error.
    azure:identity:verbose ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Caught error RestError: connect ENETUNREACH 169
    .254.169.254:80
    azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: The Azure IMDS endpoint is unavailable
    azure:identity:error ManagedIdentityCredential(MSAL) => getToken() => ERROR. Scopes: https://storage.azure.com/.default. Error message: Mana
    gedIdentityCredential: The managed identity endpoint is not available..
    azure:identity:info AzureCliCredential => getToken() => Using the scope https://storage.azure.com/.default
    azure:identity:info AzureCliCredential => getToken() => expires_on is available and is valid, using it
    azure:identity:info AzureCliCredential => getToken() => SUCCESS. Scopes: https://storage.azure.com/.default.
    azure:identity:info ChainedTokenCredential => getToken() => Result for AzureCliCredential: SUCCESS. Scopes: https://storage.azure.com/.defau
    lt.
    ```
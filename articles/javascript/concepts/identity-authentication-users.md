---
title: Authentication and Authorization - JavaScript - Azure
description: Understand how to developer with Identity, authentication, and users with Azure.  
ms.topic: reference
ms.date: 12/09/2020
ms.custom:  devx-track-js
---

# Identity, authentication, and users

Authentication and authorization are broad subjects for a web application that can be reduced to specific programmatic tasks, DevOps tasks, and user interactions with an application. This article focuses on the top tasks a JavaScript developer commonly has to design for or complete for a web application. 

## Authentication with Azure

Authentication is the ability to allow a programmer or user to access a service or app.

|Required|Perspective|Description|
|--|--|--|
|Yes|Developer|Application code must pass required credentials to Azure to access Azure services.|
|No|User|For a user of an application, authentication can be anonymous or require a user account. This restricted access can use any common authentication provider, including Microsoft, or your can build your own authentication layer for your users.|

## Authentication for developers to Azure services

Programmatic authentication to Azure requires a valid credential for the exact service the code uses. You need to read the Quickstart documentation for the service, and understand what type of credentials the service expects. 

Once you understand how to connect to a service, you should create a service principal and set the service principal to an environment variable on your development machine. That step removes your personal account for direct interaction with Azure, and the risk of your personal account being compromised by checking in credentials with the source code. 

## Programmatic use of modern Azure with @azure/identity npm package

The current Azure SDK library uses that service principal for programmatic authentication to Azure services with the [@azure/identity](https://www.npmjs.com/package/@azure/identity) npm package. This authentication simplifies the process and is available on the [modern Azure SDK packages](https://www.npmjs.com/package/@azure/identity#client-libraries-supporting-authentication-with-azure-identity). 

```javascript
// The default credential first checks environment variables for configuration.
// If environment configuration is incomplete, it will try managed identity.

// Azure Key Vault service to use
const { KeyClient } = require("@azure/keyvault-keys");

// Azure authentication library to access Azure Key Vault
const { DefaultAzureCredential } = require("@azure/identity");

// Azure SDK clients accept the credential as a parameter
const credential = new DefaultAzureCredential();

// Create authenticated client
const client = new KeyClient(vaultUrl, credential);

// Use service from authenticated client
const getResult = await client.getKey("MyKeyName");
```

## Programmatic use with @azure/ms-rest-js npm package

For most other maintained Azure SDK libraries, use one of the following packages: 

* [@azure/ms-rest-js](https://www.npmjs.com/package/@azure/ms-rest-js) - work in the browser and Node.js environment
* [@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) - provides several different authentication mechanisms including Interactive, Service Principal, and User/Password
* [@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth) - requires Azure AD app

The following example demonstrates how to authenticate with a service provided key and endpoint.

```javascript
// Azure QnA Maker service to use
const { QnAMakerRuntimeClient } = require("@azure/cognitiveservices-qnamaker-runtime");

// Azure authentication library to access Azure QnA Maker
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");  
 
// QnA Maker runtime credentials
const QNAMAKER_KEY = process.env["QNAMAKER_KEY"];
const QNAMAKER_ENDPOINT = process.env["QNAMAKER_ENDPOINT"];
const KNOWLEDGEBASE_ID = process.env["QNAMAKER_KNOWLEDGE_BASE_ID"];

const cognitiveServicesCredentials = new CognitiveServicesCredentials(QNAMAKER_KEY);
const client = new QnAMakerRuntimeClient(cognitiveServicesCredentials, QNAMAKER_ENDPOINT);
const customHeaders = { Authorization: `EndpointKey ${QNAMAKER_KEY}` };

// A question you'd like to get a response for, from the knowledge base. For example
const question = "How are you?";

// Maximum number of answer to retreive
const top = 1;

// Find only answers that contain these metadata
const strictFilters = [{ name: "editorial", value: "chitchat" }];

client.runtime.generateAnswer( 
        KNOWLEDGEBASE_ID,
        { question, top, strictFilters },
        { customHeaders }
).then(result =>{
    console.log(JSON.stringify(result));

    // Sample Result
    // {
    //   answers: [
    //     {
    //       questions: [
    //         "How are you?",
    //         "How is your tuesday?"
    //       ],
    //       answer:
    //         ""I'm doing great, thanks for asking!",
    //       score: 100,
    //       id: 90,
    //       source:
    //         "qna_chitchat_Friendly.tsv",
    //       metadata: [{ name: "editorial", value: "chitchat" }],
    //       context: { isContextOnly: false, prompts: [] }
    //     }
    //   ],
    //   debugInfo: null,
    //   activeLearningEnabled: false
    // }

});

```

## User Authentication with an App registration

Microsoft Authentication Library (MSAL) is the recommended library for web development. The library is available in several [languages and frameworks](/azure/active-directory/develop/msal-overview#languages-and-frameworks).

In order to use MSAL, your web app needs an [App registration](/azure/active-directory/develop/quickstart-register-app) with Microsoft. The app registration includes common authentication information such as user scope permissions, and the redirect URL. 

Learn more with the sample project in this [MSAL quickstart](/azure/active-directory/develop/quickstart-v2-javascript).

A user grants permission to your app when they log in to your app. This permission is stored with their user, which they can manage:

* Consumer app permissions management - [https://account.live.com/consent/manage](https://account.live.com/consent/manage)
* Active Directory app permissions management - [https://myapplications.microsoft.com/](https://myapplications.microsoft.com/)

## Next steps

* [Configure your Azure App service](../how-to/configure-web-app-settings.md)
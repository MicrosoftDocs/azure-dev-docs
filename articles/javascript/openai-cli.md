---
title: Conversational CLI with Azure OpenAI
description: Use Azure OpenAI in a TypeScript CLI to create a chatbot that generates text responses to user input.
ms.topic: how-to
ms.date: 05/30/2023
ms.custom: devx-track-js, devx-track-ts
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Using Azure OpenAI in a TypeScript CLI
  
In this tutorial, learn how to use Azure OpenAI with JavaScript in an interactive CHAT CLI. Azure OpenAI is a set of prebuilt AI models that you can use to add intelligent features to your applications. With Azure OpenAI, you can easily integrate natural language processing, computer vision, and other AI capabilities into your TypeScript applications.  

> [!CAUTION]
> This tutorial and the Azure OpenAI Service are in preview. Both will update as the service evolves.

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI Service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule)
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4`<sup>1</sup> models deployed. For more information about model deployment, see the [resource deployment guide](/azure/cognitive-services/openai/how-to/create-resource).
    Make note of your resource endpoint and API key. You'll need them later in this tutorial.


## Application architecture

The command line interface (CLI) application you'll build in this tutorial is a simple chatbot that uses the Azure OpenAI Service to generate text responses to user input. The conversation is encapsulated and managed by an OpenAIClient class. The conversation loop is managed separately. 
  
## Create a new TypeScript application

1. Create a new directory for your project and change to the new directory.

    ```bash
    mkdir openai
    cd openai
    ```

1. Use Git to get the 2 subdirectories in the [azure-typescript-e2e-apps](https://github.com/azure-samples/azure-typescript-e2e-apps.git) samples repository related to this tutorial. 

    ```bash
    git init
    git remote add origin https://github.com/azure-samples/azure-typescript-e2e-apps
    git config core.sparseCheckout true
    git sparse-checkout set cli-openai lib-openai
    git pull origin main
    git sparse-checkout disable
    ```

    The two subdirectories are: 

    * cli-openai: The CLI application with the conversation loop.
    * lib-openai: The OpenAI conversation management functionality.

1. Create a root-level file named `package.json` and add the two subdirectories to the workspace setting:

    ```json
    {
      "name": "@azure-typescript-e2e-apps",
      "version": "1.0.0",
      "description": "",
      "scripts": {
      },
      "workspaces": [
        "lib-openai/",
        "cli-openai/"
      ]
    }
    ```

    This lets the CLI application reference the LIB application using the npm workspace.

    > [!NOTE]
    > NPM workspaces and separate subdirectories are used in this tutorial but not necessary to use Azure OpenAI or create a CLI. You can use the lib-openai directory in a web app or serverless API.

1. Install the dependencies for the two subdirectories.

    ```bash
    npm install
    ```

## Create environment file for Azure OpenAI settings

1. In the `./cli-openai` directory, create a `.env.development` file.
1. Copy the following environment variables into the `.env.development` file.

    ```INI
    AZURE_OPENAI_ENDPOINT=https://<YOUR-RESOURCE_NAME>.openai.azure.com
    AZURE_OPENAI_API_KEY=<YOUR-RESOURCE-KEY>
    AZURE_OPENAI_DEPLOYMENT=<YOUR-DEPLOYMENT-NAME>
    AZURE_OPENAI_API_VERSION=2023-03-15-preview
    AZURE_OPENAI_SYSTEM_PROMPT='Hello'
    ```

1. Replace the values in angle brackets with your own values:

    * `<YOUR-RESOURCE_NAME>`
    * `<YOUR-RESOURCE-KEY>`
    * `<YOUR-DEPLOYMENT-NAME>`

    These values are read by the CLI application and passed to the LIB application.

## Run the CLI application

1. Use the root-leve package.json `build` script to build both apps.

    ```bash
    npm run build
    ```

1. Run the CLI application.

    ```bash
    npm run start
    ```

    The CLI's package.json start script calls the CLI with switches:

    * `-d mydata.txt`: Initial data for the conversation.
    * `-e .env.development`: Environment file.
    * `-l debug.log`: Log file for debugging your application.

1. At the command prompt, enter a question such as `What is TypeScript?` and press Enter. 

1. The CLI responds with a short answer and a new prompt.

    :::image type="content" source="media/azure-openai/conversational-ai.png" alt-text="Screenshot of console showing interaction with the CLI.":::

1. Continue the conversation with a follow-up question such as `What are the top 3 things to learn about Azure with using TypeScript?`.
1. When you want to end the conversation, enter `exit` and select Enter.

## OpenAI request and response 

The CLI application creates a `debug.log` if the `-d` switch is used. 

1. Open the `./lib-openai/debug.log` and find the request and response for Azure OpenAI, returned from the LIB application.

    ```console
    LIB OpenAI request: ...
    LIB OpenAI response: ...
    ```

1. The OpenAI request includes the question you submitted and the overall conversation and metadata settings for OpenAI. 

    ```json
    {
        "conversation": {
            "systemPrompt": {
                "role": "system",
                "content": "Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with the JavaScript SDKs."
            },
            "messages": [
                {
                    "role": "user",
                    "content": "what is typescript"
                }
            ]
        },
        "appConfig": {
            "endpoint": "https://REDACTED.openai.azure.com",
            "apiKey": "REDACTED",
            "deployment": "REDACTED",
            "apiVersion": "2023-03-15-preview"
        },
        "requestConfig": {
            "max_tokens": 800,
            "temperature": 0,
            "top_p": 0.95,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "stop": ""
        }
    }
    ```

    The `requestConfig` property shown above includes default request [options](/javascript/api/@azure/openai/getchatcompletionsoptions) in the LIB application such as `temperature` and `max_tokens`.

    When you're beginning to create your chat, you can experiment with the length of response (`max_tokens`) and the randomness of the response (`temperature`).

1. The OpenAI response includes the answer in the choices array and metadata and tracking information. 

    ```json
    {
        "id": "chatcmpl-7LusHpPOALYwkFQfkyE3XOsVxVSMz",
        "object": "chat.completion",
        "created": 1685457869,
        "model": "gpt-35-turbo",
        "choices": [
            {
                "index": 0,
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": "TypeScript is a programming language that is a superset of JavaScript. It was developed by Microsoft and is designed to make it easier to write and maintain large-scale JavaScript applications. TypeScript adds features such as static typing, classes, interfaces, and modules to JavaScript, which can help catch errors at compile-time rather than at runtime. It also provides better tooling and IDE support, making it easier to write and debug code. TypeScript code is compiled into JavaScript code that can run in any browser or JavaScript runtime."
                }
            }
        ],
        "usage": {
            "completion_tokens": 101,
            "prompt_tokens": 13,
            "total_tokens": 114
        }
    }
    ```

## Clean up resources

When you're done using your Azure OpenAI Service resource, [delete the resource](/azure/cognitive-services/openai/chatgpt-quickstart#clean-up-resources).

## Resources

* Tutorial sample code:
    * [`CLI`](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/cli-openai): conversation loop
    * [`LIB`](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/lib): OpenAI library
        * [OpenAIConversationClient class](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/lib-openai/src/index.ts)
* [Azure OpenAI documentation](/azure/cognitive-services/openai/)
* [Azure OpenAI Samples](https://github.com/Azure-Samples/openai)
* [AZURE SDK for JavaScript samples](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples)

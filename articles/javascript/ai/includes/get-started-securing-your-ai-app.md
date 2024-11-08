---
ms.custom: devx-track-js, devx-track-ts, 
ms.topic: include
ms.date: 08/09/2022
# Used as part of /developer/ai/get-started-securing-your-ai-app
---

While OpenAI and Azure OpenAI Service rely on a [openai](https://www.npmjs.com/package/openai) (common JavaScript client library), small code changes are needed when using Azure OpenAI endpoints. Let's see how this sample configures keyless authentication with Microsoft Entra ID and communicates with Azure OpenAI.

### Keyless authentication for each environment

The Azure Identity client library provides credential classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/identity/tokencredential) protocol. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together using [`ChainedTokenCredential`](/javascript/api/%40azure/identity/chainedtokencredential) to form an ordered sequence of authentication mechanisms to be attempted. This allows you to deploy the same code in both production and local development environments.

:::image type="content" source="./chained-token-credential.svg" alt-text="Diagram showing the two credentials in the flow where the managed identity is tried first then the default Azure credential is tried.":::

### Configure authentication with managed identity

In this sample, the `./src/azure-authentication.ts` provides several functions to provide keyless authentication to Azure OpenAI.

The first function, `getChainedCredential()`, returns the first valid Azure credential found in the chain. 

```typescript
function getChainedCredential() {

    return new ChainedTokenCredential(
        new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID!), 
        new DefaultAzureCredential({
            tenantId: process.env.AZURE_TENANT_ID ? process.env.AZURE_TENANT_ID : undefined
          })
    );
}
```
* [ManagedIdentityCredential](/javascript/api/@azure/identity/managedidentitycredential) is attempted first. It's set up with the AZURE_CLIENT_ID environment variable in the production runtime and is capable of authenticating via user-assigned managed identity.
* [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) is attempted second. It's set up when a develop signs in with Azure CLI `az login`.

>[!TIP]
>The order of the credentials is important, as the first valid Microsoft Entra access token is used. For more information, check out the [ChainedTokenCredential Overview](/javascript/api/@azure/identity/tokencredential) article.

### Get bearer token for OpenAI

The second function in `./src/azure-authentication.ts` is `getTokenProvider()`, which returns a callback that provides a bearer token scoped to the **Azure Cognitive Services** endpoint.

```typescript
function getTokenProvider(): () => Promise<string> {
    const credential  = getChainedCredential();
    const scope = "https://cognitiveservices.azure.com/.default";
    return getBearerTokenProvider(credential, scope);
}
```

The preceding code snippet uses [`getBearerTokenProvider`](/javascript/api/@azure/identity) to take the credential and the scope, then returns a callback that provides a bearer token. 

### Create authenticated Azure OpenAI client object

The third function in `./src/azure-authentication.ts` is `getOpenAiClient()`, which returns the Azure OpenAI client. 

```typescript
export function getOpenAiClient(): AzureOpenAI | undefined{
    try {

        if (!process.env.AZURE_OPENAI_ENDPOINT!) {
            throw new Error("AZURE_OPENAI_ENDPOINT is required for Azure OpenAI");
        }
        if (!process.env.AZURE_OPENAI_CHAT_DEPLOYMENT!) {
            throw new Error("AZURE_OPENAI_CHAT_DEPLOYMENT is required for Azure OpenAI");
        }

        const options = { 
            azureADTokenProvider: getTokenProvider(), 
            deployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT!, 
            apiVersion: process.env.AZURE_OPENAI_API_VERSION! || "2024-02-15-preview",
            endpoint: process.env.AZURE_OPENAI_ENDPOINT!
        }

        // Create the Asynchronous Azure OpenAI client
        return new AzureOpenAI (options);

    } catch (error) {
        console.error('Error getting Azure OpenAI client: ', error);
    }
}
```

This code takes the options, including the correctly scoped token, and creates the [`AzureOpenAI`] client

## Stream chat answer with Azure OpenAI 

Use the following Fastify route handler in `./src/openai-chat-api.ts` to send a message to Azure OpenAI and stream the response. 

```typescript
import { FastifyReply, FastifyRequest } from 'fastify';
import { AzureOpenAI } from "openai";
import { getOpenAiClient } from './azure-authentication.js';
import { ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatRequestBody {
    messages: ChatCompletionMessageParam [];
  }

export async function chatRoute (request: FastifyRequest<{ Body: ChatRequestBody }>, reply: FastifyReply) {

    const requestMessages: ChatCompletionMessageParam[] = request?.body?.messages;
    const openaiClient: AzureOpenAI | undefined = getOpenAiClient();

    if (!openaiClient) {
      throw new Error("Azure OpenAI client is not configured");
    }

    const allMessages = [
      { role: "system", content: "You are a helpful assistant.", name: '' },
      ...requestMessages
    ] as ChatCompletionMessageParam [];

    const chatCompletionChunks = await openaiClient.chat.completions.create({
      // Azure Open AI takes the deployment name as the model name
      model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_MODEL || "gpt-4o-mini",
      messages: allMessages,
      stream: true

    })
    reply.raw.setHeader('Content-Type', 'text/html; charset=utf-8');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.flushHeaders();

    for await (const chunk of chatCompletionChunks as AsyncIterable<ChatCompletionChunk>) {
      for (const choice of chunk.choices) {
        reply.raw.write(JSON.stringify(choice) + "\n")
      }
    }

    reply.raw.end()

}
```

The function gets the chat conversation, including any previous messages, and sends them to Azure OpenAI. As the stream chunks are returned from Azure OpenAI, the are sent to the client. 
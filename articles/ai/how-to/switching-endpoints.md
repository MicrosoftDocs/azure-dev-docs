---
title: "How to switch between OpenAI and Azure OpenAI endpoints"
description: "Learn how to switch between OpenAI and Azure OpenAI endpoints in your application."
ms.date: 10/07/2025
ms.topic: how-to 
ms.subservice: intelligent-apps
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages-python-dotnet
---
# How to switch between OpenAI and Azure OpenAI endpoints

This article shows you how to switch to the new unified OpenAI v1 chat completion endpoint. It covers the common changes and differences when you work with OpenAI and Azure OpenAI.

:::zone pivot="python"
While OpenAI and Azure OpenAI rely on a [common Python client library](https://github.com/openai/openai-python), there were small changes you needed to make to your code in order to swap back and forth between the endpoints. The new unified OpenAI v1 chat completion endpoint eliminates the need for separate Azure-specific code paths.
:::zone-end
:::zone pivot="dotnet"
:::zone-end

## Authentication

We recommend using Microsoft Entra ID or Azure Key Vault. You can use environment variables for testing outside of your production environment.

### API key authentication

:::zone pivot="python"

#### [OpenAI](#tab/openai)

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

```

#### [Azure OpenAI](#tab/azure-openai)

```python
import os
from openai import OpenAI
    
client = OpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    base_url = "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"
)
```

---

### Microsoft Entra ID authentication

Use the following steps to configure Microsoft Entra ID authentication with `DefaultAzureCredential`:

1. Set the environment variable `AZURE_TOKEN_CREDENTIALS` to the following values depending on your environment:

    - In production: `ManagedIdentityCredential`
    - In local development: `dev`

    For more information, see [Exclude a credential type category](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#exclude-a-credential-type-category).

    > [!IMPORTANT]
    > For this sample, set `AZURE_TOKEN_CREDENTIALS` to `dev`. Using `require_envvar=True` in the `DefaultAzureCredential` constructor will throw an exception if the environment variable is not set.

2. Set the appropriate Azure Role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

> [!NOTE]
> Microsoft Entra authentication is only supported in the Azure OpenAI library.

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

credential = DefaultAzureCredential(require_envvar=True)

token_provider = get_bearer_token_provider(
    credential, "https://cognitiveservices.azure.com/.default"
)

client = OpenAI(
    base_url = "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/", 
    api_key = token_provider,
)
```

:::zone-end
:::zone pivot="dotnet"

#### [OpenAI](#tab/openai)

> [!NOTE]
> Use `ApiKeyCredential` for API key authentication. For more information, [ApiKeyCredential](/dotnet/api/system.clientmodel.apikeycredential?view=azure-dotnet) reference.

```csharp
using OpenAI;
using System;
using System.ClientModel;

string apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
OpenAIClient openAIClient = new(new ApiKeyCredential(apiKey));

```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
using OpenAI;
using System;
using System.ClientModel;

OpenAIClientOptions clientOptions = new()
{
    Endpoint = new Uri("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/")
};

string apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");

OpenAIClient client = new(
    credential: new ApiKeyCredential(apiKey),
    options: clientOptions);

```

---

### Microsoft Entra ID authentication

Use the following steps to configure Microsoft Entra ID authentication with `DefaultAzureCredential`:

1. Set the environment variable `AZURE_TOKEN_CREDENTIALS` to the following values depending on your environment:

    - In production: `ManagedIdentityCredential`
    - In local development: `dev`

    For more information, see [Exclude a credential type category](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac#exclude-a-credential-type-category).

    > [!IMPORTANT]
    > For this sample, set environment variable `AZURE_TOKEN_CREDENTIALS` to `dev`. Passing `DefaultAzureCredential.DefaultEnvironmentVariableName` to the `DefaultAzureCredential` constructor will throw an exception if the environment variable is not set.

2. Set the appropriate Azure Role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

> [!NOTE]
> Microsoft Entra authentication is only supported in the Azure OpenAI library.

```csharp
using Azure.Identity;
using OpenAI;
using System;
using System.ClientModel.Primitives;

DefaultAzureCredential credential = new(DefaultAzureCredential.DefaultEnvironmentVariableName);

BearerTokenPolicy tokenPolicy = new(
    tokenProvider: credential,
    scope: "https://cognitiveservices.azure.com/.default");

OpenAIClientOptions clientOptions = new()
{
    Endpoint = new Uri("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/")
};


OpenAIClient client = new(
    authenticationPolicy: tokenPolicy,
    options: clientOptions);

```

:::zone-end

## Keyword argument for model

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

:::zone pivot="python"

#### [OpenAI](#tab/openai)

```python
response = client.responses.create(   
    model="gpt-4.1-nano", # Replace with your model deployment name 
    input="This is a test."
)

chat_completion = client.chat.completions.create(
    model="gpt-4o",
    messages="<messages>"
)

embedding = client.embeddings.create(
    model="text-embedding-3-large",
    input="<input>"
)
```

#### [Azure OpenAI](#tab/azure-openai)

```python
response = client.responses.create(   
    model="gpt-4.1-nano", # Replace with your model deployment name 
    input="This is a test."
)

chat_completion = client.chat.completions.create(
    model="gpt-4o", # model = "deployment_name".
    messages="<messages>"
)

embedding = client.embeddings.create(
    model="text-embedding-3-large", # model = "deployment_name".
    input="<input>"
)
```

---

:::zone-end
:::zone pivot="dotnet"

#### [OpenAI](#tab/openai)

```csharp
var response = client.GetOpenAIResponseClient(
    model: "gpt-4.1-nano" 
).CreateResponse(
    new ResponseItem[] { "This is a test." }
);

var chatCompletion = client.GetChatClient(
    model: "gpt-4o"
).CompleteChat(
    messages: new ChatMessage[] { 
        new SystemChatMessage("You are a helpful assistant.") 
    }
);

var embedding = client.GetEmbeddingClient(
    model: "text-embedding-3-large"
).GenerateEmbedding(
    input: new string[] { "<input>" }
);
```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
var response = client.GetOpenAIResponseClient(
    model: "gpt-4.1-nano" // Replace with your deployment name
).CreateResponse(
    new ResponseItem[] { "This is a test." }
);

var chatCompletion = client.GetChatClient(
    model: "gpt-4o" // Replace with your deployment name
).CompleteChat(
    messages: new ChatMessage[] { 
        new SystemChatMessage("You are a helpful assistant.") 
    }
);

var embedding = client.GetEmbeddingClient(
    model: "text-embedding-3-large" // Replace with your deployment name
).GenerateEmbedding(
    input: new string[] { "<input>" }
);
```

---

:::zone-end

## Azure OpenAI embeddings multiple input support

OpenAI and Azure OpenAI currently support input arrays up to 2,048 input items for `text-embedding-ada-002`. Both require the max input token limit per API request to remain under 8,191 for this model.

:::zone pivot="python"

#### [OpenAI](#tab/openai)

```python
inputs = ["A", "B", "C"] 

embedding = client.embeddings.create(
    input=inputs,
    model="text-embedding-3-large"
)


```

#### [Azure OpenAI](#tab/azure-openai)

```python
inputs = ["A", "B", "C"] #max array size=2048

embedding = client.embeddings.create(
    input=inputs,
    model="text-embedding-3-large" # This must match the custom deployment name you chose for your model.
    # engine="text-embedding-ada-002"
)

```

---

:::zone-end
:::zone pivot="dotnet"

#### [OpenAI](#tab/openai)

```csharp
var inputs = new string[] { "A", "B", "C" };

var embedding = client.GetEmbeddingClient(
    model: "text-embedding-3-large"
).GenerateEmbedding(
    input: inputs
);
```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
var inputs = new string[] { "A", "B", "C" }; //max array size=2048

var embedding = client.GetEmbeddingClient(
    model: "text-embedding-3-large"// This must match the custom deployment name you chose for your model.
    // engine:"text-embedding-ada-002"
).GenerateEmbedding(
    input: inputs
);
```

---

:::zone-end

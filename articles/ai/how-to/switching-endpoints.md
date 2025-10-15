---
title: "How to switch between OpenAI and Azure OpenAI endpoints"
description: "Learn how to switch between OpenAI and Azure OpenAI endpoints in your application."
ms.date: 10/15/2025
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

We recommend keyless authentication using Microsoft Entra ID. If that's not possible, use an API key and store it in Azure Key Vault. You can use an environment variable for testing outside of your Azure environments.

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
    base_url="https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"
)
```

---

### Microsoft Entra authentication

Microsoft Entra authentication is only supported with Azure OpenAI resources. Complete the following steps:

1. Install the Azure Identity client library:

    ```
    pip install azure-identity
    ```

1. Define an environment variable named `AZURE_TOKEN_CREDENTIALS`, and set it according to the environment in which the code is running:

    - In Azure, set it to `ManagedIdentityCredential`.
    - In local development, set it to `dev`.

    This environment variable will be read by the Azure Identity library's `DefaultAzureCredential`. For more information, see [Exclude a credential type category](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#exclude-a-credential-type-category).

1. Configure the OpenAI client object as follows:

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

1. Set the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

:::zone-end
:::zone pivot="dotnet"

#### [OpenAI](#tab/openai)

```csharp
using OpenAI;
using System;
using System.ClientModel;

string apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
OpenAIClient client = new(new ApiKeyCredential(apiKey));
```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
using OpenAI;
using System;
using System.ClientModel;

// code omitted for brevity

OpenAIClientOptions clientOptions = new()
{
    Endpoint = new Uri($"{resourceEndpoint}/openai/v1/")
};

string apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
OpenAIClient client = new(new ApiKeyCredential(apiKey), clientOptions);
```

---

### Microsoft Entra authentication

Microsoft Entra authentication is only supported with Azure OpenAI resources. Complete the following steps:

1. Install the Azure Identity client library:

    ```dotnetcli
    dotnet add package Azure.Identity
    ```

1. Define an environment variable named `AZURE_TOKEN_CREDENTIALS`, and set it according to the environment in which the code is running:

    - In Azure, set it to `ManagedIdentityCredential`.
    - In local development, set it to `dev`.

    This environment variable will be read by the Azure Identity library's `DefaultAzureCredential`. For more information, see [Exclude a credential type category](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac#exclude-a-credential-type-category).

1. Configure the `OpenAIClient` object as follows:

    ```csharp
    using Azure.Identity;
    using OpenAI;
    using System;
    using System.ClientModel.Primitives;
    
    // code omitted for brevity

    DefaultAzureCredential credential = new(DefaultAzureCredential.DefaultEnvironmentVariableName);
    BearerTokenPolicy tokenPolicy = new(credential, "https://cognitiveservices.azure.com/.default");
    
    OpenAIClientOptions clientOptions = new()
    {
        Endpoint = new Uri($"{resourceEndpoint}/openai/v1/")
    };
    
    OpenAIClient client = new(tokenPolicy, clientOptions);
    ```

1. Set the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

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

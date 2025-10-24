---
title: "How to switch between OpenAI and Azure OpenAI endpoints"
description: "Learn how to switch between OpenAI and Azure OpenAI endpoints in your application."
ms.date: 10/24/2025
ms.topic: how-to 
ms.subservice: intelligent-apps
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages
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

    ```python
    pip install azure-identity
    ```

1. Configure the OpenAI client object as follows:

    ```python
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
    from openai import OpenAI
    
    credential = DefaultAzureCredential()
    token_provider = get_bearer_token_provider(
        credential,
        "https://cognitiveservices.azure.com/.default"
    )
    
    client = OpenAI(
        base_url = "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/", 
        api_key = token_provider,
    )
    ```

    > [!TIP]
    > `DefaultAzureCredential` can be optimized for the environment in which your app will run. For more information, see [How to customize DefaultAzureCredential](/azure/developer/python/sdk/authentication/credential-chains#how-to-customize-defaultazurecredential).

1. Assign the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

    When running in Azure, assign roles to the managed identity used by the Azure host resource. When running in the local development environment, assign roles to the user running the app.

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

1. Configure the `OpenAIClient` object as follows:

    ```csharp
    using Azure.Identity;
    using OpenAI;
    using System;
    using System.ClientModel.Primitives;
    
    // code omitted for brevity

    DefaultAzureCredential credential = new();
    BearerTokenPolicy tokenPolicy = new(credential, "https://cognitiveservices.azure.com/.default");
    
    OpenAIClientOptions clientOptions = new()
    {
        Endpoint = new Uri($"{resourceEndpoint}/openai/v1/")
    };
    
    OpenAIClient client = new(tokenPolicy, clientOptions);
    ```

    > [!TIP]
    > `DefaultAzureCredential` can be optimized for the environment in which your app will run. For more information, see [How to customize DefaultAzureCredential](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac#how-to-customize-defaultazurecredential).

1. Assign the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

    When running in Azure, assign roles to the managed identity used by the Azure host resource. When running in the local development environment, assign roles to the user running the app.

:::zone-end
:::zone pivot="javascript"

#### [OpenAI](#tab/openai)

```javascript
import { OpenAI } from "openai";
import "dotenv/config";

const apiKey = process.env["OPENAI_API_KEY"];

if (!endpoint) {
  throw new Error("Please set the OPENAI_API_KEY environment variable.");
}

const client = new OpenAI({ apiKey });
```

#### [Azure OpenAI](#tab/azure-openai)

```javascript
import { OpenAI } from "openai";
import "dotenv/config";

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];

if (!endpoint) {
  throw new Error("Please set the AZURE_OPENAI_ENDPOINT environment variable.");
}

const apiKey = process.env["AZURE_OPENAI_API_KEY"];

if (!apiKey) {
  throw new Error("Please set the AZURE_OPENAI_API_KEY environment variable.");
}

const client = new OpenAI({ baseURL: endpoint + "/openai/v1", apiKey });
```

---

### Microsoft Entra authentication

Microsoft Entra authentication is only supported with Azure OpenAI resources. Complete the following steps:

1. Install the Azure Identity client library:

    ```javascript
    npm install @azure/identity
    ```

1. Configure the OpenAI client object as follows:

    ```javascript
    import { OpenAI } from "openai";
    import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
    import "dotenv/config";
    
    const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
    
    if (!endpoint) {
      throw new Error("Please set the AZURE_OPENAI_ENDPOINT environment variable.");
    }
    
    const scope = "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
    const client = new OpenAI({ baseURL: endpoint + "/openai/v1", apiKey: azureADTokenProvider });
    ```

    > [!TIP]
    > `DefaultAzureCredential` can be optimized for the environment in which your app will run. For more information, see [How to customize DefaultAzureCredential](/azure/developer/javascript/sdk/authentication/credential-chains#how-to-customize-defaultazurecredential).

1. Assign the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

    When running in Azure, assign roles to the managed identity used by the Azure host resource. When running in the local development environment, assign roles to the user running the app.

:::zone-end

:::zone pivot="java"

#### [OpenAI](#tab/openai)

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

public class OpenAISample {

    public static void main(String[] args) {
        OpenAIClient openAIClient = OpenAIOkHttpClient.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .build();
    }
}
```

#### [Azure OpenAI](#tab/azure-openai)

```java
import com.openai.azure.credential.AzureApiKeyCredential;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

public class AzureOpenAISample {

    public static void main(String[] args) {
        OpenAIClient azureOpenAIClient = OpenAIOkHttpClient.builder()
                .baseUrl(System.getenv("AZURE_OPENAI_ENDPOINT"))
                .credential(AzureApiKeyCredential.create(System.getenv("AZURE_OPENAI_API_KEY")))
                .build();
    }
}
```

---

### Microsoft Entra authentication

Microsoft Entra authentication is only supported with Azure OpenAI resources. Complete the following steps:

1. Include the [azure-identity](https://mvnrepository.com/artifact/com.azure/azure-identity) dependency in your project.

1. Configure the `OpenAIClient` object as follows:

    ```java
    import com.azure.identity.AuthenticationUtil;
    import com.azure.identity.DefaultAzureCredential;
    import com.azure.identity.DefaultAzureCredentialBuilder;
    import com.openai.client.OpenAIClient;
    import com.openai.client.okhttp.OpenAIOkHttpClient;
    import com.openai.credential.BearerTokenCredential;
    
    import java.util.function.Supplier;
    
    public class AzureOpenAISample {
    
        public static void main(String[] args) {
            DefaultAzureCredential tokenCredential = new DefaultAzureCredentialBuilder().build();
            Supplier<String> bearerTokenSupplier = AuthenticationUtil.getBearerTokenSupplier(
                    tokenCredential, "https://cognitiveservices.azure.com/.default");
            OpenAIClient azureOpenAIClient = OpenAIOkHttpClient.builder()
                    .fromEnv()
                    // Set the Azure Entra ID
                    .credential(BearerTokenCredential.create(bearerTokenSupplier))
                    .build();
        }
    }
    ```

    > [!TIP]
    > `DefaultAzureCredential` can be optimized for the environment in which your app will run. For more information, see [How to customize DefaultAzureCredential](/azure/developer/java/sdk/authentication/credential-chains#how-to-customize-defaultazurecredential).

1. Assign the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

    When running in Azure, assign roles to the managed identity used by the Azure host resource. When running in the local development environment, assign roles to the user running the app.

:::zone-end

:::zone pivot="golang"

#### [OpenAI](#tab/openai)

```go
// import (
//    "github.com/openai/openai-go/v3"
//    "github.com/openai/openai-go/v3/option"
// )

client := openai.NewClient(
    option.WithAPIKey(os.Getenv("OPENAI_API_KEY")),
)
```

#### [Azure OpenAI](#tab/azure-openai)

```go
// import (
//    "github.com/openai/openai-go/v3"
//    "github.com/openai/openai-go/v3/azure"
//    "github.com/openai/openai-go/v3/option"
// )

client := openai.NewClient(
    option.WithBaseURL("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"),
    azure.WithAPIKey(os.Getenv("AZURE_OPENAI_API_KEY")),
)
```

---

### Microsoft Entra authentication

Microsoft Entra authentication is only supported with Azure OpenAI resources. Complete the following steps:

1. Include the [azure-identity](https://mvnrepository.com/artifact/com.azure/azure-identity) dependency in your project.

1. Configure the `OpenAIClient` object as follows:

    ```go
    // import (
    //    "github.com/openai/openai-go/v3"
    //    "github.com/openai/openai-go/v3/azure"
    //    "github.com/openai/openai-go/v3/option"
    // )
    
    client := openai.NewClient(
        option.WithBaseURL("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"),
        azure.WithTokenCredential(cred),
    )
    ```

    > [!TIP]
    > `DefaultAzureCredential` can be optimized for the environment in which your app will run. For more information, see [How to customize DefaultAzureCredential](/azure/developer/go/sdk/authentication/credential-chains#how-to-customize-defaultazurecredential).

1. Assign the appropriate Azure role-based access control (RBAC) permissions. For more information, see [Azure role-based access control (RBAC)](/azure/ai-foundry/openai/how-to/role-based-access-control).

    When running in Azure, assign roles to the managed identity used by the Azure host resource. When running in the local development environment, assign roles to the user running the app.

:::zone-end

## Specify the model

:::zone pivot="python"

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

#### [OpenAI](#tab/openai)

```python
response = client.responses.create(   
    model="gpt-4.1-nano", 
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

OpenAI uses the `model` parameter to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

#### [OpenAI](#tab/openai)

```csharp
string modelName = "gpt-4.1-nano";
OpenAIResponseClient response = client.GetOpenAIResponseClient(modelName);

modelName = "gpt-4o";
ChatClient chatCompletion = client.GetChatClient(modelName);

modelName = "text-embedding-3-large";
EmbeddingClient embedding = client.GetEmbeddingClient(modelName);
```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
string deploymentName = "my-gpt-4.1-nano-deployment";
OpenAIResponseClient response = client.GetOpenAIResponseClient(deploymentName);

deploymentName = "my-gpt-4o-deployment";
ChatClient chatCompletion = client.GetChatClient(deploymentName);

deploymentName = "my-text-embedding-3-large-deployment";
EmbeddingClient embedding = client.GetEmbeddingClient(deploymentName);
```

---

:::zone-end

:::zone pivot="javascript"

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

#### [OpenAI](#tab/openai)

```javascript
const response = await client.responses.create({
  model: "gpt-4.1-nano",
  input: "This is a test",
});

const chatCompletions = await client.chat.completions.create({
  model: "gpt-4o",
  messages: ["<messages>"],
});

const embeddings = await client.embeddings.create({
  model: "text-embedding-3-large",
  input: "<input>",
});
```

#### [Azure OpenAI](#tab/azure-openai)

```javascript
const response = await client.responses.create({
  model: "gpt-4.1-nano", // Replace with your model deployment name 
  input: "This is a test",
});

const chatCompletions = await client.chat.completions.create({
  model: "gpt-4o", // Replace with your model deployment name 
  messages: ["<messages>"],
});

const embeddings = await client.embeddings.create({
  model: "text-embedding-3-large", // Replace with your model deployment name
  input: "<input>",
});
```

---
:::zone-end

:::zone pivot="java"

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

#### [OpenAI](#tab/openai)

```java
ResponseCreateParams responseCreateParams = ResponseCreateParams.builder()
        .input("This is a test")
        .model(ChatModel.GPT_4_1_NANO)
        .build();

Response response = client.responses().create(responseCreateParams);

ChatCompletionCreateParams chatCompletionCreateParams = ChatCompletionCreateParams.builder()
        .model(ChatModel.GPT_4O)
        .addUserMessage("<message>")
        .build();

ChatCompletion chatCompletion = client.chat().completions().create(chatCompletionCreateParams);

EmbeddingCreateParams embeddingCreateParams = EmbeddingCreateParams.builder()
        .input("<input>")
        .model(EmbeddingModel.TEXT_EMBEDDING_3_LARGE)
        .build();

CreateEmbeddingResponse createEmbeddingResponse = client.embeddings().create(embeddingCreateParams);
```

#### [Azure OpenAI](#tab/azure-openai)

```java
ResponseCreateParams responseCreateParams = ResponseCreateParams.builder()
        .input("This is a test")
        .model(ChatModel.GPT_4_1_NANO) // Replace with your model deployment name 
        .build();

Response response = client.responses().create(responseCreateParams);

ChatCompletionCreateParams chatCompletionCreateParams = ChatCompletionCreateParams.builder()
        .model(ChatModel.GPT_4O) // Replace with your model deployment name
        .addUserMessage("<message>")
        .build();

ChatCompletion chatCompletion = client.chat().completions().create(chatCompletionCreateParams);

EmbeddingCreateParams embeddingCreateParams = EmbeddingCreateParams.builder()
        .input("<input>")
        .model(EmbeddingModel.TEXT_EMBEDDING_3_LARGE) // Replace with your model deployment name
        .build();

CreateEmbeddingResponse createEmbeddingResponse = client.embeddings().create(embeddingCreateParams);
```

---

:::zone-end

:::zone pivot="golang"

OpenAI uses the `Model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](/azure/ai-foundry/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `Model` should refer to the underlying deployment name you chose when you deployed the model.

> [!IMPORTANT]
> Azure OpenAI and OpenAI handle model names differently in API calls. OpenAI only needs the model name. Azure OpenAI always needs the deployment name, even when you use the model parameter. You must use the deployment name instead of the model name when you call Azure OpenAI APIs. Our documentation often shows deployment names that match model names to show which model works with each API endpoint. Choose any naming convention for deployment names that works best for you.

#### [OpenAI](#tab/openai)

```go
resp, err := client.Responses.New(context.TODO(), responses.ResponseNewParams{
    Model: "gpt-4.1-nano", 
    Input: responses.ResponseNewParamsInputUnion{
        OfString: openai.String("This is a test."),
    },
})

resp, err := client.Chat.Completions.New(context.TODO(), openai.ChatCompletionNewParams{
    Model: "gpt-4o", 
    Messages: []openai.ChatCompletionMessageParamUnion{
        // messages
    },
})

resp, err := client.Embeddings.New(context.TODO(), openai.EmbeddingNewParams{
    Model: "text-embedding-3-large", 
    Input: openai.EmbeddingNewParamsInputUnion{
        OfString: openai.String("<input>"),
    },
})
```

#### [Azure OpenAI](#tab/azure-openai)

```go
resp, err := client.Responses.New(context.TODO(), responses.ResponseNewParams{
    Model: "gpt-4.1-nano", // Replace with your model deployment name
    Input: responses.ResponseNewParamsInputUnion{
        OfString: openai.String("This is a test."),
    },
})

resp, err := client.Chat.Completions.New(context.TODO(), openai.ChatCompletionNewParams{
    Model: "gpt-4o", // Model = "deployment_name"
    Messages: []openai.ChatCompletionMessageParamUnion{
        // messages
    },
})

resp, err := client.Embeddings.New(context.TODO(), openai.EmbeddingNewParams{
    Model: "text-embedding-3-large", // Model = "deployment_name"
    Input: openai.EmbeddingNewParamsInputUnion{
        OfString: openai.String("<input>"),
    },
})
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
    model="my-text-embedding-3-large-deployment" # This must match the custom deployment name you chose for your model.
    # engine="text-embedding-ada-002"
)
```

---

:::zone-end
:::zone pivot="dotnet"

#### [OpenAI](#tab/openai)

```csharp
string[] inputs = [ "A", "B", "C" ];

EmbeddingClient embedding = client.GetEmbeddingClient(
    model: "text-embedding-3-large"
).GenerateEmbedding(
    input: inputs
);
```

#### [Azure OpenAI](#tab/azure-openai)

```csharp
string[] inputs = [ "A", "B", "C" ]; //max array size=2048

EmbeddingClient embedding = client.GetEmbeddingClient(
    model: "my-text-embedding-3-large-deployment" // This must match the custom deployment name you chose for your model.
    // engine:"text-embedding-ada-002"
).GenerateEmbedding(
    input: inputs
);
```

---

:::zone-end

:::zone pivot="javascript"

#### [OpenAI](#tab/openai)

```javascript
const embeddings = await client.embeddings.create({
    model: "text-embedding-3-large",
    inputs: ["A", "B", "C"],
})
```

#### [Azure OpenAI](#tab/azure-openai)

```javascript
const embeddings = await client.embeddings.create({
    model: "text-embedding-3-large",
    inputs: ["A", "B", "C"],
})
```

---

:::zone-end

:::zone pivot="java"

#### [OpenAI](#tab/openai)

```java
EmbeddingCreateParams embeddingCreateParams = EmbeddingCreateParams.builder()
        .inputOfArrayOfStrings(List.of("A", "B", "C"))
        .model(EmbeddingModel.TEXT_EMBEDDING_3_LARGE)
        .build();

CreateEmbeddingResponse createEmbeddingResponse = client.embeddings().create(embeddingCreateParams);
```

#### [Azure OpenAI](#tab/azure-openai)

```java
EmbeddingCreateParams embeddingCreateParams = EmbeddingCreateParams.builder()
        .inputOfArrayOfStrings(List.of("A", "B", "C"))
        .model(EmbeddingModel.TEXT_EMBEDDING_3_LARGE)
        .build();

CreateEmbeddingResponse createEmbeddingResponse = client.embeddings().create(embeddingCreateParams);
```

---

:::zone-end

:::zone pivot="golang"

#### [OpenAI](#tab/openai)

```go
resp, err := client.Embeddings.New(context.TODO(), openai.EmbeddingNewParams{
    Model: "text-embedding-3-large",
    Input: openai.EmbeddingNewParamsInputUnion{
        OfArrayOfStrings: []string{"A", "B", "C"},
    },
})
```

#### [Azure OpenAI](#tab/azure-openai)

```go
resp, err := client.Embeddings.New(context.TODO(), openai.EmbeddingNewParams{
    Model: "text-embedding-3-large",
    Input: openai.EmbeddingNewParamsInputUnion{
        OfArrayOfStrings: []string{"A", "B", "C"},
    },
})
```

---

:::zone-end

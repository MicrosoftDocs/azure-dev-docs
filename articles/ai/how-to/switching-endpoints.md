---
title: "How to switch between OpenAI and Azure OpenAI endpoints"
description: "Learn how to switch between OpenAI and Azure OpenAI endpoints in your application."
ms.date: 10/03/2025
ms.topic: how-to 
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages-python-dotnet
---
# How to switch between OpenAI and Azure OpenAI endpoints

This article walks you through how to make the switch to the new unified OpenAI v1 chat completion endpoint, highlighting the common changes and differences you'll experience when working across OpenAI and Azure OpenAI.

:::zone pivot="python"
While OpenAI and Azure OpenAI rely on a [common Python client library](https://github.com/openai/openai-python), there were small changes you needed to make to your code in order to swap back and forth between the endpoints. The new unified OpenAI v1 chat completion endpoint eliminates the need for separate Azure-specific code paths.
:::zone-end
:::zone pivot="dotnet"
:::zone-end

## Authentication

We recommend using Microsoft Entra ID or Azure Key Vault. You can use environment variables for testing outside of your production environment.

### API key
:::zone pivot="python"
<table>
<tr>
<td> Azure OpenAI </td> <td> Azure OpenAI using OpenAI v1 endpoint</td>
</tr>
<tr>
<td>

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)



```

</td>
<td>

```python
import os
from openai import OpenAI
    
client = OpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    base_url = "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"
)
```

</td>
</tr>
</table>

<a name='azure-active-directory-authentication'></a>

### Microsoft Entra ID authentication

<table>
<tr>
<td> Azure OpenAI </td> <td> Azure OpenAI using OpenAI v1 endpoint</td>
</tr>
<tr>
<td>

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)








```

</td>
<td>

</td>
</tr>
</table>

:::zone-end
:::zone pivot="dotnet"
<table>
<tr>
<td> Azure OpenAI </td> <td> Azure OpenAI using OpenAI v1 endpoint</td>
</tr>
<tr>
<td>

```csharp
using System;
using OpenAI;

var client = new OpenAIClient(
    new OpenAIClientOptions
    {
        ApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    }
);

```

</td>
<td>

```csharp
using System;
using OpenAI;

var client = new OpenAIClient(
    new OpenAIClientOptions
    {
        ApiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY"),
        BaseUri = new Uri("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/")
    }
);

```
<a name='azure-active-directory-authentication'></a>

### Microsoft Entra ID authentication

<table>
<tr>
<td> AzureOpenAI </td> <td> Azure OpenAI usingOpenAI v1 endpoint</td>
</tr>
<tr>
<td>

```csharp
using System;
using OpenAI;

var client = new OpenAIClient(
    new OpenAIClientOptions
    {
        ApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    }
);

```
</td>
<td>

```csharp
using System;
using Azure.Identity;
using OpenAI;

var credential = new DefaultAzureCredential();

var client = new OpenAIClient(
    new OpenAIClientOptions
    {
        Credential = credential,
        BaseUri = new Uri("https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/")
    }
);

```
</td>
</tr>
</table>

:::zone-end

## Keyword argument for model

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of unique model [deployments](create-resource.md?pivots=web-portal#deploy-a-model). When you use Azure OpenAI, `model` should refer to the underlying deployment name you chose when you deployed the model.

      > [!IMPORTANT]
      > When you access the model via the API in Azure OpenAI, you need to refer to the deployment name rather than the underlying model name in API calls, which is one of the [key differences](../how-to/switching-endpoints.yml) between OpenAI and Azure OpenAI. OpenAI only requires the model name. Azure OpenAI always requires deployment name, even when using the model parameter. In our docs, we often have examples where deployment names are represented as identical to model names to help indicate which model works with a particular API endpoint. Ultimately your deployment names can follow whatever naming convention is best for your use case.

:::zone pivot="python"
<table>
    <tr>
    <td> OpenAI </td> <td> Azure OpenAI </td>
    </tr>
    <tr>
    <td>

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

    </td>
    <td>

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

    </td>
    </tr>
    </table>
:::zone-end
:::zone pivot="dotnet"
:::zone-end

## Azure OpenAI embeddings multiple input support

OpenAI and Azure OpenAI currently support input arrays up to 2,048 input items for `text-embedding-ada-002`. Both require the max input token limit per API request to remain under 8,191 for this model.

:::zone pivot="python"
<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
inputs = ["A", "B", "C"] 

embedding = client.embeddings.create(
    input=inputs,
    model="text-embedding-3-large"
)


```

</td>
<td>

```python
inputs = ["A", "B", "C"] #max array size=2048

embedding = client.embeddings.create(
    input=inputs,
    model="text-embedding-3-large" # This must match the custom deployment name you chose for your model.
    # engine="text-embedding-ada-002"
)

```

</td>
</tr>
</table>
:::zone-end
:::zone pivot="dotnet"
:::zone-end

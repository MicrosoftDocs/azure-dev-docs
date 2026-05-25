---
title: "Get started with Azure OpenAI and the Responses API"
description: "Use the Azure OpenAI Starter Kit to deploy GPT-5-mini and run a hello world app with Microsoft Entra ID authentication."
ms.date: 05/25/2026
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, keyless-python, devx-track-js, keyless-javascript, devx-track-dotnet, keyless-dotnet, devx-track-go, keyless-go, devx-track-extended-java, keyless-java
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages
# CustomerIntent: As an app developer, I want to deploy Azure OpenAI and call the Responses API from a small app using Microsoft Entra ID so that I can get my first AI app working quickly without API keys.
---

# Get started with Azure OpenAI and the Responses API

This article shows you how to use the [Azure OpenAI Starter Kit](https://github.com/Azure-Samples/azure-openai-starter) to deploy an Azure OpenAI resource and run a small hello world app. The app uses Microsoft Entra ID authentication and the OpenAI SDK to call the Azure OpenAI [Responses API](/azure/ai-services/openai/how-to/responses).

By the end of this article, you will:

- Deploy Azure OpenAI with GPT-5-mini by using the Azure Developer CLI.
- Run a local app that authenticates with Microsoft Entra ID instead of an API key.
- Send one request to the Responses API and print the model output.

> [!NOTE]
> This article uses the Azure OpenAI Starter Kit as the basis for the examples. The starter kit includes Infrastructure as Code, Azure Developer CLI configuration, and client examples for multiple programming languages.

## Cost

Azure resources created in this article are billed to your Azure subscription. To avoid ongoing charges, clean up the resources when you finish the article.

## Prerequisites

To complete this article, you need:

- An Azure subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permissions to create Azure resources and role assignments in the subscription, such as [Owner](/azure/role-based-access-control/built-in-roles#owner) or [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator).
- [Git](https://git-scm.com/).
- [Azure CLI](/cli/azure/install-azure-cli).
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

:::zone pivot="python"

- Python 3.8 or later.

:::zone-end

:::zone pivot="dotnet"

- .NET SDK 10 or later. The starter kit uses file-based C# apps with package directives.

:::zone-end

:::zone pivot="javascript"

- Node.js 18 or later.

:::zone-end

:::zone pivot="golang"

- Go 1.25.1 or later.

:::zone-end

:::zone pivot="java"

- Java 21 or later.
- Maven 3.9 or later.

:::zone-end

## Get the starter kit

Clone the Azure OpenAI Starter Kit repository and open the project folder.

```bash
git clone https://github.com/Azure-Samples/azure-openai-starter.git
cd azure-openai-starter
```

## Sign in to Azure

Sign in with both the Azure CLI and the Azure Developer CLI.

```azurecli
az login
azd auth login
```

If your account has access to more than one tenant, confirm that the active tenant is the tenant where you want to deploy the resources.

```azurecli
az account show --query tenantId -o tsv
```

## Deploy Azure OpenAI

Run the following Azure Developer CLI command from the repository root:

```azdeveloper
azd up
```

Use the following guidance to answer the prompts:

| Prompt | Answer |
| --- | --- |
| Environment name | Use a short, lowercase name, such as `aoai-hello`. The value is used in Azure resource names. |
| Subscription | Select the subscription where you want to create the resources. |
| Location | Select a region near you. |
| Azure OpenAI model location | Select a region where GPT-5-mini is available. |

Deployment usually takes several minutes. When the command completes, the starter kit has provisioned Azure OpenAI and deployed a GPT-5-mini model.

## Configure your local environment

The hello world app uses your Azure sign-in to get a Microsoft Entra access token. Set the endpoint used by the OpenAI client.

#### [Bash](#tab/bash)

```bash
export AZURE_OPENAI_ENDPOINT=$(azd env get-value AZURE_OPENAI_ENDPOINT)
export AZURE_OPENAI_DEPLOYMENT=$(azd env get-value AZURE_OPENAI_GPT_DEPLOYMENT_NAME)
export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)
```

#### [PowerShell](#tab/powershell)

```powershell
$env:AZURE_OPENAI_ENDPOINT = azd env get-value AZURE_OPENAI_ENDPOINT
$env:AZURE_OPENAI_DEPLOYMENT = azd env get-value AZURE_OPENAI_GPT_DEPLOYMENT_NAME
$env:AZURE_TENANT_ID = az account show --query tenantId -o tsv
```

---

> [!TIP]
> Azure OpenAI uses deployment names in API calls. The starter kit outputs the GPT-5-mini deployment name as `AZURE_OPENAI_GPT_DEPLOYMENT_NAME`. This article maps that value to `AZURE_OPENAI_DEPLOYMENT` so the code is the same across languages.

## Create and run the hello world app

:::zone pivot="python"

Create a file named `hello_world_entra.py` in the `src/python` folder.

```python
import os

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

endpoint = os.environ["AZURE_OPENAI_ENDPOINT"].rstrip("/")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5-mini")

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default",
)

client = OpenAI(
    base_url=f"{endpoint}/openai/v1/",
    api_key=token_provider,
)

response = client.responses.create(
    model=deployment,
    input="Say hello from Azure OpenAI in one sentence.",
    max_output_tokens=300,
)

print(response.output_text)
```

Install the Python dependencies and run the app.

```bash
cd src/python
python -m pip install -r requirements.txt
python hello_world_entra.py
```

:::zone-end

:::zone pivot="dotnet"

Create a file named `hello_world_entra.cs` in the `src/dotnet` folder.

```csharp
#!/usr/bin/dotnet run
#:package OpenAI@2.9.1
#:package Azure.Identity@1.*

using System;
using System.ClientModel.Primitives;
using Azure.Identity;
using OpenAI;
using OpenAI.Responses;

#pragma warning disable OPENAI001

string endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")
    ?? throw new InvalidOperationException("Set AZURE_OPENAI_ENDPOINT.");
string deployment = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT")
    ?? "gpt-5-mini";

BearerTokenPolicy tokenPolicy = new(
    new DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default");

OpenAIClientOptions options = new()
{
    Endpoint = new Uri($"{endpoint.TrimEnd('/')}/openai/v1/")
};

ResponsesClient client = new(tokenPolicy, options);

ResponseResult response = await client.CreateResponseAsync(
    deployment,
    "Say hello from Azure OpenAI in one sentence.",
    null);

Console.WriteLine(response.GetOutputText());
```

Run the app.

```dotnetcli
cd src/dotnet
dotnet run hello_world_entra.cs
```

:::zone-end

:::zone pivot="javascript"

Create a file named `hello_world_entra.ts` in the `src/typescript` folder.

```typescript
import OpenAI from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;

if (!endpoint) {
  throw new Error("Set AZURE_OPENAI_ENDPOINT.");
}

const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-5-mini";
const tokenProvider = getBearerTokenProvider(
  new DefaultAzureCredential(),
  "https://cognitiveservices.azure.com/.default"
);

const client = new OpenAI({
  baseURL: `${endpoint.replace(/\/+$/, "")}/openai/v1/`,
  apiKey: tokenProvider as any,
});

const response = await client.responses.create({
  model: deployment,
  input: "Say hello from Azure OpenAI in one sentence.",
  max_output_tokens: 300,
});

console.log(response.output_text);
```

Install the TypeScript dependencies and run the app.

```bash
cd src/typescript
npm install
npx tsx hello_world_entra.ts
```

:::zone-end

:::zone pivot="golang"

Create a file named `hello_world_entra.go` in the `src/go/responses_example_entra` folder.

```go
package main

import (
  "context"
  "fmt"
  "log"
  "net/http"
  "os"
  "strings"

  "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
  "github.com/Azure/azure-sdk-for-go/sdk/azcore/runtime"
  "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
  "github.com/openai/openai-go/v3"
  "github.com/openai/openai-go/v3/option"
  "github.com/openai/openai-go/v3/responses"
)

type policyAdapter option.MiddlewareNext

func (adapter policyAdapter) Do(req *policy.Request) (*http.Response, error) {
  return (option.MiddlewareNext)(adapter)(req.Raw())
}

func newClient(endpoint string) openai.Client {
  const scope = "https://cognitiveservices.azure.com/.default"

  credential, err := azidentity.NewDefaultAzureCredential(nil)
  if err != nil {
    log.Fatalf("Failed to create DefaultAzureCredential: %s", err)
  }

  bearerTokenPolicy := runtime.NewBearerTokenPolicy(
    credential,
    []string{scope},
    nil,
  )

  return openai.NewClient(
    option.WithBaseURL(strings.TrimRight(endpoint, "/")+"/openai/v1/"),
    option.WithMiddleware(func(req *http.Request, next option.MiddlewareNext) (*http.Response, error) {
      pipeline := runtime.NewPipeline(
        "aoai-hello-world",
        "",
        runtime.PipelineOptions{},
        &policy.ClientOptions{
          PerRetryPolicies: []policy.Policy{
            bearerTokenPolicy,
            policyAdapter(next),
          },
        },
      )

      pipelineRequest, err := runtime.NewRequestFromRequest(req)
      if err != nil {
        return nil, err
      }

      return pipeline.Do(pipelineRequest)
    }),
  )
}

func main() {
  endpoint := os.Getenv("AZURE_OPENAI_ENDPOINT")
  if endpoint == "" {
    log.Fatal("Set AZURE_OPENAI_ENDPOINT.")
  }

  deployment := os.Getenv("AZURE_OPENAI_DEPLOYMENT")
  if deployment == "" {
    deployment = "gpt-5-mini"
  }

  client := newClient(endpoint)

  response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
    Model: deployment,
    Input: responses.ResponseNewParamsInputUnion{
      OfString: openai.String("Say hello from Azure OpenAI in one sentence."),
    },
    MaxOutputTokens: openai.Int(300),
  })
  if err != nil {
    log.Fatalf("Failed to create response: %s", err)
  }

  fmt.Println(response.OutputText())
}
```

Run the app.

```bash
cd src/go/responses_example_entra
go run hello_world_entra.go
```

:::zone-end

:::zone pivot="java"

Create a file named `HelloWorldEntra.java` in the `src/java/src/main/java/com/azure/openai/starter` folder.

```java
package com.azure.openai.starter;

import com.azure.identity.AuthenticationUtil;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.credential.BearerTokenCredential;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

import java.util.function.Supplier;

public class HelloWorldEntra {

    public static void main(String[] args) {
        String endpoint = System.getenv("AZURE_OPENAI_ENDPOINT");
        if (endpoint == null || endpoint.isBlank()) {
            throw new IllegalStateException("Set AZURE_OPENAI_ENDPOINT.");
        }

        String deployment = System.getenv().getOrDefault(
                "AZURE_OPENAI_DEPLOYMENT",
                "gpt-5-mini");

        Supplier<String> bearerTokenSupplier = AuthenticationUtil.getBearerTokenSupplier(
                new DefaultAzureCredentialBuilder().build(),
                "https://cognitiveservices.azure.com/.default");

        OpenAIClient client = OpenAIOkHttpClient.builder()
                .baseUrl(endpoint.replaceAll("/+$", "") + "/openai/v1/")
                .credential(BearerTokenCredential.create(bearerTokenSupplier))
                .build();

        Response response = client.responses().create(
                ResponseCreateParams.builder()
                        .model(deployment)
                        .input(ResponseCreateParams.Input.ofText(
                                "Say hello from Azure OpenAI in one sentence."))
                        .maxOutputTokens(300)
                        .build());

        System.out.println(response.output());
    }
}
```

Run the app.

```bash
cd src/java
mvn compile exec:java -Dexec.mainClass="com.azure.openai.starter.HelloWorldEntra"
```

:::zone-end

The exact output format varies by SDK. You should see output from the deployed Azure OpenAI model that includes a short greeting.

```output
Hello from Azure OpenAI! I'm running on your Azure OpenAI deployment and ready to help.
```

## Understand the code

The hello world app has three important parts:

- `DefaultAzureCredential` gets a Microsoft Entra token from your local Azure sign-in.
- The OpenAI client points to your Azure OpenAI v1 endpoint: `/openai/v1/`.
- The `model` value is the Azure OpenAI deployment name. In this starter kit, the deployment name is `gpt-5-mini`.

:::zone pivot="python"

The Python app uses the `openai` package with `azure-identity`. The `get_bearer_token_provider` helper creates a token provider that the OpenAI client can use as its credential.

:::zone-end

:::zone pivot="dotnet"

The C# app uses the `OpenAI` package with `Azure.Identity`. The `BearerTokenPolicy` adds Microsoft Entra tokens to requests sent by the `ResponsesClient`.

:::zone-end

:::zone pivot="javascript"

The TypeScript app uses the `openai` package with `@azure/identity`. The `getBearerTokenProvider` helper creates a token provider that the OpenAI client can use as its credential.

:::zone-end

:::zone pivot="golang"

The Go app uses `azidentity.NewDefaultAzureCredential` with an Azure Core bearer token policy. The policy is added to the OpenAI client as middleware so requests use Microsoft Entra ID tokens.

:::zone-end

:::zone pivot="java"

The Java app uses `DefaultAzureCredentialBuilder` with `AuthenticationUtil.getBearerTokenSupplier`. The token supplier is passed to the OpenAI client by using `BearerTokenCredential`.

:::zone-end

## Run the starter kit sample

The starter kit also includes a larger Responses API example for each language.

:::zone pivot="python"

```bash
python responses_example_entra.py
```

:::zone-end

:::zone pivot="dotnet"

```dotnetcli
dotnet run responses_example_entra.cs
```

:::zone-end

:::zone pivot="javascript"

```bash
npx tsx responses_example_entra.ts
```

:::zone-end

:::zone pivot="golang"

```bash
go run main.go
```

:::zone-end

:::zone pivot="java"

```bash
mvn compile exec:java -Dexec.mainClass="com.azure.openai.starter.ResponsesExampleEntra"
```

:::zone-end

## Troubleshooting

| Issue | Try this |
| --- | --- |
| `azd up` fails because GPT-5-mini isn't available in the selected region. | Select a different Azure OpenAI model location when prompted, or set another region with `azd env set AZURE_LOCATION eastus2` and run `azd up` again. |
| `azd up` fails with a role assignment or authorization error. | Make sure your account can create resources and role assignments. Owner or User Access Administrator is usually required for this template. |
| The app returns `401` or `PermissionDenied`. | Confirm that you're signed in to the same tenant and subscription used by `azd up`. Run `az login`, `azd auth login`, and set `AZURE_TENANT_ID` to the tenant ID from `az account show`. Role assignment propagation can also take a few minutes. |
| `DefaultAzureCredential failed to retrieve a token`. | Confirm that Azure CLI is installed and authenticated with `az account show`. If you use multiple tenants, sign in to the correct tenant with `az login --tenant <tenant-id>`. |
| The app returns `model not found` or `deployment not found`. | Confirm that `AZURE_OPENAI_DEPLOYMENT` matches the Azure OpenAI deployment name. The starter kit default is `gpt-5-mini`. |
| The .NET app doesn't recognize package directives. | Install the .NET SDK version required by the starter kit. File-based C# apps with `#:package` require a recent .NET SDK. |
| The Go app can't find the module or dependencies. | Run the Go commands from `src/go/responses_example_entra`. Confirm that Go 1.25.1 or later is installed. |
| The Java app fails with a source or target version error. | Confirm that Java 21 or later is installed and selected by your terminal. |
| You need detailed deployment logs. | Run `azd up --debug`. |

You can inspect the current Azure Developer CLI environment values with:

```azdeveloper
azd env get-values
```

## Clean up resources

When you no longer need the resources, run the following command from the starter kit repository root:

```azdeveloper
azd down --purge
```

The command deletes the Azure resources created by the starter kit and helps stop ongoing charges.

## Get help

If you need help with the starter kit, use these resources:

- [Azure OpenAI Starter Kit repository](https://github.com/Azure-Samples/azure-openai-starter).
- [Azure OpenAI Starter Kit issues](https://github.com/Azure-Samples/azure-openai-starter/issues).
- [Azure OpenAI documentation](/azure/ai-services/openai/).
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/).
- [Azure OpenAI role-based access control](/azure/ai-foundry/openai/how-to/role-based-access-control).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Responses API](/azure/ai-services/openai/how-to/responses)

## Author notes: questions for the repo owner

The following questions are for this first-pass draft and should be removed before publication.

- What is the preferred setup path for docs readers: `git clone`, `azd init -t azure-openai-starter`, GitHub Codespaces, or another entry point?
- Which RBAC role does `azd up` assign to the signed-in user: `Cognitive Services OpenAI User`, `Cognitive Services User`, or another role?
- Should the article expose the repo's `AZURE_OPENAI_GPT_DEPLOYMENT_NAME` variable directly in each sample, or keep mapping it to the simpler doc-level `AZURE_OPENAI_DEPLOYMENT` variable?
- Does setting `AZURE_TENANT_ID` affect all five language samples when they use `DefaultAzureCredential`, or should the samples pass tenant options explicitly?
- Which exact runtime versions should the article list for Python, Node.js, .NET, Go, and Java?
- Should the TypeScript content use the `javascript` pivot from `intelligent-apps-languages`, or should a new Learn pivot group be created for TypeScript, Java, and Go together?
- Should the article include API key authentication as an alternative path, or should this getting-started article stay keyless only?
- If GPT-5-mini isn't available in a selected region, what region should the article recommend first?
- Should the .NET sample continue to use file-based C# apps with `#:package`, or should docs use a conventional `dotnet new console` flow?
- Should cleanup use `azd down --purge` or plain `azd down` for the official guidance?
- Should the article mention the starter kit's validation scripts, `validate.sh` and `validate.ps1`, in the happy path or only in troubleshooting?

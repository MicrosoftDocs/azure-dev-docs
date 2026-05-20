---
title: "Get started with Azure OpenAI and the Responses API"
description: "Use the Azure OpenAI Starter Kit to deploy GPT-5-mini and run a hello world app with Microsoft Entra ID authentication."
ms.date: 05/20/2026
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, keyless-python, devx-track-js, keyless-javascript, devx-track-dotnet, keyless-dotnet
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages-python-dotnet-typescript
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

:::zone pivot="typescript"

- Node.js 18 or later.

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
export AZURE_OPENAI_DEPLOYMENT=gpt-5-mini
export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)
```

#### [PowerShell](#tab/powershell)

```powershell
$env:AZURE_OPENAI_ENDPOINT = azd env get-value AZURE_OPENAI_ENDPOINT
$env:AZURE_OPENAI_DEPLOYMENT = "gpt-5-mini"
$env:AZURE_TENANT_ID = az account show --query tenantId -o tsv
```

---

> [!TIP]
> Azure OpenAI uses deployment names in API calls. This starter kit deploys GPT-5-mini with the deployment name `gpt-5-mini`. If you change the deployment name in the template, set `AZURE_OPENAI_DEPLOYMENT` to your deployment name.

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

:::zone pivot="typescript"

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

The output should be a short response from the deployed Azure OpenAI model.

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

:::zone pivot="typescript"

The TypeScript app uses the `openai` package with `@azure/identity`. The `getBearerTokenProvider` helper creates a token provider that the OpenAI client can use as its credential.

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

:::zone pivot="typescript"

```bash
npx tsx responses_example_entra.ts
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
- What deployment-name variable should the docs use: hardcoded `gpt-5-mini`, `AZURE_OPENAI_GPT_DEPLOYMENT_NAME`, `AZURE_OPENAI_CHAT_DEPLOYMENT`, or a new doc-level `AZURE_OPENAI_DEPLOYMENT` variable?
- Does setting `AZURE_TENANT_ID` affect all three language samples when they use `DefaultAzureCredential`, or should the samples pass tenant options explicitly?
- Which exact runtime versions should the article list for Python, Node.js, and .NET?
- Should the article include API key authentication as an alternative path, or should this getting-started article stay keyless only?
- If GPT-5-mini isn't available in a selected region, what region should the article recommend first?
- Should the .NET sample continue to use file-based C# apps with `#:package`, or should docs use a conventional `dotnet new console` flow?
- Should Go and Java be included in a later version of this article since the starter kit includes those examples?
- Should cleanup use `azd down --purge` or plain `azd down` for the official guidance?
- Should the article mention the starter kit's validation scripts, `validate.sh` and `validate.ps1`, in the happy path or only in troubleshooting?

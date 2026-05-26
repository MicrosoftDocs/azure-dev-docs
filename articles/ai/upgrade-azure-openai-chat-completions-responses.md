---
title: "Upgrade your Azure OpenAI app from Chat Completions to the Responses API"
description: "Learn how to upgrade an Azure OpenAI (AOAI) app from Chat Completions to the Responses API, then validate the migration with the Azure OpenAI Starter Kit."
keywords: AOAI, Azure OpenAI, Responses API, Chat Completions, migration
ms.date: 05/26/2026
ms.topic: how-to
ms.subservice: intelligent-apps
ms.custom: devx-track-python, keyless-python, devx-track-js, keyless-javascript, devx-track-dotnet, keyless-dotnet, devx-track-go, keyless-go, devx-track-extended-java, keyless-java
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages
# CustomerIntent: As an Azure OpenAI app developer, I want to upgrade an existing Chat Completions integration to the Responses API so that my app can use the newer API shape, reasoning improvements, and future model capabilities.
---

# Upgrade your Azure OpenAI app from Chat Completions to the Responses API

This article shows how to upgrade an Azure OpenAI (AOAI) app from the Chat Completions API to the [Responses API](/azure/ai-services/openai/how-to/responses). You use the [Azure OpenAI Starter Kit](https://github.com/Azure-Samples/azure-openai-starter) as a working reference environment so you can validate the upgraded API call in your preferred language before changing your production app.

By the end of this article, you will:

- Understand why the Responses API is the recommended path for new and upgraded generation flows.
- Deploy a small Azure OpenAI environment that you can use to test the Responses API.
- Compare the Chat Completions call pattern with the Responses call pattern.
- Run a working Responses API sample with Microsoft Entra ID authentication.

> [!IMPORTANT]
> The `src/...` folders used in this article come from the GitHub repository you clone in the first step. The `azd up` command provisions Azure resources and writes environment values; it doesn't create local source files.

## Why upgrade to the Responses API

The Responses API is the newer generation API shape for OpenAI-compatible model calls. Chat Completions remains supported, but Responses is designed to handle more of the patterns developers now build into AI apps.

Use the Responses API when you want to:

- Use a single API shape for simple text generation and more advanced app workflows.
- Improve support for reasoning models and future model capabilities.
- Represent model output as typed response items instead of only `choices[0].message`.
- Add agent-like tool use over time, including built-in or custom tools where supported.
- Improve cache utilization for repeated context, which can reduce cost in workloads that benefit from caching.
- Use stateful conversation patterns, such as chaining responses with previous response IDs, where your data and compliance requirements allow it.
- Use flexible inputs, including a string for simple prompts or a list of input items for richer interactions.

The Responses API also helps future-proof Microsoft AI apps. In addition to Azure OpenAI models, Microsoft Foundry supports Responses API calls for compatible Foundry Models, including Microsoft AI, DeepSeek, Grok from xAI, and Llama models from Meta. For more information, see [Generate text responses with Microsoft Foundry Models](/azure/foundry/foundry-models/how-to/generate-responses).

> [!NOTE]
> This article uses Azure OpenAI resources and the Azure OpenAI endpoint format. Microsoft Foundry project endpoints and token scopes are different. Use the Foundry Models article when you're targeting a Foundry project endpoint instead of an Azure OpenAI resource endpoint.

## Migration at a glance

For a simple text generation call, the migration is usually small. The most important change is that your app sends input to `responses.create` and reads output from the response object, rather than sending `messages` to `chat.completions.create` and reading from `choices`.

| Chat Completions | Responses API |
| --- | --- |
| `chat.completions.create(...)` | `responses.create(...)` |
| `messages: [{ role: "user", content: "..." }]` | `input: "..."` for simple text input |
| `choices[0].message.content` | `output_text`, `GetOutputText()`, `OutputText()`, or SDK-specific response output helpers |
| Manually manage prior messages | Use explicit input items, or use stateful Responses features where supported |
| `response_format` for structured outputs | `text.format` in the Responses API |
| Function definitions use Chat Completions shape | Tools and tool outputs are represented as typed response items |

> [!TIP]
> Azure OpenAI uses deployment names in API calls. The value you pass as `model` should be your Azure OpenAI deployment name, not just the model family name, unless you intentionally named the deployment the same as the model.

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

## Get the reference source code

Clone the Azure OpenAI Starter Kit repository and open the project folder.

```bash
git clone https://github.com/Azure-Samples/azure-openai-starter.git
cd azure-openai-starter
```

The source files you use later are in the cloned repository:

| Language | Starter kit folder |
| --- | --- |
| Python | `src/python` |
| C# | `src/dotnet` |
| TypeScript | `src/typescript` |
| Go | `src/go/responses_example_entra` |
| Java | `src/java` |

## Deploy Azure OpenAI for validation

Sign in with both the Azure CLI and the Azure Developer CLI.

```azurecli
az login
azd auth login
```

Run the following command from the repository root:

```azdeveloper
azd up
```

Use the following guidance to answer the prompts:

| Prompt | Answer |
| --- | --- |
| Environment name | Use a short, lowercase name, such as `aoai-upgrade`. The value is used in Azure resource names. |
| Subscription | Select the subscription where you want to create the resources. |
| Location | Select a region near you. |
| Azure OpenAI model location | Select a region where GPT-5-mini is available. |

Deployment usually takes several minutes. When the command completes, the starter kit has provisioned Azure OpenAI and deployed a GPT-5-mini model.

## Configure local environment values

Set the endpoint and deployment values that the samples use.

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

## Update the generation call

Use the following examples to identify the part of your existing app that changes when you move from Chat Completions to the Responses API.

:::zone pivot="python"

In a Chat Completions app, a simple generation call commonly looks like this:

```python
completion = client.chat.completions.create(
    model=deployment,
    messages=[
        {"role": "user", "content": "Say hello from Azure OpenAI."}
    ],
)

print(completion.choices[0].message.content)
```

With the Responses API, the same simple request becomes:

```python
response = client.responses.create(
    model=deployment,
    input="Say hello from Azure OpenAI.",
    max_output_tokens=300,
)

print(response.output_text)
```

The full starter kit sample also shows Microsoft Entra ID authentication by using `DefaultAzureCredential` and `get_bearer_token_provider`.

:::zone-end

:::zone pivot="dotnet"

In a Chat Completions app, a simple generation call commonly uses a `ChatClient`:

```csharp
ChatClient chatClient = azureOpenAIClient.GetChatClient(deployment);
ChatCompletion completion = await chatClient.CompleteChatAsync(
    [new UserChatMessage("Say hello from Azure OpenAI.")]);

Console.WriteLine(completion.Content[0].Text);
```

With the Responses API, the same simple request uses a Responses client:

```csharp
ResponsesClient responsesClient = new(tokenPolicy, options);

ResponseResult response = await responsesClient.CreateResponseAsync(
    deployment,
    "Say hello from Azure OpenAI.",
    null);

Console.WriteLine(response.GetOutputText());
```

The full starter kit sample also shows Microsoft Entra ID authentication by using `DefaultAzureCredential` and a bearer token policy.

:::zone-end

:::zone pivot="javascript"

In a Chat Completions app, a simple generation call commonly looks like this:

```typescript
const completion = await client.chat.completions.create({
  model: deployment,
  messages: [
    { role: "user", content: "Say hello from Azure OpenAI." },
  ],
});

console.log(completion.choices[0]?.message?.content);
```

With the Responses API, the same simple request becomes:

```typescript
const response = await client.responses.create({
  model: deployment,
  input: "Say hello from Azure OpenAI.",
  max_output_tokens: 300,
});

console.log(response.output_text);
```

The full starter kit sample also shows Microsoft Entra ID authentication by using `DefaultAzureCredential` and `getBearerTokenProvider`.

:::zone-end

:::zone pivot="golang"

In Go, the starter kit uses the OpenAI Go SDK with Azure Identity middleware. After your OpenAI client is configured for the Azure OpenAI endpoint and Microsoft Entra ID authentication, the Responses API call is:

```go
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: deployment,
	Input: responses.ResponseNewParamsInputUnion{
		OfString: openai.String("Say hello from Azure OpenAI."),
	},
	MaxOutputTokens: openai.Int(300),
})
if err != nil {
	log.Fatalf("Failed to create response: %s", err)
}

fmt.Println(response.OutputText())
```

The full starter kit sample includes the complete client setup, including `azidentity.NewDefaultAzureCredential` and an Azure Core bearer token policy.

:::zone-end

:::zone pivot="java"

In Java, the starter kit uses the OpenAI Java SDK with Azure Identity. After your OpenAI client is configured for the Azure OpenAI endpoint and Microsoft Entra ID authentication, the Responses API call is:

```java
Response response = client.responses().create(
        ResponseCreateParams.builder()
                .model(deployment)
                .input(ResponseCreateParams.Input.ofText(
                        "Say hello from Azure OpenAI."))
                .maxOutputTokens(300)
                .build());

System.out.println(response.output());
```

The full starter kit sample includes the complete client setup, including `DefaultAzureCredentialBuilder`, `AuthenticationUtil.getBearerTokenSupplier`, and `BearerTokenCredential`.

:::zone-end

## Run the upgraded sample

Use the starter kit sample for your language to validate that your endpoint, deployment name, authentication, and Responses API call all work before you port the pattern into your app.

:::zone pivot="python"

```bash
cd src/python
python -m pip install -r requirements.txt
python responses_example_entra.py
```

:::zone-end

:::zone pivot="dotnet"

```dotnetcli
cd src/dotnet
dotnet run responses_example_entra.cs
```

:::zone-end

:::zone pivot="javascript"

```bash
cd src/typescript
npm install
npx tsx responses_example_entra.ts
```

:::zone-end

:::zone pivot="golang"

```bash
cd src/go/responses_example_entra
go run main.go
```

:::zone-end

:::zone pivot="java"

```bash
cd src/java
mvn compile exec:java -Dexec.mainClass="com.azure.openai.starter.ResponsesExampleEntra"
```

:::zone-end

The sample prints a response from the deployed Azure OpenAI model. The exact output format varies by SDK.

## Apply the migration to your app

After the starter kit sample runs successfully, apply the same changes to your app:

1. Point your OpenAI client to your Azure OpenAI v1 endpoint: `https://<resource-name>.openai.azure.com/openai/v1/`.
1. Keep using Microsoft Entra ID authentication for keyless access.
1. Replace the Chat Completions generation call with the Responses API generation call.
1. Replace `messages` with `input` for simple prompts. Use input items when your app needs richer interactions.
1. Replace `choices[0].message.content` parsing with the output helper or response output structure for your SDK.
1. Confirm that the `model` value is your Azure OpenAI deployment name.
1. If your app uses tools, structured outputs, or conversation state, migrate those shapes separately and test each path.

> [!TIP]
> You can migrate incrementally. Keep existing Chat Completions flows in place while moving new or high-value flows to the Responses API first.

## Troubleshooting

| Issue | Try this |
| --- | --- |
| `azd up` fails because GPT-5-mini isn't available in the selected region. | Select a different Azure OpenAI model location when prompted, or set another region with `azd env set AZURE_LOCATION eastus2` and run `azd up` again. |
| `azd up` fails with a role assignment or authorization error. | Make sure your account can create resources and role assignments. Owner or User Access Administrator is usually required for this template. |
| The app returns `401` or `PermissionDenied`. | Confirm that you're signed in to the same tenant and subscription used by `azd up`. Run `az login`, `azd auth login`, and set `AZURE_TENANT_ID` to the tenant ID from `az account show`. Role assignment propagation can also take a few minutes. |
| `DefaultAzureCredential failed to retrieve a token`. | Confirm that Azure CLI is installed and authenticated with `az account show`. If you use multiple tenants, sign in to the correct tenant with `az login --tenant <tenant-id>`. |
| The app returns `model not found` or `deployment not found`. | Confirm that `AZURE_OPENAI_DEPLOYMENT` matches the Azure OpenAI deployment name. The starter kit default is `gpt-5-mini`. |
| The Go app can't find the module or dependencies. | Run the Go commands from `src/go/responses_example_entra`. Confirm that Go 1.25.1 or later is installed. |
| The Java app fails with a source or target version error. | Confirm that Java 21 or later is installed and selected by your terminal. The Java sample is a Maven project whose `pom.xml` declares the OpenAI Java SDK and Azure Identity dependencies. |
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

> [!TIP]
> If your terminal is still in one of the language sample folders, return to the repository root before you run `azd down --purge`.

## Get help

If you need help with the starter kit or the Responses API, use these resources:

- [Azure OpenAI Starter Kit repository](https://github.com/Azure-Samples/azure-openai-starter).
- [Azure OpenAI Starter Kit issues](https://github.com/Azure-Samples/azure-openai-starter/issues).
- [Azure OpenAI Responses API](/azure/ai-services/openai/how-to/responses).
- [Generate text responses with Microsoft Foundry Models](/azure/foundry/foundry-models/how-to/generate-responses).
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/).
- [Azure OpenAI role-based access control](/azure/ai-foundry/openai/how-to/role-based-access-control).

## Next steps

> [!div class="nextstepaction"]
> [Switch between OpenAI and Azure OpenAI endpoints](./switching-endpoints.md)

## Author notes: questions for the repo owner

The following questions are for this draft and should be removed before publication.

- Should this article keep the `intelligent-apps-languages` pivot group with TypeScript content under the `javascript` pivot, or should a new pivot group be created for Python, C#, TypeScript, Go, and Java?
- Which RBAC role should the article name for the identity running the local sample: `Cognitive Services User`, `Cognitive Services OpenAI User`, or both depending on the resource type?
- Should the migration article show a complete runnable hello-world file per language, or is the starter kit sample command plus focused migration snippet the right balance?
- Should the article recommend a specific Azure OpenAI region for GPT-5-mini, or avoid a default because model availability changes?
- For Java, should the sample output continue to print `response.output()`, or should the article use an SDK helper such as `outputText()` if the repo updates to that shape?

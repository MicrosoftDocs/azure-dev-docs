---
title: "Migrate Python apps from Azure OpenAI Chat Completions to the Responses API"
description: "Learn how to migrate a Python app from Azure OpenAI Chat Completions to the Responses API by using an Agent Skill or manual migration tools."
ms.date: 06/01/2026
ms.topic: how-to
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As an AI app developer, I want to migrate an existing Python app from Azure OpenAI Chat Completions to the Responses API and validate that the app still works.
---

# Upgrade your Azure OpenAI app from Chat Completions to the Responses API

This article shows you how to migrate an existing Python app from Azure OpenAI Chat Completions to the Azure OpenAI Responses API. You can use the [Azure OpenAI To Responses](https://github.com/Azure-Samples/azure-openai-to-responses) Agent Skill for an agent-assisted migration, or you can manually upgrade your app with the repository's scanner, examples, and migration references.

Use this article when your app already uses patterns such as:

- `AzureOpenAI()` or `AsyncAzureOpenAI()`
- `client.chat.completions.create(...)`
- `response.choices[0].message.content`
- `choices[0].delta.content` for streaming
- Azure OpenAI preview API versions, such as `api_version="2024-12-01-preview"`

After migration, your app should use patterns such as:

- `OpenAI()` or `AsyncOpenAI()` with an Azure OpenAI `/openai/v1/` `base_url`
- `client.responses.create(...)`
- `response.output_text`
- Responses API streaming events
- No dated `api-version` parameter for v1 inference calls

> [!IMPORTANT]
> This article focuses on Python because the linked migration skill and tooling are built for Python apps. For other languages, use the same workflow with the appropriate SDK documentation and examples.

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

## Choose a migration path

You have two options:

| Option | Best for | Setup |
|--|--|--|
| [Option 1: Use a coding agent with the migration skill](#option-1-use-a-coding-agent-with-the-migration-skill) | Most migrations. The agent scans, plans, edits, and helps verify the app. | Begins with installing the skill. See [Install the Skill](#install-the-skill). |
| [Option 2: Manually upgrade your code with the guide and tools](#option-2-manually-upgrade-your-code) | Air-gapped environments, custom LLM workflows, manual control, scanner-only use, and bulk migration workflows. | Clone the repository and install its helper tools with `pip install -e ".[dev]"`. |

If you use a coding agent, you can still read the manual migration sections to understand and review the edits the agent might make. You don't need to perform those manual steps unless the agent needs help or you prefer to make the changes yourself.

## What changes during migration

Most migrations include the following changes:

| Chat Completions pattern | Responses API pattern |
|--|--|
| `AzureOpenAI(...)` | `OpenAI(base_url=...)` |
| `AsyncAzureOpenAI(...)` | `AsyncOpenAI(base_url=...)` |
| `azure_endpoint=...` | `base_url=f"{endpoint}/openai/v1/"` |
| `api_version=...` | Remove for v1 inference calls. |
| `client.chat.completions.create(messages=...)` | `client.responses.create(input=...)` |
| `max_tokens` | `max_output_tokens` |
| Top-level `response_format` | `text={"format": {...}}` |
| `response.choices[0].message.content` | `response.output_text` |
| `choices[0].delta.content` streaming chunks | `response.output_text.delta` streaming events |
| Tool result messages with `role: "tool"` | `function_call_output` input items |

> [!NOTE]
> In Azure OpenAI, the `model` value is your model deployment name. The deployment name might differ from the underlying model name.

## Prerequisites

For either migration path, you need:

- An existing Python app that uses Azure OpenAI Chat Completions.
- An Azure OpenAI resource with a model deployment that supports the Responses API.
- Git.
- Your app's current test command, or a set of manual test prompts and workflows you can repeat before and after migration.

If you use the agent-assisted path, you also need:

- An AI coding agent that can use Agent Skills.
- Node.js and `npx`, to install the migration skill with the Agent Skills CLI.
- The GitHub CLI (`gh`), only if you want to install the skill with `gh skill install`.

If you use the manual path, you also need:

- Python and `pip`, to install and run the repository helper tools.

Optional:

- The GitHub CLI (`gh`), if you want to use the bulk migration workflow.

## Prepare your app

Start from a clean working tree so you can review the migration diff clearly.

1. Create a migration branch in your app repository:

    ```shell
    git checkout -b migrate-to-responses-api
    ```

1. If you have tests, verify they don't fail.

1. Inventory the Azure OpenAI configuration settings your app uses. Don't copy or store secret values. Note the variable names and where they're configured, such as `.env` files, app settings, CI/CD variables, infrastructure files, and test fixtures.

## Option 1: Use a coding agent with the migration skill

For the lowest-friction path, install the Agent Skill and ask your coding agent to migrate the app. This path doesn't require you to clone the migration repository or install its Python tooling.

### Install the skill

Two approaches to installing the skill:

- Use the [Agent Skills tool](https://github.com/vercel-labs/skills):

    ```shell
    npx skills add Azure-Samples/azure-openai-to-responses
    ```

- Use [GitHub CLI skill install](https://cli.github.com/manual/gh_skill_install):

    ```shell
    gh skill install Azure-Samples/azure-openai-to-responses
    ```

### Ask the agent to migrate your app

Open your app in your coding agent and ask it to migrate the app:

```text
Use the azure-openai-to-responses skill to migrate this Python app from Azure OpenAI Chat Completions to the Responses API.

Scan the code first. Then update client construction, API calls, response parsing, streaming, tools, structured outputs, tests, environment variables, and infrastructure settings. Keep edits small and reviewable. Do not commit changes.
```

The skill guides the agent to:

1. Find Chat Completions patterns.
1. Plan the edits by file and migration area.
1. Update app code, tests, and configuration.
1. Review high-risk areas such as streaming, tools, structured outputs, raw REST calls, and authentication.
1. Run available tests or tell you what still needs to be verified.

### Review and test the agent changes

When the agent finishes, review the generated diff before you commit it. Pay special attention to:

- Client construction and authentication.
- Streaming loops.
- Tool calling.
- Structured outputs.
- Environment variables and infrastructure settings.
- Test mocks, fixtures, and snapshots.

Run your automated tests:

```shell
pytest
```

Then manually exercise the app with the same kinds of inputs your users rely on. At minimum, test basic text requests, streaming, tools, structured output, and authentication paths when your app uses them.

You can read [Manually upgrade your code](#option-2-manually-upgrade-your-code) to understand the edits the agent may have made, or skip to [Verify the migration](#verify-the-migration) if the diff is already clear.

## Option 2: Manually upgrade your code

Use this path if you're not using a coding agent, if you want to run the scanner yourself, or if you need full manual control over the migration. The rest of this section walks through the code and configuration areas you need to change.

### Install the repository tools

Clone the migration repository next to your app repository:

```shell
git clone https://github.com/Azure-Samples/azure-openai-to-responses.git
cd azure-openai-to-responses
pip install -e ".[dev]"
```

The repository includes:

| Migration task | Repository content |
|--|--|
| Scan your app | `python migrate.py scan` or `skills/azure-openai-to-responses/scripts/detect_legacy.py` |
| Check model support | `python migrate.py models` |
| Review before and after patterns | `skills/azure-openai-to-responses/references/cheat-sheet.md` |
| Update tests | `skills/azure-openai-to-responses/references/test-migration.md` |
| Troubleshoot errors | `skills/azure-openai-to-responses/references/troubleshooting.md` |
| Compare with a completed migration | `demo/openai-chat-app-quickstart/` |

### Confirm model support

Before you change code, confirm that your target model deployment supports the Responses API in your Azure region.

From the migration repository root, run:

```shell
python migrate.py models --subscription YOUR_SUBSCRIPTION_ID --location YOUR_REGION
```

You can filter to specific model families:

```shell
python migrate.py models --subscription YOUR_SUBSCRIPTION_ID --location eastus2 --filter gpt-4o,gpt-5
```

If you already know the deployment you plan to use, run a small Responses API smoke test:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    base_url=f"{os.environ['AZURE_OPENAI_ENDPOINT'].rstrip('/')}/openai/v1/",
)

response = client.responses.create(
    model=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"],
    input="Reply with one short sentence.",
    max_output_tokens=50,
)

print(response.output_text)
```

If the request fails, fix model, region, endpoint, or authentication issues before migrating the application code.

### Scan for code that needs migration

Run the scanner against your app:

```shell
python migrate.py scan /path/to/your-app
```

You can also run the lower-level scanner directly:

```shell
python skills/azure-openai-to-responses/scripts/detect_legacy.py /path/to/your-app
```

Use the scan results as your migration checklist. Look for:

- Client constructors: `AzureOpenAI` and `AsyncAzureOpenAI`.
- Chat Completions calls: `chat.completions.create`.
- Response parsing: `choices[0].message.content`.
- Streaming response parsing: `choices[0].delta.content`.
- Request parameters: `max_tokens`, `response_format`, and `seed`.
- Tool calling shapes.
- Multimodal content item types.
- Raw REST calls to `/chat/completions`.
- Environment variables such as `AZURE_OPENAI_API_VERSION`.
- Test mocks and snapshots based on Chat Completions response shapes.

> [!TIP]
> A clean scan after migration is useful, but it is not a complete proof. You still need to run tests and exercise streaming, tools, structured output, and error handling paths.

### Migrate client construction

Replace Azure-specific client classes with the standard OpenAI client configured with your Azure OpenAI v1 endpoint.

Before:

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ["AZURE_OPENAI_API_VERSION"],
)
```

After:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    base_url=f"{os.environ['AZURE_OPENAI_ENDPOINT'].rstrip('/')}/openai/v1/",
)
```

For asynchronous code, replace `AsyncAzureOpenAI` with `AsyncOpenAI`.

For Microsoft Entra ID authentication, use the Azure OpenAI Responses API authentication example from the Azure documentation. The current v1 examples use the `https://ai.azure.com/.default` scope.

### Migrate request calls

Replace each `chat.completions.create` call with `responses.create`.

Before:

```python
response = client.chat.completions.create(
    model=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"],
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_query},
    ],
    max_tokens=800,
)
```

After:

```python
response = client.responses.create(
    model=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"],
    input=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_query},
    ],
    max_output_tokens=800,
)
```

Review these request parameters during migration:

| Chat Completions parameter | Migration action |
|--|--|
| `messages` | Rename to `input`. |
| `max_tokens` | Rename to `max_output_tokens`. |
| `max_completion_tokens` | Rename to `max_output_tokens`. |
| `response_format` | Move to `text.format`. |
| `seed` | Remove. |
| `temperature` and `top_p` | Verify model support, especially for reasoning models. |
| `stream=True` | Migrate the event loop to Responses API streaming events. |

If your app manages conversation history itself, continue passing the relevant history in `input`. If you choose to use stored responses and `previous_response_id`, review the Azure OpenAI Responses API documentation first so you understand storage and retention behavior.

### Migrate response parsing

Replace Chat Completions `choices` access with Responses API output access.

Before:

```python
answer = response.choices[0].message.content
```

After:

```python
answer = response.output_text
```

If you use raw REST instead of the Python SDK, don't expect `output_text` to exist as a top-level convenience property in every response shape. Inspect the response output items and extract the text content your app needs.

### Migrate streaming

Streaming code needs explicit review because the event shape changes.

Before, Chat Completions code often reads chunks like this:

```python
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        yield delta
```

After migration, Responses API streaming code should listen for Responses events:

```python
stream = client.responses.create(
    model=os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"],
    input=messages,
    stream=True,
)

for event in stream:
    if event.type == "response.output_text.delta":
        yield event.delta
    elif event.type == "response.completed":
        break
```

If your backend translates the model stream into your own server-sent event contract, try to keep that frontend contract unchanged. If your frontend parses raw OpenAI events, update the frontend for the Responses API event types.

Wrap streaming loops with error handling so rate limits, authentication failures, and content filtering errors don't end the stream silently.

### Migrate structured outputs

Chat Completions code might use top-level `response_format`. Responses API structured output uses `text.format`.

Before:

```python
response = client.chat.completions.create(
    model=deployment,
    messages=messages,
    response_format={"type": "json_schema", "json_schema": schema},
)
```

After:

```python
response = client.responses.create(
    model=deployment,
    input=messages,
    text={
        "format": {
            "type": "json_schema",
            "name": "Output",
            "strict": True,
            "schema": schema,
        }
    },
)
```

Confirm that your deployed model supports the structured output mode you rely on.

### Migrate tool calling

Function tool definitions use a flatter shape in the Responses API.

Before:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather for a location.",
            "parameters": weather_schema,
        },
    }
]
```

After:

```python
tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get the weather for a location.",
        "parameters": weather_schema,
    }
]
```

When the model returns a function call, execute your function and pass the result back as a `function_call_output` item:

```python
tool_result = {
    "type": "function_call_output",
    "call_id": function_call.call_id,
    "output": result_json,
}
```

Do not send old Chat Completions tool result messages such as `{"role": "tool", ...}` in a Responses API follow-up request.

### Migrate multimodal input

If your app sends typed content items, update content item types.

| Chat Completions content type | Responses API content type |
|--|--|
| `text` | `input_text` |
| `image_url` | `input_image` |

For image input, use the Responses API image item shape:

```python
{
    "type": "input_image",
    "image_url": "https://example.com/image.png",
}
```

The old nested shape `{"image_url": {"url": "..."}}` can cause request validation errors after migration.

### Update configuration and infrastructure

Search your app for Azure OpenAI settings in `.env` files, app settings, Bicep, Terraform, GitHub Actions, container configuration, and deployment scripts.

Common updates:

| Old setting | Migration action |
|--|--|
| `AZURE_OPENAI_API_VERSION` | Remove from app code and deployment configuration. |
| `AZURE_OPENAI_VERSION` | Remove if it was only used for Chat Completions API versioning. |
| `openAiApiVersion` or similar IaC parameter | Remove if it was only used for Chat Completions. |
| `AZURE_OPENAI_ENDPOINT` | Keep. Use it to construct `/openai/v1/` `base_url`. |
| `AZURE_OPENAI_CHAT_DEPLOYMENT` | Keep or rename. Use the deployment name as the Responses API `model` value. |
| `AZURE_OPENAI_CLIENT_ID` | Consider renaming to `AZURE_CLIENT_ID` if your Azure identity tooling expects that variable. |

Do not remove deployment names or Azure OpenAI resource settings that your app still needs.

### Update tests

Tests often fail after the app code is correct because mocks and snapshots still reflect Chat Completions shapes.

Use `skills/azure-openai-to-responses/references/test-migration.md` while updating tests.

Review and update:

- Monkeypatch paths, such as `openai.resources.chat.AsyncCompletions.create`.
- Mocked response objects that contain `choices`.
- Mocked streaming chunks that contain `choices[0].delta.content`.
- Snapshot files that record Chat Completions streaming payloads.
- Assertions that check for `AzureOpenAI`, `AsyncAzureOpenAI`, `api_version`, or Azure-specific private attributes.
- Test environment variables such as `AZURE_OPENAI_API_VERSION`.

If you use snapshot testing, regenerate snapshots only after you inspect the changed response shape.

## Verify the migration

Run your app's test suite:

```shell
pytest
```

Run a live smoke test against a nonproduction Azure OpenAI deployment. At minimum, test:

- A basic text request.
- Streaming, if your app supports streaming.
- Tool calling, if your app uses tools.
- Structured output, if your app depends on JSON schema output.
- Authentication in the same mode you use in production.

If you cloned the migration repository for the manual path, run the scanner again:

```shell
python migrate.py scan /path/to/your-app
```

The scanner should report zero hits for the patterns it detects.

The migration repository also includes a live test helper:

```shell
python migrate.py test
```

Required environment variables for live testing include:

| Variable | Purpose |
|--|--|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint. |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI model deployment name. |
| `AZURE_OPENAI_API_KEY` | API key, if you use API key authentication. |
| `AZURE_TENANT_ID` | Tenant ID, if needed for Microsoft Entra ID authentication. |
| `AZURE_CLIENT_ID` | User-assigned managed identity client ID, if used. |

## Compare with the migrated demo app

If you need a working reference, inspect the migrated demo app in [`demo/openai-chat-app-quickstart/`](https://github.com/Azure-Samples/azure-openai-to-responses/tree/main/demo/openai-chat-app-quickstart).

The demo shows migration changes in:

| Area | Example files |
|--|--|
| Async client setup and streaming | `src/quartapp/chat.py` |
| Test fixtures and mocked events | `tests/conftest.py` |
| Application assertions | `tests/test_app.py` |
| Streaming snapshots | `tests/snapshots/` |
| Environment and infrastructure settings | `.env.sample` and `infra/*.bicep` |

Use the demo as a comparison point, not as a replacement for testing your own app.

## Troubleshooting

Use this table for common migration failures.

| Symptom or error | Likely cause | Fix |
|--|--|--|
| `404 Not Found` for `/openai/v1/responses` | Wrong endpoint or unsupported deployment. | Ensure `base_url` ends with `/openai/v1/`, use a deployment name for `model`, and verify model support in your region. |
| `401 Unauthorized` after switching to `OpenAI()` | API key or token provider wasn't passed correctly. | Check your API key, token provider, RBAC permissions, and endpoint. |
| `deployment not found` | `model` doesn't match an Azure OpenAI deployment name. | Use your deployment name, not only the underlying model name. |
| `missing_required_parameter: tools[0].name` | Tool definition still uses Chat Completions nested function format. | Flatten function tool definitions for Responses API. |
| `unknown_parameter: input[N].tool_calls` | Tool round trip still uses Chat Completions message shape. | Append model output items and `function_call_output` items instead. |
| `invalid_type: text.format` | Structured output uses the old `response_format` shape. | Move JSON schema configuration to `text.format`. |
| `invalid input content type` | Typed content still uses `text` or `image_url`. | Use `input_text` and `input_image`. |
| `integer below minimum value` for `max_output_tokens` | Value is too low. | Increase `max_output_tokens`. |
| Empty or truncated output | `max_output_tokens` is too low, especially for reasoning models. | Increase `max_output_tokens` and retest. |
| `temperature` or `top_p` errors | Parameter isn't supported by the target model. | Remove unsupported parameters or use the value required by the model. |
| Streaming stops without an error | Rate limit or API error occurred mid-stream. | Wrap streaming in `try`/`except` and return an error payload to the caller. |

For more detail, see `skills/azure-openai-to-responses/references/troubleshooting.md` in the migration repository.

## Migrate many repositories

If you need to migrate many repositories, use the bulk workflow after you are comfortable with a single-repository migration.

The bulk workflow requires the GitHub CLI and the manual migration tools.

Discover and clone repositories that contain Chat Completions patterns:

```shell
python migrate.py bulk prepare --org YOUR_ORG
```

After you migrate each repository with an agent or manual workflow, check status:

```shell
python migrate.py bulk status --workdir ./migrations
```

Create pull requests:

```shell
python migrate.py bulk send-prs --workdir ./migrations
```

> [!IMPORTANT]
> Treat bulk migration as a pull request workflow, not an automatic production rollout. Review generated diffs, run each repository's tests, and verify high-risk areas such as streaming, tools, structured output, authentication, and infrastructure settings.

## Clean up

If you cloned the migration helper repository for the manual path, you can remove the local clone after your pull request is merged.

Keep the migration branch until code review and validation are complete.

## Get help

Log repository-specific issues on the [Azure OpenAI To Responses issues page](https://github.com/Azure-Samples/azure-openai-to-responses/issues).

For Azure OpenAI API behavior, model support, authentication, or service issues, use the Azure OpenAI documentation and support channels.

## Resources

- [Azure OpenAI To Responses repository](https://github.com/Azure-Samples/azure-openai-to-responses)
- [Use the Azure OpenAI Responses API](/azure/foundry/openai/how-to/responses)
- [Azure OpenAI v1 API lifecycle](/azure/foundry/openai/api-version-lifecycle)
- [How to switch between OpenAI and Azure OpenAI endpoints](switching-endpoints.md)
- [Azure OpenAI Responses API samples](https://github.com/Azure-Samples/azure-openai-responses-api-samples)

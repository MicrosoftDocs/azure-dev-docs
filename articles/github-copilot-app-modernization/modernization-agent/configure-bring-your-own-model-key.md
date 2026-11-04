---
title: Bring Your Own Model or Key for Modernize CLI
description: Learn how to configure a customer-provided model for the GitHub Copilot Modernize CLI instead of using a GitHub-hosted model.
author: KarlErickson
ms.author: karler
ms.reviewer: puichan
ms.topic: how-to
ai-usage: ai-generated
ms.date: 10/14/2026
---

# Configure bring your own model or key (BYOM/BYOK) for the Modernize CLI

Bring your own model (BYOM) and bring your own key (BYOK) let you configure the Modernize CLI to use a customer-provided model instead of a GitHub-hosted model. You provide the model provider, endpoint, model identifier, and an API key when the provider requires one.

Use BYOM/BYOK when your organization requires a custom-trained model or needs to route model requests through infrastructure that it controls. You're responsible for the security and compliance posture of the model provider that you configure.

> [!WARNING]
> In BYOM/BYOK mode, your code and context are sent to the configured provider endpoint. Confirm that the provider meets your organization's security, compliance, and data-residency requirements.

## Prerequisites

- The Modernize CLI installed. For installation instructions, see [Quickstart: Install and use the GitHub Copilot modernization agent](quickstart.md).
- Access to an OpenAI-compatible endpoint, an Azure OpenAI endpoint, or an Anthropic endpoint.
- The model or deployment identifier for the endpoint.
- An API key if the provider requires authentication.

## Understand the configuration

Set the following environment variables to enable BYOM/BYOK:

| Variable                    | Required | Description                                                                                                             |
|-----------------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `COPILOT_OFFLINE`           | Yes      | Enables BYOM/BYOK mode. Set it to `true` or `1`. The setting bypasses GitHub authentication and GitHub model discovery. |
| `COPILOT_PROVIDER_BASE_URL` | Yes      | Specifies the base URL for the model provider.                                                                          |
| `COPILOT_MODEL`             | Yes      | Specifies the model identifier that the provider receives.                                                              |
| `COPILOT_PROVIDER_API_KEY`  | No       | Specifies the provider API key. Omit it if the provider doesn't require authentication.                                 |
| `COPILOT_PROVIDER_TYPE`     | No       | Specifies `openai`, `azure`, or `anthropic`. The default value is `openai`.                                             |
| `COPILOT_PROVIDER_WIRE_API` | No       | Specifies `completions` or `responses` for an OpenAI-compatible provider. The default value is `completions`.            |

> [!IMPORTANT]
> `COPILOT_OFFLINE` bypasses GitHub authentication and GitHub model discovery. It isn't a firewall and doesn't guarantee network isolation. The Modernize CLI can still connect to your model provider and other services that its modernization workflows require.

## Configure a model provider

Set the variables in the terminal session where you run the Modernize CLI.

### [PowerShell](#tab/powershell)

```powershell
$env:COPILOT_OFFLINE = "true"
$env:COPILOT_PROVIDER_TYPE = "<openai|azure|anthropic>"
$env:COPILOT_PROVIDER_BASE_URL = "<provider-base-url>"
$env:COPILOT_MODEL = "<model-name>"
$env:COPILOT_PROVIDER_API_KEY = "<provider-api-key>"
```

### [Bash](#tab/bash)

```bash
export COPILOT_OFFLINE=true
export COPILOT_PROVIDER_TYPE="<openai|azure|anthropic>"
export COPILOT_PROVIDER_BASE_URL="<provider-base-url>"
export COPILOT_MODEL="<model-name>"
export COPILOT_PROVIDER_API_KEY="<provider-api-key>"
```

---

If the provider doesn't require authentication, omit `COPILOT_PROVIDER_API_KEY`.

## Use an OpenAI-compatible provider

For an OpenAI-compatible provider, set `COPILOT_PROVIDER_TYPE` to `openai`. Include the API version path in the base URL when the provider requires it.

### [PowerShell](#tab/powershell)

```powershell
$env:COPILOT_OFFLINE = "true"
$env:COPILOT_PROVIDER_TYPE = "openai"
$env:COPILOT_PROVIDER_BASE_URL = "https://<provider-host>/v1"
$env:COPILOT_MODEL = "<model-name>"
$env:COPILOT_PROVIDER_API_KEY = "<provider-api-key>"
```

### [Bash](#tab/bash)

```bash
export COPILOT_OFFLINE=true
export COPILOT_PROVIDER_TYPE=openai
export COPILOT_PROVIDER_BASE_URL="https://<provider-host>/v1"
export COPILOT_MODEL="<model-name>"
export COPILOT_PROVIDER_API_KEY="<provider-api-key>"
```

---

## Use a native Azure OpenAI endpoint

For an Azure deployment, set `COPILOT_PROVIDER_TYPE` to `azure`. Use the deployment name as the model value.

### [PowerShell](#tab/powershell)

```powershell
$env:COPILOT_OFFLINE = "true"
$env:COPILOT_PROVIDER_TYPE = "azure"
$env:COPILOT_PROVIDER_BASE_URL = "https://<resource-name>.openai.azure.com/openai/deployments/<deployment-name>"
$env:COPILOT_MODEL = "<deployment-name>"
$env:COPILOT_PROVIDER_API_KEY = "<azure-openai-api-key>"
```

### [Bash](#tab/bash)

```bash
export COPILOT_OFFLINE=true
export COPILOT_PROVIDER_TYPE=azure
export COPILOT_PROVIDER_BASE_URL="https://<resource-name>.openai.azure.com/openai/deployments/<deployment-name>"
export COPILOT_MODEL="<deployment-name>"
export COPILOT_PROVIDER_API_KEY="<azure-openai-api-key>"
```

---

## Use Microsoft Foundry

For a Microsoft Foundry OpenAI-compatible endpoint, set `COPILOT_PROVIDER_TYPE` to `openai` and use the `/openai/v1/` base URL. Set `COPILOT_PROVIDER_WIRE_API` to the API that the deployed model supports. Use `responses` for Modernize tool-calling workflows and models that require the Responses API. Use `completions` for deployments that support only the Chat Completions API.

### [PowerShell](#tab/powershell)

```powershell
$env:COPILOT_OFFLINE = "true"
$env:COPILOT_PROVIDER_TYPE = "openai"
$env:COPILOT_PROVIDER_BASE_URL = "https://<resource-name>.openai.azure.com/openai/v1/"
$env:COPILOT_PROVIDER_WIRE_API = "responses"
$env:COPILOT_MODEL = "<deployment-name>"
$env:COPILOT_PROVIDER_API_KEY = "<foundry-api-key>"
```

### [Bash](#tab/bash)

```bash
export COPILOT_OFFLINE=true
export COPILOT_PROVIDER_TYPE=openai
export COPILOT_PROVIDER_BASE_URL="https://<resource-name>.openai.azure.com/openai/v1/"
export COPILOT_PROVIDER_WIRE_API=responses
export COPILOT_MODEL="<deployment-name>"
export COPILOT_PROVIDER_API_KEY="<foundry-api-key>"
```

---

For more information about selecting a wire API, see [BYOK (bring your own key)](https://docs.github.com/copilot/how-tos/copilot-sdk/auth/byok).

## Use Anthropic

For Anthropic, set `COPILOT_PROVIDER_TYPE` to `anthropic`.

### [PowerShell](#tab/powershell)

```powershell
$env:COPILOT_OFFLINE = "true"
$env:COPILOT_PROVIDER_TYPE = "anthropic"
$env:COPILOT_PROVIDER_BASE_URL = "https://api.anthropic.com"
$env:COPILOT_MODEL = "<model-name>"
$env:COPILOT_PROVIDER_API_KEY = "<anthropic-api-key>"
```

### [Bash](#tab/bash)

```bash
export COPILOT_OFFLINE=true
export COPILOT_PROVIDER_TYPE=anthropic
export COPILOT_PROVIDER_BASE_URL=https://api.anthropic.com
export COPILOT_MODEL="<model-name>"
export COPILOT_PROVIDER_API_KEY="<anthropic-api-key>"
```

---

## Verify the configuration

List the models that the Modernize CLI recognizes:

### [PowerShell](#tab/powershell)

```powershell
modernize help models
```

### [Bash](#tab/bash)

```bash
modernize help models
```

---

In BYOM/BYOK mode, the command lists one model. The model name and ID should match `COPILOT_MODEL`. This result confirms that the CLI recognizes the configuration, but it doesn't send a request to the provider.

To verify that the provider responds, run a modernization operation:

### [PowerShell](#tab/powershell)

```powershell
modernize plan create "Create a modernization plan for this application" --source .
```

### [Bash](#tab/bash)

```bash
modernize plan create "Create a modernization plan for this application" --source .
```

---

The command uses the model selected through the BYOM/BYOK environment variables. To override the model for this command, use the `--model` option. For more information, see [Understand model selection precedence](#understand-model-selection-precedence).

If the operation completes successfully, the configured provider can complete the request.

## Understand model selection precedence

When you enable `COPILOT_OFFLINE`, the Modernize CLI selects a model in the following order:

1. The `--model` command option.
1. The `COPILOT_MODEL` environment variable.

The `MODERNIZE_MODEL` environment variable and persisted model settings don't override `COPILOT_MODEL` in offline mode.

> [!NOTE]
> The `--model` option overrides `COPILOT_MODEL` in offline mode. The specified model identifier is still sent to the configured custom provider. The command succeeds only if that provider accepts the model identifier.

## Return to GitHub Copilot models

Remove the BYOM/BYOK environment variables, and then list the available models again.

### [PowerShell](#tab/powershell)

```powershell
Remove-Item Env:COPILOT_OFFLINE,
    Env:COPILOT_PROVIDER_TYPE,
    Env:COPILOT_PROVIDER_BASE_URL,
    Env:COPILOT_PROVIDER_WIRE_API,
    Env:COPILOT_PROVIDER_API_KEY,
    Env:COPILOT_MODEL,
    Env:MODERNIZE_MODEL -ErrorAction SilentlyContinue

modernize help models
```

### [Bash](#tab/bash)

```bash
unset COPILOT_OFFLINE
unset COPILOT_PROVIDER_TYPE
unset COPILOT_PROVIDER_BASE_URL
unset COPILOT_PROVIDER_WIRE_API
unset COPILOT_PROVIDER_API_KEY
unset COPILOT_MODEL
unset MODERNIZE_MODEL

modernize help models
```

---

The command now lists the available GitHub Copilot models instead of the single customer-configured model. This result confirms that the Modernize CLI has returned to GitHub authentication and model discovery.

> [!WARNING]
> When you return to GitHub-hosted models, your code and context are sent to GitHub services.

## Limitations in network-restricted environments

BYOM/BYOK removes the Modernize CLI's dependency on GitHub authentication and model discovery, but other network dependencies remain:

- The configured model provider must be reachable.
- AppCAT and the required .NET SDK must be installed before you run assessments. Otherwise, the CLI attempts to download them.
- CVE assessment queries the GitHub Advisory API. If the API isn't reachable, CVE results are empty.
- Cost estimates query the Azure Retail Prices API.
- Remote Git repositories must be reachable unless the source is available locally.
- GitHub API and cloud agent operations require GitHub authentication. Delegate-to-cloud operations don't work while BYOM/BYOK mode bypasses that authentication.

Full network isolation, managed identity or keyless authentication, and named profiles for multiple providers aren't supported.

## Troubleshoot BYOM/BYOK

### `OfflineModeMissingConfig`

Set both `COPILOT_PROVIDER_BASE_URL` and `COPILOT_MODEL`. You can pass `--model` for an individual command, but `COPILOT_MODEL` is required for `modernize help models` to list the custom model.

### Only one model appears

BYOM/BYOK mode supports one model. The CLI creates the entry from `COPILOT_MODEL`. Remove the BYOM/BYOK environment variables to return to GitHub model discovery.

### Provider authentication fails

Verify that `COPILOT_PROVIDER_API_KEY` is valid and can access the configured model. If the provider doesn't require authentication, remove the variable.

### A GitHub API or cloud agent operation fails

BYOM/BYOK mode bypasses GitHub authentication. Remove the BYOM/BYOK environment variables before you run an operation that requires GitHub APIs or a cloud agent.

## Related content

- [GitHub Copilot modernization agent CLI commands](cli-commands.md)
- [Quickstart: Install and use the GitHub Copilot modernization agent](quickstart.md)
- [Use BYOK models with GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models)

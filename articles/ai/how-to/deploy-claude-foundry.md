---
title: Deploy and use Claude on Microsoft Foundry using Bicep or Terraform via Azure Developer CLI 
description: Learn how to deploy Anthropic Claude models to Microsoft Foundry by using the Claude on Foundry Starter Kit and Azure Developer CLI.
ms.date: 6/18/2026
ms.topic: how-to
ms.subservice: intelligent-apps
content_well_notification: 
  - AI-contribution
ms.custom: devx-track-azdevcli, dev-focus
ai-usage: ai-assisted
# CustomerIntent: 
---


# Deploy Claude models in Microsoft Foundry using Bicep or Terraform

The [Claude on Foundry Starter Kit](https://github.com/Azure-Samples/claude) helps you deploy Anthropic Claude models to Microsoft Foundry by using [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/). It also helps you configure local authentication and call the deployed model from Claude Code or Python.

In this article, you learn how to:

- Deploy Claude Sonnet to Microsoft Foundry by using the Bicep variant of the starter kit.
- Configure the required Anthropic model-provider attestation values.
- Configure Claude Code to use the Foundry-hosted model.
- Call the deployed Claude model from Python by using Microsoft Entra ID.
- Customize the deployment for Terraform, more model families, other regions, or different capacity.

> [!IMPORTANT]
> Running `azd up` with this starter kit accepts Anthropic Marketplace terms and sends the attestation values `CLAUDE_ORGANIZATION_NAME`, `CLAUDE_COUNTRY_CODE`, and `CLAUDE_INDUSTRY` with requests. Set values that describe the real organization using the model. For details, see [Terms of use](#terms-of-use).

## QuickStart

This "happy path" deploys Claude Sonnet by using Bicep in `eastus2` with capacity `25` (25,000 tokens per minute). Use it first to get to a working deployment, then move to [Customize the deployment](#customize-the-deployment) if you need Terraform, multiple model families, another region, or different capacity.

You need an Azure subscription that's eligible for Anthropic Claude in Microsoft Foundry, permissions to create the target resources, Azure CLI, Azure Developer CLI, Git, and Python 3.10 or later. If your account can create role assignments, the QuickStart also grants your user model invocation access so the samples can run immediately.

### Clone, configure, and deploy

If your Claude-eligible subscription is in a non-default tenant, add the tenant ID to both sign-in commands.

# [PowerShell](#tab/powershell)

```powershell
git clone https://github.com/Azure-Samples/claude.git
cd claude\infra-bicep

az login
azd auth login

azd env new my-claude
azd env set CLAUDE_ORGANIZATION_NAME "Contoso"
azd env set CLAUDE_COUNTRY_CODE "US"
azd env set CLAUDE_INDUSTRY "technology"
azd env set AZURE_LOCATION "eastus2"
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
azd env set CLAUDE_SONNET_CAPACITY 25
azd env set ASSIGN_RBAC true

azd up
```

# [Bash](#tab/bash)

```bash
git clone https://github.com/Azure-Samples/claude.git
cd claude/infra-bicep

az login
azd auth login

azd env new my-claude
azd env set CLAUDE_ORGANIZATION_NAME "Contoso"
azd env set CLAUDE_COUNTRY_CODE "US"
azd env set CLAUDE_INDUSTRY "technology"
azd env set AZURE_LOCATION "eastus2"
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
azd env set CLAUDE_SONNET_CAPACITY 25
azd env set ASSIGN_RBAC true

azd up
```

---

Replace `Contoso`, `US`, and `technology` with values for the real organization using Claude. If your account can't create role assignments, skip `ASSIGN_RBAC` and have an administrator grant model invocation access before you run the samples.

### Verify and run Claude Code

From the repo root, verify the generated configuration and deployment state. The skip flag avoids a live Claude call during verification.

# [PowerShell](#tab/powershell)

```powershell
cd ..
pwsh -File .\scripts\verify-claude-code.ps1 -SkipClaudeCall -WaitForDeployment

. .\claude-code.env.ps1
claude
```

# [Bash](#tab/bash)

```bash
cd ..
bash ./scripts/verify-claude-code.sh --skip-claude-call --wait-for-deployment

source ./claude-code.env.sh
claude
```

---

### Run the Python sample

Write the `azd` outputs to `.env.local`, install dependencies, and run the one-shot sample with Microsoft Entra ID.

# [PowerShell](#tab/powershell)

```powershell
cd infra-bicep
azd env get-values | Out-File -Encoding utf8 ..\.env.local
cd ..
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python src\hello_claude.py
```

# [Bash](#tab/bash)

```bash
cd infra-bicep
azd env get-values > ../.env.local
cd ..
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/hello_claude.py
```

---

## How the starter kit helps

The starter kit automates Claude deployment by using Bicep or Terraform. It configures local authentication for Microsoft Entra ID and provides working Claude Code and Python samples. It also includes preflight checks for common marketplace, region, and quota issues so you can fix blockers before provisioning. For more detail, see [What the deployment creates](#what-the-deployment-creates) and [Customize the deployment](#customize-the-deployment).

## Prerequisites

- An Azure subscription that's eligible to deploy Anthropic Claude models in Microsoft Foundry. Claude model availability depends on subscription type, billing status, region, and Anthropic supported regions.
- Permissions to create and manage the target Azure resources. You typically need `Contributor` or `Owner` on the subscription or target resource group.
- Access to Azure Marketplace for partner model offerings.
- [Azure CLI](/cli/azure/install-azure-cli).
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
- [Git](https://git-scm.com/downloads).
- Python 3.10 or later for the Python samples.
- Terraform 1.6 or later if you choose the Terraform variant.

> [!TIP]
> The repo also supports GitHub Codespaces and VS Code Dev Containers. Those environments include the required developer tools, so they're a good choice if you don't want to install `az`, `azd`, and Python locally.

## What the deployment creates

The starter kit creates these resources and local configuration files:

- An Azure resource group for the `azd` environment.
- A Microsoft Foundry account.
- A Microsoft Foundry project.
- One or more Claude model deployments in the Foundry account.
- An optional role assignment for model invocation.
- Local Claude Code activator scripts at the repo root.
- Claude workspace configuration that pins Claude Code to a deployed model family.
- Optional VS Code extension settings when you set `CLAUDE_WRITE_VSCODE_SETTINGS=true`.
- `azd` environment outputs, including the Foundry account name, base URL, project endpoint, and deployment names.

## Customize the deployment

Use this section when you want to vary the QuickStart path, such as using Terraform, selecting a different region, deploying multiple Claude families, or changing capacity. If you already completed the QuickStart, you can skip ahead to [Use Claude Code with the deployed model](#use-claude-code-with-the-deployed-model) or [Call Claude from Python](#call-claude-from-python).

### Clone the starter kit

Clone the starter kit and change into the repo:

# [PowerShell](#tab/powershell)

```powershell
git clone https://github.com/Azure-Samples/claude.git
cd claude
```

# [Bash](#tab/bash)

```bash
git clone https://github.com/Azure-Samples/claude.git
cd claude
```

---

Optionally, inspect the live Claude catalog before you choose model IDs. This helper is PowerShell-only in the starter kit.

```powershell
pwsh -File .\Get-ClaudeCatalog.ps1 -Latest
```

The catalog changes over time. Use the script output to confirm which Claude model IDs are available in the region you plan to deploy.

### Choose an infrastructure variant

The starter kit includes two equivalent infrastructure variants:

| Variant | Folder | Use when |
| --- | --- | --- |
| Bicep | `infra-bicep` | You prefer Azure-native infrastructure as code. |
| Terraform | `infra-terraform` | You prefer Terraform and already use Terraform workflows. |

Change into one of the variant folders:

# [PowerShell](#tab/powershell)

```powershell
cd infra-bicep
```

Or:

```powershell
cd infra-terraform
```

# [Bash](#tab/bash)

```bash
cd infra-bicep
```

Or:

```bash
cd infra-terraform
```

---

The rest of the commands in this article run from the variant folder you chose.

### Sign in to Azure

Sign in by using both Azure CLI and Azure Developer CLI:

# [PowerShell](#tab/powershell)

```powershell
az login
azd auth login
```

# [Bash](#tab/bash)

```bash
az login
azd auth login
```

---

If your Claude-eligible subscription is in a non-default tenant, specify the tenant:

# [PowerShell](#tab/powershell)

```powershell
az login --tenant <tenant-id>
azd auth login --tenant-id <tenant-id>
```

# [Bash](#tab/bash)

```bash
az login --tenant <tenant-id>
azd auth login --tenant-id <tenant-id>
```

---

### Create an `azd` environment

Create an `azd` environment to store deployment configuration:

# [PowerShell](#tab/powershell)

```powershell
azd env new my-claude
```

# [Bash](#tab/bash)

```bash
azd env new my-claude
```

---

If you already created an environment, select it instead:

# [PowerShell](#tab/powershell)

```powershell
azd env select my-claude
```

# [Bash](#tab/bash)

```bash
azd env select my-claude
```

---

### Configure required deployment values

Set the organization values used for the Claude model-provider attestation:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_ORGANIZATION_NAME "Contoso"
azd env set CLAUDE_COUNTRY_CODE "US"
azd env set CLAUDE_INDUSTRY "technology"
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_ORGANIZATION_NAME "Contoso"
azd env set CLAUDE_COUNTRY_CODE "US"
azd env set CLAUDE_INDUSTRY "technology"
```

---

Replace the example values with your organization's legal entity name, two-letter country code, and industry. The starter kit provides default values for country and industry, but override them unless `US` and `technology` accurately describe the organization that uses Claude.

The industry value must be lowercase. Supported values are:

- `technology`
- `finance`
- `healthcare`
- `education`
- `retail`
- `manufacturing`
- `government`
- `media`
- `other`

Set the Azure region:

# [PowerShell](#tab/powershell)

```powershell
azd env set AZURE_LOCATION "eastus2"
```

# [Bash](#tab/bash)

```bash
azd env set AZURE_LOCATION "eastus2"
```

---

The starter kit supports regions where the selected Claude models are available. The QuickStart uses `eastus2`. For a common all-family deployment, `eastus2` and `swedencentral` currently host Haiku, Sonnet, and Opus. `westus2` hosts Sonnet and Opus. Availability can change, so use the live catalog script if you're unsure which model families are available in your target region.

### Deploy more model families or change capacity

For a simple first deployment, deploy only Sonnet by using the preferred per-family variable:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
```

---

To deploy multiple model families into the same Foundry account, set one or more family variables:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_HAIKU_MODEL "claude-haiku-4-5"
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
azd env set CLAUDE_OPUS_MODEL "<opus-model-id-from-catalog>"
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_HAIKU_MODEL "claude-haiku-4-5"
azd env set CLAUDE_SONNET_MODEL "claude-sonnet-4-6"
azd env set CLAUDE_OPUS_MODEL "<opus-model-id-from-catalog>"
```

---

Each non-empty family variable creates a separate deployment. Leave a family unset to skip it. The older `CLAUDE_MODEL_NAME` setting is a legacy single-deployment fallback and is used only when `CLAUDE_HAIKU_MODEL`, `CLAUDE_SONNET_MODEL`, and `CLAUDE_OPUS_MODEL` are all empty.

The QuickStart sets Sonnet capacity to `25`. To override capacity for any deployed family, set the matching capacity variable:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_SONNET_CAPACITY 25
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_SONNET_CAPACITY 25
```

---

Capacity values are measured in thousands of tokens per minute. For example, `25` requests 25,000 TPM.

### Configure model invocation access

For the Microsoft Entra ID samples to work immediately after deployment, set `ASSIGN_RBAC=true` before `azd up`. The template assigns the least-privilege `Cognitive Services User` role on the Foundry account to the principal ID that `azd` supplies through `AZURE_PRINCIPAL_ID`, so you normally don't need to look up your own object ID.

```bash
azd env set ASSIGN_RBAC true
```

Set `AZURE_PRINCIPAL_ID` manually only when you need to grant access to a different user or service principal:

# [PowerShell](#tab/powershell)

```powershell
azd env set AZURE_PRINCIPAL_ID "<object-id>"
azd env set ASSIGN_RBAC true
```

# [Bash](#tab/bash)

```bash
azd env set AZURE_PRINCIPAL_ID "<object-id>"
azd env set ASSIGN_RBAC true
```

---

If you don't enable this option, you can still deploy the resources. However, you or an administrator must grant model invocation permissions before the Microsoft Entra ID samples can call the model.

The starter kit assigns `Cognitive Services User` because it's the least-privilege role for keyless model invocation. If you plan to add broader Foundry project features later, such as agents or evaluators, you can grant broader data-plane roles such as `Foundry User` or `Azure AI Developer` separately.

### Deploy with `azd up`

Run the deployment:

# [PowerShell](#tab/powershell)

```powershell
azd up
```

# [Bash](#tab/bash)

```bash
azd up
```

---

The `azd up` command performs these tasks:

1. Runs a preflight check for required settings, marketplace catalog availability, and quota headroom.
1. Creates the Azure resource group.
1. Creates the Microsoft Foundry account and project.
1. Deploys the selected Claude model families.
1. Optionally assigns the model invocation role.
1. Writes output values such as `CLAUDE_BASE_URL`, `CLAUDE_DEPLOYMENT_NAME`, and per-family deployment names.
1. Runs the postprovision hook to configure Claude Code activator files.

Deployment can take several minutes. Model deployments can also continue provisioning after the ARM deployment operation returns a timeout. If that happens, use the verification script in the next section to check the actual deployment state before rerunning `azd up`.

## Verify the deployment

From the repo root, run the verification script:

# [PowerShell](#tab/powershell)

```powershell
cd ..
pwsh -File .\scripts\verify-claude-code.ps1 -SkipClaudeCall
```

# [Bash](#tab/bash)

```bash
cd ..
bash ./scripts/verify-claude-code.sh --skip-claude-call
```

---

To wait for model deployments that are still provisioning, add the wait flag:

# [PowerShell](#tab/powershell)

```powershell
pwsh -File .\scripts\verify-claude-code.ps1 -SkipClaudeCall -WaitForDeployment
```

# [Bash](#tab/bash)

```bash
bash ./scripts/verify-claude-code.sh --skip-claude-call --wait-for-deployment
```

---

To include a live Claude Code round trip, omit the skip flag:

# [PowerShell](#tab/powershell)

```powershell
pwsh -File .\scripts\verify-claude-code.ps1
```

# [Bash](#tab/bash)

```bash
bash ./scripts/verify-claude-code.sh
```

---

The verification script checks the generated activator, expected environment variables, Azure CLI sign-in, visible Foundry resource, model deployment states, and Claude Code CLI availability.

## Use Claude Code with the deployed model

### Use the Claude Code CLI

By default, the starter kit writes project-scoped activator scripts and Claude workspace configuration at the repo root:

- `claude-code.env.ps1` for PowerShell.
- `claude-code.env.sh` for Bash, macOS, Linux, Git Bash, or WSL.
- Claude workspace configuration to pin Claude Code to a model family you deployed.

# [PowerShell](#tab/powershell)

```powershell
. .\claude-code.env.ps1
claude
```

# [Bash](#tab/bash)

```bash
source ./claude-code.env.sh
claude
```

---

The activator configures Claude Code to use Microsoft Foundry and sets the deployment names for the model families you deployed. For each deployed family, the postprovision hook writes an `ANTHROPIC_DEFAULT_<FAMILY>_MODEL` value into the activator so Claude Code can route to Haiku, Sonnet, or Opus when those deployments exist. The Claude workspace configuration pins the workspace default to a deployed family, so `claude` resolves to a model that exists in your Foundry account.

If the `claude` command isn't installed, the postprovision hook prints the installation command for your platform. To have the starter kit install Claude Code automatically during provisioning, set this value before you run `azd up`:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_CODE_AUTO_INSTALL true
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_CODE_AUTO_INSTALL true
```

---

### Optional: configure the VS Code extension

The starter kit doesn't write `.vscode/settings.json` by default. If you use the Claude Code VS Code extension and want the starter kit to configure it, opt in before `azd up`:

# [PowerShell](#tab/powershell)

```powershell
azd env set CLAUDE_WRITE_VSCODE_SETTINGS true
```

# [Bash](#tab/bash)

```bash
azd env set CLAUDE_WRITE_VSCODE_SETTINGS true
```

---

When you enable this option, the postprovision hook writes or merges `claudeCode.environmentVariables` and `claudeCode.disableLoginPrompt` into `.vscode/settings.json` so the extension uses your Foundry deployment instead of prompting for an Anthropic account login.

## Call Claude from Python

The repo includes Python samples under `src`. Use them to test application-style access with the Anthropic SDK and Microsoft Entra ID.

From the repo root, change back into the infrastructure variant folder and write the `azd` outputs to `.env.local` at the repo root:

# [PowerShell](#tab/powershell)

```powershell
cd infra-bicep # or: cd infra-terraform
azd env get-values | Out-File -Encoding utf8 ..\.env.local
```

# [Bash](#tab/bash)

```bash
cd infra-bicep # or: cd infra-terraform
azd env get-values > ../.env.local
```

---

Then create a virtual environment and install dependencies:

# [PowerShell](#tab/powershell)

```powershell
cd ..
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

# [Bash](#tab/bash)

```bash
cd ..
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

Run the one-shot sample:

# [PowerShell](#tab/powershell)

```powershell
python src\hello_claude.py
```

# [Bash](#tab/bash)

```bash
python src/hello_claude.py
```

---

The sample loads `CLAUDE_BASE_URL` and `CLAUDE_DEPLOYMENT_NAME`, gets a Microsoft Entra ID token for `https://ai.azure.com/.default`, creates an Anthropic client with the Foundry base URL, and sends a Messages API request.  

You can also try the streaming and long-running variants.  

# [PowerShell](#tab/powershell)

```powershell
python src\chat_stream.py
python src\hello_claude_token_refresh.py
```

# [Bash](#tab/bash)

```bash
python src/chat_stream.py
python src/hello_claude_token_refresh.py
```

---

Use the token-refresh sample for services, daemons, notebooks, or other processes that might run longer than the lifetime of a single Microsoft Entra ID token.

## Advanced: test with an API key

Use Microsoft Entra ID for normal development and production scenarios. For quick local testing, the repo also includes an API-key sample.  

From the repo root, change into the infrastructure variant folder and get the Foundry account name and resource group:

# [PowerShell](#tab/powershell)

```powershell
cd infra-bicep # or: cd infra-terraform
azd env get-values
```

# [Bash](#tab/bash)

```bash
cd infra-bicep # or: cd infra-terraform
azd env get-values
```

---

Use the `FOUNDRY_ACCOUNT_NAME` and `AZURE_RESOURCE_GROUP` values from the output to set `CLAUDE_API_KEY`. Then, run the API-key sample from the repo root:

# [PowerShell](#tab/powershell)

```powershell
$env:CLAUDE_API_KEY = (az cognitiveservices account keys list `
  --name "<foundry-account-name>" `
  --resource-group "<resource-group-name>" `
  --query key1 -o tsv)

cd ..
python src\hello_claude_apikey.py
```

# [Bash](#tab/bash)

```bash
export CLAUDE_API_KEY="$(az cognitiveservices account keys list \
  --name "<foundry-account-name>" \
  --resource-group "<resource-group-name>" \
  --query key1 -o tsv)"

cd ..
python src/hello_claude_apikey.py
```

---

API keys are useful for a quick connectivity check, but they don't provide the same per-user access control and credential lifecycle benefits as Microsoft Entra ID.

## Terms of use

The Bicep and Terraform variants both send a `modelProviderData` block with each Claude deployment. That block includes `organizationName`, `countryCode`, and `industry`. The Cognitive Services resource provider uses those values to accept the Azure Marketplace offer for Anthropic Claude on your behalf, so there's no separate manual click-through during `azd up`.

Before you deploy:

1. Review the legal documents that govern Claude through Microsoft Foundry:
   - [Anthropic Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms).
   - [Anthropic Usage Policy](https://www.anthropic.com/legal/aup), also called the Acceptable Use Policy.
   - [Anthropic Supported Regions Policy](https://aka.ms/supported_anthropic_regions).
   - [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/) for Azure.
1. Set the attestation values so they accurately describe your organization:
   - `CLAUDE_ORGANIZATION_NAME`: the legal entity name. This value is required and has no default.
   - `CLAUDE_COUNTRY_CODE`: the two-letter country code. The starter kit default is `US`.
   - `CLAUDE_INDUSTRY`: the organization industry. The starter kit default is `technology`.
1. Confirm that your Azure subscription is eligible to deploy Anthropic Claude models in Microsoft Foundry.

If the defaults for country or industry don't accurately describe the organization that uses Claude, override them before you deploy.

### Preview the dialog Foundry shows on the manual path, and audit acceptance after `azd up`

The Azure portal "Agree and proceed" dialog for a Claude SKU is generated from the live Marketplace offer metadata. Because that Marketplace text can change, use the live listing for the SKU you plan to deploy instead of relying on a copied snapshot.

- Sonnet 4.6: <https://azuremarketplace.microsoft.com/en-us/marketplace/apps/anthropic.anthropic-claude-sonnet-4-6-offer>
- Opus 4.6: <https://azuremarketplace.microsoft.com/en-us/marketplace/apps/anthropic.anthropic-claude-opus-4-6-offer>
- Haiku 4.5: <https://azuremarketplace.microsoft.com/en-us/marketplace/apps/anthropic.anthropic-claude-haiku-4-5-offer>
- All Anthropic offers: <https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=anthropic>

After `azd up`, you can audit the accepted Marketplace agreement metadata by using Azure CLI. The command returns metadata such as the accepted state, signature, date, and license text link. It doesn't return the full portal dialog text.

# [PowerShell](#tab/powershell)

```powershell
az term show `
  --publisher anthropic `
  --product anthropic-claude-sonnet-4-6-offer `
  --plan <plan-name>
```

# [Bash](#tab/bash)

```bash
az term show \
  --publisher anthropic \
  --product anthropic-claude-sonnet-4-6-offer \
  --plan <plan-name>
```

---

For other Claude SKUs, replace the `--product` value with the matching Marketplace offer. Use the plan name from the live offer metadata or the starter kit catalog checks.

## Troubleshooting

For more cases, see the [starter kit troubleshooting section](https://github.com/Azure-Samples/claude#troubleshooting).

| Problem | What to try |
| --- | --- |
| Subscription or offer eligibility blocks `azd up` | Verify that your subscription and billing account are eligible for Claude models in Microsoft Foundry. If your organization requires explicit Marketplace acceptance, accept the matching Anthropic offer before rerunning `azd up`. |
| Region isn't available for the selected model | Use a region where the selected Claude family is available. The QuickStart uses `eastus2`; `swedencentral` also commonly hosts Haiku, Sonnet, and Opus, and `westus2` hosts Sonnet and Opus. Availability can change, so run `pwsh -File .\Get-ClaudeCatalog.ps1 -Latest` from the repo root if you're unsure. |
| Quota is insufficient, or quota appears full with no live deployments | Lower the matching `CLAUDE_*_CAPACITY` value, delete unused deployments, or request a quota increase. Soft-deleted Foundry or AIServices accounts can reserve TPM quota for up to 48 hours; list them with `az cognitiveservices account list-deleted -o table` and purge accounts you no longer need. |
| Terraform fails with an opaque `715-123420` error | Treat this as a likely quota failure, including quota held by soft-deleted accounts. Run the starter kit preflight checks, review quota headroom, lower capacity, or retry with the Bicep variant to surface a clearer `InsufficientQuota` message. |
| Claude Code or Python returns 401 or 403 | Run `az login`, confirm you're signed in to the tenant that owns the Foundry resource, and verify the caller has model invocation access such as `Cognitive Services User`. Fresh RBAC assignments can take a few minutes to propagate. |
| `GatewayTimeout` appears during model deployment | Model deployment can continue after the ARM operation times out. Before rerunning `azd up`, run the verification script with `-WaitForDeployment` or `--wait-for-deployment` to check the actual deployment state. |

## Clean up resources

When you no longer need the resources, delete them with `azd down` from the infrastructure variant folder:

# [PowerShell](#tab/powershell)

```powershell
cd infra-bicep
azd down
```

Or:

```powershell
cd infra-terraform
azd down
```

# [Bash](#tab/bash)

```bash
cd infra-bicep
azd down
```

Or:

```bash
cd infra-terraform
azd down
```

---

Review the resources that `azd` plans to delete before you confirm. Deleting the environment removes the Foundry account, project, and model deployments that the starter kit created.

If you're iterating on deployments and need the reserved Claude TPM quota back immediately, use the purge option when your `azd` version supports it:

# [PowerShell](#tab/powershell)

```powershell
azd down --purge
```

# [Bash](#tab/bash)

```bash
azd down --purge
```

---

Without purge, soft-deleted Foundry or AIServices accounts can continue to hold TPM quota for up to 48 hours. If you already deleted an environment without purging and quota still appears full, use `az cognitiveservices account list-deleted -o table` to find deleted accounts and purge the accounts you no longer need.

## Next steps

- [Claude on Foundry Starter Kit](https://github.com/Azure-Samples/claude)
- [Deploy and use Claude models in Microsoft Foundry](/azure/foundry/foundry-models/how-to/use-foundry-models-claude)
- [Configure Claude Code for Microsoft Foundry](/azure/foundry/foundry-models/how-to/configure-claude-code)
- [Get started with Azure Developer CLI](/azure/developer/azure-developer-cli/get-started)

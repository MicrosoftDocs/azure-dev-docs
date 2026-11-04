---
title: Copilot Instructions for Azure Skills
description: "Instructions for authoring and maintaining Azure Skills documentation from the upstream source repository."
applyTo: "articles/azure-skills/**/*.md"
ai-usage: ai-generated
---

# Copilot instructions for Azure Skills

Use these instructions when creating, editing, or reviewing Azure Skills documentation. Follow the repository-wide Microsoft Learn instructions for writing style and AI disclosure. These instructions guide documentation work; don't execute the deployment or resource-management workflows described in upstream skills just to update an article.

The source and terminology guidance applies throughout `articles/azure-skills/`. The high-level format below applies to individual skill reference articles. Installation guides, quickstarts, and how-to articles can include the procedures needed to complete their stated task.

## Authoritative sources

Use the [Azure Skills source repository](https://github.com/microsoft/azure-skills) to verify product behavior, not as an outline to reproduce. Read the files needed to substantiate the article instead of relying on a cached skill catalog or an existing article alone. Source accuracy doesn't require exhaustive coverage of the source.

| Documentation claim | Source to check |
| --- | --- |
| Marketplace overview, available plugins, and plugin source directories. | The [source README](https://github.com/microsoft/azure-skills/blob/main/README.md) and [plugin directory](https://github.com/microsoft/azure-skills/tree/main/.github/plugins). |
| Plugin name, version, skill directory, and MCP configuration location. | The owning plugin's `.plugin/plugin.json` under `.github/plugins/<plugin-directory>/`. |
| Skill identifier, scope, triggers, exclusions, and version. | The owning plugin's `skills/<skill-directory>/SKILL.md`, including its YAML front matter. |
| Workflow steps, prerequisites, generated files, approvals, and limitations. | The skill's `SKILL.md` and the specific references or scripts it links to. |
| Bundled MCP servers, startup commands, and arguments. | The owning plugin's `.mcp.json`, resolved from its manifest. |
| Host-specific installation and authentication. | The [source README](https://github.com/microsoft/azure-skills/blob/main/README.md) and the relevant host installation references linked from `discover-azure-skills`. |

- Check the same source revision for a skill and its supporting references. Record the commit or release used in the PR description when updating behavior or versions.
- Treat `main` as the current source, not proof of behavior in every installed version. Use the corresponding revision when documenting an older version.
- If source files disagree about a claim relevant to the article, identify the discrepancy in the PR description. Don't invent a resolution or silently combine conflicting behaviors.
- Verify that source paths still exist before adding links. Plugin directories and skill ownership can change.

## Product names and boundaries

Keep the following concepts distinct in introductions, tables, and installation instructions:

- **Azure Skills marketplace** is the catalog in `microsoft/azure-skills`.
- **Azure Skills plugin (core)** has the plugin identifier `azure`. Its source directory is `.github/plugins/azure-skills/`.
- **Specialized plugins** are independently installable packages with their own skills, prerequisites, and configuration. Installing the core plugin doesn't install every specialized plugin.
- **Skills** provide workflow instructions, decision guidance, and guardrails. Use the exact `name` from `SKILL.md` in code style, such as `azure-prepare` or `cost-analysis`.
- **MCP servers and tools** provide execution capabilities. Don't describe a skill as an MCP tool or imply that installing skill files alone configures all required servers.

Use the manifest's plugin name in install commands, not the source directory name or an individual skill name. For example, the core plugin installs as `azure@azure-skills`, not `azure-skills@azure-skills`. Don't infer that every skill identifier starts with `azure-`.

Don't promise that every host or plugin bundles the same MCP servers. Verify the configuration for the specific installation path, especially for Azure MCP Server and Foundry MCP.

## Installation and prerequisites

Document installation for the named host rather than presenting one host's commands as universal.

- For GitHub Copilot CLI, distinguish marketplace registration (`/plugin marketplace add microsoft/azure-skills`) from plugin installation (`/plugin install azure@azure-skills`).
- Treat slash commands as commands entered in the AI assistant, not shell commands. Use an untagged or `text` code fence for them.
- Verify host versions, extension identifiers, runtime requirements, update commands, and restart requirements against the relevant source. Don't infer host support solely from MCP compatibility.
- Separate installation from authentication. Explain Azure CLI sign-in with `az login` where applicable, and Azure Developer CLI sign-in with `azd auth login` for workflows that require it.
- List scenario-specific prerequisites only where needed. Don't require Terraform, Bicep, Azure Developer CLI, or an Azure subscription for every skill unless its source requires them.
- Keep authentication and telemetry claims scoped to the component that implements them. For example, don't describe an Azure MCP telemetry setting as disabling telemetry for every plugin, host, or MCP server.

Link to the existing installation article and plugin catalog instead of repeating full setup instructions in each skill reference.

## Skill reference articles

Write a high-level, reader-facing overview, not a copy, translation, or exhaustive summary of `SKILL.md`. Help readers understand what the skill does, when to use it, what they need, and how to ask for it. The source file instructs an agent how to execute a task; the Learn article helps a reader discover and use that capability.

Use [Azure skill for deploy](../../articles/azure-skills/skills/azure-deploy.md) as the model for structure and depth. Keep sections short, with a brief paragraph or scannable list rather than detailed procedures. Use this outline when relevant, and omit sections that don't apply:

| Article element | Level of detail |
| --- | --- |
| Introduction and skill identifier. | A short description of the purpose, the exact skill name, and a **Source code** link. |
| What it provides. | A brief paragraph about the main capabilities and reader benefits, not an inventory of every operation. |
| Prerequisites. | A short list of essentials the reader must have or complete, with links to setup instructions or prerequisite skills. |
| When to use this skill. | A concise list of representative tasks. Summarize important exclusions only when they help readers choose the right skill. |
| Example prompts. | A small, varied set of natural-language requests that demonstrate the main scenarios, not every trigger phrase. |
| Workflow, if relevant. | A short explanation of the skill's place in a broader workflow. For deployment, a prepare, validate, and deploy list with one sentence per stage is sufficient. |
| Related content. | Links to prerequisite or adjacent skills, setup documentation, and the source for deeper detail. |

Keep implementation details in the linked source. Don't reproduce agent directives, internal checklists, routing tables, script invocations, MCP tool inventories, SDK reference catalogs, plan schemas, status transitions, error-recovery branches, or step-by-step execution procedures. Put deeper procedural detail in the relevant quickstart, how-to, or troubleshooting article instead of expanding the skill overview.

- Paraphrase agent-oriented trigger language into natural reader tasks. Don't copy long synonym lists or internal routing instructions.
- Write example prompts that match the documented scope and preserve required resource context. Don't promise exact assistant wording, tool calls, execution times, or outcomes unless the source establishes them.
- Distinguish illustrative output from observed results. Never fabricate deployed endpoints, resource identifiers, cost savings, or validation evidence.
- For skill reference pages, use `ms.topic: reference` and `ms.service: azure-mcp-server`. Include `devx-track-copilot-skills` in `ms.custom` without removing other entries.
- When updating version metadata, take the skill version from `metadata.version` in `SKILL.md`, not the plugin manifest's version. Preserve the article's existing version field convention, such as `ms.skillversion` or a `skill-version-<version>` entry in `ms.custom`.
- Update `ms.date` for substantive changes.

Don't rename an existing article solely to match an upstream identifier. Preserve published URLs and use the exact skill name in the article body and source link.

## Workflow and safety guidance

Keep workflow and safety information accurate for the specific skill and version. In skill overviews, mention artifacts, approvals, and safety constraints only when they affect what the reader must provide, approve, or expect. Don't present a universal deployment sequence for every Azure task.

- For the `azure-prepare` workflow, preserve the prepare, validate, and deploy boundaries. Preparation generates artifacts, validation performs checks and records evidence, and deployment executes changes.
- Verify generated artifact names against the source. The current prepare workflow uses `.azure/deployment-plan.md`; don't substitute the older `.azure/plan.md` path.
- Preserve the meaning of approval, Azure context, validation, and destructive-action requirements where the source specifies them.
- Don't describe a manually changed status as successful validation. A preparation-only or validation-only request doesn't authorize deployment.
- Explain whether a prompt reads resources, generates local files, provisions resources, or changes existing resources. Include cost and cleanup guidance for deployment tutorials.
- Use placeholders instead of real credentials or secrets. Don't include access keys, client secrets, or tokens in example output, and preserve managed identity or least-privilege guidance from the source.
- Keep skill-specific constraints intact. For example, don't turn a read-only analysis workflow into an automatic remediation workflow.

## Update workflow

For changes that affect multiple documentation surfaces, keep them aligned without rewriting unrelated content.

1. Identify the owning plugin and skill, and read the relevant source and references at one revision.
1. Compare the source with the article and change only the affected reader-facing behavior, examples, prerequisites, links, and metadata. An internal implementation change alone doesn't require expanding the overview.
1. When adding, moving, or removing a documented skill or plugin, update `articles/azure-skills/TOC.yml` and the relevant entries in `articles/azure-skills/plugins/index.md`. Update `articles/azure-skills/index.yml`, `overview.md`, and `install.md` only when the change affects their content.
1. Check relative links, source links, skill identifiers, plugin ownership, version metadata, and consistency across the affected pages. For skill reference articles, compare the depth with the Deploy overview and remove copied agent instructions or unnecessary operational detail.

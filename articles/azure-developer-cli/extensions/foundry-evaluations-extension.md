---
title: Microsoft Foundry evaluations extension overview
description: Learn about the Microsoft Foundry evaluations extension, which lets you define, run, and inspect Microsoft Foundry evaluations from your terminal.
author: m7md7sien
ms.author: mohessie
ms.date: 10/25/2026
ms.service: azure-dev-cli
ms.topic: overview
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Microsoft Foundry evaluations extension overview

The Azure Developer CLI (`azd`) Microsoft Foundry evaluations extension (`azure.ai.evaluations`) defines, runs, and inspects evaluations for Microsoft Foundry from your terminal or editor. It keeps datasets, evaluators, and evaluation definitions in a configuration file under source control, so you can use the same evaluation configuration on a laptop and in a pipeline. You supply the evaluation data, a Foundry project, and the agents and model deployments your evaluation needs.

This article introduces the extension. For evaluation concepts, metrics, and guidance on choosing evaluators, see the [Microsoft Foundry documentation](/azure/foundry/).

## Key features

| Feature | Description |
|---|---|
| Declarative configuration | Define datasets, evaluators, and evals in an `evals/azure.eval.yaml` file so you can review and version evaluations alongside your app code. |
| Configuration scaffolding | Create a starting configuration with `azd ai eval init` from local project information and inputs you provide. It doesn't generate sample data, invoke an agent, or publish resources. See [Evaluation modes and registered datasets](#evaluation-modes-and-registered-datasets) for the limited service lookups it makes. |
| Dataset management | Publish local `.jsonl` files as versioned Foundry datasets, and list, inspect, and delete those versions. |
| Built-in and custom evaluators | Use Foundry's built-in evaluators, or publish your own rubric evaluators as versioned resources and download a published rubric back. |
| Test data generation | Generate a dataset, a rubric evaluator, or both with `azd ai eval generate`. Generation is separate from `init` and uses Foundry service calls. |
| Run inspection | Start runs, follow their status, read per-sample scores, and export a whole run as one JSON document. |

## Explore the workflow

The extension follows a familiar `azd` lifecycle from scaffolding to scored results:

1. **Prepare**: Supply a local `.jsonl` file or an existing registered dataset. Alternatively, use `azd ai eval generate` to generate data. For trace-based evaluations, the agent must already have produced traces.
1. **Scaffold**: Create an eval definition that references your data. `init` doesn't create a sample dataset.
1. **Create**: Publish the datasets and evaluators the configuration references, then create the eval in your Foundry project.
1. **Run**: Start an evaluation run against the eval and its dataset.
1. **Inspect**: Follow run status, read per-sample scores, and export results for reporting.
1. **Clean up**: Delete runs, evals, dataset versions, and evaluator versions you no longer need.

## Try it

Use this workflow with your own turn-level dataset and an existing agent. Commands that publish resources, generate data, or run evaluations connect to your Foundry project and can incur charges.

1. [Install or update the Azure Developer CLI](../install-azd.md), then install the evaluations extension.

    ```azdeveloper
    azd extension install azure.ai.evaluations
    ```

    This article describes version `1.0.0-beta.2` of the evaluations extension and of the [standalone datasets extension](foundry-datasets-extension.md). Each requires `azd` version `1.33.0` or later. The agents extension (`azure.ai.agents`) is a separate install. Its `1.0.0-beta.22` release requires `azd` version `1.37.0` or later. Install it only if you need agent-management commands. It's not required just to evaluate an existing agent.

    Check the core version and what is actually installed:

    ```azdeveloper
    azd version
    azd extension list --installed -o json
    azd ai eval version
    ```

    Confirm that `azd version` reports `1.33.0` or later. In the JSON listing, read `installedVersion`, not the catalog's `version`. Confirm the evaluations binary with `azd ai eval version`, and check `azd ai dataset version` too if you use the standalone datasets extension. To update an existing installation, run `azd extension update azure.ai.evaluations`.

    > [!IMPORTANT]
    > Version `1.0.0-beta.1` doesn't include the simulation authoring and registered-dataset identity behavior described later in this article. Use version `1.0.0-beta.2` or later for those workflows.

1. Sign in. In an empty working folder, initialize a minimal `azd` project and set your Foundry project endpoint. If you already have an `azd` project and environment, use them instead of initializing another project.

    ```azdeveloper
    azd auth login
    azd init --minimal --no-prompt -e eval-dev
    azd env set FOUNDRY_PROJECT_ENDPOINT "https://<resource-name>.services.ai.azure.com/api/projects/<project-name>"
    ```

    Replace the endpoint with your own project endpoint. Your identity needs permission to access that project and create evaluation resources.

1. Prepare a nonempty `.jsonl` file at `./data/rows.jsonl`, with one JSON object per line and the fields your evaluator requires. For this turn-level agent evaluation, include a `query` field. Replace `support-agent` with your deployed agent name and `judge-deployment` with a model deployment available in the project.

    ```azdeveloper
    azd ai eval init --name turn-quality --source dataset --evaluation-level turn --dataset ./data/rows.jsonl --target support-agent --judge-model judge-deployment --no-prompt
    ```

    `init` writes the configuration under `evals/` by default. It doesn't create the input file, discover remote agents or model deployments, or provision the resources named in the command.

1. Publish the declared local datasets and evaluators, and create the eval.

    ```azdeveloper
    azd ai eval create turn-quality
    ```

1. Start a run, then read the run and its per-sample results.

    ```azdeveloper
    azd ai eval run start --eval turn-quality
    ```

    ```azdeveloper
    azd ai eval run show --eval turn-quality
    ```

    ```azdeveloper
    azd ai eval run output list --eval turn-quality
    ```

1. Remove an eval and everything beneath it when you're finished:

    ```azdeveloper
    azd ai eval delete turn-quality
    ```

    The command asks you to confirm the delete. In scripts and pipelines, add `--force`. With `--no-prompt` or `-o json`, the command refuses to delete without it, and `azd` turns on `--no-prompt` automatically when it detects a CI/CD environment.

    > [!WARNING]
    > Deleting an eval also deletes its runs and results. Use it with care in shared projects.

## Evaluation modes and registered datasets

The following workflows require the evaluations extension version `1.0.0-beta.2` or later, which requires `azd` version `1.33.0` or later. Version `1.0.0-beta.1` doesn't support these workflows.

`init` works locally except for two lookups. The first lookup is a bounded, best-effort check of the built-in evaluators you select, including the default `builtin.task_completion`. It has a five-second timeout. If the catalog can't be read, `init` keeps the reference for later validation. If the catalog is read and doesn't list a built-in evaluator you named, `init` refuses the reference. The second lookup reads your Foundry project's connections to validate a qualified `connection-name/model-deployment` simulation model or to discover eligible connections. If that lookup fails, `init` stops without writing configuration. Cancelling the command still aborts it. These exceptions don't allow remote discovery of agents, models, or datasets, and `init` doesn't mutate service resources.

### Choose an evaluation mode

Choose a dataset shape and mode that match the work you want to score:

| Mode | Data you supply | Behavior when you run the eval |
|---|---|---|
| Turn | Request rows, including `query` for the agent input. | Invokes the target agent and scores individual request-response pairs. |
| Static conversation | Completed conversation rows containing messages. | Scores existing conversations without invoking a target agent. Don't pass `--target`. |
| Simulated conversation | Scenario seeds, including `test_case_description`, rather than completed messages. | A simulation model plays the user against the target agent, then evaluators score the resulting conversations. |

For simulation, `init` checks local seed files before writing configuration, including local files referenced by existing declarations. Each `test_case_description` must contain text, up to 2,500 characters. If you supply `desired_num_turns`, nest it under `simulation_configuration`. A top-level `desired_num_turns` field is rejected. Use a positive whole number that doesn't exceed the row's `simulation_configuration.max_num_turns`, or otherwise an explicit `--max-turns` limit, or the service default of 20. A seed row must not also contain `messages`, `query`, or `response`, even with an empty or null value.

Interactive `init` lets you correct or replace an invalid local file before confirmation. If a replacement would bind a different file to an existing dataset name, `init` reports a conflict instead of replacing the declaration. Cancelling preserves the configuration files. When you use `--no-prompt` or JSON output, `init` rejects invalid input without writing configuration. These checks don't fetch registered datasets that have no local file; the limited service lookups described earlier remain the only service-call exceptions.

For static conversations, supply a registered dataset of completed transcripts:

```azdeveloper
azd ai eval init --name static-quality --conversation-mode static --dataset completed-transcripts --judge-model judge-deployment --no-prompt
```

For simulation, supply a registered seed dataset, an agent, and separate simulation and judge model choices:

```azdeveloper
azd ai eval init --name simulation-quality --conversation-mode simulation --target support-agent --dataset scenario-seeds --simulation-model simulator-deployment --judge-model judge-deployment --num-conversations 1 --max-turns 5 --no-prompt
azd ai eval create simulation-quality
azd ai eval run start --eval simulation-quality
azd ai eval run show --eval simulation-quality
```

Replace all dataset, agent, and model deployment names with resources in your project. `--conversation-mode` implies `--source dataset` and `--evaluation-level conversation`. For conversation datasets, interactive `init` offers static or simulation mode. With `--no-prompt` or JSON output, omitting the mode selects static, not simulation.

`--num-conversations` accepts 1 through 5 conversations per seed and defaults to 1. `--max-turns` accepts 1 through 20; omit it for the service default. An explicit zero isn't valid. Simulation-only flags aren't valid for turn or static evaluations. Use evaluators compatible with conversation-level scoring.

### Keep model roles separate

The model deployments serve different purposes:

| Option | Role |
|---|---|
| `generate --generation-model` | Generates the dataset or rubric before evaluation. |
| `init --simulation-model` | Plays the simulated user during a simulation run. |
| `init --judge-model` | Grades the agent's output with model-based evaluators. |

These roles are also distinct from the target agent's own model. You can explicitly select the same deployment for more than one role, but the simulator isn't inferred from the generation or judge model.

To generate conversation seeds from an existing agent's instructions:

```azdeveloper
azd ai eval generate --dataset --from prompt --target support-agent --evaluation-level conversation --generation-model seed-deployment --dataset-name scenario-seeds --max-samples 15 --no-prompt
```

Use `--from prompt` for this unattended example. Agent-seeded generation can fail in the service, and `--no-prompt` doesn't approve a second, billable prompt-only retry. If the extension can't read the target agent's instructions, supply them with `--agent-instruction-file <path>`.

This command generates scenario seeds, not completed conversations. Follow the printed `init` command, which selects simulation mode and preserves the configuration path. It deliberately leaves unresolved simulation and judge models for you to choose. For unattended use, supply `--simulation-model`, `--judge-model`, any other unresolved inputs, and `--no-prompt`, as in the simulation example.

`generate --max-samples` sets how many rows to synthesize, from 15 to 1000, and defaults to 15. It applies to dataset generation only, and it isn't a simulation-run sample cap. Generation belongs to the evaluations extension, not the standalone datasets extension.

### Preserve registered dataset identity

Registered datasets use their service-issued `file_id`, even when the configuration keeps the local `file` used to publish them. The extension can download rows for validation without replacing the registered reference with inline data. A failed registered-dataset lookup or missing service ID stops the run instead of silently falling back to inline content. Simulation also requires registered seeds and doesn't accept a positive sample cap.

`init --dataset` accepts either a local `.jsonl` path or a registered dataset name. To pin an existing registered version, keep the rest of the generated configuration and set its entry in `datasets` as follows:

```yaml
datasets:
  - name: scenario-seeds
    version: "1.0"
```

The eval's `dataset` field references `scenario-seeds`. A reference-only entry doesn't republish that registered version. A declaration's `version` takes precedence over the locally recorded publication version; if neither exists, the extension uses the service's latest version. Pin a version for repeatable runs.

Unlike `init --dataset`, `run start --dataset` accepts only a dataset entry name already declared in the configuration. It isn't a local path, a raw service ID, or a version selector. There is no `--dataset-version` or `--dataset-id` option. A run started only from an eval ID doesn't support this dataset override.

A positive `run start --max-samples` or configured `maxSamples` isn't supported for registered datasets. For turn or static evaluations, the extension reports a `conflicting_arguments` error rather than submitting an inline subset and losing identity. Remove the cap, or explicitly override a configured cap for a declared turn or static eval:

```azdeveloper
azd ai eval run start --eval turn-quality --max-samples 0
```

A simulation declaration can't set a positive `maxSamples`. Remove it, or set it to `0` for no cap. A `--max-samples 0` flag doesn't make a declaration with a positive `maxSamples` valid.

For turn or static evaluations, a genuinely unregistered local dataset can use inline rows with or without a sample cap. The extension first confirms that no registered version exists. An empty version listing alone isn't enough, and authentication, service, or incomplete-listing errors don't establish absence. This local-data path doesn't publish a dataset or bypass the registered-dataset identity rules.

To evaluate fewer rows while preserving registered identity, publish a deliberately smaller dataset and select it in the configuration. The extension doesn't automatically publish temporary subsets. This run limit is separate from `generate --max-samples`, `--num-conversations`, and `--max-turns`.

## Input, generation, and mapping behavior

These behaviors apply to evaluations version `1.0.0-beta.2`.

### Author inputs without overwriting data

The `init` command validates local JSONL object rows in every dataset mode before creating configuration, locks, ignore files, or artifact directories. Empty datasets, malformed JSON, arrays, scalars, and empty objects fail without those writes. The configuration destination must not resolve to the input dataset itself.

Default evaluation names identify the source, mode, and evaluation level. An explicit `--name` wins, existing declarations aren't renamed, and numeric suffixes resolve actual name collisions. Static mode doesn't acquire an invocation target from a naming hint.

Simulation uses `--simulation-model`, which accepts a model name or `connection-name/model-deployment`, and nested per-row `simulation_configuration` settings. The CLI passes a plain model name unchanged and validates a qualified reference against your project's connections. A desired turn count must fit the row's maximum, or otherwise `--max-turns`, or the default of 20. These settings aren't a guarantee of exact completed turns.

On Windows, `azd` 1.33.0 expands environment-variable references written as `%NAME%` in command arguments before it starts the extension. Avoid file names that contain this syntax, for example `%TEMP%`.

### Supply instructions and review generated names

When generation can't obtain instructions, the interactive choices are **Type instructions** and **Load from file**. Enter a nonempty text file's path without shell quotes at the prompt. Invalid paths can be corrected, and cancellation stops before job submission. The confirmation shows the source filename rather than instruction contents.

Explicit `--agent-instruction` and `--agent-instruction-file` values take precedence. Unattended generation reports missing instructions instead of prompting. Generated names use the agent's declared deployed name, while submission preserves the original target selector.

Generated dataset names have a 50-character limit. Long defaults are shortened deterministically; overlong explicit `--dataset-name` values fail instead of being truncated. Evaluator names and existing artifact lookups don't inherit this dataset-generation limit.

### Map real evaluator inputs

For standard datasets and traces, the defaults contain exactly these mappings:

| Evaluation level | Default `dataMapping` entries |
|---|---|
| Turn | `query: "{{item.query}}"`, `response: "{{item.response}}"`, `tool_calls: "{{item.tool_calls}}"`, `tool_definitions: "{{item.tool_definitions}}"`. |
| Conversation | `messages: "{{item.messages}}"`, `tool_definitions: "{{item.tool_definitions}}"`. |

Model output keeps `sample.output_text`; agent output and stored responses keep `sample.output_items` or `sample.output_text`, depending on evaluator response type. Generated tool fields retain their `sample` source. A trace filter doesn't invoke an agent.

The extension sends these entries to the service as `data_mapping`. In `azure.eval.yaml`, set `dataMapping` in an evaluator reference to override them. Explicit mappings override defaults. Use either `messages` or the turn `query`/`response` format. The client doesn't infer `context` or `ground_truth`; supply actual supporting data and map those inputs when required.

Primary mapped inputs must exist in every applicable dataset row before dependency publication. Optional tool columns aren't made required, and generated outputs aren't treated as input columns. This validation doesn't prove that groundedness or another hosted evaluator scores successfully.

Stored evaluation mappings are immutable. To migrate deliberately, record the old ID, remove an explicit `id:` pin or use a separate unpinned declaration, and set the intended mappings. Change an evaluator reference's criterion `name`, then run `azd ai eval create <eval-name>` and inspect the new ID and mappings. Changing only the evaluation group's name isn't sufficient. Old runs remain available through the recorded ID; compatible time-window and response-ID filters don't discard history.

### Edit rubric fields separately from metadata

Rubric generation, job collection, and downloads emit `type: "rubric"`, `dimensions`, and `pass_threshold` when you supply it. They preserve unknown definition and dimension fields. Known dimension fields are `id`, `description`, `weight`, and `always_applicable`. Weights are integers from 1 to 10; thresholds are between 0 and 1.

Catalog metadata and service envelopes aren't part of this editable rubric. Publishing an edit preserves existing metadata unless you explicitly replace it. Prompt-based evaluator documents remain separate. Inspect the full service response with `azd ai eval evaluator show <name> --version <version> -o json`.

## When to use the evaluations extension

Microsoft Foundry supports several ways to evaluate generative AI applications, including the Python SDK and the Foundry portal. The `azd` evaluations extension is the best fit when you want to:

- **Work primarily from the terminal or editor** with a scriptable, repeatable workflow.
- **Keep evaluations under source control** by declaring datasets, evaluators, and evals in a configuration file that you review like any other code.
- **Run the same evaluation locally and in CI/CD** without rewriting it for each environment.
- **Use the `azd` lifecycle you already know** alongside the other Microsoft Foundry extensions.

To explore evaluators interactively or to author evaluations with the Python SDK, start with the [Microsoft Foundry documentation](/azure/foundry/) instead.

## Related content

- [Extensions overview](overview.md)
- [Microsoft Foundry agent extension overview](azure-ai-foundry-extension.md)
- [Microsoft Foundry datasets extension overview](foundry-datasets-extension.md)
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](/azure/foundry/)

---
title: Microsoft Foundry evaluations extension overview
description: Learn about the Microsoft Foundry evaluations extension, which lets you define, run, and inspect Microsoft Foundry evaluations from your terminal.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/13/2026
ms.service: azure-dev-cli
ms.topic: overview
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Microsoft Foundry evaluations extension overview

The Azure Developer CLI (`azd`) Microsoft Foundry evaluations extension (`azure.ai.evaluations`) defines, runs, and inspects evaluations for Microsoft Foundry from your terminal or editor. It keeps datasets, evaluators, and evaluation definitions in a configuration file under source control, so the same evaluation runs the same way on a laptop and in a pipeline. You can go from an empty project to scored results with a few commands.

This article introduces the extension. For evaluation concepts, metrics, and guidance on choosing evaluators, see the [Microsoft Foundry documentation](/azure/ai-foundry/).

> [!NOTE]
> `azd` extensions are currently in beta.

## Key features

| Feature | Description |
|---|---|
| Declarative configuration | Defines datasets, evaluators, and evals in an `evals/azure.eval.yaml` file so evaluations are reviewable and versioned alongside your app code. |
| Offline scaffolding | Creates a starting configuration with `azd ai eval init`, which inspects the local project and makes no service calls. |
| Dataset management | Publishes local `.jsonl` files as versioned Foundry datasets, and lists, inspects, and deletes those versions. |
| Built-in and custom evaluators | Uses Foundry's built-in evaluators, or publishes your own prompt-based evaluators as versioned resources. |
| Test data generation | Generates a dataset and a matching rubric evaluator from an agent definition with `azd ai eval generate`. |
| Run inspection | Starts runs, follows their status, and reads per-sample results, including export to CSV, JSON, or JSONL. |

## Explore the workflow

The extension follows a familiar `azd` lifecycle from scaffolding to scored results:

1. **Scaffold**: Generate an evaluation configuration for the project, including a sample dataset and an eval definition.
1. **Create**: Publish the datasets and evaluators the configuration references, then create the eval in your Foundry project.
1. **Run**: Start an evaluation run against the eval and its dataset.
1. **Inspect**: Follow run status, read per-sample scores, and export results for reporting.
1. **Clean up**: Delete runs, evals, dataset versions, and evaluator versions you no longer need.

## Try it

Try scoring a sample evaluation with the bare-minimum workflow.

1. Install the extension:

    ```azdeveloper
    azd extension install azure.ai.evaluations
    ```

1. Scaffold an evaluation configuration in your project folder:

    ```azdeveloper
    azd ai eval init
    ```

    > [!TIP]
    > `azd ai eval init` only writes files, so it's safe to run before you have a Foundry project selected.

1. Publish the datasets and evaluators, and create the eval:

    ```azdeveloper
    azd ai eval create
    ```

1. Start a run and inspect the scores:

    ```azdeveloper
    azd ai eval run start
    ```

    ```azdeveloper
    azd ai eval run show
    ```

1. Remove an eval and everything beneath it when you're finished:

    ```azdeveloper
    azd ai eval delete <eval>
    ```

    > [!WARNING]
    > Deleting an eval also deletes its runs and results. Use it with care in shared projects.

## When to use the evaluations extension

Microsoft Foundry supports several ways to evaluate generative AI applications, including the Python SDK and the Foundry portal. The `azd` evaluations extension is the best fit when you want to:

- **Work primarily from the terminal or editor** with a scriptable, repeatable workflow.
- **Keep evaluations under source control** by declaring datasets, evaluators, and evals in a configuration file that's reviewed like any other code.
- **Run the same evaluation locally and in CI/CD** without rewriting it for each environment.
- **Use the `azd` lifecycle you already know** alongside the other Microsoft Foundry extensions.

To explore evaluators interactively or to author evaluations with the Python SDK, start with the [Microsoft Foundry documentation](/azure/ai-foundry/) instead.

## Related content

- [Extensions overview](overview.md)
- [Microsoft Foundry agent extension overview](azure-ai-foundry-extension.md)
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](/azure/ai-foundry/)

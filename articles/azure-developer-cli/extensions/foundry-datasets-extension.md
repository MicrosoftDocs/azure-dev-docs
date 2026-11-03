---
title: Microsoft Foundry datasets extension overview
description: Learn about the Microsoft Foundry datasets extension, which lets you register and manage versioned Microsoft Foundry datasets from your terminal.
author: m7md7sien
ms.author: mohessie
ms.date: 10/25/2026
ms.service: azure-dev-cli
ms.topic: overview
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Microsoft Foundry datasets extension overview

The Azure Developer CLI (`azd`) Microsoft Foundry datasets extension (`azure.ai.dataset`) registers and manages versioned datasets in a Microsoft Foundry project from your terminal or editor. A dataset is the set of inputs an evaluation runs against, so keeping it versioned is what makes two evaluation results comparable. The extension publishes a local `.jsonl` file, or a folder that contains one, as a new version, and lists, inspects, and removes the versions already registered.

This article introduces the extension. For dataset concepts and how evaluations consume them, see the [Microsoft Foundry documentation](/azure/foundry/).

## Key features

| Feature | Description |
|---|---|
| Versioned publishing | Registers a local `.jsonl` file, or a folder that contains one, as a dataset version, choosing the next version from what the project already carries. |
| Local validation | Refuses a malformed row, an empty dataset, a name the service doesn't accept, and a folder that could mean more than one dataset, before sending any request. |
| Version history | Lists the versions of a dataset, so you can see what an earlier evaluation ran against. |
| Content retrieval | Reads a dataset's contents back, whether the service hands out a file or the container holding it. |
| Scriptable output | Supports `-o json` on every command and `--no-prompt` for unattended use. |

## Explore the workflow

1. **Prepare**: Write or export the rows you want to evaluate against as a `.jsonl` file.
1. **Register**: Publish the file as the dataset's first version.
1. **Iterate**: Publish a new version when the data changes; earlier versions stay addressable.
1. **Inspect**: List versions and read back what a given version contains.
1. **Clean up**: Delete versions you no longer need.

## Try it

You need an existing Foundry project, permission to manage its datasets, and a nonempty local `.jsonl` file with one JSON object per line. The example uses your file at `./data/rows.jsonl`; the extension doesn't create sample data for you.

1. [Install or update the Azure Developer CLI](../install-azd.md), then install the standalone datasets extension.

    ```azdeveloper
    azd extension install azure.ai.dataset
    ```

    This article describes version `1.0.0-beta.2` of the datasets extension, which requires `azd` version `1.33.0` or later. You don't need the evaluations or agents extension to register and manage datasets. If you also install the evaluations extension, version `1.0.0-beta.2` has the same `azd` version requirement. The agents extension is a separate install, and its `1.0.0-beta.22` release requires `azd` version `1.37.0` or later, as the [evaluations overview](foundry-evaluations-extension.md#try-it) explains.

    Verify the installed binary, not just the latest version advertised by a registry:

    ```azdeveloper
    azd version
    azd extension list --installed -o json
    azd ai dataset version
    ```

    In the JSON listing, read `installedVersion`, not the catalog's `version`. A newer extension can require a newer `azd` version. To update an existing installation, run `azd extension update azure.ai.dataset`, then check the installed version again.

1. Sign in. In an empty working folder, initialize a minimal `azd` project and set your Foundry project endpoint. If you already have an `azd` project and environment, use them instead.

    ```azdeveloper
    azd auth login
    azd init --minimal --no-prompt -e dataset-dev
    azd env set FOUNDRY_PROJECT_ENDPOINT "https://<resource-name>.services.ai.azure.com/api/projects/<project-name>"
    ```

    Replace the endpoint with your own project endpoint. The following commands manage resources in that project.

1. Register a local file as a dataset.

    ```azdeveloper
    azd ai dataset create my-dataset --from-file ./data/rows.jsonl
    ```

1. Publish a new version after the data changes.

    ```azdeveloper
    azd ai dataset update my-dataset --from-file ./data/rows.jsonl
    ```

    Without `--version`, the CLI chooses the next version after the latest registered version, for example, `2.0` after `1.0`. An explicit `--version` publishes that exact version instead.

1. See what is registered, and what versions a dataset has.

    ```azdeveloper
    azd ai dataset list
    ```

    ```azdeveloper
    azd ai dataset versions list my-dataset
    ```

    The `list` and `versions list` commands show 20 rows by default. Use `--limit` to show a different number of rows, or `--all` to show every row.

1. Read a specific version's contents back to disk.

    ```azdeveloper
    azd ai dataset download my-dataset --version 1.0
    ```

    Creating a dataset without `--version` publishes version `1.0`. Use `versions list` to find subsequent versions. Omitting `--version` when downloading selects the latest version, so specify it when you need reproducible input data.

1. Remove a version when you no longer need it.

    ```azdeveloper
    azd ai dataset delete my-dataset --version 1.0
    ```

    The command asks you to confirm the delete. In scripts and pipelines, add `--force`. With `--no-prompt` or `-o json`, the command refuses to delete without it, and `azd` turns on `--no-prompt` automatically when it detects a CI/CD environment.

    > [!WARNING]
    > Deleting a version removes it from the project. An evaluation pinned to that version can no longer run.

## Choose a download destination

For a dataset registered as a single file, use `--output-file` to choose the exact destination. This option is valid only for a single-file dataset, in both `azd ai dataset download` and `azd ai eval dataset download`.

```azdeveloper
azd ai dataset download my-dataset --version 1.0 --output-file my-dataset-1.0.jsonl
```

For a folder dataset, use `--output-dir downloads` instead, even if the folder contains only one file. For container-backed data, single-file output requires single-file dataset metadata and a complete listing that resolves to exactly one file. Use `--force` only when you intend to overwrite an existing destination.

## When to use the datasets extension

The `azd` datasets extension is the best fit when you want to:

- **Work primarily from the terminal or editor**, with a scriptable, repeatable workflow.
- **Keep evaluation data under version control** alongside the app it tests, and publish it the same way each time.
- **Publish from CI/CD** without a portal step.

The [Microsoft Foundry evaluations extension](foundry-evaluations-extension.md) can also declare datasets as part of an evaluation configuration and reconcile them for you. Use this extension when you want to manage datasets on their own, and that one when the dataset is one piece of a larger evaluation you keep in a config file.

The evaluations extension also has an `azd ai eval dataset` command group for managing datasets within an evaluation workflow. It and `azd ai dataset` work on the same dataset catalog when you configure them for the same Foundry project, so you don't copy a dataset between them. Their flags and output formats can differ, so check each command's `--help` output.

To generate data, use `azd ai eval generate` from the evaluations extension. The standalone datasets extension registers and manages data you supply; it doesn't generate evaluation rows, simulation seeds, or evaluators.

For evaluations that must retain the registered dataset's identity and version, see [Preserve registered dataset identity](foundry-evaluations-extension.md#preserve-registered-dataset-identity). Those run-time guarantees and the unsupported-cap error come from the evaluations extension version `1.0.0-beta.2` or later, not from the standalone datasets extension.

## Related content

- [Microsoft Foundry evaluations extension overview](foundry-evaluations-extension.md)
- [Extensions overview](overview.md)
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](/azure/foundry/)

---
title: Azure Developer CLI reference
description: Reference for Azure Developer CLI.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---

# Currently supported commands

Listed in alphabetical order:

- [Deploy](#deploy)
- [Env](#env)
- [Infra](#infra)
- [Init](#init)
- [Monitor](#monitor)
- [Pipeline](#pipeline)
- [Provision](#provision)
- [Up](#up)

### `init`

`azd init` sets up a project from an Azure Dev CLI enabled template. The command prompts for configuration settings like environment name, Azure region and Azure Subscription to use for creating the Azure resources. All configurations are stored in the `.env` file found in the `.azure` folder.

### `env`

`azd env` is a subgroup command for managing environments. Supported commands:

- list: List environments.
- new: Create a new environment.
- refresh: Refresh environment settings using information from previous provisioning.
- select: Set the default environment.
- set: Set a value in the environment. For example: `azd env set <KEY> <VALUE>`.

### `provision`

`azd provision` creates or updates the Azure resources for your project. `provision` is an alias for `azd infra create`.

### `infra`

`azd infra` is a group command for managing Azure resources. Subcommands:

- create - creates Azure resources
- delete - deletes Azure resources

### `deploy`

`azd deploy` builds and publishes the application code into previously created Azure resources.

### `up`

`azd up` is a **single step** command to initialize a project (`azd init`), provision Azure resources (`azd provision`), and deploy the application code to Azure (`azd deploy`.) 

### `pipeline`

`azd pipeline config` pushes your local code to your GitHub repo and configures a GitHub Action so that the build and deploy job is automatically kicked off when you commit code to your GitHub repo.

### `monitor`

`azd monitor` launches a browser to show a dashboard for monitoring the cloud application. Available sub commands: 

1. `--overview` to open the "Overview" dashboard.
1. `--live` to open the "Live Metrics" dashboard.
1. `--log` to open the "Logs" dashboard.

> [!NOTE]
> * Text-based browser is not supported.
> * Live metrics is currently not supported for Python application. For more information, see: [Live Metrics Stream: Monitor & Diagnose with 1-second latency](/azure/azure-monitor/app/live-stream).

## Try out

TBA

## See also

TBA

## Features to be added in the future

### `debug`
(COMING) `azd debug` starts debugging the application locally.

### `diff`
(COMING) `azd diff` evaluates your local changes to resource definitions against what is currently provisioned to the cloud.

### `generate`
(COMING) `azd generate` produces boilerplate infrastructure as code assets, for example, CI/CD pipeline etc.

### `login`
(COMING) `azd login` signs into the cloud platform.

### `run`
(COMING) `azd run` executes the application locally.

### `test`
(COMING) `azd test` runs local unit tests.
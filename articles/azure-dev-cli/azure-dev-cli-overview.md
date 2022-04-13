---
title: Use the Azure Developer CLI
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# What is the Azure Developer CLI

The Azure Developer CLI (**azure-dev**) is a developer-centric command-line interface (CLI) tool for cloud applications. `az dev` has several sub-commands that allow developers to execute a number of actions (e.g., manage developer workflows, cloud resources, interactions with continuous integration and delivery (CI/CD) system, etc.)

## Currently supported commands

Listed in alphabetical order:
- [Deploy](#deploy)
- [Env](#env)
- [Infra](#infra)
- [Init](#init)
- [Monitor](#monitor)
- [Pipeline](#pipeline)
- [Provision](#provision)
- [Up](#up)

[Azure dev enabled templates](azure-dev-cli-templates.md) are end to end sample repositories created using the azure-dev conventions so that you can use `az dev cli` to easily get started with Azure. All templates have the same file structure:

```bash

├── .github                    [ Configure GitHub workflow ]
├── .vscode                    [ VS Code workspace ]
├── assets                     [ Assets used by README.MD ]
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ Main infrastructure file ]
│   ├── main.parameters.json   [ Parameters file ]
│   └── resources.bicep        [ Resources file ]
├── src                        [ Contains folder(s) for the application code ]
└── azure.yaml                 [ Describes the application and type of Azure resources]

```

## `init`
`az dev init` sets up a project from an Azure Dev CLI enabled template. The command prompts for configuration settings like environment name, Azure region as well as Azure Subscription to use for creating the Azure resources. All configurations are stored in the `.env` file found in the `.azure` folder.

## `env`

`az dev env` is a subgroup command for managing environments. Supported commands:
- list    : List environments.
- new     : Create a new environment.
- refresh : Refresh environment settings using information from previous provisioning.
- select  : Set the default environment.
- set     : Set a value in the environment. Example: `az dev env set <KEY> <VALUE>`

## `provision`
`az dev provision` creates or updates the Azure resources for your project. `provision` is an alias for `az dev infra create`.

## `infra`

`az dev infra` is a group command for managing Azure resources. Subcommands:
- create - creates Azure resources
- delete - deletes Azure resources

## `deploy`

`az dev deploy` builds and publishes the application code into previously created Azure resources.

## `pipeline`

`az dev pipeline config` pushes your local code to your GitHub repo and configures a GitHub Action so that the build and deploy job is automatically kicked off when you commit code to your GitHub repo.
	

## `monitor`

`az dev monitor` launches a browser to show a dashboard for monitoring the cloud application. Available sub commands: 
1. `--overview` to open the "Overview" dashboard.
1. `--live` to open the "Live Metrics" dashboard.
1. `--log` to open the "Logs" dashboard.

>**Note**:
> * Text-based browser is not supported.
> * Live metrics is currently not supported for Python app refer to [this](https://docs.microsoft.com/en-us/azure/azure-monitor/app/live-stream#get-started) for more information.

# Features to be added in the future

## `debug`
(COMING) `az dev debug` starts debugging the application locally.

## `diff`
(COMING) `az dev diff` evaluates your local changes to resource definitions against what is currently provisioned to the cloud.

## `generate`
(COMING) `az dev generate` produces boilerplate infrastructure as code assets, e.g. CI/CD pipeline etc.

## `login`
(COMING) `az dev login` signs into the cloud platform.

## `run`
(COMING) `az dev run` executes the application locally.

## `test`
(COMING) `az dev test` runs local unit tests.
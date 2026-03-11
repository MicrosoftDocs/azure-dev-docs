---
title: Prepare Infrastructure and Deploy Applications
titleSuffix: GitHub Copilot Modernization Agent
description: Learn how to use the GitHub Copilot modernization agent to prepare Azure infrastructure and containerize and deploy your application.
author: KarlErickson
ms.author: karler
ms.reviewer: honc
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 03/11/2026
---

# Prepare infrastructure and deploy applications with the GitHub Copilot modernization agent

The GitHub Copilot modernization agent supports infrastructure provisioning, containerization, and deployment. These capabilities follow the same **plan create → plan execute** model used throughout the agent.

The workflow consists of two phases:

1. **Infrastructure preparation**: Generate and provision Azure infrastructure.
1. **Containerization and deployment**: Containerize and deploy the application.

> [!NOTE]
> These two phases are independent. You can run them together or use each phase separately. For example, skip infrastructure preparation if you already have an environment provisioned, or prepare infrastructure now and deploy later.

## Prerequisites

- **An Azure subscription**: An active Azure subscription for infrastructure provisioning.
- **Modernize CLI**: Follow the [quickstart](quickstart.md) to install and authenticate.

## Phase 1: Infrastructure preparation

The modernization agent creates a plan to provision Azure infrastructure based on the inputs you provide. This capability includes the ability to design an [Azure landing zone](/azure/cloud-adoption-framework/ready/landing-zone/) tailored to your application, covering networking, identity, governance, and security foundations.

### Inputs

The agent can use various inputs to inform the infrastructure plan:

- **Application source code**: Codebase analysis to determine technology stack, dependencies, and resource requirements.
- **Assessment reports**: Reports from `modernize assess`, Azure Migrate, or other migration and assessment tools.
- **Architecture diagrams**: Pre-migration architecture diagrams or design documents in the repository.
- **Compliance and security requirements**: Organizational policies, security standards, or landing zone guidelines, provided as documents in the repository or as natural language in your prompt.

### Create the infrastructure plan

Use `modernize plan create` with a prompt describing your infrastructure needs:

```bash
modernize plan create "help create azure infrastructure for my app" --plan-name infra-setup
```

The agent generates a plan that includes a proposed Azure architecture and a detailed resource list to be provisioned. By default, the plan covers both IaC file generation and resource provisioning. You can request only IaC file generation through your prompt.

> [!TIP]
> Combine different inputs and preferences in your prompt. For example:
>
> - `"create an Azure landing zone tailored to my application's architecture and requirements"`
> - `"create azure infrastructure based on the assessment report, following our compliance policies in docs/security-requirements.md"`
> - `"generate Bicep files for the target architecture in the design doc, don't provision yet"`
> - `"provision azure resources based on the architecture diagram and assessment findings"`

### Review the plan

Review the output files before execution:

- **Plan file** (`.github/modernize/infra-setup/plan.md`): Infrastructure strategy and proposed architecture.
- **Task list** (`.github/modernize/infra-setup/tasks.json`): Specific tasks the agent performs.

You can edit both files to adjust resource configurations or modify the approach before execution.

### Execute the infrastructure plan

Execute the plan:

```bash
modernize plan execute --plan-name infra-setup
```


### Verify infrastructure

Review the generated infrastructure code and confirm the Azure resources through the Azure portal or Azure CLI:

```bash
git status
git diff main
```

## Phase 2: Containerization and deployment

Use a second plan to containerize your application and deploy it.

> [!NOTE]
> This phase requires application source code that you already migrated or upgraded. Complete your code modernization before proceeding with containerization and deployment.

### Create the deployment plan

```bash
modernize plan create "containerize and deploy my app to azure, subscription: <sub-id>, resource group: <rg-name>" --plan-name deploy
```

You can containerize and deploy together, or handle them separately with individual plans.

- **Containerization**: Generates a Dockerfile for your project and validates the container image build.
- **Deployment**: Creates all required configuration files and manifests based on the target Azure hosting service, deploys the application, and generates a reusable deployment script for future use.

> [!TIP]
> Customize the prompt to match your needs:
>
> - `"containerize my app and create dockerfile"`: containerize only, without deploying.
> - `"deploy my app to the AKS cluster in subscription: <sub-id>, resource group: <rg-name>"`: deploy an already containerized application.

### Review the plan

Review the generated plan files:

- **Plan file** (`.github/modernize/deploy/plan.md`): Containerization and deployment strategy.
- **Task list** (`.github/modernize/deploy/tasks.json`): Specific deployment tasks.

### Execute the deployment plan

```bash
modernize plan execute --plan-name deploy
```

### Verify the deployment

1. **Review code changes**: Check the generated Dockerfile, deployment manifests, and configuration changes.

    ```bash
    git status
    git diff main
    ```

1. **Validate the running application**: Access your deployed application through the URL provided by the target hosting service.

## Use interactive mode

You can also perform both phases through the interactive TUI by running `modernize` and selecting **Create modernization plan** from the menu.

## Next steps

- [Learn about CLI commands](cli-commands.md)
- [Create custom skills for your organization](customization.md)
- [Return to overview](overview.md)

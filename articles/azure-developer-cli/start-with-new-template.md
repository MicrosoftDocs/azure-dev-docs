---
title: Start with a New azd Template
description: Start a new Azure Developer CLI (azd) template by using the GitHub Copilot integration, another AI coding assistant, or direct file authoring.
ms.date: 09/11/2026
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Start with a new Azure Developer CLI (azd) template

You can use different authoring methods to build the standard files in a new Azure Developer CLI (`azd`) template:

- **Use the GitHub Copilot integration in `azd init`.** The built-in workflow analyzes existing project files or helps you plan a new project, creates the template assets, and runs predeployment validation.
- **Use another AI coding assistant.** Ask the assistant to create the same `azure.yaml`, infrastructure-as-code, application, and supporting files without integrating directly with `azd init`.
- **Author the files directly.** Create and edit the template assets yourself when you want complete control or don't use an AI coding assistant.

This article focuses primarily on the built-in GitHub Copilot workflow because it provides a guided experience integrated with `azd`. Regardless of the authoring method, review and validate every file before deployment.

> [!IMPORTANT]
> The GitHub Copilot integration in `azd init` is in preview. Preview features can change before general availability. For more information, see the [`azd` feature versioning and release strategy](feature-versioning.md).

The generated assets are standard, editable `azd` template files. After initialization, you can update them directly or with any AI coding assistant.

## Prerequisites for GitHub Copilot

To use the built-in Copilot workflow, you need:

- Azure Developer CLI 1.23.11 or later.
- An active GitHub Copilot subscription.
- Git, which `azd init` uses to inspect the working tree before modifying files.
- An interactive terminal session.

If you aren't already authenticated with GitHub Copilot, `azd` prompts you to sign in.

Run `azd version` to check the installed Azure Developer CLI version.

> [!NOTE]
> The `azd init` workflow starts a dedicated GitHub Copilot agent session in the terminal. It doesn't use or continue an active GitHub Copilot Chat session in Visual Studio Code.

## Build with GitHub Copilot

1. Open a terminal in the directory where you want to build the template.

   > [!NOTE]
   > The directory can contain an existing application, an infrastructure project, or the initial files for a new solution. If the directory contains uncommitted changes, `azd` asks you to confirm before continuing. Commit or stash important changes first.

1. Run `azd init`:

   ```azdeveloper
   azd init
   ```

1. Select **Set up with GitHub Copilot (Preview)**.

   The initialization prompt resembles the following example:

   ```output
   ? How do you want to initialize your app?
      Scan current directory
      Select a template
   > Set up with GitHub Copilot (Preview)
   ```

1. Review the requested tool access, and grant access to the tools required for the workflow. Copilot uses `azd` and Azure development capabilities to inspect the project, create files, and validate the result.

1. Select a model and reasoning level if `azd` prompts you to configure them.

   On the first run, the prompts use the following labels. The available model and reasoning choices depend on your GitHub Copilot account and the selected model:

   ```output
   ? Select AI model
   ? Select reasoning effort level
   ```

1. Describe what you want to build. Include relevant requirements such as:

   - Whether the template includes application code, infrastructure only, or both.
   - The application languages and frameworks, if known.
   - The Azure services and hosting platform to use.
   - Whether to use Bicep or Terraform.
   - Security, networking, scaling, and region requirements.

   For example:

   ```text
   Build an infrastructure-only azd template that provisions an Azure Container Apps
   environment, Azure Container Registry, and Log Analytics workspace with Bicep.
   Use managed identity and least-privilege role assignments. Parameterize the location
   and environment name so the template can be reused.
   ```

1. Answer any architecture or configuration questions from Copilot. The agent prepares the project for Azure, generates the template assets, and runs predeployment validation.

1. Review the overall structure of the files that Copilot created or changed. Confirm that the template includes the expected project configuration, infrastructure directory, application source, and supporting assets for your solution.

   For example, a generated infrastructure-only template might contain the following key files:

   ```text
   azure.yaml
   infra/
   ├── main.bicep
   ├── main.parameters.json
   └── modules/
      ├── container-apps-environment.bicep
      └── container-registry.bicep
   ```

   For detailed guidance on reviewing the configuration and infrastructure contents, see [Explore and edit template files](explore-edit-templates.md).

## Provision and deploy the template

After you approve the generated files, run the following command:

```azdeveloper
azd up
```

The command creates or selects an `azd` environment, provisions the Azure resources, packages any application services, and deploys them. For a detailed command breakdown, see [Explore the `azd up` workflow](azd-up-workflow.md).

## Use another authoring method

Other AI coding assistants aren't connected directly to the `azd init` workflow, but they can create the same standard template assets. You can also author every asset directly.

Create these assets yourself, or ask another coding assistant to analyze your requirements and create them:

- An `azure.yaml` file that defines the project and deployable services.
- Bicep or Terraform files that provision the required Azure resources.
- Resource outputs and application environment variables.
- Dockerfiles, deployment configuration, and supporting scripts when required.

To provide a minimal starting point before using another agent, run:

```azdeveloper
azd init --minimal
```

If you use another coding assistant, instruct it to follow the [`azure.yaml` schema](azd-schema.md), Azure infrastructure security practices, and the template conventions described in [Azure Developer CLI templates](azd-templates.md). If you author the files directly, use the same references as your implementation guide. Review and validate all files before you run `azd up`.

## Related content

- [Template development overview](build-templates-overview.md)
- [Explore and edit template files](explore-edit-templates.md)
- [Start from an existing template](start-with-existing-template.md)
- [Extend a template](extend-template.md)
- [Explore the `azd init` workflow](azd-init-workflow.md)

[!INCLUDE [request-help](includes/request-help.md)]

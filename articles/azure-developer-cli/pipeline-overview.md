---
title: Configure a pipeline and push updates using GitHub Actions or Azure DevOps
description: Learn how to push updates using GitHub Actions or Azure DevOps.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Pipeline configuration overview

The Azure Developer CLI (`azd`) streamlines CI/CD setup with the [`azd pipeline config`](reference.md) command. This command uses pipeline definition files (`azure-dev.yml`) included in `azd` templates to build automated provisioning and deployment pipelines for your app resources on Azure. The seamless integration between templates and pipelines creates an efficient CI/CD experience, allowing developers to focus on application development while ensuring consistent deployments across environments.

## Pipeline features and set up

Regardless of which CI/CD platform you use, the `azd pipeline config` command completes the following steps to set up a CI/CD pipeline:

- **Authenticate with Azure**: Ensures you are logged in to Azure and have the necessary permissions.
- **Select CI/CD Platform**: Prompts you to choose between GitHub Actions or Azure Pipelines.
- **Configure Repository**: Guides you to connect to an existing repository or create a new one (GitHub or Azure DevOps).
- **Set Up Service Principal**: Automatically creates and configures a service principal for secure deployment.
- **Configure Authentication**
    - For GitHub: Sets up OpenID Connect (OIDC) or client credentials.
    - For Azure DevOps: Sets up client credentials and requests a Personal Access Token (PAT).
- **Provision Pipeline Files**: Copies the appropriate pipeline definition files (azure-dev.yml) from the template to your repository.
- **Sets Pipeline Variables and Secrets**: Configures required variables and secrets for the pipeline to deploy to Azure.
- **Commit and Push Changes**: Commits and pushes the pipeline configuration to your repository.
- **Trigger Initial Pipeline Run**: The pipeline runs, provisioning Azure resources and deploying your app.

### Platform specific details

The `azd pipeline config` command supports GitHub Actions and Azure Pipelines, each with specific considerations:

**GitHub Actions:**

- Works with repositories hosted on GitHub
- Uses the `.github/workflows` directory of an `azd` template for the `azure-dev.yml` configuration file
- Supports OpenID Connect (OIDC) for secure authentication by default
- Can use client credentials as an alternative authentication method

**Azure DevOps:**

- Works with repositories hosted in Azure Pipelines
- Uses the `.azuredevops/pipelines` or `.azdo/pipelines` directory of an `azd` template for the `azure-dev.yml` configuration file
- Uses client credentials for authentication (OIDC not currently supported)
- Requires a Personal Access Token (PAT) with specific scopes for configuration
- Supports protected main branches through pull request workflows

## Template integration

Azure Developer CLI templates can include pre-configured CI/CD pipeline definition files (`azure-dev.yml`) that work with the `azd pipeline config` command. When users clone a template, they can immediately run the `azd pipeline config` command to set up their CI/CD pipeline without having to create configuration files from scratch.

:::image type="content" source="media/configure-devops-pipeline/pipeline-folder-structure.png" alt-text="A screenshot showing a sample pipeline definition file.":::

Templates can also include customized pipeline configurations with additional variables, secrets, and environment-specific settings through the `azure.yaml` file, making it easy to adapt the pipeline to different project requirements.

## Sample workflows and configurations

A sample developer or admin workflow for `azd pipeline config` might resemble the following:

1. Clone the desired `azd` template repository to your local machine.
1. Use the `azd pipeline config` command and follow the prompts to set up your pipeline.
    - The first time the pipeline runs, it provisions the required Azure resources. On subsequent runs, it checks for changes and applies updates automatically.
1. Once the pipeline is created, commit and push any changes to the repository to trigger the deployment pipeline and update your app.
1. Monitor the pipeline execution on the CI/CD platform to ensure successful deployments or troubleshoot issues.

Explore this workflow in detail for different platforms using the following resources:

- [Create a CI/CD pipeline using GitHub Actions](pipeline-github-actions.md)
- [Create a CI/CD pipeline using Azure Pipelines](pipeline-azure-pipelines.md)

Learn how to create your own pipeline definition files or explore more advanced configurations:

- [Create your own pipeline definition files](pipeline-build-manually.md)
- [Explore advanced configurations](pipeline-configurations-advanced.md)

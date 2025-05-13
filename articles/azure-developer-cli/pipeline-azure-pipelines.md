---
title: Configure a pipeline using Azure Pipelines
description: Learn how to create a pipeline and push updates using Azure Pipelines and the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/12/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Configure CI/CD with Azure Pipelines using the Azure Developer CLI

This article shows how to use the Azure Developer CLI (`azd`) to create a CI/CD pipeline with Azure Pipelines for an `azd` template. The pipeline enables you to push updates to a code repository and have your changes automatically provisioned and deployed to your Azure environment.

> [!NOTE]
> The `azd pipeline config` command is in beta. For details, see the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning).

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

## Initialize the template

This example uses the [Hello-AZD](https://github.com/azure-samples/hello-azd) template, but you can follow these steps for any template that includes a pipeline definition file (found in the `.github` or `.azdo` folders).

1. In an empty directory, initialize the `hello-azd` template:

   ```azdeveloper
   azd init -t hello-azd
   ```

1. When prompted, enter a name for the environment (for example, *helloazd*).

## Set up Azure Pipelines

> [!NOTE]
> If you're using Azure Pipelines for a Java template on Windows, see [the troubleshooting guide](./troubleshoot.md#azd-pipeline-config-using-azdo-for-java-templates-on-windows).

### Create or use an Azure Pipelines organization

To use Azure Pipelines, you need an organization. Create one at https://dev.azure.com if you don't already have one.

### Create a Personal Access Token (PAT)

The Azure Developer CLI requires a Personal Access Token (PAT) to configure Azure Pipelines. [Create a new PAT](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat) with the following scopes:

- Agent Pools (read, manage)
- Build (read and execute)
- Code (full)
- Project and team (read, write, and manage)
- Release (read, write, execute, and manage)
- Service Connections (read, query, and manage)

### Configure the pipeline

1. Run the following command to configure an Azure Pipelines project and repository with a deployment pipeline:

   ```azdeveloper
   azd pipeline config --provider azdo
   ```

   > [!NOTE]
   > By default, `azd pipeline config` for Azure Pipelines uses client credentials. OIDC/federated credentials are not currently supported.
   > [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported)

1. Respond to the prompts:

   - **Personal Access Token (PAT):**
     - Paste your PAT.
     - Optionally, export your PAT as a system environment variable to avoid repeated prompts:

       ```azdeveloper
       export AZURE_DEVOPS_EXT_PAT=<PAT>
       ```

   - **Azure Pipelines Organization Name:**
     - Enter your organization name. This value is saved in the `.env` file for the current environment.

   - **A remote named "origin" was not found. Would you like to configure one?**
     - Yes

   - **How would you like to configure your project?**
     - Create a new Azure Pipelines Project

   - **Enter the name for your new Azure Pipelines Project OR Hit enter to use this name: ( {default name} )**
      - Select **Enter**, or create a unique project name.

   - **Would you  like to commit and push your local changes to start the configured CI pipeline?**
      - Yes

1. To verify the build, go to your project in the Azure Pipelines portal (https://dev.azure.com).

## Make and push a code change

1. In the `/src/components/pages` directory, open `Home.razor`.
2. Change the `Hello AZD!` header text to `Hello, pipeline!` and save the file.
3. Create a branch and commit your change. The `main` branch is protected, so push your changes from a new branch and create a Pull Request in Azure Pipelines. The pull request triggers the pipeline and blocks merging if the pipeline fails.
4. Approve and merge your pull request to start the pipeline again.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

5. In your browser, open your project's repository to see your commit and the Azure Pipeline run.

   :::image type="content" source="media/configure-devops-pipeline/azure-devops-pipeline-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

6. Visit the web frontend URL to inspect the update.

## Use `azd` as an Azure Pipelines task

Add [`azd` as an Azure Pipelines task](https://aka.ms/azd-azdo-task) to install `azd` in your pipeline. Add the following to `.azdo/pipelines/azure-dev.yml`:

```yaml
trigger:
  - main
  - branch

pool:
  vmImage: ubuntu-latest
  # vmImage: windows-latest

steps:
  - task: setup-azd@0
    displayName: Install azd
```

---

## Clean up resources

When you no longer need the Azure resources created in this article, run:

```azdeveloper
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

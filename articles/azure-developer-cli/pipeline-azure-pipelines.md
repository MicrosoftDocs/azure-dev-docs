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

# Create an Azure Pipeline for CI/CD using the Azure Developer CLI

In this article, you learn how to use the Azure Developer CLI (`azd`) to create a GitHub Actions CI/CD pipeline for an `azd` template. The pipeline allows you to push template updates to a code repository and see your changes provisioned and deployed automatically to your Azure environment.

> [!NOTE]
> The `azd pipeline config` command is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page.

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

## Initialize the template

This example uses the [Hello-AZD](https://github.com/azure-samples/hello-azd) template, but you can apply the same steps you learn in this article to any template that includes a pipeline definition file. Pipeline definition files are located in the `.github` or `.azdo` folders of the template.

1. In an empty directory, initialize the `hello-azd` template:

```azdeveloper
azd init -t hello-azd
```

1. When prompted, enter a name for the environment, such as *helloazd*.

### Create and configure the pipeline

> [!NOTE]
> If you're using Azure Pipelines for a Java template on Windows, see [the corresponding section in the troubleshooting guide](./troubleshoot.md#azd-pipeline-config-using-azdo-for-java-templates-on-windows). 

### Create or use an existing Azure Pipelines Organization

To run a pipeline in Azure Pipelines, you need an Azure Pipelines organization. You can create one using the Azure Pipelines portal: https://dev.azure.com.

### Create a Personal Access Token

The Azure Developer CLI relies on an Azure Pipelines Personal Access Token (PAT) to configure an Azure Pipelines project. [Create a new Azure Pipelines PAT](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).

When creating your PAT, set the following scopes:

- Agent Pools (read, manage)
- Build (read and execute)
- Code (full)
- Project and team (read, write, and manage)
- Release (read, write, execute, and manage)
- Service Connections (read, query, and manage)

### Invoke the Pipeline configure command

1. Run the following command to configure an Azure Pipelines Project and Repository with a deployment Pipeline.

   ``` azdeveloper
   azd pipeline config --provider azdo
   ````

> [!NOTE]
> By default, `azd pipeline config` in Azure Pipelines uses `client-credentials`. `azd` doesn't currently support OpenID Connect (OIDC)/federated credentials for Azure Pipelines.
> [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported) 

1. Provide your answers to the following prompts:

   - **Personal Access Token (PAT)**
      - Copy/paste your PAT.
      - Export your PAT as a system environment by running the following command. Otherwise, you're prompted every time you set up an Azure Pipeline:

         ```azdeveloper
         export AZURE_DEVOPS_EXT_PAT=<PAT>
         ```

   - **Please enter an Azure Pipelines Organization Name:**  
      -Type [your AzDo organization](#create-or-use-an-existing-azure-devops-organization). Once you hit enter, `AZURE_DEVOPS_ORG_NAME="<your Azure Pipelines Org Name>"` is automatically added to the .env file for the current environment.

   - **A remote named "origin" was not found. Would you like to configure one?**
      - Yes

   - **How would you like to configure your project?**
      - Create a new Azure Pipelines Project

   - **Enter the name for your new Azure Pipelines Project OR Hit enter to use this name: ( {default name} )**
      - Select **Enter**, or create a unique project name.

   - **Would you  like to commit and push your local changes to start the configured CI pipeline?**
      - Yes

1. To find your project and verify the build, navigate to your Azure Pipelines portal (https://dev.azure.com).

### Make and push a code change

1. In the project's `/src/components/pages` directory, open `Home.razor`.

1. Locate the `Hello AZD!` header text towards the top of the file.

1. Change the text to `Hello, pipeline!`.

1. Save the file.

1. Create a branch and commit your change. The `main` branch in Azure Pipelines is protected from directly pushing. You need to push the changes from a new branch and create a `Pull Request` in Azure Pipelines. The pull request automatically starts the pipeline and prevents merging if the pipeline fails.

1. Approve and merge your pull request to start the pipeline again.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

1. Using your browser, open your project's repository to see both:
   - Your commit
   - Azure Pipeline

   :::image type="content" source="media/configure-devops-pipeline/azure-devops-pipeline-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

1. To inspect the update, visit the web frontend URL.

### `azd` as an Azure Pipelines task

Add [`azd` as an Azure Pipelines task](https://aka.ms/azd-azdo-task). This task installs `azd`. To use it, you can add the following to `.azdo\pipelines\azure-dev.yml`:

```YAML
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

When you no longer need the Azure resources created in this article, run the following command:

``` azdeveloper
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

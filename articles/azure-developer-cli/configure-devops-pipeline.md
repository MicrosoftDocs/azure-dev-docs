---
title: Configure a pipeline and push updates using GitHub Actions or Azure DevOps
description: Learn how to push updates using GitHub Actions or Azure DevOps.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/11/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Configure a pipeline and push updates

In this article, you'll learn how to use the Azure Developer CLI (`azd`) to push template changes through a CI/CD pipeline such as GitHub Actions or Azure DevOps. For this example you'll use the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template, but you can apply the principles you learn in this article to any of the [Azure Developer CLI templates](./azd-templates.md).

> [!NOTE]
> The `azd pipeline config` command is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page.

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Deploy the Node.js template](./get-started.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

All [`azd` templates](./azd-templates.md) include a default GitHub Actions and Azure DevOps pipeline configuration file called `azure-dev.yml`, which is required to setup CI/CD. This configuration file provisions your Azure resources and deploy your code to the main branch. You can find `azure-dev.yml`:

- **For GitHub Actions:** in the `.github/workflow` directory.
- **For Azure DevOps:** in the `.azdo/pipelines` directory.

To configure a CI/CD pipeline you'll use the `azd pipeline config` command, which handles the following tasks:

- Creates and configures a Service Principal for the app on the Azure subscription.
- Steps you through a workflow to create and configure a GitHub repository and commit your project code to it. You can also choose to use an existing GitHub repository.
- Creates a secure connection between Azure and your repository using GitHub secrets.
- Runs the GitHub action when you check in the workflow file.

For more granular control over this process, you can also [manually configure a pipeline](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/manual-pipeline-config.md).

[All templates](./azd-templates.md) include a default GitHub Actions and Azure DevOps pipeline configuration file called `azure-dev.yml`. This configuration file provisions your Azure resources and deploys your code to the main branch. You can find `azure-dev.yml`:

- **For GitHub Actions:** in the `.github/workflow` directory.
- **For Azure DevOps:** in the `.azdo/pipelines` directory.
 
You can use the configuration file as-is or modify it to suit your needs.

Select your preferred pipeline provider to continue:

## [GitHub Actions](#tab/GitHub)

### Authorize GitHub to deploy to Azure

To configure the workflow, you need to give GitHub permission to deploy to Azure on your behalf. Authorize GitHub by creating an Azure service principal stored in a GitHub secret named `AZURE_CREDENTIALS`.

1. Run the following command to create the Azure service principal and configure the pipeline:

    ```azdeveloper
    azd pipeline config
    ```

   This command also creates a private GitHub repository and pushes code to the new repo.

   > [!NOTE]
   > By default, `azd pipeline config` uses [OpenID Connect (OIDC)](../github/connect-from-azure.md#use-the-azure-login-action-with-openid-connect), called **federated** credentials. If you'd rather not use OIDC, run `azd pipeline config --auth-type client-credentials`. 
   > 
   > OIDC/federated credentials are **not** supported for Terraform.
   > 
   > [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported) 

1. Supply the requested GitHub information.
1. When prompted about committing and pushing your local changes to start a new GitHub Actions run, specify `y`.

1. In the terminal window, view the results of the `azd pipeline config` command. The `azd pipeline config` command will output the GitHub repository name for your project.

1. Using your browser, open the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow.png" alt-text="Screenshot of GitHub workflow running.":::

### Make and push a code change

1. In the project's `/src/web/src/layout` directory, open `header.tsx`.

1. Locate the line `<Text variant="xLarge">ToDo</Text>`.

1. Change the literal `ToDo` to `myTodo`.

1. Save the file.

1. Commit your change. Committing the change starts the GitHub Action pipeline to deploy the update.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

1. Using your browser, open your project's GitHub repository to see both:
   - Your commit
   - The commit from GitHub Actions being set up.

   :::image type="content" source="media/configure-devops-pipeline/committed-changes-in-github-repo.png" alt-text="Screenshot of your committed change in GitHub.":::

1. Select **Actions** to see the test update reflected in the workflow.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

1. Visit the web frontend URL to inspect the update.

### `azd` as a GitHub action
Add [`azd` as a GitHub action](https://aka.ms/azd-gha). This action will install `azd`. To use it, you can add the following to `.github\workflows\azure-dev.yml`:
   ```
   on: [push]

   jobs:
      build:
         runs-on: ubuntu-latest
         steps:
            - name: Install azd
            uses: Azure/setup-azd@v0.1.0
   ```


## [Azure DevOps](#tab/azdo)

> [!NOTE]
> If you're using Azure DevOps for a Java template on Windows, see [the corresponding section in the troubleshooting guide](./troubleshoot.md#azd-pipeline-config-using-azdo-for-java-templates-on-windows). 

### Create or use an existing Azure DevOps Organization

To run a pipeline in Azure DevOps, you'll need an Azure DevOps organization. You can create one using the Azure DevOps portal: https://dev.azure.com.

### Create a Personal Access Token

The Azure Developer CLI relies on an Azure DevOps Personal Access Token (PAT) to configure an Azure DevOps project. [Create a new Azure DevOps PAT](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate#create-a-pat).

When creating your PAT, set the following scopes:
- Agent Pools (read, manage)
- Build (read and execute)
- Code (full)
- Project and team (read, write and manage)
- Release (read, write, execute and manage)
- Service Connections (read, query and manage)

### Invoke the Pipeline configure command

1. (Optional) To update the default pipeline provider from GitHub Actions to Azure DevOps, [edit `azure.yaml`](./azd-schema.md#azure-pipelines-azdo-as-a-cicd-pipeline-sample) located at the root of your project and add the following:

   ``` yaml
   pipeline: 
      provider: azdo 
   ``` 

1. Run the following command to configure an Azure DevOps Project and Repository with a deployment Pipeline.

   ``` azdeveloper
   azd pipeline config --provider azdo
   ````
   
   If you did the configuration update in Step 1, you can omit the `--provider` flag:

   ``` azdeveloper
   azd pipeline config
   ````

> [!NOTE]
> By default, `azd pipeline config` in Azure DevOps uses `clientcredentials`. OIDC/federated credentials are not supported for Azure DevOps. 
> 
> [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported) 


1. Provide your answers to the following prompts:

   **Personal Access Token (PAT)**   
   - Copy/paste your PAT. 
   - Export your PAT as a system environment by running the following command. Otherwise, you will be prompted every time you set up an Azure Pipeline:

      ```azdeveloper
      export AZURE_DEVOPS_EXT_PAT=<PAT>
      ```

   **Please enter an Azure DevOps Organization Name**  
   
   Type [your AzDo organization](#create-or-use-an-existing-azure-devops-organization). Once you hit enter, `AZURE_DEVOPS_ORG_NAME="<your Azure DevOps Org Name>"` is automatically added to the .env file for the current environment. 

   **A remote named "origin" was not found. Would you like to configure one?**
   
   Yes
   
   **How would you like to configure your project?**
   
   Create a new Azure DevOps Project
   
   **Enter the name for your new Azure DevOps Project OR Hit enter to use this name: ( {default name} )**
   
   Select **Enter**, or create a unique project name.
   
   **Would you  like to commit and push your local changes to start the configured CI pipeline?**
   
   Yes

1. Navigate to your Azure DevOps portal (https://dev.azure.com) to find your project and verify the build.

### Make and push a code change

1. In the project's `/src/web/src/layout` directory, open `header.tsx`.

1. Locate the line `<Text variant="xLarge">ToDo</Text>`.

1. Change the literal `ToDo` to `myTodo`.

1. Save the file.

1. Create a branch and commit your change. The `main` branch in Azure DevOps is protected from directly pushing. You need to push the changes from a new branch and create a `Pull Request` in Azure DevOps. The pull request will automatically start the pipeline and prevent from merging if the pipeline fails.

1. Approve and merge your pull request to start the pipeline again.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

1. Using your browser, open your project's repository to see both:
   - Your commit
   - Azure Pipeline
   
   :::image type="content" source="media/configure-devops-pipeline/azure-devops-pipeline-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

1. Visit the web frontend URL to inspect the update.


### `azd` as an Azure DevOps task
Add [`azd` as an Azure DevOps task](https://aka.ms/azd-azdo-task). This task will install `azd`. To use it, you can add the following to `.azdo\pipelines\azure-dev.yml`:
   ```
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

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

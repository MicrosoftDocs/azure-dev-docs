---
title: Configure a pipeline and push updates using GitHub Actions or Azure DevOps (preview)
description: Learn how to push updates using GitHub Actions or Azure DevOps.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/10/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Configure a pipeline and push updates (preview)

In this article, you'll push [Todo Application with Node.js and Azure Cosmos DB for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) template changes through GitHub Actions or Azure DevOps via Azure Developer CLI (azd). However, you can apply the principles you learn in this article to any of the [Azure Developer CLI templates](overview.md#azure-developer-cli-templates).

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Deploy the Node.js template](./get-started.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

[All templates](./azd-templates.md) include a default GitHub Actions and Azure DevOps pipeline configuration file called `azure-dev.yml`. This configuration file provisions your Azure resources and deploy your code to the main branch. You can find `azure-dev.yml`:

- **For GitHub Actions:** in the `.github/workflow` directory.
- **For Azure DevOps:** in the `azdo/pipeline` directory.

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

---

## Clean up resources

When you no longer need the Azure resources created in this article, run the following command:

``` azdeveloper
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

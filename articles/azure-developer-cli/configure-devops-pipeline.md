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

# Configure a pipeline and push updates

In this article, you'll learn how to use the Azure Developer CLI (`azd`) to push template changes through a CI/CD pipeline such as GitHub Actions or Azure DevOps. For this example you'll use the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template, but you can apply the principles you learn in this article to any of the [Azure Developer CLI templates](./azd-templates.md).

> [!NOTE]
> The `azd pipeline config` command is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page.

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Deploy the Node.js template](./get-started.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

[``azd`` templates](./azd-templates.md) may or may not include a default GitHub Actions and/or Azure DevOps pipeline configuration file called `azure-dev.yml`, which is required to setup CI/CD. This configuration file provisions your Azure resources and deploy your code to the main branch. You can find `azure-dev.yml`:

- **For GitHub Actions:** in the `.github/workflows` directory.
- **For Azure DevOps:** in the `.azuredevops/pipelines` directory or the `.azdo/pipelines` directory. (Both are supported.)

You can use the configuration file as-is or modify it to suit your needs.

> [!NOTE]
> Make sure your template has a pipeline definition (`azure-dev.yaml`) before calling `azd pipeline config`. `azd` does not automatically create this file.
> See [Create a pipeline definition for azd](#create-a-pipeline-definition) below.

Use the `azd pipeline config` command to configure a CI/CD pipeline, which handles the following tasks:

- Creates and configures a service principal for the app on the Azure subscription. Your user must have either `Owner` role or `Contributor + User Access Administrator` roles within the Azure subscription to allow azd to create and assign roles to the service principal.
- Steps you through a workflow to create and configure a GitHub or Azure DevOps repository and commit your project code to it. You can also choose to use an existing repository.
- Creates a secure connection between Azure and your repository.
- Runs the GitHub action when you check in the workflow file.

For more granular control over this process, or if you user does not have the required roles, you can [manually configure a pipeline](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/manual-pipeline-config.md).

Select your preferred pipeline provider to continue:

## [GitHub Actions](#tab/GitHub)

### Authorize GitHub to deploy to Azure

To configure the workflow, you need to authorize a service principal to deploy to Azure on your behalf, from a GitHub action. `azd` creates the service principal and a [federated credential](/graph/api/resources/federatedidentitycredentials-overview) for it.

1. Run the following command to create the Azure service principal and configure the pipeline:

    ```azdeveloper
    azd pipeline config
    ```

   This command, optionally creates a GitHub repository and pushes code to the new repo.

   > [!NOTE]
   > By default, `azd pipeline config` uses [OpenID Connect (OIDC)](../github/connect-from-azure-openid-connect.md), called **federated** credentials. If you'd rather not use OIDC, run `azd pipeline config --auth-type client-credentials`. 
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

   ```yml
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
> By default, `azd pipeline config` in Azure DevOps uses `client-credentials`. `azd` does not currently support OIDC/federated credentials for Azure DevOps.
> [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported) 

1. Provide your answers to the following prompts:

   - **Personal Access Token (PAT)**
      - Copy/paste your PAT.
      - Export your PAT as a system environment by running the following command. Otherwise, you will be prompted every time you set up an Azure Pipeline:

         ```azdeveloper
         export AZURE_DEVOPS_EXT_PAT=<PAT>
         ```

   - **Please enter an Azure DevOps Organization Name:**  
      -Type [your AzDo organization](#create-or-use-an-existing-azure-devops-organization). Once you hit enter, `AZURE_DEVOPS_ORG_NAME="<your Azure DevOps Org Name>"` is automatically added to the .env file for the current environment.

   - **A remote named "origin" was not found. Would you like to configure one?**
      - Yes

   - **How would you like to configure your project?**
      - Create a new Azure DevOps Project

   - **Enter the name for your new Azure DevOps Project OR Hit enter to use this name: ( {default name} )**
      - Select **Enter**, or create a unique project name.

   - **Would you  like to commit and push your local changes to start the configured CI pipeline?**
      - Yes

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

## Advanced features

You can extend the `azd pipeline config` command for specific template scenarios or requirements, as described in the following sections.

### Additional secrets or variables

By default, `azd` sets variables and secrets for the pipeline. For example, the `azd pipeline config` command creates the `subscription id`, `environment name` and the `region` as pipeline variables whenever it executes. The pipeline definition then references those variables:

```yaml
env:
   AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }}
   AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
   AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
   AZURE_ENV_NAME: ${{ vars.AZURE_ENV_NAME }}
   AZURE_LOCATION: ${{ vars.AZURE_LOCATION }}
```

When the pipeline runs, `azd` gets the values from the environment, which is mapped to the variables and secrets. Depending on the template, there might be settings which you can control using environment variables. For example, an environment variable named `KEY_VAULT_NAME` could be set to define the name of a Key Vault resource within the template infrastructure. For such cases, the list of variables and secrets can be defined by the template, using the `azure.yaml`. For example, consider the following `azure.yaml` configuration:

```yaml
pipeline:
  variables:
    - KEY_VAULT_NAME
    - STORAGE_NAME
  secrets:
    - CONNECTION_STRING
```

With this configuration, `azd` checks if any of the variables or secrets have a non-empty value in the environment. `azd` then creates either a variable or a secret for the pipeline using the name of the key in the configuration as the name of the variable or secret, and the non-string value from the environment for the value.

The `azure-dev.yaml` pipeline definition can then reference the variables or secrets:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      KEY_VAULT_NAME: ${{ variables.KEY_VAULT_NAME }}
      STORAGE_NAME: ${{ variables.STORAGE_NAME }}
      CONNECTION_STRING: ${{ secrets.CONNECTION_STRING }}
```

> [!NOTE]
> You must run `azd pipeline config` after updating the list of secrets or variables in `azure.yaml` for azd to reset the pipeline values.

### Infrastructure parameters

Consider the following bicep example:

```bicep
@secure()
param BlobStorageConnection string
```

The parameter `BlobStorageConnection` has no default value set, so `azd` prompts the user to enter a value. However, there is no interactive prompt during CI/CD. `azd` must request the value for the parameter when you run `azd pipeline config`, save the value in the pipeline, and then fetch the value again when the pipeline runs.

`azd` uses a pipeline secret called `AZD_INITIAL_ENVIRONMENT_CONFIG` to automatically save and set the value of all the required parameters in the pipeline. You only need to reference this secret in your pipeline:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_INITIAL_ENVIRONMENT_CONFIG }}
```

When the pipeline runs, `azd` takes the values for the parameters from the secret, removing the need for an interactive prompt.

> [!NOTE]
> You must re-run `azd pipeline config` if you add a new parameter.

## Create a pipeline definition

If your `azd` template doesn't already have a CI/CD pipeline definition file, you can create one yourself. A CI/CD pipeline definition has typically 4 main sections:
  
- trigger
- permissions
- operating system or pool
- steps to be run

The following examples demonstrate how to create a definition file and related configurations for GitHub Actions and Azure Pipelines.

## [GitHub Actions](#tab/GitHub)

Running `azd` in GitHub Actions requires the following configurations:

- Grant `id-token: write` and `contents: read` access scopes.
- [Install the azd action](https://aka.ms/azd-gha), unless you are using a docker image where `azd` is already installed.

You can use the following template as a starting point for your own pipeline definition:

```yaml
on:
  workflow_dispatch:
  push:
    # Run when commits are pushed to mainline branch (main or master)
    # Set this to the mainline branch you are using
    branches:
      - main
      - master

# Set this permission if you are using a Federated Credential.
permissions:
  id-token: write
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    # azd build-in variables.
    # This variables are always set by `azd pipeline config`
    # You can set them as global env (apply to all steps) or you can add them to individual steps' environment
    env:
      AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }}
      AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
      AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
      AZURE_ENV_NAME: ${{ vars.AZURE_ENV_NAME }}
      AZURE_LOCATION: ${{ vars.AZURE_LOCATION }}
      ## Define the additional variables or secrets that are required globally (provision and deploy)
      # ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
      # ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}      
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # using the install-azd action
      - name: Install azd
        uses: Azure/setup-azd@v1.0.0

      # # If you want to use azd-daily build, or install it from a PR, you can remove previous step and
      # # use the next one:
      # - name: Install azd - daily or from PR
      #  # Update this scrip based on the OS - pool of your pipeline. This example is for a linux pipeline installing daily build
      #  run: curl -fsSL https://aka.ms/install-azd.sh | bash -s -- --version daily
      #  shell: pwsh

      # azd set up Federated Credential by default. You can remove this step if you are using Client Credentials
      - name: Log in with Azure (Federated Credentials)
        if: ${{ env.AZURE_CLIENT_ID != '' }}
        run: |
          azd auth login `
            --client-id "$Env:AZURE_CLIENT_ID" `
            --federated-credential-provider "github" `
            --tenant-id "$Env:AZURE_TENANT_ID"
        shell: pwsh

      ## If you set up your pipeline with Client Credentials, remove previous step and uncomment this one
      # - name: Log in with Azure (Client Credentials)
      #   if: ${{ env.AZURE_CREDENTIALS != '' }}
      #   run: |
      #     $info = $Env:AZURE_CREDENTIALS | ConvertFrom-Json -AsHashtable;
      #     Write-Host "::add-mask::$($info.clientSecret)"

      #     azd auth login `
      #       --client-id "$($info.clientId)" `
      #       --client-secret "$($info.clientSecret)" `
      #       --tenant-id "$($info.tenantId)"
      #   shell: pwsh
      #   env:
      #     AZURE_CREDENTIALS: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Provision Infrastructure
        run: azd provision --no-prompt
        env:
         #  # uncomment this if you are using infrastructure parameters
         #  AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_INITIAL_ENVIRONMENT_CONFIG }}
         ## Define the additional variables or secrets that are required only for provision 
         #  ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         #  ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}

      - name: Deploy Application
        run: azd deploy --no-prompt
        env:
         ## Define the additional variables or secrets that are required only for deploy
         #  ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         #  ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}

```

## [Azure DevOps](#tab/azdo)

You can use the following template as a starting point for your own pipeline definition:

```yaml
# Run when commits are pushed to mainline branch (main or master)
# Set this to the mainline branch you are using
trigger:
  - main
  - master

pool:
  vmImage: ubuntu-latest

steps:
  - task: setup-azd@0 
    displayName: Install azd

  # If you can't use above task in your organization, you can remove it and uncomment below task to install azd
  # The script can be changed to use azd-daily build or build from PR
#   - task: Bash@3
#     displayName: Install azd
#     inputs:
#       targetType: 'inline'
#       script: |
#         curl -fsSL https://aka.ms/install-azd.sh | bash

  # azd delegate auth to az to use service connection with AzureCLI@2
  - pwsh: |
      azd config set auth.useAzCliAuth "true"
    displayName: Configure AZD to Use AZ CLI Authentication.

   - task: AzureCLI@2
      displayName: Provision Infrastructure
      inputs:
         # azconnection is created by azd pipeline config
         azureSubscription: azconnection
         scriptType: bash
         scriptLocation: inlineScript
         inlineScript: |
         azd provision --no-prompt
      env:
         # azd build-in variables.
         AZURE_SUBSCRIPTION_ID: $(AZURE_SUBSCRIPTION_ID)
         AZURE_ENV_NAME: $(AZURE_ENV_NAME)
         AZURE_LOCATION: $(AZURE_LOCATION)
         # # uncomment this if you are using infrastructure parameters
         # AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_INITIAL_ENVIRONMENT_CONFIG }}
         # # Define the additional variables or secrets that are required only for provision 
         # ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         # ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}

   - task: AzureCLI@2
      displayName: Deploy Application
      inputs:
         azureSubscription: azconnection
         scriptType: bash
         scriptLocation: inlineScript
         inlineScript: |
         azd deploy --no-prompt
      env:
         # azd build-in variables.
         AZURE_SUBSCRIPTION_ID: $(AZURE_SUBSCRIPTION_ID)
         AZURE_ENV_NAME: $(AZURE_ENV_NAME)
         AZURE_LOCATION: $(AZURE_LOCATION)
         # # Define the additional variables or secrets that are required only for deploy 
         # ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         # ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}

```

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

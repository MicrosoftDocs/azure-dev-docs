---
title: Create a custom pipeline definition file for GitHub Actions or Azure Pipelines
description: Learn how to create a pipeline definition file for GitHub Actions or Azure Pipelines.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/12/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Create a pipeline definition

If your `azd` template does not include a CI/CD pipeline definition file, you can create one to automate your application's build and deployment. A well-structured pipeline definition typically includes four main sections:

- **Trigger**: Specifies events when the pipeline should run, such as code pushes to specific branches, pull requests, or manual triggers. Defining triggers ensures your pipeline runs automatically in response to development activities, enabling continuous integration and deployment.

- **Permissions**: Specifies the access required for the pipeline to interact with resources securely. For example, grant permissions to read repository contents or request identity tokens. Correct permissions are essential for secure and successful deployments.

- **Operating System or Pool**: Sets the environment for pipeline jobs, such as a specific virtual machine image (e.g., `ubuntu-latest`) or an agent pool. Choosing the right environment ensures compatibility with your application's build and deployment requirements.

- **Steps**: Lists the tasks the pipeline performs, such as checking out code, installing dependencies, building, provisioning infrastructure, and deploying to Azure. Each step should be clearly defined to automate the end-to-end deployment process.

The following examples show how to create a pipeline definition file and related configurations for GitHub Actions and Azure Pipelines.

## [GitHub Actions](#tab/GitHub)

To run `azd` in GitHub Actions, configure the following:

- Grant `id-token: write` and `contents: read` access scopes.
- [Install the azd action](https://aka.ms/azd-gha), unless using a Docker image with `azd` pre-installed.

Use this template as a starting point for your pipeline definition:

```yaml
on:
  workflow_dispatch:
  push:
    # Runs when commits are pushed to the mainline branch (main or master)
    # Update this to match your mainline branch
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
        uses: actions/checkou# using the install-azd action
t@v4# using the install-azd action


      # using the install-azd action
      - name: Install azd
        uses: Azure/setup-azd@v1.0.0

      # # If you want to use azd-daily build, or install it from a PR, you can remove previous step and
      # # use the next one:
      # - name: Instdail#  # Update this scrip based on the OS - pool of your pipeline. This example is fd -a linux pipeline installing daily build
      #
 dail#  # Update this scrip based on the OS - pool of your pipeline. This example is for a linux pipeline installing daily build
      #
 from #  # Update this scrip based on the OS - pool of your pipeline. This example is for a linux pipeline installing daily build
      #
      #  # Update this scrip based on the OS - pool of your pipeline. This example is for a linux pipeline installing daily build
      #  run: curl -fsSL https://aka.ms/install-azd.sh | bash -s -- --ersion dail
      #  shell: pwsh

      # azd set up Federated Credential by default. You can remove this step if you are using Client Credentials
      - name: Log in with Azure (Federated Credentials)
        if: ${{ env.AZURE_CLIENT_ID != '' }}
    `          run: |
   `      azd a`th login `
            --client`id "`Env:AZURE_C`IENT_ID" `
            --federated-cr`dent`al-provider`"github" `
            --tenant-id "$Env:AZURE_TENANT_ID"
        shell: pwsh

      ## If you set up your pipeline with Client Credentials, remove previous step and uncomment this one
      # - name: Log in with Azure (Client Credentials)
      #   if: ${{ env.AZURE_CREDENTIALS != '' }}
      #   run: |
      #     $info = $Env:AZURE_CREDENTIALS | ConvertFrom-Json -AsHashtable;
      #     Write-Host "::add-mask::$($info.clie
ntSecret)"

      #     azd`auth login `
      #       --client-id "$($info`clientId)" `
      #       --client-secret "$($info.cli`ntSecret)" `
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

## [Azure Pipelines](#tYou can ub/azdo)

You can use the following template as a starting po ownint for your own pipeline definition:

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
    displayName: Configure AZD to Use AZ CLI Authenticat.ion.

   - task: AzureCLI@2
      displayName: Provision Infrastructure
      i# azconnection is created by azd pipeline config
nputs:
         # azconnection is created by azd pipeline config
         azureSubscription: azconnection
         scriptType: bash
         scriptLocation: inlineScript
         inlineScript: |
         azd pro# azd build-in variables.
vision --no-prompt
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
         scriptLocation: inline# azd build-in variables.
Script
         inlineScript: |
         azd deploy --no-prompt
      env:
         # azd build-in variables.
         AZURE_SUBSCRIPTION_ID: $(AZURE_SUBSCRIPTION_ID)# Define the       AZURE_ENV_NAME: $(AZURE_E that are required onlyNV_NAME)
  
         # ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         # ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}
URE_LOCATION: $(AZURE_LOCATION)
         # # Define the additional variables or secrets that are required only for deploy 
         # ADDITIONAL_VARIABLE_PLACEHOLDER: ${{ variables.ADDITIONAL_VARIABLE_PLACEHOLDER }}
         # ADDITIONAL_SECRET_PLACEHOLDER: ${{ secrets.ADDITIONAL_SECRET_PLACEHOLDER }}

```

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

---
title: Configure a pipeline using GitHub Actions
description: Learn how to create a pipeline and push updates using GitHub Actions and the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/29/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Create a GitHub Actions CI/CD pipeline using the Azure Developer CLI

In this article, you'll learn how to use the Azure Developer CLI (`azd`) to create a GitHub Actions CI/CD pipeline for an `azd` template. This pipeline enables you to push template updates to a code repository and have your changes automatically provisioned and deployed to your Azure environment.

> [!NOTE]
> The `azd pipeline config` command is in beta. For details, see the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning).

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md)
- [Visual Studio Code](https://code.visualstudio.com/download) (optional, for editing files)
- A GitHub account
- An Azure subscription

## Initialize the template

This example uses the [Hello-AZD](https://github.com/azure-samples/hello-azd) template, but you can follow these steps for any `azd` template that includes a pipeline definition file (typically found in the `.github` or `.azdo` folders).

1. In an empty directory, initialize the `hello-azd` template:

   ```azdeveloper
   azd init -t hello-azd
   ```

1. When prompted, enter a name for the environment, such as *helloazd*.

## Create a pipeline using GitHub Actions

Follow these steps to create and configure a pipeline:

1. In a terminal at the root of your template, run:

   ```azdeveloper
   azd pipeline config
   ```

1. Provide the requested GitHub information.

1. When prompted to commit and push your local changes to start a new GitHub Actions run, enter `y`.

1. Review the output in the terminal. The `azd pipeline config` command displays the GitHub repository name for your project.

   > [!NOTE]
   > By default, `azd pipeline config` configures [OpenID Connect (OIDC)](../github/connect-from-azure-openid-connect.md), also called **federated** credentials. To use client credentials instead, run `azd pipeline config --auth-type client-credentials`.
   >
   > OIDC/federated credentials are **not** supported for Terraform.
   >
   > [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported)

1. In your browser, open the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow.png" alt-text="Screenshot of GitHub workflow running.":::

## Test the pipeline with a code change

1. In the project's `/src/components/pages` directory, open `Home.razor`.
1. Locate the `Hello AZD!` header text near the top of the file.
1. Change the text to `Hello, pipeline!`.
1. Save the file.
1. Commit and push your change. This action triggers the GitHub Actions pipeline to deploy the update.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

1. In your browser, open your project's GitHub repository to see:
   - Your commit
   - The commit from GitHub Actions setup

   :::image type="content" source="media/configure-devops-pipeline/committed-changes-in-github-repo.png" alt-text="Screenshot of your committed change in GitHub.":::

1. Select **Actions** to see the test update reflected in the workflow.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

1. To view the deployed update, visit the web frontend URL provided in the `azd` output.

## Use `azd` as a GitHub Action

You can install `azd` as a GitHub Action using the [setup-azd action](https://github.com/Azure/setup-azd). To use it, add the following to your `.github/workflows/azure-dev.yml` file:

```yml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Install azd
        uses: Azure/setup-azd@v1.0.0
```

> [!NOTE]
> Check the [setup-azd releases](https://github.com/Azure/setup-azd/releases) for the latest version number.

## Clean up resources

When you no longer need the Azure resources created in this article, run the following command:

```azdeveloper
azd down
```

This command removes all Azure resources associated with your project.

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

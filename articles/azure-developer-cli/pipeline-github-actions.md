---
title: Configure a pipeline using GitHub Actions
description: Learn how to create a pipeline and push updates using GitHub Actions and the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/12/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Create a GitHub Actions CI/CD pipeline using the Azure Developer CLI

In this article, you'll learn how to use the Azure Developer CLI (`azd`) to create a GitHub Actions CI/CD pipeline for an `azd` template. This pipeline enables you to push template updates to a code repository and have your changes automatically provisioned and deployed to your Azure environment.

> [!NOTE]
> The `azd pipeline config` command is in beta. For details, see the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning).

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

## Initialize the template

This example uses the [Hello-AZD](https://github.com/azure-samples/hello-azd) template, but you can follow these steps for any template that includes a pipeline definition file (typically found in the `.github` or `.azdo` folders).

1. In an empty directory, initialize the `hello-azd` template:

   ```azdeveloper
   azd init -t hello-azd
   ```

1. When prompted, enter a name for the environment, such as *helloazd*.

### Create a pipeline using GitHub Actions

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

### Push a code change

1. In the project's `/src/components/pages` directory, open `Home.razor`.
2. Locate the `Hello AZD!` header text near the top of the file.
3. Change the text to `Hello, pipeline!`.
4. Save the file.
5. Commit and push your change. This triggers the GitHub Actions pipeline to deploy the update.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

6. In your browser, open your project's GitHub repository to see:
   - Your commit
   - The commit from GitHub Actions being set up

   :::image type="content" source="media/configure-devops-pipeline/committed-changes-in-github-repo.png" alt-text="Screenshot of your committed change in GitHub.":::

7. Select **Actions** to see the test update reflected in the workflow.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

8. To view the update, visit the web frontend URL.

### Use `azd` as a GitHub Action

Install [`azd` as a GitHub Action](https://aka.ms/azd-gha). To use it, add the following to `.github/workflows/azure-dev.yml`:

   ```yml
   on: [push]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Install azd
           uses: Azure/setup-azd@v0.1.0
   ```

## Clean up resources

When you no longer need the Azure resources created in this article, run:

```azdeveloper
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

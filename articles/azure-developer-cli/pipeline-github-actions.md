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

# Create GitHub Actions CI/CD pipeline using the Azure Developer CLI

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

### Create a pipeline using GitHub Actions

Complete the following steps to create and configure a pipeline:

1. In a terminal open to the root of your template, run the `azd pipeline config` command:

    ```azdeveloper
    azd pipeline config
    ```

1. Supply the requested GitHub information.

1. When prompted about committing and pushing your local changes to start a new GitHub Actions run, specify `y`.

1. In the terminal window, view the results of the `azd pipeline config` command. The `azd pipeline config` command outputs the GitHub repository name for your project.

   > [!NOTE]
   > By default, `azd pipeline config` configures [OpenID Connect (OIDC)](../github/connect-from-azure-openid-connect.md), called **federated** credentials. If you'd rather not use OIDC, run `azd pipeline config --auth-type client-credentials`.
   >
   > OIDC/federated credentials are **not** supported for Terraform.
   >
   > [Learn more about OIDC support in `azd`.](./faq.yml#what-is-openid-connect--oidc---and-is-it-supported)

1. Using your browser, open the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow.png" alt-text="Screenshot of GitHub workflow running.":::

### Push a code change

1. In the project's `/src/components/pages` directory, open `Home.razor`.

1. Locate the `Hello AZD!` header text towards the top of the file.

1. Change the text to `Hello, pipeline!`.

1. Save the file.

1. Commit and push your change. The code push starts the GitHub Action pipeline to deploy the update.

   :::image type="content" source="media/configure-devops-pipeline/commit-changes-to-github.png" alt-text="Screenshot of steps required to make and commit change to test file.":::

1. Using your browser, open your project's GitHub repository to see both:
   - Your commit
   - The commit from GitHub Actions being set up.

   :::image type="content" source="media/configure-devops-pipeline/committed-changes-in-github-repo.png" alt-text="Screenshot of your committed change in GitHub.":::

1. Select **Actions** to see the test update reflected in the workflow.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow-after-test-update.png" alt-text="Screenshot of GitHub workflow running after test update.":::

1. To inspect the update, visit the web frontend URL.

### `azd` as a GitHub action

Install [`azd` as a GitHub action](https://aka.ms/azd-gha). To use it, you can add the following to `.github\workflows\azure-dev.yml`:

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

When you no longer need the Azure resources created in this article, run the following command:

``` azdeveloper
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

---
title: Configure a pipeline and push updates using GitHub Actions
description: Learn how to push updates using GitHub Actions.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/10/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Configure a pipeline and push updates using GitHub Actions

In this article, you'll push [Todo Application with Node.js and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) template changes through GitHub Actions via Azure Developer CLI (azd). However, you can apply the principles you learn in this article to any of the [Azure Developer CLI templates](overview.md#azure-developer-cli-templates).

## Prerequisites

- [Install the Azure Developer CLI](install-azd.md).
- [Run `azd up` for the Node.js template](./get-started.md).
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

## Configure a DevOps pipeline

[All templates](./azd-templates.md) include a GitHub Actions pipeline configuration file called `azure-dev.yml`, located in the `.github/workflow` directory. This configuration file deploys your app whenever code is pushed to the main branch.

To configure the pipeline, you need to give GitHub permission to deploy to Azure on your behalf. Authorize GitHub by creating an Azure service principle stored in a GitHub secret named `AZURE_CREDENTIALS`.

1. Run the following command to create the Azure service principle and configure the pipeline:

    ```bash
    azd pipeline config
    ```

   This command also creates a private GitHub repository and pushes code to the new repo.

1. Supply the requested GitHub information.
1. When prompted about committing and pushing your local changes to start a new GitHub Actions run, specify `y`.

1. In the terminal window, view the results of the `azd pipeline config` command. The `azd pipeline config` command will output the GitHub repository name for your project.

1. Using your browser, open the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

   :::image type="content" source="media/configure-devops-pipeline/github-workflow.png" alt-text="Screenshot of GitHub workflow running.":::

## Make and push a code change

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

## Clean up resources

When you no longer need the Azure resources created in this article, run the following command:

``` bash
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor your app using Azure Developer CLI (azd)](monitor-your-app.md)

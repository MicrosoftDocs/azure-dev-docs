---
title: Clone GitHub repository with VSCode
description: Clone a public repository from GitHub to your local computer using Visual Studio Code.
ms.topic: how-to
ms.date: 01/28/2021
ms.custom: devx-track-js
---

# Clone and work with a GitHub repository with Visual Studio Code

Learn the steps to clone a public repository from GitHub to your local computer using Visual Studio Code.

Working in Visual Studio Code with a repository uses two separate tools:

* Git CLI from the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
* GitHub extension from the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface)

These tools are meant to be quick to accomplish common tasks. 

## Use command palette to clone repository

To get started, download the sample project using the following steps:

1. Press **F1** to display the command palette.

1. At the command palette prompt, enter `gitcl`, select the **Git: Clone** command, and press **Enter**.

    ![gitcl command in the Visual Studio Code command palette prompt](../../media/node-howto-e2e/visual-studio-code-git-clone.png)

1. When prompted for the **Repository URL**, enter a GitHub repository url, then press **Enter**.

1. Select (or create) the local directory into which you want to clone the project.

    ![Visual Studio Code explorer](../../media/node-howto-e2e/visual-studio-code-explorer.png)

## Create a branch for changes

Use Git in the command palette to create a new branch.

1. Press **F1** to display the command palette.
1. Search for `git branch` and select `Git: Create Branch`.


    :::image type="content" source="../../media/how-to-clone-github-repo/git-cli-branch-list.png" alt-text="Search for `git branch` and select `Git: Create Branch`.":::

1. Enter a new branch name. The branch name is visible in the status bar. 

    :::image type="content" source="../../media/how-to-clone-github-repo/git-branch-status-bar-vscode.png" alt-text="The branch name is visible in the status bar.":::

## Commit changes with Git 

Once you have made changes on your branch, commit the changes

1. Within Visual Studio Code, switch to the activity bar and select the Git icon.

1. In the **Message** box, enter a commit message, and press **Ctrl**+**Enter**.

    ![Adding the yarn.lock file to Git](../../media/node-howto-e2e/visual-studio-code-add-yarn-lock.png)

## Create a Pull Request (PR) 

1. Install the [Visual Studio extension for PRs and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

    This adds a new icon to the integrated tab (usually found at the far left).

## Next steps


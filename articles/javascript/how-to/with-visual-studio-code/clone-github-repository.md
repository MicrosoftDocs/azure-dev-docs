---
title: Clone GitHub repository with VSCode
description: Clone a public repository from GitHub to your local computer using Visual Studio Code.
ms.topic: how-to
ms.date: 09/15/2021
ms.custom: devx-track-js
---

# Clone and use a GitHub repository in Visual Studio Code

Learn the steps to clone a public repository from GitHub to your local computer using Visual Studio Code.

Working in Visual Studio Code with a repository uses separate tools.

|Icon|Information|[Access from](https://code.visualstudio.com/docs/getstarted/userinterface)|
|--|--|--|
|| [Git commands](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) in command palette|<kbd>F1</kbd>|
|:::image type="content" source="../../media/how-to-clone-github-repo/git-commit-icon-activity-bar.png" alt-text="Icon for Source control.":::|Source control extension|Activity bar|
|:::image type="content" source="../../media/how-to-clone-github-repo/github-icon-prs-issues.png" alt-text="Icon for GitHub PRs and Issues":::|[GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) extension|Activity bar|
||[GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) extension|You can quickly and easily open a GitHub repository either by searching for GitHub Repositories: Open Repository... from the Command Palette, <kbd>F1</kbd>, or by choosing Open GitHub Repository... from the remote indicator (the green button in the lower left corner of the status bar).|

The following procedures use the named parts of the [Visual Studio Code user interface](https://code.visualstudio.com/docs/getstarted/userinterface). 

## Use command palette to clone repository

To get started, download the sample project using the following steps:

1. Press **F1** to display the command palette.

1. At the command palette prompt, enter `gitcl`, select the **Git: Clone** command, and press **Enter**.

    ![gitcl command in the Visual Studio Code command palette prompt](../../media/how-to-clone-github-repo/visual-studio-code-git-clone.png)

1. When prompted for the **Repository URL**, select clone from GitHub, then press **Enter**.
1. If you are asked to sign into GitHub, complete the sign-in process.
1. Enter [azure-samples/js-e2e-express-server](https://github.com/Azure-Samples/js-e2e-express-server) in the **Repository URL** field. 
1. Select (or create) the local directory into which you want to clone the project.
1. When you receive the notification asking if you want to open the cloned repository, select **Open**. 

## Create a branch for changes with Git CL

Use Git in the command palette to create a new branch.

1. Press <kbd>F1</kbd> to display the command palette.
1. Search for `git branch` and select `Git: Create Branch`.

    :::image type="content" source="../../media/how-to-clone-github-repo/git-cli-branch-list.png" alt-text="Search for `git branch` and select `Git: Create Branch`.":::

1. Enter a new branch name. The branch name is visible in the status bar. 

    :::image type="content" source="../../media/how-to-clone-github-repo/git-branch-status-bar-visual-studio-code.png" alt-text="The branch name is visible in the status bar.":::

## Create a branch from status bar

1. Select the branch name in the status bar. 

    The status bar is usually found at the bottom of Visual Studio code. 

1. In the command palette, select **+Create a new branch**.
1. Enter your new branch name. 

1. Enter a new branch name. The branch name is visible in the status bar. 

    :::image type="content" source="../../media/how-to-clone-github-repo/git-branch-status-bar-visual-studio-code.png" alt-text="The branch name is visible in the status bar.":::

## Commit changes with Git 

Once you have made changes on your branch, commit the changes

1. Switch to the activity bar and select the Source control icon or use the keyboard commands: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>.

1. In the **Message** box, enter a commit message, and press <kbd>Ctrl</kbd> + <kbd>Enter</kbd>, or select the check mark in the Source Control bar to commit the message.

    ![Adding the yarn.lock file to Git](../../media/how-to-clone-github-repo/visual-studio-code-add-yarn-lock.png)


## Push a local branch to remote from status bar

1. On the Visual Studio Code status bar, select the push icon to the right of the branch name. 

    :::image type="content" source="../../media/how-to-clone-github-repo/visual-studio-code-status-bar-push-commits.png" alt-text="Visual Studio Code status bar, with the push icon highlighted.":::

1. Select the remote name from the pop-up box. If you have just one remote, you won't be asked to select the remote name. 

## Push a local branch to remote from the Source Control extension
1. Select the Source Control icon from the activity bar. 
1. Select the ellipsis (...) then select: `Push` or `Push to`.

    :::image type="content" source="../../media/how-to-clone-github-repo/visual-studio-code-push-branch-to-remote.png" alt-text="Visual Studio Code source control, with the push icon highlighted.":::

1. Select the remote name from the pop-up box. If you have just one remote, you won't be asked to select the remote name. 

## View Git output

You can view the Git commands run when you use the Source control extension.

1. Select the Source Control icon from the activity bar. 
1. Select the ellipsis (...) then select **Show Git Output**.

    :::image type="content" source="../../media/how-to-clone-github-repo/visual-studio-code-show-git-output.png" alt-text="Visual Studio Code source control, with the Show Git Output selection highlighted.":::


## Next steps

* How to [deploy a web app](../deploy-web-app.md)

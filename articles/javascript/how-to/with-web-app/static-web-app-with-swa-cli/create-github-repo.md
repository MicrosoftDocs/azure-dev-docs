---
title: "2-GitHub: Create GitHub repo"
description: In this article, create a new GitHub repository (repo), then prepare your local development environment to use the repo for source control.
ms.topic: how-to
ms.date: 10/18/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 2. Create a new GitHub repo for source control

In this article, create a new GitHub repository (repo), then prepare your local development environment to use the repo for source control.

## Default branch names

Because you will be pushing and pulling between your local and remote repos, it is important that both use the same `default` branch name. 

If you are new to Git and GitHub, both branches are `main`. If both default branches are not `main`, you need to configure both branches to be the same name and anytime you see `main` referenced in this document series, use your own default branch name instead. 

## Create remote GitHub repository

1. Use [this link](https://github.com/new) to go to your GitHub account to create a new repo. Use the following table to create the repo:
   
   |Property|Value|
   |--|--|
   |Repository name|`staticwebapp-with-api`|
   |Public or private|Public|
   |Readme|Check|
   |.gitignore|Check, select `Node`.|
   |License|Yes, select `MIT license`.|
   
1. After you create the remote repo, copy the repo URL to use later, such as `https://github.com/YOUR-ACCOUNT/staticwebapp-with-api`.

## Create remote personal access token for GitHub

If you intend to create your Azure Static Web Apps resource using the Azure CLI (your choices are with the Azure CLI or with VS Code), you need to create a personal access token (PAT). 

1. In a web browser on GitHub, create a **Personal Access Token** (PAT) for this repo using [GitHub documentation found here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

1. Copy this PAT for that later step.

## Initialize local source control

Configure the local directory to connect to the remote GitHub repository. 

1. Open VS Code to your local directory. 
1. Open an integrated bash window. 
1. Initialize Git:

    ```bash
    git init
    ```
1. Connect your local repo to your remote. Change the following command to use your account and repo name. 
   
   ```bash
   git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME
   ```

   The name `origin` refers to your connection to this local repo and your specific remote repo.

1. Pull the remote files to your local repo:
   
   ```bash
   git pull origin main 
   ```

   This pulls the README.md, license, and .gitignore files to your local computer. If you miss this step, following steps will fail until you complete it.

## Next steps

* [Create the React app](create-react-app.md)

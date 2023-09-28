---
title: "Developer experience for Contoso Real Estate"
description: Understand the Contoso Real Estate developer experience provided for you when you use this reference architecture.
ms.topic: conceptual
ms.date: 09/26/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to understand how to manage the developer experience of a complex end to end cloud application.
---

# Developer experience for Contoso Real Estate

An enterprise app should be able to allow:

* Easy onboarding of new development team members
* Independent development of features and bug fixes between team members
* Consistent local development experience across team members
* Consistent deployment experience to cloud

To achieve these goals, the Contoso Real Estate application uses several tools to manage the developer experience. These tools are:

* [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces): A feature of npm that allows you to manage multiple packages in a single repository. This allows you keep all the code for the application, across several independent projects, in a single repository. This makes it easier to manage the code and to onboard new developers.
* Docker configuration to manage local experience in a consistent, repeatable way which can be versioned with the source code..
    * [DevContainers](https://containers.dev/) in [Visual Studio Code](https://code.visualstudio.com/). Run development environment from IDE with all required dependencies
    * Docker in docker for dependencies: A Docker container that contains Docker. This allows you to run services such as Postgres and MongoDB in Docker containers locally without needing to have them installed on your local (host) computer.
    * Dependency images such as Postgres and MongoDB. These images are used by the Docker in Docker container to run the services. You don't need to manage updating these dependencies you local computer. 
* [Azure Developer CLI](/azure/developer/azure-developer-cli/overview): An "infrastructure as code" tool that manages the provisioning and deployment of Azure resources. The infrastruction is defined in files that are checked into source control. This allows you to manage the infrastructure in the same way you manage your application code. Use the Azure Developer CLI to provision and deploy test and production resources.
    * Hooks for pre- and post- actions. These hooks allow you to run scripts before and after provisioning and deployment. Use these hooks to update configuration settings and url strings in source code.
    * Authentication to Azure. The Azure Developer CLI uses the Azure CLI to authenticate to Azure. This allows you to use the same authentication method for both the Azure Developer CLI and the Azure CLI.
* CI/CD workflows with GitHub Actions and Azure Pipelines. These pipelines allow you to perform actions along the entire development lifecycle. Use these pipelines to build, test, and deploy your application.

## Local developer expierence

To manage the developer experience, the monorepo has different files to help the development process. These files are:

Local development includes: 

| File | Used for | Description |
|--|--|--|
|`package.json`|Local development|The root `package.json` file contains the configuration for the entire monorepo. This file contains the configuration for the npm workspaces feature. It also contains the configuration for the Azure Developer CLI.| 
|`docker-compose.yml`|Local development|The `docker-compose.yml` file contains the configuration for the Docker containers that are used for local development.|
|`.vscode`|Local debugging| The `.vscode` folder contains the configuration for Visual Studio Code to allow you to debug the separate applications such as the blog, portal, and API.|
|`.devcontainer`|Local development|The `.devcontainer` folder contains the configuration for the DevContainers. These DevContainers are used to run the application locally such as IDE configurations, environment configurations such as opening ports and installing additional tools.|

## Cloud devops expierence

Cloud provisioning and deployment includes:

| File | Used for | Description |
|--|--|--|
|`azure.yml`|Cloud provision and deployment|The `azure.yml` file contains the configuration for the Azure Developer CLI. This file contains the configuration for the Azure resources that are provisioned and deployed by the Azure Developer CLI. This file also contains the configuration for the pre- and post- hooks that are run before and after provisioning and deployment. |
|`infra`|Cloud provision and deployment|The `infra` folder contains the configuration for the Azure resources that are provisioned and deployed by the Azure Developer CLI. This folder contains the configuration for the pre- and post- hooks that are run before and after provisioning and deployment.|

## Local and cloud experience

The following files and folders are used for both local development and cloud provisioning and deployment:

| File | Used for | Description |
|--|--|--|
|`scripts`|Local & cloud|The `scripts` folder contains the scripts that are run by the pre- and post- hooks. These scripts are used to update configuration settings and url strings in source code. Some scripts are necessary for both local development and cloud deployment. One example is restoring a database from a dump. Both the local PostGreSQL database and the Azure PostGreSQL database need to be restored from the same dump.| 
|`packages`|Local & cloud|The `packages` folder contains the source code for the application, separated out into individual packages. Each individual package is built and deployed independently. This allows you to develop and deploy features and bug fixes independently.|

## CI/CD experience

The following files and folders are used when changes are pushed to the GitHub repository:

| File | Used for | Description |
|--|--|--|
|`.github/workflows`|CI/CD| The `.github/workflows` folder contains the configuration for the GitHub Actions workflows. These actions run when changes are pushed to the GitHub repository. These workflows are used to build, test, and deploy the application.|
|`.azdo/pipelines`|CI/CD| The `.github/workflows` folder contains the configuration for the GitHub Actions workflows. These actions run when changes are pushed to the GitHub repository. These workflows are used to build, test, and deploy the application.|


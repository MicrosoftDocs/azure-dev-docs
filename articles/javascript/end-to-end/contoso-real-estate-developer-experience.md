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

## Local developer expirence

To manage the developer experience, the monorepo has different files to help the development process. These files are:

Local development includes: 

| File | Description |
|--|--|
|`package.json`|The root `package.json` file contains the configuration for the entire monorepo. This file contains the configuration for the npm workspaces feature. It also contains the configuration for the Azure Developer CLI. The `workspaces` property is used by [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to allow you to manage multiple packages in a single repository.|
|`docker-compose.yml`|The `docker-compose.yml` file contains the configuration for the Docker containers that are used for local development. Docker in docker is used for dependencies. This allows you to run services such as Postgres and MongoDB in Docker containers without needing to have them installed on your local (host) computer. You don't need to manage the update process for these dependencies your local computer because that process is managed by docker. |
|`.devcontainer`|The `.devcontainer` folder contains the configuration for the DevContainers. These [DevContainers](https://containers.dev/) are used by [Visual Studio Code](https://code.visualstudio.com/) to run the application locally such as IDE configurations, environment configurations such as opening ports and installing additional tools.|
|`.vscode`|The `.vscode` folder contains the configuration for Visual Studio Code to allow you to debug the separate applications such as the blog, portal, and API.|

To get started with local development:

1. Fork the repository. Open the source code repository from one of the following choices.
    * Open in browser-based Codespaces in your GitHub fork.
    * Clone the repository locally. Docker is required to run the application locally then open in Visual Studio Code. When prompted, open the repository in a DevContainer. 
1. In the integrated terminal in Visual Studio Code, run `npm install` to install the dependencies.
1. Run `npm run start` to start all the services. This command starts the Docker containers. 1. Access the packages from the following ports:

    | Application    | URL                                                      | Port |
    | -------------- | -------------------------------------------------------- | ---- |
    | Portal (UI)    | https://YOUR-REPO-4280.preview.app.github.dev:4280       | 4280 |
    | Blog   (UI)    | https://YOUR-REPO-3000.preview.app.github.dev:3000       | 3000 |
    | Strapi CMS     | https://YOUR-REPO-1337.preview.app.github.dev:1337/admin | 1337 |
    | Serverless API | https://YOUR-REPO-7071.preview.app.github.dev:7071/api/  | 7071 |
    | Stripe API     | https://YOUR-REPO-4242.preview.app.github.dev:4242       | 4242 |

    As part of the startup process, the [docker-compose.yml](https://github.com/Azure-Samples/contoso-real-estate/blob/main/docker-compose.yml) file restores the database using the same script which is used in deployment to restore the database.

    * The **portal** is the property listing website. Once logged on with a social provider, the listings are available for viewing and reservations.
        * Listing content is managed by the **Strapi CMS** backed by the PostGreSQL DB.
        * User profiles, reservations, and payments are managed by the **Serverless API** backed by the Mongo DB. 
        * Hosting is provided by **Azure Static Web Apps** with an Azure Functions App for the serverless API.
    * The **blog** is the public-only website. 
        * Blob posts are managed by the **Strapi CMS** backed by the PostGreSQL DB.
        * Hosting is provided by **Azure Container Apps** for the Blob UI, Strapi CMS, and Stripe API.
1. When you are done exploring the and and ready to stop the services, run `npm run stop` to stop the Docker containers.
1. Create a new branch. 
1. Start the underlying services with the following command.

    ```bash
    npm run start:services
    ```
1. Use the Visual Studio Code debugger to start the application(s) you are interested in debugging into.



## Cloud devops experience

[Azure Developer CLI](/azure/developer/azure-developer-cli/overview) is an "infrastructure as code" tool that manages the provisioning and deployment of Azure resources. The infrastructure is defined in files that are checked into source control. This allows you to manage the infrastructure in the same way you manage your application code. Use the Azure Developer CLI to provision and deploy test and production resources.
    * Hooks for pre- and post- actions. These hooks allow you to run scripts before and after provisioning and deployment. Use these hooks to update configuration settings and url strings in source code.
    * Authentication to Azure. The Azure Developer CLI uses the Azure CLI to authenticate to Azure. This allows you to use the same authentication method for both the Azure Developer CLI and the Azure CLI.

Cloud provisioning and deployment include:

| File |Description |
|--|--|
|`azure.yml`|The `azure.yml` file contains the configuration for the Azure Developer CLI. This file contains the configuration for the Azure resources that are provisioned and deployed by the Azure Developer CLI. This file also contains the configuration for the pre- and post- hooks that are run before and after provisioning and deployment. |
|`infra`|The `infra` folder contains the configuration for the Azure resources that are provisioned and deployed by the Azure Developer CLI. This folder contains the configuration for the pre- and post- hooks that are run before and after provisioning and deployment.|

### Developing infrastructure as code

Azure Developer CLI uses bicep files to allow you to define the infrastructure as code. Bicep is a domain-specific language (DSL) that is used to define Azure resources. Bicep is a declarative language that allows you to define the desired state of the infrastructure. 

1. If you are new to Azure Developer CLI and bicep, use the [Azure Developer CLI quickstart](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs). This quickstart uses fewer resources and a smaller code base so it is a great first step to learning about Azure Developer CLI.
1. Once you complete the quickstart, you can review the bicep files for this project.

    * [`./infra`](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra)
        * `main.bicep`: used to control the resource provisioning.
        * `main.parameters.bicep`: this file, unique to each repository, contains the parameters that are used to configure the resources. Typically, a file has the minimum variables needed for Azure Developer CLI:
            ```json
            "environmentName": {
              "value": "${AZURE_ENV_NAME}"
            },
            "location": {
              "value": "${AZURE_LOCATION}"
            },
            "principalId": {
              "value": "${AZURE_PRINCIPAL_ID}"
            },
            ``````

            The environment name is used to create a unique name for the resource group and its resources. The location is the Azure region where the resources are deployed. The principal ID is the ID of the service principal that is used to authenticate to Azure. This service principal is created by the Azure Developer CLI.

        * `abbreviations.json`: this file contains the abbreviations that are used to simplify the configuration of the resources. This is a standard file and should be managed as part of the team's guidance for naming conventions.
    
As you add each resource, its setup and configuration, you add bicep files to the `infra` folder. Use bicep modules in subfolders to organize the bicep files. 

### Deploying with infrastructure as code 

To begin the provisioning and deployment process:

1. Log into Azure with"
    
    ```bash
    azd auth login
    ```
1. Copy the device code. 
1. Open a browser to [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) and complete the authentication process.
1. For this complex application, we need to break provisioning and deployment into separate steps. First to provision, use:
    ```bash
    azd provision
    ```
    This step creates on the Azure resources that are needed to deploy the application. Once provisioning is complete, the database for the listings content is restored with a postprovision step noted in the [azure.yml](https://github.com/Azure-Samples/contoso-real-estate/blob/main/azure.yaml) file uses the [scripts/database/restore.sh](https://github.com/Azure-Samples/contoso-real-estate/blob/main/scripts/database/restore.sh) script.

1. Use the following command to deploy the application:
    ```bash 
    azd deploy
    ```
    This command uses the services listed in the `azure.yml` to understand where the code is, how it is built, and where it should be deployed to. It also includes and pre- and post- hooks necessary to complete a deployment. An example of a predeploment step is to get the provisioned resource names, construct correct URLs, with those names, then use those URLs when building the websites to access other sites 


## Local and cloud experience

The following files and folders are used for both local development and cloud provisioning and deployment:

| File | Description |
|--|--|
|`scripts`|The `scripts` folder contains the scripts that are run to prepare local services or cloud resources. These scripts are used to update configuration settings and url strings in source code. One example is restoring a database from a dump. Both the local PostGreSQL database and the Azure PostGreSQL database need to be restored from the same dump.| 
|`packages`|The `packages` folder contains the source code for the application, separated out into individual packages. Each individual package is built and deployed independently. This allows you to develop and deploy features and bug fixes independently.|

## CI/CD experience

The following files and folders are used when changes are pushed to the GitHub repository:

| File |  Description |
|--|--
|`.github/workflows`| The `.github/workflows` folder contains the configuration for the GitHub Actions workflows. These actions run when changes are pushed to the GitHub repository. These workflows are used to build, test, and deploy the application.|
|`.azdo/pipelines`| The `.azdo/pipelines` folder contains the configuration for the Azure DevOps workflows. These actions run when changes are pushed to the Azure DevOps repository. These workflows are used to build, test, and deploy the application.|



---
title: "Infrastructure management for Contoso Real Estate"
description: Understand how Contoso Real Estate manages local and cloud services for you when you use this reference architecture.
ms.topic: conceptual
ms.date: 09/26/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a senior developer new to Azure, I want to understand how to manage the services of a complex end to end cloud application.
---

# Infrastructure management for Contoso Real Estate

[!INCLUDE [include](./includes/contoso-intro-paragraph.md)]

An enterprise developer experience allows:

* Quick and easy onboarding of new development team members
* Independent development of features and bug fixes between team members and across teams
* Consistent local development experience
* Consistent deployment experience

To achieve these goals for Infrastructure, the Contoso Real Estate application uses several tools:

* [Local developer experience](#local-developer-experience)
* [Cloud devops experience](#cloud-devops-experience)
* [Local and cloud experience](#local-and-cloud-experience)
* [CI/CD experience](#cicd-experience)


## Local developer experience

To manage the Contoso Real Estate services, the monorepo has several files and folders to help the development process. Each of these has been manually configured for this project. You can use these as a starting point for your own projects.

The project uses a combination of Azure Developer CLI, Bicep, and Bash scripts to:

* **Provision Azure resources**: create cloud resources and configure them for the application. This includes tasks like creating a database and configuring the firewall rules, and uploading the database dump.
* **Deploy code**: deploy the application code to the cloud resources. This includes tasks like building the application code and deploying it the various hosting resources such as Azure Static Web Apps, Azure Functions App and Azure Container App. Building the front-end code also requires a hook to add the serverless API URL to the front-end code.

## File system structure

The files, which support local development are:

| File | Description |
|--|--|
|`package.json`|The root `package.json` file contains the configuration for the entire monorepo including the npm `workspaces` property to allow you to manage multiple packages in a single repository. Items in the `scripts` array are useful for local development but can also be used in CI/CD.|
|`docker-compose.yml`|The `docker-compose.yml` file contains the configuration for the [Visual Studio Code Dev container](https://code.visualstudio.com/docs/devcontainers/containers) environment using Docker containers (as Docker in Docker) that are used for local development. This allows you to run services such as Postgres and MongoDB without needing to have them installed on your local (host) computer or using cloud resources.|
|`.devcontainer`|The `.devcontainer` folder contains the configuration for the local [DevContainers](https://containers.dev/) used by [Visual Studio Code](https://code.visualstudio.com/) to run the applications locally such as IDE configurations (extensions and IDE settings), and environment configurations (such as open ports and installing additional tools).|
|`.vscode`|The `.vscode` folder contains the configuration for Visual Studio Code to allow you to debug the separate applications such as the blog, portal, and API.|

## Open and run development environment

To start local development:

1. [Fork](https://github.com/Azure-Samples/contoso-real-estate/fork) the repository on GitHub. 
1. Open your forked source code repository from one of the following choices.
    * Open in **browser-based Codespaces** in your GitHub fork.
    * **Clone the repository locally**. Docker is required to run the application locally then open in Visual Studio Code. When prompted, open the repository in the DevContainer. 

1. If you're running this project in a Dev Container, then you don't need to install any dependencies because that is done in the `./.devcontainer/post-create-command.sh` Bash script. If you're running this project _without_ the Dev Containter, then you need to install the dependencies. To install the dependencies, run the following command in the root of the repository:

    ```bash
    npm install
    ``````

## Local environment variables

Environment variables in a Node.js application, used to access configuration settings and secrets, are managed by the [dotenv](https://www.npmjs.com/package/dotenv) package. This package allows you to create a `.env.local` file in the root of the repository. This file is used to store the environment variables that are used by the application. This file is **not** checked into source control.


## Start the application

1. Use the following command to start all the services. This command starts the Docker containers. 

    ```bash
    Run `npm run start`
    ``````

    As part of the startup process, the [docker-compose.yml](https://github.com/Azure-Samples/contoso-real-estate/blob/main/docker-compose.yml) file starts all the services such as the underlying databases then as the final step restores the database from the `./scripts/database/restore.sh` Bash script.

1. Access the applications from the following ports:

    | Application    | URL                                                      | Port |
    | -------------- | -------------------------------------------------------- | ---- |
    | Portal (UI)    | `https://YOUR-REPO-4280.preview.app.github.dev:4280`       | 4280 |
    | Blog   (UI)    | `https://YOUR-REPO-3000.preview.app.github.dev:3000`       | 3000 |
    | Strapi CMS     | `https://YOUR-REPO-1337.preview.app.github.dev:1337/admin` | 1337 |
    | Serverless API | `https://YOUR-REPO-7071.preview.app.github.dev:7071/api/`  | 7071 |
    | Stripe API     | `https://YOUR-REPO-4242.preview.app.github.dev:4242`       | 4242 |
    

    * The **portal** is the property listing website. Once logged on with a social provider, the listings are available for viewing and reservations.
        * Listing content is managed by the **Strapi CMS** backed by the PostGreSQL DB.
        * User profiles, reservations, and payments are managed by the **Serverless API** backed by the Mongo DB. 
        * Hosting is provided by **Azure Static Web Apps** with an Azure Functions App for the serverless API.
    * The **blog** is the public-only website. 
        * Blob posts are managed by the **Strapi CMS** backed by the PostGreSQL DB.
        * Hosting is provided by **Azure Container Apps** for the Blob UI, Strapi CMS, and Stripe API.

1. When you're done exploring the code and ready to stop the services, use <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop the services.

## Extend the project with a feature or fix

1. Create a new branch. 

    ```bash
    git checkout -b my-new-feature
    ``````

1. Start the services with the following command.

    ```bash
    npm run start:services
    ```
1. Use the Visual Studio Code debugger to start the application(s) you need to debug.

## Infrastructure as code

[Azure Developer CLI](/azure/developer/azure-developer-cli/overview) is an _infrastructure as code_ tool that manages the provisioning and deployment of Azure resources. The infrastructure is defined in files that are checked into source control in the `./infra` folder. This allows you to manage the infrastructure in the same way you manage your application code. Use the Azure Developer CLI to provision resources and deploy code.

* **Authentication**: The Azure Developer CLI requires authentication to provision Azure resources using the `azd auth login` command.
* **Hooks for pre- and post- actions**: These hooks allow you to run scripts before and after provisioning and deployment. Use these hooks to update configuration settings and url strings in source code. Scripts run in hooks should be tested for authentication and environment variables in local and CICD environments.

Cloud provisioning and deployment include:

| File |Description |
|--|--|
|`infra`|The `infra` folder contains **provisioning** details for the Azure resources. This project uses [**Bicep**](/training/paths/fundamentals-bicep/) for the infrastructure code.|
|`azure.yml`|The `azure.yml` file contains the configuration used by Azure Developer CLI to **deploy** to Azure. This file also contains the configuration for the pre- and post- hooks that are run before and after provisioning and deployment.|

## Developing infrastructure as code

Azure Developer CLI uses bicep files to allow you to define the infrastructure as code. Bicep is a domain-specific language (DSL) that is used to define Azure resources.

1. If you're new to Azure Developer CLI and bicep, use the [Azure Developer CLI quickstart](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs). This quickstart uses fewer resources and a smaller code base so it's a great first step to learning about Azure Developer CLI.
1. Once you complete the quickstart, you can review the bicep files for the Contoso Real Estate project.

    * [`./.azure.yml`](https://github.com/Azure-Samples/contoso-real-estate/blob/main/azure.yaml): this contains the postprovision hook to restore the database. It also includes the individual applications and their build and deployment configuration.
    * [`./infra`](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra)
        * `main.bicep`: used to control the resource provisioning.
        * `main.parameters.bicep`: this file, unique to each repository, contains the parameters that are used to configure the resources. Typically, a file has at least these minimum variables needed for Azure Developer CLI:
            ```json
            "environmentName": {
              "value": "${AZURE_ENV_NAME}"
            },
            "location": {
              "value": "${AZURE_LOCATION}"
            }
            ``````

            * The **environmentName** is used to create a unique name for the resource group and its resources. 
            * The **location** is the Azure region where the resources are deployed. 

        * `abbreviations.json`: this file contains the abbreviations that are used to simplify the configuration of the resources. This is a standard file and should be managed as part of the team's guidance for naming conventions.
    * [`./infra/app`](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra/app): bicep files **specific to the application**. They call the modules in the `./infra/core` folder. 
    * [`./infra/core`](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra/core): bicep files for the core resources that are used by all the applications. Think of these as **templates you copy** but shouldn't need to alter. 

    
As you add a new service, along with its setup and configuration, you add bicep files to the `infra` folder. Use bicep modules in subfolders to organize the bicep files for reusability. 

## Cloud environment variables

Environment variables allow your source code to access configuration settings and secrets needed to build and run the applications. 

* For **local development** in Contoso Real Estate, the environment variables have default values for the dependencies such as a database user and password, and those default values are set in source code for the package that uses them. In this way, the application runs locally without any additional configuration.
* For **cloud development**, the environment variables are part of the provisioning and deployment process. 
    * **Secrets**: Any values that are secrets need to use the `@secure()` attribute so it isn't used in logs or other places where it could be exposed. Because a variable, including a secret, may be created by one resource and necessary to be used by another, the order of provision needs to be considered. For example, the database user and password are created by the database resource and used by the application resource hosting environment. 
    * **Resource creation order**: Azure Developer CLI typically works in parallel where possible. When a bicep file's resource uses the `dependsOn` parameter or needs an input parameter, Azure Developer CLI understands the resource creation order.
    * **Local environment file for cloud resources**: After provisioning, a local environment file contains these variables in the `./.azure/` folder, named for the environment you entered when you begin the initial provisioning process. This is used for any setup or build steps during deployment that rely on these values.

## Best practices

* **Do** 
    * Use naming conventions in Bicep files. This helps you find the issue in the Azure portal and track that back to the individual bicep file in your repository when your provision fails. 
        
    * Mark all app params with `@secure()` in the bicep file. Without this, these are leaked in the deployment **input logs**.

        ```bicep
        @secure()
        param appSettings object = {}
        ```
    * Use the `azd env set` and `azd env get` commands to access the cloud resource variables programmatically.

* **Don't**

    * Don't output secrets from the bicep file. This leak is done with the `output variableName = secret`. During provisioning, these are leaked in the deployment **output logs**.

    * Don't check `.azure` folder into source control.


## Deploying infrastructure

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
    This step creates the Azure resources that are needed to deploy the application. Once provisioning is complete, the database for the listings content is restored with a **postprovision step** noted in the [azure.yml](https://github.com/Azure-Samples/contoso-real-estate/blob/main/azure.yaml) file, which uses the [scripts/database/restore.sh](https://github.com/Azure-Samples/contoso-real-estate/blob/main/scripts/database/restore.sh) script.

1. Use the following command to deploy the application:
    ```bash 
    azd deploy
    ```
    This command uses the services listed in the `azure.yml` to understand where the code is, how it's built, and where it should be deployed to. It also includes and pre- and post- hooks necessary to complete a deployment. An example of a **predeployment step** is to get the provisioned resource names, construct correct URLs, with those names, then use those URLs when building the websites.


## Local _and_ cloud experience

The following files and folders are used for both local development and cloud provisioning and deployment:

| File | Description |
|--|--|
|`scripts`|The `scripts` folder contains the scripts that are run to prepare local services or cloud resources. One example is restoring a database from a dump. Both the local database and the Azure database need to be restored from the same dump.| 
|`packages`|The `packages` folder contains the source code for the application, separated out into individual packages. Each individual package is built and deployed independently. This allows you to develop and deploy features and bug fixes independently. This build information is found by the deployment process in the `./azure.yml` file.|

## CI/CD experience

The following files and folders are used when changes are pushed to the GitHub repository:

| File |  Description |
|--|--
|`.github/workflows`| The `.github/workflows` folder contains the configuration for the GitHub Actions workflows. These actions run when changes are pushed to the GitHub repository. These workflows are used to build, test, and deploy the application.|
|`.azdo/pipelines`| The `.azdo/pipelines` folder contains the configuration for the Azure DevOps workflows. These actions run when changes are pushed to the Azure DevOps repository. These workflows are used to build, test, and deploy the application.|

The current workflows include provisioning and deployment with Azure Developer CLI.

## Additional resources

Documentation includes:

* [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)
* [Bicep](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs)
* [GitHub Actions](https://docs.github.com/en/actions)
* [Azure DevOps](/azure/devops/pipelines/)

Training includes: 

* [Build and deploy applications with the Azure Developer CLI](/training/paths/azure-developer-cli/)
* [Fundamentals of Bicep](/training/paths/fundamentals-bicep/)
* [Introduction to Docker Containers](/training/modules/intro-to-docker-containers/)
* [Build and store container images with Azure Container Registry](/training/modules/build-and-store-container-images/)
* [Use a Docker container as a development environment with Visual Studio Code](/training/modules/use-docker-container-dev-env-vs-code/)

Videos include: 

* [Azure Developer CLI](/shows/azure-developers/?languages=azdeveloper)
* [Bicep](/shows/learn-live/?terms=bicep)

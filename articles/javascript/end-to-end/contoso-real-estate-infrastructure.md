---
title: "Infrastructure management for Contoso Real Estate"
description: Understand how Contoso Real Estate manages local and cloud services for you when you use this reference architecture.
ms.topic: conceptual
ms.date: 09/26/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate, devx-track-extended-azdevcli
# CustomerIntent: As a senior developer new to Azure, I want to understand how to manage the services of a complex end to end cloud application.
---

# Infrastructure management for Contoso Real Estate

[!INCLUDE [include](./includes/contoso-intro-paragraph.md)]

[Azure Developer CLI](/azure/developer/azure-developer-cli/overview) is an _infrastructure as code_ tool that manages the provisioning and deployment of Azure resources. This allows you to manage the infrastructure in the same way you manage your application code. Azure Developer CLI uses [Bicep](/azure/azure-resource-manager/bicep/) files to allow you to define the infrastructure as code. Bicep is a domain-specific language (DSL) that is used to define Azure resources.

* **Provision Azure resources**: create cloud resources and configure them for the application. This includes tasks like creating a database and configuring the firewall rules, and restoring the PostgreSQL database from the dump file.
* **Deploy code**: deploy the application code to the cloud resources. This includes tasks like building the application code and deploying it the various hosting resources such as Azure Static Web Apps, Azure Functions App and Azure Container App. Building the front-end code also requires a hook to add the serverless API URL to the front-end code.
* **Hooks**:  Hooks allow you to run scripts before and after provisioning and deployment. Use these hooks to update configuration settings and url strings in source code. 

## Developing infrastructure as code

If you're new to Azure Developer CLI and Bicep, use the [Azure Developer CLI quickstart](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs). This quickstart uses fewer resources and a smaller code base so it's a great first step to learning about Azure Developer CLI.

Once you complete the quickstart, you can review the Bicep files for the Contoso Real Estate project.

## File structure for infrastructure management

To manage the Contoso Real Estate services, the monorepo has several files and folders for infrastructure management. Each of these has been manually configured for this project. You can use these as a starting point for your own projects.

The files, which support infrastructure are:

* **Provision Azure resources**: The `./infra` folder contains the following:
    * `main.yml`: this file contains the configuration for the Azure resources that are provisioned.
    * `main.parameters.yml`: this file contains the parameters that are used to configure the resources.
    * `abbreviations.json`: this file contains the abbreviations that are used to simplify the configuration of the resources. This is a standard file and should be managed as part of the team's guidance for naming conventions.
    * `./app`: this folder contains the Bicep files that are specific to the application. 
    * `./core`: this folder contains the Bicep files that are used by all the applications. Think of these as templates you copy but shouldn't need to alter.
    * `./scripts`: this folder contains the scripts used by the Azure Developer CLI as pre and post hooks. Scripts in the infra folder are used strictly for cloud infrastructure management. If you have script that may be used for local development, then put it in the `./scripts` folder in the root of the repository.
* **Deploy code**: 
    * `azure.yml`: this file contains the configuration used by Azure Developer CLI to deploy to Azure. This file is very similar to other CICD YAML files. The ordering of deployment is alphanumeric. If your project needs to order the deployment, then use a naming convention that reflects the alphanum ordering such as

        ```YAML
        serivces:
          A_server:
            # service CICD here
          B_client:
            # service CICD here
        ```

## Environment variables

### Local environment variables

Environment variables in a Node.js application, used to access configuration settings and secrets, are managed by the [dotenv](https://www.npmjs.com/package/dotenv) package. This package allows you to create a `.env.local` file in the root of the repository. This file is used to store the environment variables that are used by the application. This file is **not** checked into source control.

Some Azure hosting resources have other ways to indicate environment variables. For example, 

* [Azure Functions](/azure/azure-functions/functions-overview) uses the [`local.settings.json`](/azure/azure-functions/functions-develop-local#local-settings-file) file. This file is used to store the environment variables that are used by the application runtime. It can also be used for your own app-specific environment variables. This file is **not** checked into source control.

### Cloud environment variables

For **cloud development**, the environment variables are part of the provisioning and deployment process. The Contoso Real Estate project uses the following types of environment variables: 

* **App settings**: these are settings such as database names, container names.
* **Default settings**: these are settings that need to be used during deployment but aren't used in the application. For example, the name of the resource group is used to create the resource group but isn't used in the application.
* **App secrets**: these are secrets such as database passwords: these should be created then immediately stored in Key Vault secrets. They shouldn't be used as app settings in a hosting environment or output from the deployment process. If either of these happens, the secret has been leaked into the deployment logs and is visible in the Azure portal.
* **Azure resource keys and connection strings**: these values are available from the Azure resource during provisioning. The web host may need to access the database with a configuration string. If you use these values instead of [passwordless connections](/azure/developer/intro/passwordless-overview), the values should be immediately stored in Key Vault Secrets. Only the Key Vault secret name should be used in the app setting or output variables of the deployment process. 

## Best practices

* **Do** 
    * Use naming conventions in Bicep files. This helps you find the issue in the Azure portal and track that back to the individual Bicep file in your repository when your provision fails. 
        
    * Mark all app params with `@secure()` in the Bicep file. Without this, these are leaked in the deployment **input logs**.

        ```bicep
        @secure()
        param appSettings object = {}
        ```
    * Use the `azd env set` and `azd env get` commands to access the cloud resource variables programmatically.

* **Don't**

    * Don't output secrets from the Bicep file. This leak is done with the `output variableName = secret`. During provisioning, these are leaked in the deployment **output logs**.

    * Don't check `.azure` folder into source control.


[!INCLUDE [start up dev environment](includes/contoso-open-developer-environment.md)]

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

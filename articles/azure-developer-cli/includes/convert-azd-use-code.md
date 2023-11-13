1. You can follow the steps ahead using your own project. However, if you'd prefer to follow along using a sample application, clone the following starter repo to an empty directory on your computer:

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
    ```

1. Open your command line tool of choice to the root directory of the project.

1. Run the `azd init` command to initialize the template.

    ```bash
    azd init
    ```

1. When prompted, select the option to **Use code in the current directory**. `azd` analyzes the project and provides a summary of the detected services and recommended Azure hosting resources.

1. Select **Confirm and continue initializing my app**. `azd` generates the following assets in the project root directory:

    * An `azure.yaml` file with appropriate service definitions.
    * An `infra` folder with infrastructure-as-code files to provision and deploy the project to Azure.
    * A `.azure` folder with environment variables set in a `.env` file.

    More details on this detection and generation process are provided later in the article.

1. The generated files work as-is for the provided sample app and may for your own apps as well. If necessary, the generated files can be modified to fit your needs. For example, you may need to further modify the infrastructure-as-code files in the `infra` folder if your app relies on Azure resources beyond those that were identified by `azd`.

1. Run the `azd up` command to provision and deploy your app to Azure.

    ```bash
    azd up
    ```

1. When prompted, select the desired subscription and location to begin the provisioning and deployment process.

1. When the process completes, click the link in the `azd` output to open the app in the browser.

## Explore the initialization steps

When you select the **Use code in the current directory** workflow, the `azd init` command analyzes your project and autogenerates code based on what it discovers. The sections below explain the details of how this process works and which technologies are currently supported.

### Detection

The `azd init` command detects project files for supported languages located in your project directory and subdirectories. `azd` will also scan package dependencies to gather information about the web frameworks or databases your app uses. If needed, you can manually add or edit the detected components as presented in the confirmation summary prompt.

The current detection logic is as follows:

- Supported languages:
    -  Python
    - JavaScript/TypeScript
    - .NET
    - Java
- Supported databases:
    - MongoDB
    - PostgreSQL.
- For Python and JavaScript/TypeScript, web frameworks and databases are automatically detected.
- When a JavaScript/TypeScript project uses a front-end (or client-side) web framework, it is classified as a front-end service. If your service uses a front-end web framework that is currently undetected, you may select JQuery to provide equivalent front-end service classification and behavior.

### Generation

After you confirm the detected components, `azd init` generates the infrastructure-as-code files needed to deploy your application to Azure.

The generation logic is as follows:

- Supported hosts:
    - Azure Container Apps.
- For databases, the supported mapping between database technology and service used:
    - MongoDB: Azure CosmosDB API for MongoDB
    - PostgreSQL: Azure Database for PostgreSQL flexible server
    - Redis: Azure Container Apps Redis add-on
- Services using databases will have environment variables that provide connection to the database pre-configured by default.
- When both front-end and back-end services are detected, CORS configuration on the Azure host for back-end services will be updated to allow the default hosting domain of front-end services. This can be - modified or removed as necessary in the Infrastructure as Code configuration files.

## Add support for dev containers

You can also make your template compatible with development containers and Codespaces. A dev container allows you to use a container as a full-featured development environment. It can be used to run an application, to separate tools, libraries, or runtimes needed for working with a codebase, and to aid in continuous integration and testing. Dev containers can be run locally or remotely, in a private or public cloud. (Source: [https://containers.dev/](https://containers.dev/))

To add support for dev containers:

1. Create a .devcontainer folder at the root of your project.

1. Create a `devcontainer.json` file inside of the `.devcontainer` folder with the desired configurations. The `azd` starter template provides a [sample `devcontainer.json`](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.devcontainer/devcontainer.json) file that you can copy into your project and modify as needed.

Read more about [working with dev containers](https://code.visualstudio.com/docs/devcontainers/containers) on the Visual Studio Code documentation.

## Add support for a CI/CD pipeline

You can also add support for CI/CD in your template using GitHub actions or Azure DevOps using the following steps:

1. Add a `.github` folder for GitHub actions or a `.ado` folder for Azure DevOps to the root of your project.

1. Add a workflow file into the new folder. The `azd` starter template provides a [Sample GitHub Actions workflow file](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.github/workflows/azure-dev.yml) and [Sample Azure DevOps Pipelines](https://github.com/Azure-Samples/azd-starter-bicep/blob/main/.azdo/pipelines/azure-dev.yml) files for each platform that you can copy into your project and modify as needed.

1. You may also need to update the `main.paramaeters.json` file in your `infra` folder with the required environment variables for your workflow to run.

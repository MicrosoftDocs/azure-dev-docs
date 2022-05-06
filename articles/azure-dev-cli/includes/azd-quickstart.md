### Project Folder

You will need an empty folder on your computer to house the project files that will be copied from this repository.

1. Open your favorite terminal and create a new folder.

```bash
mkdir {your-unique-project-folder-name}
```

2. Now, set your current directory to that newly created folder.

```bash
cd {your-unique-project-folder-name}
```

### Azure Subscription

The sameple template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

## Quickstart

The fastest possible way for you to get this app up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary resources. Because this will create all of the resources on Azure, it can take some time. You will see an indication of the CLI progress as it creates the resources.

The `azd up` command will:

1. Get a local copy of this repository and initialize the project
2. Create all the Azure resources required by this application
3. Deploy the code you need to run the application

Run the following command to create Azure resources, build, and deploy this application to Azure in a single step.

```bash
azd up --template todo-nodejs-mongo
```

> NOTE: This may take a while to complete as it performs three steps: `azd init` (initialize your local environment), `azd provision` (creates Azure services) and `azd deploy` (deploys code).

You will be prompted for the following information:

- `Environment Name`: This will be used as a prefix for all your Azure resources, make sure it is unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

This command will print URLs to the following:

- Azure Portal link to view resources created
- ToDo web application frontend
- ToDo API application

!["azd Up output"](assets/azdevupurls.png)

Click the web application URL to launch the ToDo app. Create a new collection and add some items. This will create some behavior in the application that you will be able to see later when you `monitor` the application.

> Known issue: clicking the provisioning link will not redirect to the correct page in **Visual Studio Code integrated terminal**. A fix is being released for this [VS Code known issue](https://github.com/microsoft/vscode/issues/144898#issuecomment-1079496948). For the meantime, please copy and paste the link in browser.

> :warning: **Cleanup**
>
> Please be aware that Azure resources, e.g. a Cosmos DB, have been created. You can clean up these resources by deleting the resource group that was create, or issuing the `azd infra delete` command.

### Next Steps

At this point, you have a complete application deployed on Azure. But there is much more that the Azure Developer CLI can do. These next steps will introduce you to additional commands that will make creating applications on Azure much easier. Using the Azure Developer CLI, you can setup your DevOps pipelines, monitor your application, test and debug locally.

#### Set up DevOps pipeline using `azd pipeline`

This template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```
azd pipeline config
```

#### Monitor the application using `azd monitor`

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

- Run the following command to open the "Overview" dashboard:

  ```bash
  azd monitor --overview
  ```

- Live Metrics Dashboard

  Run the following command to open the "Live Metrics" dashboard:

  ```bash
  azd monitor --live
  ```

- Logs Dashboard

  Run the following command to open the "Logs" dashboard:

  ```bash
  azd monitor --logs
  ```

#### Run and Debug Locally

The easiest way to run and debug is to leverage the Azure Developer CLI Visual Studio Code Extension. Refer to this [walkthrough](https://aka.ms/azure-dev/vscode) for more details.  

### Additional azd commands

Here is a quick list of commonly used `azd` command. For a complete list of available commands please refer to the [azd overview](https://aka.ms/azure-dev/overview).

#### `init`

Gets a local copy of a specific repository if `--template` is specified and initializes the project:

```bash
azd init --template todo-nodejs-mongo
```

> NOTE: All project configuration settings are stored in the `.azure/{environment name}/.env` file.

#### `infra delete`

Deletes all the resources created on Azure.

```bash
azd infra delete
```

#### `provision` aka `infra create`

Creates all the necessary Azure resources for the template.

```bash
azd provision
```

#### `deploy`

Deploys the application.

```bash
azd deploy
```

#### `infra delete`

Deletes Azure resources.

```bash
azd infra delete
```

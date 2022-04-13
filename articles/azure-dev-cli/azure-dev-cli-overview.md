---
title: Use the Azure Developer CLI
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# What is the Azure Developer CLI

The Azure Developer CLI (**azure-dev**) is a developer-centric command-line interface (CLI) tool for cloud applications. `az dev` has several sub-commands that allow developers to execute a number of actions (e.g., manage developer workflows, cloud resources, interactions with continuous integration and delivery (CI/CD) system, etc.)

## Currently supported commands
- [Deploy](#deploy)
- [Env](#env)
- [Infra](#infra)
- [Init](#init)
- [Monitor](#monitor)
- [Pipeline](#pipeline)
- [Provision](#provision)
- [Up](#up)

[Azure dev enabled templates](How-to-install-the-new-Azure-Dev-CLI#templates) are end to end sample repositories created using the azure-dev conventions so that you can use `az dev cli` to easily get started with Azure. All templates have the same file structure:

```bash

├── .github                    [ Configure GitHub workflow ]
├── .vscode                    [ VS Code workspace ]
├── assets                     [ Assets used by README.MD ]
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ Main infrastructure file ]
│   ├── main.parameters.json   [ Parameters file ]
│   └── resources.bicep        [ Resources file ]
├── src                        [ Contains folder(s) for the application code ]
└── azure.yaml                 [ Describes the application and type of Azure resources]

```

## `init`
`az dev init` sets up a project from an Azure Dev CLI enabled template. The command prompts for configuration settings like environment name, Azure region as well as Azure Subscription to use for creating the Azure resources. All configurations are stored in the `.env` file found in the `.azure` folder.

### FAQ	
1. What is environment name?

	The CLI uses the environment name to set the `AZURE_ENV_NAME` property which is used by az dev enabled templates. EnviroNment or AZURE_ENV_NAME is also used as a prefix to Azure resource name including the Azure resource group.

 	Since each environment has its own set of configurations, we keep all configuration files under environment folders. 

``` bash	 
├── .azure                          [ This folder shows up after you run az dev init or az dev up ]
│   ├── <your environment1>         [ Folder to house all environment related configurations ]
│   │   ├── .env                    [ Contains environment variables ]
│   │   └── main.parameters.json    [ Parameter file ]
│   └── <your environment2>         [ Folder to house all environment related configurations ]
│   │   ├── .env                    [ Contains environment variables ]
│   │   └── main.parameters.json    [ Parameter file ]
│   └──config.json 

```

1. Can I set up more than one environment?

	Yes! You can set up different environments (e.g., dev, test, prod.) You can use `az dev env` to manage environments.

1. Where is the environment configuration (.env) file?
	
	`<your-project-folder-name>\.azure\<your-environment-name>\.env`
	
1. **How is the .env file used?** 

	`az dev` commands refer to the .env file for environment configuration. Commands like `az dev up`/`az dev deploy` also writes/updates the .env file with e.g., db connection string, Azure Key Vault end point.
	
1. **How is azure.yaml used?** 

	`azure.yaml` describes the application(s) and type of Azure resources included in the template.

## `env`

`az dev env` is a subgroup command for managing environments. Supported commands:
- list    : List environments.
- new     : Create a new environment.
- refresh : Refresh environment settings using information from previous provisioning.
- select  : Set the default environment.
- set     : Set a value in the environment. Example: `az dev env set <KEY> <VALUE>`


## `provision`
`az dev provision` creates or updates the Azure resources for your project. `provision` is an alias for `az dev infra create`.

### FAQ
1. How does the command know what to provision?

	The command uses Bicep templates found under `<your-project-folder-name>/infra` to provision Azure resources 
	
1. Where can I find what are provisioned in Azure?

	Go to https://portal.azure.com, locate your resource group which is `<your-environment-name>rg`. 
	
1. How do I find more information about Azure errors?

	We use Bicep templates found under `<your-project-folder-name>/infra` to provision Azure resources and include the error message in the cli output if issues. 
	
	You can also go to https://portal.azure.com, locate your resource group which is `<your-environment-name>rg`. If any of the deployments fail, click link of the error to get more information.
	
	>Additional resource: [Troubleshoot common Azure deployment errors - Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/troubleshooting/common-deployment-errors)
	
1. Is there a log file for `az dev provision`? 
	
	COMING SOON

## `infra`

`az dev infra` is a group command for managing Azure resources. Subcommands:
- create - creates Azure resources
- delete - deletes Azure resources

## `deploy`

`az dev deploy` builds and publishes the application code into previously created Azure resources.

### FAQ
1. Can I rerun this command

	Yes.

## `up`

`az dev up` is a **single step** command to initialize a project (`az dev init`), provision Azure resources (`az dev provision`), and deploy the application code to Azure (`az dev deploy`.) 
	
### FAQ
1. Can I rerun `az dev up`?
	
	Yes. 
	
1. How do I find the log file for `az dev up`? 
	
	COMING SOON
	

## `pipeline`

`az dev pipeline config` pushes your local code to your GitHub repo and configures a GitHub Action so that the build and deploy job is automatically kicked off when you commit code to your GitHub repo.
	
### FAQ

1. What is Azure service principal?

	An Azure service principal is an identity created for use with applications, hosted services, and automated tools to access Azure resources. This access is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. Refer to [Connect GitHub and Azure | Microsoft Docs](https://docs.microsoft.com/azure/developer/github/connect-from-azure?tabs=azure-portal%2Cwindows#use-the-azure-login-action-with-a-service-principal-secret) for more on authenticating from Azure to GitHub 
	
1. Do I need to create an Azure service principal before running `az dev pipeline config`?

	No. `az dev pipeline config` takes care of creating the Azure service principal as well as performing the necessary steps to store the secrets in your GitHub repo.

1. What are all the secrets stored in GitHub?

	The command stores 4 secrets in GitHub: AZURE_CREDENTIALS, AZURE_ENV_NAME, AZURE_LOCATION and AZURE_SUBSCRIPTION_ID. You can override the value of each secret by going to `https://github.com/<your-GH-account>/<your-repo>/secrets/actions`.

1. Is [OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) supported? 

	No but the support is coming.

1. How do I reset the Azure service principal stored in GitHub Actions?

	Go to `https://github.com/<your-GH-account>/<your-repo>settings/secrets/actions`, update `AZURE_CREDENTIALS` by copying and pasting the entire JSON object for the new service principal. e.g., 

	```
	{
		"clientId": "<GUID>",
		"clientSecret": "<GUID>",
		"subscriptionId": "<GUID>",
		"tenantId": "<GUID>",
		(...)
	}
	```

1. Where is the GitHub action file?

	`<your-project-folder-name>\.github\workflows\azure-dev.yml`

1. In `azure-dev.yml` can I deploy just the code in the build step?

	Yes, just replace 
	
	`run: az dev up --no-prompt` 
	
	with 
	
	`run: az dev deploy --noprompt`

1. Where can I find the log for the GitHub action job I just triggered after running `az dev workflow`?

	Go to `https://github.com/<your-GH-account>/<your-repo>/actions` and refer to the log in the workflow run.

## `monitor`

`az dev monitor` launches a browser to show a dashboard for monitoring the cloud application. Available sub commands: 
1. `--overview` to open the "Overview" dashboard.
1. `--live` to open the "Live Metrics" dashboard.
1. `--log` to open the "Logs" dashboard.

>**Note**:
> * Text-based browser is not supported.
> * Live metrics is currently not supported for Python app refer to [this](https://docs.microsoft.com/en-us/azure/azure-monitor/app/live-stream#get-started) for more information.

# Features to be added in the future

## `debug`
(COMING) `az dev debug` starts debugging the application locally.

## `diff`
(COMING) `az dev diff` evaluates your local changes to resource definitions against what is currently provisioned to the cloud.

## `generate`
(COMING) `az dev generate` produces boilerplate infrastructure as code assets, e.g. CI/CD pipeline etc.

## `login`
(COMING) `az dev login` signs into the cloud platform.

## `run`
(COMING) `az dev run` executes the application locally.

## `test`
(COMING) `az dev test` runs local unit tests.
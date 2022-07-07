---
title: Azure Developer CLI (azd) Preview reference
description: Reference for Azure Developer CLI (azd).
author: puicchan
ms.author: puichan
ms.date: 06/09/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI (azd) Preview reference

This article explains the syntax and parameters for the different Azure Developer CLI (azd) Preview commands.

## azd

Azure Developer CLI (azd) - A CLI for developers building Azure solutions

### Synopsis

Azure Developer CLI (azd) - A CLI for developers building Azure solutions​

To begin working with azd, run the "azd up" command by supplying a sample template in an empty directory:​

```		
	$ azd up –-template todo-nodejs-mongo​
```

You can pick a template by running "azd template list" and supply the repo name as value to "–-template".​
		
The most common commands from there are:​

```	
	$ azd pipeline config​
	$ azd deploy
	$ azd monitor --overview
```
	
For more information, please visit the project page: https://aka.ms/azure-dev/devhub.​

### Options

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
  -h, --help                 Help for azd
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd deploy](#azd-deploy)	 - Deploy the application's code to Azure
* [azd down](#azd-down)	 - Delete Azure resources for an application
* [azd env](#azd-env)	 - Manage environments.
* [azd infra](#azd-infra)	 - Manage Azure resources
* [azd init](#azd-init)	 - Initialize a new application
* [azd login](#azd-login)	 - Log in to Azure
* [azd monitor](#azd-monitor)	 - Monitor a deployed application
* [azd pipeline](#azd-pipeline)	 - Manage GitHub Actions pipelines
* [azd provision](#azd-provision)	 - Provision the Azure resources for an application
* [azd restore](#azd-restore)	 - Restore application dependencies
* [azd template](#azd-template)	 - Manage templates
* [azd up](#azd-up)	 - Initialize application, provision Azure resources, and deploy your project with a single command
* [azd version](#azd-version)	 - Print the version number of azd

## azd deploy

Deploy the application's code to Azure

### Synopsis

Deploy the application's code to Azure.

When no "--service" is specified, all services in azure.yaml (found in the root of your project), are deployed.

Examples:

```
	$ azd deploy
	$ azd deploy –-service api
	$ azd deploy –-service web
```

Once deployment is complete, the endpoint is printed. Click or copy and paste the endpoint in a browser to launch the service.

```
azd deploy [flags]
```

### Options

```
  -h, --help             Help for deploy
  -o, --output string    Output format (supported formats are json, none) (default "none")
      --service string   Deploy a specific service (when unset, all services listed in azure.yaml are deployed)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd down

Delete Azure resources for an application

```
azd down [flags]
```

### Options

```
      --force           Do not require confirmation before deleting resources
  -h, --help            help for down
  -o, --output string   Output format (supported formats are json, none) (default "none")
      --purge           Permanently delete resources which are soft-deleted by default (e.g. Key Vaults)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd env

Manage environments.

### Synopsis

Manage environments.

This command group allows you to create a new environment or to get, set and list your application environments. An application can have multiple environments, e.g., dev, test, prod, each with different configuration (i.e., connectivity information) for accessing Azure resources. 

You can find all environment configurations under the .azure\<environment-name> folder(s). The environment name is stored as the AZURE_ENV_NAME environment variable in .azure\<environment-name>\folder\.env. 

### Options

```
  -h, --help   Help for env
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env get-values](#azd-env-get-values)	 - Get all environment values
* [azd env list](#azd-env-list)	 - List environments
* [azd env new](#azd-env-new)	 - Create a new environment
* [azd env refresh](#azd-env-refresh)	 - Refresh environment settings using information from previous infrastructure provision
* [azd env select](#azd-env-select)	 - Set the default environment
* [azd env set](#azd-env-set)	 - Set a value in the environment
* [Back to top](#azd)

## azd env get-values

Get all environment values

```
azd env get-values [flags]
```

### Options

```
  -h, --help            help for get-values
  -o, --output string   Output format (supported formats are json, dotenv) (default "dotenv")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd env list

List environments

```
azd env list [flags]
```

### Options

```
  -h, --help            help for list
  -o, --output string   Output format (supported formats are json, table) (default "table")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd env new

Create a new environment

```
azd env new <environment> [flags]
```

### Options

```
  -h, --help   help for new
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd env refresh

Refresh environment settings using information from previous infrastructure provision

```
azd env refresh [flags]
```

### Options

```
  -h, --help            help for refresh
  -o, --output string   Output format (supported formats are json, none) (default "none")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd env select

Set the default environment

```
azd env select <environment> [flags]
```

### Options

```
  -h, --help   help for select
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd env set

Set a value in the environment

```
azd env set <key> <value> [flags]
```

### Options

```
  -h, --help   help for set
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd env](#azd-env)	 - Manage environments.
* [Back to top](#azd)

## azd infra

Manage Azure resources

### Options

```
  -h, --help   help for infra
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd infra create](#azd-infra-create)	 - Create Azure resources for an application
* [azd infra delete](#azd-infra-delete)	 - Delete Azure resources for an application
* [Back to top](#azd)

## azd infra create

Create Azure resources for an application

```
azd infra create [flags]
```

### Options

```
  -h, --help            help for create
      --no-progress     Suppress progress information
  -o, --output string   Output format (supported formats are json, none) (default "none")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd infra](#azd-infra)	 - Manage Azure resources
* [Back to top](#azd)

## azd infra delete

Delete Azure resources for an application

```
azd infra delete [flags]
```

### Options

```
      --force   Do not require confirmation before deleting resources
  -h, --help    help for delete
      --purge   Permanently delete resources which are soft-deleted by default (e.g. Key Vaults)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd infra](#azd-infra)	 - Manage Azure resources
* [Back to top](#azd)

## azd init

Initialize a new application

### Synopsis

Initialize a new application

When no template is supplied, you can optionally select an azd template for cloning. Otherwise, "azd init" initializes the current directory and creates resources so that your project is compatible with azd.

When a template is provided, the sample code is cloned to the current directory.

```
azd init [flags]
```

### Options

```
  -b, --branch string     The template branch to initialize from
  -h, --help              Help for init
  -t, --template string   Template to use when initializing the project. You can use: 1. Full URI 2. <owner>/<repository> or 3. <repository> - if part of the azure-samples organization 
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd login

Log in to Azure

```
azd login [flags]
```

### Options

```
      --check-status      Check login status, instead of logging in
  -h, --help              help for login
  -o, --output string     Output format (supported formats are json, table) (default "table")
      --use-device-code   When true, log on using a device code instead of a browser
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd monitor

Monitor a deployed application

### Synopsis

Monitor a deployed application
		
Examples:

```
	$ azd monitor --overview
	$ azd monitor -–live
	$ azd monitor --logs
```

For more information, please visit: https://aka.ms/azure-dev/monitor.

```
azd monitor [flags]
```

### Options

```
  -h, --help       Help for monitor
      --live       Open a browser to Application Insights Live Metrics. Live Metrics is currently not supported for Python app
      --logs       Open a browser to Application Insights Logs
      --overview   Open a browser to Application Insights Overview Dashboard
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd pipeline

Manage GitHub Actions pipelines

### Synopsis

Manage GitHub Actions pipelines

azd template includes a GitHub Actions pipeline configuration file (find within folder .github/workflows) that will deploy your application whenever code is pushed to the main branch.
		
For more information, please visit: https://aka.ms/azure-dev/pipeline.

### Options

```
  -h, --help   Help for pipeline
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd pipeline config](#azd-pipeline-config)	 - Create and configure your deployment pipeline using GitHub Actions
* [Back to top](#azd)

## azd pipeline config

Create and configure your deployment pipeline using GitHub Actions

### Synopsis

Create and configure your deployment pipeline using GitHub Actions
		
For more information, please visit: https://aka.ms/azure-dev/pipeline.

```
azd pipeline config [flags]
```

### Options

```
  -h, --help                    Help for config
      --principal-name string   The name of the service principal to use to grant access to Azure resources as part of the pipeline
      --principal-role string   Role to assign to the service principal (default "Contributor")
      --remote-name string      The name of the git remote to configure the pipeline to run on (default "origin")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd pipeline](#azd-pipeline)	 - Manage GitHub Actions pipelines
* [Back to top](#azd)

## azd provision

Provision the Azure resources for an application

### Synopsis

Provision the Azure resources for an application

The command prompts you for the following values:

- Environment Name: Name of your environment.
- Azure Location: The Azure location where your resources will be deployed.
- Azure Subscription: The Azure Subscription where your resources will be deployed.

Depending on what Azure resources are created, this process may take a while. To view progress, go to Azure portal and search for the resource group that contains your environment name.

```
azd provision [flags]
```

### Options

```
  -h, --help            Help for provision
      --no-progress     Suppress progress information
  -o, --output string   Output format (supported formats are json, none) (default "none")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd restore

Restore application dependencies

### Synopsis

Restore application dependencies

Run this command to install/download all the required libraries so that you can build, run, and debug the application locally.

For best local run and debug experience, refer to https://aka.ms/azure-dev/vscode to use the VS Code extension.

```
azd restore [flags]
```

### Options

```
  -h, --help             Help for restore
      --service string   Restores dependencies for a specific service (when unset, dependencies for all services listed in azure.yaml are restored)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd template

Manage templates

### Options

```
  -h, --help   help for template
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd template list](#azd-template-list)	 - List templates
* [azd template show](#azd-template-show)	 - Show the template details
* [Back to top](#azd)

## azd template list

List templates

```
azd template list [flags]
```

### Options

```
  -h, --help            help for list
  -o, --output string   Output format (supported formats are json, table) (default "table")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd template](#azd-template)	 - Manage templates
* [Back to top](#azd)

## azd template show

Show the template details

```
azd template show <template> [flags]
```

### Options

```
  -h, --help            help for show
  -o, --output string   Output format (supported formats are json, table) (default "table")
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [azd template](#azd-template)	 - Manage templates
* [Back to top](#azd)

## azd up

Initialize application, provision Azure resources, and deploy your project with a single command

### Synopsis

TheInitialize the project (if the project folder hasn't been initialized or cloned from a template), provision Azure resources, and deploy your project with a single command.

The `azd up` command is the equivalent of calling all of the following commands:

```
azd init
azd provision
azd deploy
```

When no template is supplied, you can optionally select an azd template for cloning. Otherwise, "azd up" initializes the current directory so that your project is compatible with azd.

```
azd up [flags]
```

### Options

```
  -b, --branch string     The template branch to initialize from
  -h, --help              Help for up
      --no-progress       Suppress progress information
  -o, --output string     Output format (supported formats are json, none) (default "none")
      --service string    Deploy a specific service (when unset, all services listed in azure.yaml are deployed)
  -t, --template string   Template to use when initializing the project. You can use: 1. Full URI 2. <owner>/<repository> or 3. <repository> - if part of the azure-samples organization 
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)

## azd version

Print the version number of azd

```
azd version [flags]
```

### Options

```
  -h, --help   help for version
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### See also

* [Back to top](#azd)
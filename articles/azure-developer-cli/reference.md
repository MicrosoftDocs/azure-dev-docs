---
title: Azure Developer CLI reference (preview)
description: This article explains the syntax and parameters for the various Azure Developer CLI Preview commands.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 10/31/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI reference (preview)

This article explains the syntax and parameters for the various Azure Developer CLI Preview commands.

## azd

Azure Developer CLI (`azd`) is a command-line interface for developers who build Azure solutions.

### Synopsis

To begin working with Azure Developer CLI, run the `azd up` command by supplying a sample template in an empty directory:

```azdeveloper
azd up –-template todo-nodejs-mongo
```

You can pick a template by running `azd template list` and then supplying the repo name as a value to `--template`.

The most common next commands are:

```azdeveloper
azd pipeline config
azd deploy
azd monitor --overview
```

For more information, visit the [Azure Developer CLI Dev Hub](./overview.md).

### Options

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
-h, --help                 Gets help for azd.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [azd deploy](#azd-deploy): Deploy the app's code to Azure.
* [azd down](#azd-down): Delete Azure resources for an app.
* [azd env](#azd-env): Manage environments.
* [azd infra](#azd-infra): Manage Azure resources.
* [azd init](#azd-init): Initialize a new app.
* [azd login](#azd-login): Log in to Azure.
* [azd monitor](#azd-monitor): Monitor a deployed app.
* [azd pipeline](#azd-pipeline): Manage GitHub Actions pipelines.
* [azd provision](#azd-provision): Provision the Azure resources for an app.
* [azd restore](#azd-restore): Restore app dependencies.
* [azd template](#azd-template): Manage templates.
* [azd up](#azd-up): Initialize the app, provision Azure resources, and deploy your project with a single command.
* [azd version](#azd-version): Print the version number of Azure Developer CLI.

## azd config

Manage the Azure Developer CLI user configuration, which includes your default Azure subscription and location. 

Available since `azure-dev-cli_0.4.0-beta.1`. 

### Synopsis

The easiest way to configure azd is to run `azd init`. The subscription and location you select will be stored in the config.json file located at $AZURE_CONFIG_DIR. The default value of AZURE_CONFIG_DIR is:
- `$HOME/.azd` on Linux and macOS
- `%USERPROFILE%\.azd` on Windows

```azdeveloper
azd config [command]
```  

Use "azd config [command] --help" for more information about a command.

### Options

```azdeveloper
-h, --help   Gets help for config.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config get](#azd-config-get): Gets a configuration
- [azd config list](#azd-config-list): Lists all configuration values
- [azd config reset](#azd-config-reset): Resets configuration to default
- [azd config set](#azd-config-set): Sets a configuration
- [azd config unset](#azd-config-unset): Unsets a configuration
- [Back to top](#azd)

## azd config get

Gets a configuration in $AZURE_CONFIG_DIR/config.json.

```azdeveloper
azd config get <path> [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for get.
-o, --output string   The output format (the supported formats are json). (default "json")
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config](#azd-config): Manage user configurations
- [Back to top](#azd)

## azd config list

Lists all configuration values in $AZURE_CONFIG_DIR/config.json.

```azdeveloper
azd config list [flags]
```  

### Options

```azdeveloper
-h, --help            Gets help for list.
-o, --output string   The output format (the supported formats are json). (default "json")
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config](#azd-config): Manage user configurations
- [Back to top](#azd)

## azd config set

Sets a configuration in $AZURE_CONFIG_DIR/config.json. 

```azdeveloper
azd config set <path> <value> [flags]
```

Example:

```azdeveloper
azd config set defaults.subscription <yourSubscriptionID>
azd config set defaults.location eastus
```
 
### Options

```azdeveloper
-h, --help   Gets help for set.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config](#azd-config): Manage user configurations
- [Back to top](#azd)

## azd config reset

Resets all configuration in $AZURE_CONFIG_DIR/config.json to the default.

```azdeveloper
azd config reset [flags]
```

### Options

```azdeveloper
-h, --help   Gets help for reset.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config](#azd-config): Manage user configurations
- [Back to top](#azd)

## azd config unset

Removes a configuration in $AZURE_CONFIG_DIR/config.json. For example:

```azdeveloper
azd config unset <path> [flags]
```

### Options   

```azdeveloper
-h, --help   Gets help for unset.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

- [azd config](#azd-config): Manage user configurations
- [Back to top](#azd)

## azd deploy

Deploy the app's code to Azure.

### Synopsis

Deploy the app's code to Azure.

When no `--service` value is specified, all services in the *azure.yaml* file (found in the root of your project) are deployed.

Examples:

```azdeveloper
azd deploy
azd deploy --service api
azd deploy --service web
```
	
After the deployment is complete, the endpoint is printed. To start the service, select the endpoint or paste it in a browser.

```
azd deploy [flags]
```

### Options

```azdeveloper
-h, --help             Gets help for the deployment.
-o, --output string    The output format (the supported formats are JSON, none; the default is none).
    --service string   Deploys a specific service (when the string is unspecified, all services that are listed in the azure.yaml file are deployed).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default value.
```

### See also

* [Back to top](#azd)

## azd down

Delete Azure resources for an app.

```azdeveloper
azd down [flags]
```

### Options

```azdeveloper
    --force           Does not require confirmation before it deletes resources.
-h, --help            Gets help for down.
-o, --output string   The output format (the supported formats are JSON, none; the default is none).
    --purge           Permanently deletes resources that are soft-deleted by default (for example, key vaults).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default value.
```

### See also

* [Back to top](#azd)

## azd env

Manage environments.

### Synopsis

Manage environments.

With this command group, you can create a new environment or get, set, and list your app environments. An app can have multiple environments (for example, dev, test, prod), each with a different configuration (that is, connectivity information) for accessing Azure resources. 

You can find all environment configurations under the `.azure\<environment-name>` directories. The environment name is stored as the AZURE_ENV_NAME environment variable in the `.azure\<environment-name>\directory\.env` file.

### Options

```azdeveloper
-h, --help   Gets help for the environment.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env get-values](#azd-env-get-values): Get all environment values.
* [azd env list](#azd-env-list): List environments.
* [azd env new](#azd-env-new): Create a new environment.
* [azd env refresh](#azd-env-refresh): Refresh environment settings by using information from a previous infrastructure provision.
* [azd env select](#azd-env-select): Set the default environment.
* [azd env set](#azd-env-set): Set a value in the environment.
* [Back to top](#azd)

## azd env get-values

Get all environment values.

```azdeveloper
azd env get-values [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for get-values.
-o, --output string   The output format (the supported formats are JSON, dotenv; the default is dotenv).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env list

To list the environments, run:

```azdeveloper
azd env list [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for list.
-o, --output string   The output format (the supported formats are JSON, table; the default is table).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env new

Create a new environment.

```azdeveloper
azd env new <environment> [flags]
```

### Options

```azdeveloper
-h, --help                  Gets help for new.
-l, --location string       Azure location for the new environment
    --subscription string   Name or ID of an Azure subscription to use for the new environment
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env refresh

Refresh environment settings by using information from a previous infrastructure provision.

```azdeveloper
azd env refresh [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for refresh.
-o, --output string   The output format (the supported formats are JSON, none; the default is none).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env select

Set the default environment.

```azdeveloper
azd env select <environment> [flags]
```

### Options

```azdeveloper
-h, --help   Gets help for select.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env set

Set a value in the environment.

```azdeveloper
azd env set <key> <value> [flags]
```

### Options

```azdeveloper
-h, --help   Gets help for set.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd infra

Manage Azure resources.

### Options

```azdeveloper
-h, --help   Gets help for infra.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd infra create](#azd-infra-create): Create Azure resources for an app.
* [azd infra delete](#azd-infra-delete): Delete Azure resources for an app.
* [Back to top](#azd)

## azd infra create

Create Azure resources for an app.

```azdeveloper
azd infra create [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for create.
    --no-progress     Suppresses progress information.
-o, --output string   The output format (the supported formats are JSON, none; the default is none).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd infra](#azd-infra): Manage Azure resources.
* [Back to top](#azd)

## azd infra delete

Delete Azure resources for an app.

```azdeveloper
azd infra delete [flags]
```

### Options

```azdeveloper
    --force   Doesn't require confirmation before deleting resources.
-h, --help    Gets help for delete.
    --purge   Permanently deletes resources that are soft-deleted by default (for example, key vaults).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd infra](#azd-infra): Manage Azure resources.
* [Back to top](#azd)

## azd init

Initialize a new app.

### Synopsis

Initialize a new app.

When no template is supplied, you can optionally select an Azure Developer CLI template for cloning. Otherwise, `azd init` initializes the current directory and creates resources so that your project is compatible with Azure Developer CLI.

When a template is provided, the sample code is cloned to the current directory.

```
azd init [flags]
```

### Options

```azdeveloper
-b, --branch string         The template branch to initialize from.
-h, --help                  Gets help for init.
-l, --location string       Azure location for the new environment
    --subscription string   Name or ID of an Azure subscription to use for the new environment
-t, --template string       The template to use when you initialize the project. You can use Full URI, <owner>/<repository>, or <repository> if it's part of the azure-samples organization.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd login

Log in to Azure.

```azdeveloper
azd login [flags]
```

### Options

```azdeveloper
    --check-status      Checks the log-in status instead of logging in.
-h, --help              Gets help for login.
-o, --output string     The output format (the supported formats are JSON, table; the default is table).
    --use-device-code   When true, log in by using a device code instead of a browser.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd monitor

Monitor a deployed app.

### Synopsis

Monitor a deployed app.
		
Examples:

```azdeveloper
azd monitor --overview
azd monitor -–live
azd monitor --logs
```
		
For more information, see [Monitor your app using Azure Developer CLI (azd)](./monitor-your-app.md).

```azdeveloper
azd monitor [flags]
```

### Options

```azdeveloper
-h, --help       Gets help for monitor.
    --live       Open a browser to Application Insights Live Metrics. Live Metrics is currently not supported for the Python app.
    --logs       Open a browser to Application Insights Logs.
    --overview   Open a browser to Application Insights Overview Dashboard.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd pipeline

Manage GitHub Actions or Azure Pipelines.

### Synopsis

Manage GitHub Actions or Azure pipelines.

The Azure Developer CLI template includes a GitHub Actions and a Azure pipeline configuration file in the `.github/workflows` directory and `.azdo/pipelines` respectively. The configuration file deploys your app whenever code is pushed to the main branch.

For more information, see [Configure a pipeline and push updates using GitHub Actions](./configure-devops-pipeline.md).

### Options

```azdeveloper
-h, --help   Gets help for pipeline.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline config](#azd-pipeline-config): Create and configure your deployment pipeline by using GitHub Actions.
* [Back to top](#azd)

## azd pipeline config

Create and configure your deployment pipeline by using GitHub Actions or Azure Pipelines.

### Synopsis

Create and configure your deployment pipeline by using GitHub Actions or Azure Pipelines.

For more information, see [Configure a pipeline and push updates](./configure-devops-pipeline.md)

```azdeveloper
azd pipeline config [flags]
```

### Options

```azdeveloper
-h, --help                    Gets help for config.
    --principal-name string   The name of the service principal to use to grant access to Azure resources as part of the pipeline.
    --principal-role string   The role to assign to the service principal (the default is Contributor).
    --provider string         The pipeline provider to use (GitHub and Azdo supported).
    --remote-name string      The name of the git remote to configure the pipeline to run on (the default is origin)
```

### Options inherited from parent commands

```
  -C, --cwd string           Sets the current working directory.
      --debug                Enables debugging and diagnostics logging.
  -e, --environment string   The name of the environment to use.
      --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline](#azd-pipeline): Manage GitHub Actions pipelines.
* [Back to top](#azd)

## azd provision

Provision the Azure resources for an app.

### Synopsis

Provision the Azure resources for an app.

The command prompts you for the following values:
- Environment name: The name of your environment.
- Azure location: The Azure location where your resources will be deployed.
- Azure subscription: The Azure subscription where your resources will be deployed.

Depending on what Azure resources are created, running this command might take a while. To view progress, go to the Azure portal and search for the resource group that contains your environment name.

```azdeveloper
azd provision [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for provision.
    --no-progress     Suppresses progress information.
-o, --output string   The output format (the supported formats are JSON, none; the default is none).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd restore

Restore app dependencies.

### Synopsis

Restore app dependencies.

Run this command to download and install all the required libraries so that you can build, run, and debug the app locally.

For the best local run and debug experience, see [Debug by using the Visual Studio Code extension](./debug.md?pivots=ide-vs-code).

```azdeveloper
azd restore [flags]
```

### Options

```azdeveloper
-h, --help             Gets help for restore.
    --service string   Restores a specific service (when the string is unspecified, all services that are listed in the azure.yaml file are restored).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd template

Manage templates.

### Options

```azdeveloper
-h, --help   Gets help for template.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template list](#azd-template-list): List templates.
* [azd template show](#azd-template-show): Show the template details.
* [Back to top](#azd)

## azd template list

List templates.

```azdeveloper
azd template list [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for list.
-o, --output string   The output format (the supported formats are JSON, table; the default is table).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Manage templates.
* [Back to top](#azd)

## azd template show

Show the template details.

```azdeveloper
azd template show <template> [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for show.
-o, --output string   The output format (the supported formats are JSON, table; the default is table).
```

### Options inherited from parent commands

```
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Manage templates.
* [Back to top](#azd)

## azd up

Initialize app, provision Azure resources, and deploy your project with a single command.

### Synopsis

If the project directory hasn't been initialized or cloned from a template, the `azd up` command initializes the app. The command then provisions Azure resources and deploys your project.

This command executes the following in one step:

```azdeveloper
azd init
azd provision
azd deploy
```

When no template is supplied, you can optionally select an Azure Developer CLI template for cloning. Otherwise, running `azd up` initializes the current directory so that your project is compatible with Azure Developer CLI.

```azdeveloper
azd up [flags]
```

### Options

```azdeveloper
-b, --branch string         The template branch to initialize from.
-h, --help                  Gets help for up.
-l, --location string       Azure location for the new environment
    --no-progress           Suppresses progress information.
-o, --output string         The output format (the supported formats are JSON, none; the default is none).
    --service string        Deploys a specific service (when the string is unspecified, all services that are listed in the azure.yaml file are deployed).
    --subscription string   Name or ID of an Azure subscription to use for the new environment
-t, --template string       The template to use when you initialize the project. You can use Full URI, <owner>/<repository>, or <repository> if it's part of the azure-samples organization.
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd version

Print the version number of Azure Developer CLI.

```azdeveloper
azd version [flags]
```

### Options

```azdeveloper
-h, --help            Gets help for version.
-o, --output string   The output format (the supported formats are JSON, none; the default is none).
```

### Options inherited from parent commands

```azdeveloper
-C, --cwd string           Sets the current working directory.
    --debug                Enables debugging and diagnostics logging.
-e, --environment string   The name of the environment to use.
    --no-prompt            Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)
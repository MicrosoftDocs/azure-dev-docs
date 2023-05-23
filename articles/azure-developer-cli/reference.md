---
title: Azure Developer CLI reference
description: This article explains the syntax and parameters for the various Azure Developer CLI commands.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/11/2023
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, build-2023
---

# Azure Developer CLI reference

This article explains the syntax and parameters for the various Azure Developer CLI commands.

## azd

Azure Developer CLI (`azd`) is a command-line interface for developers who build Azure solutions.

### Synopsis

To begin working with Azure Developer CLI, run the `azd init` command along with a sample template name in an empty directory. For example:

```azdeveloper
	azd init –-template todo-nodejs-mongo
```

You can view a list of template names by running `azd template list`. You can then supplying one of those template names as a value to `--template`.

After initializing your project with `azd init`, you are ready to provision and deploy with `azd up`:

```azdeveloper
	azd up
```

The most common next commands are:

```azdeveloper
	azd pipeline config
	azd deploy
	azd monitor --overview
```

For more information, visit the Azure Developer CLI Dev Hub: [https://aka.ms/azure-dev/devhub](https://aka.ms/azure-dev/devhub).

> [!NOTE]
> In `azd` versions prior to `0.8.0-beta.1`, you could initialize, provision, and deploy your app with a sample template by running `azd up --template [template-name]`. This behavior is no longer supported. Check out this [release blog post](https://aka.ms/azd-april-2023) for more information.

### Options

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
  -h, --help         Gets help for azd.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [azd deploy](#azd-deploy): Deploy the app's code to Azure.
* [azd down](#azd-down): Delete Azure resources for an app.
* [azd env](#azd-env): Manage environments.
* [azd init](#azd-init): Initialize a new app.
* [azd auth login](#azd-auth-login): Log in to Azure.
* [azd auth logout](#azd-auth-logout): Log out of Azure
* [azd monitor](#azd-monitor): Monitor a deployed app.
* [azd package](#azd-package): Create a deployable package for an app.
* [azd pipeline](#azd-pipeline): Manage GitHub Actions or Azure Pipelines.
* [azd provision](#azd-provision): Provision the Azure resources for an app.
* [azd restore](#azd-restore): Restore app dependencies.
* [azd template](#azd-template): Manage templates.
* [azd up](#azd-up): Provision Azure resources and deploy your project with a single command.
* [azd version](#azd-version): Print the version number of Azure Developer CLI.

## azd config

Manage the Azure Developer CLI user configuration.

### Synopsis

Manage the Azure Developer CLI user configuration, which includes your default Azure subscription and location.

Available since `azure-dev-cli_0.4.0-beta.1`.

The easiest way to configure `azd` for the first time is to run [`azd init`](#azd-init). The subscription and location you select will be stored in the `config.json` file located in the config directory. To configure `azd` anytime afterwards, you'll use [`azd config set`](#azd-config-set).

The default value of the config directory is: 
* $HOME/.azd on Linux and macOS
* %USERPROFILE%\.azd on Windows


The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

### Options

```azdeveloper
  -h, --help   Gets help for config.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config get](#azd-config-get): Gets a configuration
* [azd config list](#azd-config-list): Lists all configuration values
* [azd config list-alpha](#azd-config-list-alpha): List all alpha stage features
* [azd config reset](#azd-config-reset): Resets configuration to default
* [azd config set](#azd-config-set): Sets a configuration
* [azd config unset](#azd-config-unset): Unsets a configuration
* [Back to top](#azd)

## azd config get

Gets a configuration

### Synopsis

Gets a configuration in the configuration path.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

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
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd config list

Lists all configuration values

### Synopsis

Lists all configuration values in the configuration path.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

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
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd config list-alpha

Lists all alpha stage features.

### Synopsis

Lists all alpha stage features.

```azdeveloper
azd config list-alpha [flags]
```

### Options

```azdeveloper
  -h, --help            Gets help for list.
  -o, --output string   The output format (the supported formats are json). (default "json")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd config reset

Resets configuration to default

### Synopsis

Resets all configuration in the configuration path.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable to the default.

```azdeveloper
azd config reset [flags]
```

### Options

```azdeveloper
  -h, --help   Gets help for reset.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd config set

Sets a configuration

### Synopsis

Sets a configuration in the configuration path, such as enabling default values or enabling **alpha** features.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

```azdeveloper
azd config set <path> <value> [flags]
```

### Examples

```azdeveloper
azd config set defaults.subscription <yourSubscriptionID>
azd config set defaults.location eastus

azd config set alpha.<feature_name> on
azd config set alpha.all on
```

### Options

```azdeveloper
  -h, --help   Gets help for set.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd config unset

Unsets a configuration

### Synopsis

Removes a configuration in the configuration path, such as deleting default values or disabling **alpha** features.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

```azdeveloper
azd config unset <path> [flags]
```

### Examples

```azdeveloper
azd config unset defaults.location

azd config unset alpha.<feature_name> on
azd config unset alpha.all on
```

### Options

```azdeveloper
  -h, --help   Gets help for unset.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage the Azure Developer CLI user configuration.
* [Back to top](#azd)

## azd deploy

Deploy the app's code to Azure.

### Synopsis

Deploy the app's code to Azure. This command is sensitive to the current working directory. Run `azd deploy` at the project root to deploy all services, or run the command from a service directory to deploy that specific service.

Examples:

```azdeveloper
	azd deploy
```
	
After the deployment is complete, the endpoint is printed. To start the service, select the endpoint or paste it in a browser.

```azdeveloper
azd deploy [flags]
```

### Options

```azdeveloper
  -a, --all                  Deploys all services, regardless of the current working directory.
  -s, --service              Deploys a specific service by name.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for deploy.
  -o, --output string        The output format (the supported formats are json, none). (default "none")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -e, --environment string   The name of the environment to use.
      --force                Does not require confirmation before it deletes resources.
  -h, --help                 Gets help for down.
  -o, --output string        The output format (the supported formats are json, none). (default "none")
      --purge                Does not require confirmation before it permanently deletes resources that are soft-deleted by default (for example, key vaults).
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -h, --help   Gets help for env.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for get-values.
  -o, --output string        The output format (the supported formats are json, dotenv). (default "dotenv")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd env list

List environments.

```azdeveloper
azd env list [flags]
```

### Options

```azdeveloper
  -h, --help            Gets help for list.
  -o, --output string   The output format (the supported formats are json, table). (default "table")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for refresh.
  -o, --output string        The output format (the supported formats are json, none). (default "none")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for set.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments.
* [Back to top](#azd)

## azd init

Initialize a new app.

### Synopsis

Initialize a new app.

When no template is supplied, you can optionally select an Azure Developer CLI template for cloning. Otherwise, `azd init` initializes the current directory and creates resources so that your project is compatible with Azure Developer CLI.

When a template is provided, the sample code is cloned to the current directory.

```azdeveloper
azd init [flags]
```

### Options

```azdeveloper
  -b, --branch string         The template branch to initialize from.
  -e, --environment string    The name of the environment to use.
  -h, --help                  Gets help for init.
  -l, --location string       Azure location for the new environment
      --subscription string   Name or ID of an Azure subscription to use for the new environment
  -t, --template string       The template to use when you initialize the project. You can use Full URI, <owner>/<repository>, or <repository> if it's part of the azure-samples organization.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd auth login

Log in to Azure.

### Synopsis

Log in to Azure.

When run without any arguments, log in interactively using a browser. To log in using a device code, pass
--device-code.

To log in as a service principal, pass --client-id and --tenant-id as well as one of --client-secret, 
--client-certificate, --client-credential or --client-credential-provider.

```azdeveloper
azd auth login [flags]
```

### Options

```azdeveloper
      --check-status                           Checks the log-in status instead of logging in.
      --client-certificate string              The path to the client certificate for the service principal to authenticate with.
      --client-id string                       The client id for the service principal to authenticate with.
      --client-secret string                   The client secret for the service principal to authenticate with. Set to the empty string to read the value from the console.
      --federated-credential string            The federated token for the service principal to authenticate with. Set to the empty string to read the value from the console.
      --federated-credential-provider string   The provider to use to acquire a federated token to authenticate with.
  -h, --help                                   Gets help for login.
  -o, --output string                          The output format (the supported formats are json, none). (default "none")
      --redirect-port int                      Choose the port to be used as part of the redirect URI during interactive login.
      --tenant-id string                       The tenant id for the service principal to authenticate with.
      --use-device-code                        When true, log in by using a device code instead of a browser. (default true)
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd auth logout

Log out of Azure

### Synopsis

Log out of Azure

```azdeveloper
azd auth logout [flags]
```

### Options

```azdeveloper
  -h, --help   Gets help for logout.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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

For more information, go to [https://aka.ms/azure-dev/monitor](https://aka.ms/azure-dev/monitor).

```azdeveloper
azd monitor [flags]
```

### Options

```azdeveloper
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for monitor.
      --live                 Open a browser to Application Insights Live Metrics. Live Metrics is currently not supported for Python apps.
      --logs                 Open a browser to Application Insights Logs.
      --overview             Open a browser to Application Insights Overview Dashboard.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd package

Packages the application's code to be deployed to Azure.

### Synopsis

Packages the application's code to be deployed to Azure.

Examples:

```azdeveloper
	azd package <service> [flags]
```

### Options

```azdeveloper
      --all                  Packages all services that are listed in `azure.yaml`.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for monitor.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd pipeline

Manage GitHub Actions or Azure Pipelines.

### Synopsis

Manage GitHub Actions or Azure Pipelines.

The Azure Developer CLI template includes a GitHub Actions and an Azure Pipeline configuration file in the `.github/workflows` and `.azdo/pipelines` directories respectively. The configuration file deploys your app whenever code is pushed to the main branch.

For more information, go to [https://aka.ms/azure-dev/pipeline](https://aka.ms/azure-dev/pipeline).

### Options

```azdeveloper
  -h, --help   Gets help for pipeline.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline config](#azd-pipeline-config): Create and configure your deployment pipeline by using GitHub Actions or Azure Pipelines.
* [Back to top](#azd)

## azd pipeline config

Create and configure your deployment pipeline by using GitHub Actions or Azure Pipelines.

### Synopsis

Create and configure your deployment pipeline by using GitHub Actions or Azure Pipelines.

For more information, go to [https://aka.ms/azure-dev/pipeline](https://aka.ms/azure-dev/pipeline).

```azdeveloper
azd pipeline config [flags]
```

### Options

```azdeveloper
      --auth-type string        The authentication type used between the pipeline provider and Azure for deployment (Only valid for GitHub provider)
  -e, --environment string      The name of the environment to use.
  -h, --help                    Gets help for config.
      --principal-name string   The name of the service principal to use to grant access to Azure resources as part of the pipeline.
      --principal-role string   The role to assign to the service principal. (default "contributor")
      --provider string         The pipeline provider to use (github for Github Actions and azdo for Azure Pipelines). (default "github")
      --remote-name string      The name of the git remote to configure the pipeline to run on. (default "origin")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline](#azd-pipeline): Manage GitHub Actions or Azure Pipelines.
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
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for provision.
  -o, --output string        The output format (the supported formats are json, none). (default "none")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd restore

Restore app dependencies. This command is sensitive to the current working directory. Run `azd restore` at the project root to restore dependencies for all services, or run the command from a service directory to restore only those service dependencies.

### Synopsis

Restore app dependencies.

Run this command to download and install all the required libraries so that you can build, run, and debug the app locally.

For the best local run and debug experience, go to [https://aka.ms/azure-dev/vscode](https://aka.ms/azure-dev/vscode) to learn how to use the Visual Studio Code extension.

```azdeveloper
azd restore [flags]
```

### Options

```azdeveloper
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for restore.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -o, --output string   The output format (the supported formats are json, table). (default "table")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -o, --output string   The output format (the supported formats are json, table). (default "table")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Manage templates.
* [Back to top](#azd)

## azd up

Provision Azure resources and deploy your project with a single command.

### Synopsis

Provision Azure resources and deploy your project with a single command.

This command executes the following in one step:

```azdeveloper
	azd provision
	azd deploy
```

Before running this command for the first time, run [`azd init`](#azd-init). 

```azdeveloper
azd up [flags]
```

### Options

```azdeveloper
  -e, --environment string    The name of the environment to use.
  -h, --help                  Gets help for up.
  -o, --output string         The output format (the supported formats are json, none). (default "none")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
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
  -o, --output string   The output format (the supported formats are json, none). (default "none")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

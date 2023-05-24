---
title: Azure Developer CLI reference (preview)
description: This article explains the syntax and parameters for the various Azure Developer CLI Preview commands.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/12/2023
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI reference (preview)

This article explains the syntax and parameters for the various Azure Developer CLI Preview commands.

## azd

The Azure Developer CLI (`azd`) is an open-source tool that helps onboard and manage your application on Azure

### Options

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
  -h, --help         Gets help for azd.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd auth](#azd-auth): Authenticate with Azure.
* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
* [azd deploy](#azd-deploy): Deploy the application's code to Azure.
* [azd down](#azd-down): Delete Azure resources for an application.
* [azd env](#azd-env): Manage environments.
* [azd init](#azd-init): Initialize a new application.
* [azd monitor](#azd-monitor): (Beta) Monitor a deployed application.
* [azd package](#azd-package): (Beta) Packages the application's code to be deployed to Azure.
* [azd pipeline](#azd-pipeline): (Beta) Manage and configure your deployment pipelines.
* [azd provision](#azd-provision): Provision the Azure resources for an application.
* [azd restore](#azd-restore): Restores the application's dependencies.
* [azd template](#azd-template): (Beta) Find and view template details.
* [azd up](#azd-up): Provision Azure resources, and deploy your project with a single command.
* [azd version](#azd-version): Print the version number of Azure Developer CLI.

## azd auth

Authenticate with Azure.

### Options

```azdeveloper
  -h, --help   Gets help for auth.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd auth login](#azd-auth-login): Log in to Azure.
* [azd auth logout](#azd-auth-logout): Log out of Azure.
* [Back to top](#azd)

## azd auth login

Log in to Azure.

### Synopsis

Log in to Azure.

When run without any arguments, log in interactively using a browser. To log in using a device code, pass
--use-device-code.

To log in as a service principal, pass --client-id and --tenant-id as well as one of: --client-secret, 
--client-certificate, or --federated-credential-provider.


```azdeveloper
azd auth login [flags]
```

### Options

```azdeveloper
      --check-status                           Checks the log-in status instead of logging in.
      --client-certificate string              The path to the client certificate for the service principal to authenticate with.
      --client-id string                       The client id for the service principal to authenticate with.
      --client-secret string                   The client secret for the service principal to authenticate with. Set to the empty string to read the value from the console.
      --federated-credential-provider string   The provider to use to acquire a federated token to authenticate with.
  -h, --help                                   Gets help for login.
      --redirect-port int                      Choose the port to be used as part of the redirect URI during interactive login.
      --tenant-id string                       The tenant id or domain name to authenticate with.
      --use-device-code                 When true, log in by using a device code instead of a browser.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd auth](#azd-auth): Authenticate with Azure.
* [Back to top](#azd)

## azd auth logout

Log out of Azure.

### Synopsis

Log out of Azure.

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

* [azd auth](#azd-auth): Authenticate with Azure.
* [Back to top](#azd)

## azd config

Manage azd configurations (ex: default Azure subscription, location).

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

* [azd config get](#azd-config-get): Gets a configuration.
* [azd config list](#azd-config-list): Lists all configuration values.
* [azd config list-alpha](#azd-config-list-alpha): Display the list of available features in alpha stage.
* [azd config reset](#azd-config-reset): Resets configuration to default.
* [azd config set](#azd-config-set): Sets a configuration.
* [azd config unset](#azd-config-unset): Unsets a configuration.
* [Back to top](#azd)

## azd config get

Gets a configuration.

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
  -h, --help   Gets help for get.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config list

Lists all configuration values.

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
  -h, --help   Gets help for list.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config list-alpha

Display the list of available features in alpha stage.

```azdeveloper
azd config list-alpha [flags]
```

### Options

```azdeveloper
  -h, --help   Gets help for list-alpha.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config reset

Resets configuration to default.

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

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config set

Sets a configuration.

### Synopsis

Sets a configuration in the configuration path.

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

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config unset

Unsets a configuration.

### Synopsis

Removes a configuration in the configuration path.

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

* [azd config](#azd-config): Manage azd user configuration (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd deploy

Deploy the application's code to Azure.

```azdeveloper
azd deploy <service> [flags]
```

### Options

```azdeveloper
      --all                   Deploys all services that are listed in azure.yaml
  -e, --environment string    The name of the environment to use.
      --from-package string   Deploys the application from an existing package.
  -h, --help                  Gets help for deploy.
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

Delete Azure resources for an application. Running `azd down` will not delete application files on your local machine.

```azdeveloper
azd down [flags]
```

### Options

```azdeveloper
  -e, --environment string   The name of the environment to use.
      --force                Does not require confirmation before it deletes resources.
  -h, --help                 Gets help for down.
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
* [azd env set](#azd-env-set): Manage your environment settings.
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
  -h, --help   Gets help for list.
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

Manage your environment settings.

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

Initialize a new application.
- Running `azd init` without a template will prompt you to start with a minimal template or select from a curated list of presets.
- To view all available sample templates, including those submitted by the `azd` community, visit: aka.ms/awesome-azd

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

## azd monitor

(Beta) Monitor a deployed application.  For more information, go to: https://aka.ms/azure-dev/monitor.

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

(Beta) Packages the application's code to be deployed to Azure.
- By default, packages all services listed in 'azure.yaml' in the current directory, or the service described in the project that matches the current directory.
- When <service> is set, only the specific service is packaged.
- After the packaging is complete, the package locations are printed.


```azdeveloper
azd package <service> [flags]
```

### Options

```azdeveloper
      --all                  Deploys all services that are listed in azure.yaml
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for package.
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

(Beta) Manage integrating your application with build pipelines.
- The Azure Developer CLI template includes a GitHub Actions pipeline configuration file (in the `.github/workflows` folder) that deploys your application whenever code is pushed to the main branch.
- For more information, go to: aka.ms/azure-dev/pipeline.

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

* [azd pipeline config](#azd-pipeline-config): Create and configure your deployment pipeline by using GitHub or Azure Pipelines.
* [Back to top](#azd)

## azd pipeline config

Create and configure your deployment pipeline by using GitHub or Azure Pipelines.

```azdeveloper
azd pipeline config [flags]
```

### Options

```azdeveloper
      --auth-type string        The authentication type used between the pipeline provider and Azure for deployment (Only valid for GitHub provider). Valid values: federated, client-credentials.
  -e, --environment string      The name of the environment to use.
  -h, --help                    Gets help for config.
      --principal-name string   The name of the service principal to use to grant access to Azure resources as part of the pipeline.
      --principal-role string   The role to assign to the service principal. (default "contributor")
      --provider string         The pipeline provider to use (github for Github Actions and azdo for Azure Pipelines).
      --remote-name string      The name of the git remote to configure the pipeline to run on. (default "origin")
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline](#azd-pipeline): Manage and configure your deployment pipelines.
* [Back to top](#azd)

## azd provision

Provision the Azure resources for an application. This step may take a while depending on the resources provisioned. You should run `azd provision` any time you update your Bicep or Terraform file.

This command prompts you to input the following:
-  Environment name: The name of your environment (ex: dev, test, prod).
- Azure location: The Azure location where your resources will be deployed.
- Azure subscription: The Azure subscription where your resources will be deployed.

### Synopsis

Provision the Azure resources for an application.

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

(Beta) Restore application dependencies.
- Run this command to download and install all required dependencies so that you can build, run, and debug the application locally.
- For the best local run and debug experience, go to aka.ms/azure-dev/vscode to learn how to use the Visual Studio Code extension.
>```

```azdeveloper
azd restore <service> [flags]
```

### Options

```azdeveloper
      --all                  Restores all services that are listed in azure.yaml
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

(Beta) View details of your current template or browse a list of curated sample templates.

- The azd CLI includes a curated list of sample templates viewable by running azd template list.
- To view all available sample templates, including those submitted by the azd community visit: aka.ms/awesome-azd.
- Running azd init without a template will prompt you to start with a minimal template or select from our curated list of samples.

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

* [azd template list](#azd-template-list): Show list of sample azd templates.
* [azd template show](#azd-template-show): Show details for a given template.
* [Back to top](#azd)

## azd template list

Show list of sample azd templates.

```azdeveloper
azd template list [flags]
```

### Options

```azdeveloper
  -h, --help   Gets help for list.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Find and view template details.
* [Back to top](#azd)

## azd template show

Show details for a given template.

```azdeveloper
azd template show <template> [flags]
```

### Options

```azdeveloper
  -h, --help   Gets help for show.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Find and view template details.
* [Back to top](#azd)

## azd up

Executes the azd provision and azd deploy commands in a single step.

```azdeveloper
azd up [flags]
```

### Options

```azdeveloper
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for up.
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
  -h, --help   Gets help for version.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

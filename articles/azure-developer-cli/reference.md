---
title: Azure Developer CLI reference
description: This article explains the syntax and parameters for the various Azure Developer CLI commands.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/05/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI reference

This article explains the syntax and parameters for the various Azure Developer CLI commands.

## azd

The Azure Developer CLI (`azd`) is an open-source tool that helps onboard and manage your project on Azure

### Options

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --docs         Opens the documentation for azd in your web browser.
  -h, --help         Gets help for azd.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd add](#azd-add): Add a component to your project.
* [azd auth](#azd-auth): Authenticate with Azure.
* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
* [azd deploy](#azd-deploy): Deploy your project code to Azure.
* [azd down](#azd-down): Delete your project's Azure resources.
* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [azd hooks](#azd-hooks): Develop, test and run hooks for a project.
* [azd infra](#azd-infra): Manage your Infrastructure as Code (IaC).
* [azd init](#azd-init): Initialize a new application.
* [azd monitor](#azd-monitor): Monitor a deployed project.
* [azd package](#azd-package): Packages the project's code to be deployed to Azure.
* [azd pipeline](#azd-pipeline): Manage and configure your deployment pipelines.
* [azd provision](#azd-provision): Provision Azure resources for your project.
* [azd restore](#azd-restore): Restores the project's dependencies.
* [azd show](#azd-show): Display information about your project and its resources.
* [azd template](#azd-template): Find and view template details.
* [azd up](#azd-up): Provision and deploy your project to Azure with a single command.
* [azd version](#azd-version): Print the version number of Azure Developer CLI.

## azd add

Add a component to your project.

```azdeveloper
azd add [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd add in your web browser.
  -h, --help   Gets help for add.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [Back to top](#azd)

## azd auth

Authenticate with Azure.

### Options

```azdeveloper
      --docs   Opens the documentation for azd auth in your web browser.
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

To log in using a managed identity, pass --managed-identity, which will use the system assigned managed identity.
To use a user assigned managed identity, pass --client-id in addition to --managed-identity with the client id of
the user assigned managed identity you wish to use.


```azdeveloper
azd auth login [flags]
```

### Options

```azdeveloper
      --check-status                           Checks the log-in status instead of logging in.
      --client-certificate string              The path to the client certificate for the service principal to authenticate with.
      --client-id string                       The client id for the service principal to authenticate with.
      --client-secret string                   The client secret for the service principal to authenticate with. Set to the empty string to read the value from the console.
      --docs                                   Opens the documentation for azd auth login in your web browser.
      --federated-credential-provider string   The provider to use to acquire a federated token to authenticate with.
  -h, --help                                   Gets help for login.
      --managed-identity                       Use a managed identity to authenticate.
      --redirect-port int                      Choose the port to be used as part of the redirect URI during interactive login.
      --tenant-id string                       The tenant id or domain name to authenticate with.
      --use-device-code[=true]                 When true, log in by using a device code instead of a browser.
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

Log out of Azure

```azdeveloper
azd auth logout [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd auth logout in your web browser.
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
      --docs   Opens the documentation for azd config in your web browser.
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
* [azd config list-alpha](#azd-config-list-alpha): Display the list of available features in alpha stage.
* [azd config reset](#azd-config-reset): Resets configuration to default.
* [azd config set](#azd-config-set): Sets a configuration.
* [azd config show](#azd-config-show): Show all the configuration values.
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
      --docs   Opens the documentation for azd config get in your web browser.
  -h, --help   Gets help for get.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config list-alpha

Display the list of available features in alpha stage.

```azdeveloper
azd config list-alpha [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd config list-alpha in your web browser.
  -h, --help   Gets help for list-alpha.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
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
      --docs    Opens the documentation for azd config reset in your web browser.
  -f, --force   Force reset without confirmation.
  -h, --help    Gets help for reset.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
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
      --docs   Opens the documentation for azd config set in your web browser.
  -h, --help   Gets help for set.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd config show

Show all the configuration values.

### Synopsis

Show all configuration values in the configuration path.

The default value of the config directory is:
* `$HOME/.azd` on Linux and macOS
* `%USERPROFILE%\.azd` on Windows

The configuration directory can be overridden by specifying a path in the AZD_CONFIG_DIR environment variable.

```azdeveloper
azd config show [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd config show in your web browser.
  -h, --help   Gets help for show.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
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
      --docs   Opens the documentation for azd config unset in your web browser.
  -h, --help   Gets help for unset.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd config](#azd-config): Manage azd configurations (ex: default Azure subscription, location).
* [Back to top](#azd)

## azd deploy

Deploy your project code to Azure.

```azdeveloper
azd deploy <service> [flags]
```

### Options

```azdeveloper
      --all                   Deploys all services that are listed in azure.yaml
      --docs                  Opens the documentation for azd deploy in your web browser.
  -e, --environment string    The name of the environment to use.
      --from-package string   Deploys the packaged service located at the provided path. Supports zipped file packages (file path) or container images (image tag).
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

Delete your project's Azure resources.

```azdeveloper
azd down [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd down in your web browser.
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

Manage environments (ex: default environment, environment variables).

### Options

```azdeveloper
      --docs   Opens the documentation for azd env in your web browser.
  -h, --help   Gets help for env.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env get-value](#azd-env-get-value): Get specific environment value.
* [azd env get-values](#azd-env-get-values): Get all environment values.
* [azd env list](#azd-env-list): List environments.
* [azd env new](#azd-env-new): Create a new environment and set it as the default.
* [azd env refresh](#azd-env-refresh): Refresh environment settings by using information from a previous infrastructure provision.
* [azd env select](#azd-env-select): Set the default environment.
* [azd env set](#azd-env-set): Manage your environment settings.
* [azd env set-secret](#azd-env-set-secret): Set a `<name>` as a reference to a Key Vault secret in the environment.
* [Back to top](#azd)

## azd env get-value

Get specific environment value.

```azdeveloper
azd env get-value <keyName> [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd env get-value in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for get-value.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env get-values

Get all environment values.

```azdeveloper
azd env get-values [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd env get-values in your web browser.
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

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env list

List environments.

```azdeveloper
azd env list [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd env list in your web browser.
  -h, --help   Gets help for list.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env new

Create a new environment and set it as the default.

```azdeveloper
azd env new <environment> [flags]
```

### Options

```azdeveloper
      --docs                  Opens the documentation for azd env new in your web browser.
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

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env refresh

Refresh environment settings by using information from a previous infrastructure provision.

```azdeveloper
azd env refresh <environment> [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd env refresh in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for refresh.
      --hint string          Hint to help identify the environment to refresh
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env select

Set the default environment.

```azdeveloper
azd env select <environment> [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd env select in your web browser.
  -h, --help   Gets help for select.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env set

Manage your environment settings.

```azdeveloper
azd env set <key> <value> [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd env set in your web browser.
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

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd env set-secret

Set a `<name>` as a reference to a Key Vault secret in the environment.

### Synopsis

You can either create a new Key Vault secret or select an existing one.
The provided name is the key for the .env file which holds the secret reference to the Key Vault secret.

```azdeveloper
azd env set-secret <name> [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd env set-secret in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for set-secret.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd env](#azd-env): Manage environments (ex: default environment, environment variables).
* [Back to top](#azd)

## azd hooks

Develop, test and run hooks for a project.

### Options

```azdeveloper
      --docs   Opens the documentation for azd hooks in your web browser.
  -h, --help   Gets help for hooks.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd hooks run](#azd-hooks-run): Runs the specified hook for the project and services
* [Back to top](#azd)

## azd hooks run

Runs the specified hook for the project and services

```azdeveloper
azd hooks run <name> [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd hooks run in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for run.
      --platform string      Forces hooks to run for the specified platform.
      --service string       Only runs hooks for the specified service.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd hooks](#azd-hooks): Develop, test and run hooks for a project.
* [Back to top](#azd)

## azd infra

Manage your Infrastructure as Code (IaC).

### Options

```azdeveloper
      --docs   Opens the documentation for azd infra in your web browser.
  -h, --help   Gets help for infra.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd infra generate](#azd-infra-generate): Write IaC for your project to disk, allowing you to manually manage it.
* [Back to top](#azd)

## azd infra generate

Write IaC for your project to disk, allowing you to manually manage it.

```azdeveloper
azd infra generate [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd infra generate in your web browser.
  -e, --environment string   The name of the environment to use.
      --force                Overwrite any existing files without prompting
  -h, --help                 Gets help for generate.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd infra](#azd-infra): Manage your Infrastructure as Code (IaC).
* [Back to top](#azd)

## azd init

Initialize a new application.

```azdeveloper
azd init [flags]
```

### Options

```azdeveloper
  -b, --branch string         The template branch to initialize from. Must be used with a template argument (--template or -t).
      --docs                  Opens the documentation for azd init in your web browser.
  -e, --environment string    The name of the environment to use.
  -f, --filter strings        The tag(s) used to filter template results. Supports comma-separated values.
      --from-code             Initializes a new application from your existing code.
  -h, --help                  Gets help for init.
  -l, --location string       Azure location for the new environment
  -s, --subscription string   Name or ID of an Azure subscription to use for the new environment
  -t, --template string       Initializes a new application from a template. You can use Full URI, <owner>/<repository>, or <repository> if it's part of the azure-samples organization.
      --up                    Provision and deploy to Azure after initializing the project from a template.
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

Monitor a deployed project.

```azdeveloper
azd monitor [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd monitor in your web browser.
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

Packages the project's code to be deployed to Azure.

```azdeveloper
azd package <service> [flags]
```

### Options

```azdeveloper
      --all                  Packages all services that are listed in azure.yaml
      --docs                 Opens the documentation for azd package in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for package.
      --output-path string   File or folder path where the generated packages will be saved.
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

Manage and configure your deployment pipelines.

### Options

```azdeveloper
      --docs   Opens the documentation for azd pipeline in your web browser.
  -h, --help   Gets help for pipeline.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd pipeline config](#azd-pipeline-config): Configure your deployment pipeline to connect securely to Azure. (Beta)
* [Back to top](#azd)

## azd pipeline config

Configure your deployment pipeline to connect securely to Azure. (Beta)

```azdeveloper
azd pipeline config [flags]
```

### Options

```azdeveloper
  -m, --applicationServiceManagementReference string   Service Management Reference. References application or service contact information from a Service or Asset Management database. This value must be a Universally Unique Identifier (UUID). You can set this value globally by running azd config set pipeline.config.applicationServiceManagementReference <UUID>.
      --auth-type string                               The authentication type used between the pipeline provider and Azure for deployment (Only valid for GitHub provider). Valid values: federated, client-credentials.
      --docs                                           Opens the documentation for azd pipeline config in your web browser.
  -e, --environment string                             The name of the environment to use.
  -h, --help                                           Gets help for config.
      --principal-id string                            The client id of the service principal to use to grant access to Azure resources as part of the pipeline.
      --principal-name string                          The name of the service principal to use to grant access to Azure resources as part of the pipeline.
      --principal-role stringArray                     The roles to assign to the service principal. By default the service principal will be granted the Contributor and User Access Administrator roles. (default [Contributor,User Access Administrator])
      --provider string                                The pipeline provider to use (github for Github Actions and azdo for Azure Pipelines).
      --remote-name string                             The name of the git remote to configure the pipeline to run on. (default "origin")
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

Provision Azure resources for your project.

```azdeveloper
azd provision [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd provision in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for provision.
      --no-state             Do not use latest Deployment State (bicep only).
      --preview              Preview changes to Azure resources.
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

Restores the project's dependencies.

```azdeveloper
azd restore <service> [flags]
```

### Options

```azdeveloper
      --all                  Restores all services that are listed in azure.yaml
      --docs                 Opens the documentation for azd restore in your web browser.
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

## azd show

Display information about your project and its resources.

```azdeveloper
azd show [resource name or ID] [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd show in your web browser.
  -e, --environment string   The name of the environment to use.
  -h, --help                 Gets help for show.
      --show-secrets         Unmask secrets in output.
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

Find and view template details.

### Options

```azdeveloper
      --docs   Opens the documentation for azd template in your web browser.
  -h, --help   Gets help for template.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template list](#azd-template-list): Show list of sample azd templates. (Beta)
* [azd template show](#azd-template-show): Show details for a given template. (Beta)
* [azd template source](#azd-template-source): View and manage template sources. (Beta)
* [Back to top](#azd)

## azd template list

Show list of sample azd templates. (Beta)

```azdeveloper
azd template list [flags]
```

### Options

```azdeveloper
      --docs             Opens the documentation for azd template list in your web browser.
  -f, --filter strings   The tag(s) used to filter template results. Supports comma-separated values.
  -h, --help             Gets help for list.
  -s, --source string    Filters templates by source.
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

Show details for a given template. (Beta)

```azdeveloper
azd template show <template> [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd template show in your web browser.
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

## azd template source

View and manage template sources. (Beta)

### Options

```azdeveloper
      --docs   Opens the documentation for azd template source in your web browser.
  -h, --help   Gets help for source.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template](#azd-template): Find and view template details.
* [azd template source add](#azd-template-source-add): Adds an azd template source with the specified key. (Beta)
* [azd template source list](#azd-template-source-list): Lists the configured azd template sources. (Beta)
* [azd template source remove](#azd-template-source-remove): Removes the specified azd template source (Beta)
* [Back to top](#azd)

## azd template source add

Adds an azd template source with the specified key. (Beta)

### Synopsis

The key can be any value that uniquely identifies the template source, with well-known values being:
   ・default: Default templates
   ・awesome-azd: Templates from [https://aka.ms/awesome-azd](https://aka.ms/awesome-azd)

```azdeveloper
azd template source add <key> [flags]
```

### Options

```azdeveloper
      --docs              Opens the documentation for azd template source add in your web browser.
  -h, --help              Gets help for add.
  -l, --location string   Location of the template source. Required when using type flag.
  -n, --name string       Display name of the template source.
  -t, --type string       Kind of the template source. Supported types are 'file', 'url' and 'gh'.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template source](#azd-template-source): View and manage template sources. (Beta)
* [Back to top](#azd)

## azd template source list

Lists the configured azd template sources. (Beta)

```azdeveloper
azd template source list [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd template source list in your web browser.
  -h, --help   Gets help for list.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template source](#azd-template-source): View and manage template sources. (Beta)
* [Back to top](#azd)

## azd template source remove

Removes the specified azd template source (Beta)

```azdeveloper
azd template source remove <key> [flags]
```

### Options

```azdeveloper
      --docs   Opens the documentation for azd template source remove in your web browser.
  -h, --help   Gets help for remove.
```

### Options inherited from parent commands

```azdeveloper
  -C, --cwd string   Sets the current working directory.
      --debug        Enables debugging and diagnostics logging.
      --no-prompt    Accepts the default value instead of prompting, or it fails if there is no default.
```

### See also

* [azd template source](#azd-template-source): View and manage template sources. (Beta)
* [Back to top](#azd)

## azd up

Provision and deploy your project to Azure with a single command.

```azdeveloper
azd up [flags]
```

### Options

```azdeveloper
      --docs                 Opens the documentation for azd up in your web browser.
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
      --docs   Opens the documentation for azd version in your web browser.
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


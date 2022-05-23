---
title: Azure Developer CLI reference
description: Reference for Azure Developer CLI.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---

## azd

A CLI for developers building Azure solutions

### Options

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
  -h, --help                 help for azd
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [azd deploy](#azd-deploy)	 - Deploy the application's code to Azure
* [azd down](#azd-down)	 - Deletes Azure resources for an application
* [azd env](#azd-env)	 - Manage environments
* [azd infra](#azd-infra)	 - Manage Azure resources
* [azd init](#azd-init)	 - Initialize a new application
* [azd login](#azd-login)	 - Log in to Azure
* [azd monitor](#azd-monitor)	 - Monitor a deployed application
* [azd pipeline](#azd-pipeline)	 - Manage GitHub Actions pipelines
* [azd provision](#azd-provision)	 - Provisions the Azure resources for an application
* [azd restore](#azd-restore)	 - Restores application dependencies
* [azd up](#azd-up)	 - Initialize application, provision Azure resources, and deploy your project with a single command
* [azd version](#azd-version)	 - Print the version number of azd

---

## azd deploy

Deploy the application's code to Azure

```
azd deploy [flags]
```

### Options

```
  -h, --help             help for deploy
      --service string   Deploy a specific service (when unset, all services listed in azure.yaml are deployed)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)

---

## azd down

Deletes Azure resources for an application

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

### SEE ALSO

* [Back to top](#azd)

---


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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)


---

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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)


---

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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)


---

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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)


---

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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)


---

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

### SEE ALSO

* [azd env](#azd-env)	 - Manage environments
* [Back to top](#azd)

---

## azd env

Manage environments

```
azd env [flags]
```

### Options

```
  -h, --help   help for env
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [azd env get-values](#azd-env-get-values)	 - Get all environment values
* [azd env list](#azd-env-list)	 - List environments
* [azd env new](#azd-env-new)	 - Create a new environment
* [azd env refresh](#azd-env-refresh)	 - Refresh environment settings using information from previous infrastructure provision
* [azd env select](#azd-env-select)	 - Set the default environment
* [azd env set](#azd-env-set)	 - Set a value in the environment
* [Back to top](#azd)

---

## azd infra create

Creates Azure resources for an application

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

### SEE ALSO

* [Back to top](#azd)


---

## azd infra delete

Deletes Azure resources for an application

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

### SEE ALSO

* [Back to top](#azd)

---

## azd infra

Manage Azure resources

```
azd infra [flags]
```

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

### SEE ALSO

* [azd infra create](#azd-infra-create)	 - Creates Azure resources for an application
* [azd infra delete](#azd-infra-delete)	 - Deletes Azure resources for an application
* [Back to top](#azd)

---

## azd init

Initialize a new application

```
azd init [flags]
```

### Options

```
  -b, --branch string     The template branch to initialize from
  -h, --help              help for init
  -t, --template string   Template to use when initializing the application
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)


---

## azd login

Log in to Azure

```
azd login [flags]
```

### Options

```
  -h, --help   help for login
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)


---

## azd monitor

Monitor a deployed application

```
azd monitor [flags]
```

### Options

```
  -h, --help       help for monitor
      --live       Opens a browser to Application Insights Live Metrics
      --logs       Opens a browser to Application Insights Logs
      --overview   Opens a browser to Application Insights Overview Dashboard
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)


---

## azd pipeline config

Create and configure your deployment pipeline using GitHub Actions

```
azd pipeline config [flags]
```

### Options

```
  -h, --help                    help for config
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

### SEE ALSO

* [Back to top](#azd)


---

## azd pipeline

Manage GitHub Actions pipelines

```
azd pipeline [flags]
```

### Options

```
  -h, --help   help for pipeline
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [azd pipeline config](#azd-pipeline-config)	 - Create and configure your deployment pipeline using GitHub Actions
* [Back to top](#azd)

---

## azd provision

Provisions the Azure resources for an application

```
azd provision [flags]
```

### Options

```
  -h, --help            help for provision
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

### SEE ALSO

* [Back to top](#azd)

---

## azd restore

Restores application dependencies

```
azd restore [flags]
```

### Options

```
  -h, --help             help for restore
      --service string   Restores dependencies for a specific service (when unset, dependencies for all services listed in azure.yaml are restored)
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)

---

## azd up

Initialize application, provision Azure resources, and deploy your project with a single command

```
azd up [flags]
```

### Options

```
  -b, --branch string     The template branch to initialize from
  -h, --help              help for up
      --no-progress       Suppress progress information
  -o, --output string     Output format (supported formats are json, none) (default "none")
      --service string    Deploy a specific service (when unset, all services listed in azure.yaml are deployed)
  -t, --template string   Template to use when initializing the application
```

### Options inherited from parent commands

```
  -C, --cwd string           Set the current working directory
      --debug                Enables debug/diagnostic logging
  -e, --environment string   The name of the environment to use
      --no-prompt            Accept default value instead of prompting, or fail if there is no default
```

### SEE ALSO

* [Back to top](#azd)

---

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

### SEE ALSO

* [Back to top](#azd)
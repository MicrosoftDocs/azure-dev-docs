---
title: Azure Developer CLI's azure.yaml schema
description: Describes the schema for the Azure Developer CLI azure.yaml file
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/24/2022
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Extend your Azure Developer CLI deployment pipelines using Hooks

The Azure Developer CLI supports various extension points to customize your deployment pipelines. The Hooks middleware allows you to execute custom scripts before and after `azd` commands and service events. Hooks follow a naming convention using *pre* and *post* prefixes on the matching `azd` command or service event name. For example, you may want to run a custom scripts in the following scenarios:

* Use the *prerestore* to customize dependency management. 
* Use the *predeploy* to verify external dependencies or custom configurations are in place before deploying your app.
* Use the *postup* hook at the end of the pipeline to perform custom cleanup or logging.

## Available Hooks

The following `azd` commands support hooks:

* `prerestore` and `postrestore`: Run before and after packages and dependencies are restored.
* `preprovision` and `postprovision`: Run before and after Azure resources are created.
* `predeploy` and `postdeploy`: Run before and after the application code is deployed to Azure.
* `preup` and `postup`: Run before and after the combined deployment pipeline. `Up` is a shorthand command that runs `restore`, `provision`, and `deploy`.
* `predown` and `postdown`: Run before and after the resources are removed.

The following `service lifecycle events are supported by hooks:

* `prerestore` and `postrestore`: Run before and after the service packages and dependencies are restored.
* `prepackage` and `postpackage`: Run before and after the app is packaged for deployment.
* `predeploy` and `postdeploy`: Run before and after the service code is deployed to Azure.

## Hook Configuration

All types of hooks support the following configuration options:

* `shell`: sh | pwsh(automatically inferred from run if not specified)
* `run`: Can either be inline script or path to a file
* `continueOnError`: When set will continue to execute even after a script error occurred during a command hook (default false)
* `interactive`: When set will bind the running script to the console stdin, stdout & stderr (default false)
* `windows`: Configuration that will only apply on windows OS
* `posix`: Configuration that will only apply to POSIX based OSes (Linux & MaxOS)

Hooks can be registered in the root of your azure.yaml or within a specific service configuration.

## Hook Examples

The examples below demonstrate different types of hook registrations and configurations.

### Root command registration

Hooks can be configured to run for specific `azd` commands at the root of your `azure.yml` file.

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
hooks:
  preinit: # Example of an inline script. (shell is required for inline scripts)
    shell: sh
    run: echo 'Hello'
  preprovision: # Example of external script (Relative path from project root)
    run: ./hooks/preprovision.sh
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: appservice
  api:
    project: ./src/api
    language: js
    host: appservice
```

### Service registration

Hooks can be also be configured to only run for specific services defined in your `.yml` file. 

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
hooks:
  preinit: # Example of an inline script. (shell is required for inline scripts)
    shell: sh
    run: echo 'Hello'
  preprovision: # Example of external script (Relative path from project root)
    run: ./hooks/preprovision.sh
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: appservice
  api:
    project: ./src/api
    language: js
    host: appservice
```

### OS specific hooks

Optionally, hooks can also be configured to run either on Windows or Posix (Linux & MaxOS).

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
hooks:
  preinit: 
    posix: # Only runs on Posix environments
      shell: sh
      run: echo 'Hello'
   windows: # Only runs on Windows environments
     shell: pwsh
     run: Write-Host "Hello"
services:
  web:
    project: ./src/web
    dist: build
    language: js
    host: appservice
  api:
    project: ./src/api
    language: js
    host: appservice
```
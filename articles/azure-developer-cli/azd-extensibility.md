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

## Azd Command

The following azd command are supported by hooks:

* infra create (aka provision)
* infra delete (aka down)
* restore
* deploy
* up

## Service Lifecycle Events

The following azd service lifecycle events are supported by hooks

* restore
* package
* deploy

## Hook Config

All hook configuration support the following:

* shell: sh | pwsh(automatically inferred from run if not specified)
* run: Can either be inline script or path to a file
* continueOnError: When set will continue to execute even after a script error occurred during a command hook (default false)
* interactive: When set will bind the running script to the console stdin, stdout & stderr (default false)
* windows: Configuration that will only apply on windows OS
* posix: Configuration that will only apply to POSIX based OSes (Linux & MaxOS)
* How to register azd hooks?

Hooks can be registered in the root of your azure.yaml or within a service configuration

Root registration

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

Service registration

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

OS specific hooks
Optionally, hooks can also be configured to run either on Windows or Posix (Linux & MaxOS)

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
---
title: Customize your Azure Developer CLI workflows using command and event hooks
description: Explores how to use Azure Developer CLI hooks to customize deployment pipelines
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Customize your Azure Developer CLI workflows using command and event hooks

The Azure Developer CLI supports various extension points to customize your workflows and deployments. The hooks middleware allows you to execute custom scripts before and after `azd` commands and service lifecycle events. hooks follow a naming convention using *pre* and *post* prefixes on the matching `azd` command or service event name.

For example, you may want to run a custom script in the following scenarios:

* Use the *prerestore* hook to customize dependency management.
* Use the *predeploy* hook to verify external dependencies or custom configurations are in place before deploying your app.
* Use the *postup* hook at the end of a workflow or pipeline to perform custom cleanup or logging.

## Available hooks

The following `azd` command hooks are available:

* `prerestore` and `postrestore`: Run before and after package dependencies are restored.
* `preprovision` and `postprovision`: Run before and after Azure resources are created.
* `predeploy` and `postdeploy`: Run before and after the application code is deployed to Azure.
* `preup` and `postup`: Run before and after the combined deployment pipeline. `Up` is a shorthand command that runs `restore`, `provision`, and `deploy` sequentially.
* `predown` and `postdown`: Run before and after the resources are removed.

The following service lifecycle event hooks are available:

* `prerestore` and `postrestore`: Run before and after the service packages and dependencies are restored.
* `prebuild` and `postbuild`: Run before and after the service source code or container is built.
* `prepackage` and `postpackage`: Run before and after the app is packaged for deployment.
* `predeploy` and `postdeploy`: Run before and after the service code is deployed to Azure.

## Hook configuration

Hooks can be registered in your `azure.yaml` file at the root or within a specific service configuration. All types of hooks support the following configuration options:

* `shell`: `sh` | `pwsh` (automatically inferred from run if not specified).
  * *Note*: PowerShell 7 is required for `pwsh`.
* `run`: Define an inline script or a path to a file.
* `continueOnError`: When set will continue to execute even after a script error occurred during a command hook (default false).
* `interactive`: When set will bind the running script to the console `stdin`, `stdout` & `stderr` (default false).
* `windows`: Specifies that the nested configurations will only apply on windows OS. If this configuration option is excluded, the hook executes on all platforms.
* `posix`: Specifies that the nested configurations will only apply to POSIX based OSes (Linux & MaxOS). If this configuration option is excluded, the hook executes on all platforms.

## Hook examples

The following examples demonstrate different types of hook registrations and configurations.

### Root command registration

Hooks can be configured to run for specific `azd` commands at the root of your `azure.yaml` file.

The project directory (where the `azure.yaml` file is located) is the default current working directory (`cwd`) for command hooks.

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
hooks:
  prerestore: # Example of an inline script. (shell is required for inline scripts)
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

Hooks can also be configured to run only for specific services defined in your `.yaml` file.

The service directory (same path as defined in the `project` property of the service configuration in the `azure.yaml` file) is the default `cwd` for service hooks.

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
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
    hooks:
      prerestore: # Example of an inline script. (shell is required for inline scripts)
        shell: sh
        run: echo 'Restoring API service...'
      prepackage: # Example of external script (Relative path from service path)
        run: ./hooks/prepackage.sh
```

### OS specific hooks

Optionally, hooks can also be configured to run either on Windows or Posix (Linux & MaxOS). By default, if the Windows or Posix configurations are excluded the hook executes on all platforms.

```yml
name: todo-nodejs-mongo
metadata:
  template: todo-nodejs-mongo@0.0.1-beta
hooks:
  prerestore: 
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

### Multiple hooks per event

You can configure multiple hooks per event across different scopes, such as the root registration level or for a specific service:

```yml
name: example-project
services:
    api:
        project: src/api
        host: containerapp
        language: ts
        hooks:
            postprovision:
                - shell: sh
                  run: scripts/postprovision1.sh
                - shell: sh
                  run: scripts/postprovision2.sh
hooks:
    postprovision:
        - shell: sh
          run: scripts/postprovision1.sh
        - shell: sh
          run: scripts/postprovision2.sh
```

### Use environment variables with hooks

Hooks can get and set environment variables in the `.env` file using the `azd env get-values` and `azd set <key> <value>` commands. Hooks can also retrieve environment variables from your local environment using the `${YOUR_ENVIRONMENT VARIABLE}` syntax. `azd` automatically sets certain environment variables in the `.env` file when commands are run, such as `AZURE_ENV_NAME` and `AZURE_LOCATION`. Output parameters from the `main.bicep` file are also set in the `.env` file. The [manage environment variables](/azure/developer/azure-developer-cli/manage-environment-variables) page includes more information about environment variable workflows.

Hooks can get and set environment variables inline or through referenced scripts, as demonstrated in the following example:

```yml
name: azure-search-openai-demo
metadata:
  template: azure-search-openai-demo@0.0.2-beta
services:
  backend:
    project: ./app/backend
    language: py
    host: appservice
hooks:
  postprovision:
    windows: # Run referenced script that uses environment variables (script shown below)
      shell: pwsh
      run: ./scripts/prepdocs.ps1
      interactive: true
      continueOnError: false
    posix:
      shell: sh
      run: ./scripts/prepdocs.sh
      interactive: true
      continueOnError: false
  postdeploy: # Pull environment variable inline from local device and set in .env file
      shell: sh
      run: azd env set REACT_APP_WEB_BASE_URL ${SERVICE_WEB_ENDPOINT_URL}
```

The referenced: `prepdocs.sh` script:

```bash
echo "Loading azd .env file from current environment"

# Use the `get-values` azd command to retrieve environment variables from the `.env` file
while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values) 
EOF

echo 'Creating python virtual environment "scripts/.venv"'
python3 -m venv scripts/.venv

echo 'Installing dependencies from "requirements.txt" into virtual environment'
./scripts/.venv/bin/python -m pip install -r scripts/requirements.txt

echo 'Running "prepdocs.py"'
./scripts/.venv/bin/python ./scripts/prepdocs.py './data/*' 
    --storageaccount "$AZURE_STORAGE_ACCOUNT"
    --container "$AZURE_STORAGE_CONTAINER"
    --searchservice "$AZURE_SEARCH_SERVICE"
    --openaiservice "$AZURE_OPENAI_SERVICE"
    --openaideployment "$AZURE_OPENAI_EMB_DEPLOYMENT"
    --index "$AZURE_SEARCH_INDEX"
    --formrecognizerservice "$AZURE_FORMRECOGNIZER_SERVICE"
    --tenantid "$AZURE_TENANT_ID" -v
```

[!INCLUDE [request-help](includes/request-help.md)]

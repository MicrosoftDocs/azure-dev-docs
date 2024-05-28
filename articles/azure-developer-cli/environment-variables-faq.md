---
title: Configure template sources
description: Learn how to configure the Azure Developer CLI to use different template sources
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/26/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Environment variables FAQ

This article explores frequently asked questions and answers specifically for working with environment variables and the Azure Developer CLI (`azd`).

## What is the difference between an `azd` environment variable and system/os environment variables?

`azd` environment variables are stored in the `.env` file in the `.azure/<environment name>` directory of your project template. They are separate from your system/os environment variables. `azd` environment variables can be accessed using commands such as [`azd env`](/azure/developer/azure-developer-cli/reference#azd-env) or [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values), while system/os environment variables can only be access through custom scripts using tools such as Bash or PowerShell.

## Can any `azd` commands directly read and write system/os environment variables?

No, `azd` commands do not read or write system/os environment variables. Commands such as [`azd env`](/azure/developer/azure-developer-cli/reference#azd-env) or [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values) operate on values stored in the template `.env` file for a specific `azd` environment. `azd` environments are managed using subfolders in the `.azure/<environment name>` directory of your project template, meaning your template can have multiple environments. These environment subfolders hold configuration files such as `.env` that describe an environment.

You can use custom scripts via `azd` [hooks](/azure/developer/azure-developer-cli/azd-extensibility) to read or write system/os level environment variables

## What happens to "output" variables set in the main Bicep file?

Output variables in the `main.bicep` file are automatically stored in the `.env` file of your `azd` template. You can then access them using commands such as [`azd env`](/azure/developer/azure-developer-cli/reference#azd-env) or [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values).

Consider the following output variables in a `main.bicep` template infrastructure file:

```json
output API_BASE_URL string = useAPIM ? apimApi.outputs.SERVICE_API_URI : api.outputs.SERVICE_API_URI
output REACT_APP_WEB_BASE_URL string = web.outputs.SERVICE_WEB_URI
```

`azd` writes these two variables to the `.env` file:

```output
API_BASE_URL="<example-api-url>"
output REACT_APP_WEB_BASE_URL="<example-app-url>"
```

## Which environment variables are set in the `.env` file by default?

The following environment variables are set in the `.env` file by default:

| Name  | Description  | Examples  | When available  |
|---------|---------|---------|---------|
|`AZURE_ENV_NAME`     | The name of the environment in-use.       | `todo-app-dev`        | When an environment is created (after running azd init or azd env new, for example).        |
|`AZURE_LOCATION`     | The location of the environment in-use.        |  `eastus2`        |  Right before an environment is provisioned for the first time.       |
|`AZURE_PRINCIPAL_ID`     | The running user/service principal.       | `925cff12-ffff-4e9f-9580-8c06239dcaa4`        | Determined automatically during provisioning (ephemeral).        |
|`AZURE_SUBSCRIPTION_ID`    | The targeted subscription.       |  `925cff12-ffff-4e9f-9580-8c06239dcaa4`       | Right before an environment is provisioned for the first time.
|`SERVICE_<service>_IMAGE_NAME`     | The full name of the container image published to Azure Container Registry for container app services.        | `todoapp/web-dev:azdev-deploy-1664988805`        | After a successful publishing of a `containerapp` image        |


## What is the recommended way to access `azd` environment variables from the `.env` file?

You can read in `azd` environment variables using the [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values) command. Accessing `azd` environment variables is a common task in for various scenarios, including the following:

- Perform additional configuration in hook scripts.
- Provide the values to the template application code framework, such as Node or .NET.
- Write the values to system environment variables

## What is the recommend way to set `azd` environment variables as system environment variables?

You can use custom scripts to retrieve `azd` environment variables and then set them as system environment variables. It's common to run these scripts as hooks during the `azd` lifecycle, as seen in the following example:

```yml
postprovision:
    windows:
        shell: pwsh
        run: ./scripts/map-env-vars.ps1
        interactive: false
        continueOnError: false
    posix:
        shell: sh
        run: ./scripts/map-env-vars.sh
        interactive: false
        continueOnError: false
```

The referenced shell script for Linux:

```bash
echo "Loading azd .env file from current environment..."

while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values)
EOF
```

The referenced PowerShell script for Windows:

```powershell
Write-Host "Loading azd .env file from current environment"
foreach ($line in (& azd env get-values)) {
    if ($line -match "([^=]+)=(.*)") {
        $key = $matches[1]
        $value = $matches[2] -replace '^"|"$'
        [Environment]::SetEnvironmentVariable($key, $value)
    }
}
```

## How do I know which `azd` variables in the `.env` file are safe to change without them being overwritten?

<!-- Not actually sure of the answer to this. AZD auto populates the values to some of these, but does it overwrite them again if you change them? Is there a way to prevent that? -->

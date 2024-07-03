---
title: Environment variables FAQ
description: Discover answers to frequently asked questions about environment variables
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/26/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Environment variables FAQ

This article answers frequently asked questions about working with environment variables and the Azure Developer CLI (`azd`).

### What are the differences between `azd` environment variables and system environment variables?

`azd` environment variables are stored in the `.env` file in the `.azure/<environment name>` directory of your project and are separate from your system/OS environment variables. `azd` environment variables configure template provisioning and deployment tasks and are accessible using commands such as [`azd env`](/azure/developer/azure-developer-cli/reference#azd-env) or [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values).

:::image type="content" source="media/faq/environment-folders.png" alt-text="A screenshot of the environment folder structure.":::

System environment variables are not directly accessible through `azd` commands and should be managed with custom shell or PowerShell scripts, generally using `azd` [hooks](/azure/developer/azure-developer-cli/azd-extensibility).

### Can `azd` commands directly read and write system environment variables?

No, `azd` commands cannot read or write system environment variables. Commands such as [`azd env set`](/azure/developer/azure-developer-cli/reference#azd-env) or [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values) operate on values stored in the template `.env` file for a specific `azd` environment. `azd` environments are managed using subfolders in the `.azure/<environment name>` directory of your project template, which enables your template to have multiple environments. Environment subfolders hold configuration files such as `.env` that describe the environment.

Use custom shell or PowerShell scripts with `azd` [hooks](/azure/developer/azure-developer-cli/azd-extensibility) to read or write system level environment variables.

### What is the relationship between output variables set in the `main.bicep` file and `azd` environment variables?

Output variables set in the `main.bicep` file are automatically stored in the `.env` file of your `azd` template. Consider the following output variables in a `main.bicep` template infrastructure file:

```json
output API_BASE_URL string = api.outputs.SERVICE_API_URI
output REACT_APP_WEB_BASE_URL string = web.outputs.SERVICE_WEB_URI
```

After a successful `azd up` or `azd provision`, `azd` writes these two variables to the `.env` file in the `.azure/<environment name>` directory of your project:

```output
API_BASE_URL="<example-api-url>"
output REACT_APP_WEB_BASE_URL="<example-app-url>"
```

You can then access those variables from the `.env` file using [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values).

### Which environment variables are set in the `.env` file by default?

The following environment variables are set in the `.env` file by default:

| Name  | Description  | Example values  | When available  |
|---------|---------|---------|---------|
|`AZURE_ENV_NAME`     | The name of the environment in-use.       | `todo-app-dev`        | When an environment is created (after running azd init or azd env new, for example).        |
|`AZURE_LOCATION`     | The location of the environment in-use.        |  `eastus2`        |  Right before an environment is provisioned for the first time.       |
|`AZURE_PRINCIPAL_ID`     | The running user/service principal.       | `925cff12-ffff-4e9f-9580-8c06239dcaa4`        | Determined automatically during provisioning (ephemeral).        |
|`AZURE_SUBSCRIPTION_ID`    | The targeted subscription.       |  `925cff12-ffff-4e9f-9580-8c06239dcaa4`       | Right before an environment is provisioned for the first time.
|`SERVICE_<service>_IMAGE_NAME`     | The full name of the container image published to Azure Container Registry for container app services.        | `todoapp/web-dev:azdev-deploy-1664988805`        | After a successful publishing of a `containerapp` image        |

### What is the recommended approach to retrieve `azd` environment variables from the `.env` file? Why would I need to do this?

Retrieve `azd` environment variables using the [`azd env get-values`](/azure/developer/azure-developer-cli/reference#azd-env-get-values) command.

```azdeveloper
azd env get-values
```

Common reasons to access `azd` environment variables include the following:

- Perform additional configuration in hook scripts.
- Expose the `.env` values from the template to the application code framework, such as Node.js or .NET.
- Write the `.env` values to system environment variables.

> [!TIP]
> Use caution when setting system environment variables, as they can cause conflicts with other templates that share the same environment variable names.

### How do I manually set a new `azd` environment variable?

Set additional `azd` environment variables using the [`azd env set`](https://review.learn.microsoft.com/azure/developer/azure-developer-cli/reference?branch=pr-en-us-5900#azd-env-set) command, providing the key and value for your variable.

Common reasons to set `azd` environment variables include the following:

- Access Azure resource information created during provisioning that is needed during deployment.
- Override or change default `azd` environment variable values.
- Provide additional custom configuration values for use in provisioning, deployment, or custom scripts.

```azdeveloper
azd env set MY_KEY MyValue
```

### How do I copy or write `azd` environment variables as system environment variables?

In some scenarios you may want to copy `azd` environment variables to another environment file or to your system environment for use by language frameworks. For example, you may want to use endpoint URLs from provisioned Azure services to connect to those services in your app code. Use custom scripts to retrieve `azd` environment variables and then set them as system environment variables. It's common to run these scripts as hooks during the `azd` lifecycle, as seen in the following example:

> [!NOTE]
> Use caution when copying `azd` environment variables to your local system or other operating environments. System environment variables with matching names can be picked up by `azd` and cause conflicts between different `azd` templates or different `azd` environments.

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

The referenced shell script for Linux retrieves the `azd` environment variables and exports them as system environment variables:

```bash
echo "Loading azd .env file from current environment..."

while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values)
EOF
```

The referenced PowerShell script for Windows retrieves the `azd` environment variables and exports them as system environment variables:

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

## Next steps

> [!div class="nextstepaction"]
> [Manage environment variables](manage-environment-variables.md)
> [Customize workflows using command and event hooks](azd-extensibility.md)
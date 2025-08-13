---
title: Work with Azure Developer CLI environment variables
description: Learn how to manage and use environment variables in Azure Developer CLI (azd)
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/06/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Work with Azure Developer CLI environment variables

The Azure Developer CLI (`azd`) uses environment variables to store and manage configuration settings for deployment environments. These variables control how your application is provisioned, deployed, and runs in Azure. This article explains how environment variables work within `azd` environments and provides guidance on managing them effectively.

## Understand environment variables

In the context of the Azure Developer CLI, environment variables are key-value pairs that are tied to specific named environments like *dev*, *test*, or *prod*. Each `azd` environment maintains its own set of environment variables, allowing you to configure different settings for different deployment targets.

Environment variables in `azd` are stored in `.env` files within your environment folders in the `.azure` folder. They serve as inputs to:

- Application deployment workflows
- Configurations for Azure services and connections
- Infrastructure provisioning via Bicep and Terraform

Unlike traditional environment variables that exist at the operating system level, `azd` environment variables are scoped to specific environments within your project, providing isolation between different deployment targets.

Environment variables provide several key benefits when working with `azd`:

- **Environment isolation**: Keep configurations for development, testing, and production separate and distinct.
- **Configuration consistency**: Ensure all team members use the same settings for a specific environment.
- **Infrastructure as Code**: Define infrastructure parameterization through variables instead of hard-coded values.
- **Deployment automation**: Enable CI/CD pipelines to deploy to different environments using the same codebase but different configurations.
- **Simplified management**: Easily update settings across all services in an environment from a central location.

Each `azd` environment has its own set of variables, allowing for environment-specific configurations while using the same application code and infrastructure templates.

## Environment variables and .env files

The `azd` environment variables are stored in `.env` files within the environment-specific directories of your project. When you create an environment using `azd env new <name>`, a directory structure is created:

```txt
.azure/
├── <environment-name>/
│   ├── .env                   # Environment variables for this environment
```

The `.env` file uses a standard format where each line represents a key-value pair:

```txt
KEY1=value1
KEY2=value2
```

> [!TIP]
> Visit the [Working with environments](work-with-environments.md) article for more information about `azd` environments.

When you run commands such as `azd up`, `azd` automatically loads variables from the select environment's `.env` file.

These variables influence:

- **Infrastructure provisioning**: Variables like `AZURE_LOCATION` and `AZURE_SUBSCRIPTION_ID` determine where and how resources are created.
- **Deployment**: Variables like service endpoints control how your application connects to Azure services.
- **Application configuration**: Variables can be passed to your application configuration to control its behavior.
- **Resource naming**: Variables like `AZURE_RESOURCE_GROUP` influence resource naming patterns.

The `.env` file is also updated automatically by `azd` during operations like `azd init`, `azd provision`, and `azd deploy`, capturing outputs from your infrastructure templates and storing them for future use.

## Set Environment Variables

You can use different methods to set `azd` environment variables, depending on the scenario.

### Use CLI commands

The recommended way to set an environment variable is using the `azd env set` command, which includes checks to ensure valid values:

```azdeveloper
azd env set <key> <value>
```

For example, to set a configuration value for your application:

```azdeveloper
azd env set API_TIMEOUT 5000
```

The command adds or updates the variable in the `.env` file of the currently selected environment. You can also target a specific environment using the `--environment` flag:

```azdeveloper
azd env set API_TIMEOUT 5000 --environment prod
```

To verify that your environment variable was set correctly:

```azdeveloper
azd env get-value API_TIMEOUT
```

### Output from Bicep

A powerful feature of `azd` is its ability to automatically capture output parameters from your Bicep infrastructure templates as environment variables. For example, when you define an output parameter in your `main.bicep` file:

```bicep
output API_ENDPOINT string = apiService.outputs.SERVICE_ENDPOINT_URL
```

After running `azd provision`, this output is automatically saved to the environment's `.env` file:

```text
API_ENDPOINT=https://api-dev-123456.azurewebsites.net
```

This approach ensures that your application always has access to the most current resource information, such as:

- Service endpoints and URLs
- Resource names and identifiers

## Get and use environment variables

Once set, you can access environment variables in several contexts.

### CLI commands

To view all environment variables for the current environment:

```azdeveloper
azd env get-values
```

To view the value of a specific variable:

```azdeveloper
azd env get-value API_ENDPOINT
```

For machine-readable output (useful in scripts):

```azdeveloper
azd env get-values --output json
```

## Use environment variables in infrastructure files

You can use environment variables to customize your infrastructure templates. This is useful for naming, tagging, or configuring resources based on the current environment. `azd` also uses tags to locate resources in Azure for deployment and other tasks.

Consider the following common flow:

1. During `azd init`, `azd` sets these environment variables based on the user's response to prompts:

    ```output
    AZURE_ENV_NAME=myapp-dev
    AZURE_LOCATION=eastus2
    ```

2. Reference those variables in `main.parameters.json` in the `infra` folder. `azd` substitutes the values during provisioning and passes the resolved parameters to Bicep:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "name": {
          "value": "${AZURE_ENV_NAME}"
        },
        "location": {
          "value": "${AZURE_LOCATION}"
        }
      }
    }
    ```

3. Define matching parameters in your Bicep template:

    ```bicep
    @description('Name of the environment used to derive resource names and tags.')
    param name string

    @minLength(1)
    @description('Primary Azure region for all resources.')
    param location string
    ```

    `azd` supplies these Bicep parameters with the substituted values in `main.parameters.json`.

4. Use the parameters for resource naming and tags to later identify which environment a resource belongs to:

    ```bicep
    var resourceToken = toLower(uniqueString(resourceGroup().id, name, location))

    resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
      name: 'st${resourceToken}'
      location: location
      sku: {
        name: 'Standard_LRS'
      }
      kind: 'StorageV2'
      tags: {
        Environment: name
        Project: 'myproject'
      }
    }
    ```

This pattern keeps your templates flexible, enables per-environment customization without code changes, and improves resource governance (naming, tagging, and discovery).

> [!NOTE]
> `azd` also relies on tagging to locate Azure resources during the deployment stage.

### Hooks

`azd` environment variables are automatically preloaded and available in [hooks](azd-extensibility.md) and custom scripts defined in your `azure.yaml` file, you can access environment variables using the following syntax:

### [Bash](#tab/bash)

```bash
# Use the variables in your script
echo "API endpoint: $API_ENDPOINT"
echo "Deploying to: $AZURE_LOCATION"
```

### [PowerShell](#tab/powershell)

```powershell
# Use the variables in your script
Write-Host "API endpoint: $API_ENDPOINT"
Write-Host "Deploying to: $AZURE_LOCATION"
```

---

You can define hooks in your `azure.yaml` file to run these scripts at specific points in the `azd` lifecycle:

```yaml
hooks:
  postprovision:
    windows:
      shell: pwsh
      run: ./scripts/load-env-vars.ps1
      interactive: false
    posix:
      shell: sh
      run: ./scripts/load-env-vars.sh
      interactive: false
```

> [!TIP]
> Visit the [Customize workflows using hooks](azd-extensibility.md) article for more information about using hooks.

## Remove or update variables

To remove a variable from your environment:

```azdeveloper
azd env unset VARIABLE_NAME
```

To update an existing variable:

```azdeveloper
azd env set VARIABLE_NAME "new-value"
```

To refresh your local environment variables from the current state of your Azure resources:

```azdeveloper
azd env refresh
```

Refreshing your environment is useful when:

- You want to ensure your local `.env` file reflects the latest outputs from your infrastructure (like connection strings, endpoints, etc.).
- You need to sync environment variables after a teammate updated the environment.

## AZD vs OS environment variables

`azd` environment variables and operating system environment variables serve different purposes and work in different ways:

| Concept | Azure Developer CLI | Operating system |
|---------|------------------------------------------|--------------------------|
| Location | Stored in `.azure/<env-name>/.env` files | Set in your operating system environment |
| Scope | Scoped to a specific named environment within a project | Global to your user session or system |
| Management | Managed using `azd env` commands | Managed using OS-specific commands (`export`, `set`, etc.) |
| Access | Loaded automatically by `azd` commands | Typically loaded explicitly in scripts or applications |
| Target | Tied to Azure resources and deployments | General purpose system configuration |
| Lifecycle | Persist between terminal sessions | May be temporary or persistent depending on how they're set |

`azd` doesn't automatically read or write OS environment variables. However, you can interact with both types of variables using custom scripts.

**Read `azd` environment variables and OS environment variables**:

### [Bash](#tab/bash)

```bash
# Access OS environment variable
echo "OS variable: $PATH"

# Access azd environment variable
echo "AZD variable: $(azd env get-value MY_VARIABLE)"
```

### [PowerShell](#tab/powershell)

```powershell
# Access OS environment variable
Write-Host "OS variable: $env:PATH"

# Access azd environment variable
Write-Host "AZD variable: $(azd env get-value MY_VARIABLE)"
```

---

**Write `azd` environment variables to OS or framework environment variables:**

### [Bash](#tab/bash)

```bash
# Load all azd environment variables into the current shell session
while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values)
EOF
```

### [PowerShell](#tab/powershell)

```powershell
# Load all azd environment variables into the current PowerShell session
foreach ($line in (& azd env get-values)) {
    if ($line -match "([^=]+)=(.*)") {
        $key = $matches[1]
        $value = $matches[2] -replace '^"|"$'
        $env:$key = $value
    }
}
```

---

## Standard environment variables

`azd` sets and uses several common environment variables across all environments:

| Variable | Description | Example | When Set |
|----------|-------------|---------|---------|
| `AZURE_ENV_NAME` | Name of the current environment | `dev` | When environment is created |
| `AZURE_LOCATION` | Azure region where resources are deployed | `eastus` | During first provisioning |
| `AZURE_SUBSCRIPTION_ID` | ID of the Azure subscription used | `00000000-0000-0000-0000-000000000000` | During first provisioning |
| `AZURE_RESOURCE_GROUP` | Name of the resource group | `rg-myapp-dev` | During provisioning |
| `AZURE_PRINCIPAL_ID` | The running user/service principal ID | `00000000-0000-0000-0000-000000000000` | During provisioning |
| `AZURE_PRINCIPAL_TYPE` | The type of a principal in the environment. | `1a2b3c` | During provisioning |
| `AZURE_TENANT_ID` | The type of a principal in the environment. | `1a2b3c` | During provisioning |

<<<<<<< HEAD
## Secrets and sensitive data considerations
=======
| Name  | Description  | Examples  | When available  |
|---------|---------|---------|---------|
|`AZURE_ENV_NAME`     | The name of the environment in-use.       | `todo-app-dev`        | When an environment is created (after running azd init or azd env new, for example).        |
|`AZURE_LOCATION`     | The location of the environment in-use.        |  `eastus2`        |  Right before an environment is provisioned for the first time.       |
|`AZURE_PRINCIPAL_ID`     | The running user/service principal.       | `925cff12-ffff-4e9f-9580-8c06239dcaa4`        | Determined automatically during provisioning (ephemeral).        |
|`AZURE_PRINCIPAL_TYPE`     | The type of the principal used for conditional role assignments. Can be used in CI/CD scenarios for determining appropriate permission levels.       | `User`, `ServicePrincipal`        | Determined automatically during provisioning in CI/CD pipelines.        |
|`AZURE_SUBSCRIPTION_ID`    | The targeted subscription.       |  `925cff12-ffff-4e9f-9580-8c06239dcaa4`       | Right before an environment is provisioned for the first time.        |
|`SERVICE_<service>_IMAGE_NAME`     | The full name of the container image published to Azure Container Registry for container app services.        | `todoapp/web-dev:azdev-deploy-1664988805`        | After a successful publishing of a `containerapp` image        |
>>>>>>> main

While environment variables are convenient for configuration, they require special handling for sensitive data:

### Avoid storing secrets in .env files

`.env` files are typically stored in plain text and can easily be:

- Accidentally committed to source control
- Shared or copied without proper protections
- Viewed by anyone with access to the project files
- Included in logs or error reports

> [!WARNING]
> Never store secrets in an Azure Developer CLI `.env` file. These files can easily be shared or copied into unauthorized locations, or checked into source control. Use services such as Azure Key Vault or Azure Role Based Access Control (RBAC) for protected or secretless solutions.

### Alternatives for handling secrets

For sensitive data, consider these more secure approaches:

- **Azure Key Vault references**: Store secrets in Azure Key Vault and reference them in your `.env` file:

   ```azdeveloper
   azd env set-secret <secret-value>
   ```

   This command creates a Key Vault secret and stores a reference to it in your `.env` file rather than the actual value.

- **Managed identities**: Configure your Azure services to use managed identities instead of connection strings or access keys.
- **Environment-specific security**: Apply stricter security controls to production environments than development ones.
- **Just-in-time secrets**: Generate short-lived credentials during deployment rather than storing persistent secrets.

## Next steps

> [!div class="nextstepaction"]
> [Work with environments in Azure Developer CLI](work-with-environments.md)
> [Customize your Azure Developer CLI workflows using hooks](azd-extensibility.md)
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

The Azure Developer CLI (`azd`) uses environment variables to store and manage configuration settings across multiple deployment environments. These variables control how your application is provisioned, deployed, and run in Azure. This article explains how environment variables work within `azd` environments and provides guidance on managing them effectively.

## Understand environment variables

In the context of the Azure Developer CLI, environment variables are key-value pairs that are tied to specific named environments like *dev*, *test*, or *prod*. Each `azd` environment maintains its own set of environment variables, allowing you to configure different settings for different deployment targets.

### What are environment variables

Environment variables in `azd` are configuration settings stored in `.env` files within your environment folders. They serve as inputs to:

- Infrastructure provisioning processes
- Application deployment workflows
- Runtime configurations for Azure services
- Feature flags and connection parameters

Unlike traditional environment variables that exist at the operating system level, `azd` environment variables are scoped to specific environments within your project, providing isolation between different deployment targets.

Environment variables provide several key benefits when working with `azd`:

- **Environment isolation**: Keep configurations for development, testing, and production separate and distinct.
- **Configuration consistency**: Ensure all team members use the same settings when working with a specific environment.
- **Infrastructure as Code**: Define your infrastructure parameterization through variables rather than hard-coded values.
- **Deployment automation**: Enable CI/CD pipelines to deploy to different environments using the same codebase but different configurations.
- **Simplified management**: Easily update settings across all services in an environment from a central location.

Each `azd` environment has its own set of variables, allowing for environment-specific configurations while using the same application code and infrastructure templates.

## Environment variables and .env files

The `azd` environment variables are stored in `.env` files within the environment-specific directories of your project. When you create an environment using `azd env new <name>`, a directory structure is created:

```text
.azure/
├── <environment-name>/
│   ├── .env                   # Environment variables for this environment
│   └── main.parameters.json   # Infrastructure parameters
```

The `.env` file uses a standard format where each line represents a key-value pair:

```text
KEY1=value1
KEY2=value2
```

> [!TIP]
> Visit the [Working with environments](work-with-environments.md) article for more information about `azd` environments.

When you run `azd` commands targeting a specific environment, the CLI automatically loads variables from that environment's `.env` file.

These variables influence:

- **Infrastructure provisioning**: Variables like `AZURE_LOCATION` and `AZURE_SUBSCRIPTION_ID` determine where and how resources are created.
- **Deployment**: Variables like service endpoints and connection strings control how your application connects to Azure services.
- **Application configuration**: Variables can be passed to your application to control its behavior.
- **Resource naming**: Variables like `RESOURCE_TOKEN` ensure consistent resource naming patterns.

The `.env` file is also updated automatically during operations like `azd init`, `azd provision`, and `azd deploy`, capturing outputs from your infrastructure templates and storing them for future use.

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

`azd` doesn't automatically read or write OS environment variables. However, you can interact with both types of variables using custom scripts:

**Reading OS environment variables in scripts:**

**Bash:**

```bash
# Access OS environment variable
echo "OS variable: $PATH"

# Access azd environment variable
echo "AZD variable: $(azd env get-value MY_VARIABLE)"
```

**PowerShell:**

```powershell
# Access OS environment variable
Write-Host "OS variable: $env:PATH"

# Access azd environment variable
Write-Host "AZD variable: $(azd env get-value MY_VARIABLE)"
```

**Convert azd environment variables to OS environment variables:**

**Bash:**

```bash
# Load all azd environment variables into the current shell session
while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values)
EOF
```

**PowerShell:**

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

## Set Environment Variables

You can use different methods to set `azd` environment variables, depending on the scenario.

### CLI commands

The most direct way to set an environment variable is using the `azd env set` command:

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

### Edit the .env file

You can manually edit the `.env` file located in your environment directory at `.azure/<environment-name>/.env`:

```text
# Example .env file
AZURE_ENV_NAME=dev
AZURE_LOCATION=eastus
AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000
API_TIMEOUT=5000
```

While direct editing works, using the `azd env set` command is preferred because it:

- Ensures proper formatting
- Validates the changes
- Avoids potential syntax errors
- Works consistently across different environments

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
- Connection strings
- Resource names and identifiers
- API keys (when properly secured)

## Get and use environment variables

Once set, you can access environment variables in several contexts:

### Using CLI commands

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

### Bicep files

Environment variables can be referenced in Bicep parameter files (`main.parameters.json`) using a special substitution syntax:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "value": "${AZURE_LOCATION}"
    },
    "environmentName": {
      "value": "${AZURE_ENV_NAME}"
    }
  }
}
```

When `azd` processes this file during provisioning, it automatically substitutes the references with the actual environment variable values from the current environment's `.env` file. This behavior is useful when you want to influence provisioned resources using `azd` environment variables.

### Hooks

In custom scripts and [hooks](azd-extensibility.md) defined in your `azure.yaml` file, you can access environment variables using the `azd env get-values` command:

**Bash:**

```bash
#!/bin/bash
echo "Loading azd .env file from current environment..."

while IFS='=' read -r key value; do
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
    export "$key=$value"
done <<EOF
$(azd env get-values)
EOF

# Now you can use the variables like regular environment variables
echo "API endpoint: $API_ENDPOINT"
```

**PowerShell:**

```powershell
Write-Host "Loading azd .env file from current environment"
foreach ($line in (& azd env get-values)) {
    if ($line -match "([^=]+)=(.*)") {
        $key = $matches[1]
        $value = $matches[2] -replace '^"|"$'
        [Environment]::SetEnvironmentVariable($key, $value)
    }
}

# Now you can use the variables like regular environment variables
Write-Host "API endpoint: $env:API_ENDPOINT"
```

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

The `azd env refresh` command is particularly useful when:

- Resources have been modified outside of `azd` (through the Azure portal or other tools)
- Team members have updated the environment
- You've switched to a different machine or workspace
- You need to ensure your local configuration matches the deployed state

## Common environment variables

`azd` sets and uses several common environment variables across all environments:

| Variable | Description | Example | When Set |
|----------|-------------|---------|---------|
| `AZURE_ENV_NAME` | Name of the current environment | `dev` | When environment is created |
| `AZURE_LOCATION` | Azure region where resources are deployed | `eastus` | During first provisioning |
| `AZURE_SUBSCRIPTION_ID` | ID of the Azure subscription used | `00000000-0000-0000-0000-000000000000` | During first provisioning |
| `AZURE_RESOURCE_GROUP` | Name of the resource group | `rg-myapp-dev` | During provisioning |
| `AZURE_PRINCIPAL_ID` | The running user/service principal ID | `00000000-0000-0000-0000-000000000000` | During provisioning |
| `RESOURCE_TOKEN` | Unique token used to generate resource names | `1a2b3c` | During provisioning |

Additionally, `azd` automatically sets service-specific variables based on the services defined in your `azure.yaml` file:

### App Service

```output
SERVICE_WEB_IDENTITY_PRINCIPAL_ID=00000000-0000-0000-0000-000000000000
SERVICE_WEB_NAME=app-web-dev-1a2b3c
SERVICE_WEB_ENDPOINT=https://app-web-dev-1a2b3c.azurewebsites.net
```

### Container Apps

```output
SERVICE_API_IDENTITY_PRINCIPAL_ID=00000000-0000-0000-0000-000000000000
SERVICE_API_NAME=ca-api-dev-1a2b3c
SERVICE_API_ENDPOINT=https://ca-api-dev-1a2b3c.azurecontainerapps.io
SERVICE_API_IMAGE_NAME=cr-dev-1a2b3c.azurecr.io/api:latest
```

### Azure OpenAI

```output
AZURE_OPENAI_SERVICE=oai-dev-1a2b3c
AZURE_OPENAI_DEPLOYMENT=gpt-35-turbo
AZURE_OPENAI_ENDPOINT=https://oai-dev-1a2b3c.openai.azure.com/
```

### Cosmos DB

```output
AZURE_COSMOS_ENDPOINT=https://cosmos-dev-1a2b3c.documents.azure.com:443/
AZURE_COSMOS_DATABASE_NAME=mydb
AZURE_COSMOS_CONTAINER_NAME=items
```

### Key Vault

```output
AZURE_KEY_VAULT_NAME=kv-dev-1a2b3c
AZURE_KEY_VAULT_ENDPOINT=https://kv-dev-1a2b3c.vault.azure.net/
```

### Storage Account

```output
AZURE_STORAGE_ACCOUNT=stdev1a2b3c
AZURE_STORAGE_ENDPOINT=https://stdev1a2b3c.blob.core.windows.net/
```

## Secrets and sensitive data considerations

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

1. **Azure Key Vault references**: Store secrets in Azure Key Vault and reference them in your `.env` file:

   ```azdeveloper
   azd env set-secret DB_PASSWORD
   ```

   This command creates a Key Vault secret and stores a reference to it in your `.env` file rather than the actual value.

2. **Managed identities**: Configure your Azure services to use managed identities instead of connection strings or access keys.

3. **Environment-specific security**: Apply stricter security controls to production environments than development ones.

4. **Just-in-time secrets**: Generate short-lived credentials during deployment rather than storing persistent secrets.

### Source control best practices

When working with `.env` files and source control:

- Add `.azure/**/.env` to your `.gitignore` file to prevent accidental commits
- Consider using template `.env.example` files with placeholder values for documentation
- Document required environment variables in your README file
- Use CI/CD pipelines to inject secrets during deployment rather than storing them in repositories
- Regularly rotate sensitive credentials
- Consider using tools like pre-commit hooks to prevent secret leaks

## Next steps

> [!div class="nextstepaction"]
> [Work with environments in Azure Developer CLI](work-with-environments.md)
> [Customize your Azure Developer CLI workflows using hooks](azd-extensibility.md)
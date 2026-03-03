---
title: Azure Developer CLI tooling and environment FAQ
description: Get answers to commonly asked questions about Azure Developer CLI tooling and environments.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 03/03/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI tooling and environment FAQ

This article provides answers to frequently asked questions about the Azure Developer CLI (`azd`) tooling, commands, and environments.

## General

### How do I uninstall Azure Developer CLI?

There are different options for uninstalling `azd` depending on how you originally installed it. Visit the [installation page](/azure/developer/azure-developer-cli/install-azd) for details.

### What's the difference between the Azure Developer CLI and the Azure CLI?

[Azure Developer CLI](/azure/developer/azure-developer-cli/overview) (`azd`) and [Azure CLI](/cli/azure/what-is-azure-cli) (`az`) are both command-line tools, but they help you do different tasks.

[`azd`](./index.yml) focuses on the high level developer workflow. Apart from provisioning/managing Azure resources, `azd` helps to stitch cloud components, local development configuration, and pipeline automation together into a complete solution.

Azure CLI is a control plane tool for creating and administering Azure infrastructure such as virtual machines, virtual networks, and storage. The Azure CLI is designed around granular commands for specific administrative tasks.

### What is an environment name?

Azure Developer CLI uses an environment name to set the `AZURE_ENV_NAME` environment variable that's used by Azure Developer CLI templates. `AZURE_ENV_NAME` is also used to prefix the Azure resource group name. Because each environment has its own set of configurations, Azure Developer CLI stores all configuration files in environment directories.

```txt
├── .Azure                          [This directory displays after you run add init or azd up]
│   ├── <your environment1>         [A directory to store all environment-related configurations]
│   │   ├── .env                    [Contains environment variables]
│   │   └── main.parameters.json    [A parameter file]
│   └── <your environment2>         [A directory to store all environment-related configurations]
│   │   ├── .env                    [Contains environment variables]
│   │   └── main.parameters.json    [A parameter file]
│   └──config.json
```

### Can I set up more than one environment?

Yes. You can set up a various environments (for example, dev, test, production). You can use `azd env` to manage these environments.

### Where is the environment configuration (.env) file stored?

The .env file path is `<your-project-directory-name>\.azure\<your-environment-name>\.env`.

### How is the .env file used?

In Azure Developer CLI, the `azd` commands refer to the .env file for environment configuration. Commands such as `azd deploy` also update the .env file with, for example, the db connection string and the Azure Key Vault endpoint.

### I have run `azd up` in Codespaces. Can I continue my work in a local development environment?

Yes. You can continue development work locally.
1. Run `azd init -t <template repo>` to clone the template project to your local machine.
2. To pull down the existing env created using Codespaces, run `azd env refresh`. Make sure you provide the same environment name, subscription and location as before.

### How do I authenticate in Codespaces if device login has an issue?

If you experience issues with device code authentication in Codespaces (for example, recurring 2FA requests or errors), try the following workaround using VS Code Desktop:

1. Open your Codespace in VS Code Desktop using one of these methods:
    - Use the command palette (Ctrl+Shift+P on Windows or Cmd+Shift+P on MacOs) and select **Codespaces: Open in VS Code Desktop**.
    - Click the bottom left corner of the Codespace in the browser and select **Open in VS Code Desktop**).
2. In the VS Code Desktop terminal, run `azd auth login` and complete the browser-based authentication.
3. Once authenticated, close VS Code Desktop and return to your Codespace in the browser. The authentication state should persist.

### How is the azure.yaml file used?

The azure.yaml file describes the apps and types of Azure resources that are included in the template.

### What is the behavior of the `secretOrRandomPassword` function?

The `secretOrRandomPassword` function retrieves a secret from Azure Key Vault if parameters for the key vault name and secret are provided. If these parameters aren't provided or a secret can't be retrieved, the function returns a randomly generated password to use instead.

The following example demonstrates a common use case of the `secretOrRandomPassword` in a `main.parameters.json` file. The `${AZURE_KEY_VAULT_NAME}` and `sqlAdminPassword` variables are passed as parameters for the names of the Key Vault and secret. If the value can't be retrieved, a random password is generated instead.

```json
"sqlAdminPassword": {
    "value": "$(secretOrRandomPassword ${AZURE_KEY_VAULT_NAME} sqlAdminPassword)"
}
```

The output of `secretOrRandomPassword` should also be saved to Key Vault using Bicep for future runs. Retrieving and reusing the same secrets across deploys can prevent errors or unintended behaviors that can surface when repeatedly generating new values. To create a Key Vault and store the generated secret in it, use the Bicep code below. You can view the full sample code for these modules in the [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev/tree/main).

```bicep
module keyVault './core/security/keyvault.bicep' = {
name: 'keyvault'
scope: resourceGroup
params: {
    name: '${take(prefix, 17)}-vault'
    location: location
    tags: tags
    principalId: principalId
}
}

module keyVaultSecrets './core/security/keyvault-secret.bicep' = {
name: 'keyvault-secret-sqlAdminPassword'
scope: resourceGroup
params: {
    keyVaultName: keyVault.outputs.name
    name: 'sqlAdminPassword'
    secretValue: sqlAdminPassword
}
}]
```

This Bicep setup enables the following workflow for managing your secrets:

1. If the specified secret exists, it's retrieved from Key Vault using the `secretOrRandomPassword` function.
2. If the secret doesn't exist, a Key Vault is created, and the randomly generated secret is stored inside of it.
3. On future deploys, the `secretOrRandomPassword` method retrieves the stored secret now that it exists in Key Vault. The Key Vault won't be recreated if it already exists, but the same secret value will be stored again for the next run.

### Can I use Azure Free Subscription?

Yes, but each Azure location can only have one deployment. If you've already used the selected Azure location, you'll see the deployment error:

```text
InvalidTemplateDeployment: The template deployment '<env_name>' isn't valid according to the validation procedure. The tracking ID is '<tracking_id>'. See inner errors for details.
```

You can select a different Azure location to fix the issue.

### My app hosted with Azure App Service is triggering a "Deceptive site ahead" warning. How can I fix it?

This might happen because of our method for naming resources.

Our 'Azure Dev' authored templates allow for configuring the name of the resource. To do so, you can add an entry to the `main.parameters.json` in the `infra` folder. For example:

```json
"webServiceName": {
    "value": "my-unique-name"
}
```

This entry creates a new resource named "my-unique-name" instead of a randomized value such as "app-web-aj84u2adj" the next time you provision your application. You can either manually remove the old resource group using the Azure portal or run `azd down` to remove all previous deployments. After removing the resources, run `azd provision` to create them again with the new name.

This name will need to be globally unique, otherwise you will receive an ARM error during `azd provision` when it tries to create the resource.

### Can I work with multiple Azure tenants?

Yes. To authenticate with a specific tenant, use the `--tenant-id` parameter with the `azd auth login` command.

```bash
azd auth login --tenant-id <tenant-id>
```

Alternatively, if you want `azd` to have access to all your tenants, you can handle the Multi-Factor Authentication (MFA) challenges in the browser first:

1. Open the [Azure Portal](https://portal.azure.com) in your browser.
2. Switch to each of your tenants one by one. This action triggers any necessary MFA challenges and refreshes your tokens.
3. Run `azd auth login` in your terminal. `azd` will use the browser's existing session and access tokens, which are now valid for all the tenants you visited.

## Command: azd provision

### How does the command know what resources to provision?

The command uses Bicep templates, which are found under `<your-project-directory-name>/infra` to provision Azure resources.

### Where can I find what resources are provisioned in Azure?

Go to https://portal.azure.com and then look for your resource group, which is `rg-<your-environment-name>`.

### How do I find more information about Azure errors?

We use Bicep templates, which are found under `<your-project-directory-name>/infra`, to provision Azure resources. If there are issues, we include the error message in the CLI output.

You can also go to https://portal.azure.com and then look for your resource group, which is `rg-<your-environment-name>`. If any of the deployments fail, select the error link to get more information.

For other resources, see [Troubleshoot common Azure deployment errors - Azure Resource Manager](/azure/azure-resource-manager/troubleshooting/common-deployment-errors).

### Is there a log file for `azd provision`?

Coming soon. This feature is planned for a future release.

## Command: azd deploy

### Can I rerun this command?

Yes.

### How does azd find the Azure resource to deploy my code to?

During deploy, `azd` first discovers all the resource groups that make up your application by looking for groups tagged with `azd-env-name` and with a value that matches the name of your environment. Then, it enumerates all the resources in each of these resource groups, looking for a resource tagged with `azd-service-name` with a value that matches the name of your service from `azure.yaml`.

While we recommend using tags on resources, you can also use the `resourceName` property in `azure.yaml` to provide an explicit resource name. In that case, the above logic isn't run.

### How do I deploy specific services in my project while skipping others?

When deploying your project, you can choose to deploy specific services either by specifying the service name in the command (i.e. `azd deploy api`) or by navigating to a subfolder that contains just the service(s) you want to deploy. When doing so, all other services will be listed as `- Skipped`.

If you don't want to skip any services, be sure to either run your command from the root folder or add the `--all` flag to your command.

## Command: azd up

### Can I rerun `azd up`?

Yes. We use the [incremental deployment mode](/azure/azure-resource-manager/templates/deployment-modes).

### How do I find the log file for `azd up`?

Coming soon. This feature is planned for a future release.

## Command: azd pipeline

### What is an Azure service principal?

An Azure service principal is an identity that's created for use with apps, hosted services, and automated tools to access Azure resources. This access is restricted by the roles that are assigned to the service principal, which gives you control over which resources can be accessed and at which level. For more information about authenticating from Azure to GitHub, see [Connect GitHub and Azure | Microsoft Docs](../github/connect-from-azure-secret.md).

### Do I need to create an Azure service principal before I run `azd pipeline config`?

No. The `azd pipeline config` command takes care of creating the Azure service principal and performing the necessary steps to store the secrets in your GitHub repo.

### What are all the secrets stored in GitHub?

The command stores four secrets in GitHub: AZURE_CREDENTIALS, AZURE_ENV_NAME, AZURE_LOCATION, and AZURE_SUBSCRIPTION_ID. You can override the value of each secret by going to `https://github.com/<your-github-account>/<your-repo>/secrets/actions`.

### What is OpenID Connect (OIDC), and is it supported?

With [OpenID Connect](https://docs.github.com/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect), your workflows can exchange short-lived tokens directly from Azure.

While OIDC is supported as the default for GitHub Actions and Azure Pipeline (set as **federated**), it isn't supported for Azure DevOps or Terraform.

- For Azure DevOps, explicitly calling out `--auth-type` as `federated` will result in an error.
- For Terraform:
  - If `--auth-type` isn't defined, it will fall back to `clientcredentials` and will result in a warning.
  - If `--auth-type` is explicitly set to `federated`, it will result in an error.

### How do I reset the Azure service principal that's stored in GitHub Actions?

Go to `https://github.com/<your-github-account>/<your-repo>settings/secrets/actions`, and then update `AZURE_CREDENTIALS` by copying and pasting the entire JSON object for the new service principal. For example:

```json
{
"clientId": "<GUID>",
"clientSecret": "<GUID>",
"subscriptionId": "<GUID>",
"tenantId": "<GUID>",
(...)
}
```

### Where is the GitHub Actions file stored?

The GitHub Actions file path is `<your-project-directory-name>\.github\workflows\azure-dev.yml`.

### In the azure-dev.yml file, can I deploy just the code in the build step?

Yes. Replace `run: azd up --no-prompt` with `run: azd deploy --no-prompt`.

### Where can I find the log for the GitHub Actions job that I triggered when I ran `azd pipeline config`?

Go to `https://github.com/<your-github-account>/<your-repo>/actions`, and then refer to the log file in the workflow run.

## Building a container application locally

### Why am I unable to locally run the container app that I'm building?

When building container applications locally, you need to run `azd auth login` in the container for the application to work with the `AzureDeveloperCliCredential`. Alternatively, you could configure your application to use a service principal instead of the `AzureDeveloperCliCredential`.

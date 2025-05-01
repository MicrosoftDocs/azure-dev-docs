---
title: Explore the Azure Developer CLI init workflow
description: Learn about how the different stages of the Azure Developer CLI template initialization process
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/15/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Explore the `azd init` workflow

The Azure Developer CLI (`azd`) provides a powerful set of commands that streamline the process of developing, provisioning, and deploying applications to Azure. The `azd init` command is a fundamental step in this process, helping developers initialize their projects for use with Azure Developer CLI. This article explores the essential concepts and workflow options available when using `azd init`.

## Essential concepts

The `azd init` command serves as the foundation for preparing applications for Azure deployment. It sets up the necessary configuration files and infrastructure templates that define how your application will be deployed to Azure services.

## Core azd init tasks

Regardless of which workflow option you choose, `azd init` performs these core tasks:

- **Creates the `azure.yaml` file** - The central configuration file that defines your project's metadata, services, and deployment settings
- **Sets up the infrastructure folder** - Generates a folder (typically `infra/`) containing Bicep templates that define the Azure resources your application requires
- **Configures environment settings** - Creates the `.azure/` folder structure to store environment-specific variables and secrets
- **Updates `.gitignore`** - Modifies or creates a `.gitignore` file to prevent sensitive information from being committed to source control
- **Prepares for subsequent commands** - Sets up the project structure for use with other `azd` commands like `provision`, `deploy`, and `up`
- **Assigns unique resource names** - Generates unique resource names based on your project name to avoid conflicts in Azure

## Additional workflow considerations

The behavior of `azd init` varies depending on your chosen workflow:

- **With existing code**:
  - Analyzes your codebase to detect programming languages and frameworks
  - Identifies appropriate Azure services for your application components
  - Suggests service configurations based on your application's requirements
  - Creates Bicep templates tailored to your specific application architecture

- **With templates**:
  - Clones the template's code structure into your project directory
  - Sets up infrastructure definitions optimized for the template's architecture
  - Configures service connections between application components
  - May include sample application code demonstrating best practices

- **With minimal setup**:
  - Creates only the essential `azure.yaml` file structure
  - Requires manual configuration of infrastructure templates
  - Provides flexibility for custom deployment architectures
  - Expects greater developer expertise with Azure resources

## Initialization workflow options

The `azd init` command offers multiple workflows to accommodate different development scenarios. Choose the approach that best fits your project's requirements. All of these flows are outlined in more detail in the [Create templates overview]() and corresponding articles.

### Option 1 - Use code in the current directory

Use this option when you have an existing application and want to prepare it for deployment to Azure using the Azure Developer CLI.

**Steps:**

1. Navigate to your project's root directory.
2. Run the following command:

   ```bash
   azd init
   ```

3. Follow the interactive prompts to:
   - Specify a project name (used for resource naming)
   - Choose a location for Azure resources
   - Select the default environment name
   - Configure any service-specific settings based on your codebase

**What happens:**

- `azd` analyzes your project structure and generates the appropriate `azure.yaml` configuration
- Infrastructure as Code files are created in an `infra/` folder
- The project is prepared for subsequent `azd` commands
- No changes are made to your existing application code

**Example:**

```bash
cd my-existing-app
azd init
```

### Option 2 - Select a template

This option lets you start with a pre-built application template that includes both application code and the necessary Azure infrastructure definitions.

**Steps:**

1. Run the following command with the template parameter:

   ```bash
   azd init --template <template-name>
   ```

   Or use the interactive mode and select a template:

   ```bash
   azd init
   ```

2. Choose a template from:
   - The [awesome-azd gallery](https://aka.ms/awesome-azd)
   - A GitHub repository URL
   - A local file path containing a template

**What happens:**

- The template's code is cloned into your current directory
- All required Azure Developer CLI files are set up
- The project is ready for immediate deployment to Azure

**Example:**

```bash
# Initialize using a template from the gallery
azd init --template todo-nodejs-mongo

# Initialize using a template from GitHub
azd init --template https://github.com/Azure-Samples/todo-nodejs-mongo
```

### Option 3 - Create a minimal project

For advanced users who want to start with a minimal setup and customize everything manually, the minimal option provides just the essential configuration.

**Steps:**

1. Run the following command:

   ```bash
   azd init --minimal
   ```

2. Provide the required information for basic project configuration.

**What happens:**

- Only the essential `azure.yaml` configuration file is created
- No application code or comprehensive infrastructure templates are added
- You'll need to manually create or customize the infrastructure files based on your requirements

**Example:**

```bash
mkdir my-new-project
cd my-new-project
azd init --minimal
```

## Next steps

After initializing your project with `azd init`, you can:

- Modify the generated infrastructure files to customize your Azure resources
- Use `azd provision` to create the required resources in Azure
- Use `azd deploy` to deploy your application code to the provisioned resources
- Learn about the [Azure Developer CLI up workflow](azd-up-workflow.md) to combine provisioning and deployment in a single command

## Related content

- [Azure Developer CLI commands](azd-commands.md)
- [Azure.yaml schema reference](azd-schema.md)
- [Azure Developer CLI templates](azd-templates.md)
- [Template galleries](azd-template-galleries.md)

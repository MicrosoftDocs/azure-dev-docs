---
title: Explore the Azure Developer CLI init workflow
description: Learn about the stages of the Azure Developer CLI project initialization process.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/15/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Explore the Azure Developer CLI initialization workflows

The Azure Developer CLI (`azd`) provides a set of commands to streamline developing, provisioning, and deploying app on Azure. The `azd init` command helps you set up new or existing projects by generating the files and configurations needed to work with `azd`. This article explains the different initialization workflows available and how to select the best option for your development scenario.

## Initialization workflows

The `azd init` command supports several workflows to prepare your app to work with `azd`:

- **Scan current directory**: Analyzes an existing app codebase to generate appropriate `azd` configuration files and resources.
- **Select a template**: Clones and initializes a template from an `azd` [template gallery](azd-template-galleries.md).
- **Create a minimal project**: Initializes a basic `azure.yaml` file as a starting point for building your own `azd` template from scratch.

Choose the approach that best fits your project. All of these flows are outlined in more detail in the [Create templates overview](make-azd-compatible.md) and related articles. The following sections provide a conceptual overview of each flow.

### Scan current directory

Use this workflow when you have an existing app codebase and want to prepare it for deployment to Azure using `azd`.

1. Navigate to your project's root directory.
2. Run the `azd init` command:

    ```bash
    azd init
    ```

3. Select **Scan current directory**. `azd` will:
    - Scan your directory to determine the language or framework your app uses.
    - Select an appropriate hosting platform, such as Azure Container Apps.
    - Prompt you to add or remove discovered services if needed.

    ```output
    ? How do you want to initialize your app? Scan current directory

      (✓) Done: Scanning app code in current directory
    
    Detected services:
    
      .NET
      Detected in: src
    
    azd will generate the files necessary to host your app on Azure using Azure Container Apps.
    
    ? Select an option  [Use arrows to move, type to filter]
    > Confirm and continue initializing my app
      Remove a detected service
      Add an undetected service
    ```

4. Select **Confirm and continue initializing my app** to complete the workflow. `azd` creates the following in your app directory:
    - An `azure.yaml` file that defines your app services and maps them to hosting resources.
    - A `.azure` folder to hold configuration settings such as your environment name.
    - A `.gitignore` file configured for your app language and hosting platform.

5. Optionally, run `azd up` to create the Azure Container Apps resources and deploy your app.

Your app is now structured as an `azd` template you can continue to develop and expand with more Azure resources and services.

### Select a template

This workflow lets you start with a prebuilt `azd` template that usually includes both application code and the necessary Azure infrastructure definitions.

1. Run the `azd init` command:

    ```bash
    azd init
    ```

    > [!NOTE]
    > You can also run `azd init` with the `--template` parameter to directly initialize a template by name and skip the workflow selection.

2. Choose **Select a template**. `azd` displays a list of available templates from your configured template sources.

    ```output
    ? How do you want to initialize your app? Select a template
    ? Select a project template:  [Use arrows to move, type to filter]
    > Deploy Phoenix to Azure
      (Arize-ai/phoenix-on-azure)
    
      API Center Reference Sample
      (Azure-Samples/APICenter-Reference)
    
      Event Driven Java Application with Azure Service Bus on Azure Spring Apps
      (Azure-Samples/ASA-Samples-Event-Driven-Application)
    
      Static React Web App with Java API and PostgreSQL
      (Azure-Samples/ASA-Samples-Web-Application)
    ```

3. Type to filter the results and search for the `Hello AZD` template. Press Enter to clone and initialize the template.

4. Optionally, run `azd up` to provision and deploy the template resources to Azure.

You can also use the initialized template as a starting point for further development.

### Create a minimal project

For advanced users who want to start with a minimal setup and customize everything manually, this option provides just the essential configuration.

1. Run the `azd init` command:

   ```bash
   azd init --minimal
   ```

2. When prompted, enter a name for your `azd` template and press Enter.

    ```output
    ? How do you want to initialize your app? Create a minimal project
    ? What is the name of your project? (empty) hello-azd
    ? What is the name of your project? hello-azd
    
    SUCCESS: Generated azure.yaml project file.
    Run azd add to add new Azure components to your project.
    ```

    Only the essential `azure.yaml` configuration file is created. No application code or comprehensive infrastructure templates are added, so you need to manually create or customize the infrastructure files based on your requirements.

3. Optionally, use the `azd add` [compose feature](azd-compose.md) to start adding Azure resources to your app.

## Next steps

After initializing your project with `azd init`, you can:

- Modify the generated infrastructure files to customize your Azure resources.
- Use `azd provision` to create the required resources in Azure.
- Use `azd deploy` to deploy your application code to the provisioned resources.
- Learn about the [Azure Developer CLI up workflow](azd-up-workflow.md) to combine provisioning and deployment in a single command.

## Related content

- [Azure Developer CLI commands](azd-commands.md)
- [Azure.yaml schema reference](azd-schema.md)
- [Azure Developer CLI templates](azd-templates.md)
- [Template galleries](azd-template-galleries.md)
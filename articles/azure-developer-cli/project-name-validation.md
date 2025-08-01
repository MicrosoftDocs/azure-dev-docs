---
title: Azure Developer CLI project name validation
description: Learn about Azure Developer CLI project name validation rules to prevent service packaging failures.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 8/1/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI project name validation

The Azure Developer CLI (`azd`) performs project name validation to ensure your applications can be correctly provisioned and deployed to Azure resources. This article explains the project name validation rules used by `azd` and how to resolve common validation errors.

## Project name validation rules

When using `azd init` to initialize a project or when creating a new project name in the `azure.yaml` file, the following validation rules are applied:

| Rule | Description |
|------|-------------|
| Allowed characters | Project names can include lowercase letters, numbers, and hyphens only. |
| Starting character | Project names must start with a letter. |
| Ending character | Project names must not end with a hyphen. |
| Length | Project names must be between 1 and 58 characters long. |
| No consecutive hyphens | Project names cannot contain consecutive hyphens. |

These validation rules ensure that your project name will be compatible with the naming requirements of Azure resources and prevent service packaging failures during deployment.

## Common validation errors and solutions

The table below shows common project name validation errors and their solutions:

| Error Message | Description | Solution |
|---------------|-------------|----------|
| "Project name must start with a letter" | The project name starts with a number or hyphen. | Choose a name that starts with a letter. For example, change `1-my-app` to `app-1`. |
| "Project name can only contain lowercase letters, numbers, and hyphens" | The project name contains uppercase letters, spaces, or special characters. | Replace or remove any uppercase letters, spaces, or special characters. For example, change `My App!` to `my-app`. |
| "Project name cannot end with a hyphen" | The project name ends with a hyphen. | Remove the trailing hyphen or add a letter or number at the end. For example, change `my-app-` to `my-app`. |
| "Project name is too long" | The project name exceeds 58 characters. | Shorten your project name to be 58 characters or fewer. |
| "Project name cannot contain consecutive hyphens" | The project name contains two or more consecutive hyphens. | Replace consecutive hyphens with a single hyphen. For example, change `my--app` to `my-app`. |

## Project name and Azure resource naming

The project name specified in `azure.yaml` is important because it affects how `azd` generates default names for Azure resources. It serves as a prefix for resource names created during the provisioning process. By adhering to the validation rules, you ensure that generated Azure resource names will also be valid.

In Bicep or Terraform templates, the project name is often used as a base for constructing resource names, combined with the environment name and other elements. For example:

```bicep
var resourceToken = '${name}-${environmentName}'
```

Where `name` refers to the project name and `environmentName` is the name of your `azd` environment.

## Best practices for project naming

When naming your `azd` projects, consider the following best practices:

1. **Use descriptive names** - Choose names that clearly describe the purpose or function of your project.
2. **Keep names concise** - Shorter names are easier to work with and less prone to errors.
3. **Use consistent naming patterns** - Establish a consistent naming pattern across your organization.
4. **Avoid version numbers** - Consider using git tags or other versioning systems instead of embedding version numbers in project names.
5. **Plan for multiple environments** - Since the project name will be combined with environment names, ensure your naming scheme works across development, testing, and production environments.

## Resolving validation errors in existing projects

If you have an existing project with an invalid name, you can update the project name in the `azure.yaml` file:

1. Open your `azure.yaml` file.
2. Locate the `name` property at the root of the document.
3. Update the name to conform to the validation rules.
4. Save the changes.

Example:

```yaml
# Before
name: My Invalid Project!

# After
name: my-valid-project
```

> [!NOTE]
> Changing the project name after resources have been provisioned may require reprovisioning or manual updates to ensure all resources use the new naming scheme.

## Related content

- [Azure.yaml schema reference](azd-schema.md)
- [Azure Developer CLI initialization workflows](azd-init-workflow.md)
- [Make your app compatible with Azure Developer CLI](make-azd-compatible.md)

[!INCLUDE [request-help](includes/request-help.md)]

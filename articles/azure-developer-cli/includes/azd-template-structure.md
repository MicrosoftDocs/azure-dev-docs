---
author: alexwolfmsft
ms.service: azure-dev-cli
ms.topic: include
ms.date: 09/11/2026
ms.author: alexwolf
ai-usage: ai-generated
---

## Explore Azure Developer CLI template structure

`azd` templates are standard code repositories with extra configuration and infrastructure assets. Most templates use the following structure:

- **`azure.yaml` file** - Defines the project and maps deployable source directories to Azure resources.
- **`infra` folder** - Contains the Bicep or Terraform infrastructure-as-code files that create the Azure resources.
- **`src` folder** - Commonly contains deployable application source code. Infrastructure-only templates can omit application source, and application templates can use other source directory names.
- **`.azure` folder** - Contains local environments and values created by `azd`. This folder is local project state and isn't normally shared as part of a reusable template.

For example, a common `azd` template might match the following folder structure:

```text
contoso-project/
├── azure.yaml                 # azd project and service configuration
├── infra/
│   ├── main.bicep            # Infrastructure entry point
│   └── main.parameters.json  # Maps azd values to Bicep parameters
├── src/                      # Optional application source
│   ├── api/
│   └── web/
├── .github/workflows/        # Optional GitHub Actions pipelines
└── .azure/                   # Local environment state; don't distribute
```

`azd` templates also optionally include one or more of the following folders:

- **`.github` folder** - Holds CI/CD workflow files for GitHub Actions.
- **`.azdo` folder** - If you decide to use Azure Pipelines for CI/CD, define the workflow configuration files in this folder.
- **`.devcontainer` folder** - Defines a [development container](https://code.visualstudio.com/docs/devcontainers/create-dev-container) environment for the project.

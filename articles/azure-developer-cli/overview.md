---
title: What is the Azure Developer CLI?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/01/2024
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, build-2023
---

# What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is an open-source tool that accelerates your path to provision and deploy app resources on Azure. `azd` provides best practice, developer-friendly commands that map to key stages in your development workflow, whether you're working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

 `azd` uses [extensible blueprint templates](./azd-templates.md) that include everything you need to get an application up and running on Azure. These templates include:

- Reusable infrastructure as code assets using Bicep or Terraform.
- Proof-of-concept or starter application code that can be customized or replaced with your own app code.
- Configuration files to handle deploying your app to the provisioned resources.
- Optionally, pipeline workflow files for GitHub Actions or Azure Pipelines to enable CI/CD integrations.

You can also [create your own template](./make-azd-compatible.md?pivots=azd-create) or find one to customize or expand on from the [Awesome AZD](./make-azd-compatible.md?pivots=azd-convert) gallery.

## A sample `azd` workflow

The following steps demonstrate the basics of a common `azd` workflow. Visit the [installation page](/azure/developer/azure-developer-cli/install-azd) and [quickstart page](/azure/developer/azure-developer-cli/get-started) for more details on installing and getting started with `azd`.

You can install `azd` on common platforms using a single command:

### [Windows](#tab/windows)

```bash
winget install microsoft.azd
```

### [MacOS](#tab/mac)

```bash
brew tap azure/azd && brew install azd
```

### [Linux](#tab/linux)

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

---

After you install `azd`, provision and deploy app resources to Azure with only two commands using the `azd` template system:

1. Select an [Azure Developer CLI template](./azd-templates.md#start-with-an-existing-template) such as the [`hello-azd`](https://github.com/Azure-Samples/hello-azd) demo template.
1. Run the [`azd init`](./get-started.md) command to initialize the template:

    ```azdeveloper
    azd init -t hello-azd
    ```

1. Run the [`azd up`](./get-started.md) command to package, provision and deploy the app:

    ```azdeveloper
    azd up
    ```

1. Iterate on the application code and deploy changes as needed by running `azd deploy`.
1. Update Azure resources by modifying the template's Infrastructure as Code (IaC) and then running `azd provision` (optional)

Alternatively, you can also run `azd up` whenever you make a changes to your app code or infrastructure files, which handles both provisioning and deploying app resources. Visit the [reference page] for a complete list of `azd` commands.

## Introductory video

> [!VIDEO https://www.youtube.com/watch?v=f_HpDpEmWZ4]
Check out the [Azure Developer CLI playlist](https://www.youtube.com/watch?v=_MNndbEPvYQ&list=PLq8oMtzrBmrhdtmthuGO9pOHRUqD-BmWh&index=1) for more video content.

## Next steps

- [View supported languages and environments](./supported-languages-environments.md)
- [Install the Azure Developer CLI](./install-azd.md).
- [Walk through the `azd` quickstart](./get-started.md) to see Azure Developer CLI in action.

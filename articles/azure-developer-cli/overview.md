---
title: What is the Azure Developer CLI?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/11/2023
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, build-2023
---

# What is the Azure Developer CLI?

The Azure Developer CLI (azd) is an open-source tool that accelerates your path to Azure. `azd` provides best practice, developer-friendly commands that map to key stages in your workflow, whether you're working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

You can use `azd` with [extensible blueprint templates](./azd-templates.md) that include everything you need to get an application up and running on Azure. These templates include reusable infrastructure as code assets and proof-of-concept application code that can be replaced with your own app code. You can also [create your own template](./make-azd-compatible.md?pivots=azd-create) or find one to [build upon](./make-azd-compatible.md?pivots=azd-convert). 

## Typical `azd` workflow

Once you've [installed Azure Developer CLI](./install-azd.md), you can get your app running on Azure in just a few steps.

1. Select an [Azure Developer CLI template](./azd-templates.md#start-with-an-existing-template).
2. Initialize the project with the template by [running `azd init`](./get-started.md)
3. Package, provision and deploy the app by [running `azd up`](./get-started.md).
4. Continue iterating on your application code and deploying changes as needed by running `azd deploy`
5. Update Azure resources by modifying the template's Infrastructure as Code (IaC) and then running `azd provision` (optional)

## Introductory video

> [!VIDEO https://www.youtube.com/embed/9z3PiHSCcYs]
Check out our [Azure Developer CLI playlist](https://www.youtube.com/watch?v=_MNndbEPvYQ&list=PLq8oMtzrBmrhdtmthuGO9pOHRUqD-BmWh&index=1)! 

## Next steps
- [View supported languages and environments](./supported-languages-environments.md)
- [Install the Azure Developer CLI](./install-azd.md).
- [Walk through the `azd` quickstart](./get-started.md) to see Azure Developer CLI in action.

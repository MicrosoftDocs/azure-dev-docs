---
title: What is the Azure Developer CLI (preview)?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/21/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, devx-track-azurecli
---

# What is the Azure Developer CLI (preview)?

Azure Developer CLI (`azd`) is an open-source tool that accelerates the time it takes for you to get started on Azure. The CLI provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or DevOps.

You can use `azd` with [extensible azd templates](./more-azd-info.md#azure-developer-cli-templates) that include everything you need to get an application up and running in Azure. These templates include reusable infrastructure as code assets and application code that can be ripped out and replaced with your own app code.

## Typical `azd` workflow

Once you've [installed Azure Developer CLI](./install-azd.md), you can get your app onto Azure in just a few steps.

1. Select an [Azure Developer CLI template](./azd-templates.md#choose-a-template).
2. Get the code and initialize the project by [running `azd init`](./get-started.md)
3. Deploy the template by [running `azd up`](./get-started.md).
4. Customize the app to meet your needs.

From there, you can pull out or modify the application code to leverage the infrastructure as code assets (IaC) provided in the template and customize the app to fit your needs.

## Even faster `azd` workflow

Get up and running on Azure by using `azd` and GitHub Codespaces together!
> [!VIDEO https://www.youtube.com/watch?v=_MNndbEPvYQ]

## Next steps
- [Learn more about Azure Deloper CLI](./more-azd-info.md)
- Get started by [installing Azure Developer CLI](./install-azd.md).
- [Walk through our quickstart](./get-started.md) to see Azure Developer CLI in action.

---
title: Generate Bicep from the azd compose feature
description: Learn how to generate Bicep files from the azd compose feature to further customize your infrastructure
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/21/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Generate Bicep using the compose feature

The Azure Developer CLI (`azd`) compose feature simplifies the process of building, deploying, and managing cloud applications. By using `azd compose`, you can define and manage the infrastructure and application code for your project in a unified way. This guide explains how to generate Bicep code from the `azd compose` feature, enabling you to customize your cloud infrastructure to meet your specific requirements.

## How `azd compose` manages infrastructure state

The `azd compose` feature tracks your infrastructure state in-memory during the composition process. This approach allows you to iteratively define and refine your application and infrastructure without immediately generating files or modifying your project directory.

When you run the `azd infra synth` command, the in-memory state is converted into Bicep files in the `infra` folder. At this point, the infrastructure state transitions from being managed in-memory to being represented as code, allowing for further customization.

> [!TIP]
> Use `azd compose` to quickly prototype your infrastructure before committing to file-based changes with `azd infra synth`.

## Generate the Bicep code

To explore or customize the Bicep code used internally by `azd` to provision resources created by `azd add`, run the following command:

```bash
azd infra gen
```

> [!NOTE]
> The `azd infra synth` command from earlier versions of `azd` is now an alias of azd `infra generate`, and will continue to work. However, a warning message will be displayed and the command might be removed in a future `azd` release.

This command generates the corresponding Bicep files in the `infra` folder of your app.

## Managing updates with Bicep generation

When you run the `azd infra gen` command, you exit the `azd compose` workflow and the simplified init process. From this point on, any changes you make to the generated Bicep files are no longer tracked by `azd compose`. If you modify the Bicep files and later run `azd infra gen` again, your manual changes will be overwritten by the newly generated code.

Here's how a typical workflow might look:

1. You use `azd add` to add new Azure resources to your project. These resources are managed internally by `azd`.
2. Once you've finished adding resources, you run `azd infra gen` to generate Bicep files for those resources in the project's `infra` folder. At this stage, the resources are no longer managed by the `azd compose` workflow.
3. You can now manually update the Bicep files as you continue developing your app.
4. If you add more resources or run `azd infra gen` again, the contents of the `infra` folder will be regenerated, and any manual changes will be lost.

For this reason, the compose feature is best suited for the following scenarios:

- Creating an initial set of Azure resources for your project, then managing further updates yourself by editing the Bicep files.
- Managing your Azure resources entirely through the compose feature without running `azd infra gen`.

## Next steps

> [!div class="nextstepaction"]
> [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible)

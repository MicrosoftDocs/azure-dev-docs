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

> [!NOTE]
> The `azd infra synth` feature is currently in alpha status and must be enabled before use:
> ```bash
> azd config set alpha.infraSynth on
> ```

### How `azd compose` manages infrastructure state

The `azd compose` feature tracks your infrastructure state in-memory during the composition process. This approach allows you to iteratively define and refine your application and infrastructure without immediately generating files or modifying your project directory.

When you run the `azd infra synth` command, the in-memory state is converted into Bicep files in the `infra` folder. At this point, the infrastructure state transitions from being managed in-memory to being represented as code, allowing for further customization.

> [!TIP]
> Use `azd compose` to quickly prototype your infrastructure before committing to file-based changes with `azd infra synth`.

### Generate the Bicep code

To explore or customize the Bicep code used internally by `azd` to provision resources created by `azd add`, run the following command:

```bash
azd infra synth
```

This command generates the corresponding Bicep files in the `infra` folder of your app.

> [!NOTE]
> Running the `azd infra synth` command exits you from the `azd compose` feature and the simplified initialization process. Any changes you make to the generated Bicep files are not tracked by `azd compose`. For example, if you edit the Bicep code and then run `azd infra synth` again, `azd` overwrites your changes with the regenerated code.

## Next steps

> [!div class="nextstepaction"]
> [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible)

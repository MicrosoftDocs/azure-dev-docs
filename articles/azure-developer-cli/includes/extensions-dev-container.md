---
author: alexwolfmsft
ms.service: azure-dev-cli
ms.topic: include
ms.date: 03/23/2026
ms.author: alexwolf
---

The `azd` Dev Container Feature supports an `extensions` option to automatically install a comma-separated list of `azd` extensions during the container build. Extensions installed this way are available as soon as the container starts, reducing manual setup and enabling `azd` commands to run with the required extensions already installed.

To auto-install extensions, add the `extensions` option to the `azd` feature entry in your `devcontainer.json` file:

```json
{
    "name": "Azure Developer CLI",
    "image": "mcr.microsoft.com/devcontainers/python:3.10-bullseye",
    "features": {
        "ghcr.io/azure/azure-dev/azd:latest": {
            "extensions": "my-ext-1,my-ext-2"
        }
    }
}
```

The `extensions` value is a comma-separated list of `azd` extension names. Installation occurs during the container build, so the extensions are ready to use as soon as the container starts. After changing the extensions list, use the **Rebuild and Reopen in Dev Container** command in Visual Studio Code to rebuild the container with the updated extensions.

Learn more about the [azd Dev Container Feature](https://github.com/Azure/azure-dev/tree/main/cli/azd/resources).

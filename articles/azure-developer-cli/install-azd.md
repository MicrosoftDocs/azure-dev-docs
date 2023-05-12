---
title: Install the Azure Developer CLI (preview)
description: Install the Azure Developer CLI (azd) with all the pre-requisites for your local environment.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/19/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Install or update the Azure Developer CLI (preview)

Welcome to the Azure Developer CLI (`azd`)! Let's get started with installing and learning how to run `azd`.

Start by selecting your development environment. For more information about the pros and cons of the different development environment choices, see [Azure Developer CLI (azd) supported environments](overview.md#supported-development-environments).

When you install `azd`, the following tools are installed within `azd` scope (meaning they are not installed globally) and are removed if azd is uninstalled:

- The [Git CLI](https://cli.github.com/)
- The [Bicep CLI](/azure/azure-resource-manager/bicep/install)

## [Local install](#tab/localinstall)

[!INCLUDE [azd-install-local](includes/azd-install-local.md)]

## [DevContainer](#tab/devcontainer)

[!INCLUDE [azd-install-dev-container](includes/azd-install-dev-container.md)]

---

## Updating the Azure Developer CLI

When working with an out of date version of `azd`, you will see a warning to upgrade to the latest version. Follow the instructions in the warning to update to the latest version.

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Choose an azd template](./azd-templates.md)

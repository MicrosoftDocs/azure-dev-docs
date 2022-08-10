---
title: Azure Developer CLI vs. Azure CLI (preview)
description: Learn more about the difference between Azure Developer CLI and the Azure CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/10/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Azure Developer CLI vs. Azure CLI (preview)

Az CLI took a long time to download and install. We made a strategic decision to convert to a standalone CLI written in Go. Go is more portable. Although we have a dependency on Az CLI today (as in we are calling Az CLI under the hood), we will eventually remove the dependency. That means developers can use azd without Az CLI and we will not depend on Az CLI at all.

The new Azure Developer CLI builds upon the experience and foundations of the Azure CLI. You can use both tools together, as needed, to support your Azure workflow.


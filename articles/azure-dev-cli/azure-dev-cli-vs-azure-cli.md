---
title: Azure Developer CLI (azd) vs Azure CLI
description: Learn the differences between Azure Developer CLI and Azure CLI.
author: puicchan
ms.author: puichan
ms.date: 06/08/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI vs Azure CLI

In this article, you learn the difference between the developer-centric Azure Developer CLI and the command-line DevOps tool, Azure CLI.

## Azure Developer CLI

Azure Developer CLI (azd) is a standalone CLI and complements [Azure CLI](/cli/azure/what-is-azure-cli). It is neither a replacement nor a part of Azure CLI. The azd focuses on the developer workflow. Apart from provisioning/managing Azure resources, the CLI helps to stitch together cloud components, local development configuration and pipeline automation into a complete solution.

The azd uses infrastructure as code (IaC) strategies to achieve deterministic creation of Azure resources and code deployments. This pattern makes things repeatable and easy to plug into your CI/CD pipeline. For example, instead of having to learn how to create a database and a web application, and configure the connection in code, the developer can use `azd provision`.

## Azure CLI

Azure CLI provides a broad set of capability. The focus is on Azure management and control plan functionality. To connect to Azure and execute administrative commands on Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. 

## Which is right for you?

Both azd and Azure CLI are powerful cross-platform command-line tools. The right tool depends on your use-case and team.

For example, Azure CLI doesn't manage the configuration of GitHub Action. For azd, you can run `azd pipeline config` to create a GitHub Action workflow and kick off the workflow every time you check code in to GitHub.

However, if all you need is a CLI for executing administrative commands on Azure resources, Azure CLI is the tool for you.

## Next steps

> [!div class="nextstepaction"] 
> [Azure Developer CLI (azd) supported environments and Azure services](development-environment-options.md)

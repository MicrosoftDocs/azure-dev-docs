---
title: Azure Developer CLI vs Azure CLI
description: Comparison of Azure Developer CLI and Azure CLI.
author: puicchan
ms.author: puichan
ms.date: 06/08/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI vs Azure CLI

## Azure Developer CLI
Azure Developer CLI (azd) is a standalone CLI and complements [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli). It is neither a replacement nor a part of Azure CLI. `azd` focuses on the developer workflow. Apart from provisioning/managing Azure resources, the CLI helps to stitch cloud components, local development configuration and pipeline automation together into a complete solution. 

`azd` uses  infrastructure as code (IaC) strategies to achieve predictable, repeatable, creation of Azure resources and code deployments. This consistency and the patterns make things repeatable and easy to plug into CI/CD. For example, instead of having to learn how to create a database and a web application, and configure the connection in code, the developer can use `azd provision`. 

## Azure CLI 
Azure CLI provides a broad set of capability. The focus is on Azure management and control plan functionality. To connect to Azure and execute administrative commands on Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. 

## Which is right for you?

Both `azd` and Azure CLI are powerfull cross-platform command-line tools. The right tool is dependent on your use case and team. 

Azure CLI doesn't take care of, for example, configuration of GitHub Action. For `azd`, you can run `azd pipeline config` to create a GitHub Action workflow and kick off the workflow every time you check in code in GitHub. 

However, if all you need is a CLI for executing administrative commands on Azure resources, Azure CLI is the tool for you.

## See also

- For a full list of supported commands, see the [Azure Developer CLI Reference](https://aka.ms/azure-dev/ref).


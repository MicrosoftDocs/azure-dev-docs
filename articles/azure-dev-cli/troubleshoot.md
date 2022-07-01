---
title: Troubleshoot common problems when using Azure Developer CLI (azd)
description: In this article, troubleshoot common problems when using Azure Developer CLI (azd)
author: puicchan
ms.author: puichan
keywords: azd, known issues, troubleshooting, azure developer cli
ms.topic: troubleshooting
ms.date: 06/07/2022
ms.custom: devx-track-azdevcli
ms.prod: azure
# Customer intent: Find solutions to common problems encountered when using Azure Developer CLI (azd)
---

# Troubleshoot common problems when using Azure Developer CLI (azd)

This article lists common problems and possible solutions when using Azure Developer CLI (azd).

## Get help and give feedback

If you're unable to find what you're looking for in this article or want to provide feedback, you can post questions to the [Azure Developer CLI Discussions](https://github.com/Azure/azure-dev/discussions).

You can also report bugs by opening GitHub Issues in [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev).

## .azure folder

The azd assumes that folders under .azure folder's dev CLI environments. Don't run azd commands from the home directory of a user that has Azure CLI installed.

## Environment naming restriction

Environment name is used as a prefix to the name of each Azure resource created for this project. Azure resources have [naming rules and restrictions](/azure/azure-resource-manager/management/resource-name-rules), make sure you use a name that is less than 15-character long and unique.

## Not logged in to Azure or token expired in Visual Studio

"To access
remote: this repository, you must re-authorize the OAuth Application `Visual Studio`." error after running `azd init -t <template-name>` in Visual Studio.

### Troubleshooting step

Run `azd login` to refresh access token.

## `az bicep CLI` requirement

`azd up` and `azd provision` require the latest release of az bicep CLI. Run `az bicep upgrade` if you see this error message: "Error: failed to compile bicep template: failed running Az PowerShell module bicep build: exit code: 1, stdout: , stderr: WARNING: A new Bicep release is available: v0.4.1272."

### Troubleshooting step

Upgrade Bicep by running `az bicep upgrade`.

## `azd up` or `az provision` fails

Sometimes, things go awry with `azd up` or `azd provision`. Common errors include: can't provision certain resources in an Azure region because the region is out of capacity; or relevant resource provider isn't present in that region. Troubleshooting steps differ depending on root cause.

### Troubleshooting steps

1. Go to the [Azure portal](https://portal.azure.com) 
1. Locate your resource group, which is `<your-environment-name>rg`.
1. Select **Deployments** to get more information.

> [!NOTE]
> Additional resource: [Troubleshoot common Azure deployment errors - Azure Resource Manager](/azure/azure-resource-manager/troubleshooting/common-deployment-errors)

## `azd pipeline` failure

`azd pipeline` fails to deploy your latest change.

### Troubleshooting steps

1. Verify that you've specified a environment name that is the same as your environment name. 
1. Go to `https://github.com/<your repo>/actions` and refer to the log file in the pipeline run to get more information.

## Text-based browser support

Text-based browser is currently not supported by `azd monitor`.

## Live metrics support for Python

Live Metrics (`azd monitor --live`) is currently not supported for Python app. For more information, see [this article](/azure/azure-monitor/app/live-stream#get-started).
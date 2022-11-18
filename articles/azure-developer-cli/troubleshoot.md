---
title: Troubleshoot Azure Developer CLI (preview)
description: In this article, troubleshoot common problems that might occur when you're using Azure Developer CLI.
author: hhunter-ms
ms.author: hannahhunter
keywords: azd, known issues, troubleshooting, azure developer cli
ms.topic: troubleshooting
ms.date: 10/31/2022
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli
# Customer intent: As a developer, I'm looking for solutions to common problems that occur when I'm using Azure Developer CLI.
---

# Troubleshoot Azure Developer CLI (preview)

This article provides solutions to common problems that might arise when you're using Azure Developer CLI (azd) Preview.

## Get help and give feedback

If you're unable to find what you're looking for in this article or you want to provide feedback, you can post questions to [Azure Developer CLI Discussions](https://github.com/Azure/azure-dev/discussions).

You can also report bugs by opening GitHub Issues in the [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev).

## The `.azure` directory

Azure Developer CLI assumes that any directories that are stored in the `.azure` directory are Azure Developer CLI environments. Don't run Azure Developer CLI commands from the home directory of a user that has the Azure CLI installed.

## Not logged in to Azure or token expired in Visual Studio

After you've run `azd init -t <template-name>` in Visual Studio, you get the following error: "To access remote: this repository, you must reauthorize the OAuth Application `Visual Studio`."

### Solution

Run `azd login` to refresh the access token.

## Azure Bicep CLI requirement

`azd up` and `azd provision` require the latest release of Azure Bicep CLI. You might get the following error message: "Error: failed to compile bicep template: failed running Az PowerShell module bicep build: exit code: 1, stdout: , stderr: WARNING: A new Bicep release is available: v0.4.1272."

### Solution

Upgrade Bicep CLI by running `az bicep upgrade`.

## `azd up` or `az provision` fails

Things can sometimes go awry with `azd up` or `azd provision`. Common errors include:
* "Can't provision certain resources in an Azure region because the region is out of capacity."
* "Relevant resource provider isn't present in that region."

The troubleshooting steps might differ, depending on the root cause.

### Solution

1. Go to the [Azure portal](https://portal.azure.com).

1. Locate your resource group, which is rg-\<your-environment-name>.

1. Select **Deployments** to get more information.

1. Verify that you've specified an environment name that's the same as your environment name.

1. Go to `https://github.com/<your repo>/actions`, and then refer to the log file in the pipeline run for more information.

For other resources, see [Troubleshoot common Azure deployment errors - Azure Resource Manager](/azure/azure-resource-manager/troubleshooting/common-deployment-errors).

## `azd init` requires `sudo`

Before `azd version = azure-dev-cli_0.2.0-beta.1`, `azd` would create an `.azd` folder with `drw-r--r--` access.

This will cause an issue, as using this or any prior version on any Linux set-up (WSL, ssh-remote, devcontainer, etc.) already provides an `.azd` folder with read-only mode.

### Solution

1. Manually delete the already provided `.azd` folder:

   ```bash
   rm -r ~/.azd
   ```

1. Run `azd init` for `azd` to create the folder again with the right access levels.

## `azd monitor` for development container

`azd monitor` is currently not supported if you use a development container as your development environment.

## Text-based browser support

Text-based browsers are currently not supported by `azd monitor`.

## `azd pipeline config` using AzDo for Java templates on Windows

You may encounter a failure when running `azd pipeline config` with AzDo for Java templates on Windows. For example, you've:

1. Run the following on Windows:

   ```azdeveloper
   azd init --template Azure-Samples/todo-java-mongo
   azd pipeline config
   ```

1. Received the following error:

   :::image type="content" source="media/troubleshoot/error-pipeline.png" alt-text="Screenshot showing the error received when running azd pipeline config with AzDo for Java on Windows.":::


### Solution

This is a known issue. While we address this issue, try the following command:

```bash
git update-index --chmod=+x src/api/mvnw && git commit -m "Fix executable bit permissions" && git push
```

## `azd pipeline config` support

`azd pipeline config` is currently not supported in [DevContainers/VS Code Remote Containers](https://code.visualstudio.com/docs/devcontainers/containers).

## Live metrics support for Python

Live Metrics (`azd monitor --live`) is currently not supported for Python apps. For more information, see [Live Metrics: Monitor and diagnose with 1-second latency](/azure/azure-monitor/app/live-stream#get-started).

---
title: Troubleshoot Azure Developer CLI
description: In this article, troubleshoot common problems that might occur when you're using Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
keywords: azd, known issues, troubleshooting, azure developer cli
ms.topic: troubleshooting
ms.date: 01/03/2023
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli, devx-track-bicep, build-2023, devx-track-extended-java, devx-track-python
# Customer intent: As a developer, I'm looking for solutions to common problems that occur when I'm using Azure Developer CLI.
---

# Troubleshoot Azure Developer CLI

This article provides solutions to common problems that might arise when you're using Azure Developer CLI (azd).

## Get help and give feedback

If you're unable to find what you're looking for in this article or you want to provide feedback, you can post questions to [Azure Developer CLI Discussions](https://github.com/Azure/azure-dev/discussions).

You can also report bugs by opening GitHub Issues in the [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev).

## Using the `--debug` switch

If you an encounter an unexpected issue while working with `azd`, rerun the command with the `--debug` switch to enable additional debugging and diagnostic output. 

```bash
azd up --debug
```

You can also send the debugging output to a local text file for improved usability. This approach allows the debugging info to be ingested by other monitoring systems and can also be useful when filing an issue on GitHub.

> [!IMPORTANT]
> Make sure to redact any sensitive information when submitting debug logs on GitHub or saving them to other diagnostics systems.

```bash
azd deploy --debug > "<your-file-path>.txt"
```

## The `.azure` directory

Azure Developer CLI assumes that any directories that are stored in the `.azure` directory are Azure Developer CLI environments. Don't run Azure Developer CLI commands from the home directory of a user that has the Azure CLI installed.

## Not logged in to Azure or token expired in Visual Studio

After you've run `azd init -t <template-name>` in Visual Studio, you get the following error: "To access remote: this repository, you must reauthorize the OAuth Application `Visual Studio`."

### Solution

Run `azd auth login` to refresh the access token.

## Updated Azure account permissions do not refresh in `azd`

 By default, `azd` caches your Azure credentials and permissions. If your Azure account is assigned new roles and permissions, or is added to additional subscriptions, these changes may not be immediately reflected in `azd`.To solve this issue, log out and then log back in to `azd` using the following commands:

```bash
azd auth logout

azd auth login
```

Follow the prompts from the `azd auth login` command to complete the sign-in process and update your cached credentials.

## Cannot connect to the Docker daemon in Cloud Shell

Cloud Shell uses a container to host your shell environment, so tasks that require running the Docker daemon aren't allowed.

### Solution

Use another host to perform tasks that require the docker daemon. One option is to use docker-machine, as described in the [Cloud Shell troubleshooting](/azure/cloud-shell/troubleshooting#you-cant-run-the-docker-daemon) documentation.

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

## Unable to authenticate in Codespaces environments

If you are experiencing authentication issues in Codespaces, make sure the template Dockerfile includes the `sudo apt-get update && sudo apt-get install xdg-utils` commands. The `xdg-utils` command will open a browser tab that allows you to sign-in. You can see an example of this DockerFile configuration in the [sample Azure Developer CLI templates](https://github.com/Azure-Samples/todo-python-mongo/blob/main/.devcontainer/Dockerfile).

## Static Web Apps fail to deploy despite success message

A known issue exists when deploying to Azure Static Web Apps in which the default `azd up` output may state the action was successful, but the changes were not actually deployed. You can diagnose this problem by running the `azd up` command with the `--debug` flag enabled. In the output logs you may see the following message:

```bash
Preparing deployment. Please wait...
An unknown exception has occurred
```

You are most likely to encounter this issue when `azd` is run from a GitHub action. As a workaround, after you build your site, copy `staticwebapp.config.json` into the build folder. You can automate this step this by using a prepackage or predeploy [command hook](/azure/developer/azure-developer-cli/azd-extensibility), which allows you to execute custom scripts at various points in the azd command workflows.

The product team is working to resolve this issue.

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

## `azd pipeline config` failure due to Conditional Access Policy

When running `azd pipeline config`, you may receive an error like the following:

```azdeveloper
ERROR: failed to create or update service principal: failed retrieving application list, failed executing request: http call(https://login.microsoftonline.com/common/oauth2/v2.0/token)(POST) error: reply status code was 400:
{"error":"invalid_grant","error_description":"AADSTS50005: User tried to log in to a device from a platform (Unknown) that's currently not supported through Conditional Access policy. Supported device platforms are: iOS, Android, Mac, and Windows flavors.\r\nTrace ID: be3438c1-42fc-4c37-96d8-0e723ac54f01\r\nCorrelation ID: f535565f-9f3c-4014-ad65-403f514bf892\r\nTimestamp: 2022-12-16 21:10:37Z","error_codes":[50005],"timestamp":"2022-12-16 21:10:37Z","trace_id":"be3438c1-42fc-4c37-96d8-0e723ac54f01","correlation_id":"f535565f-9f3c-4014-ad65-403f514bf892"}
```

This error is related to your Azure Active Directory's tenant enablement of Conditional Access Policies. The specific policy requires that you are signed in into a supported device platform. 

You may also be receiving this error due to being logged in using the device code mechanism, which prevents Azure Active Directory from detecting your device platform correctly.

### Solution
To configure the workflow, you need to give GitHub permission to deploy to Azure on your behalf. Authorize GitHub by creating an Azure Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. Select your Codespace host for steps:

## [Browser](#tab/Browser)

1. Make sure you're running on a device listed as supported, per the error message.
2. Rerun `azd auth login` with the flag `--use-device-code=false` appended:

   ```azdeveloper
   azd auth login --use-device-code=false
   ```
3. You may receive an error with message `localhost refused to connect` after logging in. If so:
   1. Copy the URL.
   2. Run `curl '<pasted url>'` (URL in quotes) in a new Codespaces terminal.

   In the original terminal, the login should now succeed.
4. After logging in, rerun `azd pipeline config`.

## [VS Code](#tab/VSCode)

1. Make sure you're running on a device listed as supported, per the error message.
2. Rerun `azd auth login` with the flag `--use-device-code=false` appended:

   ```azdeveloper
   azd auth login --use-device-code=false
   ```
3. After logging in, rerun `azd pipeline config`.

## `azd pipeline config` support

`azd pipeline config` is currently not supported in [DevContainers/VS Code Remote Containers](https://code.visualstudio.com/docs/devcontainers/containers).

## Live metrics support for Python

Live Metrics (`azd monitor --live`) is currently not supported for Python apps. For more information, see [Live Metrics: Monitor and diagnose with 1-second latency](/azure/azure-monitor/app/live-stream#get-started).

## Create a GitHub issue to request help

:::image type="content" source="media/troubleshoot/github-logo.png" alt-text="An image of the GitHub logo.":::

The Azure Developer CLI and the [Azure Developer CLI Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev) use [GitHub Issues](https://github.com/Azure/azure-dev/issues/new/choose) to track bugs and feature requests. Please search the [existing issues](https://github.com/Azure/azure-dev/issues) before filing new issues to avoid duplicates.

For help and questions about using this project, please look at our [wiki](https://github.com/Azure/azure-dev/wiki) for using Azure Developer CLI and our [CONTRIBUTING doc](https://github.com/Azure/azure-dev/blob/main/cli/azd/CONTRIBUTING.md) if you want to contribute.

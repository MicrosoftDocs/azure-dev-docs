---
title: Get started with Azure Developer CLI 
description: Learn how to get started with Azure Developer CLI
keywords: 
author: puicchan
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with Azure Developer CLI

To run any sample template, the first thing you need to do is decide is where you want your development environment to be hosted.  

We recommend using a [developer container (DevContainer)](https://code.visualstudio.com/docs/remote/containers), which has the least number of prerequisites you need to install on your machine. 

A DevContainer is a Docker image that includes all of the prerequisites you need to run this application on your local machine. For more information including the pros and cons, see the next section. 

> [!NOTE]
> The README in any of the [sample templates](azure-dev-cli-templates.md) is a good start.

If DevContainer isn't right for you, you have other development environment options.

## Development environment choices

Pros and cons for development environment choices:

|Environment|Description|Pros|Cons|Supported?|
|---|---|---|---|---|
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|Container with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.|Linux containers only, but can run on Windows host. You need to clone the repository. The container initialization can take a long time.| Yes |
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[Windows Subsystem for Linux 2](https://https://docs.microsoft.com/en-us/windows/wsl/about)** | WSL 2 is a new version of the Windows Subsystem for Linux architecture that powers the Windows Subsystem for Linux to run ELF64 Linux binaries on Windows. | You run a GNU/Linux environment directly on Windows, unmodified, without the overhead of a traditional virtual machine or dualboot setup | You have to manually install all dependencies. | Yes |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |Container with all dependencies installed and run on GitHub.com in the browser.|All dependencies installed and you don't need to clone the code locally.|Linux containers only. Some features and functionality may not be supported. The container initialization can take a long time.| No (coming soon) |

## Get started with your development enviroment of choice

Once you've decided which development environment is right for you, we'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/azure-samples/todo-nodejs-mongo).

### [Bare metal](#tab/bare-metal)

[!INCLUDE [azd-baremetal](includes/azd-baremetal.md)]

### [DevContainer](#tab/devcontainer)

[!INCLUDE [azd-devcontainer](includes/azd-devcontainer.md)]

## Run Up Command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities. Because the command will create all of the resources on Azure, it can take some time. 

The `azd up` command will:

1. Provision the Azure resources, policies, and roles required
1. Deploy the code from your local machine to the previously provisioned Azure resources

```bash
azd up
```

> NOTE: This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code). You will see a progress indicator as it provisions and deploys your application.

This command will print the following URLs:

- Azure portal link to view resources created
- ToDo web application frontend
- ToDo API application

!["azd Up output"](assets/azdevupurls.png)

Select the web application URL to launch the ToDo app. Create a new collection and add some items. The command will create monitoring activity in the application that you'll be able to see later when you `monitor` the application.

> Known issue: clicking the provisioning link will not redirect to the correct page in **Visual Studio Code integrated terminal**. A fix is being released for this [VS Code known issue](https://github.com/microsoft/vscode/issues/144898#issuecomment-1079496948). For the meantime, please copy and paste the link in browser.

> :warning: **Cleanup**
>
> Please be aware that Azure resources, e.g. a Cosmos DB, have been created. You can clean up these resources by deleting the resource group that was create, or issuing the `azd infra delete` command.

## Next Steps

At this point, you have a complete application deployed on Azure. But there's much more that the Azure Developer CLI can do. These next steps will introduce you to more commands that will make creating applications on Azure much easier. Using the Azure Developer CLI, you can set up your DevOps pipelines, monitor your application, test and debug locally.

### Set up DevOps pipeline using `azd pipeline`

This template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```
azd pipeline config
```

### Monitor the application using `azd monitor`

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

- Run the following command to open the "Overview" dashboard:

  ```bash
  azd monitor --overview
  ```

- Live Metrics Dashboard

  Run the following command to open the "Live Metrics" dashboard:

  ```bash
  azd monitor --live
  ```

- Logs Dashboard

  Run the following command to open the "Logs" dashboard:

  ```bash
  azd monitor --logs
  ```

## Run and Debug Locally

The easiest way to run and debug is to leverage the Azure Developer CLI Visual Studio Code Extension. For more information, see this [walkthrough](how-to-use-vscode-extension-to-debug-locally.md).  

## Clean up resources
When you are done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd infra delete
```

## Additional azd commands

For a complete list of available commands, see the [azd overview](azure-dev-cli-ref.md).

## Troubleshooting/Known issues

For known issues, refer to [Troubleshooting/known issues](azure-dev-cli-known-issues.md) 

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).

## Explore more samples

To learn more about how to use the Azure Developer CLI with an Azure Developer CLI enabled repository, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).

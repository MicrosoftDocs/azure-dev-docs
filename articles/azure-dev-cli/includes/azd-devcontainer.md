### Prerequisites

#### Azure Developer CLI

You'll need `npm` to install the Azure Developer CLI. For detailed steps, see [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/).

```bash
npm uninstall -g @azure/az-dev-cli
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

> [!NOTE]
> * To verify `nvm` installation, enter: `command -v nvm`. This should return 'nvm'. If not, close your current terminal, reopen and try again.

#### Azure Developer CLI VS Code Extension

The Azure Developer CLI experience includes an Azure Developer CLI VS Code Extension that mirrors all of the CLI commands into context menu and command palette options. If you're a VS Code user, then we highly recommend installing this extension for the best experience.

1. Download the extension from https://aka.ms/azure-dev/vsix
1. In VS Code
    - Open "Extensions" (Ctrl+Shift+X)
    - Select the ... menu at top of Extensions sidebar
    - Select "Install from VSIX"
    - Select location of downloaded file

### DevContainer

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer [here](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

To use the DevContainer, you'll need the following installed on your local machine:

1. [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon...)
1. [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Azure Subscription

This template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

### Initialize Project

```bash
azd init --template todo-nodejs-mongo
```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`


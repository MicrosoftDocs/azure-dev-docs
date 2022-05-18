### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI (see install instructions below)

```bash
npm uninstall -g @azure/az-dev-cli
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```
> [!NOTE]
> * May require `sudo` depending on platform and configuration
> * Make sure you install language specification prerequisite. To get a full list of prerequisites, refer to the Dockerfile in the sample template. For this walkthrough: [Dockerfile](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

### Project Folder

You'll need an empty folder on your computer to house the project files that will be copied from this repository.

1. Open your favorite terminal and create a new folder.

```bash
mkdir {your-unique-project-folder-name}
```

2. Now, set your current directory to that newly created folder.

```bash
cd {your-unique-project-folder-name}
```

### Azure Subscription

This template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

### Initialize Project

```bash
azd init --template todo-nodejs-mongo
```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.S
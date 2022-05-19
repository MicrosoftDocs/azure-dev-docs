### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI (see install instructions below)

```bash
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

### Run `azd up` command

The fastest way for you to get this application up and running on Azure is to use the azd up command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities.

Open a terminal, create a new empty folder, and change into it.
Run the following command to initialize the project, provision Azure resources, and deploy the application code.

```bash
azd up --template todo-nodejs-mongo
```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

You will see a progress indicator as it provisions and deploys your application.

> [!NOTE] 
> * This may take a while to complete as it performs three steps: `azd init` (initialize the project), `azd provision` (creates Azure services) and `azd deploy` (deploys code). 